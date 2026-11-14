# Cheat sheet: writing `ai/<name>/model.mjs`

One page with everything needed to write a model file. Read it together with the template you copy (see [BUILD_STYLES.md](BUILD_STYLES.md)).

## 1. The loop

1. **Picture**: make `ai/<name>/` (short ASCII name) and put the picture at `ai/<name>/ref.png`. A see-through picture should get a white background first.
2. **Numbers before code**: look at the picture and write down the total height (use 24 to 26 blocks), the share of that height taken by head, body and legs, the width and depth of head and body, the list of parts the picture has, and 3 to 6 colors.
3. **Write** `ai/<name>/model.mjs`.
4. **Build**: `node tools/ai/build.mjs <name> > ai/<name>/build_log.txt 2>&1`, then read the first lines of the log and `ai/<name>/zfight.txt`. Do not pipe the build straight into `head`: it stops the build early and old pictures stay. If another build is running, give this one its own port: `BM_PORT=9345 node tools/ai/build.mjs <name>`.
5. **Look**:
   - `compare.png`: the picture on top, the model below (top left front, top right side with the face to the left, bottom left back, bottom right angled). Without a `ref.png` use `look.png`.
   - `anim_1.png`: six frames of the walk. Check that no part comes off or sinks into another.
   - Close-ups: write `ai/<name>/close.json` as `[{ "cube": "<box name>", "dir": [0.05, 0.15, 1], "zoom": 0.42, "name": "front" }]` and the build adds `close.png`.
6. **Fix in rounds**, not one detail at a time. Write down everything you see, then fix it in one edit:
   - round 1: the overall shape and proportions (no small details yet)
   - round 2: the face (position, size and color of eyes and mouth)
   - round 3: small parts, flicker (`zfight.txt` must list nothing) and the walk
7. **Notes from the person**: when they have the model open in the app, each rebuild shows up there by itself and the new blocks appear one by one. They can pause and type a short note. It is saved as `ai/<name>/<name>.notes.json` and printed at the top of the output of your next build (to read it without building: `node tools/ai/notes.mjs ai/<name>/<name>.blockmodel`). Act on every note before you go on, and keep writing to the same `.blockmodel` path so their window keeps following.

## 2. Coordinates and the skeleton

- One block is 0.25 studs. **y is up (feet at 0), +z is the front (the face), x > 0 is the character's left** (it shows on the right in a front picture). Numbers can go down to 0.01.
- A part is one bone. The standard names below are fixed, because `walkAnim` in `tools/ai/walk.mjs` finds parts by name. There is exactly one top part, `body`.

```
body -> neck -> head -> jaw
body -> right shoulder -> right arm -> right hand     (and left)    front legs and bird wings use these names too
body -> right thigh -> right shin -> right foot       (and left)
body -> tail 1 -> tail 2 -> tail 3
```

- Leave out the bones of parts the character does not have. Keep a short neck even when the picture shows none (it may hide under the head): it is the bone that turns the head.
- Something that moves as one piece (ears, a crest, a decoration on the back) gets its own part: `part('ears', { parent: head, pivot: [x, y, z] })` with the pivot where it attaches.
- **Box names are unique across the whole model** (a repeated name is an error). For left and right use `L + 'name'`, for a row use `'name ' + i`.
- Write in this order: body, legs, tail, arms, neck and head, decorations, and last the thing that stands out most.

## 3. Tools

The short helpers defined at the top of every template (usually all you need):

```js
B(part, name, center, size, color, [rot])                     // a box. B(head, 'skull', [0, 18, 2], [10, 6, 9], C.main)
S(part, name, shape, center, size, color, { rot, axis, flip, turn, tip })   // any other shape (section 4)
bar(part, name, a, b, [width, thickness], color, { extra, tilt, shape, so })   // a bar from point a to point b. extra = overlap added to the length, so = options of the shape
both((s, L) => { ... })                                        // runs once per side. s = -1 then +1, L = 'right ' then 'left ' (use s * number for x)
paste(part, name, x, y, w, h, color, k)                        // a thin box on the face plane. k = layer (0 is the lowest, each step is 0.1 further forward)
```

The tools of `K` they are built on (the full list is in `tools/ai/build.mjs`):

