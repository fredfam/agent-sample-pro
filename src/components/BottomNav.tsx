import React from 'react';
import { Star, CandlestickChart, Compass, Lightbulb, Menu } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useMarket();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'watchlist', label: 'Watchlist', icon: <Star className="w-5 h-5" /> },
    { id: 'chart', label: 'Chart', icon: <CandlestickChart className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'ideas', label: 'Ideas', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'menu', label: 'Menu', icon: <Menu className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 h-14 bg-white dark:bg-[#0f131e] border-t border-gray-200 dark:border-gray-800 pb-safe shadow-lg transition-colors">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive
                ? 'text-[#2962ff] dark:text-[#2962ff] font-bold scale-105'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {item.icon}
            <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-semibold'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
