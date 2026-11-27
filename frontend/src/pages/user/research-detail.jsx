import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function ResearchDetail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const from = searchParams.get('from');

    // マイページから来た場合は /mypage、それ以外はトップ（卒業研究一覧）に戻る
    const backPath = from === 'mypage' ? '/mypage' : '/';
    const backButtonLabel = from === 'mypage' ? 'マイページに戻る' : '一覧に戻る';

    const members = [
        '山田花子',
        '山田花子',
        '山田花子',
        '山田花子',
        '山田花子'
    ];

    return (
        <main className="main-content flex-grow-1 page-content">
            <div className="content-card">
                <button
                    type="button"
                    onClick={() => navigate(backPath)}
                    className="back-link border-0 bg-transparent p-0 mb-3"
                >
                    ← {from === 'mypage' ? 'マイページに戻る' : '戻る'}
                </button>

                <div className="research-image mb-4">
                    画像など
                </div>

                <h1 className="research-title mb-2">
                    タイトル
                </h1>

                <p className="text-secondary small mb-4">
                    グループA 2027年度卒業研究
                </p>

                {/* 研究概要 */}
                <div className="mb-4">
                    <h2 className="section-label">
                        研究概要
                    </h2>
                    <div className="border rounded-2 p-3">
                        卒業研究の内容をここに表示します。
                    </div>
                </div>

                {/* メンバー */}
                <div className="mb-4">
                    <h2 className="section-label">
                        メンバー
                    </h2>
                    <div className="member-list">
                        {members.map((member, index) => (
                            <span key={index} className="member">
                                👤 {member}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 研究内容 */}
                <div className="research-description">
                    研究内容・画像など
                </div>

                {/* ボタンエリア */}
                <div className="d-flex justify-content-end gap-2 mt-4 flex-wrap">
                    <Link to={backPath} className="btn btn-outline-secondary">
                        {backButtonLabel}
                    </Link>
                    <Link to="/research-edit" className="btn btn-primary">
                        編集する
                    </Link>
                </div>
            </div>
        </main>
    );
}
