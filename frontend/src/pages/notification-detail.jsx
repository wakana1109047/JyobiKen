import { useParams, Link } from 'react-router-dom';

// 各通知のダミー詳細データ
const NOTIFICATION_DETAILS = {
    '1': {
        id: 1,
        title: 'いいねされました',
        date: '2026年10月27日 09:30',
        message: 'あなたの投稿が山田太郎さんに「いいね」されました。',
        postId: 1,
        postTitle: '活動記録',
        postPreviewText: '今日の卒業研究では、アプリの画面設計を進めました。',
    },
    '2': {
        id: 2,
        title: 'いいねされました',
        date: '2026年10月26日 15:20',
        message: 'あなたの投稿が佐藤花子さんに「いいね」されました。',
        postId: 2,
        postTitle: '画面設計',
        postPreviewText: '画面のデザインをチームで相談しました。',
    },
    '3': {
        id: 3,
        title: 'コメントされました',
        date: '2026年10月25日 12:00',
        message: 'あなたの投稿に鈴木花子さんからコメントが届きました。',
        postId: 3,
        postTitle: '進捗報告',
        postPreviewText: 'プログラムの実装を少しずつ進めています。',
    },
};

export default function NotificationDetail() {
    const { id } = useParams();

    // URLの id に対応するデータを取得（存在しない場合は '1' または null）
    const detail = NOTIFICATION_DETAILS[id] || NOTIFICATION_DETAILS['1'];

    // データが存在しない場合の安全処理
    if (!detail) {
        return (
            <main className="main-content flex-grow-1 p-4">
                <div className="text-center py-5">
                    <p className="text-secondary">該当する通知が見つかりませんでした。</p>
                    <Link to="/notifications" className="btn btn-primary btn-sm">
                        通知一覧に戻る
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="main-content flex-grow-1 p-4">
            <h1 className="page-title h4 mb-4">通知詳細</h1>

            <section className="content-card bg-white p-4 rounded-3 border mx-auto" style={{ maxWidth: '850px' }}>
                <Link to="/notifications" className="back-link text-decoration-none small text-primary">
                    ← 戻る
                </Link>

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

                    {/* 対象の投稿にジャンプするボタン */}
                    <div className="mt-3 text-end">
                        <Link
                            to={`/timeline#post-${detail.postId}`}
                            className="btn btn-outline-primary btn-sm"
                        >
                            投稿を見る →
                        </Link>
                    </div>
                </div>

                {/* 通知一覧に戻る */}
                <div className="text-end mt-4">
                    <Link to="/notifications" className="btn btn-primary">
                        通知一覧に戻る
                    </Link>
                </div>
            </section>
        </main>
    );
}