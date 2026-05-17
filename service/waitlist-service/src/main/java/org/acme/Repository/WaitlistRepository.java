package org.acme.Repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.Entity.Waitlist;

import java.util.List;

@ApplicationScoped
public class WaitlistRepository implements PanacheRepository<Waitlist> {

    public List<Waitlist> listAllSorted() {
        return list("ORDER BY createdDate DESC");
    }
}
