package com.swasth360.backend.dto;

import com.swasth360.backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String phone;
        private boolean termsAccepted;

        public RegisterRequest() {}

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public boolean isTermsAccepted() { return termsAccepted; }
        public void setTermsAccepted(boolean termsAccepted) { this.termsAccepted = termsAccepted; }
    }

    public static class AuthResponse {
        private String token;
        private Long userId;
        private String email;
        private String fullName;
        private Role role;
        private Long organizationId;
        private String organizationName;
        private String organizationSlug;

        public AuthResponse() {}

        public AuthResponse(String token, Long userId, String email, String fullName, Role role,
                            Long organizationId, String organizationName, String organizationSlug) {
            this.token = token;
            this.userId = userId;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
            this.organizationId = organizationId;
            this.organizationName = organizationName;
            this.organizationSlug = organizationSlug;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
        public Long getOrganizationId() { return organizationId; }
        public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
        public String getOrganizationName() { return organizationName; }
        public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }
        public String getOrganizationSlug() { return organizationSlug; }
        public void setOrganizationSlug(String organizationSlug) { this.organizationSlug = organizationSlug; }
    }

    public static class UserDto {
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private Role role;
        private Long organizationId;
        private String organizationName;
        private boolean active;

        public UserDto() {}

        public UserDto(Long id, String email, String fullName, String phone, Role role, Long organizationId, String organizationName, boolean active) {
            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.phone = phone;
            this.role = role;
            this.organizationId = organizationId;
            this.organizationName = organizationName;
            this.active = active;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
        public Long getOrganizationId() { return organizationId; }
        public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
        public String getOrganizationName() { return organizationName; }
        public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
    }
}
