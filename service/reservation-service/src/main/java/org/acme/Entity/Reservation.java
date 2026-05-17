package org.acme.Entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
public class Reservation extends PanacheEntity {

    @Column(name = "guest_id")
    public Long guestId;

    @Column(name = "table_id")
    public Long tableId;

    @Column(name = "reservation_date")
    public String date;

    @Column(name = "reservation_time")
    public String time;

    @Column(name = "party_size")
    public int partySize;

    public String occasion;

    @Column(name = "special_requests")
    public String specialRequests;

    @Column(nullable = false)
    public String status = "pending";

    @Column(name = "created_date")
    public LocalDateTime createdDate;
}
