// HTML to Figma — main plugin thread.
// Receives a scene-graph JSON (produced by ui.html's DOM walker) and rebuilds it
// as real Figma nodes: Frames (with Auto Layout where the source used flexbox),
// Text (with per-run rich styling), and Image fills — grouped to mirror the
// original DOM hierarchy, with repeated siblings (cards, list items, etc.)
// wrapped in a labelled Section instead of being flattened.

figma.showUI(__html__, { width: 380, height: 560 });

var fontCache = {}; // "family|style" -> boolean loaded ok
var FALLBACK_FAMILY = 'Inter';

var WEIGHT_NAMES = {
  100: 'Thin', 200: 'Extra Light', 300: 'Light', 400: 'Regular',
  500: 'Medium', 600: 'Semi Bold', 700: 'Bold', 800: 'Extra Bold', 900: 'Black'
};

function styleNameForWeight(weight, italic) {
  var base = WEIGHT_NAMES[nearestWeight(weight)] || 'Regular';
  if (italic) return base === 'Regular' ? 'Italic' : base + ' Italic';
  return base;
}

function nearestWeight(w) {
  var keys = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  var best = 400, bestDiff = Infinity;
  keys.forEach(function (k) {
    var diff = Math.abs(k - w);
    if (diff < bestDiff) { bestDiff = diff; best = k; }
  });
  return best;
}

function log(message) {
  figma.ui.postMessage({ type: 'log', message: message });
}

function decodeBase64(base64) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var lookup = {};
  for (var i = 0; i < chars.length; i++) lookup[chars[i]] = i;
  var clean = base64.replace(/[\r\n]/g, '');
  var padding = 0;
  if (clean.endsWith('==')) padding = 2;
  else if (clean.endsWith('=')) padding = 1;
  var byteLength = Math.floor(clean.length / 4) * 3 - padding;
  var bytes = new Uint8Array(byteLength);
  var p = 0;
  for (var j = 0; j < clean.length; j += 4) {
    var a = lookup[clean[j]] || 0;
    var b = lookup[clean[j + 1]] || 0;
    var c = lookup[clean[j + 2]] || 0;
    var d = lookup[clean[j + 3]] || 0;
    var chunk = (a << 18) | (b << 12) | (c << 6) | d;
    if (p < byteLength) bytes[p++] = (chunk >> 16) & 0xff;
    if (p < byteLength) bytes[p++] = (chunk >> 8) & 0xff;
    if (p < byteLength) bytes[p++] = chunk & 0xff;
  }
  return bytes;
}

// ---- font loading ----

async function ensureFont(family, weight, italic) {
  var style = styleNameForWeight(weight, italic);
  var key = family + '|' + style;
  if (fontCache[key] === true) return { family: family, style: style };
  if (fontCache[key] === false) return fallbackFont(weight, italic);
  try {
    await figma.loadFontAsync({ family: family, style: style });
    fontCache[key] = true;
    return { family: family, style: style };
  } catch (e) {
    fontCache[key] = false;
    return fallbackFont(weight, italic);
  }
}

async function fallbackFont(weight, italic) {
  var style = styleNameForWeight(weight, italic);
  var key = FALLBACK_FAMILY + '|' + style;
  if (fontCache[key] !== true) {
    try {
      await figma.loadFontAsync({ family: FALLBACK_FAMILY, style: style });
      fontCache[key] = true;
    } catch (e) {
      await figma.loadFontAsync({ family: FALLBACK_FAMILY, style: 'Regular' });
      fontCache[FALLBACK_FAMILY + '|Regular'] = true;
      return { family: FALLBACK_FAMILY, style: 'Regular' };
    }
  }
  return { family: FALLBACK_FAMILY, style: style };
}

async function resolveFontForRun(style) {
  var families = style.fontFamilies || [];
  for (var i = 0; i < families.length; i++) {
    var fam = families[i];
    if (/generic|serif|sans-serif|monospace|cursive|fantasy|system-ui/i.test(fam)) continue;
    var resolved = await ensureFont(fam, style.fontWeight, style.italic);
    if (resolved) return resolved;
  }
  return fallbackFont(style.fontWeight, style.italic);
}

// ---- paint conversion ----

function toRGB(color) { return { r: color.r, g: color.g, b: color.b }; }

function gradientTransformFromAngle(angleDeg) {
  var figmaAngle = angleDeg - 90;
  var rad = (figmaAngle * Math.PI) / 180;
  var cos = Math.cos(rad), sin = Math.sin(rad);
  return [
    [cos, -sin, 0.5 - 0.5 * cos + 0.5 * sin],
    [sin, cos, 0.5 - 0.5 * sin - 0.5 * cos]
  ];
}

