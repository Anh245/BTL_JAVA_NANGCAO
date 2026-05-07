package org.acme.Entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class User extends PanacheEntity {

   @Column(nullable = false, unique = true)
    private String email;

   @Column(nullable = false)
    private String full_name;

   @Column(nullable = false)
    private String role;

   private String created_by;

   @Column(nullable = false)
   private LocalDate created_on;

   @Column(nullable = false)
   private LocalDate updated_on;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFull_name() {
        return full_name;
    }

    public void setFull_name(String full_name) {
        this.full_name = full_name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCreated_by() {
        return created_by;
    }

    public void setCreated_by(String created_by) {
        this.created_by = created_by;
    }

    public LocalDate getCreated_on() {
        return created_on;
    }

    public void setCreated_on(LocalDate created_on) {
        this.created_on = created_on;
    }

    public LocalDate getUpdated_on() {
        return updated_on;
    }

    public void setUpdated_on(LocalDate updated_on) {
        this.updated_on = updated_on;
    }
}
