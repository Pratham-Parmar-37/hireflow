import React from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import { BellOff } from 'lucide-react';

export default function NotificationsDrawer() {
  const { isNotificationsOpen, setIsNotificationsOpen, visibleNotifications: notifications } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <Modal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} title="Notifications" maxWidth="440px">
        <div className="drawer-list">
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-tertiary)' }}>
              <BellOff size={28} style={{ margin: '0 auto 0.75rem auto', opacity: 0.6 }} />
              <p style={{ fontSize: '0.85rem' }}>No notifications</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Event alerts from candidates and applications will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif, index) => (
              <div
                key={notif.id || index}
                className={`drawer-item ${notif.status !== 'READ' ? 'unread' : ''}`}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: notif.status !== 'READ' ? 600 : 400 }}>
                  {notif.message || 'Notification alert'}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                  {notif.createdAt || 'Recent activity'}
                </div>
              </div>
            ))
          )}
        </div>
    </Modal>
  );
}
