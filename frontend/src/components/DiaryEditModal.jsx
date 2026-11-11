import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default function DiaryEditModal({ isOpen, onClose, from = '' }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [photo, setPhoto] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('日誌を投稿しました！');
        setTitle('');
        setContent('');
        setPhoto(null);
        onClose();
    };

    // document.body の直下にレンダリングしてサイドバーや親要素の margin-left を回避する
    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="modal-title fw-bold m-0">日誌投稿</h5>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={onClose}
                    ></button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* タイトル */}
                    <div className="mb-4">
                        <label htmlFor="diary-title" className="form-label fw-bold small">
                            タイトル
                        </label>
                        <input
                            type="text"
                            id="diary-title"
                            className="form-control"
                            placeholder="日誌のタイトルを入力してください"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* 日誌内容 */}
                    <div className="mb-4">
                        <label htmlFor="diary-content" className="form-label fw-bold small">
                            日誌内容
                        </label>
                        <textarea
                            id="diary-content"
                            className="form-control"
                            rows="6"
                            placeholder="今日の活動内容や進捗を入力してください"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {/* 写真 */}
                    <div className="mb-4">
                        <label htmlFor="diary-photo" className="form-label fw-bold small">
                            写真
                        </label>
                        <input
                            type="file"
                            id="diary-photo"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setPhoto(e.target.files[0])}
                        />
                    </div>

                    {/* ボタン */}
                    <div className="text-end">
                        <button
                            type="button"
                            className="btn btn-outline-secondary me-2"
                            onClick={onClose}
                        >
                            キャンセル
                        </button>
                        <button type="submit" className="btn btn-primary px-4 fw-bold">
                            投稿する
                        </button>
                    </div>
                </form>

                {/* 完成したものの登録リンク */}
                <div className="mt-3 pt-2 border-top">
                    <Link
                        to={`/kanpu-register?from=${encodeURIComponent(from)}`}
                        className="text-decoration-none small text-primary"
                        onClick={onClose}
                    >
                        完成したものを登録する →
                    </Link>
                </div>
            </div>
        </div>,
        document.body
    );
}