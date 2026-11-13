import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: バックエンドのパスワード再設定メール送信APIと連携する
        setIsSubmitted(true);
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
                        {!isSubmitted ? (
                            /* ================= 1. メールアドレス入力フォーム ================= */
                            <>
                                <h1 className="login-title text-center mb-2">パスワード再設定</h1>
                                <p className="description text-center mb-4">
                                    登録済みのメールアドレスを入力してください。<br />
                                    パスワード再設定用のリンクをお送りします。
                                </p>

                                <form onSubmit={handleSubmit}>
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">
                                        再設定メールを送信
                                    </button>
                                </form>
                            </>
                        ) : (
                            /* ================= 2. 送信完了メッセージ ================= */
                            <div className="text-center">
                                <div className="mb-3" style={{ fontSize: '40px' }}>✉️</div>
                                <h1 className="login-title mb-3">メールを送信しました</h1>
                                <p className="description mb-4">
                                    <strong>{email}</strong> 宛に<br />
                                    パスワード再設定用の案内を送信しました。<br />
                                    メール内のリンクから新しいパスワードを設定してください。
                                </p>

                                {/* 開発・動作確認用：メール内リンクの代わり（いずれ消します！！）ここから */}
                                <div className="mb-3">
                                    <Link to="/reset-password" className="btn btn-primary btn-sm w-100">
                                        （テスト用）メール内のリンクを開いて再設定へ進む →
                                    </Link>
                                </div> 
                                {/*ここまで*/}
                                
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm mb-3 w-100"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    別のメールアドレスで再送信する
                                </button>
                            </div>
                        )}

                        {/* ログイン画面へ戻るリンク */}
                        <div className="text-center mt-4 pt-3 border-top">
                            <Link to="/login" className="register-link">
                                ← ログイン画面に戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}