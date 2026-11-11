import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function KanpuRegister() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const from = searchParams.get('from');

    const [formData, setFormData] = useState({
        video: null,
        summary: '',
        document: null,
    });

    // テキスト入力のハンドラー
    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ファイル入力のハンドラー
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    // 戻るボタンのハンドラー
    const handleBack = (e) => {
        e.preventDefault();
        if (from) {
            navigate(`/diary-edit?from=${encodeURIComponent(from)}`);
        } else {
            navigate('/diary-edit');
        }
    };

    // フォーム送信
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('カンプ情報を登録しました');
        // 必要に応じて遷移先を変更してください
        navigate('/diary-edit');
    };

    return (
        <main className="main-content">
            <a href="#" onClick={handleBack} className="back-link">
                ← 日誌投稿・編集画面に戻る
            </a>

            <h1 className="page-title">カンプ登録</h1>

            <p className="description">
                カンプで使用する資料や動画を登録できます。
            </p>

            <form onSubmit={handleSubmit}>
                {/* 動画 */}
                <section className="content-card">
                    <h2 className="section-title">動画</h2>
                    <div className="upload-area">
                        <div className="upload-icon">🎬</div>
                        <p className="text-secondary small">
                            動画ファイルを選択してください
                        </p>
                        <input
                            type="file"
                            className="form-control"
                            id="video"
                            name="video"
                            accept="video/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </section>

                {/* まとめテキスト */}
                <section className="content-card">
                    <h2 className="section-title">まとめテキスト</h2>
                    <div className="mb-3">
                        <label htmlFor="summary" className="form-label">
                            内容
                        </label>
                        <textarea
                            id="summary"
                            name="summary"
                            className="form-control"
                            rows={5}
                            placeholder="カンプのまとめを入力してください"
                            value={formData.summary}
                            onChange={handleTextChange}
                        />
                    </div>
                </section>

                {/* ダウンロード資料 */}
                <section className="content-card">
                    <h2 className="section-title">ダウンロード資料</h2>
                    <div className="upload-area">
                        <div className="upload-icon">📁</div>
                        <p className="text-secondary small">
                            PDFや資料ファイルを選択してください
                        </p>
                        <input
                            type="file"
                            className="form-control"
                            id="document"
                            name="document"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                            onChange={handleFileChange}
                        />
                    </div>
                </section>

                {/* ボタン */}
                <div className="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleBack}
                    >
                        キャンセル
                    </button>
                    <button type="submit" className="btn btn-primary px-4">
                        登録する
                    </button>
                </div>
            </form>
        </main>
    );
}