import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link, Outlet } from 'react-router-dom'
import Home from './pages/research-list'
import MyPage from './pages/mypage'
import TimeLine from './pages/timeline'
import Notifications from './pages/notifications'
import NotificationDetail from './pages/notification-detail'
import DiaryEdit from './pages/diary-edit'
import ProfileEdit from './pages/profile-edit'
import ResearchDetail from './pages/research-detail'
import Login from './pages/login'

import "./App.css"
import "./page.css"
import "bootstrap/dist/css/bootstrap.min.css" // 画面ごとでなく、一括管理
import Register from "./pages/register.jsx";

// ダミー通知データ一覧
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

// ログイン後の共通レイアウト（サイドバー付き）
function MainLayout() {
  return (
      <div className="layout d-flex">
        {/* 全ページで共通表示するサイドバー */}
        <aside className="sidebar">
          <Link to="/research-list" className="logo">JyobiKen</Link>
          <nav className="nav flex-column">
            <NavLink to="/research-list" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              卒業研究一覧
            </NavLink>
            <NavLink to="/mypage" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              マイページ
            </NavLink>
            <NavLink to="/timeline" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              タイムライン
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              通知
            </NavLink>
          </nav>
          <div className="logout">
            {/* ログアウトボタンで初期のログイン画面 (/) へ移動 */}
            <Link to="/" className="btn btn-outline-secondary btn-sm w-100">
              ログアウト →
            </Link>
          </div>
        </aside>

        <Outlet />
      </div>
  )
}

// 認証共通ヘッダー
function Certification() {
  return(
      <div>
        <header>
          <Link to="/login" className="logo">
            JyobiKen
          </Link>
        </header>
        {/*ログイン画面や新規登録画面*/}
        <Outlet />
      </div>

  )
}

export default function App() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  // 単一の通知を既読に変更する関数（useCallbackで参照を固定）
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, isRead: true } : item))
    )
  }, [])

  // すべての通知を既読に変更する関数
  const handleReadAll = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
  }, [])

  return (
      <BrowserRouter>
        <Routes>

          {/* 1. 未ログイン時（認証ヘッダー Certification 付きの画面群） */}
          <Route element={<Certification />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* 2. ログイン後（サイドバー付きレイアウト MainLayout の画面群） */}
          <Route element={<MainLayout />}>
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
          </Route>

        </Routes>
      </BrowserRouter>
  )
}