function buildPaints(fillsData, imageCache) {
  var paints = [];
  (fillsData || []).forEach(function (f) {
    if (f._drop) return;
    if (f.type === 'SOLID') {
      paints.push({ type: 'SOLID', color: toRGB(f.color), opacity: f.opacity != null ? f.opacity : 1 });
    } else if (f.type === 'GRADIENT') {
      paints.push({
        type: 'GRADIENT_LINEAR',
        gradientTransform: gradientTransformFromAngle(f.angleDeg),
        gradientStops: f.stops.map(function (s) {
          return { position: s.position, color: { r: s.color.r, g: s.color.g, b: s.color.b, a: s.color.a != null ? s.color.a : 1 } };
        })
      });
    } else if (f.type === 'IMAGE' && f.base64) {
      var key = f.base64.slice(0, 64) + f.base64.length;
      var image = imageCache[key];
      if (!image) {
        image = figma.createImage(decodeBase64(f.base64));
        imageCache[key] = image;
      }
      paints.push({ type: 'IMAGE', imageHash: image.hash, scaleMode: f.scaleMode || 'FILL' });
    }
  });
  return paints;
}

function applyCorner(node, corner) {
  if (!corner) return;
  var uniform = corner.tl === corner.tr && corner.tr === corner.br && corner.br === corner.bl;
  if (uniform) {
    if ('cornerRadius' in node) node.cornerRadius = corner.tl;
    return;
  }
  if ('topLeftRadius' in node) {
    node.topLeftRadius = corner.tl;
    node.topRightRadius = corner.tr;
    node.bottomRightRadius = corner.br;
    node.bottomLeftRadius = corner.bl;
  } else if ('cornerRadius' in node) {
    node.cornerRadius = Math.max(corner.tl, corner.tr, corner.br, corner.bl);
  }
}

function applyStrokes(node, strokeData) {
  if (!strokeData) return;
  var sides = ['top', 'right', 'bottom', 'left'];
  var present = sides.filter(function (s) { return strokeData[s]; });
  if (!present.length) return;
  var first = strokeData[present[0]];
  var uniform = present.length === 4 && sides.every(function (s) {
    return strokeData[s] && strokeData[s].width === first.width &&
      colorsEqual(strokeData[s].color, first.color);
  });
  node.strokes = [{ type: 'SOLID', color: toRGB(first.color), opacity: first.color.a != null ? first.color.a : 1 }];
  if (uniform) {
    node.strokeWeight = first.width;
    node.strokeAlign = 'INSIDE';
    return;
  }
  node.strokeAlign = 'INSIDE';
  try {
    node.strokeTopWeight = strokeData.top ? strokeData.top.width : 0;
    node.strokeRightWeight = strokeData.right ? strokeData.right.width : 0;
    node.strokeBottomWeight = strokeData.bottom ? strokeData.bottom.width : 0;
    node.strokeLeftWeight = strokeData.left ? strokeData.left.width : 0;
  } catch (e) {
    node.strokeWeight = Math.max.apply(null, present.map(function (s) { return strokeData[s].width; }));
  }
}

function colorsEqual(a, b) {
  return a && b && Math.abs(a.r - b.r) < 0.002 && Math.abs(a.g - b.g) < 0.002 &&
    Math.abs(a.b - b.b) < 0.002 && Math.abs((a.a || 1) - (b.a || 1)) < 0.002;
}

function applyEffects(node, shadows) {
  if (!shadows || !shadows.length) return;
  var effects = shadows.map(function (s) {
    return {
      type: s.inset ? 'INNER_SHADOW' : 'DROP_SHADOW',
      color: { r: s.color.r, g: s.color.g, b: s.color.b, a: s.color.a != null ? s.color.a : 1 },
      offset: { x: s.offsetX, y: s.offsetY },
      radius: s.blur,
      spread: s.spread,
      visible: true,
      blendMode: 'NORMAL'
    };
  });
  if ('effects' in node) node.effects = effects;
}

function mapAlign(cssJustify) {
  if (!cssJustify) return 'MIN';
  if (cssJustify.indexOf('center') > -1) return 'CENTER';
  if (cssJustify.indexOf('end') > -1 || cssJustify.indexOf('flex-end') > -1) return 'MAX';
  if (cssJustify.indexOf('between') > -1) return 'SPACE_BETWEEN';
  return 'MIN';
}

function mapCrossAlign(cssAlign) {
  if (!cssAlign) return 'MIN';
  if (cssAlign.indexOf('center') > -1) return 'CENTER';
  if (cssAlign.indexOf('end') > -1 || cssAlign.indexOf('flex-end') > -1) return 'MAX';
  if (cssAlign.indexOf('stretch') > -1) return 'MIN'; // sizing handled via explicit widths instead
  return 'MIN';
}

