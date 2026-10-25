"""
Swasth360 AI Service - FastAPI
Provides deterministic and optional LLM-backed responses for the 9 healthcare AI agents.
"""

import os
import re
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Swasth360 AI Service",
    description="Specialized AI Agents for Smarter Healthcare in India",
    version="1.0.0"
)

# CORS middleware for internal orchestration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Agent Definitions
AGENTS = [
    {
        "id": "patient-followup",
        "name": "Patient Follow-up Agent",
        "description": "Helps authorized healthcare staff organize follow-up schedules and prepare patient follow-up reminders.",
        "category": "Hospital Workflow",
        "intended_users": "Hospital Staff & Administrators",
        "availability": "Available for Hospital",
        "is_hospital_agent": True,
        "is_individual_agent": False,
        "suggested_prompts": [
            "Draft a 48-hour post-discharge follow-up reminder",
            "View pending post-op follow-up schedule",
            "Show cardiology review checklist for follow-up"
        ]
    },
    {
        "id": "medication-guidance",
        "name": "Medication Guidance Agent",
        "description": "Explains general medication information and helps users understand clinician-provided medication instructions using approved information.",
        "category": "Patient Education",
        "intended_users": "Individual Users & Hospital Patients",
        "availability": "Available for Individuals",
        "is_hospital_agent": True,
        "is_individual_agent": True,
        "suggested_prompts": [
            "Explain what 'take with food' means for Paracetamol/Metformin",
            "Difference between a prescribed dose and general OTC advice",
            "What should I do if I missed a morning dose?"
        ]
    },
    {
        "id": "appointment-management",
        "name": "Appointment Management Agent",
        "description": "Helps users understand appointments and assists authorized staff with appointment scheduling and reminder management.",
        "category": "Hospital Workflow & Patient Portal",
        "intended_users": "Hospitals & Individuals",
        "availability": "Available for Hospital",
        "is_hospital_agent": True,
        "is_individual_agent": True,
        "suggested_prompts": [
            "Draft an SMS appointment reminder for tomorrow's orthopedic OPD",
            "Show today's upcoming demo OPD slots",
            "What documents should a patient bring for a first-time specialist visit?"
        ]
    },
    {
        "id": "chronic-care",
        "name": "Chronic Care Agent",
        "description": "Supports routine care tracking and educational information for people living with chronic conditions like diabetes and hypertension.",
        "category": "Patient Self-Care",
        "intended_users": "Individual Users",
        "availability": "Available for Individuals",
        "is_hospital_agent": True,
        "is_individual_agent": True,
        "suggested_prompts": [
            "Show routine care checklist for Type 2 Diabetes",
            "How often should blood pressure be logged for hypertension?",
            "Lifestyle habits to support cardiovascular wellness"
        ]
    },
    {
        "id": "maternal-child",
        "name": "Maternal & Child Care Agent",
        "description": "Provides general, reviewed maternal and child health information and identifies warning signs requiring prompt medical care.",
        "category": "Maternal Health",
        "intended_users": "Mothers, Families & Health Workers",
        "availability": "Available for Individuals",
        "is_hospital_agent": True,
        "is_individual_agent": True,
        "suggested_prompts": [
            "Show 2nd trimester prenatal wellness checklist",
            "Essential immunization milestones for infants in India (0-12 months)",
            "What are critical red-flag symptoms during pregnancy?"
        ]
    },
    {
        "id": "insurance-ayushman",
        "name": "Insurance & Ayushman Bharat Agent",
        "description": "Helps users understand health insurance documents, Ayushman Bharat PM-JAY common criteria, and administrative processes.",
        "category": "Healthcare Navigation",
        "intended_users": "Hospital Desk Staff & Citizens",
        "availability": "Available for Individuals",
        "is_hospital_agent": True,
        "is_individual_agent": True,
        "suggested_prompts": [
            "What documents are typically needed for Ayushman Bharat PM-JAY verification?",
            "Explain common health insurance pre-authorization workflows",
            "What is the difference between cashless treatment and reimbursement claim?"
        ]
    },
    {
        "id": "hospital-helpdesk",
        "name": "Hospital Helpdesk Agent",
        "description": "Answers common hospital-related questions using hospital-approved information customized by each hospital administration.",
        "category": "Hospital Frontdesk",
        "intended_users": "Patients, Visitors & Hospital Staff",
        "availability": "Available for Hospital",
        "is_hospital_agent": True,
        "is_individual_agent": False,
        "suggested_prompts": [
            "What are the hospital visiting hours for ICU and general wards?",
            "How do I reach the hospital emergency counter or reception?",
            "What is the admission procedure for planned day-care procedures?"
        ]
    },
    {
        "id": "mental-wellness",
        "name": "Mental Wellness Check-in Agent",
        "description": "Offers supportive wellness check-ins, reflection prompts, and guided breathing. Never diagnoses; includes crisis escalation support.",
        "category": "Wellness & Support",
        "intended_users": "Individual Users",
        "availability": "Available for Individuals",
        "is_hospital_agent": False,
        "is_individual_agent": True,
        "suggested_prompts": [
            "Guide me through a 2-minute box breathing relaxation exercise",
            "I am feeling overwhelmed with work stress today",
            "What are healthy grounding techniques when anxious?"
        ]
    },
    {
        "id": "multilingual-healthcare",
        "name": "Multilingual Healthcare Agent",
        "description": "Helps users understand healthcare instructions in supported Indian languages (English, Hindi, Marathi).",
        "category": "Language Accessibility",
        "intended_users": "Hospitals & Individuals",
        "availability": "Available in Demo",
        "is_hospital_agent": True,
        "is_individual_agent": True,
        "suggested_prompts": [
            "Explain 'Take empty stomach before breakfast' in Hindi",
            "दवा लेने से पहले क्या सावधानियां रखनी चाहिए?",
            "रक्त तपासणीसाठी उपाशी पोटी यावे लागेल का? (Explain in Marathi)"
        ]
    }
]

