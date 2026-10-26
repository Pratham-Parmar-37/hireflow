import React from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Code, CheckCircle, AlertTriangle } from 'lucide-react';

export default function FeignViewerModal() {
  const { activeModal, modalData, closeModal } = useApp();
  const isOpen = activeModal === 'feign-viewer';

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="OpenFeign Composite Inspector"
      subtitle="Distributed service composition: Application Service -> Eureka Discovery -> Company Job Service."
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', background: 'var(--primary-subtle)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-sm)' }}>
          <Code size={18} style={{ color: 'var(--primary)' }} />
          <div style={{ fontSize: '0.785rem', color: 'var(--primary-text)', lineHeight: 1.4 }}>
            Endpoint: <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>/api/applications/&#123;id&#125;/with-job</code>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>
              Invokes the Application entity from MongoDB, performs a declarative Feign REST client call to Company-Job Service, and aggregates the response.
            </div>
          </div>
        </div>

        {modalData?.loading && (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', marginBottom: '0.5rem' }}></div>
            <p style={{ fontSize: '0.85rem' }}>Invoking OpenFeign composite route via Eureka discovery...</p>
          </div>
        )}

        {modalData?.error && (
          <div style={{ padding: '1rem', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.65rem', color: 'var(--danger-text)' }}>
            <AlertTriangle size={18} />
            <div style={{ fontSize: '0.8rem' }}>
              <strong>Feign Request Failed:</strong>
              <pre style={{ marginTop: '0.25rem', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap' }}>{modalData.error}</pre>
            </div>
          </div>
        )}

        {modalData?.data && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success-text)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <CheckCircle size={14} /> 200 OK — Aggregated DTO Response
            </div>
            <pre style={{
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-primary)',
              overflowX: 'auto',
              maxHeight: '340px'
            }}>
              {JSON.stringify(modalData.data, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
        </div>
      </div>
    </Modal>
  );
}
