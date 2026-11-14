# 私の使い方 / How I use it

私はコードを書きません。作りたいものを Claude Code に言葉で伝えて、できた物を見て直してもらい、細かい所だけ自分の手で触ります。

I do not write code. I tell Claude Code what I want in plain words, look at the result, ask for changes, and touch up the small details by hand.

![The picture on top and the finished model below](example_kaiju.png)

上が元の絵、下が Claude とこのツールで組んだモデルです。The picture is on top, and the model built with Claude and this tool is below.

## 流れ

1. **絵を用意する**：作りたいキャラの絵を `ai/<名前>/ref.png` に置きます。絵がなければ、Claude に頼んで fal.ai で描いてもらいます。
2. **Claude に頼む**：たとえば次のように伝えます。

   > ai/mychar/ref.png の絵を見て、グループに分けて組んでください。歩く動きも付けてください。

   アプリの右上の **AI と つくる** からも頼めます。まず作りたい物の絵を入れます（絵をドラッグするか「ファイルを 選ぶ」）。絵が入ると、組み方を 3 つから選べます（はやい 約 10 分／ふつう 約 17 分／ていねい 約 21 分。同じ絵から組んだ見本つき。時間は めやすです）。選んで「AI に たのむ文を コピー」を押し、Claude に貼りつけます。入れた絵は「参考の絵」としてアプリに残り、下の「アプリと直接つなぐ（MCP）」でつないだ Claude がアプリから読むので、絵を別に渡す必要はありません。はやい は 大きなブロックで手早く組むので、頭と体が四角く残ります。それぞれの手順は [BUILD_STYLES.md](BUILD_STYLES.md) にあります。

3. **絵と見くらべる**：Claude が `ai/<名前>/compare.png` を作ります。上が元の絵、下が作ったモデルです。

   モデルをアプリで開いたままにしておくと、Claude が組み直すたびに、開き直さなくても新しい形が出ます。増えたブロックは順に出て、3D の下に帯が出ます。帯の「止める」で止めて、「AI に ひとこと」に気づいた事を書いて「送る」を押すと、Claude の次の組み立てで伝わります。自分で直している途中の窓は、勝手に置きかわりません（帯に「読みこむ」が出ます）。
4. **言葉で直す**：気になった所を、そのまま伝えます。私が実際に頼んだのは、たとえばこんな言葉です。

   - 角を丸めなくていいよ
   - グループごとに分けて、あとで動かせるようにして
   - 体にだけ、Roblox の床のような凹凸を付けて
   - 元の絵からだいぶ変わったので、絵に忠実にして

   言葉で「どこ」を伝えにくい時は、アプリの **赤ペン** を使います。直してほしい所を なぞって 赤くぬり（色が付くのは なぞった所だけです。ブロックの一部だけでも、いくつかのブロックにまたがっても ぬれます）、「もっと大きく」のように書いて 保存すると、モデルのとなりに `<名前>.redpen.json` ができます。Claude に「赤ペン見て」と言えば、どのブロックの どの面の どのあたりかまで読んで直します。ぬった赤は 目じるしだけで、モデルの色は変わりません。回しても ぬった所に付いたままです。
5. **自分で仕上げる**：アプリの「開く」で `ai/<名前>/<名前>.blockmodel` を開き、形や色、グループの親子を自分で調整します。Claude が ななめに置いたブロックからも「つなぐ」（C）でまっすぐのばし、R で曲げられます。「保存」（Ctrl+S）は開いたファイルに上書きします。手で直したあとに Claude に頼む時は、保存してから頼みます。Claude はいちばん新しいファイルから直します。
6. **Roblox に入れる**：アプリの「Roblox へ書き出す」で作った `.fbx` を、Studio の「3D をインポート」で入れます。アプリで手直ししない時は、Claude が作った `ai/<名前>/<名前>.fbx` をそのまま入れられます。`.glb` は GLB ビューアや Blender で見る用です。

## アプリと直接つなぐ（MCP・1.4.0 から）

