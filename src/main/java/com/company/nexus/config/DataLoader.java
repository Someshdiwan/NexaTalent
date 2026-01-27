package com.company.nexus.config;

import com.company.nexus.entity.CapabilitySnapshot;
import com.company.nexus.entity.Engineer;
import com.company.nexus.entity.User;
import com.company.nexus.repository.CapabilitySnapshotRepository;
import com.company.nexus.repository.EngineerRepository;
import com.company.nexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * DataLoader - Seeds initial data into the database on application startup.
 * Only runs if the database is empty.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EngineerRepository engineerRepository;
    private final CapabilitySnapshotRepository snapshotRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting DataLoader...");

        // Only seed if database is empty
        if (userRepository.count() > 0) {
            log.info("Database already contains data. Skipping seeding.");
            return;
        }

        log.info("Database is empty. Seeding initial data...");

        // 1. Create Admin User
        createAdminUser();

        // 2. Create Engineers
        Engineer sarah = createSarahChen();
        Engineer marcus = createMarcusRodriguez();
        Engineer priya = createPriyaSharma();
        Engineer alex = createAlexKim();
        Engineer sonal = createSonalDiwan();

        // 3. Create Capability Snapshots
        createSnapshotForSarah(sarah);
        createSnapshotForMarcus(marcus);
        createSnapshotForPriya(priya);
        createSnapshotForAlex(alex);
        createSnapshotForSonal(sonal);

        log.info("✅ Data seeding completed successfully!");
        log.info("📊 Seeded: 1 admin user, 5 engineers, 5 capability snapshots");
        log.info("🔐 Admin credentials: admin@nexus.com / admin123");
    }

    private void createAdminUser() {
        User admin = User.builder()
                .email("admin@nexus.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin")
                .lastName("User")
                .role(User.Role.ADMIN)
                .bio("System Administrator")
                .company("NexaTalent")
                .position("Admin")
                .experienceYears(10)
                .build();

        userRepository.save(admin);
        log.info("✅ Created admin user: admin@nexus.com");
    }

    private Engineer createSarahChen() {
        Engineer sarah = Engineer.builder()
                .name("Sarah Chen")
                .email("sarah.chen@company.com")
                .currentLevel(Engineer.Level.L3)
                .track(Engineer.Track.IC)
                .team("Platform Engineering")
                .managerId("E-9001")
                .joinDate(LocalDateTime.of(2024, 1, 15, 0, 0))
                .avatarUrl("https://ui-avatars.com/api/?name=Sarah+Chen&background=5b8ff9&color=fff")
                .build();

        engineerRepository.save(sarah);
        log.info("✅ Created engineer: Sarah Chen (L3, Platform Engineering)");
        return sarah;
    }

    private Engineer createMarcusRodriguez() {
        Engineer marcus = Engineer.builder()
                .name("Marcus Rodriguez")
                .email("marcus.r@company.com")
                .currentLevel(Engineer.Level.L2)
                .track(Engineer.Track.IC)
                .team("Platform Engineering")
                .managerId("E-9001")
                .joinDate(LocalDateTime.of(2024, 3, 20, 0, 0))
                .avatarUrl("https://ui-avatars.com/api/?name=Marcus+Rodriguez&background=f759ab&color=fff")
                .build();

        engineerRepository.save(marcus);
        log.info("✅ Created engineer: Marcus Rodriguez (L2, Platform Engineering)");
        return marcus;
    }

    private Engineer createPriyaSharma() {
        Engineer priya = Engineer.builder()
                .name("Priya Sharma")
                .email("priya.s@company.com")
                .currentLevel(Engineer.Level.L4)
                .track(Engineer.Track.LEADERSHIP)
                .team("Infrastructure")
                .managerId("E-9002")
                .joinDate(LocalDateTime.of(2023, 6, 10, 0, 0))
                .avatarUrl("https://ui-avatars.com/api/?name=Priya+Sharma&background=ffa940&color=fff")
                .build();

        engineerRepository.save(priya);
        log.info("✅ Created engineer: Priya Sharma (L4, Infrastructure)");
        return priya;
    }

    private Engineer createAlexKim() {
        Engineer alex = Engineer.builder()
                .name("Alex Kim")
                .email("alex.kim@company.com")
                .currentLevel(Engineer.Level.L4)
                .track(Engineer.Track.IC)
                .team("AI/ML")
                .managerId("E-9003")
                .joinDate(LocalDateTime.of(2022, 11, 5, 0, 0))
                .avatarUrl("https://ui-avatars.com/api/?name=Alex+Kim&background=9254de&color=fff")
                .build();

        engineerRepository.save(alex);
        log.info("✅ Created engineer: Alex Kim (L4, AI/ML)");
        return alex;
    }

    private Engineer createSonalDiwan() {
        Engineer sonal = Engineer.builder()
                .name("sonal diwan")
                .email("sonal@gmail.com")
                .currentLevel(Engineer.Level.L1)
                .track(Engineer.Track.IC)
                .team("Frontend Engineering")
                .managerId("E-9004")
                .joinDate(LocalDateTime.of(2024, 1, 19, 0, 0))
                .avatarUrl("https://ui-avatars.com/api/?name=Sonal+Diwan&background=36cfc9&color=fff")
                .build();

        engineerRepository.save(sonal);
        log.info("✅ Created engineer: sonal diwan (L1, Frontend Engineering)");
        return sonal;
    }

    private void createSnapshotForSarah(Engineer sarah) {
        Map<String, Integer> capabilities = new HashMap<>();
        capabilities.put("SYSTEM_DESIGN", 3);
        capabilities.put("TECHNICAL_DEPTH", 3);
        capabilities.put("CODE_OWNERSHIP", 4);
        capabilities.put("DEBUGGING", 3);
        capabilities.put("COMMUNICATION", 3);
        capabilities.put("PRODUCT_THINKING", 2);
        capabilities.put("EXECUTION", 4);
        capabilities.put("MENTORSHIP", 2);
        capabilities.put("ARCHITECTURE_VISION", 2);

        CapabilitySnapshot snapshot = CapabilitySnapshot.builder()
                .engineer(sarah)
                .evaluatorId("E-9001")
                .evaluatedAt(LocalDateTime.of(2026, 1, 10, 14, 30))
                .levelContext(Engineer.Level.L3)
                .trackContext(Engineer.Track.IC)
                .capabilities(capabilities)
                .notes("Strong technical execution. Ready for L4 with more mentorship focus.")
                .build();

        snapshotRepository.save(snapshot);
        log.info("✅ Created capability snapshot for Sarah Chen");
    }

    private void createSnapshotForMarcus(Engineer marcus) {
        Map<String, Integer> capabilities = new HashMap<>();
        capabilities.put("SYSTEM_DESIGN", 2);
        capabilities.put("TECHNICAL_DEPTH", 2);
        capabilities.put("CODE_OWNERSHIP", 3);
        capabilities.put("DEBUGGING", 2);
        capabilities.put("COMMUNICATION", 2);
        capabilities.put("PRODUCT_THINKING", 1);
        capabilities.put("EXECUTION", 3);
        capabilities.put("MENTORSHIP", 1);
        capabilities.put("ARCHITECTURE_VISION", 1);

        CapabilitySnapshot snapshot = CapabilitySnapshot.builder()
                .engineer(marcus)
                .evaluatorId("E-9001")
                .evaluatedAt(LocalDateTime.of(2026, 1, 12, 10, 0))
                .levelContext(Engineer.Level.L2)
                .trackContext(Engineer.Track.IC)
                .capabilities(capabilities)
                .notes("Solid progress. Focus on system design for L3 readiness.")
                .build();

        snapshotRepository.save(snapshot);
        log.info("✅ Created capability snapshot for Marcus Rodriguez");
    }

    private void createSnapshotForPriya(Engineer priya) {
        Map<String, Integer> capabilities = new HashMap<>();
        capabilities.put("SYSTEM_DESIGN", 4);
        capabilities.put("TECHNICAL_DEPTH", 3);
        capabilities.put("CODE_OWNERSHIP", 4);
        capabilities.put("DEBUGGING", 3);
        capabilities.put("COMMUNICATION", 4);
        capabilities.put("PRODUCT_THINKING", 3);
        capabilities.put("EXECUTION", 4);
        capabilities.put("MENTORSHIP", 3);
        capabilities.put("ARCHITECTURE_VISION", 3);

        CapabilitySnapshot snapshot = CapabilitySnapshot.builder()
                .engineer(priya)
                .evaluatorId("E-9002")
                .evaluatedAt(LocalDateTime.of(2026, 1, 8, 16, 0))
                .levelContext(Engineer.Level.L4)
                .trackContext(Engineer.Track.LEADERSHIP)
                .capabilities(capabilities)
                .notes("Excellent leadership and technical skills. Ready for L5 consideration.")
                .build();

        snapshotRepository.save(snapshot);
        log.info("✅ Created capability snapshot for Priya Sharma");
    }

    private void createSnapshotForAlex(Engineer alex) {
        Map<String, Integer> capabilities = new HashMap<>();
        capabilities.put("SYSTEM_DESIGN", 4);
        capabilities.put("TECHNICAL_DEPTH", 4);
        capabilities.put("CODE_OWNERSHIP", 3);
        capabilities.put("DEBUGGING", 4);
        capabilities.put("COMMUNICATION", 2);
        capabilities.put("PRODUCT_THINKING", 3);
        capabilities.put("EXECUTION", 3);
        capabilities.put("MENTORSHIP", 2);
        capabilities.put("ARCHITECTURE_VISION", 4);

        CapabilitySnapshot snapshot = CapabilitySnapshot.builder()
                .engineer(alex)
                .evaluatorId("E-9003")
                .evaluatedAt(LocalDateTime.of(2026, 1, 5, 11, 30))
                .levelContext(Engineer.Level.L4)
                .trackContext(Engineer.Track.IC)
                .capabilities(capabilities)
                .notes("Deep technical expertise in ML/AI. Strong architectural vision.")
                .build();

        snapshotRepository.save(snapshot);
        log.info("✅ Created capability snapshot for Alex Kim");
    }

    private void createSnapshotForSonal(Engineer sonal) {
        Map<String, Integer> capabilities = new HashMap<>();
        capabilities.put("SYSTEM_DESIGN", 1);
        capabilities.put("TECHNICAL_DEPTH", 2);
        capabilities.put("CODE_OWNERSHIP", 2);
        capabilities.put("DEBUGGING", 1);
        capabilities.put("COMMUNICATION", 2);
        capabilities.put("PRODUCT_THINKING", 1);
        capabilities.put("EXECUTION", 2);
        capabilities.put("MENTORSHIP", 0);
        capabilities.put("ARCHITECTURE_VISION", 1);

        CapabilitySnapshot snapshot = CapabilitySnapshot.builder()
                .engineer(sonal)
                .evaluatorId("E-9004")
                .evaluatedAt(LocalDateTime.of(2026, 1, 18, 9, 0))
                .levelContext(Engineer.Level.L1)
                .trackContext(Engineer.Track.IC)
                .capabilities(capabilities)
                .notes("New hire showing good potential. Focus on building technical depth.")
                .build();

        snapshotRepository.save(snapshot);
        log.info("✅ Created capability snapshot for sonal diwan");
    }
}
