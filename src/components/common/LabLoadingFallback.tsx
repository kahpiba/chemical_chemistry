import React from 'react';
import { Atom, Sparkles } from 'lucide-react';

interface LabLoadingFallbackProps {
  title?: string;
  subtitle?: string;
}

export const LabLoadingFallback: React.FC<LabLoadingFallbackProps> = ({
  title = 'Memuat Laboratorium Virtual...',
  subtitle = 'Menyiapkan modul komputasi & parameter saintifik...',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '480px',
        width: '100%',
        padding: '32px 16px',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '88px',
          height: '88px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(147, 51, 234, 0.08))',
          border: '1px solid rgba(2, 132, 199, 0.2)',
          boxShadow: '0 8px 32px -4px rgba(2, 132, 199, 0.15)',
          marginBottom: '20px',
        }}
      >
        <Atom
          size={44}
          color="#0284c7"
          style={{
            animation: 'spin 4s linear infinite',
          }}
        />
        <Sparkles
          size={18}
          color="#9333ea"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      </div>

      <h3
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '6px',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          maxWidth: '380px',
          textAlign: 'center',
          lineHeight: '1.5',
        }}
      >
        {subtitle}
      </p>

      {/* Subtle loader track */}
      <div
        style={{
          width: '160px',
          height: '3px',
          background: 'rgba(226, 232, 240, 0.8)',
          borderRadius: '999px',
          overflow: 'hidden',
          marginTop: '18px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '40%',
            background: 'linear-gradient(90deg, #0284c7, #9333ea)',
            borderRadius: '999px',
            animation: 'loadingProgress 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes loadingProgress {
          0% { left: -40%; width: 40%; }
          50% { left: 30%; width: 60%; }
          100% { left: 100%; width: 30%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
