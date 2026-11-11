import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const initialDiaries = [
    {
        id: 1,
        author: 'mine',
        userName: '山田太郎',
        date: '2026年10月27日',
        title: '活動記録',
        text: '今日の卒業研究では、アプリの画面設計を進めました。',
        searchKeywords: '活動記録 研究 制作',
        likes: 3,
        isLiked: false,
        showComments: false,
        comments: [
            { id: 101, userName: '佐藤花子', text: '画面設計お疲れ様です！進捗順調ですね。', date: '2026年10月27日' }
        ],
    },
    {
        id: 2,
        author: 'other',
        userName: '佐藤花子',
        date: '2026年10月26日',
        title: '画面設計',
        text: '画面のデザインをチームで相談しました。',
        searchKeywords: '画面設計 デザイン',
        likes: 5,
        isLiked: false,
        showComments: false,
        comments: [],
    },
    {
        id: 3,
        author: 'other',
        userName: '鈴木花子',
        date: '2026年10月25日',
        title: '進捗報告',
        text: 'プログラムの実装を少しずつ進めています。',
        searchKeywords: '進捗 報告 プログラム',
        likes: 0,
        isLiked: false,
        showComments: false,
        comments: [],
    },
];

export default function Timeline() {
    const [diaries, setDiaries] = useState(initialDiaries);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeKeyword, setActiveKeyword] = useState('');
    const [filter, setFilter] = useState('all');
    const [commentInputs, setCommentInputs] = useState({});

    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const targetId = location.hash.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('border-primary', 'shadow-sm');
                setTimeout(() => {
                    element.classList.remove('border-primary', 'shadow-sm');
                }, 2000);
            }
        }
    }, [location]);

    const handleSearch = () => {
        setActiveKeyword(searchQuery.trim().toLowerCase());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleToggleLike = (id) => {
        setDiaries((prevDiaries) =>
            prevDiaries.map((diary) => {
                if (diary.id === id) {
                    const isLiked = !diary.isLiked;
                    return {
                        ...diary,
                        isLiked,
                        likes: isLiked ? diary.likes + 1 : diary.likes - 1,
                    };
                }
                return diary;
            })
        );
    };

    const handleToggleComments = (id) => {
        setDiaries((prevDiaries) =>
            prevDiaries.map((diary) => {
                if (diary.id === id) {
                    return { ...diary, showComments: !diary.showComments };
                }
                return diary;
            })
        );
    };

    const handleCommentInputChange = (id, value) => {
        setCommentInputs((prev) => ({ ...prev, [id]: value }));
    };

    const handleAddComment = (id) => {
        const text = commentInputs[id]?.trim();
        if (!text) return;

        const newComment = {
            id: Date.now(),
            userName: '自分（ログインユーザー）',
            text: text,
            date: '2026年10月28日',
        };

        setDiaries((prevDiaries) =>
            prevDiaries.map((diary) => {
                if (diary.id === id) {
                    return {
                        ...diary,
                        comments: [...diary.comments, newComment],
                    };
                }
                return diary;
            })
        );

        setCommentInputs((prev) => ({ ...prev, [id]: '' }));
    };

    const filteredDiaries = diaries.filter((diary) => {
        const contentText = `${diary.title} ${diary.text} ${diary.userName} ${diary.searchKeywords}`.toLowerCase();
        const matchesKeyword = activeKeyword === '' || contentText.includes(activeKeyword);
        const matchesFilter = filter === 'all' || diary.author === filter;

        return matchesKeyword && matchesFilter;
    });

    return (
        <main className="main-content flex-grow-1 p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <h1 className="page-title mb-0">タイムライン</h1>
            </div>

            <section className="content-card p-3 mb-4">
                <div className="row g-2 mb-3">
                    <div className="col-12 col-md-8">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="⌕ キーワードを検索"
                            aria-label="日誌を検索"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={handleSearch}
                        >
                            検索
                        </button>
                    </div>
                </div>

                <div className="d-flex gap-2 flex-wrap">
                    <button
                        type="button"
                        className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        全て
                    </button>
                    <button
                        type="button"
                        className={`filter-button ${filter === 'mine' ? 'active' : ''}`}
                        onClick={() => setFilter('mine')}
                    >
                        自分
                    </button>
                </div>
            </section>

            <section>
                {filteredDiaries.map((diary) => (
                    <article
                        key={diary.id}
                        id={`post-${diary.id}`}
                        className="content-card diary-card mb-3 p-3 transition-all"
                    >
                        <div className="d-flex align-items-center gap-3">
                            <div className="avatar">👤</div>
                            <div>
                                <div className="user-name">{diary.userName}</div>
                                <div className="post-date text-muted small">{diary.date}</div>
                            </div>
                        </div>

                        <h2 className="diary-title h5 mt-3">{diary.title}</h2>
                        <p className="diary-text mb-0">{diary.text}</p>

                        <div className="post-actions d-flex gap-3 mt-3 pt-2 border-top">
                            <button
                                type="button"
                                className={`action-button btn btn-link text-decoration-none p-0 ${diary.isLiked ? 'text-danger fw-bold' : 'text-secondary'
                                    }`}
                                onClick={() => handleToggleLike(diary.id)}
                            >
                                {diary.isLiked ? '♥' : '♡'} いいね {diary.likes > 0 && `(${diary.likes})`}
                            </button>

                            <button
                                type="button"
                                className="action-button btn btn-link text-decoration-none text-secondary p-0"
                                onClick={() => handleToggleComments(diary.id)}
                            >
                                💬 コメント {diary.comments.length > 0 && `(${diary.comments.length})`}
                            </button>
                        </div>

                        {diary.showComments && (
                            <div className="mt-3 pt-3 border-top bg-light p-3 rounded">
                                {diary.comments.length > 0 ? (
                                    <div className="mb-3">
                                        {diary.comments.map((comment) => (
                                            <div key={comment.id} className="mb-2 pb-2 border-bottom">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="fw-bold small">{comment.userName}</span>
                                                    <span className="text-muted extra-small" style={{ fontSize: '11px' }}>
                                                        {comment.date}
                                                    </span>
                                                </div>
                                                <p className="mb-0 small text-secondary mt-1">{comment.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted small mb-3">まだコメントはありません。</p>
                                )}

                                <div className="d-flex gap-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="コメントを入力..."
                                        value={commentInputs[diary.id] || ''}
                                        onChange={(e) => handleCommentInputChange(diary.id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddComment(diary.id);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm flex-shrink-0"
                                        onClick={() => handleAddComment(diary.id)}
                                    >
                                        送信
                                    </button>
                                </div>
                            </div>
                        )}
                    </article>
                ))}
            </section>

            {filteredDiaries.length === 0 && (
                <p className="text-center text-secondary py-4">
                    該当する日誌がありません。
                </p>
            )}
        </main>
    );
}