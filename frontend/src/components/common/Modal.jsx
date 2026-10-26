import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = '600px', busy = false }) {
  const dialogRef = useRef(null);
  const { toasts } = useApp();
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return createPortal(
    <dialog ref={dialogRef} className="modal-container" style={{ maxWidth }}
      aria-labelledby={titleId} aria-describedby={subtitle ? descriptionId : undefined} aria-busy={busy}
      onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}
      onClick={event => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (!busy && event.target === event.currentTarget &&
          (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) onClose();
      }}>
      <div className="modal-header">
        <div>
          <h2 id={titleId} className="modal-title">{title}</h2>
          {subtitle && <p id={descriptionId} className="view-desc">{subtitle}</p>}
        </div>
        <button type="button" className="modal-close" onClick={onClose} disabled={busy} aria-label="Close modal">&times;</button>
      </div>
      <div className="modal-body">
        {toasts.filter(toast => ['error', 'warning'].includes(toast.type)).slice(-1).map(toast =>
          <div key={toast.id} className="data-status error" role="alert">{toast.message}</div>
        )}
        {children}
      </div>
    </dialog>, document.body
  );
}
