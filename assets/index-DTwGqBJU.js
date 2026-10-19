var e=Object.defineProperty,t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),n=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var r,i,a,o,s,c,l,u,d,f,p,m,h,g,_={},v=[],y=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,b=Array.isArray;function x(e,t){for(var n in t)e[n]=t[n];return e}function S(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function C(e,t,n){var i,a,o,s={};for(o in t)o==`key`?i=t[o]:o==`ref`?a=t[o]:s[o]=t[o];if(arguments.length>2&&(s.children=arguments.length>3?r.call(arguments,2):n),typeof e==`function`&&e.defaultProps!=null)for(o in e.defaultProps)s[o]===void 0&&(s[o]=e.defaultProps[o]);return w(e,s,i,a,null)}function w(e,t,n,r,o){var s={type:e,props:t,key:n,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:o??++a,__i:-1,__u:0};return o==null&&i.vnode!=null&&i.vnode(s),s}function T(e){return e.children}function E(e,t){this.props=e,this.context=t}function D(e,t){if(t==null)return e.__?D(e.__,e.__i+1):null;for(var n;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null)return n.__e;return typeof e.type==`function`?D(e):null}function O(e){if(e.__P&&e.__d){var t=e.__v,n=t.__e,r=[],a=[],o=x({},t);o.__v=t.__v+1,i.vnode&&i.vnode(o),R(e.__P,o,t,e.__n,e.__P.namespaceURI,32&t.__u?[n]:null,r,n??D(t),!!(32&t.__u),a),o.__v=t.__v,o.__.__k[o.__i]=o,te(r,o,a),t.__e=t.__=null,o.__e!=n&&k(o)}}function k(e){if((e=e.__)!=null&&e.__c!=null)return e.__e=e.__c.base=null,e.__k.some(function(t){if(t!=null&&t.__e!=null)return e.__e=e.__c.base=t.__e}),k(e)}function A(e){(!e.__d&&(e.__d=!0)&&o.push(e)&&!j.__r++||s!=i.debounceRendering)&&((s=i.debounceRendering)||c)(j)}function j(){try{for(var e,t=1;o.length;)o.length>t&&o.sort(l),e=o.shift(),t=o.length,O(e)}finally{o.length=j.__r=0}}function M(e,t,n,r,i,a,o,s,c,l,u){var d,f,p,m,h,g,y=r&&r.__k||v,b=t.length;for(c=N(n,t,y,c,b),d=0;d<b;d++)(p=n.__k[d])!=null&&(f=p.__i!=-1&&y[p.__i]||_,p.__i=d,g=R(e,p,f,i,a,o,s,c,l,u),m=p.__e,p.ref&&f.ref!=p.ref&&(f.ref&&ie(f.ref,null,p),u.push(p.ref,p.__c||m,p)),h==null&&m!=null&&(h=m),4&p.__u?(c=P(p,c,e),f.__e&&(f.__e=null)):typeof p.type==`function`&&g!==void 0?c=g:m&&(c=m.nextSibling),p.__u&=-7);return n.__e=h,c}function N(e,t,n,r,i){var a,o,s,c,l,u=n.length,d=u,f=0;for(e.__k=Array(i),a=0;a<i;a++)(o=t[a])!=null&&typeof o!=`boolean`&&typeof o!=`function`?(typeof o==`string`||typeof o==`number`||typeof o==`bigint`||o.constructor==String?o=e.__k[a]=w(null,o,null,null,null):b(o)?o=e.__k[a]=w(T,{children:o},null,null,null):o.constructor===void 0&&o.__b>0?o=e.__k[a]=w(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):e.__k[a]=o,c=a+f,o.__=e,o.__b=e.__b+1,s=null,(l=o.__i=F(o,n,c,d))!=-1&&(d--,(s=n[l])&&(s.__u|=2)),s==null||s.__v==null?(l==-1&&(i>u?f--:i<u&&f++),typeof o.type!=`function`&&(o.__u|=4)):l!=c&&(l==c-1?f--:l==c+1?f++:(l>c?f--:f++,o.__u|=4))):e.__k[a]=null;if(d)for(a=0;a<u;a++)(s=n[a])!=null&&!(2&s.__u)&&(s.__e==r&&(r=D(s)),ae(s,s));return r}function P(e,t,n){var r,i;if(typeof e.type==`function`){for(r=e.__k,i=0;r&&i<r.length;i++)r[i]&&(r[i].__=e,t=P(r[i],t,n));return t}e.__e!=t&&(t&&e.type&&!t.parentNode&&(t=D(e)),t=n.insertBefore(e.__e,t||null));do t&&=t.nextSibling;while(t!=null&&t.nodeType==8);return t}function F(e,t,n,r){var i,a,o,s=e.key,c=e.type,l=t[n],u=l!=null&&!(2&l.__u);if(l===null&&s==null||u&&s==l.key&&c==l.type)return n;if(r>+!!u){for(i=n-1,a=n+1;i>=0||a<t.length;)if((l=t[o=i>=0?i--:a++])!=null&&!(2&l.__u)&&s==l.key&&c==l.type)return o}return-1}function ee(e,t,n){t[0]==`-`?e.setProperty(t,n??``):e[t]=n==null?``:typeof n!=`number`||y.test(t)?n:n+`px`}function I(e,t,n,r,i){var a,o;n:if(t==`style`){if(typeof n==`string`)e.style.cssText=n;else{if(typeof r==`string`&&(e.style.cssText=r=``),r)for(t in r)n&&t in n||ee(e.style,t,``);if(n)for(t in n)r&&n[t]==r[t]||ee(e.style,t,n[t])}}else if(t[0]==`o`&&t[1]==`n`)a=t!=(t=t.replace(p,`$1`)),o=t.toLowerCase(),t=o in e||t==`onFocusOut`||t==`onFocusIn`?o.slice(2):t.slice(2),e.l||={},e.l[t+a]=n,n?r?n[f]=r[f]:(n[f]=m,e.addEventListener(t,a?g:h,a)):e.removeEventListener(t,a?g:h,a);else{if(i==`http://www.w3.org/2000/svg`)t=t.replace(/xlink(H|:h)/,`h`).replace(/sName$/,`s`);else if(t!=`width`&&t!=`height`&&t!=`href`&&t!=`list`&&t!=`form`&&t!=`tabIndex`&&t!=`download`&&t!=`rowSpan`&&t!=`colSpan`&&t!=`role`&&t!=`popover`&&t in e)try{e[t]=n??``;break n}catch{}typeof n==`function`||(n==null||!1===n&&t[4]!=`-`?e.removeAttribute(t):e.setAttribute(t,t==`popover`&&n==1?``:n))}}function L(e){return function(t){if(this.l){var n=this.l[t.type+e];if(t[d]==null)t[d]=m++;else if(t[d]<n[f])return;return n(i.event?i.event(t):t)}}}function R(e,t,n,r,a,o,s,c,l,u){var d,f,p,m,h,g,_,y,C,w,O,k,A,j,N,P,F=t.type;if(t.constructor!==void 0)return null;128&n.__u&&(l=!!(32&n.__u),o=[c=t.__e=n.__e]),(d=i.__b)&&d(t);n:if(typeof F==`function`){f=s.length;try{if(C=t.props,w=F.prototype&&F.prototype.render,O=(d=F.contextType)&&r[d.__c],k=d?O?O.props.value:d.__:r,n.__c?y=(p=t.__c=n.__c).__=p.__E:(w?t.__c=p=new F(C,k):(t.__c=p=new E(C,k),p.constructor=F,p.render=oe),O&&O.sub(p),p.state||(p.state={}),p.__n=r,m=p.__d=!0,p.__h=[],p._sb=[]),w&&p.__s==null&&(p.__s=p.state),w&&F.getDerivedStateFromProps!=null&&(p.__s==p.state&&(p.__s=x({},p.__s)),x(p.__s,F.getDerivedStateFromProps(C,p.__s))),h=p.props,g=p.state,p.__v=t,m)w&&F.getDerivedStateFromProps==null&&p.componentWillMount!=null&&p.componentWillMount(),w&&p.componentDidMount!=null&&p.__h.push(p.componentDidMount);else{if(w&&F.getDerivedStateFromProps==null&&C!==h&&p.componentWillReceiveProps!=null&&p.componentWillReceiveProps(C,k),t.__v==n.__v||!p.__e&&p.shouldComponentUpdate!=null&&!1===p.shouldComponentUpdate(C,p.__s,k)){t.__v!=n.__v&&(p.props=C,p.state=p.__s,p.__d=!1),t.__e=n.__e,t.__k=n.__k,t.__k.some(function(e){e&&(e.__=t)}),v.push.apply(p.__h,p._sb),p._sb=[],p.__h.length&&s.push(p),c=D(n);break n}p.componentWillUpdate!=null&&p.componentWillUpdate(C,p.__s,k),w&&p.componentDidUpdate!=null&&p.__h.push(function(){p.componentDidUpdate(h,g,_)})}if(p.context=k,p.props=C,p.__P=e,p.__e=!1,A=i.__r,j=0,w)p.state=p.__s,p.__d=!1,A&&A(t),d=p.render(p.props,p.state,p.context),v.push.apply(p.__h,p._sb),p._sb=[];else do p.__d=!1,A&&A(t),d=p.render(p.props,p.state,p.context),p.state=p.__s;while(p.__d&&++j<25);p.state=p.__s,p.getChildContext!=null&&(r=x(x({},r),p.getChildContext())),w&&!m&&p.getSnapshotBeforeUpdate!=null&&(_=p.getSnapshotBeforeUpdate(h,g)),N=d!=null&&d.type===T&&d.key==null?ne(d.props.children):d,c=M(e,b(N)?N:[N],t,n,r,a,o,s,c,l,u),p.base=t.__e,t.__u&=-161,p.__h.length&&s.push(p),y&&(p.__E=p.__=null)}catch(e){if(s.length=f,t.__v=null,l||o!=null){if(e.then){for(t.__u|=l?160:128;c&&c.nodeType==8&&c.nextSibling;)c=c.nextSibling;o!=null&&(o[o.indexOf(c)]=null),t.__e=c}else if(o!=null)for(P=o.length;P--;)S(o[P])}else t.__e=n.__e;t.__k??=n.__k||[],e.then||z(t),i.__e(e,t,n)}}else o==null&&t.__v==n.__v?(t.__k=n.__k,t.__e=n.__e):c=t.__e=re(n.__e,t,n,r,a,o,s,l,u);return(d=i.diffed)&&d(t),128&t.__u?void 0:c}function z(e){e&&(e.__c&&(e.__c.__e=!0),e.__k&&e.__k.some(z))}function te(e,t,n){for(var r=0;r<n.length;r++)ie(n[r],n[++r],n[++r]);i.__c&&i.__c(t,e),e.some(function(t){try{e=t.__h,t.__h=[],e.some(function(e){e.call(t)})}catch(e){i.__e(e,t.__v)}})}function ne(e){return typeof e!=`object`||!e||e.__b>0?e:b(e)?e.map(ne):e.constructor===void 0?x({},e):null}function re(e,t,n,a,o,s,c,l,u){var d,f,p,m,h,g,v,y=n.props||_,x=t.props,C=t.type;if(C==`svg`?o=`http://www.w3.org/2000/svg`:C==`math`?o=`http://www.w3.org/1998/Math/MathML`:o||=`http://www.w3.org/1999/xhtml`,s!=null){for(d=0;d<s.length;d++)if((h=s[d])&&`setAttribute`in h==!!C&&(C?h.localName==C:h.nodeType==3)){e=h,s[d]=null;break}}if(e==null){if(C==null)return document.createTextNode(x);e=document.createElementNS(o,C,x.is&&x),l&&=(i.__m&&i.__m(t,s),!1),s=null}if(C==null)y===x||l&&e.data==x||(e.data=x);else{if(s=C==`textarea`&&x.defaultValue!=null?null:s&&r.call(e.childNodes),!l&&s!=null)for(y={},d=0;d<e.attributes.length;d++)y[(h=e.attributes[d]).name]=h.value;for(d in y)h=y[d],d==`dangerouslySetInnerHTML`?p=h:d==`children`||d in x||d==`value`&&`defaultValue`in x||d==`checked`&&`defaultChecked`in x||I(e,d,null,h,o);for(d in x)h=x[d],d==`children`?m=h:d==`dangerouslySetInnerHTML`?f=h:d==`value`?g=h:d==`checked`?v=h:l&&typeof h!=`function`||y[d]===h||I(e,d,h,y[d],o);if(f)l||p&&(f.__html==p.__html||f.__html==e.innerHTML)||(e.innerHTML=f.__html),t.__k=[];else if(p&&(e.innerHTML=``),M(t.type==`template`?e.content:e,b(m)?m:[m],t,n,a,C==`foreignObject`?`http://www.w3.org/1999/xhtml`:o,s,c,s?s[0]:n.__k&&D(n,0),l,u),s!=null)for(d=s.length;d--;)S(s[d]);l&&C!=`textarea`||(d=`value`,C==`progress`&&g==null?e.removeAttribute(`value`):g!=null&&(g!==e[d]||C==`progress`&&!g||C==`option`&&g!=y[d])&&I(e,d,g,y[d],o),d=`checked`,v!=null&&v!=e[d]&&I(e,d,v,y[d],o))}return e}function ie(e,t,n){try{if(typeof e==`function`){var r=typeof e.__u==`function`;r&&e.__u(),r&&t==null||(e.__u=e(t))}else e.current=t}catch(e){i.__e(e,n)}}function ae(e,t,n){var r,a;if(i.unmount&&i.unmount(e),(r=e.ref)&&(r.current&&r.current!=e.__e||ie(r,null,t)),(r=e.__c)!=null){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(e){i.__e(e,t)}r.base=r.__P=r.__n=null}if(r=e.__k)for(a=0;a<r.length;a++)r[a]&&ae(r[a],t,n||typeof e.type!=`function`);n||S(e.__e),e.__c=e.__=e.__e=void 0}function oe(e,t,n){return this.constructor(e,n)}function se(e,t,n){var a,o,s,c;t==document&&(t=document.documentElement),i.__&&i.__(e,t),o=(a=typeof n==`function`)?null:n&&n.__k||t.__k,s=[],c=[],R(t,e=(!a&&n||t).__k=C(T,null,[e]),o||_,_,t.namespaceURI,!a&&n?[n]:o?null:t.firstChild?r.call(t.childNodes):null,s,!a&&n?n:o?o.__e:t.firstChild,a,c),te(s,e,c),e.props.children=null}r=v.slice,i={__e:function(e,t,n,r){for(var i,a,o;t=t.__;)if((i=t.__c)&&!i.__)try{if((a=i.constructor)&&a.getDerivedStateFromError!=null&&(i.setState(a.getDerivedStateFromError(e)),o=i.__d),i.componentDidCatch!=null&&(i.componentDidCatch(e,r||{}),o=i.__d),o)return i.__E=i}catch(t){e=t}throw e}},a=0,E.prototype.setState=function(e,t){var n=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=x({},this.state);typeof e==`function`&&(e=e(x({},n),this.props)),e&&x(n,e),e!=null&&this.__v&&(t&&this._sb.push(t),A(this))},E.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),A(this))},E.prototype.render=T,o=[],c=typeof Promise==`function`?Promise.prototype.then.bind(Promise.resolve()):setTimeout,l=function(e,t){return e.__v.__b-t.__v.__b},j.__r=0,u=Math.random().toString(8),d=`__d`+u,f=`__a`+u,p=/(PointerCapture)$|Capture$/i,m=0,h=L(!1),g=L(!0);var B,V,ce,le,ue=0,de=[],H=i,fe=H.__b,pe=H.__r,me=H.diffed,he=H.__c,ge=H.unmount,_e=H.__;function ve(e,t){H.__h&&H.__h(V,e,ue||t),ue=0;var n=V.__H||(V.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({}),n.__[e]}function U(e){return ue=1,ye(De,e)}function ye(e,t,n){var r=ve(B++,2);if(r.t=e,!r.__c&&(r.__=[n?n(t):De(void 0,t),function(e){var t=r.__N?r.__N[0]:r.__[0],n=r.t(t,e);t!==n&&(r.__N=[n,r.__[1]],r.__c.setState({}))}],r.__c=V,!V.__f)){var i=function(e,t,n){if(!r.__c.__H)return!0;var i=!1,o=r.__c.props!==e;if(r.__c.__H.__.some(function(e){if(e.__N){i=!0;var t=e.__[0];e.__=e.__N,e.__N=void 0,t!==e.__[0]&&(o=!0)}}),a){var s=a.call(this,e,t,n);return i?s||o:s}return!i||o};V.__f=!0;var a=V.shouldComponentUpdate,o=V.componentWillUpdate;V.componentWillUpdate=function(e,t,n){if(this.__e){var r=a;a=void 0,i(e,t,n),a=r}o&&o.call(this,e,t,n)},V.shouldComponentUpdate=i}return r.__N||r.__}function W(e,t){var n=ve(B++,3);!H.__s&&Ee(n.__H,t)&&(n.__=e,n.u=t,V.__H.__h.push(n))}function G(e){return ue=5,be(function(){return{current:e}},[])}function be(e,t){var n=ve(B++,7);return Ee(n.__H,t)&&(n.__=e(),n.__H=t,n.__h=e),n.__}function xe(){for(var e;e=de.shift();){var t=e.__H;if(e.__P&&t)try{t.__h.some(we),t.__h.some(Te),t.__h=[]}catch(n){t.__h=[],H.__e(n,e.__v)}}}H.__b=function(e){V=null,fe&&fe(e)},H.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),_e&&_e(e,t)},H.__r=function(e){pe&&pe(e),B=0;var t=(V=e.__c).__H;t&&(ce===V?(t.__h=[],V.__h=[],t.__.some(function(e){e.__N&&(e.__=e.__N),e.u=e.__N=void 0})):(t.__h.some(we),t.__h.some(Te),t.__h=[],B=0)),ce=V},H.diffed=function(e){me&&me(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(de.push(t)!==1&&le===H.requestAnimationFrame||((le=H.requestAnimationFrame)||Ce)(xe)),t.__H.__.some(function(e){e.u&&=(e.__H=e.u,void 0)})),ce=V=null},H.__c=function(e,t){t.some(function(e){try{e.__h.some(we),e.__h=e.__h.filter(function(e){return!e.__||Te(e)})}catch(n){t.some(function(e){e.__h&&=[]}),t=[],H.__e(n,e.__v)}}),he&&he(e,t)},H.unmount=function(e){ge&&ge(e);var t,n=e.__c;n&&n.__H&&(n.__H.__.some(function(e){try{we(e)}catch(e){t=e}}),n.__H=void 0,t&&H.__e(t,n.__v))};var Se=typeof requestAnimationFrame==`function`;function Ce(e){var t,n=function(){clearTimeout(r),Se&&cancelAnimationFrame(t),setTimeout(e)},r=setTimeout(n,35);Se&&(t=requestAnimationFrame(n))}function we(e){var t=V,n=e.__c;typeof n==`function`&&(e.__c=void 0,n()),V=t}function Te(e){var t=V;e.__c=e.__(),V=t}function Ee(e,t){return!e||e.length!==t.length||t.some(function(t,n){return t!==e[n]})}function De(e,t){return typeof t==`function`?t(e):t}var Oe=`1.0.0`,ke=t((e=>{var t=Object.defineProperty;(e=>t(e,`__esModule`,{value:!0}))(e),((e,n)=>{for(var r in n)t(e,r,{get:n[r],enumerable:!0})})(e,{GIFEncoder:()=>A,applyPalette:()=>S,default:()=>z,nearestColor:()=>k,nearestColorIndex:()=>D,nearestColorIndexWithDistance:()=>O,prequantize:()=>x,quantize:()=>_,snapColorsToPalette:()=>T});var n={signature:`GIF`,version:`89a`,trailer:59,extensionIntroducer:33,applicationExtensionLabel:255,graphicControlExtensionLabel:249,imageSeparator:44,signatureSize:3,versionSize:3,globalColorTableFlagMask:128,colorResolutionMask:112,sortFlagMask:8,globalColorTableSizeMask:7,applicationIdentifierSize:8,applicationAuthCodeSize:3,disposalMethodMask:28,userInputFlagMask:2,transparentColorFlagMask:1,localColorTableFlagMask:128,interlaceFlagMask:64,idSortFlagMask:32,localColorTableSizeMask:7};function r(e=256){let t=0,n=new Uint8Array(e);return{get buffer(){return n.buffer},reset(){t=0},bytesView(){return n.subarray(0,t)},bytes(){return n.slice(0,t)},writeByte(e){r(t+1),n[t]=e,t++},writeBytes(e,i=0,a=e.length){r(t+a);for(let r=0;r<a;r++)n[t++]=e[r+i]},writeBytesView(e,i=0,a=e.byteLength){r(t+a),n.set(e.subarray(i,i+a),t),t+=a}};function r(e){var r=n.length;if(r>=e)return;e=Math.max(e,r*(r<1048576?2:1.125)>>>0),r!=0&&(e=Math.max(e,256));let i=n;n=new Uint8Array(e),t>0&&n.set(i.subarray(0,t),0)}}var i=12,a=5003,o=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];function s(e,t,n,s,c=r(512),l=new Uint8Array(256),u=new Int32Array(a),d=new Int32Array(a)){let f=u.length,p=Math.max(2,s);l.fill(0),d.fill(0),u.fill(-1);let m=0,h=0,g=p+1,_=g,v=!1,y=_,b=(1<<y)-1,x=1<<g-1,S=x+1,C=x+2,w=0,T=n[0],E=0;for(let e=f;e<65536;e*=2)++E;E=8-E,c.writeByte(p),O(x);let D=n.length;for(let e=1;e<D;e++)next_block:{let t=n[e],r=(t<<i)+T,a=t<<E^T;if(u[a]===r){T=d[a];break next_block}let o=a===0?1:f-a;for(;u[a]>=0;)if(a-=o,a<0&&(a+=f),u[a]===r){T=d[a];break next_block}O(T),T=t,C<1<<i?(d[a]=C++,u[a]=r):(u.fill(-1),C=x+2,v=!0,O(x))}return O(T),O(S),c.writeByte(0),c.bytesView();function O(e){for(m&=o[h],h>0?m|=e<<h:m=e,h+=y;h>=8;)l[w++]=m&255,w>=254&&(c.writeByte(w),c.writeBytesView(l,0,w),w=0),m>>=8,h-=8;if((C>b||v)&&(v?(y=_,b=(1<<y)-1,v=!1):(++y,b=y===i?1<<y:(1<<y)-1)),e==S){for(;h>0;)l[w++]=m&255,w>=254&&(c.writeByte(w),c.writeBytesView(l,0,w),w=0),m>>=8,h-=8;w>0&&(c.writeByte(w),c.writeBytesView(l,0,w),w=0)}}}var c=s;function l(e,t,n){return e<<8&63488|t<<2&992|n>>3}function u(e,t,n,r){return e>>4|t&240|(n&240)<<4|(r&240)<<8}function d(e,t,n){return e>>4<<8|t&240|n>>4}function f(e,t,n){return e<t?t:e>n?n:e}function p(e){return e*e}function m(e,t,n){var r=0,i=1e100;let a=e[t],o=a.cnt,s=a.ac,c=a.rc,l=a.gc,u=a.bc;for(var d=a.fw;d!=0;d=e[d].fw){let t=e[d],a=t.cnt,m=o*a/(o+a);if(!(m>=i)){var f=0;n&&(f+=m*p(t.ac-s),f>=i)||(f+=m*p(t.rc-c),!(f>=i)&&(f+=m*p(t.gc-l),!(f>=i)&&(f+=m*p(t.bc-u),!(f>=i)&&(i=f,r=d))))}}a.err=i,a.nn=r}function h(){return{ac:0,rc:0,gc:0,bc:0,cnt:0,nn:0,fw:0,bk:0,tm:0,mtm:0,err:0}}function g(e,t){let n=Array(t===`rgb444`?4096:65536),r=e.length;if(t===`rgba4444`)for(let t=0;t<r;++t){let r=e[t],i=r>>24&255,a=r>>16&255,o=r>>8&255,s=r&255,c=u(s,o,a,i),l=c in n?n[c]:n[c]=h();l.rc+=s,l.gc+=o,l.bc+=a,l.ac+=i,l.cnt++}else if(t===`rgb444`)for(let t=0;t<r;++t){let r=e[t],i=r>>16&255,a=r>>8&255,o=r&255,s=d(o,a,i),c=s in n?n[s]:n[s]=h();c.rc+=o,c.gc+=a,c.bc+=i,c.cnt++}else for(let t=0;t<r;++t){let r=e[t],i=r>>16&255,a=r>>8&255,o=r&255,s=l(o,a,i),c=s in n?n[s]:n[s]=h();c.rc+=o,c.gc+=a,c.bc+=i,c.cnt++}return n}function _(e,t,n={}){let{format:r=`rgb565`,clearAlpha:i=!0,clearAlphaColor:a=0,clearAlphaThreshold:o=0,oneBitAlpha:s=!1}=n;if(!e||!e.buffer||!(e instanceof Uint8Array)&&!(e instanceof Uint8ClampedArray))throw Error(`quantize() expected RGBA Uint8Array data`);let c=new Uint32Array(e.buffer),l=n.useSqrt!==!1,u=r===`rgba4444`,d=g(c,r),h=d.length,_=h-1,y=new Uint32Array(h+1);for(var b=0,x=0;x<h;++x){let e=d[x];if(e!=null){var S=1/e.cnt;u&&(e.ac*=S),e.rc*=S,e.gc*=S,e.bc*=S,d[b++]=e}}p(t)/b<.022&&(l=!1);for(var x=0;x<b-1;++x)d[x].fw=x+1,d[x+1].bk=x,l&&(d[x].cnt=Math.sqrt(d[x].cnt));l&&(d[x].cnt=Math.sqrt(d[x].cnt));var C,w,T;for(x=0;x<b;++x){m(d,x,!1);var E=d[x].err;for(w=++y[0];w>1&&(T=w>>1,!(d[C=y[T]].err<=E));w=T)y[w]=C;y[w]=x}var D=b-t;for(x=0;x<D;){for(var O;;){var k=y[1];if(O=d[k],O.tm>=O.mtm&&d[O.nn].mtm<=O.tm)break;O.mtm==_?k=y[1]=y[y[0]--]:(m(d,k,!1),O.tm=x);var E=d[k].err;for(w=1;(T=w+w)<=y[0]&&(T<y[0]&&d[y[T]].err>d[y[T+1]].err&&T++,!(E<=d[C=y[T]].err));w=T)y[w]=C;y[w]=k}var A=d[O.nn],j=O.cnt,M=A.cnt,S=1/(j+M);u&&(O.ac=S*(j*O.ac+M*A.ac)),O.rc=S*(j*O.rc+M*A.rc),O.gc=S*(j*O.gc+M*A.gc),O.bc=S*(j*O.bc+M*A.bc),O.cnt+=A.cnt,O.mtm=++x,d[A.bk].fw=A.fw,d[A.fw].bk=A.bk,A.mtm=_}let N=[];var P=0;for(x=0;;++P){let e=f(Math.round(d[x].rc),0,255),t=f(Math.round(d[x].gc),0,255),n=f(Math.round(d[x].bc),0,255),r=255;u&&(r=f(Math.round(d[x].ac),0,255),s&&(r=r<=(typeof s==`number`?s:127)?0:255),i&&r<=o&&(e=t=n=a,r=0));let c=u?[e,t,n,r]:[e,t,n];if(v(N,c)||N.push(c),(x=d[x].fw)==0)break}return N}function v(e,t){for(let n=0;n<e.length;n++){let r=e[n],i=r[0]===t[0]&&r[1]===t[1]&&r[2]===t[2],a=r.length>=4&&t.length>=4?r[3]===t[3]:!0;if(i&&a)return!0}return!1}function y(e,t){for(var n=0,r=0;r<e.length;r++){let i=e[r]-t[r];n+=i*i}return n}function b(e,t){return t>1?Math.round(e/t)*t:e}function x(e,{roundRGB:t=5,roundAlpha:n=10,oneBitAlpha:r=null}={}){let i=new Uint32Array(e.buffer);for(let e=0;e<i.length;e++){let a=i[e],o=a>>24&255,s=a>>16&255,c=a>>8&255,l=a&255;o=b(o,n),r&&(o=o<=(typeof r==`number`?r:127)?0:255),l=b(l,t),c=b(c,t),s=b(s,t),i[e]=o<<24|s<<16|c<<8|l}}function S(e,t,n=`rgb565`){if(!e||!e.buffer||!(e instanceof Uint8Array)&&!(e instanceof Uint8ClampedArray))throw Error(`quantize() expected RGBA Uint8Array data`);if(t.length>256)throw Error(`applyPalette() only works with 256 colors or less`);let r=new Uint32Array(e.buffer),i=r.length,a=n===`rgb444`?4096:65536,o=new Uint8Array(i),s=Array(a);if(n===`rgba4444`)for(let e=0;e<i;e++){let n=r[e],i=n>>24&255,a=n>>16&255,c=n>>8&255,l=n&255,d=u(l,c,a,i),f=d in s?s[d]:s[d]=C(l,c,a,i,t);o[e]=f}else{let e=n===`rgb444`?d:l;for(let n=0;n<i;n++){let i=r[n],a=i>>16&255,c=i>>8&255,l=i&255,u=e(l,c,a),d=u in s?s[u]:s[u]=w(l,c,a,t);o[n]=d}}return o}function C(e,t,n,r,i){let a=0,o=1e100;for(let s=0;s<i.length;s++){let c=i[s],l=c[3],u=E(l-r);if(u>o)continue;let d=c[0];if(u+=E(d-e),u>o)continue;let f=c[1];if(u+=E(f-t),u>o)continue;let p=c[2];u+=E(p-n),!(u>o)&&(o=u,a=s)}return a}function w(e,t,n,r){let i=0,a=1e100;for(let o=0;o<r.length;o++){let s=r[o],c=s[0],l=E(c-e);if(l>a)continue;let u=s[1];if(l+=E(u-t),l>a)continue;let d=s[2];l+=E(d-n),!(l>a)&&(a=l,i=o)}return i}function T(e,t,n=5){if(!e.length||!t.length)return;let r=e.map(e=>e.slice(0,3)),i=n*n,a=e[0].length;for(let n=0;n<t.length;n++){let o=t[n];o=o.length<a?[o[0],o[1],o[2],255]:o.length>a?o.slice(0,3):o.slice();let s=O(r,o.slice(0,3),y),c=s[0],l=s[1];l>0&&l<=i&&(e[c]=o)}}function E(e){return e*e}function D(e,t,n=y){let r=1/0,i=-1;for(let a=0;a<e.length;a++){let o=e[a],s=n(t,o);s<r&&(r=s,i=a)}return i}function O(e,t,n=y){let r=1/0,i=-1;for(let a=0;a<e.length;a++){let o=e[a],s=n(t,o);s<r&&(r=s,i=a)}return[i,r]}function k(e,t,n=y){return e[D(e,t,n)]}function A(e={}){let{initialCapacity:t=4096,auto:i=!0}=e,a=r(t),o=5003,s=new Uint8Array(256),c=new Int32Array(o),l=new Int32Array(o),u=!1;return{reset(){a.reset(),u=!1},finish(){a.writeByte(n.trailer)},bytes(){return a.bytes()},bytesView(){return a.bytesView()},get buffer(){return a.buffer},get stream(){return a},writeHeader:d,writeFrame(e,t,n,r={}){let{transparent:o=!1,transparentIndex:f=0,delay:p=0,palette:m=null,repeat:h=0,colorDepth:g=8,dispose:_=-1}=r,v=!1;if(i?u||=(v=!0,d(),!0):v=!!r.first,t=Math.max(0,Math.floor(t)),n=Math.max(0,Math.floor(n)),v){if(!m)throw Error(`First frame must include a { palette } option`);M(a,t,n,m,g),P(a,m),h>=0&&N(a,h)}let y=Math.round(p/10);j(a,_,y,o,f);let b=!!m&&!v;F(a,t,n,b?m:null),b&&P(a,m),ee(a,e,t,n,g,s,c,l)}};function d(){L(a,`GIF89a`)}}function j(e,t,n,r,i){e.writeByte(33),e.writeByte(249),e.writeByte(4),i<0&&(i=0,r=!1);var a,o;r?(a=1,o=2):(a=0,o=0),t>=0&&(o=t&7),o<<=2,e.writeByte(o|0|a),I(e,n),e.writeByte(i||0),e.writeByte(0)}function M(e,t,n,r,i=8){let a=R(r.length)-1,o=i-1<<4|128|a;I(e,t),I(e,n),e.writeBytes([o,0,0])}function N(e,t){e.writeByte(33),e.writeByte(255),e.writeByte(11),L(e,`NETSCAPE2.0`),e.writeByte(3),e.writeByte(1),I(e,t),e.writeByte(0)}function P(e,t){let n=1<<R(t.length);for(let r=0;r<n;r++){let n=[0,0,0];r<t.length&&(n=t[r]),e.writeByte(n[0]),e.writeByte(n[1]),e.writeByte(n[2])}}function F(e,t,n,r){if(e.writeByte(44),I(e,0),I(e,0),I(e,t),I(e,n),r){let t=R(r.length)-1;e.writeByte(128|t)}else e.writeByte(0)}function ee(e,t,n,r,i=8,a,o,s){c(n,r,t,i,e,a,o,s)}function I(e,t){e.writeByte(t&255),e.writeByte(t>>8&255)}function L(e,t){for(var n=0;n<t.length;n++)e.writeByte(t.charCodeAt(n))}function R(e){return Math.max(Math.ceil(Math.log2(e)),1)}var z=A}))(),K=(e,t,n)=>e+(t-e)*n,Ae=e=>e<.5?4*e*e*e:1-(-2*e+2)**3/2;function je(e){let t=/^#([0-9a-f]{6})$/i.exec(e);if(!t)return;let n=parseInt(t[1],16);return[n>>16&255,n>>8&255,n&255]}function Me(e,t,n){if(e===t)return t;let r=je(e),i=je(t);return!r||!i?n<.5?e:t:`#${r.map((e,t)=>Math.round(K(e,i[t],n))).map(e=>e.toString(16).padStart(2,`0`)).join(``)}`}function Ne(e,t,n){let r=Ae(Math.max(0,Math.min(1,n)));if(r>=1)return t;let i=new Map(e.shapes.map(e=>[e.key,e])),a=[],o=new Set;for(let e of t.shapes){o.add(e.key);let t=i.get(e.key);!t||t.type!==e.type?a.push({...e,opacity:e.opacity*r}):a.push(Pe(t,e,r))}for(let t of e.shapes)o.has(t.key)||a.push({...t,opacity:t.opacity*(1-r)});return{width:t.width,height:K(e.height,t.height,r),shapes:a}}function Pe(e,t,n){switch(t.type){case`rect`:{let r=e;return{...t,x:K(r.x,t.x,n),y:K(r.y,t.y,n),w:K(r.w,t.w,n),h:K(r.h,t.h,n),fill:Me(r.fill,t.fill,n),opacity:K(r.opacity,t.opacity,n)}}case`circle`:{let r=e;return{...t,x:K(r.x,t.x,n),y:K(r.y,t.y,n),radius:K(r.radius,t.radius,n),fill:Me(r.fill,t.fill,n),stroke:Me(r.stroke,t.stroke,n),opacity:K(r.opacity,t.opacity,n)}}case`line`:{let r=e;return{...t,x1:K(r.x1,t.x1,n),y1:K(r.y1,t.y1,n),x2:K(r.x2,t.x2,n),y2:K(r.y2,t.y2,n),width:K(r.width,t.width,n),color:Me(r.color,t.color,n),opacity:K(r.opacity,t.opacity,n)}}case`text`:{let r=e;return{...t,x:K(r.x,t.x,n),y:K(r.y,t.y,n),text:n<.5?r.text:t.text,color:Me(r.color,t.color,n),opacity:K(r.opacity,t.opacity,n)}}}}var Fe=`'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif`,Ie=`'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;function Le(e,t,n,r,i=0,a=0){e.save(),e.setTransform(n,0,0,n,i,a),e.textBaseline=`alphabetic`,e.fillStyle=r,e.fillRect(0,0,t.width,t.height+2);for(let n of t.shapes)n.type===`line`&&Re(e,n);for(let n of t.shapes)(n.type===`rect`||n.type===`circle`)&&Re(e,n);for(let n of t.shapes)n.type===`text`&&Re(e,n);e.restore()}function Re(e,t){if(!(t.opacity<=.01)){switch(e.globalAlpha=Math.min(1,t.opacity),t.type){case`rect`:ze(e,t.x,t.y,t.w,t.h,Math.min(t.r,t.w/2,t.h/2)),e.fillStyle=t.fill,e.fill(),t.stroke&&(e.lineWidth=1.5,e.strokeStyle=t.stroke,e.stroke());break;case`circle`:e.beginPath(),e.arc(t.x,t.y,Math.max(0,t.radius),0,Math.PI*2),e.fillStyle=t.fill,e.fill(),e.lineWidth=2,e.strokeStyle=t.stroke,e.stroke();break;case`line`:if(e.beginPath(),e.moveTo(t.x1,t.y1),e.lineTo(t.x2,t.y2),e.strokeStyle=t.color,e.lineWidth=t.width,e.lineCap=`round`,e.stroke(),t.arrow){let n=Math.atan2(t.y2-t.y1,t.x2-t.x1),r=7+t.width;e.beginPath(),e.moveTo(t.x2,t.y2),e.lineTo(t.x2-r*Math.cos(n-.45),t.y2-r*Math.sin(n-.45)),e.lineTo(t.x2-r*Math.cos(n+.45),t.y2-r*Math.sin(n+.45)),e.closePath(),e.fillStyle=t.color,e.fill()}break;case`text`:e.font=`${t.weight} ${t.size}px ${t.mono?Ie:Fe}`,e.textAlign=t.align,e.fillStyle=t.color,e.fillText(t.text,t.x,t.y)}e.globalAlpha=1}}function ze(e,t,n,r,i,a){let o=Math.max(0,a);e.beginPath(),e.moveTo(t+o,n),e.lineTo(t+r-o,n),e.quadraticCurveTo(t+r,n,t+r,n+o),e.lineTo(t+r,n+i-o),e.quadraticCurveTo(t+r,n+i,t+r-o,n+i),e.lineTo(t+o,n+i),e.quadraticCurveTo(t,n+i,t,n+i-o),e.lineTo(t,n+o),e.quadraticCurveTo(t,n,t+o,n),e.closePath()}function Be(e){let t=e>>>0||1;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)%1e5/1e5)}function Ve(e){let t=e.nodes.length,n={};if(t===0)return n;if(e.layout===`manual`){let t=e.nodes.map(e=>e.x??0),r=e.nodes.map(e=>e.y??0),[i,a,o,s]=[Math.min(...t),Math.max(...t),Math.min(...r),Math.max(...r)];for(let t of e.nodes)n[t.id]={x:a===i?.5:((t.x??0)-i)/(a-i),y:s===o?.5:((t.y??0)-o)/(s-o)};return n}if(e.layout===`layered`){let t=new Map(e.nodes.map(e=>[e.id,0]));for(let n of e.edges)t.set(n.to,(t.get(n.to)??0)+1);let r=new Map,i=(t,n,a)=>{if(!a.has(t)&&!((r.get(t)??-1)>=n)){r.set(t,n),a.add(t);for(let r of e.edges)r.from===t&&i(r.to,n+1,a);a.delete(t)}};for(let n of e.nodes)t.get(n.id)||i(n.id,0,new Set);for(let t of e.nodes)r.has(t.id)||r.set(t.id,0);let a=Math.max(...r.values()),o=new Map;for(let t of e.nodes){let e=r.get(t.id);o.set(e,[...o.get(e)??[],t.id])}for(let[e,t]of o)t.forEach((r,i)=>{n[r]={x:a===0?.5:e/a,y:(i+1)/(t.length+1)}});return n}if(e.nodes.forEach((e,r)=>{let i=r/t*Math.PI*2-Math.PI/2;n[e.id]={x:.5+.42*Math.cos(i),y:.5+.42*Math.sin(i)}}),e.layout===`circle`||t<3)return n;let r=Be(t*7919+e.edges.length),i=e.nodes.map(e=>({...n[e.id],x:n[e.id].x+(r()-.5)*.05})),a=new Map(e.nodes.map((e,t)=>[e.id,t])),o=Math.sqrt(1/t),s=.1;for(let n=0;n<300;n++){let n=i.map(()=>({x:0,y:0}));for(let e=0;e<t;e++)for(let r=e+1;r<t;r++){let t=i[e].x-i[r].x,a=i[e].y-i[r].y,s=Math.max(.001,Math.hypot(t,a)),c=o*o/s;n[e].x+=t/s*c,n[e].y+=a/s*c,n[r].x-=t/s*c,n[r].y-=a/s*c}for(let t of e.edges){let e=a.get(t.from),r=a.get(t.to),s=i[e].x-i[r].x,c=i[e].y-i[r].y,l=Math.max(.001,Math.hypot(s,c)),u=l*l/o;n[e].x-=s/l*u,n[e].y-=c/l*u,n[r].x+=s/l*u,n[r].y+=c/l*u}for(let e=0;e<t;e++){let t=Math.max(.001,Math.hypot(n[e].x,n[e].y));i[e].x+=n[e].x/t*Math.min(t,s),i[e].y+=n[e].y/t*Math.min(t,s)}s*=.985}let c=i.map(e=>e.x),l=i.map(e=>e.y),[u,d,f,p]=[Math.min(...c),Math.max(...c),Math.min(...l),Math.max(...l)];return e.nodes.forEach((e,t)=>{n[e.id]={x:d===u?.5:(i[t].x-u)/(d-u),y:p===f?.5:(i[t].y-f)/(p-f)}}),n}function He(e){let t={},n=0,r=0,i=(a,o)=>{if(!a)return;let s=e.nodes[a];s&&(i(s.children[0]??null,o+1),t[a]={col:n++,depth:o},r=Math.max(r,o),i(s.children[1]??null,o+1))},a=(i,o)=>{let s=e.nodes[i];r=Math.max(r,o);let c=(s?.children??[]).filter(t=>!!(t&&e.nodes[t]));if(!c.length)t[i]={col:n++,depth:o};else{let e=c.map(e=>a(e,o+1));t[i]={col:(e[0]+e[e.length-1])/2,depth:o}}return t[i].col};return e.root&&(e.binary?i(e.root,0):a(e.root,0)),{positions:t,columns:n,depth:r}}var Ue={bg:`#fbfaf7`,panel:`#f2f0ea`,ink:`#1c1b18`,muted:`#6f6b62`,faint:`#d9d5cb`,base:`#c9c4b8`,baseInk:`#1c1b18`,wall:`#3b3933`,tones:{active:`#2f6fed`,compare:`#e8a317`,swap:`#e5484d`,done:`#2f9e5b`,visited:`#8c6be8`,frontier:`#14a0c4`,path:`#f2711c`,found:`#12a87e`,muted:`#b9b4a8`,error:`#d93636`,pivot:`#c2449b`}},We={bg:`#141412`,panel:`#1d1c19`,ink:`#f0ede5`,muted:`#9b968a`,faint:`#34322d`,base:`#4a473f`,baseInk:`#f0ede5`,wall:`#cfcabd`,tones:{active:`#5b8cff`,compare:`#f5b83d`,swap:`#ff6b6f`,done:`#4cc27f`,visited:`#a68bff`,frontier:`#3cc3e6`,path:`#ff8a3d`,found:`#36d0a3`,muted:`#5d5a52`,error:`#ff5a5a`,pivot:`#e264b9`}},Ge=1e3,q=28,Ke=26,qe=22;function Je(e,t,n){let r=[],i=q;for(let a of e.structs){if(a.kind===`vars`)continue;r.push(J(`${a.name}:title`,q,i+12,a.name,13,t.muted,`left`,600,!0)),i+=Ke;let e=Ye(a,i,t,n,r);i+=e+qe}return{width:Ge,height:Math.max(i+q-qe,120),shapes:r}}function Ye(e,t,n,r,i){switch(e.kind){case`array`:return e.style===`bars`?Ze(e,t,n,i):Qe(e,t,n,i);case`grid`:return et(e,t,n,i);case`graph`:return tt(e,t,n,r,i);case`tree`:return nt(e,t,n,i);default:return 0}}function J(e,t,n,r,i,a,o=`center`,s=400,c=!1){return{type:`text`,key:e,x:t,y:n,text:r,size:i,color:a,align:o,weight:s,mono:c,opacity:1}}function Y(e){return e===null?``:String(typeof e==`number`?Number.isInteger(e)?e:Math.round(e*100)/100:e)}function Xe(e,t,n){return t?e.tones[t]:n}function Ze(e,t,n,r){let i=e.items.length,a=i?944/i:944,o=Math.max(2,Math.min(56,a*.78)),s=e.items.map(e=>typeof e.value==`number`?e.value:0),c=Math.max(1,...s.map(e=>Math.abs(e))),l=s.some(e=>e<0),u=l?t+105:t+210,d=(l?87:188)/c,f=a>=18;e.items.forEach((t,i)=>{let s=typeof t.value==`number`?t.value:0,c=q+a*i+(a-o)/2,l=Math.max(2,Math.abs(s)*d),p=e.marks[i];r.push({type:`rect`,key:`${t.key}:bar`,x:c,y:s>=0?u-l:u,w:o,h:l,r:Math.min(6,o/4),fill:Xe(n,p,n.base),opacity:1}),f&&r.push(J(`${t.key}:val`,c+o/2,s>=0?u-l-8:u+l+14,Y(t.value),Math.min(14,a*.45),p?n.tones[p]:n.ink,`center`,600,!0))});let p=t+210+6;return(f||i<=60)&&(e.items.forEach((t,o)=>{i>30&&o%5!=0||r.push(J(`${e.name}:idx${o}`,q+a*o+a/2,p+10,String(o),11,n.muted,`center`,400,!0))}),p+=16),p-t+$e(e.name,e.pointers.map(e=>({name:e.name,x:q+a*e.index+a/2})),p,n,r)}function Qe(e,t,n,r){let i=e.items.length,a=Math.max(14,Math.min(64,i?944/i-6:64)),o=i*(a+6)-6,s=q+Math.max(0,(944-o)/2);e.items.forEach((i,o)=>{let c=s+o*(a+6),l=e.marks[o];r.push({type:`rect`,key:`${i.key}:cell`,x:c,y:t,w:a,h:a,r:8,fill:Xe(n,l,n.panel),stroke:l?void 0:n.faint,opacity:1}),r.push(J(`${i.key}:val`,c+a/2,t+a/2+5,Y(i.value),Math.min(18,a*.38),l?`#ffffff`:n.ink,`center`,600,!0))});let c=t+a+6;return e.items.forEach((t,o)=>{i>30&&o%5!=0||r.push(J(`${e.name}:idx${o}`,s+o*(a+6)+a/2,c+10,String(o),11,n.muted,`center`,400,!0))}),c+=16,c-t+$e(e.name,e.pointers.map(e=>({name:e.name,x:s+e.index*(a+6)+a/2})),c,n,r)}function $e(e,t,n,r,i){if(!t.length)return 0;let a=[],o=0;for(let s of t){let t=0;for(;a[t]?.some(e=>Math.abs(e.x-s.x)<34);)t++;(a[t]??=[]).push({x:s.x}),o=Math.max(o,t),i.push(J(`${e}:ptr:${s.name}`,s.x,n+14+t*18,`▲ ${s.name}`,13,r.tones.active,`center`,700,!0))}return 20+o*18}function et(e,t,n,r){let i=e.cells.length,a=e.cells[0]?.length??0,o=Math.max(6,Math.min(44,a?944/a:44)),s=q+(944-o*a)/2;for(let c=0;c<i;c++)for(let i=0;i<a;i++){let a=e.cells[c][i],l=e.marks[`${c},${i}`],u=a===`#`;r.push({type:`rect`,key:`${e.name}:${c},${i}`,x:s+i*o+1,y:t+c*o+1,w:o-2,h:o-2,r:Math.min(6,o/5),fill:l?n.tones[l]:u?n.wall:n.panel,opacity:1}),!u&&a!==null&&a!==``&&o>=20&&r.push(J(`${e.name}:${c},${i}:v`,s+i*o+o/2,t+c*o+o/2+4,Y(a),Math.min(14,o*.38),l?`#ffffff`:n.ink,`center`,600,!0))}for(let i of e.pointers)r.push({type:`circle`,key:`${e.name}:ptr:${i.name}`,x:s+i.col*o+o/2,y:t+i.row*o+o/2,radius:Math.max(3,o*.28),fill:n.ink,stroke:n.bg,opacity:1});return i*o}function tt(e,t,n,r,i){let a=r.get(e.name);a||(a=Ve(e),r.set(e.name,a));let o=e.nodes.length>24?14:20,s=e=>{let n=a[e]??{x:.5,y:.5};return{x:q+o+n.x*(944-2*o),y:t+o+n.y*(360-2*o)}};for(let t of e.edges){let r=s(t.from),a=s(t.to),c=e.edgeMarks[`${t.from}->${t.to}`],l=Math.max(1,Math.hypot(a.x-r.x,a.y-r.y)),u=(a.x-r.x)/l,d=(a.y-r.y)/l;if(i.push({type:`line`,key:`${e.name}:e:${t.from}->${t.to}`,x1:r.x+u*o,y1:r.y+d*o,x2:a.x-u*(o+(e.directed?2:0)),y2:a.y-d*(o+(e.directed?2:0)),color:c?n.tones[c]:n.faint,width:c?4:2,arrow:e.directed,opacity:1}),t.weight!==void 0){let o=(r.x+a.x)/2-d*12,s=(r.y+a.y)/2+u*12;i.push(J(`${e.name}:w:${t.from}->${t.to}`,o,s+4,Y(t.weight),12,c?n.tones[c]:n.muted,`center`,600,!0))}}for(let t of e.nodes){let r=s(t.id),a=e.nodeMarks[t.id];i.push({type:`circle`,key:`${e.name}:n:${t.id}`,x:r.x,y:r.y,radius:o,fill:a?n.tones[a]:n.panel,stroke:a?n.tones[a]:n.base,opacity:1}),i.push(J(`${e.name}:l:${t.id}`,r.x,r.y+5,t.label,o>16?14:11,a?`#ffffff`:n.ink,`center`,700,!0));let c=e.nodeBadges[t.id];c!==void 0&&i.push(J(`${e.name}:b:${t.id}`,r.x+o+4,r.y-o+2,Y(c),12,n.tones.active,`left`,700,!0))}return 360}function nt(e,t,n,r){let i=He(e);if(!e.root)return r.push(J(`${e.name}:empty`,Ge/2,t+24,`(empty)`,13,n.muted)),40;let a=i.columns>1?Math.min(90,906/(i.columns-1)):0,o=47+(906-a*(i.columns-1))/2,s=e=>{let n=i.positions[e];return{x:o+n.col*a,y:t+19+n.depth*72}};for(let t of Object.values(e.nodes))if(i.positions[t.id])for(let a of t.children){if(!a||!i.positions[a])continue;let o=s(t.id),c=s(a);r.push({type:`line`,key:`${e.name}:e:${a}`,x1:o.x,y1:o.y+19,x2:c.x,y2:c.y-19,color:n.faint,width:2,arrow:!1,opacity:1})}for(let t of Object.values(e.nodes)){if(!i.positions[t.id])continue;let a=s(t.id),o=e.marks[t.id];r.push({type:`circle`,key:`${e.name}:n:${t.id}`,x:a.x,y:a.y,radius:19,fill:o?n.tones[o]:n.panel,stroke:o?n.tones[o]:n.base,opacity:1}),r.push(J(`${e.name}:v:${t.id}`,a.x,a.y+5,Y(t.value),13,o?`#ffffff`:n.ink,`center`,700,!0))}return 38+i.depth*72+6}async function rt(e,t,n={}){let r=n.width??720,i=n.delay??50,a=n.hold??1500,o=e.frames.slice(0,n.maxSteps??300),s=new Map,c=o.map(e=>Je(e,t,s)),l=Math.max(...c.map(e=>e.height)),u=r/c[0].width,d=Math.round(l*u)+44,f=document.createElement(`canvas`);f.width=r,f.height=d;let p=f.getContext(`2d`,{willReadFrequently:!0}),m=(n,i)=>{let a=c[n],s=c[Math.max(0,n-1)],f=i>=1?a:Ne(s,a,i);Le(p,{...f,height:l+44/u},u,t.bg);let m=o[n].caption||e.meta.title||``;return p.save(),p.fillStyle=t.panel,p.fillRect(0,d-44,r,44),p.fillStyle=t.ink,p.font=`600 ${Math.round(r/46)}px ${Fe}`,p.textAlign=`left`,p.textBaseline=`middle`,p.fillText(at(p,m,r-32),16,d-22),p.restore(),p.getImageData(0,0,r,d).data},h=[0,.25,.5,.75,1].map(e=>Math.min(c.length-1,Math.round(e*(c.length-1)))),g=new Uint8ClampedArray(r*d*4*h.length);h.forEach((e,t)=>g.set(m(e,1),t*r*d*4));let _=(0,ke.quantize)(g,128),v=(0,ke.GIFEncoder)(),y=c.length,b=n.tweenFrames??(y>200?1:y>100?3:5),x=null,S=()=>{x&&v.writeFrame(x.index,r,d,{palette:_,delay:x.delay}),x=null},C=(e,t)=>{x&&it(x.index,e)?x.delay+=t:(S(),x={index:e,delay:t})};for(let e=0;e<c.length;e++){let t=e===0?1:b;for(let n=1;n<=t;n++)C((0,ke.applyPalette)(m(e,n/t),_),e===c.length-1&&n===t?a:n===t?i*(b>1?4:6):i);n.onProgress?.(e+1,y),e%5==0&&await new Promise(e=>setTimeout(e,0))}return S(),v.finish(),new Blob([new Uint8Array(v.bytes())],{type:`image/gif`})}function it(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function at(e,t,n){if(e.measureText(t).width<=n)return t;let r=t;for(;r.length>1&&e.measureText(`${r}…`).width>n;)r=r.slice(0,-1);return`${r}…`}var ot=`
.tp{--tp-bg:#fbfaf7;--tp-panel:#f2f0ea;--tp-ink:#1c1b18;--tp-muted:#6f6b62;--tp-rule:#e3dfd5;--tp-accent:#2f6fed;--tp-hl:#fff1c2;
  font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--tp-ink);background:var(--tp-bg);border:1px solid var(--tp-rule);
  border-radius:14px;overflow:hidden;display:flex;flex-direction:column;outline:none;position:relative}
