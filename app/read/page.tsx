"use client";

import { useState } from 'react';
import { ArrowLeft, Settings, MessageSquare, Menu, X, Minus, Plus, Moon, Sun, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Reader() {
  // 1. STATE: The "Memory" of the page
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [fontSize, setFontSize] = useState(18); // Default size 18px

  // 2. THEMES: The colors for each mode
  const themes = {
    light: "bg-white text-stone-900",
    sepia: "bg-[#F9F7F1] text-stone-800", // Soft Paper
    dark:  "bg-[#1a1a1a] text-stone-300"  // OLED Friendly
  };

  return (
    // Apply the current Theme to the main container
    <main className={`min-h-screen transition-colors duration-300 relative ${themes[theme]}`}>
      
      {/* --- TOP BAR --- */}
      <nav className={`fixed top-0 w-full p-3 flex justify-between items-center transition-transform duration-300 z-40 
        ${showControls ? 'translate-y-0' : '-translate-y-full'}
        ${theme === 'dark' ? 'bg-[#1a1a1a]/90 border-stone-800' : 'bg-white/95 border-stone-200'} border-b backdrop-blur`}>
        
        <Link href="/" className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-stone-800' : 'hover:bg-stone-100'}`}>
            <ArrowLeft className="w-6 h-6" />
        </Link>
        <span className="font-serif font-bold text-sm truncate max-w-[200px]">The Reborn King...</span>
        <button className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-stone-800' : 'hover:bg-stone-100'}`}>
            <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* --- NOVEL TEXT --- */}
      <article 
        onClick={() => {
           setShowControls(!showControls);
           setShowSettings(false); // Close settings if open
        }}
        className="px-6 py-24 max-w-2xl mx-auto font-serif leading-loose cursor-pointer select-none"
        style={{ fontSize: `${fontSize}px` }} // Dynamic Font Size
      >
        <h1 className="text-2xl font-bold mb-8 text-center mt-4">Chapter 1: The Return</h1>
        
        <p className="mb-6">
          The rain in Bangkok never felt this cold before. Standing on the edge of the Chao Phraya river, Kavin looked at his reflection in the dark, swirling water. He wasn't supposed to be here. He was supposed to be dead.
        </p>
        <p className="mb-6">
          "System," he whispered, his voice trembling slightly. "Are you online?"
        </p>
        <div className={`border-l-4 p-4 my-8 rounded-r-lg ${theme === 'dark' ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-500'}`}>
          <p className="font-bold text-blue-500 text-sm mb-1">SYSTEM NOTIFICATION</p>
          <p className="text-sm opacity-90">Host vital signs stabilized. Temporal regression complete. Welcome back to the year 2025.</p>
        </div>
        <p className="mb-6">
            Kavin clenched his fists. The betrayal, the corporate war, the assassination... it hadn't happened yet. He had 10 years of future knowledge locked in his mind.
        </p>
        <p className="mb-6">
            This time, he wouldn't just survive the hotel industry wars. He would own the entire board.
        </p>
      </article>

      {/* --- SETTINGS DRAWER (Pop-up) --- */}
      {showSettings && (
        <div className={`fixed bottom-20 left-4 right-4 rounded-xl shadow-2xl p-5 border z-50 animate-in slide-in-from-bottom-5
            ${theme === 'dark' ? 'bg-[#252525] border-stone-700' : 'bg-white border-stone-200'}`}>
            
            {/* Font Size Control */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider opacity-50">Size</span>
                <div className={`flex items-center gap-4 px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-stone-100'}`}>
                    <button onClick={() => setFontSize(Math.max(14, fontSize - 2))}><Minus className="w-4 h-4" /></button>
                    <span className="font-bold w-8 text-center">{fontSize}</span>
                    <button onClick={() => setFontSize(Math.min(32, fontSize + 2))}><Plus className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Theme Control */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-50">Theme</span>
                <div className="flex gap-2">
                    <button onClick={() => setTheme('light')} className="w-10 h-10 rounded-full bg-white border border-stone-300 flex items-center justify-center shadow-sm">
                        <Sun className="w-5 h-5 text-stone-800" />
                    </button>
                    <button onClick={() => setTheme('sepia')} className="w-10 h-10 rounded-full bg-[#F9F7F1] border border-stone-300 flex items-center justify-center shadow-sm">
                        <BookOpen className="w-5 h-5 text-amber-700" />
                    </button>
                    <button onClick={() => setTheme('dark')} className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-stone-600 flex items-center justify-center shadow-sm">
                        <Moon className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- BOTTOM BAR --- */}
      <footer className={`fixed bottom-0 w-full border-t px-6 py-4 flex justify-between items-center transition-transform duration-300 z-50 
        ${showControls ? 'translate-y-0' : 'translate-y-full'}
        ${theme === 'dark' ? 'bg-[#1a1a1a]/90 border-stone-800' : 'bg-white/95 border-stone-200'} backdrop-blur`}>
         
         <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`flex flex-col items-center gap-1 ${showSettings ? 'text-indigo-500' : 'opacity-60'}`}
         >
            {showSettings ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            <span className="text-[10px]">Settings</span>
         </button>
         
         <button className="flex flex-col items-center gap-1 opacity-60">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">Comment</span>
         </button>
         
         <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-indigo-500/30">
            Next Chapter
         </button>
      </footer>

    </main>
  );
}