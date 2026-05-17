package org.acme.Controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.acme.Entity.Waitlist;
import org.acme.Service.WaitlistService;

import java.util.List;

@Path("/api/waitlist")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class WaitlistController {

    @Inject
    WaitlistService waitlistService;

    @GET
    public List<Waitlist> list() {
        return waitlistService.findAllSorted();
    }

    @GET
    @Path("/{id}")
    public Waitlist getById(@PathParam("id") Long id) {
        return waitlistService.findById(id);
    }

    @POST
    public Waitlist create(Waitlist waitlist) {
        return waitlistService.create(waitlist);
    }

    @PUT
    @Path("/{id}")
    public Waitlist update(@PathParam("id") Long id, Waitlist waitlist) {
        return waitlistService.update(id, waitlist);
    }
}
