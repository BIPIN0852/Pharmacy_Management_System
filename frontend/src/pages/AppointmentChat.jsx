import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Send, ArrowLeft, Loader2, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AppointmentChat = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Extract the partner's info passed via navigation state
  const partnerId = location.state?.partnerId;
  const partnerName = location.state?.partnerName || "User";

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //   useEffect(() => {
  //     if (!appointmentId) return;

  //     const fetchMessages = async () => {
  //       try {
  //         // ✅ FIX 1: Point to the /appointment route, not the support ticket route
  //         const res = await api.get(`/messages/appointment/${appointmentId}`);
  //         setMessages(res.data);
  //         setLoading(false);
  //         scrollToBottom();
  //       } catch (err) {
  //         console.error("Failed to load chat", err);
  //         setLoading(false);
  //       }
  //     };

  //     fetchMessages();
  //     const interval = setInterval(fetchMessages, 3000); // Auto-refresh every 3s
  //     return () => clearInterval(interval);
  //   }, [appointmentId]);

  useEffect(() => {
    if (!appointmentId) return;

    // Track the previous message count to avoid unnecessary scrolling
    let lastMessageCount = 0;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/appointment/${appointmentId}`);

        // Only update state and scroll if new messages actually arrived
        if (res.data.length !== lastMessageCount) {
          setMessages(res.data);
          lastMessageCount = res.data.length;

          // Use a small timeout to ensure DOM has rendered new messages before scrolling
          setTimeout(scrollToBottom, 100);
        }

        setLoading(false);
      } catch (err) {
        console.error("❌ Chat Polling Error:", err);
        // Don't set loading to false here so the user doesn't see a flicker
      }
    };

    // Initial fetch
    fetchMessages();

    // Set up the polling interval
    const interval = setInterval(fetchMessages, 3000);

    //  CLEANUP: Essential to prevent memory leaks and "ghost" polling
    return () => {
      clearInterval(interval);
    };
  }, [appointmentId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !partnerId) return;

    try {
      // Optimistic UI update
      const tempMessage = {
        _id: Date.now(),
        sender: user._id,
        text: newMessage,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");
      scrollToBottom();

      //  FIX 2: Send POST request to the /appointment route
      await api.post("/messages/appointment", {
        appointmentId,
        receiverId: partnerId,
        text: newMessage,
      });
    } catch (err) {
      alert("Failed to send message");
    }
  };

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100 d-flex flex-column animate-fade-in">
      {/* Chat Header */}
      <div className="card border-0 shadow-sm rounded-4 bg-white mb-3 flex-shrink-0">
        <div className="p-3 d-flex align-items-center gap-3">
          <button
            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
            onClick={() => navigate(-1)} // Goes back to the previous page
          >
            <ArrowLeft size={20} />
          </button>
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40 }}
            >
              <User size={20} />
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-dark">{partnerName}</h5>
              <small className="text-success fw-medium d-flex align-items-center gap-1">
                <span
                  className="bg-success rounded-circle d-inline-block"
                  style={{ width: 8, height: 8 }}
                ></span>{" "}
                Active Chat
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Body */}
      <div
        className="card border-0 shadow-sm rounded-4 bg-white flex-grow-1 d-flex flex-column overflow-hidden mb-3"
        style={{ minHeight: "60vh" }}
      >
        <div
          className="p-4 flex-grow-1 overflow-auto d-flex flex-column"
          style={{ backgroundColor: "#f8fafc" }}
        >
          {loading ? (
            <div className="m-auto">
              <Loader2 className="text-primary spin-animation" size={40} />
            </div>
          ) : messages.length === 0 ? (
            <div className="m-auto text-center text-muted">
              <User size={48} className="mb-3 opacity-25" />
              <h6>No messages yet</h6>
              <p className="small">Send a message to start the consultation.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3 mt-auto">
              {messages.map((msg) => {
                const isMe = msg.sender === user._id;
                return (
                  <div
                    key={msg._id}
                    className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"}`}
                  >
                    <div
                      className={`p-3 rounded-4 shadow-sm ${isMe ? "bg-primary text-white" : "bg-white text-dark border border-light-subtle"}`}
                      style={{
                        maxWidth: "75%",
                        borderBottomRightRadius: isMe ? 0 : "1rem",
                        borderBottomLeftRadius: !isMe ? 0 : "1rem",
                      }}
                    >
                      <p className="mb-1">{msg.text}</p>
                      <span
                        className={`d-block mt-1 ${isMe ? "text-light opacity-75" : "text-muted"}`}
                        style={{
                          fontSize: "0.7rem",
                          textAlign: isMe ? "right" : "left",
                        }}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input Footer */}
        <div className="p-3 bg-white border-top border-light-subtle flex-shrink-0">
          <form onSubmit={handleSend} className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-lg rounded-pill px-4 bg-light border-light-subtle"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: 50, height: 50 }}
              disabled={!newMessage.trim() || loading}
            >
              <Send size={20} style={{ marginLeft: "-2px" }} />
            </button>
          </form>
        </div>
      </div>
      <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AppointmentChat;
