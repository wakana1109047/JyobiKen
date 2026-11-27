import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Outlet, Navigate, Link } from 'react-router-dom'

// コンポーネント (components/)
import Sidebar from './components/Sidebar'

// ユーザー系 (pages/user/)
import Home from './pages/user/research-list'
import MyPage from './pages/user/mypage'
import TimeLine from './pages/user/timeline'
import Notifications from './pages/user/notifications'
import NotificationDetail from './pages/user/notification-detail'
import DiaryEdit from './pages/user/diary-edit'
import ProfileEdit from './pages/user/profile-edit'
import ResearchDetail from './pages/user/research-detail'
import KanpuRegister from './pages/user/kanpu-register'
import ResearchEdit from './pages/user/research-edit'

// 認証系 (pages/certification/)
import Login from './pages/certification/Login.jsx'
import Register from './pages/certification/Register.jsx'
import ForgotPassword from './pages/certification/forgot-password'
import ResetPassword from './pages/certification/reset-password'

// 管理者系 (pages/admin/)
import AdminHome from './pages/admin/admin-home'
import AdminAccounts from './pages/admin/admin-accouts'
import AdminAccountDetail from './pages/admin/admin-accout-detail'
import AdminResearchEdit from './pages/admin/admin-research-edit'
import AdminResearchDetail from './pages/admin/admin-research-detail'

import "./App.css"
import "./page.css"
import "bootstrap/dist/css/bootstrap.min.css"

// ==========================================================================
// 1. 判定用ガードコンポーネント
// ==========================================================================

// 未ログイン判定（ログインしていなければ /login へ強制移動）
function ProtectedRoute({ user, children }) {
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children
}

// 管理者判定（管理者でなければ一般トップ / へ強制移動）
function AdminRoute({ user, children }) {
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />
    }
    return children
}

// ==========================================================================
// 2. 共通レイアウト
// ==========================================================================

// ログイン後の共通レイアウト（サイドバー付き）
function MainLayout({ user, onLogout }) {
    return (
        <div className="layout d-flex">
            <Sidebar user={user} onLogout={onLogout} />
            <Outlet />
        </div>
    )
}

// 認証画面用の共通レイアウト（ヘッダー付き）
function Certification() {
    return (
        <div>
            <header className="auth-header">
                <Link to="/login" className="logo">
                    JyobiKen
                </Link>
            </header>
            <Outlet />
        </div>
    )
}

// ダミー通知データ
const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        title: 'いいねされました',
        message: '山田太郎さんがあなたの投稿「活動記録」に「いいね」しました。',
        date: '2026年10月27日 09:30',
        isRead: false,
        postId: 1,
        postTitle: '活動記録',
        postPreviewText: '今日の卒業研究では、アプリの画面設計を進めました。',
    },
    {
        id: 2,
        title: 'いいねされました',
        message: '佐藤花子さんがあなたの投稿「画面設計」に「いいね」しました。',
        date: '2026年10月26日 15:20',
        isRead: false,
        postId: 2,
        postTitle: '画面設計',
        postPreviewText: '画面のデザインをチームで相談しました。',
    },
    {
        id: 3,
        title: 'コメントされました',
        message: '鈴木花子さんがあなたの投稿「進捗報告」にコメントしました。',
        date: '2026年10月25日 12:00',
        isRead: true,
        postId: 3,
        postTitle: '進捗報告',
        postPreviewText: 'プログラムの実装を少しずつ進めています。',
    },
]

// ==========================================================================
// 3. アプリ本体
// ==========================================================================
export default function App() {
    // ログイン中のユーザー情報（初期状態はテスト用ユーザー）→ 常時ログイン用
    // const [user, setUser] = useState({
    //     name: '山田太郎',
    //     role: 'user', // 'admin' に変更すると管理者画面をテスト可能です
    // })

    // ユーザ未ログイン状態
    const[user, setUser] = useState(null)

    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

    // ログイン処理
    const handleLogin = useCallback((userData) => {
        setUser(userData)
    }, [])

    // ログアウト処理
    const handleLogout = useCallback(() => {
        setUser(null)
    }, [])

    // 通知を既読にする
    const markAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((item) => (item.id === Number(id) ? { ...item, isRead: true } : item))
        )
    }, [])

    // すべての通知を既読にする
    const handleReadAll = useCallback(() => {
        setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                {/* 1. 認証画面群（サイドバーなし / ヘッダーあり） */}
                <Route element={<Certification />}>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                {/* 2. メイン画面群（ログイン必須 + サイドバーあり） */}
                <Route
                    element={
                        <ProtectedRoute user={user}>
                            <MainLayout user={user} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                >
                    {/* 一般・共通ルート */}
                    <Route path="/" element={<Home />} />
                    <Route path="/research-list" element={<Home />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/timeline" element={<TimeLine />} />
                    <Route
                        path="/notifications"
                        element={<Notifications notifications={notifications} onReadAll={handleReadAll} />}
                    />
                    <Route
                        path="/notifications/:id"
                        element={<NotificationDetail notifications={notifications} onMarkAsRead={markAsRead} />}
                    />
                    <Route path="/diary-edit" element={<DiaryEdit />} />
                    <Route path="/profile-edit" element={<ProfileEdit />} />
                    <Route path="/research-detail" element={<ResearchDetail />} />
                    <Route path="/research-edit" element={<ResearchEdit />} />
                    <Route path="/kanpu-register" element={<KanpuRegister />} />

                    {/* 管理者専用ルート（AdminRoute で保護） */}
                    <Route
                        path="/admin-home"
                        element={
                            <AdminRoute user={user}>
                                <AdminHome />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin-accounts"
                        element={
                            <AdminRoute user={user}>
                                <AdminAccounts />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin-account-detail"
                        element={
                            <AdminRoute user={user}>
                                <AdminAccountDetail />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin-research-detail"
                        element={
                            <AdminRoute user={user}>
                                <AdminResearchDetail />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin-research-edit"
                        element={
                            <AdminRoute user={user}>
                                <AdminResearchEdit />
                            </AdminRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}