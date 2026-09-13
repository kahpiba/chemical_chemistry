import React, { useState, useEffect } from 'react';
import { Move3D, X } from 'lucide-react';

interface Scene3DHintProps {
  customText?: string;
  storageKey?: string;
}

export const Scene3DHint: React.FC<Scene3DHintProps> = ({
  customText = 'Geser / drag untuk memutar 3D • Scroll / cubit untuk zoom',
  storageKey = 'chem_3d_hint_seen',
}) => {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(storageKey) !== 'true';
    } catch {
      return true;
    }
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setFading(true);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem(storageKey, 'true');
        } catch {
          // ignore
        }
      }, 400);
      return () => clearTimeout(hideTimer);
    }, 4500);

    return () => clearTimeout(timer);
  }, [visible, storageKey]);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(storageKey, 'true');
    } catch {
      // ignore
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(2, 132, 199, 0.25)',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.1)',
        padding: '6px 14px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 600,
        color: '#0f172a',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        userSelect: 'none',
      }}
    >
      <Move3D size={14} color="#0284c7" />
      <span>{customText}</span>
      <button
        onClick={handleDismiss}
        aria-label="Tutup petunjuk 3D"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          color: '#94a3b8',
          marginLeft: '4px',
          borderRadius: '50%',
        }}
      >
        <X size={12} />
      </button>
    </div>
  );
};
