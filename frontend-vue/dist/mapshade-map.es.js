/**
* @vue/shared v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function je(i) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const s of i.split(",")) n[s] = 1;
  return (s) => s in n;
}
const dt = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {}, Di = process.env.NODE_ENV !== "production" ? Object.freeze([]) : [], It = () => {
}, Da = () => !1, gn = (i) => i.charCodeAt(0) === 111 && i.charCodeAt(1) === 110 && // uppercase letter
(i.charCodeAt(2) > 122 || i.charCodeAt(2) < 97), to = (i) => i.startsWith("onUpdate:"), wt = Object.assign, xs = (i, n) => {
  const s = i.indexOf(n);
  s > -1 && i.splice(s, 1);
}, rc = Object.prototype.hasOwnProperty, st = (i, n) => rc.call(i, n), K = Array.isArray, Ai = (i) => fo(i) === "[object Map]", ac = (i) => fo(i) === "[object Set]", q = (i) => typeof i == "function", Tt = (i) => typeof i == "string", Vi = (i) => typeof i == "symbol", gt = (i) => i !== null && typeof i == "object", Es = (i) => (gt(i) || q(i)) && q(i.then) && q(i.catch), lc = Object.prototype.toString, fo = (i) => lc.call(i), Ps = (i) => fo(i).slice(8, -1), Os = (i) => fo(i) === "[object Object]", Ts = (i) => Tt(i) && i !== "NaN" && i[0] !== "-" && "" + parseInt(i, 10) === i, sn = /* @__PURE__ */ je(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), uc = /* @__PURE__ */ je(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
), po = (i) => {
  const n = /* @__PURE__ */ Object.create(null);
  return (s) => n[s] || (n[s] = i(s));
}, cc = /-\w/g, Xt = po(
  (i) => i.replace(cc, (n) => n.slice(1).toUpperCase())
), hc = /\B([A-Z])/g, oe = po(
  (i) => i.replace(hc, "-$1").toLowerCase()
), _o = po((i) => i.charAt(0).toUpperCase() + i.slice(1)), ui = po(
  (i) => i ? `on${_o(i)}` : ""
), Xe = (i, n) => !Object.is(i, n), Xi = (i, ...n) => {
  for (let s = 0; s < i.length; s++)
    i[s](...n);
}, eo = (i, n, s, a = !1) => {
  Object.defineProperty(i, n, {
    configurable: !0,
    enumerable: !1,
    writable: a,
    value: s
  });
}, fc = (i) => {
  const n = parseFloat(i);
  return isNaN(n) ? i : n;
}, Ur = (i) => {
  const n = Tt(i) ? Number(i) : NaN;
  return isNaN(n) ? i : n;
};
let Kr;
const vn = () => Kr || (Kr = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Ns(i) {
  if (K(i)) {
    const n = {};
    for (let s = 0; s < i.length; s++) {
      const a = i[s], l = Tt(a) ? mc(a) : Ns(a);
      if (l)
        for (const c in l)
          n[c] = l[c];
    }
    return n;
  } else if (Tt(i) || gt(i))
    return i;
}
const dc = /;(?![^(]*\))/g, pc = /:([^]+)/, _c = /\/\*[^]*?\*\//g;
function mc(i) {
  const n = {};
  return i.replace(_c, "").split(dc).forEach((s) => {
    if (s) {
      const a = s.split(pc);
      a.length > 1 && (n[a[0].trim()] = a[1].trim());
    }
  }), n;
}
function Ls(i) {
  let n = "";
  if (Tt(i))
    n = i;
  else if (K(i))
    for (let s = 0; s < i.length; s++) {
      const a = Ls(i[s]);
      a && (n += a + " ");
    }
  else if (gt(i))
    for (const s in i)
      i[s] && (n += s + " ");
  return n.trim();
}
const gc = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot", vc = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", yc = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics", bc = /* @__PURE__ */ je(gc), wc = /* @__PURE__ */ je(vc), xc = /* @__PURE__ */ je(yc), Ec = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Pc = /* @__PURE__ */ je(Ec);
function Aa(i) {
  return !!i || i === "";
}
/**
* @vue/reactivity v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function be(i, ...n) {
  console.warn(`[Vue warn] ${i}`, ...n);
}
let Jt;
class Oc {
  constructor(n = !1) {
    this.detached = n, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = Jt, !n && Jt && (this.index = (Jt.scopes || (Jt.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let n, s;
      if (this.scopes)
        for (n = 0, s = this.scopes.length; n < s; n++)
          this.scopes[n].pause();
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let n, s;
      if (this.scopes)
        for (n = 0, s = this.scopes.length; n < s; n++)
          this.scopes[n].resume();
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].resume();
    }
  }
  run(n) {
    if (this._active) {
      const s = Jt;
      try {
        return Jt = this, n();
      } finally {
        Jt = s;
      }
    } else process.env.NODE_ENV !== "production" && be("cannot run an inactive effect scope.");
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Jt, Jt = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Jt = this.prevScope, this.prevScope = void 0);
  }
  stop(n) {
    if (this._active) {
      this._active = !1;
      let s, a;
      for (s = 0, a = this.effects.length; s < a; s++)
        this.effects[s].stop();
      for (this.effects.length = 0, s = 0, a = this.cleanups.length; s < a; s++)
        this.cleanups[s]();
      if (this.cleanups.length = 0, this.scopes) {
        for (s = 0, a = this.scopes.length; s < a; s++)
          this.scopes[s].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !n) {
        const l = this.parent.scopes.pop();
        l && l !== this && (this.parent.scopes[this.index] = l, l.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function Tc() {
  return Jt;
}
let ht;
const Yo = /* @__PURE__ */ new WeakSet();
class Ia {
  constructor(n) {
    this.fn = n, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Jt && Jt.active && Jt.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Yo.has(this) && (Yo.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || za(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Gr(this), Va(this);
    const n = ht, s = ve;
    ht = this, ve = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && ht !== this && be(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Ra(this), ht = n, ve = s, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let n = this.deps; n; n = n.nextDep)
        Ms(n);
      this.deps = this.depsTail = void 0, Gr(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Yo.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ss(this) && this.run();
  }
  get dirty() {
    return ss(this);
  }
}
let ka = 0, rn, an;
function za(i, n = !1) {
  if (i.flags |= 8, n) {
    i.next = an, an = i;
    return;
  }
  i.next = rn, rn = i;
}
function Ss() {
  ka++;
}
function Cs() {
  if (--ka > 0)
    return;
  if (an) {
    let n = an;
    for (an = void 0; n; ) {
      const s = n.next;
      n.next = void 0, n.flags &= -9, n = s;
    }
  }
  let i;
  for (; rn; ) {
    let n = rn;
    for (rn = void 0; n; ) {
      const s = n.next;
      if (n.next = void 0, n.flags &= -9, n.flags & 1)
        try {
          n.trigger();
        } catch (a) {
          i || (i = a);
        }
      n = s;
    }
  }
  if (i) throw i;
}
function Va(i) {
  for (let n = i.deps; n; n = n.nextDep)
    n.version = -1, n.prevActiveLink = n.dep.activeLink, n.dep.activeLink = n;
}
function Ra(i) {
  let n, s = i.depsTail, a = s;
  for (; a; ) {
    const l = a.prevDep;
    a.version === -1 ? (a === s && (s = l), Ms(a), Nc(a)) : n = a, a.dep.activeLink = a.prevActiveLink, a.prevActiveLink = void 0, a = l;
  }
  i.deps = n, i.depsTail = s;
}
function ss(i) {
  for (let n = i.deps; n; n = n.nextDep)
    if (n.dep.version !== n.version || n.dep.computed && (Ba(n.dep.computed) || n.dep.version !== n.version))
      return !0;
  return !!i._dirty;
}
function Ba(i) {
  if (i.flags & 4 && !(i.flags & 16) || (i.flags &= -17, i.globalVersion === fn) || (i.globalVersion = fn, !i.isSSR && i.flags & 128 && (!i.deps && !i._dirty || !ss(i))))
    return;
  i.flags |= 2;
  const n = i.dep, s = ht, a = ve;
  ht = i, ve = !0;
  try {
    Va(i);
    const l = i.fn(i._value);
    (n.version === 0 || Xe(l, i._value)) && (i.flags |= 128, i._value = l, n.version++);
  } catch (l) {
    throw n.version++, l;
  } finally {
    ht = s, ve = a, Ra(i), i.flags &= -3;
  }
}
function Ms(i, n = !1) {
  const { dep: s, prevSub: a, nextSub: l } = i;
  if (a && (a.nextSub = l, i.prevSub = void 0), l && (l.prevSub = a, i.nextSub = void 0), process.env.NODE_ENV !== "production" && s.subsHead === i && (s.subsHead = l), s.subs === i && (s.subs = a, !a && s.computed)) {
    s.computed.flags &= -5;
    for (let c = s.computed.deps; c; c = c.nextDep)
      Ms(c, !0);
  }
  !n && !--s.sc && s.map && s.map.delete(s.key);
}
function Nc(i) {
  const { prevDep: n, nextDep: s } = i;
  n && (n.nextDep = s, i.prevDep = void 0), s && (s.prevDep = n, i.nextDep = void 0);
}
let ve = !0;
const Za = [];
function we() {
  Za.push(ve), ve = !1;
}
function xe() {
  const i = Za.pop();
  ve = i === void 0 ? !0 : i;
}
function Gr(i) {
  const { cleanup: n } = i;
  if (i.cleanup = void 0, n) {
    const s = ht;
    ht = void 0;
    try {
      n();
    } finally {
      ht = s;
    }
  }
}
let fn = 0;
class Lc {
  constructor(n, s) {
    this.sub = n, this.dep = s, this.version = s.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ds {
  // TODO isolatedDeclarations "__v_skip"
  constructor(n) {
    this.computed = n, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(n) {
    if (!ht || !ve || ht === this.computed)
      return;
    let s = this.activeLink;
    if (s === void 0 || s.sub !== ht)
      s = this.activeLink = new Lc(ht, this), ht.deps ? (s.prevDep = ht.depsTail, ht.depsTail.nextDep = s, ht.depsTail = s) : ht.deps = ht.depsTail = s, Fa(s);
    else if (s.version === -1 && (s.version = this.version, s.nextDep)) {
      const a = s.nextDep;
      a.prevDep = s.prevDep, s.prevDep && (s.prevDep.nextDep = a), s.prevDep = ht.depsTail, s.nextDep = void 0, ht.depsTail.nextDep = s, ht.depsTail = s, ht.deps === s && (ht.deps = a);
    }
    return process.env.NODE_ENV !== "production" && ht.onTrack && ht.onTrack(
      wt(
        {
          effect: ht
        },
        n
      )
    ), s;
  }
  trigger(n) {
    this.version++, fn++, this.notify(n);
  }
  notify(n) {
    Ss();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let s = this.subsHead; s; s = s.nextSub)
          s.sub.onTrigger && !(s.sub.flags & 8) && s.sub.onTrigger(
            wt(
              {
                effect: s.sub
              },
              n
            )
          );
      for (let s = this.subs; s; s = s.prevSub)
        s.sub.notify() && s.sub.dep.notify();
    } finally {
      Cs();
    }
  }
}
function Fa(i) {
  if (i.dep.sc++, i.sub.flags & 4) {
    const n = i.dep.computed;
    if (n && !i.dep.subs) {
      n.flags |= 20;
      for (let a = n.deps; a; a = a.nextDep)
        Fa(a);
    }
    const s = i.dep.subs;
    s !== i && (i.prevSub = s, s && (s.nextSub = i)), process.env.NODE_ENV !== "production" && i.dep.subsHead === void 0 && (i.dep.subsHead = i), i.dep.subs = i;
  }
}
const rs = /* @__PURE__ */ new WeakMap(), hi = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), as = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), dn = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function At(i, n, s) {
  if (ve && ht) {
    let a = rs.get(i);
    a || rs.set(i, a = /* @__PURE__ */ new Map());
    let l = a.get(s);
    l || (a.set(s, l = new Ds()), l.map = a, l.key = s), process.env.NODE_ENV !== "production" ? l.track({
      target: i,
      type: n,
      key: s
    }) : l.track();
  }
}
function Me(i, n, s, a, l, c) {
  const f = rs.get(i);
  if (!f) {
    fn++;
    return;
  }
  const d = (_) => {
    _ && (process.env.NODE_ENV !== "production" ? _.trigger({
      target: i,
      type: n,
      key: s,
      newValue: a,
      oldValue: l,
      oldTarget: c
    }) : _.trigger());
  };
  if (Ss(), n === "clear")
    f.forEach(d);
  else {
    const _ = K(i), w = _ && Ts(s);
    if (_ && s === "length") {
      const y = Number(a);
      f.forEach((g, P) => {
        (P === "length" || P === dn || !Vi(P) && P >= y) && d(g);
      });
    } else
      switch ((s !== void 0 || f.has(void 0)) && d(f.get(s)), w && d(f.get(dn)), n) {
        case "add":
          _ ? w && d(f.get("length")) : (d(f.get(hi)), Ai(i) && d(f.get(as)));
          break;
        case "delete":
          _ || (d(f.get(hi)), Ai(i) && d(f.get(as)));
          break;
        case "set":
          Ai(i) && d(f.get(hi));
          break;
      }
  }
  Cs();
}
function Li(i) {
  const n = et(i);
  return n === i ? n : (At(n, "iterate", dn), Qt(i) ? n : n.map(Gt));
}
function As(i) {
  return At(i = et(i), "iterate", dn), i;
}
const Sc = {
  __proto__: null,
  [Symbol.iterator]() {
    return Jo(this, Symbol.iterator, Gt);
  },
  concat(...i) {
    return Li(this).concat(
      ...i.map((n) => K(n) ? Li(n) : n)
    );
  },
  entries() {
    return Jo(this, "entries", (i) => (i[1] = Gt(i[1]), i));
  },
  every(i, n) {
    return Fe(this, "every", i, n, void 0, arguments);
  },
  filter(i, n) {
    return Fe(this, "filter", i, n, (s) => s.map(Gt), arguments);
  },
  find(i, n) {
    return Fe(this, "find", i, n, Gt, arguments);
  },
  findIndex(i, n) {
    return Fe(this, "findIndex", i, n, void 0, arguments);
  },
  findLast(i, n) {
    return Fe(this, "findLast", i, n, Gt, arguments);
  },
  findLastIndex(i, n) {
    return Fe(this, "findLastIndex", i, n, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(i, n) {
    return Fe(this, "forEach", i, n, void 0, arguments);
  },
  includes(...i) {
    return Xo(this, "includes", i);
  },
  indexOf(...i) {
    return Xo(this, "indexOf", i);
  },
  join(i) {
    return Li(this).join(i);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...i) {
    return Xo(this, "lastIndexOf", i);
  },
  map(i, n) {
    return Fe(this, "map", i, n, void 0, arguments);
  },
  pop() {
    return Qi(this, "pop");
  },
  push(...i) {
    return Qi(this, "push", i);
  },
  reduce(i, ...n) {
    return qr(this, "reduce", i, n);
  },
  reduceRight(i, ...n) {
    return qr(this, "reduceRight", i, n);
  },
  shift() {
    return Qi(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(i, n) {
    return Fe(this, "some", i, n, void 0, arguments);
  },
  splice(...i) {
    return Qi(this, "splice", i);
  },
  toReversed() {
    return Li(this).toReversed();
  },
  toSorted(i) {
    return Li(this).toSorted(i);
  },
  toSpliced(...i) {
    return Li(this).toSpliced(...i);
  },
  unshift(...i) {
    return Qi(this, "unshift", i);
  },
  values() {
    return Jo(this, "values", Gt);
  }
};
function Jo(i, n, s) {
  const a = As(i), l = a[n]();
  return a !== i && !Qt(i) && (l._next = l.next, l.next = () => {
    const c = l._next();
    return c.done || (c.value = s(c.value)), c;
  }), l;
}
const Cc = Array.prototype;
function Fe(i, n, s, a, l, c) {
  const f = As(i), d = f !== i && !Qt(i), _ = f[n];
  if (_ !== Cc[n]) {
    const g = _.apply(i, c);
    return d ? Gt(g) : g;
  }
  let w = s;
  f !== i && (d ? w = function(g, P) {
    return s.call(this, Gt(g), P, i);
  } : s.length > 2 && (w = function(g, P) {
    return s.call(this, g, P, i);
  }));
  const y = _.call(f, w, a);
  return d && l ? l(y) : y;
}
function qr(i, n, s, a) {
  const l = As(i);
  let c = s;
  return l !== i && (Qt(i) ? s.length > 3 && (c = function(f, d, _) {
    return s.call(this, f, d, _, i);
  }) : c = function(f, d, _) {
    return s.call(this, f, Gt(d), _, i);
  }), l[n](c, ...a);
}
function Xo(i, n, s) {
  const a = et(i);
  At(a, "iterate", dn);
  const l = a[n](...s);
  return (l === -1 || l === !1) && io(s[0]) ? (s[0] = et(s[0]), a[n](...s)) : l;
}
function Qi(i, n, s = []) {
  we(), Ss();
  const a = et(i)[n].apply(i, s);
  return Cs(), xe(), a;
}
const Mc = /* @__PURE__ */ je("__proto__,__v_isRef,__isVue"), Ha = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((i) => i !== "arguments" && i !== "caller").map((i) => Symbol[i]).filter(Vi)
);
function Dc(i) {
  Vi(i) || (i = String(i));
  const n = et(this);
  return At(n, "has", i), n.hasOwnProperty(i);
}
class $a {
  constructor(n = !1, s = !1) {
    this._isReadonly = n, this._isShallow = s;
  }
  get(n, s, a) {
    if (s === "__v_skip") return n.__v_skip;
    const l = this._isReadonly, c = this._isShallow;
    if (s === "__v_isReactive")
      return !l;
    if (s === "__v_isReadonly")
      return l;
    if (s === "__v_isShallow")
      return c;
    if (s === "__v_raw")
      return a === (l ? c ? qa : Ga : c ? Ka : Ua).get(n) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(n) === Object.getPrototypeOf(a) ? n : void 0;
    const f = K(n);
    if (!l) {
      let _;
      if (f && (_ = Sc[s]))
        return _;
      if (s === "hasOwnProperty")
        return Dc;
    }
    const d = Reflect.get(
      n,
      s,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Mt(n) ? n : a
    );
    if ((Vi(s) ? Ha.has(s) : Mc(s)) || (l || At(n, "get", s), c))
      return d;
    if (Mt(d)) {
      const _ = f && Ts(s) ? d : d.value;
      return l && gt(_) ? us(_) : _;
    }
    return gt(d) ? l ? us(d) : Is(d) : d;
  }
}
class Wa extends $a {
  constructor(n = !1) {
    super(!1, n);
  }
  set(n, s, a, l) {
    let c = n[s];
    if (!this._isShallow) {
      const _ = We(c);
      if (!Qt(a) && !We(a) && (c = et(c), a = et(a)), !K(n) && Mt(c) && !Mt(a))
        return _ ? (process.env.NODE_ENV !== "production" && be(
          `Set operation on key "${String(s)}" failed: target is readonly.`,
          n[s]
        ), !0) : (c.value = a, !0);
    }
    const f = K(n) && Ts(s) ? Number(s) < n.length : st(n, s), d = Reflect.set(
      n,
      s,
      a,
      Mt(n) ? n : l
    );
    return n === et(l) && (f ? Xe(a, c) && Me(n, "set", s, a, c) : Me(n, "add", s, a)), d;
  }
  deleteProperty(n, s) {
    const a = st(n, s), l = n[s], c = Reflect.deleteProperty(n, s);
    return c && a && Me(n, "delete", s, void 0, l), c;
  }
  has(n, s) {
    const a = Reflect.has(n, s);
    return (!Vi(s) || !Ha.has(s)) && At(n, "has", s), a;
  }
  ownKeys(n) {
    return At(
      n,
      "iterate",
      K(n) ? "length" : hi
    ), Reflect.ownKeys(n);
  }
}
class ja extends $a {
  constructor(n = !1) {
    super(!0, n);
  }
  set(n, s) {
    return process.env.NODE_ENV !== "production" && be(
      `Set operation on key "${String(s)}" failed: target is readonly.`,
      n
    ), !0;
  }
  deleteProperty(n, s) {
    return process.env.NODE_ENV !== "production" && be(
      `Delete operation on key "${String(s)}" failed: target is readonly.`,
      n
    ), !0;
  }
}
const Ac = /* @__PURE__ */ new Wa(), Ic = /* @__PURE__ */ new ja(), kc = /* @__PURE__ */ new Wa(!0), zc = /* @__PURE__ */ new ja(!0), ls = (i) => i, $n = (i) => Reflect.getPrototypeOf(i);
function Vc(i, n, s) {
  return function(...a) {
    const l = this.__v_raw, c = et(l), f = Ai(c), d = i === "entries" || i === Symbol.iterator && f, _ = i === "keys" && f, w = l[i](...a), y = s ? ls : n ? cs : Gt;
    return !n && At(
      c,
      "iterate",
      _ ? as : hi
    ), {
      // iterator protocol
      next() {
        const { value: g, done: P } = w.next();
        return P ? { value: g, done: P } : {
          value: d ? [y(g[0]), y(g[1])] : y(g),
          done: P
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Wn(i) {
  return function(...n) {
    if (process.env.NODE_ENV !== "production") {
      const s = n[0] ? `on key "${n[0]}" ` : "";
      be(
        `${_o(i)} operation ${s}failed: target is readonly.`,
        et(this)
      );
    }
    return i === "delete" ? !1 : i === "clear" ? void 0 : this;
  };
}
function Rc(i, n) {
  const s = {
    get(l) {
      const c = this.__v_raw, f = et(c), d = et(l);
      i || (Xe(l, d) && At(f, "get", l), At(f, "get", d));
      const { has: _ } = $n(f), w = n ? ls : i ? cs : Gt;
      if (_.call(f, l))
        return w(c.get(l));
      if (_.call(f, d))
        return w(c.get(d));
      c !== f && c.get(l);
    },
    get size() {
      const l = this.__v_raw;
      return !i && At(et(l), "iterate", hi), l.size;
    },
    has(l) {
      const c = this.__v_raw, f = et(c), d = et(l);
      return i || (Xe(l, d) && At(f, "has", l), At(f, "has", d)), l === d ? c.has(l) : c.has(l) || c.has(d);
    },
    forEach(l, c) {
      const f = this, d = f.__v_raw, _ = et(d), w = n ? ls : i ? cs : Gt;
      return !i && At(_, "iterate", hi), d.forEach((y, g) => l.call(c, w(y), w(g), f));
    }
  };
  return wt(
    s,
    i ? {
      add: Wn("add"),
      set: Wn("set"),
      delete: Wn("delete"),
      clear: Wn("clear")
    } : {
      add(l) {
        !n && !Qt(l) && !We(l) && (l = et(l));
        const c = et(this);
        return $n(c).has.call(c, l) || (c.add(l), Me(c, "add", l, l)), this;
      },
      set(l, c) {
        !n && !Qt(c) && !We(c) && (c = et(c));
        const f = et(this), { has: d, get: _ } = $n(f);
        let w = d.call(f, l);
        w ? process.env.NODE_ENV !== "production" && Yr(f, d, l) : (l = et(l), w = d.call(f, l));
        const y = _.call(f, l);
        return f.set(l, c), w ? Xe(c, y) && Me(f, "set", l, c, y) : Me(f, "add", l, c), this;
      },
      delete(l) {
        const c = et(this), { has: f, get: d } = $n(c);
        let _ = f.call(c, l);
        _ ? process.env.NODE_ENV !== "production" && Yr(c, f, l) : (l = et(l), _ = f.call(c, l));
        const w = d ? d.call(c, l) : void 0, y = c.delete(l);
        return _ && Me(c, "delete", l, void 0, w), y;
      },
      clear() {
        const l = et(this), c = l.size !== 0, f = process.env.NODE_ENV !== "production" ? Ai(l) ? new Map(l) : new Set(l) : void 0, d = l.clear();
        return c && Me(
          l,
          "clear",
          void 0,
          void 0,
          f
        ), d;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((l) => {
    s[l] = Vc(l, i, n);
  }), s;
}
function mo(i, n) {
  const s = Rc(i, n);
  return (a, l, c) => l === "__v_isReactive" ? !i : l === "__v_isReadonly" ? i : l === "__v_raw" ? a : Reflect.get(
    st(s, l) && l in a ? s : a,
    l,
    c
  );
}
const Bc = {
  get: /* @__PURE__ */ mo(!1, !1)
}, Zc = {
  get: /* @__PURE__ */ mo(!1, !0)
}, Fc = {
  get: /* @__PURE__ */ mo(!0, !1)
}, Hc = {
  get: /* @__PURE__ */ mo(!0, !0)
};
function Yr(i, n, s) {
  const a = et(s);
  if (a !== s && n.call(i, a)) {
    const l = Ps(i);
    be(
      `Reactive ${l} contains both the raw and reactive versions of the same object${l === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Ua = /* @__PURE__ */ new WeakMap(), Ka = /* @__PURE__ */ new WeakMap(), Ga = /* @__PURE__ */ new WeakMap(), qa = /* @__PURE__ */ new WeakMap();
function $c(i) {
  switch (i) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Wc(i) {
  return i.__v_skip || !Object.isExtensible(i) ? 0 : $c(Ps(i));
}
function Is(i) {
  return We(i) ? i : go(
    i,
    !1,
    Ac,
    Bc,
    Ua
  );
}
function jc(i) {
  return go(
    i,
    !1,
    kc,
    Zc,
    Ka
  );
}
function us(i) {
  return go(
    i,
    !0,
    Ic,
    Fc,
    Ga
  );
}
function De(i) {
  return go(
    i,
    !0,
    zc,
    Hc,
    qa
  );
}
function go(i, n, s, a, l) {
  if (!gt(i))
    return process.env.NODE_ENV !== "production" && be(
      `value cannot be made ${n ? "readonly" : "reactive"}: ${String(
        i
      )}`
    ), i;
  if (i.__v_raw && !(n && i.__v_isReactive))
    return i;
  const c = Wc(i);
  if (c === 0)
    return i;
  const f = l.get(i);
  if (f)
    return f;
  const d = new Proxy(
    i,
    c === 2 ? a : s
  );
  return l.set(i, d), d;
}
function Ii(i) {
  return We(i) ? Ii(i.__v_raw) : !!(i && i.__v_isReactive);
}
function We(i) {
  return !!(i && i.__v_isReadonly);
}
function Qt(i) {
  return !!(i && i.__v_isShallow);
}
function io(i) {
  return i ? !!i.__v_raw : !1;
}
function et(i) {
  const n = i && i.__v_raw;
  return n ? et(n) : i;
}
function Uc(i) {
  return !st(i, "__v_skip") && Object.isExtensible(i) && eo(i, "__v_skip", !0), i;
}
const Gt = (i) => gt(i) ? Is(i) : i, cs = (i) => gt(i) ? us(i) : i;
function Mt(i) {
  return i ? i.__v_isRef === !0 : !1;
}
function Kc(i) {
  return Gc(i, !1);
}
function Gc(i, n) {
  return Mt(i) ? i : new qc(i, n);
}
class qc {
  constructor(n, s) {
    this.dep = new Ds(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = s ? n : et(n), this._value = s ? n : Gt(n), this.__v_isShallow = s;
  }
  get value() {
    return process.env.NODE_ENV !== "production" ? this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }) : this.dep.track(), this._value;
  }
  set value(n) {
    const s = this._rawValue, a = this.__v_isShallow || Qt(n) || We(n);
    n = a ? n : et(n), Xe(n, s) && (this._rawValue = n, this._value = a ? n : Gt(n), process.env.NODE_ENV !== "production" ? this.dep.trigger({
      target: this,
      type: "set",
      key: "value",
      newValue: n,
      oldValue: s
    }) : this.dep.trigger());
  }
}
function Ya(i) {
  return Mt(i) ? i.value : i;
}
const Yc = {
  get: (i, n, s) => n === "__v_raw" ? i : Ya(Reflect.get(i, n, s)),
  set: (i, n, s, a) => {
    const l = i[n];
    return Mt(l) && !Mt(s) ? (l.value = s, !0) : Reflect.set(i, n, s, a);
  }
};
function Ja(i) {
  return Ii(i) ? i : new Proxy(i, Yc);
}
class Jc {
  constructor(n, s, a) {
    this.fn = n, this.setter = s, this._value = void 0, this.dep = new Ds(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = fn - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !s, this.isSSR = a;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    ht !== this)
      return za(this, !0), !0;
    process.env.NODE_ENV;
  }
  get value() {
    const n = process.env.NODE_ENV !== "production" ? this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }) : this.dep.track();
    return Ba(this), n && (n.version = this.dep.version), this._value;
  }
  set value(n) {
    this.setter ? this.setter(n) : process.env.NODE_ENV !== "production" && be("Write operation failed: computed value is readonly");
  }
}
function Xc(i, n, s = !1) {
  let a, l;
  q(i) ? a = i : (a = i.get, l = i.set);
  const c = new Jc(a, l, s);
  return process.env.NODE_ENV, c;
}
const jn = {}, no = /* @__PURE__ */ new WeakMap();
let ci;
function Qc(i, n = !1, s = ci) {
  if (s) {
    let a = no.get(s);
    a || no.set(s, a = []), a.push(i);
  } else process.env.NODE_ENV !== "production" && !n && be(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function th(i, n, s = dt) {
  const { immediate: a, deep: l, once: c, scheduler: f, augmentJob: d, call: _ } = s, w = (F) => {
    (s.onWarn || be)(
      "Invalid watch source: ",
      F,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, y = (F) => l ? F : Qt(F) || l === !1 || l === 0 ? Je(F, 1) : Je(F);
  let g, P, A, Z, I = !1, vt = !1;
  if (Mt(i) ? (P = () => i.value, I = Qt(i)) : Ii(i) ? (P = () => y(i), I = !0) : K(i) ? (vt = !0, I = i.some((F) => Ii(F) || Qt(F)), P = () => i.map((F) => {
    if (Mt(F))
      return F.value;
    if (Ii(F))
      return y(F);
    if (q(F))
      return _ ? _(F, 2) : F();
    process.env.NODE_ENV !== "production" && w(F);
  })) : q(i) ? n ? P = _ ? () => _(i, 2) : i : P = () => {
    if (A) {
      we();
      try {
        A();
      } finally {
        xe();
      }
    }
    const F = ci;
    ci = g;
    try {
      return _ ? _(i, 3, [Z]) : i(Z);
    } finally {
      ci = F;
    }
  } : (P = It, process.env.NODE_ENV !== "production" && w(i)), n && l) {
    const F = P, Ot = l === !0 ? 1 / 0 : l;
    P = () => Je(F(), Ot);
  }
  const _t = Tc(), J = () => {
    g.stop(), _t && _t.active && xs(_t.effects, g);
  };
  if (c && n) {
    const F = n;
    n = (...Ot) => {
      F(...Ot), J();
    };
  }
  let Y = vt ? new Array(i.length).fill(jn) : jn;
  const Vt = (F) => {
    if (!(!(g.flags & 1) || !g.dirty && !F))
      if (n) {
        const Ot = g.run();
        if (l || I || (vt ? Ot.some((Wt, Dt) => Xe(Wt, Y[Dt])) : Xe(Ot, Y))) {
          A && A();
          const Wt = ci;
          ci = g;
          try {
            const Dt = [
              Ot,
              // pass undefined as the old value when it's changed for the first time
              Y === jn ? void 0 : vt && Y[0] === jn ? [] : Y,
              Z
            ];
            Y = Ot, _ ? _(n, 3, Dt) : (
              // @ts-expect-error
              n(...Dt)
            );
          } finally {
            ci = Wt;
          }
        }
      } else
        g.run();
  };
  return d && d(Vt), g = new Ia(P), g.scheduler = f ? () => f(Vt, !1) : Vt, Z = (F) => Qc(F, !1, g), A = g.onStop = () => {
    const F = no.get(g);
    if (F) {
      if (_)
        _(F, 4);
      else
        for (const Ot of F) Ot();
      no.delete(g);
    }
  }, process.env.NODE_ENV !== "production" && (g.onTrack = s.onTrack, g.onTrigger = s.onTrigger), n ? a ? Vt(!0) : Y = g.run() : f ? f(Vt.bind(null, !0), !0) : g.run(), J.pause = g.pause.bind(g), J.resume = g.resume.bind(g), J.stop = J, J;
}
function Je(i, n = 1 / 0, s) {
  if (n <= 0 || !gt(i) || i.__v_skip || (s = s || /* @__PURE__ */ new Map(), (s.get(i) || 0) >= n))
    return i;
  if (s.set(i, n), n--, Mt(i))
    Je(i.value, n, s);
  else if (K(i))
    for (let a = 0; a < i.length; a++)
      Je(i[a], n, s);
  else if (ac(i) || Ai(i))
    i.forEach((a) => {
      Je(a, n, s);
    });
  else if (Os(i)) {
    for (const a in i)
      Je(i[a], n, s);
    for (const a of Object.getOwnPropertySymbols(i))
      Object.prototype.propertyIsEnumerable.call(i, a) && Je(i[a], n, s);
  }
  return i;
}
/**
* @vue/runtime-core v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const fi = [];
function Un(i) {
  fi.push(i);
}
function Kn() {
  fi.pop();
}
let Qo = !1;
function k(i, ...n) {
  if (Qo) return;
  Qo = !0, we();
  const s = fi.length ? fi[fi.length - 1].component : null, a = s && s.appContext.config.warnHandler, l = eh();
  if (a)
    Ri(
      a,
      s,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        i + n.map((c) => {
          var f, d;
          return (d = (f = c.toString) == null ? void 0 : f.call(c)) != null ? d : JSON.stringify(c);
        }).join(""),
        s && s.proxy,
        l.map(
          ({ vnode: c }) => `at <${xo(s, c.type)}>`
        ).join(`
`),
        l
      ]
    );
  else {
    const c = [`[Vue warn]: ${i}`, ...n];
    l.length && c.push(`
`, ...ih(l)), console.warn(...c);
  }
  xe(), Qo = !1;
}
function eh() {
  let i = fi[fi.length - 1];
  if (!i)
    return [];
  const n = [];
  for (; i; ) {
    const s = n[0];
    s && s.vnode === i ? s.recurseCount++ : n.push({
      vnode: i,
      recurseCount: 0
    });
    const a = i.component && i.component.parent;
    i = a && a.vnode;
  }
  return n;
}
function ih(i) {
  const n = [];
  return i.forEach((s, a) => {
    n.push(...a === 0 ? [] : [`
`], ...nh(s));
  }), n;
}
function nh({ vnode: i, recurseCount: n }) {
  const s = n > 0 ? `... (${n} recursive calls)` : "", a = i.component ? i.component.parent == null : !1, l = ` at <${xo(
    i.component,
    i.type,
    a
  )}`, c = ">" + s;
  return i.props ? [l, ...oh(i.props), c] : [l + c];
}
function oh(i) {
  const n = [], s = Object.keys(i);
  return s.slice(0, 3).forEach((a) => {
    n.push(...Xa(a, i[a]));
  }), s.length > 3 && n.push(" ..."), n;
}
function Xa(i, n, s) {
  return Tt(n) ? (n = JSON.stringify(n), s ? n : [`${i}=${n}`]) : typeof n == "number" || typeof n == "boolean" || n == null ? s ? n : [`${i}=${n}`] : Mt(n) ? (n = Xa(i, et(n.value), !0), s ? n : [`${i}=Ref<`, n, ">"]) : q(n) ? [`${i}=fn${n.name ? `<${n.name}>` : ""}`] : (n = et(n), s ? n : [`${i}=`, n]);
}
const ks = {
  sp: "serverPrefetch hook",
  bc: "beforeCreate hook",
  c: "created hook",
  bm: "beforeMount hook",
  m: "mounted hook",
  bu: "beforeUpdate hook",
  u: "updated",
  bum: "beforeUnmount hook",
  um: "unmounted hook",
  a: "activated hook",
  da: "deactivated hook",
  ec: "errorCaptured hook",
  rtc: "renderTracked hook",
  rtg: "renderTriggered hook",
  0: "setup function",
  1: "render function",
  2: "watcher getter",
  3: "watcher callback",
  4: "watcher cleanup function",
  5: "native event handler",
  6: "component event handler",
  7: "vnode hook",
  8: "directive hook",
  9: "transition hook",
  10: "app errorHandler",
  11: "app warnHandler",
  12: "ref function",
  13: "async component loader",
  14: "scheduler flush",
  15: "component update",
  16: "app unmount cleanup function"
};
function Ri(i, n, s, a) {
  try {
    return a ? i(...a) : i();
  } catch (l) {
    yn(l, n, s);
  }
}
function Ie(i, n, s, a) {
  if (q(i)) {
    const l = Ri(i, n, s, a);
    return l && Es(l) && l.catch((c) => {
      yn(c, n, s);
    }), l;
  }
  if (K(i)) {
    const l = [];
    for (let c = 0; c < i.length; c++)
      l.push(Ie(i[c], n, s, a));
    return l;
  } else process.env.NODE_ENV !== "production" && k(
    `Invalid value type passed to callWithAsyncErrorHandling(): ${typeof i}`
  );
}
function yn(i, n, s, a = !0) {
  const l = n ? n.vnode : null, { errorHandler: c, throwUnhandledErrorInProduction: f } = n && n.appContext.config || dt;
  if (n) {
    let d = n.parent;
    const _ = n.proxy, w = process.env.NODE_ENV !== "production" ? ks[s] : `https://vuejs.org/error-reference/#runtime-${s}`;
    for (; d; ) {
      const y = d.ec;
      if (y) {
        for (let g = 0; g < y.length; g++)
          if (y[g](i, _, w) === !1)
            return;
      }
      d = d.parent;
    }
    if (c) {
      we(), Ri(c, null, 10, [
        i,
        _,
        w
      ]), xe();
      return;
    }
  }
  sh(i, s, l, a, f);
}
function sh(i, n, s, a = !0, l = !1) {
  if (process.env.NODE_ENV !== "production") {
    const c = ks[n];
    if (s && Un(s), k(`Unhandled error${c ? ` during execution of ${c}` : ""}`), s && Kn(), a)
      throw i;
    console.error(i);
  } else {
    if (l)
      throw i;
    console.error(i);
  }
}
const qt = [];
let Se = -1;
const ki = [];
let qe = null, Mi = 0;
const Qa = /* @__PURE__ */ Promise.resolve();
let oo = null;
const rh = 100;
function tl(i) {
  const n = oo || Qa;
  return i ? n.then(this ? i.bind(this) : i) : n;
}
function ah(i) {
  let n = Se + 1, s = qt.length;
  for (; n < s; ) {
    const a = n + s >>> 1, l = qt[a], c = pn(l);
    c < i || c === i && l.flags & 2 ? n = a + 1 : s = a;
  }
  return n;
}
function vo(i) {
  if (!(i.flags & 1)) {
    const n = pn(i), s = qt[qt.length - 1];
    !s || // fast path when the job id is larger than the tail
    !(i.flags & 2) && n >= pn(s) ? qt.push(i) : qt.splice(ah(n), 0, i), i.flags |= 1, el();
  }
}
function el() {
  oo || (oo = Qa.then(ol));
}
function il(i) {
  K(i) ? ki.push(...i) : qe && i.id === -1 ? qe.splice(Mi + 1, 0, i) : i.flags & 1 || (ki.push(i), i.flags |= 1), el();
}
function Jr(i, n, s = Se + 1) {
  for (process.env.NODE_ENV !== "production" && (n = n || /* @__PURE__ */ new Map()); s < qt.length; s++) {
    const a = qt[s];
    if (a && a.flags & 2) {
      if (i && a.id !== i.uid || process.env.NODE_ENV !== "production" && zs(n, a))
        continue;
      qt.splice(s, 1), s--, a.flags & 4 && (a.flags &= -2), a(), a.flags & 4 || (a.flags &= -2);
    }
  }
}
function nl(i) {
  if (ki.length) {
    const n = [...new Set(ki)].sort(
      (s, a) => pn(s) - pn(a)
    );
    if (ki.length = 0, qe) {
      qe.push(...n);
      return;
    }
    for (qe = n, process.env.NODE_ENV !== "production" && (i = i || /* @__PURE__ */ new Map()), Mi = 0; Mi < qe.length; Mi++) {
      const s = qe[Mi];
      process.env.NODE_ENV !== "production" && zs(i, s) || (s.flags & 4 && (s.flags &= -2), s.flags & 8 || s(), s.flags &= -2);
    }
    qe = null, Mi = 0;
  }
}
const pn = (i) => i.id == null ? i.flags & 2 ? -1 : 1 / 0 : i.id;
function ol(i) {
  process.env.NODE_ENV !== "production" && (i = i || /* @__PURE__ */ new Map());
  const n = process.env.NODE_ENV !== "production" ? (s) => zs(i, s) : It;
  try {
    for (Se = 0; Se < qt.length; Se++) {
      const s = qt[Se];
      if (s && !(s.flags & 8)) {
        if (process.env.NODE_ENV !== "production" && n(s))
          continue;
        s.flags & 4 && (s.flags &= -2), Ri(
          s,
          s.i,
          s.i ? 15 : 14
        ), s.flags & 4 || (s.flags &= -2);
      }
    }
  } finally {
    for (; Se < qt.length; Se++) {
      const s = qt[Se];
      s && (s.flags &= -2);
    }
    Se = -1, qt.length = 0, nl(i), oo = null, (qt.length || ki.length) && ol(i);
  }
}
function zs(i, n) {
  const s = i.get(n) || 0;
  if (s > rh) {
    const a = n.i, l = a && Fl(a.type);
    return yn(
      `Maximum recursive updates exceeded${l ? ` in component <${l}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
      null,
      10
    ), !0;
  }
  return i.set(n, s + 1), !1;
}
let Ae = !1;
const Gn = /* @__PURE__ */ new Map();
process.env.NODE_ENV !== "production" && (vn().__VUE_HMR_RUNTIME__ = {
  createRecord: ts(sl),
  rerender: ts(ch),
  reload: ts(hh)
});
const pi = /* @__PURE__ */ new Map();
function lh(i) {
  const n = i.type.__hmrId;
  let s = pi.get(n);
  s || (sl(n, i.type), s = pi.get(n)), s.instances.add(i);
}
function uh(i) {
  pi.get(i.type.__hmrId).instances.delete(i);
}
function sl(i, n) {
  return pi.has(i) ? !1 : (pi.set(i, {
    initialDef: so(n),
    instances: /* @__PURE__ */ new Set()
  }), !0);
}
function so(i) {
  return Hl(i) ? i.__vccOpts : i;
}
function ch(i, n) {
  const s = pi.get(i);
  s && (s.initialDef.render = n, [...s.instances].forEach((a) => {
    n && (a.render = n, so(a.type).render = n), a.renderCache = [], Ae = !0, a.job.flags & 8 || a.update(), Ae = !1;
  }));
}
function hh(i, n) {
  const s = pi.get(i);
  if (!s) return;
  n = so(n), Xr(s.initialDef, n);
  const a = [...s.instances];
  for (let l = 0; l < a.length; l++) {
    const c = a[l], f = so(c.type);
    let d = Gn.get(f);
    d || (f !== s.initialDef && Xr(f, n), Gn.set(f, d = /* @__PURE__ */ new Set())), d.add(c), c.appContext.propsCache.delete(c.type), c.appContext.emitsCache.delete(c.type), c.appContext.optionsCache.delete(c.type), c.ceReload ? (d.add(c), c.ceReload(n.styles), d.delete(c)) : c.parent ? vo(() => {
      c.job.flags & 8 || (Ae = !0, c.parent.update(), Ae = !1, d.delete(c));
    }) : c.appContext.reload ? c.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn(
      "[HMR] Root or manually mounted instance modified. Full reload required."
    ), c.root.ce && c !== c.root && c.root.ce._removeChildStyle(f);
  }
  il(() => {
    Gn.clear();
  });
}
function Xr(i, n) {
  wt(i, n);
  for (const s in i)
    s !== "__file" && !(s in n) && delete i[s];
}
function ts(i) {
  return (n, s) => {
    try {
      return i(n, s);
    } catch (a) {
      console.error(a), console.warn(
        "[HMR] Something went wrong during Vue component hot-reload. Full reload required."
      );
    }
  };
}
let ge, nn = [], hs = !1;
function bn(i, ...n) {
  ge ? ge.emit(i, ...n) : hs || nn.push({ event: i, args: n });
}
function Vs(i, n) {
  var s, a;
  ge = i, ge ? (ge.enabled = !0, nn.forEach(({ event: l, args: c }) => ge.emit(l, ...c)), nn = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((a = (s = window.navigator) == null ? void 0 : s.userAgent) != null && a.includes("jsdom")) ? ((n.__VUE_DEVTOOLS_HOOK_REPLAY__ = n.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((c) => {
    Vs(c, n);
  }), setTimeout(() => {
    ge || (n.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, hs = !0, nn = []);
  }, 3e3)) : (hs = !0, nn = []);
}
function fh(i, n) {
  bn("app:init", i, n, {
    Fragment: Ce,
    Text: wn,
    Comment: ye,
    Static: Jn
  });
}
function dh(i) {
  bn("app:unmount", i);
}
const ph = /* @__PURE__ */ Rs(
  "component:added"
  /* COMPONENT_ADDED */
), rl = /* @__PURE__ */ Rs(
  "component:updated"
  /* COMPONENT_UPDATED */
), _h = /* @__PURE__ */ Rs(
  "component:removed"
  /* COMPONENT_REMOVED */
), mh = (i) => {
  ge && typeof ge.cleanupBuffer == "function" && // remove the component if it wasn't buffered
  !ge.cleanupBuffer(i) && _h(i);
};
// @__NO_SIDE_EFFECTS__
function Rs(i) {
  return (n) => {
    bn(
      i,
      n.appContext.app,
      n.uid,
      n.parent ? n.parent.uid : void 0,
      n
    );
  };
}
const gh = /* @__PURE__ */ al(
  "perf:start"
  /* PERFORMANCE_START */
), vh = /* @__PURE__ */ al(
  "perf:end"
  /* PERFORMANCE_END */
);
function al(i) {
  return (n, s, a) => {
    bn(i, n.appContext.app, n.uid, n, s, a);
  };
}
function yh(i, n, s) {
  bn(
    "component:emit",
    i.appContext.app,
    i,
    n,
    s
  );
}
let se = null, ll = null;
function ro(i) {
  const n = se;
  return se = i, ll = i && i.type.__scopeId || null, n;
}
function bh(i, n = se, s) {
  if (!n || i._n)
    return i;
  const a = (...l) => {
    a._d && fa(-1);
    const c = ro(n);
    let f;
    try {
      f = i(...l);
    } finally {
      ro(c), a._d && fa(1);
    }
    return process.env.NODE_ENV !== "production" && rl(n), f;
  };
  return a._n = !0, a._c = !0, a._d = !0, a;
}
function ul(i) {
  uc(i) && k("Do not use built-in directive ids as custom directive id: " + i);
}
function ri(i, n, s, a) {
  const l = i.dirs, c = n && n.dirs;
  for (let f = 0; f < l.length; f++) {
    const d = l[f];
    c && (d.oldValue = c[f].value);
    let _ = d.dir[a];
    _ && (we(), Ie(_, s, 8, [
      i.el,
      d,
      i,
      n
    ]), xe());
  }
}
const wh = Symbol("_vte"), xh = (i) => i.__isTeleport, Eh = Symbol("_leaveCb");
function Bs(i, n) {
  i.shapeFlag & 6 && i.component ? (i.transition = n, Bs(i.component.subTree, n)) : i.shapeFlag & 128 ? (i.ssContent.transition = n.clone(i.ssContent), i.ssFallback.transition = n.clone(i.ssFallback)) : i.transition = n;
}
// @__NO_SIDE_EFFECTS__
function cl(i, n) {
  return q(i) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    wt({ name: i.name }, n, { setup: i })
  ) : i;
}
function hl(i) {
  i.ids = [i.ids[0] + i.ids[2]++ + "-", 0, 0];
}
const Qr = /* @__PURE__ */ new WeakSet(), ao = /* @__PURE__ */ new WeakMap();
function ln(i, n, s, a, l = !1) {
  if (K(i)) {
    i.forEach(
      (I, vt) => ln(
        I,
        n && (K(n) ? n[vt] : n),
        s,
        a,
        l
      )
    );
    return;
  }
  if (un(a) && !l) {
    a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && ln(i, n, s, a.component.subTree);
    return;
  }
  const c = a.shapeFlag & 4 ? Us(a.component) : a.el, f = l ? null : c, { i: d, r: _ } = i;
  if (process.env.NODE_ENV !== "production" && !d) {
    k(
      "Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function."
    );
    return;
  }
  const w = n && n.r, y = d.refs === dt ? d.refs = {} : d.refs, g = d.setupState, P = et(g), A = g === dt ? Da : (I) => process.env.NODE_ENV !== "production" && (st(P, I) && !Mt(P[I]) && k(
    `Template ref "${I}" used on a non-ref value. It will not work in the production build.`
  ), Qr.has(P[I])) ? !1 : st(P, I), Z = (I) => process.env.NODE_ENV === "production" || !Qr.has(I);
  if (w != null && w !== _) {
    if (ta(n), Tt(w))
      y[w] = null, A(w) && (g[w] = null);
    else if (Mt(w)) {
      Z(w) && (w.value = null);
      const I = n;
      I.k && (y[I.k] = null);
    }
  }
  if (q(_))
    Ri(_, d, 12, [f, y]);
  else {
    const I = Tt(_), vt = Mt(_);
    if (I || vt) {
      const _t = () => {
        if (i.f) {
          const J = I ? A(_) ? g[_] : y[_] : Z(_) || !i.k ? _.value : y[i.k];
          if (l)
            K(J) && xs(J, c);
          else if (K(J))
            J.includes(c) || J.push(c);
          else if (I)
            y[_] = [c], A(_) && (g[_] = y[_]);
          else {
            const Y = [c];
            Z(_) && (_.value = Y), i.k && (y[i.k] = Y);
          }
        } else I ? (y[_] = f, A(_) && (g[_] = f)) : vt ? (Z(_) && (_.value = f), i.k && (y[i.k] = f)) : process.env.NODE_ENV !== "production" && k("Invalid template ref type:", _, `(${typeof _})`);
      };
      if (f) {
        const J = () => {
          _t(), ao.delete(i);
        };
        J.id = -1, ao.set(i, J), ne(J, s);
      } else
        ta(i), _t();
    } else process.env.NODE_ENV !== "production" && k("Invalid template ref type:", _, `(${typeof _})`);
  }
}
function ta(i) {
  const n = ao.get(i);
  n && (n.flags |= 8, ao.delete(i));
}
vn().requestIdleCallback;
vn().cancelIdleCallback;
const un = (i) => !!i.type.__asyncLoader, Zs = (i) => i.type.__isKeepAlive;
function Ph(i, n) {
  fl(i, "a", n);
}
function Oh(i, n) {
  fl(i, "da", n);
}
function fl(i, n, s = Ht) {
  const a = i.__wdc || (i.__wdc = () => {
    let l = s;
    for (; l; ) {
      if (l.isDeactivated)
        return;
      l = l.parent;
    }
    return i();
  });
  if (yo(n, a, s), s) {
    let l = s.parent;
    for (; l && l.parent; )
      Zs(l.parent.vnode) && Th(a, n, s, l), l = l.parent;
  }
}
function Th(i, n, s, a) {
  const l = yo(
    n,
    i,
    a,
    !0
    /* prepend */
  );
  _l(() => {
    xs(a[n], l);
  }, s);
}
function yo(i, n, s = Ht, a = !1) {
  if (s) {
    const l = s[i] || (s[i] = []), c = n.__weh || (n.__weh = (...f) => {
      we();
      const d = xn(s), _ = Ie(n, s, i, f);
      return d(), xe(), _;
    });
    return a ? l.unshift(c) : l.push(c), c;
  } else if (process.env.NODE_ENV !== "production") {
    const l = ui(ks[i].replace(/ hook$/, ""));
    k(
      `${l} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
    );
  }
}
const Ue = (i) => (n, s = Ht) => {
  (!mn || i === "sp") && yo(i, (...a) => n(...a), s);
}, Nh = Ue("bm"), dl = Ue("m"), Lh = Ue(
  "bu"
), Sh = Ue("u"), pl = Ue(
  "bum"
), _l = Ue("um"), Ch = Ue(
  "sp"
), Mh = Ue("rtg"), Dh = Ue("rtc");
function Ah(i, n = Ht) {
  yo("ec", i, n);
}
const Ih = Symbol.for("v-ndc"), fs = (i) => i ? Bl(i) ? Us(i) : fs(i.parent) : null, di = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ wt(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => process.env.NODE_ENV !== "production" ? De(i.props) : i.props,
    $attrs: (i) => process.env.NODE_ENV !== "production" ? De(i.attrs) : i.attrs,
    $slots: (i) => process.env.NODE_ENV !== "production" ? De(i.slots) : i.slots,
    $refs: (i) => process.env.NODE_ENV !== "production" ? De(i.refs) : i.refs,
    $parent: (i) => fs(i.parent),
    $root: (i) => fs(i.root),
    $host: (i) => i.ce,
    $emit: (i) => i.emit,
    $options: (i) => vl(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      vo(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = tl.bind(i.proxy)),
    $watch: (i) => pf.bind(i)
  })
), Fs = (i) => i === "_" || i === "$", es = (i, n) => i !== dt && !i.__isScriptSetup && st(i, n), ml = {
  get({ _: i }, n) {
    if (n === "__v_skip")
      return !0;
    const { ctx: s, setupState: a, data: l, props: c, accessCache: f, type: d, appContext: _ } = i;
    if (process.env.NODE_ENV !== "production" && n === "__isVue")
      return !0;
    let w;
    if (n[0] !== "$") {
      const A = f[n];
      if (A !== void 0)
        switch (A) {
          case 1:
            return a[n];
          case 2:
            return l[n];
          case 4:
            return s[n];
          case 3:
            return c[n];
        }
      else {
        if (es(a, n))
          return f[n] = 1, a[n];
        if (l !== dt && st(l, n))
          return f[n] = 2, l[n];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (w = i.propsOptions[0]) && st(w, n)
        )
          return f[n] = 3, c[n];
        if (s !== dt && st(s, n))
          return f[n] = 4, s[n];
        ds && (f[n] = 0);
      }
    }
    const y = di[n];
    let g, P;
    if (y)
      return n === "$attrs" ? (At(i.attrs, "get", ""), process.env.NODE_ENV !== "production" && co()) : process.env.NODE_ENV !== "production" && n === "$slots" && At(i, "get", n), y(i);
    if (
      // css module (injected by vue-loader)
      (g = d.__cssModules) && (g = g[n])
    )
      return g;
    if (s !== dt && st(s, n))
      return f[n] = 4, s[n];
    if (
      // global properties
      P = _.config.globalProperties, st(P, n)
    )
      return P[n];
    process.env.NODE_ENV !== "production" && se && (!Tt(n) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    n.indexOf("__v") !== 0) && (l !== dt && Fs(n[0]) && st(l, n) ? k(
      `Property ${JSON.stringify(
        n
      )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
    ) : i === se && k(
      `Property ${JSON.stringify(n)} was accessed during render but is not defined on instance.`
    ));
  },
  set({ _: i }, n, s) {
    const { data: a, setupState: l, ctx: c } = i;
    return es(l, n) ? (l[n] = s, !0) : process.env.NODE_ENV !== "production" && l.__isScriptSetup && st(l, n) ? (k(`Cannot mutate <script setup> binding "${n}" from Options API.`), !1) : a !== dt && st(a, n) ? (a[n] = s, !0) : st(i.props, n) ? (process.env.NODE_ENV !== "production" && k(`Attempting to mutate prop "${n}". Props are readonly.`), !1) : n[0] === "$" && n.slice(1) in i ? (process.env.NODE_ENV !== "production" && k(
      `Attempting to mutate public property "${n}". Properties starting with $ are reserved and readonly.`
    ), !1) : (process.env.NODE_ENV !== "production" && n in i.appContext.config.globalProperties ? Object.defineProperty(c, n, {
      enumerable: !0,
      configurable: !0,
      value: s
    }) : c[n] = s, !0);
  },
  has({
    _: { data: i, setupState: n, accessCache: s, ctx: a, appContext: l, propsOptions: c, type: f }
  }, d) {
    let _, w;
    return !!(s[d] || i !== dt && d[0] !== "$" && st(i, d) || es(n, d) || (_ = c[0]) && st(_, d) || st(a, d) || st(di, d) || st(l.config.globalProperties, d) || (w = f.__cssModules) && w[d]);
  },
  defineProperty(i, n, s) {
    return s.get != null ? i._.accessCache[n] = 0 : st(s, "value") && this.set(i, n, s.value, null), Reflect.defineProperty(i, n, s);
  }
};
process.env.NODE_ENV !== "production" && (ml.ownKeys = (i) => (k(
  "Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."
), Reflect.ownKeys(i)));
function kh(i) {
  const n = {};
  return Object.defineProperty(n, "_", {
    configurable: !0,
    enumerable: !1,
    get: () => i
  }), Object.keys(di).forEach((s) => {
    Object.defineProperty(n, s, {
      configurable: !0,
      enumerable: !1,
      get: () => di[s](i),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: It
    });
  }), n;
}
function zh(i) {
  const {
    ctx: n,
    propsOptions: [s]
  } = i;
  s && Object.keys(s).forEach((a) => {
    Object.defineProperty(n, a, {
      enumerable: !0,
      configurable: !0,
      get: () => i.props[a],
      set: It
    });
  });
}
function Vh(i) {
  const { ctx: n, setupState: s } = i;
  Object.keys(et(s)).forEach((a) => {
    if (!s.__isScriptSetup) {
      if (Fs(a[0])) {
        k(
          `setup() return property ${JSON.stringify(
            a
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(n, a, {
        enumerable: !0,
        configurable: !0,
        get: () => s[a],
        set: It
      });
    }
  });
}
function ea(i) {
  return K(i) ? i.reduce(
    (n, s) => (n[s] = null, n),
    {}
  ) : i;
}
function Rh() {
  const i = /* @__PURE__ */ Object.create(null);
  return (n, s) => {
    i[s] ? k(`${n} property "${s}" is already defined in ${i[s]}.`) : i[s] = n;
  };
}
let ds = !0;
function Bh(i) {
  const n = vl(i), s = i.proxy, a = i.ctx;
  ds = !1, n.beforeCreate && ia(n.beforeCreate, i, "bc");
  const {
    // state
    data: l,
    computed: c,
    methods: f,
    watch: d,
    provide: _,
    inject: w,
    // lifecycle
    created: y,
    beforeMount: g,
    mounted: P,
    beforeUpdate: A,
    updated: Z,
    activated: I,
    deactivated: vt,
    beforeDestroy: _t,
    beforeUnmount: J,
    destroyed: Y,
    unmounted: Vt,
    render: F,
    renderTracked: Ot,
    renderTriggered: Wt,
    errorCaptured: Dt,
    serverPrefetch: kt,
    // public API
    expose: ae,
    inheritAttrs: xt,
    // assets
    components: yt,
    directives: _i,
    filters: le
  } = n, Ee = process.env.NODE_ENV !== "production" ? Rh() : null;
  if (process.env.NODE_ENV !== "production") {
    const [Q] = i.propsOptions;
    if (Q)
      for (const V in Q)
        Ee("Props", V);
  }
  if (w && Zh(w, a, Ee), f)
    for (const Q in f) {
      const V = f[Q];
      q(V) ? (process.env.NODE_ENV !== "production" ? Object.defineProperty(a, Q, {
        value: V.bind(s),
        configurable: !0,
        enumerable: !0,
        writable: !0
      }) : a[Q] = V.bind(s), process.env.NODE_ENV !== "production" && Ee("Methods", Q)) : process.env.NODE_ENV !== "production" && k(
        `Method "${Q}" has type "${typeof V}" in the component definition. Did you reference the function correctly?`
      );
    }
  if (l) {
    process.env.NODE_ENV !== "production" && !q(l) && k(
      "The data option must be a function. Plain object usage is no longer supported."
    );
    const Q = l.call(s, s);
    if (process.env.NODE_ENV !== "production" && Es(Q) && k(
      "data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>."
    ), !gt(Q))
      process.env.NODE_ENV !== "production" && k("data() should return an object.");
    else if (i.data = Is(Q), process.env.NODE_ENV !== "production")
      for (const V in Q)
        Ee("Data", V), Fs(V[0]) || Object.defineProperty(a, V, {
          configurable: !0,
          enumerable: !0,
          get: () => Q[V],
          set: It
        });
  }
  if (ds = !0, c)
    for (const Q in c) {
      const V = c[Q], te = q(V) ? V.bind(s, s) : q(V.get) ? V.get.bind(s, s) : It;
      process.env.NODE_ENV !== "production" && te === It && k(`Computed property "${Q}" has no getter.`);
      const G = !q(V) && q(V.set) ? V.set.bind(s) : process.env.NODE_ENV !== "production" ? () => {
        k(
          `Write operation failed: computed property "${Q}" is readonly.`
        );
      } : It, ft = Hf({
        get: te,
        set: G
      });
      Object.defineProperty(a, Q, {
        enumerable: !0,
        configurable: !0,
        get: () => ft.value,
        set: (Nt) => ft.value = Nt
      }), process.env.NODE_ENV !== "production" && Ee("Computed", Q);
    }
  if (d)
    for (const Q in d)
      gl(d[Q], a, s, Q);
  if (_) {
    const Q = q(_) ? _.call(s) : _;
    Reflect.ownKeys(Q).forEach((V) => {
      Uh(V, Q[V]);
    });
  }
  y && ia(y, i, "c");
  function pt(Q, V) {
    K(V) ? V.forEach((te) => Q(te.bind(s))) : V && Q(V.bind(s));
  }
  if (pt(Nh, g), pt(dl, P), pt(Lh, A), pt(Sh, Z), pt(Ph, I), pt(Oh, vt), pt(Ah, Dt), pt(Dh, Ot), pt(Mh, Wt), pt(pl, J), pt(_l, Vt), pt(Ch, kt), K(ae))
    if (ae.length) {
      const Q = i.exposed || (i.exposed = {});
      ae.forEach((V) => {
        Object.defineProperty(Q, V, {
          get: () => s[V],
          set: (te) => s[V] = te,
          enumerable: !0
        });
      });
    } else i.exposed || (i.exposed = {});
  F && i.render === It && (i.render = F), xt != null && (i.inheritAttrs = xt), yt && (i.components = yt), _i && (i.directives = _i), kt && hl(i);
}
function Zh(i, n, s = It) {
  K(i) && (i = ps(i));
  for (const a in i) {
    const l = i[a];
    let c;
    gt(l) ? "default" in l ? c = qn(
      l.from || a,
      l.default,
      !0
    ) : c = qn(l.from || a) : c = qn(l), Mt(c) ? Object.defineProperty(n, a, {
      enumerable: !0,
      configurable: !0,
      get: () => c.value,
      set: (f) => c.value = f
    }) : n[a] = c, process.env.NODE_ENV !== "production" && s("Inject", a);
  }
}
function ia(i, n, s) {
  Ie(
    K(i) ? i.map((a) => a.bind(n.proxy)) : i.bind(n.proxy),
    n,
    s
  );
}
function gl(i, n, s, a) {
  let l = a.includes(".") ? Cl(s, a) : () => s[a];
  if (Tt(i)) {
    const c = n[i];
    q(c) ? cn(l, c) : process.env.NODE_ENV !== "production" && k(`Invalid watch handler specified by key "${i}"`, c);
  } else if (q(i))
    cn(l, i.bind(s));
  else if (gt(i))
    if (K(i))
      i.forEach((c) => gl(c, n, s, a));
    else {
      const c = q(i.handler) ? i.handler.bind(s) : n[i.handler];
      q(c) ? cn(l, c, i) : process.env.NODE_ENV !== "production" && k(`Invalid watch handler specified by key "${i.handler}"`, c);
    }
  else process.env.NODE_ENV !== "production" && k(`Invalid watch option: "${a}"`, i);
}
function vl(i) {
  const n = i.type, { mixins: s, extends: a } = n, {
    mixins: l,
    optionsCache: c,
    config: { optionMergeStrategies: f }
  } = i.appContext, d = c.get(n);
  let _;
  return d ? _ = d : !l.length && !s && !a ? _ = n : (_ = {}, l.length && l.forEach(
    (w) => lo(_, w, f, !0)
  ), lo(_, n, f)), gt(n) && c.set(n, _), _;
}
function lo(i, n, s, a = !1) {
  const { mixins: l, extends: c } = n;
  c && lo(i, c, s, !0), l && l.forEach(
    (f) => lo(i, f, s, !0)
  );
  for (const f in n)
    if (a && f === "expose")
      process.env.NODE_ENV !== "production" && k(
        '"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.'
      );
    else {
      const d = Fh[f] || s && s[f];
      i[f] = d ? d(i[f], n[f]) : n[f];
    }
  return i;
}
const Fh = {
  data: na,
  props: oa,
  emits: oa,
  // objects
  methods: on,
  computed: on,
  // lifecycle
  beforeCreate: Kt,
  created: Kt,
  beforeMount: Kt,
  mounted: Kt,
  beforeUpdate: Kt,
  updated: Kt,
  beforeDestroy: Kt,
  beforeUnmount: Kt,
  destroyed: Kt,
  unmounted: Kt,
  activated: Kt,
  deactivated: Kt,
  errorCaptured: Kt,
  serverPrefetch: Kt,
  // assets
  components: on,
  directives: on,
  // watch
  watch: $h,
  // provide / inject
  provide: na,
  inject: Hh
};
function na(i, n) {
  return n ? i ? function() {
    return wt(
      q(i) ? i.call(this, this) : i,
      q(n) ? n.call(this, this) : n
    );
  } : n : i;
}
function Hh(i, n) {
  return on(ps(i), ps(n));
}
function ps(i) {
  if (K(i)) {
    const n = {};
    for (let s = 0; s < i.length; s++)
      n[i[s]] = i[s];
    return n;
  }
  return i;
}
function Kt(i, n) {
  return i ? [...new Set([].concat(i, n))] : n;
}
function on(i, n) {
  return i ? wt(/* @__PURE__ */ Object.create(null), i, n) : n;
}
function oa(i, n) {
  return i ? K(i) && K(n) ? [.../* @__PURE__ */ new Set([...i, ...n])] : wt(
    /* @__PURE__ */ Object.create(null),
    ea(i),
    ea(n ?? {})
  ) : n;
}
function $h(i, n) {
  if (!i) return n;
  if (!n) return i;
  const s = wt(/* @__PURE__ */ Object.create(null), i);
  for (const a in n)
    s[a] = Kt(i[a], n[a]);
  return s;
}
function yl() {
  return {
    app: null,
    config: {
      isNativeTag: Da,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Wh = 0;
function jh(i, n) {
  return function(a, l = null) {
    q(a) || (a = wt({}, a)), l != null && !gt(l) && (process.env.NODE_ENV !== "production" && k("root props passed to app.mount() must be an object."), l = null);
    const c = yl(), f = /* @__PURE__ */ new WeakSet(), d = [];
    let _ = !1;
    const w = c.app = {
      _uid: Wh++,
      _component: a,
      _props: l,
      _container: null,
      _context: c,
      _instance: null,
      version: ma,
      get config() {
        return c.config;
      },
      set config(y) {
        process.env.NODE_ENV !== "production" && k(
          "app.config cannot be replaced. Modify individual options instead."
        );
      },
      use(y, ...g) {
        return f.has(y) ? process.env.NODE_ENV !== "production" && k("Plugin has already been applied to target app.") : y && q(y.install) ? (f.add(y), y.install(w, ...g)) : q(y) ? (f.add(y), y(w, ...g)) : process.env.NODE_ENV !== "production" && k(
          'A plugin must either be a function or an object with an "install" function.'
        ), w;
      },
      mixin(y) {
        return c.mixins.includes(y) ? process.env.NODE_ENV !== "production" && k(
          "Mixin has already been applied to target app" + (y.name ? `: ${y.name}` : "")
        ) : c.mixins.push(y), w;
      },
      component(y, g) {
        return process.env.NODE_ENV !== "production" && ys(y, c.config), g ? (process.env.NODE_ENV !== "production" && c.components[y] && k(`Component "${y}" has already been registered in target app.`), c.components[y] = g, w) : c.components[y];
      },
      directive(y, g) {
        return process.env.NODE_ENV !== "production" && ul(y), g ? (process.env.NODE_ENV !== "production" && c.directives[y] && k(`Directive "${y}" has already been registered in target app.`), c.directives[y] = g, w) : c.directives[y];
      },
      mount(y, g, P) {
        if (_)
          process.env.NODE_ENV !== "production" && k(
            "App has already been mounted.\nIf you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. `const createMyApp = () => createApp(App)`"
          );
        else {
          process.env.NODE_ENV !== "production" && y.__vue_app__ && k(
            "There is already an app instance mounted on the host container.\n If you want to mount another app on the same host container, you need to unmount the previous app by calling `app.unmount()` first."
          );
          const A = w._ceVNode || Qe(a, l);
          return A.appContext = c, P === !0 ? P = "svg" : P === !1 && (P = void 0), process.env.NODE_ENV !== "production" && (c.reload = () => {
            const Z = ti(A);
            Z.el = null, i(Z, y, P);
          }), i(A, y, P), _ = !0, w._container = y, y.__vue_app__ = w, process.env.NODE_ENV !== "production" && (w._instance = A.component, fh(w, ma)), Us(A.component);
        }
      },
      onUnmount(y) {
        process.env.NODE_ENV !== "production" && typeof y != "function" && k(
          `Expected function as first argument to app.onUnmount(), but got ${typeof y}`
        ), d.push(y);
      },
      unmount() {
        _ ? (Ie(
          d,
          w._instance,
          16
        ), i(null, w._container), process.env.NODE_ENV !== "production" && (w._instance = null, dh(w)), delete w._container.__vue_app__) : process.env.NODE_ENV !== "production" && k("Cannot unmount an app that is not mounted.");
      },
      provide(y, g) {
        return process.env.NODE_ENV !== "production" && y in c.provides && (st(c.provides, y) ? k(
          `App already provides property with key "${String(y)}". It will be overwritten with the new value.`
        ) : k(
          `App already provides property with key "${String(y)}" inherited from its parent element. It will be overwritten with the new value.`
        )), c.provides[y] = g, w;
      },
      runWithContext(y) {
        const g = zi;
        zi = w;
        try {
          return y();
        } finally {
          zi = g;
        }
      }
    };
    return w;
  };
}
let zi = null;
function Uh(i, n) {
  if (!Ht)
    process.env.NODE_ENV !== "production" && k("provide() can only be used inside setup().");
  else {
    let s = Ht.provides;
    const a = Ht.parent && Ht.parent.provides;
    a === s && (s = Ht.provides = Object.create(a)), s[i] = n;
  }
}
function qn(i, n, s = !1) {
  const a = Rl();
  if (a || zi) {
    let l = zi ? zi._context.provides : a ? a.parent == null || a.ce ? a.vnode.appContext && a.vnode.appContext.provides : a.parent.provides : void 0;
    if (l && i in l)
      return l[i];
    if (arguments.length > 1)
      return s && q(n) ? n.call(a && a.proxy) : n;
    process.env.NODE_ENV !== "production" && k(`injection "${String(i)}" not found.`);
  } else process.env.NODE_ENV !== "production" && k("inject() can only be used inside setup() or functional components.");
}
const bl = {}, wl = () => Object.create(bl), xl = (i) => Object.getPrototypeOf(i) === bl;
function Kh(i, n, s, a = !1) {
  const l = {}, c = wl();
  i.propsDefaults = /* @__PURE__ */ Object.create(null), El(i, n, l, c);
  for (const f in i.propsOptions[0])
    f in l || (l[f] = void 0);
  process.env.NODE_ENV !== "production" && Ol(n || {}, l, i), s ? i.props = a ? l : jc(l) : i.type.props ? i.props = l : i.props = c, i.attrs = c;
}
function Gh(i) {
  for (; i; ) {
    if (i.type.__hmrId) return !0;
    i = i.parent;
  }
}
function qh(i, n, s, a) {
  const {
    props: l,
    attrs: c,
    vnode: { patchFlag: f }
  } = i, d = et(l), [_] = i.propsOptions;
  let w = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !(process.env.NODE_ENV !== "production" && Gh(i)) && (a || f > 0) && !(f & 16)
  ) {
    if (f & 8) {
      const y = i.vnode.dynamicProps;
      for (let g = 0; g < y.length; g++) {
        let P = y[g];
        if (bo(i.emitsOptions, P))
          continue;
        const A = n[P];
        if (_)
          if (st(c, P))
            A !== c[P] && (c[P] = A, w = !0);
          else {
            const Z = Xt(P);
            l[Z] = _s(
              _,
              d,
              Z,
              A,
              i,
              !1
            );
          }
        else
          A !== c[P] && (c[P] = A, w = !0);
      }
    }
  } else {
    El(i, n, l, c) && (w = !0);
    let y;
    for (const g in d)
      (!n || // for camelCase
      !st(n, g) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((y = oe(g)) === g || !st(n, y))) && (_ ? s && // for camelCase
      (s[g] !== void 0 || // for kebab-case
      s[y] !== void 0) && (l[g] = _s(
        _,
        d,
        g,
        void 0,
        i,
        !0
      )) : delete l[g]);
    if (c !== d)
      for (const g in c)
        (!n || !st(n, g)) && (delete c[g], w = !0);
  }
  w && Me(i.attrs, "set", ""), process.env.NODE_ENV !== "production" && Ol(n || {}, l, i);
}
function El(i, n, s, a) {
  const [l, c] = i.propsOptions;
  let f = !1, d;
  if (n)
    for (let _ in n) {
      if (sn(_))
        continue;
      const w = n[_];
      let y;
      l && st(l, y = Xt(_)) ? !c || !c.includes(y) ? s[y] = w : (d || (d = {}))[y] = w : bo(i.emitsOptions, _) || (!(_ in a) || w !== a[_]) && (a[_] = w, f = !0);
    }
  if (c) {
    const _ = et(s), w = d || dt;
    for (let y = 0; y < c.length; y++) {
      const g = c[y];
      s[g] = _s(
        l,
        _,
        g,
        w[g],
        i,
        !st(w, g)
      );
    }
  }
  return f;
}
function _s(i, n, s, a, l, c) {
  const f = i[s];
  if (f != null) {
    const d = st(f, "default");
    if (d && a === void 0) {
      const _ = f.default;
      if (f.type !== Function && !f.skipFactory && q(_)) {
        const { propsDefaults: w } = l;
        if (s in w)
          a = w[s];
        else {
          const y = xn(l);
          a = w[s] = _.call(
            null,
            n
          ), y();
        }
      } else
        a = _;
      l.ce && l.ce._setProp(s, a);
    }
    f[
      0
      /* shouldCast */
    ] && (c && !d ? a = !1 : f[
      1
      /* shouldCastTrue */
    ] && (a === "" || a === oe(s)) && (a = !0));
  }
  return a;
}
const Yh = /* @__PURE__ */ new WeakMap();
function Pl(i, n, s = !1) {
  const a = s ? Yh : n.propsCache, l = a.get(i);
  if (l)
    return l;
  const c = i.props, f = {}, d = [];
  let _ = !1;
  if (!q(i)) {
    const y = (g) => {
      _ = !0;
      const [P, A] = Pl(g, n, !0);
      wt(f, P), A && d.push(...A);
    };
    !s && n.mixins.length && n.mixins.forEach(y), i.extends && y(i.extends), i.mixins && i.mixins.forEach(y);
  }
  if (!c && !_)
    return gt(i) && a.set(i, Di), Di;
  if (K(c))
    for (let y = 0; y < c.length; y++) {
      process.env.NODE_ENV !== "production" && !Tt(c[y]) && k("props must be strings when using array syntax.", c[y]);
      const g = Xt(c[y]);
      sa(g) && (f[g] = dt);
    }
  else if (c) {
    process.env.NODE_ENV !== "production" && !gt(c) && k("invalid props options", c);
    for (const y in c) {
      const g = Xt(y);
      if (sa(g)) {
        const P = c[y], A = f[g] = K(P) || q(P) ? { type: P } : wt({}, P), Z = A.type;
        let I = !1, vt = !0;
        if (K(Z))
          for (let _t = 0; _t < Z.length; ++_t) {
            const J = Z[_t], Y = q(J) && J.name;
            if (Y === "Boolean") {
              I = !0;
              break;
            } else Y === "String" && (vt = !1);
          }
        else
          I = q(Z) && Z.name === "Boolean";
        A[
          0
          /* shouldCast */
        ] = I, A[
          1
          /* shouldCastTrue */
        ] = vt, (I || st(A, "default")) && d.push(g);
      }
    }
  }
  const w = [f, d];
  return gt(i) && a.set(i, w), w;
}
function sa(i) {
  return i[0] !== "$" && !sn(i) ? !0 : (process.env.NODE_ENV !== "production" && k(`Invalid prop name: "${i}" is a reserved property.`), !1);
}
function Jh(i) {
  return i === null ? "null" : typeof i == "function" ? i.name || "" : typeof i == "object" && i.constructor && i.constructor.name || "";
}
function Ol(i, n, s) {
  const a = et(n), l = s.propsOptions[0], c = Object.keys(i).map((f) => Xt(f));
  for (const f in l) {
    let d = l[f];
    d != null && Xh(
      f,
      a[f],
      d,
      process.env.NODE_ENV !== "production" ? De(a) : a,
      !c.includes(f)
    );
  }
}
function Xh(i, n, s, a, l) {
  const { type: c, required: f, validator: d, skipCheck: _ } = s;
  if (f && l) {
    k('Missing required prop: "' + i + '"');
    return;
  }
  if (!(n == null && !f)) {
    if (c != null && c !== !0 && !_) {
      let w = !1;
      const y = K(c) ? c : [c], g = [];
      for (let P = 0; P < y.length && !w; P++) {
        const { valid: A, expectedType: Z } = tf(n, y[P]);
        g.push(Z || ""), w = A;
      }
      if (!w) {
        k(ef(i, n, g));
        return;
      }
    }
    d && !d(n, a) && k('Invalid prop: custom validator check failed for prop "' + i + '".');
  }
}
const Qh = /* @__PURE__ */ je(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function tf(i, n) {
  let s;
  const a = Jh(n);
  if (a === "null")
    s = i === null;
  else if (Qh(a)) {
    const l = typeof i;
    s = l === a.toLowerCase(), !s && l === "object" && (s = i instanceof n);
  } else a === "Object" ? s = gt(i) : a === "Array" ? s = K(i) : s = i instanceof n;
  return {
    valid: s,
    expectedType: a
  };
}
function ef(i, n, s) {
  if (s.length === 0)
    return `Prop type [] for prop "${i}" won't match anything. Did you mean to use type Array instead?`;
  let a = `Invalid prop: type check failed for prop "${i}". Expected ${s.map(_o).join(" | ")}`;
  const l = s[0], c = Ps(n), f = ra(n, l), d = ra(n, c);
  return s.length === 1 && aa(l) && !nf(l, c) && (a += ` with value ${f}`), a += `, got ${c} `, aa(c) && (a += `with value ${d}.`), a;
}
function ra(i, n) {
  return n === "String" ? `"${i}"` : n === "Number" ? `${Number(i)}` : `${i}`;
}
function aa(i) {
  return ["string", "number", "boolean"].some((s) => i.toLowerCase() === s);
}
function nf(...i) {
  return i.some((n) => n.toLowerCase() === "boolean");
}
const Hs = (i) => i === "_" || i === "_ctx" || i === "$stable", $s = (i) => K(i) ? i.map(me) : [me(i)], of = (i, n, s) => {
  if (n._n)
    return n;
  const a = bh((...l) => (process.env.NODE_ENV !== "production" && Ht && !(s === null && se) && !(s && s.root !== Ht.root) && k(
    `Slot "${i}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
  ), $s(n(...l))), s);
  return a._c = !1, a;
}, Tl = (i, n, s) => {
  const a = i._ctx;
  for (const l in i) {
    if (Hs(l)) continue;
    const c = i[l];
    if (q(c))
      n[l] = of(l, c, a);
    else if (c != null) {
      process.env.NODE_ENV !== "production" && k(
        `Non-function value encountered for slot "${l}". Prefer function slots for better performance.`
      );
      const f = $s(c);
      n[l] = () => f;
    }
  }
}, Nl = (i, n) => {
  process.env.NODE_ENV !== "production" && !Zs(i.vnode) && k(
    "Non-function value encountered for default slot. Prefer function slots for better performance."
  );
  const s = $s(n);
  i.slots.default = () => s;
}, ms = (i, n, s) => {
  for (const a in n)
    (s || !Hs(a)) && (i[a] = n[a]);
}, sf = (i, n, s) => {
  const a = i.slots = wl();
  if (i.vnode.shapeFlag & 32) {
    const l = n._;
    l ? (ms(a, n, s), s && eo(a, "_", l, !0)) : Tl(n, a);
  } else n && Nl(i, n);
}, rf = (i, n, s) => {
  const { vnode: a, slots: l } = i;
  let c = !0, f = dt;
  if (a.shapeFlag & 32) {
    const d = n._;
    d ? process.env.NODE_ENV !== "production" && Ae ? (ms(l, n, s), Me(i, "set", "$slots")) : s && d === 1 ? c = !1 : ms(l, n, s) : (c = !n.$stable, Tl(n, l)), f = n;
  } else n && (Nl(i, n), f = { default: 1 });
  if (c)
    for (const d in l)
      !Hs(d) && f[d] == null && delete l[d];
};
let tn, $e;
function Si(i, n) {
  i.appContext.config.performance && uo() && $e.mark(`vue-${n}-${i.uid}`), process.env.NODE_ENV !== "production" && gh(i, n, uo() ? $e.now() : Date.now());
}
function Ci(i, n) {
  if (i.appContext.config.performance && uo()) {
    const s = `vue-${n}-${i.uid}`, a = s + ":end", l = `<${xo(i, i.type)}> ${n}`;
    $e.mark(a), $e.measure(l, s, a), $e.clearMeasures(l), $e.clearMarks(s), $e.clearMarks(a);
  }
  process.env.NODE_ENV !== "production" && vh(i, n, uo() ? $e.now() : Date.now());
}
function uo() {
  return tn !== void 0 || (typeof window < "u" && window.performance ? (tn = !0, $e = window.performance) : tn = !1), tn;
}
function af() {
  const i = [];
  if (process.env.NODE_ENV !== "production" && i.length) {
    const n = i.length > 1;
    console.warn(
      `Feature flag${n ? "s" : ""} ${i.join(", ")} ${n ? "are" : "is"} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`
    );
  }
}
const ne = xf;
function lf(i) {
  return uf(i);
}
function uf(i, n) {
  af();
  const s = vn();
  s.__VUE__ = !0, process.env.NODE_ENV !== "production" && Vs(s.__VUE_DEVTOOLS_GLOBAL_HOOK__, s);
  const {
    insert: a,
    remove: l,
    patchProp: c,
    createElement: f,
    createText: d,
    createComment: _,
    setText: w,
    setElementText: y,
    parentNode: g,
    nextSibling: P,
    setScopeId: A = It,
    insertStaticContent: Z
  } = i, I = (p, v, E, S = null, T = null, O = null, z = void 0, D = null, M = process.env.NODE_ENV !== "production" && Ae ? !1 : !!v.dynamicChildren) => {
    if (p === v)
      return;
    p && !en(p, v) && (S = ee(p), Et(p, T, O, !0), p = null), v.patchFlag === -2 && (M = !1, v.dynamicChildren = null);
    const { type: C, ref: W, shapeFlag: R } = v;
    switch (C) {
      case wn:
        vt(p, v, E, S);
        break;
      case ye:
        _t(p, v, E, S);
        break;
      case Jn:
        p == null ? J(v, E, S, z) : process.env.NODE_ENV !== "production" && Y(p, v, E, z);
        break;
      case Ce:
        _i(
          p,
          v,
          E,
          S,
          T,
          O,
          z,
          D,
          M
        );
        break;
      default:
        R & 1 ? Ot(
          p,
          v,
          E,
          S,
          T,
          O,
          z,
          D,
          M
        ) : R & 6 ? le(
          p,
          v,
          E,
          S,
          T,
          O,
          z,
          D,
          M
        ) : R & 64 || R & 128 ? C.process(
          p,
          v,
          E,
          S,
          T,
          O,
          z,
          D,
          M,
          ke
        ) : process.env.NODE_ENV !== "production" && k("Invalid VNode type:", C, `(${typeof C})`);
    }
    W != null && T ? ln(W, p && p.ref, O, v || p, !v) : W == null && p && p.ref != null && ln(p.ref, null, O, p, !0);
  }, vt = (p, v, E, S) => {
    if (p == null)
      a(
        v.el = d(v.children),
        E,
        S
      );
    else {
      const T = v.el = p.el;
      v.children !== p.children && w(T, v.children);
    }
  }, _t = (p, v, E, S) => {
    p == null ? a(
      v.el = _(v.children || ""),
      E,
      S
    ) : v.el = p.el;
  }, J = (p, v, E, S) => {
    [p.el, p.anchor] = Z(
      p.children,
      v,
      E,
      S,
      p.el,
      p.anchor
    );
  }, Y = (p, v, E, S) => {
    if (v.children !== p.children) {
      const T = P(p.anchor);
      F(p), [v.el, v.anchor] = Z(
        v.children,
        E,
        T,
        S
      );
    } else
      v.el = p.el, v.anchor = p.anchor;
  }, Vt = ({ el: p, anchor: v }, E, S) => {
    let T;
    for (; p && p !== v; )
      T = P(p), a(p, E, S), p = T;
    a(v, E, S);
  }, F = ({ el: p, anchor: v }) => {
    let E;
    for (; p && p !== v; )
      E = P(p), l(p), p = E;
    l(v);
  }, Ot = (p, v, E, S, T, O, z, D, M) => {
    v.type === "svg" ? z = "svg" : v.type === "math" && (z = "mathml"), p == null ? Wt(
      v,
      E,
      S,
      T,
      O,
      z,
      D,
      M
    ) : ae(
      p,
      v,
      T,
      O,
      z,
      D,
      M
    );
  }, Wt = (p, v, E, S, T, O, z, D) => {
    let M, C;
    const { props: W, shapeFlag: R, transition: $, dirs: j } = p;
    if (M = p.el = f(
      p.type,
      O,
      W && W.is,
      W
    ), R & 8 ? y(M, p.children) : R & 16 && kt(
      p.children,
      M,
      null,
      S,
      T,
      is(p, O),
      z,
      D
    ), j && ri(p, null, S, "created"), Dt(M, p, p.scopeId, z, S), W) {
      for (const ct in W)
        ct !== "value" && !sn(ct) && c(M, ct, null, W[ct], O, S);
      "value" in W && c(M, "value", null, W.value, O), (C = W.onVnodeBeforeMount) && Le(C, S, p);
    }
    process.env.NODE_ENV !== "production" && (eo(M, "__vnode", p, !0), eo(M, "__vueParentComponent", S, !0)), j && ri(p, null, S, "beforeMount");
    const nt = cf(T, $);
    nt && $.beforeEnter(M), a(M, v, E), ((C = W && W.onVnodeMounted) || nt || j) && ne(() => {
      C && Le(C, S, p), nt && $.enter(M), j && ri(p, null, S, "mounted");
    }, T);
  }, Dt = (p, v, E, S, T) => {
    if (E && A(p, E), S)
      for (let O = 0; O < S.length; O++)
        A(p, S[O]);
    if (T) {
      let O = T.subTree;
      if (process.env.NODE_ENV !== "production" && O.patchFlag > 0 && O.patchFlag & 2048 && (O = Ws(O.children) || O), v === O || Al(O.type) && (O.ssContent === v || O.ssFallback === v)) {
        const z = T.vnode;
        Dt(
          p,
          z,
          z.scopeId,
          z.slotScopeIds,
          T.parent
        );
      }
    }
  }, kt = (p, v, E, S, T, O, z, D, M = 0) => {
    for (let C = M; C < p.length; C++) {
      const W = p[C] = D ? Ye(p[C]) : me(p[C]);
      I(
        null,
        W,
        v,
        E,
        S,
        T,
        O,
        z,
        D
      );
    }
  }, ae = (p, v, E, S, T, O, z) => {
    const D = v.el = p.el;
    process.env.NODE_ENV !== "production" && (D.__vnode = v);
    let { patchFlag: M, dynamicChildren: C, dirs: W } = v;
    M |= p.patchFlag & 16;
    const R = p.props || dt, $ = v.props || dt;
    let j;
    if (E && ai(E, !1), (j = $.onVnodeBeforeUpdate) && Le(j, E, v, p), W && ri(v, p, E, "beforeUpdate"), E && ai(E, !0), process.env.NODE_ENV !== "production" && Ae && (M = 0, z = !1, C = null), (R.innerHTML && $.innerHTML == null || R.textContent && $.textContent == null) && y(D, ""), C ? (xt(
      p.dynamicChildren,
      C,
      D,
      E,
      S,
      is(v, T),
      O
    ), process.env.NODE_ENV !== "production" && Yn(p, v)) : z || te(
      p,
      v,
      D,
      null,
      E,
      S,
      is(v, T),
      O,
      !1
    ), M > 0) {
      if (M & 16)
        yt(D, R, $, E, T);
      else if (M & 2 && R.class !== $.class && c(D, "class", null, $.class, T), M & 4 && c(D, "style", R.style, $.style, T), M & 8) {
        const nt = v.dynamicProps;
        for (let ct = 0; ct < nt.length; ct++) {
          const lt = nt[ct], Rt = R[lt], Bt = $[lt];
          (Bt !== Rt || lt === "value") && c(D, lt, Rt, Bt, T, E);
        }
      }
      M & 1 && p.children !== v.children && y(D, v.children);
    } else !z && C == null && yt(D, R, $, E, T);
    ((j = $.onVnodeUpdated) || W) && ne(() => {
      j && Le(j, E, v, p), W && ri(v, p, E, "updated");
    }, S);
  }, xt = (p, v, E, S, T, O, z) => {
    for (let D = 0; D < v.length; D++) {
      const M = p[D], C = v[D], W = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        M.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (M.type === Ce || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !en(M, C) || // - In the case of a component, it could contain anything.
        M.shapeFlag & 198) ? g(M.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          E
        )
      );
      I(
        M,
        C,
        W,
        null,
        S,
        T,
        O,
        z,
        !0
      );
    }
  }, yt = (p, v, E, S, T) => {
    if (v !== E) {
      if (v !== dt)
        for (const O in v)
          !sn(O) && !(O in E) && c(
            p,
            O,
            v[O],
            null,
            T,
            S
          );
      for (const O in E) {
        if (sn(O)) continue;
        const z = E[O], D = v[O];
        z !== D && O !== "value" && c(p, O, D, z, T, S);
      }
      "value" in E && c(p, "value", v.value, E.value, T);
    }
  }, _i = (p, v, E, S, T, O, z, D, M) => {
    const C = v.el = p ? p.el : d(""), W = v.anchor = p ? p.anchor : d("");
    let { patchFlag: R, dynamicChildren: $, slotScopeIds: j } = v;
    process.env.NODE_ENV !== "production" && // #5523 dev root fragment may inherit directives
    (Ae || R & 2048) && (R = 0, M = !1, $ = null), j && (D = D ? D.concat(j) : j), p == null ? (a(C, E, S), a(W, E, S), kt(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      v.children || [],
      E,
      W,
      T,
      O,
      z,
      D,
      M
    )) : R > 0 && R & 64 && $ && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    p.dynamicChildren ? (xt(
      p.dynamicChildren,
      $,
      E,
      T,
      O,
      z,
      D
    ), process.env.NODE_ENV !== "production" ? Yn(p, v) : (
      // #2080 if the stable fragment has a key, it's a <template v-for> that may
      //  get moved around. Make sure all root level vnodes inherit el.
      // #2134 or if it's a component root, it may also get moved around
      // as the component is being moved.
      (v.key != null || T && v === T.subTree) && Yn(
        p,
        v,
        !0
        /* shallow */
      )
    )) : te(
      p,
      v,
      E,
      W,
      T,
      O,
      z,
      D,
      M
    );
  }, le = (p, v, E, S, T, O, z, D, M) => {
    v.slotScopeIds = D, p == null ? v.shapeFlag & 512 ? T.ctx.activate(
      v,
      E,
      S,
      z,
      M
    ) : Ee(
      v,
      E,
      S,
      T,
      O,
      z,
      M
    ) : pt(p, v, M);
  }, Ee = (p, v, E, S, T, O, z) => {
    const D = p.component = Af(
      p,
      S,
      T
    );
    if (process.env.NODE_ENV !== "production" && D.type.__hmrId && lh(D), process.env.NODE_ENV !== "production" && (Un(p), Si(D, "mount")), Zs(p) && (D.ctx.renderer = ke), process.env.NODE_ENV !== "production" && Si(D, "init"), kf(D, !1, z), process.env.NODE_ENV !== "production" && Ci(D, "init"), process.env.NODE_ENV !== "production" && Ae && (p.el = null), D.asyncDep) {
      if (T && T.registerDep(D, Q, z), !p.el) {
        const M = D.subTree = Qe(ye);
        _t(null, M, v, E), p.placeholder = M.el;
      }
    } else
      Q(
        D,
        p,
        v,
        E,
        T,
        O,
        z
      );
    process.env.NODE_ENV !== "production" && (Kn(), Ci(D, "mount"));
  }, pt = (p, v, E) => {
    const S = v.component = p.component;
    if (bf(p, v, E))
      if (S.asyncDep && !S.asyncResolved) {
        process.env.NODE_ENV !== "production" && Un(v), V(S, v, E), process.env.NODE_ENV !== "production" && Kn();
        return;
      } else
        S.next = v, S.update();
    else
      v.el = p.el, S.vnode = v;
  }, Q = (p, v, E, S, T, O, z) => {
    const D = () => {
      if (p.isMounted) {
        let { next: R, bu: $, u: j, parent: nt, vnode: ct } = p;
        {
          const ie = Ll(p);
          if (ie) {
            R && (R.el = ct.el, V(p, R, z)), ie.asyncDep.then(() => {
              p.isUnmounted || D();
            });
            return;
          }
        }
        let lt = R, Rt;
        process.env.NODE_ENV !== "production" && Un(R || p.vnode), ai(p, !1), R ? (R.el = ct.el, V(p, R, z)) : R = ct, $ && Xi($), (Rt = R.props && R.props.onVnodeBeforeUpdate) && Le(Rt, nt, R, ct), ai(p, !0), process.env.NODE_ENV !== "production" && Si(p, "render");
        const Bt = ua(p);
        process.env.NODE_ENV !== "production" && Ci(p, "render");
        const ue = p.subTree;
        p.subTree = Bt, process.env.NODE_ENV !== "production" && Si(p, "patch"), I(
          ue,
          Bt,
          // parent may have changed if it's in a teleport
          g(ue.el),
          // anchor may have changed if it's in a fragment
          ee(ue),
          p,
          T,
          O
        ), process.env.NODE_ENV !== "production" && Ci(p, "patch"), R.el = Bt.el, lt === null && wf(p, Bt.el), j && ne(j, T), (Rt = R.props && R.props.onVnodeUpdated) && ne(
          () => Le(Rt, nt, R, ct),
          T
        ), process.env.NODE_ENV !== "production" && rl(p), process.env.NODE_ENV !== "production" && Kn();
      } else {
        let R;
        const { el: $, props: j } = v, { bm: nt, m: ct, parent: lt, root: Rt, type: Bt } = p, ue = un(v);
        ai(p, !1), nt && Xi(nt), !ue && (R = j && j.onVnodeBeforeMount) && Le(R, lt, v), ai(p, !0);
        {
          Rt.ce && // @ts-expect-error _def is private
          Rt.ce._def.shadowRoot !== !1 && Rt.ce._injectChildStyle(Bt), process.env.NODE_ENV !== "production" && Si(p, "render");
          const ie = p.subTree = ua(p);
          process.env.NODE_ENV !== "production" && Ci(p, "render"), process.env.NODE_ENV !== "production" && Si(p, "patch"), I(
            null,
            ie,
            E,
            S,
            p,
            T,
            O
          ), process.env.NODE_ENV !== "production" && Ci(p, "patch"), v.el = ie.el;
        }
        if (ct && ne(ct, T), !ue && (R = j && j.onVnodeMounted)) {
          const ie = v;
          ne(
            () => Le(R, lt, ie),
            T
          );
        }
        (v.shapeFlag & 256 || lt && un(lt.vnode) && lt.vnode.shapeFlag & 256) && p.a && ne(p.a, T), p.isMounted = !0, process.env.NODE_ENV !== "production" && ph(p), v = E = S = null;
      }
    };
    p.scope.on();
    const M = p.effect = new Ia(D);
    p.scope.off();
    const C = p.update = M.run.bind(M), W = p.job = M.runIfDirty.bind(M);
    W.i = p, W.id = p.uid, M.scheduler = () => vo(W), ai(p, !0), process.env.NODE_ENV !== "production" && (M.onTrack = p.rtc ? (R) => Xi(p.rtc, R) : void 0, M.onTrigger = p.rtg ? (R) => Xi(p.rtg, R) : void 0), C();
  }, V = (p, v, E) => {
    v.component = p;
    const S = p.vnode.props;
    p.vnode = v, p.next = null, qh(p, v.props, S, E), rf(p, v.children, E), we(), Jr(p), xe();
  }, te = (p, v, E, S, T, O, z, D, M = !1) => {
    const C = p && p.children, W = p ? p.shapeFlag : 0, R = v.children, { patchFlag: $, shapeFlag: j } = v;
    if ($ > 0) {
      if ($ & 128) {
        ft(
          C,
          R,
          E,
          S,
          T,
          O,
          z,
          D,
          M
        );
        return;
      } else if ($ & 256) {
        G(
          C,
          R,
          E,
          S,
          T,
          O,
          z,
          D,
          M
        );
        return;
      }
    }
    j & 8 ? (W & 16 && jt(C, T, O), R !== C && y(E, R)) : W & 16 ? j & 16 ? ft(
      C,
      R,
      E,
      S,
      T,
      O,
      z,
      D,
      M
    ) : jt(C, T, O, !0) : (W & 8 && y(E, ""), j & 16 && kt(
      R,
      E,
      S,
      T,
      O,
      z,
      D,
      M
    ));
  }, G = (p, v, E, S, T, O, z, D, M) => {
    p = p || Di, v = v || Di;
    const C = p.length, W = v.length, R = Math.min(C, W);
    let $;
    for ($ = 0; $ < R; $++) {
      const j = v[$] = M ? Ye(v[$]) : me(v[$]);
      I(
        p[$],
        j,
        E,
        null,
        T,
        O,
        z,
        D,
        M
      );
    }
    C > W ? jt(
      p,
      T,
      O,
      !0,
      !1,
      R
    ) : kt(
      v,
      E,
      S,
      T,
      O,
      z,
      D,
      M,
      R
    );
  }, ft = (p, v, E, S, T, O, z, D, M) => {
    let C = 0;
    const W = v.length;
    let R = p.length - 1, $ = W - 1;
    for (; C <= R && C <= $; ) {
      const j = p[C], nt = v[C] = M ? Ye(v[C]) : me(v[C]);
      if (en(j, nt))
        I(
          j,
          nt,
          E,
          null,
          T,
          O,
          z,
          D,
          M
        );
      else
        break;
      C++;
    }
    for (; C <= R && C <= $; ) {
      const j = p[R], nt = v[$] = M ? Ye(v[$]) : me(v[$]);
      if (en(j, nt))
        I(
          j,
          nt,
          E,
          null,
          T,
          O,
          z,
          D,
          M
        );
      else
        break;
      R--, $--;
    }
    if (C > R) {
      if (C <= $) {
        const j = $ + 1, nt = j < W ? v[j].el : S;
        for (; C <= $; )
          I(
            null,
            v[C] = M ? Ye(v[C]) : me(v[C]),
            E,
            nt,
            T,
            O,
            z,
            D,
            M
          ), C++;
      }
    } else if (C > $)
      for (; C <= R; )
        Et(p[C], T, O, !0), C++;
    else {
      const j = C, nt = C, ct = /* @__PURE__ */ new Map();
      for (C = nt; C <= $; C++) {
        const Zt = v[C] = M ? Ye(v[C]) : me(v[C]);
        Zt.key != null && (process.env.NODE_ENV !== "production" && ct.has(Zt.key) && k(
          "Duplicate keys found during update:",
          JSON.stringify(Zt.key),
          "Make sure keys are unique."
        ), ct.set(Zt.key, C));
      }
      let lt, Rt = 0;
      const Bt = $ - nt + 1;
      let ue = !1, ie = 0;
      const ze = new Array(Bt);
      for (C = 0; C < Bt; C++) ze[C] = 0;
      for (C = j; C <= R; C++) {
        const Zt = p[C];
        if (Rt >= Bt) {
          Et(Zt, T, O, !0);
          continue;
        }
        let $t;
        if (Zt.key != null)
          $t = ct.get(Zt.key);
        else
          for (lt = nt; lt <= $; lt++)
            if (ze[lt - nt] === 0 && en(Zt, v[lt])) {
              $t = lt;
              break;
            }
        $t === void 0 ? Et(Zt, T, O, !0) : (ze[$t - nt] = C + 1, $t >= ie ? ie = $t : ue = !0, I(
          Zt,
          v[$t],
          E,
          null,
          T,
          O,
          z,
          D,
          M
        ), Rt++);
      }
      const Bi = ue ? hf(ze) : Di;
      for (lt = Bi.length - 1, C = Bt - 1; C >= 0; C--) {
        const Zt = nt + C, $t = v[Zt], En = v[Zt + 1], Pn = Zt + 1 < W ? (
          // #13559, fallback to el placeholder for unresolved async component
          En.el || En.placeholder
        ) : S;
        ze[C] === 0 ? I(
          null,
          $t,
          E,
          Pn,
          T,
          O,
          z,
          D,
          M
        ) : ue && (lt < 0 || C !== Bi[lt] ? Nt($t, E, Pn, 2) : lt--);
      }
    }
  }, Nt = (p, v, E, S, T = null) => {
    const { el: O, type: z, transition: D, children: M, shapeFlag: C } = p;
    if (C & 6) {
      Nt(p.component.subTree, v, E, S);
      return;
    }
    if (C & 128) {
      p.suspense.move(v, E, S);
      return;
    }
    if (C & 64) {
      z.move(p, v, E, ke);
      return;
    }
    if (z === Ce) {
      a(O, v, E);
      for (let R = 0; R < M.length; R++)
        Nt(M[R], v, E, S);
      a(p.anchor, v, E);
      return;
    }
    if (z === Jn) {
      Vt(p, v, E);
      return;
    }
    if (S !== 2 && C & 1 && D)
      if (S === 0)
        D.beforeEnter(O), a(O, v, E), ne(() => D.enter(O), T);
      else {
        const { leave: R, delayLeave: $, afterLeave: j } = D, nt = () => {
          p.ctx.isUnmounted ? l(O) : a(O, v, E);
        }, ct = () => {
          O._isLeaving && O[Eh](
            !0
            /* cancelled */
          ), R(O, () => {
            nt(), j && j();
          });
        };
        $ ? $(O, nt, ct) : ct();
      }
    else
      a(O, v, E);
  }, Et = (p, v, E, S = !1, T = !1) => {
    const {
      type: O,
      props: z,
      ref: D,
      children: M,
      dynamicChildren: C,
      shapeFlag: W,
      patchFlag: R,
      dirs: $,
      cacheIndex: j
    } = p;
    if (R === -2 && (T = !1), D != null && (we(), ln(D, null, E, p, !0), xe()), j != null && (v.renderCache[j] = void 0), W & 256) {
      v.ctx.deactivate(p);
      return;
    }
    const nt = W & 1 && $, ct = !un(p);
    let lt;
    if (ct && (lt = z && z.onVnodeBeforeUnmount) && Le(lt, v, p), W & 6)
      ot(p.component, E, S);
    else {
      if (W & 128) {
        p.suspense.unmount(E, S);
        return;
      }
      nt && ri(p, null, v, "beforeUnmount"), W & 64 ? p.type.remove(
        p,
        v,
        E,
        ke,
        S
      ) : C && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !C.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (O !== Ce || R > 0 && R & 64) ? jt(
        C,
        v,
        E,
        !1,
        !0
      ) : (O === Ce && R & 384 || !T && W & 16) && jt(M, v, E), S && bt(p);
    }
    (ct && (lt = z && z.onVnodeUnmounted) || nt) && ne(() => {
      lt && Le(lt, v, p), nt && ri(p, null, v, "unmounted");
    }, E);
  }, bt = (p) => {
    const { type: v, el: E, anchor: S, transition: T } = p;
    if (v === Ce) {
      process.env.NODE_ENV !== "production" && p.patchFlag > 0 && p.patchFlag & 2048 && T && !T.persisted ? p.children.forEach((z) => {
        z.type === ye ? l(z.el) : bt(z);
      }) : ut(E, S);
      return;
    }
    if (v === Jn) {
      F(p);
      return;
    }
    const O = () => {
      l(E), T && !T.persisted && T.afterLeave && T.afterLeave();
    };
    if (p.shapeFlag & 1 && T && !T.persisted) {
      const { leave: z, delayLeave: D } = T, M = () => z(E, O);
      D ? D(p.el, O, M) : M();
    } else
      O();
  }, ut = (p, v) => {
    let E;
    for (; p !== v; )
      E = P(p), l(p), p = E;
    l(v);
  }, ot = (p, v, E) => {
    process.env.NODE_ENV !== "production" && p.type.__hmrId && uh(p);
    const { bum: S, scope: T, job: O, subTree: z, um: D, m: M, a: C } = p;
    la(M), la(C), S && Xi(S), T.stop(), O && (O.flags |= 8, Et(z, p, v, E)), D && ne(D, v), ne(() => {
      p.isUnmounted = !0;
    }, v), process.env.NODE_ENV !== "production" && mh(p);
  }, jt = (p, v, E, S = !1, T = !1, O = 0) => {
    for (let z = O; z < p.length; z++)
      Et(p[z], v, E, S, T);
  }, ee = (p) => {
    if (p.shapeFlag & 6)
      return ee(p.component.subTree);
    if (p.shapeFlag & 128)
      return p.suspense.next();
    const v = P(p.anchor || p.el), E = v && v[wh];
    return E ? P(E) : v;
  };
  let mi = !1;
  const gi = (p, v, E) => {
    p == null ? v._vnode && Et(v._vnode, null, null, !0) : I(
      v._vnode || null,
      p,
      v,
      null,
      null,
      null,
      E
    ), v._vnode = p, mi || (mi = !0, Jr(), nl(), mi = !1);
  }, ke = {
    p: I,
    um: Et,
    m: Nt,
    r: bt,
    mt: Ee,
    mc: kt,
    pc: te,
    pbc: xt,
    n: ee,
    o: i
  };
  return {
    render: gi,
    hydrate: void 0,
    createApp: jh(gi)
  };
}
function is({ type: i, props: n }, s) {
  return s === "svg" && i === "foreignObject" || s === "mathml" && i === "annotation-xml" && n && n.encoding && n.encoding.includes("html") ? void 0 : s;
}
function ai({ effect: i, job: n }, s) {
  s ? (i.flags |= 32, n.flags |= 4) : (i.flags &= -33, n.flags &= -5);
}
function cf(i, n) {
  return (!i || i && !i.pendingBranch) && n && !n.persisted;
}
function Yn(i, n, s = !1) {
  const a = i.children, l = n.children;
  if (K(a) && K(l))
    for (let c = 0; c < a.length; c++) {
      const f = a[c];
      let d = l[c];
      d.shapeFlag & 1 && !d.dynamicChildren && ((d.patchFlag <= 0 || d.patchFlag === 32) && (d = l[c] = Ye(l[c]), d.el = f.el), !s && d.patchFlag !== -2 && Yn(f, d)), d.type === wn && // avoid cached text nodes retaining detached dom nodes
      d.patchFlag !== -1 && (d.el = f.el), d.type === ye && !d.el && (d.el = f.el), process.env.NODE_ENV !== "production" && d.el && (d.el.__vnode = d);
    }
}
function hf(i) {
  const n = i.slice(), s = [0];
  let a, l, c, f, d;
  const _ = i.length;
  for (a = 0; a < _; a++) {
    const w = i[a];
    if (w !== 0) {
      if (l = s[s.length - 1], i[l] < w) {
        n[a] = l, s.push(a);
        continue;
      }
      for (c = 0, f = s.length - 1; c < f; )
        d = c + f >> 1, i[s[d]] < w ? c = d + 1 : f = d;
      w < i[s[c]] && (c > 0 && (n[a] = s[c - 1]), s[c] = a);
    }
  }
  for (c = s.length, f = s[c - 1]; c-- > 0; )
    s[c] = f, f = n[f];
  return s;
}
function Ll(i) {
  const n = i.subTree.component;
  if (n)
    return n.asyncDep && !n.asyncResolved ? n : Ll(n);
}
function la(i) {
  if (i)
    for (let n = 0; n < i.length; n++)
      i[n].flags |= 8;
}
const ff = Symbol.for("v-scx"), df = () => {
  {
    const i = qn(ff);
    return i || process.env.NODE_ENV !== "production" && k(
      "Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build."
    ), i;
  }
};
function cn(i, n, s) {
  return process.env.NODE_ENV !== "production" && !q(n) && k(
    "`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature."
  ), Sl(i, n, s);
}
function Sl(i, n, s = dt) {
  const { immediate: a, deep: l, flush: c, once: f } = s;
  process.env.NODE_ENV !== "production" && !n && (a !== void 0 && k(
    'watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'
  ), l !== void 0 && k(
    'watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'
  ), f !== void 0 && k(
    'watch() "once" option is only respected when using the watch(source, callback, options?) signature.'
  ));
  const d = wt({}, s);
  process.env.NODE_ENV !== "production" && (d.onWarn = k);
  const _ = n && a || !n && c !== "post";
  let w;
  if (mn) {
    if (c === "sync") {
      const A = df();
      w = A.__watcherHandles || (A.__watcherHandles = []);
    } else if (!_) {
      const A = () => {
      };
      return A.stop = It, A.resume = It, A.pause = It, A;
    }
  }
  const y = Ht;
  d.call = (A, Z, I) => Ie(A, y, Z, I);
  let g = !1;
  c === "post" ? d.scheduler = (A) => {
    ne(A, y && y.suspense);
  } : c !== "sync" && (g = !0, d.scheduler = (A, Z) => {
    Z ? A() : vo(A);
  }), d.augmentJob = (A) => {
    n && (A.flags |= 4), g && (A.flags |= 2, y && (A.id = y.uid, A.i = y));
  };
  const P = th(i, n, d);
  return mn && (w ? w.push(P) : _ && P()), P;
}
function pf(i, n, s) {
  const a = this.proxy, l = Tt(i) ? i.includes(".") ? Cl(a, i) : () => a[i] : i.bind(a, a);
  let c;
  q(n) ? c = n : (c = n.handler, s = n);
  const f = xn(this), d = Sl(l, c.bind(a), s);
  return f(), d;
}
function Cl(i, n) {
  const s = n.split(".");
  return () => {
    let a = i;
    for (let l = 0; l < s.length && a; l++)
      a = a[s[l]];
    return a;
  };
}
const _f = (i, n) => n === "modelValue" || n === "model-value" ? i.modelModifiers : i[`${n}Modifiers`] || i[`${Xt(n)}Modifiers`] || i[`${oe(n)}Modifiers`];
function mf(i, n, ...s) {
  if (i.isUnmounted) return;
  const a = i.vnode.props || dt;
  if (process.env.NODE_ENV !== "production") {
    const {
      emitsOptions: y,
      propsOptions: [g]
    } = i;
    if (y)
      if (!(n in y))
        (!g || !(ui(Xt(n)) in g)) && k(
          `Component emitted event "${n}" but it is neither declared in the emits option nor as an "${ui(Xt(n))}" prop.`
        );
      else {
        const P = y[n];
        q(P) && (P(...s) || k(
          `Invalid event arguments: event validation failed for event "${n}".`
        ));
      }
  }
  let l = s;
  const c = n.startsWith("update:"), f = c && _f(a, n.slice(7));
  if (f && (f.trim && (l = s.map((y) => Tt(y) ? y.trim() : y)), f.number && (l = s.map(fc))), process.env.NODE_ENV !== "production" && yh(i, n, l), process.env.NODE_ENV !== "production") {
    const y = n.toLowerCase();
    y !== n && a[ui(y)] && k(
      `Event "${y}" is emitted in component ${xo(
        i,
        i.type
      )} but the handler is registered for "${n}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${oe(
        n
      )}" instead of "${n}".`
    );
  }
  let d, _ = a[d = ui(n)] || // also try camelCase event handler (#2249)
  a[d = ui(Xt(n))];
  !_ && c && (_ = a[d = ui(oe(n))]), _ && Ie(
    _,
    i,
    6,
    l
  );
  const w = a[d + "Once"];
  if (w) {
    if (!i.emitted)
      i.emitted = {};
    else if (i.emitted[d])
      return;
    i.emitted[d] = !0, Ie(
      w,
      i,
      6,
      l
    );
  }
}
const gf = /* @__PURE__ */ new WeakMap();
function Ml(i, n, s = !1) {
  const a = s ? gf : n.emitsCache, l = a.get(i);
  if (l !== void 0)
    return l;
  const c = i.emits;
  let f = {}, d = !1;
  if (!q(i)) {
    const _ = (w) => {
      const y = Ml(w, n, !0);
      y && (d = !0, wt(f, y));
    };
    !s && n.mixins.length && n.mixins.forEach(_), i.extends && _(i.extends), i.mixins && i.mixins.forEach(_);
  }
  return !c && !d ? (gt(i) && a.set(i, null), null) : (K(c) ? c.forEach((_) => f[_] = null) : wt(f, c), gt(i) && a.set(i, f), f);
}
function bo(i, n) {
  return !i || !gn(n) ? !1 : (n = n.slice(2).replace(/Once$/, ""), st(i, n[0].toLowerCase() + n.slice(1)) || st(i, oe(n)) || st(i, n));
}
let gs = !1;
function co() {
  gs = !0;
}
function ua(i) {
  const {
    type: n,
    vnode: s,
    proxy: a,
    withProxy: l,
    propsOptions: [c],
    slots: f,
    attrs: d,
    emit: _,
    render: w,
    renderCache: y,
    props: g,
    data: P,
    setupState: A,
    ctx: Z,
    inheritAttrs: I
  } = i, vt = ro(i);
  let _t, J;
  process.env.NODE_ENV !== "production" && (gs = !1);
  try {
    if (s.shapeFlag & 4) {
      const F = l || a, Ot = process.env.NODE_ENV !== "production" && A.__isScriptSetup ? new Proxy(F, {
        get(Wt, Dt, kt) {
          return k(
            `Property '${String(
              Dt
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          ), Reflect.get(Wt, Dt, kt);
        }
      }) : F;
      _t = me(
        w.call(
          Ot,
          F,
          y,
          process.env.NODE_ENV !== "production" ? De(g) : g,
          A,
          P,
          Z
        )
      ), J = d;
    } else {
      const F = n;
      process.env.NODE_ENV !== "production" && d === g && co(), _t = me(
        F.length > 1 ? F(
          process.env.NODE_ENV !== "production" ? De(g) : g,
          process.env.NODE_ENV !== "production" ? {
            get attrs() {
              return co(), De(d);
            },
            slots: f,
            emit: _
          } : { attrs: d, slots: f, emit: _ }
        ) : F(
          process.env.NODE_ENV !== "production" ? De(g) : g,
          null
        )
      ), J = n.props ? d : vf(d);
    }
  } catch (F) {
    hn.length = 0, yn(F, i, 1), _t = Qe(ye);
  }
  let Y = _t, Vt;
  if (process.env.NODE_ENV !== "production" && _t.patchFlag > 0 && _t.patchFlag & 2048 && ([Y, Vt] = Dl(_t)), J && I !== !1) {
    const F = Object.keys(J), { shapeFlag: Ot } = Y;
    if (F.length) {
      if (Ot & 7)
        c && F.some(to) && (J = yf(
          J,
          c
        )), Y = ti(Y, J, !1, !0);
      else if (process.env.NODE_ENV !== "production" && !gs && Y.type !== ye) {
        const Wt = Object.keys(d), Dt = [], kt = [];
        for (let ae = 0, xt = Wt.length; ae < xt; ae++) {
          const yt = Wt[ae];
          gn(yt) ? to(yt) || Dt.push(yt[2].toLowerCase() + yt.slice(3)) : kt.push(yt);
        }
        kt.length && k(
          `Extraneous non-props attributes (${kt.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`
        ), Dt.length && k(
          `Extraneous non-emits event listeners (${Dt.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`
        );
      }
    }
  }
  return s.dirs && (process.env.NODE_ENV !== "production" && !ca(Y) && k(
    "Runtime directive used on component with non-element root node. The directives will not function as intended."
  ), Y = ti(Y, null, !1, !0), Y.dirs = Y.dirs ? Y.dirs.concat(s.dirs) : s.dirs), s.transition && (process.env.NODE_ENV !== "production" && !ca(Y) && k(
    "Component inside <Transition> renders non-element root node that cannot be animated."
  ), Bs(Y, s.transition)), process.env.NODE_ENV !== "production" && Vt ? Vt(Y) : _t = Y, ro(vt), _t;
}
const Dl = (i) => {
  const n = i.children, s = i.dynamicChildren, a = Ws(n, !1);
  if (a) {
    if (process.env.NODE_ENV !== "production" && a.patchFlag > 0 && a.patchFlag & 2048)
      return Dl(a);
  } else return [i, void 0];
  const l = n.indexOf(a), c = s ? s.indexOf(a) : -1, f = (d) => {
    n[l] = d, s && (c > -1 ? s[c] = d : d.patchFlag > 0 && (i.dynamicChildren = [...s, d]));
  };
  return [me(a), f];
};
function Ws(i, n = !0) {
  let s;
  for (let a = 0; a < i.length; a++) {
    const l = i[a];
    if (wo(l)) {
      if (l.type !== ye || l.children === "v-if") {
        if (s)
          return;
        if (s = l, process.env.NODE_ENV !== "production" && n && s.patchFlag > 0 && s.patchFlag & 2048)
          return Ws(s.children);
      }
    } else
      return;
  }
  return s;
}
const vf = (i) => {
  let n;
  for (const s in i)
    (s === "class" || s === "style" || gn(s)) && ((n || (n = {}))[s] = i[s]);
  return n;
}, yf = (i, n) => {
  const s = {};
  for (const a in i)
    (!to(a) || !(a.slice(9) in n)) && (s[a] = i[a]);
  return s;
}, ca = (i) => i.shapeFlag & 7 || i.type === ye;
function bf(i, n, s) {
  const { props: a, children: l, component: c } = i, { props: f, children: d, patchFlag: _ } = n, w = c.emitsOptions;
  if (process.env.NODE_ENV !== "production" && (l || d) && Ae || n.dirs || n.transition)
    return !0;
  if (s && _ >= 0) {
    if (_ & 1024)
      return !0;
    if (_ & 16)
      return a ? ha(a, f, w) : !!f;
    if (_ & 8) {
      const y = n.dynamicProps;
      for (let g = 0; g < y.length; g++) {
        const P = y[g];
        if (f[P] !== a[P] && !bo(w, P))
          return !0;
      }
    }
  } else
    return (l || d) && (!d || !d.$stable) ? !0 : a === f ? !1 : a ? f ? ha(a, f, w) : !0 : !!f;
  return !1;
}
function ha(i, n, s) {
  const a = Object.keys(n);
  if (a.length !== Object.keys(i).length)
    return !0;
  for (let l = 0; l < a.length; l++) {
    const c = a[l];
    if (n[c] !== i[c] && !bo(s, c))
      return !0;
  }
  return !1;
}
function wf({ vnode: i, parent: n }, s) {
  for (; n; ) {
    const a = n.subTree;
    if (a.suspense && a.suspense.activeBranch === i && (a.el = i.el), a === i)
      (i = n.vnode).el = s, n = n.parent;
    else
      break;
  }
}
const Al = (i) => i.__isSuspense;
function xf(i, n) {
  n && n.pendingBranch ? K(i) ? n.effects.push(...i) : n.effects.push(i) : il(i);
}
const Ce = Symbol.for("v-fgt"), wn = Symbol.for("v-txt"), ye = Symbol.for("v-cmt"), Jn = Symbol.for("v-stc"), hn = [];
let re = null;
function Ef(i = !1) {
  hn.push(re = i ? null : []);
}
function Pf() {
  hn.pop(), re = hn[hn.length - 1] || null;
}
let _n = 1;
function fa(i, n = !1) {
  _n += i, i < 0 && re && n && (re.hasOnce = !0);
}
function Of(i) {
  return i.dynamicChildren = _n > 0 ? re || Di : null, Pf(), _n > 0 && re && re.push(i), i;
}
function Tf(i, n, s, a, l, c) {
  return Of(
    kl(
      i,
      n,
      s,
      a,
      l,
      c,
      !0
    )
  );
}
function wo(i) {
  return i ? i.__v_isVNode === !0 : !1;
}
function en(i, n) {
  if (process.env.NODE_ENV !== "production" && n.shapeFlag & 6 && i.component) {
    const s = Gn.get(n.type);
    if (s && s.has(i.component))
      return i.shapeFlag &= -257, n.shapeFlag &= -513, !1;
  }
  return i.type === n.type && i.key === n.key;
}
const Nf = (...i) => zl(
  ...i
), Il = ({ key: i }) => i ?? null, Xn = ({
  ref: i,
  ref_key: n,
  ref_for: s
}) => (typeof i == "number" && (i = "" + i), i != null ? Tt(i) || Mt(i) || q(i) ? { i: se, r: i, k: n, f: !!s } : i : null);
function kl(i, n = null, s = null, a = 0, l = null, c = i === Ce ? 0 : 1, f = !1, d = !1) {
  const _ = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: i,
    props: n,
    key: n && Il(n),
    ref: n && Xn(n),
    scopeId: ll,
    slotScopeIds: null,
    children: s,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: c,
    patchFlag: a,
    dynamicProps: l,
    dynamicChildren: null,
    appContext: null,
    ctx: se
  };
  return d ? (js(_, s), c & 128 && i.normalize(_)) : s && (_.shapeFlag |= Tt(s) ? 8 : 16), process.env.NODE_ENV !== "production" && _.key !== _.key && k("VNode created with invalid key (NaN). VNode type:", _.type), _n > 0 && // avoid a block node from tracking itself
  !f && // has current parent block
  re && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (_.patchFlag > 0 || c & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  _.patchFlag !== 32 && re.push(_), _;
}
const Qe = process.env.NODE_ENV !== "production" ? Nf : zl;
function zl(i, n = null, s = null, a = 0, l = null, c = !1) {
  if ((!i || i === Ih) && (process.env.NODE_ENV !== "production" && !i && k(`Invalid vnode type when creating vnode: ${i}.`), i = ye), wo(i)) {
    const d = ti(
      i,
      n,
      !0
      /* mergeRef: true */
    );
    return s && js(d, s), _n > 0 && !c && re && (d.shapeFlag & 6 ? re[re.indexOf(i)] = d : re.push(d)), d.patchFlag = -2, d;
  }
  if (Hl(i) && (i = i.__vccOpts), n) {
    n = Lf(n);
    let { class: d, style: _ } = n;
    d && !Tt(d) && (n.class = Ls(d)), gt(_) && (io(_) && !K(_) && (_ = wt({}, _)), n.style = Ns(_));
  }
  const f = Tt(i) ? 1 : Al(i) ? 128 : xh(i) ? 64 : gt(i) ? 4 : q(i) ? 2 : 0;
  return process.env.NODE_ENV !== "production" && f & 4 && io(i) && (i = et(i), k(
    "Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.",
    `
Component that was made reactive: `,
    i
  )), kl(
    i,
    n,
    s,
    a,
    l,
    f,
    c,
    !0
  );
}
function Lf(i) {
  return i ? io(i) || xl(i) ? wt({}, i) : i : null;
}
function ti(i, n, s = !1, a = !1) {
  const { props: l, ref: c, patchFlag: f, children: d, transition: _ } = i, w = n ? Cf(l || {}, n) : l, y = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: i.type,
    props: w,
    key: w && Il(w),
    ref: n && n.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      s && c ? K(c) ? c.concat(Xn(n)) : [c, Xn(n)] : Xn(n)
    ) : c,
    scopeId: i.scopeId,
    slotScopeIds: i.slotScopeIds,
    children: process.env.NODE_ENV !== "production" && f === -1 && K(d) ? d.map(Vl) : d,
    target: i.target,
    targetStart: i.targetStart,
    targetAnchor: i.targetAnchor,
    staticCount: i.staticCount,
    shapeFlag: i.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: n && i.type !== Ce ? f === -1 ? 16 : f | 16 : f,
    dynamicProps: i.dynamicProps,
    dynamicChildren: i.dynamicChildren,
    appContext: i.appContext,
    dirs: i.dirs,
    transition: _,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: i.component,
    suspense: i.suspense,
    ssContent: i.ssContent && ti(i.ssContent),
    ssFallback: i.ssFallback && ti(i.ssFallback),
    placeholder: i.placeholder,
    el: i.el,
    anchor: i.anchor,
    ctx: i.ctx,
    ce: i.ce
  };
  return _ && a && Bs(
    y,
    _.clone(y)
  ), y;
}
function Vl(i) {
  const n = ti(i);
  return K(i.children) && (n.children = i.children.map(Vl)), n;
}
function Sf(i = " ", n = 0) {
  return Qe(wn, null, i, n);
}
function me(i) {
  return i == null || typeof i == "boolean" ? Qe(ye) : K(i) ? Qe(
    Ce,
    null,
    // #3666, avoid reference pollution when reusing vnode
    i.slice()
  ) : wo(i) ? Ye(i) : Qe(wn, null, String(i));
}
function Ye(i) {
  return i.el === null && i.patchFlag !== -1 || i.memo ? i : ti(i);
}
function js(i, n) {
  let s = 0;
  const { shapeFlag: a } = i;
  if (n == null)
    n = null;
  else if (K(n))
    s = 16;
  else if (typeof n == "object")
    if (a & 65) {
      const l = n.default;
      l && (l._c && (l._d = !1), js(i, l()), l._c && (l._d = !0));
      return;
    } else {
      s = 32;
      const l = n._;
      !l && !xl(n) ? n._ctx = se : l === 3 && se && (se.slots._ === 1 ? n._ = 1 : (n._ = 2, i.patchFlag |= 1024));
    }
  else q(n) ? (n = { default: n, _ctx: se }, s = 32) : (n = String(n), a & 64 ? (s = 16, n = [Sf(n)]) : s = 8);
  i.children = n, i.shapeFlag |= s;
}
function Cf(...i) {
  const n = {};
  for (let s = 0; s < i.length; s++) {
    const a = i[s];
    for (const l in a)
      if (l === "class")
        n.class !== a.class && (n.class = Ls([n.class, a.class]));
      else if (l === "style")
        n.style = Ns([n.style, a.style]);
      else if (gn(l)) {
        const c = n[l], f = a[l];
        f && c !== f && !(K(c) && c.includes(f)) && (n[l] = c ? [].concat(c, f) : f);
      } else l !== "" && (n[l] = a[l]);
  }
  return n;
}
function Le(i, n, s, a = null) {
  Ie(i, n, 7, [
    s,
    a
  ]);
}
const Mf = yl();
let Df = 0;
function Af(i, n, s) {
  const a = i.type, l = (n ? n.appContext : i.appContext) || Mf, c = {
    uid: Df++,
    vnode: i,
    type: a,
    parent: n,
    appContext: l,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new Oc(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: n ? n.provides : Object.create(l.provides),
    ids: n ? n.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: Pl(a, l),
    emitsOptions: Ml(a, l),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: dt,
    // inheritAttrs
    inheritAttrs: a.inheritAttrs,
    // state
    ctx: dt,
    data: dt,
    props: dt,
    attrs: dt,
    slots: dt,
    refs: dt,
    setupState: dt,
    setupContext: null,
    // suspense related
    suspense: s,
    suspenseId: s ? s.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return process.env.NODE_ENV !== "production" ? c.ctx = kh(c) : c.ctx = { _: c }, c.root = n ? n.root : c, c.emit = mf.bind(null, c), i.ce && i.ce(c), c;
}
let Ht = null;
const Rl = () => Ht || se;
let ho, vs;
{
  const i = vn(), n = (s, a) => {
    let l;
    return (l = i[s]) || (l = i[s] = []), l.push(a), (c) => {
      l.length > 1 ? l.forEach((f) => f(c)) : l[0](c);
    };
  };
  ho = n(
    "__VUE_INSTANCE_SETTERS__",
    (s) => Ht = s
  ), vs = n(
    "__VUE_SSR_SETTERS__",
    (s) => mn = s
  );
}
const xn = (i) => {
  const n = Ht;
  return ho(i), i.scope.on(), () => {
    i.scope.off(), ho(n);
  };
}, da = () => {
  Ht && Ht.scope.off(), ho(null);
}, If = /* @__PURE__ */ je("slot,component");
function ys(i, { isNativeTag: n }) {
  (If(i) || n(i)) && k(
    "Do not use built-in or reserved HTML elements as component id: " + i
  );
}
function Bl(i) {
  return i.vnode.shapeFlag & 4;
}
let mn = !1;
function kf(i, n = !1, s = !1) {
  n && vs(n);
  const { props: a, children: l } = i.vnode, c = Bl(i);
  Kh(i, a, c, n), sf(i, l, s || n);
  const f = c ? zf(i, n) : void 0;
  return n && vs(!1), f;
}
function zf(i, n) {
  var s;
  const a = i.type;
  if (process.env.NODE_ENV !== "production") {
    if (a.name && ys(a.name, i.appContext.config), a.components) {
      const c = Object.keys(a.components);
      for (let f = 0; f < c.length; f++)
        ys(c[f], i.appContext.config);
    }
    if (a.directives) {
      const c = Object.keys(a.directives);
      for (let f = 0; f < c.length; f++)
        ul(c[f]);
    }
    a.compilerOptions && Vf() && k(
      '"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.'
    );
  }
  i.accessCache = /* @__PURE__ */ Object.create(null), i.proxy = new Proxy(i.ctx, ml), process.env.NODE_ENV !== "production" && zh(i);
  const { setup: l } = a;
  if (l) {
    we();
    const c = i.setupContext = l.length > 1 ? Bf(i) : null, f = xn(i), d = Ri(
      l,
      i,
      0,
      [
        process.env.NODE_ENV !== "production" ? De(i.props) : i.props,
        c
      ]
    ), _ = Es(d);
    if (xe(), f(), (_ || i.sp) && !un(i) && hl(i), _) {
      if (d.then(da, da), n)
        return d.then((w) => {
          pa(i, w, n);
        }).catch((w) => {
          yn(w, i, 0);
        });
      if (i.asyncDep = d, process.env.NODE_ENV !== "production" && !i.suspense) {
        const w = (s = a.name) != null ? s : "Anonymous";
        k(
          `Component <${w}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`
        );
      }
    } else
      pa(i, d, n);
  } else
    Zl(i, n);
}
function pa(i, n, s) {
  q(n) ? i.type.__ssrInlineRender ? i.ssrRender = n : i.render = n : gt(n) ? (process.env.NODE_ENV !== "production" && wo(n) && k(
    "setup() should not return VNodes directly - return a render function instead."
  ), process.env.NODE_ENV !== "production" && (i.devtoolsRawSetupState = n), i.setupState = Ja(n), process.env.NODE_ENV !== "production" && Vh(i)) : process.env.NODE_ENV !== "production" && n !== void 0 && k(
    `setup() should return an object. Received: ${n === null ? "null" : typeof n}`
  ), Zl(i, s);
}
const Vf = () => !0;
function Zl(i, n, s) {
  const a = i.type;
  i.render || (i.render = a.render || It);
  {
    const l = xn(i);
    we();
    try {
      Bh(i);
    } finally {
      xe(), l();
    }
  }
  process.env.NODE_ENV !== "production" && !a.render && i.render === It && !n && (a.template ? k(
    'Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".'
  ) : k("Component is missing template or render function: ", a));
}
const _a = process.env.NODE_ENV !== "production" ? {
  get(i, n) {
    return co(), At(i, "get", ""), i[n];
  },
  set() {
    return k("setupContext.attrs is readonly."), !1;
  },
  deleteProperty() {
    return k("setupContext.attrs is readonly."), !1;
  }
} : {
  get(i, n) {
    return At(i, "get", ""), i[n];
  }
};
function Rf(i) {
  return new Proxy(i.slots, {
    get(n, s) {
      return At(i, "get", "$slots"), n[s];
    }
  });
}
function Bf(i) {
  const n = (s) => {
    if (process.env.NODE_ENV !== "production" && (i.exposed && k("expose() should be called only once per setup()."), s != null)) {
      let a = typeof s;
      a === "object" && (K(s) ? a = "array" : Mt(s) && (a = "ref")), a !== "object" && k(
        `expose() should be passed a plain object, received ${a}.`
      );
    }
    i.exposed = s || {};
  };
  if (process.env.NODE_ENV !== "production") {
    let s, a;
    return Object.freeze({
      get attrs() {
        return s || (s = new Proxy(i.attrs, _a));
      },
      get slots() {
        return a || (a = Rf(i));
      },
      get emit() {
        return (l, ...c) => i.emit(l, ...c);
      },
      expose: n
    });
  } else
    return {
      attrs: new Proxy(i.attrs, _a),
      slots: i.slots,
      emit: i.emit,
      expose: n
    };
}
function Us(i) {
  return i.exposed ? i.exposeProxy || (i.exposeProxy = new Proxy(Ja(Uc(i.exposed)), {
    get(n, s) {
      if (s in n)
        return n[s];
      if (s in di)
        return di[s](i);
    },
    has(n, s) {
      return s in n || s in di;
    }
  })) : i.proxy;
}
const Zf = /(?:^|[-_])\w/g, Ff = (i) => i.replace(Zf, (n) => n.toUpperCase()).replace(/[-_]/g, "");
function Fl(i, n = !0) {
  return q(i) ? i.displayName || i.name : i.name || n && i.__name;
}
function xo(i, n, s = !1) {
  let a = Fl(n);
  if (!a && n.__file) {
    const l = n.__file.match(/([^/\\]+)\.\w+$/);
    l && (a = l[1]);
  }
  if (!a && i && i.parent) {
    const l = (c) => {
      for (const f in c)
        if (c[f] === n)
          return f;
    };
    a = l(
      i.components || i.parent.type.components
    ) || l(i.appContext.components);
  }
  return a ? Ff(a) : s ? "App" : "Anonymous";
}
function Hl(i) {
  return q(i) && "__vccOpts" in i;
}
const Hf = (i, n) => {
  const s = Xc(i, n, mn);
  if (process.env.NODE_ENV !== "production") {
    const a = Rl();
    a && a.appContext.config.warnRecursiveComputed && (s._warnRecursive = !0);
  }
  return s;
};
function $f() {
  if (process.env.NODE_ENV === "production" || typeof window > "u")
    return;
  const i = { style: "color:#3ba776" }, n = { style: "color:#1677ff" }, s = { style: "color:#f5222d" }, a = { style: "color:#eb2f96" }, l = {
    __vue_custom_formatter: !0,
    header(g) {
      if (!gt(g))
        return null;
      if (g.__isVue)
        return ["div", i, "VueInstance"];
      if (Mt(g)) {
        we();
        const P = g.value;
        return xe(), [
          "div",
          {},
          ["span", i, y(g)],
          "<",
          d(P),
          ">"
        ];
      } else {
        if (Ii(g))
          return [
            "div",
            {},
            ["span", i, Qt(g) ? "ShallowReactive" : "Reactive"],
            "<",
            d(g),
            `>${We(g) ? " (readonly)" : ""}`
          ];
        if (We(g))
          return [
            "div",
            {},
            ["span", i, Qt(g) ? "ShallowReadonly" : "Readonly"],
            "<",
            d(g),
            ">"
          ];
      }
      return null;
    },
    hasBody(g) {
      return g && g.__isVue;
    },
    body(g) {
      if (g && g.__isVue)
        return [
          "div",
          {},
          ...c(g.$)
        ];
    }
  };
  function c(g) {
    const P = [];
    g.type.props && g.props && P.push(f("props", et(g.props))), g.setupState !== dt && P.push(f("setup", g.setupState)), g.data !== dt && P.push(f("data", et(g.data)));
    const A = _(g, "computed");
    A && P.push(f("computed", A));
    const Z = _(g, "inject");
    return Z && P.push(f("injected", Z)), P.push([
      "div",
      {},
      [
        "span",
        {
          style: a.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: g }]
    ]), P;
  }
  function f(g, P) {
    return P = wt({}, P), Object.keys(P).length ? [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        g
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(P).map((A) => [
          "div",
          {},
          ["span", a, A + ": "],
          d(P[A], !1)
        ])
      ]
    ] : ["span", {}];
  }
  function d(g, P = !0) {
    return typeof g == "number" ? ["span", n, g] : typeof g == "string" ? ["span", s, JSON.stringify(g)] : typeof g == "boolean" ? ["span", a, g] : gt(g) ? ["object", { object: P ? et(g) : g }] : ["span", s, String(g)];
  }
  function _(g, P) {
    const A = g.type;
    if (q(A))
      return;
    const Z = {};
    for (const I in g.ctx)
      w(A, I, P) && (Z[I] = g.ctx[I]);
    return Z;
  }
  function w(g, P, A) {
    const Z = g[A];
    if (K(Z) && Z.includes(P) || gt(Z) && P in Z || g.extends && w(g.extends, P, A) || g.mixins && g.mixins.some((I) => w(I, P, A)))
      return !0;
  }
  function y(g) {
    return Qt(g) ? "ShallowRef" : g.effect ? "ComputedRef" : "Ref";
  }
  window.devtoolsFormatters ? window.devtoolsFormatters.push(l) : window.devtoolsFormatters = [l];
}
const ma = "3.5.22", de = process.env.NODE_ENV !== "production" ? k : It;
process.env.NODE_ENV;
process.env.NODE_ENV;
/**
* @vue/runtime-dom v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let bs;
const ga = typeof window < "u" && window.trustedTypes;
if (ga)
  try {
    bs = /* @__PURE__ */ ga.createPolicy("vue", {
      createHTML: (i) => i
    });
  } catch (i) {
    process.env.NODE_ENV !== "production" && de(`Error creating trusted types policy: ${i}`);
  }
const $l = bs ? (i) => bs.createHTML(i) : (i) => i, Wf = "http://www.w3.org/2000/svg", jf = "http://www.w3.org/1998/Math/MathML", He = typeof document < "u" ? document : null, va = He && /* @__PURE__ */ He.createElement("template"), Uf = {
  insert: (i, n, s) => {
    n.insertBefore(i, s || null);
  },
  remove: (i) => {
    const n = i.parentNode;
    n && n.removeChild(i);
  },
  createElement: (i, n, s, a) => {
    const l = n === "svg" ? He.createElementNS(Wf, i) : n === "mathml" ? He.createElementNS(jf, i) : s ? He.createElement(i, { is: s }) : He.createElement(i);
    return i === "select" && a && a.multiple != null && l.setAttribute("multiple", a.multiple), l;
  },
  createText: (i) => He.createTextNode(i),
  createComment: (i) => He.createComment(i),
  setText: (i, n) => {
    i.nodeValue = n;
  },
  setElementText: (i, n) => {
    i.textContent = n;
  },
  parentNode: (i) => i.parentNode,
  nextSibling: (i) => i.nextSibling,
  querySelector: (i) => He.querySelector(i),
  setScopeId(i, n) {
    i.setAttribute(n, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(i, n, s, a, l, c) {
    const f = s ? s.previousSibling : n.lastChild;
    if (l && (l === c || l.nextSibling))
      for (; n.insertBefore(l.cloneNode(!0), s), !(l === c || !(l = l.nextSibling)); )
        ;
    else {
      va.innerHTML = $l(
        a === "svg" ? `<svg>${i}</svg>` : a === "mathml" ? `<math>${i}</math>` : i
      );
      const d = va.content;
      if (a === "svg" || a === "mathml") {
        const _ = d.firstChild;
        for (; _.firstChild; )
          d.appendChild(_.firstChild);
        d.removeChild(_);
      }
      n.insertBefore(d, s);
    }
    return [
      // first
      f ? f.nextSibling : n.firstChild,
      // last
      s ? s.previousSibling : n.lastChild
    ];
  }
}, Kf = Symbol("_vtc");
function Gf(i, n, s) {
  const a = i[Kf];
  a && (n = (n ? [n, ...a] : [...a]).join(" ")), n == null ? i.removeAttribute("class") : s ? i.setAttribute("class", n) : i.className = n;
}
const ya = Symbol("_vod"), qf = Symbol("_vsh"), Yf = Symbol(process.env.NODE_ENV !== "production" ? "CSS_VAR_TEXT" : ""), Jf = /(?:^|;)\s*display\s*:/;
function Xf(i, n, s) {
  const a = i.style, l = Tt(s);
  let c = !1;
  if (s && !l) {
    if (n)
      if (Tt(n))
        for (const f of n.split(";")) {
          const d = f.slice(0, f.indexOf(":")).trim();
          s[d] == null && Qn(a, d, "");
        }
      else
        for (const f in n)
          s[f] == null && Qn(a, f, "");
    for (const f in s)
      f === "display" && (c = !0), Qn(a, f, s[f]);
  } else if (l) {
    if (n !== s) {
      const f = a[Yf];
      f && (s += ";" + f), a.cssText = s, c = Jf.test(s);
    }
  } else n && i.removeAttribute("style");
  ya in i && (i[ya] = c ? a.display : "", i[qf] && (a.display = "none"));
}
const Qf = /[^\\];\s*$/, ba = /\s*!important$/;
function Qn(i, n, s) {
  if (K(s))
    s.forEach((a) => Qn(i, n, a));
  else if (s == null && (s = ""), process.env.NODE_ENV !== "production" && Qf.test(s) && de(
    `Unexpected semicolon at the end of '${n}' style value: '${s}'`
  ), n.startsWith("--"))
    i.setProperty(n, s);
  else {
    const a = td(i, n);
    ba.test(s) ? i.setProperty(
      oe(a),
      s.replace(ba, ""),
      "important"
    ) : i[a] = s;
  }
}
const wa = ["Webkit", "Moz", "ms"], ns = {};
function td(i, n) {
  const s = ns[n];
  if (s)
    return s;
  let a = Xt(n);
  if (a !== "filter" && a in i)
    return ns[n] = a;
  a = _o(a);
  for (let l = 0; l < wa.length; l++) {
    const c = wa[l] + a;
    if (c in i)
      return ns[n] = c;
  }
  return n;
}
const xa = "http://www.w3.org/1999/xlink";
function Ea(i, n, s, a, l, c = Pc(n)) {
  a && n.startsWith("xlink:") ? s == null ? i.removeAttributeNS(xa, n.slice(6, n.length)) : i.setAttributeNS(xa, n, s) : s == null || c && !Aa(s) ? i.removeAttribute(n) : i.setAttribute(
    n,
    c ? "" : Vi(s) ? String(s) : s
  );
}
function Pa(i, n, s, a, l) {
  if (n === "innerHTML" || n === "textContent") {
    s != null && (i[n] = n === "innerHTML" ? $l(s) : s);
    return;
  }
  const c = i.tagName;
  if (n === "value" && c !== "PROGRESS" && // custom elements may use _value internally
  !c.includes("-")) {
    const d = c === "OPTION" ? i.getAttribute("value") || "" : i.value, _ = s == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      i.type === "checkbox" ? "on" : ""
    ) : String(s);
    (d !== _ || !("_value" in i)) && (i.value = _), s == null && i.removeAttribute(n), i._value = s;
    return;
  }
  let f = !1;
  if (s === "" || s == null) {
    const d = typeof i[n];
    d === "boolean" ? s = Aa(s) : s == null && d === "string" ? (s = "", f = !0) : d === "number" && (s = 0, f = !0);
  }
  try {
    i[n] = s;
  } catch (d) {
    process.env.NODE_ENV !== "production" && !f && de(
      `Failed setting prop "${n}" on <${c.toLowerCase()}>: value ${s} is invalid.`,
      d
    );
  }
  f && i.removeAttribute(l || n);
}
function ed(i, n, s, a) {
  i.addEventListener(n, s, a);
}
function id(i, n, s, a) {
  i.removeEventListener(n, s, a);
}
const Oa = Symbol("_vei");
function nd(i, n, s, a, l = null) {
  const c = i[Oa] || (i[Oa] = {}), f = c[n];
  if (a && f)
    f.value = process.env.NODE_ENV !== "production" ? Na(a, n) : a;
  else {
    const [d, _] = od(n);
    if (a) {
      const w = c[n] = ad(
        process.env.NODE_ENV !== "production" ? Na(a, n) : a,
        l
      );
      ed(i, d, w, _);
    } else f && (id(i, d, f, _), c[n] = void 0);
  }
}
const Ta = /(?:Once|Passive|Capture)$/;
function od(i) {
  let n;
  if (Ta.test(i)) {
    n = {};
    let a;
    for (; a = i.match(Ta); )
      i = i.slice(0, i.length - a[0].length), n[a[0].toLowerCase()] = !0;
  }
  return [i[2] === ":" ? i.slice(3) : oe(i.slice(2)), n];
}
let os = 0;
const sd = /* @__PURE__ */ Promise.resolve(), rd = () => os || (sd.then(() => os = 0), os = Date.now());
function ad(i, n) {
  const s = (a) => {
    if (!a._vts)
      a._vts = Date.now();
    else if (a._vts <= s.attached)
      return;
    Ie(
      ld(a, s.value),
      n,
      5,
      [a]
    );
  };
  return s.value = i, s.attached = rd(), s;
}
function Na(i, n) {
  return q(i) || K(i) ? i : (de(
    `Wrong type passed as event handler to ${n} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof i}.`
  ), It);
}
function ld(i, n) {
  if (K(n)) {
    const s = i.stopImmediatePropagation;
    return i.stopImmediatePropagation = () => {
      s.call(i), i._stopped = !0;
    }, n.map(
      (a) => (l) => !l._stopped && a && a(l)
    );
  } else
    return n;
}
const La = (i) => i.charCodeAt(0) === 111 && i.charCodeAt(1) === 110 && // lowercase letter
i.charCodeAt(2) > 96 && i.charCodeAt(2) < 123, ud = (i, n, s, a, l, c) => {
  const f = l === "svg";
  n === "class" ? Gf(i, a, f) : n === "style" ? Xf(i, s, a) : gn(n) ? to(n) || nd(i, n, s, a, c) : (n[0] === "." ? (n = n.slice(1), !0) : n[0] === "^" ? (n = n.slice(1), !1) : cd(i, n, a, f)) ? (Pa(i, n, a), !i.tagName.includes("-") && (n === "value" || n === "checked" || n === "selected") && Ea(i, n, a, f, c, n !== "value")) : /* #11081 force set props for possible async custom element */ i._isVueCE && (/[A-Z]/.test(n) || !Tt(a)) ? Pa(i, Xt(n), a, c, n) : (n === "true-value" ? i._trueValue = a : n === "false-value" && (i._falseValue = a), Ea(i, n, a, f));
};
function cd(i, n, s, a) {
  if (a)
    return !!(n === "innerHTML" || n === "textContent" || n in i && La(n) && q(s));
  if (n === "spellcheck" || n === "draggable" || n === "translate" || n === "autocorrect" || n === "form" || n === "list" && i.tagName === "INPUT" || n === "type" && i.tagName === "TEXTAREA")
    return !1;
  if (n === "width" || n === "height") {
    const l = i.tagName;
    if (l === "IMG" || l === "VIDEO" || l === "CANVAS" || l === "SOURCE")
      return !1;
  }
  return La(n) && Tt(s) ? !1 : n in i;
}
const Sa = {};
// @__NO_SIDE_EFFECTS__
function hd(i, n, s) {
  let a = /* @__PURE__ */ cl(i, n);
  Os(a) && (a = wt({}, a, n));
  class l extends Ks {
    constructor(f) {
      super(a, f, s);
    }
  }
  return l.def = a, l;
}
const fd = typeof HTMLElement < "u" ? HTMLElement : class {
};
class Ks extends fd {
  constructor(n, s = {}, a = Ma) {
    super(), this._def = n, this._props = s, this._createApp = a, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && a !== Ma ? this._root = this.shadowRoot : (process.env.NODE_ENV !== "production" && this.shadowRoot && de(
      "Custom element has pre-rendered declarative shadow root but is not defined as hydratable. Use `defineSSRCustomElement`."
    ), n.shadowRoot !== !1 ? (this.attachShadow(
      wt({}, n.shadowRootOptions, {
        mode: "open"
      })
    ), this._root = this.shadowRoot) : this._root = this);
  }
  connectedCallback() {
    if (!this.isConnected) return;
    !this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
    let n = this;
    for (; n = n && (n.parentNode || n.host); )
      if (n instanceof Ks) {
        this._parent = n;
        break;
      }
    this._instance || (this._resolved ? this._mount(this._def) : n && n._pendingResolve ? this._pendingResolve = n._pendingResolve.then(() => {
      this._pendingResolve = void 0, this._resolveDef();
    }) : this._resolveDef());
  }
  _setParent(n = this._parent) {
    n && (this._instance.parent = n._instance, this._inheritParentContext(n));
  }
  _inheritParentContext(n = this._parent) {
    n && this._app && Object.setPrototypeOf(
      this._app._context.provides,
      n._instance.provides
    );
  }
  disconnectedCallback() {
    this._connected = !1, tl(() => {
      this._connected || (this._ob && (this._ob.disconnect(), this._ob = null), this._app && this._app.unmount(), this._instance && (this._instance.ce = void 0), this._app = this._instance = null, this._teleportTargets && (this._teleportTargets.clear(), this._teleportTargets = void 0));
    });
  }
  _processMutations(n) {
    for (const s of n)
      this._setAttr(s.attributeName);
  }
  /**
   * resolve inner component definition (handle possible async component)
   */
  _resolveDef() {
    if (this._pendingResolve)
      return;
    for (let a = 0; a < this.attributes.length; a++)
      this._setAttr(this.attributes[a].name);
    this._ob = new MutationObserver(this._processMutations.bind(this)), this._ob.observe(this, { attributes: !0 });
    const n = (a, l = !1) => {
      this._resolved = !0, this._pendingResolve = void 0;
      const { props: c, styles: f } = a;
      let d;
      if (c && !K(c))
        for (const _ in c) {
          const w = c[_];
          (w === Number || w && w.type === Number) && (_ in this._props && (this._props[_] = Ur(this._props[_])), (d || (d = /* @__PURE__ */ Object.create(null)))[Xt(_)] = !0);
        }
      this._numberProps = d, this._resolveProps(a), this.shadowRoot ? this._applyStyles(f) : process.env.NODE_ENV !== "production" && f && de(
        "Custom element style injection is not supported when using shadowRoot: false"
      ), this._mount(a);
    }, s = this._def.__asyncLoader;
    s ? this._pendingResolve = s().then((a) => {
      a.configureApp = this._def.configureApp, n(this._def = a, !0);
    }) : n(this._def);
  }
  _mount(n) {
    process.env.NODE_ENV !== "production" && !n.name && (n.name = "VueElement"), this._app = this._createApp(n), this._inheritParentContext(), n.configureApp && n.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
    const s = this._instance && this._instance.exposed;
    if (s)
      for (const a in s)
        st(this, a) ? process.env.NODE_ENV !== "production" && de(`Exposed property "${a}" already exists on custom element.`) : Object.defineProperty(this, a, {
          // unwrap ref to be consistent with public instance behavior
          get: () => Ya(s[a])
        });
  }
  _resolveProps(n) {
    const { props: s } = n, a = K(s) ? s : Object.keys(s || {});
    for (const l of Object.keys(this))
      l[0] !== "_" && a.includes(l) && this._setProp(l, this[l]);
    for (const l of a.map(Xt))
      Object.defineProperty(this, l, {
        get() {
          return this._getProp(l);
        },
        set(c) {
          this._setProp(l, c, !0, !0);
        }
      });
  }
  _setAttr(n) {
    if (n.startsWith("data-v-")) return;
    const s = this.hasAttribute(n);
    let a = s ? this.getAttribute(n) : Sa;
    const l = Xt(n);
    s && this._numberProps && this._numberProps[l] && (a = Ur(a)), this._setProp(l, a, !1, !0);
  }
  /**
   * @internal
   */
  _getProp(n) {
    return this._props[n];
  }
  /**
   * @internal
   */
  _setProp(n, s, a = !0, l = !1) {
    if (s !== this._props[n] && (s === Sa ? delete this._props[n] : (this._props[n] = s, n === "key" && this._app && (this._app._ceVNode.key = s)), l && this._instance && this._update(), a)) {
      const c = this._ob;
      c && (this._processMutations(c.takeRecords()), c.disconnect()), s === !0 ? this.setAttribute(oe(n), "") : typeof s == "string" || typeof s == "number" ? this.setAttribute(oe(n), s + "") : s || this.removeAttribute(oe(n)), c && c.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const n = this._createVNode();
    this._app && (n.appContext = this._app._context), pd(n, this._root);
  }
  _createVNode() {
    const n = {};
    this.shadowRoot || (n.onVnodeMounted = n.onVnodeUpdated = this._renderSlots.bind(this));
    const s = Qe(this._def, wt(n, this._props));
    return this._instance || (s.ce = (a) => {
      this._instance = a, a.ce = this, a.isCE = !0, process.env.NODE_ENV !== "production" && (a.ceReload = (c) => {
        this._styles && (this._styles.forEach((f) => this._root.removeChild(f)), this._styles.length = 0), this._applyStyles(c), this._instance = null, this._update();
      });
      const l = (c, f) => {
        this.dispatchEvent(
          new CustomEvent(
            c,
            Os(f[0]) ? wt({ detail: f }, f[0]) : { detail: f }
          )
        );
      };
      a.emit = (c, ...f) => {
        l(c, f), oe(c) !== c && l(oe(c), f);
      }, this._setParent();
    }), s;
  }
  _applyStyles(n, s) {
    if (!n) return;
    if (s) {
      if (s === this._def || this._styleChildren.has(s))
        return;
      this._styleChildren.add(s);
    }
    const a = this._nonce;
    for (let l = n.length - 1; l >= 0; l--) {
      const c = document.createElement("style");
      if (a && c.setAttribute("nonce", a), c.textContent = n[l], this.shadowRoot.prepend(c), process.env.NODE_ENV !== "production")
        if (s) {
          if (s.__hmrId) {
            this._childStyles || (this._childStyles = /* @__PURE__ */ new Map());
            let f = this._childStyles.get(s.__hmrId);
            f || this._childStyles.set(s.__hmrId, f = []), f.push(c);
          }
        } else
          (this._styles || (this._styles = [])).push(c);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _parseSlots() {
    const n = this._slots = {};
    let s;
    for (; s = this.firstChild; ) {
      const a = s.nodeType === 1 && s.getAttribute("slot") || "default";
      (n[a] || (n[a] = [])).push(s), this.removeChild(s);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _renderSlots() {
    const n = this._getSlots(), s = this._instance.type.__scopeId;
    for (let a = 0; a < n.length; a++) {
      const l = n[a], c = l.getAttribute("name") || "default", f = this._slots[c], d = l.parentNode;
      if (f)
        for (const _ of f) {
          if (s && _.nodeType === 1) {
            const w = s + "-s", y = document.createTreeWalker(_, 1);
            _.setAttribute(w, "");
            let g;
            for (; g = y.nextNode(); )
              g.setAttribute(w, "");
          }
          d.insertBefore(_, l);
        }
      else
        for (; l.firstChild; ) d.insertBefore(l.firstChild, l);
      d.removeChild(l);
    }
  }
  /**
   * @internal
   */
  _getSlots() {
    const n = [this];
    return this._teleportTargets && n.push(...this._teleportTargets), n.reduce((s, a) => (s.push(...Array.from(a.querySelectorAll("slot"))), s), []);
  }
  /**
   * @internal
   */
  _injectChildStyle(n) {
    this._applyStyles(n.styles, n);
  }
  /**
   * @internal
   */
  _removeChildStyle(n) {
    if (process.env.NODE_ENV !== "production" && (this._styleChildren.delete(n), this._childStyles && n.__hmrId)) {
      const s = this._childStyles.get(n.__hmrId);
      s && (s.forEach((a) => this._root.removeChild(a)), s.length = 0);
    }
  }
}
const dd = /* @__PURE__ */ wt({ patchProp: ud }, Uf);
let Ca;
function Wl() {
  return Ca || (Ca = lf(dd));
}
const pd = (...i) => {
  Wl().render(...i);
}, Ma = (...i) => {
  const n = Wl().createApp(...i);
  process.env.NODE_ENV !== "production" && (md(n), gd(n));
  const { mount: s } = n;
  return n.mount = (a) => {
    const l = vd(a);
    if (!l) return;
    const c = n._component;
    !q(c) && !c.render && !c.template && (c.template = l.innerHTML), l.nodeType === 1 && (l.textContent = "");
    const f = s(l, !1, _d(l));
    return l instanceof Element && (l.removeAttribute("v-cloak"), l.setAttribute("data-v-app", "")), f;
  }, n;
};
function _d(i) {
  if (i instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && i instanceof MathMLElement)
    return "mathml";
}
function md(i) {
  Object.defineProperty(i.config, "isNativeTag", {
    value: (n) => bc(n) || wc(n) || xc(n),
    writable: !1
  });
}
function gd(i) {
  {
    const n = i.config.isCustomElement;
    Object.defineProperty(i.config, "isCustomElement", {
      get() {
        return n;
      },
      set() {
        de(
          "The `isCustomElement` config option is deprecated. Use `compilerOptions.isCustomElement` instead."
        );
      }
    });
    const s = i.config.compilerOptions, a = 'The `compilerOptions` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, `compilerOptions` must be passed to `@vue/compiler-dom` in the build setup instead.\n- For vue-loader: pass it via vue-loader\'s `compilerOptions` loader option.\n- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc';
    Object.defineProperty(i.config, "compilerOptions", {
      get() {
        return de(a), s;
      },
      set() {
        de(a);
      }
    });
  }
}
function vd(i) {
  if (Tt(i)) {
    const n = document.querySelector(i);
    return process.env.NODE_ENV !== "production" && !n && de(
      `Failed to mount app: mount target selector "${i}" returned null.`
    ), n;
  }
  return process.env.NODE_ENV !== "production" && window.ShadowRoot && i instanceof window.ShadowRoot && i.mode === "closed" && de(
    'mounting on a ShadowRoot with `{mode: "closed"}` may lead to unpredictable bugs'
  ), i;
}
/**
* vue v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function yd() {
  $f();
}
process.env.NODE_ENV !== "production" && yd();
var bd = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ws = { exports: {} };
/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
(function(i, n) {
  (function(s, a) {
    a(n);
  })(bd, function(s) {
    var a = "1.9.4";
    function l(t) {
      var e, o, r, u;
      for (o = 1, r = arguments.length; o < r; o++) {
        u = arguments[o];
        for (e in u)
          t[e] = u[e];
      }
      return t;
    }
    var c = Object.create || /* @__PURE__ */ function() {
      function t() {
      }
      return function(e) {
        return t.prototype = e, new t();
      };
    }();
    function f(t, e) {
      var o = Array.prototype.slice;
      if (t.bind)
        return t.bind.apply(t, o.call(arguments, 1));
      var r = o.call(arguments, 2);
      return function() {
        return t.apply(e, r.length ? r.concat(o.call(arguments)) : arguments);
      };
    }
    var d = 0;
    function _(t) {
      return "_leaflet_id" in t || (t._leaflet_id = ++d), t._leaflet_id;
    }
    function w(t, e, o) {
      var r, u, h, m;
      return m = function() {
        r = !1, u && (h.apply(o, u), u = !1);
      }, h = function() {
        r ? u = arguments : (t.apply(o, arguments), setTimeout(m, e), r = !0);
      }, h;
    }
    function y(t, e, o) {
      var r = e[1], u = e[0], h = r - u;
      return t === r && o ? t : ((t - u) % h + h) % h + u;
    }
    function g() {
      return !1;
    }
    function P(t, e) {
      if (e === !1)
        return t;
      var o = Math.pow(10, e === void 0 ? 6 : e);
      return Math.round(t * o) / o;
    }
    function A(t) {
      return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
    }
    function Z(t) {
      return A(t).split(/\s+/);
    }
    function I(t, e) {
      Object.prototype.hasOwnProperty.call(t, "options") || (t.options = t.options ? c(t.options) : {});
      for (var o in e)
        t.options[o] = e[o];
      return t.options;
    }
    function vt(t, e, o) {
      var r = [];
      for (var u in t)
        r.push(encodeURIComponent(o ? u.toUpperCase() : u) + "=" + encodeURIComponent(t[u]));
      return (!e || e.indexOf("?") === -1 ? "?" : "&") + r.join("&");
    }
    var _t = /\{ *([\w_ -]+) *\}/g;
    function J(t, e) {
      return t.replace(_t, function(o, r) {
        var u = e[r];
        if (u === void 0)
          throw new Error("No value provided for variable " + o);
        return typeof u == "function" && (u = u(e)), u;
      });
    }
    var Y = Array.isArray || function(t) {
      return Object.prototype.toString.call(t) === "[object Array]";
    };
    function Vt(t, e) {
      for (var o = 0; o < t.length; o++)
        if (t[o] === e)
          return o;
      return -1;
    }
    var F = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    function Ot(t) {
      return window["webkit" + t] || window["moz" + t] || window["ms" + t];
    }
    var Wt = 0;
    function Dt(t) {
      var e = +/* @__PURE__ */ new Date(), o = Math.max(0, 16 - (e - Wt));
      return Wt = e + o, window.setTimeout(t, o);
    }
    var kt = window.requestAnimationFrame || Ot("RequestAnimationFrame") || Dt, ae = window.cancelAnimationFrame || Ot("CancelAnimationFrame") || Ot("CancelRequestAnimationFrame") || function(t) {
      window.clearTimeout(t);
    };
    function xt(t, e, o) {
      if (o && kt === Dt)
        t.call(e);
      else
        return kt.call(window, f(t, e));
    }
    function yt(t) {
      t && ae.call(window, t);
    }
    var _i = {
      __proto__: null,
      extend: l,
      create: c,
      bind: f,
      get lastId() {
        return d;
      },
      stamp: _,
      throttle: w,
      wrapNum: y,
      falseFn: g,
      formatNum: P,
      trim: A,
      splitWords: Z,
      setOptions: I,
      getParamString: vt,
      template: J,
      isArray: Y,
      indexOf: Vt,
      emptyImageUrl: F,
      requestFn: kt,
      cancelFn: ae,
      requestAnimFrame: xt,
      cancelAnimFrame: yt
    };
    function le() {
    }
    le.extend = function(t) {
      var e = function() {
        I(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
      }, o = e.__super__ = this.prototype, r = c(o);
      r.constructor = e, e.prototype = r;
      for (var u in this)
        Object.prototype.hasOwnProperty.call(this, u) && u !== "prototype" && u !== "__super__" && (e[u] = this[u]);
      return t.statics && l(e, t.statics), t.includes && (Ee(t.includes), l.apply(null, [r].concat(t.includes))), l(r, t), delete r.statics, delete r.includes, r.options && (r.options = o.options ? c(o.options) : {}, l(r.options, t.options)), r._initHooks = [], r.callInitHooks = function() {
        if (!this._initHooksCalled) {
          o.callInitHooks && o.callInitHooks.call(this), this._initHooksCalled = !0;
          for (var h = 0, m = r._initHooks.length; h < m; h++)
            r._initHooks[h].call(this);
        }
      }, e;
    }, le.include = function(t) {
      var e = this.prototype.options;
      return l(this.prototype, t), t.options && (this.prototype.options = e, this.mergeOptions(t.options)), this;
    }, le.mergeOptions = function(t) {
      return l(this.prototype.options, t), this;
    }, le.addInitHook = function(t) {
      var e = Array.prototype.slice.call(arguments, 1), o = typeof t == "function" ? t : function() {
        this[t].apply(this, e);
      };
      return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(o), this;
    };
    function Ee(t) {
      if (!(typeof L > "u" || !L || !L.Mixin)) {
        t = Y(t) ? t : [t];
        for (var e = 0; e < t.length; e++)
          t[e] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
      }
    }
    var pt = {
      /* @method on(type: String, fn: Function, context?: Object): this
       * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
       *
       * @alternative
       * @method on(eventMap: Object): this
       * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
       */
      on: function(t, e, o) {
        if (typeof t == "object")
          for (var r in t)
            this._on(r, t[r], e);
        else {
          t = Z(t);
          for (var u = 0, h = t.length; u < h; u++)
            this._on(t[u], e, o);
        }
        return this;
      },
      /* @method off(type: String, fn?: Function, context?: Object): this
       * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
       *
       * @alternative
       * @method off(eventMap: Object): this
       * Removes a set of type/listener pairs.
       *
       * @alternative
       * @method off: this
       * Removes all listeners to all events on the object. This includes implicitly attached events.
       */
      off: function(t, e, o) {
        if (!arguments.length)
          delete this._events;
        else if (typeof t == "object")
          for (var r in t)
            this._off(r, t[r], e);
        else {
          t = Z(t);
          for (var u = arguments.length === 1, h = 0, m = t.length; h < m; h++)
            u ? this._off(t[h]) : this._off(t[h], e, o);
        }
        return this;
      },
      // attach listener (without syntactic sugar now)
      _on: function(t, e, o, r) {
        if (typeof e != "function") {
          console.warn("wrong listener type: " + typeof e);
          return;
        }
        if (this._listens(t, e, o) === !1) {
          o === this && (o = void 0);
          var u = { fn: e, ctx: o };
          r && (u.once = !0), this._events = this._events || {}, this._events[t] = this._events[t] || [], this._events[t].push(u);
        }
      },
      _off: function(t, e, o) {
        var r, u, h;
        if (this._events && (r = this._events[t], !!r)) {
          if (arguments.length === 1) {
            if (this._firingCount)
              for (u = 0, h = r.length; u < h; u++)
                r[u].fn = g;
            delete this._events[t];
            return;
          }
          if (typeof e != "function") {
            console.warn("wrong listener type: " + typeof e);
            return;
          }
          var m = this._listens(t, e, o);
          if (m !== !1) {
            var b = r[m];
            this._firingCount && (b.fn = g, this._events[t] = r = r.slice()), r.splice(m, 1);
          }
        }
      },
      // @method fire(type: String, data?: Object, propagate?: Boolean): this
      // Fires an event of the specified type. You can optionally provide a data
      // object — the first argument of the listener function will contain its
      // properties. The event can optionally be propagated to event parents.
      fire: function(t, e, o) {
        if (!this.listens(t, o))
          return this;
        var r = l({}, e, {
          type: t,
          target: this,
          sourceTarget: e && e.sourceTarget || this
        });
        if (this._events) {
          var u = this._events[t];
          if (u) {
            this._firingCount = this._firingCount + 1 || 1;
            for (var h = 0, m = u.length; h < m; h++) {
              var b = u[h], x = b.fn;
              b.once && this.off(t, x, b.ctx), x.call(b.ctx || this, r);
            }
            this._firingCount--;
          }
        }
        return o && this._propagateEvent(r), this;
      },
      // @method listens(type: String, propagate?: Boolean): Boolean
      // @method listens(type: String, fn: Function, context?: Object, propagate?: Boolean): Boolean
      // Returns `true` if a particular event type has any listeners attached to it.
      // The verification can optionally be propagated, it will return `true` if parents have the listener attached to it.
      listens: function(t, e, o, r) {
        typeof t != "string" && console.warn('"string" type argument expected');
        var u = e;
        typeof e != "function" && (r = !!e, u = void 0, o = void 0);
        var h = this._events && this._events[t];
        if (h && h.length && this._listens(t, u, o) !== !1)
          return !0;
        if (r) {
          for (var m in this._eventParents)
            if (this._eventParents[m].listens(t, e, o, r))
              return !0;
        }
        return !1;
      },
      // returns the index (number) or false
      _listens: function(t, e, o) {
        if (!this._events)
          return !1;
        var r = this._events[t] || [];
        if (!e)
          return !!r.length;
        o === this && (o = void 0);
        for (var u = 0, h = r.length; u < h; u++)
          if (r[u].fn === e && r[u].ctx === o)
            return u;
        return !1;
      },
      // @method once(…): this
      // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
      once: function(t, e, o) {
        if (typeof t == "object")
          for (var r in t)
            this._on(r, t[r], e, !0);
        else {
          t = Z(t);
          for (var u = 0, h = t.length; u < h; u++)
            this._on(t[u], e, o, !0);
        }
        return this;
      },
      // @method addEventParent(obj: Evented): this
      // Adds an event parent - an `Evented` that will receive propagated events
      addEventParent: function(t) {
        return this._eventParents = this._eventParents || {}, this._eventParents[_(t)] = t, this;
      },
      // @method removeEventParent(obj: Evented): this
      // Removes an event parent, so it will stop receiving propagated events
      removeEventParent: function(t) {
        return this._eventParents && delete this._eventParents[_(t)], this;
      },
      _propagateEvent: function(t) {
        for (var e in this._eventParents)
          this._eventParents[e].fire(t.type, l({
            layer: t.target,
            propagatedFrom: t.target
          }, t), !0);
      }
    };
    pt.addEventListener = pt.on, pt.removeEventListener = pt.clearAllEventListeners = pt.off, pt.addOneTimeEventListener = pt.once, pt.fireEvent = pt.fire, pt.hasEventListeners = pt.listens;
    var Q = le.extend(pt);
    function V(t, e, o) {
      this.x = o ? Math.round(t) : t, this.y = o ? Math.round(e) : e;
    }
    var te = Math.trunc || function(t) {
      return t > 0 ? Math.floor(t) : Math.ceil(t);
    };
    V.prototype = {
      // @method clone(): Point
      // Returns a copy of the current point.
      clone: function() {
        return new V(this.x, this.y);
      },
      // @method add(otherPoint: Point): Point
      // Returns the result of addition of the current and the given points.
      add: function(t) {
        return this.clone()._add(G(t));
      },
      _add: function(t) {
        return this.x += t.x, this.y += t.y, this;
      },
      // @method subtract(otherPoint: Point): Point
      // Returns the result of subtraction of the given point from the current.
      subtract: function(t) {
        return this.clone()._subtract(G(t));
      },
      _subtract: function(t) {
        return this.x -= t.x, this.y -= t.y, this;
      },
      // @method divideBy(num: Number): Point
      // Returns the result of division of the current point by the given number.
      divideBy: function(t) {
        return this.clone()._divideBy(t);
      },
      _divideBy: function(t) {
        return this.x /= t, this.y /= t, this;
      },
      // @method multiplyBy(num: Number): Point
      // Returns the result of multiplication of the current point by the given number.
      multiplyBy: function(t) {
        return this.clone()._multiplyBy(t);
      },
      _multiplyBy: function(t) {
        return this.x *= t, this.y *= t, this;
      },
      // @method scaleBy(scale: Point): Point
      // Multiply each coordinate of the current point by each coordinate of
      // `scale`. In linear algebra terms, multiply the point by the
      // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
      // defined by `scale`.
      scaleBy: function(t) {
        return new V(this.x * t.x, this.y * t.y);
      },
      // @method unscaleBy(scale: Point): Point
      // Inverse of `scaleBy`. Divide each coordinate of the current point by
      // each coordinate of `scale`.
      unscaleBy: function(t) {
        return new V(this.x / t.x, this.y / t.y);
      },
      // @method round(): Point
      // Returns a copy of the current point with rounded coordinates.
      round: function() {
        return this.clone()._round();
      },
      _round: function() {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
      },
      // @method floor(): Point
      // Returns a copy of the current point with floored coordinates (rounded down).
      floor: function() {
        return this.clone()._floor();
      },
      _floor: function() {
        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
      },
      // @method ceil(): Point
      // Returns a copy of the current point with ceiled coordinates (rounded up).
      ceil: function() {
        return this.clone()._ceil();
      },
      _ceil: function() {
        return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
      },
      // @method trunc(): Point
      // Returns a copy of the current point with truncated coordinates (rounded towards zero).
      trunc: function() {
        return this.clone()._trunc();
      },
      _trunc: function() {
        return this.x = te(this.x), this.y = te(this.y), this;
      },
      // @method distanceTo(otherPoint: Point): Number
      // Returns the cartesian distance between the current and the given points.
      distanceTo: function(t) {
        t = G(t);
        var e = t.x - this.x, o = t.y - this.y;
        return Math.sqrt(e * e + o * o);
      },
      // @method equals(otherPoint: Point): Boolean
      // Returns `true` if the given point has the same coordinates.
      equals: function(t) {
        return t = G(t), t.x === this.x && t.y === this.y;
      },
      // @method contains(otherPoint: Point): Boolean
      // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
      contains: function(t) {
        return t = G(t), Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y);
      },
      // @method toString(): String
      // Returns a string representation of the point for debugging purposes.
      toString: function() {
        return "Point(" + P(this.x) + ", " + P(this.y) + ")";
      }
    };
    function G(t, e, o) {
      return t instanceof V ? t : Y(t) ? new V(t[0], t[1]) : t == null ? t : typeof t == "object" && "x" in t && "y" in t ? new V(t.x, t.y) : new V(t, e, o);
    }
    function ft(t, e) {
      if (t)
        for (var o = e ? [t, e] : t, r = 0, u = o.length; r < u; r++)
          this.extend(o[r]);
    }
    ft.prototype = {
      // @method extend(point: Point): this
      // Extends the bounds to contain the given point.
      // @alternative
      // @method extend(otherBounds: Bounds): this
      // Extend the bounds to contain the given bounds
      extend: function(t) {
        var e, o;
        if (!t)
          return this;
        if (t instanceof V || typeof t[0] == "number" || "x" in t)
          e = o = G(t);
        else if (t = Nt(t), e = t.min, o = t.max, !e || !o)
          return this;
        return !this.min && !this.max ? (this.min = e.clone(), this.max = o.clone()) : (this.min.x = Math.min(e.x, this.min.x), this.max.x = Math.max(o.x, this.max.x), this.min.y = Math.min(e.y, this.min.y), this.max.y = Math.max(o.y, this.max.y)), this;
      },
      // @method getCenter(round?: Boolean): Point
      // Returns the center point of the bounds.
      getCenter: function(t) {
        return G(
          (this.min.x + this.max.x) / 2,
          (this.min.y + this.max.y) / 2,
          t
        );
      },
      // @method getBottomLeft(): Point
      // Returns the bottom-left point of the bounds.
      getBottomLeft: function() {
        return G(this.min.x, this.max.y);
      },
      // @method getTopRight(): Point
      // Returns the top-right point of the bounds.
      getTopRight: function() {
        return G(this.max.x, this.min.y);
      },
      // @method getTopLeft(): Point
      // Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
      getTopLeft: function() {
        return this.min;
      },
      // @method getBottomRight(): Point
      // Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
      getBottomRight: function() {
        return this.max;
      },
      // @method getSize(): Point
      // Returns the size of the given bounds
      getSize: function() {
        return this.max.subtract(this.min);
      },
      // @method contains(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle contains the given one.
      // @alternative
      // @method contains(point: Point): Boolean
      // Returns `true` if the rectangle contains the given point.
      contains: function(t) {
        var e, o;
        return typeof t[0] == "number" || t instanceof V ? t = G(t) : t = Nt(t), t instanceof ft ? (e = t.min, o = t.max) : e = o = t, e.x >= this.min.x && o.x <= this.max.x && e.y >= this.min.y && o.y <= this.max.y;
      },
      // @method intersects(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds
      // intersect if they have at least one point in common.
      intersects: function(t) {
        t = Nt(t);
        var e = this.min, o = this.max, r = t.min, u = t.max, h = u.x >= e.x && r.x <= o.x, m = u.y >= e.y && r.y <= o.y;
        return h && m;
      },
      // @method overlaps(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds
      // overlap if their intersection is an area.
      overlaps: function(t) {
        t = Nt(t);
        var e = this.min, o = this.max, r = t.min, u = t.max, h = u.x > e.x && r.x < o.x, m = u.y > e.y && r.y < o.y;
        return h && m;
      },
      // @method isValid(): Boolean
      // Returns `true` if the bounds are properly initialized.
      isValid: function() {
        return !!(this.min && this.max);
      },
      // @method pad(bufferRatio: Number): Bounds
      // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
      // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
      // Negative values will retract the bounds.
      pad: function(t) {
        var e = this.min, o = this.max, r = Math.abs(e.x - o.x) * t, u = Math.abs(e.y - o.y) * t;
        return Nt(
          G(e.x - r, e.y - u),
          G(o.x + r, o.y + u)
        );
      },
      // @method equals(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle is equivalent to the given bounds.
      equals: function(t) {
        return t ? (t = Nt(t), this.min.equals(t.getTopLeft()) && this.max.equals(t.getBottomRight())) : !1;
      }
    };
    function Nt(t, e) {
      return !t || t instanceof ft ? t : new ft(t, e);
    }
    function Et(t, e) {
      if (t)
        for (var o = e ? [t, e] : t, r = 0, u = o.length; r < u; r++)
          this.extend(o[r]);
    }
    Et.prototype = {
      // @method extend(latlng: LatLng): this
      // Extend the bounds to contain the given point
      // @alternative
      // @method extend(otherBounds: LatLngBounds): this
      // Extend the bounds to contain the given bounds
      extend: function(t) {
        var e = this._southWest, o = this._northEast, r, u;
        if (t instanceof ut)
          r = t, u = t;
        else if (t instanceof Et) {
          if (r = t._southWest, u = t._northEast, !r || !u)
            return this;
        } else
          return t ? this.extend(ot(t) || bt(t)) : this;
        return !e && !o ? (this._southWest = new ut(r.lat, r.lng), this._northEast = new ut(u.lat, u.lng)) : (e.lat = Math.min(r.lat, e.lat), e.lng = Math.min(r.lng, e.lng), o.lat = Math.max(u.lat, o.lat), o.lng = Math.max(u.lng, o.lng)), this;
      },
      // @method pad(bufferRatio: Number): LatLngBounds
      // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
      // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
      // Negative values will retract the bounds.
      pad: function(t) {
        var e = this._southWest, o = this._northEast, r = Math.abs(e.lat - o.lat) * t, u = Math.abs(e.lng - o.lng) * t;
        return new Et(
          new ut(e.lat - r, e.lng - u),
          new ut(o.lat + r, o.lng + u)
        );
      },
      // @method getCenter(): LatLng
      // Returns the center point of the bounds.
      getCenter: function() {
        return new ut(
          (this._southWest.lat + this._northEast.lat) / 2,
          (this._southWest.lng + this._northEast.lng) / 2
        );
      },
      // @method getSouthWest(): LatLng
      // Returns the south-west point of the bounds.
      getSouthWest: function() {
        return this._southWest;
      },
      // @method getNorthEast(): LatLng
      // Returns the north-east point of the bounds.
      getNorthEast: function() {
        return this._northEast;
      },
      // @method getNorthWest(): LatLng
      // Returns the north-west point of the bounds.
      getNorthWest: function() {
        return new ut(this.getNorth(), this.getWest());
      },
      // @method getSouthEast(): LatLng
      // Returns the south-east point of the bounds.
      getSouthEast: function() {
        return new ut(this.getSouth(), this.getEast());
      },
      // @method getWest(): Number
      // Returns the west longitude of the bounds
      getWest: function() {
        return this._southWest.lng;
      },
      // @method getSouth(): Number
      // Returns the south latitude of the bounds
      getSouth: function() {
        return this._southWest.lat;
      },
      // @method getEast(): Number
      // Returns the east longitude of the bounds
      getEast: function() {
        return this._northEast.lng;
      },
      // @method getNorth(): Number
      // Returns the north latitude of the bounds
      getNorth: function() {
        return this._northEast.lat;
      },
      // @method contains(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle contains the given one.
      // @alternative
      // @method contains (latlng: LatLng): Boolean
      // Returns `true` if the rectangle contains the given point.
      contains: function(t) {
        typeof t[0] == "number" || t instanceof ut || "lat" in t ? t = ot(t) : t = bt(t);
        var e = this._southWest, o = this._northEast, r, u;
        return t instanceof Et ? (r = t.getSouthWest(), u = t.getNorthEast()) : r = u = t, r.lat >= e.lat && u.lat <= o.lat && r.lng >= e.lng && u.lng <= o.lng;
      },
      // @method intersects(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
      intersects: function(t) {
        t = bt(t);
        var e = this._southWest, o = this._northEast, r = t.getSouthWest(), u = t.getNorthEast(), h = u.lat >= e.lat && r.lat <= o.lat, m = u.lng >= e.lng && r.lng <= o.lng;
        return h && m;
      },
      // @method overlaps(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
      overlaps: function(t) {
        t = bt(t);
        var e = this._southWest, o = this._northEast, r = t.getSouthWest(), u = t.getNorthEast(), h = u.lat > e.lat && r.lat < o.lat, m = u.lng > e.lng && r.lng < o.lng;
        return h && m;
      },
      // @method toBBoxString(): String
      // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
      toBBoxString: function() {
        return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
      },
      // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
      // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(t, e) {
        return t ? (t = bt(t), this._southWest.equals(t.getSouthWest(), e) && this._northEast.equals(t.getNorthEast(), e)) : !1;
      },
      // @method isValid(): Boolean
      // Returns `true` if the bounds are properly initialized.
      isValid: function() {
        return !!(this._southWest && this._northEast);
      }
    };
    function bt(t, e) {
      return t instanceof Et ? t : new Et(t, e);
    }
    function ut(t, e, o) {
      if (isNaN(t) || isNaN(e))
        throw new Error("Invalid LatLng object: (" + t + ", " + e + ")");
      this.lat = +t, this.lng = +e, o !== void 0 && (this.alt = +o);
    }
    ut.prototype = {
      // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
      // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(t, e) {
        if (!t)
          return !1;
        t = ot(t);
        var o = Math.max(
          Math.abs(this.lat - t.lat),
          Math.abs(this.lng - t.lng)
        );
        return o <= (e === void 0 ? 1e-9 : e);
      },
      // @method toString(): String
      // Returns a string representation of the point (for debugging purposes).
      toString: function(t) {
        return "LatLng(" + P(this.lat, t) + ", " + P(this.lng, t) + ")";
      },
      // @method distanceTo(otherLatLng: LatLng): Number
      // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
      distanceTo: function(t) {
        return ee.distance(this, ot(t));
      },
      // @method wrap(): LatLng
      // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
      wrap: function() {
        return ee.wrapLatLng(this);
      },
      // @method toBounds(sizeInMeters: Number): LatLngBounds
      // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
      toBounds: function(t) {
        var e = 180 * t / 40075017, o = e / Math.cos(Math.PI / 180 * this.lat);
        return bt(
          [this.lat - e, this.lng - o],
          [this.lat + e, this.lng + o]
        );
      },
      clone: function() {
        return new ut(this.lat, this.lng, this.alt);
      }
    };
    function ot(t, e, o) {
      return t instanceof ut ? t : Y(t) && typeof t[0] != "object" ? t.length === 3 ? new ut(t[0], t[1], t[2]) : t.length === 2 ? new ut(t[0], t[1]) : null : t == null ? t : typeof t == "object" && "lat" in t ? new ut(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : e === void 0 ? null : new ut(t, e, o);
    }
    var jt = {
      // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
      // Projects geographical coordinates into pixel coordinates for a given zoom.
      latLngToPoint: function(t, e) {
        var o = this.projection.project(t), r = this.scale(e);
        return this.transformation._transform(o, r);
      },
      // @method pointToLatLng(point: Point, zoom: Number): LatLng
      // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
      // zoom into geographical coordinates.
      pointToLatLng: function(t, e) {
        var o = this.scale(e), r = this.transformation.untransform(t, o);
        return this.projection.unproject(r);
      },
      // @method project(latlng: LatLng): Point
      // Projects geographical coordinates into coordinates in units accepted for
      // this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
      project: function(t) {
        return this.projection.project(t);
      },
      // @method unproject(point: Point): LatLng
      // Given a projected coordinate returns the corresponding LatLng.
      // The inverse of `project`.
      unproject: function(t) {
        return this.projection.unproject(t);
      },
      // @method scale(zoom: Number): Number
      // Returns the scale used when transforming projected coordinates into
      // pixel coordinates for a particular zoom. For example, it returns
      // `256 * 2^zoom` for Mercator-based CRS.
      scale: function(t) {
        return 256 * Math.pow(2, t);
      },
      // @method zoom(scale: Number): Number
      // Inverse of `scale()`, returns the zoom level corresponding to a scale
      // factor of `scale`.
      zoom: function(t) {
        return Math.log(t / 256) / Math.LN2;
      },
      // @method getProjectedBounds(zoom: Number): Bounds
      // Returns the projection's bounds scaled and transformed for the provided `zoom`.
      getProjectedBounds: function(t) {
        if (this.infinite)
          return null;
        var e = this.projection.bounds, o = this.scale(t), r = this.transformation.transform(e.min, o), u = this.transformation.transform(e.max, o);
        return new ft(r, u);
      },
      // @method distance(latlng1: LatLng, latlng2: LatLng): Number
      // Returns the distance between two geographical coordinates.
      // @property code: String
      // Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
      //
      // @property wrapLng: Number[]
      // An array of two numbers defining whether the longitude (horizontal) coordinate
      // axis wraps around a given range and how. Defaults to `[-180, 180]` in most
      // geographical CRSs. If `undefined`, the longitude axis does not wrap around.
      //
      // @property wrapLat: Number[]
      // Like `wrapLng`, but for the latitude (vertical) axis.
      // wrapLng: [min, max],
      // wrapLat: [min, max],
      // @property infinite: Boolean
      // If true, the coordinate space will be unbounded (infinite in both axes)
      infinite: !1,
      // @method wrapLatLng(latlng: LatLng): LatLng
      // Returns a `LatLng` where lat and lng has been wrapped according to the
      // CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
      wrapLatLng: function(t) {
        var e = this.wrapLng ? y(t.lng, this.wrapLng, !0) : t.lng, o = this.wrapLat ? y(t.lat, this.wrapLat, !0) : t.lat, r = t.alt;
        return new ut(o, e, r);
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring
      // that its center is within the CRS's bounds.
      // Only accepts actual `L.LatLngBounds` instances, not arrays.
      wrapLatLngBounds: function(t) {
        var e = t.getCenter(), o = this.wrapLatLng(e), r = e.lat - o.lat, u = e.lng - o.lng;
        if (r === 0 && u === 0)
          return t;
        var h = t.getSouthWest(), m = t.getNorthEast(), b = new ut(h.lat - r, h.lng - u), x = new ut(m.lat - r, m.lng - u);
        return new Et(b, x);
      }
    }, ee = l({}, jt, {
      wrapLng: [-180, 180],
      // Mean Earth Radius, as recommended for use by
      // the International Union of Geodesy and Geophysics,
      // see https://rosettacode.org/wiki/Haversine_formula
      R: 6371e3,
      // distance between two geographical points using spherical law of cosines approximation
      distance: function(t, e) {
        var o = Math.PI / 180, r = t.lat * o, u = e.lat * o, h = Math.sin((e.lat - t.lat) * o / 2), m = Math.sin((e.lng - t.lng) * o / 2), b = h * h + Math.cos(r) * Math.cos(u) * m * m, x = 2 * Math.atan2(Math.sqrt(b), Math.sqrt(1 - b));
        return this.R * x;
      }
    }), mi = 6378137, gi = {
      R: mi,
      MAX_LATITUDE: 85.0511287798,
      project: function(t) {
        var e = Math.PI / 180, o = this.MAX_LATITUDE, r = Math.max(Math.min(o, t.lat), -o), u = Math.sin(r * e);
        return new V(
          this.R * t.lng * e,
          this.R * Math.log((1 + u) / (1 - u)) / 2
        );
      },
      unproject: function(t) {
        var e = 180 / Math.PI;
        return new ut(
          (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * e,
          t.x * e / this.R
        );
      },
      bounds: function() {
        var t = mi * Math.PI;
        return new ft([-t, -t], [t, t]);
      }()
    };
    function ke(t, e, o, r) {
      if (Y(t)) {
        this._a = t[0], this._b = t[1], this._c = t[2], this._d = t[3];
        return;
      }
      this._a = t, this._b = e, this._c = o, this._d = r;
    }
    ke.prototype = {
      // @method transform(point: Point, scale?: Number): Point
      // Returns a transformed point, optionally multiplied by the given scale.
      // Only accepts actual `L.Point` instances, not arrays.
      transform: function(t, e) {
        return this._transform(t.clone(), e);
      },
      // destructive transform (faster)
      _transform: function(t, e) {
        return e = e || 1, t.x = e * (this._a * t.x + this._b), t.y = e * (this._c * t.y + this._d), t;
      },
      // @method untransform(point: Point, scale?: Number): Point
      // Returns the reverse transformation of the given point, optionally divided
      // by the given scale. Only accepts actual `L.Point` instances, not arrays.
      untransform: function(t, e) {
        return e = e || 1, new V(
          (t.x / e - this._b) / this._a,
          (t.y / e - this._d) / this._c
        );
      }
    };
    function vi(t, e, o, r) {
      return new ke(t, e, o, r);
    }
    var p = l({}, ee, {
      code: "EPSG:3857",
      projection: gi,
      transformation: function() {
        var t = 0.5 / (Math.PI * gi.R);
        return vi(t, 0.5, -t, 0.5);
      }()
    }), v = l({}, p, {
      code: "EPSG:900913"
    });
    function E(t) {
      return document.createElementNS("http://www.w3.org/2000/svg", t);
    }
    function S(t, e) {
      var o = "", r, u, h, m, b, x;
      for (r = 0, h = t.length; r < h; r++) {
        for (b = t[r], u = 0, m = b.length; u < m; u++)
          x = b[u], o += (u ? "L" : "M") + x.x + " " + x.y;
        o += e ? H.svg ? "z" : "x" : "";
      }
      return o || "M0 0";
    }
    var T = document.documentElement.style, O = "ActiveXObject" in window, z = O && !document.addEventListener, D = "msLaunchUri" in navigator && !("documentMode" in document), M = Pe("webkit"), C = Pe("android"), W = Pe("android 2") || Pe("android 3"), R = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), $ = C && Pe("Google") && R < 537 && !("AudioNode" in window), j = !!window.opera, nt = !D && Pe("chrome"), ct = Pe("gecko") && !M && !j && !O, lt = !nt && Pe("safari"), Rt = Pe("phantom"), Bt = "OTransition" in T, ue = navigator.platform.indexOf("Win") === 0, ie = O && "transition" in T, ze = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !W, Bi = "MozPerspective" in T, Zt = !window.L_DISABLE_3D && (ie || ze || Bi) && !Bt && !Rt, $t = typeof orientation < "u" || Pe("mobile"), En = $t && M, Pn = $t && ze, Gs = !window.PointerEvent && window.MSPointerEvent, qs = !!(window.PointerEvent || Gs), Ys = "ontouchstart" in window || !!window.TouchEvent, jl = !window.L_NO_TOUCH && (Ys || qs), Ul = $t && j, Kl = $t && ct, Gl = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, ql = function() {
      var t = !1;
      try {
        var e = Object.defineProperty({}, "passive", {
          get: function() {
            t = !0;
          }
        });
        window.addEventListener("testPassiveEventSupport", g, e), window.removeEventListener("testPassiveEventSupport", g, e);
      } catch {
      }
      return t;
    }(), Yl = function() {
      return !!document.createElement("canvas").getContext;
    }(), Eo = !!(document.createElementNS && E("svg").createSVGRect), Jl = !!Eo && function() {
      var t = document.createElement("div");
      return t.innerHTML = "<svg/>", (t.firstChild && t.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
    }(), Xl = !Eo && function() {
      try {
        var t = document.createElement("div");
        t.innerHTML = '<v:shape adj="1"/>';
        var e = t.firstChild;
        return e.style.behavior = "url(#default#VML)", e && typeof e.adj == "object";
      } catch {
        return !1;
      }
    }(), Ql = navigator.platform.indexOf("Mac") === 0, tu = navigator.platform.indexOf("Linux") === 0;
    function Pe(t) {
      return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
    }
    var H = {
      ie: O,
      ielt9: z,
      edge: D,
      webkit: M,
      android: C,
      android23: W,
      androidStock: $,
      opera: j,
      chrome: nt,
      gecko: ct,
      safari: lt,
      phantom: Rt,
      opera12: Bt,
      win: ue,
      ie3d: ie,
      webkit3d: ze,
      gecko3d: Bi,
      any3d: Zt,
      mobile: $t,
      mobileWebkit: En,
      mobileWebkit3d: Pn,
      msPointer: Gs,
      pointer: qs,
      touch: jl,
      touchNative: Ys,
      mobileOpera: Ul,
      mobileGecko: Kl,
      retina: Gl,
      passiveEvents: ql,
      canvas: Yl,
      svg: Eo,
      vml: Xl,
      inlineSvg: Jl,
      mac: Ql,
      linux: tu
    }, Js = H.msPointer ? "MSPointerDown" : "pointerdown", Xs = H.msPointer ? "MSPointerMove" : "pointermove", Qs = H.msPointer ? "MSPointerUp" : "pointerup", tr = H.msPointer ? "MSPointerCancel" : "pointercancel", Po = {
      touchstart: Js,
      touchmove: Xs,
      touchend: Qs,
      touchcancel: tr
    }, er = {
      touchstart: ru,
      touchmove: On,
      touchend: On,
      touchcancel: On
    }, yi = {}, ir = !1;
    function eu(t, e, o) {
      return e === "touchstart" && su(), er[e] ? (o = er[e].bind(this, o), t.addEventListener(Po[e], o, !1), o) : (console.warn("wrong event specified:", e), g);
    }
    function iu(t, e, o) {
      if (!Po[e]) {
        console.warn("wrong event specified:", e);
        return;
      }
      t.removeEventListener(Po[e], o, !1);
    }
    function nu(t) {
      yi[t.pointerId] = t;
    }
    function ou(t) {
      yi[t.pointerId] && (yi[t.pointerId] = t);
    }
    function nr(t) {
      delete yi[t.pointerId];
    }
    function su() {
      ir || (document.addEventListener(Js, nu, !0), document.addEventListener(Xs, ou, !0), document.addEventListener(Qs, nr, !0), document.addEventListener(tr, nr, !0), ir = !0);
    }
    function On(t, e) {
      if (e.pointerType !== (e.MSPOINTER_TYPE_MOUSE || "mouse")) {
        e.touches = [];
        for (var o in yi)
          e.touches.push(yi[o]);
        e.changedTouches = [e], t(e);
      }
    }
    function ru(t, e) {
      e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH && Ft(e), On(t, e);
    }
    function au(t) {
      var e = {}, o, r;
      for (r in t)
        o = t[r], e[r] = o && o.bind ? o.bind(t) : o;
      return t = e, e.type = "dblclick", e.detail = 2, e.isTrusted = !1, e._simulated = !0, e;
    }
    var lu = 200;
    function uu(t, e) {
      t.addEventListener("dblclick", e);
      var o = 0, r;
      function u(h) {
        if (h.detail !== 1) {
          r = h.detail;
          return;
        }
        if (!(h.pointerType === "mouse" || h.sourceCapabilities && !h.sourceCapabilities.firesTouchEvents)) {
          var m = lr(h);
          if (!(m.some(function(x) {
            return x instanceof HTMLLabelElement && x.attributes.for;
          }) && !m.some(function(x) {
            return x instanceof HTMLInputElement || x instanceof HTMLSelectElement;
          }))) {
            var b = Date.now();
            b - o <= lu ? (r++, r === 2 && e(au(h))) : r = 1, o = b;
          }
        }
      }
      return t.addEventListener("click", u), {
        dblclick: e,
        simDblclick: u
      };
    }
    function cu(t, e) {
      t.removeEventListener("dblclick", e.dblclick), t.removeEventListener("click", e.simDblclick);
    }
    var Oo = Ln(
      ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
    ), Zi = Ln(
      ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
    ), or = Zi === "webkitTransition" || Zi === "OTransition" ? Zi + "End" : "transitionend";
    function sr(t) {
      return typeof t == "string" ? document.getElementById(t) : t;
    }
    function Fi(t, e) {
      var o = t.style[e] || t.currentStyle && t.currentStyle[e];
      if ((!o || o === "auto") && document.defaultView) {
        var r = document.defaultView.getComputedStyle(t, null);
        o = r ? r[e] : null;
      }
      return o === "auto" ? null : o;
    }
    function at(t, e, o) {
      var r = document.createElement(t);
      return r.className = e || "", o && o.appendChild(r), r;
    }
    function Pt(t) {
      var e = t.parentNode;
      e && e.removeChild(t);
    }
    function Tn(t) {
      for (; t.firstChild; )
        t.removeChild(t.firstChild);
    }
    function bi(t) {
      var e = t.parentNode;
      e && e.lastChild !== t && e.appendChild(t);
    }
    function wi(t) {
      var e = t.parentNode;
      e && e.firstChild !== t && e.insertBefore(t, e.firstChild);
    }
    function To(t, e) {
      if (t.classList !== void 0)
        return t.classList.contains(e);
      var o = Nn(t);
      return o.length > 0 && new RegExp("(^|\\s)" + e + "(\\s|$)").test(o);
    }
    function tt(t, e) {
      if (t.classList !== void 0)
        for (var o = Z(e), r = 0, u = o.length; r < u; r++)
          t.classList.add(o[r]);
      else if (!To(t, e)) {
        var h = Nn(t);
        No(t, (h ? h + " " : "") + e);
      }
    }
    function Lt(t, e) {
      t.classList !== void 0 ? t.classList.remove(e) : No(t, A((" " + Nn(t) + " ").replace(" " + e + " ", " ")));
    }
    function No(t, e) {
      t.className.baseVal === void 0 ? t.className = e : t.className.baseVal = e;
    }
    function Nn(t) {
      return t.correspondingElement && (t = t.correspondingElement), t.className.baseVal === void 0 ? t.className : t.className.baseVal;
    }
    function ce(t, e) {
      "opacity" in t.style ? t.style.opacity = e : "filter" in t.style && hu(t, e);
    }
    function hu(t, e) {
      var o = !1, r = "DXImageTransform.Microsoft.Alpha";
      try {
        o = t.filters.item(r);
      } catch {
        if (e === 1)
          return;
      }
      e = Math.round(e * 100), o ? (o.Enabled = e !== 100, o.Opacity = e) : t.style.filter += " progid:" + r + "(opacity=" + e + ")";
    }
    function Ln(t) {
      for (var e = document.documentElement.style, o = 0; o < t.length; o++)
        if (t[o] in e)
          return t[o];
      return !1;
    }
    function ei(t, e, o) {
      var r = e || new V(0, 0);
      t.style[Oo] = (H.ie3d ? "translate(" + r.x + "px," + r.y + "px)" : "translate3d(" + r.x + "px," + r.y + "px,0)") + (o ? " scale(" + o + ")" : "");
    }
    function St(t, e) {
      t._leaflet_pos = e, H.any3d ? ei(t, e) : (t.style.left = e.x + "px", t.style.top = e.y + "px");
    }
    function ii(t) {
      return t._leaflet_pos || new V(0, 0);
    }
    var Hi, $i, Lo;
    if ("onselectstart" in document)
      Hi = function() {
        X(window, "selectstart", Ft);
      }, $i = function() {
        mt(window, "selectstart", Ft);
      };
    else {
      var Wi = Ln(
        ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
      );
      Hi = function() {
        if (Wi) {
          var t = document.documentElement.style;
          Lo = t[Wi], t[Wi] = "none";
        }
      }, $i = function() {
        Wi && (document.documentElement.style[Wi] = Lo, Lo = void 0);
      };
    }
    function So() {
      X(window, "dragstart", Ft);
    }
    function Co() {
      mt(window, "dragstart", Ft);
    }
    var Sn, Mo;
    function Do(t) {
      for (; t.tabIndex === -1; )
        t = t.parentNode;
      t.style && (Cn(), Sn = t, Mo = t.style.outlineStyle, t.style.outlineStyle = "none", X(window, "keydown", Cn));
    }
    function Cn() {
      Sn && (Sn.style.outlineStyle = Mo, Sn = void 0, Mo = void 0, mt(window, "keydown", Cn));
    }
    function rr(t) {
      do
        t = t.parentNode;
      while ((!t.offsetWidth || !t.offsetHeight) && t !== document.body);
      return t;
    }
    function Ao(t) {
      var e = t.getBoundingClientRect();
      return {
        x: e.width / t.offsetWidth || 1,
        y: e.height / t.offsetHeight || 1,
        boundingClientRect: e
      };
    }
    var fu = {
      __proto__: null,
      TRANSFORM: Oo,
      TRANSITION: Zi,
      TRANSITION_END: or,
      get: sr,
      getStyle: Fi,
      create: at,
      remove: Pt,
      empty: Tn,
      toFront: bi,
      toBack: wi,
      hasClass: To,
      addClass: tt,
      removeClass: Lt,
      setClass: No,
      getClass: Nn,
      setOpacity: ce,
      testProp: Ln,
      setTransform: ei,
      setPosition: St,
      getPosition: ii,
      get disableTextSelection() {
        return Hi;
      },
      get enableTextSelection() {
        return $i;
      },
      disableImageDrag: So,
      enableImageDrag: Co,
      preventOutline: Do,
      restoreOutline: Cn,
      getSizedParentNode: rr,
      getScale: Ao
    };
    function X(t, e, o, r) {
      if (e && typeof e == "object")
        for (var u in e)
          ko(t, u, e[u], o);
      else {
        e = Z(e);
        for (var h = 0, m = e.length; h < m; h++)
          ko(t, e[h], o, r);
      }
      return this;
    }
    var Oe = "_leaflet_events";
    function mt(t, e, o, r) {
      if (arguments.length === 1)
        ar(t), delete t[Oe];
      else if (e && typeof e == "object")
        for (var u in e)
          zo(t, u, e[u], o);
      else if (e = Z(e), arguments.length === 2)
        ar(t, function(b) {
          return Vt(e, b) !== -1;
        });
      else
        for (var h = 0, m = e.length; h < m; h++)
          zo(t, e[h], o, r);
      return this;
    }
    function ar(t, e) {
      for (var o in t[Oe]) {
        var r = o.split(/\d/)[0];
        (!e || e(r)) && zo(t, r, null, null, o);
      }
    }
    var Io = {
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      wheel: !("onwheel" in window) && "mousewheel"
    };
    function ko(t, e, o, r) {
      var u = e + _(o) + (r ? "_" + _(r) : "");
      if (t[Oe] && t[Oe][u])
        return this;
      var h = function(b) {
        return o.call(r || t, b || window.event);
      }, m = h;
      !H.touchNative && H.pointer && e.indexOf("touch") === 0 ? h = eu(t, e, h) : H.touch && e === "dblclick" ? h = uu(t, h) : "addEventListener" in t ? e === "touchstart" || e === "touchmove" || e === "wheel" || e === "mousewheel" ? t.addEventListener(Io[e] || e, h, H.passiveEvents ? { passive: !1 } : !1) : e === "mouseenter" || e === "mouseleave" ? (h = function(b) {
        b = b || window.event, Ro(t, b) && m(b);
      }, t.addEventListener(Io[e], h, !1)) : t.addEventListener(e, m, !1) : t.attachEvent("on" + e, h), t[Oe] = t[Oe] || {}, t[Oe][u] = h;
    }
    function zo(t, e, o, r, u) {
      u = u || e + _(o) + (r ? "_" + _(r) : "");
      var h = t[Oe] && t[Oe][u];
      if (!h)
        return this;
      !H.touchNative && H.pointer && e.indexOf("touch") === 0 ? iu(t, e, h) : H.touch && e === "dblclick" ? cu(t, h) : "removeEventListener" in t ? t.removeEventListener(Io[e] || e, h, !1) : t.detachEvent("on" + e, h), t[Oe][u] = null;
    }
    function ni(t) {
      return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, this;
    }
    function Vo(t) {
      return ko(t, "wheel", ni), this;
    }
    function ji(t) {
      return X(t, "mousedown touchstart dblclick contextmenu", ni), t._leaflet_disable_click = !0, this;
    }
    function Ft(t) {
      return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this;
    }
    function oi(t) {
      return Ft(t), ni(t), this;
    }
    function lr(t) {
      if (t.composedPath)
        return t.composedPath();
      for (var e = [], o = t.target; o; )
        e.push(o), o = o.parentNode;
      return e;
    }
    function ur(t, e) {
      if (!e)
        return new V(t.clientX, t.clientY);
      var o = Ao(e), r = o.boundingClientRect;
      return new V(
        // offset.left/top values are in page scale (like clientX/Y),
        // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
        (t.clientX - r.left) / o.x - e.clientLeft,
        (t.clientY - r.top) / o.y - e.clientTop
      );
    }
    var du = H.linux && H.chrome ? window.devicePixelRatio : H.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
    function cr(t) {
      return H.edge ? t.wheelDeltaY / 2 : (
        // Don't trust window-geometry-based delta
        t.deltaY && t.deltaMode === 0 ? -t.deltaY / du : (
          // Pixels
          t.deltaY && t.deltaMode === 1 ? -t.deltaY * 20 : (
            // Lines
            t.deltaY && t.deltaMode === 2 ? -t.deltaY * 60 : (
              // Pages
              t.deltaX || t.deltaZ ? 0 : (
                // Skip horizontal/depth wheel events
                t.wheelDelta ? (t.wheelDeltaY || t.wheelDelta) / 2 : (
                  // Legacy IE pixels
                  t.detail && Math.abs(t.detail) < 32765 ? -t.detail * 20 : (
                    // Legacy Moz lines
                    t.detail ? t.detail / -32765 * 60 : (
                      // Legacy Moz pages
                      0
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    function Ro(t, e) {
      var o = e.relatedTarget;
      if (!o)
        return !0;
      try {
        for (; o && o !== t; )
          o = o.parentNode;
      } catch {
        return !1;
      }
      return o !== t;
    }
    var pu = {
      __proto__: null,
      on: X,
      off: mt,
      stopPropagation: ni,
      disableScrollPropagation: Vo,
      disableClickPropagation: ji,
      preventDefault: Ft,
      stop: oi,
      getPropagationPath: lr,
      getMousePosition: ur,
      getWheelDelta: cr,
      isExternalTarget: Ro,
      addListener: X,
      removeListener: mt
    }, hr = Q.extend({
      // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
      // Run an animation of a given element to a new position, optionally setting
      // duration in seconds (`0.25` by default) and easing linearity factor (3rd
      // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
      // `0.5` by default).
      run: function(t, e, o, r) {
        this.stop(), this._el = t, this._inProgress = !0, this._duration = o || 0.25, this._easeOutPower = 1 / Math.max(r || 0.5, 0.2), this._startPos = ii(t), this._offset = e.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
      },
      // @method stop()
      // Stops the animation (if currently running).
      stop: function() {
        this._inProgress && (this._step(!0), this._complete());
      },
      _animate: function() {
        this._animId = xt(this._animate, this), this._step();
      },
      _step: function(t) {
        var e = +/* @__PURE__ */ new Date() - this._startTime, o = this._duration * 1e3;
        e < o ? this._runFrame(this._easeOut(e / o), t) : (this._runFrame(1), this._complete());
      },
      _runFrame: function(t, e) {
        var o = this._startPos.add(this._offset.multiplyBy(t));
        e && o._round(), St(this._el, o), this.fire("step");
      },
      _complete: function() {
        yt(this._animId), this._inProgress = !1, this.fire("end");
      },
      _easeOut: function(t) {
        return 1 - Math.pow(1 - t, this._easeOutPower);
      }
    }), rt = Q.extend({
      options: {
        // @section Map State Options
        // @option crs: CRS = L.CRS.EPSG3857
        // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
        // sure what it means.
        crs: p,
        // @option center: LatLng = undefined
        // Initial geographic center of the map
        center: void 0,
        // @option zoom: Number = undefined
        // Initial map zoom level
        zoom: void 0,
        // @option minZoom: Number = *
        // Minimum zoom level of the map.
        // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
        // the lowest of their `minZoom` options will be used instead.
        minZoom: void 0,
        // @option maxZoom: Number = *
        // Maximum zoom level of the map.
        // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
        // the highest of their `maxZoom` options will be used instead.
        maxZoom: void 0,
        // @option layers: Layer[] = []
        // Array of layers that will be added to the map initially
        layers: [],
        // @option maxBounds: LatLngBounds = null
        // When this option is set, the map restricts the view to the given
        // geographical bounds, bouncing the user back if the user tries to pan
        // outside the view. To set the restriction dynamically, use
        // [`setMaxBounds`](#map-setmaxbounds) method.
        maxBounds: void 0,
        // @option renderer: Renderer = *
        // The default method for drawing vector layers on the map. `L.SVG`
        // or `L.Canvas` by default depending on browser support.
        renderer: void 0,
        // @section Animation Options
        // @option zoomAnimation: Boolean = true
        // Whether the map zoom animation is enabled. By default it's enabled
        // in all browsers that support CSS3 Transitions except Android.
        zoomAnimation: !0,
        // @option zoomAnimationThreshold: Number = 4
        // Won't animate zoom if the zoom difference exceeds this value.
        zoomAnimationThreshold: 4,
        // @option fadeAnimation: Boolean = true
        // Whether the tile fade animation is enabled. By default it's enabled
        // in all browsers that support CSS3 Transitions except Android.
        fadeAnimation: !0,
        // @option markerZoomAnimation: Boolean = true
        // Whether markers animate their zoom with the zoom animation, if disabled
        // they will disappear for the length of the animation. By default it's
        // enabled in all browsers that support CSS3 Transitions except Android.
        markerZoomAnimation: !0,
        // @option transform3DLimit: Number = 2^23
        // Defines the maximum size of a CSS translation transform. The default
        // value should not be changed unless a web browser positions layers in
        // the wrong place after doing a large `panBy`.
        transform3DLimit: 8388608,
        // Precision limit of a 32-bit float
        // @section Interaction Options
        // @option zoomSnap: Number = 1
        // Forces the map's zoom level to always be a multiple of this, particularly
        // right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
        // By default, the zoom level snaps to the nearest integer; lower values
        // (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
        // means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
        zoomSnap: 1,
        // @option zoomDelta: Number = 1
        // Controls how much the map's zoom level will change after a
        // [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
        // or `-` on the keyboard, or using the [zoom controls](#control-zoom).
        // Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
        zoomDelta: 1,
        // @option trackResize: Boolean = true
        // Whether the map automatically handles browser window resize to update itself.
        trackResize: !0
      },
      initialize: function(t, e) {
        e = I(this, e), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(t), this._initLayout(), this._onResize = f(this._onResize, this), this._initEvents(), e.maxBounds && this.setMaxBounds(e.maxBounds), e.zoom !== void 0 && (this._zoom = this._limitZoom(e.zoom)), e.center && e.zoom !== void 0 && this.setView(ot(e.center), e.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = Zi && H.any3d && !H.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), X(this._proxy, or, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
      },
      // @section Methods for modifying map state
      // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
      // Sets the view of the map (geographical center and zoom) with the given
      // animation options.
      setView: function(t, e, o) {
        if (e = e === void 0 ? this._zoom : this._limitZoom(e), t = this._limitCenter(ot(t), e, this.options.maxBounds), o = o || {}, this._stop(), this._loaded && !o.reset && o !== !0) {
          o.animate !== void 0 && (o.zoom = l({ animate: o.animate }, o.zoom), o.pan = l({ animate: o.animate, duration: o.duration }, o.pan));
          var r = this._zoom !== e ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, e, o.zoom) : this._tryAnimatedPan(t, o.pan);
          if (r)
            return clearTimeout(this._sizeTimer), this;
        }
        return this._resetView(t, e, o.pan && o.pan.noMoveStart), this;
      },
      // @method setZoom(zoom: Number, options?: Zoom/pan options): this
      // Sets the zoom of the map.
      setZoom: function(t, e) {
        return this._loaded ? this.setView(this.getCenter(), t, { zoom: e }) : (this._zoom = t, this);
      },
      // @method zoomIn(delta?: Number, options?: Zoom options): this
      // Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
      zoomIn: function(t, e) {
        return t = t || (H.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, e);
      },
      // @method zoomOut(delta?: Number, options?: Zoom options): this
      // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
      zoomOut: function(t, e) {
        return t = t || (H.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, e);
      },
      // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified geographical point on the map
      // stationary (e.g. used internally for scroll zoom and double-click zoom).
      // @alternative
      // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
      setZoomAround: function(t, e, o) {
        var r = this.getZoomScale(e), u = this.getSize().divideBy(2), h = t instanceof V ? t : this.latLngToContainerPoint(t), m = h.subtract(u).multiplyBy(1 - 1 / r), b = this.containerPointToLatLng(u.add(m));
        return this.setView(b, e, { zoom: o });
      },
      _getBoundsCenterZoom: function(t, e) {
        e = e || {}, t = t.getBounds ? t.getBounds() : bt(t);
        var o = G(e.paddingTopLeft || e.padding || [0, 0]), r = G(e.paddingBottomRight || e.padding || [0, 0]), u = this.getBoundsZoom(t, !1, o.add(r));
        if (u = typeof e.maxZoom == "number" ? Math.min(e.maxZoom, u) : u, u === 1 / 0)
          return {
            center: t.getCenter(),
            zoom: u
          };
        var h = r.subtract(o).divideBy(2), m = this.project(t.getSouthWest(), u), b = this.project(t.getNorthEast(), u), x = this.unproject(m.add(b).divideBy(2).add(h), u);
        return {
          center: x,
          zoom: u
        };
      },
      // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
      // Sets a map view that contains the given geographical bounds with the
      // maximum zoom level possible.
      fitBounds: function(t, e) {
        if (t = bt(t), !t.isValid())
          throw new Error("Bounds are not valid.");
        var o = this._getBoundsCenterZoom(t, e);
        return this.setView(o.center, o.zoom, e);
      },
      // @method fitWorld(options?: fitBounds options): this
      // Sets a map view that mostly contains the whole world with the maximum
      // zoom level possible.
      fitWorld: function(t) {
        return this.fitBounds([[-90, -180], [90, 180]], t);
      },
      // @method panTo(latlng: LatLng, options?: Pan options): this
      // Pans the map to a given center.
      panTo: function(t, e) {
        return this.setView(t, this._zoom, { pan: e });
      },
      // @method panBy(offset: Point, options?: Pan options): this
      // Pans the map by a given number of pixels (animated).
      panBy: function(t, e) {
        if (t = G(t).round(), e = e || {}, !t.x && !t.y)
          return this.fire("moveend");
        if (e.animate !== !0 && !this.getSize().contains(t))
          return this._resetView(this.unproject(this.project(this.getCenter()).add(t)), this.getZoom()), this;
        if (this._panAnim || (this._panAnim = new hr(), this._panAnim.on({
          step: this._onPanTransitionStep,
          end: this._onPanTransitionEnd
        }, this)), e.noMoveStart || this.fire("movestart"), e.animate !== !1) {
          tt(this._mapPane, "leaflet-pan-anim");
          var o = this._getMapPanePos().subtract(t).round();
          this._panAnim.run(this._mapPane, o, e.duration || 0.25, e.easeLinearity);
        } else
          this._rawPanBy(t), this.fire("move").fire("moveend");
        return this;
      },
      // @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
      // Sets the view of the map (geographical center and zoom) performing a smooth
      // pan-zoom animation.
      flyTo: function(t, e, o) {
        if (o = o || {}, o.animate === !1 || !H.any3d)
          return this.setView(t, e, o);
        this._stop();
        var r = this.project(this.getCenter()), u = this.project(t), h = this.getSize(), m = this._zoom;
        t = ot(t), e = e === void 0 ? m : e;
        var b = Math.max(h.x, h.y), x = b * this.getZoomScale(m, e), N = u.distanceTo(r) || 1, B = 1.42, U = B * B;
        function it(Ct) {
          var Hn = Ct ? -1 : 1, ic = Ct ? x : b, nc = x * x - b * b + Hn * U * U * N * N, oc = 2 * ic * U * N, qo = nc / oc, jr = Math.sqrt(qo * qo + 1) - qo, sc = jr < 1e-9 ? -18 : Math.log(jr);
          return sc;
        }
        function Ut(Ct) {
          return (Math.exp(Ct) - Math.exp(-Ct)) / 2;
        }
        function zt(Ct) {
          return (Math.exp(Ct) + Math.exp(-Ct)) / 2;
        }
        function fe(Ct) {
          return Ut(Ct) / zt(Ct);
        }
        var Yt = it(0);
        function Ni(Ct) {
          return b * (zt(Yt) / zt(Yt + B * Ct));
        }
        function Xu(Ct) {
          return b * (zt(Yt) * fe(Yt + B * Ct) - Ut(Yt)) / U;
        }
        function Qu(Ct) {
          return 1 - Math.pow(1 - Ct, 1.5);
        }
        var tc = Date.now(), $r = (it(1) - Yt) / B, ec = o.duration ? 1e3 * o.duration : 1e3 * $r * 0.8;
        function Wr() {
          var Ct = (Date.now() - tc) / ec, Hn = Qu(Ct) * $r;
          Ct <= 1 ? (this._flyToFrame = xt(Wr, this), this._move(
            this.unproject(r.add(u.subtract(r).multiplyBy(Xu(Hn) / N)), m),
            this.getScaleZoom(b / Ni(Hn), m),
            { flyTo: !0 }
          )) : this._move(t, e)._moveEnd(!0);
        }
        return this._moveStart(!0, o.noMoveStart), Wr.call(this), this;
      },
      // @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
      // Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
      // but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
      flyToBounds: function(t, e) {
        var o = this._getBoundsCenterZoom(t, e);
        return this.flyTo(o.center, o.zoom, e);
      },
      // @method setMaxBounds(bounds: LatLngBounds): this
      // Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
      setMaxBounds: function(t) {
        return t = bt(t), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), t.isValid() ? (this.options.maxBounds = t, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
      },
      // @method setMinZoom(zoom: Number): this
      // Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
      setMinZoom: function(t) {
        var e = this.options.minZoom;
        return this.options.minZoom = t, this._loaded && e !== t && (this.fire("zoomlevelschange"), this.getZoom() < this.options.minZoom) ? this.setZoom(t) : this;
      },
      // @method setMaxZoom(zoom: Number): this
      // Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
      setMaxZoom: function(t) {
        var e = this.options.maxZoom;
        return this.options.maxZoom = t, this._loaded && e !== t && (this.fire("zoomlevelschange"), this.getZoom() > this.options.maxZoom) ? this.setZoom(t) : this;
      },
      // @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
      // Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
      panInsideBounds: function(t, e) {
        this._enforcingBounds = !0;
        var o = this.getCenter(), r = this._limitCenter(o, this._zoom, bt(t));
        return o.equals(r) || this.panTo(r, e), this._enforcingBounds = !1, this;
      },
      // @method panInside(latlng: LatLng, options?: padding options): this
      // Pans the map the minimum amount to make the `latlng` visible. Use
      // padding options to fit the display to more restricted bounds.
      // If `latlng` is already within the (optionally padded) display bounds,
      // the map will not be panned.
      panInside: function(t, e) {
        e = e || {};
        var o = G(e.paddingTopLeft || e.padding || [0, 0]), r = G(e.paddingBottomRight || e.padding || [0, 0]), u = this.project(this.getCenter()), h = this.project(t), m = this.getPixelBounds(), b = Nt([m.min.add(o), m.max.subtract(r)]), x = b.getSize();
        if (!b.contains(h)) {
          this._enforcingBounds = !0;
          var N = h.subtract(b.getCenter()), B = b.extend(h).getSize().subtract(x);
          u.x += N.x < 0 ? -B.x : B.x, u.y += N.y < 0 ? -B.y : B.y, this.panTo(this.unproject(u), e), this._enforcingBounds = !1;
        }
        return this;
      },
      // @method invalidateSize(options: Zoom/pan options): this
      // Checks if the map container size changed and updates the map if so —
      // call it after you've changed the map size dynamically, also animating
      // pan by default. If `options.pan` is `false`, panning will not occur.
      // If `options.debounceMoveend` is `true`, it will delay `moveend` event so
      // that it doesn't happen often even if the method is called many
      // times in a row.
      // @alternative
      // @method invalidateSize(animate: Boolean): this
      // Checks if the map container size changed and updates the map if so —
      // call it after you've changed the map size dynamically, also animating
      // pan by default.
      invalidateSize: function(t) {
        if (!this._loaded)
          return this;
        t = l({
          animate: !1,
          pan: !0
        }, t === !0 ? { animate: !0 } : t);
        var e = this.getSize();
        this._sizeChanged = !0, this._lastCenter = null;
        var o = this.getSize(), r = e.divideBy(2).round(), u = o.divideBy(2).round(), h = r.subtract(u);
        return !h.x && !h.y ? this : (t.animate && t.pan ? this.panBy(h) : (t.pan && this._rawPanBy(h), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(f(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
          oldSize: e,
          newSize: o
        }));
      },
      // @section Methods for modifying map state
      // @method stop(): this
      // Stops the currently running `panTo` or `flyTo` animation, if any.
      stop: function() {
        return this.setZoom(this._limitZoom(this._zoom)), this.options.zoomSnap || this.fire("viewreset"), this._stop();
      },
      // @section Geolocation methods
      // @method locate(options?: Locate options): this
      // Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
      // event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
      // and optionally sets the map view to the user's location with respect to
      // detection accuracy (or to the world view if geolocation failed).
      // Note that, if your page doesn't use HTTPS, this method will fail in
      // modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
      // See `Locate options` for more details.
      locate: function(t) {
        if (t = this._locateOptions = l({
          timeout: 1e4,
          watch: !1
          // setView: false
          // maxZoom: <Number>
          // maximumAge: 0
          // enableHighAccuracy: false
        }, t), !("geolocation" in navigator))
          return this._handleGeolocationError({
            code: 0,
            message: "Geolocation not supported."
          }), this;
        var e = f(this._handleGeolocationResponse, this), o = f(this._handleGeolocationError, this);
        return t.watch ? this._locationWatchId = navigator.geolocation.watchPosition(e, o, t) : navigator.geolocation.getCurrentPosition(e, o, t), this;
      },
      // @method stopLocate(): this
      // Stops watching location previously initiated by `map.locate({watch: true})`
      // and aborts resetting the map view if map.locate was called with
      // `{setView: true}`.
      stopLocate: function() {
        return navigator.geolocation && navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this;
      },
      _handleGeolocationError: function(t) {
        if (this._container._leaflet_id) {
          var e = t.code, o = t.message || (e === 1 ? "permission denied" : e === 2 ? "position unavailable" : "timeout");
          this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
            code: e,
            message: "Geolocation error: " + o + "."
          });
        }
      },
      _handleGeolocationResponse: function(t) {
        if (this._container._leaflet_id) {
          var e = t.coords.latitude, o = t.coords.longitude, r = new ut(e, o), u = r.toBounds(t.coords.accuracy * 2), h = this._locateOptions;
          if (h.setView) {
            var m = this.getBoundsZoom(u);
            this.setView(r, h.maxZoom ? Math.min(m, h.maxZoom) : m);
          }
          var b = {
            latlng: r,
            bounds: u,
            timestamp: t.timestamp
          };
          for (var x in t.coords)
            typeof t.coords[x] == "number" && (b[x] = t.coords[x]);
          this.fire("locationfound", b);
        }
      },
      // TODO Appropriate docs section?
      // @section Other Methods
      // @method addHandler(name: String, HandlerClass: Function): this
      // Adds a new `Handler` to the map, given its name and constructor function.
      addHandler: function(t, e) {
        if (!e)
          return this;
        var o = this[t] = new e(this);
        return this._handlers.push(o), this.options[t] && o.enable(), this;
      },
      // @method remove(): this
      // Destroys the map and clears all related event listeners.
      remove: function() {
        if (this._initEvents(!0), this.options.maxBounds && this.off("moveend", this._panInsideMaxBounds), this._containerId !== this._container._leaflet_id)
          throw new Error("Map container is being reused by another instance");
        try {
          delete this._container._leaflet_id, delete this._containerId;
        } catch {
          this._container._leaflet_id = void 0, this._containerId = void 0;
        }
        this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), Pt(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (yt(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
        var t;
        for (t in this._layers)
          this._layers[t].remove();
        for (t in this._panes)
          Pt(this._panes[t]);
        return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
      },
      // @section Other Methods
      // @method createPane(name: String, container?: HTMLElement): HTMLElement
      // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
      // then returns it. The pane is created as a child of `container`, or
      // as a child of the main map pane if not set.
      createPane: function(t, e) {
        var o = "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), r = at("div", o, e || this._mapPane);
        return t && (this._panes[t] = r), r;
      },
      // @section Methods for Getting Map State
      // @method getCenter(): LatLng
      // Returns the geographical center of the map view
      getCenter: function() {
        return this._checkIfLoaded(), this._lastCenter && !this._moved() ? this._lastCenter.clone() : this.layerPointToLatLng(this._getCenterLayerPoint());
      },
      // @method getZoom(): Number
      // Returns the current zoom level of the map view
      getZoom: function() {
        return this._zoom;
      },
      // @method getBounds(): LatLngBounds
      // Returns the geographical bounds visible in the current map view
      getBounds: function() {
        var t = this.getPixelBounds(), e = this.unproject(t.getBottomLeft()), o = this.unproject(t.getTopRight());
        return new Et(e, o);
      },
      // @method getMinZoom(): Number
      // Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
      getMinZoom: function() {
        return this.options.minZoom === void 0 ? this._layersMinZoom || 0 : this.options.minZoom;
      },
      // @method getMaxZoom(): Number
      // Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
      getMaxZoom: function() {
        return this.options.maxZoom === void 0 ? this._layersMaxZoom === void 0 ? 1 / 0 : this._layersMaxZoom : this.options.maxZoom;
      },
      // @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean, padding?: Point): Number
      // Returns the maximum zoom level on which the given bounds fit to the map
      // view in its entirety. If `inside` (optional) is set to `true`, the method
      // instead returns the minimum zoom level on which the map view fits into
      // the given bounds in its entirety.
      getBoundsZoom: function(t, e, o) {
        t = bt(t), o = G(o || [0, 0]);
        var r = this.getZoom() || 0, u = this.getMinZoom(), h = this.getMaxZoom(), m = t.getNorthWest(), b = t.getSouthEast(), x = this.getSize().subtract(o), N = Nt(this.project(b, r), this.project(m, r)).getSize(), B = H.any3d ? this.options.zoomSnap : 1, U = x.x / N.x, it = x.y / N.y, Ut = e ? Math.max(U, it) : Math.min(U, it);
        return r = this.getScaleZoom(Ut, r), B && (r = Math.round(r / (B / 100)) * (B / 100), r = e ? Math.ceil(r / B) * B : Math.floor(r / B) * B), Math.max(u, Math.min(h, r));
      },
      // @method getSize(): Point
      // Returns the current size of the map container (in pixels).
      getSize: function() {
        return (!this._size || this._sizeChanged) && (this._size = new V(
          this._container.clientWidth || 0,
          this._container.clientHeight || 0
        ), this._sizeChanged = !1), this._size.clone();
      },
      // @method getPixelBounds(): Bounds
      // Returns the bounds of the current map view in projected pixel
      // coordinates (sometimes useful in layer and overlay implementations).
      getPixelBounds: function(t, e) {
        var o = this._getTopLeftPoint(t, e);
        return new ft(o, o.add(this.getSize()));
      },
      // TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
      // the map pane? "left point of the map layer" can be confusing, specially
      // since there can be negative offsets.
      // @method getPixelOrigin(): Point
      // Returns the projected pixel coordinates of the top left point of
      // the map layer (useful in custom layer and overlay implementations).
      getPixelOrigin: function() {
        return this._checkIfLoaded(), this._pixelOrigin;
      },
      // @method getPixelWorldBounds(zoom?: Number): Bounds
      // Returns the world's bounds in pixel coordinates for zoom level `zoom`.
      // If `zoom` is omitted, the map's current zoom level is used.
      getPixelWorldBounds: function(t) {
        return this.options.crs.getProjectedBounds(t === void 0 ? this.getZoom() : t);
      },
      // @section Other Methods
      // @method getPane(pane: String|HTMLElement): HTMLElement
      // Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
      getPane: function(t) {
        return typeof t == "string" ? this._panes[t] : t;
      },
      // @method getPanes(): Object
      // Returns a plain object containing the names of all [panes](#map-pane) as keys and
      // the panes as values.
      getPanes: function() {
        return this._panes;
      },
      // @method getContainer: HTMLElement
      // Returns the HTML element that contains the map.
      getContainer: function() {
        return this._container;
      },
      // @section Conversion Methods
      // @method getZoomScale(toZoom: Number, fromZoom: Number): Number
      // Returns the scale factor to be applied to a map transition from zoom level
      // `fromZoom` to `toZoom`. Used internally to help with zoom animations.
      getZoomScale: function(t, e) {
        var o = this.options.crs;
        return e = e === void 0 ? this._zoom : e, o.scale(t) / o.scale(e);
      },
      // @method getScaleZoom(scale: Number, fromZoom: Number): Number
      // Returns the zoom level that the map would end up at, if it is at `fromZoom`
      // level and everything is scaled by a factor of `scale`. Inverse of
      // [`getZoomScale`](#map-getZoomScale).
      getScaleZoom: function(t, e) {
        var o = this.options.crs;
        e = e === void 0 ? this._zoom : e;
        var r = o.zoom(t * o.scale(e));
        return isNaN(r) ? 1 / 0 : r;
      },
      // @method project(latlng: LatLng, zoom: Number): Point
      // Projects a geographical coordinate `LatLng` according to the projection
      // of the map's CRS, then scales it according to `zoom` and the CRS's
      // `Transformation`. The result is pixel coordinate relative to
      // the CRS origin.
      project: function(t, e) {
        return e = e === void 0 ? this._zoom : e, this.options.crs.latLngToPoint(ot(t), e);
      },
      // @method unproject(point: Point, zoom: Number): LatLng
      // Inverse of [`project`](#map-project).
      unproject: function(t, e) {
        return e = e === void 0 ? this._zoom : e, this.options.crs.pointToLatLng(G(t), e);
      },
      // @method layerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding geographical coordinate (for the current zoom level).
      layerPointToLatLng: function(t) {
        var e = G(t).add(this.getPixelOrigin());
        return this.unproject(e);
      },
      // @method latLngToLayerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the [origin pixel](#map-getpixelorigin).
      latLngToLayerPoint: function(t) {
        var e = this.project(ot(t))._round();
        return e._subtract(this.getPixelOrigin());
      },
      // @method wrapLatLng(latlng: LatLng): LatLng
      // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
      // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
      // CRS's bounds.
      // By default this means longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees.
      wrapLatLng: function(t) {
        return this.options.crs.wrapLatLng(ot(t));
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring that
      // its center is within the CRS's bounds.
      // By default this means the center longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees, and the majority of the bounds
      // overlaps the CRS's bounds.
      wrapLatLngBounds: function(t) {
        return this.options.crs.wrapLatLngBounds(bt(t));
      },
      // @method distance(latlng1: LatLng, latlng2: LatLng): Number
      // Returns the distance between two geographical coordinates according to
      // the map's CRS. By default this measures distance in meters.
      distance: function(t, e) {
        return this.options.crs.distance(ot(t), ot(e));
      },
      // @method containerPointToLayerPoint(point: Point): Point
      // Given a pixel coordinate relative to the map container, returns the corresponding
      // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
      containerPointToLayerPoint: function(t) {
        return G(t).subtract(this._getMapPanePos());
      },
      // @method layerPointToContainerPoint(point: Point): Point
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding pixel coordinate relative to the map container.
      layerPointToContainerPoint: function(t) {
        return G(t).add(this._getMapPanePos());
      },
      // @method containerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the map container, returns
      // the corresponding geographical coordinate (for the current zoom level).
      containerPointToLatLng: function(t) {
        var e = this.containerPointToLayerPoint(G(t));
        return this.layerPointToLatLng(e);
      },
      // @method latLngToContainerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the map container.
      latLngToContainerPoint: function(t) {
        return this.layerPointToContainerPoint(this.latLngToLayerPoint(ot(t)));
      },
      // @method mouseEventToContainerPoint(ev: MouseEvent): Point
      // Given a MouseEvent object, returns the pixel coordinate relative to the
      // map container where the event took place.
      mouseEventToContainerPoint: function(t) {
        return ur(t, this._container);
      },
      // @method mouseEventToLayerPoint(ev: MouseEvent): Point
      // Given a MouseEvent object, returns the pixel coordinate relative to
      // the [origin pixel](#map-getpixelorigin) where the event took place.
      mouseEventToLayerPoint: function(t) {
        return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t));
      },
      // @method mouseEventToLatLng(ev: MouseEvent): LatLng
      // Given a MouseEvent object, returns geographical coordinate where the
      // event took place.
      mouseEventToLatLng: function(t) {
        return this.layerPointToLatLng(this.mouseEventToLayerPoint(t));
      },
      // map initialization methods
      _initContainer: function(t) {
        var e = this._container = sr(t);
        if (e) {
          if (e._leaflet_id)
            throw new Error("Map container is already initialized.");
        } else throw new Error("Map container not found.");
        X(e, "scroll", this._onScroll, this), this._containerId = _(e);
      },
      _initLayout: function() {
        var t = this._container;
        this._fadeAnimated = this.options.fadeAnimation && H.any3d, tt(t, "leaflet-container" + (H.touch ? " leaflet-touch" : "") + (H.retina ? " leaflet-retina" : "") + (H.ielt9 ? " leaflet-oldie" : "") + (H.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
        var e = Fi(t, "position");
        e !== "absolute" && e !== "relative" && e !== "fixed" && e !== "sticky" && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
      },
      _initPanes: function() {
        var t = this._panes = {};
        this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), St(this._mapPane, new V(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (tt(t.markerPane, "leaflet-zoom-hide"), tt(t.shadowPane, "leaflet-zoom-hide"));
      },
      // private methods that modify map state
      // @section Map state change events
      _resetView: function(t, e, o) {
        St(this._mapPane, new V(0, 0));
        var r = !this._loaded;
        this._loaded = !0, e = this._limitZoom(e), this.fire("viewprereset");
        var u = this._zoom !== e;
        this._moveStart(u, o)._move(t, e)._moveEnd(u), this.fire("viewreset"), r && this.fire("load");
      },
      _moveStart: function(t, e) {
        return t && this.fire("zoomstart"), e || this.fire("movestart"), this;
      },
      _move: function(t, e, o, r) {
        e === void 0 && (e = this._zoom);
        var u = this._zoom !== e;
        return this._zoom = e, this._lastCenter = t, this._pixelOrigin = this._getNewPixelOrigin(t), r ? o && o.pinch && this.fire("zoom", o) : ((u || o && o.pinch) && this.fire("zoom", o), this.fire("move", o)), this;
      },
      _moveEnd: function(t) {
        return t && this.fire("zoomend"), this.fire("moveend");
      },
      _stop: function() {
        return yt(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
      },
      _rawPanBy: function(t) {
        St(this._mapPane, this._getMapPanePos().subtract(t));
      },
      _getZoomSpan: function() {
        return this.getMaxZoom() - this.getMinZoom();
      },
      _panInsideMaxBounds: function() {
        this._enforcingBounds || this.panInsideBounds(this.options.maxBounds);
      },
      _checkIfLoaded: function() {
        if (!this._loaded)
          throw new Error("Set map center and zoom first.");
      },
      // DOM event handling
      // @section Interaction events
      _initEvents: function(t) {
        this._targets = {}, this._targets[_(this._container)] = this;
        var e = t ? mt : X;
        e(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && e(window, "resize", this._onResize, this), H.any3d && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
      },
      _onResize: function() {
        yt(this._resizeRequest), this._resizeRequest = xt(
          function() {
            this.invalidateSize({ debounceMoveend: !0 });
          },
          this
        );
      },
      _onScroll: function() {
        this._container.scrollTop = 0, this._container.scrollLeft = 0;
      },
      _onMoveEnd: function() {
        var t = this._getMapPanePos();
        Math.max(Math.abs(t.x), Math.abs(t.y)) >= this.options.transform3DLimit && this._resetView(this.getCenter(), this.getZoom());
      },
      _findEventTargets: function(t, e) {
        for (var o = [], r, u = e === "mouseout" || e === "mouseover", h = t.target || t.srcElement, m = !1; h; ) {
          if (r = this._targets[_(h)], r && (e === "click" || e === "preclick") && this._draggableMoved(r)) {
            m = !0;
            break;
          }
          if (r && r.listens(e, !0) && (u && !Ro(h, t) || (o.push(r), u)) || h === this._container)
            break;
          h = h.parentNode;
        }
        return !o.length && !m && !u && this.listens(e, !0) && (o = [this]), o;
      },
      _isClickDisabled: function(t) {
        for (; t && t !== this._container; ) {
          if (t._leaflet_disable_click)
            return !0;
          t = t.parentNode;
        }
      },
      _handleDOMEvent: function(t) {
        var e = t.target || t.srcElement;
        if (!(!this._loaded || e._leaflet_disable_events || t.type === "click" && this._isClickDisabled(e))) {
          var o = t.type;
          o === "mousedown" && Do(e), this._fireDOMEvent(t, o);
        }
      },
      _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
      _fireDOMEvent: function(t, e, o) {
        if (t.type === "click") {
          var r = l({}, t);
          r.type = "preclick", this._fireDOMEvent(r, r.type, o);
        }
        var u = this._findEventTargets(t, e);
        if (o) {
          for (var h = [], m = 0; m < o.length; m++)
            o[m].listens(e, !0) && h.push(o[m]);
          u = h.concat(u);
        }
        if (u.length) {
          e === "contextmenu" && Ft(t);
          var b = u[0], x = {
            originalEvent: t
          };
          if (t.type !== "keypress" && t.type !== "keydown" && t.type !== "keyup") {
            var N = b.getLatLng && (!b._radius || b._radius <= 10);
            x.containerPoint = N ? this.latLngToContainerPoint(b.getLatLng()) : this.mouseEventToContainerPoint(t), x.layerPoint = this.containerPointToLayerPoint(x.containerPoint), x.latlng = N ? b.getLatLng() : this.layerPointToLatLng(x.layerPoint);
          }
          for (m = 0; m < u.length; m++)
            if (u[m].fire(e, x, !0), x.originalEvent._stopped || u[m].options.bubblingMouseEvents === !1 && Vt(this._mouseEvents, e) !== -1)
              return;
        }
      },
      _draggableMoved: function(t) {
        return t = t.dragging && t.dragging.enabled() ? t : this, t.dragging && t.dragging.moved() || this.boxZoom && this.boxZoom.moved();
      },
      _clearHandlers: function() {
        for (var t = 0, e = this._handlers.length; t < e; t++)
          this._handlers[t].disable();
      },
      // @section Other Methods
      // @method whenReady(fn: Function, context?: Object): this
      // Runs the given function `fn` when the map gets initialized with
      // a view (center and zoom) and at least one layer, or immediately
      // if it's already initialized, optionally passing a function context.
      whenReady: function(t, e) {
        return this._loaded ? t.call(e || this, { target: this }) : this.on("load", t, e), this;
      },
      // private methods for getting map state
      _getMapPanePos: function() {
        return ii(this._mapPane) || new V(0, 0);
      },
      _moved: function() {
        var t = this._getMapPanePos();
        return t && !t.equals([0, 0]);
      },
      _getTopLeftPoint: function(t, e) {
        var o = t && e !== void 0 ? this._getNewPixelOrigin(t, e) : this.getPixelOrigin();
        return o.subtract(this._getMapPanePos());
      },
      _getNewPixelOrigin: function(t, e) {
        var o = this.getSize()._divideBy(2);
        return this.project(t, e)._subtract(o)._add(this._getMapPanePos())._round();
      },
      _latLngToNewLayerPoint: function(t, e, o) {
        var r = this._getNewPixelOrigin(o, e);
        return this.project(t, e)._subtract(r);
      },
      _latLngBoundsToNewLayerBounds: function(t, e, o) {
        var r = this._getNewPixelOrigin(o, e);
        return Nt([
          this.project(t.getSouthWest(), e)._subtract(r),
          this.project(t.getNorthWest(), e)._subtract(r),
          this.project(t.getSouthEast(), e)._subtract(r),
          this.project(t.getNorthEast(), e)._subtract(r)
        ]);
      },
      // layer point of the current center
      _getCenterLayerPoint: function() {
        return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
      },
      // offset of the specified place to the current center in pixels
      _getCenterOffset: function(t) {
        return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint());
      },
      // adjust center for view to get inside bounds
      _limitCenter: function(t, e, o) {
        if (!o)
          return t;
        var r = this.project(t, e), u = this.getSize().divideBy(2), h = new ft(r.subtract(u), r.add(u)), m = this._getBoundsOffset(h, o, e);
        return Math.abs(m.x) <= 1 && Math.abs(m.y) <= 1 ? t : this.unproject(r.add(m), e);
      },
      // adjust offset for view to get inside bounds
      _limitOffset: function(t, e) {
        if (!e)
          return t;
        var o = this.getPixelBounds(), r = new ft(o.min.add(t), o.max.add(t));
        return t.add(this._getBoundsOffset(r, e));
      },
      // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
      _getBoundsOffset: function(t, e, o) {
        var r = Nt(
          this.project(e.getNorthEast(), o),
          this.project(e.getSouthWest(), o)
        ), u = r.min.subtract(t.min), h = r.max.subtract(t.max), m = this._rebound(u.x, -h.x), b = this._rebound(u.y, -h.y);
        return new V(m, b);
      },
      _rebound: function(t, e) {
        return t + e > 0 ? Math.round(t - e) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(e));
      },
      _limitZoom: function(t) {
        var e = this.getMinZoom(), o = this.getMaxZoom(), r = H.any3d ? this.options.zoomSnap : 1;
        return r && (t = Math.round(t / r) * r), Math.max(e, Math.min(o, t));
      },
      _onPanTransitionStep: function() {
        this.fire("move");
      },
      _onPanTransitionEnd: function() {
        Lt(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
      },
      _tryAnimatedPan: function(t, e) {
        var o = this._getCenterOffset(t)._trunc();
        return (e && e.animate) !== !0 && !this.getSize().contains(o) ? !1 : (this.panBy(o, e), !0);
      },
      _createAnimProxy: function() {
        var t = this._proxy = at("div", "leaflet-proxy leaflet-zoom-animated");
        this._panes.mapPane.appendChild(t), this.on("zoomanim", function(e) {
          var o = Oo, r = this._proxy.style[o];
          ei(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1)), r === this._proxy.style[o] && this._animatingZoom && this._onZoomTransitionEnd();
        }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
      },
      _destroyAnimProxy: function() {
        Pt(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
      },
      _animMoveEnd: function() {
        var t = this.getCenter(), e = this.getZoom();
        ei(this._proxy, this.project(t, e), this.getZoomScale(e, 1));
      },
      _catchTransitionEnd: function(t) {
        this._animatingZoom && t.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd();
      },
      _nothingToAnimate: function() {
        return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
      },
      _tryAnimatedZoom: function(t, e, o) {
        if (this._animatingZoom)
          return !0;
        if (o = o || {}, !this._zoomAnimated || o.animate === !1 || this._nothingToAnimate() || Math.abs(e - this._zoom) > this.options.zoomAnimationThreshold)
          return !1;
        var r = this.getZoomScale(e), u = this._getCenterOffset(t)._divideBy(1 - 1 / r);
        return o.animate !== !0 && !this.getSize().contains(u) ? !1 : (xt(function() {
          this._moveStart(!0, o.noMoveStart || !1)._animateZoom(t, e, !0);
        }, this), !0);
      },
      _animateZoom: function(t, e, o, r) {
        this._mapPane && (o && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = e, tt(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
          center: t,
          zoom: e,
          noUpdate: r
        }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(f(this._onZoomTransitionEnd, this), 250));
      },
      _onZoomTransitionEnd: function() {
        this._animatingZoom && (this._mapPane && Lt(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
      }
    });
    function _u(t, e) {
      return new rt(t, e);
    }
    var pe = le.extend({
      // @section
      // @aka Control Options
      options: {
        // @option position: String = 'topright'
        // The position of the control (one of the map corners). Possible values are `'topleft'`,
        // `'topright'`, `'bottomleft'` or `'bottomright'`
        position: "topright"
      },
      initialize: function(t) {
        I(this, t);
      },
      /* @section
       * Classes extending L.Control will inherit the following methods:
       *
       * @method getPosition: string
       * Returns the position of the control.
       */
      getPosition: function() {
        return this.options.position;
      },
      // @method setPosition(position: string): this
      // Sets the position of the control.
      setPosition: function(t) {
        var e = this._map;
        return e && e.removeControl(this), this.options.position = t, e && e.addControl(this), this;
      },
      // @method getContainer: HTMLElement
      // Returns the HTMLElement that contains the control.
      getContainer: function() {
        return this._container;
      },
      // @method addTo(map: Map): this
      // Adds the control to the given map.
      addTo: function(t) {
        this.remove(), this._map = t;
        var e = this._container = this.onAdd(t), o = this.getPosition(), r = t._controlCorners[o];
        return tt(e, "leaflet-control"), o.indexOf("bottom") !== -1 ? r.insertBefore(e, r.firstChild) : r.appendChild(e), this._map.on("unload", this.remove, this), this;
      },
      // @method remove: this
      // Removes the control from the map it is currently active on.
      remove: function() {
        return this._map ? (Pt(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
      },
      _refocusOnMap: function(t) {
        this._map && t && t.screenX > 0 && t.screenY > 0 && this._map.getContainer().focus();
      }
    }), Ui = function(t) {
      return new pe(t);
    };
    rt.include({
      // @method addControl(control: Control): this
      // Adds the given control to the map
      addControl: function(t) {
        return t.addTo(this), this;
      },
      // @method removeControl(control: Control): this
      // Removes the given control from the map
      removeControl: function(t) {
        return t.remove(), this;
      },
      _initControlPos: function() {
        var t = this._controlCorners = {}, e = "leaflet-", o = this._controlContainer = at("div", e + "control-container", this._container);
        function r(u, h) {
          var m = e + u + " " + e + h;
          t[u + h] = at("div", m, o);
        }
        r("top", "left"), r("top", "right"), r("bottom", "left"), r("bottom", "right");
      },
      _clearControlPos: function() {
        for (var t in this._controlCorners)
          Pt(this._controlCorners[t]);
        Pt(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
      }
    });
    var fr = pe.extend({
      // @section
      // @aka Control.Layers options
      options: {
        // @option collapsed: Boolean = true
        // If `true`, the control will be collapsed into an icon and expanded on mouse hover, touch, or keyboard activation.
        collapsed: !0,
        position: "topright",
        // @option autoZIndex: Boolean = true
        // If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
        autoZIndex: !0,
        // @option hideSingleBase: Boolean = false
        // If `true`, the base layers in the control will be hidden when there is only one.
        hideSingleBase: !1,
        // @option sortLayers: Boolean = false
        // Whether to sort the layers. When `false`, layers will keep the order
        // in which they were added to the control.
        sortLayers: !1,
        // @option sortFunction: Function = *
        // A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
        // that will be used for sorting the layers, when `sortLayers` is `true`.
        // The function receives both the `L.Layer` instances and their names, as in
        // `sortFunction(layerA, layerB, nameA, nameB)`.
        // By default, it sorts layers alphabetically by their name.
        sortFunction: function(t, e, o, r) {
          return o < r ? -1 : r < o ? 1 : 0;
        }
      },
      initialize: function(t, e, o) {
        I(this, o), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
        for (var r in t)
          this._addLayer(t[r], r);
        for (r in e)
          this._addLayer(e[r], r, !0);
      },
      onAdd: function(t) {
        this._initLayout(), this._update(), this._map = t, t.on("zoomend", this._checkDisabledLayers, this);
        for (var e = 0; e < this._layers.length; e++)
          this._layers[e].layer.on("add remove", this._onLayerChange, this);
        return this._container;
      },
      addTo: function(t) {
        return pe.prototype.addTo.call(this, t), this._expandIfNotCollapsed();
      },
      onRemove: function() {
        this._map.off("zoomend", this._checkDisabledLayers, this);
        for (var t = 0; t < this._layers.length; t++)
          this._layers[t].layer.off("add remove", this._onLayerChange, this);
      },
      // @method addBaseLayer(layer: Layer, name: String): this
      // Adds a base layer (radio button entry) with the given name to the control.
      addBaseLayer: function(t, e) {
        return this._addLayer(t, e), this._map ? this._update() : this;
      },
      // @method addOverlay(layer: Layer, name: String): this
      // Adds an overlay (checkbox entry) with the given name to the control.
      addOverlay: function(t, e) {
        return this._addLayer(t, e, !0), this._map ? this._update() : this;
      },
      // @method removeLayer(layer: Layer): this
      // Remove the given layer from the control.
      removeLayer: function(t) {
        t.off("add remove", this._onLayerChange, this);
        var e = this._getLayer(_(t));
        return e && this._layers.splice(this._layers.indexOf(e), 1), this._map ? this._update() : this;
      },
      // @method expand(): this
      // Expand the control container if collapsed.
      expand: function() {
        tt(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
        var t = this._map.getSize().y - (this._container.offsetTop + 50);
        return t < this._section.clientHeight ? (tt(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = t + "px") : Lt(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
      },
      // @method collapse(): this
      // Collapse the control container if expanded.
      collapse: function() {
        return Lt(this._container, "leaflet-control-layers-expanded"), this;
      },
      _initLayout: function() {
        var t = "leaflet-control-layers", e = this._container = at("div", t), o = this.options.collapsed;
        e.setAttribute("aria-haspopup", !0), ji(e), Vo(e);
        var r = this._section = at("section", t + "-list");
        o && (this._map.on("click", this.collapse, this), X(e, {
          mouseenter: this._expandSafely,
          mouseleave: this.collapse
        }, this));
        var u = this._layersLink = at("a", t + "-toggle", e);
        u.href = "#", u.title = "Layers", u.setAttribute("role", "button"), X(u, {
          keydown: function(h) {
            h.keyCode === 13 && this._expandSafely();
          },
          // Certain screen readers intercept the key event and instead send a click event
          click: function(h) {
            Ft(h), this._expandSafely();
          }
        }, this), o || this.expand(), this._baseLayersList = at("div", t + "-base", r), this._separator = at("div", t + "-separator", r), this._overlaysList = at("div", t + "-overlays", r), e.appendChild(r);
      },
      _getLayer: function(t) {
        for (var e = 0; e < this._layers.length; e++)
          if (this._layers[e] && _(this._layers[e].layer) === t)
            return this._layers[e];
      },
      _addLayer: function(t, e, o) {
        this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({
          layer: t,
          name: e,
          overlay: o
        }), this.options.sortLayers && this._layers.sort(f(function(r, u) {
          return this.options.sortFunction(r.layer, u.layer, r.name, u.name);
        }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
      },
      _update: function() {
        if (!this._container)
          return this;
        Tn(this._baseLayersList), Tn(this._overlaysList), this._layerControlInputs = [];
        var t, e, o, r, u = 0;
        for (o = 0; o < this._layers.length; o++)
          r = this._layers[o], this._addItem(r), e = e || r.overlay, t = t || !r.overlay, u += r.overlay ? 0 : 1;
        return this.options.hideSingleBase && (t = t && u > 1, this._baseLayersList.style.display = t ? "" : "none"), this._separator.style.display = e && t ? "" : "none", this;
      },
      _onLayerChange: function(t) {
        this._handlingClick || this._update();
        var e = this._getLayer(_(t.target)), o = e.overlay ? t.type === "add" ? "overlayadd" : "overlayremove" : t.type === "add" ? "baselayerchange" : null;
        o && this._map.fire(o, e);
      },
      // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
      _createRadioElement: function(t, e) {
        var o = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (e ? ' checked="checked"' : "") + "/>", r = document.createElement("div");
        return r.innerHTML = o, r.firstChild;
      },
      _addItem: function(t) {
        var e = document.createElement("label"), o = this._map.hasLayer(t.layer), r;
        t.overlay ? (r = document.createElement("input"), r.type = "checkbox", r.className = "leaflet-control-layers-selector", r.defaultChecked = o) : r = this._createRadioElement("leaflet-base-layers_" + _(this), o), this._layerControlInputs.push(r), r.layerId = _(t.layer), X(r, "click", this._onInputClick, this);
        var u = document.createElement("span");
        u.innerHTML = " " + t.name;
        var h = document.createElement("span");
        e.appendChild(h), h.appendChild(r), h.appendChild(u);
        var m = t.overlay ? this._overlaysList : this._baseLayersList;
        return m.appendChild(e), this._checkDisabledLayers(), e;
      },
      _onInputClick: function() {
        if (!this._preventClick) {
          var t = this._layerControlInputs, e, o, r = [], u = [];
          this._handlingClick = !0;
          for (var h = t.length - 1; h >= 0; h--)
            e = t[h], o = this._getLayer(e.layerId).layer, e.checked ? r.push(o) : e.checked || u.push(o);
          for (h = 0; h < u.length; h++)
            this._map.hasLayer(u[h]) && this._map.removeLayer(u[h]);
          for (h = 0; h < r.length; h++)
            this._map.hasLayer(r[h]) || this._map.addLayer(r[h]);
          this._handlingClick = !1, this._refocusOnMap();
        }
      },
      _checkDisabledLayers: function() {
        for (var t = this._layerControlInputs, e, o, r = this._map.getZoom(), u = t.length - 1; u >= 0; u--)
          e = t[u], o = this._getLayer(e.layerId).layer, e.disabled = o.options.minZoom !== void 0 && r < o.options.minZoom || o.options.maxZoom !== void 0 && r > o.options.maxZoom;
      },
      _expandIfNotCollapsed: function() {
        return this._map && !this.options.collapsed && this.expand(), this;
      },
      _expandSafely: function() {
        var t = this._section;
        this._preventClick = !0, X(t, "click", Ft), this.expand();
        var e = this;
        setTimeout(function() {
          mt(t, "click", Ft), e._preventClick = !1;
        });
      }
    }), mu = function(t, e, o) {
      return new fr(t, e, o);
    }, Bo = pe.extend({
      // @section
      // @aka Control.Zoom options
      options: {
        position: "topleft",
        // @option zoomInText: String = '<span aria-hidden="true">+</span>'
        // The text set on the 'zoom in' button.
        zoomInText: '<span aria-hidden="true">+</span>',
        // @option zoomInTitle: String = 'Zoom in'
        // The title set on the 'zoom in' button.
        zoomInTitle: "Zoom in",
        // @option zoomOutText: String = '<span aria-hidden="true">&#x2212;</span>'
        // The text set on the 'zoom out' button.
        zoomOutText: '<span aria-hidden="true">&#x2212;</span>',
        // @option zoomOutTitle: String = 'Zoom out'
        // The title set on the 'zoom out' button.
        zoomOutTitle: "Zoom out"
      },
      onAdd: function(t) {
        var e = "leaflet-control-zoom", o = at("div", e + " leaflet-bar"), r = this.options;
        return this._zoomInButton = this._createButton(
          r.zoomInText,
          r.zoomInTitle,
          e + "-in",
          o,
          this._zoomIn
        ), this._zoomOutButton = this._createButton(
          r.zoomOutText,
          r.zoomOutTitle,
          e + "-out",
          o,
          this._zoomOut
        ), this._updateDisabled(), t.on("zoomend zoomlevelschange", this._updateDisabled, this), o;
      },
      onRemove: function(t) {
        t.off("zoomend zoomlevelschange", this._updateDisabled, this);
      },
      disable: function() {
        return this._disabled = !0, this._updateDisabled(), this;
      },
      enable: function() {
        return this._disabled = !1, this._updateDisabled(), this;
      },
      _zoomIn: function(t) {
        !this._disabled && this._map._zoom < this._map.getMaxZoom() && this._map.zoomIn(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
      },
      _zoomOut: function(t) {
        !this._disabled && this._map._zoom > this._map.getMinZoom() && this._map.zoomOut(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
      },
      _createButton: function(t, e, o, r, u) {
        var h = at("a", o, r);
        return h.innerHTML = t, h.href = "#", h.title = e, h.setAttribute("role", "button"), h.setAttribute("aria-label", e), ji(h), X(h, "click", oi), X(h, "click", u, this), X(h, "click", this._refocusOnMap, this), h;
      },
      _updateDisabled: function() {
        var t = this._map, e = "leaflet-disabled";
        Lt(this._zoomInButton, e), Lt(this._zoomOutButton, e), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || t._zoom === t.getMinZoom()) && (tt(this._zoomOutButton, e), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || t._zoom === t.getMaxZoom()) && (tt(this._zoomInButton, e), this._zoomInButton.setAttribute("aria-disabled", "true"));
      }
    });
    rt.mergeOptions({
      zoomControl: !0
    }), rt.addInitHook(function() {
      this.options.zoomControl && (this.zoomControl = new Bo(), this.addControl(this.zoomControl));
    });
    var gu = function(t) {
      return new Bo(t);
    }, dr = pe.extend({
      // @section
      // @aka Control.Scale options
      options: {
        position: "bottomleft",
        // @option maxWidth: Number = 100
        // Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
        maxWidth: 100,
        // @option metric: Boolean = True
        // Whether to show the metric scale line (m/km).
        metric: !0,
        // @option imperial: Boolean = True
        // Whether to show the imperial scale line (mi/ft).
        imperial: !0
        // @option updateWhenIdle: Boolean = false
        // If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
      },
      onAdd: function(t) {
        var e = "leaflet-control-scale", o = at("div", e), r = this.options;
        return this._addScales(r, e + "-line", o), t.on(r.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), o;
      },
      onRemove: function(t) {
        t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
      },
      _addScales: function(t, e, o) {
        t.metric && (this._mScale = at("div", e, o)), t.imperial && (this._iScale = at("div", e, o));
      },
      _update: function() {
        var t = this._map, e = t.getSize().y / 2, o = t.distance(
          t.containerPointToLatLng([0, e]),
          t.containerPointToLatLng([this.options.maxWidth, e])
        );
        this._updateScales(o);
      },
      _updateScales: function(t) {
        this.options.metric && t && this._updateMetric(t), this.options.imperial && t && this._updateImperial(t);
      },
      _updateMetric: function(t) {
        var e = this._getRoundNum(t), o = e < 1e3 ? e + " m" : e / 1e3 + " km";
        this._updateScale(this._mScale, o, e / t);
      },
      _updateImperial: function(t) {
        var e = t * 3.2808399, o, r, u;
        e > 5280 ? (o = e / 5280, r = this._getRoundNum(o), this._updateScale(this._iScale, r + " mi", r / o)) : (u = this._getRoundNum(e), this._updateScale(this._iScale, u + " ft", u / e));
      },
      _updateScale: function(t, e, o) {
        t.style.width = Math.round(this.options.maxWidth * o) + "px", t.innerHTML = e;
      },
      _getRoundNum: function(t) {
        var e = Math.pow(10, (Math.floor(t) + "").length - 1), o = t / e;
        return o = o >= 10 ? 10 : o >= 5 ? 5 : o >= 3 ? 3 : o >= 2 ? 2 : 1, e * o;
      }
    }), vu = function(t) {
      return new dr(t);
    }, yu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', Zo = pe.extend({
      // @section
      // @aka Control.Attribution options
      options: {
        position: "bottomright",
        // @option prefix: String|false = 'Leaflet'
        // The HTML text shown before the attributions. Pass `false` to disable.
        prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (H.inlineSvg ? yu + " " : "") + "Leaflet</a>"
      },
      initialize: function(t) {
        I(this, t), this._attributions = {};
      },
      onAdd: function(t) {
        t.attributionControl = this, this._container = at("div", "leaflet-control-attribution"), ji(this._container);
        for (var e in t._layers)
          t._layers[e].getAttribution && this.addAttribution(t._layers[e].getAttribution());
        return this._update(), t.on("layeradd", this._addAttribution, this), this._container;
      },
      onRemove: function(t) {
        t.off("layeradd", this._addAttribution, this);
      },
      _addAttribution: function(t) {
        t.layer.getAttribution && (this.addAttribution(t.layer.getAttribution()), t.layer.once("remove", function() {
          this.removeAttribution(t.layer.getAttribution());
        }, this));
      },
      // @method setPrefix(prefix: String|false): this
      // The HTML text shown before the attributions. Pass `false` to disable.
      setPrefix: function(t) {
        return this.options.prefix = t, this._update(), this;
      },
      // @method addAttribution(text: String): this
      // Adds an attribution text (e.g. `'&copy; OpenStreetMap contributors'`).
      addAttribution: function(t) {
        return t ? (this._attributions[t] || (this._attributions[t] = 0), this._attributions[t]++, this._update(), this) : this;
      },
      // @method removeAttribution(text: String): this
      // Removes an attribution text.
      removeAttribution: function(t) {
        return t ? (this._attributions[t] && (this._attributions[t]--, this._update()), this) : this;
      },
      _update: function() {
        if (this._map) {
          var t = [];
          for (var e in this._attributions)
            this._attributions[e] && t.push(e);
          var o = [];
          this.options.prefix && o.push(this.options.prefix), t.length && o.push(t.join(", ")), this._container.innerHTML = o.join(' <span aria-hidden="true">|</span> ');
        }
      }
    });
    rt.mergeOptions({
      attributionControl: !0
    }), rt.addInitHook(function() {
      this.options.attributionControl && new Zo().addTo(this);
    });
    var bu = function(t) {
      return new Zo(t);
    };
    pe.Layers = fr, pe.Zoom = Bo, pe.Scale = dr, pe.Attribution = Zo, Ui.layers = mu, Ui.zoom = gu, Ui.scale = vu, Ui.attribution = bu;
    var Te = le.extend({
      initialize: function(t) {
        this._map = t;
      },
      // @method enable(): this
      // Enables the handler
      enable: function() {
        return this._enabled ? this : (this._enabled = !0, this.addHooks(), this);
      },
      // @method disable(): this
      // Disables the handler
      disable: function() {
        return this._enabled ? (this._enabled = !1, this.removeHooks(), this) : this;
      },
      // @method enabled(): Boolean
      // Returns `true` if the handler is enabled
      enabled: function() {
        return !!this._enabled;
      }
      // @section Extension methods
      // Classes inheriting from `Handler` must implement the two following methods:
      // @method addHooks()
      // Called when the handler is enabled, should add event hooks.
      // @method removeHooks()
      // Called when the handler is disabled, should remove the event hooks added previously.
    });
    Te.addTo = function(t, e) {
      return t.addHandler(e, this), this;
    };
    var wu = { Events: pt }, pr = H.touch ? "touchstart mousedown" : "mousedown", Ke = Q.extend({
      options: {
        // @section
        // @aka Draggable options
        // @option clickTolerance: Number = 3
        // The max number of pixels a user can shift the mouse pointer during a click
        // for it to be considered a valid click (as opposed to a mouse drag).
        clickTolerance: 3
      },
      // @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
      // Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
      initialize: function(t, e, o, r) {
        I(this, r), this._element = t, this._dragStartTarget = e || t, this._preventOutline = o;
      },
      // @method enable()
      // Enables the dragging ability
      enable: function() {
        this._enabled || (X(this._dragStartTarget, pr, this._onDown, this), this._enabled = !0);
      },
      // @method disable()
      // Disables the dragging ability
      disable: function() {
        this._enabled && (Ke._dragging === this && this.finishDrag(!0), mt(this._dragStartTarget, pr, this._onDown, this), this._enabled = !1, this._moved = !1);
      },
      _onDown: function(t) {
        if (this._enabled && (this._moved = !1, !To(this._element, "leaflet-zoom-anim"))) {
          if (t.touches && t.touches.length !== 1) {
            Ke._dragging === this && this.finishDrag();
            return;
          }
          if (!(Ke._dragging || t.shiftKey || t.which !== 1 && t.button !== 1 && !t.touches) && (Ke._dragging = this, this._preventOutline && Do(this._element), So(), Hi(), !this._moving)) {
            this.fire("down");
            var e = t.touches ? t.touches[0] : t, o = rr(this._element);
            this._startPoint = new V(e.clientX, e.clientY), this._startPos = ii(this._element), this._parentScale = Ao(o);
            var r = t.type === "mousedown";
            X(document, r ? "mousemove" : "touchmove", this._onMove, this), X(document, r ? "mouseup" : "touchend touchcancel", this._onUp, this);
          }
        }
      },
      _onMove: function(t) {
        if (this._enabled) {
          if (t.touches && t.touches.length > 1) {
            this._moved = !0;
            return;
          }
          var e = t.touches && t.touches.length === 1 ? t.touches[0] : t, o = new V(e.clientX, e.clientY)._subtract(this._startPoint);
          !o.x && !o.y || Math.abs(o.x) + Math.abs(o.y) < this.options.clickTolerance || (o.x /= this._parentScale.x, o.y /= this._parentScale.y, Ft(t), this._moved || (this.fire("dragstart"), this._moved = !0, tt(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), tt(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(o), this._moving = !0, this._lastEvent = t, this._updatePosition());
        }
      },
      _updatePosition: function() {
        var t = { originalEvent: this._lastEvent };
        this.fire("predrag", t), St(this._element, this._newPos), this.fire("drag", t);
      },
      _onUp: function() {
        this._enabled && this.finishDrag();
      },
      finishDrag: function(t) {
        Lt(document.body, "leaflet-dragging"), this._lastTarget && (Lt(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), mt(document, "mousemove touchmove", this._onMove, this), mt(document, "mouseup touchend touchcancel", this._onUp, this), Co(), $i();
        var e = this._moved && this._moving;
        this._moving = !1, Ke._dragging = !1, e && this.fire("dragend", {
          noInertia: t,
          distance: this._newPos.distanceTo(this._startPos)
        });
      }
    });
    function _r(t, e, o) {
      var r, u = [1, 4, 2, 8], h, m, b, x, N, B, U, it;
      for (h = 0, B = t.length; h < B; h++)
        t[h]._code = si(t[h], e);
      for (b = 0; b < 4; b++) {
        for (U = u[b], r = [], h = 0, B = t.length, m = B - 1; h < B; m = h++)
          x = t[h], N = t[m], x._code & U ? N._code & U || (it = Mn(N, x, U, e, o), it._code = si(it, e), r.push(it)) : (N._code & U && (it = Mn(N, x, U, e, o), it._code = si(it, e), r.push(it)), r.push(x));
        t = r;
      }
      return t;
    }
    function mr(t, e) {
      var o, r, u, h, m, b, x, N, B;
      if (!t || t.length === 0)
        throw new Error("latlngs not passed");
      he(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
      var U = ot([0, 0]), it = bt(t), Ut = it.getNorthWest().distanceTo(it.getSouthWest()) * it.getNorthEast().distanceTo(it.getNorthWest());
      Ut < 1700 && (U = Fo(t));
      var zt = t.length, fe = [];
      for (o = 0; o < zt; o++) {
        var Yt = ot(t[o]);
        fe.push(e.project(ot([Yt.lat - U.lat, Yt.lng - U.lng])));
      }
      for (b = x = N = 0, o = 0, r = zt - 1; o < zt; r = o++)
        u = fe[o], h = fe[r], m = u.y * h.x - h.y * u.x, x += (u.x + h.x) * m, N += (u.y + h.y) * m, b += m * 3;
      b === 0 ? B = fe[0] : B = [x / b, N / b];
      var Ni = e.unproject(G(B));
      return ot([Ni.lat + U.lat, Ni.lng + U.lng]);
    }
    function Fo(t) {
      for (var e = 0, o = 0, r = 0, u = 0; u < t.length; u++) {
        var h = ot(t[u]);
        e += h.lat, o += h.lng, r++;
      }
      return ot([e / r, o / r]);
    }
    var xu = {
      __proto__: null,
      clipPolygon: _r,
      polygonCenter: mr,
      centroid: Fo
    };
    function gr(t, e) {
      if (!e || !t.length)
        return t.slice();
      var o = e * e;
      return t = Ou(t, o), t = Pu(t, o), t;
    }
    function vr(t, e, o) {
      return Math.sqrt(Ki(t, e, o, !0));
    }
    function Eu(t, e, o) {
      return Ki(t, e, o);
    }
    function Pu(t, e) {
      var o = t.length, r = typeof Uint8Array < "u" ? Uint8Array : Array, u = new r(o);
      u[0] = u[o - 1] = 1, Ho(t, u, e, 0, o - 1);
      var h, m = [];
      for (h = 0; h < o; h++)
        u[h] && m.push(t[h]);
      return m;
    }
    function Ho(t, e, o, r, u) {
      var h = 0, m, b, x;
      for (b = r + 1; b <= u - 1; b++)
        x = Ki(t[b], t[r], t[u], !0), x > h && (m = b, h = x);
      h > o && (e[m] = 1, Ho(t, e, o, r, m), Ho(t, e, o, m, u));
    }
    function Ou(t, e) {
      for (var o = [t[0]], r = 1, u = 0, h = t.length; r < h; r++)
        Tu(t[r], t[u]) > e && (o.push(t[r]), u = r);
      return u < h - 1 && o.push(t[h - 1]), o;
    }
    var yr;
    function br(t, e, o, r, u) {
      var h = r ? yr : si(t, o), m = si(e, o), b, x, N;
      for (yr = m; ; ) {
        if (!(h | m))
          return [t, e];
        if (h & m)
          return !1;
        b = h || m, x = Mn(t, e, b, o, u), N = si(x, o), b === h ? (t = x, h = N) : (e = x, m = N);
      }
    }
    function Mn(t, e, o, r, u) {
      var h = e.x - t.x, m = e.y - t.y, b = r.min, x = r.max, N, B;
      return o & 8 ? (N = t.x + h * (x.y - t.y) / m, B = x.y) : o & 4 ? (N = t.x + h * (b.y - t.y) / m, B = b.y) : o & 2 ? (N = x.x, B = t.y + m * (x.x - t.x) / h) : o & 1 && (N = b.x, B = t.y + m * (b.x - t.x) / h), new V(N, B, u);
    }
    function si(t, e) {
      var o = 0;
      return t.x < e.min.x ? o |= 1 : t.x > e.max.x && (o |= 2), t.y < e.min.y ? o |= 4 : t.y > e.max.y && (o |= 8), o;
    }
    function Tu(t, e) {
      var o = e.x - t.x, r = e.y - t.y;
      return o * o + r * r;
    }
    function Ki(t, e, o, r) {
      var u = e.x, h = e.y, m = o.x - u, b = o.y - h, x = m * m + b * b, N;
      return x > 0 && (N = ((t.x - u) * m + (t.y - h) * b) / x, N > 1 ? (u = o.x, h = o.y) : N > 0 && (u += m * N, h += b * N)), m = t.x - u, b = t.y - h, r ? m * m + b * b : new V(u, h);
    }
    function he(t) {
      return !Y(t[0]) || typeof t[0][0] != "object" && typeof t[0][0] < "u";
    }
    function wr(t) {
      return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), he(t);
    }
    function xr(t, e) {
      var o, r, u, h, m, b, x, N;
      if (!t || t.length === 0)
        throw new Error("latlngs not passed");
      he(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
      var B = ot([0, 0]), U = bt(t), it = U.getNorthWest().distanceTo(U.getSouthWest()) * U.getNorthEast().distanceTo(U.getNorthWest());
      it < 1700 && (B = Fo(t));
      var Ut = t.length, zt = [];
      for (o = 0; o < Ut; o++) {
        var fe = ot(t[o]);
        zt.push(e.project(ot([fe.lat - B.lat, fe.lng - B.lng])));
      }
      for (o = 0, r = 0; o < Ut - 1; o++)
        r += zt[o].distanceTo(zt[o + 1]) / 2;
      if (r === 0)
        N = zt[0];
      else
        for (o = 0, h = 0; o < Ut - 1; o++)
          if (m = zt[o], b = zt[o + 1], u = m.distanceTo(b), h += u, h > r) {
            x = (h - r) / u, N = [
              b.x - x * (b.x - m.x),
              b.y - x * (b.y - m.y)
            ];
            break;
          }
      var Yt = e.unproject(G(N));
      return ot([Yt.lat + B.lat, Yt.lng + B.lng]);
    }
    var Nu = {
      __proto__: null,
      simplify: gr,
      pointToSegmentDistance: vr,
      closestPointOnSegment: Eu,
      clipSegment: br,
      _getEdgeIntersection: Mn,
      _getBitCode: si,
      _sqClosestPointOnSegment: Ki,
      isFlat: he,
      _flat: wr,
      polylineCenter: xr
    }, $o = {
      project: function(t) {
        return new V(t.lng, t.lat);
      },
      unproject: function(t) {
        return new ut(t.y, t.x);
      },
      bounds: new ft([-180, -90], [180, 90])
    }, Wo = {
      R: 6378137,
      R_MINOR: 6356752314245179e-9,
      bounds: new ft([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
      project: function(t) {
        var e = Math.PI / 180, o = this.R, r = t.lat * e, u = this.R_MINOR / o, h = Math.sqrt(1 - u * u), m = h * Math.sin(r), b = Math.tan(Math.PI / 4 - r / 2) / Math.pow((1 - m) / (1 + m), h / 2);
        return r = -o * Math.log(Math.max(b, 1e-10)), new V(t.lng * e * o, r);
      },
      unproject: function(t) {
        for (var e = 180 / Math.PI, o = this.R, r = this.R_MINOR / o, u = Math.sqrt(1 - r * r), h = Math.exp(-t.y / o), m = Math.PI / 2 - 2 * Math.atan(h), b = 0, x = 0.1, N; b < 15 && Math.abs(x) > 1e-7; b++)
          N = u * Math.sin(m), N = Math.pow((1 - N) / (1 + N), u / 2), x = Math.PI / 2 - 2 * Math.atan(h * N) - m, m += x;
        return new ut(m * e, t.x * e / o);
      }
    }, Lu = {
      __proto__: null,
      LonLat: $o,
      Mercator: Wo,
      SphericalMercator: gi
    }, Su = l({}, ee, {
      code: "EPSG:3395",
      projection: Wo,
      transformation: function() {
        var t = 0.5 / (Math.PI * Wo.R);
        return vi(t, 0.5, -t, 0.5);
      }()
    }), Er = l({}, ee, {
      code: "EPSG:4326",
      projection: $o,
      transformation: vi(1 / 180, 1, -1 / 180, 0.5)
    }), Cu = l({}, jt, {
      projection: $o,
      transformation: vi(1, 0, -1, 0),
      scale: function(t) {
        return Math.pow(2, t);
      },
      zoom: function(t) {
        return Math.log(t) / Math.LN2;
      },
      distance: function(t, e) {
        var o = e.lng - t.lng, r = e.lat - t.lat;
        return Math.sqrt(o * o + r * r);
      },
      infinite: !0
    });
    jt.Earth = ee, jt.EPSG3395 = Su, jt.EPSG3857 = p, jt.EPSG900913 = v, jt.EPSG4326 = Er, jt.Simple = Cu;
    var _e = Q.extend({
      // Classes extending `L.Layer` will inherit the following options:
      options: {
        // @option pane: String = 'overlayPane'
        // By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
        pane: "overlayPane",
        // @option attribution: String = null
        // String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
        attribution: null,
        bubblingMouseEvents: !0
      },
      /* @section
       * Classes extending `L.Layer` will inherit the following methods:
       *
       * @method addTo(map: Map|LayerGroup): this
       * Adds the layer to the given map or layer group.
       */
      addTo: function(t) {
        return t.addLayer(this), this;
      },
      // @method remove: this
      // Removes the layer from the map it is currently active on.
      remove: function() {
        return this.removeFrom(this._map || this._mapToAdd);
      },
      // @method removeFrom(map: Map): this
      // Removes the layer from the given map
      //
      // @alternative
      // @method removeFrom(group: LayerGroup): this
      // Removes the layer from the given `LayerGroup`
      removeFrom: function(t) {
        return t && t.removeLayer(this), this;
      },
      // @method getPane(name? : String): HTMLElement
      // Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
      getPane: function(t) {
        return this._map.getPane(t ? this.options[t] || t : this.options.pane);
      },
      addInteractiveTarget: function(t) {
        return this._map._targets[_(t)] = this, this;
      },
      removeInteractiveTarget: function(t) {
        return delete this._map._targets[_(t)], this;
      },
      // @method getAttribution: String
      // Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
      getAttribution: function() {
        return this.options.attribution;
      },
      _layerAdd: function(t) {
        var e = t.target;
        if (e.hasLayer(this)) {
          if (this._map = e, this._zoomAnimated = e._zoomAnimated, this.getEvents) {
            var o = this.getEvents();
            e.on(o, this), this.once("remove", function() {
              e.off(o, this);
            }, this);
          }
          this.onAdd(e), this.fire("add"), e.fire("layeradd", { layer: this });
        }
      }
    });
    rt.include({
      // @method addLayer(layer: Layer): this
      // Adds the given layer to the map
      addLayer: function(t) {
        if (!t._layerAdd)
          throw new Error("The provided object is not a Layer.");
        var e = _(t);
        return this._layers[e] ? this : (this._layers[e] = t, t._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t), this);
      },
      // @method removeLayer(layer: Layer): this
      // Removes the given layer from the map.
      removeLayer: function(t) {
        var e = _(t);
        return this._layers[e] ? (this._loaded && t.onRemove(this), delete this._layers[e], this._loaded && (this.fire("layerremove", { layer: t }), t.fire("remove")), t._map = t._mapToAdd = null, this) : this;
      },
      // @method hasLayer(layer: Layer): Boolean
      // Returns `true` if the given layer is currently added to the map
      hasLayer: function(t) {
        return _(t) in this._layers;
      },
      /* @method eachLayer(fn: Function, context?: Object): this
       * Iterates over the layers of the map, optionally specifying context of the iterator function.
       * ```
       * map.eachLayer(function(layer){
       *     layer.bindPopup('Hello');
       * });
       * ```
       */
      eachLayer: function(t, e) {
        for (var o in this._layers)
          t.call(e, this._layers[o]);
        return this;
      },
      _addLayers: function(t) {
        t = t ? Y(t) ? t : [t] : [];
        for (var e = 0, o = t.length; e < o; e++)
          this.addLayer(t[e]);
      },
      _addZoomLimit: function(t) {
        (!isNaN(t.options.maxZoom) || !isNaN(t.options.minZoom)) && (this._zoomBoundLayers[_(t)] = t, this._updateZoomLevels());
      },
      _removeZoomLimit: function(t) {
        var e = _(t);
        this._zoomBoundLayers[e] && (delete this._zoomBoundLayers[e], this._updateZoomLevels());
      },
      _updateZoomLevels: function() {
        var t = 1 / 0, e = -1 / 0, o = this._getZoomSpan();
        for (var r in this._zoomBoundLayers) {
          var u = this._zoomBoundLayers[r].options;
          t = u.minZoom === void 0 ? t : Math.min(t, u.minZoom), e = u.maxZoom === void 0 ? e : Math.max(e, u.maxZoom);
        }
        this._layersMaxZoom = e === -1 / 0 ? void 0 : e, this._layersMinZoom = t === 1 / 0 ? void 0 : t, o !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
      }
    });
    var xi = _e.extend({
      initialize: function(t, e) {
        I(this, e), this._layers = {};
        var o, r;
        if (t)
          for (o = 0, r = t.length; o < r; o++)
            this.addLayer(t[o]);
      },
      // @method addLayer(layer: Layer): this
      // Adds the given layer to the group.
      addLayer: function(t) {
        var e = this.getLayerId(t);
        return this._layers[e] = t, this._map && this._map.addLayer(t), this;
      },
      // @method removeLayer(layer: Layer): this
      // Removes the given layer from the group.
      // @alternative
      // @method removeLayer(id: Number): this
      // Removes the layer with the given internal ID from the group.
      removeLayer: function(t) {
        var e = t in this._layers ? t : this.getLayerId(t);
        return this._map && this._layers[e] && this._map.removeLayer(this._layers[e]), delete this._layers[e], this;
      },
      // @method hasLayer(layer: Layer): Boolean
      // Returns `true` if the given layer is currently added to the group.
      // @alternative
      // @method hasLayer(id: Number): Boolean
      // Returns `true` if the given internal ID is currently added to the group.
      hasLayer: function(t) {
        var e = typeof t == "number" ? t : this.getLayerId(t);
        return e in this._layers;
      },
      // @method clearLayers(): this
      // Removes all the layers from the group.
      clearLayers: function() {
        return this.eachLayer(this.removeLayer, this);
      },
      // @method invoke(methodName: String, …): this
      // Calls `methodName` on every layer contained in this group, passing any
      // additional parameters. Has no effect if the layers contained do not
      // implement `methodName`.
      invoke: function(t) {
        var e = Array.prototype.slice.call(arguments, 1), o, r;
        for (o in this._layers)
          r = this._layers[o], r[t] && r[t].apply(r, e);
        return this;
      },
      onAdd: function(t) {
        this.eachLayer(t.addLayer, t);
      },
      onRemove: function(t) {
        this.eachLayer(t.removeLayer, t);
      },
      // @method eachLayer(fn: Function, context?: Object): this
      // Iterates over the layers of the group, optionally specifying context of the iterator function.
      // ```js
      // group.eachLayer(function (layer) {
      // 	layer.bindPopup('Hello');
      // });
      // ```
      eachLayer: function(t, e) {
        for (var o in this._layers)
          t.call(e, this._layers[o]);
        return this;
      },
      // @method getLayer(id: Number): Layer
      // Returns the layer with the given internal ID.
      getLayer: function(t) {
        return this._layers[t];
      },
      // @method getLayers(): Layer[]
      // Returns an array of all the layers added to the group.
      getLayers: function() {
        var t = [];
        return this.eachLayer(t.push, t), t;
      },
      // @method setZIndex(zIndex: Number): this
      // Calls `setZIndex` on every layer contained in this group, passing the z-index.
      setZIndex: function(t) {
        return this.invoke("setZIndex", t);
      },
      // @method getLayerId(layer: Layer): Number
      // Returns the internal ID for a layer
      getLayerId: function(t) {
        return _(t);
      }
    }), Mu = function(t, e) {
      return new xi(t, e);
    }, Ve = xi.extend({
      addLayer: function(t) {
        return this.hasLayer(t) ? this : (t.addEventParent(this), xi.prototype.addLayer.call(this, t), this.fire("layeradd", { layer: t }));
      },
      removeLayer: function(t) {
        return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.removeEventParent(this), xi.prototype.removeLayer.call(this, t), this.fire("layerremove", { layer: t })) : this;
      },
      // @method setStyle(style: Path options): this
      // Sets the given path options to each layer of the group that has a `setStyle` method.
      setStyle: function(t) {
        return this.invoke("setStyle", t);
      },
      // @method bringToFront(): this
      // Brings the layer group to the top of all other layers
      bringToFront: function() {
        return this.invoke("bringToFront");
      },
      // @method bringToBack(): this
      // Brings the layer group to the back of all other layers
      bringToBack: function() {
        return this.invoke("bringToBack");
      },
      // @method getBounds(): LatLngBounds
      // Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
      getBounds: function() {
        var t = new Et();
        for (var e in this._layers) {
          var o = this._layers[e];
          t.extend(o.getBounds ? o.getBounds() : o.getLatLng());
        }
        return t;
      }
    }), Du = function(t, e) {
      return new Ve(t, e);
    }, Ei = le.extend({
      /* @section
       * @aka Icon options
       *
       * @option iconUrl: String = null
       * **(required)** The URL to the icon image (absolute or relative to your script path).
       *
       * @option iconRetinaUrl: String = null
       * The URL to a retina sized version of the icon image (absolute or relative to your
       * script path). Used for Retina screen devices.
       *
       * @option iconSize: Point = null
       * Size of the icon image in pixels.
       *
       * @option iconAnchor: Point = null
       * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
       * will be aligned so that this point is at the marker's geographical location. Centered
       * by default if size is specified, also can be set in CSS with negative margins.
       *
       * @option popupAnchor: Point = [0, 0]
       * The coordinates of the point from which popups will "open", relative to the icon anchor.
       *
       * @option tooltipAnchor: Point = [0, 0]
       * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
       *
       * @option shadowUrl: String = null
       * The URL to the icon shadow image. If not specified, no shadow image will be created.
       *
       * @option shadowRetinaUrl: String = null
       *
       * @option shadowSize: Point = null
       * Size of the shadow image in pixels.
       *
       * @option shadowAnchor: Point = null
       * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
       * as iconAnchor if not specified).
       *
       * @option className: String = ''
       * A custom class name to assign to both icon and shadow images. Empty by default.
       */
      options: {
        popupAnchor: [0, 0],
        tooltipAnchor: [0, 0],
        // @option crossOrigin: Boolean|String = false
        // Whether the crossOrigin attribute will be added to the tiles.
        // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
        // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
        crossOrigin: !1
      },
      initialize: function(t) {
        I(this, t);
      },
      // @method createIcon(oldIcon?: HTMLElement): HTMLElement
      // Called internally when the icon has to be shown, returns a `<img>` HTML element
      // styled according to the options.
      createIcon: function(t) {
        return this._createIcon("icon", t);
      },
      // @method createShadow(oldIcon?: HTMLElement): HTMLElement
      // As `createIcon`, but for the shadow beneath it.
      createShadow: function(t) {
        return this._createIcon("shadow", t);
      },
      _createIcon: function(t, e) {
        var o = this._getIconUrl(t);
        if (!o) {
          if (t === "icon")
            throw new Error("iconUrl not set in Icon options (see the docs).");
          return null;
        }
        var r = this._createImg(o, e && e.tagName === "IMG" ? e : null);
        return this._setIconStyles(r, t), (this.options.crossOrigin || this.options.crossOrigin === "") && (r.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), r;
      },
      _setIconStyles: function(t, e) {
        var o = this.options, r = o[e + "Size"];
        typeof r == "number" && (r = [r, r]);
        var u = G(r), h = G(e === "shadow" && o.shadowAnchor || o.iconAnchor || u && u.divideBy(2, !0));
        t.className = "leaflet-marker-" + e + " " + (o.className || ""), h && (t.style.marginLeft = -h.x + "px", t.style.marginTop = -h.y + "px"), u && (t.style.width = u.x + "px", t.style.height = u.y + "px");
      },
      _createImg: function(t, e) {
        return e = e || document.createElement("img"), e.src = t, e;
      },
      _getIconUrl: function(t) {
        return H.retina && this.options[t + "RetinaUrl"] || this.options[t + "Url"];
      }
    });
    function Au(t) {
      return new Ei(t);
    }
    var Gi = Ei.extend({
      options: {
        iconUrl: "marker-icon.png",
        iconRetinaUrl: "marker-icon-2x.png",
        shadowUrl: "marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      },
      _getIconUrl: function(t) {
        return typeof Gi.imagePath != "string" && (Gi.imagePath = this._detectIconPath()), (this.options.imagePath || Gi.imagePath) + Ei.prototype._getIconUrl.call(this, t);
      },
      _stripUrl: function(t) {
        var e = function(o, r, u) {
          var h = r.exec(o);
          return h && h[u];
        };
        return t = e(t, /^url\((['"])?(.+)\1\)$/, 2), t && e(t, /^(.*)marker-icon\.png$/, 1);
      },
      _detectIconPath: function() {
        var t = at("div", "leaflet-default-icon-path", document.body), e = Fi(t, "background-image") || Fi(t, "backgroundImage");
        if (document.body.removeChild(t), e = this._stripUrl(e), e)
          return e;
        var o = document.querySelector('link[href$="leaflet.css"]');
        return o ? o.href.substring(0, o.href.length - 11 - 1) : "";
      }
    }), Pr = Te.extend({
      initialize: function(t) {
        this._marker = t;
      },
      addHooks: function() {
        var t = this._marker._icon;
        this._draggable || (this._draggable = new Ke(t, t, !0)), this._draggable.on({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).enable(), tt(t, "leaflet-marker-draggable");
      },
      removeHooks: function() {
        this._draggable.off({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).disable(), this._marker._icon && Lt(this._marker._icon, "leaflet-marker-draggable");
      },
      moved: function() {
        return this._draggable && this._draggable._moved;
      },
      _adjustPan: function(t) {
        var e = this._marker, o = e._map, r = this._marker.options.autoPanSpeed, u = this._marker.options.autoPanPadding, h = ii(e._icon), m = o.getPixelBounds(), b = o.getPixelOrigin(), x = Nt(
          m.min._subtract(b).add(u),
          m.max._subtract(b).subtract(u)
        );
        if (!x.contains(h)) {
          var N = G(
            (Math.max(x.max.x, h.x) - x.max.x) / (m.max.x - x.max.x) - (Math.min(x.min.x, h.x) - x.min.x) / (m.min.x - x.min.x),
            (Math.max(x.max.y, h.y) - x.max.y) / (m.max.y - x.max.y) - (Math.min(x.min.y, h.y) - x.min.y) / (m.min.y - x.min.y)
          ).multiplyBy(r);
          o.panBy(N, { animate: !1 }), this._draggable._newPos._add(N), this._draggable._startPos._add(N), St(e._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = xt(this._adjustPan.bind(this, t));
        }
      },
      _onDragStart: function() {
        this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
      },
      _onPreDrag: function(t) {
        this._marker.options.autoPan && (yt(this._panRequest), this._panRequest = xt(this._adjustPan.bind(this, t)));
      },
      _onDrag: function(t) {
        var e = this._marker, o = e._shadow, r = ii(e._icon), u = e._map.layerPointToLatLng(r);
        o && St(o, r), e._latlng = u, t.latlng = u, t.oldLatLng = this._oldLatLng, e.fire("move", t).fire("drag", t);
      },
      _onDragEnd: function(t) {
        yt(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t);
      }
    }), Dn = _e.extend({
      // @section
      // @aka Marker options
      options: {
        // @option icon: Icon = *
        // Icon instance to use for rendering the marker.
        // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
        // If not specified, a common instance of `L.Icon.Default` is used.
        icon: new Gi(),
        // Option inherited from "Interactive layer" abstract class
        interactive: !0,
        // @option keyboard: Boolean = true
        // Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
        keyboard: !0,
        // @option title: String = ''
        // Text for the browser tooltip that appear on marker hover (no tooltip by default).
        // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
        title: "",
        // @option alt: String = 'Marker'
        // Text for the `alt` attribute of the icon image.
        // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
        alt: "Marker",
        // @option zIndexOffset: Number = 0
        // By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
        zIndexOffset: 0,
        // @option opacity: Number = 1.0
        // The opacity of the marker.
        opacity: 1,
        // @option riseOnHover: Boolean = false
        // If `true`, the marker will get on top of others when you hover the mouse over it.
        riseOnHover: !1,
        // @option riseOffset: Number = 250
        // The z-index offset used for the `riseOnHover` feature.
        riseOffset: 250,
        // @option pane: String = 'markerPane'
        // `Map pane` where the markers icon will be added.
        pane: "markerPane",
        // @option shadowPane: String = 'shadowPane'
        // `Map pane` where the markers shadow will be added.
        shadowPane: "shadowPane",
        // @option bubblingMouseEvents: Boolean = false
        // When `true`, a mouse event on this marker will trigger the same event on the map
        // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
        bubblingMouseEvents: !1,
        // @option autoPanOnFocus: Boolean = true
        // When `true`, the map will pan whenever the marker is focused (via
        // e.g. pressing `tab` on the keyboard) to ensure the marker is
        // visible within the map's bounds
        autoPanOnFocus: !0,
        // @section Draggable marker options
        // @option draggable: Boolean = false
        // Whether the marker is draggable with mouse/touch or not.
        draggable: !1,
        // @option autoPan: Boolean = false
        // Whether to pan the map when dragging this marker near its edge or not.
        autoPan: !1,
        // @option autoPanPadding: Point = Point(50, 50)
        // Distance (in pixels to the left/right and to the top/bottom) of the
        // map edge to start panning the map.
        autoPanPadding: [50, 50],
        // @option autoPanSpeed: Number = 10
        // Number of pixels the map should pan by.
        autoPanSpeed: 10
      },
      /* @section
       *
       * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
       */
      initialize: function(t, e) {
        I(this, e), this._latlng = ot(t);
      },
      onAdd: function(t) {
        this._zoomAnimated = this._zoomAnimated && t.options.markerZoomAnimation, this._zoomAnimated && t.on("zoomanim", this._animateZoom, this), this._initIcon(), this.update();
      },
      onRemove: function(t) {
        this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), delete this.dragging, this._zoomAnimated && t.off("zoomanim", this._animateZoom, this), this._removeIcon(), this._removeShadow();
      },
      getEvents: function() {
        return {
          zoom: this.update,
          viewreset: this.update
        };
      },
      // @method getLatLng: LatLng
      // Returns the current geographical position of the marker.
      getLatLng: function() {
        return this._latlng;
      },
      // @method setLatLng(latlng: LatLng): this
      // Changes the marker position to the given point.
      setLatLng: function(t) {
        var e = this._latlng;
        return this._latlng = ot(t), this.update(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
      },
      // @method setZIndexOffset(offset: Number): this
      // Changes the [zIndex offset](#marker-zindexoffset) of the marker.
      setZIndexOffset: function(t) {
        return this.options.zIndexOffset = t, this.update();
      },
      // @method getIcon: Icon
      // Returns the current icon used by the marker
      getIcon: function() {
        return this.options.icon;
      },
      // @method setIcon(icon: Icon): this
      // Changes the marker icon.
      setIcon: function(t) {
        return this.options.icon = t, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this;
      },
      getElement: function() {
        return this._icon;
      },
      update: function() {
        if (this._icon && this._map) {
          var t = this._map.latLngToLayerPoint(this._latlng).round();
          this._setPos(t);
        }
        return this;
      },
      _initIcon: function() {
        var t = this.options, e = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"), o = t.icon.createIcon(this._icon), r = !1;
        o !== this._icon && (this._icon && this._removeIcon(), r = !0, t.title && (o.title = t.title), o.tagName === "IMG" && (o.alt = t.alt || "")), tt(o, e), t.keyboard && (o.tabIndex = "0", o.setAttribute("role", "button")), this._icon = o, t.riseOnHover && this.on({
          mouseover: this._bringToFront,
          mouseout: this._resetZIndex
        }), this.options.autoPanOnFocus && X(o, "focus", this._panOnFocus, this);
        var u = t.icon.createShadow(this._shadow), h = !1;
        u !== this._shadow && (this._removeShadow(), h = !0), u && (tt(u, e), u.alt = ""), this._shadow = u, t.opacity < 1 && this._updateOpacity(), r && this.getPane().appendChild(this._icon), this._initInteraction(), u && h && this.getPane(t.shadowPane).appendChild(this._shadow);
      },
      _removeIcon: function() {
        this.options.riseOnHover && this.off({
          mouseover: this._bringToFront,
          mouseout: this._resetZIndex
        }), this.options.autoPanOnFocus && mt(this._icon, "focus", this._panOnFocus, this), Pt(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
      },
      _removeShadow: function() {
        this._shadow && Pt(this._shadow), this._shadow = null;
      },
      _setPos: function(t) {
        this._icon && St(this._icon, t), this._shadow && St(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex();
      },
      _updateZIndex: function(t) {
        this._icon && (this._icon.style.zIndex = this._zIndex + t);
      },
      _animateZoom: function(t) {
        var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();
        this._setPos(e);
      },
      _initInteraction: function() {
        if (this.options.interactive && (tt(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), Pr)) {
          var t = this.options.draggable;
          this.dragging && (t = this.dragging.enabled(), this.dragging.disable()), this.dragging = new Pr(this), t && this.dragging.enable();
        }
      },
      // @method setOpacity(opacity: Number): this
      // Changes the opacity of the marker.
      setOpacity: function(t) {
        return this.options.opacity = t, this._map && this._updateOpacity(), this;
      },
      _updateOpacity: function() {
        var t = this.options.opacity;
        this._icon && ce(this._icon, t), this._shadow && ce(this._shadow, t);
      },
      _bringToFront: function() {
        this._updateZIndex(this.options.riseOffset);
      },
      _resetZIndex: function() {
        this._updateZIndex(0);
      },
      _panOnFocus: function() {
        var t = this._map;
        if (t) {
          var e = this.options.icon.options, o = e.iconSize ? G(e.iconSize) : G(0, 0), r = e.iconAnchor ? G(e.iconAnchor) : G(0, 0);
          t.panInside(this._latlng, {
            paddingTopLeft: r,
            paddingBottomRight: o.subtract(r)
          });
        }
      },
      _getPopupAnchor: function() {
        return this.options.icon.options.popupAnchor;
      },
      _getTooltipAnchor: function() {
        return this.options.icon.options.tooltipAnchor;
      }
    });
    function Iu(t, e) {
      return new Dn(t, e);
    }
    var Ge = _e.extend({
      // @section
      // @aka Path options
      options: {
        // @option stroke: Boolean = true
        // Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
        stroke: !0,
        // @option color: String = '#3388ff'
        // Stroke color
        color: "#3388ff",
        // @option weight: Number = 3
        // Stroke width in pixels
        weight: 3,
        // @option opacity: Number = 1.0
        // Stroke opacity
        opacity: 1,
        // @option lineCap: String= 'round'
        // A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
        lineCap: "round",
        // @option lineJoin: String = 'round'
        // A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
        lineJoin: "round",
        // @option dashArray: String = null
        // A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
        dashArray: null,
        // @option dashOffset: String = null
        // A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
        dashOffset: null,
        // @option fill: Boolean = depends
        // Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
        fill: !1,
        // @option fillColor: String = *
        // Fill color. Defaults to the value of the [`color`](#path-color) option
        fillColor: null,
        // @option fillOpacity: Number = 0.2
        // Fill opacity.
        fillOpacity: 0.2,
        // @option fillRule: String = 'evenodd'
        // A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
        fillRule: "evenodd",
        // className: '',
        // Option inherited from "Interactive layer" abstract class
        interactive: !0,
        // @option bubblingMouseEvents: Boolean = true
        // When `true`, a mouse event on this path will trigger the same event on the map
        // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
        bubblingMouseEvents: !0
      },
      beforeAdd: function(t) {
        this._renderer = t.getRenderer(this);
      },
      onAdd: function() {
        this._renderer._initPath(this), this._reset(), this._renderer._addPath(this);
      },
      onRemove: function() {
        this._renderer._removePath(this);
      },
      // @method redraw(): this
      // Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
      redraw: function() {
        return this._map && this._renderer._updatePath(this), this;
      },
      // @method setStyle(style: Path options): this
      // Changes the appearance of a Path based on the options in the `Path options` object.
      setStyle: function(t) {
        return I(this, t), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && t && Object.prototype.hasOwnProperty.call(t, "weight") && this._updateBounds()), this;
      },
      // @method bringToFront(): this
      // Brings the layer to the top of all path layers.
      bringToFront: function() {
        return this._renderer && this._renderer._bringToFront(this), this;
      },
      // @method bringToBack(): this
      // Brings the layer to the bottom of all path layers.
      bringToBack: function() {
        return this._renderer && this._renderer._bringToBack(this), this;
      },
      getElement: function() {
        return this._path;
      },
      _reset: function() {
        this._project(), this._update();
      },
      _clickTolerance: function() {
        return (this.options.stroke ? this.options.weight / 2 : 0) + (this._renderer.options.tolerance || 0);
      }
    }), An = Ge.extend({
      // @section
      // @aka CircleMarker options
      options: {
        fill: !0,
        // @option radius: Number = 10
        // Radius of the circle marker, in pixels
        radius: 10
      },
      initialize: function(t, e) {
        I(this, e), this._latlng = ot(t), this._radius = this.options.radius;
      },
      // @method setLatLng(latLng: LatLng): this
      // Sets the position of a circle marker to a new location.
      setLatLng: function(t) {
        var e = this._latlng;
        return this._latlng = ot(t), this.redraw(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
      },
      // @method getLatLng(): LatLng
      // Returns the current geographical position of the circle marker
      getLatLng: function() {
        return this._latlng;
      },
      // @method setRadius(radius: Number): this
      // Sets the radius of a circle marker. Units are in pixels.
      setRadius: function(t) {
        return this.options.radius = this._radius = t, this.redraw();
      },
      // @method getRadius(): Number
      // Returns the current radius of the circle
      getRadius: function() {
        return this._radius;
      },
      setStyle: function(t) {
        var e = t && t.radius || this._radius;
        return Ge.prototype.setStyle.call(this, t), this.setRadius(e), this;
      },
      _project: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
      },
      _updateBounds: function() {
        var t = this._radius, e = this._radiusY || t, o = this._clickTolerance(), r = [t + o, e + o];
        this._pxBounds = new ft(this._point.subtract(r), this._point.add(r));
      },
      _update: function() {
        this._map && this._updatePath();
      },
      _updatePath: function() {
        this._renderer._updateCircle(this);
      },
      _empty: function() {
        return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(t) {
        return t.distanceTo(this._point) <= this._radius + this._clickTolerance();
      }
    });
    function ku(t, e) {
      return new An(t, e);
    }
    var jo = An.extend({
      initialize: function(t, e, o) {
        if (typeof e == "number" && (e = l({}, o, { radius: e })), I(this, e), this._latlng = ot(t), isNaN(this.options.radius))
          throw new Error("Circle radius cannot be NaN");
        this._mRadius = this.options.radius;
      },
      // @method setRadius(radius: Number): this
      // Sets the radius of a circle. Units are in meters.
      setRadius: function(t) {
        return this._mRadius = t, this.redraw();
      },
      // @method getRadius(): Number
      // Returns the current radius of a circle. Units are in meters.
      getRadius: function() {
        return this._mRadius;
      },
      // @method getBounds(): LatLngBounds
      // Returns the `LatLngBounds` of the path.
      getBounds: function() {
        var t = [this._radius, this._radiusY || this._radius];
        return new Et(
          this._map.layerPointToLatLng(this._point.subtract(t)),
          this._map.layerPointToLatLng(this._point.add(t))
        );
      },
      setStyle: Ge.prototype.setStyle,
      _project: function() {
        var t = this._latlng.lng, e = this._latlng.lat, o = this._map, r = o.options.crs;
        if (r.distance === ee.distance) {
          var u = Math.PI / 180, h = this._mRadius / ee.R / u, m = o.project([e + h, t]), b = o.project([e - h, t]), x = m.add(b).divideBy(2), N = o.unproject(x).lat, B = Math.acos((Math.cos(h * u) - Math.sin(e * u) * Math.sin(N * u)) / (Math.cos(e * u) * Math.cos(N * u))) / u;
          (isNaN(B) || B === 0) && (B = h / Math.cos(Math.PI / 180 * e)), this._point = x.subtract(o.getPixelOrigin()), this._radius = isNaN(B) ? 0 : x.x - o.project([N, t - B]).x, this._radiusY = x.y - m.y;
        } else {
          var U = r.unproject(r.project(this._latlng).subtract([this._mRadius, 0]));
          this._point = o.latLngToLayerPoint(this._latlng), this._radius = this._point.x - o.latLngToLayerPoint(U).x;
        }
        this._updateBounds();
      }
    });
    function zu(t, e, o) {
      return new jo(t, e, o);
    }
    var Re = Ge.extend({
      // @section
      // @aka Polyline options
      options: {
        // @option smoothFactor: Number = 1.0
        // How much to simplify the polyline on each zoom level. More means
        // better performance and smoother look, and less means more accurate representation.
        smoothFactor: 1,
        // @option noClip: Boolean = false
        // Disable polyline clipping.
        noClip: !1
      },
      initialize: function(t, e) {
        I(this, e), this._setLatLngs(t);
      },
      // @method getLatLngs(): LatLng[]
      // Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
      getLatLngs: function() {
        return this._latlngs;
      },
      // @method setLatLngs(latlngs: LatLng[]): this
      // Replaces all the points in the polyline with the given array of geographical points.
      setLatLngs: function(t) {
        return this._setLatLngs(t), this.redraw();
      },
      // @method isEmpty(): Boolean
      // Returns `true` if the Polyline has no LatLngs.
      isEmpty: function() {
        return !this._latlngs.length;
      },
      // @method closestLayerPoint(p: Point): Point
      // Returns the point closest to `p` on the Polyline.
      closestLayerPoint: function(t) {
        for (var e = 1 / 0, o = null, r = Ki, u, h, m = 0, b = this._parts.length; m < b; m++)
          for (var x = this._parts[m], N = 1, B = x.length; N < B; N++) {
            u = x[N - 1], h = x[N];
            var U = r(t, u, h, !0);
            U < e && (e = U, o = r(t, u, h));
          }
        return o && (o.distance = Math.sqrt(e)), o;
      },
      // @method getCenter(): LatLng
      // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
      getCenter: function() {
        if (!this._map)
          throw new Error("Must add layer to map before using getCenter()");
        return xr(this._defaultShape(), this._map.options.crs);
      },
      // @method getBounds(): LatLngBounds
      // Returns the `LatLngBounds` of the path.
      getBounds: function() {
        return this._bounds;
      },
      // @method addLatLng(latlng: LatLng, latlngs?: LatLng[]): this
      // Adds a given point to the polyline. By default, adds to the first ring of
      // the polyline in case of a multi-polyline, but can be overridden by passing
      // a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
      addLatLng: function(t, e) {
        return e = e || this._defaultShape(), t = ot(t), e.push(t), this._bounds.extend(t), this.redraw();
      },
      _setLatLngs: function(t) {
        this._bounds = new Et(), this._latlngs = this._convertLatLngs(t);
      },
      _defaultShape: function() {
        return he(this._latlngs) ? this._latlngs : this._latlngs[0];
      },
      // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
      _convertLatLngs: function(t) {
        for (var e = [], o = he(t), r = 0, u = t.length; r < u; r++)
          o ? (e[r] = ot(t[r]), this._bounds.extend(e[r])) : e[r] = this._convertLatLngs(t[r]);
        return e;
      },
      _project: function() {
        var t = new ft();
        this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t), this._bounds.isValid() && t.isValid() && (this._rawPxBounds = t, this._updateBounds());
      },
      _updateBounds: function() {
        var t = this._clickTolerance(), e = new V(t, t);
        this._rawPxBounds && (this._pxBounds = new ft([
          this._rawPxBounds.min.subtract(e),
          this._rawPxBounds.max.add(e)
        ]));
      },
      // recursively turns latlngs into a set of rings with projected coordinates
      _projectLatlngs: function(t, e, o) {
        var r = t[0] instanceof ut, u = t.length, h, m;
        if (r) {
          for (m = [], h = 0; h < u; h++)
            m[h] = this._map.latLngToLayerPoint(t[h]), o.extend(m[h]);
          e.push(m);
        } else
          for (h = 0; h < u; h++)
            this._projectLatlngs(t[h], e, o);
      },
      // clip polyline by renderer bounds so that we have less to render for performance
      _clipPoints: function() {
        var t = this._renderer._bounds;
        if (this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          var e = this._parts, o, r, u, h, m, b, x;
          for (o = 0, u = 0, h = this._rings.length; o < h; o++)
            for (x = this._rings[o], r = 0, m = x.length; r < m - 1; r++)
              b = br(x[r], x[r + 1], t, r, !0), b && (e[u] = e[u] || [], e[u].push(b[0]), (b[1] !== x[r + 1] || r === m - 2) && (e[u].push(b[1]), u++));
        }
      },
      // simplify each clipped part of the polyline for performance
      _simplifyPoints: function() {
        for (var t = this._parts, e = this.options.smoothFactor, o = 0, r = t.length; o < r; o++)
          t[o] = gr(t[o], e);
      },
      _update: function() {
        this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
      },
      _updatePath: function() {
        this._renderer._updatePoly(this);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(t, e) {
        var o, r, u, h, m, b, x = this._clickTolerance();
        if (!this._pxBounds || !this._pxBounds.contains(t))
          return !1;
        for (o = 0, h = this._parts.length; o < h; o++)
          for (b = this._parts[o], r = 0, m = b.length, u = m - 1; r < m; u = r++)
            if (!(!e && r === 0) && vr(t, b[u], b[r]) <= x)
              return !0;
        return !1;
      }
    });
    function Vu(t, e) {
      return new Re(t, e);
    }
    Re._flat = wr;
    var Pi = Re.extend({
      options: {
        fill: !0
      },
      isEmpty: function() {
        return !this._latlngs.length || !this._latlngs[0].length;
      },
      // @method getCenter(): LatLng
      // Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the Polygon.
      getCenter: function() {
        if (!this._map)
          throw new Error("Must add layer to map before using getCenter()");
        return mr(this._defaultShape(), this._map.options.crs);
      },
      _convertLatLngs: function(t) {
        var e = Re.prototype._convertLatLngs.call(this, t), o = e.length;
        return o >= 2 && e[0] instanceof ut && e[0].equals(e[o - 1]) && e.pop(), e;
      },
      _setLatLngs: function(t) {
        Re.prototype._setLatLngs.call(this, t), he(this._latlngs) && (this._latlngs = [this._latlngs]);
      },
      _defaultShape: function() {
        return he(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
      },
      _clipPoints: function() {
        var t = this._renderer._bounds, e = this.options.weight, o = new V(e, e);
        if (t = new ft(t.min.subtract(o), t.max.add(o)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          for (var r = 0, u = this._rings.length, h; r < u; r++)
            h = _r(this._rings[r], t, !0), h.length && this._parts.push(h);
        }
      },
      _updatePath: function() {
        this._renderer._updatePoly(this, !0);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(t) {
        var e = !1, o, r, u, h, m, b, x, N;
        if (!this._pxBounds || !this._pxBounds.contains(t))
          return !1;
        for (h = 0, x = this._parts.length; h < x; h++)
          for (o = this._parts[h], m = 0, N = o.length, b = N - 1; m < N; b = m++)
            r = o[m], u = o[b], r.y > t.y != u.y > t.y && t.x < (u.x - r.x) * (t.y - r.y) / (u.y - r.y) + r.x && (e = !e);
        return e || Re.prototype._containsPoint.call(this, t, !0);
      }
    });
    function Ru(t, e) {
      return new Pi(t, e);
    }
    var Be = Ve.extend({
      /* @section
       * @aka GeoJSON options
       *
       * @option pointToLayer: Function = *
       * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
       * called when data is added, passing the GeoJSON point feature and its `LatLng`.
       * The default is to spawn a default `Marker`:
       * ```js
       * function(geoJsonPoint, latlng) {
       * 	return L.marker(latlng);
       * }
       * ```
       *
       * @option style: Function = *
       * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
       * called internally when data is added.
       * The default value is to not override any defaults:
       * ```js
       * function (geoJsonFeature) {
       * 	return {}
       * }
       * ```
       *
       * @option onEachFeature: Function = *
       * A `Function` that will be called once for each created `Feature`, after it has
       * been created and styled. Useful for attaching events and popups to features.
       * The default is to do nothing with the newly created layers:
       * ```js
       * function (feature, layer) {}
       * ```
       *
       * @option filter: Function = *
       * A `Function` that will be used to decide whether to include a feature or not.
       * The default is to include all features:
       * ```js
       * function (geoJsonFeature) {
       * 	return true;
       * }
       * ```
       * Note: dynamically changing the `filter` option will have effect only on newly
       * added data. It will _not_ re-evaluate already included features.
       *
       * @option coordsToLatLng: Function = *
       * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
       * The default is the `coordsToLatLng` static method.
       *
       * @option markersInheritOptions: Boolean = false
       * Whether default Markers for "Point" type Features inherit from group options.
       */
      initialize: function(t, e) {
        I(this, e), this._layers = {}, t && this.addData(t);
      },
      // @method addData( <GeoJSON> data ): this
      // Adds a GeoJSON object to the layer.
      addData: function(t) {
        var e = Y(t) ? t : t.features, o, r, u;
        if (e) {
          for (o = 0, r = e.length; o < r; o++)
            u = e[o], (u.geometries || u.geometry || u.features || u.coordinates) && this.addData(u);
          return this;
        }
        var h = this.options;
        if (h.filter && !h.filter(t))
          return this;
        var m = In(t, h);
        return m ? (m.feature = Vn(t), m.defaultOptions = m.options, this.resetStyle(m), h.onEachFeature && h.onEachFeature(t, m), this.addLayer(m)) : this;
      },
      // @method resetStyle( <Path> layer? ): this
      // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
      // If `layer` is omitted, the style of all features in the current layer is reset.
      resetStyle: function(t) {
        return t === void 0 ? this.eachLayer(this.resetStyle, this) : (t.options = l({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this);
      },
      // @method setStyle( <Function> style ): this
      // Changes styles of GeoJSON vector layers with the given style function.
      setStyle: function(t) {
        return this.eachLayer(function(e) {
          this._setLayerStyle(e, t);
        }, this);
      },
      _setLayerStyle: function(t, e) {
        t.setStyle && (typeof e == "function" && (e = e(t.feature)), t.setStyle(e));
      }
    });
    function In(t, e) {
      var o = t.type === "Feature" ? t.geometry : t, r = o ? o.coordinates : null, u = [], h = e && e.pointToLayer, m = e && e.coordsToLatLng || Uo, b, x, N, B;
      if (!r && !o)
        return null;
      switch (o.type) {
        case "Point":
          return b = m(r), Or(h, t, b, e);
        case "MultiPoint":
          for (N = 0, B = r.length; N < B; N++)
            b = m(r[N]), u.push(Or(h, t, b, e));
          return new Ve(u);
        case "LineString":
        case "MultiLineString":
          return x = kn(r, o.type === "LineString" ? 0 : 1, m), new Re(x, e);
        case "Polygon":
        case "MultiPolygon":
          return x = kn(r, o.type === "Polygon" ? 1 : 2, m), new Pi(x, e);
        case "GeometryCollection":
          for (N = 0, B = o.geometries.length; N < B; N++) {
            var U = In({
              geometry: o.geometries[N],
              type: "Feature",
              properties: t.properties
            }, e);
            U && u.push(U);
          }
          return new Ve(u);
        case "FeatureCollection":
          for (N = 0, B = o.features.length; N < B; N++) {
            var it = In(o.features[N], e);
            it && u.push(it);
          }
          return new Ve(u);
        default:
          throw new Error("Invalid GeoJSON object.");
      }
    }
    function Or(t, e, o, r) {
      return t ? t(e, o) : new Dn(o, r && r.markersInheritOptions && r);
    }
    function Uo(t) {
      return new ut(t[1], t[0], t[2]);
    }
    function kn(t, e, o) {
      for (var r = [], u = 0, h = t.length, m; u < h; u++)
        m = e ? kn(t[u], e - 1, o) : (o || Uo)(t[u]), r.push(m);
      return r;
    }
    function Ko(t, e) {
      return t = ot(t), t.alt !== void 0 ? [P(t.lng, e), P(t.lat, e), P(t.alt, e)] : [P(t.lng, e), P(t.lat, e)];
    }
    function zn(t, e, o, r) {
      for (var u = [], h = 0, m = t.length; h < m; h++)
        u.push(e ? zn(t[h], he(t[h]) ? 0 : e - 1, o, r) : Ko(t[h], r));
      return !e && o && u.length > 0 && u.push(u[0].slice()), u;
    }
    function Oi(t, e) {
      return t.feature ? l({}, t.feature, { geometry: e }) : Vn(e);
    }
    function Vn(t) {
      return t.type === "Feature" || t.type === "FeatureCollection" ? t : {
        type: "Feature",
        properties: {},
        geometry: t
      };
    }
    var Go = {
      toGeoJSON: function(t) {
        return Oi(this, {
          type: "Point",
          coordinates: Ko(this.getLatLng(), t)
        });
      }
    };
    Dn.include(Go), jo.include(Go), An.include(Go), Re.include({
      toGeoJSON: function(t) {
        var e = !he(this._latlngs), o = zn(this._latlngs, e ? 1 : 0, !1, t);
        return Oi(this, {
          type: (e ? "Multi" : "") + "LineString",
          coordinates: o
        });
      }
    }), Pi.include({
      toGeoJSON: function(t) {
        var e = !he(this._latlngs), o = e && !he(this._latlngs[0]), r = zn(this._latlngs, o ? 2 : e ? 1 : 0, !0, t);
        return e || (r = [r]), Oi(this, {
          type: (o ? "Multi" : "") + "Polygon",
          coordinates: r
        });
      }
    }), xi.include({
      toMultiPoint: function(t) {
        var e = [];
        return this.eachLayer(function(o) {
          e.push(o.toGeoJSON(t).geometry.coordinates);
        }), Oi(this, {
          type: "MultiPoint",
          coordinates: e
        });
      },
      // @method toGeoJSON(precision?: Number|false): Object
      // Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
      // Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
      toGeoJSON: function(t) {
        var e = this.feature && this.feature.geometry && this.feature.geometry.type;
        if (e === "MultiPoint")
          return this.toMultiPoint(t);
        var o = e === "GeometryCollection", r = [];
        return this.eachLayer(function(u) {
          if (u.toGeoJSON) {
            var h = u.toGeoJSON(t);
            if (o)
              r.push(h.geometry);
            else {
              var m = Vn(h);
              m.type === "FeatureCollection" ? r.push.apply(r, m.features) : r.push(m);
            }
          }
        }), o ? Oi(this, {
          geometries: r,
          type: "GeometryCollection"
        }) : {
          type: "FeatureCollection",
          features: r
        };
      }
    });
    function Tr(t, e) {
      return new Be(t, e);
    }
    var Bu = Tr, Rn = _e.extend({
      // @section
      // @aka ImageOverlay options
      options: {
        // @option opacity: Number = 1.0
        // The opacity of the image overlay.
        opacity: 1,
        // @option alt: String = ''
        // Text for the `alt` attribute of the image (useful for accessibility).
        alt: "",
        // @option interactive: Boolean = false
        // If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
        interactive: !1,
        // @option crossOrigin: Boolean|String = false
        // Whether the crossOrigin attribute will be added to the image.
        // If a String is provided, the image will have its crossOrigin attribute set to the String provided. This is needed if you want to access image pixel data.
        // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
        crossOrigin: !1,
        // @option errorOverlayUrl: String = ''
        // URL to the overlay image to show in place of the overlay that failed to load.
        errorOverlayUrl: "",
        // @option zIndex: Number = 1
        // The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the overlay layer.
        zIndex: 1,
        // @option className: String = ''
        // A custom class name to assign to the image. Empty by default.
        className: ""
      },
      initialize: function(t, e, o) {
        this._url = t, this._bounds = bt(e), I(this, o);
      },
      onAdd: function() {
        this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (tt(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
      },
      onRemove: function() {
        Pt(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
      },
      // @method setOpacity(opacity: Number): this
      // Sets the opacity of the overlay.
      setOpacity: function(t) {
        return this.options.opacity = t, this._image && this._updateOpacity(), this;
      },
      setStyle: function(t) {
        return t.opacity && this.setOpacity(t.opacity), this;
      },
      // @method bringToFront(): this
      // Brings the layer to the top of all overlays.
      bringToFront: function() {
        return this._map && bi(this._image), this;
      },
      // @method bringToBack(): this
      // Brings the layer to the bottom of all overlays.
      bringToBack: function() {
        return this._map && wi(this._image), this;
      },
      // @method setUrl(url: String): this
      // Changes the URL of the image.
      setUrl: function(t) {
        return this._url = t, this._image && (this._image.src = t), this;
      },
      // @method setBounds(bounds: LatLngBounds): this
      // Update the bounds that this ImageOverlay covers
      setBounds: function(t) {
        return this._bounds = bt(t), this._map && this._reset(), this;
      },
      getEvents: function() {
        var t = {
          zoom: this._reset,
          viewreset: this._reset
        };
        return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
      },
      // @method setZIndex(value: Number): this
      // Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
      setZIndex: function(t) {
        return this.options.zIndex = t, this._updateZIndex(), this;
      },
      // @method getBounds(): LatLngBounds
      // Get the bounds that this ImageOverlay covers
      getBounds: function() {
        return this._bounds;
      },
      // @method getElement(): HTMLElement
      // Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
      // used by this overlay.
      getElement: function() {
        return this._image;
      },
      _initImage: function() {
        var t = this._url.tagName === "IMG", e = this._image = t ? this._url : at("img");
        if (tt(e, "leaflet-image-layer"), this._zoomAnimated && tt(e, "leaflet-zoom-animated"), this.options.className && tt(e, this.options.className), e.onselectstart = g, e.onmousemove = g, e.onload = f(this.fire, this, "load"), e.onerror = f(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (e.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), t) {
          this._url = e.src;
          return;
        }
        e.src = this._url, e.alt = this.options.alt;
      },
      _animateZoom: function(t) {
        var e = this._map.getZoomScale(t.zoom), o = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;
        ei(this._image, o, e);
      },
      _reset: function() {
        var t = this._image, e = new ft(
          this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
          this._map.latLngToLayerPoint(this._bounds.getSouthEast())
        ), o = e.getSize();
        St(t, e.min), t.style.width = o.x + "px", t.style.height = o.y + "px";
      },
      _updateOpacity: function() {
        ce(this._image, this.options.opacity);
      },
      _updateZIndex: function() {
        this._image && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._image.style.zIndex = this.options.zIndex);
      },
      _overlayOnError: function() {
        this.fire("error");
        var t = this.options.errorOverlayUrl;
        t && this._url !== t && (this._url = t, this._image.src = t);
      },
      // @method getCenter(): LatLng
      // Returns the center of the ImageOverlay.
      getCenter: function() {
        return this._bounds.getCenter();
      }
    }), Zu = function(t, e, o) {
      return new Rn(t, e, o);
    }, Nr = Rn.extend({
      // @section
      // @aka VideoOverlay options
      options: {
        // @option autoplay: Boolean = true
        // Whether the video starts playing automatically when loaded.
        // On some browsers autoplay will only work with `muted: true`
        autoplay: !0,
        // @option loop: Boolean = true
        // Whether the video will loop back to the beginning when played.
        loop: !0,
        // @option keepAspectRatio: Boolean = true
        // Whether the video will save aspect ratio after the projection.
        // Relevant for supported browsers. See [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
        keepAspectRatio: !0,
        // @option muted: Boolean = false
        // Whether the video starts on mute when loaded.
        muted: !1,
        // @option playsInline: Boolean = true
        // Mobile browsers will play the video right where it is instead of open it up in fullscreen mode.
        playsInline: !0
      },
      _initImage: function() {
        var t = this._url.tagName === "VIDEO", e = this._image = t ? this._url : at("video");
        if (tt(e, "leaflet-image-layer"), this._zoomAnimated && tt(e, "leaflet-zoom-animated"), this.options.className && tt(e, this.options.className), e.onselectstart = g, e.onmousemove = g, e.onloadeddata = f(this.fire, this, "load"), t) {
          for (var o = e.getElementsByTagName("source"), r = [], u = 0; u < o.length; u++)
            r.push(o[u].src);
          this._url = o.length > 0 ? r : [e.src];
          return;
        }
        Y(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(e.style, "objectFit") && (e.style.objectFit = "fill"), e.autoplay = !!this.options.autoplay, e.loop = !!this.options.loop, e.muted = !!this.options.muted, e.playsInline = !!this.options.playsInline;
        for (var h = 0; h < this._url.length; h++) {
          var m = at("source");
          m.src = this._url[h], e.appendChild(m);
        }
      }
      // @method getElement(): HTMLVideoElement
      // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
      // used by this overlay.
    });
    function Fu(t, e, o) {
      return new Nr(t, e, o);
    }
    var Lr = Rn.extend({
      _initImage: function() {
        var t = this._image = this._url;
        tt(t, "leaflet-image-layer"), this._zoomAnimated && tt(t, "leaflet-zoom-animated"), this.options.className && tt(t, this.options.className), t.onselectstart = g, t.onmousemove = g;
      }
      // @method getElement(): SVGElement
      // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
      // used by this overlay.
    });
    function Hu(t, e, o) {
      return new Lr(t, e, o);
    }
    var Ne = _e.extend({
      // @section
      // @aka DivOverlay options
      options: {
        // @option interactive: Boolean = false
        // If true, the popup/tooltip will listen to the mouse events.
        interactive: !1,
        // @option offset: Point = Point(0, 0)
        // The offset of the overlay position.
        offset: [0, 0],
        // @option className: String = ''
        // A custom CSS class name to assign to the overlay.
        className: "",
        // @option pane: String = undefined
        // `Map pane` where the overlay will be added.
        pane: void 0,
        // @option content: String|HTMLElement|Function = ''
        // Sets the HTML content of the overlay while initializing. If a function is passed the source layer will be
        // passed to the function. The function should return a `String` or `HTMLElement` to be used in the overlay.
        content: ""
      },
      initialize: function(t, e) {
        t && (t instanceof ut || Y(t)) ? (this._latlng = ot(t), I(this, e)) : (I(this, t), this._source = e), this.options.content && (this._content = this.options.content);
      },
      // @method openOn(map: Map): this
      // Adds the overlay to the map.
      // Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
      openOn: function(t) {
        return t = arguments.length ? t : this._source._map, t.hasLayer(this) || t.addLayer(this), this;
      },
      // @method close(): this
      // Closes the overlay.
      // Alternative to `map.closePopup(popup)`/`.closeTooltip(tooltip)`
      // and `layer.closePopup()`/`.closeTooltip()`.
      close: function() {
        return this._map && this._map.removeLayer(this), this;
      },
      // @method toggle(layer?: Layer): this
      // Opens or closes the overlay bound to layer depending on its current state.
      // Argument may be omitted only for overlay bound to layer.
      // Alternative to `layer.togglePopup()`/`.toggleTooltip()`.
      toggle: function(t) {
        return this._map ? this.close() : (arguments.length ? this._source = t : t = this._source, this._prepareOpen(), this.openOn(t._map)), this;
      },
      onAdd: function(t) {
        this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && ce(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && ce(this._container, 1), this.bringToFront(), this.options.interactive && (tt(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
      },
      onRemove: function(t) {
        t._fadeAnimated ? (ce(this._container, 0), this._removeTimeout = setTimeout(f(Pt, void 0, this._container), 200)) : Pt(this._container), this.options.interactive && (Lt(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
      },
      // @namespace DivOverlay
      // @method getLatLng: LatLng
      // Returns the geographical point of the overlay.
      getLatLng: function() {
        return this._latlng;
      },
      // @method setLatLng(latlng: LatLng): this
      // Sets the geographical point where the overlay will open.
      setLatLng: function(t) {
        return this._latlng = ot(t), this._map && (this._updatePosition(), this._adjustPan()), this;
      },
      // @method getContent: String|HTMLElement
      // Returns the content of the overlay.
      getContent: function() {
        return this._content;
      },
      // @method setContent(htmlContent: String|HTMLElement|Function): this
      // Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function.
      // The function should return a `String` or `HTMLElement` to be used in the overlay.
      setContent: function(t) {
        return this._content = t, this.update(), this;
      },
      // @method getElement: String|HTMLElement
      // Returns the HTML container of the overlay.
      getElement: function() {
        return this._container;
      },
      // @method update: null
      // Updates the overlay content, layout and position. Useful for updating the overlay after something inside changed, e.g. image loaded.
      update: function() {
        this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan());
      },
      getEvents: function() {
        var t = {
          zoom: this._updatePosition,
          viewreset: this._updatePosition
        };
        return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
      },
      // @method isOpen: Boolean
      // Returns `true` when the overlay is visible on the map.
      isOpen: function() {
        return !!this._map && this._map.hasLayer(this);
      },
      // @method bringToFront: this
      // Brings this overlay in front of other overlays (in the same map pane).
      bringToFront: function() {
        return this._map && bi(this._container), this;
      },
      // @method bringToBack: this
      // Brings this overlay to the back of other overlays (in the same map pane).
      bringToBack: function() {
        return this._map && wi(this._container), this;
      },
      // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
      _prepareOpen: function(t) {
        var e = this._source;
        if (!e._map)
          return !1;
        if (e instanceof Ve) {
          e = null;
          var o = this._source._layers;
          for (var r in o)
            if (o[r]._map) {
              e = o[r];
              break;
            }
          if (!e)
            return !1;
          this._source = e;
        }
        if (!t)
          if (e.getCenter)
            t = e.getCenter();
          else if (e.getLatLng)
            t = e.getLatLng();
          else if (e.getBounds)
            t = e.getBounds().getCenter();
          else
            throw new Error("Unable to get source layer LatLng.");
        return this.setLatLng(t), this._map && this.update(), !0;
      },
      _updateContent: function() {
        if (this._content) {
          var t = this._contentNode, e = typeof this._content == "function" ? this._content(this._source || this) : this._content;
          if (typeof e == "string")
            t.innerHTML = e;
          else {
            for (; t.hasChildNodes(); )
              t.removeChild(t.firstChild);
            t.appendChild(e);
          }
          this.fire("contentupdate");
        }
      },
      _updatePosition: function() {
        if (this._map) {
          var t = this._map.latLngToLayerPoint(this._latlng), e = G(this.options.offset), o = this._getAnchor();
          this._zoomAnimated ? St(this._container, t.add(o)) : e = e.add(t).add(o);
          var r = this._containerBottom = -e.y, u = this._containerLeft = -Math.round(this._containerWidth / 2) + e.x;
          this._container.style.bottom = r + "px", this._container.style.left = u + "px";
        }
      },
      _getAnchor: function() {
        return [0, 0];
      }
    });
    rt.include({
      _initOverlay: function(t, e, o, r) {
        var u = e;
        return u instanceof t || (u = new t(r).setContent(e)), o && u.setLatLng(o), u;
      }
    }), _e.include({
      _initOverlay: function(t, e, o, r) {
        var u = o;
        return u instanceof t ? (I(u, r), u._source = this) : (u = e && !r ? e : new t(r, this), u.setContent(o)), u;
      }
    });
    var Bn = Ne.extend({
      // @section
      // @aka Popup options
      options: {
        // @option pane: String = 'popupPane'
        // `Map pane` where the popup will be added.
        pane: "popupPane",
        // @option offset: Point = Point(0, 7)
        // The offset of the popup position.
        offset: [0, 7],
        // @option maxWidth: Number = 300
        // Max width of the popup, in pixels.
        maxWidth: 300,
        // @option minWidth: Number = 50
        // Min width of the popup, in pixels.
        minWidth: 50,
        // @option maxHeight: Number = null
        // If set, creates a scrollable container of the given height
        // inside a popup if its content exceeds it.
        // The scrollable container can be styled using the
        // `leaflet-popup-scrolled` CSS class selector.
        maxHeight: null,
        // @option autoPan: Boolean = true
        // Set it to `false` if you don't want the map to do panning animation
        // to fit the opened popup.
        autoPan: !0,
        // @option autoPanPaddingTopLeft: Point = null
        // The margin between the popup and the top left corner of the map
        // view after autopanning was performed.
        autoPanPaddingTopLeft: null,
        // @option autoPanPaddingBottomRight: Point = null
        // The margin between the popup and the bottom right corner of the map
        // view after autopanning was performed.
        autoPanPaddingBottomRight: null,
        // @option autoPanPadding: Point = Point(5, 5)
        // Equivalent of setting both top left and bottom right autopan padding to the same value.
        autoPanPadding: [5, 5],
        // @option keepInView: Boolean = false
        // Set it to `true` if you want to prevent users from panning the popup
        // off of the screen while it is open.
        keepInView: !1,
        // @option closeButton: Boolean = true
        // Controls the presence of a close button in the popup.
        closeButton: !0,
        // @option autoClose: Boolean = true
        // Set it to `false` if you want to override the default behavior of
        // the popup closing when another popup is opened.
        autoClose: !0,
        // @option closeOnEscapeKey: Boolean = true
        // Set it to `false` if you want to override the default behavior of
        // the ESC key for closing of the popup.
        closeOnEscapeKey: !0,
        // @option closeOnClick: Boolean = *
        // Set it if you want to override the default behavior of the popup closing when user clicks
        // on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.
        // @option className: String = ''
        // A custom CSS class name to assign to the popup.
        className: ""
      },
      // @namespace Popup
      // @method openOn(map: Map): this
      // Alternative to `map.openPopup(popup)`.
      // Adds the popup to the map and closes the previous one.
      openOn: function(t) {
        return t = arguments.length ? t : this._source._map, !t.hasLayer(this) && t._popup && t._popup.options.autoClose && t.removeLayer(t._popup), t._popup = this, Ne.prototype.openOn.call(this, t);
      },
      onAdd: function(t) {
        Ne.prototype.onAdd.call(this, t), t.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof Ge || this._source.on("preclick", ni));
      },
      onRemove: function(t) {
        Ne.prototype.onRemove.call(this, t), t.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof Ge || this._source.off("preclick", ni));
      },
      getEvents: function() {
        var t = Ne.prototype.getEvents.call(this);
        return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this.close), this.options.keepInView && (t.moveend = this._adjustPan), t;
      },
      _initLayout: function() {
        var t = "leaflet-popup", e = this._container = at(
          "div",
          t + " " + (this.options.className || "") + " leaflet-zoom-animated"
        ), o = this._wrapper = at("div", t + "-content-wrapper", e);
        if (this._contentNode = at("div", t + "-content", o), ji(e), Vo(this._contentNode), X(e, "contextmenu", ni), this._tipContainer = at("div", t + "-tip-container", e), this._tip = at("div", t + "-tip", this._tipContainer), this.options.closeButton) {
          var r = this._closeButton = at("a", t + "-close-button", e);
          r.setAttribute("role", "button"), r.setAttribute("aria-label", "Close popup"), r.href = "#close", r.innerHTML = '<span aria-hidden="true">&#215;</span>', X(r, "click", function(u) {
            Ft(u), this.close();
          }, this);
        }
      },
      _updateLayout: function() {
        var t = this._contentNode, e = t.style;
        e.width = "", e.whiteSpace = "nowrap";
        var o = t.offsetWidth;
        o = Math.min(o, this.options.maxWidth), o = Math.max(o, this.options.minWidth), e.width = o + 1 + "px", e.whiteSpace = "", e.height = "";
        var r = t.offsetHeight, u = this.options.maxHeight, h = "leaflet-popup-scrolled";
        u && r > u ? (e.height = u + "px", tt(t, h)) : Lt(t, h), this._containerWidth = this._container.offsetWidth;
      },
      _animateZoom: function(t) {
        var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center), o = this._getAnchor();
        St(this._container, e.add(o));
      },
      _adjustPan: function() {
        if (this.options.autoPan) {
          if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
            this._autopanning = !1;
            return;
          }
          var t = this._map, e = parseInt(Fi(this._container, "marginBottom"), 10) || 0, o = this._container.offsetHeight + e, r = this._containerWidth, u = new V(this._containerLeft, -o - this._containerBottom);
          u._add(ii(this._container));
          var h = t.layerPointToContainerPoint(u), m = G(this.options.autoPanPadding), b = G(this.options.autoPanPaddingTopLeft || m), x = G(this.options.autoPanPaddingBottomRight || m), N = t.getSize(), B = 0, U = 0;
          h.x + r + x.x > N.x && (B = h.x + r - N.x + x.x), h.x - B - b.x < 0 && (B = h.x - b.x), h.y + o + x.y > N.y && (U = h.y + o - N.y + x.y), h.y - U - b.y < 0 && (U = h.y - b.y), (B || U) && (this.options.keepInView && (this._autopanning = !0), t.fire("autopanstart").panBy([B, U]));
        }
      },
      _getAnchor: function() {
        return G(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
      }
    }), $u = function(t, e) {
      return new Bn(t, e);
    };
    rt.mergeOptions({
      closePopupOnClick: !0
    }), rt.include({
      // @method openPopup(popup: Popup): this
      // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
      // @alternative
      // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
      // Creates a popup with the specified content and options and opens it in the given point on a map.
      openPopup: function(t, e, o) {
        return this._initOverlay(Bn, t, e, o).openOn(this), this;
      },
      // @method closePopup(popup?: Popup): this
      // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
      closePopup: function(t) {
        return t = arguments.length ? t : this._popup, t && t.close(), this;
      }
    }), _e.include({
      // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
      // Binds a popup to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindPopup: function(t, e) {
        return this._popup = this._initOverlay(Bn, this._popup, t, e), this._popupHandlersAdded || (this.on({
          click: this._openPopup,
          keypress: this._onKeyPress,
          remove: this.closePopup,
          move: this._movePopup
        }), this._popupHandlersAdded = !0), this;
      },
      // @method unbindPopup(): this
      // Removes the popup previously bound with `bindPopup`.
      unbindPopup: function() {
        return this._popup && (this.off({
          click: this._openPopup,
          keypress: this._onKeyPress,
          remove: this.closePopup,
          move: this._movePopup
        }), this._popupHandlersAdded = !1, this._popup = null), this;
      },
      // @method openPopup(latlng?: LatLng): this
      // Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
      openPopup: function(t) {
        return this._popup && (this instanceof Ve || (this._popup._source = this), this._popup._prepareOpen(t || this._latlng) && this._popup.openOn(this._map)), this;
      },
      // @method closePopup(): this
      // Closes the popup bound to this layer if it is open.
      closePopup: function() {
        return this._popup && this._popup.close(), this;
      },
      // @method togglePopup(): this
      // Opens or closes the popup bound to this layer depending on its current state.
      togglePopup: function() {
        return this._popup && this._popup.toggle(this), this;
      },
      // @method isPopupOpen(): boolean
      // Returns `true` if the popup bound to this layer is currently open.
      isPopupOpen: function() {
        return this._popup ? this._popup.isOpen() : !1;
      },
      // @method setPopupContent(content: String|HTMLElement|Popup): this
      // Sets the content of the popup bound to this layer.
      setPopupContent: function(t) {
        return this._popup && this._popup.setContent(t), this;
      },
      // @method getPopup(): Popup
      // Returns the popup bound to this layer.
      getPopup: function() {
        return this._popup;
      },
      _openPopup: function(t) {
        if (!(!this._popup || !this._map)) {
          oi(t);
          var e = t.layer || t.target;
          if (this._popup._source === e && !(e instanceof Ge)) {
            this._map.hasLayer(this._popup) ? this.closePopup() : this.openPopup(t.latlng);
            return;
          }
          this._popup._source = e, this.openPopup(t.latlng);
        }
      },
      _movePopup: function(t) {
        this._popup.setLatLng(t.latlng);
      },
      _onKeyPress: function(t) {
        t.originalEvent.keyCode === 13 && this._openPopup(t);
      }
    });
    var Zn = Ne.extend({
      // @section
      // @aka Tooltip options
      options: {
        // @option pane: String = 'tooltipPane'
        // `Map pane` where the tooltip will be added.
        pane: "tooltipPane",
        // @option offset: Point = Point(0, 0)
        // Optional offset of the tooltip position.
        offset: [0, 0],
        // @option direction: String = 'auto'
        // Direction where to open the tooltip. Possible values are: `right`, `left`,
        // `top`, `bottom`, `center`, `auto`.
        // `auto` will dynamically switch between `right` and `left` according to the tooltip
        // position on the map.
        direction: "auto",
        // @option permanent: Boolean = false
        // Whether to open the tooltip permanently or only on mouseover.
        permanent: !1,
        // @option sticky: Boolean = false
        // If true, the tooltip will follow the mouse instead of being fixed at the feature center.
        sticky: !1,
        // @option opacity: Number = 0.9
        // Tooltip container opacity.
        opacity: 0.9
      },
      onAdd: function(t) {
        Ne.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
      },
      onRemove: function(t) {
        Ne.prototype.onRemove.call(this, t), t.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
      },
      getEvents: function() {
        var t = Ne.prototype.getEvents.call(this);
        return this.options.permanent || (t.preclick = this.close), t;
      },
      _initLayout: function() {
        var t = "leaflet-tooltip", e = t + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
        this._contentNode = this._container = at("div", e), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + _(this));
      },
      _updateLayout: function() {
      },
      _adjustPan: function() {
      },
      _setPosition: function(t) {
        var e, o, r = this._map, u = this._container, h = r.latLngToContainerPoint(r.getCenter()), m = r.layerPointToContainerPoint(t), b = this.options.direction, x = u.offsetWidth, N = u.offsetHeight, B = G(this.options.offset), U = this._getAnchor();
        b === "top" ? (e = x / 2, o = N) : b === "bottom" ? (e = x / 2, o = 0) : b === "center" ? (e = x / 2, o = N / 2) : b === "right" ? (e = 0, o = N / 2) : b === "left" ? (e = x, o = N / 2) : m.x < h.x ? (b = "right", e = 0, o = N / 2) : (b = "left", e = x + (B.x + U.x) * 2, o = N / 2), t = t.subtract(G(e, o, !0)).add(B).add(U), Lt(u, "leaflet-tooltip-right"), Lt(u, "leaflet-tooltip-left"), Lt(u, "leaflet-tooltip-top"), Lt(u, "leaflet-tooltip-bottom"), tt(u, "leaflet-tooltip-" + b), St(u, t);
      },
      _updatePosition: function() {
        var t = this._map.latLngToLayerPoint(this._latlng);
        this._setPosition(t);
      },
      setOpacity: function(t) {
        this.options.opacity = t, this._container && ce(this._container, t);
      },
      _animateZoom: function(t) {
        var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);
        this._setPosition(e);
      },
      _getAnchor: function() {
        return G(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
      }
    }), Wu = function(t, e) {
      return new Zn(t, e);
    };
    rt.include({
      // @method openTooltip(tooltip: Tooltip): this
      // Opens the specified tooltip.
      // @alternative
      // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
      // Creates a tooltip with the specified content and options and open it.
      openTooltip: function(t, e, o) {
        return this._initOverlay(Zn, t, e, o).openOn(this), this;
      },
      // @method closeTooltip(tooltip: Tooltip): this
      // Closes the tooltip given as parameter.
      closeTooltip: function(t) {
        return t.close(), this;
      }
    }), _e.include({
      // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
      // Binds a tooltip to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindTooltip: function(t, e) {
        return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(Zn, this._tooltip, t, e), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
      },
      // @method unbindTooltip(): this
      // Removes the tooltip previously bound with `bindTooltip`.
      unbindTooltip: function() {
        return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), this._tooltip = null), this;
      },
      _initTooltipInteractions: function(t) {
        if (!(!t && this._tooltipHandlersAdded)) {
          var e = t ? "off" : "on", o = {
            remove: this.closeTooltip,
            move: this._moveTooltip
          };
          this._tooltip.options.permanent ? o.add = this._openTooltip : (o.mouseover = this._openTooltip, o.mouseout = this.closeTooltip, o.click = this._openTooltip, this._map ? this._addFocusListeners() : o.add = this._addFocusListeners), this._tooltip.options.sticky && (o.mousemove = this._moveTooltip), this[e](o), this._tooltipHandlersAdded = !t;
        }
      },
      // @method openTooltip(latlng?: LatLng): this
      // Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
      openTooltip: function(t) {
        return this._tooltip && (this instanceof Ve || (this._tooltip._source = this), this._tooltip._prepareOpen(t) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
      },
      // @method closeTooltip(): this
      // Closes the tooltip bound to this layer if it is open.
      closeTooltip: function() {
        if (this._tooltip)
          return this._tooltip.close();
      },
      // @method toggleTooltip(): this
      // Opens or closes the tooltip bound to this layer depending on its current state.
      toggleTooltip: function() {
        return this._tooltip && this._tooltip.toggle(this), this;
      },
      // @method isTooltipOpen(): boolean
      // Returns `true` if the tooltip bound to this layer is currently open.
      isTooltipOpen: function() {
        return this._tooltip.isOpen();
      },
      // @method setTooltipContent(content: String|HTMLElement|Tooltip): this
      // Sets the content of the tooltip bound to this layer.
      setTooltipContent: function(t) {
        return this._tooltip && this._tooltip.setContent(t), this;
      },
      // @method getTooltip(): Tooltip
      // Returns the tooltip bound to this layer.
      getTooltip: function() {
        return this._tooltip;
      },
      _addFocusListeners: function() {
        this.getElement ? this._addFocusListenersOnLayer(this) : this.eachLayer && this.eachLayer(this._addFocusListenersOnLayer, this);
      },
      _addFocusListenersOnLayer: function(t) {
        var e = typeof t.getElement == "function" && t.getElement();
        e && (X(e, "focus", function() {
          this._tooltip._source = t, this.openTooltip();
        }, this), X(e, "blur", this.closeTooltip, this));
      },
      _setAriaDescribedByOnLayer: function(t) {
        var e = typeof t.getElement == "function" && t.getElement();
        e && e.setAttribute("aria-describedby", this._tooltip._container.id);
      },
      _openTooltip: function(t) {
        if (!(!this._tooltip || !this._map)) {
          if (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag) {
            this._openOnceFlag = !0;
            var e = this;
            this._map.once("moveend", function() {
              e._openOnceFlag = !1, e._openTooltip(t);
            });
            return;
          }
          this._tooltip._source = t.layer || t.target, this.openTooltip(this._tooltip.options.sticky ? t.latlng : void 0);
        }
      },
      _moveTooltip: function(t) {
        var e = t.latlng, o, r;
        this._tooltip.options.sticky && t.originalEvent && (o = this._map.mouseEventToContainerPoint(t.originalEvent), r = this._map.containerPointToLayerPoint(o), e = this._map.layerPointToLatLng(r)), this._tooltip.setLatLng(e);
      }
    });
    var Sr = Ei.extend({
      options: {
        // @section
        // @aka DivIcon options
        iconSize: [12, 12],
        // also can be set through CSS
        // iconAnchor: (Point),
        // popupAnchor: (Point),
        // @option html: String|HTMLElement = ''
        // Custom HTML code to put inside the div element, empty by default. Alternatively,
        // an instance of `HTMLElement`.
        html: !1,
        // @option bgPos: Point = [0, 0]
        // Optional relative position of the background, in pixels
        bgPos: null,
        className: "leaflet-div-icon"
      },
      createIcon: function(t) {
        var e = t && t.tagName === "DIV" ? t : document.createElement("div"), o = this.options;
        if (o.html instanceof Element ? (Tn(e), e.appendChild(o.html)) : e.innerHTML = o.html !== !1 ? o.html : "", o.bgPos) {
          var r = G(o.bgPos);
          e.style.backgroundPosition = -r.x + "px " + -r.y + "px";
        }
        return this._setIconStyles(e, "icon"), e;
      },
      createShadow: function() {
        return null;
      }
    });
    function ju(t) {
      return new Sr(t);
    }
    Ei.Default = Gi;
    var qi = _e.extend({
      // @section
      // @aka GridLayer options
      options: {
        // @option tileSize: Number|Point = 256
        // Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
        tileSize: 256,
        // @option opacity: Number = 1.0
        // Opacity of the tiles. Can be used in the `createTile()` function.
        opacity: 1,
        // @option updateWhenIdle: Boolean = (depends)
        // Load new tiles only when panning ends.
        // `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
        // `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
        // [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
        updateWhenIdle: H.mobile,
        // @option updateWhenZooming: Boolean = true
        // By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
        updateWhenZooming: !0,
        // @option updateInterval: Number = 200
        // Tiles will not update more than once every `updateInterval` milliseconds when panning.
        updateInterval: 200,
        // @option zIndex: Number = 1
        // The explicit zIndex of the tile layer.
        zIndex: 1,
        // @option bounds: LatLngBounds = undefined
        // If set, tiles will only be loaded inside the set `LatLngBounds`.
        bounds: null,
        // @option minZoom: Number = 0
        // The minimum zoom level down to which this layer will be displayed (inclusive).
        minZoom: 0,
        // @option maxZoom: Number = undefined
        // The maximum zoom level up to which this layer will be displayed (inclusive).
        maxZoom: void 0,
        // @option maxNativeZoom: Number = undefined
        // Maximum zoom number the tile source has available. If it is specified,
        // the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
        // from `maxNativeZoom` level and auto-scaled.
        maxNativeZoom: void 0,
        // @option minNativeZoom: Number = undefined
        // Minimum zoom number the tile source has available. If it is specified,
        // the tiles on all zoom levels lower than `minNativeZoom` will be loaded
        // from `minNativeZoom` level and auto-scaled.
        minNativeZoom: void 0,
        // @option noWrap: Boolean = false
        // Whether the layer is wrapped around the antimeridian. If `true`, the
        // GridLayer will only be displayed once at low zoom levels. Has no
        // effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
        // in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
        // tiles outside the CRS limits.
        noWrap: !1,
        // @option pane: String = 'tilePane'
        // `Map pane` where the grid layer will be added.
        pane: "tilePane",
        // @option className: String = ''
        // A custom class name to assign to the tile layer. Empty by default.
        className: "",
        // @option keepBuffer: Number = 2
        // When panning the map, keep this many rows and columns of tiles before unloading them.
        keepBuffer: 2
      },
      initialize: function(t) {
        I(this, t);
      },
      onAdd: function() {
        this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
      },
      beforeAdd: function(t) {
        t._addZoomLimit(this);
      },
      onRemove: function(t) {
        this._removeAllTiles(), Pt(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
      },
      // @method bringToFront: this
      // Brings the tile layer to the top of all tile layers.
      bringToFront: function() {
        return this._map && (bi(this._container), this._setAutoZIndex(Math.max)), this;
      },
      // @method bringToBack: this
      // Brings the tile layer to the bottom of all tile layers.
      bringToBack: function() {
        return this._map && (wi(this._container), this._setAutoZIndex(Math.min)), this;
      },
      // @method getContainer: HTMLElement
      // Returns the HTML element that contains the tiles for this layer.
      getContainer: function() {
        return this._container;
      },
      // @method setOpacity(opacity: Number): this
      // Changes the [opacity](#gridlayer-opacity) of the grid layer.
      setOpacity: function(t) {
        return this.options.opacity = t, this._updateOpacity(), this;
      },
      // @method setZIndex(zIndex: Number): this
      // Changes the [zIndex](#gridlayer-zindex) of the grid layer.
      setZIndex: function(t) {
        return this.options.zIndex = t, this._updateZIndex(), this;
      },
      // @method isLoading: Boolean
      // Returns `true` if any tile in the grid layer has not finished loading.
      isLoading: function() {
        return this._loading;
      },
      // @method redraw: this
      // Causes the layer to clear all the tiles and request them again.
      redraw: function() {
        if (this._map) {
          this._removeAllTiles();
          var t = this._clampZoom(this._map.getZoom());
          t !== this._tileZoom && (this._tileZoom = t, this._updateLevels()), this._update();
        }
        return this;
      },
      getEvents: function() {
        var t = {
          viewprereset: this._invalidateAll,
          viewreset: this._resetView,
          zoom: this._resetView,
          moveend: this._onMoveEnd
        };
        return this.options.updateWhenIdle || (this._onMove || (this._onMove = w(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
      },
      // @section Extension methods
      // Layers extending `GridLayer` shall reimplement the following method.
      // @method createTile(coords: Object, done?: Function): HTMLElement
      // Called only internally, must be overridden by classes extending `GridLayer`.
      // Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
      // is specified, it must be called when the tile has finished loading and drawing.
      createTile: function() {
        return document.createElement("div");
      },
      // @section
      // @method getTileSize: Point
      // Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
      getTileSize: function() {
        var t = this.options.tileSize;
        return t instanceof V ? t : new V(t, t);
      },
      _updateZIndex: function() {
        this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
      },
      _setAutoZIndex: function(t) {
        for (var e = this.getPane().children, o = -t(-1 / 0, 1 / 0), r = 0, u = e.length, h; r < u; r++)
          h = e[r].style.zIndex, e[r] !== this._container && h && (o = t(o, +h));
        isFinite(o) && (this.options.zIndex = o + t(-1, 1), this._updateZIndex());
      },
      _updateOpacity: function() {
        if (this._map && !H.ielt9) {
          ce(this._container, this.options.opacity);
          var t = +/* @__PURE__ */ new Date(), e = !1, o = !1;
          for (var r in this._tiles) {
            var u = this._tiles[r];
            if (!(!u.current || !u.loaded)) {
              var h = Math.min(1, (t - u.loaded) / 200);
              ce(u.el, h), h < 1 ? e = !0 : (u.active ? o = !0 : this._onOpaqueTile(u), u.active = !0);
            }
          }
          o && !this._noPrune && this._pruneTiles(), e && (yt(this._fadeFrame), this._fadeFrame = xt(this._updateOpacity, this));
        }
      },
      _onOpaqueTile: g,
      _initContainer: function() {
        this._container || (this._container = at("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
      },
      _updateLevels: function() {
        var t = this._tileZoom, e = this.options.maxZoom;
        if (t !== void 0) {
          for (var o in this._levels)
            o = Number(o), this._levels[o].el.children.length || o === t ? (this._levels[o].el.style.zIndex = e - Math.abs(t - o), this._onUpdateLevel(o)) : (Pt(this._levels[o].el), this._removeTilesAtZoom(o), this._onRemoveLevel(o), delete this._levels[o]);
          var r = this._levels[t], u = this._map;
          return r || (r = this._levels[t] = {}, r.el = at("div", "leaflet-tile-container leaflet-zoom-animated", this._container), r.el.style.zIndex = e, r.origin = u.project(u.unproject(u.getPixelOrigin()), t).round(), r.zoom = t, this._setZoomTransform(r, u.getCenter(), u.getZoom()), g(r.el.offsetWidth), this._onCreateLevel(r)), this._level = r, r;
        }
      },
      _onUpdateLevel: g,
      _onRemoveLevel: g,
      _onCreateLevel: g,
      _pruneTiles: function() {
        if (this._map) {
          var t, e, o = this._map.getZoom();
          if (o > this.options.maxZoom || o < this.options.minZoom) {
            this._removeAllTiles();
            return;
          }
          for (t in this._tiles)
            e = this._tiles[t], e.retain = e.current;
          for (t in this._tiles)
            if (e = this._tiles[t], e.current && !e.active) {
              var r = e.coords;
              this._retainParent(r.x, r.y, r.z, r.z - 5) || this._retainChildren(r.x, r.y, r.z, r.z + 2);
            }
          for (t in this._tiles)
            this._tiles[t].retain || this._removeTile(t);
        }
      },
      _removeTilesAtZoom: function(t) {
        for (var e in this._tiles)
          this._tiles[e].coords.z === t && this._removeTile(e);
      },
      _removeAllTiles: function() {
        for (var t in this._tiles)
          this._removeTile(t);
      },
      _invalidateAll: function() {
        for (var t in this._levels)
          Pt(this._levels[t].el), this._onRemoveLevel(Number(t)), delete this._levels[t];
        this._removeAllTiles(), this._tileZoom = void 0;
      },
      _retainParent: function(t, e, o, r) {
        var u = Math.floor(t / 2), h = Math.floor(e / 2), m = o - 1, b = new V(+u, +h);
        b.z = +m;
        var x = this._tileCoordsToKey(b), N = this._tiles[x];
        return N && N.active ? (N.retain = !0, !0) : (N && N.loaded && (N.retain = !0), m > r ? this._retainParent(u, h, m, r) : !1);
      },
      _retainChildren: function(t, e, o, r) {
        for (var u = 2 * t; u < 2 * t + 2; u++)
          for (var h = 2 * e; h < 2 * e + 2; h++) {
            var m = new V(u, h);
            m.z = o + 1;
            var b = this._tileCoordsToKey(m), x = this._tiles[b];
            if (x && x.active) {
              x.retain = !0;
              continue;
            } else x && x.loaded && (x.retain = !0);
            o + 1 < r && this._retainChildren(u, h, o + 1, r);
          }
      },
      _resetView: function(t) {
        var e = t && (t.pinch || t.flyTo);
        this._setView(this._map.getCenter(), this._map.getZoom(), e, e);
      },
      _animateZoom: function(t) {
        this._setView(t.center, t.zoom, !0, t.noUpdate);
      },
      _clampZoom: function(t) {
        var e = this.options;
        return e.minNativeZoom !== void 0 && t < e.minNativeZoom ? e.minNativeZoom : e.maxNativeZoom !== void 0 && e.maxNativeZoom < t ? e.maxNativeZoom : t;
      },
      _setView: function(t, e, o, r) {
        var u = Math.round(e);
        this.options.maxZoom !== void 0 && u > this.options.maxZoom || this.options.minZoom !== void 0 && u < this.options.minZoom ? u = void 0 : u = this._clampZoom(u);
        var h = this.options.updateWhenZooming && u !== this._tileZoom;
        (!r || h) && (this._tileZoom = u, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), u !== void 0 && this._update(t), o || this._pruneTiles(), this._noPrune = !!o), this._setZoomTransforms(t, e);
      },
      _setZoomTransforms: function(t, e) {
        for (var o in this._levels)
          this._setZoomTransform(this._levels[o], t, e);
      },
      _setZoomTransform: function(t, e, o) {
        var r = this._map.getZoomScale(o, t.zoom), u = t.origin.multiplyBy(r).subtract(this._map._getNewPixelOrigin(e, o)).round();
        H.any3d ? ei(t.el, u, r) : St(t.el, u);
      },
      _resetGrid: function() {
        var t = this._map, e = t.options.crs, o = this._tileSize = this.getTileSize(), r = this._tileZoom, u = this._map.getPixelWorldBounds(this._tileZoom);
        u && (this._globalTileRange = this._pxBoundsToTileRange(u)), this._wrapX = e.wrapLng && !this.options.noWrap && [
          Math.floor(t.project([0, e.wrapLng[0]], r).x / o.x),
          Math.ceil(t.project([0, e.wrapLng[1]], r).x / o.y)
        ], this._wrapY = e.wrapLat && !this.options.noWrap && [
          Math.floor(t.project([e.wrapLat[0], 0], r).y / o.x),
          Math.ceil(t.project([e.wrapLat[1], 0], r).y / o.y)
        ];
      },
      _onMoveEnd: function() {
        !this._map || this._map._animatingZoom || this._update();
      },
      _getTiledPixelBounds: function(t) {
        var e = this._map, o = e._animatingZoom ? Math.max(e._animateToZoom, e.getZoom()) : e.getZoom(), r = e.getZoomScale(o, this._tileZoom), u = e.project(t, this._tileZoom).floor(), h = e.getSize().divideBy(r * 2);
        return new ft(u.subtract(h), u.add(h));
      },
      // Private method to load tiles in the grid's active zoom level according to map bounds
      _update: function(t) {
        var e = this._map;
        if (e) {
          var o = this._clampZoom(e.getZoom());
          if (t === void 0 && (t = e.getCenter()), this._tileZoom !== void 0) {
            var r = this._getTiledPixelBounds(t), u = this._pxBoundsToTileRange(r), h = u.getCenter(), m = [], b = this.options.keepBuffer, x = new ft(
              u.getBottomLeft().subtract([b, -b]),
              u.getTopRight().add([b, -b])
            );
            if (!(isFinite(u.min.x) && isFinite(u.min.y) && isFinite(u.max.x) && isFinite(u.max.y)))
              throw new Error("Attempted to load an infinite number of tiles");
            for (var N in this._tiles) {
              var B = this._tiles[N].coords;
              (B.z !== this._tileZoom || !x.contains(new V(B.x, B.y))) && (this._tiles[N].current = !1);
            }
            if (Math.abs(o - this._tileZoom) > 1) {
              this._setView(t, o);
              return;
            }
            for (var U = u.min.y; U <= u.max.y; U++)
              for (var it = u.min.x; it <= u.max.x; it++) {
                var Ut = new V(it, U);
                if (Ut.z = this._tileZoom, !!this._isValidTile(Ut)) {
                  var zt = this._tiles[this._tileCoordsToKey(Ut)];
                  zt ? zt.current = !0 : m.push(Ut);
                }
              }
            if (m.sort(function(Yt, Ni) {
              return Yt.distanceTo(h) - Ni.distanceTo(h);
            }), m.length !== 0) {
              this._loading || (this._loading = !0, this.fire("loading"));
              var fe = document.createDocumentFragment();
              for (it = 0; it < m.length; it++)
                this._addTile(m[it], fe);
              this._level.el.appendChild(fe);
            }
          }
        }
      },
      _isValidTile: function(t) {
        var e = this._map.options.crs;
        if (!e.infinite) {
          var o = this._globalTileRange;
          if (!e.wrapLng && (t.x < o.min.x || t.x > o.max.x) || !e.wrapLat && (t.y < o.min.y || t.y > o.max.y))
            return !1;
        }
        if (!this.options.bounds)
          return !0;
        var r = this._tileCoordsToBounds(t);
        return bt(this.options.bounds).overlaps(r);
      },
      _keyToBounds: function(t) {
        return this._tileCoordsToBounds(this._keyToTileCoords(t));
      },
      _tileCoordsToNwSe: function(t) {
        var e = this._map, o = this.getTileSize(), r = t.scaleBy(o), u = r.add(o), h = e.unproject(r, t.z), m = e.unproject(u, t.z);
        return [h, m];
      },
      // converts tile coordinates to its geographical bounds
      _tileCoordsToBounds: function(t) {
        var e = this._tileCoordsToNwSe(t), o = new Et(e[0], e[1]);
        return this.options.noWrap || (o = this._map.wrapLatLngBounds(o)), o;
      },
      // converts tile coordinates to key for the tile cache
      _tileCoordsToKey: function(t) {
        return t.x + ":" + t.y + ":" + t.z;
      },
      // converts tile cache key to coordinates
      _keyToTileCoords: function(t) {
        var e = t.split(":"), o = new V(+e[0], +e[1]);
        return o.z = +e[2], o;
      },
      _removeTile: function(t) {
        var e = this._tiles[t];
        e && (Pt(e.el), delete this._tiles[t], this.fire("tileunload", {
          tile: e.el,
          coords: this._keyToTileCoords(t)
        }));
      },
      _initTile: function(t) {
        tt(t, "leaflet-tile");
        var e = this.getTileSize();
        t.style.width = e.x + "px", t.style.height = e.y + "px", t.onselectstart = g, t.onmousemove = g, H.ielt9 && this.options.opacity < 1 && ce(t, this.options.opacity);
      },
      _addTile: function(t, e) {
        var o = this._getTilePos(t), r = this._tileCoordsToKey(t), u = this.createTile(this._wrapCoords(t), f(this._tileReady, this, t));
        this._initTile(u), this.createTile.length < 2 && xt(f(this._tileReady, this, t, null, u)), St(u, o), this._tiles[r] = {
          el: u,
          coords: t,
          current: !0
        }, e.appendChild(u), this.fire("tileloadstart", {
          tile: u,
          coords: t
        });
      },
      _tileReady: function(t, e, o) {
        e && this.fire("tileerror", {
          error: e,
          tile: o,
          coords: t
        });
        var r = this._tileCoordsToKey(t);
        o = this._tiles[r], o && (o.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (ce(o.el, 0), yt(this._fadeFrame), this._fadeFrame = xt(this._updateOpacity, this)) : (o.active = !0, this._pruneTiles()), e || (tt(o.el, "leaflet-tile-loaded"), this.fire("tileload", {
          tile: o.el,
          coords: t
        })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), H.ielt9 || !this._map._fadeAnimated ? xt(this._pruneTiles, this) : setTimeout(f(this._pruneTiles, this), 250)));
      },
      _getTilePos: function(t) {
        return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
      },
      _wrapCoords: function(t) {
        var e = new V(
          this._wrapX ? y(t.x, this._wrapX) : t.x,
          this._wrapY ? y(t.y, this._wrapY) : t.y
        );
        return e.z = t.z, e;
      },
      _pxBoundsToTileRange: function(t) {
        var e = this.getTileSize();
        return new ft(
          t.min.unscaleBy(e).floor(),
          t.max.unscaleBy(e).ceil().subtract([1, 1])
        );
      },
      _noTilesToLoad: function() {
        for (var t in this._tiles)
          if (!this._tiles[t].loaded)
            return !1;
        return !0;
      }
    });
    function Uu(t) {
      return new qi(t);
    }
    var Ti = qi.extend({
      // @section
      // @aka TileLayer options
      options: {
        // @option minZoom: Number = 0
        // The minimum zoom level down to which this layer will be displayed (inclusive).
        minZoom: 0,
        // @option maxZoom: Number = 18
        // The maximum zoom level up to which this layer will be displayed (inclusive).
        maxZoom: 18,
        // @option subdomains: String|String[] = 'abc'
        // Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
        subdomains: "abc",
        // @option errorTileUrl: String = ''
        // URL to the tile image to show in place of the tile that failed to load.
        errorTileUrl: "",
        // @option zoomOffset: Number = 0
        // The zoom number used in tile URLs will be offset with this value.
        zoomOffset: 0,
        // @option tms: Boolean = false
        // If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
        tms: !1,
        // @option zoomReverse: Boolean = false
        // If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
        zoomReverse: !1,
        // @option detectRetina: Boolean = false
        // If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
        detectRetina: !1,
        // @option crossOrigin: Boolean|String = false
        // Whether the crossOrigin attribute will be added to the tiles.
        // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
        // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
        crossOrigin: !1,
        // @option referrerPolicy: Boolean|String = false
        // Whether the referrerPolicy attribute will be added to the tiles.
        // If a String is provided, all tiles will have their referrerPolicy attribute set to the String provided.
        // This may be needed if your map's rendering context has a strict default but your tile provider expects a valid referrer
        // (e.g. to validate an API token).
        // Refer to [HTMLImageElement.referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/referrerPolicy) for valid String values.
        referrerPolicy: !1
      },
      initialize: function(t, e) {
        this._url = t, e = I(this, e), e.detectRetina && H.retina && e.maxZoom > 0 ? (e.tileSize = Math.floor(e.tileSize / 2), e.zoomReverse ? (e.zoomOffset--, e.minZoom = Math.min(e.maxZoom, e.minZoom + 1)) : (e.zoomOffset++, e.maxZoom = Math.max(e.minZoom, e.maxZoom - 1)), e.minZoom = Math.max(0, e.minZoom)) : e.zoomReverse ? e.minZoom = Math.min(e.maxZoom, e.minZoom) : e.maxZoom = Math.max(e.minZoom, e.maxZoom), typeof e.subdomains == "string" && (e.subdomains = e.subdomains.split("")), this.on("tileunload", this._onTileRemove);
      },
      // @method setUrl(url: String, noRedraw?: Boolean): this
      // Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
      // If the URL does not change, the layer will not be redrawn unless
      // the noRedraw parameter is set to false.
      setUrl: function(t, e) {
        return this._url === t && e === void 0 && (e = !0), this._url = t, e || this.redraw(), this;
      },
      // @method createTile(coords: Object, done?: Function): HTMLElement
      // Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
      // to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
      // callback is called when the tile has been loaded.
      createTile: function(t, e) {
        var o = document.createElement("img");
        return X(o, "load", f(this._tileOnLoad, this, e, o)), X(o, "error", f(this._tileOnError, this, e, o)), (this.options.crossOrigin || this.options.crossOrigin === "") && (o.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (o.referrerPolicy = this.options.referrerPolicy), o.alt = "", o.src = this.getTileUrl(t), o;
      },
      // @section Extension methods
      // @uninheritable
      // Layers extending `TileLayer` might reimplement the following method.
      // @method getTileUrl(coords: Object): String
      // Called only internally, returns the URL for a tile given its coordinates.
      // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
      getTileUrl: function(t) {
        var e = {
          r: H.retina ? "@2x" : "",
          s: this._getSubdomain(t),
          x: t.x,
          y: t.y,
          z: this._getZoomForUrl()
        };
        if (this._map && !this._map.options.crs.infinite) {
          var o = this._globalTileRange.max.y - t.y;
          this.options.tms && (e.y = o), e["-y"] = o;
        }
        return J(this._url, l(e, this.options));
      },
      _tileOnLoad: function(t, e) {
        H.ielt9 ? setTimeout(f(t, this, null, e), 0) : t(null, e);
      },
      _tileOnError: function(t, e, o) {
        var r = this.options.errorTileUrl;
        r && e.getAttribute("src") !== r && (e.src = r), t(o, e);
      },
      _onTileRemove: function(t) {
        t.tile.onload = null;
      },
      _getZoomForUrl: function() {
        var t = this._tileZoom, e = this.options.maxZoom, o = this.options.zoomReverse, r = this.options.zoomOffset;
        return o && (t = e - t), t + r;
      },
      _getSubdomain: function(t) {
        var e = Math.abs(t.x + t.y) % this.options.subdomains.length;
        return this.options.subdomains[e];
      },
      // stops loading all tiles in the background layer
      _abortLoading: function() {
        var t, e;
        for (t in this._tiles)
          if (this._tiles[t].coords.z !== this._tileZoom && (e = this._tiles[t].el, e.onload = g, e.onerror = g, !e.complete)) {
            e.src = F;
            var o = this._tiles[t].coords;
            Pt(e), delete this._tiles[t], this.fire("tileabort", {
              tile: e,
              coords: o
            });
          }
      },
      _removeTile: function(t) {
        var e = this._tiles[t];
        if (e)
          return e.el.setAttribute("src", F), qi.prototype._removeTile.call(this, t);
      },
      _tileReady: function(t, e, o) {
        if (!(!this._map || o && o.getAttribute("src") === F))
          return qi.prototype._tileReady.call(this, t, e, o);
      }
    });
    function Cr(t, e) {
      return new Ti(t, e);
    }
    var Mr = Ti.extend({
      // @section
      // @aka TileLayer.WMS options
      // If any custom options not documented here are used, they will be sent to the
      // WMS server as extra parameters in each request URL. This can be useful for
      // [non-standard vendor WMS parameters](https://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
      defaultWmsParams: {
        service: "WMS",
        request: "GetMap",
        // @option layers: String = ''
        // **(required)** Comma-separated list of WMS layers to show.
        layers: "",
        // @option styles: String = ''
        // Comma-separated list of WMS styles.
        styles: "",
        // @option format: String = 'image/jpeg'
        // WMS image format (use `'image/png'` for layers with transparency).
        format: "image/jpeg",
        // @option transparent: Boolean = false
        // If `true`, the WMS service will return images with transparency.
        transparent: !1,
        // @option version: String = '1.1.1'
        // Version of the WMS service to use
        version: "1.1.1"
      },
      options: {
        // @option crs: CRS = null
        // Coordinate Reference System to use for the WMS requests, defaults to
        // map CRS. Don't change this if you're not sure what it means.
        crs: null,
        // @option uppercase: Boolean = false
        // If `true`, WMS request parameter keys will be uppercase.
        uppercase: !1
      },
      initialize: function(t, e) {
        this._url = t;
        var o = l({}, this.defaultWmsParams);
        for (var r in e)
          r in this.options || (o[r] = e[r]);
        e = I(this, e);
        var u = e.detectRetina && H.retina ? 2 : 1, h = this.getTileSize();
        o.width = h.x * u, o.height = h.y * u, this.wmsParams = o;
      },
      onAdd: function(t) {
        this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
        var e = this._wmsVersion >= 1.3 ? "crs" : "srs";
        this.wmsParams[e] = this._crs.code, Ti.prototype.onAdd.call(this, t);
      },
      getTileUrl: function(t) {
        var e = this._tileCoordsToNwSe(t), o = this._crs, r = Nt(o.project(e[0]), o.project(e[1])), u = r.min, h = r.max, m = (this._wmsVersion >= 1.3 && this._crs === Er ? [u.y, u.x, h.y, h.x] : [u.x, u.y, h.x, h.y]).join(","), b = Ti.prototype.getTileUrl.call(this, t);
        return b + vt(this.wmsParams, b, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + m;
      },
      // @method setParams(params: Object, noRedraw?: Boolean): this
      // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
      setParams: function(t, e) {
        return l(this.wmsParams, t), e || this.redraw(), this;
      }
    });
    function Ku(t, e) {
      return new Mr(t, e);
    }
    Ti.WMS = Mr, Cr.wms = Ku;
    var Ze = _e.extend({
      // @section
      // @aka Renderer options
      options: {
        // @option padding: Number = 0.1
        // How much to extend the clip area around the map view (relative to its size)
        // e.g. 0.1 would be 10% of map view in each direction
        padding: 0.1
      },
      initialize: function(t) {
        I(this, t), _(this), this._layers = this._layers || {};
      },
      onAdd: function() {
        this._container || (this._initContainer(), tt(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
      },
      onRemove: function() {
        this.off("update", this._updatePaths, this), this._destroyContainer();
      },
      getEvents: function() {
        var t = {
          viewreset: this._reset,
          zoom: this._onZoom,
          moveend: this._update,
          zoomend: this._onZoomEnd
        };
        return this._zoomAnimated && (t.zoomanim = this._onAnimZoom), t;
      },
      _onAnimZoom: function(t) {
        this._updateTransform(t.center, t.zoom);
      },
      _onZoom: function() {
        this._updateTransform(this._map.getCenter(), this._map.getZoom());
      },
      _updateTransform: function(t, e) {
        var o = this._map.getZoomScale(e, this._zoom), r = this._map.getSize().multiplyBy(0.5 + this.options.padding), u = this._map.project(this._center, e), h = r.multiplyBy(-o).add(u).subtract(this._map._getNewPixelOrigin(t, e));
        H.any3d ? ei(this._container, h, o) : St(this._container, h);
      },
      _reset: function() {
        this._update(), this._updateTransform(this._center, this._zoom);
        for (var t in this._layers)
          this._layers[t]._reset();
      },
      _onZoomEnd: function() {
        for (var t in this._layers)
          this._layers[t]._project();
      },
      _updatePaths: function() {
        for (var t in this._layers)
          this._layers[t]._update();
      },
      _update: function() {
        var t = this.options.padding, e = this._map.getSize(), o = this._map.containerPointToLayerPoint(e.multiplyBy(-t)).round();
        this._bounds = new ft(o, o.add(e.multiplyBy(1 + t * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
      }
    }), Dr = Ze.extend({
      // @section
      // @aka Canvas options
      options: {
        // @option tolerance: Number = 0
        // How much to extend the click tolerance around a path/object on the map.
        tolerance: 0
      },
      getEvents: function() {
        var t = Ze.prototype.getEvents.call(this);
        return t.viewprereset = this._onViewPreReset, t;
      },
      _onViewPreReset: function() {
        this._postponeUpdatePaths = !0;
      },
      onAdd: function() {
        Ze.prototype.onAdd.call(this), this._draw();
      },
      _initContainer: function() {
        var t = this._container = document.createElement("canvas");
        X(t, "mousemove", this._onMouseMove, this), X(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), X(t, "mouseout", this._handleMouseOut, this), t._leaflet_disable_events = !0, this._ctx = t.getContext("2d");
      },
      _destroyContainer: function() {
        yt(this._redrawRequest), delete this._ctx, Pt(this._container), mt(this._container), delete this._container;
      },
      _updatePaths: function() {
        if (!this._postponeUpdatePaths) {
          var t;
          this._redrawBounds = null;
          for (var e in this._layers)
            t = this._layers[e], t._update();
          this._redraw();
        }
      },
      _update: function() {
        if (!(this._map._animatingZoom && this._bounds)) {
          Ze.prototype._update.call(this);
          var t = this._bounds, e = this._container, o = t.getSize(), r = H.retina ? 2 : 1;
          St(e, t.min), e.width = r * o.x, e.height = r * o.y, e.style.width = o.x + "px", e.style.height = o.y + "px", H.retina && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update");
        }
      },
      _reset: function() {
        Ze.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
      },
      _initPath: function(t) {
        this._updateDashArray(t), this._layers[_(t)] = t;
        var e = t._order = {
          layer: t,
          prev: this._drawLast,
          next: null
        };
        this._drawLast && (this._drawLast.next = e), this._drawLast = e, this._drawFirst = this._drawFirst || this._drawLast;
      },
      _addPath: function(t) {
        this._requestRedraw(t);
      },
      _removePath: function(t) {
        var e = t._order, o = e.next, r = e.prev;
        o ? o.prev = r : this._drawLast = r, r ? r.next = o : this._drawFirst = o, delete t._order, delete this._layers[_(t)], this._requestRedraw(t);
      },
      _updatePath: function(t) {
        this._extendRedrawBounds(t), t._project(), t._update(), this._requestRedraw(t);
      },
      _updateStyle: function(t) {
        this._updateDashArray(t), this._requestRedraw(t);
      },
      _updateDashArray: function(t) {
        if (typeof t.options.dashArray == "string") {
          var e = t.options.dashArray.split(/[, ]+/), o = [], r, u;
          for (u = 0; u < e.length; u++) {
            if (r = Number(e[u]), isNaN(r))
              return;
            o.push(r);
          }
          t.options._dashArray = o;
        } else
          t.options._dashArray = t.options.dashArray;
      },
      _requestRedraw: function(t) {
        this._map && (this._extendRedrawBounds(t), this._redrawRequest = this._redrawRequest || xt(this._redraw, this));
      },
      _extendRedrawBounds: function(t) {
        if (t._pxBounds) {
          var e = (t.options.weight || 0) + 1;
          this._redrawBounds = this._redrawBounds || new ft(), this._redrawBounds.extend(t._pxBounds.min.subtract([e, e])), this._redrawBounds.extend(t._pxBounds.max.add([e, e]));
        }
      },
      _redraw: function() {
        this._redrawRequest = null, this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()), this._clear(), this._draw(), this._redrawBounds = null;
      },
      _clear: function() {
        var t = this._redrawBounds;
        if (t) {
          var e = t.getSize();
          this._ctx.clearRect(t.min.x, t.min.y, e.x, e.y);
        } else
          this._ctx.save(), this._ctx.setTransform(1, 0, 0, 1, 0, 0), this._ctx.clearRect(0, 0, this._container.width, this._container.height), this._ctx.restore();
      },
      _draw: function() {
        var t, e = this._redrawBounds;
        if (this._ctx.save(), e) {
          var o = e.getSize();
          this._ctx.beginPath(), this._ctx.rect(e.min.x, e.min.y, o.x, o.y), this._ctx.clip();
        }
        this._drawing = !0;
        for (var r = this._drawFirst; r; r = r.next)
          t = r.layer, (!e || t._pxBounds && t._pxBounds.intersects(e)) && t._updatePath();
        this._drawing = !1, this._ctx.restore();
      },
      _updatePoly: function(t, e) {
        if (this._drawing) {
          var o, r, u, h, m = t._parts, b = m.length, x = this._ctx;
          if (b) {
            for (x.beginPath(), o = 0; o < b; o++) {
              for (r = 0, u = m[o].length; r < u; r++)
                h = m[o][r], x[r ? "lineTo" : "moveTo"](h.x, h.y);
              e && x.closePath();
            }
            this._fillStroke(x, t);
          }
        }
      },
      _updateCircle: function(t) {
        if (!(!this._drawing || t._empty())) {
          var e = t._point, o = this._ctx, r = Math.max(Math.round(t._radius), 1), u = (Math.max(Math.round(t._radiusY), 1) || r) / r;
          u !== 1 && (o.save(), o.scale(1, u)), o.beginPath(), o.arc(e.x, e.y / u, r, 0, Math.PI * 2, !1), u !== 1 && o.restore(), this._fillStroke(o, t);
        }
      },
      _fillStroke: function(t, e) {
        var o = e.options;
        o.fill && (t.globalAlpha = o.fillOpacity, t.fillStyle = o.fillColor || o.color, t.fill(o.fillRule || "evenodd")), o.stroke && o.weight !== 0 && (t.setLineDash && t.setLineDash(e.options && e.options._dashArray || []), t.globalAlpha = o.opacity, t.lineWidth = o.weight, t.strokeStyle = o.color, t.lineCap = o.lineCap, t.lineJoin = o.lineJoin, t.stroke());
      },
      // Canvas obviously doesn't have mouse events for individual drawn objects,
      // so we emulate that by calculating what's under the mouse on mousemove/click manually
      _onClick: function(t) {
        for (var e = this._map.mouseEventToLayerPoint(t), o, r, u = this._drawFirst; u; u = u.next)
          o = u.layer, o.options.interactive && o._containsPoint(e) && (!(t.type === "click" || t.type === "preclick") || !this._map._draggableMoved(o)) && (r = o);
        this._fireEvent(r ? [r] : !1, t);
      },
      _onMouseMove: function(t) {
        if (!(!this._map || this._map.dragging.moving() || this._map._animatingZoom)) {
          var e = this._map.mouseEventToLayerPoint(t);
          this._handleMouseHover(t, e);
        }
      },
      _handleMouseOut: function(t) {
        var e = this._hoveredLayer;
        e && (Lt(this._container, "leaflet-interactive"), this._fireEvent([e], t, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
      },
      _handleMouseHover: function(t, e) {
        if (!this._mouseHoverThrottled) {
          for (var o, r, u = this._drawFirst; u; u = u.next)
            o = u.layer, o.options.interactive && o._containsPoint(e) && (r = o);
          r !== this._hoveredLayer && (this._handleMouseOut(t), r && (tt(this._container, "leaflet-interactive"), this._fireEvent([r], t, "mouseover"), this._hoveredLayer = r)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, t), this._mouseHoverThrottled = !0, setTimeout(f(function() {
            this._mouseHoverThrottled = !1;
          }, this), 32);
        }
      },
      _fireEvent: function(t, e, o) {
        this._map._fireDOMEvent(e, o || e.type, t);
      },
      _bringToFront: function(t) {
        var e = t._order;
        if (e) {
          var o = e.next, r = e.prev;
          if (o)
            o.prev = r;
          else
            return;
          r ? r.next = o : o && (this._drawFirst = o), e.prev = this._drawLast, this._drawLast.next = e, e.next = null, this._drawLast = e, this._requestRedraw(t);
        }
      },
      _bringToBack: function(t) {
        var e = t._order;
        if (e) {
          var o = e.next, r = e.prev;
          if (r)
            r.next = o;
          else
            return;
          o ? o.prev = r : r && (this._drawLast = r), e.prev = null, e.next = this._drawFirst, this._drawFirst.prev = e, this._drawFirst = e, this._requestRedraw(t);
        }
      }
    });
    function Ar(t) {
      return H.canvas ? new Dr(t) : null;
    }
    var Yi = function() {
      try {
        return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(t) {
          return document.createElement("<lvml:" + t + ' class="lvml">');
        };
      } catch {
      }
      return function(t) {
        return document.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
      };
    }(), Gu = {
      _initContainer: function() {
        this._container = at("div", "leaflet-vml-container");
      },
      _update: function() {
        this._map._animatingZoom || (Ze.prototype._update.call(this), this.fire("update"));
      },
      _initPath: function(t) {
        var e = t._container = Yi("shape");
        tt(e, "leaflet-vml-shape " + (this.options.className || "")), e.coordsize = "1 1", t._path = Yi("path"), e.appendChild(t._path), this._updateStyle(t), this._layers[_(t)] = t;
      },
      _addPath: function(t) {
        var e = t._container;
        this._container.appendChild(e), t.options.interactive && t.addInteractiveTarget(e);
      },
      _removePath: function(t) {
        var e = t._container;
        Pt(e), t.removeInteractiveTarget(e), delete this._layers[_(t)];
      },
      _updateStyle: function(t) {
        var e = t._stroke, o = t._fill, r = t.options, u = t._container;
        u.stroked = !!r.stroke, u.filled = !!r.fill, r.stroke ? (e || (e = t._stroke = Yi("stroke")), u.appendChild(e), e.weight = r.weight + "px", e.color = r.color, e.opacity = r.opacity, r.dashArray ? e.dashStyle = Y(r.dashArray) ? r.dashArray.join(" ") : r.dashArray.replace(/( *, *)/g, " ") : e.dashStyle = "", e.endcap = r.lineCap.replace("butt", "flat"), e.joinstyle = r.lineJoin) : e && (u.removeChild(e), t._stroke = null), r.fill ? (o || (o = t._fill = Yi("fill")), u.appendChild(o), o.color = r.fillColor || r.color, o.opacity = r.fillOpacity) : o && (u.removeChild(o), t._fill = null);
      },
      _updateCircle: function(t) {
        var e = t._point.round(), o = Math.round(t._radius), r = Math.round(t._radiusY || o);
        this._setPath(t, t._empty() ? "M0 0" : "AL " + e.x + "," + e.y + " " + o + "," + r + " 0," + 65535 * 360);
      },
      _setPath: function(t, e) {
        t._path.v = e;
      },
      _bringToFront: function(t) {
        bi(t._container);
      },
      _bringToBack: function(t) {
        wi(t._container);
      }
    }, Fn = H.vml ? Yi : E, Ji = Ze.extend({
      _initContainer: function() {
        this._container = Fn("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Fn("g"), this._container.appendChild(this._rootGroup);
      },
      _destroyContainer: function() {
        Pt(this._container), mt(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
      },
      _update: function() {
        if (!(this._map._animatingZoom && this._bounds)) {
          Ze.prototype._update.call(this);
          var t = this._bounds, e = t.getSize(), o = this._container;
          (!this._svgSize || !this._svgSize.equals(e)) && (this._svgSize = e, o.setAttribute("width", e.x), o.setAttribute("height", e.y)), St(o, t.min), o.setAttribute("viewBox", [t.min.x, t.min.y, e.x, e.y].join(" ")), this.fire("update");
        }
      },
      // methods below are called by vector layers implementations
      _initPath: function(t) {
        var e = t._path = Fn("path");
        t.options.className && tt(e, t.options.className), t.options.interactive && tt(e, "leaflet-interactive"), this._updateStyle(t), this._layers[_(t)] = t;
      },
      _addPath: function(t) {
        this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path);
      },
      _removePath: function(t) {
        Pt(t._path), t.removeInteractiveTarget(t._path), delete this._layers[_(t)];
      },
      _updatePath: function(t) {
        t._project(), t._update();
      },
      _updateStyle: function(t) {
        var e = t._path, o = t.options;
        e && (o.stroke ? (e.setAttribute("stroke", o.color), e.setAttribute("stroke-opacity", o.opacity), e.setAttribute("stroke-width", o.weight), e.setAttribute("stroke-linecap", o.lineCap), e.setAttribute("stroke-linejoin", o.lineJoin), o.dashArray ? e.setAttribute("stroke-dasharray", o.dashArray) : e.removeAttribute("stroke-dasharray"), o.dashOffset ? e.setAttribute("stroke-dashoffset", o.dashOffset) : e.removeAttribute("stroke-dashoffset")) : e.setAttribute("stroke", "none"), o.fill ? (e.setAttribute("fill", o.fillColor || o.color), e.setAttribute("fill-opacity", o.fillOpacity), e.setAttribute("fill-rule", o.fillRule || "evenodd")) : e.setAttribute("fill", "none"));
      },
      _updatePoly: function(t, e) {
        this._setPath(t, S(t._parts, e));
      },
      _updateCircle: function(t) {
        var e = t._point, o = Math.max(Math.round(t._radius), 1), r = Math.max(Math.round(t._radiusY), 1) || o, u = "a" + o + "," + r + " 0 1,0 ", h = t._empty() ? "M0 0" : "M" + (e.x - o) + "," + e.y + u + o * 2 + ",0 " + u + -o * 2 + ",0 ";
        this._setPath(t, h);
      },
      _setPath: function(t, e) {
        t._path.setAttribute("d", e);
      },
      // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
      _bringToFront: function(t) {
        bi(t._path);
      },
      _bringToBack: function(t) {
        wi(t._path);
      }
    });
    H.vml && Ji.include(Gu);
    function Ir(t) {
      return H.svg || H.vml ? new Ji(t) : null;
    }
    rt.include({
      // @namespace Map; @method getRenderer(layer: Path): Renderer
      // Returns the instance of `Renderer` that should be used to render the given
      // `Path`. It will ensure that the `renderer` options of the map and paths
      // are respected, and that the renderers do exist on the map.
      getRenderer: function(t) {
        var e = t.options.renderer || this._getPaneRenderer(t.options.pane) || this.options.renderer || this._renderer;
        return e || (e = this._renderer = this._createRenderer()), this.hasLayer(e) || this.addLayer(e), e;
      },
      _getPaneRenderer: function(t) {
        if (t === "overlayPane" || t === void 0)
          return !1;
        var e = this._paneRenderers[t];
        return e === void 0 && (e = this._createRenderer({ pane: t }), this._paneRenderers[t] = e), e;
      },
      _createRenderer: function(t) {
        return this.options.preferCanvas && Ar(t) || Ir(t);
      }
    });
    var kr = Pi.extend({
      initialize: function(t, e) {
        Pi.prototype.initialize.call(this, this._boundsToLatLngs(t), e);
      },
      // @method setBounds(latLngBounds: LatLngBounds): this
      // Redraws the rectangle with the passed bounds.
      setBounds: function(t) {
        return this.setLatLngs(this._boundsToLatLngs(t));
      },
      _boundsToLatLngs: function(t) {
        return t = bt(t), [
          t.getSouthWest(),
          t.getNorthWest(),
          t.getNorthEast(),
          t.getSouthEast()
        ];
      }
    });
    function qu(t, e) {
      return new kr(t, e);
    }
    Ji.create = Fn, Ji.pointsToPath = S, Be.geometryToLayer = In, Be.coordsToLatLng = Uo, Be.coordsToLatLngs = kn, Be.latLngToCoords = Ko, Be.latLngsToCoords = zn, Be.getFeature = Oi, Be.asFeature = Vn, rt.mergeOptions({
      // @option boxZoom: Boolean = true
      // Whether the map can be zoomed to a rectangular area specified by
      // dragging the mouse while pressing the shift key.
      boxZoom: !0
    });
    var zr = Te.extend({
      initialize: function(t) {
        this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this);
      },
      addHooks: function() {
        X(this._container, "mousedown", this._onMouseDown, this);
      },
      removeHooks: function() {
        mt(this._container, "mousedown", this._onMouseDown, this);
      },
      moved: function() {
        return this._moved;
      },
      _destroy: function() {
        Pt(this._pane), delete this._pane;
      },
      _resetState: function() {
        this._resetStateTimeout = 0, this._moved = !1;
      },
      _clearDeferredResetState: function() {
        this._resetStateTimeout !== 0 && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0);
      },
      _onMouseDown: function(t) {
        if (!t.shiftKey || t.which !== 1 && t.button !== 1)
          return !1;
        this._clearDeferredResetState(), this._resetState(), Hi(), So(), this._startPoint = this._map.mouseEventToContainerPoint(t), X(document, {
          contextmenu: oi,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseMove: function(t) {
        this._moved || (this._moved = !0, this._box = at("div", "leaflet-zoom-box", this._container), tt(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);
        var e = new ft(this._point, this._startPoint), o = e.getSize();
        St(this._box, e.min), this._box.style.width = o.x + "px", this._box.style.height = o.y + "px";
      },
      _finish: function() {
        this._moved && (Pt(this._box), Lt(this._container, "leaflet-crosshair")), $i(), Co(), mt(document, {
          contextmenu: oi,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseUp: function(t) {
        if (!(t.which !== 1 && t.button !== 1) && (this._finish(), !!this._moved)) {
          this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(f(this._resetState, this), 0);
          var e = new Et(
            this._map.containerPointToLatLng(this._startPoint),
            this._map.containerPointToLatLng(this._point)
          );
          this._map.fitBounds(e).fire("boxzoomend", { boxZoomBounds: e });
        }
      },
      _onKeyDown: function(t) {
        t.keyCode === 27 && (this._finish(), this._clearDeferredResetState(), this._resetState());
      }
    });
    rt.addInitHook("addHandler", "boxZoom", zr), rt.mergeOptions({
      // @option doubleClickZoom: Boolean|String = true
      // Whether the map can be zoomed in by double clicking on it and
      // zoomed out by double clicking while holding shift. If passed
      // `'center'`, double-click zoom will zoom to the center of the
      //  view regardless of where the mouse was.
      doubleClickZoom: !0
    });
    var Vr = Te.extend({
      addHooks: function() {
        this._map.on("dblclick", this._onDoubleClick, this);
      },
      removeHooks: function() {
        this._map.off("dblclick", this._onDoubleClick, this);
      },
      _onDoubleClick: function(t) {
        var e = this._map, o = e.getZoom(), r = e.options.zoomDelta, u = t.originalEvent.shiftKey ? o - r : o + r;
        e.options.doubleClickZoom === "center" ? e.setZoom(u) : e.setZoomAround(t.containerPoint, u);
      }
    });
    rt.addInitHook("addHandler", "doubleClickZoom", Vr), rt.mergeOptions({
      // @option dragging: Boolean = true
      // Whether the map is draggable with mouse/touch or not.
      dragging: !0,
      // @section Panning Inertia Options
      // @option inertia: Boolean = *
      // If enabled, panning of the map will have an inertia effect where
      // the map builds momentum while dragging and continues moving in
      // the same direction for some time. Feels especially nice on touch
      // devices. Enabled by default.
      inertia: !0,
      // @option inertiaDeceleration: Number = 3000
      // The rate with which the inertial movement slows down, in pixels/second².
      inertiaDeceleration: 3400,
      // px/s^2
      // @option inertiaMaxSpeed: Number = Infinity
      // Max speed of the inertial movement, in pixels/second.
      inertiaMaxSpeed: 1 / 0,
      // px/s
      // @option easeLinearity: Number = 0.2
      easeLinearity: 0.2,
      // TODO refactor, move to CRS
      // @option worldCopyJump: Boolean = false
      // With this option enabled, the map tracks when you pan to another "copy"
      // of the world and seamlessly jumps to the original one so that all overlays
      // like markers and vector layers are still visible.
      worldCopyJump: !1,
      // @option maxBoundsViscosity: Number = 0.0
      // If `maxBounds` is set, this option will control how solid the bounds
      // are when dragging the map around. The default value of `0.0` allows the
      // user to drag outside the bounds at normal speed, higher values will
      // slow down map dragging outside bounds, and `1.0` makes the bounds fully
      // solid, preventing the user from dragging outside the bounds.
      maxBoundsViscosity: 0
    });
    var Rr = Te.extend({
      addHooks: function() {
        if (!this._draggable) {
          var t = this._map;
          this._draggable = new Ke(t._mapPane, t._container), this._draggable.on({
            dragstart: this._onDragStart,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this));
        }
        tt(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
      },
      removeHooks: function() {
        Lt(this._map._container, "leaflet-grab"), Lt(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
      },
      moved: function() {
        return this._draggable && this._draggable._moved;
      },
      moving: function() {
        return this._draggable && this._draggable._moving;
      },
      _onDragStart: function() {
        var t = this._map;
        if (t._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
          var e = bt(this._map.options.maxBounds);
          this._offsetLimit = Nt(
            this._map.latLngToContainerPoint(e.getNorthWest()).multiplyBy(-1),
            this._map.latLngToContainerPoint(e.getSouthEast()).multiplyBy(-1).add(this._map.getSize())
          ), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
        } else
          this._offsetLimit = null;
        t.fire("movestart").fire("dragstart"), t.options.inertia && (this._positions = [], this._times = []);
      },
      _onDrag: function(t) {
        if (this._map.options.inertia) {
          var e = this._lastTime = +/* @__PURE__ */ new Date(), o = this._lastPos = this._draggable._absPos || this._draggable._newPos;
          this._positions.push(o), this._times.push(e), this._prunePositions(e);
        }
        this._map.fire("move", t).fire("drag", t);
      },
      _prunePositions: function(t) {
        for (; this._positions.length > 1 && t - this._times[0] > 50; )
          this._positions.shift(), this._times.shift();
      },
      _onZoomEnd: function() {
        var t = this._map.getSize().divideBy(2), e = this._map.latLngToLayerPoint([0, 0]);
        this._initialWorldOffset = e.subtract(t).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
      },
      _viscousLimit: function(t, e) {
        return t - (t - e) * this._viscosity;
      },
      _onPreDragLimit: function() {
        if (!(!this._viscosity || !this._offsetLimit)) {
          var t = this._draggable._newPos.subtract(this._draggable._startPos), e = this._offsetLimit;
          t.x < e.min.x && (t.x = this._viscousLimit(t.x, e.min.x)), t.y < e.min.y && (t.y = this._viscousLimit(t.y, e.min.y)), t.x > e.max.x && (t.x = this._viscousLimit(t.x, e.max.x)), t.y > e.max.y && (t.y = this._viscousLimit(t.y, e.max.y)), this._draggable._newPos = this._draggable._startPos.add(t);
        }
      },
      _onPreDragWrap: function() {
        var t = this._worldWidth, e = Math.round(t / 2), o = this._initialWorldOffset, r = this._draggable._newPos.x, u = (r - e + o) % t + e - o, h = (r + e + o) % t - e - o, m = Math.abs(u + o) < Math.abs(h + o) ? u : h;
        this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = m;
      },
      _onDragEnd: function(t) {
        var e = this._map, o = e.options, r = !o.inertia || t.noInertia || this._times.length < 2;
        if (e.fire("dragend", t), r)
          e.fire("moveend");
        else {
          this._prunePositions(+/* @__PURE__ */ new Date());
          var u = this._lastPos.subtract(this._positions[0]), h = (this._lastTime - this._times[0]) / 1e3, m = o.easeLinearity, b = u.multiplyBy(m / h), x = b.distanceTo([0, 0]), N = Math.min(o.inertiaMaxSpeed, x), B = b.multiplyBy(N / x), U = N / (o.inertiaDeceleration * m), it = B.multiplyBy(-U / 2).round();
          !it.x && !it.y ? e.fire("moveend") : (it = e._limitOffset(it, e.options.maxBounds), xt(function() {
            e.panBy(it, {
              duration: U,
              easeLinearity: m,
              noMoveStart: !0,
              animate: !0
            });
          }));
        }
      }
    });
    rt.addInitHook("addHandler", "dragging", Rr), rt.mergeOptions({
      // @option keyboard: Boolean = true
      // Makes the map focusable and allows users to navigate the map with keyboard
      // arrows and `+`/`-` keys.
      keyboard: !0,
      // @option keyboardPanDelta: Number = 80
      // Amount of pixels to pan when pressing an arrow key.
      keyboardPanDelta: 80
    });
    var Br = Te.extend({
      keyCodes: {
        left: [37],
        right: [39],
        down: [40],
        up: [38],
        zoomIn: [187, 107, 61, 171],
        zoomOut: [189, 109, 54, 173]
      },
      initialize: function(t) {
        this._map = t, this._setPanDelta(t.options.keyboardPanDelta), this._setZoomDelta(t.options.zoomDelta);
      },
      addHooks: function() {
        var t = this._map._container;
        t.tabIndex <= 0 && (t.tabIndex = "0"), X(t, {
          focus: this._onFocus,
          blur: this._onBlur,
          mousedown: this._onMouseDown
        }, this), this._map.on({
          focus: this._addHooks,
          blur: this._removeHooks
        }, this);
      },
      removeHooks: function() {
        this._removeHooks(), mt(this._map._container, {
          focus: this._onFocus,
          blur: this._onBlur,
          mousedown: this._onMouseDown
        }, this), this._map.off({
          focus: this._addHooks,
          blur: this._removeHooks
        }, this);
      },
      _onMouseDown: function() {
        if (!this._focused) {
          var t = document.body, e = document.documentElement, o = t.scrollTop || e.scrollTop, r = t.scrollLeft || e.scrollLeft;
          this._map._container.focus(), window.scrollTo(r, o);
        }
      },
      _onFocus: function() {
        this._focused = !0, this._map.fire("focus");
      },
      _onBlur: function() {
        this._focused = !1, this._map.fire("blur");
      },
      _setPanDelta: function(t) {
        var e = this._panKeys = {}, o = this.keyCodes, r, u;
        for (r = 0, u = o.left.length; r < u; r++)
          e[o.left[r]] = [-1 * t, 0];
        for (r = 0, u = o.right.length; r < u; r++)
          e[o.right[r]] = [t, 0];
        for (r = 0, u = o.down.length; r < u; r++)
          e[o.down[r]] = [0, t];
        for (r = 0, u = o.up.length; r < u; r++)
          e[o.up[r]] = [0, -1 * t];
      },
      _setZoomDelta: function(t) {
        var e = this._zoomKeys = {}, o = this.keyCodes, r, u;
        for (r = 0, u = o.zoomIn.length; r < u; r++)
          e[o.zoomIn[r]] = t;
        for (r = 0, u = o.zoomOut.length; r < u; r++)
          e[o.zoomOut[r]] = -t;
      },
      _addHooks: function() {
        X(document, "keydown", this._onKeyDown, this);
      },
      _removeHooks: function() {
        mt(document, "keydown", this._onKeyDown, this);
      },
      _onKeyDown: function(t) {
        if (!(t.altKey || t.ctrlKey || t.metaKey)) {
          var e = t.keyCode, o = this._map, r;
          if (e in this._panKeys) {
            if (!o._panAnim || !o._panAnim._inProgress)
              if (r = this._panKeys[e], t.shiftKey && (r = G(r).multiplyBy(3)), o.options.maxBounds && (r = o._limitOffset(G(r), o.options.maxBounds)), o.options.worldCopyJump) {
                var u = o.wrapLatLng(o.unproject(o.project(o.getCenter()).add(r)));
                o.panTo(u);
              } else
                o.panBy(r);
          } else if (e in this._zoomKeys)
            o.setZoom(o.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[e]);
          else if (e === 27 && o._popup && o._popup.options.closeOnEscapeKey)
            o.closePopup();
          else
            return;
          oi(t);
        }
      }
    });
    rt.addInitHook("addHandler", "keyboard", Br), rt.mergeOptions({
      // @section Mouse wheel options
      // @option scrollWheelZoom: Boolean|String = true
      // Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
      // it will zoom to the center of the view regardless of where the mouse was.
      scrollWheelZoom: !0,
      // @option wheelDebounceTime: Number = 40
      // Limits the rate at which a wheel can fire (in milliseconds). By default
      // user can't zoom via wheel more often than once per 40 ms.
      wheelDebounceTime: 40,
      // @option wheelPxPerZoomLevel: Number = 60
      // How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
      // mean a change of one full zoom level. Smaller values will make wheel-zooming
      // faster (and vice versa).
      wheelPxPerZoomLevel: 60
    });
    var Zr = Te.extend({
      addHooks: function() {
        X(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
      },
      removeHooks: function() {
        mt(this._map._container, "wheel", this._onWheelScroll, this);
      },
      _onWheelScroll: function(t) {
        var e = cr(t), o = this._map.options.wheelDebounceTime;
        this._delta += e, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
        var r = Math.max(o - (+/* @__PURE__ */ new Date() - this._startTime), 0);
        clearTimeout(this._timer), this._timer = setTimeout(f(this._performZoom, this), r), oi(t);
      },
      _performZoom: function() {
        var t = this._map, e = t.getZoom(), o = this._map.options.zoomSnap || 0;
        t._stop();
        var r = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), u = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(r)))) / Math.LN2, h = o ? Math.ceil(u / o) * o : u, m = t._limitZoom(e + (this._delta > 0 ? h : -h)) - e;
        this._delta = 0, this._startTime = null, m && (t.options.scrollWheelZoom === "center" ? t.setZoom(e + m) : t.setZoomAround(this._lastMousePos, e + m));
      }
    });
    rt.addInitHook("addHandler", "scrollWheelZoom", Zr);
    var Yu = 600;
    rt.mergeOptions({
      // @section Touch interaction options
      // @option tapHold: Boolean
      // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
      tapHold: H.touchNative && H.safari && H.mobile,
      // @option tapTolerance: Number = 15
      // The max number of pixels a user can shift his finger during touch
      // for it to be considered a valid tap.
      tapTolerance: 15
    });
    var Fr = Te.extend({
      addHooks: function() {
        X(this._map._container, "touchstart", this._onDown, this);
      },
      removeHooks: function() {
        mt(this._map._container, "touchstart", this._onDown, this);
      },
      _onDown: function(t) {
        if (clearTimeout(this._holdTimeout), t.touches.length === 1) {
          var e = t.touches[0];
          this._startPos = this._newPos = new V(e.clientX, e.clientY), this._holdTimeout = setTimeout(f(function() {
            this._cancel(), this._isTapValid() && (X(document, "touchend", Ft), X(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", e));
          }, this), Yu), X(document, "touchend touchcancel contextmenu", this._cancel, this), X(document, "touchmove", this._onMove, this);
        }
      },
      _cancelClickPrevent: function t() {
        mt(document, "touchend", Ft), mt(document, "touchend touchcancel", t);
      },
      _cancel: function() {
        clearTimeout(this._holdTimeout), mt(document, "touchend touchcancel contextmenu", this._cancel, this), mt(document, "touchmove", this._onMove, this);
      },
      _onMove: function(t) {
        var e = t.touches[0];
        this._newPos = new V(e.clientX, e.clientY);
      },
      _isTapValid: function() {
        return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
      },
      _simulateEvent: function(t, e) {
        var o = new MouseEvent(t, {
          bubbles: !0,
          cancelable: !0,
          view: window,
          // detail: 1,
          screenX: e.screenX,
          screenY: e.screenY,
          clientX: e.clientX,
          clientY: e.clientY
          // button: 2,
          // buttons: 2
        });
        o._simulated = !0, e.target.dispatchEvent(o);
      }
    });
    rt.addInitHook("addHandler", "tapHold", Fr), rt.mergeOptions({
      // @section Touch interaction options
      // @option touchZoom: Boolean|String = *
      // Whether the map can be zoomed by touch-dragging with two fingers. If
      // passed `'center'`, it will zoom to the center of the view regardless of
      // where the touch events (fingers) were. Enabled for touch-capable web
      // browsers.
      touchZoom: H.touch,
      // @option bounceAtZoomLimits: Boolean = true
      // Set it to false if you don't want the map to zoom beyond min/max zoom
      // and then bounce back when pinch-zooming.
      bounceAtZoomLimits: !0
    });
    var Hr = Te.extend({
      addHooks: function() {
        tt(this._map._container, "leaflet-touch-zoom"), X(this._map._container, "touchstart", this._onTouchStart, this);
      },
      removeHooks: function() {
        Lt(this._map._container, "leaflet-touch-zoom"), mt(this._map._container, "touchstart", this._onTouchStart, this);
      },
      _onTouchStart: function(t) {
        var e = this._map;
        if (!(!t.touches || t.touches.length !== 2 || e._animatingZoom || this._zooming)) {
          var o = e.mouseEventToContainerPoint(t.touches[0]), r = e.mouseEventToContainerPoint(t.touches[1]);
          this._centerPoint = e.getSize()._divideBy(2), this._startLatLng = e.containerPointToLatLng(this._centerPoint), e.options.touchZoom !== "center" && (this._pinchStartLatLng = e.containerPointToLatLng(o.add(r)._divideBy(2))), this._startDist = o.distanceTo(r), this._startZoom = e.getZoom(), this._moved = !1, this._zooming = !0, e._stop(), X(document, "touchmove", this._onTouchMove, this), X(document, "touchend touchcancel", this._onTouchEnd, this), Ft(t);
        }
      },
      _onTouchMove: function(t) {
        if (!(!t.touches || t.touches.length !== 2 || !this._zooming)) {
          var e = this._map, o = e.mouseEventToContainerPoint(t.touches[0]), r = e.mouseEventToContainerPoint(t.touches[1]), u = o.distanceTo(r) / this._startDist;
          if (this._zoom = e.getScaleZoom(u, this._startZoom), !e.options.bounceAtZoomLimits && (this._zoom < e.getMinZoom() && u < 1 || this._zoom > e.getMaxZoom() && u > 1) && (this._zoom = e._limitZoom(this._zoom)), e.options.touchZoom === "center") {
            if (this._center = this._startLatLng, u === 1)
              return;
          } else {
            var h = o._add(r)._divideBy(2)._subtract(this._centerPoint);
            if (u === 1 && h.x === 0 && h.y === 0)
              return;
            this._center = e.unproject(e.project(this._pinchStartLatLng, this._zoom).subtract(h), this._zoom);
          }
          this._moved || (e._moveStart(!0, !1), this._moved = !0), yt(this._animRequest);
          var m = f(e._move, e, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
          this._animRequest = xt(m, this, !0), Ft(t);
        }
      },
      _onTouchEnd: function() {
        if (!this._moved || !this._zooming) {
          this._zooming = !1;
          return;
        }
        this._zooming = !1, yt(this._animRequest), mt(document, "touchmove", this._onTouchMove, this), mt(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
      }
    });
    rt.addInitHook("addHandler", "touchZoom", Hr), rt.BoxZoom = zr, rt.DoubleClickZoom = Vr, rt.Drag = Rr, rt.Keyboard = Br, rt.ScrollWheelZoom = Zr, rt.TapHold = Fr, rt.TouchZoom = Hr, s.Bounds = ft, s.Browser = H, s.CRS = jt, s.Canvas = Dr, s.Circle = jo, s.CircleMarker = An, s.Class = le, s.Control = pe, s.DivIcon = Sr, s.DivOverlay = Ne, s.DomEvent = pu, s.DomUtil = fu, s.Draggable = Ke, s.Evented = Q, s.FeatureGroup = Ve, s.GeoJSON = Be, s.GridLayer = qi, s.Handler = Te, s.Icon = Ei, s.ImageOverlay = Rn, s.LatLng = ut, s.LatLngBounds = Et, s.Layer = _e, s.LayerGroup = xi, s.LineUtil = Nu, s.Map = rt, s.Marker = Dn, s.Mixin = wu, s.Path = Ge, s.Point = V, s.PolyUtil = xu, s.Polygon = Pi, s.Polyline = Re, s.Popup = Bn, s.PosAnimation = hr, s.Projection = Lu, s.Rectangle = kr, s.Renderer = Ze, s.SVG = Ji, s.SVGOverlay = Lr, s.TileLayer = Ti, s.Tooltip = Zn, s.Transformation = ke, s.Util = _i, s.VideoOverlay = Nr, s.bind = f, s.bounds = Nt, s.canvas = Ar, s.circle = zu, s.circleMarker = ku, s.control = Ui, s.divIcon = ju, s.extend = l, s.featureGroup = Du, s.geoJSON = Tr, s.geoJson = Bu, s.gridLayer = Uu, s.icon = Au, s.imageOverlay = Zu, s.latLng = ot, s.latLngBounds = bt, s.layerGroup = Mu, s.map = _u, s.marker = Iu, s.point = G, s.polygon = Ru, s.polyline = Vu, s.popup = $u, s.rectangle = qu, s.setOptions = I, s.stamp = _, s.svg = Ir, s.svgOverlay = Hu, s.tileLayer = Cr, s.tooltip = Wu, s.transformation = vi, s.version = a, s.videoOverlay = Fu;
    var Ju = window.L;
    s.noConflict = function() {
      return window.L = Ju, this;
    }, window.L = s;
  });
})(ws, ws.exports);
var li = ws.exports;
const wd = /* @__PURE__ */ cl({
  __name: "MapView",
  props: {
    points: {},
    tileSize: {},
    gridSize: {},
    focusX: {},
    focusY: {}
  },
  emits: ["map-ready", "point-clicked"],
  setup(i, { emit: n }) {
    const s = i, a = n, l = Kc(null);
    let c = null, f = null;
    dl(() => {
      if (!l.value) return;
      const w = s.tileSize ?? 256, y = s.gridSize ?? 10, g = y * w, P = y * w;
      c = li.map(l.value, {
        crs: li.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        zoomSnap: 0.1,
        zoomDelta: 0.5,
        inertia: !0,
        zoomControl: !1
      });
      const A = [0, P], Z = [g, 0], I = li.latLngBounds(c.unproject(A, 0), c.unproject(Z, 0));
      c.setMaxBounds(I.pad(0.5)), c.fitBounds(I);
      const vt = li.gridLayer({ tileSize: w, className: "grid-layer" });
      vt.createTile = function(_t) {
        const J = li.DomUtil.create("div");
        return J.style.width = `${w}px`, J.style.height = `${w}px`, J.style.boxSizing = "border-box", J.style.borderRight = "1px solid rgba(0,0,0,0.15)", J.style.borderBottom = "1px solid rgba(0,0,0,0.15)", J.style.background = "#fff", J;
      }, vt.addTo(c), f = li.layerGroup().addTo(c), _(), Number.isFinite(s.focusX) && Number.isFinite(s.focusY) && d(s.focusX, s.focusY), a("map-ready");
    }), pl(() => {
      c == null || c.remove(), c = null;
    }), cn(() => s.points, () => _(), { deep: !0 }), cn([() => s.focusX, () => s.focusY], ([w, y]) => {
      c && Number.isFinite(w) && Number.isFinite(y) && d(w, y);
    });
    function d(w, y) {
      const g = s.tileSize ?? 256, P = w * g + g / 2, A = y * g + g / 2, Z = c.unproject([P, A], 0);
      c.setView(Z, c.getZoom(), { animate: !0 });
    }
    function _() {
      var y;
      if (!c || !f) return;
      f.clearLayers();
      const w = s.tileSize ?? 256;
      (y = s.points) == null || y.forEach((g) => {
        const P = g.coordenadas.x * w + w / 2, A = g.coordenadas.y * w + w / 2, Z = c.unproject([P, A], 0), I = li.circleMarker(Z, { radius: 4, color: "#0b1220", weight: 1, fillColor: "#0b1220", fillOpacity: 1 });
        I.addTo(f), I.on("click", () => a("point-clicked", { id: g._id }));
      });
    }
    return (w, y) => (Ef(), Tf("div", {
      ref_key: "root",
      ref: l,
      class: "map-root"
    }, null, 512));
  }
}), xd = (i, n) => {
  const s = i.__vccOpts || i;
  for (const [a, l] of n)
    s[a] = l;
  return s;
}, Ed = /* @__PURE__ */ xd(wd, [["__scopeId", "data-v-0c90692a"]]), Pd = /* @__PURE__ */ hd(Ed);
customElements.get("mapshade-map") || customElements.define("mapshade-map", Pd);
export {
  Pd as default
};
