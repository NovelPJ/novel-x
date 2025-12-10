"use client";

import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase';
import { useRouter } from 'next/navigation';
import { User, LogOut, CreditCard, ChevronRight, Settings, ArrowLeft, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null); // Stores email AND coins
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getData() {
      // 1. Get the Current User ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // 2. Fetch their Wallet from the "profiles" table
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userProfile) {
        setProfile(userProfile);
      } else {
        // Fallback if profile missing (shouldn't happen due to trigger)
        setProfile({ email: user.email, coins: 0 }); 
      }
      
      setLoading(false);
    }
    getData();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Wallet...</div>;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* HEADER */}
      <header className="bg-white p-6 pb-12 border-b border-slate-100 relative">
        <Link href="/" className="absolute top-6 left-6 p-2 bg-slate-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="flex flex-col items-center mt-4">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                <span className="text-3xl font-bold text-indigo-600">
                    {profile?.email?.charAt(0).toUpperCase()}
                </span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Reader</h1>
            <p className="text-sm text-slate-500">{profile?.email}</p>
        </div>
      </header>

      {/* WALLET SECTION - Now Real Data! */}
      <div className="px-4 -mt-8 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex justify-between items-center">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Wallet className="w-3 h-3" /> My Balance
                </p>
                {/* DYNAMIC COIN DISPLAY */}
                <p className="text-3xl font-black text-indigo-600 mt-1">{profile?.coins || 0}</p>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-indigo-200 shadow-lg active:scale-95 transition-transform">
                Top Up
            </button>
        </div>
      </div>

      {/* MENU LIST */}
      <div className="px-4 space-y-3">
        <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700">Edit Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
        </div>

        <button 
            onClick={handleSignOut}
            className="w-full bg-white p-4 rounded-xl border border-red-100 flex items-center gap-3 mt-6 text-red-600 hover:bg-red-50"
        >
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5" />
            </div>
            <span className="font-bold">Sign Out</span>
        </button>
      </div>
    </main>
  );
}