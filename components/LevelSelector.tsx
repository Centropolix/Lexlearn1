
import React from 'react';
import { LearningLevel } from '../types';

interface LevelSelectorProps {
  currentLevel: LearningLevel;
  onSelect: (level: LearningLevel) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ currentLevel, onSelect }) => {
  const levels = [
    { id: LearningLevel.DUMMIES, label: "Level I", title: "DUMMIES", subtitle: "Conceptual Roots" },
    { id: LearningLevel.SMARTIES, label: "Level II", title: "SMARTIES", subtitle: "Logical Reasoning" },
    { id: LearningLevel.WISE, label: "Level III", title: "WISE", subtitle: "Strategic Strategy" }
  ];

  return (
    <div className="flex gap-4 mb-12">
      {levels.map((lvl) => (
        <button
          key={lvl.id}
          onClick={() => onSelect(lvl.id)}
          className={`flex-1 p-6 rounded-xl transition-all duration-500 border text-left group
            ${currentLevel === lvl.id 
              ? 'bg-white border-white text-black scale-[1.02] shadow-2xl' 
              : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600'
            }`}
        >
          <span className={`text-[10px] font-bold tracking-[0.2em] block mb-2 transition-colors
            ${currentLevel === lvl.id ? 'text-zinc-500' : 'text-zinc-600'}
          `}>
            {lvl.label}
          </span>
          <h3 className={`text-xl font-bold mb-1 tracking-tight ${currentLevel === lvl.id ? 'text-black' : 'text-white'}`}>
            {lvl.title}
          </h3>
          <p className="text-xs font-medium opacity-60">
            {lvl.subtitle}
          </p>
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;
