package org.acme.Controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.acme.DTO.LoginRequest;
import org.acme.DTO.LoginResponse;
import org.acme.Service.UserService;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {

    @Inject
    UserService userService;

    @POST
    @Path("/login")
    public LoginResponse login(LoginRequest request) {
        return userService.login(request);
    }
}
