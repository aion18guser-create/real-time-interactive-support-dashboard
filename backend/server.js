const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS so our React frontend can talk to this server
app.use(cors());
app.use(express.json());

// Basic health check route for Express
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server operational' });
});

// Create HTTP server and bind Socket.io to it
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Allow connections from Vite dev server
    methods: ['GET', 'POST']
  }
});

// Sample ticket data pool to simulate real user issues
const sampleIssues = [
  { title: 'Payment gateway timeout on checkout page', category: 'Bug', priority: 'High' },
  { title: 'Add dark mode toggle in user settings', category: 'Feature', priority: 'Low' },
  { title: 'Login session expires too quickly for mobile users', category: 'Bug', priority: 'Medium' },
  { title: 'Export transaction report to PDF feature request', category: 'Feature', priority: 'Medium' },
  { title: 'Database connection spike causing 504 gateway errors', category: 'Bug', priority: 'High' },
  { title: 'Update homepage banner with new discount promo', category: 'Feature', priority: 'Low' },
  { title: 'Password reset link not arriving in email inbox', category: 'Bug', priority: 'High' },
  { title: 'Profile avatar upload fails with larger JPG files', category: 'Bug', priority: 'Medium' },
  { title: 'Ability to sort support tickets by date created', category: 'Feature', priority: 'Low' }
];

let ticketCounter = 101;

// Function to generate a random mock ticket
function generateMockTicket() {
  const randomIndex = Math.floor(Math.random() * sampleIssues.length);
  const selectedIssue = sampleIssues[randomIndex];

  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const ticket = {
    id: `TCK-${ticketCounter++}`,
    title: selectedIssue.title,
    priority: selectedIssue.priority,
    category: selectedIssue.category,
    timestamp: formattedTime
  };

  return ticket;
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Send a welcome event to newly connected client
  socket.emit('connection_success', { message: 'Connected to live ticket stream' });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Interval to broadcast a new mock ticket every 4.5 seconds
setInterval(() => {
  const newTicket = generateMockTicket();
  // Broadcast to all connected frontend clients
  io.emit('new_ticket', newTicket);
  console.log(`[Live Ticket Generated]: ${newTicket.id} - ${newTicket.title} (${newTicket.priority})`);
}, 4500);

// Start listening on port 5000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Socket.io ready on port ${PORT}`);
});
