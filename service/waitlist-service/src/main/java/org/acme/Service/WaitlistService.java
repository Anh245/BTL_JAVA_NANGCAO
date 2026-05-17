package org.acme.Service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.acme.Entity.Waitlist;
import org.acme.Repository.WaitlistRepository;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class WaitlistService {

    @Inject
    WaitlistRepository waitlistRepository;

    public List<Waitlist> findAllSorted() {
        return waitlistRepository.listAllSorted();
    }

    public Waitlist findById(Long id) {
        return waitlistRepository.findById(id);
    }

    @Transactional
    public Waitlist create(Waitlist waitlist) {
        waitlist.createdDate = LocalDateTime.now();
        if (waitlist.status == null || waitlist.status.isEmpty()) {
            waitlist.status = "waiting";
        }
        waitlistRepository.persist(waitlist);
        return waitlist;
    }

    @Transactional
    public Waitlist update(Long id, Waitlist update) {
        Waitlist entity = waitlistRepository.findById(id);
        if (entity == null) {
            throw new NotFoundException("Waitlist entry not found: " + id);
        }
        if (update.status != null) entity.status = update.status;
        if (update.name != null) entity.name = update.name;
        if (update.email != null) entity.email = update.email;
        if (update.phone != null) entity.phone = update.phone;
        if (update.notes != null) entity.notes = update.notes;
        return entity;
    }
}
