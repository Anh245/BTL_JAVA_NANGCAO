package org.acme.Service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.BadRequestException;
import org.acme.Entity.Guest;
import org.acme.Entity.Reservation;
import org.acme.Repository.GuestRepository;
import org.acme.Repository.ReservationRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class ReservationService {

    @Inject
    ReservationRepository reservationRepository;

    @Inject
    GuestRepository guestRepository;

    public List<Reservation> findAllSorted() {
        return reservationRepository.listAllSorted();
    }

    public Reservation findById(Long id) {
        return reservationRepository.findById(id);
    }

    public List<Reservation> filterByStatus(String status) {
        return reservationRepository.findByStatus(status);
    }

    public List<Reservation> filterByStatuses(List<String> statuses) {
        return reservationRepository.findByStatusIn(statuses);
    }

    @Transactional
    public Reservation create(Reservation reservation) {
        reservation.createdDate = LocalDateTime.now();
        if (reservation.status == null || reservation.status.isEmpty()) {
            reservation.status = "pending";
        }
        reservationRepository.persist(reservation);
        return reservation;
    }

    @Transactional
    public Reservation update(Long id, Reservation update) {
        Reservation entity = reservationRepository.findById(id);
        if (entity == null) {
            throw new NotFoundException("Reservation not found: " + id);
        }
        if (update.status != null) entity.status = update.status;
        if (update.date != null) entity.date = update.date;
        if (update.time != null) entity.time = update.time;
        if (update.partySize > 0) entity.partySize = update.partySize;
        if (update.occasion != null) entity.occasion = update.occasion;
        if (update.specialRequests != null) entity.specialRequests = update.specialRequests;
        if (update.tableId != null) entity.tableId = update.tableId;
        return entity;
    }

    /**
     * Lookup reservations by phone number (for customer self-service)
     */
    public List<Reservation> lookupByPhone(String phone) {
        List<Guest> guests = guestRepository.findByPhone(phone);
        if (guests.isEmpty()) {
            return new ArrayList<>();
        }
        List<Reservation> result = new ArrayList<>();
        for (Guest guest : guests) {
            result.addAll(reservationRepository.findByGuestId(guest.id));
        }
        // Sort by created date desc
        result.sort((a, b) -> {
            if (a.createdDate == null || b.createdDate == null) return 0;
            return b.createdDate.compareTo(a.createdDate);
        });
        return result;
    }

    /**
     * Update reservation by phone verification (customer self-service)
     */
    @Transactional
    public Reservation updateByPhone(Long id, String phone, Reservation update) {
        Reservation entity = reservationRepository.findById(id);
        if (entity == null) {
            throw new NotFoundException("Reservation not found: " + id);
        }
        // Verify phone matches the guest
        Guest guest = guestRepository.findById(entity.guestId);
        if (guest == null || !phone.equals(guest.phone)) {
            throw new BadRequestException("Phone number does not match reservation");
        }
        // Apply updates
        if (update.status != null) entity.status = update.status;
        if (update.date != null) entity.date = update.date;
        if (update.time != null) entity.time = update.time;
        if (update.partySize > 0) entity.partySize = update.partySize;
        if (update.specialRequests != null) entity.specialRequests = update.specialRequests;
        return entity;
    }
}
