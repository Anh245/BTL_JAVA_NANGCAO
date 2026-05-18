package org.acme.Util;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.jboss.logging.Logger;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.net.URL;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Base64;

/**
 * Generates RSA key pair for JWT signing on application startup if they don't exist.
 */
@ApplicationScoped
public class KeyGenerator {

    private static final Logger LOG = Logger.getLogger(KeyGenerator.class);

    @PostConstruct
    void init() {
        generateKeysIfNeeded();
    }

    public void generateKeysIfNeeded() {
        try {
            URL privUrl = Thread.currentThread().getContextClassLoader().getResource("privateKey.pem");
            URL pubUrl = Thread.currentThread().getContextClassLoader().getResource("publicKey.pem");

            // Check if key files are missing OR empty (only contain PEM header/footer without actual key data)
            boolean keysEmpty = false;
            if (privUrl != null) {
                String privContent = new String(privUrl.openStream().readAllBytes());
                // An empty PEM file has < 100 bytes (just header + footer), a real key has > 1000 bytes
                keysEmpty = privContent.trim().replace("-----BEGIN PRIVATE KEY-----", "")
                        .replace("-----END PRIVATE KEY-----", "").trim().isEmpty();
            }

            if (privUrl == null || pubUrl == null || keysEmpty) {
                LOG.info("JWT keys not found or empty on classpath, generating...");

                KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
                kpg.initialize(2048);
                KeyPair kp = kpg.generateKeyPair();

                String privB64 = Base64.getMimeEncoder(64, "\n".getBytes()).encodeToString(kp.getPrivate().getEncoded());
                String pubB64 = Base64.getMimeEncoder(64, "\n".getBytes()).encodeToString(kp.getPublic().getEncoded());

                String privateKeyPem = "-----BEGIN PRIVATE KEY-----\n" + privB64 + "\n-----END PRIVATE KEY-----\n";
                String publicKeyPem = "-----BEGIN PUBLIC KEY-----\n" + pubB64 + "\n-----END PUBLIC KEY-----\n";

                // Try to find the resources directory
                URL resourceUrl = Thread.currentThread().getContextClassLoader().getResource("application.properties");
                if (resourceUrl != null) {
                    File resourceDir = new File(resourceUrl.toURI()).getParentFile();
                    writeFile(new File(resourceDir, "privateKey.pem"), privateKeyPem);
                    writeFile(new File(resourceDir, "publicKey.pem"), publicKeyPem);
                    LOG.info("JWT RSA keys generated at: " + resourceDir.getAbsolutePath());
                }
            } else {
                LOG.info("JWT keys already exist on classpath");
            }
        } catch (Exception e) {
            LOG.error("Failed to generate JWT keys", e);
        }
    }

    private void writeFile(File file, String content) throws Exception {
        try (OutputStream os = new FileOutputStream(file)) {
            os.write(content.getBytes());
        }
    }
}
