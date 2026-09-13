import React, { useState } from 'react';
import '../../styles/certificate.css';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentName?: string;
  defaultSchoolName?: string;
  score?: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  defaultStudentName = 'Siswa Kimia Prestasi',
  defaultSchoolName = 'SMA / Madrasah Kimia Indonesia',
  score = 98,
}) => {
  const [studentName, setStudentName] = useState(defaultStudentName);
  const [schoolName, setSchoolName] = useState(defaultSchoolName);
  const [certId] = useState(() => 'CA-' + Math.random().toString(36).substring(2, 8).toUpperCase());

  if (!isOpen) return null;

  const todayStr = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="certificate-modal-overlay" onClick={onClose}>
      <div className="certificate-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Controls Bar (Hidden in Print) */}
        <div className="certificate-controls-bar no-print">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                Nama Siswa:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Masukkan nama penerima..."
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  minWidth: '200px'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                Asal Sekolah / Institusi:
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Masukkan nama sekolah..."
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  minWidth: '220px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
              }}
            >
              <span>🖨️</span> Cetak / PDF (A4)
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Printable Canvas Frame */}
        <div className="certificate-canvas-frame">
          <div className="certificate-sheet">
            {/* Corner Ornaments */}
            <div className="cert-corner-ornament cert-top-left"></div>
            <div className="cert-corner-ornament cert-top-right"></div>
            <div className="cert-corner-ornament cert-bottom-left"></div>
            <div className="cert-corner-ornament cert-bottom-right"></div>

            {/* Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '24px' }}>⚗️</span>
                <h1 className="cert-header-title">Sertifikat Kelulusan Praktikum</h1>
                <span style={{ fontSize: '24px' }}>🔬</span>
              </div>
              <div className="cert-subtitle">Chemical Chemistry Virtual Laboratory & Science Explorer</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1.5px', marginTop: '2px' }}>
                NO. REG: {certId}-2026
              </div>
            </div>

            {/* Body */}
            <div>
              <p className="cert-body-text" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Diberikan dengan hormat sebagai bukti kompetensi dan kelulusan pengujian praktikum kimia kepada:
              </p>
              <div className="cert-recipient-name">
                {studentName || 'Nama Siswa'}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginTop: '2px' }}>
                {schoolName || 'Institusi Pendidikan'}
              </div>

              <p className="cert-body-text" style={{ marginTop: '14px' }}>
                Telah berhasil menyelesaikan simulasi praktikum laboratorium kimia tingkat lanjut dengan evaluasi presisi <strong>{score}/100</strong>, mencakup kompetensi analisis stoikiometri, reaksi bahaya nyata, dan instrumentasi analitik:
              </p>

              {/* Competencies */}
              <div className="cert-competencies-pills">
                <span className="cert-pill">✓ Titrasi Presisi & Kurva Sigmoid pH</span>
                <span className="cert-pill">✓ Klasifikasi Bahaya NFPA 704 & GHS</span>
                <span className="cert-pill">✓ Disosiasi & Tolakan Sterik Molekul</span>
                <span className="cert-pill">✓ Stoikiometri Larutan & Pengenceran</span>
                <span className="cert-pill">✓ Identifikasi Reaksi Eksoterm & Uji Nyala</span>
              </div>
            </div>

            {/* Footer */}
            <div className="cert-footer-row">
              <div className="cert-signature-box">
                <div style={{ fontWeight: 700, color: '#334155', marginBottom: '2px' }}>Laboratorium Virtual</div>
                <div style={{ fontStyle: 'italic', color: '#0284c7', fontFamily: 'cursive', fontSize: '14px', marginBottom: '2px' }}>
                  Chemical Chemistry Engine
                </div>
                <div className="cert-signature-line"></div>
                <div>Kepala Laboratorium Virtual</div>
              </div>

              {/* Gold Seal */}
              <div className="cert-gold-seal">
                <div style={{ fontSize: '20px' }}>★</div>
                <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  EXCELLENCE
                </div>
                <div style={{ fontSize: '8px', opacity: 0.9 }}>VERIFIED</div>
              </div>

              <div className="cert-signature-box">
                <div style={{ fontWeight: 700, color: '#334155', marginBottom: '2px' }}>Tanggal Penerbitan</div>
                <div style={{ fontSize: '12px', color: '#334155', marginBottom: '4px' }}>
                  {todayStr}
                </div>
                <div className="cert-signature-line"></div>
                <div>Sistem Penilaian Akademik</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
