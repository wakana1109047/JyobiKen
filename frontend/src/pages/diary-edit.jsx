import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function DiaryEdit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from'); // クエリパラメータ ?from=... を取得

  // フォーム入力の状態管理
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);

  // 戻り先ページのルーティング定義
  const pageRoutes = {
    timeline: '/timeline',
    mypage: '/mypage',
    'research-list': '/',
    notification: '/notifications',
    'research-detail': '/research-detail',
  };

  // 「← 戻る」ボタンクリック時の処理
  const handleBack = (e) => {
    e.preventDefault();
    if (from && pageRoutes[from]) {
      navigate(pageRoutes[from]);
    } else {
      // 指定がない場合のデフォルト遷移先
      navigate('/');
    }
  };

  // 投稿送信時の処理
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('日誌を投稿しました！');

    // 投稿完了後に元の画面へ戻る（例: タイムラインまたは一覧）
    if (from && pageRoutes[from]) {
      navigate(pageRoutes[from]);
    } else {
      navigate('/timeline');
    }
  };

  return (
    <main className="main-content flex-grow-1 p-4">
      {/* 戻るリンク */}
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
            <input
              type="file"
              id="diary-photo"
              className="form-control"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>

          {/* 投稿ボタン */}
          <div className="text-end">
            <button type="submit" className="save-button btn btn-primary px-4 fw-bold">
              投稿する
            </button>
          </div>
        </form>

        {/* 完成したものの登録リンク（fromパラメーターを引き継ぎ） */}
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