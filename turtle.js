// turtle.js — minimal Python-turtle compatible graphics on Canvas
// API: forward/backward/left/right/setheading/penup/pendown/goto/setpos/setx/sety/home/
//      circle/dot/color/pencolor/fillcolor/pensize/width/begin_fill/end_fill/
//      bgcolor/write/hideturtle/speed/tracer/position
// Turtle coords: x right, y UP, heading 0 = east (like Python turtle).

const TURTLE_COLORS = {
  'dark blue': '#00008b', 'dark violet': '#9400d3', 'dark red': '#8b0000',
  'dark orange': '#ff8c00', 'dark grey': '#a9a9a9', 'dark gray': '#a9a9a9',
  'light blue': '#add8e6', 'sky blue': '#87ceeb', 'light green': '#90ee90'
};
function normColor(c) {
  if (typeof c !== 'string') return c;
  const k = c.trim().toLowerCase();
  return TURTLE_COLORS[k] || c;
}
function rgbStr(c) {
  if (typeof c === 'string') return normColor(c);
  const r = Math.round(c[0] * 255), g = Math.round(c[1] * 255), b = Math.round(c[2] * 255);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
// Python colorsys.hsv_to_rgb equivalent (h wraps mod 1, like CPython's i=i%6)
function hsvToRgb(h, s, v) {
  h = ((h % 1) + 1) % 1;
  const i = Math.floor(h * 6), f = h * 6 - i;
  const p = v * (1 - s), q = v * (1 - s * f), t = v * (1 - s * (1 - f));
  switch (i % 6) {
    case 0: return [v, t, p];
    case 1: return [q, v, p];
    case 2: return [p, v, t];
    case 3: return [p, q, v];
    case 4: return [t, p, v];
    default: return [v, p, q];
  }
}

class Turtle {
  // opts: scale (turtle-units -> px), ox/oy (turtle coords placed at canvas center offset)
  constructor(canvasId, opts) {
    opts = opts || {};
    this.cv = document.getElementById(canvasId);
    this.ctx = this.cv.getContext('2d');
    this.scale = opts.scale || 1;
    this.ox = opts.ox || 0;
    this.oy = opts.oy || 0;
    this.reset();
  }
  reset() {
    this.x = 0; this.y = 0; this.heading = 0;
    this.pen = true; this.penc = '#000000'; this.fillc = '#000000'; this.lw = 1;
    this.filling = false; this.fpts = [];
  }
  clear() { this.ctx.clearRect(0, 0, this.cv.width, this.cv.height); this.reset(); }
  bgcolor(c) { this.cv.style.background = rgbStr(c); }
  _X(x) { return this.cv.width / 2 + (x + this.ox) * this.scale; }
  _Y(y) { return this.cv.height / 2 - (y + this.oy) * this.scale; }
  _seg(x1, y1, x2, y2) {
    if (this.filling) this.fpts.push([x2, y2]);
    if (!this.pen) return;
    const c = this.ctx;
    c.strokeStyle = rgbStr(this.penc);
    c.lineWidth = Math.max(0.6, this.lw * this.scale);
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(this._X(x1), this._Y(y1));
    c.lineTo(this._X(x2), this._Y(y2));
    c.stroke();
  }
  forward(d) {
    const r = this.heading * Math.PI / 180;
    const nx = this.x + d * Math.cos(r), ny = this.y + d * Math.sin(r);
    this._seg(this.x, this.y, nx, ny);
    this.x = nx; this.y = ny;
  }
  backward(d) { this.forward(-d); }
  fd(d) { this.forward(d); } bk(d) { this.backward(d); }
  left(a) { this.heading = (((this.heading + a) % 360) + 360) % 360; }
  right(a) { this.left(-a); }
  lt(a) { this.left(a); } rt(a) { this.right(a); }
  setheading(a) { this.heading = (((a % 360) + 360) % 360); }
  seth(a) { this.setheading(a); }
  penup() { this.pen = false; } pendown() { this.pen = true; }
  pu() { this.penup(); } pd() { this.pendown(); }
  up() { this.penup(); } down() { this.pendown(); }
  goto(x, y) { this._seg(this.x, this.y, x, y); this.x = x; this.y = y; }
  setpos(x, y) { this.goto(x, y); }
  setposition(x, y) { this.goto(x, y); }
  setx(x) { this.goto(x, this.y); }
  sety(y) { this.goto(this.x, y); }
  home() { this.goto(0, 0); this.setheading(0); }
  position() { return [this.x, this.y]; }
  pos() { return this.position(); }
  // circle(radius, extent): center is |radius| units to the LEFT when radius>0
  circle(radius, extent) {
    extent = (extent === undefined) ? 360 : extent;
    const R = Math.abs(radius), dir = radius >= 0 ? 1 : -1;
    const hr = this.heading * Math.PI / 180;
    const cx = this.x + R * Math.cos(hr + dir * Math.PI / 2);
    const cy = this.y + R * Math.sin(hr + dir * Math.PI / 2);
    const a0 = Math.atan2(this.y - cy, this.x - cx);
    const sweep = extent * Math.PI / 180 * dir;
    const steps = Math.max(16, Math.ceil(Math.abs(sweep) * R / 8));
    for (let i = 1; i <= steps; i++) {
      const a = a0 + sweep * i / steps;
      const px = cx + R * Math.cos(a), py = cy + R * Math.sin(a);
      this._seg(this.x, this.y, px, py);
      this.x = px; this.y = py;
    }
    this.heading = (((this.heading + extent * dir) % 360) + 360) % 360;
  }
  dot(size, color) {
    size = size === undefined ? 4 : size;
    const c = this.ctx;
    c.fillStyle = color ? rgbStr(color) : rgbStr(this.penc);
    c.beginPath();
    c.arc(this._X(this.x), this._Y(this.y), Math.max(1, size / 2 * this.scale), 0, 7);
    c.fill();
    if (this.filling) this.fpts.push([this.x, this.y]);
  }
  color(p, f) {
    if (p !== undefined) { this.penc = normColor(p); this.fillc = normColor(p); }
    if (f !== undefined) this.fillc = normColor(f);
  }
  pencolor(c) { if (c === undefined) return this.penc; this.penc = normColor(c); }
  fillcolor(c) { if (c === undefined) return this.fillc; this.fillc = normColor(c); }
  pensize(w) { this.lw = w; }
  width(w) { this.pensize(w); }
  begin_fill() { this.filling = true; this.fpts = [[this.x, this.y]]; }
  end_fill() {
    this.filling = false;
    if (this.fpts.length > 2) {
      const c = this.ctx;
      c.fillStyle = rgbStr(this.fillc);
      c.beginPath();
      c.moveTo(this._X(this.fpts[0][0]), this._Y(this.fpts[0][1]));
      for (let i = 1; i < this.fpts.length; i++)
        c.lineTo(this._X(this.fpts[i][0]), this._Y(this.fpts[i][1]));
      c.closePath(); c.fill();
    }
    this.fpts = [];
  }
  write(txt, font) {
    const c = this.ctx;
    c.fillStyle = rgbStr(this.penc);
    c.font = font || '24px sans-serif';
    c.textAlign = 'center';
    c.fillText(txt, this._X(this.x), this._Y(this.y));
  }
  hideturtle() {} ht() {}
  speed() {} tracer() {}
  shape() {} title() {}
}