```js
K.part(name, { parent, pivot: [x, y, z], rot: [x, y, z] })     // a part = one bone. Returns the name. The first part, 'body', already exists
K.shape(part, name, shape, center, size, color, { rot, axis, flip, turn, tip })   // by center and size (rot turns it around its own center)
K.box(part, name, from, to, color, { rot, origin, shape, axis, flip, turn, tip }) // by two corners
K.mirror(part, name, from, to, color, o)                       // K.box mirrored left to right (x -> -x)
K.bar(part, name, p0, p1, [w, t], color, { extra: 1, tilt })   // a bar (its length snaps to whole blocks; the template's bar does not)
K.spike(part, name, p0, p1, [w, t], [tipW, tipT], color, { segs: 3 })   // a bar that gets thinner (claws, fangs)
K.fill(boxName, face, color)                                   // one whole face of a box. face = '+x' '-x' '+y' '-y' '+z' '-z'
K.paintRect(boxName, face, [x, y, z], [x, y, z], color)        // a rectangle of cells on a face, in model coordinates
K.pattern(color, 'pads')    // Roblox-style studs on that color (skin colors only). Call it after every box is placed
K.glow(color, 1)            // make that color glow
walkAnim(K)                 // a 2 second walk. Call it last (import { walkAnim } from '../../tools/ai/walk.mjs')
```

## 4. Shapes (eleven, all with corners; there are no round shapes)

`box` `bevel` (a box with cut corners) `wedge` `corner` `pyramid` `taper` (thinner at one end) `tri` (triangular prism) `diamond` `hex` `octa` (octagonal prism) `gem` (pointed at both ends)

- `axis` = the axis the shape's "up" points along (0 = x, 1 = y, 2 = z). pyramid, taper, wedge and corner start at 1 (tip up). tri, diamond, hex and octa start at 2 (they show their outline from the front).
- `flip: true` turns it upside down. `tip` = thickness of the thin end of a taper (0.05 to 0.95, starts at 0.6). `turn: 1` to `3` turns it 90 degrees at a time around its up axis.
- Pointing forward: `'taper', { axis: 2, tip: 0.3 }` (add `flip` for backward). A tooth pointing down: `'taper', { flip: true }`.
- wedge: by default high at the back and sloping down to the front. `turn: 2` = high at the front, `turn: 1` = high at -x, `turn: 3` = high at +x.
- octa with `axis: 1` is an octagon seen from above (stack slabs of it for an egg shape). With `axis: 2` it is an octagon seen from the front (round eyes, fluffy cheeks). hex with `axis: 0` is a plate pointed front and back (feathers, leaves).
- Triangles per shape: pyramid, corner 6 / wedge, tri, gem 8 / box, taper, diamond 12 / hex 20 / octa 28 / bevel 44.

## 5. Which way rotations go (degrees, order ZYX)

- **Around x, positive**: the front (+z) goes down; the top leans forward. Negative leans back.
- **Around y, positive**: the front (+z) turns toward the character's left (+x).
- **Around z, positive**: the +x end goes up. For left and right parts multiply by `s`: lower the outer end (sloping shoulders, drooping things) with `[0, 0, -s * angle]`, raise it (angry eyebrows) with `[0, 0, s * angle]`.
- Around x the two sides use the same number. Around y and z they are opposite (`s *`).
- Animation keys: `rot` is added to the resting angle (degrees), `pos` is in blocks.

## 6. Avoiding flicker

Flicker (z-fighting) happens when **two faces of different colors point the same way and lie on the same plane (within 0.04) and overlap**. Faces that look at each other do not flicker.

- A box that pushes into the body (thigh, shoulder, neck) takes **the same color as the body**. Then aligned faces do not matter.
- When boxes of different colors overlap, make their width or height differ by 0.2 or more.
- Things pasted on a face step 0.1 forward per layer (`paste` with k: eye 0, pupil 1, shine 2). A box stacked on another sits 0.1 inside the lower one's edge.
- Boxes that are only turned around x still share their x faces: change the width, or twist one a little with `tilt`.
- When `zfight.txt` lists a pair, move one of the two boxes 0.1 to 0.2 along the face named there (such as `y+`).

## 7. Common parts

Variable names are the guide lines defined in the templates: `HF` = the face plane, `jy` = the mouth line, `y3` = top of the head, `hz` = center of the head front to back, `HW` = half the width of the head, `y0` = bottom of the body, `bz` = center of the body front to back.
In `template_bird` read `jy` as `by`. In `template_round` read `head` as `body`, `HF` as `F` and `y3` as `y1`. Change the numbers to match the picture.

