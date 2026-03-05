
import React from 'react';
import { UserState } from '../types';

interface HeaderProps {
  userState: UserState;
}

const Header: React.FC<HeaderProps> = ({ userState }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 glass z-50 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="serif text-2xl font-bold tracking-tight text-white">LEX<span className="text-zinc-500 italic">MEDIA</span></h1>
        <div className="h-6 w-px bg-zinc-800" />
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">{userState.badge} RANK</span>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-tighter text-zinc-500 font-bold">Cognitive XP</span>
          <span className="text-sm font-mono text-zinc-200">{userState.xp}</span>
        </div>
        <div className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-400">
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;
