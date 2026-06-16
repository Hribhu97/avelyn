import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Share2, Check, Copy, Sparkles, Smile, ShieldCheck } from 'lucide-react';

interface StickerItem {
  id: string;
  name: string;
  quote: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
}

const STICKERS: StickerItem[] = [
  {
    id: 'st-1',
    name: "Kiwi's Fresh Pellet Lord",
    quote: "VEGGIES OVER SEEDS, BIRDY PLEASE! 🥦🥕",
    emoji: '🟢🦜🟢',
    bgGradient: 'from-emerald-400 to-green-500',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700'
  },
  {
    id: 'st-2',
    name: 'Splish Splash Water King',
    quote: "DRINKING HEALTHY, BREATHING SHINY! 💧🛁",
    emoji: '🛀💦🛀',
    bgGradient: 'from-sky-400 to-blue-500',
    borderColor: 'border-sky-300',
    textColor: 'text-sky-700'
  },
  {
    id: 'st-3',
    name: 'Free Flight Captain',
    quote: "SUPERVISED FLYER, HIGH-FLY INSPIRED! ✈️💨",
    emoji: '🚀👑🚀',
    bgGradient: 'from-indigo-400 to-indigo-600',
    borderColor: 'border-indigo-300',
    textColor: 'text-indigo-700'
  },
  {
    id: 'st-4',
    name: 'Constant Social Chirper',
    quote: "LOVE SCRATCHES ARE MY NATURAL FUEL! 🥰🎶",
    emoji: '🐣❤️🐣',
    bgGradient: 'from-pink-400 to-rose-500',
    borderColor: 'border-pink-300',
    textColor: 'text-pink-700'
  },
  {
    id: 'st-5',
    name: 'Avian Master Parent',
    quote: "100% HEALTH SCORE IS MY PEAK STANDARD! 🏆✨",
    emoji: '👑🦜👑',
    bgGradient: 'from-yellow-400 to-amber-500',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700'
  },
  {
    id: 'st-6',
    name: 'Avelyn Guarded Nest',
    quote: "SAFE CHOW, SECURE CAGE, PURE PEACE! 🌳🏡",
    emoji: '🏡💚🏡',
    bgGradient: 'from-teal-400 to-emerald-500',
    borderColor: 'border-teal-300',
    textColor: 'text-teal-700'
  }
];

export default function AvelynStickers() {
  const [whatsappNumber, setWhatsappNumber] = useState('+91-0000000000');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const cleanPhoneNumber = (num: string) => {
    // Leave numbers only, keeping the leading + if present
    return num.replace(/[^\d+]/g, '');
  };

  const getWhatsAppLink = (sticker: StickerItem) => {
    const formattedPhone = cleanPhoneNumber(whatsappNumber);
    const textMessage = `*Avelyn Flock Wellness Sticker Share!* 🦜✨\n\n` +
      `💖 *Sticker:* ${sticker.name}\n` +
      `📣 *"_ ${sticker.quote} _"*\n` +
      `🌟 *Emblem:* ${sticker.emoji}\n\n` +
      `Join me on Avelyn Bird Care to build peak companion wellness standard! 🥦🌴`;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(textMessage)}`;
  };

  const copyRefMessage = (sticker: StickerItem) => {
    const textMessage = `*Avelyn Sticker:* ${sticker.name}\n"${sticker.quote}" ${sticker.emoji}`;
    navigator.clipboard.writeText(textMessage);
    setCopiedId(sticker.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white border-2 border-slate-100 rounded-xl p-2 shadow-xs space-y-2" id="avelyn-stickers-widget">
      {/* Header section - strictly 8px margins / spaces */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
            Shareable Milestones
          </span>
          <h3 className="font-display font-extrabold text-sm text-slate-800 tracking-tight">
            Avelyn Wellness Stickers
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            Click sticker files to trigger instant WhatsApp messaging to share achievements, streaks, and dietary logs with bird parent partners!
          </p>
        </div>

        {/* WhatsApp Target configuration - custom 8px alignment and inputs */}
        <div className="bg-[#FFFDF8] border border-slate-200 rounded-lg p-1.5 space-y-1 w-full sm:w-auto shrink-0">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
            Target WhatsApp Number
          </label>
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="border border-slate-200 bg-white text-xs font-mono px-2 py-1 rounded-md w-full sm:w-44 outline-none focus:border-emerald-500 font-bold"
              placeholder="+91-0000000000"
            />
            <div className="bg-emerald-500 text-white p-1 rounded-md text-xs font-bold leading-none" title="WhatsApp number verified">
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* Grid gallery - strictly 8px based spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {STICKERS.map((sticker) => {
          const waLink = getWhatsAppLink(sticker);
          const isCopied = copiedId === sticker.id;

          return (
            <div
              key={sticker.id}
              className={`p-2 rounded-xl border-2 ${sticker.borderColor} flex flex-col justify-between items-center text-center bg-slate-50/50 space-y-2 relative overflow-hidden group hover:shadow-xs transition-shadow`}
            >
              {/* Highlight Circle Background */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-xl pointer-events-none" />

              {/* Holographic Sticker Visual Frame */}
              <motion.div
                whileHover={{ rotate: [-2, 2, -2], scale: 1.05 }}
                className={`w-20 h-20 rounded-full bg-gradient-to-tr ${sticker.bgGradient} flex flex-col items-center justify-center text-white border-4 border-white shadow-md relative outline-dashed outline-2 outline-offset-1 outline-slate-200`}
              >
                <span className="text-xl mt-1 tracking-wider leading-none select-none">
                  {sticker.emoji.split('')[0]}🦜{sticker.emoji.split('')[sticker.emoji.length - 1]}
                </span>
                
                {/* Visual badge highlight */}
                <div className="absolute inset-1.5 rounded-full border border-white/30 pointer-events-none" />
                <span className="text-[8px] uppercase tracking-wide font-black bg-white/80 text-slate-800 px-1 py-0.5 rounded mt-1 shadow-2xs font-sans max-w-[80px] truncate">
                  {sticker.name.split(' ')[0]}
                </span>
              </motion.div>

              {/* Quote text and names */}
              <div className="space-y-1">
                <h4 className="text-xs font-black font-display text-slate-800">
                  {sticker.name}
                </h4>
                <p className="text-[10px] font-sans text-slate-500 font-medium px-2 leading-relaxed">
                  "{sticker.quote}"
                </p>
              </div>

              {/* Action Buttons - exactly 8px margin/spacing styled */}
              <div className="w-full grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100/60 font-sans">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1 px-1 rounded text-[10px] flex items-center justify-center gap-1 transition-colors leading-none cursor-pointer"
                  id={`whatsapp-share-${sticker.id}`}
                >
                  <MessageSquare className="w-3 h-3" /> WhatsApp
                </a>

                <button
                  onClick={() => copyRefMessage(sticker)}
                  className="bg-white hover:bg-slate-100 border text-slate-600 font-bold py-1 px-1 rounded text-[10px] flex items-center justify-center gap-1 transition-colors leading-none cursor-pointer"
                  id={`copy-sticker-${sticker.id}`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Text
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 bg-slate-50 py-1 rounded-lg">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
        Configure your private number on top to send templates instantly to your target contact!
      </div>
    </div>
  );
}
