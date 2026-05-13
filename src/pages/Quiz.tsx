import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  doc, 
  updateDoc,
  increment
} from 'firebase/firestore';
import { QUIZ_LEVELS } from '../constants';
import { 
  Trophy, 
  Star, 
  Coins, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Timer,
  Award,
  Crown,
  Medal
} from 'lucide-react';

const QuizPage: React.FC = () => {
  const { profile, logActivity } = useAuth();
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [quizLevel, setQuizLevel] = useState(1);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Helper to shuffle array
  const shuffleArray = (array: any[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  useEffect(() => {
    if (profile) {
      setQuizLevel(profile.quizLevel || 1);
    }
  }, [profile]);

  useEffect(() => {
    if (!auth.currentUser) return;

    setIsSyncing(true);
    const q = query(collection(db, 'users'), orderBy('exp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeaderboard(data);
      setLastUpdate(new Date());
      setIsSyncing(false);
    }, (error) => {
      setIsSyncing(false);
      handleFirestoreError(error, OperationType.LIST, 'users');
    });
    return () => unsubscribe();
  }, [profile]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !selectedAnswer) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing' && !selectedAnswer) {
      handleAnswer('');
    }
  }, [gameState, timeLeft, selectedAnswer]);

  const startQuiz = () => {
    const levelData = QUIZ_LEVELS[quizLevel] || QUIZ_LEVELS[1];
    // Randomize questions from the level
    const shuffledQuestions = shuffleArray(levelData.questions);
    setQuestions(shuffledQuestions.slice(0, 10));
    setGameState('playing');
    setCurrentQuestionIdx(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setShowExplanation(false);
    // Shuffle options for first question
    setShuffledOptions(shuffleArray(shuffledQuestions[0].options));
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIdx].options[questions[currentQuestionIdx].correctAnswer]) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < 9) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setTimeLeft(15);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShuffledOptions(shuffleArray(questions[nextIdx].options));
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setGameState('result');
    
    if (profile) {
      const earnedExp = score * 10 + (score >= 7 ? 100 : 0);
      const earnedCoins = score * 5 + (score >= 7 ? 50 : 0);
      const passed = score >= 7;

      try {
        logActivity?.({
          type: 'action',
          path: '/quiz',
          description: `Selesai Kuis Level ${quizLevel} dengan skor ${score}/10 (${passed ? 'Lulus' : 'Gagal'})`
        });

        const updatePayload: any = {
          exp: increment(earnedExp),
          coins: increment(earnedCoins),
          totalQuizScore: increment(score),
        };

        if (passed) {
          // If they pass the level they are currently on
          if (quizLevel === (profile.quizLevel || 1)) {
            updatePayload.quizLevel = increment(1);
            setQuizLevel(prev => prev + 1);
          }
          
          // Badge logic
          const newBadges = [...(profile.badges || [])];
          if (profile.quizLevel === 5 && !newBadges.some((b: any) => b.id === 'quiz-master')) {
            newBadges.push({ id: 'quiz-master', name: 'Quiz Master', icon: '🎓', description: 'Menyelesaikan semua level kuis harmoni sosial.' });
            updatePayload.badges = newBadges;
          }
        }

        await updateDoc(doc(db, 'users', profile.uid), updatePayload);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${profile.uid}`);
      }
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <AnimatePresence mode="wait">
        {gameState === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-[3rem] p-10 border-4 border-sidebar-border shadow-xl text-center">
                <div className="w-24 h-24 bg-baby-blue rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-lg text-4xl">
                  🚀
                </div>
                <h1 className="text-4xl font-display font-black text-text-primary mb-2">SocioQuiz</h1>
                <p className="text-slate-500 font-medium mb-8">Kuasai materi sosiologi dengan tantangan interaktif. Selesaikan semua level!</p>
                
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 flex flex-col items-center">
                    <Award className="text-yellow-400 mb-2" size={32} />
                    <span className="text-2xl font-black text-text-primary">Level {quizLevel}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{QUIZ_LEVELS[quizLevel]?.title || 'Master'}</span>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 flex flex-col items-center">
                    <Trophy className="text-baby-blue mb-2" size={32} />
                    <span className="text-2xl font-black text-text-primary">{profile.exp || 0}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total EXP</span>
                  </div>
                </div>

                {QUIZ_LEVELS[quizLevel] ? (
                  <button
                    onClick={startQuiz}
                    className="w-full py-6 bg-gradient-to-r from-baby-blue to-lilac text-white rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-4 border-white"
                  >
                    Mulai Level {quizLevel}: {QUIZ_LEVELS[quizLevel].title} <ChevronRight />
                  </button>
                ) : (
                  <div className="p-6 bg-green-50 border-4 border-green-200 rounded-[2rem] text-center">
                    <Crown className="text-green-500 mx-auto mb-2" size={40} />
                    <p className="text-lg font-black text-green-700">Selamat! Kamu sudah menyelesaikan semua level harmoni sosial.</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border-4 border-sidebar-border shadow-md">
                <h2 className="text-2xl font-black text-text-primary mb-6 flex items-center gap-3">
                  <Medal className="text-orange-400" /> Aturan Main
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 font-black">1</div>
                    <p className="text-slate-600">Ada 10 pertanyaan setiap level. Kamu punya 15 detik per soal.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-black">2</div>
                    <p className="text-slate-600">Minimal benar <b>7 soal</b> untuk naik ke level berikutnya.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center shrink-0 font-black">3</div>
                    <p className="text-slate-600">Dapatkan koin dan EXP setiap kali berhasil naik level.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-8 border-4 border-sidebar-border shadow-xl h-fit sticky top-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-text-primary flex items-center gap-3">
                  <Crown className="text-yellow-500" /> Leaderboard
                </h2>
                {isSyncing ? (
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-2 text-[10px] font-black text-baby-blue uppercase"
                  >
                    <div className="w-2 h-2 bg-baby-blue rounded-full" />
                    Syncing
                  </motion.div>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Aktif: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-4">
                {leaderboard.map((user, idx) => (
                  <div key={user.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border-2 border-transparent hover:border-baby-blue transition-all group relative">
                    <div className={`w-8 h-8 font-black flex items-center justify-center rounded-xl text-sm ${idx === 0 ? 'bg-yellow-400 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                      {idx + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 relative">
                      <img src={user.avatar} alt="user" className="w-full h-full object-cover" />
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm z-10" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-black text-text-primary truncate">{user.username}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Level {user.level || 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-baby-blue">{user.exp || 0}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">EXP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border-4 border-sidebar-border shadow-xl max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Level {quizLevel}</span>
                <div className="bg-slate-100 px-3 md:px-4 py-1 rounded-lg md:rounded-xl font-black text-baby-blue text-[10px] md:text-xs uppercase">
                  {QUIZ_LEVELS[quizLevel]?.title}
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl md:rounded-2xl font-black text-lg md:text-xl border-4 ${timeLeft < 5 ? 'bg-red-50 text-red-500 border-red-500 animate-pulse' : 'bg-sidebar-bg text-text-primary border-sidebar-border'}`}>
                <Timer size={20} /> {timeLeft}s
              </div>
            </div>

            <div className="mb-8 md:mb-10 min-h-[80px] md:min-h-[100px] flex items-center justify-center">
              <h2 className="text-xl md:text-2xl font-black text-text-primary leading-tight text-center">
                {questions[currentQuestionIdx]?.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {shuffledOptions.map((opt: string, i: number) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === questions[currentQuestionIdx].options[questions[currentQuestionIdx].correctAnswer];
                const isWrong = isSelected && !isCorrect;
                
                return (
                  <button
                    key={i}
                    onClick={() => !selectedAnswer && handleAnswer(opt)}
                    disabled={!!selectedAnswer}
                    className={`p-5 rounded-[1.5rem] border-4 text-base font-black transition-all flex items-center justify-between group ${
                      selectedAnswer && isCorrect ? 'bg-green-100 border-green-500 text-green-700 shadow-[0_4px_0_0_rgba(34,197,94,1)]' :
                      isWrong ? 'bg-red-100 border-red-500 text-red-700 shadow-[0_4px_0_0_rgba(239,68,68,1)]' :
                      'bg-slate-50 border-slate-100 text-text-primary hover:border-baby-blue hover:bg-baby-blue/5 shadow-[0_4px_0_0_rgba(241,245,249,1)]'
                    }`}
                  >
                    <span className="text-left pr-4">{opt}</span>
                    {selectedAnswer && isCorrect && <CheckCircle2 className="shrink-0 text-green-500" />}
                    {isWrong && <XCircle className="shrink-0 text-red-500" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-8 overflow-hidden"
                >
                  <div className={`p-6 rounded-3xl border-4 ${selectedAnswer === questions[currentQuestionIdx].options[questions[currentQuestionIdx].correctAnswer] ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <p className="font-black text-sm uppercase tracking-widest mb-1">
                      {selectedAnswer === questions[currentQuestionIdx].options[questions[currentQuestionIdx].correctAnswer] ? '🎉 Benar!' : '💡 Penjelasan:'}
                    </p>
                    <p className="text-slate-600 font-medium text-sm mb-4">
                      {questions[currentQuestionIdx].explanation}
                    </p>
                    <button
                      onClick={nextQuestion}
                      className="w-full py-3 bg-text-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                      Lanjutkan <ChevronRight className="inline" size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showExplanation && (
              <div className="mt-8 h-3 w-full bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200">
                <motion.div 
                  className="h-full bg-baby-blue"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIdx + 1) / 10) * 100}%` }}
                />
              </div>
            )}
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div
            key="result"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border-4 border-sidebar-border shadow-2xl text-center max-w-2xl mx-auto"
          >
            <div className={`w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 rounded-full flex items-center justify-center text-5xl md:text-6xl shadow-xl border-8 ${score >= 7 ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}>
              {score >= 7 ? '🏆' : '💪'}
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-black text-text-primary mb-2">
              {score >= 7 ? 'Level Selesai!' : 'Coba Lagi!'}
            </h2>
            <p className="text-lg md:text-xl font-bold text-slate-500 mb-8 md:mb-10">
              Kamu menjawab <span className={score >= 7 ? 'text-green-500' : 'text-red-500'}>{score} dari 10</span> soal dengan benar.
            </p>

            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
              <div className="bg-yellow-50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-4 border-yellow-200 shadow-sm">
                <div className="flex items-center justify-center gap-2 text-yellow-600 mb-1 md:mb-2 font-black uppercase tracking-widest text-[10px] md:text-sm">
                  <Coins size={16} /> Coins
                </div>
                <div className="text-2xl md:text-3xl font-black text-yellow-700">
                  +{score * 5 + (score >= 7 ? 50 : 0)}
                </div>
              </div>
              <div className="bg-blue-50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-4 border-blue-200 shadow-sm">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-1 md:mb-2 font-black uppercase tracking-widest text-[10px] md:text-sm">
                  <Star size={16} /> EXP
                </div>
                <div className="text-2xl md:text-3xl font-black text-blue-700">
                  +{score * 10 + (score >= 7 ? 100 : 0)}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {score >= 7 ? (
                <>
                  {QUIZ_LEVELS[quizLevel] ? (
                    <button
                      onClick={startQuiz}
                      className="w-full py-6 bg-baby-blue text-white rounded-3xl font-black text-xl uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white"
                    >
                      Lanjut Level {quizLevel} <ChevronRight className="inline" />
                    </button>
                  ) : (
                    <div className="p-6 bg-green-50 border-4 border-green-200 rounded-3xl text-center">
                      <p className="text-lg font-black text-green-700">Kamu sudah menyelesaikan semua level kuis!</p>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={startQuiz}
                  className="w-full py-6 bg-baby-blue text-white rounded-3xl font-black text-xl uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white"
                >
                  Ulangi Level
                </button>
              )}
              <button
                onClick={() => setGameState('lobby')}
                className="w-full py-6 bg-text-primary text-white rounded-3xl font-black text-xl uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Ke Lobby
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizPage;
