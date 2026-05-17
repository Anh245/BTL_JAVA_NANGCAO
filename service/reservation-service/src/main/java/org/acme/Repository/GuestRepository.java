package org.acme.Repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.Entity.Guest;

import java.util.List;

@ApplicationScoped
public class GuestRepository implements PanacheRepository<Guest> {

    public List<Guest> findByPhone(String phone) {
        return list("phone", phone);
    }
}
