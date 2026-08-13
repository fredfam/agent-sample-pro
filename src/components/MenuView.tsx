import React from 'react';
import { Moon, Sun, Shield, Bell, HelpCircle, LogOut, User, DollarSign, Activity, ChevronRight, Globe, BarChart3 } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const MenuView: React.FC = () => {
  const {
    darkMode,
    toggleDarkMode,
    isLiveTicker,
    setIsLiveTicker,
    userAccount,
    setIsGetStartedOpen,
    setActiveTab
  } = useMarket();

  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-24">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
        Menu & Settings
      </h1>

      {/* Account Card */}
      <div className="bg-white dark:bg-[#1c202a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 mb-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#2962ff] text-white flex items-center justify-center font-bold text-lg">
              {userAccount.name[0]}
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-base">
                {userAccount.isLoggedIn ? userAccount.name : 'Guest Investor'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {userAccount.isLoggedIn ? userAccount.email : 'Sign in to sync watchlists across devices'}
              </div>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-[#2962ff] rounded-md">
                {userAccount.tier}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsGetStartedOpen(true)}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            {userAccount.isLoggedIn ? 'Manage Account' : 'Get Started'}
          </button>
        </div>
      </div>

      {/* Preferences Group */}
      <div className="bg-white dark:bg-[#1c202a] rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden mb-6">
        {/* Dark Mode Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">Theme Appearance</div>
              <div className="text-xs text-gray-500">{darkMode ? 'Dark mode (OLED optimized)' : 'Light mode'}</div>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
              darkMode ? 'bg-[#2962ff]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Live Ticker Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">Real-time Ticker Simulation</div>
              <div className="text-xs text-gray-500">Fluctuate prices dynamically in background</div>
            </div>
          </div>
          <button
            onClick={() => setIsLiveTicker(!isLiveTicker)}
            className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
              isLiveTicker ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isLiveTicker ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Currency Display */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">Display Currency</div>
              <div className="text-xs text-gray-500">USD ($)</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Market Navigation Quick Links */}
      <div className="bg-white dark:bg-[#1c202a] rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden mb-6">
        <button
          onClick={() => setActiveTab('explore')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-[#2962ff]" />
            <span className="font-bold text-gray-900 dark:text-white text-sm">Markets Directory</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={() => setActiveTab('ideas')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-gray-900 dark:text-white text-sm">Global Community & Trade Setups</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Platform Info Footer */}
      <div className="text-center text-xs text-gray-400 mt-8">
        <p>Precision Markets v2.5.0 • Powered by Gemini AI</p>
        <p className="mt-1">Designed for high-frequency financial tracking and chart analysis</p>
      </div>
    </div>
  );
};
