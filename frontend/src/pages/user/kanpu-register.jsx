import { useState, useEffect, useRef } from 'react';
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

    const [videoPreview, setVideoPreview] = useState('');

    const videoInputRef = useRef(null);
    const documentInputRef = useRef(null);

    useEffect(() => {
        if (!formData.video) {
            setVideoPreview('');
            return;
        }

        const videoUrl = URL.createObjectURL(formData.video);
        setVideoPreview(videoUrl);

        return () => {
            URL.revokeObjectURL(videoUrl);
        };
    }, [formData.video]);

    const handleTextChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        if (!file) return;

        // 動画ファイルの確認
        if (name === 'video') {
            if (!file.type.startsWith('video/')) {
                alert('動画ファイルを選択してください。');
                e.target.value = '';
                return;
            }

            // 動画は100MBまで
            if (file.size > 100 * 1024 * 1024) {
                alert('動画のサイズは100MB以内にしてください。');
                e.target.value = '';
                return;
            }
        }

        // 資料ファイルの確認
        if (name === 'document') {
            const allowedExtensions =
                /\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/i;

            if (!allowedExtensions.test(file.name)) {
                alert('対応している資料ファイルを選択してください。');
                e.target.value = '';
                return;
            }

            // 資料は20MBまで
            if (file.size > 20 * 1024 * 1024) {
                alert('資料のサイズは20MB以内にしてください。');
                e.target.value = '';
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: file,
        }));
    };

    // ファイルサイズの表示
    const formatFileSize = (size) => {
        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    // ファイル削除
    const handleFileClear = (name) => {
        setFormData((prev) => ({
            ...prev,
            [name]: null,
        }));

        if (name === 'video' && videoInputRef.current) {
            videoInputRef.current.value = '';
        }

        if (name === 'document' && documentInputRef.current) {
            documentInputRef.current.value = '';
        }
    };

    const handleBack = () => {
        if (from) {
            navigate(`/diary-edit?from=${encodeURIComponent(from)}`);
        } else {
            navigate('/diary-edit');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // すべて未入力の場合
        if (
            !formData.video &&
            !formData.summary.trim() &&
            !formData.document
        ) {
            alert('動画・まとめテキスト・資料のいずれかを登録してください。');
            return;
        }

        // 登録前の確認
        const confirmRegister = window.confirm(
            'この内容で登録しますか？'
        );

        if (!confirmRegister) return;

        // 現時点では登録処理の仮実装
        alert('登録しました！');

        handleBack();
    };

    return (
        <main className="main-content flex-grow-1 page-content">

            {/* 戻るボタン */}
            <button
                type="button"
                onClick={handleBack}
                className="back-link border-0 bg-transparent p-0 mb-3"
            >
                ← 日誌投稿・編集画面に戻る
            </button>

            <h1 className="page-title h4 fw-bold mb-2">
                完成したものを登録
            </h1>

            <p className="description mb-4">
                資料や動画を登録できます。
            </p>

            <form onSubmit={handleSubmit}>

                {/* 動画 */}
                <section className="content-card mb-4">
                    <h2 className="section-title">
                        🎬 動画
                    </h2>

                    <div className="upload-area p-3">
                        <p className="text-secondary small">
                            動画ファイルを選択してください（100MB以内）
                        </p>
                        <div className="input-group">
                            <input
                                ref={videoInputRef}
                                type="file"
                                className="form-control"
                                id="video"
                                name="video"
                                accept="video/*"
                                onChange={handleFileChange}
                            />
                            {formData.video && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleFileClear('video')}
                                    title="選択を取り消す"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* 動画プレビュー */}
                        {videoPreview && (
                            <div className="mt-3">
                                <p className="fw-bold small">
                                    選択した動画
                                </p>

                                <video
                                    src={videoPreview}
                                    controls
                                    style={{
                                        width: '100%',
                                        maxHeight: '350px',
                                        borderRadius: '8px',
                                    }}
                                />

                                <p className="small text-secondary mt-2">
                                    {formData.video.name}
                                    {' / '}
                                    {formatFileSize(formData.video.size)}
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleFileClear('video')}
                                >
                                    動画を削除
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* まとめテキスト */}
                <section className="content-card mb-4">
                    <h2 className="section-title">
                        📝 まとめテキスト
                    </h2>

                    <div className="mb-3">
                        <label
                            htmlFor="summary"
                            className="form-label fw-bold"
                        >
                            内容
                        </label>

                        <textarea
                            id="summary"
                            name="summary"
                            className="form-control"
                            rows={6}
                            maxLength={1000}
                            placeholder="まとめを入力してください"
                            value={formData.summary}
                            onChange={handleTextChange}
                        />

                        <div className="text-end text-secondary small mt-1">
                            {formData.summary.length} / 1000文字
                        </div>
                    </div>
                </section>

                {/* ダウンロード資料 */}
                <section className="content-card mb-4">
                    <h2 className="section-title">
                        📁 ダウンロード資料
                    </h2>

                    <div className="upload-area p-3">
                        <p className="text-secondary small">
                            PDFや資料ファイルを選択してください（20MB以内）
                        </p>
                        <div className="input-group">
                            <input
                                ref={documentInputRef}
                                type="file"
                                className="form-control"
                                id="document"
                                name="document"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                                onChange={handleFileChange}
                            />
                            {formData.document && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleFileClear('document')}
                                    title="選択を取り消す"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* 選択した資料の表示 */}
                        {formData.document && (
                            <div className="mt-3 p-3 border rounded">
                                <div className="d-flex align-items-center gap-2">
                                    <span>📄</span>

                                    <div className="flex-grow-1">
                                        <p className="mb-1 fw-bold">
                                            {formData.document.name}
                                        </p>

                                        <small className="text-secondary">
                                            {formatFileSize(formData.document.size)}
                                        </small>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm mt-2"
                                    onClick={() => handleFileClear('document')}
                                >
                                    資料を削除
                                </button>
                            </div>
                        )}
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

                    <button
                        type="submit"
                        className="btn btn-primary px-4"
                    >
                        登録する
                    </button>
                </div>

            </form>
        </main>
    );
}
