import React, { useState } from 'react';
import {
  Compass,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CHEMISTRY_QUESTS } from '../../data/questsData';
import type { ChemistryQuest, QuestStep } from '../../data/questsData';
import { playSuccess, playError, playClick } from '../../utils/audio';
import '../../styles/quests.css';

export const ChemistryQuests: React.FC = () => {
  const [selectedQuest, setSelectedQuest] = useState<ChemistryQuest | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [totalScore, setTotalScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('chem_detective_score');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const handleStartQuest = (quest: ChemistryQuest) => {
    playClick();
    setSelectedQuest(quest);
    setCurrentStepIndex(0);
    setSelectedOptionId(null);
    setShowHint(false);
    setIsCompleted(false);
  };

  const handleBackToList = () => {
    playClick();
    setSelectedQuest(null);
  };

  const currentStep: QuestStep | null =
    selectedQuest && selectedQuest.steps[currentStepIndex]
      ? selectedQuest.steps[currentStepIndex]
      : null;

  const currentOption = currentStep?.options.find((opt) => opt.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    if (!currentStep) return;
    const option = currentStep.options.find((o) => o.id === optId);
    if (!option) return;

    setSelectedOptionId(optId);

    if (option.isCorrect) {
      playSuccess();
    } else {
      playError();
    }
  };

  const handleNextStep = () => {
    playClick();
    if (!selectedQuest) return;

    if (currentStepIndex + 1 < selectedQuest.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowHint(false);
    } else {
      // Finished all steps
      setIsCompleted(true);
      const newScore = totalScore + selectedQuest.rewardPoints;
      setTotalScore(newScore);
      try {
        localStorage.setItem('chem_detective_score', newScore.toString());
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="quests-container">
      {/* Header Card */}
      <div className="quests-header-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
            }}
          >
            <Compass size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Misi Detektif Kimia & Tantangan Sains
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Pecahkan misteri kasus nyata laboratorium dengan metode ilmiah dan analisis kimia kritis
            </span>
          </div>
        </div>

        {/* Detective Score Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '8px 14px',
          }}
        >
          <Award size={20} color="#f59e0b" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#64748b' }}>
              Skor Detektif
            </span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalScore} Poin
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Quest List vs Active Mission */}
      {!selectedQuest ? (
        <div className="quest-cards-grid">
          {CHEMISTRY_QUESTS.map((quest) => {
            const badgeClass =
              quest.difficulty === 'Mudah'
                ? 'easy'
                : quest.difficulty === 'Sedang'
                ? 'medium'
                : 'hard';

            return (
              <div
                key={quest.id}
                className="quest-card"
                onClick={() => handleStartQuest(quest)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`quest-badge ${badgeClass}`}>{quest.difficulty}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1' }}>
                      +{quest.rewardPoints} XP
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {quest.title}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                    Topik: {quest.topic}
                  </span>

                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {quest.scenario.length > 120
                      ? quest.scenario.slice(0, 120) + '...'
                      : quest.scenario}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {quest.steps.length} Langkah Investigasi
                  </span>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartQuest(quest);
                    }}
                  >
                    Mulai Misi
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : isCompleted ? (
        /* Mission Completed Card */
        <div className="active-quest-panel">
          <div className="conclusion-banner">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
              }}
            >
              <ShieldCheck size={36} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#065f46', margin: 0 }}>
              Kasus Telah Terpecahkan!
            </h2>
            <p style={{ fontSize: '14px', color: '#047857', maxWidth: '650px', lineHeight: 1.6, margin: 0 }}>
              {selectedQuest.conclusion}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1px solid #a7f3d0',
                marginTop: '6px',
              }}
            >
              <Sparkles size={18} color="#059669" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#065f46' }}>
                Reward: +{selectedQuest.rewardPoints} Poin Ditambahkan ke Profil Detektif
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => handleStartQuest(selectedQuest)}
                style={{ gap: '6px' }}
              >
                <RotateCcw size={14} />
                Ulangi Kasus Ini
              </button>
              <button
                className="btn btn-primary"
                onClick={handleBackToList}
                style={{ gap: '6px' }}
              >
                Pilih Kasus Lain
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Active Mission Step */
        <div className="active-quest-panel">
          {/* Top navigation & progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handleBackToList}
              style={{
                border: 'none',
                background: 'none',
                color: '#64748b',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ← Kembali ke Daftar Kasus
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6366f1' }}>
              Langkah {currentStepIndex + 1} dari {selectedQuest.steps.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="quest-progress-track">
            <div
              className="quest-progress-fill"
              style={{
                width: `${((currentStepIndex + 1) / selectedQuest.steps.length) * 100}%`,
              }}
            />
          </div>

          {/* Scenario Briefing */}
          <div className="scenario-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="#3b82f6" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>
                Briefing Kasus: {selectedQuest.title}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {selectedQuest.scenario}
            </p>
          </div>

          {/* Step Question Container */}
          {currentStep && (
            <div className="step-container">
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {currentStep.title}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-line' }}>
                {currentStep.instruction}
              </p>

              {/* Options */}
              <div className="options-grid">
                {currentStep.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optClass = 'option-button';
                  if (isSelected) {
                    optClass += opt.isCorrect ? ' correct' : ' wrong';
                  }

                  return (
                    <button
                      key={opt.id}
                      className={optClass}
                      onClick={() => handleSelectOption(opt.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                        {isSelected ? (
                          opt.isCorrect ? (
                            <CheckCircle2 size={18} color="#16a34a" />
                          ) : (
                            <XCircle size={18} color="#dc2626" />
                          )
                        ) : (
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: '2px solid #cbd5e1',
                            }}
                          />
                        )}
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>{opt.label}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '26px' }}>
                        {opt.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Feedback Alert */}
              {currentOption && (
                <div
                  className={`feedback-box ${currentOption.isCorrect ? 'success' : 'error'}`}
                >
                  {currentOption.isCorrect ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                  <span>{currentOption.feedback}</span>
                </div>
              )}

              {/* Hint & Next Step action */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: 'none',
                      background: 'none',
                      color: '#6366f1',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    <HelpCircle size={14} />
                    {showHint ? 'Sembunyikan Petunjuk' : 'Butuh Petunjuk Forensik?'}
                  </button>
                  {showHint && (
                    <div
                      style={{
                        marginTop: '6px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: '#eef2ff',
                        color: '#4338ca',
                        fontSize: '12px',
                      }}
                    >
                      💡 {currentStep.hint}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  disabled={!currentOption || !currentOption.isCorrect}
                  onClick={handleNextStep}
                  style={{
                    opacity: currentOption && currentOption.isCorrect ? 1 : 0.4,
                    cursor: currentOption && currentOption.isCorrect ? 'pointer' : 'not-allowed',
                    gap: '6px',
                  }}
                >
                  {currentStepIndex + 1 === selectedQuest.steps.length
                    ? 'Selesaikan Kasus'
                    : 'Langkah Berikutnya'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
