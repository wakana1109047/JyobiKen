import { useState } from 'react';
import { Link } from 'react-router-dom';

const INITIAL_RESEARCHES = [
    { id: 1, title: '研究概要', group: 'グループA', members: 3, likes: 2, category: '研究システム', year: '2027' },
    { id: 2, title: 'アプリ制作', group: 'グループB', members: 4, likes: 2, category: '生活・便利ツール', year: '2027' },
    { id: 3, title: 'Webシステム', group: 'グループC', members: 3, likes: 1, category: '研究システム', year: '2028' },
    { id: 4, title: '便利ツール', group: 'グループD', members: 2, likes: 2, category: 'その他', year: '2028' },
];

export default function AdminHome() {
    const [researches, setResearches] = useState(INITIAL_RESEARCHES);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [year, setYear] = useState('');

    const handleDelete = (id) => {
        if (window.confirm('この卒業研究を一覧から削除しますか？')) {
            setResearches((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const handleReset = () => {
        setKeyword('');
        setCategory('');
        setYear('');
    };

    const filteredResearches = researches.filter((item) => {
        const matchesKeyword = item.title.toLowerCase().includes(keyword.trim().toLowerCase());
        const matchesCategory = category === '' || item.category === category;
        const matchesYear = year === '' || item.year === year;
        return matchesKeyword && matchesCategory && matchesYear;
    });

    return (
        <main className="main-content">
            <header className="top-header">
                <h1 className="page-title">卒業研究一覧</h1>
                <div className="user-name">👤 山田太郎</div>
            </header>

            {/* 検索・絞り込み */}
            <section className="search-card">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="row g-3 align-items-end">
                        <div className="col-12 col-md-5">
                            <label htmlFor="keyword" className="form-label">キーワード検索</label>
                            <input
                                type="search"
                                id="keyword"
                                className="form-control"
                                placeholder="研究タイトルを検索"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <div className="col-12 col-md-4">
                            <label htmlFor="category" className="form-label">カテゴリ</label>
                            <select
                                id="category"
                                className="form-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">すべてのカテゴリ</option>
                                <option value="研究システム">研究システム</option>
                                <option value="生活・便利ツール">生活・便利ツール</option>
                                <option value="その他">その他</option>
                            </select>
                        </div>

                        <div className="col-12 col-md-3">
                            <button type="button" className="btn btn-primary btn-search w-100">検索</button>
                        </div>
                    </div>

                    <div className="row g-3 mt-1 align-items-end">
                        <div className="col-12 col-md-9">
                            <label htmlFor="year" className="form-label">卒業年度</label>
                            <select
                                id="year"
                                className="form-select"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                <option value="">すべての年度</option>
                                <option value="2027">2027年度</option>
                                <option value="2028">2028年度</option>
                                <option value="2029">2029年度</option>
                            </select>
                        </div>

                        <div className="col-12 col-md-3">
                            <button type="button" className="btn btn-outline-secondary w-100" onClick={handleReset}>
                                リセット
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-4">
                    <div className="form-label mb-2">カテゴリから探す</div>
                    <div className="d-flex flex-wrap gap-2">
                        {['', '研究システム', '生活・便利ツール', 'その他'].map((cat) => (
                            <button
                                key={cat || 'all'}
                                type="button"
                                className={`category-button ${category === cat ? 'active' : ''}`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat || 'すべて'}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* 卒研カード一覧 */}
            {filteredResearches.length > 0 ? (
                <section className="research-grid">
                    {filteredResearches.map((item) => (
                        <article key={item.id} className="research-card">
                            <div className="research-image">写真</div>
                            <div className="research-body">
                                <div className="group-name">{item.group}</div>
                                <h2 className="research-title">{item.title}</h2>
                                <div className="research-info">
                                    <span>👤 {item.members}人</span>
                                    <span>♡ {item.likes}</span>
                                </div>
                                <div className="card-actions">
                                    <span className="badge text-bg-light">{item.category}</span>
                                    <div className="action-buttons">
                                        <button
                                            type="button"
                                            className="btn btn-delete btn-sm"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            削除
                                        </button>
                                        <Link to="/admin-research-edit" className="btn btn-edit btn-sm">
                                            編集
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            ) : (
                <div className="empty-message mt-3 d-block">
                    該当する卒業研究がありません。
                </div>
            )}
        </main>
    );
}