.tp[data-theme=dark]{--tp-bg:#141412;--tp-panel:#1d1c19;--tp-ink:#f0ede5;--tp-muted:#9b968a;--tp-rule:#2e2c27;--tp-accent:#5b8cff;--tp-hl:#3b3418}
.tp:focus-visible{box-shadow:0 0 0 3px color-mix(in srgb,var(--tp-accent) 45%,transparent)}
.tp *{box-sizing:border-box}
.tp-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 16px 4px}
.tp-title{font-weight:700;font-size:15px;letter-spacing:-.01em;margin:0}
.tp-desc{margin:2px 0 0;font-size:13px;color:var(--tp-muted)}
.tp-count{font:12px 'JetBrains Mono',ui-monospace,monospace;color:var(--tp-muted);white-space:nowrap}
.tp-body{display:grid;grid-template-columns:minmax(0,1fr);gap:0}
.tp-body.has-side{grid-template-columns:minmax(0,1fr) minmax(220px,32%)}
@media (max-width:760px){.tp-body.has-side{grid-template-columns:minmax(0,1fr)}}
.tp-stage{position:relative;min-width:0}
.tp-stage canvas{display:block;width:100%}
.tp-side{border-left:1px solid var(--tp-rule);background:var(--tp-panel);min-width:0;display:flex;flex-direction:column;max-height:560px}
@media (max-width:760px){.tp-side{border-left:0;border-top:1px solid var(--tp-rule);max-height:300px}}
.tp-code{margin:0;padding:10px 0;overflow:auto;font:12.5px/1.6 'JetBrains Mono',ui-monospace,monospace;font-variant-ligatures:none;flex:1;min-height:0}
.tp-code .ln{display:block;white-space:pre;padding:0 12px 0 0}
.tp-code .ln.on{background:var(--tp-hl)}
.tp-code .no{display:inline-block;width:2.6em;text-align:right;padding-right:10px;color:var(--tp-muted);user-select:none}
.tp-vars{border-top:1px solid var(--tp-rule);padding:8px 12px;font:12.5px 'JetBrains Mono',ui-monospace,monospace;display:grid;gap:3px}
.tp-vars:first-child{border-top:0}
.tp-vars b{font:600 11px 'Inter',system-ui,sans-serif;color:var(--tp-muted);text-transform:uppercase;letter-spacing:.05em}
.tp-var{display:flex;justify-content:space-between;gap:10px}
.tp-var span:last-child{font-weight:700;overflow:hidden;text-overflow:ellipsis}
.tp-var.changed span:last-child{color:var(--tp-accent)}
.tp-caption{padding:10px 16px;border-top:1px solid var(--tp-rule);min-height:52px}
.tp-caption p{margin:0;font-size:14.5px;line-height:1.45}
.tp-caption small{display:block;margin-top:2px;font:12px 'JetBrains Mono',ui-monospace,monospace;color:var(--tp-muted)}
.tp-controls{display:flex;align-items:center;gap:8px;padding:8px 12px;border-top:1px solid var(--tp-rule);flex-wrap:wrap}
.tp-btn{appearance:none;border:1px solid var(--tp-rule);background:var(--tp-bg);color:var(--tp-ink);border-radius:8px;height:32px;min-width:32px;padding:0 9px;
  font:600 13px 'Inter',system-ui,sans-serif;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.tp-btn:hover{background:var(--tp-panel)}
.tp-btn.primary{background:var(--tp-ink);color:var(--tp-bg);border-color:var(--tp-ink)}
.tp-btn:disabled{opacity:.5;cursor:default}
.tp-range{flex:1;min-width:120px;accent-color:var(--tp-accent)}
.tp-speed{height:32px;border-radius:8px;border:1px solid var(--tp-rule);background:var(--tp-bg);color:var(--tp-ink);font:12.5px 'Inter',system-ui,sans-serif;padding:0 6px}
.tp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.tp-brand{font:11px 'Inter',system-ui,sans-serif;color:var(--tp-muted);text-decoration:none;margin-left:auto}
.tp-brand:hover{text-decoration:underline}
`,st=!1;function ct(e=document){if(st||e.getElementById(`traceplay-style`))return;let t=e.createElement(`style`);t.id=`traceplay-style`,t.textContent=ot,e.head.appendChild(t),st=!0}var lt=0;Array.isArray;function X(e,t,n,r,a,o){t||={};var s,c,l=t;if(`ref`in l)for(c in l={},t)c==`ref`?s=t[c]:l[c]=t[c];var u={type:e,props:l,key:n,ref:s,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--lt,__i:-1,__u:0,__source:a,__self:o};if(typeof e==`function`&&(s=e.defaultProps))for(c in s)l[c]===void 0&&(l[c]=s[c]);return i.vnode&&i.vnode(u),u}var ut=[.5,1,2,4];function dt(){let e=typeof window<`u`?window.matchMedia?.(`(prefers-color-scheme: dark)`):void 0,[t,n]=U(!!e?.matches);return W(()=>{if(!e)return;let t=e=>n(e.matches);return e.addEventListener(`change`,t),()=>e.removeEventListener(`change`,t)},[e]),t}function ft({trace:e,autoplay:t=!1,loop:n=!1,theme:r=`auto`,compact:i=!1,exportable:a=!0,branded:o=!1,start:s=0,onStep:c}){ct();let l=dt(),u=r===`dark`||r===`auto`&&l,d=u?We:Ue,f=e.frames,p=f.length-1,[m,h]=U(Math.min(Math.max(0,s),p)),[g,_]=U(t),[v,y]=U(1),[b,x]=U(null),S=G(null),C=G(null),w=G(null),T=G(null),E=G(null),D=G(0),O=G(0),k=G(m),A=be(()=>{let e=new Map,t=new Map;return n=>{let r=t.get(n);return r||(r=Je(f[n],d,e),t.set(n,r)),r}},[f,d]),j=be(()=>{let e=0,t=Math.max(1,Math.floor(f.length/200));for(let n=0;n<f.length;n+=t)e=Math.max(e,A(n).height);return Math.max(e,A(p).height)},[A,f,p]),M=e=>{let t=S.current;if(!t||!O.current)return;let n=window.devicePixelRatio||1,r=O.current/e.width,i=Math.round(j*r);(t.width!==Math.round(O.current*n)||t.height!==Math.round(i*n))&&(t.width=Math.round(O.current*n),t.height=Math.round(i*n),t.style.height=`${i}px`);let a=t.getContext(`2d`);a&&Le(a,{...e,height:j},r*n,d.bg)},N=e=>{let t=E.current;if(!t)return;let n=Math.min(1,(e-t.start)/t.duration),r=Ne(t.from,t.to,n);T.current=r,M(r),n<1?D.current=requestAnimationFrame(N):E.current=null};W(()=>{let e=A(m),t=T.current,n=Math.abs(m-k.current);if(k.current=m,c?.(m),!t||n===0){T.current=e,M(e);return}cancelAnimationFrame(D.current);let r=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;E.current={from:t,to:e,start:performance.now(),duration:r?1:n===1?420/v:160},D.current=requestAnimationFrame(N)},[m,A]),W(()=>{let e=C.current;if(!e)return;let t=new ResizeObserver(()=>{O.current=e.clientWidth,T.current&&M(T.current)});return t.observe(e),O.current=e.clientWidth,T.current&&M(T.current),()=>t.disconnect()},[j,d]),W(()=>{T.current=A(m),M(T.current)},[d]),W(()=>{if(!g)return;let e=setTimeout(()=>{m>=p?n?h(0):_(!1):h(m+1)},m>=p?1600:650/v);return()=>clearTimeout(e)},[g,m,v,p,n]),W(()=>{let e=w.current?.querySelector(`.ln.on`),t=w.current;if(e&&t){let n=e.offsetTop-t.clientHeight/2;t.scrollTo({top:Math.max(0,n),behavior:`smooth`})}},[f[m]?.line]),W(()=>()=>cancelAnimationFrame(D.current),[]);let P=e=>{_(!1),h(Math.min(p,Math.max(0,e)))},F=e=>{(e.target.tagName!==`SELECT`&&e.target.tagName!==`INPUT`||e.key===` `)&&(e.key===` `||e.key===`k`?(e.preventDefault(),!g&&m>=p&&h(0),_(!g)):e.key===`ArrowRight`||e.key===`l`?(e.preventDefault(),P(m+1)):e.key===`ArrowLeft`||e.key===`j`?(e.preventDefault(),P(m-1)):e.key===`Home`?(e.preventDefault(),P(0)):e.key===`End`&&(e.preventDefault(),P(p)))},ee=async()=>{_(!1),x(`0%`);try{let t=await rt(e,d,{onProgress:(e,t)=>x(`${Math.round(e/t*100)}%`)}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`${pt(e.meta.title??`trace`)}.gif`,r.click(),setTimeout(()=>URL.revokeObjectURL(n),2e3)}finally{x(null)}},I=f[m],L=I.structs.filter(e=>e.kind===`vars`),R=e.meta.code?e.meta.code.replace(/\s+$/,``).split(`
`):[],z=!i&&(R.length>0||L.length>0);return X(`div`,{class:`tp`,"data-theme":u?`dark`:`light`,tabIndex:0,role:`region`,"aria-label":`${e.meta.title??`Trace`} animation. Space to play or pause, arrow keys to step.`,onKeyDown:F,children:[X(`div`,{class:`tp-head`,children:[X(`div`,{children:[e.meta.title&&X(`h2`,{class:`tp-title`,children:e.meta.title}),e.meta.description&&!i&&X(`p`,{class:`tp-desc`,children:e.meta.description})]}),X(`span`,{class:`tp-count`,"data-testid":`tp-count`,children:[`step `,m+1,` / `,f.length]})]}),X(`div`,{class:`tp-body${z?` has-side`:``}`,children:[X(`div`,{class:`tp-stage`,ref:C,children:X(`canvas`,{ref:S,role:`img`,"aria-label":I.caption||I.event||`trace step`})}),z&&X(`div`,{class:`tp-side`,children:[R.length>0&&X(`pre`,{class:`tp-code`,ref:w,"aria-label":`Code`,children:R.map((e,t)=>X(`span`,{class:`ln${I.line===t+1?` on`:``}`,children:[X(`span`,{class:`no`,children:t+1}),e||` `]},t))}),L.map(e=>X(`div`,{class:`tp-vars`,children:[X(`b`,{children:e.name}),Object.entries(e.values).map(([t,n])=>X(`div`,{class:`tp-var${e.changed.includes(t)?` changed`:``}`,children:[X(`span`,{children:t}),X(`span`,{children:n===null?`null`:typeof n==`string`?JSON.stringify(n):String(n)})]},t))]},e.name))]})]}),X(`div`,{class:`tp-caption`,"aria-live":`polite`,children:[X(`p`,{"data-testid":`tp-caption`,children:I.caption||` `}),I.event&&X(`small`,{children:I.event})]}),X(`div`,{class:`tp-controls`,children:[X(`button`,{type:`button`,class:`tp-btn`,onClick:()=>P(0),"aria-label":`First step`,disabled:m===0,children:`⏮`}),X(`button`,{type:`button`,class:`tp-btn`,onClick:()=>P(m-1),"aria-label":`Previous step`,disabled:m===0,children:`◀`}),X(`button`,{type:`button`,class:`tp-btn primary`,"data-testid":`tp-play`,onClick:()=>{!g&&m>=p&&h(0),_(!g)},"aria-label":g?`Pause`:`Play`,children:g?`❚❚ Pause`:`▶ Play`}),X(`button`,{type:`button`,class:`tp-btn`,onClick:()=>P(m+1),"aria-label":`Next step`,disabled:m===p,children:`▶`}),X(`button`,{type:`button`,class:`tp-btn`,onClick:()=>P(p),"aria-label":`Last step`,disabled:m===p,children:`⏭`}),X(`input`,{class:`tp-range`,type:`range`,min:0,max:p,value:m,"aria-label":`Step`,onInput:e=>P(Number(e.currentTarget.value))}),X(`select`,{class:`tp-speed`,value:v,"aria-label":`Speed`,onChange:e=>y(Number(e.currentTarget.value)),children:ut.map(e=>X(`option`,{value:e,children:[e,`×`]},e))}),a&&X(`button`,{type:`button`,class:`tp-btn`,onClick:()=>void ee(),disabled:b!==null,children:b?`GIF ${b}`:`GIF`}),o&&X(`a`,{class:`tp-brand`,href:`https://github.com/feresbr1/traceplay`,target:`_blank`,rel:`noreferrer`,children:`made with traceplay`})]})]})}function pt(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)||`trace`}var mt=n({default:()=>gt,meta:()=>ht}),ht={title:`Binary search`,description:`Halve the search range until the target is found or the range is empty.`,code:`function binarySearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`};function gt(e){let t=[2,5,8,12,16,23,38,41,56,72,91,99],n=e.array(`a`,t,{style:`cells`}),r=e.vars(`search`,{target:72,lo:0,hi:t.length-1,mid:null});e.say(`Find 72 in a sorted array.`),e.line(2);let i=0,a=t.length-1;for(n.pointer(`lo`,i),n.pointer(`hi`,a);i<=a;){e.line(3),e.line(4);let o=i+a>>1;if(r.set(`mid`,o),n.pointer(`mid`,o),n.focus(o,`compare`),e.line(5),n.get(o)===72){e.say(`a[${o}] is 72. Found it after ${vt(t,72)} comparisons.`),n.mark(o,`found`);return}e.line(6),n.get(o)<72?(e.say(`${n.get(o)} < 72: discard the left half.`),n.mark(_t(i,o),`muted`),i=o+1,r.set(`lo`,i),n.pointer(`lo`,i)):(e.line(7),e.say(`${n.get(o)} > 72: discard the right half.`),n.mark(_t(o,a),`muted`),a=o-1,r.set(`hi`,a),n.pointer(`hi`,a))}e.line(9),e.step(`Not found.`)}function _t(e,t){return Array.from({length:t-e+1},(t,n)=>e+n)}function vt(e,t){let n=0,r=e.length-1,i=0;for(;n<=r;){i++;let a=n+r>>1;if(e[a]===t)return i;e[a]<t?n=a+1:r=a-1}return i}var yt=n({default:()=>xt,meta:()=>bt}),bt={title:`Binary search tree: insert and search`,description:`Each value goes left if smaller, right if larger. Searching follows the same path.`,code:`function insert(node, value) {
  if (!node) return { value };
  if (value < node.value) node.left = insert(node.left, value);
  else node.right = insert(node.right, value);
  return node;
}
function contains(node, value) {
  while (node) {
    if (value === node.value) return true;
    node = value < node.value ? node.left : node.right;
  }
  return false;
}`};function xt(e){let t=e.tree(`bst`),n=[50,30,70,20,40,60,80,35,45,65],r=null;for(let i of n){if(e.say(`Insert ${i}.`),e.line(1),!r){e.line(2),r=t.setRoot(i);continue}let n=r;for(;;){e.line(3),t.focus(n,`compare`);let r=i<t.value(n)?`left`:`right`;e.line(r===`left`?3:4);let a=r===`left`?t.left(n):t.right(n);if(!a){e.line(2),t.add(n,i,r);break}n=a}}e.say(`Search for 65: one comparison per level.`);let i=r;for(e.line(8);i;){if(e.line(9),t.mark(i,`visited`),t.value(i)===65){e.say(`Found 65 after visiting ${St(t,r,65)} nodes.`),t.mark(i,`found`);return}e.line(10),i=65<t.value(i)?t.left(i):t.right(i)}e.line(12),e.step(`Not found.`)}function St(e,t,n){let r=0;for(let i=t;i&&(r++,e.value(i)!==n);i=n<e.value(i)?e.left(i):e.right(i));return r}var Ct=n({default:()=>Tt,meta:()=>wt}),wt={title:`Dijkstra's shortest paths`,description:`Repeatedly settle the closest unvisited node and relax its edges.`,code:`function dijkstra(graph, source) {
  const dist = { [source]: 0 }, prev = {};
  const done = new Set();
  while (done.size < graph.nodes.length) {
    const u = closestUnvisited(dist, done);
    if (u === undefined) break;
    done.add(u);
    for (const [v, w] of graph.edges(u)) {
      if (dist[u] + w < (dist[v] ?? Infinity)) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
    }
  }
  return dist;
}`};function Tt(e){let t=[{id:`A`,x:0,y:1},{id:`B`,x:1,y:0},{id:`C`,x:1,y:2},{id:`D`,x:2,y:1},{id:`E`,x:3,y:0},{id:`F`,x:3,y:2},{id:`G`,x:4,y:1}],n=e.graph(`graph`,{nodes:t,edges:[[`A`,`B`,4],[`A`,`C`,2],[`B`,`C`,5],[`B`,`D`,10],[`C`,`D`,3],[`B`,`E`,7],[`D`,`E`,4],[`D`,`F`,8],[`E`,`G`,6],[`F`,`G`,1],[`C`,`F`,12]]}),r={A:0},i={},a=new Set;for(e.say(`Shortest distance from A to every node.`),e.line(2),n.badge(`A`,0),e.line(3);a.size<t.length;){e.line(4),e.line(5);let o;for(let e of t)!a.has(e.id)&&r[e.id]!==void 0&&(o===void 0||r[e.id]<r[o])&&(o=e.id);if(o===void 0)break;e.line(7),e.say(`${o} is the closest unvisited node (${r[o]}). Settle it.`),a.add(o),n.mark(o,`active`);for(let t of n.neighbors(o)){if(a.has(t))continue;e.line(8);let s=n.weight(o,t);n.focusEdge(o,t,`compare`),e.line(9),r[o]+s<(r[t]??1/0)&&(e.line(10),e.say(`Via ${o}, ${t} costs ${r[o]} + ${s} = ${r[o]+s}${r[t]===void 0?``:`, better than ${r[t]}`}.`),r[t]=r[o]+s,i[t]=o,e.line(11),n.badge(t,r[t]),n.mark(t,`frontier`))}n.mark(o,`done`)}e.line(15),e.say(`Shortest path to G: ${Et(i,`G`).join(` → `)} (${r.G}).`);let o=Et(i,`G`);e.batch(()=>{for(let e=0;e<o.length-1;e++)n.markEdge(o[e],o[e+1],`path`);for(let e of o)n.mark(e,`path`)},`highlight the path`)}function Et(e,t){let n=[t];for(;e[n[0]];)n.unshift(e[n[0]]);return n}var Dt=n({default:()=>kt,meta:()=>Ot}),Ot={title:`Conway's Game of Life`,description:`A live cell survives with 2 or 3 live neighbours; a dead cell comes alive with exactly 3. Here, a glider.`,code:`function step(board) {
  return board.map((row, r) =>
    row.map((alive, c) => {
      const n = liveNeighbours(board, r, c);
      return n === 3 || (alive && n === 2);
    }),
  );
}`};function kt(e){let t=Array.from({length:14},()=>Array(22).fill(!1));for(let[e,n]of[[1,2],[2,3],[3,1],[3,2],[3,3],[8,14],[8,15],[8,16]])t[e][n]=!0;let n=e.grid(`board`,t.map(e=>e.map(()=>``))),r=e.vars(`life`,{generation:0,alive:At(t)}),i=()=>e.batch(()=>{n.unmark(),t.forEach((e,t)=>e.forEach((e,r)=>e&&n.mark(t,r,`active`)))},`draw generation`);e.say(`Generation 0: a glider (top left) and a blinker.`),i();for(let n=1;n<=24;n++)e.line(4),t=t.map((e,n)=>e.map((e,r)=>{let i=0;for(let e=-1;e<=1;e++)for(let a=-1;a<=1;a++)(e||a)&&t[(n+e+14)%14][(r+a+22)%22]&&i++;return i===3||e&&i===2})),e.line(5),e.say(n%4==0?`Generation ${n}: the glider has moved one cell diagonally.`:`Generation ${n}.`),r.set({generation:n,alive:At(t)}),i()}function At(e){return e.flat().filter(Boolean).length}var jt=n({default:()=>Nt,meta:()=>Mt}),Mt={title:`Heapsort: the array is the tree`,description:`A max-heap stored in an array: children of i live at 2i+1 and 2i+2. Watch both views change together.`,code:`function heapsort(a) {
  for (let i = (a.length >> 1) - 1; i >= 0; i--) siftDown(a, i, a.length);
  for (let end = a.length - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    siftDown(a, 0, end);
  }
}
function siftDown(a, i, n) {
  while (true) {
    const l = 2 * i + 1, r = l + 1;
    let big = i;
    if (l < n && a[l] > a[big]) big = l;
    if (r < n && a[r] > a[big]) big = r;
    if (big === i) return;
    [a[i], a[big]] = [a[big], a[i]];
    i = big;
  }
}`};function Nt(e){let t=[16,4,10,14,7,9,3,2,8,1],n=e.array(`array`,t),r=e.tree(`heap`),i=[],a=(t,a={})=>{e.batch(()=>{if(i.length=0,t!==0){i[0]=r.setRoot(n.get(0));for(let e=1;e<t;e++)i[e]=r.add(i[e-1>>1],n.get(e),e%2==1?`left`:`right`);r.unmark();for(let[e,t]of Object.entries(a))i[e]&&r.mark(i[e],t)}})},o=(t,r)=>{for(;;){e.line(10);let i=2*t+1,o=i+1,s=t;if(e.line(12),i<r&&(n.compare(i,s),n.get(i)>n.get(s)&&(s=i)),e.line(13),o<r&&(n.compare(o,s),n.get(o)>n.get(s)&&(s=o)),e.line(14),s===t)return;e.line(15),e.say(`${n.get(s)} is larger than its parent ${n.get(t)}: swap them.`),n.swap(t,s),a(r,{[t]:`swap`,[s]:`swap`}),e.line(16),t=s}};e.say(`Build a max-heap: sift down every parent, from the last one to the root.`),a(t.length);for(let r=(t.length>>1)-1;r>=0;r--)e.line(2),e.say(`Sift down a[${r}] = ${n.get(r)}.`),a(t.length,{[r]:`active`}),o(r,t.length);e.say(`Max-heap built: the largest value is at the root.`),a(t.length,{0:`found`});for(let r=t.length-1;r>0;r--)e.line(4),e.say(`Move the max (${n.get(0)}) to the end, shrink the heap, repair it.`),n.swap(0,r),n.mark(r,`done`),a(r,{0:`swap`}),e.line(5),o(0,r);n.mark(0,`done`),a(0),e.say(`Sorted, in place, in O(n log n).`),e.step()}var Pt=n({default:()=>Lt,meta:()=>Ft}),Ft={title:`Breadth-first search through a maze`,description:`Explore the maze in rings of equal distance; the first time the exit is reached is the shortest path.`,code:`function bfs(grid, start, goal) {
  const queue = [start];
  const prev = new Map([[key(start), null]]);
  while (queue.length) {
    const cell = queue.shift();
    if (same(cell, goal)) return path(prev, goal);
    for (const next of neighbours(grid, cell)) {
      if (prev.has(key(next))) continue;
      prev.set(key(next), cell);
      queue.push(next);
    }
  }
  return null;
}`},It=[`S..#.......#....`,`.#.#.#####.#.##.`,`.#...#...#...#..`,`.#####.#.#####.#`,`...#...#.....#..`,`##.#.#######.##.`,`.....#.....#....`,`.###.#.###.####.`,`...#...#.......G`];function Lt(e){let t=It.map(e=>[...e].map(e=>e===`#`?`#`:e===`.`?``:e)),n=e.grid(`maze`,t),r=[0,0],i=[It.length-1,It[0].length-1],a=([e,t])=>`${e},${t}`,o=[r],s=new Map([[a(r),null]]),c=e.vars(`bfs`,{queued:1,explored:0});e.say(`Explore outward from S, one ring of equal distance at a time.`),e.line(2),n.mark(r[0],r[1],`frontier`);let l=0;for(;o.length;){e.line(5);let[r,u]=o.shift();if(n.pointer(`here`,r,u),r===i[0]&&u===i[1]){e.line(6);break}l++,n.mark(r,u,`visited`),e.line(7),e.batch(()=>{for(let[e,i]of[[0,1],[1,0],[0,-1],[-1,0]]){let c=r+e,l=u+i;c<0||l<0||c>=t.length||l>=t[0].length||t[c][l]===`#`||s.has(a([c,l]))||(s.set(a([c,l]),[r,u]),o.push([c,l]),n.mark(c,l,`frontier`))}c.set({queued:o.length,explored:l})},`expand (${r}, ${u})`)}let u=[];for(let e=i;e;e=s.get(a(e)))u.unshift(e);e.say(`Reached G. Shortest path: ${u.length-1} steps; ${l} cells explored.`),n.pointer(`here`,null);for(let[e,t]of u)n.mark(e,t,`path`)}var Rt=n({default:()=>Bt,meta:()=>zt}),zt={title:`Quicksort (Lomuto partition)`,description:`Pick the last element as pivot, move smaller values left of it, then sort both sides.`,code:`function quicksort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi], a[i]];
  quicksort(a, lo, i - 1);
  quicksort(a, i + 1, hi);
}`};function Bt(e){let t=[38,27,43,3,9,82,10,64,51,17,70,25],n=e.array(`a`,t),r=e.vars(`state`,{lo:0,hi:t.length-1,pivot:null});function i(t,a){if(e.line(2),t>=a){t===a&&n.mark(t,`done`);return}r.set({lo:t,hi:a}),e.line(3);let o=n.get(a);r.set(`pivot`,o),e.say(`Partition a[${t}..${a}] around pivot ${o}.`),n.mark(a,`pivot`),e.line(4);let s=t;n.pointer(`i`,s);for(let r=t;r<a;r++)e.line(5),n.pointer(`j`,r),e.line(6),n.compare(r,a),n.get(r)<o&&(e.line(7),s!==r&&n.swap(s,r),e.line(8),s++,n.pointer(`i`,s));e.line(11),e.say(`Put the pivot ${o} in its final place, index ${s}.`),n.pointer(`j`,null),n.unmark(a),s!==a&&n.swap(s,a),n.mark(s,`done`),n.pointer(`i`,null),e.line(12),i(t,s-1),e.line(13),i(s+1,a)}i(0,t.length-1),e.say(`Sorted.`),n.mark([...Array(n.length).keys()],`done`)}var Vt=n({default:()=>Ut,meta:()=>Ht}),Ht={title:`Longest substring without repeating characters`,description:`A sliding window: grow on the right, shrink from the left whenever a character repeats.`,code:`function longestUnique(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`};function Ut(e){let t=`abcabcbbxyzab`,n=e.array(`s`,[...t],{style:`cells`}),r=e.vars(`window`,{left:0,right:0,best:0,bestWindow:``}),i=new Map,a=0,o=0;e.say(`Keep a window with no repeated characters.`),e.line(3),n.pointer(`L`,0);for(let s=0;s<13;s++){e.line(4),n.pointer(`R`,s);let c=t[s];e.line(6),i.has(c)&&i.get(c)>=a&&(e.say(`"${c}" is already in the window at ${i.get(c)}: move left past it.`),n.focus(i.get(c),`error`),a=i.get(c)+1,n.pointer(`L`,a)),e.line(7),i.set(c,s),e.line(8);let l=t.slice(a,s+1);s-a+1>o?(o=s-a+1,e.say(`New best: "${l}" (${o} characters).`),r.set({left:a,right:s,best:o,bestWindow:l})):r.set({left:a,right:s}),e.batch(()=>{n.unmark();for(let e=a;e<=s;e++)n.mark(e,`frontier`)},`window "${l}"`)}e.line(10),e.say(`Answer: ${o}.`),e.step()}var Wt=n({default:()=>Kt,meta:()=>Gt}),Gt={title:`Token bucket rate limiter`,description:`Each request spends a token; tokens refill at a steady rate. Bursts drain the bucket and get rejected.`,code:`class TokenBucket {
  constructor(capacity, refillPerSecond) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.rate = refillPerSecond;
    this.last = 0;
  }
  take(now) {
    const elapsed = now - this.last;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.rate);
    this.last = now;
    if (this.tokens < 1) return false;
    this.tokens -= 1;
    return true;
  }
}`};function Kt(e){let t=1.5,n=[0,.1,.2,.3,.4,.5,2,2.1,2.2,2.3,2.4,4.5],r=e.array(`tokens`,[,,,,].fill(`●`),{style:`cells`}),i=e.array(`requests`,n.map(e=>`${e.toFixed(1)}s`),{style:`cells`}),a=e.vars(`limiter`,{now:0,tokens:4,accepted:0,rejected:0}),o=4,s=0,c=0,l=0,u=()=>e.batch(()=>{for(let e=0;e<4;e++)r.set(e,e<Math.floor(o)?`●`:``);r.unmark();for(let e=0;e<Math.floor(o);e++)r.mark(e,`found`)},`${o.toFixed(2)} tokens`);e.say(`Capacity 4 tokens, refilling ${t} per second.`),u(),n.forEach((n,r)=>{i.pointer(`now`,r),e.line(9);let d=n-s;e.line(10);let f=o;o=Math.min(4,o+d*t),s=n,a.set({now:n,tokens:Math.round(o*100)/100}),o>f+.01&&(e.say(`${d.toFixed(1)}s since the last request: refill to ${o.toFixed(2)} tokens.`),u()),e.line(12),o<1?(l++,e.say(`Request at ${n.toFixed(1)}s: fewer than 1 token left (${o.toFixed(2)}). Rejected.`),i.mark(r,`error`),a.set({rejected:l})):(e.line(13),--o,c++,e.say(`Request at ${n.toFixed(1)}s: spend a token. Accepted.`),i.mark(r,`done`),a.set({tokens:Math.round(o*100)/100,accepted:c}),u())}),i.pointer(`now`,null),e.say(`${c} accepted, ${l} rejected. Bursts beyond 4 requests wait for refills.`),e.step()}var qt=n({default:()=>Yt,meta:()=>Jt}),Jt={title:`Topological sort (Kahn's algorithm)`,description:`Order build steps so every dependency comes first: repeatedly take a node with no remaining inputs.`,code:`function topoSort(graph) {
  const indegree = countIncoming(graph);
  const queue = graph.nodes.filter((n) => indegree[n] === 0);
  const order = [];
  while (queue.length) {
    const n = queue.shift();
    order.push(n);
    for (const m of graph.next(n)) {
      if (--indegree[m] === 0) queue.push(m);
    }
  }
  return order.length === graph.nodes.length ? order : null;
}`};function Yt(e){let t=[`types`,`utils`,`parser`,`lexer`,`checker`,`emitter`,`cli`,`tests`],n=[[`types`,`parser`],[`types`,`checker`],[`utils`,`lexer`],[`utils`,`emitter`],[`lexer`,`parser`],[`parser`,`checker`],[`checker`,`emitter`],[`emitter`,`cli`],[`parser`,`tests`],[`cli`,`tests`]],r=e.graph(`modules`,{nodes:t,edges:n,directed:!0,layout:`layered`}),i=e.array(`queue`,[],{style:`cells`}),a=e.array(`build order`,[],{style:`cells`});e.line(2);let o=Object.fromEntries(t.map(e=>[e,0]));for(let[,e]of n)o[e]++;e.batch(()=>{for(let e of t)r.badge(e,o[e])},`count incoming edges`),e.say(`Each badge is how many dependencies a module still waits for.`),e.line(3);for(let e of t)o[e]===0&&(i.push(e),r.mark(e,`frontier`));for(;i.length;){e.line(6);let t=i.shift();e.line(7),a.push(t),r.mark(t,`done`),e.say(`Build ${t}; its dependents each wait for one fewer module.`),e.line(8);for(let n of r.neighbors(t))r.focusEdge(t,n,`active`),e.line(9),o[n]--,r.badge(n,o[n]),o[n]===0&&(i.push(n),r.mark(n,`frontier`))}e.line(12),e.say(`A valid build order: ${a.values().join(` → `)}.`),a.mark([...Array(a.length).keys()],`done`)}var Xt=`export const meta = {
  title: 'Binary search',
  description: 'Halve the search range until the target is found or the range is empty.',
  code: \`function binarySearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}\`,
};

export default function (t) {
  const values = [2, 5, 8, 12, 16, 23, 38, 41, 56, 72, 91, 99];
  const target = 72;
  const a = t.array('a', values, { style: 'cells' });
  const v = t.vars('search', { target, lo: 0, hi: values.length - 1, mid: null });
  t.say(\`Find \${target} in a sorted array.\`);

  t.line(2);
  let lo = 0;
  let hi = values.length - 1;
  a.pointer('lo', lo);
  a.pointer('hi', hi);
  while (lo <= hi) {
    t.line(3);
    t.line(4);
    const mid = (lo + hi) >> 1;
    v.set('mid', mid);
    a.pointer('mid', mid);
    a.focus(mid, 'compare');
    t.line(5);
    if (a.get(mid) === target) {
      t.say(\`a[\${mid}] is \${target}. Found it after \${countSteps(values, target)} comparisons.\`);
      a.mark(mid, 'found');
      return;
    }
    t.line(6);
    if (a.get(mid) < target) {
      t.say(\`\${a.get(mid)} < \${target}: discard the left half.\`);
      a.mark(range(lo, mid), 'muted');
      lo = mid + 1;
      v.set('lo', lo);
      a.pointer('lo', lo);
    } else {
      t.line(7);
      t.say(\`\${a.get(mid)} > \${target}: discard the right half.\`);
      a.mark(range(mid, hi), 'muted');
      hi = mid - 1;
      v.set('hi', hi);
      a.pointer('hi', hi);
    }
  }
  t.line(9);
  t.step('Not found.');
}

function range(from, to) {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

function countSteps(values, target) {
  let lo = 0;
  let hi = values.length - 1;
  let n = 0;
  while (lo <= hi) {
    n++;
    const mid = (lo + hi) >> 1;
    if (values[mid] === target) return n;
    if (values[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return n;
}
`,Zt=`export const meta = {
  title: 'Binary search tree: insert and search',
  description: 'Each value goes left if smaller, right if larger. Searching follows the same path.',
  code: \`function insert(node, value) {
  if (!node) return { value };
  if (value < node.value) node.left = insert(node.left, value);
  else node.right = insert(node.right, value);
  return node;
}
function contains(node, value) {
  while (node) {
    if (value === node.value) return true;
    node = value < node.value ? node.left : node.right;
  }
  return false;
}\`,
};

export default function (t) {
  const tree = t.tree('bst');
  const values = [50, 30, 70, 20, 40, 60, 80, 35, 45, 65];
  let root = null;

  for (const value of values) {
    t.say(\`Insert \${value}.\`);
    t.line(1);
    if (!root) {
      t.line(2);
      root = tree.setRoot(value);
      continue;
    }
    let node = root;
    for (;;) {
      t.line(3);
      tree.focus(node, 'compare');
      const side = value < tree.value(node) ? 'left' : 'right';
      t.line(side === 'left' ? 3 : 4);
      const next = side === 'left' ? tree.left(node) : tree.right(node);
      if (!next) {
        t.line(2);
        tree.add(node, value, side);
        break;
      }
      node = next;
    }
  }

  const target = 65;
  t.say(\`Search for \${target}: one comparison per level.\`);
  let node = root;
  t.line(8);
  while (node) {
    t.line(9);
    tree.mark(node, 'visited');
    if (tree.value(node) === target) {
      t.say(\`Found \${target} after visiting \${countDepth(tree, root, target)} nodes.\`);
      tree.mark(node, 'found');
      return;
    }
    t.line(10);
    node = target < tree.value(node) ? tree.left(node) : tree.right(node);
  }
  t.line(12);
  t.step('Not found.');
}

function countDepth(tree, root, target) {
  let n = 0;
  for (
    let node = root;
    node;
    node = target < tree.value(node) ? tree.left(node) : tree.right(node)
  ) {
    n++;
    if (tree.value(node) === target) break;
  }
  return n;
}
`,Qt=`export const meta = {
  title: "Dijkstra's shortest paths",
  description: 'Repeatedly settle the closest unvisited node and relax its edges.',
  code: \`function dijkstra(graph, source) {
  const dist = { [source]: 0 }, prev = {};
  const done = new Set();
  while (done.size < graph.nodes.length) {
    const u = closestUnvisited(dist, done);
    if (u === undefined) break;
    done.add(u);
    for (const [v, w] of graph.edges(u)) {
      if (dist[u] + w < (dist[v] ?? Infinity)) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
    }
  }
  return dist;
}\`,
};

export default function (t) {
  const nodes = [
    { id: 'A', x: 0, y: 1 },
    { id: 'B', x: 1, y: 0 },
    { id: 'C', x: 1, y: 2 },
    { id: 'D', x: 2, y: 1 },
    { id: 'E', x: 3, y: 0 },
    { id: 'F', x: 3, y: 2 },
    { id: 'G', x: 4, y: 1 },
  ];
  const edges = [
    ['A', 'B', 4],
    ['A', 'C', 2],
    ['B', 'C', 5],
    ['B', 'D', 10],
    ['C', 'D', 3],
    ['B', 'E', 7],
    ['D', 'E', 4],
    ['D', 'F', 8],
    ['E', 'G', 6],
    ['F', 'G', 1],
    ['C', 'F', 12],
  ];
  const g = t.graph('graph', { nodes, edges });
  const source = 'A';
  const target = 'G';
  const dist = { [source]: 0 };
  const prev = {};
  const done = new Set();

  t.say(\`Shortest distance from \${source} to every node.\`);
  t.line(2);
  g.badge(source, 0);
  t.line(3);
  while (done.size < nodes.length) {
    t.line(4);
    t.line(5);
    let u;
    for (const n of nodes) {
      if (!done.has(n.id) && dist[n.id] !== undefined && (u === undefined || dist[n.id] < dist[u]))
        u = n.id;
    }
    if (u === undefined) break;
    t.line(7);
    t.say(\`\${u} is the closest unvisited node (\${dist[u]}). Settle it.\`);
    done.add(u);
    g.mark(u, 'active');
    for (const v of g.neighbors(u)) {
      if (done.has(v)) continue;
      t.line(8);
      const w = g.weight(u, v);
      g.focusEdge(u, v, 'compare');
      t.line(9);
      if (dist[u] + w < (dist[v] ?? Infinity)) {
        t.line(10);
        t.say(
          \`Via \${u}, \${v} costs \${dist[u]} + \${w} = \${dist[u] + w}\${dist[v] === undefined ? '' : \`, better than \${dist[v]}\`}.\`,
        );
        dist[v] = dist[u] + w;
        prev[v] = u;
        t.line(11);
        g.badge(v, dist[v]);
        g.mark(v, 'frontier');
      }
    }
    g.mark(u, 'done');
  }

  t.line(15);
  t.say(\`Shortest path to \${target}: \${pathTo(prev, target).join(' → ')} (\${dist[target]}).\`);
  const path = pathTo(prev, target);
  t.batch(() => {
    for (let i = 0; i < path.length - 1; i++) g.markEdge(path[i], path[i + 1], 'path');
    for (const n of path) g.mark(n, 'path');
  }, 'highlight the path');
}

function pathTo(prev, target) {
  const out = [target];
  while (prev[out[0]]) out.unshift(prev[out[0]]);
  return out;
}
`,$t=`export const meta = {
  title: "Conway's Game of Life",
  description:
    'A live cell survives with 2 or 3 live neighbours; a dead cell comes alive with exactly 3. Here, a glider.',
  code: \`function step(board) {
  return board.map((row, r) =>
    row.map((alive, c) => {
      const n = liveNeighbours(board, r, c);
      return n === 3 || (alive && n === 2);
    }),
  );
}\`,
};

export default function (t) {
  const rows = 14;
  const cols = 22;
  let board = Array.from({ length: rows }, () => Array(cols).fill(false));
  // A glider and a blinker.
  for (const [r, c] of [
    [1, 2],
    [2, 3],
    [3, 1],
    [3, 2],
    [3, 3],
    [8, 14],
    [8, 15],
    [8, 16],
  ]) {
    board[r][c] = true;
  }
  const grid = t.grid(
    'board',
    board.map((row) => row.map(() => '')),
  );
  const v = t.vars('life', { generation: 0, alive: count(board) });
  const paint = () =>
    t.batch(() => {
      grid.unmark();
      board.forEach((row, r) => row.forEach((alive, c) => alive && grid.mark(r, c, 'active')));
    }, 'draw generation');

  t.say('Generation 0: a glider (top left) and a blinker.');
  paint();
  for (let gen = 1; gen <= 24; gen++) {
    t.line(4);
    const next = board.map((row, r) =>
      row.map((alive, c) => {
        let n = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if ((dr || dc) && board[(r + dr + rows) % rows][(c + dc + cols) % cols]) n++;
          }
        }
        return n === 3 || (alive && n === 2);
      }),
    );
    board = next;
    t.line(5);
    t.say(
      gen % 4 === 0
        ? \`Generation \${gen}: the glider has moved one cell diagonally.\`
        : \`Generation \${gen}.\`,
    );
    v.set({ generation: gen, alive: count(board) });
    paint();
  }
}

function count(board) {
  return board.flat().filter(Boolean).length;
}
`,en=`export const meta = {
  title: 'Heapsort: the array is the tree',
  description:
    'A max-heap stored in an array: children of i live at 2i+1 and 2i+2. Watch both views change together.',
  code: \`function heapsort(a) {
  for (let i = (a.length >> 1) - 1; i >= 0; i--) siftDown(a, i, a.length);
  for (let end = a.length - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    siftDown(a, 0, end);
  }
}
function siftDown(a, i, n) {
  while (true) {
    const l = 2 * i + 1, r = l + 1;
    let big = i;
    if (l < n && a[l] > a[big]) big = l;
    if (r < n && a[r] > a[big]) big = r;
    if (big === i) return;
    [a[i], a[big]] = [a[big], a[i]];
    i = big;
  }
}\`,
};

export default function (t) {
  const values = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1];
  const a = t.array('array', values);
  const tree = t.tree('heap');
  const ids = [];

  // Mirror the heap part of the array (indexes < size) as a binary tree.
  const sync = (size, highlight = {}) => {
    t.batch(() => {
      ids.length = 0;
      if (size === 0) return;
      ids[0] = tree.setRoot(a.get(0));
      for (let i = 1; i < size; i++) {
        ids[i] = tree.add(ids[(i - 1) >> 1], a.get(i), i % 2 === 1 ? 'left' : 'right');
      }
      tree.unmark();
      for (const [i, tone] of Object.entries(highlight)) if (ids[i]) tree.mark(ids[i], tone);
    });
  };

  const siftDown = (i, n) => {
    for (;;) {
      t.line(10);
      const l = 2 * i + 1;
      const r = l + 1;
      let big = i;
      t.line(12);
      if (l < n) {
        a.compare(l, big);
        if (a.get(l) > a.get(big)) big = l;
      }
      t.line(13);
      if (r < n) {
        a.compare(r, big);
        if (a.get(r) > a.get(big)) big = r;
      }
      t.line(14);
      if (big === i) return;
      t.line(15);
      t.say(\`\${a.get(big)} is larger than its parent \${a.get(i)}: swap them.\`);
      a.swap(i, big);
      sync(n, { [i]: 'swap', [big]: 'swap' });
      t.line(16);
      i = big;
    }
  };

  t.say('Build a max-heap: sift down every parent, from the last one to the root.');
  sync(values.length);
  for (let i = (values.length >> 1) - 1; i >= 0; i--) {
    t.line(2);
    t.say(\`Sift down a[\${i}] = \${a.get(i)}.\`);
    sync(values.length, { [i]: 'active' });
    siftDown(i, values.length);
  }
  t.say('Max-heap built: the largest value is at the root.');
  sync(values.length, { 0: 'found' });

  for (let end = values.length - 1; end > 0; end--) {
    t.line(4);
    t.say(\`Move the max (\${a.get(0)}) to the end, shrink the heap, repair it.\`);
    a.swap(0, end);
    a.mark(end, 'done');
    sync(end, { 0: 'swap' });
    t.line(5);
    siftDown(0, end);
  }
  a.mark(0, 'done');
  sync(0);
  t.say('Sorted, in place, in O(n log n).');
  t.step();
}
`,tn=`export const meta = {
  title: 'Breadth-first search through a maze',
  description:
    'Explore the maze in rings of equal distance; the first time the exit is reached is the shortest path.',
  code: \`function bfs(grid, start, goal) {
  const queue = [start];
  const prev = new Map([[key(start), null]]);
  while (queue.length) {
    const cell = queue.shift();
    if (same(cell, goal)) return path(prev, goal);
    for (const next of neighbours(grid, cell)) {
      if (prev.has(key(next))) continue;
      prev.set(key(next), cell);
      queue.push(next);
    }
  }
  return null;
}\`,
};

const MAZE = [
  'S..#.......#....',
  '.#.#.#####.#.##.',
  '.#...#...#...#..',
  '.#####.#.#####.#',
  '...#...#.....#..',
  '##.#.#######.##.',
  '.....#.....#....',
  '.###.#.###.####.',
  '...#...#.......G',
];

export default function (t) {
  const cells = MAZE.map((row) => [...row].map((ch) => (ch === '#' ? '#' : ch === '.' ? '' : ch)));
  const grid = t.grid('maze', cells);
  const start = [0, 0];
  const goal = [MAZE.length - 1, MAZE[0].length - 1];
  const key = ([r, c]) => \`\${r},\${c}\`;
  const queue = [start];
  const prev = new Map([[key(start), null]]);
  const v = t.vars('bfs', { queued: 1, explored: 0 });

  t.say('Explore outward from S, one ring of equal distance at a time.');
  t.line(2);
  grid.mark(start[0], start[1], 'frontier');
  let explored = 0;
  while (queue.length) {
    t.line(5);
    const [r, c] = queue.shift();
    grid.pointer('here', r, c);
    if (r === goal[0] && c === goal[1]) {
      t.line(6);
      break;
    }
    explored++;
    grid.mark(r, c, 'visited');
    t.line(7);
    t.batch(() => {
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ]) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= cells.length || nc >= cells[0].length) continue;
        if (cells[nr][nc] === '#' || prev.has(key([nr, nc]))) continue;
        prev.set(key([nr, nc]), [r, c]);
        queue.push([nr, nc]);
        grid.mark(nr, nc, 'frontier');
      }
      v.set({ queued: queue.length, explored });
    }, \`expand (\${r}, \${c})\`);
  }

  const path = [];
  for (let cur = goal; cur; cur = prev.get(key(cur))) path.unshift(cur);
  t.say(\`Reached G. Shortest path: \${path.length - 1} steps; \${explored} cells explored.\`);
  grid.pointer('here', null);
  for (const [r, c] of path) grid.mark(r, c, 'path');
}
`,nn=`export const meta = {
  title: 'Quicksort (Lomuto partition)',
  description:
    'Pick the last element as pivot, move smaller values left of it, then sort both sides.',
  code: \`function quicksort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi], a[i]];
  quicksort(a, lo, i - 1);
  quicksort(a, i + 1, hi);
}\`,
};

export default function (t) {
  const input = [38, 27, 43, 3, 9, 82, 10, 64, 51, 17, 70, 25];
  const a = t.array('a', input);
  const v = t.vars('state', { lo: 0, hi: input.length - 1, pivot: null });

  function quicksort(lo, hi) {
    t.line(2);
    if (lo >= hi) {
      if (lo === hi) a.mark(lo, 'done');
      return;
    }
    v.set({ lo, hi });
    t.line(3);
    const pivot = a.get(hi);
    v.set('pivot', pivot);
    t.say(\`Partition a[\${lo}..\${hi}] around pivot \${pivot}.\`);
    a.mark(hi, 'pivot');
    t.line(4);
    let i = lo;
    a.pointer('i', i);
    for (let j = lo; j < hi; j++) {
      t.line(5);
      a.pointer('j', j);
      t.line(6);
      a.compare(j, hi);
      if (a.get(j) < pivot) {
        t.line(7);
        if (i !== j) a.swap(i, j);
        t.line(8);
        i++;
        a.pointer('i', i);
      }
    }
    t.line(11);
    t.say(\`Put the pivot \${pivot} in its final place, index \${i}.\`);
    a.pointer('j', null);
    a.unmark(hi);
    if (i !== hi) a.swap(i, hi);
    a.mark(i, 'done');
    a.pointer('i', null);
    t.line(12);
    quicksort(lo, i - 1);
    t.line(13);
    quicksort(i + 1, hi);
  }

  quicksort(0, input.length - 1);
  t.say('Sorted.');
  a.mark([...Array(a.length).keys()], 'done');
}
`,rn=`export const meta = {
  title: 'Longest substring without repeating characters',
  description:
    'A sliding window: grow on the right, shrink from the left whenever a character repeats.',
  code: \`function longestUnique(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}\`,
};

export default function (t) {
  const s = 'abcabcbbxyzab';
  const a = t.array('s', [...s], { style: 'cells' });
  const v = t.vars('window', { left: 0, right: 0, best: 0, bestWindow: '' });
  const last = new Map();
  let left = 0;
  let best = 0;

  t.say('Keep a window with no repeated characters.');
  t.line(3);
  a.pointer('L', 0);
  for (let right = 0; right < s.length; right++) {
    t.line(4);
    a.pointer('R', right);
    const ch = s[right];
    t.line(6);
    if (last.has(ch) && last.get(ch) >= left) {
      t.say(\`"\${ch}" is already in the window at \${last.get(ch)}: move left past it.\`);
      a.focus(last.get(ch), 'error');
      left = last.get(ch) + 1;
      a.pointer('L', left);
    }
    t.line(7);
    last.set(ch, right);
    t.line(8);
    const window = s.slice(left, right + 1);
    if (right - left + 1 > best) {
      best = right - left + 1;
      t.say(\`New best: "\${window}" (\${best} characters).\`);
      v.set({ left, right, best, bestWindow: window });
    } else {
      v.set({ left, right });
    }
    t.batch(() => {
      a.unmark();
      for (let i = left; i <= right; i++) a.mark(i, 'frontier');
    }, \`window "\${window}"\`);
  }
  t.line(10);
  t.say(\`Answer: \${best}.\`);
  t.step();
}
`,an=`export const meta = {
  title: 'Token bucket rate limiter',
  description:
    'Each request spends a token; tokens refill at a steady rate. Bursts drain the bucket and get rejected.',
  code: \`class TokenBucket {
  constructor(capacity, refillPerSecond) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.rate = refillPerSecond;
    this.last = 0;
  }
  take(now) {
    const elapsed = now - this.last;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.rate);
    this.last = now;
    if (this.tokens < 1) return false;
    this.tokens -= 1;
    return true;
  }
}\`,
};

export default function (t) {
  const capacity = 4;
  const rate = 1.5; // tokens per second
  // Request arrival times in seconds: a burst, a pause, another burst.
  const arrivals = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 2.0, 2.1, 2.2, 2.3, 2.4, 4.5];

  const bucket = t.array('tokens', Array(capacity).fill('●'), { style: 'cells' });
  const log = t.array(
    'requests',
    arrivals.map((s) => \`\${s.toFixed(1)}s\`),
    { style: 'cells' },
  );
  const v = t.vars('limiter', { now: 0, tokens: capacity, accepted: 0, rejected: 0 });

  let tokens = capacity;
  let last = 0;
  let accepted = 0;
  let rejected = 0;
  const show = () =>
    t.batch(
      () => {
        for (let i = 0; i < capacity; i++) {
          bucket.set(i, i < Math.floor(tokens) ? '●' : '');
        }
        bucket.unmark();
        for (let i = 0; i < Math.floor(tokens); i++) bucket.mark(i, 'found');
      },
      \`\${tokens.toFixed(2)} tokens\`,
    );

  t.say(\`Capacity \${capacity} tokens, refilling \${rate} per second.\`);
  show();
  arrivals.forEach((now, i) => {
    log.pointer('now', i);
    t.line(9);
    const elapsed = now - last;
    t.line(10);
    const before = tokens;
    tokens = Math.min(capacity, tokens + elapsed * rate);
    last = now;
    v.set({ now, tokens: Math.round(tokens * 100) / 100 });
    if (tokens > before + 0.01) {
      t.say(
        \`\${elapsed.toFixed(1)}s since the last request: refill to \${tokens.toFixed(2)} tokens.\`,
      );
      show();
    }
    t.line(12);
    if (tokens < 1) {
      rejected++;
      t.say(
        \`Request at \${now.toFixed(1)}s: fewer than 1 token left (\${tokens.toFixed(2)}). Rejected.\`,
      );
      log.mark(i, 'error');
      v.set({ rejected });
      return;
    }
    t.line(13);
    tokens -= 1;
    accepted++;
    t.say(\`Request at \${now.toFixed(1)}s: spend a token. Accepted.\`);
    log.mark(i, 'done');
    v.set({ tokens: Math.round(tokens * 100) / 100, accepted });
    show();
  });
  log.pointer('now', null);
  t.say(
    \`\${accepted} accepted, \${rejected} rejected. Bursts beyond \${capacity} requests wait for refills.\`,
  );
  t.step();
}
`,on=`export const meta = {
  title: "Topological sort (Kahn's algorithm)",
  description:
    'Order build steps so every dependency comes first: repeatedly take a node with no remaining inputs.',
  code: \`function topoSort(graph) {
  const indegree = countIncoming(graph);
  const queue = graph.nodes.filter((n) => indegree[n] === 0);
  const order = [];
  while (queue.length) {
    const n = queue.shift();
    order.push(n);
    for (const m of graph.next(n)) {
      if (--indegree[m] === 0) queue.push(m);
    }
  }
  return order.length === graph.nodes.length ? order : null;
}\`,
};

export default function (t) {
  const nodes = ['types', 'utils', 'parser', 'lexer', 'checker', 'emitter', 'cli', 'tests'];
  const edges = [
    ['types', 'parser'],
    ['types', 'checker'],
    ['utils', 'lexer'],
    ['utils', 'emitter'],
    ['lexer', 'parser'],
    ['parser', 'checker'],
    ['checker', 'emitter'],
    ['emitter', 'cli'],
    ['parser', 'tests'],
    ['cli', 'tests'],
  ];
  const g = t.graph('modules', { nodes, edges, directed: true, layout: 'layered' });
  const queue = t.array('queue', [], { style: 'cells' });
  const order = t.array('build order', [], { style: 'cells' });

  t.line(2);
  const indegree = Object.fromEntries(nodes.map((n) => [n, 0]));
  for (const [, to] of edges) indegree[to]++;
  t.batch(() => {
    for (const n of nodes) g.badge(n, indegree[n]);
  }, 'count incoming edges');
  t.say('Each badge is how many dependencies a module still waits for.');

  t.line(3);
  for (const n of nodes) {
    if (indegree[n] === 0) {
      queue.push(n);
      g.mark(n, 'frontier');
    }
  }
  while (queue.length) {
    t.line(6);
    const n = queue.shift();
    t.line(7);
    order.push(n);
    g.mark(n, 'done');
    t.say(\`Build \${n}; its dependents each wait for one fewer module.\`);
    t.line(8);
    for (const m of g.neighbors(n)) {
      g.focusEdge(n, m, 'active');
      t.line(9);
      indegree[m]--;
      g.badge(m, indegree[m]);
      if (indegree[m] === 0) {
        queue.push(m);
        g.mark(m, 'frontier');
      }
    }
  }
  t.line(12);
  t.say(\`A valid build order: \${order.values().join(' → ')}.\`);
  order.mark([...Array(order.length).keys()], 'done');
}
`,sn=[`active`,`compare`,`swap`,`done`,`visited`,`frontier`,`path`,`found`,`muted`,`error`,`pivot`],cn=5e3,Z=class extends Error{constructor(e){super(e),this.name=`TraceError`}},ln=e=>JSON.parse(JSON.stringify(e)),un=class{structs=[];frames=[];caption=``;currentLine;paused=0;say(e){this.caption=String(e)}line(e){this.currentLine=e}step(e){e!==void 0&&(this.caption=String(e)),this.record(``)}batch(e,t=``){this.paused++;try{e()}finally{this.paused--}this.record(t)}array(e,t,n={}){let r=t.every(e=>typeof e==`number`),i={kind:`array`,name:e,style:n.style??(r&&t.length>1?`bars`:`cells`),items:t.map((t,n)=>({key:`${e}#${n}`,value:t})),marks:{},pointers:[]},a=new dn(this,i);return this.register(i,()=>a.clearTransient()),this.record(`create ${e}`),a}grid(e,t){let n={kind:`grid`,name:e,cells:ln(t),marks:{},pointers:[]},r=new fn(this,n);return this.register(n,()=>r.clearTransient()),this.record(`create ${e}`),r}graph(e,t){let n=t.nodes.map(e=>typeof e==`string`?{id:e,label:e}:{id:e.id,label:e.label??e.id,x:e.x,y:e.y}),r=new Set(n.map(e=>e.id)),i=(t.edges??[]).map(t=>{let n=Array.isArray(t)?{from:t[0],to:t[1],weight:t[2]}:t;if(!r.has(n.from)||!r.has(n.to))throw new Z(`Edge ${n.from} → ${n.to} refers to a node that is not in ${e}.`);return n.weight===void 0?{from:n.from,to:n.to}:n}),a=n.every(e=>typeof e.x==`number`&&typeof e.y==`number`),o={kind:`graph`,name:e,directed:t.directed??!1,layout:t.layout??(a?`manual`:n.length<=10?`circle`:`force`),nodes:n,edges:i,nodeMarks:{},edgeMarks:{},nodeBadges:{}},s=new mn(this,o);return this.register(o,()=>s.clearTransient()),this.record(`create ${e}`),s}tree(e,t={}){let n={kind:`tree`,name:e,binary:t.binary??!0,root:null,nodes:{},marks:{}},r=new hn(this,n);return this.register(n,()=>r.clearTransient()),this.record(`create ${e}`),r}vars(e,t={}){let n={kind:`vars`,name:e,values:{...t},changed:[]},r=new gn(this,n);return this.register(n,()=>{n.changed=[]}),this.record(`create ${e}`),r}record(e){if(!(this.paused>0)){if(this.frames.length>=5e3)throw new Z(`More than ${cn} frames. Trace a smaller input, or group changes with t.batch().`);this.frames.push({structs:this.structs.map(e=>ln(e.state)),caption:this.caption,event:e,...this.currentLine===void 0?{}:{line:this.currentLine}});for(let e of this.structs)e.transient()}}register(e,t){if(this.structs.some(t=>t.state.name===e.name))throw new Z(`A structure named "${e.name}" already exists.`);this.structs.push({state:e,transient:t})}result(e){let t=this.frames[this.frames.length-1];return t&&(t.caption!==this.caption||t.line!==this.currentLine)&&this.record(``),{version:1,meta:{...e},frames:this.frames}}};function Q(e){if(!sn.includes(e))throw new Z(`Unknown tone "${e}". Use one of: ${sn.join(`, `)}.`);return e}function $(e){return typeof e==`string`?JSON.stringify(e):String(e)}var dn=class{t;state;transient=[];nextKey;constructor(e,t){this.t=e,this.state=t,this.nextKey=t.items.length}get length(){return this.state.items.length}values(){return this.state.items.map(e=>e.value)}get(e){return this.item(e).value}set(e,t){this.item(e).value=t,this.flash(e,`active`),this.t.record(`${this.state.name}[${e}] = ${$(t)}`)}swap(e,t){let n=this.item(e),r=this.item(t);this.state.items[e]=r,this.state.items[t]=n,this.flash(e,`swap`),this.flash(t,`swap`),this.t.record(`swap ${this.state.name}[${e}] and ${this.state.name}[${t}]`)}compare(e,t){this.item(e),this.item(t),this.flash(e,`compare`),this.flash(t,`compare`),this.t.record(`compare ${this.state.name}[${e}] and ${this.state.name}[${t}]`)}focus(e,t=`active`){this.item(e),this.flash(e,Q(t)),this.t.record(`look at ${this.state.name}[${e}]`)}mark(e,t=`active`){let n=Array.isArray(e)?e:[e];for(let e of n)this.item(e),this.state.marks[e]=Q(t);this.t.record(`mark ${this.state.name}[${n.join(`, `)}] ${t}`)}unmark(e){if(e===void 0)this.state.marks={};else for(let t of Array.isArray(e)?e:[e])delete this.state.marks[t];this.t.record(``)}pointer(e,t){if(this.state.pointers=this.state.pointers.filter(t=>t.name!==e),t!==null){if(t<0||t>this.state.items.length)throw new Z(`Pointer ${e}=${t} is outside ${this.state.name} (length ${this.length}).`);this.state.pointers.push({name:e,index:t})}this.t.record(t===null?``:`${e} = ${t}`)}push(e){this.state.items.push({key:`${this.state.name}#${this.nextKey++}`,value:e}),this.flash(this.state.items.length-1,`active`),this.t.record(`push ${$(e)}`)}pop(){let e=this.state.items.pop();if(!e)throw new Z(`pop() on empty ${this.state.name}.`);return this.t.record(`pop ${$(e.value)}`),e.value}unshift(e){this.state.items.unshift({key:`${this.state.name}#${this.nextKey++}`,value:e}),this.shiftMarks(1),this.flash(0,`active`),this.t.record(`unshift ${$(e)}`)}shift(){let e=this.state.items.shift();if(!e)throw new Z(`shift() on empty ${this.state.name}.`);return this.shiftMarks(-1),this.t.record(`shift ${$(e.value)}`),e.value}shiftMarks(e){let t={};for(let[n,r]of Object.entries(this.state.marks)){let i=Number(n)+e;i>=0&&(t[i]=r)}this.state.marks=t}item(e){let t=this.state.items[e];if(!t)throw new Z(`Index ${e} is outside ${this.state.name} (length ${this.state.items.length}).`);return t}saved={};flash(e,t){e in this.saved||(this.saved[e]=this.state.marks[e]),this.state.marks[e]=t,this.transient.push(e)}clearTransient(){for(let e of this.transient){let t=this.saved[e];t===void 0?delete this.state.marks[e]:this.state.marks[e]=t}this.transient=[],this.saved={}}},fn=class{t;state;transient=[];saved={};constructor(e,t){this.t=e,this.state=t}get rows(){return this.state.cells.length}get cols(){return this.state.cells[0]?.length??0}get(e,t){return this.check(e,t),this.state.cells[e][t]}set(e,t,n){this.check(e,t),this.state.cells[e][t]=n,this.flash(e,t,`active`),this.t.record(`${this.state.name}[${e}][${t}] = ${$(n)}`)}mark(e,t,n=`active`){this.check(e,t),this.state.marks[`${e},${t}`]=Q(n),this.t.record(`mark (${e}, ${t}) ${n}`)}unmark(e,t){e===void 0||t===void 0?this.state.marks={}:delete this.state.marks[`${e},${t}`],this.t.record(``)}focus(e,t,n=`active`){this.check(e,t),this.flash(e,t,Q(n)),this.t.record(`look at (${e}, ${t})`)}pointer(e,t,n){this.state.pointers=this.state.pointers.filter(t=>t.name!==e),t!==null&&n!==void 0&&(this.check(t,n),this.state.pointers.push({name:e,row:t,col:n})),this.t.record(t===null?``:`${e} at (${t}, ${n})`)}check(e,t){if(e<0||e>=this.rows||t<0||t>=this.cols)throw new Z(`Cell (${e}, ${t}) is outside ${this.state.name} (${this.rows}×${this.cols}).`)}flash(e,t,n){let r=`${e},${t}`;r in this.saved||(this.saved[r]=this.state.marks[r]),this.state.marks[r]=n,this.transient.push(r)}clearTransient(){for(let e of this.transient){let t=this.saved[e];t===void 0?delete this.state.marks[e]:this.state.marks[e]=t}this.transient=[],this.saved={}}},pn=(e,t)=>`${e}->${t}`,mn=class{t;state;transient=[];constructor(e,t){this.t=e,this.state=t}neighbors(e){this.node(e);let t=[];for(let n of this.state.edges)n.from===e?t.push(n.to):!this.state.directed&&n.to===e&&t.push(n.from);return t}weight(e,t){return this.edge(e,t).weight}mark(e,t=`active`){this.node(e),this.state.nodeMarks[e]=Q(t),this.t.record(`${e}: ${t}`)}unmark(e){e===void 0?this.state.nodeMarks={}:delete this.state.nodeMarks[e],this.t.record(``)}focus(e,t=`active`){this.node(e),this.transient.push({kind:`node`,key:e,prev:this.state.nodeMarks[e]}),this.state.nodeMarks[e]=Q(t),this.t.record(`look at ${e}`)}markEdge(e,t,n=`active`){let r=this.edge(e,t);this.state.edgeMarks[pn(r.from,r.to)]=Q(n),this.t.record(`edge ${e}–${t}: ${n}`)}focusEdge(e,t,n=`active`){let r=this.edge(e,t),i=pn(r.from,r.to);this.transient.push({kind:`edge`,key:i,prev:this.state.edgeMarks[i]}),this.state.edgeMarks[i]=Q(n),this.t.record(`follow ${e} → ${t}`)}badge(e,t){this.node(e),t===null?delete this.state.nodeBadges[e]:this.state.nodeBadges[e]=t,this.t.record(t===null?``:`${e} = ${$(t)}`)}node(e){let t=this.state.nodes.find(t=>t.id===e);if(!t)throw new Z(`No node "${e}" in ${this.state.name}.`);return t}edge(e,t){let n=this.state.edges.find(n=>n.from===e&&n.to===t||!this.state.directed&&n.from===t&&n.to===e);if(!n)throw new Z(`No edge ${e} → ${t} in ${this.state.name}.`);return n}clearTransient(){for(let e of this.transient.reverse()){let t=e.kind===`node`?this.state.nodeMarks:this.state.edgeMarks;e.prev===void 0?delete t[e.key]:t[e.key]=e.prev}this.transient=[]}},hn=class{t;state;counter=0;transient=[];constructor(e,t){this.t=e,this.state=t}get root(){return this.state.root}value(e){return this.node(e).value}children(e){return[...this.node(e).children]}left(e){return this.node(e).children[0]??null}right(e){return this.node(e).children[1]??null}parent(e){for(let t of Object.values(this.state.nodes))if(t.children.includes(e))return t.id;return null}setRoot(e){let t=this.newId();return this.state.nodes={[t]:{id:t,value:e,children:this.state.binary?[null,null]:[]}},this.state.root=t,this.t.record(`root ${$(e)}`),t}add(e,t,n){let r=this.node(e),i=this.state.binary?n===`right`?1:n===`left`?0:-2:-1;if(i===-2)throw new Z(`Binary trees need a side: add(parent, value, "left" | "right").`);if(i>=0&&r.children[i])throw new Z(`Node ${$(r.value)} already has a ${n} child.`);let a=this.newId();return this.state.nodes[a]={id:a,value:t,children:this.state.binary?[null,null]:[]},i>=0?r.children[i]=a:r.children.push(a),this.transient.push({id:a,prev:this.state.marks[a]}),this.state.marks[a]=`active`,this.t.record(`add ${$(t)} under ${$(r.value)}`),a}setValue(e,t){this.node(e).value=t,this.transient.push({id:e,prev:this.state.marks[e]}),this.state.marks[e]=`active`,this.t.record(`set ${$(t)}`)}remove(e){let t=this.parent(e),n=e=>{let t=this.state.nodes[e];if(t){for(let e of t.children)e&&n(e);delete this.state.nodes[e],delete this.state.marks[e]}};if(t){let n=this.node(t);n.children=n.children.map(t=>t===e?null:t),this.state.binary||(n.children=n.children.filter(e=>e!==null))}else this.state.root===e&&(this.state.root=null);n(e),this.t.record(`remove`)}attach(e,t,n){this.node(e);let r=this.parent(e);if(r){let t=this.node(r);t.children=t.children.map(t=>t===e?null:t),this.state.binary||(t.children=t.children.filter(e=>e!==null))}if(t===null)this.state.root=e;else{let r=this.node(t);if(this.state.binary){let t=+(n===`right`);r.children[t]=e}else r.children.push(e)}this.t.record(`move subtree`)}detach(e,t){let n=this.node(e),r=+(t===`right`),i=n.children[r]??null;return n.children[r]=null,this.t.record(``),i}mark(e,t=`active`){this.node(e),this.state.marks[e]=Q(t),this.t.record(`${$(this.node(e).value)}: ${t}`)}unmark(e){e===void 0?this.state.marks={}:delete this.state.marks[e],this.t.record(``)}focus(e,t=`active`){this.node(e),this.transient.push({id:e,prev:this.state.marks[e]}),this.state.marks[e]=Q(t),this.t.record(`visit ${$(this.node(e).value)}`)}newId(){return`${this.state.name}:${this.counter++}`}node(e){let t=this.state.nodes[e];if(!t)throw new Z(`No node "${e}" in ${this.state.name}.`);return t}clearTransient(){for(let e of this.transient.reverse())this.state.nodes[e.id]&&(e.prev===void 0?delete this.state.marks[e.id]:this.state.marks[e.id]=e.prev);this.transient=[]}},gn=class{t;state;constructor(e,t){this.t=e,this.state=t}get(e){return this.state.values[e]??null}set(e,t){let n=typeof e==`string`?{[e]:t??null}:e;Object.assign(this.state.values,n),this.state.changed=Object.keys(n),this.t.record(Object.entries(n).map(([e,t])=>`${e} = ${$(t)}`).join(`, `))}};function _n(e,t={}){let n=new un;e(n);let r=n.result(t);if(r.frames.length===0)throw new Z(`The trace recorded no frames.`);return r}function vn(e){if(typeof e.default!=`function`)throw new Z("The default export must be a function that receives `t`.");return{meta:e.meta&&typeof e.meta==`object`?e.meta:{},fn:e.default}}var yn=Object.assign({"../../examples/binary-search.trace.js":mt,"../../examples/bst.trace.js":yt,"../../examples/dijkstra.trace.js":Ct,"../../examples/game-of-life.trace.js":Dt,"../../examples/heapsort.trace.js":jt,"../../examples/maze-bfs.trace.js":Pt,"../../examples/quicksort.trace.js":Rt,"../../examples/sliding-window.trace.js":Vt,"../../examples/token-bucket.trace.js":Wt,"../../examples/topological-sort.trace.js":qt}),bn=Object.assign({"../../examples/binary-search.trace.js":Xt,"../../examples/bst.trace.js":Zt,"../../examples/dijkstra.trace.js":Qt,"../../examples/game-of-life.trace.js":$t,"../../examples/heapsort.trace.js":en,"../../examples/maze-bfs.trace.js":tn,"../../examples/quicksort.trace.js":nn,"../../examples/sliding-window.trace.js":rn,"../../examples/token-bucket.trace.js":an,"../../examples/topological-sort.trace.js":on}),xn=[`quicksort`,`token-bucket`,`maze-bfs`,`heapsort`,`dijkstra`,`game-of-life`,`binary-search`,`bst`,`topological-sort`,`sliding-window`],Sn=Object.entries(yn).map(([e,t])=>{let n=e.split(`/`).pop().replace(`.trace.js`,``),r=vn(t),i;return{id:n,title:r.meta.title??n,description:r.meta.description??``,source:bn[e]??``,trace:()=>i??=_n(r.fn,r.meta)}}).sort((e,t)=>Cn(e.id)-Cn(t.id)||e.id.localeCompare(t.id));function Cn(e){let t=xn.indexOf(e);return t===-1?xn.length:t}function wn(e){return Sn.find(t=>t.id===e)}function Tn({id:e}){let t=wn(e);return t?X(`div`,{class:`wrap`,children:[X(`div`,{class:`page-head`,children:[X(`div`,{children:[X(`p`,{class:`crumb`,children:[X(`a`,{href:`#/`,children:`Gallery`}),` / `,t.id]}),X(`h1`,{children:t.title})]}),X(`div`,{class:`cta`,children:[X(`a`,{class:`btn small`,href:`#/play?example=${t.id}`,children:`Edit in playground`}),X(`a`,{class:`btn small`,href:`${Rn}/blob/main/examples/${t.id}.trace.js`,children:`Source on GitHub`})]})]}),X(ft,{trace:t.trace(),autoplay:!1}),X(`details`,{class:`source`,children:[X(`summary`,{children:[`The trace file (`,t.id,`.trace.js)`]}),X(`pre`,{children:X(`code`,{children:t.source})})]})]}):X(`div`,{class:`wrap page-head`,children:X(`div`,{children:[X(`h1`,{children:`Example not found`}),X(`p`,{children:X(`a`,{href:`#/`,children:`Back to the gallery`})})]})})}function En({trace:e,at:t=.6}){let n=G(null);return W(()=>{let r=n.current;if(!r)return;let i=window.matchMedia?.(`(prefers-color-scheme: dark)`).matches?We:Ue,a=e.frames[Math.floor((e.frames.length-1)*t)],o=Je(a,i,new Map),s=r.clientWidth||320,c=10/16*s,l=window.devicePixelRatio||1;r.width=Math.round(s*l),r.height=Math.round(c*l);let u=r.getContext(`2d`);if(!u)return;let d=Math.min(s/o.width,c/o.height);u.fillStyle=i.bg,u.fillRect(0,0,r.width,r.height),Le(u,o,d*l,i.bg,(s-o.width*d)/2*l,(c-o.height*d)/2*l)},[e,t]),X(`canvas`,{ref:n,"aria-hidden":`true`})}var Dn=`npx skills add feresbr1/traceplay`,On=`export default function (t) {
  const a = t.array('a', [5, 2, 8, 1]);
  for (let i = 1; i < a.length; i++)
    for (let j = i; j > 0; j--) {
      a.compare(j - 1, j);
      if (a.get(j - 1) <= a.get(j)) break;
      a.swap(j - 1, j);
    }
}`;function kn(){let e=wn(`quicksort`)??Sn[0],[t,n]=U(!1);return X(T,{children:[X(`section`,{class:`hero wrap`,children:[X(`div`,{children:[X(`h1`,{children:[`Watch any code `,X(`em`,{children:`run.`})]}),X(`p`,{class:`lede`,children:`traceplay turns algorithms and functions into interactive, step-by-step animations. Every frame comes from actually running the code. Ask your AI agent to animate anything, or write a trace in a few lines.`}),X(`div`,{class:`cta`,children:[X(`a`,{class:`btn primary`,href:`#/play`,children:`Open the playground`}),X(`a`,{class:`btn`,href:`#gallery`,children:`See the gallery`})]}),X(`div`,{class:`cmd`,"aria-label":`Install the agent skill`,children:[X(`span`,{class:`p`,children:`$`}),X(`code`,{children:Dn}),X(`button`,{type:`button`,class:`btn small`,onClick:()=>{navigator.clipboard?.writeText(Dn).then(()=>n(!0)),setTimeout(()=>n(!1),1500)},children:t?`Copied`:`Copy`})]})]}),X(`div`,{"data-testid":`hero-player`,children:X(ft,{trace:e.trace(),autoplay:!0,loop:!0,compact:!0,exportable:!1})})]}),X(`section`,{class:`block wrap`,"aria-labelledby":`how`,children:[X(`h2`,{id:`how`,children:`Real executions, not drawings`}),X(`p`,{class:`sub`,children:`A trace is your algorithm, run for real, with a few calls that say what to show. The player turns the recorded steps into smooth, scrubbable motion you can share as a link, a GIF, or a single HTML file.`}),X(`div`,{class:`steps`,children:[X(`div`,{class:`step`,children:[X(`span`,{class:`num`,children:`01 · trace`}),X(`h3`,{children:`Instrument the real code`}),X(`p`,{children:`Track arrays, grids, graphs, trees and variables. Each change becomes a step.`}),X(`pre`,{children:X(`code`,{children:On})})]}),X(`div`,{class:`step`,children:[X(`span`,{class:`num`,children:`02 · render`}),X(`h3`,{children:`Get an interactive player`}),X(`p`,{children:`Play, pause, scrub, step with the arrow keys, follow the highlighted code line.`}),X(`pre`,{children:X(`code`,{children:`npx github:feresbr1/traceplay \\
  render insertion.trace.js

✔ 23 steps → insertion.html`})})]}),X(`div`,{class:`step`,children:[X(`span`,{class:`num`,children:`03 · share`}),X(`h3`,{children:`Link, GIF or one HTML file`}),X(`p`,{children:`Embed it in docs, a PR description, a blog post or a lesson. No server, no account.`}),X(`pre`,{children:X(`code`,{children:`<iframe src="insertion.html"
        width="100%" height="560">
</iframe>`})})]})]})]}),X(`section`,{class:`block wrap`,"aria-labelledby":`agents`,children:X(`div`,{class:`agent`,children:[X(`div`,{children:[X(`h2`,{id:`agents`,children:`Your agent can animate anything`}),X(`p`,{class:`sub`,style:{marginBottom:`16px`},children:`Install the skill and ask Claude Code, Codex, Cursor or another agent to explain code by animating it. It writes the trace from the real implementation, runs it, checks the result and hands you the player.`}),X(`div`,{class:`cmd`,style:{marginTop:0},children:[X(`span`,{class:`p`,children:`$`}),X(`code`,{children:Dn})]})]}),X(`div`,{class:`chat`,"aria-label":`Example prompts`,children:[X(`div`,{class:`bubble you`,children:`/traceplay animate how our rate limiter decides to reject a request`}),X(`div`,{class:`bubble agent-b`,children:[`The skill tells the agent to copy the real implementation into a trace, run it on a meaningful input with `,X(`code`,{children:`traceplay check`}),`, and render the player with`,` `,X(`code`,{children:`traceplay render`}),`.`]}),X(`div`,{class:`bubble you`,children:`/traceplay show how the LRU cache in src/cache.ts evicts entries`})]})]})}),X(`section`,{class:`block wrap`,id:`gallery`,"aria-labelledby":`gallery-title`,children:[X(`h2`,{id:`gallery-title`,children:`Gallery`}),X(`p`,{class:`sub`,children:`Each of these is a trace file in the repository, run in your browser right now.`}),X(`div`,{class:`gallery`,children:Sn.map(e=>X(`a`,{class:`card`,href:`#/example/${e.id}`,"data-testid":`gallery-card`,children:[X(En,{trace:e.trace()}),X(`div`,{children:[X(`h3`,{children:e.title}),X(`p`,{children:e.description})]})]},e.id))})]})]})}var An=4e3;function jn(e){return new Promise(t=>{let n=new Worker(new URL(`/traceplay/assets/runner.worker-zEVMULt9.js`,``+import.meta.url),{type:`module`}),r=setTimeout(()=>{n.terminate(),t({ok:!1,error:`Stopped after ${An/1e3} seconds. Is there an infinite loop?`})},An);n.onmessage=e=>{clearTimeout(r),n.terminate(),t(e.data)},n.onerror=e=>{clearTimeout(r),n.terminate(),t({ok:!1,error:e.message||`The code could not be run.`})},n.postMessage({code:e})})}async function Mn(e){let t=new Blob([e]).stream().pipeThrough(new CompressionStream(`deflate-raw`)),n=new Uint8Array(await new Response(t).arrayBuffer()),r=``;for(let e of n)r+=String.fromCharCode(e);return btoa(r).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}async function Nn(e){let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=atob(t+`=`.repeat((4-t.length%4)%4)),r=Uint8Array.from(n,e=>e.charCodeAt(0)),i=new Blob([r]).stream().pipeThrough(new DecompressionStream(`deflate-raw`));return new Response(i).text()}var Pn=[{title:`Narration and code`,code:`t.say('Partition around 7')   // caption until the next say()
t.line(5)                     // highlight line 5 of meta.code
t.step('Done')                // record a frame explicitly
t.batch(() => { ... }, 'why') // many changes, one frame`},{title:`Arrays (bars for numbers, cells for text)`,code:`const a = t.array('a', [5, 2, 8], { style: 'bars' })
a.get(i)  a.length  a.values()
a.compare(i, j)   a.swap(i, j)   a.set(i, v)
a.focus(i, tone)  a.mark(i | [i...], tone)  a.unmark(i?)
a.pointer('lo', i)   a.pointer('lo', null)
a.push(v) a.pop() a.shift() a.unshift(v)   // stacks, queues`},{title:`Grids`,code:`const g = t.grid('maze', rows)   // '#' draws a wall
g.get(r, c)  g.set(r, c, v)  g.rows  g.cols
g.mark(r, c, tone)  g.focus(r, c)  g.unmark()
g.pointer('me', r, c)`},{title:`Graphs`,code:`const g = t.graph('g', {
  nodes: ['A', 'B', { id: 'C', x: 2, y: 0 }],
  edges: [['A', 'B', 4], ['B', 'C']],
  directed: false, layout: 'circle' | 'force' | 'layered' | 'manual',
})
g.neighbors('A')  g.weight('A', 'B')
g.mark('A', tone)  g.focus('A')  g.badge('A', 7)
g.markEdge('A', 'B', tone)  g.focusEdge('A', 'B')`},{title:`Trees`,code:`const tr = t.tree('bst')            // { binary: false } for n-ary
const root = tr.setRoot(50)
const l = tr.add(root, 30, 'left')
tr.value(id) tr.left(id) tr.right(id) tr.parent(id)
tr.setValue(id, v)  tr.remove(id)
tr.attach(id, newParent, side)   // rotations
tr.mark(id, tone)  tr.focus(id)`},{title:`Variables and tones`,code:`const v = t.vars('state', { lo: 0, hi: 9 })
v.set('lo', 3)   v.set({ lo: 3, hi: 7 })

tones: active compare swap done visited frontier
       path found muted error pivot`}];function Fn(){return X(`section`,{"aria-labelledby":`ref-title`,children:[X(`h2`,{id:`ref-title`,style:{fontSize:`22px`,letterSpacing:`-0.02em`,margin:`8px 0 12px`},children:`API reference`}),X(`div`,{class:`ref`,children:Pn.map(e=>X(`div`,{children:[X(`h3`,{children:e.title}),X(`pre`,{children:e.code})]},e.title))})]})}var In=`export const meta = {
  title: 'Insertion sort',
  code: \`function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    for (let j = i; j > 0 && a[j - 1] > a[j]; j--) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
    }
  }
}\`,
};

export default function (t) {
  const a = t.array('a', [7, 3, 9, 1, 5, 8, 2]);
  for (let i = 1; i < a.length; i++) {
    t.line(2);
    t.say(\`Insert a[\${i}] = \${a.get(i)} into the sorted part on its left.\`);
    for (let j = i; j > 0; j--) {
      t.line(3);
      a.compare(j - 1, j);
      if (a.get(j - 1) <= a.get(j)) break;
      t.line(4);
      a.swap(j - 1, j);
    }
    a.mark([...Array(i + 1).keys()], 'done');
  }
  t.say('Sorted.');
}
`;function Ln({route:e}){let[t,n]=U(null),[r,i]=U(null),[a,o]=U(null),[s,c]=U(!1),[l,u]=U(null),[d,f]=U(0),p=G(null);W(()=>{let t=new URLSearchParams(e.split(`?`)[1]??``),r=t.get(`code`),i=t.get(`example`);r?Nn(r).then(e=>n(e),()=>{n(In),o(`This share link is damaged; showing the starter example instead.`)}):i&&wn(i)?n(wn(i).source):n(e=>e??`export const meta = {
  title: 'Insertion sort',
  code: \`function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    for (let j = i; j > 0 && a[j - 1] > a[j]; j--) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
    }
  }
}\`,
};

export default function (t) {
  const a = t.array('a', [7, 3, 9, 1, 5, 8, 2]);
  for (let i = 1; i < a.length; i++) {
    t.line(2);
    t.say(\`Insert a[\${i}] = \${a.get(i)} into the sorted part on its left.\`);
    for (let j = i; j > 0; j--) {
      t.line(3);
      a.compare(j - 1, j);
      if (a.get(j - 1) <= a.get(j)) break;
      t.line(4);
      a.swap(j - 1, j);
    }
    a.mark([...Array(i + 1).keys()], 'done');
  }
  t.say('Sorted.');
}
`)},[e]);let m=async(e=t)=>{if(e===null)return;c(!0);let n=await jn(e);c(!1),n.ok?(i(n.trace),o(null),f(e=>e+1)):o(n.line?`Line ${n.line}: ${n.error}`:n.error)},h=G(!1);W(()=>{t!==null&&!h.current&&(h.current=!0,m(t))},[t]);let g=async()=>{if(t===null)return;let e=await Mn(t),n=`${location.origin}${location.pathname}#/play?code=${e}`;history.replaceState(null,``,`#/play?code=${e}`);try{await navigator.clipboard.writeText(n),u(`Link copied`)}catch{u(`Link is in the address bar`)}setTimeout(()=>u(null),2e3)};return X(`div`,{class:`wrap`,children:[X(`div`,{class:`play`,children:[X(`div`,{class:`editor`,children:[X(`div`,{class:`editor-bar`,children:[X(`button`,{type:`button`,class:`btn small primary`,onClick:()=>void m(),disabled:s,children:s?`Running…`:`▶ Run`}),X(`button`,{type:`button`,class:`btn small`,onClick:()=>void g(),children:l??`Share link`}),X(`label`,{class:`sr-only`,for:`template`,children:`Load an example`}),X(`select`,{id:`template`,onChange:e=>{let t=e.currentTarget.value,r=t===`starter`?In:wn(t)?.source;r&&(n(r),m(r)),e.currentTarget.value=``},children:[X(`option`,{value:``,children:`Load an example…`}),X(`option`,{value:`starter`,children:`Insertion sort (starter)`}),Sn.map(e=>X(`option`,{value:e.id,children:e.title},e.id))]}),X(`span`,{class:`hint`,children:`Ctrl/⌘ + Enter to run · Esc, Tab to leave`})]}),X(`label`,{class:`sr-only`,for:`code`,children:`Trace code`}),X(`textarea`,{id:`code`,ref:p,spellcheck:!1,value:t??``,onInput:e=>n(e.currentTarget.value),onKeyDown:e=>{if((e.ctrlKey||e.metaKey)&&e.key===`Enter`)e.preventDefault(),m();else if(e.key===`Tab`&&!e.shiftKey){let t=e.currentTarget;if(t.dataset.escaped===`1`){t.dataset.escaped=``;return}e.preventDefault();let{selectionStart:r,selectionEnd:i,value:a}=t;t.value=`${a.slice(0,r)}  ${a.slice(i)}`,t.selectionStart=t.selectionEnd=r+2,n(t.value)}else e.key===`Escape`&&(e.currentTarget.dataset.escaped=`1`)}}),a&&X(`div`,{class:`error`,role:`alert`,"data-testid":`play-error`,children:a})]}),X(`div`,{children:r?X(ft,{trace:r,autoplay:!0},d):X(`div`,{class:`empty-player`,children:s?`Running…`:`Press Run to see your trace.`})})]}),X(Fn,{})]})}var Rn=`https://github.com/feresbr1/traceplay`;function zn(){let[e,t]=U(location.hash||`#/`);return W(()=>{let e=()=>{t(location.hash||`#/`),window.scrollTo({top:0})};return window.addEventListener(`hashchange`,e),()=>window.removeEventListener(`hashchange`,e)},[]),e}function Bn(){let e=zn(),t=e.replace(/^#/,``).split(`?`)[0],n=/^\/example\/([\w-]+)$/.exec(t)?.[1],r;return r=t.startsWith(`/play`)?X(Ln,{route:e}):n?X(Tn,{id:n}):X(kn,{}),X(T,{children:[X(`a`,{class:`sr-only`,href:`#main`,children:`Skip to content`}),X(`header`,{class:`site`,children:X(`div`,{class:`wrap`,children:[X(`a`,{class:`logo`,href:`#/`,children:[X(`span`,{class:`logo-mark`,"aria-hidden":`true`,children:[X(`i`,{style:{height:`12px`}}),X(`i`,{style:{height:`20px`}}),X(`i`,{style:{height:`8px`}}),X(`i`,{style:{height:`16px`}})]}),`traceplay`]}),X(`nav`,{class:`top`,"aria-label":`Site`,children:[X(`a`,{href:`#/`,"aria-current":t===`/`?`page`:void 0,class:`hide-sm`,children:`Gallery`}),X(`a`,{href:`#/play`,"aria-current":t.startsWith(`/play`)?`page`:void 0,children:`Playground`}),X(`a`,{href:`${Rn}#readme`,class:`hide-sm`,children:`Docs`}),X(`a`,{href:Rn,children:`GitHub`})]})]})}),X(`main`,{id:`main`,children:r}),X(`footer`,{class:`site`,children:X(`div`,{class:`wrap`,children:[X(`span`,{children:[`traceplay v`,Oe,` · MIT · `,X(`a`,{href:`${Rn}/issues`,children:`issues`})]}),X(`span`,{children:`Every frame on this site comes from running the code shown.`})]})})]})}se(X(Bn,{}),document.getElementById(`app`));