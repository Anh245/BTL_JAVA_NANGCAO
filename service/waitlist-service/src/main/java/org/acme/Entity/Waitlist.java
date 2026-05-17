package org.acme.Entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "waitlist")
public class Waitlist extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    public String email;

    public String phone;

    @Column(name = "waitlist_date")
    public String date;

    @Column(name = "waitlist_time")
    public String time;

    @Column(name = "party_size")
    public int partySize;

    public String notes;

    @Column(nullable = false)
    public String status = "waiting";

    @Column(name = "created_date")
    public LocalDateTime createdDate;
}
