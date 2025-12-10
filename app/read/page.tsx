"use client";

import { useState } from 'react';
import { ArrowLeft, Settings, MessageSquare, Menu } from 'lucide-react';
import Link from 'next/link';

export default function Reader() {
  const [showControls, setShowControls] = useState(true);

  return (
    <main className="min-h-screen bg-[#F9F7F1] relative">
      
      {/* 1. TOP BAR (Hides on tap) */}
      <nav className={`fixed top-0 w-full bg-white/95 backdrop-blur border-b border-stone-200 p-3 flex justify-between items-center transition-all duration-300 z-50 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
        <Link href="/" className="p-2 text-stone-600 hover:bg-stone-100 rounded-full">
            <ArrowLeft className="w-6 h-6" />
        </Link>
        <span className="font-serif font-bold text-stone-800 text-sm truncate max-w-[200px]">The Reborn King...</span>
        <button className="p-2 text-stone-600 hover:bg-stone-100 rounded-full">
            <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* 2. THE NOVEL TEXT (Click to toggle menus) */}
      <article 
        onClick={() => setShowControls(!showControls)}
        className="px-6 py-20 max-w-2xl mx-auto font-serif text-lg leading-loose text-stone-800 cursor-pointer select-none"
      >
        <h1 className="text-3xl font-bold mb-8 text-center mt-4">Chapter 1: The Return</h1>
        
        <p className="mb-6">
          The rain in Bangkok never felt this cold before. Standing on the edge of the Chao Phraya river, Kavin looked at his reflection in the dark, swirling water. He wasn't supposed to be here. He was supposed to be dead.
        </p>
        <p className="mb-6">
          "System," he whispered, his voice trembling slightly. "Are you online?"
        </p>
        <p className="mb-6">
          A blue translucent screen flickered into existence before his eyes, illuminating the dark alley with a ghostly glow. 
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-8 rounded-r-lg">
          <p className="font-bold text-blue-800 text-sm mb-1">SYSTEM NOTIFICATION</p>
          <p className="text-blue-900">Host vital signs stabilized. Temporal regression complete. Welcome back to the year 2025.</p>
        </div>
        <p className="mb-6">
            Kavin clenched his fists. The betrayal, the corporate war, the assassination... it hadn't happened yet. He had 10 years of future knowledge locked in his mind.
        </p>
        <p className="mb-6">
            This time, he wouldn't just survive the hotel industry wars. He would own the entire board.
        </p>
        
        <div className="h-32 flex items-center justify-center text-stone-400 text-sm italic">
            - Tap text to toggle menu -
        </div>
      </article>

      {/* 3. BOTTOM BAR (Hides on tap) */}
      <footer className={`fixed bottom-0 w-full bg-white/95 backdrop-blur border-t border-stone-200 px-6 py-4 flex justify-between items-center transition-all duration-300 z-50 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
         <button className="flex flex-col items-center gap-1 text-stone-500">
            <Settings className="w-5 h-5" />
            <span className="text-[10px]">Font</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-stone-500">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">Comment</span>
         </button>
         
         <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-indigo-200">
            Next Chapter
         </button>
      </footer>

    </main>
  );
}