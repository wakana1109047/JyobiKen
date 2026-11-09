import { useState } from 'react';
import { Link } from 'react-router-dom';

// ダミーの通知データ一覧
const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        title: 'いいねされました',
        message: '山田太郎さんがあなたの投稿「活動記録」に「いいね」しました。',
        date: '2026年10月27日 09:30',
        isRead: false,
        postId: 1, // 対象の投稿ID
    },
    {
        id: 2,
        title: 'いいねされました',
        message: '佐藤花子さんがあなたの投稿「画面設計」に「いいね」しました。',
        date: '2026年10月26日 15:20',
        isRead: false,
        postId: 2,
    },
    {
        id: 3,
        title: 'コメントされました',
        message: '鈴木花子さんがあなたの投稿「進捗報告」にコメントしました。',
        date: '2026年10月25日 12:00',
        isRead: true,
        postId: 3,
    },
];

export default function Notifications() {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    const [filter, setFilter] = useState('all'); // 'all' | 'unread'

    // すべて既読にする
    const handleReadAll = () => {
        setNotifications((prev) =>
            prev.map((item) => ({ ...item, isRead: true }))
        );
    };

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
                    onClick={handleReadAll}
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
                            className={`notification-item d-flex align-items-center gap-3 p-3 text-decoration-none border-bottom ${!item.isRead ? 'bg-light-blue' : ''
                                }`}
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