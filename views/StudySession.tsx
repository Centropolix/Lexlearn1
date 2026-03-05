
import React, { useState, useEffect } from 'react';
import { LearningLevel, CourseUnit, AIResponse } from '../types';
import { getAIPedagogyResponse, generateLessonSeed } from '../services/geminiService';

interface StudySessionProps {
  unit: CourseUnit;
  level: LearningLevel;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const StudySession: React.FC<StudySessionProps> = ({ unit, level, onComplete, onExit }) => {
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<any>(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<AIResponse | null>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await generateLessonSeed(level, unit);
        setLesson(data);
      } catch (err) {
        console.error("Failed to initialize study session:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [level, unit]);

  const handleSubmit = async () => {
    setLoading(true);
    const result = await getAIPedagogyResponse(level, unit, userInput, lesson.content + " " + (lesson.metadata || ""));
    setFeedback(result);
    setLoading(false);
  };

  if (loading && !lesson) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-6">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-zinc-200 rounded-full animate-spin" />
        <p className="serif italic text-zinc-400 animate-pulse tracking-wide">Synthesizing Cognitive Scenario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-8 max-w-4xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onExit} className="text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          ← Terminate Session
        </button>
        <div className="text-right">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Current Core</p>
          <p className="text-sm font-semibold text-zinc-300">{unit}</p>
        </div>
      </div>

      <div className="flex-1 space-y-12">
        {/* Lesson Card */}
        <div className="p-10 rounded-3xl glass shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-2 py-0.5 rounded bg-white text-black text-[9px] font-black uppercase">{level}</span>
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-[10px] text-zinc-500 font-mono italic">Module.v3.1</span>
          </div>
          
          <h3 className="serif text-3xl mb-6 text-white leading-tight">
            {lesson?.title}
          </h3>
          
          <p className="text-zinc-300 leading-relaxed text-lg mb-8 whitespace-pre-wrap">
            {lesson?.content}
          </p>

          {level === LearningLevel.DUMMIES && lesson?.metadata && (
            <div className="p-6 bg-zinc-900/50 border-l-4 border-zinc-500 rounded-r-xl italic text-zinc-400">
              " {lesson.metadata} "
            </div>
          )}

          {level === LearningLevel.WISE && lesson?.options && (
            <div className="grid grid-cols-1 gap-3 mt-8">
              {lesson.options.map((opt: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setUserInput(opt)}
                  className={`p-4 rounded-xl border text-left transition-all text-sm
                    ${userInput === opt ? 'border-zinc-200 bg-white text-black' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input & Feedback Logic */}
        {!feedback ? (
          <div className="space-y-6">
             <label className="text-xs uppercase font-bold tracking-widest text-zinc-500 ml-4">
                {level === LearningLevel.DUMMIES ? "Explain it in your own words" : level === LearningLevel.SMARTIES ? "Provide your legal reasoning" : "State your strategic justification"}
             </label>
             <textarea 
               value={userInput}
               onChange={(e) => setUserInput(e.target.value)}
               placeholder="Write with precision..."
               className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-200 focus:outline-none focus:border-zinc-500 transition-all resize-none font-light leading-relaxed"
             />
             <button 
               onClick={handleSubmit}
               disabled={!userInput || loading}
               className={`w-full py-4 rounded-2xl font-bold tracking-widest uppercase transition-all
                 ${userInput && !loading ? 'bg-zinc-100 text-black hover:bg-white active:scale-95' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
               `}
             >
               {loading ? "Analyzing Reasoning..." : "Submit Logic Output"}
             </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 pb-20">
            <div className={`p-8 rounded-3xl border ${feedback.score > 70 ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-900/30'}`}>
               <div className="flex justify-between items-center mb-6">
                 <h4 className={`serif text-2xl italic ${feedback.score > 70 ? 'text-black' : 'text-white'}`}>Cognitive Feedback</h4>
                 <div className="text-right">
                    <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${feedback.score > 70 ? 'text-zinc-400' : 'text-zinc-600'}`}>Reasoning Score</span>
                    <span className={`text-3xl font-mono font-bold ${feedback.score > 70 ? 'text-black' : 'text-zinc-200'}`}>{feedback.score}</span>
                 </div>
               </div>

               <p className={`leading-relaxed mb-8 ${feedback.score > 70 ? 'text-zinc-800' : 'text-zinc-400'}`}>
                 {feedback.feedback}
               </p>

               {feedback.logicCheck && (
                 <div className="space-y-3 mb-8">
                   <h5 className={`text-[10px] font-black uppercase tracking-widest ${feedback.score > 70 ? 'text-zinc-400' : 'text-zinc-600'}`}>Neural Point Sync</h5>
                   {feedback.logicCheck.map((point, i) => (
                     <div key={i} className="flex items-center gap-3">
                       <div className={`w-1.5 h-1.5 rounded-full ${feedback.score > 70 ? 'bg-black' : 'bg-zinc-200'}`} />
                       <span className={`text-xs ${feedback.score > 70 ? 'text-zinc-600' : 'text-zinc-400'}`}>{point}</span>
                     </div>
                   ))}
                 </div>
               )}

               <button 
                 onClick={() => onComplete(feedback.score)}
                 className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all
                   ${feedback.score > 70 ? 'bg-black text-white' : 'bg-zinc-100 text-black'}
                 `}
               >
                 Advance Progression
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySession;
