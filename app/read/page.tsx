"use client";

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '../utils/supabase';
import { ArrowLeft, Settings, MessageSquare, Menu, X, Minus, Plus, Moon, Sun, BookOpen, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Reader() {
  // --- STATE MANAGEMENT ---
  const [chapterNum, setChapterNum] = useState(1); // Default to Chapter 1
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false); // Loading state for the purchase button
  
  // UI Settings
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [fontSize, setFontSize] = useState(18);

  const supabase = createClient();

  // --- 1. FETCH DATA FUNCTION ---
  const getChapter = useCallback(async (num: number) => {
    setLoading(true);
    setIsLocked(false);

    // A. Get the Chapter Text & Price
    const { data: chapterData, error } = await supabase
      .from('chapters')
      .select('*, novels(title)')
      .eq('chapter_number', num)
      .single();

    if (error || !chapterData) {
      console.error("Chapter not found");
      setLoading(false);
      return;
    }

    setChapter(chapterData);

    // B. SECURITY CHECK: If price > 0, did user buy it?
    if (chapterData.price > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            // Check the "Unlocks" ledger
            const { data: unlock } = await supabase
                .from('unlocks')
                .select('*') // <--- CRITICAL FIX: This prevents the crash
                .eq('user_id', user.id)
                .eq('chapter_id', chapterData.id)
                .single();
            
            // If no unlock record found, BLOCK the user
            if (!unlock) setIsLocked(true);
        } else {
            // Not logged in = Locked
            setIsLocked(true); 
        }
    }
    
    setLoading(false);
  }, [supabase]);

  // --- 2. HANDLE PURCHASE FUNCTION ---
  const handleUnlock = async () => {
    setUnlocking(true);
    
    // Call the secure SQL function in the database
    const { data, error } = await supabase.rpc('purchase_chapter', { 
      chapter_id_input: chapter.id 
    });

    if (data === 'success') {
      setIsLocked(false); // Unlocks immediately without reloading
      alert("Purchase Successful!");
    } else {
      alert("Failed: " + (data || "Not enough coins or error"));
    }
    setUnlocking(false);
  };

  // Load chapter whenever chapterNum changes
  useEffect(() => {
    getChapter(chapterNum);
  }, [chapterNum, getChapter]);

  // --- THEMES ---
  const themes = {
    light: "bg-white text-stone-900",
    sepia: "bg-[#F9F7F1] text-stone-800",
    dark:  "bg-[#1a1a1a] text-stone-300"
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500 font-medium">Loading Chapter {chapterNum}...</p>
    </div>
  );

  if (!chapter) return <div className="p-10 text-center">End of Book.</div>;

  return (
    <main className={`min-h-screen transition-colors duration-300 relative ${themes[theme]}`}>
      
      {/* TOP BAR */}
      <nav className={`fixed top-0 w-full p-3 flex justify-between items-center transition-transform duration-300 z-40 
        ${showControls ? 'translate-y-0' : '-translate-y-full'}
        ${theme === 'dark' ? 'bg-[#1a1a1a]/90 border-stone-800' : 'bg-white/95 border-stone-200'} border-b backdrop-blur`}>
        <Link href="/" className="p-2"><ArrowLeft className="w-6 h-6" /></Link>
        <span className="font-serif font-bold text-sm truncate max-w-[200px]">{chapter.novels?.title}</span>
        <button className="p-2"><Menu className="w-6 h-6" /></button>
      </nav>

      {/* --- CONTENT AREA --- */}
      <article 
        onClick={() => { setShowControls(!showControls); setShowSettings(false); }}
        className="px-6 py-24 max-w-2xl mx-auto font-serif leading-loose cursor-pointer select-none whitespace-pre-line"
        style={{ fontSize: `${fontSize}px` }}
      >
        <h1 className="text-2xl font-bold mb-8 text-center mt-4">{chapter.title}</h1>
        
        {/* PAYWALL UI */}
        {isLocked ? (
            <div className="my-10 p-8 rounded-2xl bg-slate-100 border border-slate-200 text-center flex flex-col items-center gap-4 shadow-inner">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                    <Lock className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Chapter Locked</h3>
                    <p className="text-slate-500 text-sm mt-1">This chapter costs money to produce.</p>
                </div>
                <div className="bg-white px-6 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-slate-500 text-sm">Price: </span>
                    <span className="font-bold text-indigo-600 text-lg">{chapter.price} Coins</span>
                </div>
                
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Stop menu from toggling
                        handleUnlock();
                    }}
                    disabled={unlocking}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {unlocking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unlock Now"}
                </button>
            </div>
        ) : (
            // FREE/UNLOCKED CONTENT
            <div className="opacity-90 animate-in fade-in duration-700">
                {chapter.content}
            </div>
        )}

        {!isLocked && <div className="h-32 flex items-center justify-center text-sm opacity-50 italic mt-10">- End of Chapter -</div>}
      </article>

      {/* SETTINGS DRAWER */}
      {showSettings && (
        <div className={`fixed bottom-20 left-4 right-4 rounded-xl shadow-2xl p-5 border z-50 animate-in slide-in-from-bottom-5
            ${theme === 'dark' ? 'bg-[#252525] border-stone-700' : 'bg-white border-stone-200'}`}>
            <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase opacity-50">Size</span>
                <div className={`flex items-center gap-4 px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-stone-100'}`}>
                    <button onClick={() => setFontSize(Math.max(14, fontSize - 2))}><Minus className="w-4 h-4" /></button>
                    <span className="font-bold w-8 text-center">{fontSize}</span>
                    <button onClick={() => setFontSize(Math.min(32, fontSize + 2))}><Plus className="w-4 h-4" /></button>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase opacity-50">Theme</span>
                <div className="flex gap-2">
                    <button onClick={() => setTheme('light')} className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center"><Sun className="w-5 h-5 text-stone-800" /></button>
                    <button onClick={() => setTheme('sepia')} className="w-10 h-10 rounded-full bg-[#F9F7F1] border shadow-sm flex items-center justify-center"><BookOpen className="w-5 h-5 text-amber-700" /></button>
                    <button onClick={() => setTheme('dark')} className="w-10 h-10 rounded-full bg-[#1a1a1a] border shadow-sm flex items-center justify-center"><Moon className="w-5 h-5 text-white" /></button>
                </div>
            </div>
        </div>
      )}

      {/* BOTTOM BAR */}
      <footer className={`fixed bottom-0 w-full border-t px-6 py-4 flex justify-between items-center transition-transform duration-300 z-50 
        ${showControls ? 'translate-y-0' : 'translate-y-full'}
        ${theme === 'dark' ? 'bg-[#1a1a1a]/90 border-stone-800' : 'bg-white/95 border-stone-200'} backdrop-blur`}>
         
         <button onClick={() => setShowSettings(!showSettings)} className="flex flex-col items-center gap-1 opacity-60">
            {showSettings ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            <span className="text-[10px]">Settings</span>
         </button>
         
         <button className="flex flex-col items-center gap-1 opacity-60">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">Comment</span>
         </button>
         
         <button 
            onClick={() => setChapterNum(chapterNum + 1)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg"
         >
            Next Chapter
         </button>
      </footer>

    </main>
  );
}