import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function NotificationDetail({ notifications, onMarkAsRead }) {
    const { id } = useParams();
    const navigate = useNavigate();

    // 画面開時に1度だけ処理を実行するための参照フラグ
    const isExecRef = useRef(false);

    // Appから受け取った通知リストの中から該当するIDのものを検索
    const detail = notifications.find((item) => item.id === Number(id)) || notifications[0];

    // 画面が開いたら自動的に既読フラグを更新（重複実行を防止）
    useEffect(() => {
        if (id && !isExecRef.current) {
            onMarkAsRead(id);
            isExecRef.current = true;
        }
    }, [id, onMarkAsRead]);

    if (!detail) {
        return (
            <main className="main-content flex-grow-1 p-4">
                <div className="text-center py-5">
                    <p className="text-secondary">該当する通知が見つかりませんでした。</p>
                    <button
                        type="button"
                        onClick={() => navigate('/notifications')}
                        className="btn btn-primary btn-sm"
                    >
                        通知一覧に戻る
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="main-content flex-grow-1 p-4">
            <h1 className="page-title h4 mb-4">通知詳細</h1>

            <section className="content-card bg-white p-4 rounded-3 border mx-auto" style={{ maxWidth: '850px' }}>
                <button
                    type="button"
                    onClick={() => navigate('/notifications')}
                    className="back-link border-0 bg-transparent p-0 small text-primary mb-3"
                    style={{ cursor: 'pointer' }}
                >
                    ← 戻る
                </button>

                <div className="d-flex align-items-center gap-3 mt-3">
                    <div className="notification-icon bg-secondary-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', fontSize: '22px' }}>
                        👤
                    </div>
                    <div>
                        <h2 className="notification-title h5 mb-1">{detail.title}</h2>
                        <p className="notification-date text-muted extra-small mb-0" style={{ fontSize: '12px' }}>
                            {detail.date}
                        </p>
                    </div>
                </div>

                <p className="notification-message my-4 text-dark" style={{ lineHeight: '1.8' }}>
                    {detail.message}
                </p>

                {/* 対象の投稿リンクプレビュー */}
                <div className="border rounded-3 p-3 bg-light">
                    <h3 className="fs-6 fw-bold mb-3">対象の投稿</h3>

                    <div className="p-3 bg-white rounded border">
                        <h4 className="h6 fw-bold mb-1">{detail.postTitle}</h4>
                        <p className="text-secondary small mb-0">{detail.postPreviewText}</p>
                    </div>

                    <div className="mt-3 text-end">
                        <button
                            type="button"
                            onClick={() => navigate(`/timeline#post-${detail.postId}`)}
                            className="btn btn-outline-primary btn-sm"
                        >
                            投稿を見る →
                        </button>
                    </div>
                </div>

                {/* 通知一覧に戻るボタン */}
                <div className="text-end mt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/notifications')}
                        className="btn btn-primary"
                    >
                        通知一覧に戻る
                    </button>
                </div>
            </section>
        </main>
    );
}