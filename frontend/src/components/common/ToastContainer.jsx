import React from 'react';
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div role="status" aria-live="polite" className="toast-container" style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem', pointerEvents: 'none' }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} active`}
          onClick={() => removeToast(toast.id)}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
