import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Notifications({ notifications, onReadAll }) {
    const [filter, setFilter] = useState('all'); // 'all' | 'unread'

    // 絞り込み判定
    const filteredNotifications = notifications.filter((item) => {
        if (filter === 'unread') return !item.isRead;
        return true;
    });

    return (
        <main className="main-content flex-grow-1 p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <h1 className="page-title mb-0">通知</h1>
                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={onReadAll}
                >
                    すべて既読にする
                </button>
            </div>

            {/* 絞り込みボタン */}
            <div className="d-flex gap-2 mb-3">
                <button
                    type="button"
                    className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    すべて
                </button>
                <button
                    type="button"
                    className={`filter-button ${filter === 'unread' ? 'active' : ''}`}
                    onClick={() => setFilter('unread')}
                >
                    未読
                </button>
            </div>

            {/* 通知リスト */}
            <section className="content-card rounded-3 overflow-hidden border bg-white">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((item) => (
                        <Link
                            key={item.id}
                            to={`/notifications/${item.id}`}
                            className={`notification-item d-flex align-items-center gap-3 p-3 text-decoration-none border-bottom ${!item.isRead ? 'unread' : ''}`}
                        >
                            <div className="notification-icon bg-secondary-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px' }}>
                                👤
                            </div>

                            <div className="notification-text flex-grow-1">
                                <div className="notification-title fw-bold text-dark small">
                                    {item.title}
                                </div>
                                <p className="notification-message text-secondary extra-small mb-1" style={{ fontSize: '13px' }}>
                                    {item.message}
                                </p>
                                <div className="notification-date text-muted extra-small" style={{ fontSize: '11px' }}>
                                    {item.date}
                                </div>
                            </div>

                            {!item.isRead && (
                                <span className="unread-dot bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                            )}
                            <span className="arrow text-muted fs-5">›</span>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-secondary py-4 mb-0">
                        通知はありません。
                    </p>
                )}
            </section>
        </main>
    );
}