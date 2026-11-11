import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ResearchDetail() {
    const navigate = useNavigate();

    // メンバーデータの例（動的に表示可能）
    const members = [
        '山田花子',
        '山田花子',
        '山田花子',
        '山田花子',
        '山田花子'
    ];

    return (
        <div className="layout">
            {/* サイドバー */}
            <aside className="sidebar">
                <Link to="/" className="logo">
                    JyobiKen
                </Link>

                <nav className="nav flex-column">
                    <Link to="/research-list" className="nav-link active">
                        卒業研究一覧
                    </Link>
                    <Link to="/mypage" className="nav-link">
                        マイページ
                    </Link>
                    <Link to="/timeline" className="nav-link">
                        タイムライン
                    </Link>
                    <Link to="/notifications" className="nav-link">
                        通知
                    </Link>
                </nav>

                <div className="logout">
                    <Link to="/login" className="btn btn-outline-secondary btn-sm w-100">
                        ログアウト →
                    </Link>
                </div>
            </aside>

            {/* 詳細画面メインコンテンツ */}
            <main className="main-content">
                <div className="content-card">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="back-link border-0 bg-transparent p-0 mb-3"
                    >
                        ← 戻る
                    </button>

                    <div className="research-image">
                        画像など
                    </div>

                    <h1 className="research-title mb-2">
                        タイトル
                    </h1>

                    <p className="text-secondary small mb-4">
                        グループA 2027年度卒業研究
                    </p>

                    {/* 研究概要 */}
                    <div className="mb-4">
                        <h2 className="section-label">
                            研究概要
                        </h2>
                        <div className="border rounded-2 p-3">
                            卒業研究の内容をここに表示します。
                        </div>
                    </div>

                    {/* メンバー */}
                    <div className="mb-4">
                        <h2 className="section-label">
                            メンバー
                        </h2>
                        <div className="member-list">
                            {members.map((member, index) => (
                                <span key={index} className="member">
                                    👤 {member}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 研究内容 */}
                    <div className="research-description">
                        研究内容・画像など
                    </div>

                    {/* ボタンエリア */}
                    <div className="d-flex justify-content-end gap-2 mt-4 flex-wrap">
                        <Link to="/research-list" className="btn btn-outline-secondary">
                            一覧に戻る
                        </Link>
                        <Link to="#" className="btn btn-primary">
                            編集する
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}