// Resume Screening Chatbot - Backend Integrated Script

const BACKEND_URL = "http://127.0.0.1:5000";

// ---------------- APPLICATION STATE ----------------
const AppState = {
    currentResume: null,
    analysisResult: null
};

// ---------------- INITIALIZATION ----------------
document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
});

// ---------------- FILE HANDLING ----------------
function handleFileSelect(file) {
    if (!file) return;

    if (file.type !== "application/pdf") {
        alert("Please upload a PDF resume only.");
        return;
    }

    AppState.currentResume = file;
}

// ---------------- RESUME UPLOAD & ANALYSIS ----------------
async function uploadResume() {
    if (!AppState.currentResume) {
        alert("Please upload a resume first.");
        return;
    }

    const jobDesc = document.getElementById("jobDesc").value.trim();
    if (!jobDesc) {
        alert("Please enter a job description.");
        return;
    }

    const formData = new FormData();
    formData.append("resume", AppState.currentResume);
    formData.append("job_description", jobDesc);

    try {
        const response = await fetch(`${BACKEND_URL}/upload`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Backend error");
        }

        const data = await response.json();
        AppState.analysisResult = data;

        renderAnalysis(data);

    } catch (error) {
        console.error(error);
        alert("Failed to connect to backend. Is Flask running?");
    }
}

// ---------------- RENDER ANALYSIS RESULTS ----------------
function renderAnalysis(data) {
    document.getElementById("result").style.display = "block";

    // Job Role
    document.getElementById("jobRole").textContent =
        data.predicted_job_role || "N/A";

    // Resume Skills
    document.getElementById("resumeSkills").innerHTML =
        data.resume_skills && data.resume_skills.length
            ? data.resume_skills.map(skill =>
                `<span class="skill-tag">${skill}</span>`
              ).join("")
            : "<span>No skills detected</span>";

    // Missing Skills
    document.getElementById("missingSkills").innerHTML =
        data.missing_skills && data.missing_skills.length
            ? data.missing_skills.map(skill =>
                `<span class="skill-tag missing">${skill}</span>`
              ).join("")
            : "<span class='skill-tag'>No missing skills</span>";

    // Recommendations
    document.getElementById("recommendations").textContent =
        data.missing_skills && data.missing_skills.length
            ? `To improve your chances, consider learning: ${data.missing_skills.join(", ")}.`
            : "Your profile matches the job description well.";

    // Analysis Time
    document.getElementById("analysisTime").textContent =
        new Date().toLocaleTimeString();
}

// ---------------- CHATBOT ----------------
async function askChatbot() {
    const questionInput = document.getElementById("chatQuestion");
    const question = questionInput.value.trim();

    if (!question) return;

    appendMessage("user", question);
    questionInput.value = "";

    try {
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: question,
                job_role: AppState.analysisResult?.predicted_job_role || "",
                missing_skills: AppState.analysisResult?.missing_skills || []
            })
        });

        if (!response.ok) {
            throw new Error("Chatbot backend error");
        }

        const data = await response.json();
        appendMessage("bot", data.answer);

    } catch (error) {
        console.error(error);
        appendMessage("bot", "Unable to reach chatbot service.");
    }
}

// ---------------- CHAT UI ----------------
function appendMessage(sender, text) {
    const chatMessages = document.getElementById("chatMessages");

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
        </div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ---------------- EVENT LISTENERS ----------------
function setupEventListeners() {
    document.getElementById("resumeFile").addEventListener("change", (e) => {
        handleFileSelect(e.target.files[0]);
    });

    document.querySelectorAll(".quick-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("chatQuestion").value =
                btn.getAttribute("data-question");
            askChatbot();
        });
    });

    document.getElementById("chatQuestion").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            askChatbot();
        }
    });
}

// ---------------- EXPOSE FUNCTIONS ----------------
window.uploadResume = uploadResume;
window.askChatbot = askChatbot;