# Request & Response Models
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_id: Optional[str] = None
    language: Optional[str] = "en"
    organization_context: Optional[Dict[str, Any]] = None
    user_role: Optional[str] = None

class EscalationInfo(BaseModel):
    is_crisis: bool = False
    helpline_name: Optional[str] = None
    helpline_number: Optional[str] = None
    recommended_action: Optional[str] = None

class ChatResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    agent_id: str
    agent_name: str
    reply: str
    suggestions: List[str] = []
    action_data: Optional[Dict[str, Any]] = None
    safety_notice: str
    model_used: str
    escalation: Optional[EscalationInfo] = None

# Safety Notices
STANDARD_SAFETY_NOTICE = (
    "Swasth360 is an AI-assisted healthcare platform for demonstration and general educational purposes. "
    "It does not provide medical diagnosis, prescribe drugs, or substitute for consultation with a qualified doctor. "
    "In case of medical emergency, immediately contact emergency services (112 / 108 in India)."
)

MEDICATION_SAFETY_NOTICE = (
    "MEDICATION NOTICE: Never alter dosages, discontinue prescribed medications, or begin new drugs without consulting "
    "your licensed treating physician. All explanations are for general educational awareness only."
)

CRISIS_SAFETY_NOTICE = (
    "CRISIS ASSISTANCE: If you or someone you know is having thoughts of self-harm, please reach out for immediate help. "
    "Tele-MANAS (Govt of India): 14416 / 1800-891-4416 (Toll-free 24x7). Emergency: 112."
)

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "Swasth360 AI Service",
        "version": "1.0.0",
        "mode": "Deterministic Demo Engine (Zero External Dependency Failures)",
        "supported_agents_count": len(AGENTS),
        "llm_provider_configured": bool(os.getenv("OPENAI_API_KEY") or os.getenv("GEMINI_API_KEY"))
    }

@app.get("/agents")
def list_agents():
    return {"agents": AGENTS}

@app.get("/agents/{agent_id}")
def get_agent(agent_id: str):
    for agent in AGENTS:
        if agent["id"] == agent_id:
            return agent
    raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")

