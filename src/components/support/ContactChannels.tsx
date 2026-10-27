import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { ContactChannelItem } from './types';
import { CONTACT_CHANNELS } from './supportData';

export interface ContactChannelsProps {
  channels?: ContactChannelItem[];
  onOpenChat: () => void;
  className?: string;
}

export const ContactChannels: React.FC<ContactChannelsProps> = ({
  channels = CONTACT_CHANNELS,
  onOpenChat,
  className = '',
}) => {
  return (
    <div
      data-testid="contact-channels"
      className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between min-w-0 ${className}`}
    >
      <div>
        {/* Header matching reference */}
        <div className="pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
            Связаться с нами
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Выберите удобный способ связи
          </p>
        </div>

        {/* Channels List */}
        <div className="space-y-3 mt-4">
          {channels.map((channel) => {
            const IconComponent = channel.icon;
            const isChat = channel.type === 'chat';

            const content = (
              <>
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100/60 flex items-center justify-center shrink-0 group-hover:bg-[#047857] group-hover:text-white transition-colors duration-200">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-xs text-slate-500 font-medium block">
                      {channel.title === 'Email' ? 'Электронная почта' : channel.title}
                    </span>
                    {isChat ? (
                      <span className="text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Круглосуточно
                      </span>
                    ) : (
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors mt-0.5 block truncate">
                        {channel.value}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </>
            );

            if (isChat) {
              return (
                <button
                  key={channel.id}
                  type="button"
                  data-testid={`contact-channel-${channel.id}`}
                  onClick={onOpenChat}
                  className="w-full p-3 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex items-center justify-between group cursor-pointer text-left"
                >
                  {content}
                </button>
              );
            }

            return (
              <a
                key={channel.id}
                href={channel.href}
                data-testid={`contact-channel-${channel.id}`}
                target={channel.type === 'telegram' ? '_blank' : undefined}
                rel={channel.type === 'telegram' ? 'noopener noreferrer' : undefined}
                className="p-3 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex items-center justify-between group cursor-pointer no-underline block"
              >
                {content}
              </a>
            );
          })}
        </div>
      </div>

      {/* Response Time Note matching reference */}
      <div className="mt-5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100/50 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 text-emerald-700" />
        </div>
        <div className="min-w-0">
          <span className="text-xs text-slate-500 block leading-tight">
            Среднее время ответа
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight mt-0.5">
            до 2 часов
          </span>
          <span className="sr-only">Среднее время ответа — до 2 часов</span>
        </div>
      </div>
    </div>
  );
};
