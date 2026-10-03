'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Trash2, Send, Loader2, Key } from 'lucide-react';

type Message = { role: 'user' | 'assistant' | 'system', content: string };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempKey, setTempKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('ai_chat_history');
    if (savedHistory) setMessages(JSON.parse(savedHistory));
    else setMessages([{ role: 'assistant', content: 'Oi, como posso te ajudar hoje?' }]);

    const savedKey = localStorage.getItem('ai_key'); // we reuse the key they already saved in studio!
    if (savedKey) setApiKey(savedKey);
    else setShowConfig(true);
  }, [isOpen]); // Re-check when opened

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const clearChat = () => {
    if (confirm('Limpar toda a conversa?')) {
      const initial = [{ role: 'assistant', content: 'Oi, como posso te ajudar hoje?' }];
      setMessages(initial as Message[]);
      localStorage.setItem('ai_chat_history', JSON.stringify(initial));
    }
  };

  const saveKey = () => {
    if (tempKey.trim()) {
      localStorage.setItem('ai_key', tempKey.trim());
      setApiKey(tempKey.trim());
      setShowConfig(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    // We try to get the most updated key
    const currentKey = localStorage.getItem('ai_key');
    if (!currentKey) {
      setShowConfig(true);
      return;
    }

    const newMessages = [...messages, { role: 'user', content: input.trim() }];
    setMessages(newMessages as Message[]);
    setInput('');
    setLoading(true);

    try {
      const aiProvider = localStorage.getItem('ai_provider') || 'openrouter';
      const endpoint = aiProvider === 'openrouter' ? 'https://openrouter.ai/api/v1/chat/completions' : aiProvider === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' : aiProvider === 'grok' ? 'https://api.x.ai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
      const aiModel = aiProvider === 'openrouter' ? 'openai/gpt-4o' : aiProvider === 'groq' ? 'llama-3.2-90b-vision-preview' : aiProvider === 'grok' ? 'grok-vision-beta' : 'gpt-4o';

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${currentKey}\`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Prompt AI Studio'
        },
        body: JSON.stringify({
          model: aiModel,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!resp.ok) throw new Error('Falha na resposta da API');
      const data = await resp.json();
      const reply = data.choices[0].message.content;

      const updatedHistory = [...newMessages, { role: 'assistant', content: reply }];
      setMessages(updatedHistory as Message[]);
      localStorage.setItem('ai_chat_history', JSON.stringify(updatedHistory));
    } catch (e) {
      const errorMsg = [...newMessages, { role: 'assistant', content: 'Desculpe, ocorreu um erro de conexão. Verifique sua chave.' }];
      setMessages(errorMsg as Message[]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-[#111] border border-[#333] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-200" style={{ animation: 'slideUp 0.2s ease-out' }}>
          
          <div className="bg-[#1a1a1a] border-b border-[#333] p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">IA</div>
              <div>
                <h3 className="font-semibold text-sm leading-tight text-white">Assistente Criativo</h3>
                <p className="text-[11px] text-green-400">Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={clearChat} className="text-gray-400 hover:text-white transition" title="Limpar conversa">
                <Trash2 size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
          </div>

          {showConfig && (
            <div className="bg-[#1a1a1a] p-4 border-b border-[#333] text-sm">
              <p className="mb-2 text-gray-400 text-xs flex items-center gap-1"><Key size={12}/> Insira sua chave de API para usar o chat.</p>
              <input type="password" value={tempKey} onChange={e => setTempKey(e.target.value)} placeholder="sk-..." className="w-full bg-[#111] border border-[#444] rounded-lg px-3 py-2 outline-none focus:border-indigo-500 mb-2 text-white" />
              <button onClick={saveKey} className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-lg py-2 font-medium text-white text-xs">Salvar Chave Localmente</button>
            </div>
          )}

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-sm bg-[#111] custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={\`max-w-[85%] rounded-2xl px-4 py-2 \${m.role === 'user' ? 'bg-indigo-600 text-white self-end rounded-br-sm' : 'bg-[#1a1a1a] border border-[#333] text-gray-200 self-start rounded-bl-sm'}\`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-[#1a1a1a] border border-[#333] self-start rounded-bl-sm flex gap-1 items-center h-[40px]">
                <Loader2 size={15} className="animate-spin text-gray-400"/>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-[#1a1a1a] border-t border-[#333] flex gap-2 items-end">
            <textarea 
              rows={1} 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Pergunte algo..." 
              className="flex-1 bg-[#111] border border-[#444] rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white resize-none"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button disabled={loading} onClick={sendMessage} className="bg-indigo-600 hover:bg-indigo-700 transition p-3 rounded-xl shadow-lg flex-shrink-0 text-white disabled:opacity-50">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center text-white hover:scale-105">
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>

      <style dangerouslySetInnerHTML={{__html:\`
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 10px; }
      \`}} />
    </div>
  );
}