@app.post("/agents/{agent_id}/chat", response_model=ChatResponse)
def chat_with_agent(agent_id: str, payload: ChatRequest):
    agent_meta = next((a for a in AGENTS if a["id"] == agent_id), None)
    if not agent_meta:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")

    user_text = payload.message.strip().lower()
    org_ctx = payload.organization_context or {}

    # Check for mental health crisis triggers across all inputs
    crisis_keywords = ["suicide", "kill myself", "end my life", "self-harm", "hanging", "poison", "want to die"]
    if any(kw in user_text for kw in crisis_keywords):
        return ChatResponse(
            agent_id=agent_id,
            agent_name=agent_meta["name"],
            reply=(
                "We care deeply about your safety. It sounds like you are going through a painful moment, "
                "and you do not have to carry this alone. Please reach out right now to a trained support counselor "
                "or someone you trust.\n\n"
                "• Tele-MANAS (Govt of India National Mental Health Helpline): 14416 or 1800-891-4416 (Free, 24x7, Multilingual)\n"
                "• National Emergency Services: 112\n"
                "• Vandrevala Foundation: +91 9999 666 555"
            ),
            suggestions=["Call Tele-MANAS (14416)", "Contact Emergency (112)", "Talk to a trusted friend"],
            safety_notice=CRISIS_SAFETY_NOTICE,
            model_used="Swasth360 Safe Escalation Guard",
            escalation=EscalationInfo(
                is_crisis=True,
                helpline_name="Tele-MANAS (Govt. of India)",
                helpline_number="14416",
                recommended_action="Immediate connection to mental health professional"
            )
        )

    # Agent Specific Dispatch
    if agent_id == "patient-followup":
        return handle_patient_followup(user_text, agent_meta)
    elif agent_id == "medication-guidance":
        return handle_medication_guidance(user_text, agent_meta)
    elif agent_id == "appointment-management":
        return handle_appointment_management(user_text, agent_meta)
    elif agent_id == "chronic-care":
        return handle_chronic_care(user_text, agent_meta)
    elif agent_id == "maternal-child":
        return handle_maternal_child(user_text, agent_meta)
    elif agent_id == "insurance-ayushman":
        return handle_insurance_ayushman(user_text, agent_meta)
    elif agent_id == "hospital-helpdesk":
        return handle_hospital_helpdesk(user_text, agent_meta, org_ctx)
    elif agent_id == "mental-wellness":
        return handle_mental_wellness(user_text, agent_meta)
    elif agent_id == "multilingual-healthcare":
        return handle_multilingual_healthcare(user_text, payload.language, agent_meta)
    else:
        return ChatResponse(
            agent_id=agent_id,
            agent_name=agent_meta["name"],
            reply=f"Hello, I am the {agent_meta['name']}. How can I assist you today with healthcare guidelines?",
            suggestions=agent_meta["suggested_prompts"],
            safety_notice=STANDARD_SAFETY_NOTICE,
            model_used="Swasth360 AI Service (Demo Engine)"
        )

def handle_patient_followup(text: str, meta: dict) -> ChatResponse:
    if "reminder" in text or "draft" in text or "48" in text:
        reply = (
            "Here is a drafted patient follow-up reminder prepared for clinical staff review:\n\n"
            "📋 **Draft Reminder Template (SMS / WhatsApp / Portal):**\n"
            "\"Dear Patient (Ref: #PT-8421), this is a friendly follow-up check from your care team at the hospital. "
            "It has been 48 hours since your discharge. Please reply '1' if you are taking your prescribed medications smoothly, "
            "or '2' if you are experiencing any mild discomfort or dressing concerns. "
            "For urgent pain or fever (>100.4°F), please contact our emergency ward immediately at 011-2345-6789.\"\n\n"
            "Staff Action: Review and click 'Approve for Dispatch' in your hospital portal."
        )
        action_data = {
            "type": "draft_reminder",
            "target_patient": "PT-8421 (Post-Op General Surgery)",
            "scheduled_time": "Today at 4:00 PM",
            "channel": "SMS & Patient Portal",
            "status": "Pending Staff Approval"
        }
    elif "schedule" in text or "pending" in text:
        reply = (
            "Here are the active pending follow-up schedules for this clinical unit:\n"
            "1. **PT-8421 (A. Kumar)** - 48-hr Post-Op laparoscopic check - Due Today\n"
            "2. **PT-9032 (S. Verma)** - Day-7 Hypertension titration review - Due Tomorrow\n"
            "3. **PT-7119 (M. Patel)** - Post-Angioplasty cardiac rehab review - Due in 3 days\n\n"
            "All items require staff clinical sign-off prior to archiving."
        )
        action_data = {
            "type": "followup_list",
            "items_count": 3,
            "next_due": "PT-8421 (16:00 IST)"
        }
    else:
        reply = (
            "The Patient Follow-up Agent assists clinical and administrative hospital staff in maintaining timely post-discharge "
            "and post-consultation communication.\n\n"
            "Staff can draft customized follow-up reminders, check compliance checklists, and monitor pending discharge calls."
        )
        action_data = None

    return ChatResponse(
        agent_id=meta["id"],
        agent_name=meta["name"],
        reply=reply,
        suggestions=[
            "Draft a 48-hour post-discharge follow-up reminder",
            "View pending post-op follow-up schedule",
            "Review cardiac follow-up questionnaire"
        ],
        action_data=action_data,
        safety_notice=STANDARD_SAFETY_NOTICE,
        model_used="Swasth360 Follow-up Coordinator Engine"
    )

