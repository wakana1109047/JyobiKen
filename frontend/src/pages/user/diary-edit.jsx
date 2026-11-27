import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function DiaryEdit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const photoInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);

  const pageRoutes = {
    timeline: '/timeline',
    mypage: '/mypage',
    'research-list': '/',
    notification: '/notifications',
    'research-detail': '/research-detail',
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (from && pageRoutes[from]) {
      navigate(pageRoutes[from]);
    } else {
      navigate('/');
    }
  };

  const handleClearPhoto = () => {
    setPhoto(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('日誌を投稿しました！');

    if (from && pageRoutes[from]) {
      navigate(pageRoutes[from]);
    } else {
      navigate('/timeline');
    }
  };

  return (
    <main className="main-content flex-grow-1 p-4">
      <a href="#" onClick={handleBack} className="back-link text-decoration-none small text-primary mb-3 d-inline-block">
        ← 戻る
      </a>

      <h1 className="page-title h4 mb-4 fw-bold">日誌投稿</h1>

      <div className="content-card bg-white p-4 rounded-3 border mx-auto" style={{ maxWidth: '850px' }}>
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
              rows="8"
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
            <div className="input-group">
              <input
                ref={photoInputRef}
                type="file"
                id="diary-photo"
                className="form-control"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0] || null)}
              />
              {photo && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleClearPhoto}
                  title="選択を取り消す"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 投稿ボタン */}
          <div className="text-end">
            <button type="submit" className="save-button btn btn-primary px-4 fw-bold">
              投稿する
            </button>
          </div>
        </form>

        <Link
          to={`/kanpu-register?from=${encodeURIComponent(from || '')}`}
          className="sub-link text-decoration-none small text-primary d-inline-block mt-3"
        >
          完成したものを登録する →
        </Link>
      </div>
    </main>
  );
}