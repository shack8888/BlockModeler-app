# Three ways to build a model from a picture

There are three build styles. They trade time for finish. The app's **Build with AI** window lets a person pick one and copies a request that names it, such as "Build style: Fast". When a request names a style, follow that section. When it names none, use **Careful**.

| Style | How it works | Time (rough guide) | What you get |
|---|---|---|---|
| **Fast** | Copy a template and change its sizes and colors | about 10 minutes | The quickest result. The head and body stay boxy |
| **Standard** | Lay a grid over the picture, measure, then build from the numbers | about 17 minutes | Proportions that follow the picture |
| **Careful** | Build straight from the picture, part by part, over several rounds | about 21 minutes | The most detailed result, with slanted and octagonal blocks |

The times come from building one test picture once in each style with the same AI. Treat them as a rough guide: they change with the picture and with the AI.

All three end the same way: the files from `node tools/ai/build.mjs <name>`, no faces listed in `zfight.txt`, and the pictures shown to the person (see "Making a model" in the instructions file at the top of the kit). The writing rules, tools and shapes are in [CHEATSHEET.md](CHEATSHEET.md).

## Fast

Use it when the person wants a model quickly, or wants many models.

1. Put the picture at `ai/<name>/ref.png`.
2. Pick the template that matches the character (CHEATSHEET section 9): `template_biped`, `template_quadruped`, `template_bird` or `template_round`.
3. Copy it: `cp ai/template_<kind>/model.mjs ai/<name>/model.mjs`.
4. Change the sizes in `D` and the colors in `C` to match the picture. Rewrite the face. Add the character's own features where the template marks the place.
5. Build and look (CHEATSHEET section 1). Fix in **at most three rounds**: overall shape, then the face, then small parts, flicker and the walk.

Keep it fast: do not restructure the template, and do not read other long files first. Tell the person plainly that this style leaves the head and body boxy, and that Careful gives a finer result.

## Standard

Use it when the proportions of the picture must carry over.

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

1. Put the picture at `ai/<name>/ref.png`.
2. Study the picture before writing: the list of parts, the colors, and what makes this character itself. Zoom into the eyes first.
3. Write `ai/<name>/model.mjs` from scratch, part by part (CHEATSHEET section 2 gives the order). Where the picture is round or pointed, use slanted blocks and the other shapes (`octa`, `taper`, `hex`, `pyramid`) instead of one plain box.
4. Build and look at `compare.png`. For the face and other small areas, add close-ups with `close.json`.
5. Fix in rounds until the model reads as the picture from every side: overall shape, then the face, then details. The test model took six builds.
6. Check `anim_1.png` for the walk and make sure `zfight.txt` lists nothing.
