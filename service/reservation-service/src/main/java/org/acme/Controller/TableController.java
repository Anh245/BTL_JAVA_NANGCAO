package org.acme.Controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.acme.Entity.RestaurantTable;
import org.acme.Service.TableService;

import java.util.List;

@Path("/api/tables")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TableController {

    @Inject
    TableService tableService;

    @GET
    public List<RestaurantTable> list() {
        return tableService.findAll();
    }

    @GET
    @Path("/{id}")
    public RestaurantTable getById(@PathParam("id") Long id) {
        return tableService.findById(id);
    }

    @GET
    @Path("/filter")
    public List<RestaurantTable> filter(
            @QueryParam("zone") String zone,
            @QueryParam("available") @DefaultValue("true") boolean available) {
        if (zone != null && !zone.isEmpty()) {
            return tableService.findByZoneAndAvailability(zone, available);
        }
        return tableService.findAll();
    }
}
