import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TestTube2,
  Droplet,
  Play,
  Square,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { playDropSound, playBeakerClink, playSuccess, playError } from '../../utils/audio';
import '../../styles/titration.css';

interface TitrationSystem {
  id: string;
  name: string;
  analyteName: string;
  analyteFormula: string;
  analyteMolarity: number; // M
  analyteVolume: number; // mL
  titrantName: string;
  titrantFormula: string;
  titrantMolarity: number; // M
  type: 'strong_strong' | 'weak_strong' | 'strong_weak';
  ka?: number;
  kb?: number;
}

const SYSTEMS: TitrationSystem[] = [
  {
    id: 'hcl_naoh',
    name: 'Asam Klorida (HCl) vs Natrium Hidroksida (NaOH)',
    analyteName: 'Asam Klorida',
    analyteFormula: 'HCl',
    analyteMolarity: 0.100,
    analyteVolume: 25.0,
    titrantName: 'Natrium Hidroksida Standar',
    titrantFormula: 'NaOH',
    titrantMolarity: 0.100,
    type: 'strong_strong',
  },
  {
    id: 'ch3cooh_naoh',
    name: 'Asam Asetat (CH₃COOH) vs Natrium Hidroksida (NaOH)',
    analyteName: 'Asam Asetat (Cuka)',
    analyteFormula: 'CH₃COOH',
    analyteMolarity: 0.100,
    analyteVolume: 25.0,
    titrantName: 'Natrium Hidroksida Standar',
    titrantFormula: 'NaOH',
    titrantMolarity: 0.100,
    type: 'weak_strong',
    ka: 1.8e-5,
  },
  {
    id: 'nh3_hcl',
    name: 'Amonia (NH₃) vs Asam Klorida (HCl)',
    analyteName: 'Larutan Amonia',
    analyteFormula: 'NH₃',
    analyteMolarity: 0.100,
    analyteVolume: 25.0,
    titrantName: 'Asam Klorida Standar',
    titrantFormula: 'HCl',
    titrantMolarity: 0.100,
    type: 'strong_weak',
    kb: 1.8e-5,
  },
];

type IndicatorType = 'pp' | 'btb' | 'mo';

