
import React, { useState, useEffect } from 'react';
import { LearningLevel, CourseUnit, UserState } from './types';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import StudySession from './views/StudySession';

const INITIAL_USER_STATE: UserState = {
  levelProgress: {
    [CourseUnit.INTRO]: LearningLevel.DUMMIES,
    [CourseUnit.RIGHTS]: LearningLevel.DUMMIES,
    [CourseUnit.ADVERTISING]: LearningLevel.DUMMIES,
    [CourseUnit.COPYRIGHT]: LearningLevel.DUMMIES,
    [CourseUnit.REGULATION]: LearningLevel.DUMMIES,
  },
  xp: 1250,
  badge: 'Student',
  weakAreas: ['Copyright in Digital Space', 'Advertising Standards']
};

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(INITIAL_USER_STATE);
  const [activeSession, setActiveSession] = useState<{ unit: CourseUnit; level: LearningLevel } | null>(null);

  const handleStartLesson = (unit: CourseUnit, level: LearningLevel) => {
    setActiveSession({ unit, level });
  };

  const handleSessionComplete = (score: number) => {
    if (!activeSession) return;

    setUserState(prev => {
      const nextLevelMap: Record<LearningLevel, LearningLevel> = {
        [LearningLevel.DUMMIES]: LearningLevel.SMARTIES,
        [LearningLevel.SMARTIES]: LearningLevel.WISE,
        [LearningLevel.WISE]: LearningLevel.WISE,
      };

      const newLevel = score > 80 ? nextLevelMap[activeSession.level] : activeSession.level;
      const newXp = prev.xp + Math.floor(score * 1.5);
      
      let newBadge = prev.badge;
      if (newXp > 5000) newBadge = 'Strategist';
      else if (newXp > 2500) newBadge = 'Analyst';

      return {
        ...prev,
        xp: newXp,
        badge: newBadge,
        levelProgress: {
          ...prev.levelProgress,
          [activeSession.unit]: newLevel
        }
      };
    });
    
    setActiveSession(null);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header 
        userState={userState} 
        onLogoClick={() => setActiveSession(null)}
      />
      
      {!activeSession ? (
        <Dashboard 
          userState={userState} 
          onStartLesson={handleStartLesson} 
        />
      ) : (
        <StudySession 
          unit={activeSession.unit} 
          level={activeSession.level}
          onComplete={handleSessionComplete}
          onExit={() => setActiveSession(null)}
        />
      )}

      {/* Persistent Call-to-Action / Floating Stats */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-2">
         <div className="glass px-6 py-4 rounded-2xl flex items-center gap-4 border border-zinc-800 shadow-2xl">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em]">Neural Sync</span>
              <span className="text-sm font-mono text-white">Active State: Optimal</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
         </div>
      </div>
    </div>
  );
};

export default App;
