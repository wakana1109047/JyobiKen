import { useState } from 'react';
import { Link } from 'react-router-dom';

const INITIAL_ACCOUNTS = [
    { id: 1, name: '山田花子', studentNumber: '4523109' },
    { id: 2, name: '山田花子', studentNumber: '4523110' },
    { id: 3, name: '山田花子', studentNumber: '4523111' },
];

export default function AdminAccounts() {
    const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id) => {
        if (window.confirm('このアカウントを削除しますか？')) {
            setAccounts((prev) => prev.filter((acc) => acc.id !== id));
        }
    };

    const filteredAccounts = accounts.filter((acc) => {
        const target = `${acc.name} ${acc.studentNumber}`.toLowerCase();
        return target.includes(searchTerm.trim().toLowerCase());
    });

    return (
        <main className="main-content">
            <h1 className="page-title">アカウント管理</h1>

            <section className="content-card">
                <label htmlFor="search" className="form-label">アカウント検索</label>
                <input
                    type="search"
                    id="search"
                    className="form-control mb-4"
                    placeholder="氏名・学籍番号で検索"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {filteredAccounts.length > 0 ? (
                    <div>
                        {filteredAccounts.map((acc) => (
                            <div key={acc.id} className="account-row">
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                    <div>
                                        <div className="account-name">{acc.name}</div>
                                        <div className="account-number">学籍番号：{acc.studentNumber}</div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(acc.id)}
                                        >
                                            削除
                                        </button>
                                        <Link to="/admin-account-detail" className="btn btn-outline-primary btn-sm">
                                            詳細 →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-secondary text-center mt-4">
                        該当するアカウントがありません。
                    </p>
                )}
            </section>
        </main>
    );
}