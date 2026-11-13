import { useState } from 'react'; import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        agreement: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.passwordConfirm) {
            alert('パスワードが一致していません');
            return;
        }
        alert('登録が完了しました');
        navigate('/login');
    };

    return (
        <div className="auth-page-wrapper">
            {/* ヘッダー */}
            <header className="auth-header">
                <Link to="/login" className="logo">
                    JyobiKen
                </Link>
            </header>

            {/* 新規登録フォーム */}
            <main className="register-area">
                <div className="card register-card">
                    <div className="card-body p-5">
                        <h1 className="register-title text-center mb-2">アカウント作成</h1>
                        <p className="description text-center mb-4">
                            必要な情報を入力して登録してください
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* 氏名 */}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label fw-bold">
                                    氏名
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="氏名を入力"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* メールアドレス */}
                            <div className="mb-3">
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
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label fw-bold">
                                    パスワード
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="パスワードを入力"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* パスワード確認 */}
                            <div className="mb-3">
                                <label htmlFor="passwordConfirm" className="form-label fw-bold">
                                    パスワード（確認用）
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    placeholder="もう一度入力"
                                    autoComplete="new-password"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* 修了制作の確認 */}
                            <div className="form-check my-4">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="agreement"
                                    name="agreement"
                                    checked={formData.agreement}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="agreement">
                                    修了制作を受講します
                                </label>
                            </div>

                            {/* 登録ボタン */}
                            <button type="submit" className="btn btn-primary w-100">
                                登録する
                            </button>
                        </form>

                        {/* ログインへのリンク */}
                        <div className="text-center mt-4">
                            <p className="text-secondary small mb-2">
                                すでにアカウントをお持ちの方は
                            </p>
                            <Link to="/login" className="login-link">
                                ログインはこちら →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}