export const TitrationLab: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<TitrationSystem>(SYSTEMS[0]);
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorType>('pp');
  const [volumeAdded, setVolumeAdded] = useState<number>(0.0); // mL (0 to 50 mL)
  const [flowRate, setFlowRate] = useState<'stop' | 'drop' | 'slow' | 'fast'>('stop');
  const [examMode, setExamMode] = useState<boolean>(false);
  const [studentInputM, setStudentInputM] = useState<string>('');
  const [examFeedback, setExamFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // History points for plotting SVG titration curve
  const [curvePoints, setCurvePoints] = useState<{ v: number; ph: number }[]>([]);

  // Burette maximum capacity
  const MAX_BURETTE_VOL = 50.0; // mL
  const buretteRemaining = Math.max(0, MAX_BURETTE_VOL - volumeAdded);

  // Calculate Equivalence Point (V_eq)
  const vEq = useMemo(() => {
    return (selectedSystem.analyteMolarity * selectedSystem.analyteVolume) / selectedSystem.titrantMolarity;
  }, [selectedSystem]);

  // Equivalence pH and Half-Equivalence pH
  const pHEq = useMemo(() => {
    if (selectedSystem.type === 'strong_strong') return 7.0;
    if (selectedSystem.type === 'weak_strong') {
      const Ka = selectedSystem.ka || 1.8e-5;
      const totalV = selectedSystem.analyteVolume + vEq;
      const C_salt = (selectedSystem.analyteMolarity * selectedSystem.analyteVolume) / totalV;
      const Kh = 1e-14 / Ka;
      const OH = Math.sqrt(Kh * C_salt);
      return parseFloat((14.0 - (-Math.log10(OH))).toFixed(2));
    }
    const Kb = selectedSystem.kb || 1.8e-5;
    const totalV = selectedSystem.analyteVolume + vEq;
    const C_salt = (selectedSystem.analyteMolarity * selectedSystem.analyteVolume) / totalV;
    const Kh = 1e-14 / Kb;
    const H = Math.sqrt(Kh * C_salt);
    return parseFloat((-Math.log10(H)).toFixed(2));
  }, [selectedSystem, vEq]);

  const vHalf = useMemo(() => vEq / 2.0, [vEq]);
  const pHHalf = useMemo(() => {
    if (selectedSystem.type === 'weak_strong') {
      const pKa = -Math.log10(selectedSystem.ka || 1.8e-5);
      return parseFloat(pKa.toFixed(2)); // At half-eq, pH = pKa
    }
    if (selectedSystem.type === 'strong_weak') {
      const pKb = -Math.log10(selectedSystem.kb || 1.8e-5);
      return parseFloat((14.0 - pKb).toFixed(2)); // At half-eq, pOH = pKb -> pH = 14 - pKb
    }
    return 1.48; // Strong-strong at half volume
  }, [selectedSystem]);

  // Current Titration Zone
  const currentZone = useMemo(() => {
    if (volumeAdded <= 0.05) {
      return {
        name: 'Awal Titrasi',
        desc: 'Larutan analit murni dalam labu Erlenmeyer sebelum penambahan titran.',
        color: '#64748b',
        badgeBg: '#f1f5f9',
      };
    }
    if (volumeAdded < vEq - 1.5) {
      return {
        name: 'Zona Larutan Penyangga (Buffer Region)',
        desc: `Resistensi perubahan pH tinggi. Titik setengah ekuivalen: V = ${vHalf.toFixed(1)} mL (pH = ${pHHalf.toFixed(2)}).`,
        color: '#0284c7',
        badgeBg: '#e0f2fe',
      };
    }
    if (Math.abs(volumeAdded - vEq) <= 1.5) {
      return {
        name: 'Zona Lonjakan Ekuivalen (Equivalence Jump)',
        desc: `Kecuraman pH ekstrem (pH ekuivalen = ${pHEq.toFixed(2)}). Indikator warna mengalami transisi stabil.`,
        color: '#8b5cf6',
        badgeBg: '#f3e8ff',
      };
    }
    return {
      name: 'Zona Kelebihan Titran (Excess Region)',
      desc: 'Analit telah habis bereaksi. pH kurva mendatar didominasi oleh titran standar berlebih.',
      color: '#10b981',
      badgeBg: '#dcfce7',
    };
  }, [volumeAdded, vEq, pHEq, vHalf, pHHalf]);

  // Exact pH calculation along titration trajectory
  const calculateCurrentPH = (v: number): number => {
    const Va = selectedSystem.analyteVolume; // mL
    const Ma = selectedSystem.analyteMolarity; // M
    const Mt = selectedSystem.titrantMolarity; // M
    const totalV = Va + v; // mL

    if (selectedSystem.type === 'strong_strong') {
      const molH = Ma * Va; // mmol
      const molOH = Mt * v; // mmol
      if (v < vEq - 0.001) {
        const excessH = (molH - molOH) / totalV;
        return -Math.log10(Math.max(1e-14, excessH));
      } else if (Math.abs(v - vEq) <= 0.001) {
        return 7.00;
      } else {
        const excessOH = (molOH - molH) / totalV;
        const pOH = -Math.log10(Math.max(1e-14, excessOH));
        return 14.0 - pOH;
      }
    } else if (selectedSystem.type === 'weak_strong') {
      const Ka = selectedSystem.ka || 1.8e-5;
      const pKa = -Math.log10(Ka);
      if (v <= 0) {
        return 0.5 * (pKa - Math.log10(Ma));
      } else if (v < vEq - 0.01) {
        // Buffer region (Henderson-Hasselbalch)
        const molesSalt = Mt * v;
        const molesAcid = Ma * Va - molesSalt;
        return pKa + Math.log10(Math.max(1e-5, molesSalt / molesAcid));
      } else if (Math.abs(v - vEq) <= 0.01) {
        // Salt hydrolysis at equivalence point
        const C_salt = (Ma * Va) / totalV;
        const Kh = 1e-14 / Ka;
        const OH = Math.sqrt(Kh * C_salt);
        const pOH = -Math.log10(OH);
        return 14.0 - pOH;
      } else {
        // Excess strong base
        const excessOH = (Mt * (v - vEq)) / totalV;
        const pOH = -Math.log10(Math.max(1e-14, excessOH));
        return 14.0 - pOH;
      }
    } else {
      // Weak base vs Strong acid
      const Kb = selectedSystem.kb || 1.8e-5;
      const pKb = -Math.log10(Kb);
      if (v <= 0) {
        const pOH = 0.5 * (pKb - Math.log10(Ma));
        return 14.0 - pOH;
      } else if (v < vEq - 0.01) {
        const molesSalt = Mt * v;
        const molesBase = Ma * Va - molesSalt;
        const pOH = pKb + Math.log10(Math.max(1e-5, molesSalt / molesBase));
        return 14.0 - pOH;
      } else if (Math.abs(v - vEq) <= 0.01) {
        // Cation hydrolysis (acidic salt)
        const C_salt = (Ma * Va) / totalV;
        const Kh = 1e-14 / Kb;
        const H = Math.sqrt(Kh * C_salt);
        return -Math.log10(H);
      } else {
        const excessH = (Mt * (v - vEq)) / totalV;
        return -Math.log10(Math.max(1e-14, excessH));
      }
    }
  };

  const currentPH = useMemo(() => calculateCurrentPH(volumeAdded), [volumeAdded, selectedSystem]);

  // Determine liquid color inside Erlenmeyer flask based on indicator & pH
  const flaskColor = useMemo(() => {
    if (selectedIndicator === 'pp') {
      // Phenolphthalein: colorless < 8.2, pink > 8.2
      if (currentPH < 8.2) return 'rgba(255, 255, 255, 0.4)';
      const alpha = Math.min(0.85, 0.3 + (currentPH - 8.2) * 0.3);
      return `rgba(244, 114, 182, ${alpha.toFixed(2)})`; // soft pink to magenta
    } else if (selectedIndicator === 'btb') {
      // Bromothymol blue: yellow < 6.0, green 6.0-7.6, blue > 7.6
      if (currentPH < 6.0) return 'rgba(250, 204, 21, 0.6)'; // yellow
      if (currentPH > 7.6) return 'rgba(59, 130, 246, 0.65)'; // blue
      return 'rgba(34, 197, 94, 0.65)'; // emerald green at equivalence
    } else {
      // Methyl orange: red < 3.1, orange 3.1-4.4, yellow > 4.4
      if (currentPH < 3.1) return 'rgba(239, 68, 68, 0.65)'; // red
      if (currentPH > 4.4) return 'rgba(234, 179, 8, 0.65)'; // yellow
      return 'rgba(249, 115, 22, 0.65)'; // orange
    }
  }, [selectedIndicator, currentPH]);

  // Timer for automatic dripping flow
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (flowRate === 'stop') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepMl = flowRate === 'slow' ? 0.2 : flowRate === 'fast' ? 1.0 : 0.05;
    const intervalMs = flowRate === 'slow' ? 250 : flowRate === 'fast' ? 200 : 400;

    timerRef.current = setInterval(() => {
      setVolumeAdded((prev) => {
        if (prev + stepMl >= MAX_BURETTE_VOL) {
          setFlowRate('stop');
          return MAX_BURETTE_VOL;
        }
        playDropSound();
        const nextV = parseFloat((prev + stepMl).toFixed(2));
        return nextV;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [flowRate]);

  // Record history points for SVG curve
  useEffect(() => {
    setCurvePoints((prev) => {
      // Add point if last point is far enough
      const last = prev[prev.length - 1];
      if (!last || Math.abs(last.v - volumeAdded) >= 0.2) {
        return [...prev, { v: volumeAdded, ph: currentPH }];
      }
      return prev;
    });
  }, [volumeAdded, currentPH]);

  // Dispense single droplet
  const handleSingleDrop = () => {
    if (volumeAdded + 0.05 > MAX_BURETTE_VOL) return;
    playDropSound();
    setVolumeAdded((prev) => parseFloat((prev + 0.05).toFixed(2)));
  };

  const handleReset = () => {
    playBeakerClink();
    setFlowRate('stop');
    setVolumeAdded(0.0);
    setCurvePoints([{ v: 0, ph: calculateCurrentPH(0) }]);
    setExamFeedback(null);
    setStudentInputM('');
  };

  const handleSystemChange = (sys: TitrationSystem) => {
    setSelectedSystem(sys);
    setFlowRate('stop');
    setVolumeAdded(0.0);
    setCurvePoints([{ v: 0, ph: 1 }]);
    setExamFeedback(null);
    setStudentInputM('');
  };

  const handleVerifyExam = () => {
    const inputVal = parseFloat(studentInputM);
    if (isNaN(inputVal)) {
      playError();
      setExamFeedback({ isCorrect: false, message: 'Masukkan angka desimal konsentrasi yang valid!' });
      return;
    }
    const trueM = selectedSystem.analyteMolarity;
    const diff = Math.abs(inputVal - trueM);
    if (diff <= 0.005) {
      playSuccess();
      setExamFeedback({
        isCorrect: true,
        message: `Luar Biasa! Perhitungan Anda sangat presisi: ${inputVal.toFixed(3)} M (Nilai Sebenarnya: ${trueM.toFixed(3)} M). Anda menguasai teknik titrasi kuantitatif!`,
      });
    } else {
      playError();
      setExamFeedback({
        isCorrect: false,
        message: `Kurang presisi. Hasil Anda: ${inputVal.toFixed(3)} M. Gunakan rumus M_analit = (M_titran × V_titran) / V_analit pada titik perubahan warna indikator!`,
      });
    }
  };

  // SVG Curve coordinate mapping (Width: 400, Height: 200, Margin: 35)
  const svgPathD = useMemo(() => {
    if (curvePoints.length === 0) return '';
    return curvePoints
      .map((pt, i) => {
        const x = 35 + (pt.v / 50.0) * (400 - 55);
        const y = 175 - (pt.ph / 14.0) * (175 - 25);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [curvePoints]);

  return (
    <div className="titration-container">
      {/* Header Card */}
      <div className="titration-header-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <TestTube2 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Laboratorium Titrasi Buret & Kurva pH Real-Time
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Simulasi aparatus buret kaca tetes presisi, indikator asam-basa, dan pemetaan kurva sigmoid titik ekivalen
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className={`filter-pill ${!examMode ? 'active' : ''}`}
              onClick={() => setExamMode(false)}
              style={{ fontSize: '12px' }}
            >
              Mode Latihan Terbimbing
            </button>
            <button
              className={`filter-pill ${examMode ? 'active' : ''}`}
              onClick={() => setExamMode(true)}
              style={{ fontSize: '12px', gap: '6px' }}
            >
              <Award size={14} />
              Ujian Praktikum Buta
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="titration-grid">
        {/* Left Column: Burette & Flask Stage */}
        <div className="titration-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="titration-card-title">
              <Droplet size={18} color="#0284c7" />
              Aparatus Buret & Labu Erlenmeyer
            </h3>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: '6px' }}>
              Titran: {selectedSystem.titrantFormula} ({selectedSystem.titrantMolarity.toFixed(3)} M)
            </span>
          </div>

          {/* Apparatus Stage */}
          <div className="titration-apparatus-stage">
            {/* Retort Stand */}
            <div className="retort-stand-base" />
            <div className="retort-rod" />
            <div className="retort-clamp" />

            {/* Burette Assembly */}
            <div className="burette-assembly">
              <div className="burette-tube">
                {/* Measurement ticks */}
                <div className="burette-ticks">
                  <div className="burette-tick"><span>0</span></div>
                  <div className="burette-tick"><span>10</span></div>
                  <div className="burette-tick"><span>20</span></div>
                  <div className="burette-tick"><span>30</span></div>
                  <div className="burette-tick"><span>40</span></div>
                  <div className="burette-tick"><span>50</span></div>
                </div>

                {/* Liquid Fill Level */}
                <div
                  className="burette-liquid-fill"
                  style={{
                    height: `${(buretteRemaining / MAX_BURETTE_VOL) * 100}%`,
                  }}
                />
              </div>

              {/* Stopcock Valve */}
              <div
                className="burette-stopcock"
                onClick={() => setFlowRate(flowRate === 'stop' ? 'slow' : 'stop')}
                title="Klik kran untuk membuka/menutup aliran"
              >
                <div
                  className="stopcock-handle"
                  style={{
                    transform: flowRate === 'stop' ? 'rotate(0deg)' : 'rotate(90deg)',
                    background: flowRate === 'stop' ? '#ef4444' : '#10b981',
                  }}
                />
              </div>

              <div className="burette-tip" />
            </div>

            {/* Falling Droplets Animation */}
            {flowRate !== 'stop' && <div className="titrant-falling-drop" />}

            {/* Erlenmeyer Flask on Stirrer */}
            <div className="erlenmeyer-setup">
              <div className="flask-neck" />
              <div className="flask-body">
                <div
                  className="flask-liquid"
                  style={{
                    height: `${Math.min(65, 30 + (volumeAdded / 50) * 35)}px`,
                    backgroundColor: flaskColor,
                  }}
                >
                  <div className="flask-stirrer-bar" />
                </div>
              </div>
              <div className="flask-hotplate">MAGNETIC STIRRER</div>
            </div>
          </div>

          {/* Digital Burette Reading */}
          <div className="titration-readout-panel">
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Volume Titran Terpakai:</span>
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'monospace', color: '#0284c7' }}>
                {volumeAdded.toFixed(2)} mL
              </div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>pH Campuran Erlenmeyer:</span>
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'monospace', color: currentPH > 7 ? '#8b5cf6' : '#ea580c' }}>
                {currentPH.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Flow Rate Buttons */}
          <div className="flow-control-group">
            <button
              className={`flow-btn ${flowRate === 'stop' ? 'active' : ''}`}
              onClick={() => setFlowRate('stop')}
            >
              <Square size={14} color="#ef4444" />
              Tutup Kran
            </button>
            <button
              className="flow-btn"
              onClick={handleSingleDrop}
              title="Keluarkan 1 tetes (0.05 mL)"
            >
              <Droplet size={14} color="#0284c7" />
              +1 Tetes
            </button>
            <button
              className={`flow-btn ${flowRate === 'slow' ? 'active' : ''}`}
              onClick={() => setFlowRate('slow')}
            >
              <Play size={14} color="#f59e0b" />
              Aliran Lambat
            </button>
            <button
              className={`flow-btn ${flowRate === 'fast' ? 'active' : ''}`}
              onClick={() => setFlowRate('fast')}
            >
              <Play size={14} color="#10b981" />
              Aliran Cepat
            </button>
          </div>

          {/* Reset Button */}
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            style={{ width: '100%', justifyContent: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} />
            Isi Ulang Buret & Kosongkan Erlenmeyer
          </button>
        </div>

        {/* Right Column: Parameters, Indicators, and Live Sigmoid Curve */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Reaction System Selector */}
          <div className="titration-card">
            <h3 className="titration-card-title">
              <Sparkles size={18} color="#0284c7" />
              Sistem Larutan Titrasi
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SYSTEMS.map((sys) => (
                <button
                  key={sys.id}
                  className={`filter-pill ${selectedSystem.id === sys.id ? 'active' : ''}`}
                  onClick={() => handleSystemChange(sys)}
                  style={{ fontSize: '12px' }}
                >
                  {sys.name}
                </button>
              ))}
            </div>

            {/* Analyte Info Box */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: '#64748b' }}>Analit dalam Erlenmeyer:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedSystem.analyteVolume} mL {selectedSystem.analyteName} ({selectedSystem.analyteFormula})
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748b' }}>Konsentrasi Analit:</span>
                <div style={{ fontWeight: 800, color: examMode ? '#dc2626' : '#0284c7', marginTop: '2px' }}>
                  {examMode ? '??? M (Rahasia Ujian)' : `${selectedSystem.analyteMolarity.toFixed(3)} M`}
                </div>
              </div>
            </div>
          </div>

          {/* Indicator Selector */}
          <div className="titration-card">
            <h3 className="titration-card-title">
              <HelpCircle size={18} color="#f59e0b" />
              Pilihan Indikator Asam-Basa
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button
                className={`filter-pill ${selectedIndicator === 'pp' ? 'active' : ''}`}
                onClick={() => setSelectedIndicator('pp')}
                style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '10px' }}
              >
                <span style={{ fontWeight: 700 }}>Fenolftalein (PP)</span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Bening → Merah Muda (pH 8.2)</span>
              </button>

              <button
                className={`filter-pill ${selectedIndicator === 'btb' ? 'active' : ''}`}
                onClick={() => setSelectedIndicator('btb')}
                style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '10px' }}
              >
                <span style={{ fontWeight: 700 }}>Bromtimol Biru (BTB)</span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Kuning → Hijau → Biru (pH 7.0)</span>
              </button>

              <button
                className={`filter-pill ${selectedIndicator === 'mo' ? 'active' : ''}`}
                onClick={() => setSelectedIndicator('mo')}
                style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '10px' }}
              >
                <span style={{ fontWeight: 700 }}>Metil Jingga (MO)</span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Merah → Oranye → Kuning (pH 4.0)</span>
              </button>
            </div>
          </div>

          {/* Live SVG Sigmoid Titration Curve */}
          <div className="titration-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="titration-card-title">
                <Sparkles size={18} color="#8b5cf6" />
                Kurva Titrasi Sigmoid pH vs Volume Titran
              </h3>
              {!examMode && (
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#6d28d9' }}>
                  Titik Ekivalen Teoretis: V = {vEq.toFixed(1)} mL • pH = {pHEq.toFixed(2)}
                </span>
              )}
            </div>

            <div className="curve-svg-container">
              <svg viewBox="0 0 400 200" className="curve-svg">
                {/* Axis lines */}
                <line x1="35" y1="175" x2="390" y2="175" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="35" y1="20" x2="35" y2="175" stroke="#cbd5e1" strokeWidth="2" />

                {/* Grid guidelines */}
                <line x1="35" y1="100" x2="390" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <text x="28" y="103" fontSize="9" fill="#94a3b8" textAnchor="end">pH 7</text>

                <text x="385" y="190" fontSize="9" fill="#64748b" textAnchor="end">Volume Titran (mL)</text>
                <text x="30" y="25" fontSize="9" fill="#64748b" textAnchor="end" transform="rotate(-90 30 25)">pH</text>

                {/* X axis ticks (0, 10, 20, 30, 40, 50) */}
                {[0, 10, 20, 30, 40, 50].map((v) => {
                  const x = 35 + (v / 50.0) * (400 - 55);
                  return (
                    <g key={`xtick-${v}`}>
                      <line x1={x} y1="175" x2={x} y2="180" stroke="#94a3b8" strokeWidth="1.5" />
                      <text x={x} y="190" fontSize="8" fill="#64748b" textAnchor="middle">{v}</text>
                    </g>
                  );
                })}

                {/* Y axis ticks (0, 7, 14) */}
                <text x="28" y="177" fontSize="8" fill="#64748b" textAnchor="end">0</text>
                <text x="28" y="28" fontSize="8" fill="#64748b" textAnchor="end">14</text>

                {/* Theoretical Equivalence Line and Projection Coordinates */}
                {!examMode && (
                  <g>
                    {/* Vertical Equivalence Line */}
                    <line
                      x1={35 + (vEq / 50.0) * (400 - 55)}
                      y1="20"
                      x2={35 + (vEq / 50.0) * (400 - 55)}
                      y2="175"
                      stroke="#8b5cf6"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />

                    {/* Horizontal Projection to pH axis */}
                    <line
                      x1="35"
                      y1={175 - (pHEq / 14.0) * (175 - 25)}
                      x2={35 + (vEq / 50.0) * (400 - 55)}
                      y2={175 - (pHEq / 14.0) * (175 - 25)}
                      stroke="#8b5cf6"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />

                    {/* Outer Equivalence Glow Ring */}
                    <circle
                      cx={35 + (vEq / 50.0) * (400 - 55)}
                      cy={175 - (pHEq / 14.0) * (175 - 25)}
                      r="8"
                      fill="#8b5cf6"
                      opacity="0.25"
                    />

                    {/* Equivalence Point Center Dot */}
                    <circle
                      cx={35 + (vEq / 50.0) * (400 - 55)}
                      cy={175 - (pHEq / 14.0) * (175 - 25)}
                      r="4"
                      fill="#8b5cf6"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />

                    {/* Equivalence Callout Tag */}
                    <g transform={`translate(${Math.min(270, 35 + (vEq / 50.0) * (400 - 55) + 8)}, ${Math.max(25, 175 - (pHEq / 14.0) * (175 - 25) - 26)})`}>
                      <rect
                        width="114"
                        height="26"
                        rx="5"
                        fill="#ffffff"
                        stroke="#8b5cf6"
                        strokeWidth="1.2"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                      />
                      <text x="6" y="11" fontSize="8.5" fontWeight="bold" fill="#6d28d9">
                        Titik Ekuivalen (V_eq)
                      </text>
                      <text x="6" y="21" fontSize="7.5" fill="#475569" fontFamily="var(--font-mono)">
                        {vEq.toFixed(1)} mL • pH {pHEq.toFixed(2)}
                      </text>
                    </g>
                  </g>
                )}

                {/* Plotted Live Curve */}
                {svgPathD && (
                  <path
                    d={svgPathD}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Current live point pin */}
                {curvePoints.length > 0 && (
                  <circle
                    cx={35 + (volumeAdded / 50.0) * (400 - 55)}
                    cy={175 - (currentPH / 14.0) * (175 - 25)}
                    r="5"
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                )}
              </svg>

              {/* Titration Zone Live HUD */}
              <div
                style={{
                  background: currentZone.badgeBg,
                  border: `1px solid ${currentZone.color}40`,
                  borderRadius: '10px',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginTop: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: currentZone.color,
                      display: 'inline-block',
                    }}
                  />
                  <strong style={{ fontSize: '12px', color: currentZone.color }}>
                    {currentZone.name}
                  </strong>
                </div>
                <span style={{ fontSize: '11px', color: '#475569' }}>
                  {currentZone.desc}
                </span>
              </div>

              {/* Guided Molarity Calculation Formula */}
              {!examMode && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#334155',
                    marginTop: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Kalkulasi Stoikiometri Titrasi:</span>
                    <span style={{ color: '#0284c7' }}>
                      V₁ × M₁ × n₁ = V₂ × M₂ × n₂
                    </span>
                  </div>
                  <div style={{ color: '#64748b' }}>
                    M_analit = (V_titran × M_titran) / V_analit = ({vEq.toFixed(1)} mL × {selectedSystem.titrantMolarity.toFixed(3)} M) / {selectedSystem.analyteVolume.toFixed(1)} mL = <strong style={{ color: '#0284c7', fontFamily: 'var(--font-mono)' }}>{selectedSystem.analyteMolarity.toFixed(3)} M</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exam Mode Challenge Card (if active) */}
          {examMode && (
            <div className="titration-card" style={{ border: '2px solid #3b82f6', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="#3b82f6" />
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Tantangan Ujian Praktikum Kuantitatif
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Titrasi 25.0 mL analit {selectedSystem.analyteFormula} hingga mencapai titik akhir (perubahan warna indikator). Catat volume buret, lalu hitung konsentrasi molaritas (M) analit!
              </p>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  step="0.001"
                  placeholder="Contoh: 0.100"
                  value={studentInputM}
                  onChange={(e) => setStudentInputM(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    width: '160px',
                  }}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleVerifyExam}
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  Periksa Hasil Ujian
                </button>
              </div>

              {examFeedback && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    background: examFeedback.isCorrect ? '#dcfce7' : '#fee2e2',
                    color: examFeedback.isCorrect ? '#166534' : '#991b1b',
                    border: `1px solid ${examFeedback.isCorrect ? '#86efac' : '#fca5a5'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {examFeedback.isCorrect ? <CheckCircle2 size={16} /> : <HelpCircle size={16} />}
                  <span>{examFeedback.message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
