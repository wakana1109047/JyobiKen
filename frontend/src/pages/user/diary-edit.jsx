import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function DiaryEdit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const photoInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // 写真プレビューの作成
  useEffect(() => {
    if (!photo) {
      setPhotoPreview('');
      return;
    }

    const imageUrl = URL.createObjectURL(photo);
    setPhotoPreview(imageUrl);

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [photo]);

  const pageRoutes = {
    timeline: '/timeline',
    mypage: '/mypage',
    'research-list': '/',
    notification: '/notifications',
    'research-detail': '/research-detail',
  };

  const handleBack = () => {
    if (from && pageRoutes[from]) {
      navigate(pageRoutes[from]);
    } else {
      navigate('/timeline');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 画像ファイルか確認
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。');
      e.target.value = '';
      return;
    }

    // ファイルサイズ確認（5MBまで）
    if (file.size > 5 * 1024 * 1024) {
      alert('写真のサイズは5MB以内にしてください。');
      e.target.value = '';
      return;
    }

    setPhoto(file);
  };

  const handlePhotoDelete = () => {
    setPhoto(null);

    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 未入力チェック
    if (!title.trim() || !content.trim()) {
      alert('タイトルと日誌内容を入力してください。');
      return;
    }

    // 投稿前の確認
    const confirmPost = window.confirm(
      'この内容で日誌を投稿しますか？'
    );

    if (!confirmPost) return;

    // 現時点では投稿処理の仮実装
    alert('日誌を投稿しました！');

    if (from && pageRoutes[from]) {
      navigate(pageRoutes[from]);
    } else {
      navigate('/timeline');
    }
  };

  return (
    <main className="main-content flex-grow-1 page-content">

      {/* 戻るボタン */}
      <button
        type="button"
        onClick={handleBack}
        className="back-link border-0 bg-transparent p-0 mb-3"
      >
        ← 戻る
      </button>

      <h1 className="page-title h4 mb-4 fw-bold">
        日誌投稿
      </h1>

      <div className="content-card">

        <form onSubmit={handleSubmit}>

          {/* タイトル */}
          <div className="mb-4">
            <label
              htmlFor="diary-title"
              className="form-label fw-bold"
            >
              タイトル
              <span className="text-danger ms-1">*</span>
            </label>

            <input
              type="text"
              id="diary-title"
              className="form-control"
              placeholder="日誌のタイトルを入力してください"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              required
            />

            <div className="text-end text-secondary small mt-1">
              {title.length} / 50文字
            </div>
          </div>

          {/* 日誌内容 */}
          <div className="mb-4">
            <label
              htmlFor="diary-content"
              className="form-label fw-bold"
            >
              日誌内容
              <span className="text-danger ms-1">*</span>
            </label>

            <textarea
              id="diary-content"
              className="form-control"
              rows="8"
              placeholder="今日の活動内容や進捗を入力してください"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
              required
            />

            <div className="text-end text-secondary small mt-1">
              {content.length} / 1000文字
            </div>
          </div>

          {/* 写真 */}
          <div className="mb-4">
            <label
              htmlFor="diary-photo"
              className="form-label fw-bold"
            >
              写真
            </label>
            <input
              ref={photoInputRef}
              type="file"
              id="diary-photo"
              className="form-control"
              accept="image/*"
              onChange={handlePhotoChange}
            />

            <small className="text-secondary">
              ※ 画像ファイルのみ・5MB以内
            </small>

            {/* 写真プレビュー */}
            {photoPreview && (
              <div className="mt-3">
                <p className="fw-bold small mb-2">
                  選択した写真
                </p>

                <img
                  src={photoPreview}
                  alt="選択した写真のプレビュー"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />

                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={handlePhotoDelete}
                  >
                    写真を削除
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 投稿ボタン */}
          <div className="text-end">
            <button
              type="submit"
              className="save-button btn btn-primary px-4 fw-bold"
            >
              投稿する
            </button>
          </div>

        </form>

        {/* 完成品登録リンク */}
        <div className="mt-4 pt-3 border-top">
          <Link
            to={`/kanpu-register?from=${encodeURIComponent(from || '')}`}
            className="sub-link text-decoration-none small text-primary"
          >
            完成したものを登録する →
          </Link>
        </div>

      </div>
    </main>
  );
}
