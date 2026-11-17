import {Link, useNavigate} from "react-router-dom"
import { useForm }  from "react-hook-form"

export default function Register () {
    const navigate = useNavigate();  // ページ遷移用

    // React Hook Form の初期化
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            agreement: false
        }
    })

    // 送信時の処理　※成功した場合
    const onsubmit = (data) => {
        // console.log()は、後で削除！！
        console.log('登録データ：', data)
        // 画面遷移 (ログインページへ)
        navigate('/mypage')
    }

    // エラーの処理
    const onerror = (error) => {
        console.log('フォームエラー', error)
    }

    return (
        <div>

            {/* ヘッダー */}
            {/*<header>*/}
            {/*    <a href="login.html" className="logo">*/}
            {/*        JyobiKen*/}
            {/*    </a>*/}
            {/*</header>*/}

            {/* 新規登録フォーム */}
            <main className="register-area">

                <div className="card register-card">

                    <div className="card-body p-5">

                        <h1 className="register-title text-center mb-2">
                            アカウント作成
                        </h1>

                        <p className="description text-center mb-4">
                            必要な情報を入力して登録してください
                        </p>

                        <form id="registerForm" onSubmit={handleSubmit(onsubmit, onerror)} noValidate>

                            {/* 氏名 */}
                            <div className="mb-3">

                                <label htmlFor="name" className="form-label fw-bold">
                                    氏名
                                </label>

                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    placeholder="氏名を入力"
                                    autoComplete="name"
                                    {...register('name', {
                                        required: '名前は必須です'
                                    })}
                                />
                                {/* エラーメッセージを表示 */}
                                <div className="invalid-feedback">{errors.name?.message}</div>


                            </div>

                            {/*メールアドレス */}
                            <div className="mb-3">

                                <label htmlFor="email" className="form-label fw-bold">
                                    メールアドレス
                                </label>

                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    placeholder="example@email.com"
                                    autoComplete="email"
                                    {...register('email', {
                                        required: 'メールは必須です',
                                        pattern: {
                                            // 正規表現
                                            value: /^[a-z]\.[a-z]{1,20}\.sys\d+@morijyobi\.ac\.jp$/i,
                                            message: '学校のメールアドレスを入力してください'
                                        }
                                    })}
                                />
                                {/* エラーメッセージを表示 */}
                                <div className="invalid-feedback">{
                                    errors.email?.message}
                                </div>

                            </div>

                             {/*パスワード */}
                            <div className="mb-3">

                                <label htmlFor="password" className="form-label fw-bold">
                                    パスワード
                                </label>

                                <input
                                    type="password"
                                    className={`form-control ${errors.password? 'is-invalid' : ''}`}
                                    id="password"
                                    placeholder="パスワードを入力"
                                    autoComplete="new-password"
                                    {...register('password', {
                                        required: 'パスワードは必須です',
                                        minLength: {
                                            value: 8,
                                            message: 'パスワードは8文字以上で入力してください'
                                        }
                                    })}
                                />

                            </div>

                            {/*パスワード確認 */}
                            <div className="mb-3">

                                <label htmlFor="password-confirm" className="form-label fw-bold">
                                    パスワード（確認用）
                                </label>

                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    id="password-confirm"
                                    placeholder="もう一度入力"
                                    autoComplete="new-password"
                                    {...register('password', {
                                        required: 'パスワードの再入力は必須です',
                                        minLength: {
                                            value: 8,
                                            message: '同じパスワードを入力してください'
                                        }
                                    })}
                                />

                            </div>

                            {/*修了制作の確認 */}
                            <div className="form-check my-4">

                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="agreement"
                                    {...register('agreement')}
                                />

                                <label className="form-check-label" htmlFor="agreement">
                                    修了制作を受講します
                                </label>

                            </div>

                            {/*登録ボタン */}
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

    )
}
