package org.acme.Repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.Entity.RestaurantTable;

import java.util.List;

@ApplicationScoped
public class TableRepository implements PanacheRepository<RestaurantTable> {

    public List<RestaurantTable> findByZoneAndAvailability(String zone, boolean available) {
        return list("zone = ?1 and isAvailable = ?2", zone, available);
    }

    public List<RestaurantTable> findByZone(String zone) {
        return list("zone", zone);
    }
}
