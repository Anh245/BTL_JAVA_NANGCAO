package org.acme.Controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.acme.Entity.Guest;
import org.acme.Service.GuestService;

import java.util.List;

@Path("/api/guests")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GuestController {

    @Inject
    GuestService guestService;

    @GET
    public List<Guest> list() {
        return guestService.findAll();
    }

    @GET
    @Path("/{id}")
    public Guest getById(@PathParam("id") Long id) {
        return guestService.findById(id);
    }

    @POST
    public Guest create(Guest guest) {
        return guestService.create(guest);
    }
}
