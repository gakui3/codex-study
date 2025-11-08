# WebGPU Minimal Demo

ブラウザ単体で動作する最小構成の WebGPU サンプルです。`index.html` を HTTPS で配信して開くだけで、WebGPU で描画した回転キューブと VJ 風エフェクトを体験できます。

## セットアップ

1. WebGPU 対応ブラウザ (Chrome 113+ / Edge 113+) を準備します。
2. ルートで静的サーバーを起動します (例: `npx serve .` や `python3 -m http.server 4173` など)。
3. `https://localhost:4173` など HTTPS でページを開きます。

> WebGPU は HTTPS もしくは `localhost` でのみ有効です。ブラウザのフラグを有効化している場合でも同様です。

## ファイル構成

- `index.html` … Canvas と最小のレイアウト。`src/main.js` を読み込みます。
- `src/main.js` … WebGPU 初期化、キューブジオメトリ、VJ 風エフェクトを実装したレンダリングループです。

必要最低限の構成なので、すべての処理を素の Web API で確認できます。パイプラインやバッファを追加して、複雑なシーンへ発展させてください。

## 操作方法

- マウス移動: キューブの色をライブで変化
- `1` キー: スケールパルス (大きさがうねる)
- `2` キー: カラースウィープ
- `3` キー: 色収差 (Chromatic Aberration)
- `4` キー: モザイク調のブロック化

Codex CLI 動作確認中
