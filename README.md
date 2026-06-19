# Email Writer Assistant 📧✍️

An AI-powered email writing assistant consisting of a Spring Boot backend API, a React Vite frontend web application, and a Google Chrome extension built specifically for Microsoft Outlook.

## 📁 Repository Structure

This is a monorepo containing three distinct project components:
```text
EmailWriterAssistant/
├── email-writer-backend/          # Spring Boot REST API
├── email-writer-frontend/         # React + Vite Web Interface
└── email-writer-chrome-extension/ # Chrome Extension for Outlook
```

---

## 🚀 Components Overview

### 1. Backend (`email-writer-backend`)
The backbone of the application, serving as a secure REST API that handles requests and communicates with AI models to generate email responses.
* **Tech Stack:** Java, Spring Boot, Spring Web (REST).
* **Key Features:** RESTful endpoints for email prompt processing and response generation.

### 2. Frontend (`email-writer-frontend`)
A sleek, responsive standalone web interface where users can manually input email context and generate replies.
* **Tech Stack:** React, Vite, JavaScript/TypeScript, CSS/Tailwind.
* **Key Features:** Fast development build, intuitive dashboard, and instant API integration.

### 3. Chrome Extension (`email-writer-chrome-extension`)
A productivity tool that injects the email assistant directly into the Google Chrome browser interface when using Microsoft Outlook.
* **Tech Stack:** JavaScript, HTML, CSS (Chrome Extension Manifest V3).
* **Key Features:** DOM manipulation to seamlessly read/insert text directly inside Outlook email composition boxes.

---

## 🛠️ Local Setup & Installation

Follow these steps to run the entire ecosystem locally.

### Prerequisites
* Java 17 or higher (for backend)
* Maven (for backend)
* Node.js & npm (for frontend)
* Google Chrome Browser (for extension)

### Setup the Backend
1. Navigate to the backend directory:
   ```bash
   cd email-writer-backend
   ```
2. Build and run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
3. The server will start locally (usually on `http://localhost:8080`).

### Setup the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../email-writer-frontend
   ```
2. Install the node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL (usually `http://localhost:5173`) in your browser.

### Install the Chrome Extension
1. Open Google Chrome and type `chrome://extensions/` in the URL bar.
2. Enable **Developer mode** using the toggle switch in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the `email-writer-chrome-extension` folder from this repository.
5. Open Microsoft Outlook on the web to see the extension in action!

---

## 📝 License
This project is licensed under the MIT License.
