# Three ways to build a model from a picture

There are three build styles. They trade time for finish. In the app's **Build with AI** window a person first puts in pictures of what they want (they become the app's *reference pictures*), then picks a style; the app copies a request such as "Look at the reference pictures in BlockModeler (get_references) … Build style: Fast". When a request names a style, follow that section. When it names none, use **Careful**.

| Style | How it works | Time (rough guide) | What you get |
|---|---|---|---|
| **Fast** | Copy a template and change its sizes and colors | about 10 minutes | The quickest result. The head and body stay boxy |
| **Standard** | Lay a grid over the picture, measure, then build from the numbers | about 17 minutes | Proportions that follow the picture |
| **Careful** | Build straight from the picture, part by part, over several rounds | about 21 minutes | The most detailed result, with slanted and octagonal blocks |

The times come from building one test picture once in each style with the same AI, with the kit's build script (the second way below). Treat them as a rough guide: they change with the picture, with the AI and with the way you work.

## Where the picture is, and how you build

There are two ways to work. Each style below has steps for both.

- **With the app connected**: you have the `blockmodeler` MCP tools (`get_model`, `get_references`, `edit_model` …). The pictures are in the app. Call `get_references` and look at them; do not ask the person to send a picture or to save one as a file. Then start with `new_model` and `"keep_references": true` (without it the pictures of an opened file stay behind), build with `edit_model`, and check with `screenshot` and `compare_reference`, which puts a picture next to your model seen from the same side. Use only the block shapes `get_model` lists under "Block shapes" (the person chooses them in the app), keep "flicker" at 0, and put the same `task` text on every call of the request. Save or export only when the person asks.
- **In the kit folder**: you have no MCP tools and work with files. The picture goes to `ai/<name>/ref.png`. If the request speaks of reference pictures, they are in the folder `<model name>.refs` next to the person's saved `.blockmodel`: ask for that path, or for the picture. You write `ai/<name>/model.mjs` and run `node tools/ai/build.mjs <name>`. The work ends with the files from that script, no faces listed in `zfight.txt`, and the pictures shown to the person (see "Making a model" in the instructions file at the top of the kit). The writing rules, tools and shapes are in [CHEATSHEET.md](CHEATSHEET.md).

## Fast

Use it when the person wants a model quickly, or wants many models.

**With the app connected**

1. `get_references`: look at every picture once. Note the main parts, their rough proportions and three to five colors.
2. `new_model` (`"keep_references": true`), then build the whole thing in two or three `edit_model` calls: body and head as a few big blocks, then arms, legs and tail, then the face. Plain boxes, few tilts, about 30 to 60 blocks.
3. One `screenshot` (view "four") and one `compare_reference` with the main picture. Fix the biggest differences once, bring flicker to 0, and stop.

Tell the person plainly that this style leaves the head and body boxy, and that Careful gives a finer result.

**In the kit folder**

1. Put the picture at `ai/<name>/ref.png`.
2. Pick the template that matches the character (CHEATSHEET section 9): `template_biped`, `template_quadruped`, `template_bird` or `template_round`.
3. Copy it: `cp ai/template_<kind>/model.mjs ai/<name>/model.mjs`.
4. Change the sizes in `D` and the colors in `C` to match the picture. Rewrite the face. Add the character's own features where the template marks the place.
5. Build and look (CHEATSHEET section 1). Fix in **at most three rounds**: overall shape, then the face, then small parts, flicker and the walk.

Keep it fast: do not restructure the template, and do not read other long files first. Tell the person plainly that this style leaves the head and body boxy, and that Careful gives a finer result.

## Standard

Use it when the proportions of the picture must carry over.

**With the app connected**

1. `get_references`. Measure before building, from the straight-on pictures (front, side) when there are any: take the character's height as about 24 cells and write down, for each part, its left, right, bottom and top edge in cells, and its width and height. Depths come from the side picture; with one picture only, estimate them and say so.
2. If the pose is tilted (a leaning head, a raised leg), measure it as drawn, then straighten it: the model stands upright, and left and right use the average of the two sides.
3. `new_model` (`"keep_references": true`), then build from the numbers, one `edit_model` call per body area.
4. `compare_reference` for each picture that has a direction. Fix proportions first, then the face, then details: one or two rounds per direction.

**In the kit folder**

1. Put the picture at `ai/<name>/ref.png`.
2. Decide the scale. Take the character's height in pixels and divide by 24: that is `P`, the pixels per block. Pick the origin: `OX` = the x pixel of the middle of the body, `OY` = the y pixel of the ground under the feet.
3. Draw the grid (thin lines every block, yellow lines every 5 blocks, red lines through the origin):

   ```
   P=35; OX=560; OY=935
   ffmpeg -y -loglevel error -i ai/<name>/ref.png -vf "drawgrid=x=$((OX % P)):y=$((OY % P)):w=$P:h=$P:t=1:c=white@0.35,drawgrid=x=$((OX % (P*5))):y=$((OY % (P*5))):w=$((P*5)):h=$((P*5)):t=2:c=yellow@0.9,drawbox=x=$OX:y=0:w=2:h=ih:c=red:t=fill,drawbox=x=0:y=$OY:w=iw:h=2:c=red:t=fill" ai/<name>/ref_grid.png
   ```

4. Read `ref_grid.png` and write `ai/<name>/measure.md`. A pixel `(px, py)` is at `x = (px - OX) / P` and `y = (OY - py) / P` blocks. The right side of the picture is +x, the character's left.
   - One table of **measured** things: for each part its left, right, bottom and top edge in blocks, its width and height, and the number the model will use.
   - One table of **estimated** things a single picture cannot give: depths, and true widths when the picture is drawn from an angle. Write how each was estimated.
   - If the pose is tilted (a leaning head, a raised leg), measure it as drawn, then straighten it: the model stands upright, and left and right use the average of the two sides.
5. Write `ai/<name>/model.mjs` from the numbers in `measure.md`. Read `ai/tosappi/model.mjs` as the example.
6. Build and compare from the same angle as the picture. Fix in rounds. The test model took six builds.

## Careful

Use it when the finish matters most. This is the default.

**With the app connected**

1. `get_references`. Study the pictures before building: the list of parts, the colors, and what makes this character itself. Look at the eyes first.
2. `new_model` (`"keep_references": true`), then build part by part: body, head, face, limbs, details. Where the picture is round or pointed, use tilted blocks and the other shapes instead of one plain box, within the shapes `get_model` allows.
3. `screenshot` (view "four") and `compare_reference` for each picture that has a direction. Fix in rounds until the model reads as the picture from every side: overall shape, then the face, then details.
4. Make sure flicker is 0. Add a walk only when the person asks.

**In the kit folder**

1. Put the picture at `ai/<name>/ref.png`.
2. Study the picture before writing: the list of parts, the colors, and what makes this character itself. Zoom into the eyes first.
3. Write `ai/<name>/model.mjs` from scratch, part by part (CHEATSHEET section 2 gives the order). Where the picture is round or pointed, use slanted blocks and the other shapes (`octa`, `taper`, `hex`, `pyramid`) instead of one plain box.
4. Build and look at `compare.png`. For the face and other small areas, add close-ups with `close.json`.
5. Fix in rounds until the model reads as the picture from every side: overall shape, then the face, then details. The test model took six builds.
6. Check `anim_1.png` for the walk and make sure `zfight.txt` lists nothing.
