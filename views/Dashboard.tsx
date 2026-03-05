
import React from 'react';
import { CourseUnit, LearningLevel, UserState } from '../types';

interface DashboardProps {
  userState: UserState;
  onStartLesson: (unit: CourseUnit, level: LearningLevel) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userState, onStartLesson }) => {
  const units = Object.values(CourseUnit);

  return (
    <div className="max-w-5xl mx-auto py-32 px-8">
      <div className="mb-16">
        <h2 className="serif text-4xl mb-4 italic">Intellectual Progression</h2>
        <p className="text-zinc-400 max-w-xl">Select a knowledge core to begin your cognitive synchronization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {units.map((unit) => {
          const currentLevel = userState.levelProgress[unit];
          return (
            <div 
              key={unit}
              className="group p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer"
              onClick={() => onStartLesson(unit, currentLevel)}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">Focus Area</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-400">{currentLevel}</span>
              </div>
              <h4 className="text-xl font-semibold mb-8 text-zinc-200 group-hover:text-white transition-colors">
                {unit}
              </h4>
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-200 transition-all duration-1000" 
                  style={{ width: currentLevel === LearningLevel.DUMMIES ? '33%' : currentLevel === LearningLevel.SMARTIES ? '66%' : '100%' }}
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-zinc-500">Synchronized Mastery</span>
                <span className="text-xs font-mono text-zinc-400">
                   {currentLevel === LearningLevel.DUMMIES ? '33%' : currentLevel === LearningLevel.SMARTIES ? '66%' : '100%'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {userState.weakAreas.length > 0 && (
        <div className="mt-16 p-8 border border-red-900/30 bg-red-950/10 rounded-2xl">
          <h5 className="text-red-400 text-sm font-bold uppercase tracking-widest mb-4">Neural Weaknesses Detected</h5>
          <div className="flex flex-wrap gap-2">
            {userState.weakAreas.map(area => (
              <span key={area} className="px-3 py-1 bg-red-900/20 border border-red-900/50 text-red-200 text-[10px] rounded-full uppercase">
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
