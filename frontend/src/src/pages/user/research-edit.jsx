
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 保存済みデータを取得
function getSavedData() {
    try {
        return JSON.parse(
            sessionStorage.getItem('researchData') || 'null'
        );
    } catch (error) {
        return null;
    }
}

export default function ResearchEdit() {
    const navigate = useNavigate();
    const savedData = getSavedData();

    const [title, setTitle] = useState(
        savedData?.title || 'タイトル'
    );

    const [group, setGroup] = useState(
        savedData?.group || 'グループA'
    );

    const [year, setYear] = useState(
        savedData?.year || '2027年度'
    );

    const [category, setCategory] = useState(
        savedData?.category || 'system'
    );

    const [overview, setOverview] = useState(
        savedData?.overview ||
        '卒業研究の内容をここに表示します。研究の目的や、どのような課題を解決するために制作したのかなどを記載します。'
    );

    const [members, setMembers] = useState(
        savedData?.members || [
            '山田花子',
            '山田花子',
            '山田花子',
            '山田花子',
            '山田花子'
        ]
    );

    const [researchContent, setResearchContent] = useState(
        savedData?.researchContent || ''
    );

    const [researchImage, setResearchImage] = useState(
        savedData?.researchImage || ''
    );

    // メンバーの入力内容を変更
    const handleMemberChange = (index, value) => {
        const newMembers = [...members];
        newMembers[index] = value;
        setMembers(newMembers);
    };

    // メンバーを追加
    const addMember = () => {
        setMembers([...members, '']);
    };

    // メンバーを削除
    const removeMember = (index) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    // 画像を選択
    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('画像ファイルを選択してください。');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            setResearchImage(e.target.result);
        };

        reader.readAsDataURL(file);
    };

    // 画像を削除
    const removeImage = () => {
        setResearchImage('');
    };

    // 編集内容を保存
    const handleSubmit = (event) => {
        event.preventDefault();

        const researchData = {
            title,
            group,
            year,
            category,
            overview,
            members,
            researchContent,
            researchImage
        };

        try {
            sessionStorage.setItem(
                'researchData',
                JSON.stringify(researchData)
            );

            alert('卒業研究の内容を保存しました！');

            navigate('/research-detail');
        } catch (error) {
            alert(
                '保存できませんでした。画像のサイズを小さくして再度お試しください。'
            );
        }
    };

    return (
        <main className="main-content flex-grow-1 page-content research-edit-wrapper">
            <div className="content-card">

                {/* 卒研詳細に戻る */}
                <button
                    type="button"
                    onClick={() => navigate('/research-detail')}
                    className="back-link border-0 bg-transparent p-0 mb-3"
                >
                    ← 卒研詳細に戻る
                </button>

                <form onSubmit={handleSubmit}>

                    {/* 研究タイトル */}
                    <div className="form-section">
                        <label className="form-label">
                            研究タイトル
                            <span className="required">必須</span>
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* グループ名 */}
                    <div className="form-section">
                        <label className="form-label">
                            グループ名
                            <span className="required">必須</span>
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                            required
                        />
                    </div>

                    {/* 卒業年度 */}
                    <div className="form-section">
                        <label className="form-label">
                            卒業年度
                            <span className="required">必須</span>
                        </label>

                        <select
                            className="form-select"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option value="2026年度">2026年度</option>
                            <option value="2027年度">2027年度</option>
                            <option value="2028年度">2028年度</option>
                            <option value="2029年度">2029年度</option>
                        </select>
                    </div>

                    {/* カテゴリー */}
                    <div className="form-section">
                        <label className="form-label">
                            カテゴリー
                            <span className="required">必須</span>
                        </label>

                        <select
                            className="form-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="system">研究システム</option>
                            <option value="life">生活・暮らし</option>
                            <option value="other">その他</option>
                        </select>
                    </div>

                    {/* 研究概要 */}
                    <div className="form-section">
                        <label className="form-label">
                            研究概要
                            <span className="required">必須</span>
                        </label>

                        <textarea
                            className="form-control"
                            rows="5"
                            value={overview}
                            onChange={(e) => setOverview(e.target.value)}
                            required
                        />
                    </div>

                    {/* メンバー */}
                    <div className="form-section">
                        <label className="form-label">
                            メンバー
                        </label>

                        {members.map((member, index) => (
                            <div
                                className="d-flex gap-2 member-input"
                                key={index}
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="メンバー名"
                                    value={member}
                                    onChange={(e) =>
                                        handleMemberChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => removeMember(index)}
                                >
                                    削除
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm mt-2"
                            onClick={addMember}
                        >
                            ＋ メンバーを追加
                        </button>

                        <p className="member-note">
                            メンバーの追加・削除ができます。
                        </p>
                    </div>

                    {/* 研究内容・制作物 */}
                    <div className="form-section">
                        <label className="form-label">
                            研究内容・制作物
                        </label>

                        <textarea
                            className="form-control"
                            rows="5"
                            placeholder="研究内容や制作物について入力してください。"
                            value={researchContent}
                            onChange={(e) =>
                                setResearchContent(e.target.value)
                            }
                        />
                    </div>

                    {/* 研究作品の画像 */}
                    <div className="form-section">
                        <label className="form-label">
                            研究作品の画像
                        </label>

                        <div className="image-preview">
                            {researchImage ? (
                                <img
                                    src={researchImage}
                                    alt="研究作品のプレビュー"
                                    className="preview-image"
                                />
                            ) : (
                                <>
                                    <span className="image-preview-icon">
                                        🖼️
                                    </span>
                                    <span>
                                        研究作品の画像を選択してください
                                    </span>
                                </>
                            )}
                        </div>

                        <input
                            type="file"
                            className="form-control mt-3"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {researchImage && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm mt-2"
                                onClick={removeImage}
                            >
                                画像を削除
                            </button>
                        )}

                        <p className="image-note">
                            画像ファイルを選択できます。
                        </p>
                    </div>

                    {/* ボタン */}
                    <div className="d-flex justify-content-end gap-2 mt-4 flex-wrap">

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/research-detail')}
                        >
                            キャンセル
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            変更を保存
                        </button>

                    </div>
                </form>
            </div>
        </main>
    );
}
