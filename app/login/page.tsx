"use client";

import { useState } from 'react';
import { createClient } from '../utils/supabase';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

   const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // WE ARE HARDCODING THE LIVE URL HERE
        emailRedirectTo: 'https://novel-x-pi.vercel.app/auth/callback', 
      },
    });

    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Magic link sent! Check your email.', type: 'success' });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
      
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 transition-colors">
        <ArrowLeft className="w-6 h-6 text-slate-600" />
      </Link>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Enter your email to sign in or create an account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 font-medium"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Magic Link"}
            </button>
        </form>

        {/* Status Message */}
        {message && (
            <div className={`mt-6 p-4 rounded-lg text-sm text-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
            </div>
        )}

      </div>
    </main>
  );
} 
// ^^^ This bracket was likely missing!