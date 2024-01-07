import{isServer as L,createComponent as y,spread as ne,useAssets as ce,ssr as O,escape as x,getRequestEvent as k,delegateEvents as Me,ssrElement as W,mergeProps as qe,NoHydration as le,HydrationScript as Ne,ssrHydrationKey as D,ssrAttribute as je,Hydration as Fe,renderToStream as Ie}from"solid-js/web";import{toWebRequest as Be,getRequestIP as He,setResponseHeader as z,setResponseStatus as V,appendResponseHeader as Ue,getResponseHeader as Ke,removeResponseHeader as _e,getCookie as We,setCookie as ze,eventHandler as Je,sendRedirect as De,setHeader as Ve}from"h3";import{createContext as Z,sharedConfig as G,createUniqueId as Ge,useContext as ue,createRenderEffect as de,onCleanup as K,getOwner as Xe,runWithOwner as Ye,createMemo as S,createSignal as q,untrack as re,on as he,startTransition as Qe,resetErrorBoundaries as se,createComponent as fe,children as Ze,createRoot as et,Show as me,lazy as tt,Suspense as nt,ErrorBoundary as rt}from"solid-js";import{provideRequestEvent as st}from"solid-js/web/storage";const pe=Z(),ge=["title","meta"],X=[],Y=["name","http-equiv","content","charset","media"].concat(["property"]),U=(e,t)=>{const n=Object.fromEntries(Object.entries(e.props).filter(([r])=>t.includes(r)).sort());return(Object.hasOwn(n,"name")||Object.hasOwn(n,"property"))&&(n.name=n.name||n.property,delete n.property),e.tag+JSON.stringify(n)};function ot(){if(!G.context){const n=document.head.querySelectorAll("[data-sm]");Array.prototype.forEach.call(n,r=>r.parentNode.removeChild(r))}const e=new Map;function t(n){if(n.ref)return n.ref;let r=document.querySelector(`[data-sm="${n.id}"]`);return r?(r.tagName.toLowerCase()!==n.tag&&(r.parentNode&&r.parentNode.removeChild(r),r=document.createElement(n.tag)),r.removeAttribute("data-sm")):r=document.createElement(n.tag),r}return{addTag(n){if(ge.indexOf(n.tag)!==-1){const o=n.tag==="title"?X:Y,a=U(n,o);e.has(a)||e.set(a,[]);let i=e.get(a),c=i.length;i=[...i,n],e.set(a,i);let l=t(n);n.ref=l,ne(l,n.props);let d=null;for(var r=c-1;r>=0;r--)if(i[r]!=null){d=i[r];break}return l.parentNode!=document.head&&document.head.appendChild(l),d&&d.ref&&document.head.removeChild(d.ref),c}let s=t(n);return n.ref=s,ne(s,n.props),s.parentNode!=document.head&&document.head.appendChild(s),-1},removeTag(n,r){const s=n.tag==="title"?X:Y,o=U(n,s);if(n.ref){const a=e.get(o);if(a){if(n.ref.parentNode){n.ref.parentNode.removeChild(n.ref);for(let i=r-1;i>=0;i--)a[i]!=null&&document.head.appendChild(a[i].ref)}a[r]=null,e.set(o,a)}else n.ref.parentNode&&n.ref.parentNode.removeChild(n.ref)}}}}function at(){const e=[];return ce(()=>O(ut(e))),{addTag(t){if(ge.indexOf(t.tag)!==-1){const n=t.tag==="title"?X:Y,r=U(t,n),s=e.findIndex(o=>o.tag===t.tag&&U(o,n)===r);s!==-1&&e.splice(s,1)}return e.push(t),e.length},removeTag(t,n){}}}const it=e=>{const t=L?at():ot();return y(pe.Provider,{value:t,get children(){return e.children}})},ct=(e,t,n)=>(lt({tag:e,props:t,setting:n,id:Ge(),get name(){return t.name||t.property}}),null);function lt(e){const t=ue(pe);if(!t)throw new Error("<MetaProvider /> should be in the tree");de(()=>{const n=t.addTag(e);K(()=>t.removeTag(e,n))})}function ut(e){return e.map(t=>{const r=Object.keys(t.props).map(o=>o==="children"?"":` ${o}="${x(t.props[o],!0)}"`).join(""),s=t.props.children;return t.setting?.close?`<${t.tag} data-sm="${t.id}"${r}>${t.setting?.escape?x(s):s||""}</${t.tag}>`:`<${t.tag} data-sm="${t.id}"${r}/>`}).join("")}const dt=e=>ct("title",e,{escape:!0,close:!0});function ht(){let e=new Set;function t(s){return e.add(s),()=>e.delete(s)}let n=!1;function r(s,o){if(n)return!(n=!1);const a={to:s,options:o,defaultPrevented:!1,preventDefault:()=>a.defaultPrevented=!0};for(const i of e)i.listener({...a,from:i.location,retry:c=>{c&&(n=!0),i.navigate(s,{...o,resolve:!1})}});return!a.defaultPrevented}return{subscribe:t,confirm:r}}const ft=/^(?:[a-z0-9]+:)?\/\//i,mt=/^\/+|(\/)\/+$/g;function N(e,t=!1){const n=e.replace(mt,"$1");return n?t||/^[?#]/.test(n)?n:"/"+n:""}function B(e,t,n){if(ft.test(t))return;const r=N(e),s=n&&N(n);let o="";return!s||t.startsWith("/")?o=r:s.toLowerCase().indexOf(r.toLowerCase())!==0?o=r+s:o=s,(o||"/")+N(t,!o)}function pt(e,t){return N(e).replace(/\/*(\*.*)?$/g,"")+N(t)}function ye(e){const t={};return e.searchParams.forEach((n,r)=>{t[r]=n}),t}function gt(e,t,n){const[r,s]=e.split("/*",2),o=r.split("/").filter(Boolean),a=o.length;return i=>{const c=i.split("/").filter(Boolean),l=c.length-a;if(l<0||l>0&&s===void 0&&!t)return null;const d={path:a?"":"/",params:{}},h=v=>n===void 0?void 0:n[v];for(let v=0;v<a;v++){const b=o[v],f=c[v],u=b[0]===":",p=u?b.slice(1):b;if(u&&J(f,h(p)))d.params[p]=f;else if(u||!J(f,b))return null;d.path+=`/${f}`}if(s){const v=l?c.slice(-l).join("/"):"";if(J(v,h(s)))d.params[s]=v;else return null}return d}}function J(e,t){const n=r=>r.localeCompare(e,void 0,{sensitivity:"base"})===0;return t===void 0?!0:typeof t=="string"?n(t):typeof t=="function"?t(e):Array.isArray(t)?t.some(n):t instanceof RegExp?t.test(e):!1}function yt(e){const[t,n]=e.pattern.split("/*",2),r=t.split("/").filter(Boolean);return r.reduce((s,o)=>s+(o.startsWith(":")?2:3),r.length-(n===void 0?0:1))}function ve(e){const t=new Map,n=Xe();return new Proxy({},{get(r,s){return t.has(s)||Ye(n,()=>t.set(s,S(()=>e()[s]))),t.get(s)()},getOwnPropertyDescriptor(){return{enumerable:!0,configurable:!0}},ownKeys(){return Reflect.ownKeys(e())}})}function we(e){let t=/(\/?\:[^\/]+)\?/.exec(e);if(!t)return[e];let n=e.slice(0,t.index),r=e.slice(t.index+t[0].length);const s=[n,n+=t[1]];for(;t=/^(\/\:[^\/]+)\?/.exec(r);)s.push(n+=t[1]),r=r.slice(t[0].length);return we(r).reduce((o,a)=>[...o,...s.map(i=>i+a)],[])}const vt=100,wt=Z(),ee=Z();function bt(e,t=""){const{component:n,load:r,children:s,metadata:o}=e,a=!s||Array.isArray(s)&&!s.length,i={key:e,component:n,load:r,metadata:o};return be(e.path).reduce((c,l)=>{for(const d of we(l)){const h=pt(t,d),v=a?h:h.split("/*",1)[0];c.push({...i,originalPath:d,pattern:v,matcher:gt(v,!a,e.matchFilters)})}return c},[])}function Rt(e,t=0){return{routes:e,score:yt(e[e.length-1])*1e4-t,matcher(n){const r=[];for(let s=e.length-1;s>=0;s--){const o=e[s],a=o.matcher(n);if(!a)return null;r.unshift({...a,route:o})}return r}}}function be(e){return Array.isArray(e)?e:[e]}function Re(e,t="",n=[],r=[]){const s=be(e);for(let o=0,a=s.length;o<a;o++){const i=s[o];if(i&&typeof i=="object"){i.hasOwnProperty("path")||(i.path="");const c=bt(i,t);for(const l of c){n.push(l);const d=Array.isArray(i.children)&&i.children.length===0;if(i.children&&!d)Re(i.children,l.pattern,n,r);else{const h=Rt([...n],r.length);r.push(h)}n.pop()}}}return n.length?r:r.sort((o,a)=>a.score-o.score)}function Se(e,t){for(let n=0,r=e.length;n<r;n++){const s=e[n].matcher(t);if(s)return s}return[]}function St(e,t){const n=new URL("http://sar"),r=S(c=>{const l=e();try{return new URL(l,n)}catch{return console.error(`Invalid path ${l}`),c}},n,{equals:(c,l)=>c.href===l.href}),s=S(()=>r().pathname),o=S(()=>r().search,!0),a=S(()=>r().hash),i=()=>"";return{get pathname(){return s()},get search(){return o()},get hash(){return a()},get state(){return t()},get key(){return i()},query:ve(he(o,()=>ye(r())))}}let $;function Et(e,t,n={}){const{signal:[r,s],utils:o={}}=e,a=o.parsePath||(m=>m),i=o.renderPath||(m=>m),c=o.beforeLeave||ht(),l=B("",n.base||"");if(l===void 0)throw new Error(`${l} is not a valid base path`);l&&!r().value&&s({value:l,replace:!0,scroll:!1});const[d,h]=q(!1),v=async m=>{h(!0);try{await Qe(m)}finally{h(!1)}},[b,f]=q(r().value),[u,p]=q(r().state),g=St(b,u),E=[],R=q(L?ke():[]),C={pattern:l,params:{},path:()=>l,outlet:()=>null,resolvePath(m){return B(l,m)}};return de(()=>{const{value:m,state:w}=r();re(()=>{m!==b()&&v(()=>{$="native",f(m),p(w),se(),R[1]([])}).then(()=>{$=void 0})})}),{base:C,location:g,isRouting:d,renderPath:i,parsePath:a,navigatorFactory:xe,beforeLeave:c,preloadRoute:Oe,submissions:R};function j(m,w,P){re(()=>{if(typeof w=="number"){w&&(o.go?c.confirm(w,P)&&o.go(w):console.warn("Router integration does not support relative routing"));return}const{replace:F,resolve:_,scroll:A,state:M}={replace:!1,resolve:!0,scroll:!0,...P},T=_?m.resolvePath(w):B("",w);if(T===void 0)throw new Error(`Path '${w}' is not a routable path`);if(E.length>=vt)throw new Error("Too many redirects");const te=b();if(T!==te||M!==u()){if(L){const I=k();I&&(I.response=new Response(null,{status:302,headers:{Location:T}})),s({value:T,replace:F,scroll:A,state:M})}else if(c.confirm(T,P)){const I=E.push({value:te,replace:F,scroll:A,state:u()});v(()=>{$="navigate",f(T),p(M),se(),R[1]([])}).then(()=>{E.length===I&&($=void 0,Le({value:T,state:M}))})}}})}function xe(m){return m=m||ue(ee)||C,(w,P)=>j(m,w,P)}function Le(m){const w=E[0];w&&((m.value!==w.value||m.state!==w.state)&&s({...m,replace:w.replace,scroll:w.scroll}),E.length=0)}function Oe(m,w){const P=Se(t(),m.pathname),F=$;$="preload";for(let _ in P){const{route:A,params:M}=P[_];A.component&&A.component.preload&&A.component.preload(),w&&A.load&&A.load({params:M,location:{pathname:m.pathname,search:m.search,hash:m.hash,query:ye(m),state:null,key:""},intent:"preload"})}$=F}function ke(){const m=k();return m&&m.initialSubmission?[m.initialSubmission]:[]}}function Pt(e,t,n,r,s){const{base:o,location:a}=e,{pattern:i,component:c,load:l}=r().route,d=S(()=>r().path);c&&c.preload&&c.preload();const h=l?l({params:s,location:a,intent:$||"initial"}):void 0;return{parent:t,pattern:i,path:d,params:s,outlet:()=>c?fe(c,{params:s,location:a,data:h,get children(){return n()}}):n(),resolvePath(b){return B(o.path(),b,d())}}}const Ee=e=>t=>{const{base:n}=t,r=Ze(()=>t.children),s=S(()=>Re(t.root?{component:t.root,children:r()}:r(),t.base||"")),o=Et(e,s,{base:n});return e.create&&e.create(o),y(wt.Provider,{value:o,get children(){return y(At,{routerState:o,get branches(){return s()}})}})};function At(e){const t=S(()=>Se(e.branches,e.routerState.location.pathname));if(L){const a=k();a&&(a.routerMatches||(a.routerMatches=[])).push(t().map(({route:i,path:c,params:l})=>({path:i.originalPath,pattern:i.pattern,match:c,params:l,metadata:i.metadata})))}const n=ve(()=>{const a=t(),i={};for(let c=0;c<a.length;c++)Object.assign(i,a[c].params);return i}),r=[];let s;const o=S(he(t,(a,i,c)=>{let l=i&&a.length===i.length;const d=[];for(let h=0,v=a.length;h<v;h++){const b=i&&i[h],f=a[h];c&&b&&f.route.key===b.route.key?d[h]=c[h]:(l=!1,r[h]&&r[h](),et(u=>{r[h]=u,d[h]=Pt(e.routerState,d[h-1]||e.routerState.base,$t(()=>o()[h+1]),()=>t()[h],n)}))}return r.splice(a.length).forEach(h=>h()),c&&l?c:(s=d[0],d)}));return y(me,{get when(){return o()&&s},keyed:!0,children:a=>y(ee.Provider,{value:a,get children(){return a.outlet()}})})}const $t=e=>()=>y(me,{get when(){return e()},keyed:!0,children:t=>y(ee.Provider,{value:t,get children(){return t.outlet()}})});function Ct([e,t],n,r){return[n?()=>n(e()):e,r?s=>t(r(s)):t]}function Tt(e){if(e==="#")return null;try{return document.querySelector(e)}catch{return null}}function xt(e){let t=!1;const n=s=>typeof s=="string"?{value:s}:s,r=Ct(q(n(e.get()),{equals:(s,o)=>s.value===o.value}),void 0,s=>(!t&&e.set(s),s));return e.init&&K(e.init((s=e.get())=>{t=!0,r[1](n(s)),t=!1})),Ee({signal:r,create:e.create,utils:e.utils})}function Lt(e,t,n){return e.addEventListener(t,n),()=>e.removeEventListener(t,n)}function Ot(e,t){const n=Tt(`#${e}`);n?n.scrollIntoView():t&&window.scrollTo(0,0)}function kt(e){const t=new URL(e);return t.pathname+t.search}function Mt(e){let t;const n={value:e.url||(t=k())&&kt(t.request.url)||""};return Ee({signal:[()=>n,r=>Object.assign(n,r)]})(e)}const qt=new Map;function Nt(e=!0,t=!1,n="/_server"){return r=>{const s=r.base.path(),o=r.navigatorFactory(r.base);let a={};function i(f){return f.namespaceURI==="http://www.w3.org/2000/svg"}function c(f){if(f.defaultPrevented||f.button!==0||f.metaKey||f.altKey||f.ctrlKey||f.shiftKey)return;const u=f.composedPath().find(j=>j instanceof Node&&j.nodeName.toUpperCase()==="A");if(!u||t&&!u.getAttribute("link"))return;const p=i(u),g=p?u.href.baseVal:u.href;if((p?u.target.baseVal:u.target)||!g&&!u.hasAttribute("state"))return;const R=(u.getAttribute("rel")||"").split(/\s+/);if(u.hasAttribute("download")||R&&R.includes("external"))return;const C=p?new URL(g,document.baseURI):new URL(g);if(!(C.origin!==window.location.origin||s&&C.pathname&&!C.pathname.toLowerCase().startsWith(s.toLowerCase())))return[u,C]}function l(f){const u=c(f);if(!u)return;const[p,g]=u,E=r.parsePath(g.pathname+g.search+g.hash),R=p.getAttribute("state");f.preventDefault(),o(E,{resolve:!1,replace:p.hasAttribute("replace"),scroll:!p.hasAttribute("noscroll"),state:R&&JSON.parse(R)})}function d(f){const u=c(f);if(!u)return;const[p,g]=u;a[g.pathname]||r.preloadRoute(g,p.getAttribute("preload")!=="false")}function h(f){const u=c(f);if(!u)return;const[p,g]=u;a[g.pathname]||(a[g.pathname]=setTimeout(()=>{r.preloadRoute(g,p.getAttribute("preload")!=="false"),delete a[g.pathname]},200))}function v(f){const u=c(f);if(!u)return;const[,p]=u;a[p.pathname]&&(clearTimeout(a[p.pathname]),delete a[p.pathname])}function b(f){let u=f.submitter&&f.submitter.hasAttribute("formaction")?f.submitter.formAction:f.target.action;if(!u)return;if(!u.startsWith("action:")){const g=new URL(u);if(u=r.parsePath(g.pathname+g.search),!u.startsWith(n))return}if(f.target.method.toUpperCase()!=="POST")throw new Error("Only POST forms are supported for Actions");const p=qt.get(u);if(p){f.preventDefault();const g=new FormData(f.target);p.call(r,g)}}Me(["click","submit"]),document.addEventListener("click",l),e&&(document.addEventListener("mouseover",h),document.addEventListener("mouseout",v),document.addEventListener("focusin",d),document.addEventListener("touchstart",d)),document.addEventListener("submit",b),K(()=>{document.removeEventListener("click",l),e&&(document.removeEventListener("mouseover",h),document.removeEventListener("mouseout",v),document.removeEventListener("focusin",d),document.removeEventListener("touchstart",d)),document.removeEventListener("submit",b)})}}function jt(e){return L?Mt(e):xt({get:()=>({value:window.location.pathname+window.location.search+window.location.hash,state:history.state}),set({value:t,replace:n,scroll:r,state:s}){n?window.history.replaceState(s,"",t):window.history.pushState(s,"",t),Ot(window.location.hash.slice(1),r)},init:t=>Lt(window,"popstate",()=>t()),create:Nt(e.preload,e.explicitLinks,e.actionBase),utils:{go:t=>window.history.go(t)}})(e)}const Ft=" ",It={style:e=>W("style",e.attrs,()=>x(e.children),!0),link:e=>W("link",e.attrs,void 0,!0),script:e=>e.attrs.src?W("script",qe(()=>e.attrs,{get id(){return e.key}}),()=>O(Ft),!0):null};function Q(e){let{tag:t,attrs:{key:n,...r}={key:void 0},children:s}=e;return It[t]({attrs:r,key:n,children:s})}function Bt(e,t,n,r="default"){return tt(async()=>{{const o=(await e.import())[r],i=(await t.inputs?.[e.src].assets()).filter(l=>l.tag==="style"||l.attrs.rel==="stylesheet");return{default:l=>[...i.map(d=>Q(d)),fe(o,l)]}}})}const Pe=[{type:"page",$component:{src:"src/routes/index.tsx?pick=default&pick=$css",build:()=>import("./index.js"),import:()=>import("./index.js")},path:"/",filePath:"/Users/brendonovich/github.com/brendonovich/macrograph/web-solid/src/routes/index.tsx"}],Ht=_t(Pe.filter(e=>e.type==="page")),Ut=Wt(Pe.filter(e=>e.type==="api"));function Kt(e,t){const n=e.split("/").filter(Boolean);e:for(const r of Ut){const s=r.matchSegments;if(n.length<s.length||!r.wildcard&&n.length>s.length)continue;for(let i=0;i<s.length;i++){const c=s[i];if(c&&n[i]!==c)continue e}const o=r[`$${t}`];if(o==="skip"||o===void 0)return;const a={};for(const{type:i,name:c,index:l}of r.params)i===":"?a[c]=n[l]:a[c]=n.slice(l).join("/");return{handler:o,params:a}}}function _t(e){function t(n,r,s,o){const a=Object.values(n).find(i=>s.startsWith(i.id+"/"));return a?(t(a.children||(a.children=[]),r,s.slice(a.id.length)),n):(n.push({...r,id:s,path:s.replace(/\/\([^)/]+\)/g,"")}),n)}return e.sort((n,r)=>n.path.length-r.path.length).reduce((n,r)=>t(n,r,r.path,r.path),[])}function Wt(e){return e.flatMap(t=>Ae(t.path).map(r=>({...t,path:r}))).map(zt).sort((t,n)=>n.score-t.score)}function Ae(e){let t=/(\/?\:[^\/]+)\?/.exec(e);if(!t)return[e];let n=e.slice(0,t.index),r=e.slice(t.index+t[0].length);const s=[n,n+=t[1]];for(;t=/^(\/\:[^\/]+)\?/.exec(r);)s.push(n+=t[1]),r=r.slice(t[0].length);return Ae(r).reduce((o,a)=>[...o,...s.map(i=>i+a)],[])}function zt(e){const t=e.path.split("/").filter(Boolean),n=[],r=[];let s=0,o=!1;for(const[a,i]of t.entries())if(i[0]===":"){const c=i.slice(1);s+=3,n.push({type:":",name:c,index:a}),r.push(null)}else i[0]==="*"?(s-=1,n.push({type:"*",name:i.slice(1),index:a}),o=!0):(s+=4,i.match(/^\(.+\)$/)||r.push(i));return{...e,score:s,params:n,matchSegments:r,wildcard:o}}function $e(){function e(n){return{...n,...n.$$route?n.$$route.require().route:void 0,metadata:{...n.$$route?n.$$route.require().route.metadata:{},filesystem:!0},component:Bt(n.$component,globalThis.MANIFEST.client,globalThis.MANIFEST.ssr),children:n.children?n.children.map(e):void 0}}return Ht.map(e)}let oe;const Jt=()=>L?k().routes:oe||(oe=$e());function Dt(e){if(L){const t=k();t&&K(t.components.status(e))}return null}function Vt(){return y(jt,{root:e=>y(it,{get children(){return[y(dt,{children:"MacroGraph"}),y(nt,{get children(){return e.children}})]}}),get children(){return y(Jt,{})}})}function Gt(e){return y(rt,{get fallback(){return y(Dt,{code:500})},get children(){return e.children}})}const Xt=["<script",">","<\/script>"],Yt=["<script",' type="module" async',"><\/script>"],Qt=O("<!DOCTYPE html>");function Zt(e){const t=k();let n=[];return Promise.resolve().then(async()=>{let r=t.routes;if(t.routerMatches&&t.routerMatches[0])for(let s=0;s<t.routerMatches[0].length;s++){const o=t.routerMatches[0][s];if(o.metadata&&o.metadata.filesystem){const a=r.find(l=>l.path===o.path),c=await globalThis.MANIFEST.client.inputs[a.$component.src].assets();n.push.apply(n,c),r=a.children}}n=[...new Map(n.map(s=>[s.attrs.key,s])).values()].filter(s=>s.attrs.rel==="modulepreload"&&!t.assets.find(o=>o.attrs.key===s.attrs.key))}),ce(()=>n.length?n.map(r=>Q(r)):void 0),y(le,{get children(){return[Qt,y(e.document,{get assets(){return[y(Ne,{}),t.assets.map(r=>Q(r))]},get scripts(){return[O(Xt,D(),`window.manifest = ${JSON.stringify(t.manifest)}`),O(Yt,D(),je("src",x(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path,!0),!1))]},get children(){return y(Fe,{get children(){return y(Gt,{get children(){return y(Vt,{})}})}})}})]}})}const Ce=Symbol("h3Event"),H=Symbol("fetchEvent"),en={get(e,t){return t===H?e:e[t]??e[Ce][t]}};function tn(e){return new Proxy({request:Be(e),clientAddress:He(e),locals:{},[Ce]:e},en)}function nn(e){if(!e[H]){const t=tn(e);e[H]=t}return e[H]}function rn(e){const t=We(e,"flash");if(!t)return;let n=JSON.parse(t);if(!n||!n.result)return[];const r=[...n.input.slice(0,-1),new Map(n.input[n.input.length-1])];return ze(e,"flash","",{maxAge:0}),{url:n.url,result:n.error?new Error(n.result):n.result,input:r}}async function Te(e){const t=globalThis.MANIFEST.client;return globalThis.MANIFEST.ssr,z(e,"Content-Type","text/html"),Object.assign(e,{manifest:await t.json(),assets:[...await t.inputs[t.handler].assets()],initialSubmission:rn(e),routes:$e(),components:{status:r=>(V(e,r.code,r.text),()=>V(e,200)),header:r=>(r.append?Ue(e,r.name,r.value):z(e,r.name,r.value),()=>{const s=Ke(e,r.name);if(s&&typeof s=="string"){const o=s.split(", "),a=o.indexOf(r.value);a!==-1&&o.splice(a,1),o.length?z(e,r.name,o.join(", ")):_e(e,r.name)}})},$islands:new Set})}function sn(e,t={}){return Je({onRequest:t.onRequest,onBeforeResponse:t.onBeforeResponse,handler:n=>{const r=nn(n);return st(r,async()=>{const s=Kt(new URL(r.request.url).pathname,r.request.method);if(s){const h=(await s.handler.import())[r.request.method];return r.params=s.params,G.context={event:r},await h(r)}const o=await Te(r);let a={...t};if(a.onCompleteAll){const d=a.onCompleteAll;a.onCompleteAll=h=>{ie(o)(h),d(h)}}else a.onCompleteAll=ie(o);if(a.onCompleteShell){const d=a.onCompleteShell;a.onCompleteShell=h=>{ae(o,n)(),d(h)}}else a.onCompleteShell=ae(o,n);const i=Ie(()=>(G.context.event=o,e(o)),a);if(o.response&&o.response.headers.get("Location"))return De(r,o.response.headers.get("Location"));const{writable:c,readable:l}=new TransformStream;return i.pipeTo(c),l})}})}function ae(e,t){return()=>{e.response&&e.response.headers.get("Location")&&(V(t,302),Ve(t,"Location",e.response.headers.get("Location")))}}function ie(e){return({write:t})=>{const n=e.response&&e.response.headers.get("Location");n&&t(`<script>window.location="${n}"<\/script>`)}}function on(e,t={}){return sn(e,{...t,createPageEvent:Te})}const an=['<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="/favicon.ico">',"</head>"],cn=["<html",' lang="en">','<body><div id="app">',"</div><!--$-->","<!--/--></body></html>"],fn=on(()=>y(Zt,{document:({assets:e,children:t,scripts:n})=>O(cn,D(),y(le,{get children(){return O(an,x(e))}}),x(t),x(n))}));export{fn as default};
