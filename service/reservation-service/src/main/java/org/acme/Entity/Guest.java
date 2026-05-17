package org.acme.Entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "guest")
public class Guest extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    public String email;

    public String phone;

    public String notes;

    @Column(name = "created_date")
    public LocalDateTime createdDate;
}
