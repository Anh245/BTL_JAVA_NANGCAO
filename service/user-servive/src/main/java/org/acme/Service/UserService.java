package org.acme.Service;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotAuthorizedException;
import org.acme.DTO.LoginRequest;
import org.acme.DTO.LoginResponse;
import org.acme.Entity.User;
import org.acme.Repository.UserRepository;

import java.time.Duration;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.listAll();
    }

    public User getUser(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User createUser(User user) {
        user.createdOn = LocalDate.now();
        user.updatedOn = LocalDate.now();
        // Hash password (simple SHA-256 for demo, should use BCrypt in production)
        if (user.passwordHash != null) {
            user.passwordHash = hashPassword(user.passwordHash);
        }
        userRepository.persist(user);
        return user;
    }

    @Transactional
    public User updateUser(Long id, User update) {
        User entity = userRepository.findById(id);
        if (entity == null) return null;
        entity.fullName = update.fullName;
        entity.email = update.email;
        entity.role = update.role;
        entity.updatedOn = LocalDate.now();
        return entity;
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Authenticate admin and generate JWT token
     */
    public LoginResponse login(LoginRequest request) {
        if (request.email == null || request.password == null) {
            throw new BadRequestException("Email and password are required");
        }

        User user = User.findByEmail(request.email);
        if (user == null) {
            throw new NotAuthorizedException("Invalid credentials", "Bearer");
        }

        // Verify password
        String hashedInput = hashPassword(request.password);
        if (!hashedInput.equals(user.passwordHash)) {
            throw new NotAuthorizedException("Invalid credentials", "Bearer");
        }

        // Generate JWT
        Set<String> roles = new HashSet<>();
        roles.add(user.role);

        String token = Jwt.issuer("aurelian-user-service")
                .upn(user.email)
                .groups(roles)
                .claim("full_name", user.fullName)
                .claim("user_id", user.id)
                .expiresIn(Duration.ofHours(24))
                .sign();

        return new LoginResponse(token, user.email, user.fullName, user.role);
    }

    /**
     * Simple password hashing (SHA-256). In production, use BCrypt.
     */
    private String hashPassword(String password) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash password", e);
        }
    }
}
