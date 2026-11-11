import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminResearchEdit() {
    const [title, setTitle] = useState('研究概要');
    const [description, setDescription] = useState('研究内容を入力してください。');
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setImagePreview(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            setImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('画面デザインのサンプルです。保存処理はまだ実装されていません。');
    };

    return (
        <main className="main-content">
            <h1 className="page-title">詳細編集</h1>

            <section className="content-card">
                <Link to="/admin-research-detail" className="text-primary text-decoration-none small">
                    ← 戻る
                </Link>

                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label htmlFor="image" className="form-label">画像</label>
                        <div
                            className="image-preview"
                            style={{
                                backgroundImage: imagePreview ? `url('${imagePreview}')` : 'none',
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            {!imagePreview && '画像など'}
                        </div>
                        <input type="file" id="image" className="form-control" accept="image/*" onChange={handleImageChange} />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="title" className="form-label">タイトル</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">グループ</label>
                        <input type="text" className="form-control" value="グループA" readOnly />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">メンバー</label>
                        <div className="d-flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5].map((_, index) => (
                                <span key={index} className="member-chip">👤 山田花子</span>
                            ))}
                        </div>
                        <small className="text-secondary">
                            メンバーの変更は管理者設定から行います。
                        </small>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="form-label">研究内容</label>
                        <textarea
                            id="description"
                            className="form-control"
                            rows="5"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2 flex-wrap">
                        <Link to="/admin-research-detail" className="btn btn-outline-secondary">
                            キャンセル
                        </Link>
                        <button type="submit" className="btn btn-primary">
                            変更を保存
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}