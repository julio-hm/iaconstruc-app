

import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Button from './Button';
import { Message } from '../types';
import * as geminiService from '../services/geminiService';
import Panel from './ui/Panel';

interface AIChatScreenProps {
  onBack: () => void;
}

const AIChatScreen: React.FC<AIChatScreenProps> = ({ onBack }) => {
  const { t } = useContext(AppContext);
  const [messages, setMessages] = useState<Message[]>([{ role: 'model', text: t('ai_chat_welcome') }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    const userMessage: Message = { role: 'user', text: currentInput };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForAPI = messages.map(m => ({
        role: m.role,
        parts: [{ text: String(m.text || '') }]
      }));

      const response = await geminiService.sendChatMessage(historyForAPI, currentInput, t);
      
      const modelMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);

    } catch (err) {
      const errorMessageText = `Details: ${err instanceof Error ? err.message : String(err)}`;
      const errorMessage: Message = { role: 'model', text: `${t('ai_assistant_generic_error')}. ${errorMessageText}` };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-10rem)] max-h-[800px]">
      <header className="flex items-center justify-between flex-wrap gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('ai_chat_title')}</h1>
          <p className="text-gray-300 mt-1">{t('ai_chat_description')}</p>
        </div>
        <Button onClick={onBack} variant="secondary">
          {t('calculator_back_button')}
        </Button>
      </header>
      
      <Panel className="flex-grow flex flex-col p-4">
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-2 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl p-3 rounded-xl ${
                  msg.role === 'user' 
                  ? 'bg-pink-600 text-white rounded-br-none' 
                  : 'bg-white/10 backdrop-blur-sm text-gray-200 rounded-bl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
           {isLoading && messages[messages.length-1]?.role === 'user' && (
             <div className="flex justify-start">
               <div className="max-w-xl p-3 rounded-xl bg-white/10 backdrop-blur-sm text-gray-200 rounded-bl-none">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                 </div>
               </div>
             </div>
           )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/20 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('ai_chat_placeholder')}
              disabled={isLoading}
              className="bg-white/5 border border-white/20 text-gray-100 text-sm rounded-full block w-full p-3 pl-4 pr-16 focus:ring-pink-500 focus:border-pink-500"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()}
              className="absolute top-1/2 right-1.5 -translate-y-1/2 !rounded-full !p-2"
              aria-label={t('ai_chat_send_button')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default AIChatScreen;
