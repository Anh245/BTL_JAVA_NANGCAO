package org.acme.Service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.Entity.Guest;
import org.acme.Repository.GuestRepository;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class GuestService {

    @Inject
    GuestRepository guestRepository;

    public List<Guest> findAll() {
        return guestRepository.listAll();
    }

    public Guest findById(Long id) {
        return guestRepository.findById(id);
    }

    public List<Guest> findByPhone(String phone) {
        return guestRepository.findByPhone(phone);
    }

    @Transactional
    public Guest create(Guest guest) {
        guest.createdDate = LocalDateTime.now();
        guestRepository.persist(guest);
        return guest;
    }
}