上の流れのほかに、開いているアプリの中で Claude Code に直接組んでもらうこともできます。Node.js などは要りません。

1. アプリの 3D の右下の「AI とつなぐ（MCP）」を押してオンにします（ふだんはオフ）。
2. 出てきた案内の「1行を コピー」を押し、Claude Code に貼って Enter を押します。はじめの 1 回だけです（アプリのフォルダを動かした時はもう一度）。
3. Claude Code で新しいチャットを始めて、「ブロックモデラーで 赤いドラゴンを作って」のように頼みます。組む様子がアプリに出ます。
4. 作りたい物の絵があれば、先に 3D の上に落とすか Ctrl+V で貼ります（右下の「参考の絵」）。前・横・後ろなどの向きを選んでおくと、Claude はその絵を見て組み、同じ向きで見くらべて直します。絵はモデルのとなりの `<名前>.refs` フォルダに残ります。
5. スイッチの上の「AI が使う形」で、Claude が組む時に使うブロックの形を選べます（形のアイコンを押すたびにオン／オフ。うすい形は使いません）。同じ物でも、選ぶ形でデザインの感じが変わります。自分で置く形はそのままです。

つなぎ口はこの PC の中（127.0.0.1）だけで、スイッチがオフの間は開きません。保存と書き出しは、頼んだ時だけ Claude がします。

## きれいに作るコツ

- **絵をいきなり 3D にしない**：まず AI に「部品ごとのブロックで描きなおして。ばらした図も付けて」と頼みます（`tools/ai/edit_sheet.mjs`・fal.ai の料金がかかります）。部品の分け方が、そのままモデルのグループ分けになります。
- **真横と真正面で測る**：ななめの絵 1 枚から奥行きを当てずっぽうにしません。傾きのない向きの絵で、ます目を数えて組んでもらいます。
- **同じ向きで並べてくらべる**：元の絵とモデルを同じ向きで並べると、ずれがひと目で分かります。
- **直しは赤ペンで**：直してほしい所を ぬって ひと言。どのブロックの どのあたりの話かまで伝わります。
- **光らせる**：目や炎など 光らせたい色は、Claude に「目を光らせて」と頼みます（Claude は `K.glow(色, 強さ)` を使います）。アプリでは 色の欄の ☀ で 光ります。Roblox には 光る所の絵として入ります。

## はじめ方

