import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DiaryEditModal from "../../components/DiaryEditModal";

const INITIAL_BOOKMARKS = [
    {
        id: 1,
        title: '研究概要',
        group: 'グループA',
        description: '卒業研究のシステム設計とプロトタイプ開発',
        category: '研究システム',
    },
    {
        id: 2,
        title: 'アプリ制作',
        group: 'グループB',
        description: '日常のスケジュールを管理する便利ツール',
        category: '生活・便利ツール',
    },
];

export default function MyPage({ user }) {
    const isAdmin = user?.role === 'admin';

    // 管理者は最初から 'bookmarks'、一般ユーザーは 'posts' を初期タブにする
    const [activeTab, setActiveTab] = useState(isAdmin ? 'bookmarks' : 'posts');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookmarks, setBookmarks] = useState(INITIAL_BOOKMARKS);

    // 権限が切り替わった際にも適切なタブに合わせる
    useEffect(() => {
        setActiveTab(isAdmin ? 'bookmarks' : 'posts');
    }, [isAdmin]);

    const handleRemoveBookmark = (id) => {
        setBookmarks((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <main className="main-content flex-grow-1 page-content">
            <h1 className="page-title">マイページ</h1>

            {/* プロフィールカード */}
            <section className="content-card">
                <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="profile-icon">👤</div>

                    <div className="flex-grow-1">
                        <h2 className="profile-name mb-1">
                            {user?.name || '山田太郎'}
                            {isAdmin && (
                                <span className="badge bg-secondary ms-2 fs-6 align-middle">
                                    管理者
                                </span>
                            )}
                        </h2>
                        <p className="profile-info mb-0">
                            {isAdmin ? (
                                <>権限：管理者アカウント</>
                            ) : (
                                <>
                                    学籍番号：123456<br />
                                    所属：2027年度
                                </>
                            )}
                        </p>
                    </div>

                    <Link to="/profile-edit" className="btn btn-outline-primary btn-sm profile-edit">
                        プロフィール編集
                    </Link>
                </div>
            </section>

            {/* 一覧カード */}
            <section className="content-card">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                    <div className="d-flex flex-wrap">
                        {/* 一般ユーザーの時だけ「投稿一覧」タブを表示 */}
                        {!isAdmin && (
                            <button
                                type="button"
                                className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
                                onClick={() => setActiveTab('posts')}
                            >
                                投稿一覧
                            </button>
                        )}

                        <button
                            type="button"
                            className={`tab-button ${activeTab === 'bookmarks' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bookmarks')}
                        >
                            ブックマーク一覧
                        </button>
                    </div>

                    {/* 一般ユーザー かつ 投稿一覧タブの時だけ「＋ 投稿する」ボタンを表示 */}
                    {!isAdmin && activeTab === 'posts' && (
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setIsModalOpen(true)}
                        >
                            ＋ 投稿する
                        </button>
                    )}
                </div>

                {/* ================= 投稿一覧（一般ユーザーのみ） ================= */}
                {!isAdmin && activeTab === 'posts' && (
                    <div className="row g-3">
                        <div className="col-12 col-sm-6">
                            <article className="border rounded-3 p-3 h-100">
                                <div className="post-image">写真</div>
                                <h3 className="post-title">グループ名</h3>
                                <p className="post-description mb-2">卒業研究の活動記録</p>
                                <span className="tag">アプリ</span>
                                <span className="tag">活動記録</span>
                            </article>
                        </div>

                        <div className="col-12 col-sm-6">
                            <article className="border rounded-3 p-3 h-100">
                                <div className="post-image">写真</div>
                                <h3 className="post-title">グループ名</h3>
                                <p className="post-description mb-2">制作の進捗を記録</p>
                                <span className="tag">制作</span>
                                <span className="tag">日誌</span>
                            </article>
                        </div>
                    </div>
                )}

                {/* ================= ブックマーク一覧（一般・管理者共通） ================= */}
                {activeTab === 'bookmarks' && (
                    bookmarks.length > 0 ? (
                        <div className="row g-3">
                            {bookmarks.map((item) => (
                                <div key={item.id} className="col-12 col-sm-6">
                                    <article className="border rounded-3 p-3 h-100 d-flex flex-column">
                                        <div className="post-image">写真</div>
                                        <div className="text-secondary small mb-1">{item.group}</div>
                                        <h3 className="post-title">{item.title}</h3>
                                        <p className="post-description mb-3 flex-grow-1">
                                            {item.description}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <span className="badge text-bg-light">{item.category}</span>
                                            <div className="d-flex gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => handleRemoveBookmark(item.id)}
                                                >
                                                    解除
                                                </button>
                                                <Link
                                                    to={isAdmin ? '/admin-research-detail?from=mypage' : '/research-detail?from=mypage'}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    詳細
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-secondary text-center py-4 mb-0">
                            ブックマークした卒業研究はありません。
                        </p>
                    )
                )}
            </section>
            {/* モーダル表示（一般ユーザー用） */}
            {!isAdmin && (
                <DiaryEditModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    from="mypage"
                />
            )}
        </main>
    );
}