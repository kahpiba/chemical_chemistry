import React, { useState } from 'react';
import {
  FileText,
  Printer,
  X,
  Sparkles,
} from 'lucide-react';

interface WorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorksheetModal: React.FC<WorksheetModalProps> = ({ isOpen, onClose }) => {
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '840px',
          maxWidth: '100%',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={22} color="#0284c7" />
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Lembar Kerja Peserta Didik (LKPD) Kimia
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Format print-ready untuk tugas mandiri, ulangan harian, dan praktikum kelas
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className={`btn ${showAnswerKey ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              style={{ fontSize: '12px', gap: '6px', padding: '6px 14px' }}
            >
              <Sparkles size={14} />
              {showAnswerKey ? 'Kunci Jawaban Aktif' : 'Mode Guru (Kunci Jawaban)'}
            </button>
            <button
              className="btn btn-primary"
              onClick={handlePrint}
              style={{ fontSize: '12px', gap: '6px', padding: '6px 16px' }}
            >
              <Printer size={14} />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Paper */}
        <div
          id="printable-worksheet"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '36px 44px',
            color: '#0f172a',
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.6,
          }}
        >
          {/* Paper Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #0f172a',
              paddingBottom: '16px',
              marginBottom: '20px',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                LEMBAR KERJA PESERTA DIDIK (LKPD)
              </h2>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginTop: '2px' }}>
                Mata Pelajaran: Kimia • Platform: Chemical Atlas Interactive Lab
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
              <div>Tahun Ajaran: 2026/2027</div>
              <div>Kurikulum Merdeka / Nasional</div>
            </div>
          </div>

          {/* Student Identity Form */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              padding: '12px 18px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
            }}
          >
            <div>
              <strong>Nama Lengkap:</strong> ..............................................................
            </div>
            <div>
              <strong>Kelas / Jurusan:</strong> ..............................................................
            </div>
            <div>
              <strong>Tanggal Praktikum:</strong> ..............................................................
            </div>
            <div>
              <strong>Nilai / Paraf Guru:</strong> ..............................................................
            </div>
          </div>

          {/* Section 1: Struktur Atom & Tabel Periodik */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px', color: '#0284c7', textTransform: 'uppercase' }}>
              Bagian A: Konfigurasi Elektron & Golongan / Periode
            </h4>
            <p style={{ fontSize: '13px', margin: '0 0 10px' }}>
              1. Tuliskan konfigurasi elektron kulit Bohr (K, L, M, N) dan tentukan letak Golongan serta Periode untuk unsur-unsur berikut:
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '10px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                  <th style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Unsur</th>
                  <th style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Nomor Atom (Z)</th>
                  <th style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Konfigurasi Elektron</th>
                  <th style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Golongan</th>
                  <th style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Periode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Natrium (Na)</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>11</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{showAnswerKey ? '2, 8, 1' : '....................................'}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{showAnswerKey ? 'IA (Alkali)' : '................'}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{showAnswerKey ? '3' : '..........'}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Klorin (Cl)</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>17</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{showAnswerKey ? '2, 8, 7' : '....................................'}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{showAnswerKey ? 'VIIA (Halogen)' : '................'}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{showAnswerKey ? '3' : '..........'}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Kalsium (Ca)</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>20</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{showAnswerKey ? '2, 8, 8, 2' : '....................................'}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{showAnswerKey ? 'IIA (Alkali Tanah)' : '................'}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{showAnswerKey ? '4' : '..........'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Rantai Kimia & Hidrokarbon */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px', color: '#0284c7', textTransform: 'uppercase' }}>
              Bagian B: Hidrokarbon & Gugus Fungsi Organik
            </h4>
            <p style={{ fontSize: '13px', margin: '0 0 8px' }}>
              2. Sebuah hidrokarbon rantai lurus memiliki rumus molekul C₄H₁₀ (Butana).
            </p>
            <div style={{ paddingLeft: '16px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                a. Gambarkan rumus struktur skeletal (zigzag) senyawa tersebut di kotak bawah:
                <div style={{ border: '1px dashed #94a3b8', height: '65px', borderRadius: '6px', margin: '6px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' }}>
                  {showAnswerKey ? '／＼／ (Rantai 4 Karbon Zigzag tetrahedral 109.5°)' : '[Area Gambar Struktur Siswa]'}
                </div>
              </div>
              <div>
                b. Tuliskan persamaan reaksi pembakaran sempurna Butana dengan gas oksigen:
                <div style={{ marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: showAnswerKey ? '#16a34a' : '#64748b' }}>
                  {showAnswerKey ? '2 C₄H₁₀ + 13 O₂ ⟶ 8 CO₂ + 10 H₂O' : '...... C₄H₁₀ + ...... O₂ ⟶ ...... CO₂ + ...... H₂O'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Penyetaraan Reaksi & Stoikiometri */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px', color: '#0284c7', textTransform: 'uppercase' }}>
              Bagian C: Penyetaraan Reaksi Redoks & Pereaksi Pembatas
            </h4>
            <p style={{ fontSize: '13px', margin: '0 0 8px' }}>
              3. Setarakan reaksi reduksi bijih besi berikut pada tanur tiup:
            </p>
            <div style={{ padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '13px', marginBottom: '8px' }}>
              {showAnswerKey ? (
                <span style={{ color: '#16a34a', fontWeight: 700 }}>1 Fe₂O₃ + 3 CO ⟶ 2 Fe + 3 CO₂</span>
              ) : (
                '...... Fe₂O₃ + ...... CO ⟶ ...... Fe + ...... CO₂'
              )}
            </div>
            <p style={{ fontSize: '13px', margin: '0' }}>
              Jika direaksikan 160 gram Fe₂O₃ (Mr = 160 g/mol) dengan 56 gram gas CO (Mr = 28 g/mol), tentukan zat mana yang menjadi <strong>pereaksi pembatas</strong>!
            </p>
            <div style={{ marginTop: '6px', fontSize: '12px', color: showAnswerKey ? '#16a34a' : '#64748b' }}>
              {showAnswerKey
                ? 'Kunci: Mol Fe₂O₃ = 1 mol (1/1 = 1); Mol CO = 2 mol (2/3 = 0.67). Maka CO adalah Pereaksi Pembatas!'
                : 'Jawaban: ....................................................................................................................................................'}
            </div>
          </div>

          {/* Section 4: Sel Elektrokimia & Deret Volta */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px', color: '#0284c7', textTransform: 'uppercase' }}>
              Bagian D: Sel Volta & Potensial Sel Standar (E°)
            </h4>
            <p style={{ fontSize: '13px', margin: '0 0 8px' }}>
              4. Diketahui data potensial reduksi standar:
              <br />
              <code>Zn²⁺ + 2e⁻ ⟶ Zn (E° = -0.76 V)</code> dan <code>Cu²⁺ + 2e⁻ ⟶ Cu (E° = +0.34 V)</code>.
            </p>
            <div style={{ paddingLeft: '16px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>
                a. Logam yang bertindak sebagai <strong>Anoda</strong>: {showAnswerKey ? <strong style={{ color: '#16a34a' }}>Seng (Zn)</strong> : '........................'}
              </div>
              <div>
                b. Logam yang bertindak sebagai <strong>Katoda</strong>: {showAnswerKey ? <strong style={{ color: '#16a34a' }}>Tembaga (Cu)</strong> : '........................'}
              </div>
              <div>
                c. Nilai potensial sel standar (E°sel):{' '}
                {showAnswerKey ? (
                  <strong style={{ color: '#16a34a' }}>E°sel = +0.34 - (-0.76) = +1.10 Volt (Spontan)</strong>
                ) : (
                  'E°sel = .........................................................................'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
