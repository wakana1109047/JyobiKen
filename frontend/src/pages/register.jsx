export default function Register () {
    return (
        <div>

            <!-- ヘッダー -->
            <header>
                <a href="login.html" className="logo">
                    JyobiKen
                </a>
            </header>

            <!-- 新規登録フォーム -->
            <main className="register-area">

                <div className="card register-card">

                    <div className="card-body p-5">

                        <h1 className="register-title text-center mb-2">
                            アカウント作成
                        </h1>

                        <p className="description text-center mb-4">
                            必要な情報を入力して登録してください
                        </p>

                        <form action="#" method="post">

                            <!-- 氏名 -->
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
                                    required
                                />

                            </div>

                            <!-- メールアドレス -->
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
                                    required
                                />

                            </div>

                            <!-- パスワード -->
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
                                    required
                                />

                            </div>

                            <!-- パスワード確認 -->
                            <div className="mb-3">

                                <label htmlFor="password-confirm" className="form-label fw-bold">
                                    パスワード（確認用）
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    id="password-confirm"
                                    name="password-confirm"
                                    placeholder="もう一度入力"
                                    autoComplete="new-password"
                                    required
                                />

                            </div>

                            <!-- 修了制作の確認 -->
                            <div className="form-check my-4">

                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="agreement"
                                    name="agreement"
                                    required
                                />

                                <label className="form-check-label" htmlFor="agreement">
                                    修了制作を受講します
                                </label>

                            </div>

                            <!-- 登録ボタン -->
                            <button type="submit" className="btn btn-primary w-100">
                                登録する
                            </button>

                        </form>

                        <!-- ログインへのリンク -->
                        <div className="text-center mt-4">

                            <p className="text-secondary small mb-2">
                                すでにアカウントをお持ちの方は
                            </p>

                            <a href="login.html" className="login-link">
                                ログインはこちら →
                            </a>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    )
}
