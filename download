import { useState, useRef } from 'react';
import Head from 'next/head';

const CATEGORIES = ['衣類', '日用品', '洗面・入浴用品', '薬・医療用品', '食品・飲料', '書類', 'その他'];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const [userName, setUserName] = useState('');
  const [checkDate, setCheckDate] = useState(today());
  const [checkType, setCheckType] = useState('入所');
  const [staffName, setStaffName] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFiles = (files) => {
    const toAdd = Array.from(files).slice(0, 2 - images.length);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        setImages(prev => [...prev, {
          data,
          base64: data.split(',')[1],
          mediaType: file.type || 'image/jpeg'
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const analyze = async () => {
    setLoading(true);
    setError('');
    setItems(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: images.map(img => ({ base64: img.base64, mediaType: img.mediaType }))
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました');
      setItems(data.items.map((item, i) => ({ ...item, id: i })));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (id, field, value) =>
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  const deleteItem = (id) =>
    setItems(prev => prev.filter(item => item.id !== id));
  const addRow = () =>
    setItems(prev => [...prev, { id: Date.now(), name: '', quantity: '', category: 'その他', note: '' }]);
  const resetAll = () => {
    if (!confirm('リセットしますか？')) return;
    setImages([]); setItems(null); setError('');
    setUserName(''); setCheckDate(today()); setCheckType('入所'); setStaffName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <>
      <Head>
        <title>荷物チェックリスト</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans JP', sans-serif; background: #f5f3ef; color: #2a2a2a; min-height: 100vh; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #3d7a6f !important; background: white !important; }
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .card { box-shadow: none !important; }
        }
      `}</style>

      <header style={{ background: '#3d7a6f', color: 'white', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontSize: 24 }}>🧳</span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>ショートステイ 荷物チェックリスト</div>
          <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>写真を撮る → AI解析 → 編集 → 印刷</div>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 14px 60px' }}>

        {/* 利用者情報 */}
        <div className="card no-print" style={{ background: 'white', borderRadius: 12, padding: 18, marginBottom: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#3d7a6f', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #e8f4f2' }}>👤 利用者情報</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 4 }}>利用者氏名</label>
              <input style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#fafafa' }} value={userName} onChange={e => setUserName(e.target.value)} placeholder="例：山田 花子" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 4 }}>日付</label>
              <input type="date" style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#fafafa' }} value={checkDate} onChange={e => setCheckDate(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 4 }}>区分</label>
              <select style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#fafafa' }} value={checkType} onChange={e => setCheckType(e.target.value)}>
                <option>入所</option><option>退所</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 4 }}>担当者名</label>
              <input style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#fafafa' }} value={staffName} onChange={e => setStaffName(e.target.value)} placeholder="例：川口" />
            </div>
          </div>
        </div>

        {/* 写真アップロード */}
        <div className="card no-print" style={{ background: 'white', borderRadius: 12, padding: 18, marginBottom: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#3d7a6f', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #e8f4f2' }}>📷 荷物の写真（最大2枚）</div>
          {images.length < 2 && (
            <div
              onClick={() => fileRef.current.click()}
              style={{ border: '2px dashed #ddd', borderRadius: 10, padding: '22px 14px', textAlign: 'center', cursor: 'pointer', background: '#fafafa', marginBottom: images.length > 0 ? 12 : 0 }}
            >
              <div style={{ fontSize: 30, marginBottom: 6 }}>📸</div>
              <div style={{ fontSize: 14, color: '#888' }}>タップして写真を選択・撮影</div>
              <div style={{ fontSize: 11, color: '#bbb', marginTop: 3 }}>残り{2 - images.length}枚追加できます</div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
            </div>
          )}
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: 120, height: 90, borderRadius: 8, overflow: 'hidden', background: '#eee' }}>
                  <img src={img.data} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.55)', color: 'white', border: 'none', borderRadius: '50%', width: 22, height: 22, fontSize: 13, cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 解析ボタン */}
        <button
          className="no-print"
          onClick={analyze}
          disabled={images.length === 0 || loading}
          style={{ width: '100%', padding: 14, background: images.length === 0 || loading ? '#aaa' : '#3d7a6f', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: images.length === 0 || loading ? 'not-allowed' : 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {loading ? '⏳ 解析中...' : '✨ AIで荷物を自動判別する'}
        </button>

        {error && (
          <div style={{ background: '#fef2f2', color: '#c0392b', borderRadius: 8, padding: '12px 14px', fontSize: 13, marginBottom: 14 }}>⚠️ {error}</div>
        )}

        {/* 結果テーブル */}
        {items !== null && (
          <div className="card" style={{ background: 'white', borderRadius: 12, padding: 18, boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #eee' }}>
              利用者：<strong>{userName || '（未入力）'}</strong>　{checkType}　{checkDate}　担当：{staffName || '（未入力）'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#3d7a6f' }}>📋 荷物リスト</div>
              <div style={{ fontSize: 12, color: '#888' }}><strong style={{ color: '#333' }}>{items.length}</strong> 品目</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ background: '#e8f4f2', color: '#2c5c53', fontWeight: 700, fontSize: 11, padding: '9px 8px', textAlign: 'left', width: '34%' }}>品目</th>
                    <th style={{ background: '#e8f4f2', color: '#2c5c53', fontWeight: 700, fontSize: 11, padding: '9px 8px', textAlign: 'left', width: '13%' }}>数量</th>
                    <th style={{ background: '#e8f4f2', color: '#2c5c53', fontWeight: 700, fontSize: 11, padding: '9px 8px', textAlign: 'left', width: '19%' }}>カテゴリ</th>
                    <th style={{ background: '#e8f4f2', color: '#2c5c53', fontWeight: 700, fontSize: 11, padding: '9px 8px', textAlign: 'left' }}>備考</th>
                    <th className="no-print" style={{ background: '#e8f4f2', width: 32 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: '6px 7px', borderBottom: '1px solid #f0f0f0' }}>
                        <input style={{ width: '100%', border: '1px solid transparent', borderRadius: 5, padding: '5px 6px', fontSize: 12, fontFamily: 'inherit', background: 'transparent' }} value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} />
                      </td>
                      <td style={{ padding: '6px 7px', borderBottom: '1px solid #f0f0f0' }}>
                        <input style={{ width: '100%', border: '1px solid transparent', borderRadius: 5, padding: '5px 6px', fontSize: 12, fontFamily: 'inherit', background: 'transparent', textAlign: 'center' }} value={item.quantity} onChange={e => updateItem(item.id, 'quantity', e.target.value)} />
                      </td>
                      <td style={{ padding: '6px 7px', borderBottom: '1px solid #f0f0f0' }}>
                        <select style={{ width: '100%', border: '1px solid transparent', borderRadius: 5, padding: '5px 4px', fontSize: 11, fontFamily: 'inherit', background: 'transparent' }} value={item.category} onChange={e => updateItem(item.id, 'category', e.target.value)}>
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '6px 7px', borderBottom: '1px solid #f0f0f0' }}>
                        <input style={{ width: '100%', border: '1px solid transparent', borderRadius: 5, padding: '5px 6px', fontSize: 12, fontFamily: 'inherit', background: 'transparent' }} value={item.note} onChange={e => updateItem(item.id, 'note', e.target.value)} />
                      </td>
                      <td className="no-print" style={{ padding: '6px 7px', borderBottom: '1px solid #f0f0f0' }}>
                        <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 16 }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="no-print" onClick={addRow} style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10, color: '#3d7a6f', background: 'none', border: '1.5px dashed #3d7a6f', borderRadius: 7, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
              ＋ 行を追加
            </button>
            <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              <button onClick={() => window.print()} style={{ padding: 11, background: '#3d7a6f', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>🖨️ 印刷する</button>
              <button onClick={resetAll} style={{ padding: 11, background: '#f0f0f0', color: '#888', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>↺ やり直す</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
