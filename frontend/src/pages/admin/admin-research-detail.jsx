import { useNavigate, Link } from 'react-router-dom';

export default function AdminResearchDetail() {
    const navigate = useNavigate();

    const handleDelete = () => {
        if (window.confirm('この卒業研究を削除しますか？')) {
            navigate('/');
        }
    };

    return (
        <main className="main-content">
            <h1 className="page-title">卒研詳細</h1>

            <section className="content-card">
                <Link to="/" className="text-primary text-decoration-none small">
                    ← 戻る
                </Link>

                <div className="research-image mt-3">画像など</div>

                <h2 className="research-title">研究概要</h2>
                <p className="research-meta">グループA 2027年度卒業研究</p>

                <div className="mb-4">
                    <h3 className="h6 fw-bold">タイトル</h3>
                    <p className="mb-0">研究概要</p>
                </div>

                <div className="mb-4">
                    <h3 className="h6 fw-bold">メンバー</h3>
                    <div className="d-flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((_, index) => (
                            <span key={index} className="member-chip">👤 山田花子</span>
                        ))}
                    </div>
                </div>

                <div className="research-description mb-4">
                    研究内容や概要をここに表示します。
                </div>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Link to="/admin-research-edit" className="btn btn-success px-4">
                        編集
                    </Link>
                    <button type="button" className="btn btn-danger px-4" onClick={handleDelete}>
                        削除
                    </button>
                </div>
            </section>
        </main>
    );
}