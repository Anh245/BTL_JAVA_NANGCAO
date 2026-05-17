package org.acme.Repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.Entity.Reservation;

import java.util.List;

@ApplicationScoped
public class ReservationRepository implements PanacheRepository<Reservation> {

    public List<Reservation> listAllSorted() {
        return list("ORDER BY createdDate DESC");
    }

    public List<Reservation> findByStatus(String status) {
        return list("status", status);
    }

    public List<Reservation> findByStatusIn(List<String> statuses) {
        return list("status IN ?1", statuses);
    }

    public List<Reservation> findByGuestId(Long guestId) {
        return list("guestId", guestId);
    }
}
