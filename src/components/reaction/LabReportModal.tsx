import React, { useState } from 'react';
import { Printer, X, FileText, Sparkles, Thermometer, Droplets } from 'lucide-react';
import type { ReactionData, Reagent } from '../../data/reactions';

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reaction: ReactionData;
  selectedReagents: Reagent[];
  currentTemp: number;
  currentPH: number;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  isOpen,
  onClose,
  reaction,
  selectedReagents,
  currentTemp,
  currentPH,
}) => {
  const [studentName, setStudentName] = useState<string>('Siswa Kimia Cerdas');
  const [studentClass, setStudentClass] = useState<string>('XI MIPA - Laboratorium Kimia');
  const [studentNotes, setStudentNotes] = useState<string>(
    'Reaksi berlangsung spontan disertai perubahan fisik yang nyata sesuai teori termokimia dan kinetika reaksi.'
  );

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const deltaT = currentTemp - reaction.effects.temperatureStart;

  return (
    <div className="report-modal-overlay">
      <div className="report-modal-container">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="report-modal-actions no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#0284c7" />
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
              Laporan Praktikum Kimia Virtual
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={handlePrint} style={{ padding: '8px 18px', fontSize: '13px' }}>
              <Printer size={16} />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button className="btn btn-ghost" onClick={onClose} style={{ padding: '8px 12px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Paper Sheet */}
        <div className="report-paper-sheet printable-area">
          {/* Institution Header */}
          <div className="report-header">
            <div className="report-institution-logo">
              <Sparkles size={28} color="#0284c7" />
            </div>
            <div className="report-institution-text">
              <h2>CHEMICAL ATLAS VIRTUAL LABORATORY</h2>
              <p>Laporan Resmi Praktikum Kimia Sains SMA/MA & Perguruan Tinggi</p>
              <span className="report-date-badge">Tanggal Praktikum: {todayStr}</span>
            </div>
          </div>

          <hr className="report-divider" />

          {/* Student Info Inputs (Editable for student) */}
          <div className="report-meta-grid">
            <div className="report-meta-field">
              <label>Nama Praktikan:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="report-input"
                placeholder="Masukkan Nama Praktikan"
              />
            </div>
            <div className="report-meta-field">
              <label>Kelas / Rombel:</label>
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="report-input"
                placeholder="Masukkan Kelas"
              />
            </div>
            <div className="report-meta-field">
              <label>Judul Praktikum:</label>
              <div className="report-static-val" style={{ fontWeight: 700, color: '#0284c7' }}>
                {reaction.titleId}
              </div>
            </div>
            <div className="report-meta-field">
              <label>Jenis Reaksi:</label>
              <div className="report-static-val" style={{ textTransform: 'capitalize' }}>
                {reaction.type.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Chemical Equation Section */}
          <div className="report-section">
            <h3 className="report-section-title">I. Persamaan Reaksi Kimia Setara</h3>
            <div className="report-equation-box">
              <code>{reaction.balancedEquation}</code>
            </div>
          </div>

          {/* Quantitative & Thermodynamic Data Table */}
          <div className="report-section">
            <h3 className="report-section-title">II. Parameter Termokimia & Sifat Larutan</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Parameter Pengukuran</th>
                  <th>Nilai Awal</th>
                  <th>Nilai Akhir</th>
                  <th>Perubahan (Δ) / Kesimpulan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Thermometer size={14} color="#ef4444" />
                      <strong>Suhu Larutan (°C)</strong>
                    </div>
                  </td>
                  <td>{reaction.effects.temperatureStart.toFixed(1)} °C</td>
                  <td>{currentTemp.toFixed(1)} °C</td>
                  <td>
                    <span
                      className={`badge-cell ${
                        deltaT > 0 ? 'badge-heat' : deltaT < 0 ? 'badge-cold' : ''
                      }`}
                    >
                      ΔT = {deltaT > 0 ? `+${deltaT.toFixed(1)}` : deltaT.toFixed(1)} °C (
                      {reaction.deltaH < 0 ? 'Eksotermik' : 'Endotermik'})
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Droplets size={14} color="#0284c7" />
                      <strong>Derajat Keasaman (pH)</strong>
                    </div>
                  </td>
                  <td>pH {(reaction.effects.pHStart ?? 7.0).toFixed(1)}</td>
                  <td>pH {currentPH.toFixed(1)}</td>
                  <td>
                    <span className="badge-cell badge-neutral">
                      {currentPH < 6.8
                        ? 'Larutan Bersifat Asam'
                        : currentPH > 7.2
                        ? 'Larutan Bersifat Basa'
                        : 'Larutan Netral (pH ~ 7)'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><strong>Perubahan Entalpi Standar (ΔH)</strong></td>
                  <td colSpan={2} style={{ textAlign: 'center' }}>
                    <strong>{reaction.deltaH} kJ/mol</strong>
                  </td>
                  <td>
                    {reaction.deltaH < 0
                      ? 'Sistem Melepaskan Kalor ke Lingkungan'
                      : 'Sistem Menyerap Kalor dari Lingkungan'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Physical Observations Table */}
          <div className="report-section">
            <h3 className="report-section-title">III. Tabel Pengamatan Fenomena Fisik</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Aspek Pengamatan</th>
                  <th>Kondisi Awal</th>
                  <th>Kondisi Akhir</th>
                  <th>Keterangan / Indikator</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Warna Larutan</strong></td>
                  <td>Bening / Jernih</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '4px',
                          background: reaction.effects.liquidColorEnd,
                          border: '1px solid #cbd5e1',
                        }}
                      />
                      <span>Tampak Perubahan Warna</span>
                    </div>
                  </td>
                  <td>Perubahan orbital d / struktur konjugasi indikator</td>
                </tr>
                <tr>
                  <td><strong>Pembentukan Gas</strong></td>
                  <td>Tidak Ada</td>
                  <td>
                    {reaction.effects.hasGas ? (
                      <span style={{ color: '#059669', fontWeight: 600 }}>
                        Teramati Pelepasan Gelembung Gas
                      </span>
                    ) : (
                      'Tidak Teramati'
                    )}
                  </td>
                  <td>{reaction.effects.hasGas ? 'Tekanan gas meningkat' : 'Fasa larutan homogen'}</td>
                </tr>
                <tr>
                  <td><strong>Pembentukan Endapan</strong></td>
                  <td>Larutan Homogen</td>
                  <td>
                    {reaction.effects.hasPrecipitate ? (
                      <span style={{ color: '#d97706', fontWeight: 600 }}>
                        {reaction.effects.precipitateName}
                      </span>
                    ) : (
                      'Tidak Ada Endapan (Larut Sempurna)'
                    )}
                  </td>
                  <td>
                    {reaction.effects.hasPrecipitate
                      ? 'Ksp terlampaui (Qsp > Ksp)'
                      : 'Ion terhidrasi sempurna'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Reagents Used */}
          <div className="report-section">
            <h3 className="report-section-title">IV. Bahan & Reagen Laboratorium yang Digunakan</h3>
            <div className="report-reagents-list">
              {selectedReagents.map((r) => (
                <div key={r.id} className="report-reagent-card">
                  <div className="report-reagent-header">
                    <strong>{r.nameId}</strong>
                    <code>{r.formula}</code>
                  </div>
                  <p style={{ fontSize: '11px', color: '#475569', margin: '4px 0 0 0' }}>
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Molecular Mechanism */}
          <div className="report-section">
            <h3 className="report-section-title">V. Mekanisme Reaksi Tingkat Molekuler</h3>
            <p className="report-paragraph">{reaction.molecularExplanation}</p>
          </div>

          {/* Real World Applications */}
          <div className="report-section">
            <h3 className="report-section-title">VI. Penerapan dalam Industri & Kehidupan Nyata</h3>
            <p className="report-paragraph">{reaction.realWorldApplication}</p>
          </div>

          {/* Student Conclusion & Signoff */}
          <div className="report-section">
            <h3 className="report-section-title">VII. Catatan Pengamatan & Kesimpulan Praktikan</h3>
            <textarea
              className="report-textarea"
              rows={3}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="Tuliskan kesimpulan hasil praktikum di sini..."
            />
          </div>

          {/* Signatures for Print */}
          <div className="report-signatures">
            <div className="sig-block">
              <span>Praktikan / Siswa,</span>
              <div className="sig-line" />
              <strong>{studentName}</strong>
            </div>
            <div className="sig-block">
              <span>Guru Pembimbing Kimia,</span>
              <div className="sig-line" />
              <strong>(_________________________)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
