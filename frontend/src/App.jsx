import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// URL for our Node.js backend server
const BACKEND_URL = 'http://localhost:5000';

function App() {
  // State to store incoming real-time tickets
  const [tickets, setTickets] = useState([]);
  // State to manage active filter: 'All', 'High', 'Medium', 'Low'
  const [filterPriority, setFilterPriority] = useState('All');
  // State to track if socket is connected
  const [isConnected, setIsConnected] = useState(false);

  // Connect socket on component mount
  useEffect(() => {
    const socket = io(BACKEND_URL);

    // Socket connection event
    socket.on('connect', () => {
      console.log('Connected to WebSocket server:', socket.id);
      setIsConnected(true);
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    // Listen for new tickets emitted from backend
    socket.on('new_ticket', (incomingTicket) => {
      console.log('New ticket received:', incomingTicket);
      // Prepend newest ticket to the top of the list
      setTickets((prevTickets) => [incomingTicket, ...prevTickets]);
    });

    // Cleanup socket listener on component unmount to prevent memory leaks
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_ticket');
      socket.disconnect();
    };
  }, []);

  // Filter tickets based on priority state
  const filteredTickets = tickets.filter((ticket) => {
    if (filterPriority === 'All') return true;
    return ticket.priority.toLowerCase() === filterPriority.toLowerCase();
  });

  // Handler to clear all tickets from current state
  const handleClearAll = () => {
    setTickets([]);
  };

  // Helper function to return CSS class for priority badge
  const getBadgeClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'badge-high';
      case 'medium':
        return 'badge-medium';
      case 'low':
        return 'badge-low';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header section */}
      <header className="dashboard-header">
        <div className="header-info">
          <h1>Real-Time Interactive Support Dashboard</h1>
          <p className="subtitle">Live support incoming feed powered by Node.js & Socket.io</p>
        </div>

        {/* Server connection indicator */}
        <div className="connection-status">
          <span className={`status-dot ${isConnected ? 'online' : 'offline'}`}></span>
          <span>{isConnected ? 'Server Live' : 'Connecting...'}</span>
        </div>
      </header>

      {/* Control Bar: Priority Filters & Clear Action */}
      <section className="controls-bar">
        <div className="filter-group">
          <span className="filter-label">Filter by Priority:</span>
          {['All', 'High', 'Medium', 'Low'].map((level) => (
            <button
              key={level}
              className={`filter-btn ${filterPriority === level ? 'active' : ''}`}
              onClick={() => setFilterPriority(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="action-group">
          <span className="ticket-counter">
            Showing: <strong>{filteredTickets.length}</strong> / {tickets.length} tickets
          </span>
          <button className="clear-btn" onClick={handleClearAll} disabled={tickets.length === 0}>
            Clear All
          </button>
        </div>
      </section>

      {/* Tickets List / Grid */}
      <main className="tickets-section">
        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <p>No tickets available under the selected filter.</p>
            <small>Waiting for new tickets from the backend socket stream...</small>
          </div>
        ) : (
          <div className="tickets-grid">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-top">
                  <span className="ticket-id">{ticket.id}</span>
                  <span className={`priority-badge ${getBadgeClass(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>

                <h3 className="ticket-title">{ticket.title}</h3>

                <div className="ticket-footer">
                  <span className="category-pill">{ticket.category}</span>
                  <span className="ticket-time">{ticket.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