var imageCache = {};

async function applyCommon(node, data) {
  node.name = data.name || node.name;
  if (typeof data.opacity === 'number') node.opacity = data.opacity;
  if (data.rotation) { try { node.rotation = data.rotation; } catch (e) {} }
  if (data.clipsContent && 'clipsContent' in node) node.clipsContent = true;
  applyCorner(node, data.corner);
  applyStrokes(node, data.strokes);
  applyEffects(node, data.effects);
  var paints = buildPaints(data.fills, imageCache);
  if ('fills' in node) node.fills = paints.length ? paints : [];
}

async function buildTextNode(data, parentAbsX, parentAbsY) {
  var textNode = figma.createText();
  var runs = (data.text.runs && data.text.runs.length) ? data.text.runs : [{ start: 0, end: data.text.characters.length, style: {} }];

  var fonts = [];
  for (var i = 0; i < runs.length; i++) {
    fonts.push(await resolveFontForRun(runs[i].style || {}));
  }
  textNode.fontName = fonts[0] || { family: FALLBACK_FAMILY, style: 'Regular' };
  textNode.characters = data.text.characters;

  for (var j = 0; j < runs.length; j++) {
    var run = runs[j];
    var st = run.style || {};
    var font = fonts[j];
    try {
      textNode.setRangeFontName(run.start, run.end, font);
      if (st.fontSize) textNode.setRangeFontSize(run.start, run.end, st.fontSize);
      if (st.color) textNode.setRangeFills(run.start, run.end, [{ type: 'SOLID', color: toRGB(st.color), opacity: st.color.a != null ? st.color.a : 1 }]);
      if (st.letterSpacing != null) textNode.setRangeLetterSpacing(run.start, run.end, { value: st.letterSpacing, unit: 'PIXELS' });
      if (st.lineHeight) textNode.setRangeLineHeight(run.start, run.end, { value: st.lineHeight, unit: 'PIXELS' });
      if (st.underline) textNode.setRangeTextDecoration(run.start, run.end, 'UNDERLINE');
      else if (st.strikethrough) textNode.setRangeTextDecoration(run.start, run.end, 'STRIKETHROUGH');
    } catch (e) { /* keep going even if one range fails */ }
  }

  textNode.textAutoResize = 'NONE';
  textNode.resize(Math.max(data.width, 1), Math.max(data.height, 1));
  var align = data.text.align;
  textNode.textAlignHorizontal = align === 'center' ? 'CENTER' : align === 'right' ? 'RIGHT' : align === 'justify' ? 'JUSTIFIED' : 'LEFT';
  textNode.textAlignVertical = 'TOP';
  textNode.x = data.x - parentAbsX;
  textNode.y = data.y - parentAbsY;
  await applyCommon(textNode, data);
  return textNode;
}

async function buildImageNode(data, parentAbsX, parentAbsY) {
  var rect = figma.createRectangle();
  rect.resize(Math.max(data.width, 1), Math.max(data.height, 1));
  rect.x = data.x - parentAbsX;
  rect.y = data.y - parentAbsY;
  await applyCommon(rect, data);
  return rect;
}

function configureAutoLayout(frame, flexData) {
  frame.layoutMode = flexData.direction;
  frame.primaryAxisSizingMode = 'FIXED';
  frame.counterAxisSizingMode = 'FIXED';
  frame.layoutWrap = flexData.wrap ? 'WRAP' : 'NO_WRAP';
  frame.itemSpacing = flexData.direction === 'HORIZONTAL' ? flexData.gap : flexData.rowGap;
  frame.paddingTop = flexData.padding.top;
  frame.paddingRight = flexData.padding.right;
  frame.paddingBottom = flexData.padding.bottom;
  frame.paddingLeft = flexData.padding.left;
  frame.primaryAxisAlignItems = mapAlign(flexData.justify);
  frame.counterAxisAlignItems = mapCrossAlign(flexData.align);
}

async function buildFrameNode(data, parentAbsX, parentAbsY, meta) {
  var frame = figma.createFrame();
  frame.resize(Math.max(data.width, 1), Math.max(data.height, 1));
  frame.x = data.x - parentAbsX;
  frame.y = data.y - parentAbsY;
  await applyCommon(frame, data);

  await buildChildren(frame, data.children, data.x, data.y, meta);

  if (meta.useAutoLayout && data.flex) {
    try { configureAutoLayout(frame, data.flex); } catch (e) { log('Auto Layout skipped for ' + data.name + ': ' + e.message); }
  }
  return frame;
}

