import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DiaryEditModal from '../components/DiaryEditModal';

const INITIAL_RESEARCH_DATA = [
  { id: 1, title: '研究概要', category: '研究システム', year: '2027', group: 'グループA', members: 3, likes: 2, isLiked: false },
  { id: 2, title: 'アプリ制作', category: '生活・便利ツール', year: '2027', group: 'グループB', members: 4, likes: 2, isLiked: false },
  { id: 3, title: 'Webシステム', category: '研究システム', year: '2028', group: 'グループC', members: 3, likes: 1, isLiked: false },
  { id: 4, title: '便利ツール', category: 'その他', year: '2028', group: 'グループD', members: 2, likes: 2, isLiked: false },
];

export default function Home() {
  const [researchList, setResearchList] = useState(INITIAL_RESEARCH_DATA);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの表示状態

  const filteredList = useMemo(() => {
    return researchList.filter((item) => {
      const matchesKeyword = item.title.toLowerCase().includes(keyword.toLowerCase());
      const matchesCategory = category === '' || item.category === category;
      const matchesYear = year === '' || item.year === year;
      return matchesKeyword && matchesCategory && matchesYear;
    });
  }, [researchList, keyword, category, year]);

  const handleLike = (id) => {
    setResearchList((prevList) =>
      prevList.map((item) => {
        if (item.id === id) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likes: isLiked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );
  };

  const handleReset = () => {
    setKeyword('');
    setCategory('');
    setYear('');
  };

  return (
    <main className="main-content">
      <header className="top-header">
        <h1 className="page-title">卒業研究一覧</h1>
        <div className="user-name">👤 ユーザー</div>
      </header>

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
              <button type="submit" className="btn btn-primary w-100">検索</button>
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
              <button type="button" onClick={handleReset} className="btn btn-outline-secondary w-100">
                リセット
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4">
          <div className="form-label mb-2">カテゴリから探す</div>
          <div className="d-flex flex-wrap gap-2">
            {[
              { label: 'すべて', value: '' },
              { label: '研究システム', value: '研究システム' },
              { label: '生活・便利ツール', value: '生活・便利ツール' },
              { label: 'その他', value: 'その他' },
            ].map((btn) => (
              <button
                key={btn.value}
                type="button"
                className={`category-button ${category === btn.value ? 'active' : ''}`}
                onClick={() => setCategory(btn.value)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* 投稿ボタンをクリックでポップアップ表示 */}
        <div className="text-end mt-3">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsModalOpen(true)}
          >
            ＋ 日誌を投稿する
          </button>
        </div>
      </section>

      {filteredList.length > 0 ? (
        <section className="research-grid">
          {filteredList.map((item) => (
            <article key={item.id} className="research-card">
              <div className="research-image">写真</div>
              <div className="research-body">
                <div className="group-name">{item.group}</div>
                <h2 className="research-title">{item.title}</h2>
                <div className="research-info">
                  <span>メンバー {item.members}人</span>
                  <button
                    type="button"
                    className={`action-button btn btn-link text-decoration-none p-0 ${item.isLiked ? 'text-danger fw-bold' : 'text-secondary'}`}
                    onClick={() => handleLike(item.id)}
                  >
                    {item.isLiked ? '♥' : '♡'} いいね {item.likes > 0 && `(${item.likes})`}
                  </button>
                </div>
                <div className="card-actions">
                  <span className="badge text-bg-light">{item.category}</span>
                  <Link to="/research-detail" className="btn btn-primary btn-sm">
                    詳細を見る
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="empty-message mt-3">
          該当する卒業研究がありません。
        </div>
      )}

      {/* モーダル表示 */}
      <DiaryEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        from="research-list"
      />
    </main>
  );
}