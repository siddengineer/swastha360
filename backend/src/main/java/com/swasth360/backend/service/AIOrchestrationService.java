package com.swasth360.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swasth360.backend.dto.AgentDtos.*;
import com.swasth360.backend.entity.*;
import com.swasth360.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AIOrchestrationService {

    private static final Logger log = LoggerFactory.getLogger(AIOrchestrationService.class);

    private final AgentRepository agentRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationAgentRepository organizationAgentRepository;
    private final HelpdeskEntryRepository helpdeskEntryRepository;
    private final AgentConversationRepository conversationRepository;
    private final AgentMessageRepository messageRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public AIOrchestrationService(AgentRepository agentRepository,
                                  OrganizationRepository organizationRepository,
                                  OrganizationAgentRepository organizationAgentRepository,
                                  HelpdeskEntryRepository helpdeskEntryRepository,
                                  AgentConversationRepository conversationRepository,
                                  AgentMessageRepository messageRepository,
                                  RestTemplateBuilder restTemplateBuilder,
                                  ObjectMapper objectMapper) {
        this.agentRepository = agentRepository;
        this.organizationRepository = organizationRepository;
        this.organizationAgentRepository = organizationAgentRepository;
        this.helpdeskEntryRepository = helpdeskEntryRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(3))
                .setReadTimeout(Duration.ofSeconds(6))
                .build();
        this.objectMapper = objectMapper;
    }

    @Transactional
    public AgentChatResponseDto chat(String agentId, AgentChatRequestDto request, User user) {
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new IllegalArgumentException("Agent '" + agentId + "' not found"));

        Map<String, Object> orgContext = new HashMap<>();

        // Role & Tenant Authorization Enforcement
        if (user != null) {
            if (user.getRole() == Role.HOSPITAL_ADMIN || user.getRole() == Role.HOSPITAL_STAFF) {
                if (user.getOrganizationId() == null) {
                    throw new AccessDeniedException("User is not associated with an active hospital organization.");
                }

                Organization org = organizationRepository.findById(user.getOrganizationId())
                        .orElseThrow(() -> new AccessDeniedException("Organization not found"));

                if (org.getStatus() == OrgStatus.SUSPENDED) {
                    throw new AccessDeniedException("Your hospital organization account is suspended. AI agent access is disabled.");
                }

                // Verify agent enablement for this organization
                boolean isEnabled = organizationAgentRepository
                        .findByOrganizationIdAndAgentId(org.getId(), agentId)
                        .map(OrganizationAgent::isEnabled)
                        .orElse(false);

                if (!isEnabled) {
                    throw new AccessDeniedException("Agent '" + agent.getName() + "' is not enabled for your organization.");
                }

                // Load custom hospital helpdesk information if applicable
                orgContext.put("hospital_name", org.getName());
                helpdeskEntryRepository.findByOrganizationId(org.getId()).ifPresent(h -> {
                    orgContext.put("visiting_hours", h.getVisitingHours());
                    orgContext.put("appointment_instructions", h.getAppointmentInstructions());
                    orgContext.put("contact_phone", h.getContactPhone());
                    orgContext.put("contact_email", h.getContactEmail());
                    orgContext.put("general_faq", h.getGeneralFaq());
                });
            } else if (user.getRole() == Role.INDIVIDUAL_USER) {
                if (!agent.isIndividualAgent()) {
                    throw new AccessDeniedException("The agent '" + agent.getName() + "' is reserved for hospital healthcare workflows.");
                }
            }
        }

        AgentChatResponseDto responseDto = null;

        // Try calling Python AI Service
        try {
            String url = aiServiceUrl + "/agents/" + agentId + "/chat";
            Map<String, Object> pyRequest = new HashMap<>();
            pyRequest.put("message", request.getMessage());
            pyRequest.put("language", request.getLanguage() != null ? request.getLanguage() : "en");
            pyRequest.put("organization_context", orgContext);
            if (user != null) {
                pyRequest.put("user_role", user.getRole().name());
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            String jsonPayload = objectMapper.writeValueAsString(pyRequest);
            HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);

            String jsonResponse = restTemplate.postForObject(url, entity, String.class);
            if (jsonResponse != null) {
                responseDto = objectMapper.readValue(jsonResponse, AgentChatResponseDto.class);
            }
        } catch (Exception ex) {
            log.warn("Python AI Service unavailable or error at {} ({}). Using high-availability fallback engine.", aiServiceUrl, ex.getMessage());
            responseDto = generateDeterministicFallback(agent, request.getMessage(), orgContext, request.getLanguage());
        }

        if (responseDto == null) {
            responseDto = generateDeterministicFallback(agent, request.getMessage(), orgContext, request.getLanguage());
        }

        // Save conversation and message history if user is authenticated
        if (user != null) {
            AgentConversation conv;
            if (request.getConversationId() != null) {
                conv = conversationRepository.findById(request.getConversationId()).orElse(null);
            } else {
                conv = null;
            }

            if (conv == null) {
                String title = request.getMessage().length() > 40
                        ? request.getMessage().substring(0, 37) + "..."
                        : request.getMessage();
                conv = new AgentConversation(user.getId(), user.getOrganizationId(), agentId, title);
                conv = conversationRepository.save(conv);
            }

            responseDto.setConversationId(conv.getId());

            // Save user message
            AgentMessage userMsg = new AgentMessage(conv.getId(), "USER", request.getMessage(), null, null);
            messageRepository.save(userMsg);

            // Save agent message
            String actionJson = null;
            if (responseDto.getActionData() != null) {
                try {
                    actionJson = objectMapper.writeValueAsString(responseDto.getActionData());
                } catch (Exception ignored) {}
            }
            AgentMessage agentMsg = new AgentMessage(conv.getId(), "AGENT", responseDto.getReply(),
                    responseDto.getSafetyNotice(), actionJson);
            messageRepository.save(agentMsg);
        }

        return responseDto;
    }

    private AgentChatResponseDto generateDeterministicFallback(Agent agent, String rawMsg, Map<String, Object> orgCtx, String lang) {
        String msg = rawMsg.toLowerCase().trim();
        AgentChatResponseDto dto = new AgentChatResponseDto();
        dto.setAgentId(agent.getId());
        dto.setAgentName(agent.getName());
        dto.setSafetyNotice("Swasth360 is an AI-assisted healthcare demonstration platform. It does not replace qualified medical diagnosis or emergency care (Call 112 / 108 in India).");
        dto.setModelUsed("Swasth360 Fallback Demonstration Engine");

        // Crisis detection
        if (msg.contains("suicide") || msg.contains("kill myself") || msg.contains("end my life") || msg.contains("self-harm")) {
            dto.setReply("We care about your safety. If you are experiencing distress, please reach out to trained support right away:\n\n" +
                    "• Tele-MANAS (Govt of India): 14416 or 1800-891-4416 (24x7 Free)\n" +
                    "• National Emergency: 112");
            EscalationDto esc = new EscalationDto();
            esc.setCrisis(true);
            esc.setHelplineName("Tele-MANAS");
            esc.setHelplineNumber("14416");
            esc.setRecommendedAction("Immediate crisis support connection");
            dto.setEscalation(esc);
            dto.setSuggestions(List.of("Call 14416", "Emergency 112"));
            return dto;
        }

        if ("patient-followup".equals(agent.getId())) {
            dto.setReply("📋 **Draft Follow-up Reminder Prepared for Clinical Approval:**\n\n" +
                    "\"Dear Patient (Ref: #PT-8421), this is a 48-hour post-discharge check from your hospital care team. " +
                    "Please confirm your current pain level and that you have picked up your discharge prescriptions. " +
                    "For severe pain or high fever, contact the emergency desk at 011-2345-6789.\"\n\n" +
                    "Status: Drafted & queued in hospital portal.");
            dto.setSuggestions(List.of("Draft a 48-hour post-discharge follow-up reminder", "View pending follow-up schedule"));
            dto.setActionData(Map.of("type", "draft_reminder", "patientRef", "PT-8421", "status", "Pending Staff Review"));
        } else if ("medication-guidance".equals(agent.getId())) {
            dto.setReply("💊 **Understanding Medication Timing (Educational Overview):**\n\n" +
                    "• **'Take with Food':** Means consuming the tablet immediately after or during a meal (or substantial snack) to reduce gastrointestinal irritation.\n" +
                    "• **Safety Note:** Never modify or stop prescribed medication without consulting your prescribing doctor.");
            dto.setSuggestions(List.of("Explain what 'take with food' means", "What to do if a dose is missed"));
        } else if ("appointment-management".equals(agent.getId())) {
            dto.setReply("🗓️ **Appointment Reminder Generated:**\n\n" +
                    "\"Namaste! Your appointment with Dr. Anita Rao (Cardiology OPD) is scheduled for Tomorrow at 10:30 AM at OPD Room 204. " +
                    "Please arrive 15 minutes early with your photo ID and previous clinical reports.\"");
            dto.setSuggestions(List.of("Draft an SMS appointment reminder", "View upcoming demo OPD slots"));
            dto.setActionData(Map.of("doctor", "Dr. Anita Rao", "department", "Cardiology", "slot", "Tomorrow, 10:30 AM"));
        } else if ("hospital-helpdesk".equals(agent.getId())) {
            String hospitalName = (String) orgCtx.getOrDefault("hospital_name", "ABC Healthcare Demo");
            String visitingHours = (String) orgCtx.getOrDefault("visiting_hours", "5:00 PM – 7:00 PM Daily");
            String contactPhone = (String) orgCtx.getOrDefault("contact_phone", "+91 11-4567-8900");

            dto.setReply("🏥 **" + hospitalName + " Helpdesk Information:**\n\n" +
                    "• **Visiting Hours:** " + visitingHours + "\n" +
                    "• **Main Reception & Helpline:** " + contactPhone + "\n" +
                    "• **Emergency Casualty:** Ground floor, Gate 2 (Open 24 hours)");
            dto.setSuggestions(List.of("What are visiting hours?", "How to reach reception?"));
        } else if ("multilingual-healthcare".equals(agent.getId())) {
            if ("hi".equalsIgnoreCase(lang) || msg.contains("hindi") || msg.contains("दवा")) {
                dto.setReply("🇮🇳 **हिंदी में स्वास्थ्य मार्गदर्शन:**\n\n" +
                        "• **'खाली पेट लें' (Take on empty stomach):** इसका अर्थ है कि यह दवा सुबह उठने के तुरंत बाद सादे पानी के साथ लें, " +
                        "और कम से कम 30-45 मिनट तक चाय, नाश्ता न करें।");
            } else {
                dto.setReply("🌐 **Multilingual Guidance (English / Hindi / Marathi):**\n\n" +
                        "\"Take on empty stomach before breakfast\"\n" +
                        "• **हिंदी:** सुबह नाश्ते से आधा घंटा पहले खाली पेट लें।\n" +
                        "• **मराठी:** सकाळी नाश्त्यापूर्वी ३० मिनिटे उपाशी पोटी घ्यावे.");
            }
            dto.setSuggestions(List.of("Explain in Hindi", "Explain in Marathi"));
        } else {
            dto.setReply("Hello, I am the " + agent.getName() + ". I am here to provide structured healthcare support and guidance. " +
                    "Please ask any question or try one of the suggested prompts below.");
            dto.setSuggestions(List.of("Show sample checklist", "Explain key guidelines"));
        }

        return dto;
    }
}