async function buildNode(data, parentAbsX, parentAbsY, meta) {
  try {
    if (data.type === 'TEXT') return await buildTextNode(data, parentAbsX, parentAbsY);
    if (data.type === 'IMAGE') return await buildImageNode(data, parentAbsX, parentAbsY);
    return await buildFrameNode(data, parentAbsX, parentAbsY, meta);
  } catch (e) {
    log('Skipped "' + (data.name || data.tag) + '": ' + e.message);
    return null;
  }
}

async function buildChildren(parentFigmaNode, childrenData, parentAbsX, parentAbsY, meta) {
  if (!childrenData || !childrenData.length) return;

  var i = 0;
  var createdCount = 0;
  while (i < childrenData.length) {
    var child = childrenData[i];
    if (meta.groupRepeats && child.repeatGroup && child.repeatGroup.index === 0) {
      var groupId = child.repeatGroup.id;
      var runItems = [child];
      var j = i + 1;
      while (j < childrenData.length && childrenData[j].repeatGroup && childrenData[j].repeatGroup.id === groupId) {
        runItems.push(childrenData[j]);
        j++;
      }
      var groupNodes = [];
      for (var k = 0; k < runItems.length; k++) {
        var built = await buildNode(runItems[k], parentAbsX, parentAbsY, meta);
        if (built) { parentFigmaNode.appendChild(built); groupNodes.push(built); createdCount++; }
      }
      wrapInSection(parentFigmaNode, groupNodes, runItems.length);
      i = j;
    } else {
      var node = await buildNode(child, parentAbsX, parentAbsY, meta);
      if (node) { parentFigmaNode.appendChild(node); createdCount++; }
      i++;
    }
  }
  return createdCount;
}

function wrapInSection(parentFigmaNode, groupNodes, count) {
  if (!groupNodes.length) return;
  if (typeof figma.createSection !== 'function') return;
  try {
    var minX = Math.min.apply(null, groupNodes.map(function (n) { return n.x; }));
    var minY = Math.min.apply(null, groupNodes.map(function (n) { return n.y; }));
    var maxX = Math.max.apply(null, groupNodes.map(function (n) { return n.x + n.width; }));
    var maxY = Math.max.apply(null, groupNodes.map(function (n) { return n.y + n.height; }));
    var pad = 8;
    var sectionX = minX - pad, sectionY = minY - pad;
    var section = figma.createSection();
    section.name = 'Repeated group · ' + count + ' items';
    section.x = sectionX;
    section.y = sectionY;
    section.resizeWithoutConstraints(maxX - minX + pad * 2, maxY - minY + pad * 2);
    parentFigmaNode.insertChild(parentFigmaNode.children.indexOf(groupNodes[0]), section);
    // appendChild keeps each node's numeric x/y but reinterprets them relative to
    // the new parent's origin — re-offset so their on-canvas position is unchanged.
    groupNodes.forEach(function (n) {
      var absX = n.x, absY = n.y;
      section.appendChild(n);
      n.x = absX - sectionX;
      n.y = absY - sectionY;
    });
  } catch (e) { /* sections unsupported in this Figma version — skip silently */ }
}

// ---- entry point ----

figma.ui.onmessage = async function (msg) {
  if (msg.type !== 'scene-graph') return;
  try {
    await figma.loadFontAsync({ family: FALLBACK_FAMILY, style: 'Regular' });
    fontCache[FALLBACK_FAMILY + '|Regular'] = true;

    var root = msg.root;
    var meta = msg.meta;
    imageCache = {};

    log('Building Figma nodes...');
    var rootFrame = figma.createFrame();
    rootFrame.name = meta.title || 'HTML Import';
    rootFrame.resize(Math.max(root.width, 1), Math.max(root.height, 1));
    rootFrame.x = figma.viewport.center.x - root.width / 2;
    rootFrame.y = figma.viewport.center.y - root.height / 2;
    await applyCommon(rootFrame, root);
    if (!root.fills || !root.fills.length) rootFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    figma.currentPage.appendChild(rootFrame);

    var count = 1 + (await buildChildren(rootFrame, root.children, root.x, root.y, meta) || 0);

    if (meta.useAutoLayout && root.flex) {
      try { configureAutoLayout(rootFrame, root.flex); } catch (e) {}
    }

    figma.currentPage.selection = [rootFrame];
    figma.viewport.scrollAndZoomIntoView([rootFrame]);
    figma.ui.postMessage({ type: 'done', count: count });
  } catch (e) {
    figma.ui.postMessage({ type: 'error', message: e.message || String(e) });
  }
};
