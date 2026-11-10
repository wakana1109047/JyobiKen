import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link, Outlet } from 'react-router-dom';

// ユーザー系 (user/)
import Home from './pages/user/research-list';
import MyPage from './pages/user/mypage';
import TimeLine from './pages/user/timeline';
import Notifications from './pages/user/notifications';
import NotificationDetail from './pages/user/notification-detail';
import DiaryEdit from './pages/user/diary-edit';
import ProfileEdit from './pages/user/profile-edit';
import ResearchDetail from './pages/user/research-detail';
import KanpuRegister from './pages/user/kanpu-register';

// 認証系 (certification/)
import Login from './pages/certification/login';
import Register from './pages/certification/register';

// 管理者系 (admin/)
import AdminHome from './pages/admin/admin-home';
import AdminAccounts from './pages/admin/admin-accouts';
import AdminAccountDetail from './pages/admin/admin-accout-detail';
import AdminResearchEdit from './pages/admin/admin-research-edit';
import AdminResearchDetail from './pages/admin/admin-research-detail';

import "./App.css";
import "./page.css";

// サイドバー付き共通レイアウト
function MainLayout() {
  return (
    <div className="layout d-flex">
      <aside className="sidebar">
        <Link to="/" className="logo">JyobiKen</Link>
        <nav className="nav flex-column">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
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
          <Link to="/login" className="btn btn-outline-secondary btn-sm w-100">
            ログアウト →
          </Link>
        </div>
      </aside>

      <Outlet />
    </div>
  );
}

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
];

export default function App() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === Number(id) ? { ...item, isRead: true } : item))
    );
  }, []);

  const handleReadAll = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 認証画面（サイドバーなし） */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* メイン画面（サイドバーあり） */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
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
          <Route path="/kanpu-register" element={<KanpuRegister />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin-accounts" element={<AdminAccounts />} />
          <Route path="/admin-account-detail" element={<AdminAccountDetail />} />
          <Route path="/admin-research-detail" element={<AdminResearchDetail />} />
          <Route path="/admin-research-edit" element={<AdminResearchEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}