def handle_medication_guidance(text: str, meta: dict) -> ChatResponse:
    if "food" in text or "with food" in text or "metformin" in text or "paracetamol" in text:
        reply = (
            "**Understanding 'Take With Food' Instructions (General Educational Guidance):**\n\n"
            "• **Why it is prescribed:** Certain medications (such as NSAID pain relievers or Metformin) can irritate the stomach lining or cause nausea if taken on an empty stomach. Consuming food acts as a buffer.\n"
            "• **What counts as food:** A regular meal, or a substantial snack such as whole wheat toast, a bowl of oats, or milk.\n"
            "• **Difference from prescription:** This guidance is educational. Always follow the exact timing indicated on your doctor's written prescription slip."
        )
    elif "missed" in text or "skip" in text:
        reply = (
            "**General Advice on Missed Doses:**\n\n"
            "• As a rule of thumb, take the missed dose as soon as you remember, **unless** it is almost time for your next scheduled dose.\n"
            "• **Never take a double dose** to make up for a forgotten pill.\n"
            "• For critical medications (e.g. insulin, cardiac drugs, anticoagulants), contact your hospital pharmacy or physician directly for personalized protocol."
        )
    else:
        reply = (
            "Welcome to the Medication Guidance Agent. I provide clear, evidence-based explanations of general pharmacological "
            "terms, timing labels (like 'before meals' vs 'after meals'), and medication safety precautions.\n\n"
            "Please ask about any medication instruction term you would like clarified."
        )

    return ChatResponse(
        agent_id=meta["id"],
        agent_name=meta["name"],
        reply=reply,
        suggestions=[
            "Explain what 'take with food' means for Paracetamol/Metformin",
            "What should I do if I missed a morning dose?",
            "What is the difference between brand name and generic salt?"
        ],
        safety_notice=MEDICATION_SAFETY_NOTICE,
        model_used="Swasth360 Safe Rx Guidance Engine"
    )

