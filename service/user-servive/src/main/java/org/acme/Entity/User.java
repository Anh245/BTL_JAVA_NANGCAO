package org.acme.Entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "app_user")
public class User extends PanacheEntity {

    @Column(nullable = false, unique = true)
    public String email;

    @Column(name = "full_name", nullable = false)
    public String fullName;

    @Column(nullable = false)
    public String role;

    @Column(name = "password_hash", nullable = false)
    public String passwordHash;

    @Column(name = "created_by")
    public String createdBy;

    @Column(name = "created_on", nullable = false)
    public LocalDate createdOn;

    @Column(name = "updated_on", nullable = false)
    public LocalDate updatedOn;

    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }
}
