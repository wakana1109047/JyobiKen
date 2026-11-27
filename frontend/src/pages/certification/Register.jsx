import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

const grad_options = {
    high: ['1年', '2年', '3年', '4年'],       // 高度情報工学科
    synthesis: ['1年', '2年', '3年'],         // 総合システム科
    system: ['1年', '2年']                    // 情報システム科
}

export default function Register() {
    const navigate = useNavigate()  // ページ遷移用

    // React Hook Form の初期化
    const {
        register,
        handleSubmit,
        getValues,
        watch,    // watch を追加して学科の選択状態を監視
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',             // 氏名
            department: 'system', // 初期値を「情報システム科」に設定
            grade: '1年',         // 学年
            email: '',            // 学校のメアド　※必須
            email2: '',           // 連絡用のメアド
            password: '',         // パスワード
            passwordConfirm: '',  // 確認用パスワード　※DBに保存しない
            agreement: false      // 修了研究の有無　※初期値：受講しない
        }
    })

    // 選択の学科をリアルタイム表示
    const selectedDepartment = watch('department')

    // 送信時の処理
    const onsubmit = async (data) => {
        try {
            // 1. Spring BootのAPIへPOSTリクエストを送信
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    department: data.department,
                    grade: data.grade,
                    email: data.email,
                    email2: data.email2,
                    password: data.password,
                    agreement: data.agreement
                }),
            })

            // 2. サーバからのレスポンス結果をチェック
            if (response.ok) {
                console.log('登録成功！')
                navigate('/login') // 登録成功後はログイン画面へ移動
            } else {
                console.error('登録失敗 ステータスコード：', response.status)
                alert('登録に失敗しました。入力内容を確認してください')
            }
        } catch (error) {
            console.error('通信エラー：', error)
            alert('サーバとの通信に失敗しました')
        }
    }

    // エラーの処理
    const onerror = (error) => {
        console.log('フォームエラー', error)
    }

    return (
        <div>
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
                                <div className="invalid-feedback">{errors.name?.message}</div>
                            </div>

                            {/* 学科／学年 */}
                            <div className="row mb-3">
                                {/* 学科 */}
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label htmlFor="department" className="form-label fw-bold">学科</label>
                                    <select
                                        className="form-select"
                                        id="department"
                                        {...register('department')}
                                    >
                                        <option value="high">高度情報工学科</option>
                                        <option value="synthesis">総合システム科</option>
                                        <option value="system">情報システム科</option>
                                    </select>
                                </div>
                                {/* 学年 */}
                                <div className="col-md-6">
                                    <label htmlFor="grade" className="form-label fw-bold">学年</label>
                                    <select
                                        className="form-select"
                                        id="grade"
                                        {...register('grade', {
                                            required: '学年を選択してください'
                                        })}
                                    >
                                        {grad_options[selectedDepartment]?.map((gradeOption) => (
                                            <option key={gradeOption} value={gradeOption}>
                                                {gradeOption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 学校メールアドレス */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-bold">
                                    メールアドレス1
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
                                            value: /^[a-z]\.[a-z]{1,20}\.sys\d+@morijyobi\.ac\.jp$/i,
                                            message: '学校のメールアドレスを入力してください'
                                        }
                                    })}
                                />
                                <div className="invalid-feedback">
                                    {errors.email?.message}
                                </div>
                            </div>

                            {/* 外部メールアドレス */}
                            <div className="mb-3">
                                <label htmlFor="email2" className="form-label fw-bold">
                                    メールアドレス2<span className="text-danger"> ※任意</span>
                                </label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email2 ? 'is-invalid' : ''}`}
                                    id="email2"
                                    placeholder="example@email.com"
                                    autoComplete="email"
                                    {...register('email2',{
                                        // 多分ここら辺に追加
                                        validate:(value) => {
                                            // 未入力でもOK
                                            if(!value)
                                                return true
                                            // ブラウザの標準的なメアド形式か関数でチェック
                                            const tempInput = document.createElement('input');
                                            tempInput.type = 'email'
                                            tempInput.value = value

                                            return tempInput.checkValidity() || '正しいメールアドレスの形式で入力してください'
                                        }
                                    })}
                                />
                                <div className="invalid-feedback">
                                    {errors.email2?.message}
                                </div>
                            </div>

                            {/* パスワード */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label fw-bold">
                                    パスワード
                                </label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
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
                                <div className="invalid-feedback">{errors.password?.message}</div>
                            </div>

                            {/* パスワード確認 */}
                            <div className="mb-3">
                                <label htmlFor="password-confirm" className="form-label fw-bold">
                                    パスワード（確認用）
                                </label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`}
                                    id="password-confirm"
                                    placeholder="もう一度入力"
                                    autoComplete="new-password"
                                    {...register('passwordConfirm', {
                                        required: 'パスワードの再入力は必須です',
                                        validate: (value) => {
                                            const { password } = getValues()
                                            return value === password || 'パスワードが一致しません'
                                        }
                                    })}
                                />
                                <div className="invalid-feedback">
                                    {errors.passwordConfirm?.message}
                                </div>
                            </div>

                            {/* 修了制作の確認 */}
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
    )
}