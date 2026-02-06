import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, Loader2, Mic, Volume2, Square } from 'lucide-react';

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

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function MourchidChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Salam! Je suis Mourchid, votre guide pour Marrakech Education Center. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      synthRef.current.cancel();
    };
  }, []);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = (overrideInput || input).trim();
    if (!textToSend || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
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
            { role: "user", content: textToSend }
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

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      // handleSend will be triggered by the user clicking, but since we want it automatic
      // we'll rely on the input state being updated by onresult
      setTimeout(() => handleSend(), 100); 
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR'; 
    recognition.interimResults = true;
    recognition.continuous = true; // Keep listening until manual stop
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          // You can still show interim results if you want, 
          // but for sending we care about the built up text
          finalTranscript = event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const speakMessage = (text: string, index: number) => {
    if (speakingMessageId === index) {
      synthRef.current.cancel();
      setSpeakingMessageId(null);
      return;
    }

    synthRef.current.cancel(); // Stop any current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to select a natural voice (French/Arabic priority)
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') && (voice.lang.startsWith('fr') || voice.lang.startsWith('ar'))
    ) || voices.find(voice => voice.lang.startsWith('fr') || voice.lang.startsWith('ar'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(index);
    synthRef.current.speak(utterance);
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
                  <div className={`max-w-[85%] flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`rounded-2xl px-4 py-2 text-sm relative group ${ 
                      msg.role === 'user' 
                        ? 'bg-marrakech-ochre text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.content}
                      {msg.role === 'assistant' && (
                        <button 
                          onClick={() => speakMessage(msg.content, idx)}
                          className="absolute -right-8 top-1 p-1.5 text-slate-400 hover:text-marrakech-ochre hover:bg-slate-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          title="Lire le message"
                        >
                          {speakingMessageId === idx ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
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
            <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Posez votre question..."
                  className="w-full bg-slate-100 border-none rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-marrakech-ochre outline-none"
                />
                <button
                  onClick={startRecording}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
                    isRecording 
                      ? 'text-marrakech-ochre bg-marrakech-ochre/10 ring-2 ring-marrakech-ochre/30 animate-pulse' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Utiliser le microphone"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
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
