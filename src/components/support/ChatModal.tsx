import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import supportBotImg from '../../assets/support_bot.jpg';
import { ChatMessage } from './types';

export interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'bot',
    text: 'Здравствуйте! Я AI-ассистент платформы «ИНТЕЛЛИЯ». Готов ответить на любые вопросы по мониторингу, спектральным данным и калибровке созревания.',
    timestamp: 'Сейчас',
  },
];

const QUICK_PROMPTS = [
  'Как откалибровать зрелость?',
  'Загрузка KML-контура',
  'Связаться с агрономом',
];

const BOT_AUTO_REPLIES: Record<string, string> = {
  'Как откалибровать зрелость?':
    'Для калибровки перейдите во вкладку «Данные» -> «Агротехнические данные». Добавьте последние замеры плотности мякоти (кг/см²) и сахаристости Brix. Модель автоматически пересчитает процент зрелости секторов с учетом актуальных полевых проб.',
  'Загрузка KML-контура':
    'Загрузить контур можно в разделе «Карта сада», нажав на инструмент добавления сектора или обратившись к нам с KML/GeoJSON файлом — мы бесплатно выполним геопривязку к вашей спутниковой подложке.',
  'Связаться с агрономом':
    'Передал ваш запрос дежурному агроному. Он подключится к чату или свяжется с вами по телефону в течение 15 минут.',
};

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sendMessage = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Bot auto-reply logic
    setTimeout(() => {
      let botResponse =
        BOT_AUTO_REPLIES[trimmed] ||
        'Спасибо за ваш вопрос! Я зафиксировал обращение. Специалисты службы поддержки свяжутся с вами в ближайшее время.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div
      data-testid="chat-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        data-testid="chat-modal-backdrop"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[560px] max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#05382b] text-white flex items-center justify-between border-b border-emerald-900/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={supportBotImg}
                alt="Бот ИНТЕЛЛИЯ"
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400/40 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#05382b] rounded-full" />
            </div>

            <div>
              <h3
                id="chat-modal-title"
                className="text-sm font-bold text-white flex items-center gap-1.5"
              >
                <span>ИНТЕЛЛИЯ Бот</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              </h3>
              <p className="text-xs text-emerald-200/80">Онлайн • Ответ за секунды</p>
            </div>
          </div>

          <button
            type="button"
            data-testid="chat-modal-close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-emerald-800/40 transition-colors cursor-pointer"
            aria-label="Закрыть чат"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt pills */}
        <div className="bg-emerald-50/70 border-b border-emerald-100/60 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="text-xs whitespace-nowrap bg-white hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200/70 px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div
          data-testid="chat-messages-container"
          className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50"
        >
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mb-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isBot
                      ? 'bg-white text-slate-800 border border-slate-100 rounded-bl-xs'
                      : 'bg-[#07503b] text-white rounded-br-xs'
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                  <span
                    className={`block text-[12px] mt-1 text-right ${
                      isBot ? 'text-slate-400' : 'text-emerald-200/80'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mb-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-500">Бот печатает...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            data-testid="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Задайте ваш вопрос..."
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition-all"
          />

          <button
            type="submit"
            disabled={!inputValue.trim()}
            data-testid="chat-send-button"
            className="w-10 h-10 rounded-xl bg-[#07503b] hover:bg-[#096047] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs"
            aria-label="Отправить сообщение"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
