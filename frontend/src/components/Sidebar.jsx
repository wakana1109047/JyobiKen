
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Sidebar({ user, onLogout }) {
    const isAdmin = user?.role === 'admin';
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* ハンバーガーボタン */}
            <button
                type="button"
                className="hamburger-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
                aria-expanded={isOpen}
            >
                <span className={isOpen ? 'open' : ''}></span>
                <span className={isOpen ? 'open' : ''}></span>
                <span className={isOpen ? 'open' : ''}></span>
            </button>

            {/* 背景の暗い部分 */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeMenu}
                ></div>
            )}

            {/* サイドバー */}
            <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
                <Link
                    to={isAdmin ? '/admin-home' : '/'}
                    className="logo"
                    onClick={closeMenu}
                >
                    JyobiKen
                </Link>

                <nav className="nav flex-column">
                    {isAdmin ? (
                        <>
                            <NavLink
                                to="/admin-home"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                卒業研究一覧
                            </NavLink>

                            <NavLink
                                to="/admin-accounts"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                アカウント管理
                            </NavLink>

                            <NavLink
                                to="/timeline"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                タイムライン
                            </NavLink>

                            <NavLink
                                to="/notifications"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                通知
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                卒業研究一覧
                            </NavLink>

                            <NavLink
                                to="/mypage"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                マイページ
                            </NavLink>

                            <NavLink
                                to="/timeline"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                タイムライン
                            </NavLink>

                            <NavLink
                                to="/notifications"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                通知
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="logout">
                    <Link
                        to="/login"
                        className="btn btn-outline-secondary btn-sm w-100"
                        onClick={() => {
                            closeMenu();
                            onLogout();
                        }}
                    >
                        ログアウト →
                    </Link>
                </div>
            </aside>
        </>
    );
}
