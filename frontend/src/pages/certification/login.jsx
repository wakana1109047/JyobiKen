import { useState } from 'react'; import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
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
        // ログイン処理（ダミー遷移）
        navigate('/');
    };

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
                                <label htmlFor="password" className="form-label fw-bold">
                                    パスワード
                                </label>
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
                            <button type="submit" className="btn btn-primary auth-submit-btn">
                                ログイン
                            </button>
                        </form>

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