package org.acme.Entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "restaurant_table")
public class RestaurantTable extends PanacheEntity {

    public String label;

    @Column(nullable = false)
    public String zone;

    public int capacity;

    @Column(name = "is_available")
    public boolean isAvailable = true;
}
