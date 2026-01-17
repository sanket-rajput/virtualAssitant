import { useRef } from "react";
import { useChat } from "../hooks/useChat";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message, isPlayingAudio, stopAudio, playAudio, currentResponse } = useChat();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };
  
  if (hidden) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        {/* Header */}
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
          <h1 className="font-black text-xl">INC, PICT</h1>
          <p>Impetus | Pradnya | Concepts</p>
        </div>

        {/* Video Button - MOVED TO TOP RIGHT */}
        <div className="absolute top-4 right-4 flex flex-col gap-4">
          <button
            onClick={() => {
              const body = document.querySelector("body");
              if (body.classList.contains("greenScreen")) {
                body.classList.remove("greenScreen");
              } else {
                body.classList.add("greenScreen");
              }
            }}
            className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-md shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </button>
        </div>

        {/* Input Box at Bottom with Audio Control */}
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
          <input
  className={`
    w-full px-4 py-3 rounded-xl
    bg-white/10 backdrop-blur-xl
    border border-white/20
    text-white placeholder:text-gray-300 placeholder:italic
    shadow-inner
    transition-all duration-300

    focus:outline-none focus:ring-2 focus:ring-blue-500/60
    focus:border-blue-500/50
    hover:bg-white/20
  `}
  placeholder="Type a message..."
  ref={input}
  onKeyDown={(e) => {
    if (e.key === "Enter") sendMessage();
  }}
/>

          
          {/* Audio Control Button - Beside Input */}
          
          <button
  disabled={loading || message}
  onClick={sendMessage}
  className={`
    relative overflow-hidden
    bg-gradient-to-r from-blue-600 to-indigo-600
    text-white font-semibold tracking-wide uppercase
    px-10 py-4 rounded-xl
    shadow-lg shadow-blue-500/30
    transition-all duration-300 ease-out

    hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-600/40
    active:scale-[0.97]

    ${loading || message ? "cursor-not-allowed opacity-40 grayscale" : ""}
  `}
>
  Send
</button>

        </div>
      </div>
    </>
  );
};