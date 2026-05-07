package org.acme.Service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.PathParam;
import org.acme.Entity.User;
import org.acme.Repository.UserRepository;

import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.listAll();
    }

    public User createUser(User user) {
        user.setCreated_on(LocalDate.now());
        user.setUpdated_on(LocalDate.now());

        userRepository.persist(user);
        return user;

    }

    public User updateUser(@PathParam("id") Long id, User update){
        User entity = userRepository.findById(id);

        entity.setFull_name(update.getFull_name());
        entity.setEmail(update.getEmail());
        entity.setRole(update.getRole());


        return entity;

    }

    public void deleteUser(@PathParam("id") Long id){
        userRepository.deleteById(id);

    }

    public User getUser(@PathParam("id") Long id){
        return userRepository.findById(id);
    }
}
