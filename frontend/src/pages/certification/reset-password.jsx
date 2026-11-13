import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(''); // 入力し直したらエラー表示を消す
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // バリデーション（文字数・一致判定）
        if (formData.password.length < 8) {
            setError('パスワードは8文字以上で入力してください。');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('確認用のパスワードが一致しません。');
            return;
        }

        // TODO: バックエンドのパスワード更新APIと連携する
        setIsCompleted(true);
    };

    return (
        <div className="auth-page-wrapper">
            {/* ヘッダー */}
            <header className="auth-header">
                <Link to="/login" className="logo">
                    JyobiKen
                </Link>
            </header>

            {/* メインエリア */}
            <main className="login-area">
                <div className="card login-card">
                    <div className="card-body p-5">
                        {!isCompleted ? (
                            /* ================= 1. 新しいパスワード入力フォーム ================= */
                            <>
                                <h1 className="login-title text-center mb-2">新しいパスワードの設定</h1>
                                <p className="description text-center mb-4">
                                    新しく設定するパスワードを入力してください
                                </p>

                                {error && (
                                    <div className="alert alert-danger py-2 small" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {/* 新しいパスワード */}
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-bold">
                                            新しいパスワード
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="8文字以上で入力"
                                            autoComplete="new-password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* パスワード（確認用） */}
                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label fw-bold">
                                            新しいパスワード（確認用）
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="もう一度入力してください"
                                            autoComplete="new-password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">
                                        パスワードを変更する
                                    </button>
                                </form>
                            </>
                        ) : (
                            /* ================= 2. 変更完了メッセージ ================= */
                            <div className="text-center">
                                <div className="mb-3" style={{ fontSize: '40px' }}>✅</div>
                                <h1 className="login-title mb-3">パスワードを変更しました</h1>
                                <p className="description mb-4">
                                    新しいパスワードの設定が完了しました。<br />
                                    ログイン画面から新しいパスワードでログインしてください。
                                </p>
                                <Link to="/login" className="btn btn-primary w-100">
                                    ログイン画面へ進む
                                </Link>
                            </div>
                        )}

                        {!isCompleted && (
                            <div className="text-center mt-4 pt-3 border-top">
                                <Link to="/login" className="register-link">
                                    ← ログイン画面に戻る
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}