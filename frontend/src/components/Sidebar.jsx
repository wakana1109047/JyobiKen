import { NavLink, Link } from 'react-router-dom';

export default function Sidebar({ user, onLogout }) {
    // URLではなくログインユーザーの権限(role)で判定
    const isAdmin = user?.role === 'admin';

    return (
        <aside className="sidebar">
            <Link to={isAdmin ? '/admin-home' : '/'} className="logo">
                JyobiKen
            </Link>

            <nav className="nav flex-column">
                {isAdmin ? (
                    <>
                        <NavLink to="/admin-home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            卒業研究一覧
                        </NavLink>
                        <NavLink to="/admin-accounts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            アカウント管理
                        </NavLink>
                        <NavLink to="/timeline" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            タイムライン
                        </NavLink>
                        <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            通知
                        </NavLink>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </nav>

            <div className="logout">
                <Link
                    to="/login"
                    className="btn btn-outline-secondary btn-sm w-100"
                    onClick={onLogout}
                >
                    ログアウト →
                </Link>
            </div>
        </aside>
    );
}