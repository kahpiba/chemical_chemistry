import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Trophy,
  Zap,
  Star,
  RotateCcw,
  Flame,
  ChevronRight,
  Award,
  Target,
  TrendingUp,
  Timer,
  Volume2,
  VolumeX,
  Check,
  X as XIcon,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import type { QuizDifficulty, QuizCategory, QuizQuestion } from '../../data/quizData';
import { playClick, playSuccess, playError, setMuted, isMuted } from '../../utils/audio';
import '../../styles/quiz.css';

type QuizState = 'menu' | 'playing' | 'result';

const CATEGORY_LABELS: Record<QuizCategory, string> = {
  elements: 'Unsur Kimia',
  reactions: 'Reaksi Kimia',
  molecules: 'Molekul',
  flame: 'Uji Nyala Api',
  general: 'Kimia Umum',
};

const CATEGORY_ICONS: Record<QuizCategory, string> = {
  elements: '⚛️',
  reactions: '🧪',
  molecules: '🔬',
  flame: '🔥',
  general: '📚',
};

const DIFFICULTY_LABELS: Record<QuizDifficulty, string> = {
  easy: 'Pemula',
  medium: 'Menengah',
  hard: 'Ahli',
};

const DIFFICULTY_COLORS: Record<QuizDifficulty, string> = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
};

const TIME_LIMITS: Record<QuizDifficulty, number> = {
  easy: 30,
  medium: 20,
  hard: 15,
};

