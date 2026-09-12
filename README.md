# Real-Time Interactive Support Dashboard

A full-stack web project submitted as part of practical placement preparation / final semester submission.

---

## 1. Project Title & Objective

**Project Title:** Real-Time Interactive Support Dashboard  
**Domain:** Full-Stack Web Development / Event-Driven Real-Time Systems  

### Objective
Customer support teams frequently face delays when monitoring critical incidents because standard web apps require manual page refreshes or heavy polling. The main objective of this project is to build an interactive, event-driven support dashboard that receives and displays live incoming support tickets in real-time without refreshing the browser.

Key project goals:
- Establish bi-directional real-time communication between server and client using WebSockets (Socket.io).
- Stream mock incoming customer support tickets automatically from the backend at regular intervals.
- Provide a clean and responsive frontend user interface to dynamically view, filter by priority (`High`, `Medium`, `Low`), and manage the live ticket queue.
- Implement proper state management and clean memory unmounting in React to prevent memory leaks and dangling socket listeners.

---

## 2. System Architecture 

The project is split into two independent modules: a Node.js/Express backend server and a React.js (Vite) client frontend.

---

## 3. Tech Stack & System Requirements

### Technology Stack
- **Backend:**
  - Runtime: Node.js
  - Framework: Express.js
  - WebSocket Engine: Socket.io
  - Middleware: CORS
- **Frontend:**
  - Library: React.js (v18)
  - Tooling / Bundler: Vite
  - Real-Time Client: `socket.io-client`
  - Styling: Pure CSS3 (Flexbox & CSS Grid, no external UI frameworks)
- **Language:** JavaScript (ES6+ / CommonJS for Node, ES Modules for React)

### System Requirements
- Operating System: Windows 10/11, macOS, or Linux
- Node.js: v16.x or higher installed
- Package Manager: `npm` (v8+ recommended)
- Browser: Any modern browser (Google Chrome, Firefox, Edge, Safari)

---

## 4. Local Setup & Execution Guide

Follow these steps to run the complete project locally on your machine.

### Step 1: Clone or Navigate to Project Directory
Open your terminal / command prompt and go to the root project folder:
```bash
cd "Real-Time Interactive Support Dashboard"
```

### Step 2: Start the Backend Server
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Run the backend server:
   ```bash
   npm start
   ```
   *Expected Output:*
   ```text
   Server is running on http://localhost:5000
   Socket.io ready on port 5000
   [Socket.io] Client connected: ...
   [Live Ticket Generated]: TCK-101 - Payment gateway timeout...
   ```
   *Note: You can verify the server health check by opening `http://localhost:5000/api/status` in your browser.*

### Step 3: Start the Frontend Application
1. Open a **new / separate terminal window** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL in your browser (usually `http://localhost:3000` or `http://localhost:5173`).

---

## 5. Key Features Implemented

1. **Live Stream Feed:** Tickets are automatically generated on the backend and broadcasted every 4.5 seconds to all connected clients.
2. **Dynamic Filtering:** Users can filter tickets instantly by priority level (`All`, `High`, `Medium`, `Low`) without re-fetching from the server.
3. **Color-Coded Priority Badges:**
   - **High:** Red badge (`#fee2e2` background, `#dc2626` text)
   - **Medium:** Yellow badge (`#fef3c7` background, `#b45309` text)
   - **Low:** Green badge (`#d1fae5` background, `#047857` text)
4. **Memory Leak Protection:** The React `useEffect` hook cleans up socket listeners (`socket.off`) when the component is unmounted.
5. **State Clearing:** Includes a "Clear All" button to empty the local ticket stream at any time.
6. **Connection Status Indicator:** Visual indicator in the header showing whether the frontend is actively connected to the WebSocket server.

---

## 6. Future Scope / Enhancements
- Integrate a persistent database (MongoDB / PostgreSQL) to save tickets permanently.
- Add an agent response action allowing support representatives to click "Resolve" or "Assign".
- Add audio notifications when a "High" priority ticket arrives.
