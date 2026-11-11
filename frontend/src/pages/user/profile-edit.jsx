import { useState } from 'react'; import 'bootstrap/dist/css/bootstrap.min.css';

export default function ProfileEdit() {
    // フォームの状態管理
    const [formData, setFormData] = useState({
        name: '山田 太郎',
        userId: 'yamada_taro',
        email: 'example@example.com',
        introduction: 'よろしくお願いします！'
    });

    // 画像プレビュー用の状態管理
    const [imagePreview, setImagePreview] = useState(null);

    // 入力値変更のハンドラー
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 画像変更時のハンドラー
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // フォーム送信時のハンドラー
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('プロフィールを保存しました。');
        // ルーティングライブラリ（React Routerなど）を使用する場合は useNavigate() 等で遷移します
        window.location.href = 'mypage.html';
    };

    return (
        <div className="profile-edit-wrapper">
            {/* サイドバー */}
            <nav className="sidebar">
                <div className="logo">JyobiKen</div>
                <a href="research-list.html">卒業研究一覧</a>
                <a href="mypage.html" className="active">マイページ</a>
                <a href="timeline.html">タイムライン</a>
                <a href="notifications.html">通知</a>
                <a href="login.html" className="logout">ログアウト</a>
            </nav>

            {/* プロフィール編集メインコンテンツ */}
            <main className="main-content">
                <h1 className="page-title">プロフィール編集</h1>

                <section className="content-card">
                    <form onSubmit={handleSubmit}>
                        {/* プロフィール画像 */}
                        <div className="profile-image-area">
                            <div className="profile-image">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="プロフィールプレビュー" />
                                ) : (
                                    <span>👤</span>
                                )}
                            </div>

                            <label htmlFor="profile-image-input" className="image-button">
                                画像を変更する
                            </label>

                            <input
                                type="file"
                                id="profile-image-input"
                                accept="image/*"
                                className="d-none"
                                onChange={handleImageChange}
                            />

                            <p className="form-text mt-2">
                                JPG・PNG形式の画像を選択してください。
                            </p>
                        </div>

                        <hr className="mb-4" />

                        {/* 名前 */}
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label">名前</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* ユーザーID */}
                        <div className="mb-4">
                            <label htmlFor="user-id" className="form-label">ユーザーID</label>
                            <input
                                type="text"
                                id="user-id"
                                name="userId"
                                className="form-control"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* メールアドレス */}
                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">メールアドレス</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 自己紹介 */}
                        <div className="mb-4">
                            <label htmlFor="introduction" className="form-label">自己紹介</label>
                            <textarea
                                id="introduction"
                                name="introduction"
                                className="form-control"
                                placeholder="自己紹介を入力してください"
                                value={formData.introduction}
                                onChange={handleChange}
                            />
                            <div className="form-text">自分について自由に紹介できます。</div>
                        </div>

                        {/* ボタン */}
                        <div className="button-area d-flex justify-content-end gap-3 mt-5">
                            <a href="mypage.html" className="btn btn-outline-secondary">
                                キャンセル
                            </a>
                            <button type="submit" className="btn btn-primary">
                                変更を保存する
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}