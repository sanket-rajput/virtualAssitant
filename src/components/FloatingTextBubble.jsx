import { useChat } from "../hooks/useChat";
import { useEffect } from "react";

export const FloatingTextBubble = () => {
  const { currentResponse, loading } = useChat();

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeInSlide {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
        40% { transform: scale(1.2); opacity: 1; }
      }

      .bubble-container {
        animation: fadeInSlide 0.4s ease-out;
      }

      .loading-dot {
        animation: bounce 1.4s infinite ease-in-out both;
      }

      .loading-dot:nth-child(1) { animation-delay: -0.32s; }
      .loading-dot:nth-child(2) { animation-delay: -0.16s; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!currentResponse && !loading) return null;

  return (
    <div
      className="bubble-container fixed z-50 pointer-events-auto"
      style={{
        top: "50%",
        right: "50px",
        transform: "translateY(-50%)",
        maxWidth: "420px",
      }}
    >
      {/* Main Bubble */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl border-2 border-gray-200"
        style={{
          padding: "24px 28px",
        }}
      >
        {loading ? (
          // Loading State
          <div className="text-center py-2">
            <div className="flex justify-center gap-2 mb-3">
              <div className="loading-dot w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="loading-dot w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="loading-dot w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-sm font-medium">Thinking...</p>
          </div>
        ) : (
          // Just Text - No Button
          <p
            className="text-gray-800 leading-relaxed"
            style={{
              fontSize: "15px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
            }}
          >
            {currentResponse?.text}
          </p>
        )}

        {/* Speech Bubble Tail (pointing left to avatar) */}
        <div
          style={{
            position: "absolute",
            left: "-18px",
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "12px solid transparent",
            borderBottom: "12px solid transparent",
            borderRight: "20px solid white",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "14px solid transparent",
            borderBottom: "14px solid transparent",
            borderRight: "22px solid #e5e7eb",
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
};

export default FloatingTextBubble;