def handle_appointment_management(text: str, meta: dict) -> ChatResponse:
    if "reminder" in text or "draft" in text:
        reply = (
            "Here is a generated appointment confirmation & preparation reminder:\n\n"
            "🗓️ **Appointment Reminder Template:**\n"
            "\"Namaste! Your consultation with Dr. Anita Rao (Cardiology OPD) is scheduled for Tomorrow at 10:30 AM at OPD Room 204. "
            "Please arrive 15 minutes early for vital sign check-in. Bring your previous ECG reports, current medication list, and Government ID (Aadhaar / ABHA).\"\n\n"
            "Hospital staff can trigger this reminder via SMS or WhatsApp."
        )
        action_data = {
            "appointment_ref": "APT-2026-904",
            "doctor": "Dr. Anita Rao",
            "dept": "Cardiology",
            "slot": "Tomorrow, 10:30 AM",
            "room": "OPD 204"
        }
    elif "slots" in text or "upcoming" in text:
        reply = (
            "**Current Demonstration OPD Slots Available for Today:**\n"
            "• Dr. S. Nambiar (General Medicine) - 11:15 AM, 02:30 PM\n"
            "• Dr. P. Mehta (Pediatrics) - 12:00 PM, 04:00 PM\n"
            "• Dr. R. Iyer (Orthopedics) - 03:00 PM\n\n"
            "Authorized staff can reserve or reschedule appointments through the Hospital Management Dashboard."
        )
        action_data = {
            "type": "slots_view",
            "available_slots_count": 5
        }
    else:
        reply = (
            "The Appointment Management Agent helps patients track scheduled visits and assists hospital staff "
            "in preparing slot reminders, document checklists, and queue notifications."
        )
        action_data = None

    return ChatResponse(
        agent_id=meta["id"],
        agent_name=meta["name"],
        reply=reply,
        suggestions=[
            "Draft an SMS appointment reminder for tomorrow's orthopedic OPD",
            "Show today's upcoming demo OPD slots",
            "What documents should a patient bring for a first-time specialist visit?"
        ],
        action_data=action_data,
        safety_notice=STANDARD_SAFETY_NOTICE,
        model_used="Swasth360 Appointment Orchestration Engine"
    )

def handle_chronic_care(text: str, meta: dict) -> ChatResponse:
    if "diabetes" in text or "sugar" in text:
        reply = (
            "**Routine Care Checklist for Type 2 Diabetes Management:**\n\n"
            "1. **Blood Glucose Tracking:** Maintain a weekly fasting and post-prandial log as directed by your physician.\n"
            "2. **HbA1c Periodic Check:** Recommended typically every 3 to 6 months (target discussed with your endocrinologist).\n"
            "3. **Foot Care:** Inspect feet daily for small cuts, blisters, or redness; avoid walking barefoot.\n"
            "4. **Eye & Kidney Screenings:** Schedule an annual dilated eye exam and microalbuminuria urine test.\n"
            "5. **Dietary Discipline:** Prioritize high-fiber complex grains (millets, whole wheat), green vegetables, and minimize sweetened beverages."
        )
        action_data = {
            "condition": "Type 2 Diabetes Mellitus",
            "key_metrics": ["Fasting BG", "HbA1c", "BP", "Lipid Profile"],
            "monitoring_frequency": "Quarterly review recommended"
        }
    elif "hypertension" in text or "blood pressure" in text or "bp" in text:
        reply = (
            "**Hypertension Routine Monitoring Guidelines:**\n\n"
            "• **Measurement Technique:** Rest quietly for 5 minutes before checking. Keep arm at heart level.\n"
            "• **Salt Intake:** Follow Indian Council of Medical Research (ICMR) recommendations: reduce daily dietary sodium (under 5g salt/day).\n"
            "• **Physical Activity:** 30 minutes of moderate aerobic activity (e.g. brisk walking) 5 days a week.\n"
            "• **Warning Symptoms:** Severe throbbing headache, blurred vision, or chest tightness require immediate emergency care."
        )
        action_data = {
            "condition": "Hypertension",
            "target_range": "< 130/80 mmHg (Subject to clinician guidance)"
        }
    else:
        reply = (
            "The Chronic Care Agent supports long-term lifestyle awareness, self-tracking reminders, and education "
            "for chronic conditions including Diabetes, Hypertension, and Asthma."
        )
        action_data = None

    return ChatResponse(
        agent_id=meta["id"],
        agent_name=meta["name"],
        reply=reply,
        suggestions=[
            "Show routine care checklist for Type 2 Diabetes",
            "How often should blood pressure be logged for hypertension?",
            "Lifestyle habits to support cardiovascular wellness"
        ],
        action_data=action_data,
        safety_notice=STANDARD_SAFETY_NOTICE,
        model_used="Swasth360 Chronic Care Engine"
    )

