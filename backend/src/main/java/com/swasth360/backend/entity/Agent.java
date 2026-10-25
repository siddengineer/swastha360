package com.swasth360.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "agents")
public class Agent {

    @Id
    @Column(nullable = false, unique = true)
    private String id; // e.g. "patient-followup"

    @Column(nullable = false)
    private String name;

    @Column(length = 1000, nullable = false)
    private String description;

    private String category;
    private String intendedUsers;

    private boolean isHospitalAgent = true;
    private boolean isIndividualAgent = false;

    private String defaultAvailability; // "Available for Hospital", "Available for Individuals", "Available in Demo"
    private String iconName;

    public Agent() {}

    public Agent(String id, String name, String description, String category, String intendedUsers,
                 boolean isHospitalAgent, boolean isIndividualAgent, String defaultAvailability, String iconName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.intendedUsers = intendedUsers;
        this.isHospitalAgent = isHospitalAgent;
        this.isIndividualAgent = isIndividualAgent;
        this.defaultAvailability = defaultAvailability;
        this.iconName = iconName;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getIntendedUsers() { return intendedUsers; }
    public void setIntendedUsers(String intendedUsers) { this.intendedUsers = intendedUsers; }

    public boolean isHospitalAgent() { return isHospitalAgent; }
    public void setHospitalAgent(boolean hospitalAgent) { isHospitalAgent = hospitalAgent; }

    public boolean isIndividualAgent() { return isIndividualAgent; }
    public void setIndividualAgent(boolean individualAgent) { isIndividualAgent = individualAgent; }

    public String getDefaultAvailability() { return defaultAvailability; }
    public void setDefaultAvailability(String defaultAvailability) { this.defaultAvailability = defaultAvailability; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
}
