"use client";

import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase';
import { Search, ArrowLeft, BookOpen, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ExplorePage() {
  const supabase = createClient();
  
  // STATE
  const [novels, setNovels] = useState<any[]>([]); // Stores all books
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. FETCH NOVELS
  useEffect(() => {
    async function fetchNovels() {
      // Get all novels from the database
      const { data, error } = await supabase
        .from('novels')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setNovels(data);
      if (error) console.error(error);
      setLoading(false);
    }
    fetchNovels();
  }, [supabase]);

  // 2. FILTER LOGIC (Search)
  const filteredNovels = novels.filter(novel => 
    novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    novel.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      
      {/* HEADER & SEARCH BAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100">
                <ArrowLeft className="w-6 h-6 text-slate-500" />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Explore Library</h1>
        </div>

        {/* Search Input */}
        <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input 
                type="text" 
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
        </div>
      </header>

      {/* CONTENT GRID */}
      <div className="p-4">
        {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-600" /></div>
        ) : filteredNovels.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
                {filteredNovels.map((novel) => (
                    <Link href={`/read`} key={novel.id} className="group">
                        {/* Book Cover */}
                        <div className="aspect-[2/3] bg-slate-200 rounded-xl overflow-hidden shadow-sm relative mb-2">
                             {novel.cover_url ? (
                                <img src={novel.cover_url} alt={novel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-300">
                                    <BookOpen className="w-12 h-12" />
                                </div>
                             )}
                        </div>
                        {/* Meta Data */}
                        <h3 className="font-bold text-slate-800 leading-tight line-clamp-2 text-sm">{novel.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{novel.author}</p>
                    </Link>
                ))}
            </div>
        ) : (
            // Empty State
            <div className="text-center py-20 opacity-50">
                <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>No books found matching "{searchQuery}"</p>
            </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION (Active on Explore) */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-100 px-6 pt-3 pb-8 flex justify-between items-center z-50">
        
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-400">
           <BookOpen className="w-6 h-6" />
           <span className="text-[10px]">Home</span>
        </Link>
        
        {/* Active State (Indigo) */}
        <div className="flex flex-col items-center gap-1 text-indigo-600">
           <Search className="w-6 h-6" />
           <span className="text-[10px] font-bold">Explore</span>
        </div>
        
        <Link href="/account" className="flex flex-col items-center gap-1 text-slate-400">
           <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
             <User className="w-4 h-4 text-slate-500" />
           </div>
           <span className="text-[10px]">Profile</span>
        </Link>
      </nav>

    </main>
  );
}