def handle_maternal_child(text: str, meta: dict) -> ChatResponse:
    if "warning" in text or "red-flag" in text or "danger" in text:
        reply = (
            "⚠️ **CRITICAL MATERNAL WARNING SIGNS — Seek Immediate Hospital Care:**\n\n"
            "If any of the following symptoms occur, proceed to the nearest emergency or maternity ward without delay:\n"
            "• Severe vaginal bleeding or leaking of fluid\n"
            "• Persistent severe headache with blurred vision or spots\n"
            "• Sudden swelling of face, hands, or feet (signs of pre-eclampsia)\n"
            "• High fever with chills\n"
            "• Noticeable reduction in fetal movements in the third trimester\n"
            "• Severe abdominal or epigastric pain"
        )
    elif "immunization" in text or "vaccine" in text:
        reply = (
            "**Universal Immunization Programme (UIP) India Milestones (0-12 Months):**\n\n"
            "• **At Birth:** BCG, OPV-0, Hepatitis B birth dose\n"
            "• **6 Weeks:** Pentavalent-1, OPV-1, Rota-1, fIPV-1, PCV-1\n"
            "• **10 Weeks:** Pentavalent-2, OPV-2, Rota-2\n"
            "• **14 Weeks:** Pentavalent-3, OPV-3, Rota-3, fIPV-2, PCV-2\n"
            "• **9-12 Months:** MR (Measles-Rubella)-1, JE-1 (in endemic districts), PCV Booster, Vitamin A dose 1\n\n"
            "Always verify dates on your baby's Mother-Child Protection (MCP) card."
        )
    else:
        reply = (
            "Welcome to the Maternal & Child Care Agent. We provide reviewed, evidence-based guidance "
            "on prenatal health, nutrition (iron-folic acid supplementation), baby wellness, and vaccination timelines."
        )

    return ChatResponse(
        agent_id=meta["id"],
        agent_name=meta["name"],
        reply=reply,
        suggestions=[
            "Show 2nd trimester prenatal wellness checklist",
            "Essential immunization milestones for infants in India (0-12 months)",
            "What are critical red-flag symptoms during pregnancy?"
        ],
        safety_notice=STANDARD_SAFETY_NOTICE,
        model_used="Swasth360 Maternal & Pediatric Health Engine"
    )

def handle_insurance_ayushman(text: str, meta: dict) -> ChatResponse:
    if "ayushman" in text or "pm-jay" in text or "pmjay" in text:
        reply = (
            "**Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) Information:**\n\n"
            "• **Benefit Cover:** Up to ₹5 Lakhs per family per year for secondary and tertiary hospitalization across empaneled public and private hospitals in India.\n"
            "• **Eligibility Criteria:** Based on SECC 2011 deprivation and occupational criteria for rural and urban households (and newly expanded 70+ senior citizen coverage).\n"
            "• **Required Documents for Verification:**\n"
            "  1. Aadhaar Card (primary KYC)\n"
            "  2. Ration Card or Family ID document\n"
            "  3. Active Mobile Number for OTP\n"
            "• **Verification Desk:** Visit the 'Ayushman Mitra' counter at any empaneled hospital or check beneficiary.nha.gov.in.\n\n"
            "*Notice: Swasth360 cannot officially verify or guarantee scheme coverage.*"
        )
    elif "cashless" in text or "reimbursement" in text or "claim" in text:
        reply = (
            "**Cashless vs Reimbursement Health Insurance Claims:**\n\n"
            "• **Cashless Treatment:**\n"
            "  - Available only at network empaneled hospitals.\n"
            "  - Hospital TPA (Third Party Administrator) desk submits pre-authorization prior to admission.\n"
            "  - Insurer settles approved costs directly with hospital.\n\n"
            "• **Reimbursement:**\n"
            "  - Patient settles all bills at discharge.\n"
            "  - Patient submits original discharge summary, itemized pharmacy bills, diagnostic reports, and claim form to insurer within 15-30 days."
        )
    else:
        reply = (
            "The Insurance & Ayushman Bharat Agent assists patients and hospital helpdesks in understanding "
            "coverage categories, TPA documentation, and public healthcare welfare schemes in India."
        )

    return ChatResponse(
        agent_id=meta["id"],
        agent_name=meta["name"],
        reply=reply,
        suggestions=[
            "What documents are typically needed for Ayushman Bharat PM-JAY verification?",
            "Explain common health insurance pre-authorization workflows",
            "What is the difference between cashless treatment and reimbursement claim?"
        ],
        safety_notice=STANDARD_SAFETY_NOTICE,
        model_used="Swasth360 Healthcare Navigation Engine"
    )