export const QuizArena: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty>('easy');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | 'all'>('all');

  // Playing state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [audioMuted, setAudioMuted] = useState(false);
  const timerRef = useRef<number | null>(null);
  const [xpGained, setXpGained] = useState(0);

  const currentQuestion = questions[currentIndex] ?? null;

  // Filter and shuffle questions
  const startQuiz = useCallback(() => {
    let pool = QUIZ_QUESTIONS.filter(q => q.difficulty === selectedDifficulty);
    if (selectedCategory !== 'all') {
      pool = pool.filter(q => q.category === selectedCategory);
    }
    // Shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setXpGained(0);
    setTimeLeft(TIME_LIMITS[selectedDifficulty]);
    setQuizState('playing');
  }, [selectedDifficulty, selectedCategory]);

  // Timer
  useEffect(() => {
    if (quizState !== 'playing' || showExplanation) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time out - auto wrong
          if (timerRef.current) clearInterval(timerRef.current);
          handleAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState, currentIndex, showExplanation]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (showExplanation || !currentQuestion) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      const streakBonus = Math.min(streak + 1, 5);
      const timeBonus = Math.floor(timeLeft * 2);
      const earned = currentQuestion.points * streakBonus + timeBonus;
      setScore(prev => prev + earned);
      setXpGained(prev => prev + earned);
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      setCorrectCount(prev => prev + 1);
      playSuccess();
    } else {
      setStreak(0);
      playError();
    }
  }, [showExplanation, currentQuestion, streak, timeLeft]);

  const handleNext = useCallback(() => {
    playClick();
    if (currentIndex + 1 >= questions.length) {
      setQuizState('result');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(TIME_LIMITS[selectedDifficulty]);
    }
  }, [currentIndex, questions.length, selectedDifficulty]);

  const toggleMute = () => {
    setAudioMuted(!audioMuted);
    setMuted(!audioMuted);
  };

  // Calculate grade
  const grade = useMemo(() => {
    if (questions.length === 0) return { letter: '-', color: '#94a3b8' };
    const pct = (correctCount / questions.length) * 100;
    if (pct >= 90) return { letter: 'A+', color: '#22c55e' };
    if (pct >= 80) return { letter: 'A', color: '#16a34a' };
    if (pct >= 70) return { letter: 'B', color: '#0ea5e9' };
    if (pct >= 60) return { letter: 'C', color: '#f59e0b' };
    if (pct >= 50) return { letter: 'D', color: '#f97316' };
    return { letter: 'E', color: '#ef4444' };
  }, [correctCount, questions.length]);

  // ========== MENU STATE ==========
  if (quizState === 'menu') {
    return (
      <div className="quiz-arena">
        <div className="quiz-menu glass-panel">
          <div className="quiz-menu-header">
            <div className="quiz-icon-badge">
              <Trophy size={32} />
            </div>
            <h2>Quiz Arena</h2>
            <p>Uji pengetahuan kimiamu dan kumpulkan poin!</p>
          </div>

          {/* Difficulty Selector */}
          <div className="quiz-setting-group">
            <label>
              <Target size={14} />
              Tingkat Kesulitan
            </label>
            <div className="quiz-chips">
              {(['easy', 'medium', 'hard'] as QuizDifficulty[]).map(d => (
                <button
                  key={d}
                  className={`quiz-chip ${selectedDifficulty === d ? 'active' : ''}`}
                  onClick={() => { setSelectedDifficulty(d); playClick(); }}
                  style={{
                    '--chip-color': DIFFICULTY_COLORS[d],
                  } as React.CSSProperties}
                >
                  <span className="chip-dot" />
                  {DIFFICULTY_LABELS[d]}
                  <span className="chip-meta">{TIME_LIMITS[d]}s</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div className="quiz-setting-group">
            <label>
              <Zap size={14} />
              Kategori
            </label>
            <div className="quiz-chips">
              <button
                className={`quiz-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => { setSelectedCategory('all'); playClick(); }}
                style={{ '--chip-color': '#0284c7' } as React.CSSProperties}
              >
                🎯 Semua
              </button>
              {(Object.keys(CATEGORY_LABELS) as QuizCategory[]).map(cat => (
                <button
                  key={cat}
                  className={`quiz-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(cat); playClick(); }}
                  style={{ '--chip-color': '#0284c7' } as React.CSSProperties}
                >
                  {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Avail count */}
          <div className="quiz-available">
            {(() => {
              let pool = QUIZ_QUESTIONS.filter(q => q.difficulty === selectedDifficulty);
              if (selectedCategory !== 'all') pool = pool.filter(q => q.category === selectedCategory);
              return `${Math.min(pool.length, 10)} soal tersedia`;
            })()}
          </div>

          <button className="btn btn-primary quiz-start-btn" onClick={() => { playClick(); startQuiz(); }}>
            <Flame size={20} />
            Mulai Quiz!
          </button>
        </div>
      </div>
    );
  }

  // ========== RESULT STATE ==========
  if (quizState === 'result') {
    return (
      <div className="quiz-arena">
        <div className="quiz-result glass-panel">
          <div className="result-header">
            <div className="result-grade" style={{ borderColor: grade.color, color: grade.color }}>
              {grade.letter}
            </div>
            <h2>Quiz Selesai!</h2>
            <p className="result-subtitle">
              {correctCount >= questions.length * 0.8
                ? '🎉 Luar Biasa! Kamu menguasai materi ini!'
                : correctCount >= questions.length * 0.5
                ? '👍 Bagus! Terus berlatih untuk hasil yang lebih baik.'
                : '💪 Jangan menyerah! Pelajari materi dan coba lagi.'}
            </p>
          </div>

          <div className="result-stats-grid">
            <div className="result-stat">
              <Check size={20} color="#22c55e" />
              <span className="stat-value">{correctCount}/{questions.length}</span>
              <span className="stat-label">Benar</span>
            </div>
            <div className="result-stat">
              <Star size={20} color="#f59e0b" />
              <span className="stat-value">{score}</span>
              <span className="stat-label">Skor Total</span>
            </div>
            <div className="result-stat">
              <Zap size={20} color="#ef4444" />
              <span className="stat-value">{maxStreak}x</span>
              <span className="stat-label">Streak Maks</span>
            </div>
            <div className="result-stat">
              <TrendingUp size={20} color="#0ea5e9" />
              <span className="stat-value">+{xpGained}</span>
              <span className="stat-label">XP Diperoleh</span>
            </div>
          </div>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => { playClick(); startQuiz(); }}>
              <RotateCcw size={16} />
              Main Lagi
            </button>
            <button className="btn btn-ghost" onClick={() => { playClick(); setQuizState('menu'); }}>
              Kembali ke Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== PLAYING STATE ==========
  return (
    <div className="quiz-arena">
      {/* Top HUD */}
      <div className="quiz-hud glass-panel">
        <div className="hud-left">
          <div className="hud-progress">
            <span className="hud-question-num">
              {currentIndex + 1}/{questions.length}
            </span>
            <div className="hud-progress-bar">
              <div
                className="hud-progress-fill"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="hud-center">
          {streak >= 2 && (
            <div className="streak-badge">
              <Zap size={14} />
              <span>{streak}x Streak!</span>
            </div>
          )}
        </div>

        <div className="hud-right">
          <div className="hud-score">
            <Star size={14} color="#f59e0b" />
            <span>{score}</span>
          </div>
          <div className={`hud-timer ${timeLeft <= 5 ? 'danger' : ''}`}>
            <Timer size={14} />
            <span>{timeLeft}s</span>
          </div>
          <button className="btn-icon-sm" onClick={toggleMute} title={audioMuted ? 'Unmute' : 'Mute'}>
            {audioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="quiz-question-area">
          <div className="question-card glass-panel">
            <div className="question-meta">
              <span
                className="difficulty-tag"
                style={{ color: DIFFICULTY_COLORS[currentQuestion.difficulty] }}
              >
                {DIFFICULTY_LABELS[currentQuestion.difficulty]}
              </span>
              <span className="category-tag">
                {CATEGORY_ICONS[currentQuestion.category]} {CATEGORY_LABELS[currentQuestion.category]}
              </span>
              <span className="points-tag">
                <Award size={12} />
                {currentQuestion.points} pts
              </span>
            </div>

            <h3 className="question-text">{currentQuestion.question}</h3>

            <div className="options-grid">
              {currentQuestion.options.map((opt, i) => {
                const letters = ['A', 'B', 'C', 'D'];
                let optClass = 'option-btn';
                if (showExplanation) {
                  if (i === currentQuestion.correctIndex) optClass += ' correct';
                  else if (i === selectedAnswer) optClass += ' wrong';
                  else optClass += ' dimmed';
                } else if (selectedAnswer === i) {
                  optClass += ' selected';
                }
                return (
                  <button
                    key={i}
                    className={optClass}
                    onClick={() => handleAnswer(i)}
                    disabled={showExplanation}
                  >
                    <span className="option-letter">{letters[i]}</span>
                    <span className="option-text">{opt}</span>
                    {showExplanation && i === currentQuestion.correctIndex && (
                      <Check size={18} className="option-icon" />
                    )}
                    {showExplanation && i === selectedAnswer && i !== currentQuestion.correctIndex && (
                      <XIcon size={18} className="option-icon wrong-icon" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="explanation-box">
                <div className="explanation-header">
                  {selectedAnswer === currentQuestion.correctIndex ? (
                    <><Check size={16} color="#22c55e" /> <strong>Benar!</strong></>
                  ) : (
                    <><XIcon size={16} color="#ef4444" /> <strong>Kurang Tepat</strong></>
                  )}
                </div>
                <p>{currentQuestion.explanation}</p>
                <button className="btn btn-primary next-btn" onClick={handleNext}>
                  {currentIndex + 1 >= questions.length ? 'Lihat Hasil' : 'Soal Berikutnya'}
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
