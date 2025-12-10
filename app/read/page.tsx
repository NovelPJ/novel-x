"use client";

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '../utils/supabase';
import { ArrowLeft, Settings, MessageSquare, Menu, X, Minus, Plus, Moon, Sun, BookOpen, Loader2, Lock, List } from 'lucide-react';
import Link from 'next/link';

export default function Reader() {
  // --- STATE ---
  const [chapterNum, setChapterNum] = useState(1);
  const [chapter, setChapter] = useState<any>(null);
  const [chapterList, setChapterList] = useState<any[]>([]); // New: Stores the Table of Contents
  
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  
  // UI State
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false); // New: Controls the Chapter List Drawer
  
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [fontSize, setFontSize] = useState(18);

  const supabase = createClient();

  // --- 1. FETCH CURRENT CHAPTER ---
  const getChapter = useCallback(async (num: number) => {
    setLoading(true);
    setIsLocked(false);

    // Get Chapter Content
    const { data: chapterData, error } = await supabase
      .from('chapters')
      .select('*, novels(id, title)') // We now fetch novel_id too
      .eq('chapter_number', num)
      .single();

    if (error || !chapterData) {
      console.error("Chapter not found");
      setLoading(false);
      return;
    }

    setChapter(chapterData);

    // If this is the first load, fetch the Table of Contents for this novel
    if (chapterList.length === 0) {
        const { data: allChapters } = await supabase
            .from('chapters')
            .select('id, title, chapter_number, price')
            .eq('novel_id', chapterData.novels.id)
            .order('chapter_number', { ascending: true });
        
        if (allChapters) setChapterList(allChapters);
    }

    // Security Check
    if (chapterData.price > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: unlock } = await supabase
                .from('unlocks')
                .select('*')
                .eq('user_id', user.id)
                .eq('chapter_id', chapterData.id)
                .single();
            
            if (!unlock) setIsLocked(true);
        } else {
            setIsLocked(true);
        }
    }
    setLoading(false);
  }, [supabase, chapterList.length]);

  // --- 2. HANDLE UNLOCK ---
  const handleUnlock = async () => {
    setUnlocking(true);
    const { data } = await supabase.rpc('purchase_chapter', { chapter_id_input: chapter.id });

    if (data === 'success') {
      setIsLocked(false);
      alert("Purchase Successful!");
    } else {
      alert("Failed: " + (data || "Error"));
    }
    setUnlocking(false);
  };

  useEffect(() => {
    getChapter(chapterNum);
  }, [chapterNum, getChapter]);

  // Theme Styles
  const themes = {
    light: "bg-white text-stone-900",
    sepia: "bg-[#F9F7F1] text-stone-800",
    dark:  "bg-[#1a1a1a] text-stone-300"
  };

  // --- RENDER ---
  if (loading && !chapter) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (!chapter) return <div className="p-10 text-center">End of Book.</div>;

  return (
    <main className={`min-h-screen transition-colors duration-300 relative ${themes[theme]}`}>
      
      {/* TOP BAR */}
      <nav className={`fixed top-0 w-full p-3 flex justify-between items-center transition-transform duration-300 z-40 
        ${showControls ? 'translate-y-0' : '-translate-y-full'}
        ${theme === 'dark' ? 'bg-[#1a1a1a]/90 border-stone-800' : 'bg-white/95 border-stone-200'} border-b backdrop-blur`}>
        <Link href="/" className="p-2"><ArrowLeft className="w-6 h-6" /></Link>
        <span className="font-serif font-bold text-sm truncate max-w-[200px]">{chapter.novels?.title}</span>
        
        {/* NEW: Table of Contents Button */}
        <button 
            onClick={() => { setShowChapterList(true); setShowSettings(false); }}
            className="p-2"
        >
            <List className="w-6 h-6" />
        </button>
      </nav>

      {/* TEXT CONTENT */}
      <article 
        onClick={() => { setShowControls(!showControls); setShowSettings(false); setShowChapterList(false); }}
        className="px-6 py-24 max-w-2xl mx-auto font-serif leading-loose cursor-pointer select-none whitespace-pre-line"
        style={{ fontSize: `${fontSize}px` }}
      >
        <h1 className="text-2xl font-bold mb-8 text-center mt-4">{chapter.title}</h1>
        
        {isLocked ? (
            <div className="my-10 p-8 rounded-2xl bg-slate-100 border border-slate-200 text-center flex flex-col items-center gap-4 shadow-inner">
                <Lock className="w-8 h-8 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-900">Chapter Locked</h3>
                <p className="text-slate-500 text-sm">Price: {chapter.price} Coins</p>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleUnlock(); }}
                    disabled={unlocking}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform flex justify-center gap-2"
                >
                    {unlocking ? <Loader2 className="animate-spin" /> : "Unlock Now"}
                </button>
            </div>
        ) : (
            <div className="opacity-90">{chapter.content}</div>
        )}

        {!isLocked && <div className="h-32 flex items-center justify-center text-sm opacity-50 italic mt-10">- End of Chapter -</div>}
      </article>

      {/* --- NEW: CHAPTER LIST DRAWER --- */}
      {showChapterList && (
        <>
            {/* Dark Overlay */}
            <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowChapterList(false)} />
            
            {/* The Drawer Panel */}
            <div className={`fixed inset-y-0 right-0 w-80 max-w-[80%] shadow-2xl z-50 flex flex-col transform transition-transform duration-300
                ${theme === 'dark' ? 'bg-[#1a1a1a] text-white' : 'bg-white text-slate-800'}`}>
                
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-bold text-lg">Table of Contents</h2>
                    <button onClick={() => setShowChapterList(false)}><X className="w-6 h-6" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {chapterList.map((c) => (
                        <button 
                            key={c.id}
                            onClick={() => {
                                setChapterNum(c.chapter_number);
                                setShowChapterList(false);
                            }}
                            className={`w-full text-left p-4 rounded-xl mb-1 flex items-center justify-between transition-colors
                                ${c.chapter_number === chapterNum 
                                    ? 'bg-indigo-100 text-indigo-700 font-bold border border-indigo-200' 
                                    : theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-slate-50'}`}
                        >
                            <div>
                                <div className="text-xs opacity-60 uppercase mb-0.5">Chapter {c.chapter_number}</div>
                                <div className="text-sm truncate w-40">{c.title}</div>
                            </div>
                            
                            {/* Price Badge */}
                            {c.price > 0 ? (
                                <div className="flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                    <Lock className="w-3 h-3" /> {c.price}
                                </div>
                            ) : (
                                <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Free</div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </>
      )}

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
                    <button onClick={() => setTheme('light')} className="w-10 h-10 rounded-full border shadow-sm flex items-center justify-center bg-white"><Sun className="w-5 h-5 text-stone-800" /></button>
                    <button onClick={() => setTheme('sepia')} className="w-10 h-10 rounded-full border shadow-sm flex items-center justify-center bg-[#F9F7F1]"><BookOpen className="w-5 h-5 text-amber-700" /></button>
                    <button onClick={() => setTheme('dark')} className="w-10 h-10 rounded-full border shadow-sm flex items-center justify-center bg-[#1a1a1a]"><Moon className="w-5 h-5 text-white" /></button>
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
         
         <button onClick={() => setChapterNum(chapterNum + 1)} className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">Next</button>
      </footer>

    </main>
  );
}