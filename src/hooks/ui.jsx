import { useChat } from "./useChat";
import { useState } from "react";

export const ChatInterface = () => {
  const { chat, loading, chatMode, toggleChatMode, message } = useChat();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !loading) {
      chat(input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      {/* Mode Toggle Button */}
      <div style={styles.modeToggle}>
        <button 
          onClick={toggleChatMode}
          style={{
            ...styles.toggleButton,
            backgroundColor: chatMode === "audio" ? "#4CAF50" : "#2196F3"
          }}
        >
          {chatMode === "audio" ? "🎤 Audio Mode" : "💬 Text Mode"}
        </button>
        <span style={styles.modeDescription}>
          {chatMode === "audio" 
            ? "Bot will speak responses with lipsync" 
            : "Bot will only show text responses"}
        </span>
      </div>

      {/* Chat Messages Display */}
      <div style={styles.messagesContainer}>
        {message && (
          <div style={styles.messageBox}>
            <p style={styles.messageText}>{message.text}</p>
            {chatMode === "audio" && message.audio && (
              <span style={styles.audioIndicator}>🔊 Playing audio...</span>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={styles.inputContainer}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Ask me anything... (${chatMode} mode)`}
          style={styles.textarea}
          disabled={loading}
          rows={3}
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            ...styles.sendButton,
            opacity: (loading || !input.trim()) ? 0.5 : 1
          }}
        >
          {loading ? "⏳ Processing..." : "Send 📤"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "400px",
    maxHeight: "600px",
    backgroundColor: "#fff",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    zIndex: 1000,
  },
  modeToggle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingBottom: "10px",
    borderBottom: "2px solid #eee",
  },
  toggleButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "25px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  modeDescription: {
    fontSize: "12px",
    color: "#666",
    fontStyle: "italic",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    minHeight: "200px",
  },
  messageBox: {
    backgroundColor: "#e3f2fd",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  messageText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#333",
  },
  audioIndicator: {
    display: "block",
    marginTop: "10px",
    fontSize: "12px",
    color: "#4CAF50",
    fontWeight: "bold",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "2px solid #ddd",
    resize: "none",
    fontFamily: "inherit",
    outline: "none",
  },
  sendButton: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default ChatInterface;