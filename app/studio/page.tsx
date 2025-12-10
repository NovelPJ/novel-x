"use client";

import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase';
import { ArrowLeft, Upload, Loader2, CheckCircle, Book } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudioPage() {
  const supabase = createClient();
  const router = useRouter();

  // FORM DATA
  const [novels, setNovels] = useState<any[]>([]);
  const [selectedNovel, setSelectedNovel] = useState('');
  const [title, setTitle] = useState('');
  const [chapterNum, setChapterNum] = useState('');
  const [price, setPrice] = useState('0');
  const [content, setContent] = useState('');
  
  // UI STATE
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 1. Fetch available novels to select from
  useEffect(() => {
    async function getNovels() {
      const { data } = await supabase.from('novels').select('id, title');
      if (data && data.length > 0) {
        setNovels(data);
        setSelectedNovel(data[0].id); // Auto-select first novel
      }
    }
    getNovels();
  }, [supabase]);

  // 2. Handle Publish
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('chapters').insert({
      novel_id: selectedNovel,
      title: title,
      chapter_number: parseInt(chapterNum),
      price: parseInt(price),
      content: content,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      setSuccess(true);
      // Reset form after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setContent('');
        setChapterNum(prev => (parseInt(prev) + 1).toString()); // Auto-increment chapter number
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      
      {/* HEADER */}
      <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Writer's Studio</h1>
        </div>
      </div>

      {/* THE FORM */}
      <form onSubmit={handlePublish} className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
        {/* Novel Selector */}
        <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Novel</label>
            <div className="relative">
                <Book className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <select 
                    value={selectedNovel}
                    onChange={(e) => setSelectedNovel(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                >
                    {novels.map(novel => (
                        <option key={novel.id} value={novel.id}>{novel.title}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Chapter Number */}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Chapter #</label>
                <input 
                    type="number" 
                    value={chapterNum}
                    onChange={(e) => setChapterNum(e.target.value)}
                    placeholder="3"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
            {/* Price */}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Price (Coins)</label>
                <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
        </div>

        {/* Chapter Title */}
        <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Chapter Title</label>
            <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Hidden Dragon"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
            />
        </div>

        {/* Content Area */}
        <div className="mb-8">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Story Content</label>
            <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story here..."
                required
                rows={12}
                className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-serif leading-relaxed text-lg"
            />
        </div>

        {/* Submit Button */}
        <button 
            type="submit" 
            disabled={loading || success}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                ${success ? 'bg-green-500 shadow-green-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             success ? <><CheckCircle className="w-5 h-5" /> Published!</> : 
             <><Upload className="w-5 h-5" /> Publish Chapter</>}
        </button>

      </form>
    </main>
  );
}