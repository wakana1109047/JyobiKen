import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // メールアドレスに "admin" が含まれているかで権限を判定（例: admin@example.com）
        const isAdmin = formData.email.toLowerCase().includes('admin');

        if (onLogin) {
            onLogin({
                name: isAdmin ? '管理者' : '山田太郎',
                email: formData.email,
                role: isAdmin ? 'admin' : 'user',
            });
        }

        // 権限に応じたトップページへ自動遷移
        navigate(isAdmin ? '/admin-home' : '/');
    };

    // 開発・動作確認用：ワンクリックでログイン切り替え(いずれ消します！！)ここから
    const handleQuickLogin = (role) => {
        const isAdmin = role === 'admin';
        if (onLogin) {
            onLogin({
                name: isAdmin ? '管理者' : '山田太郎',
                email: isAdmin ? 'admin@example.com' : 'user@example.com',
                role,
            });
        }
        navigate(isAdmin ? '/admin-home' : '/');
    };　//ここまで

    return (
        <div className="auth-page-wrapper">
            {/* ヘッダー */}
            <header className="auth-header">
                <Link to="/login" className="logo">
                    JyobiKen
                </Link>
            </header>

            {/* ログインエリア */}
            <main className="login-area">
                <div className="card login-card">
                    <div className="card-body p-5">
                        <h1 className="login-title text-center mb-2">ログイン</h1>
                        <p className="description text-center mb-4">
                            アカウントにログインしてください
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* メールアドレス */}
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label fw-bold">
                                    メールアドレス
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="example@email.com"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* パスワード */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <label htmlFor="password" className="form-label fw-bold mb-0">
                                        パスワード
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="small text-decoration-none"
                                        style={{ color: 'var(--main-blue)' }}
                                    >
                                        パスワードをお忘れですか？
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="パスワードを入力"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* ログインボタン */}
                            <button type="submit" className="btn btn-primary w-100">
                                ログイン
                            </button>
                        </form>

                        {/* 開発・テスト用のクイック切り替えボタン（いずれ消します）ここから */}
                        <div className="mt-4 pt-3 border-top">
                            <p className="text-secondary small text-center mb-2">
                                動作確認用クイックログイン
                            </p>
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm w-50"
                                    onClick={() => handleQuickLogin('user')}
                                >
                                    一般でログイン
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm w-50"
                                    onClick={() => handleQuickLogin('admin')}
                                >
                                    管理者でログイン
                                </button>
                            </div>
                        </div>　{/*ここまで*/}

                        {/* 新規登録リンク */}
                        <div className="text-center mt-4">
                            <p className="text-secondary small mb-2">
                                アカウントをお持ちでない方は
                            </p>
                            <Link to="/register" className="register-link">
                                新規登録はこちら →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}