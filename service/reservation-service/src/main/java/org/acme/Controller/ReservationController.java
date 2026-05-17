package org.acme.Controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.acme.Entity.Reservation;
import org.acme.Service.ReservationService;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Path("/api/reservations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReservationController {

    @Inject
    ReservationService reservationService;

    @GET
    public List<Reservation> list() {
        return reservationService.findAllSorted();
    }

    @GET
    @Path("/{id}")
    public Reservation getById(@PathParam("id") Long id) {
        return reservationService.findById(id);
    }

    @POST
    public Reservation create(Reservation reservation) {
        return reservationService.create(reservation);
    }

    @PUT
    @Path("/{id}")
    public Reservation update(@PathParam("id") Long id, Reservation reservation) {
        return reservationService.update(id, reservation);
    }

    /**
     * Filter reservations by status.
     * Supports single status: ?status=pending
     * Supports multiple statuses: ?status=pending,confirmed
     */
    @GET
    @Path("/filter")
    public List<Reservation> filterByStatus(@QueryParam("status") String status) {
        if (status == null || status.isEmpty()) {
            return reservationService.findAllSorted();
        }
        if (status.contains(",")) {
            List<String> statuses = Arrays.stream(status.split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
            return reservationService.filterByStatuses(statuses);
        }
        return reservationService.filterByStatus(status);
    }

    /**
     * Lookup reservations by phone number (customer self-service, no auth needed)
     */
    @GET
    @Path("/lookup")
    public List<Reservation> lookupByPhone(@QueryParam("phone") String phone) {
        if (phone == null || phone.isEmpty()) {
            throw new BadRequestException("Phone number is required");
        }
        return reservationService.lookupByPhone(phone);
    }

    /**
     * Update reservation verified by phone number (customer self-service)
     */
    @PUT
    @Path("/{id}/update-by-phone")
    public Reservation updateByPhone(
            @PathParam("id") Long id,
            @QueryParam("phone") String phone,
            Reservation update) {
        return reservationService.updateByPhone(id, phone, update);
    }
}
