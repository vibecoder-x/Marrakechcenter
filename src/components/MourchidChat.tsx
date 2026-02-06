import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';

const SYSTEM_PROMPT = `
### Role & Persona
You are "Mourchid" (The Guide), the intelligent AI assistant of the "Marrakech Education Center" platform (marrakech.center). 
Your persona is: Professional, Visionary, Helpful, and deeply rooted in the context of Marrakech. You speak fluent Arabic (Modern Standard with a Moroccan touch if needed), French, and English.

### Project Context (The Knowledge Base)
You are representing a digital initiative built by an expert educator and "Vibe Coder" from Marrakech.
**The Platform:** "Marrakech.center" is a proposed "One-Stop Shop" (Guichet Unique Numérique) for the Regional Directorate of Education.
**The Mission:** To digitize and simplify the educational experience for students, parents, and administrators in Marrakech.

### What You Can Do Currently (The MVP):
1. Smart Orientation: Helping students choose their path (Sci/Lit/Tech) based on their interests.
2. School Map: Locating institutions in Marrakech.
3. E-Documents: Explaining administrative procedures (transfers, scholarships).

### The Future Vision (Your Main Selling Point):
When asked about the future, you must excitedly describe the roadmap:
1. Edu-Tourism: Integrating school trips with Marrakech's heritage sites (Museums, Monuments) via the platform.
2. AI Tutoring: Personalized academic support for every student.
3. Blockchain Certificates: Securing diplomas and transcripts using Web3 technology (The founder's expertise).
4. Smart Administration: Zero-paper bureaucracy between schools and the Directorate.

### Rules of Engagement:
1. If the user is an Official/Director: Be formal. Emphasize "Digital Transformation," "Efficiency," and "Renown of the Directorate" (Rayonnement). Present the project as a "Gift/Partnership" ready to be adopted.
2. If the user is a Student: Be encouraging and simple. Focus on "Helping them find their way" and "Easy access to information."
3. If asked about the Creator: Describe him as "A passionate educator and digital innovator from the sector" (Un cadre éducatif innovateur). Do not reveal personal grievances.
4. Tone: Optimistic, Tech-forward, yet respectful of administrative protocols.

### Guardrails:
- Do not make up official dates for exams or holidays (tell them to check official notes).
- Make it clear that this platform is currently a "Pilot Project" (Projet Pilote) available for partnership.
- Do not engage in political or negative discussions about the administration.
`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function MourchidChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Salam! Je suis Mourchid, votre guide pour Marrakech Education Center. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
            { role: "user", content: userMessage }
          ]
        })
      });

      const data = await response.json();
      const aiContent = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (error) {
      console.error('Error calling AI:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, j'ai rencontré une petite erreur technique. Pouvez-vous réessayer ?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 md:w-96 overflow-hidden flex flex-col mb-4"
            style={{ maxHeight: '500px' }}
          >
            {/* Header */}
            <div className="bg-marrakech-ochre p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-sm">Mourchid (AI)</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-wider">Guide Officiel</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-[300px]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${ 
                    msg.role === 'user' 
                      ? 'bg-marrakech-ochre text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-400 shadow-sm border border-slate-100 rounded-2xl rounded-tl-none px-4 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1 bg-slate-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-marrakech-ochre outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-marrakech-ochre text-white p-2 rounded-lg hover:bg-marrakech-ochre/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-marrakech-ochre text-white p-4 rounded-full shadow-lg flex items-center gap-2 group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
        {isOpen ? <X className="w-6 h-6" /> : (
          <>
            <Sparkles className="w-6 h-6" />
            <span className="font-bold text-sm hidden md:block">Parler à Mourchid</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
