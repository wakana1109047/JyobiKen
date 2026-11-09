import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/research-list';
import MyPage from './pages/mypage';
import TimeLine from './pages/timeline';
import Notifications from './pages/notifications';
import NotificationDetail from './pages/notification-detail';
import DiaryEdit from './pages/diary-edit';
import ProfileEdit from './pages/profile-edit';
import "./App.css";
import "./page.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout d-flex">
        {/* 全ページで共通表示するサイドバー */}
        <aside className="sidebar">
          <Link to="/" className="logo">JyobiKen</Link>
          <nav className="nav flex-column">
            <Link to="/" className="nav-link">卒業研究一覧</Link>
            <Link to="/mypage" className="nav-link">マイページ</Link>
            <Link to="/timeline" className="nav-link">タイムライン</Link>
            <Link to="/notifications" className="nav-link">通知</Link>
          </nav>
          <div className="logout">
            <button type="button" className="btn btn-outline-secondary btn-sm w-100">
              ログアウト →
            </button>
          </div>
        </aside>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/timeline" element={<TimeLine />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/:id" element={<NotificationDetail />} />
          <Route path="/diary-edit" element={<DiaryEdit />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}