import { useState } from "react";
import Input from "./Input";
import SideBar from "./SideBar";
import Header from "./Header";
import ChatArea from "./ChatArea";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hello! I'm your **MOSDAC Virtual Assistant**. I'm here to help you with any questions about MOSDAC services, data, or applications. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat/mosdac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      const botMessage = { role: "bot", content: data.answer || "I'm sorry, I couldn't process your request." };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000); // Simulate processing time

    } catch (err) {
      console.error("Error:", err);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "bot",
          content: "❌ I'm experiencing some technical difficulties. Please try again later."
        }]);
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 relative">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

        {/* Chat Area */}
        <ChatArea messages={messages} isLoading={isLoading} />

        {/* Input Area */}
        <Input input={input} setInput={setInput} sendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}