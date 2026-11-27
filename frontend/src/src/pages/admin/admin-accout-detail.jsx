import { useNavigate, Link } from 'react-router-dom';

export default function AdminAccountDetail() {
    const navigate = useNavigate();

    const handleDelete = () => {
        if (window.confirm('このアカウントを削除しますか？')) {
            navigate('/admin-accounts');
        }
    };

    return (
        <main className="main-content">
            <h1 className="page-title">アカウント詳細</h1>

            <section className="content-card">
                <Link to="/admin-accounts" className="text-primary text-decoration-none small">
                    ← 戻る
                </Link>

                <div className="profile">
                    <div className="avatar">👤</div>
                    <div className="profile-name">山田花子</div>
                    <div className="subtext">学籍番号：4523109</div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">メールアドレス</div>
                    <div className="detail-value">hanako.yamada@example.jp</div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">入学年度</div>
                    <div className="detail-value">2027年度</div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">所属</div>
                    <div className="detail-value">専門学生</div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to="/admin-accounts" className="btn btn-outline-secondary btn-sm">
                        一覧に戻る
                    </Link>
                    <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}>
                        削除
                    </button>
                </div>
            </section>
        </main>
    );
}