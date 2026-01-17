import { createContext, useContext, useEffect, useState } from "react";

// const backendUrl = "http://localhost:3000";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  
  const [currentResponse, setCurrentResponse] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioGenerating, setAudioGenerating] = useState(false);

  const chat = async (userMessage) => {
    try {
      setLoading(true);
      setCurrentResponse(null);
      setIsPlayingAudio(false);

      // Get TEXT response first (instant)
      const res = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          textOnly: true
        }),
      });

      const data = await res.json();
      
      if (data.error || !data.messages || data.messages.length === 0) {
        throw new Error(data.error || "Received an empty or invalid response from backend.");
      }

      const msg = data.messages[0];

      // Show text immediately
      setCurrentResponse({
        text: msg.text,
        hasAudio: false,
        audioData: null,
      });

      setLoading(false);

      // AUTO-GENERATE AUDIO immediately after text appears
      generateAndPlayAudio(msg.text);

    } catch (err) {
      console.error("Chat Error:", err);
      setCurrentResponse({
        text: "Error: Could not process your request. Check console for details.",
        hasAudio: false,
        audioData: null,
      });
      setLoading(false);
    }
  };

  // Auto-generate and play audio
  const generateAndPlayAudio = async (text) => {
    try {
      setAudioGenerating(true);

      console.log("🎤 Auto-generating audio...");

      const res = await fetch(`${backendUrl}/audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      
      if (data.error) {
        throw new Error("Failed to generate audio");
      }

      const audioMsg = {
        text: text,
        audio: data.audio,
        lipsync: data.lipsync || [
          { start: 0, end: 0.18, value: "A" },
          { start: 0.18, end: 0.42, value: "O" },
        ],
        animation: data.animation || "Talking_1",
        facialExpression: data.facialExpression || "smile",
      };

      // Save audio data
      setCurrentResponse((prev) => ({
        ...prev,
        hasAudio: true,
        audioData: audioMsg,
      }));

      // AUTO-PLAY
      setMessages([audioMsg]);
      setIsPlayingAudio(true);

    } catch (err) {
      console.error("Audio generation error:", err);
    } finally {
      setAudioGenerating(false);
    }
  };

  // Replay audio
  const playAudio = () => {
    if (currentResponse?.audioData) {
      setMessages([currentResponse.audioData]);
      setIsPlayingAudio(true);
    }
  };

  // Stop/Pause audio
  const stopAudio = () => {
    setMessages([]);
    setIsPlayingAudio(false);
  };

  const onMessagePlayed = () => {
    setMessages((prev) => prev.slice(1));
    setIsPlayingAudio(false);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        currentResponse,
        isPlayingAudio,
        audioGenerating,
        playAudio,
        stopAudio,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};