いちばん早い方法は、AI に任せることです。[Claude Code](https://claude.com/claude-code) などの AI を入れて、空のフォルダで開き、次を貼ります。

```
ブロックモデラーを、絵からモデルを組める状態にしてください。

1. https://github.com/shack8888/BlockModeler-app/releases/latest から Windows アプリの zip をダウンロードして、このフォルダに展開してください（BlockModeler フォルダができます）。
2. BlockModeler/kit の CLAUDE.md を読んで、作り方を確認してください。AI 用の道具は kit フォルダの中です。
3. kit フォルダで 見本の node tools/ai/build.mjs tosappi を動かして、できた look.png を見て、組み立てが動くことを確かめてください。
4. Node.js・Chrome が足りなくて進めない時は、入れ方を教えてください。
5. 終わったら、作りたいキャラの絵をどこに置いて、次に何と頼めばいいかを、短く教えてください。
```

自分で進める時は、次の順番です。

1. **アプリを入れる**：[Releases](https://github.com/shack8888/BlockModeler-app/releases/latest) から Windows アプリの zip をダウンロードして展開し、`BlockModeler.exe` を開きます。インストールは要りません。
2. **道具を3つ入れる**：[Claude Code](https://claude.com/claude-code)、[Node.js](https://nodejs.org/)、[Chrome](https://www.google.com/chrome/) です。
3. **AI 用の一式を開く**：zip を展開した `BlockModeler` フォルダの中に `kit` フォルダがあります。そこで PowerShell を開き（フォルダの何もない所で Shift＋右クリック →「PowerShell ウィンドウをここで開く」）、`claude` と打つと Claude Code が始まります。

4. **Claude に頼む**：「ai/mychar/ref.png の絵を見て、グループに分けて組んでください」のように伝えます。絵は先に `kit` フォルダの中の `ai/mychar/ref.png` に置きます。手順はこのフォルダの `CLAUDE.md` に書いてあるので、Claude はそれを読んで動きます。
5. **アプリで開く**：できた `ai/mychar/mychar.blockmodel` を、アプリの「開く」で開きます。

見本は `ai/tosappi/` です。`node tools/ai/build.mjs tosappi` で同じ物を作れます。見本のキャラクターは作り方を学ぶためのもので、自分のゲームには使えません（[くわしく](../ai/tosappi/LICENSE.md)）。

Codex を使う時は、Claude Code の代わりに Codex を入れてください。このフォルダの `AGENTS.md` から同じ手順を読みます。私はまだ試していません。

Chrome の場所が標準と違う時は、環境変数 `CHROME` に場所を入れてください。

## お金と鍵

- Claude Code の利用には、Anthropic の料金がかかります。
- 絵を fal.ai で描く時だけ、自分の fal.ai の鍵を環境変数 `FAL_KEY` に入れます。料金は fal.ai の利用分です。組み立てだけなら要りません。
- **鍵はファイルに書かないでください。** このリポジトリに鍵は入っていません。

---

## The flow

1. **Prepare a picture**: put it at `ai/<name>/ref.png`. No picture? Ask Claude to draw one with fal.ai.
2. **Ask Claude**, for example:

   > Look at ai/mychar/ref.png and build it in groups. Add a walking animation too.

   You can also ask from **Build with AI** at the top right of the app. First put in a picture of what you want (drag it in, or press "Choose a file"). Once a picture is in, it offers three build styles: Fast (about 10 minutes), Standard (about 17) and Careful (about 21), each shown with the same character built that way. The times are a rough guide. Pick one, press "Copy the request for your AI" and paste it to Claude. The picture stays in the app as a reference picture, and a Claude connected as in "Connect the app directly (MCP)" below reads it from the app, so you do not have to hand the picture over yourself. Fast builds quickly from big blocks, so the head and body stay boxy. The steps of each style are in [BUILD_STYLES.md](BUILD_STYLES.md).

3. **Compare**: Claude makes `ai/<name>/compare.png`, with the picture on top and the model below.

   Keep the model open in the app and each rebuild shows up without reopening: the new blocks appear one by one, and a bar appears under the 3D view. Press "Pause", type what you noticed into "A note for the AI" and press "Send": Claude gets it on its next build. A window you are editing is never replaced by itself; the bar offers "Load" instead.
4. **Ask for changes in plain words**, such as:

   - No need to round the corners
   - Split it into groups so it can move later
   - Put Roblox-style studs on the body only
   - That drifted from the picture, stay faithful to it

   When it is hard to say where in words, use the app's **Red pen**. Drag over the spots you want fixed to paint them red (only where you drag gets the paint: a part of a box, or across several boxes), write something like "make it bigger" and save. It writes `<name>.redpen.json` next to the model. Tell Claude "check the red pen" and it reads each note with the box, the face and the part of it you painted. The red is only a marker: the colours of the model do not change, and it stays where you painted when you turn the view.
5. **Finish by hand**: open `ai/<name>/<name>.blockmodel` with "Open" in the app, then adjust shapes, colors and the group tree. You can extend boxes with "Link" (C) even from the tilted boxes Claude placed, and bend them with R. Save (Ctrl+S) writes back to the file you opened. If you edited by hand, save before asking Claude for more changes, so it works from your newest file.
6. **Put it in Roblox**: export a `.fbx` with "Export to Roblox" and bring it in with Studio's Import 3D. If you did not edit it in the app, `ai/<name>/<name>.fbx` from Claude works directly. The `.glb` is for GLB viewers and Blender.

## Connect the app directly (MCP, from 1.4.0)

Besides the flow above, Claude Code can build right inside the open app. No Node.js needed.

1. Click "Connect AI (MCP)" at the bottom right of the app's 3D view to turn it on (it is off by default).
2. In the panel that appears, press "Copy the line", paste it into Claude Code and press Enter. Only the first time (and again if you move the app's folder).
3. Start a new chat in Claude Code and ask something like "Make a red dragon in BlockModeler". You see it being built in the app.
4. If you have pictures of what you want, drop them onto the 3D view or paste them with Ctrl+V first ("Reference" at the bottom right). Choose their direction (front, side, back…): Claude looks at them while building and compares from the same angle to fix it. The pictures stay in a `<name>.refs` folder next to the model.
5. "Shapes for AI" above the switch lets you choose which block shapes Claude may use when it builds (click a shape icon to switch it on or off; faint ones are not used). The same thing gets a different look depending on the shapes. Shapes you place yourself are not limited.

The connection stays inside this PC (127.0.0.1) and is closed while the switch is off. Claude saves and exports only when you ask.

## Tips for a clean model

- **Do not go from the picture straight to 3D**: first ask an AI to "redraw it with one box per piece, with an exploded view" (`tools/ai/edit_sheet.mjs`, charged by fal.ai). The way it splits the pieces becomes the model's group tree.
- **Measure from straight-on views**: do not guess depth from one angled picture. Have the AI count grid squares on views with no tilt.
- **Compare from the same angle**: put the picture and the model side by side at the same angle, and the differences stand out.
- **Use the red pen for fixes**: a bit of paint and a few words tell the AI exactly which part of which box you mean.
- **Make things glow**: ask Claude to "make the eyes glow" (it uses `K.glow(color, strength)`). In the app, the ☀ button on a color makes it glow. It comes into Roblox as an emissive map.

## Getting started

The fastest way is to let the AI do it. Install an AI such as [Claude Code](https://claude.com/claude-code), open it in an empty folder and paste this:

```
Set up BlockModeler so I can build models from pictures.

1. Download the Windows app zip from https://github.com/shack8888/BlockModeler-app/releases/latest and unzip it into this folder (it makes a BlockModeler folder).
2. Read BlockModeler/kit/CLAUDE.md to learn how models are made. The tools for AI are in the kit folder.
3. In the kit folder, run the sample with node tools/ai/build.mjs tosappi, look at the look.png it makes, and check that building works.
4. If Node.js or Chrome is missing and you cannot continue, tell me how to install it.
5. When you finish, tell me briefly where to put my character's picture and what to ask you next.
```

To do it yourself, follow this order.

1. **Get the app**: download the Windows zip from [Releases](https://github.com/shack8888/BlockModeler-app/releases/latest), unzip it and open `BlockModeler.exe`. There is nothing to install.
2. **Install three tools**: [Claude Code](https://claude.com/claude-code), [Node.js](https://nodejs.org/) and [Chrome](https://www.google.com/chrome/).
3. **Open the AI kit**: the unzipped `BlockModeler` folder contains a `kit` folder. Open PowerShell there (Shift + right-click on an empty spot in the folder, then "Open PowerShell window here") and type `claude` to start Claude Code.

4. **Ask Claude**: for example, "Look at ai/mychar/ref.png and build it in groups." Put the picture at `ai/mychar/ref.png` inside the `kit` folder first. Claude reads the steps from `CLAUDE.md` in this folder.
5. **Open it in the app**: open `ai/mychar/mychar.blockmodel` with "Open" in the app.

The sample is in `ai/tosappi/`. Run `node tools/ai/build.mjs tosappi` to build it. The sample character is there to learn from, and you cannot use it in your own game ([details](../ai/tosappi/LICENSE.md)).

To use Codex, install it instead of Claude Code. It finds the same steps through `AGENTS.md` in this folder. I have not tried this yet.

If Chrome is somewhere else, put its location in the `CHROME` environment variable.

## Costs and keys

- Claude Code is charged by Anthropic.
- Only drawing pictures with fal.ai needs your own fal.ai key, in the `FAL_KEY` environment variable, and is charged by fal.ai. Building a model does not.
- **Never write a key into a file.** No keys are stored in this repository.