def handle_hospital_helpdesk(text: str, meta: dict, org_ctx: dict) -> ChatResponse:
    # Uses organization context if available, otherwise fallback demo data
    visiting_hours = org_ctx.get("visiting_hours", "5:00 PM – 7:00 PM daily (ICU visiting strictly 11:00 AM – 12:00 PM)")
    instructions = org_ctx.get("appointment_instructions", "Please register at Counter 3 with your government ID. Arrive 20 mins prior.")
    contact_phone = org_ctx.get("contact_phone", "+91 11-4567-8900 (24x7 Emergency: +91 11-4567-8999)")
    contact_email = org_ctx.get("contact_email", "helpdesk@abchealthcare.demo")
    hospital_name = org_ctx.get("hospital_name", "ABC Healthcare Demo Hospital")

    if "visiting" in text or "hours" in text or "timing" in text:
        reply = (
            f"🏥 **Visiting Hours for {hospital_name}:**\n\n"
            f"• General & Private Wards: {visiting_hours}\n"
            f"• One authorized attendant badge is required in inpatient corridors.\n"
            f"• Children under 12 are generally not advised in critical intensive care wings for infection control."
        )
    elif "contact" in text or "emergency" in text or "phone" in text:
        reply = (
            f"📞 **Hospital Contact Details for {hospital_name}:**\n\n"
            f"• Main Reception: {contact_phone}\n"
            f"• Official Email: {contact_email}\n"
            f"• Emergency Casualty: Open 24 Hours, Entrance Gate 2 with dedicated ambulance ramp."
        )
    elif "appointment" in text or "procedure" in text or "admission" in text:
        reply = (
            f"📋 **Appointment & Admission Procedure for {hospital_name}:**\n\n"
            f"{instructions}\n\n"
            f"• Cashless TPA / Ayushman Desk: Located on Ground Floor, Block B.\n"
            f"• Pharmacy & Laboratory: Open 24x7 on Ground Floor."
        )
    else:
        reply = (
            f"Namaste! Welcome to the {hospital_name} Helpdesk. I can answer inquiries regarding visiting hours, "
            f"reception contact numbers, OPD counters, and admission guidelines configured by our administration."
        )

    return ChatResponse(
        agent_id=meta["id"],
        agent_name=meta["name"],
        reply=reply,
        suggestions=[
            "What are the hospital visiting hours for ICU and general wards?",
            "How do I reach the hospital emergency counter or reception?",
            "What is the admission procedure for planned day-care procedures?"
        ],
        action_data={
            "hospital_name": hospital_name,
            "visiting_hours": visiting_hours,
            "contact_phone": contact_phone
        },
        safety_notice=STANDARD_SAFETY_NOTICE,
        model_used=f"Swasth360 Hospital Helpdesk ({hospital_name})"
    )

def handle_mental_wellness(text: str, meta: dict) -> ChatResponse:
    if "breathing" in text or "exercise" in text or "box" in text:
        reply = (
            "🧘 **Guided 4-4-4-4 Box Breathing Relaxation Exercise:**\n\n"
            "Let's take a calm pause together:\n"
            "1. **Inhale slowly** through your nose for a count of 4... (1, 2, 3, 4)\n"
            "2. **Hold your breath gently** for a count of 4... (1, 2, 3, 4)\n"
            "3. **Exhale smoothly** through your mouth for a count of 4... (1, 2, 3, 4)\n"
            "4. **Rest at empty** for a count of 4... (1, 2, 3, 4)\n\n"
            "Repeat this cycle 3-4 times. Notice your shoulders releasing tension."
        )
        action_data = {
            "exercise_type": "Box Breathing",
            "duration": "2 Minutes",
            "tempo": "4 seconds per phase"
        }
    elif "stress" in text or "overwhelm" in text or "anxious" in text:
        reply = (
            "It is completely natural to experience stress, especially when juggling work, family, or health challenges. "
            "Here are three grounded self-care steps to try right now:\n\n"
            "• **5-4-3-2-1 Grounding:** Name 5 things you can see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.\n"
            "• **Hydrate & Step Outside:** Drink a glass of cool water and take a 5-minute walk in natural light.\n"
            "• **Set one boundary:** Decide on one low-priority task you will pause until tomorrow."
        )
        action_data = None
    else:
        reply = (
            "Hello. I am your Mental Wellness Check-in companion. I provide supportive reflection prompts, "
            "mindfulness exercises, and self-care resources. Remember, I am an AI companion and cannot diagnose "
            "psychological conditions. How are you feeling today?"
        )
        action_data = None

    return ChatResponse(
        agent_id=meta["id"],
        agent_name=meta["name"],
        reply=reply,
        suggestions=[
            "Guide me through a 2-minute box breathing relaxation exercise",
            "I am feeling overwhelmed with work stress today",
            "What are healthy grounding techniques when anxious?"
        ],
        action_data=action_data,
        safety_notice=STANDARD_SAFETY_NOTICE,
        model_used="Swasth360 Supportive Wellness Companion"
    )

