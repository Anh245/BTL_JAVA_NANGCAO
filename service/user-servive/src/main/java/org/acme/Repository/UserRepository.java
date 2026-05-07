package org.acme.Repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.Entity.User;

@ApplicationScoped
public class UserRepository  implements PanacheRepository<User> {

}
