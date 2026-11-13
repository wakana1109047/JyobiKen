import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// コンポーネント (components/)
import Sidebar from './components/Sidebar';

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
import ForgotPassword from './pages/certification/forgot-password';
import ResetPassword from './pages/certification/reset-password';

// 管理者系 (admin/)
import AdminHome from './pages/admin/admin-home';
import AdminAccounts from './pages/admin/admin-accouts';
import AdminAccountDetail from './pages/admin/admin-accout-detail';
import AdminResearchEdit from './pages/admin/admin-research-edit';
import AdminResearchDetail from './pages/admin/admin-research-detail';

import "./App.css";
import "./page.css";

// ==========================================================================
// 1. 判定用ガードコンポーネント
// ==========================================================================

// 未ログイン判定（ログインしていなければ /login へ強制移動）
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// 管理者判定（管理者でなければ一般トップ / へ強制移動）
function AdminRoute({ user, children }) {
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

// ==========================================================================
// 2. サイドバー付き共通レイアウト
// ==========================================================================
function MainLayout({ user, onLogout }) {
  return (
    <div className="layout d-flex">
      <Sidebar user={user} onLogout={onLogout} />
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

// ==========================================================================
// 3. アプリ本体
// ==========================================================================
export default function App() {
  // ログイン中のユーザー情報（null = 未ログイン / role: 'user' or 'admin'）
  // ※開発中にすぐ画面確認できるよう、初期値に仮ユーザーを入れています（未ログインから始める場合は null に変更）
  const [user, setUser] = useState({
    name: '山田太郎',
    role: 'user', // 'admin' に変えると管理者として開始できます
  });

  // 変更後（本番仕様：最初は未ログイン状態）
  //const [user, setUser] = useState(null);

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // ログイン処理（login.jsx に渡して使用）
  const handleLogin = useCallback((userData) => {
    setUser(userData);
  }, []);

  // ログアウト処理
  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

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
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* メイン画面（ログイン必須 + サイドバーあり） */}
        <Route
          element={
            <ProtectedRoute user={user}>
              <MainLayout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          {/* 一般・共通ルート */}
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
  );
}