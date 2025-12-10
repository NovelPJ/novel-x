import { Search, Bell, BookOpen, Star, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen pb-20 bg-slate-50">
      
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">Novel-X</span>
        </div>
        <div className="flex gap-4 text-slate-500">
          <Search className="w-6 h-6" />
          <Bell className="w-6 h-6" />
        </div>
      </header>

      {/* 2. HERO CAROUSEL */}
      <section className="mt-4 px-4">
        <div className="relative w-full h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl overflow-hidden shadow-lg flex items-center p-6">
          <div className="z-10 text-white max-w-[70%]">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">Editor's Choice</span>
            <h2 className="text-2xl font-bold mt-2 leading-tight">The Reborn King of Bangkok</h2>
            <p className="text-sm mt-1 opacity-90 line-clamp-2">A systemic takeover of the thonburi empire...</p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* 3. CONTINUE READING (Linked to /read) */}
      <section className="mt-6 px-4">
        <div className="flex justify-between items-end mb-3">
          <h3 className="font-bold text-slate-800 text-lg">Jump Back In</h3>
        </div>
        <Link href="/read">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 items-center cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="w-12 h-16 bg-slate-200 rounded-md shrink-0"></div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-slate-800">My CEO Husband</h4>
              <p className="text-xs text-slate-500 mt-1">Chapter 42 • 8 mins left</p>
              <div className="w-full h-1 bg-slate-100 rounded-full mt-2">
                <div className="w-[70%] h-full bg-indigo-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* 4. SWIMLANE LIST */}
      <section className="mt-8">
        <div className="px-4 flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" /> Trending Now
          </h3>
          <span className="text-xs text-indigo-600 font-semibold">View All</span>
        </div>
        
        <div className="flex overflow-x-auto px-4 gap-4 pb-4 scrollbar-hide">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="w-32 shrink-0">
              <div className="w-32 h-48 bg-slate-200 rounded-lg shadow-sm mb-2 relative group">
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                   <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> 4.8
                </div>
              </div>
              <h4 className="font-bold text-sm text-slate-800 line-clamp-1">Level Up Doctor</h4>
              <p className="text-xs text-slate-500">Fantasy • System</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. NAVIGATION BAR */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom">
        <div className="flex flex-col items-center gap-1 text-indigo-600">
           <BookOpen className="w-6 h-6" />
           <span className="text-[10px] font-bold">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
           <Search className="w-6 h-6" />
           <span className="text-[10px]">Explore</span>
        </div>
        
        {/* THIS IS THE NEW PROFILE LINK */}
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