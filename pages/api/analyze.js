export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { images } = req.body;
  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: '画像が指定されていません' });
  }

  const parts = images.map(({ base64, mediaType }) => ({
    inline_data: { mime_type: mediaType, data: base64 }
  }));

  parts.push({
    text: `この写真はショートステイ（短期入所介護）の利用者の荷物を撮影したものです。
写真に写っているすべての荷物・持ち物をリストアップしてください。

以下のJSON形式のみで返してください（説明文・マークダウン・コードブロック不要）:
{"items":[{"name":"品目名","quantity":"数量","category":"カテゴリ","note":"備考"}]}

ルール:
- カテゴリは必ず次から選ぶ: 衣類／日用品／洗面・入浴用品／薬・医療用品／食品・飲料／書類／その他
- 数量が不明なら「不明」
- 識別困難なもの（色・柄など）は note に「要確認」と記入
- 同種のものは1行にまとめる`
  });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const msg = data.error?.message || JSON.stringify(data);
      return res.status(response.status).json({ error: 'Gemini APIエラー: ' + msg });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'AIの返答からJSONを取得できませんでした: ' + text.slice(0, 200) });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ items: parsed.items || [] });

  } catch (err) {
    return res.status(500).json({ error: 'サーバーエラー: ' + err.message });
  }
}
