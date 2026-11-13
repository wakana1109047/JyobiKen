import {Link, useNavigate} from "react-router-dom"
import { useForm }  from "react-hook-form"
// import 'bootstrap/dist/css/bootstrap.min.css'

export default function Login() {
    const navigate = useNavigate()   // ページ遷移用

    // React Hook Form の初期化
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    })

    // 送信（バリデーション成功時）の処理
    const onsubmit = (data) => {
        console.log('ログイン送信データ:', data)
        // 画面遷移（トップページへ）
        navigate('/mypage')
    }

    // エラー時の処理（デバッグ用）
    const onerror = (error) => {
        console.log('フォームエラー:', error)
    }

    return (
        <div>
            {/* ヘッダー */}
            <header>
                <Link to="/login" className="logo">
                    JyobiKen
                </Link>
            </header>

            {/* ログインエリア */}
            <main className="login-area">

                <div className="card login-card">

                    <div className="card-body p-5">

                        <h1 className="login-title text-center mb-2">
                            ログイン
                        </h1>

                        <p className="description text-center mb-4">
                            アカウントにログインしてください
                        </p>

                        <form id="loginForm" onSubmit={handleSubmit(onsubmit, onerror)} noValidate>

                            {/* メールアドレス */}
                            <div className="mb-4">

                                <label htmlFor="email" className="form-label fw-bold">
                                    メールアドレス
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder="example@email.com"
                                    autoComplete="email"
                                    {...register('email', {
                                        required: 'メールアドレスは必須です',
                                        pattern: {
                                            // 正規表現　※後で条件を確認
                                            value: /^[a-z]\.[a-z]{1,20}\.sys\d+@morijyobi\.ac\.jp$/i,
                                            message: '学校のメールアドレスを入力してください'
                                        }
                                    })}
                                />
                                {/* エラーメッセージを表示 */}
                                <div className="invalid-feedback">
                                    {errors.email?.message}
                                </div>

                            </div>

                            {/* パスワード */}
                            <div className="mb-4">

                                <label htmlFor="password" className="form-label fw-bold">
                                    パスワード
                                </label>

                                <input
                                    type="password"
                                    id="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="パスワードを入力"
                                    autoComplete="current-password"
                                    {...register('password',{
                                        required: 'パスワードの入力は必須です',
                                        minLength: {
                                            value: 8,
                                            message: 'パスワードは8文字以上で入力してください'
                                        }

                                    })}

                                />
                                {/* エラーメッセージを表示 */}
                                <div className="invalid-feedback">{errors.password?.message}</div>

                            </div>

                            {/* ログインボタン */}
                            <button type="submit" className="btn btn-primary w-100">
                                ログイン
                            </button>

                        </form>

                        {/* 登録リンク */}
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


    )
}

