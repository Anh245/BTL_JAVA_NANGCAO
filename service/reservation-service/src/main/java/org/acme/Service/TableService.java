package org.acme.Service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.acme.Entity.RestaurantTable;
import org.acme.Repository.TableRepository;

import java.util.List;

@ApplicationScoped
public class TableService {

    @Inject
    TableRepository tableRepository;

    public List<RestaurantTable> findAll() {
        return tableRepository.listAll();
    }

    public RestaurantTable findById(Long id) {
        return tableRepository.findById(id);
    }

    public List<RestaurantTable> findByZoneAndAvailability(String zone, boolean available) {
        return tableRepository.findByZoneAndAvailability(zone, available);
    }

    public List<RestaurantTable> findByZone(String zone) {
        return tableRepository.findByZone(zone);
    }
}