```js
// Front eyes: white, then pupil, then shine. An angry brow is a slanted box.
both((s, L) => {
  paste(head, L + 'eye', s * 2.5, eyeY, 2.2, 2.4, C.eye, 0);
  paste(head, L + 'pupil', s * 2.3, eyeY - 0.2, 1.2, 1.4, C.pupil, 1);
  B(head, L + 'brow', [s * 2.5, eyeY + 1.7, HF + 0.3], [2.8, 0.6, 0.5], C.dark, [0, 0, s * 14]);
});
// Side eyes: on the side faces of the head.
both((s, L) => { B(head, L + 'eye', [s * (HW + 0.1), eyeY, hz + 1], [0.4, 2.2, 2.2], C.eye); B(head, L + 'pupil', [s * (HW + 0.2), eyeY, hz + 1.2], [0.4, 1.2, 1.2], C.pupil); });
// Round eyes or cheeks: an octagon seen from the front.
both((s, L) => S(head, L + 'cheek', 'octa', [s * 4, jy + 1.2, HF + 0.05], [1.6, 1.6, 0.3], '#f2a2c2', { axis: 2 }));
// Teeth: upper teeth belong to the head (pointing down, showing below the mouth line), lower teeth to the jaw. Fangs: K.spike.
[-1.8, 0, 1.8].forEach((x, i) => S(head, 'upper tooth ' + i, 'taper', [x, jy - 0.4, HF - 0.05], [1.2, 1.2, 0.7], C.tooth, { flip: true, tip: 0.5 }));
// Ears: pointed ears are pyramids leaning out a little; drooping ears are tall boxes turned around z.
both((s, L) => S(head, L + 'ear', 'pyramid', [s * 3.4, y3 + 1.1, hz - 1], [2.2, 2.6, 1.4], C.dark, { rot: [0, 0, -s * 10] }));
both((s, L) => B(head, L + 'drooping ear', [s * (HW + 0.9), y3 - 2.2, hz - 1], [1.0, 4.0, 2.4], C.dark, [0, 0, s * 12]));
// Horns and claws: tapered bars. Tufts of hair, a mane, spikes: a row of pyramid bars (alternate the color, vary the tilt).
both((s, L) => bar(head, L + 'horn', [s * 2, y3 - 0.3, hz], [s * 3.2, y3 + 3, hz - 0.6], [1.2, 1.2], C.light, { shape: 'taper', so: { axis: 1, tip: 0.15 } }));
[-2, 0, 2].forEach((x, i) => bar(head, 'tuft ' + i, [x, y3 - 0.4, hz - 2], [x * 1.3, y3 + 2.2, hz - 2.8], [2.2, 1.8], i % 2 ? C.dark : C.light, { shape: 'pyramid', tilt: i * 8 - 8 }));
// Stripes: thin boxes 0.1 out from the surface, 0.4 narrower than the body. A whole face in one color: K.fill('torso', '-y', color).
[0.3, 0.55, 0.8].forEach((k, i) => B(body, 'back stripe ' + i, [0, y0 + D.body.h * k, bz - D.body.d / 2 - 0.1], [D.body.w - 0.4, 1.0, 0.4], C.dark));
// The character's own animation, after walkAnim: wind up, strike, return. Move the whole body, not one small part.
const ops = [{ op: 'anim', name: 'roar', length: 2, loop: true, smooth: true }];
for (const [t, r] of [[0, 0], [0.6, -14], [1.0, 10], [2, 0]]) ops.push({ op: 'key', anim: 'roar', part: 'head', t, rot: [r, 0, 0] });
const res = K.BM.applyOps(K.P, ops); if (res.errors.length) throw new Error(res.errors.join(' / '));
```

- Tail: one part per segment, as in the templates. To make only the tip pointed, give the last bar `{ shape: 'taper', so: { axis: 1, tip: 0.3 } }`. A decoration on the tip belongs to the last tail part.
- Wings: folded wings are in `template_bird`. For wide open wings build each wing as one flat plane: a thick bone along the top edge and rows of feather boxes all pointing the same way. Do not twist the feathers; keep the base narrow.
- Round things: stack octagonal slabs (the `slab` helper in `template_bird`), or put a taper above and below a box (`template_round`).

## 8. Rules that keep models looking right

- Shapes with corners only. **Do not add what the picture does not have** (outlines, brows, white dots, spikes, claws, teeth).
- Split parts the way the picture does (one box in the picture stays one box). Read colors from the picture and make them **a little deeper**; pale colors look washed out.
- **Do not put a big box on top of the head like a lid.** The head is one box down to the mouth line. Nothing on it should stick out past the face to the front, sides or back.
- **Sloping shoulders slope down at the outer end** (left side negative z rotation, right side positive).
- The eyes matter most. Zoom into the picture's eyes and copy their shape, color and the place of the pupil. A face made of three boxes is too plain.
- Wings are not a fan of sticks, and their plates should not point in different directions.
- Where many small parts sit side by side, put a dark base under them so the inside does not show through the gaps. Things like a white belly sit 0.1 outside the surface (do not sink them in).
- Use `bevel` sparingly: it costs 3.7 times the triangles of a box.
- Fix left and right parts together. For anything that moves, look at `anim_1.png` before calling it done.

## 9. Choosing a template

- `ai/template_biped`: stands on two legs, with a head and a body that read as separate (for a chibi build make `head` bigger and `leg.h` smaller).
- `ai/template_quadruped`: stands on four legs, with a body that is long front to back (flat face: set `snout.d` to 0; no ears: set `ear.h` to 0).
- `ai/template_bird`: has a beak and wings, and thin legs.
- `ai/template_round`: head and body are one lump and the face sits on the body (if the head reads as separate, use the biped with a thicker `body`).
