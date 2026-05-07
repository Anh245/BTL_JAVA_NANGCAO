package org.acme.Controller;


import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.acme.Entity.User;
import org.acme.Service.UserService;

import java.util.List;

@Path("/User")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {

    @Inject
    private UserService userService;

    @GET
    public List<User> getUsers() {
        return userService.findAll();
    }

    @POST
    public User createUser(User user) {
        return userService.createUser(user);
    }

    @GET
    @Path("/{id}")
    public User getUser(@PathParam("id") Long id){
       return userService.getUser(id);
    }
    @PUT
    @Path("/{id}")
    public User modifyUser(@PathParam("id") Long id, User user) {
        return userService.updateUser(id, user);
    }

    @DELETE
    @Path("/{id}")
    public void deleteUser(@PathParam("id") Long id){
        userService.deleteUser(id);
    }
}
