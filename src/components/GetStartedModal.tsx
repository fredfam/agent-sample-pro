import React, { useState } from 'react';
import { X, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const GetStartedModal: React.FC = () => {
  const { isGetStartedOpen, setIsGetStartedOpen, userAccount, setUserAccount } = useMarket();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isGetStartedOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setUserAccount({
      isLoggedIn: true,
      name: name || email.split('@')[0],
      email: email,
      tier: 'Pro Trader Active'
    });

    setIsGetStartedOpen(false);
  };

  const handleLogout = () => {
    setUserAccount({
      isLoggedIn: false,
      name: 'Investor',
      email: 'investor@precisionmarkets.com',
      tier: 'Pro Trader Free Trial'
    });
    setIsGetStartedOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#1c202a] w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 relative">
        <button
          onClick={() => setIsGetStartedOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="text-[#2962ff]">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
            </svg>
          </div>
          <span className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight">
            Precision Markets
          </span>
        </div>

        {userAccount.isLoggedIn ? (
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Account Profile
            </h3>
            <p className="text-xs text-gray-500 mb-6">You are signed in as a Pro Trader</p>

            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-6 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-400">Name</span>
                <span className="font-bold text-gray-900 dark:text-white">{userAccount.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-400">Email</span>
                <span className="font-bold text-gray-900 dark:text-white">{userAccount.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Membership</span>
                <span className="font-bold text-emerald-500">{userAccount.tier}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Unlock Full Pro Features
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Get real-time market ticks, custom watchlists, and Gemini AI technical analyses.
            </p>

            <div className="space-y-2 mb-6 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Real-time global indices & stock streams</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Unlimited interactive candlestick charts & indicators</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>AI Technical Market Summaries powered by Gemini</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#2962ff]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#2962ff]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2962ff] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md mt-2 flex items-center justify-center gap-2"
              >
                <span>Start Free 14-Day Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
