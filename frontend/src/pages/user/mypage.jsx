import { useState } from 'react';
import { Link } from 'react-router-dom';
import DiaryEditModal from "../../components/DiaryEditModal";
export default function MyPage() {
    const [activeTab, setActiveTab] = useState('posts');
    const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの状態

    return (
        <main className="main-content">
            <h1 className="page-title">マイページ</h1>

            <section className="content-card">
                <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="profile-icon">👤</div>

                    <div className="flex-grow-1">
                        <h2 className="profile-name mb-1">山田太郎</h2>
                        <p className="profile-info mb-0">
                            学籍番号：123456<br />
                            所属：2027年度
                        </p>
                    </div>

                    <Link to="/profile-edit" className="btn btn-outline-primary btn-sm profile-edit">
                        プロフィール編集
                    </Link>
                </div>
            </section>

            <section className="content-card">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                    <div className="d-flex flex-wrap">
                        <button
                            type="button"
                            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            投稿一覧
                        </button>

                        <button
                            type="button"
                            className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                            onClick={() => setActiveTab('favorites')}
                        >
                            お気に入り一覧
                        </button>
                    </div>

                    {/* 投稿一覧（posts）の時だけ「＋ 投稿する」ボタンを表示 */}
                    {activeTab === 'posts' && (
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setIsModalOpen(true)}
                        >
                            ＋ 投稿する
                        </button>
                    )}
                </div>

                {activeTab === 'posts' && (
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

                {activeTab === 'favorites' && (
                    <div className="row g-3">
                        <div className="col-12 col-sm-6">
                            <article className="border rounded-3 p-3 h-100">
                                <div className="post-image">写真</div>
                                <h3 className="post-title">お気に入りの研究</h3>
                                <p className="post-description mb-0">保存した卒業研究</p>
                            </article>
                        </div>
                    </div>
                )}
            </section>

            {/* モーダル表示 */}
            <DiaryEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                from="mypage"
            />
        </main>
    );
}