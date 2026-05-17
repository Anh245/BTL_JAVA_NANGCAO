package org.acme.DTO;

public class LoginResponse {
    public String token;
    public String email;
    public String fullName;
    public String role;

    public LoginResponse() {}

    public LoginResponse(String token, String email, String fullName, String role) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }
}