def handle_multilingual_healthcare(text: str, language: Optional[str], meta: dict) -> ChatResponse:
    lang = (language or "en").lower()

    if lang == "hi" or "hindi" in text or "दवा" in text:
        reply = (
            "🇮🇳 **हिंदी में स्वास्थ्य मार्गदर्शन (Hindi Translation & Explanation):**\n\n"
            "• **'खाली पेट लें' (Take on empty stomach):**\n"
            "  इसका अर्थ है कि यह दवा सुबह उठने के तुरंत बाद लें, और इसके बाद कम से कम 30 से 45 मिनट तक चाय, नाश्ता या दूध न लें। "
            "  पानी के साथ लें।\n\n"
            "• **अपॉइंटमेंट सूचना:**\n"
            "  कृप्या अस्पताल आते समय अपना आधार कार्ड और पुरानी जांच रिपोर्ट (रक्त परीक्षण, पर्ची) साथ लाएं।"
        )
        detected_lang = "Hindi (हिन्दी)"
    elif lang == "mr" or "marathi" in text or "उपाशी" in text:
        reply = (
            "🚩 **मराठीत आरोग्य मार्गदर्शन (Marathi Translation & Explanation):**\n\n"
            "• **'उपाशी पोटी औषध घेणे' (Take empty stomach):**\n"
            "  याचा अर्थ औषध सकाळी चहा किंवा नाश्ता करण्यापूर्वी किमान ३०-४५ मिनिटे आधी साध्या पाण्यासोबत घ्यावे.\n\n"
            "• **रक्त तपासणी सूचना:**\n"
            "  उपाशी पोटी (Fasting) रक्ताची तपासणी असेल, तर आदल्या रात्रीच्या जेवणानंतर १० ते १२ तास काहीही खाऊ नये (फक्त पाणी पिऊ शकता)."
        )
        detected_lang = "Marathi (मराठी)"
    else:
        reply = (
            "🌐 **Multilingual Healthcare Assistant (English / Hindi / Marathi):**\n\n"
            "Medical terms can be confusing. I can translate and simplify complex prescriptions or clinical instructions.\n\n"
            "• **Example (English):** \"Take empty stomach before breakfast.\"\n"
            "• **हिंदी:** \"सुबह नाश्ते से आधा घंटा पहले खाली पेट पानी के साथ लें।\"\n"
            "• **मराठी:** \"सकाळी नाश्त्यापूर्वी ३० मिनिटे उपाशी पोटी पाण्यासोबत घ्यावे.\""
        )
        detected_lang = "English"

    return ChatResponse(
        agent_id=meta["id"],
        agent_name=meta["name"],
        reply=reply,
        suggestions=[
            "Explain 'Take empty stomach before breakfast' in Hindi",
            "दवा लेने से पहले क्या सावधानियां रखनी चाहिए?",
            "रक्त तपासणीसाठी उपाशी पोटी यावे लागेल का? (Explain in Marathi)"
        ],
        action_data={"language_active": detected_lang},
        safety_notice="NOTICE: Automated translations are provided for informational accessibility. Always confirm treatment instructions with bilingual healthcare staff.",
        model_used="Swasth360 Indic Multilingual Translation Engine"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
