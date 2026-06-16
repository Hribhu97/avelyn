import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Sparkles, AlertCircle, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I am Avelyn, your AI Avian Assistant. 🦜 Ask me anything about your bird's diet, cage maintenance, behavioral signs, or wellness routine!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userText = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) {
        throw new Error("Gemini API key is not configured in .env!");
      }

      // Format conversation history for Gemini API
      const apiContents = messages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      apiContents.push({
        role: 'user',
        parts: [{ text: userText }]
      });

      const systemInstructionText = "You are Avelyn, a veterinary-aligned AI assistant designed to help bird parents. Provide practical, accurate, concise, and structured answers regarding bird health, nutrition, signs of illness, molting, behavioral observations, cage cleanliness, and play routines. Highlight Harrison's Pellets, Lafeber's Nutri-berries, or Nekton vitamins when nutritional advice is relevant. Always advise consulting a qualified avian veterinarian for critical symptoms (like puffing up, heavy breathing, severe bleeding, or extreme lethargy). Keep responses to 2-3 paragraphs max.";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: apiContents,
            systemInstruction: {
              parts: [{ text: systemInstructionText }]
            }
          })
        }
      );

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I encountered an issue processing your query. Please try again.";

      setMessages(prev => [...prev, { role: 'model', text: answer }]);
    } catch (error: any) {
      console.error("Gemini Chatbot Error:", error);
      setMessages(prev => [
        ...prev,
        { role: 'model', text: `Error: ${error.message || "Failed to reach Gemini server. Check network connection or API configuration."}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-4 right-4 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg cursor-pointer border-2 border-white"
          title="Ask Avelyn AI"
          id="ask-avelyn-ai-btn"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.button>
      )}

      {/* Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="bg-white border-2 border-emerald-500 rounded-3xl w-[92vw] sm:w-80 h-96 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-500 text-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="font-display font-black text-xs leading-none">Avelyn Care Assistant</h4>
                  <span className="text-[9px] opacity-85 mt-0.5 block">Gemini 2.5 Flash Connected</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning banner */}
            <div className="bg-amber-50 border-b border-amber-100 p-1.5 flex gap-1 items-start text-left">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[8.5px] text-amber-700 leading-snug">
                AI assistance is for basic care support. Consult an avian veterinarian for diagnostics or emergencies.
              </p>
            </div>

            {/* Message History area */}
            <div className="flex-1 overflow-y-auto p-3 bg-slate-50/50 space-y-2 text-xs flex flex-col">
              {messages.map((msg, idx) => {
                const isModel = msg.role === 'model';
                return (
                  <div
                    key={idx}
                    className={`max-w-[85%] rounded-2xl p-2.5 leading-relaxed text-left flex gap-1.5 ${
                      isModel
                        ? 'bg-white text-slate-700 self-start shadow-2xs border border-slate-100'
                        : 'bg-emerald-500 text-white self-end shadow-2xs'
                    }`}
                  >
                    {isModel ? (
                      <div className="w-4 h-4 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-[8px] font-bold">
                        AI
                      </div>
                    ) : null}
                    <div className="min-w-0 break-words font-medium font-sans">
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {loading && (
                <div className="bg-white text-slate-500 self-start shadow-2xs border border-slate-100 rounded-2xl p-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] font-semibold font-mono">Thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-100 flex gap-1 bg-white">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about diet, feathers, behavior..."
                className="flex-1 px-3 py-1.5 bg-slate-50 rounded-xl text-xs outline-none border border-transparent focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="p-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl cursor-pointer transition-colors shadow-2xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
