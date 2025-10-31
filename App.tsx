import React, { useState, useRef, useEffect } from 'react';
import { ChatMode, ChatMessage } from './types';
import { generateResponse, resetChat } from './services/geminiService';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { SendIcon } from './components/icons/SendIcon';
import { UploadIcon } from './components/icons/UploadIcon';
import { DoctorIcon } from './components/icons/DoctorIcon';
import { PatientIcon } from './components/icons/PatientIcon';
import { SampleFileSelector } from './components/SampleFileSelector';
import { AIChatBubble } from './components/AIChatBubble';
import { ChatBubble } from './components/ChatBubble';
import { RoleSelector } from './components/RoleSelector';
import { PrivacyToggle } from './components/PrivacyToggle';

type UserRole = 'patient' | 'doctor';

const USER_ROLE_KEY = 'airocare-userRole';
const MODE_KEY = 'airocare-mode';
const getMessagesKey = (role: UserRole, mode: ChatMode) => `airocare-messages-${role}-${mode}`;

// Declare pdfjsLib to satisfy TypeScript since it's loaded from a script tag
declare const pdfjsLib: any;

const WelcomeMessage: React.FC<{ mode: ChatMode }> = ({ mode }) => {
  const content = {
    [ChatMode.Patient]: {
      icon: <PatientIcon className="w-16 h-16 text-teal-500 mx-auto" />,
      title: "Patient Mode",
      description: "Welcome! You can ask questions about your health, upload a medical report for a simplified explanation, or try a sample report.",
      disclaimer: "Disclaimer: I am an AI assistant and not a medical professional. Please consult your doctor for any medical advice."
    },
    [ChatMode.Doctor]: {
      icon: <DoctorIcon className="w-16 h-16 text-teal-500 mx-auto" />,
      title: "Doctor Mode",
      description: "Ready to assist, Doctor. Ask for clinical references, dosage guidelines, upload a report, or use a sample for quick analysis.",
      disclaimer: "Disclaimer: This tool is for informational purposes only and is not a substitute for professional clinical judgment."
    }
  };

  const { icon, title, description, disclaimer } = content[mode];

  return (
    <div className="text-center p-8">
      {icon}
      <h2 className="mt-4 text-2xl font-bold text-gray-800">{title}</h2>
      <p className="mt-2 text-md text-gray-600 max-w-md mx-auto">{description}</p>
      <p className="mt-6 text-xs text-gray-500 italic max-w-md mx-auto">{disclaimer}</p>
    </div>
  );
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [mode, setMode] = useState<ChatMode>(ChatMode.Patient);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [notification, setNotification] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage on initial mount
  useEffect(() => {
    const savedRole = localStorage.getItem(USER_ROLE_KEY) as UserRole | null;
    if (savedRole) {
      setUserRole(savedRole);
      
      const savedMode = localStorage.getItem(MODE_KEY) as ChatMode | null;
      const initialMode = savedMode ?? (savedRole === 'doctor' ? ChatMode.Doctor : ChatMode.Patient);
      setMode(initialMode);
      
      const key = getMessagesKey(savedRole, initialMode);
      const savedMessages = localStorage.getItem(key);
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          setMessages([]);
        }
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem(USER_ROLE_KEY, userRole);
      localStorage.setItem(MODE_KEY, mode);
      const key = getMessagesKey(userRole, mode);
      localStorage.setItem(key, JSON.stringify(messages));
    }
  }, [userRole, mode, messages]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    const initialMode = role === 'doctor' ? ChatMode.Doctor : ChatMode.Patient;
    setMode(initialMode);

    const key = getMessagesKey(role, initialMode);
    const savedMessages = localStorage.getItem(key);
    try {
        setMessages(savedMessages ? JSON.parse(savedMessages) : []);
    } catch(e) {
        setMessages([]);
    }
    resetChat();
  };

  const handleModeChange = (newMode: ChatMode) => {
    if (mode !== newMode && userRole === 'doctor') {
      setMode(newMode);
      const key = getMessagesKey(userRole, newMode);
      const savedMessages = localStorage.getItem(key);
       try {
          setMessages(savedMessages ? JSON.parse(savedMessages) : []);
      } catch(e) {
          setMessages([]);
      }
      resetChat();
    }
  }

  const handlePrivacyToggle = (enabled: boolean) => {
    setIsPrivacyMode(enabled);
    if (enabled) {
      if (userRole) {
        const key = getMessagesKey(userRole, mode);
        localStorage.removeItem(key);
      }
      setMessages([]);
      resetChat();
      setNotification('Privacy Mode enabled. Chat has been cleared.');
      setTimeout(() => setNotification(''), 3000);
    } else {
      setNotification('Privacy Mode disabled.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const callAIWithPrompt = async (prompt: string, messageMode: ChatMode = mode) => {
    setIsLoading(true);
    try {
      const responseText = await generateResponse(messageMode, prompt);
      const aiMessage: ChatMessage = { sender: 'ai', text: responseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorJson = JSON.stringify({
        summary: "An unexpected error occurred. Could not get a response from the AI.",
        keyFindings: [{ title: "System Error", explanation: "Please check the console for details.", severity: "high" }]
      });
      const errorMessage: ChatMessage = { sender: 'ai', text: errorJson };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText: string, messageMode: ChatMode = mode) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    await callAIWithPrompt(messageText, messageMode);
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        setNotification('Invalid file format. Please upload a PDF file.');
        setTimeout(() => setNotification(''), 3000);
        if (event.target) event.target.value = '';
        return;
    }

    const userMessage: ChatMessage = { sender: 'user', text: `Analyzing report: ${file.name}` };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            if (!arrayBuffer) throw new Error("Could not read file buffer.");
            
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
            
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            if (!fullText.trim()) {
                throw new Error("This PDF appears to be empty or contains only images.");
            }

            const prompt = `Please provide a detailed analysis and structured breakdown of the following medical report from a PDF:\n\n---\n\n${fullText}`;
            await callAIWithPrompt(prompt);
        } catch (error: any) {
            let errorMessage = "Could not read the PDF file. It might be corrupted or password-protected.";
            if (error.message && error.message.includes("empty")) {
                errorMessage = error.message;
            }
            console.error("PDF Parsing Error:", error);
            const errorJson = JSON.stringify({
                summary: errorMessage,
                keyFindings: [{ title: "PDF Error", explanation: "Please try a different file.", severity: "high" }]
            });
            const aiErrorMessage: ChatMessage = { sender: 'ai', text: errorJson };
            setMessages(prev => [...prev, aiErrorMessage]);
            setIsLoading(false);
        }
    };
    reader.onerror = () => {
         const errorJson = JSON.stringify({
            summary: "Failed to read the file from your device.",
            keyFindings: [{ title: "File Read Error", explanation: "An error occurred while trying to access the file.", severity: "high" }]
        });
        const errorMessage: ChatMessage = { sender: 'ai', text: errorJson };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);

    if (event.target) {
        event.target.value = '';
    }
  };


  const handleSampleSelect = (content: string, type: 'patient' | 'doctor') => {
    const newMode = type === 'patient' ? ChatMode.Patient : ChatMode.Doctor;

    setMessages([]);
    resetChat();
    
    if (userRole === 'doctor') {
      setMode(newMode);
    }
    
    const prompt = `Please provide a detailed analysis and structured breakdown of the following sample medical report:\n\n---\n\n${content}`;
    const userMessage: ChatMessage = { sender: 'user', text: `Analyzing sample ${type} report...` };
    setMessages([userMessage]);
    
    setTimeout(() => callAIWithPrompt(prompt, newMode), 50);
  };

  if (!userRole) {
    return (
      <div className="flex flex-col h-screen font-sans bg-slate-100">
        <RoleSelector onSelectRole={handleRoleSelect} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header isPrivacyMode={isPrivacyMode} />
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto overflow-hidden">
        {userRole === 'doctor' && (
            <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
        )}
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && <WelcomeMessage mode={mode} />}
            {messages.map((msg, index) => (
                msg.sender === 'user' 
                    ? <ChatBubble key={index} message={msg} />
                    : <AIChatBubble key={index} message={msg} />
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl bg-white text-gray-800 shadow-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </main>
        <footer className="p-4 bg-white/60 backdrop-blur-md border-t border-slate-200">
            {notification && (
                <div className="text-center text-sm text-teal-700 font-semibold mb-2 animate-pulse">
                    {notification}
                </div>
            )}
            <div className="flex items-center space-x-2">
                <SampleFileSelector onSampleSelect={handleSampleSelect} userRole={userRole} />
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="application/pdf" />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="p-3 rounded-full text-gray-600 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
                    aria-label="Upload report"
                >
                    <UploadIcon className="w-6 h-6" />
                </button>
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex-1 flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={mode === ChatMode.Patient ? "Ask a health question..." : "Enter clinical query..."}
                      className="w-full px-4 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="ml-2 p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:bg-teal-300 transition-colors"
                        aria-label="Send message"
                    >
                        <SendIcon className="w-6 h-6" />
                    </button>
                </form>
                <div className="border-l border-slate-300 h-8 mx-2"></div>
                <PrivacyToggle isPrivacyMode={isPrivacyMode} onToggle={handlePrivacyToggle} />
            </div>
        </footer>
      </div>
    </div>
  );
};

export default App;