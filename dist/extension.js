"use strict";var na=Object.create;var qe=Object.defineProperty;var sa=Object.getOwnPropertyDescriptor;var ia=Object.getOwnPropertyNames;var aa=Object.getPrototypeOf,oa=Object.prototype.hasOwnProperty;var ee=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),ca=(e,t)=>{for(var r in t)qe(e,r,{get:t[r],enumerable:!0})},Rr=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of ia(t))!oa.call(e,s)&&s!==r&&qe(e,s,{get:()=>t[s],enumerable:!(n=sa(t,s))||n.enumerable});return e};var M=(e,t,r)=>(r=e!=null?na(aa(e)):{},Rr(t||!e||!e.__esModule?qe(r,"default",{value:e,enumerable:!0}):r,e)),ua=e=>Rr(qe({},"__esModule",{value:!0}),e);var Lr=ee((al,Or)=>{var ve=1e3,be=ve*60,ye=be*60,le=ye*24,la=le*7,da=le*365.25;Or.exports=function(e,t){t=t||{};var r=typeof e;if(r==="string"&&e.length>0)return fa(e);if(r==="number"&&isFinite(e))return t.long?pa(e):ma(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))};function fa(e){if(e=String(e),!(e.length>100)){var t=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);if(t){var r=parseFloat(t[1]),n=(t[2]||"ms").toLowerCase();switch(n){case"years":case"year":case"yrs":case"yr":case"y":return r*da;case"weeks":case"week":case"w":return r*la;case"days":case"day":case"d":return r*le;case"hours":case"hour":case"hrs":case"hr":case"h":return r*ye;case"minutes":case"minute":case"mins":case"min":case"m":return r*be;case"seconds":case"second":case"secs":case"sec":case"s":return r*ve;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return r;default:return}}}}function ma(e){var t=Math.abs(e);return t>=le?Math.round(e/le)+"d":t>=ye?Math.round(e/ye)+"h":t>=be?Math.round(e/be)+"m":t>=ve?Math.round(e/ve)+"s":e+"ms"}function pa(e){var t=Math.abs(e);return t>=le?Ge(e,t,le,"day"):t>=ye?Ge(e,t,ye,"hour"):t>=be?Ge(e,t,be,"minute"):t>=ve?Ge(e,t,ve,"second"):e+" ms"}function Ge(e,t,r,n){var s=t>=r*1.5;return Math.round(e/r)+" "+n+(s?"s":"")}});var Tt=ee((ol,Fr)=>{function ha(e){r.debug=r,r.default=r,r.coerce=c,r.disable=a,r.enable=s,r.enabled=o,r.humanize=Lr(),r.destroy=p,Object.keys(e).forEach(f=>{r[f]=e[f]}),r.names=[],r.skips=[],r.formatters={};function t(f){let l=0;for(let h=0;h<f.length;h++)l=(l<<5)-l+f.charCodeAt(h),l|=0;return r.colors[Math.abs(l)%r.colors.length]}r.selectColor=t;function r(f){let l,h=null,m,L;function w(...T){if(!w.enabled)return;let F=w,ae=Number(new Date),We=ae-(l||ae);F.diff=We,F.prev=l,F.curr=ae,l=ae,T[0]=r.coerce(T[0]),typeof T[0]!="string"&&T.unshift("%O");let Q=0;T[0]=T[0].replace(/%([a-zA-Z%])/g,(ue,He)=>{if(ue==="%%")return"%";Q++;let Oe=r.formatters[He];if(typeof Oe=="function"){let kt=T[Q];ue=Oe.call(F,kt),T.splice(Q,1),Q--}return ue}),r.formatArgs.call(F,T),(F.log||r.log).apply(F,T)}return w.namespace=f,w.useColors=r.useColors(),w.color=r.selectColor(f),w.extend=n,w.destroy=r.destroy,Object.defineProperty(w,"enabled",{enumerable:!0,configurable:!1,get:()=>h!==null?h:(m!==r.namespaces&&(m=r.namespaces,L=r.enabled(f)),L),set:T=>{h=T}}),typeof r.init=="function"&&r.init(w),w}function n(f,l){let h=r(this.namespace+(typeof l>"u"?":":l)+f);return h.log=this.log,h}function s(f){r.save(f),r.namespaces=f,r.names=[],r.skips=[];let l=(typeof f=="string"?f:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let h of l)h[0]==="-"?r.skips.push(h.slice(1)):r.names.push(h)}function i(f,l){let h=0,m=0,L=-1,w=0;for(;h<f.length;)if(m<l.length&&(l[m]===f[h]||l[m]==="*"))l[m]==="*"?(L=m,w=h,m++):(h++,m++);else if(L!==-1)m=L+1,w++,h=w;else return!1;for(;m<l.length&&l[m]==="*";)m++;return m===l.length}function a(){let f=[...r.names,...r.skips.map(l=>"-"+l)].join(",");return r.enable(""),f}function o(f){for(let l of r.skips)if(i(f,l))return!1;for(let l of r.names)if(i(f,l))return!0;return!1}function c(f){return f instanceof Error?f.stack||f.message:f}function p(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return r.enable(r.load()),r}Fr.exports=ha});var Pr=ee((j,ze)=>{j.formatArgs=va;j.save=ba;j.load=ya;j.useColors=ga;j.storage=wa();j.destroy=(()=>{let e=!1;return()=>{e||(e=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();j.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function ga(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let e;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(e=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(e[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function va(e){if(e[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+e[0]+(this.useColors?"%c ":" ")+"+"+ze.exports.humanize(this.diff),!this.useColors)return;let t="color: "+this.color;e.splice(1,0,t,"color: inherit");let r=0,n=0;e[0].replace(/%[a-zA-Z%]/g,s=>{s!=="%%"&&(r++,s==="%c"&&(n=r))}),e.splice(n,0,t)}j.log=console.debug||console.log||(()=>{});function ba(e){try{e?j.storage.setItem("debug",e):j.storage.removeItem("debug")}catch{}}function ya(){let e;try{e=j.storage.getItem("debug")||j.storage.getItem("DEBUG")}catch{}return!e&&typeof process<"u"&&"env"in process&&(e=process.env.DEBUG),e}function wa(){try{return localStorage}catch{}}ze.exports=Tt()(j);var{formatters:ka}=ze.exports;ka.j=function(e){try{return JSON.stringify(e)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}}});var Dr=ee((cl,Ar)=>{"use strict";Ar.exports=(e,t)=>{t=t||process.argv;let r=e.startsWith("-")?"":e.length===1?"-":"--",n=t.indexOf(r+e),s=t.indexOf("--");return n!==-1&&(s===-1?!0:n<s)}});var Br=ee((ul,Mr)=>{"use strict";var xa=require("os"),J=Dr(),B=process.env,we;J("no-color")||J("no-colors")||J("color=false")?we=!1:(J("color")||J("colors")||J("color=true")||J("color=always"))&&(we=!0);"FORCE_COLOR"in B&&(we=B.FORCE_COLOR.length===0||parseInt(B.FORCE_COLOR,10)!==0);function Ta(e){return e===0?!1:{level:e,hasBasic:!0,has256:e>=2,has16m:e>=3}}function Ca(e){if(we===!1)return 0;if(J("color=16m")||J("color=full")||J("color=truecolor"))return 3;if(J("color=256"))return 2;if(e&&!e.isTTY&&we!==!0)return 0;let t=we?1:0;if(process.platform==="win32"){let r=xa.release().split(".");return Number(process.versions.node.split(".")[0])>=8&&Number(r[0])>=10&&Number(r[2])>=10586?Number(r[2])>=14931?3:2:1}if("CI"in B)return["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI"].some(r=>r in B)||B.CI_NAME==="codeship"?1:t;if("TEAMCITY_VERSION"in B)return/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(B.TEAMCITY_VERSION)?1:0;if(B.COLORTERM==="truecolor")return 3;if("TERM_PROGRAM"in B){let r=parseInt((B.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(B.TERM_PROGRAM){case"iTerm.app":return r>=3?3:2;case"Apple_Terminal":return 2}}return/-256(color)?$/i.test(B.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(B.TERM)||"COLORTERM"in B?1:(B.TERM==="dumb",t)}function Ct(e){let t=Ca(e);return Ta(t)}Mr.exports={supportsColor:Ct,stdout:Ct(process.stdout),stderr:Ct(process.stderr)}});var Ur=ee((P,Xe)=>{var Sa=require("tty"),Ve=require("util");P.init=Fa;P.log=Ra;P.formatArgs=_a;P.save=Oa;P.load=La;P.useColors=Ea;P.destroy=Ve.deprecate(()=>{},"Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");P.colors=[6,2,3,4,5,1];try{let e=Br();e&&(e.stderr||e).level>=2&&(P.colors=[20,21,26,27,32,33,38,39,40,41,42,43,44,45,56,57,62,63,68,69,74,75,76,77,78,79,80,81,92,93,98,99,112,113,128,129,134,135,148,149,160,161,162,163,164,165,166,167,168,169,170,171,172,173,178,179,184,185,196,197,198,199,200,201,202,203,204,205,206,207,208,209,214,215,220,221])}catch{}P.inspectOpts=Object.keys(process.env).filter(e=>/^debug_/i.test(e)).reduce((e,t)=>{let r=t.substring(6).toLowerCase().replace(/_([a-z])/g,(s,i)=>i.toUpperCase()),n=process.env[t];return/^(yes|on|true|enabled)$/i.test(n)?n=!0:/^(no|off|false|disabled)$/i.test(n)?n=!1:n==="null"?n=null:n=Number(n),e[r]=n,e},{});function Ea(){return"colors"in P.inspectOpts?!!P.inspectOpts.colors:Sa.isatty(process.stderr.fd)}function _a(e){let{namespace:t,useColors:r}=this;if(r){let n=this.color,s="\x1B[3"+(n<8?n:"8;5;"+n),i=`  ${s};1m${t} \x1B[0m`;e[0]=i+e[0].split(`
`).join(`
`+i),e.push(s+"m+"+Xe.exports.humanize(this.diff)+"\x1B[0m")}else e[0]=Ia()+t+" "+e[0]}function Ia(){return P.inspectOpts.hideDate?"":new Date().toISOString()+" "}function Ra(...e){return process.stderr.write(Ve.formatWithOptions(P.inspectOpts,...e)+`
`)}function Oa(e){e?process.env.DEBUG=e:delete process.env.DEBUG}function La(){return process.env.DEBUG}function Fa(e){e.inspectOpts={};let t=Object.keys(P.inspectOpts);for(let r=0;r<t.length;r++)e.inspectOpts[t[r]]=P.inspectOpts[t[r]]}Xe.exports=Tt()(P);var{formatters:Nr}=Xe.exports;Nr.o=function(e){return this.inspectOpts.colors=this.useColors,Ve.inspect(e,this.inspectOpts).split(`
`).map(t=>t.trim()).join(" ")};Nr.O=function(e){return this.inspectOpts.colors=this.useColors,Ve.inspect(e,this.inspectOpts)}});var Et=ee((ll,St)=>{typeof process>"u"||process.type==="renderer"||process.browser===!0||process.__nwjs?St.exports=Pr():St.exports=Ur()});var $r=ee(G=>{"use strict";var Pa=G&&G.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(G,"__esModule",{value:!0});var Aa=require("fs"),Da=Pa(Et()),ke=Da.default("@kwsites/file-exists");function Ma(e,t,r){ke("checking %s",e);try{let n=Aa.statSync(e);return n.isFile()&&t?(ke("[OK] path represents a file"),!0):n.isDirectory()&&r?(ke("[OK] path represents a directory"),!0):(ke("[FAIL] path represents something other than a file or directory"),!1)}catch(n){if(n.code==="ENOENT")return ke("[FAIL] path is not accessible: %o",n),!1;throw ke("[FATAL] %o",n),n}}function Ba(e,t=G.READABLE){return Ma(e,(t&G.FILE)>0,(t&G.FOLDER)>0)}G.exists=Ba;G.FILE=1;G.FOLDER=2;G.READABLE=G.FILE+G.FOLDER});var jr=ee(Ye=>{"use strict";function Na(e){for(var t in e)Ye.hasOwnProperty(t)||(Ye[t]=e[t])}Object.defineProperty(Ye,"__esModule",{value:!0});Na($r())});var It=ee(de=>{"use strict";Object.defineProperty(de,"__esModule",{value:!0});de.createDeferred=de.deferred=void 0;function _t(){let e,t,r="pending";return{promise:new Promise((s,i)=>{e=s,t=i}),done(s){r==="pending"&&(r="resolved",e(s))},fail(s){r==="pending"&&(r="rejected",t(s))},get fulfilled(){return r!=="pending"},get status(){return r}}}de.deferred=_t;de.createDeferred=_t;de.default=_t});var sl={};ca(sl,{activate:()=>rl,deactivate:()=>nl});module.exports=ua(sl);var X=M(require("vscode"));var Si=M(require("vscode")),br=require("child_process");var xn=require("node:buffer"),ot=M(jr(),1),st=M(Et(),1),fs=require("child_process"),Ys=M(It(),1),ai=require("node:path"),xe=M(It(),1),Ti=require("node:events"),Yt=Object.defineProperty,Ua=Object.getOwnPropertyDescriptor,Kt=Object.getOwnPropertyNames,$a=Object.prototype.hasOwnProperty,d=(e,t)=>function(){return e&&(t=(0,e[Kt(e)[0]])(e=0)),t},ja=(e,t)=>function(){return t||(0,e[Kt(e)[0]])((t={exports:{}}).exports,t),t.exports},O=(e,t)=>{for(var r in t)Yt(e,r,{get:t[r],enumerable:!0})},Wa=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Kt(t))!$a.call(e,s)&&s!==r&&Yt(e,s,{get:()=>t[s],enumerable:!(n=Ua(t,s))||n.enumerable});return e},E=e=>Wa(Yt({},"__esModule",{value:!0}),e);function Ha(...e){let t=new String(e);return at.set(t,e),t}function tt(e){return e instanceof String&&at.has(e)}function Wr(e){return at.get(e)||[]}var at,Ae=d({"src/lib/args/pathspec.ts"(){"use strict";at=new WeakMap}}),ne,ce=d({"src/lib/errors/git-error.ts"(){"use strict";ne=class extends Error{constructor(e,t){super(t),this.task=e,Object.setPrototypeOf(this,new.target.prototype)}}}}),De,Ce=d({"src/lib/errors/git-response-error.ts"(){"use strict";ce(),De=class extends ne{constructor(e,t){super(void 0,t||String(e)),this.git=e}}}}),wn,kn=d({"src/lib/errors/task-configuration-error.ts"(){"use strict";ce(),wn=class extends ne{constructor(e){super(void 0,e)}}}});function Tn(e){return typeof e!="function"?pe:e}function Cn(e){return typeof e=="function"&&e!==pe}function Sn(e,t){let r=e.indexOf(t);return r<=0?[e,""]:[e.substr(0,r),e.substr(r+1)]}function En(e,t=0){return _n(e)&&e.length>t?e[t]:void 0}function me(e,t=0){if(_n(e)&&e.length>t)return e[e.length-1-t]}function _n(e){return dt(e)}function Me(e="",t=!0,r=`
`){return e.split(r).reduce((n,s)=>{let i=t?s.trim():s;return i&&n.push(i),n},[])}function Jt(e,t){return Me(e,!0).map(r=>t(r))}function Qt(e){return(0,ot.exists)(e,ot.FOLDER)}function Y(e,t){return Array.isArray(e)?e.includes(t)||e.push(t):e.add(t),t}function In(e,t){return Array.isArray(e)&&!e.includes(t)&&e.push(t),e}function ct(e,t){if(Array.isArray(e)){let r=e.indexOf(t);r>=0&&e.splice(r,1)}else e.delete(t);return t}function te(e){return Array.isArray(e)?e:[e]}function Rn(e){return e.replace(/[\s-]+(.)/g,(t,r)=>r.toUpperCase())}function Se(e){return te(e).map(t=>t instanceof String?t:String(t))}function C(e,t=0){if(e==null)return t;let r=parseInt(e,10);return Number.isNaN(r)?t:r}function Fe(e,t){let r=[];for(let n=0,s=e.length;n<s;n++)r.push(t,e[n]);return r}function Pe(e){return(Array.isArray(e)?xn.Buffer.concat(e):e).toString("utf-8")}function On(e,t){let r={};return t.forEach(n=>{e[n]!==void 0&&(r[n]=e[n])}),r}function Dt(e=0){return new Promise(t=>setTimeout(t,e))}function Mt(e){if(e!==!1)return e}var Te,pe,Be,ut=d({"src/lib/utils/util.ts"(){"use strict";Zt(),Te="\0",pe=()=>{},Be=Object.prototype.toString.call.bind(Object.prototype.toString)}});function V(e,t,r){return t(e)?e:arguments.length>2?r:void 0}function Bt(e,t){let r=tt(e)?"string":typeof e;return/number|string|boolean/.test(r)&&(!t||!t.includes(r))}function lt(e){return!!e&&Be(e)==="[object Object]"}function Ln(e){return typeof e=="function"}var Ne,Fn,A,rt,dt,Zt=d({"src/lib/utils/argument-filters.ts"(){"use strict";Ae(),ut(),Ne=e=>Array.isArray(e),Fn=e=>typeof e=="number",A=e=>typeof e=="string",rt=e=>A(e)||Array.isArray(e)&&e.every(A),dt=e=>e==null||"number|boolean|function".includes(typeof e)?!1:typeof e.length=="number"}}),Nt,qa=d({"src/lib/utils/exit-codes.ts"(){"use strict";Nt=(e=>(e[e.SUCCESS=0]="SUCCESS",e[e.ERROR=1]="ERROR",e[e.NOT_FOUND=-2]="NOT_FOUND",e[e.UNCLEAN=128]="UNCLEAN",e))(Nt||{})}}),nt,Ga=d({"src/lib/utils/git-output-streams.ts"(){"use strict";nt=class Pn{constructor(t,r){this.stdOut=t,this.stdErr=r}asStrings(){return new Pn(this.stdOut.toString("utf8"),this.stdErr.toString("utf8"))}}}});function za(){throw new Error("LineParser:useMatches not implemented")}var y,oe,Va=d({"src/lib/utils/line-parser.ts"(){"use strict";y=class{constructor(e,t){this.matches=[],this.useMatches=za,this.parse=(r,n)=>(this.resetMatches(),this._regExp.every((s,i)=>this.addMatch(s,i,r(i)))?this.useMatches(n,this.prepareMatches())!==!1:!1),this._regExp=Array.isArray(e)?e:[e],t&&(this.useMatches=t)}resetMatches(){this.matches.length=0}prepareMatches(){return this.matches}addMatch(e,t,r){let n=r&&e.exec(r);return n&&this.pushMatch(t,n),!!n}pushMatch(e,t){this.matches.push(...t.slice(1))}},oe=class extends y{addMatch(e,t,r){return/^remote:\s/.test(String(r))&&super.addMatch(e,t,r)}pushMatch(e,t){(e>0||t.length>1)&&super.pushMatch(e,t)}}}});function An(...e){let t=process.cwd(),r=Object.assign({baseDir:t,...Dn},...e.filter(n=>typeof n=="object"&&n));return r.baseDir=r.baseDir||t,r.trimmed=r.trimmed===!0,r}var Dn,Xa=d({"src/lib/utils/simple-git-options.ts"(){"use strict";Dn={binary:"git",maxConcurrentProcesses:5,config:[],trimmed:!1}}});function er(e,t=[]){return lt(e)?Object.keys(e).reduce((r,n)=>{let s=e[n];if(tt(s))r.push(s);else if(Bt(s,["boolean"]))r.push(n+"="+s);else if(Array.isArray(s))for(let i of s)Bt(i,["string","number"])||r.push(n+"="+i);else r.push(n);return r},t):t}function W(e,t=0,r=!1){let n=[];for(let s=0,i=t<0?e.length:t;s<i;s++)"string|number".includes(typeof e[s])&&n.push(String(e[s]));return er(tr(e),n),r||n.push(...Ya(e)),n}function Ya(e){let t=typeof me(e)=="function";return Se(V(me(e,t?1:0),Ne,[]))}function tr(e){let t=Ln(me(e));return V(me(e,t?1:0),lt)}function _(e,t=!0){let r=Tn(me(e));return t||Cn(r)?r:void 0}var Ka=d({"src/lib/utils/task-options.ts"(){"use strict";Zt(),ut(),Ae()}});function Ut(e,t){return e(t.stdOut,t.stdErr)}function q(e,t,r,n=!0){return te(r).forEach(s=>{for(let i=Me(s,n),a=0,o=i.length;a<o;a++){let c=(p=0)=>{if(!(a+p>=o))return i[a+p]};t.some(({parse:p})=>p(c,e))}}),e}var Ja=d({"src/lib/utils/task-parser.ts"(){"use strict";ut()}}),Mn={};O(Mn,{ExitCodes:()=>Nt,GitOutputStreams:()=>nt,LineParser:()=>y,NOOP:()=>pe,NULL:()=>Te,RemoteLineParser:()=>oe,append:()=>Y,appendTaskOptions:()=>er,asArray:()=>te,asCamelCase:()=>Rn,asFunction:()=>Tn,asNumber:()=>C,asStringArray:()=>Se,bufferToString:()=>Pe,callTaskParser:()=>Ut,createInstanceConfig:()=>An,delay:()=>Dt,filterArray:()=>Ne,filterFunction:()=>Ln,filterHasLength:()=>dt,filterNumber:()=>Fn,filterPlainObject:()=>lt,filterPrimitives:()=>Bt,filterString:()=>A,filterStringOrStringArray:()=>rt,filterType:()=>V,first:()=>En,folderExists:()=>Qt,forEachLineWithContent:()=>Jt,getTrailingOptions:()=>W,including:()=>In,isUserFunction:()=>Cn,last:()=>me,objectToString:()=>Be,orVoid:()=>Mt,parseStringResponse:()=>q,pick:()=>On,prefixedArray:()=>Fe,remove:()=>ct,splitOn:()=>Sn,toLinesWithContent:()=>Me,trailingFunctionArgument:()=>_,trailingOptionsArgument:()=>tr});var b=d({"src/lib/utils/index.ts"(){"use strict";Zt(),qa(),Ga(),Va(),Xa(),Ka(),Ja(),ut()}}),Bn={};O(Bn,{CheckRepoActions:()=>$t,checkIsBareRepoTask:()=>Un,checkIsRepoRootTask:()=>Nn,checkIsRepoTask:()=>Qa});function Qa(e){switch(e){case"bare":return Un();case"root":return Nn()}return{commands:["rev-parse","--is-inside-work-tree"],format:"utf-8",onError:ft,parser:rr}}function Nn(){return{commands:["rev-parse","--git-dir"],format:"utf-8",onError:ft,parser(t){return/^\.(git)?$/.test(t.trim())}}}function Un(){return{commands:["rev-parse","--is-bare-repository"],format:"utf-8",onError:ft,parser:rr}}function Za(e){return/(Not a git repository|Kein Git-Repository)/i.test(String(e))}var $t,ft,rr,$n=d({"src/lib/tasks/check-is-repo.ts"(){"use strict";b(),$t=(e=>(e.BARE="bare",e.IN_TREE="tree",e.IS_REPO_ROOT="root",e))($t||{}),ft=({exitCode:e},t,r,n)=>{if(e===128&&Za(t))return r(Buffer.from("false"));n(t)},rr=e=>e.trim()==="true"}});function eo(e,t){let r=new jn(e),n=e?Hn:Wn;return Me(t).forEach(s=>{let i=s.replace(n,"");r.paths.push(i),(qn.test(i)?r.folders:r.files).push(i)}),r}var jn,Wn,Hn,qn,to=d({"src/lib/responses/CleanSummary.ts"(){"use strict";b(),jn=class{constructor(e){this.dryRun=e,this.paths=[],this.files=[],this.folders=[]}},Wn=/^[a-z]+\s*/i,Hn=/^[a-z]+\s+[a-z]+\s*/i,qn=/\/$/}}),jt={};O(jt,{EMPTY_COMMANDS:()=>mt,adhocExecTask:()=>Gn,configurationErrorTask:()=>H,isBufferTask:()=>Vn,isEmptyTask:()=>Xn,straightThroughBufferTask:()=>zn,straightThroughStringTask:()=>$});function Gn(e){return{commands:mt,format:"empty",parser:e}}function H(e){return{commands:mt,format:"empty",parser(){throw typeof e=="string"?new wn(e):e}}}function $(e,t=!1){return{commands:e,format:"utf-8",parser(r){return t?String(r).trim():r}}}function zn(e){return{commands:e,format:"buffer",parser(t){return t}}}function Vn(e){return e.format==="buffer"}function Xn(e){return e.format==="empty"||!e.commands.length}var mt,R=d({"src/lib/tasks/task.ts"(){"use strict";kn(),mt=[]}}),Yn={};O(Yn,{CONFIG_ERROR_INTERACTIVE_MODE:()=>nr,CONFIG_ERROR_MODE_REQUIRED:()=>sr,CONFIG_ERROR_UNKNOWN_OPTION:()=>ir,CleanOptions:()=>Je,cleanTask:()=>Kn,cleanWithOptionsTask:()=>ro,isCleanOptionsArray:()=>no});function ro(e,t){let{cleanMode:r,options:n,valid:s}=so(e);return r?s.options?(n.push(...t),n.some(oo)?H(nr):Kn(r,n)):H(ir+JSON.stringify(e)):H(sr)}function Kn(e,t){return{commands:["clean",`-${e}`,...t],format:"utf-8",parser(n){return eo(e==="n",n)}}}function no(e){return Array.isArray(e)&&e.every(t=>ar.has(t))}function so(e){let t,r=[],n={cleanMode:!1,options:!0};return e.replace(/[^a-z]i/g,"").split("").forEach(s=>{io(s)?(t=s,n.cleanMode=!0):n.options=n.options&&ao(r[r.length]=`-${s}`)}),{cleanMode:t,options:r,valid:n}}function io(e){return e==="f"||e==="n"}function ao(e){return/^-[a-z]$/i.test(e)&&ar.has(e.charAt(1))}function oo(e){return/^-[^\-]/.test(e)?e.indexOf("i")>0:e==="--interactive"}var nr,sr,ir,Je,ar,Jn=d({"src/lib/tasks/clean.ts"(){"use strict";to(),b(),R(),nr="Git clean interactive mode is not supported",sr='Git clean mode parameter ("n" or "f") is required',ir="Git clean unknown option found in: ",Je=(e=>(e.DRY_RUN="n",e.FORCE="f",e.IGNORED_INCLUDED="x",e.IGNORED_ONLY="X",e.EXCLUDING="e",e.QUIET="q",e.RECURSIVE="d",e))(Je||{}),ar=new Set(["i",...Se(Object.values(Je))])}});function co(e){let t=new Zn;for(let r of Qn(e))t.addValue(r.file,String(r.key),r.value);return t}function uo(e,t){let r=null,n=[],s=new Map;for(let i of Qn(e,t))i.key===t&&(n.push(r=i.value),s.has(i.file)||s.set(i.file,[]),s.get(i.file).push(r));return{key:t,paths:Array.from(s.keys()),scopes:s,value:r,values:n}}function lo(e){return e.replace(/^(file):/,"")}function*Qn(e,t=null){let r=e.split("\0");for(let n=0,s=r.length-1;n<s;){let i=lo(r[n++]),a=r[n++],o=t;if(a.includes(`
`)){let c=Sn(a,`
`);o=c[0],a=c[1]}yield{file:i,key:o,value:a}}}var Zn,fo=d({"src/lib/responses/ConfigList.ts"(){"use strict";b(),Zn=class{constructor(){this.files=[],this.values=Object.create(null)}get all(){return this._all||(this._all=this.files.reduce((e,t)=>Object.assign(e,this.values[t]),{})),this._all}addFile(e){if(!(e in this.values)){let t=me(this.files);this.values[e]=t?Object.create(this.values[t]):{},this.files.push(e)}return this.values[e]}addValue(e,t,r){let n=this.addFile(e);Object.hasOwn(n,t)?Array.isArray(n[t])?n[t].push(r):n[t]=[n[t],r]:n[t]=r,this._all=void 0}}}});function Rt(e,t){return typeof e=="string"&&Object.hasOwn(Wt,e)?e:t}function mo(e,t,r,n){let s=["config",`--${n}`];return r&&s.push("--add"),s.push(e,t),{commands:s,format:"utf-8",parser(i){return i}}}function po(e,t){let r=["config","--null","--show-origin","--get-all",e];return t&&r.splice(1,0,`--${t}`),{commands:r,format:"utf-8",parser(n){return uo(n,e)}}}function ho(e){let t=["config","--list","--show-origin","--null"];return e&&t.push(`--${e}`),{commands:t,format:"utf-8",parser(r){return co(r)}}}function go(){return{addConfig(e,t,...r){return this._runTask(mo(e,t,r[0]===!0,Rt(r[1],"local")),_(arguments))},getConfig(e,t){return this._runTask(po(e,Rt(t,void 0)),_(arguments))},listConfig(...e){return this._runTask(ho(Rt(e[0],void 0)),_(arguments))}}}var Wt,es=d({"src/lib/tasks/config.ts"(){"use strict";fo(),b(),Wt=(e=>(e.system="system",e.global="global",e.local="local",e.worktree="worktree",e))(Wt||{})}});function vo(e){return ts.has(e)}var Ot,ts,rs=d({"src/lib/tasks/diff-name-status.ts"(){"use strict";Ot=(e=>(e.ADDED="A",e.COPIED="C",e.DELETED="D",e.MODIFIED="M",e.RENAMED="R",e.CHANGED="T",e.UNMERGED="U",e.UNKNOWN="X",e.BROKEN="B",e))(Ot||{}),ts=new Set(Object.values(Ot))}});function bo(...e){return new ss().param(...e)}function yo(e){let t=new Set,r={};return Jt(e,n=>{let[s,i,a]=n.split(Te);t.add(s),(r[s]=r[s]||[]).push({line:C(i),path:s,preview:a})}),{paths:t,results:r}}function wo(){return{grep(e){let t=_(arguments),r=W(arguments);for(let s of ns)if(r.includes(s))return this._runTask(H(`git.grep: use of "${s}" is not supported.`),t);typeof e=="string"&&(e=bo().param(e));let n=["grep","--null","-n","--full-name",...r,...e];return this._runTask({commands:n,format:"utf-8",parser(s){return yo(s)}},t)}}}var ns,Le,Hr,ss,is=d({"src/lib/tasks/grep.ts"(){"use strict";b(),R(),ns=["-h"],Le=Symbol("grepQuery"),ss=class{constructor(){this[Hr]=[]}*[(Hr=Le,Symbol.iterator)](){for(let e of this[Le])yield e}and(...e){return e.length&&this[Le].push("--and","(",...Fe(e,"-e"),")"),this}param(...e){return this[Le].push(...Fe(e,"-e")),this}}}}),as={};O(as,{ResetMode:()=>Qe,getResetMode:()=>xo,resetTask:()=>ko});function ko(e,t){let r=["reset"];return os(e)&&r.push(`--${e}`),r.push(...t),$(r)}function xo(e){if(os(e))return e;switch(typeof e){case"string":case"undefined":return"soft"}}function os(e){return typeof e=="string"&&cs.includes(e)}var Qe,cs,us=d({"src/lib/tasks/reset.ts"(){"use strict";b(),R(),Qe=(e=>(e.MIXED="mixed",e.SOFT="soft",e.HARD="hard",e.MERGE="merge",e.KEEP="keep",e))(Qe||{}),cs=Se(Object.values(Qe))}});function To(){return(0,st.default)("simple-git")}function qr(e,t,r){return!t||!String(t).replace(/\s*/,"")?r?(n,...s)=>{e(n,...s),r(n,...s)}:e:(n,...s)=>{e(`%s ${n}`,t,...s),r&&r(n,...s)}}function Co(e,t,{namespace:r}){if(typeof e=="string")return e;let n=t&&t.namespace||"";return n.startsWith(r)?n.substr(r.length+1):n||r}function or(e,t,r,n=To()){let s=e&&`[${e}]`||"",i=[],a=typeof t=="string"?n.extend(t):t,o=Co(V(t,A),a,n);return p(r);function c(f,l){return Y(i,or(e,o.replace(/^[^:]+/,f),l,n))}function p(f){let l=f&&`[${f}]`||"",h=a&&qr(a,l)||pe,m=qr(n,`${s} ${l}`,h);return Object.assign(a?h:m,{label:e,sibling:c,info:m,step:p})}}var ls=d({"src/lib/git-logger.ts"(){"use strict";b(),st.default.formatters.L=e=>String(dt(e)?e.length:"-"),st.default.formatters.B=e=>Buffer.isBuffer(e)?e.toString("utf8"):Be(e)}}),ds,So=d({"src/lib/runners/tasks-pending-queue.ts"(){"use strict";ce(),ls(),ds=class Ht{constructor(t="GitExecutor"){this.logLabel=t,this._queue=new Map}withProgress(t){return this._queue.get(t)}createProgress(t){let r=Ht.getName(t.commands[0]),n=or(this.logLabel,r);return{task:t,logger:n,name:r}}push(t){let r=this.createProgress(t);return r.logger("Adding task to the queue, commands = %o",t.commands),this._queue.set(t,r),r}fatal(t){for(let[r,{logger:n}]of Array.from(this._queue.entries()))r===t.task?(n.info("Failed %o",t),n("Fatal exception, any as-yet un-started tasks run through this executor will not be attempted")):n.info("A fatal exception occurred in a previous task, the queue has been purged: %o",t.message),this.complete(r);if(this._queue.size!==0)throw new Error(`Queue size should be zero after fatal: ${this._queue.size}`)}complete(t){this.withProgress(t)&&this._queue.delete(t)}attempt(t){let r=this.withProgress(t);if(!r)throw new ne(void 0,"TasksPendingQueue: attempt called for an unknown task");return r.logger("Starting task"),r}static getName(t="empty"){return`task:${t}:${++Ht.counter}`}static{this.counter=0}}}});function fe(e,t){return{method:En(e.commands)||"",commands:t}}function Eo(e,t){return r=>{t("[ERROR] child process exception %o",r),e.push(Buffer.from(String(r.stack),"ascii"))}}function Gr(e,t,r,n){return s=>{r("%s received %L bytes",t,s),n("%B",s),e.push(s)}}var qt,_o=d({"src/lib/runners/git-executor-chain.ts"(){"use strict";ce(),R(),b(),So(),qt=class{constructor(e,t,r){this._executor=e,this._scheduler=t,this._plugins=r,this._chain=Promise.resolve(),this._queue=new ds}get cwd(){return this._cwd||this._executor.cwd}set cwd(e){this._cwd=e}get env(){return this._executor.env}get outputHandler(){return this._executor.outputHandler}chain(){return this}push(e){return this._queue.push(e),this._chain=this._chain.then(()=>this.attemptTask(e))}async attemptTask(e){let t=await this._scheduler.next(),r=()=>this._queue.complete(e);try{let{logger:n}=this._queue.attempt(e);return await(Xn(e)?this.attemptEmptyTask(e,n):this.attemptRemoteTask(e,n))}catch(n){throw this.onFatalException(e,n)}finally{r(),t()}}onFatalException(e,t){let r=t instanceof ne?Object.assign(t,{task:e}):new ne(e,t&&String(t));return this._chain=Promise.resolve(),this._queue.fatal(r),r}async attemptRemoteTask(e,t){let r=this._plugins.exec("spawn.binary","",fe(e,e.commands)),n=this._plugins.exec("spawn.args",[...e.commands],fe(e,e.commands)),s=await this.gitResponse(e,r,n,this.outputHandler,t.step("SPAWN")),i=await this.handleTaskData(e,n,s,t.step("HANDLE"));return t("passing response to task's parser as a %s",e.format),Vn(e)?Ut(e.parser,i):Ut(e.parser,i.asStrings())}async attemptEmptyTask(e,t){return t("empty task bypassing child process to call to task's parser"),e.parser(this)}handleTaskData(e,t,r,n){let{exitCode:s,rejection:i,stdOut:a,stdErr:o}=r;return new Promise((c,p)=>{n("Preparing to handle process response exitCode=%d stdOut=",s);let{error:f}=this._plugins.exec("task.error",{error:i},{...fe(e,t),...r});if(f&&e.onError)return n.info("exitCode=%s handling with custom error handler"),e.onError(r,f,l=>{n.info("custom error handler treated as success"),n("custom error returned a %s",Be(l)),c(new nt(Array.isArray(l)?Buffer.concat(l):l,Buffer.concat(o)))},p);if(f)return n.info("handling as error: exitCode=%s stdErr=%s rejection=%o",s,o.length,i),p(f);n.info("retrieving task output complete"),c(new nt(Buffer.concat(a),Buffer.concat(o)))})}async gitResponse(e,t,r,n,s){let i=s.sibling("output"),a=this._plugins.exec("spawn.options",{cwd:this.cwd,env:this.env,windowsHide:!0},fe(e,e.commands));return new Promise(o=>{let c=[],p=[];s.info("%s %o",t,r),s("%O",a);let f=this._beforeSpawn(e,r);if(f)return o({stdOut:c,stdErr:p,exitCode:9901,rejection:f});this._plugins.exec("spawn.before",void 0,{...fe(e,r),kill(h){f=h||f}});let l=(0,fs.spawn)(t,r,a);l.stdout.on("data",Gr(c,"stdOut",s,i.step("stdOut"))),l.stderr.on("data",Gr(p,"stdErr",s,i.step("stdErr"))),l.on("error",Eo(p,s)),n&&(s("Passing child process stdOut/stdErr to custom outputHandler"),n(t,l.stdout,l.stderr,[...r])),this._plugins.exec("spawn.after",void 0,{...fe(e,r),spawned:l,close(h,m){o({stdOut:c,stdErr:p,exitCode:h,rejection:f||m})},kill(h){l.killed||(f=h,l.kill("SIGINT"))}})})}_beforeSpawn(e,t){let r;return this._plugins.exec("spawn.before",void 0,{...fe(e,t),kill(n){r=n||r}}),r}}}}),ms={};O(ms,{GitExecutor:()=>ps});var ps,Io=d({"src/lib/runners/git-executor.ts"(){"use strict";_o(),ps=class{constructor(e,t,r){this.cwd=e,this._scheduler=t,this._plugins=r,this._chain=new qt(this,this._scheduler,this._plugins)}chain(){return new qt(this,this._scheduler,this._plugins)}push(e){return this._chain.push(e)}}}});function Ro(e,t,r=pe){let n=i=>{r(null,i)},s=i=>{i?.task===e&&r(i instanceof De?Oo(i):i,void 0)};t.then(n,s)}function Oo(e){let t=n=>{console.warn(`simple-git deprecation notice: accessing GitResponseError.${n} should be GitResponseError.git.${n}, this will no longer be available in version 3`),t=pe};return Object.create(e,Object.getOwnPropertyNames(e.git).reduce(r,{}));function r(n,s){return s in e||(n[s]={enumerable:!1,configurable:!1,get(){return t(s),e.git[s]}}),n}}var Lo=d({"src/lib/task-callback.ts"(){"use strict";Ce(),b()}});function zr(e,t){return Gn(r=>{if(!Qt(e))throw new Error(`Git.cwd: cannot change to non-directory "${e}"`);return(t||r).cwd=e})}var Fo=d({"src/lib/tasks/change-working-directory.ts"(){"use strict";b(),R()}});function Lt(e){let t=["checkout",...e];return t[1]==="-b"&&t.includes("-B")&&(t[1]=ct(t,"-B")),$(t)}function Po(){return{checkout(){return this._runTask(Lt(W(arguments,1)),_(arguments))},checkoutBranch(e,t){return this._runTask(Lt(["-b",e,t,...W(arguments)]),_(arguments))},checkoutLocalBranch(e){return this._runTask(Lt(["-b",e,...W(arguments)]),_(arguments))}}}var Ao=d({"src/lib/tasks/checkout.ts"(){"use strict";b(),R()}});function Do(){return{count:0,garbage:0,inPack:0,packs:0,prunePackable:0,size:0,sizeGarbage:0,sizePack:0}}function Mo(){return{countObjects(){return this._runTask({commands:["count-objects","--verbose"],format:"utf-8",parser(e){return q(Do(),[hs],e)}})}}}var hs,Bo=d({"src/lib/tasks/count-objects.ts"(){"use strict";b(),hs=new y(/([a-z-]+): (\d+)$/,(e,[t,r])=>{let n=Rn(t);Object.hasOwn(e,n)&&(e[n]=C(r))})}});function No(e){return q({author:null,branch:"",commit:"",root:!1,summary:{changes:0,insertions:0,deletions:0}},gs,e)}var gs,Uo=d({"src/lib/parsers/parse-commit.ts"(){"use strict";b(),gs=[new y(/^\[([^\s]+)( \([^)]+\))? ([^\]]+)/,(e,[t,r,n])=>{e.branch=t,e.commit=n,e.root=!!r}),new y(/\s*Author:\s(.+)/i,(e,[t])=>{let r=t.split("<"),n=r.pop();!n||!n.includes("@")||(e.author={email:n.substr(0,n.length-1),name:r.join("<").trim()})}),new y(/(\d+)[^,]*(?:,\s*(\d+)[^,]*)(?:,\s*(\d+))/g,(e,[t,r,n])=>{e.summary.changes=parseInt(t,10)||0,e.summary.insertions=parseInt(r,10)||0,e.summary.deletions=parseInt(n,10)||0}),new y(/^(\d+)[^,]*(?:,\s*(\d+)[^(]+\(([+-]))?/,(e,[t,r,n])=>{e.summary.changes=parseInt(t,10)||0;let s=parseInt(r,10)||0;n==="-"?e.summary.deletions=s:n==="+"&&(e.summary.insertions=s)})]}});function $o(e,t,r){return{commands:["-c","core.abbrev=40","commit",...Fe(e,"-m"),...t,...r],format:"utf-8",parser:No}}function jo(){return{commit(t,...r){let n=_(arguments),s=e(t)||$o(te(t),te(V(r[0],rt,[])),[...Se(V(r[1],Ne,[])),...W(arguments,0,!0)]);return this._runTask(s,n)}};function e(t){return!rt(t)&&H("git.commit: requires the commit message to be supplied as a string/string[]")}}var Wo=d({"src/lib/tasks/commit.ts"(){"use strict";Uo(),b(),R()}});function Ho(){return{firstCommit(){return this._runTask($(["rev-list","--max-parents=0","HEAD"],!0),_(arguments))}}}var qo=d({"src/lib/tasks/first-commit.ts"(){"use strict";b(),R()}});function Go(e,t){let r=["hash-object",e];return t&&r.push("-w"),$(r,!0)}var zo=d({"src/lib/tasks/hash-object.ts"(){"use strict";R()}});function Vo(e,t,r){let n=String(r).trim(),s;if(s=vs.exec(n))return new Ze(e,t,!1,s[1]);if(s=bs.exec(n))return new Ze(e,t,!0,s[1]);let i="",a=n.split(" ");for(;a.length;)if(a.shift()==="in"){i=a.join(" ");break}return new Ze(e,t,/^re/i.test(n),i)}var Ze,vs,bs,Xo=d({"src/lib/responses/InitSummary.ts"(){"use strict";Ze=class{constructor(e,t,r,n){this.bare=e,this.path=t,this.existing=r,this.gitDir=n}},vs=/^Init.+ repository in (.+)$/,bs=/^Rein.+ in (.+)$/}});function Yo(e){return e.includes(cr)}function Ko(e=!1,t,r){let n=["init",...r];return e&&!Yo(n)&&n.splice(1,0,cr),{commands:n,format:"utf-8",parser(s){return Vo(n.includes("--bare"),t,s)}}}var cr,Jo=d({"src/lib/tasks/init.ts"(){"use strict";Xo(),cr="--bare"}});function ur(e){for(let t=0;t<e.length;t++){let r=lr.exec(e[t]);if(r)return`--${r[1]}`}return""}function Qo(e){return lr.test(e)}var lr,Ue=d({"src/lib/args/log-format.ts"(){"use strict";lr=/^--(stat|numstat|name-only|name-status)(=|$)/}}),ys,Zo=d({"src/lib/responses/DiffSummary.ts"(){"use strict";ys=class{constructor(){this.changed=0,this.deletions=0,this.insertions=0,this.files=[]}}}});function ws(e=""){let t=ks[e];return r=>q(new ys,t,r,!1)}var Ft,Vr,Xr,Yr,ks,xs=d({"src/lib/parsers/parse-diff-summary.ts"(){"use strict";Ue(),Zo(),rs(),b(),Ft=[new y(/^(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/,(e,[t,r,n=""])=>{e.files.push({file:t.trim(),changes:C(r),insertions:n.replace(/[^+]/g,"").length,deletions:n.replace(/[^-]/g,"").length,binary:!1})}),new y(/^(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)/,(e,[t,r,n])=>{e.files.push({file:t.trim(),before:C(r),after:C(n),binary:!0})}),new y(/(\d+) files? changed\s*((?:, \d+ [^,]+){0,2})/,(e,[t,r])=>{let n=/(\d+) i/.exec(r),s=/(\d+) d/.exec(r);e.changed=C(t),e.insertions=C(n?.[1]),e.deletions=C(s?.[1])})],Vr=[new y(/(\d+)\t(\d+)\t(.+)$/,(e,[t,r,n])=>{let s=C(t),i=C(r);e.changed++,e.insertions+=s,e.deletions+=i,e.files.push({file:n,changes:s+i,insertions:s,deletions:i,binary:!1})}),new y(/-\t-\t(.+)$/,(e,[t])=>{e.changed++,e.files.push({file:t,after:0,before:0,binary:!0})})],Xr=[new y(/(.+)$/,(e,[t])=>{e.changed++,e.files.push({file:t,changes:0,insertions:0,deletions:0,binary:!1})})],Yr=[new y(/([ACDMRTUXB])([0-9]{0,3})\t(.[^\t]*)(\t(.[^\t]*))?$/,(e,[t,r,n,s,i])=>{e.changed++,e.files.push({file:i??n,changes:0,insertions:0,deletions:0,binary:!1,status:Mt(vo(t)&&t),from:Mt(!!i&&n!==i&&n),similarity:C(r)})})],ks={"":Ft,"--stat":Ft,"--numstat":Vr,"--name-status":Yr,"--name-only":Xr}}});function ec(e,t){return t.reduce((r,n,s)=>(r[n]=e[s]||"",r),Object.create({diff:null}))}function Ts(e=mr,t=Cs,r=""){let n=ws(r);return function(s){let i=Me(s.trim(),!1,dr).map(function(a){let o=a.split(fr),c=ec(o[0].split(e),t);return o.length>1&&o[1].trim()&&(c.diff=n(o[1])),c});return{all:i,latest:i.length&&i[0]||null,total:i.length}}}var dr,fr,mr,Cs,Ss=d({"src/lib/parsers/parse-list-log-summary.ts"(){"use strict";b(),xs(),Ue(),dr="\xF2\xF2\xF2\xF2\xF2\xF2 ",fr=" \xF2\xF2",mr=" \xF2 ",Cs=["hash","date","message","refs","author_name","author_email"]}}),Es={};O(Es,{diffSummaryTask:()=>tc,validateLogFormatConfig:()=>pt});function tc(e){let t=ur(e),r=["diff"];return t===""&&(t="--stat",r.push("--stat=4096")),r.push(...e),pt(r)||{commands:r,format:"utf-8",parser:ws(t)}}function pt(e){let t=e.filter(Qo);if(t.length>1)return H(`Summary flags are mutually exclusive - pick one of ${t.join(",")}`);if(t.length&&e.includes("-z"))return H(`Summary flag ${t} parsing is not compatible with null termination option '-z'`)}var pr=d({"src/lib/tasks/diff.ts"(){"use strict";Ue(),xs(),R()}});function rc(e,t){let r=[],n=[];return Object.keys(e).forEach(s=>{r.push(s),n.push(String(e[s]))}),[r,n.join(t)]}function nc(e){return Object.keys(e).reduce((t,r)=>(r in Gt||(t[r]=e[r]),t),{})}function _s(e={},t=[]){let r=V(e.splitter,A,mr),n=lt(e.format)?e.format:{hash:"%H",date:e.strictDate===!1?"%ai":"%aI",message:"%s",refs:"%D",body:e.multiLine?"%B":"%b",author_name:e.mailMap!==!1?"%aN":"%an",author_email:e.mailMap!==!1?"%aE":"%ae"},[s,i]=rc(n,r),a=[],o=[`--pretty=format:${dr}${i}${fr}`,...t],c=e.n||e["max-count"]||e.maxCount;if(c&&o.push(`--max-count=${c}`),e.from||e.to){let p=e.symmetric!==!1?"...":"..";a.push(`${e.from||""}${p}${e.to||""}`)}return A(e.file)&&o.push("--follow",Ha(e.file)),er(nc(e),o),{fields:s,splitter:r,commands:[...o,...a]}}function sc(e,t,r){let n=Ts(e,t,ur(r));return{commands:["log",...r],format:"utf-8",parser:n}}function ic(){return{log(...r){let n=_(arguments),s=_s(tr(arguments),Se(V(arguments[0],Ne,[]))),i=t(...r)||pt(s.commands)||e(s);return this._runTask(i,n)}};function e(r){return sc(r.splitter,r.fields,r.commands)}function t(r,n){return A(r)&&A(n)&&H("git.log(string, string) should be replaced with git.log({ from: string, to: string })")}}var Gt,Is=d({"src/lib/tasks/log.ts"(){"use strict";Ue(),Ae(),Ss(),b(),R(),pr(),Gt=(e=>(e[e["--pretty"]=0]="--pretty",e[e["max-count"]=1]="max-count",e[e.maxCount=2]="maxCount",e[e.n=3]="n",e[e.file=4]="file",e[e.format=5]="format",e[e.from=6]="from",e[e.to=7]="to",e[e.splitter=8]="splitter",e[e.symmetric=9]="symmetric",e[e.mailMap=10]="mailMap",e[e.multiLine=11]="multiLine",e[e.strictDate=12]="strictDate",e))(Gt||{})}}),et,Rs,ac=d({"src/lib/responses/MergeSummary.ts"(){"use strict";et=class{constructor(e,t=null,r){this.reason=e,this.file=t,this.meta=r}toString(){return`${this.file}:${this.reason}`}},Rs=class{constructor(){this.conflicts=[],this.merges=[],this.result="success"}get failed(){return this.conflicts.length>0}get reason(){return this.result}toString(){return this.conflicts.length?`CONFLICTS: ${this.conflicts.join(", ")}`:"OK"}}}}),zt,Os,oc=d({"src/lib/responses/PullSummary.ts"(){"use strict";zt=class{constructor(){this.remoteMessages={all:[]},this.created=[],this.deleted=[],this.files=[],this.deletions={},this.insertions={},this.summary={changes:0,deletions:0,insertions:0}}},Os=class{constructor(){this.remote="",this.hash={local:"",remote:""},this.branch={local:"",remote:""},this.message=""}toString(){return this.message}}}});function Pt(e){return e.objects=e.objects||{compressing:0,counting:0,enumerating:0,packReused:0,reused:{count:0,delta:0},total:{count:0,delta:0}}}function Kr(e){let t=/^\s*(\d+)/.exec(e),r=/delta (\d+)/i.exec(e);return{count:C(t&&t[1]||"0"),delta:C(r&&r[1]||"0")}}var Ls,cc=d({"src/lib/parsers/parse-remote-objects.ts"(){"use strict";b(),Ls=[new oe(/^remote:\s*(enumerating|counting|compressing) objects: (\d+),/i,(e,[t,r])=>{let n=t.toLowerCase(),s=Pt(e.remoteMessages);Object.assign(s,{[n]:C(r)})}),new oe(/^remote:\s*(enumerating|counting|compressing) objects: \d+% \(\d+\/(\d+)\),/i,(e,[t,r])=>{let n=t.toLowerCase(),s=Pt(e.remoteMessages);Object.assign(s,{[n]:C(r)})}),new oe(/total ([^,]+), reused ([^,]+), pack-reused (\d+)/i,(e,[t,r,n])=>{let s=Pt(e.remoteMessages);s.total=Kr(t),s.reused=Kr(r),s.packReused=C(n)})]}});function Fs(e,t){return q({remoteMessages:new As},Ps,t)}var Ps,As,Ds=d({"src/lib/parsers/parse-remote-messages.ts"(){"use strict";b(),cc(),Ps=[new oe(/^remote:\s*(.+)$/,(e,[t])=>(e.remoteMessages.all.push(t.trim()),!1)),...Ls,new oe([/create a (?:pull|merge) request/i,/\s(https?:\/\/\S+)$/],(e,[t])=>{e.remoteMessages.pullRequestUrl=t}),new oe([/found (\d+) vulnerabilities.+\(([^)]+)\)/i,/\s(https?:\/\/\S+)$/],(e,[t,r,n])=>{e.remoteMessages.vulnerabilities={count:C(t),summary:r,url:n}})],As=class{constructor(){this.all=[]}}}});function uc(e,t){let r=q(new Os,Ms,[e,t]);return r.message&&r}var Jr,Qr,Zr,en,Ms,tn,hr,Bs=d({"src/lib/parsers/parse-pull.ts"(){"use strict";oc(),b(),Ds(),Jr=/^\s*(.+?)\s+\|\s+\d+\s*(\+*)(-*)/,Qr=/(\d+)\D+((\d+)\D+\(\+\))?(\D+(\d+)\D+\(-\))?/,Zr=/^(create|delete) mode \d+ (.+)/,en=[new y(Jr,(e,[t,r,n])=>{e.files.push(t),r&&(e.insertions[t]=r.length),n&&(e.deletions[t]=n.length)}),new y(Qr,(e,[t,,r,,n])=>r!==void 0||n!==void 0?(e.summary.changes=+t||0,e.summary.insertions=+r||0,e.summary.deletions=+n||0,!0):!1),new y(Zr,(e,[t,r])=>{Y(e.files,r),Y(t==="create"?e.created:e.deleted,r)})],Ms=[new y(/^from\s(.+)$/i,(e,[t])=>{e.remote=t}),new y(/^fatal:\s(.+)$/,(e,[t])=>{e.message=t}),new y(/([a-z0-9]+)\.\.([a-z0-9]+)\s+(\S+)\s+->\s+(\S+)$/,(e,[t,r,n,s])=>{e.branch.local=n,e.hash.local=t,e.branch.remote=s,e.hash.remote=r})],tn=(e,t)=>q(new zt,en,[e,t]),hr=(e,t)=>Object.assign(new zt,tn(e,t),Fs(e,t))}}),rn,Ns,nn,lc=d({"src/lib/parsers/parse-merge.ts"(){"use strict";ac(),b(),Bs(),rn=[new y(/^Auto-merging\s+(.+)$/,(e,[t])=>{e.merges.push(t)}),new y(/^CONFLICT\s+\((.+)\): Merge conflict in (.+)$/,(e,[t,r])=>{e.conflicts.push(new et(t,r))}),new y(/^CONFLICT\s+\((.+\/delete)\): (.+) deleted in (.+) and/,(e,[t,r,n])=>{e.conflicts.push(new et(t,r,{deleteRef:n}))}),new y(/^CONFLICT\s+\((.+)\):/,(e,[t])=>{e.conflicts.push(new et(t,null))}),new y(/^Automatic merge failed;\s+(.+)$/,(e,[t])=>{e.result=t})],Ns=(e,t)=>Object.assign(nn(e,t),hr(e,t)),nn=e=>q(new Rs,rn,e)}});function sn(e){return e.length?{commands:["merge",...e],format:"utf-8",parser(t,r){let n=Ns(t,r);if(n.failed)throw new De(n);return n}}:H("Git.merge requires at least one option")}var dc=d({"src/lib/tasks/merge.ts"(){"use strict";Ce(),lc(),R()}});function fc(e,t,r){let n=r.includes("deleted"),s=r.includes("tag")||/^refs\/tags/.test(e),i=!r.includes("new");return{deleted:n,tag:s,branch:!s,new:!i,alreadyUpdated:i,local:e,remote:t}}var an,Us,on,mc=d({"src/lib/parsers/parse-push.ts"(){"use strict";b(),Ds(),an=[new y(/^Pushing to (.+)$/,(e,[t])=>{e.repo=t}),new y(/^updating local tracking ref '(.+)'/,(e,[t])=>{e.ref={...e.ref||{},local:t}}),new y(/^[=*-]\s+([^:]+):(\S+)\s+\[(.+)]$/,(e,[t,r,n])=>{e.pushed.push(fc(t,r,n))}),new y(/^Branch '([^']+)' set up to track remote branch '([^']+)' from '([^']+)'/,(e,[t,r,n])=>{e.branch={...e.branch||{},local:t,remote:r,remoteName:n}}),new y(/^([^:]+):(\S+)\s+([a-z0-9]+)\.\.([a-z0-9]+)$/,(e,[t,r,n,s])=>{e.update={head:{local:t,remote:r},hash:{from:n,to:s}}})],Us=(e,t)=>{let r=on(e,t),n=Fs(e,t);return{...r,...n}},on=(e,t)=>q({pushed:[]},an,[e,t])}}),$s={};O($s,{pushTagsTask:()=>pc,pushTask:()=>gr});function pc(e={},t){return Y(t,"--tags"),gr(e,t)}function gr(e={},t){let r=["push",...t];return e.branch&&r.splice(1,0,e.branch),e.remote&&r.splice(1,0,e.remote),ct(r,"-v"),Y(r,"--verbose"),Y(r,"--porcelain"),{commands:r,format:"utf-8",parser:Us}}var js=d({"src/lib/tasks/push.ts"(){"use strict";mc(),b()}});function hc(){return{showBuffer(){let e=["show",...W(arguments,1)];return e.includes("--binary")||e.splice(1,0,"--binary"),this._runTask(zn(e),_(arguments))},show(){let e=["show",...W(arguments,1)];return this._runTask($(e),_(arguments))}}}var gc=d({"src/lib/tasks/show.ts"(){"use strict";b(),R()}}),cn,Ws,vc=d({"src/lib/responses/FileStatusSummary.ts"(){"use strict";cn=/^(.+)\0(.+)$/,Ws=class{constructor(e,t,r){if(this.path=e,this.index=t,this.working_dir=r,t==="R"||r==="R"){let n=cn.exec(e)||[null,e,e];this.from=n[2]||"",this.path=n[1]||""}}}}});function un(e){let[t,r]=e.split(Te);return{from:r||t,to:t}}function z(e,t,r){return[`${e}${t}`,r]}function At(e,...t){return t.map(r=>z(e,r,(n,s)=>n.conflicted.push(s)))}function bc(e,t){let r=t.trim();switch(" "){case r.charAt(2):return n(r.charAt(0),r.charAt(1),r.slice(3));case r.charAt(1):return n(" ",r.charAt(0),r.slice(2));default:return}function n(s,i,a){let o=`${s}${i}`,c=Hs.get(o);c&&c(e,a),o!=="##"&&o!=="!!"&&e.files.push(new Ws(a,s,i))}}var ln,Hs,qs,yc=d({"src/lib/responses/StatusSummary.ts"(){"use strict";b(),vc(),ln=class{constructor(){this.not_added=[],this.conflicted=[],this.created=[],this.deleted=[],this.ignored=void 0,this.modified=[],this.renamed=[],this.files=[],this.staged=[],this.ahead=0,this.behind=0,this.current=null,this.tracking=null,this.detached=!1,this.isClean=()=>!this.files.length}},Hs=new Map([z(" ","A",(e,t)=>e.created.push(t)),z(" ","D",(e,t)=>e.deleted.push(t)),z(" ","M",(e,t)=>e.modified.push(t)),z("A"," ",(e,t)=>{e.created.push(t),e.staged.push(t)}),z("A","M",(e,t)=>{e.created.push(t),e.staged.push(t),e.modified.push(t)}),z("D"," ",(e,t)=>{e.deleted.push(t),e.staged.push(t)}),z("M"," ",(e,t)=>{e.modified.push(t),e.staged.push(t)}),z("M","M",(e,t)=>{e.modified.push(t),e.staged.push(t)}),z("R"," ",(e,t)=>{e.renamed.push(un(t))}),z("R","M",(e,t)=>{let r=un(t);e.renamed.push(r),e.modified.push(r.to)}),z("!","!",(e,t)=>{(e.ignored=e.ignored||[]).push(t)}),z("?","?",(e,t)=>e.not_added.push(t)),...At("A","A","U"),...At("D","D","U"),...At("U","A","D","U"),["##",(e,t)=>{let r=/ahead (\d+)/,n=/behind (\d+)/,s=/^(.+?(?=(?:\.{3}|\s|$)))/,i=/\.{3}(\S*)/,a=/\son\s(\S+?)(?=\.{3}|$)/,o=r.exec(t);e.ahead=o&&+o[1]||0,o=n.exec(t),e.behind=o&&+o[1]||0,o=s.exec(t),e.current=V(o?.[1],A,null),o=i.exec(t),e.tracking=V(o?.[1],A,null),o=a.exec(t),o&&(e.current=V(o?.[1],A,e.current)),e.detached=/\(no branch\)/.test(t)}]]),qs=function(e){let t=e.split(Te),r=new ln;for(let n=0,s=t.length;n<s;){let i=t[n++].trim();i&&(i.charAt(0)==="R"&&(i+=Te+(t[n++]||"")),bc(r,i))}return r}}});function wc(e){return{format:"utf-8",commands:["status","--porcelain","-b","-u","--null",...e.filter(r=>!Gs.includes(r))],parser(r){return qs(r)}}}var Gs,kc=d({"src/lib/tasks/status.ts"(){"use strict";yc(),Gs=["--null","-z"]}});function it(e=0,t=0,r=0,n="",s=!0){return Object.defineProperty({major:e,minor:t,patch:r,agent:n,installed:s},"toString",{value(){return`${this.major}.${this.minor}.${this.patch}`},configurable:!1,enumerable:!1})}function xc(){return it(0,0,0,"",!1)}function Tc(){return{version(){return this._runTask({commands:["--version"],format:"utf-8",parser:Cc,onError(e,t,r,n){if(e.exitCode===-2)return r(Buffer.from(vr));n(t)}})}}}function Cc(e){return e===vr?xc():q(it(0,0,0,e),zs,e)}var vr,zs,Sc=d({"src/lib/tasks/version.ts"(){"use strict";b(),vr="installed=false",zs=[new y(/version (\d+)\.(\d+)\.(\d+)(?:\s*\((.+)\))?/,(e,[t,r,n,s=""])=>{Object.assign(e,it(C(t),C(r),C(n),s))}),new y(/version (\d+)\.(\d+)\.(\D+)(.+)?$/,(e,[t,r,n,s=""])=>{Object.assign(e,it(C(t),C(r),n,s))})]}}),Vs={};O(Vs,{SimpleGitApi:()=>Vt});var Vt,Ec=d({"src/lib/simple-git-api.ts"(){"use strict";Lo(),Fo(),Ao(),Bo(),Wo(),es(),qo(),is(),zo(),Jo(),Is(),dc(),js(),gc(),kc(),R(),Sc(),b(),Vt=class{constructor(e){this._executor=e}_runTask(e,t){let r=this._executor.chain(),n=r.push(e);return t&&Ro(e,n,t),Object.create(this,{then:{value:n.then.bind(n)},catch:{value:n.catch.bind(n)},_executor:{value:r}})}add(e){return this._runTask($(["add",...te(e)]),_(arguments))}cwd(e){let t=_(arguments);return typeof e=="string"?this._runTask(zr(e,this._executor),t):typeof e?.path=="string"?this._runTask(zr(e.path,e.root&&this._executor||void 0),t):this._runTask(H("Git.cwd: workingDirectory must be supplied as a string"),t)}hashObject(e,t){return this._runTask(Go(e,t===!0),_(arguments))}init(e){return this._runTask(Ko(e===!0,this._executor.cwd,W(arguments)),_(arguments))}merge(){return this._runTask(sn(W(arguments)),_(arguments))}mergeFromTo(e,t){return A(e)&&A(t)?this._runTask(sn([e,t,...W(arguments)]),_(arguments,!1)):this._runTask(H("Git.mergeFromTo requires that the 'remote' and 'branch' arguments are supplied as strings"))}outputHandler(e){return this._executor.outputHandler=e,this}push(){let e=gr({remote:V(arguments[0],A),branch:V(arguments[1],A)},W(arguments));return this._runTask(e,_(arguments))}stash(){return this._runTask($(["stash",...W(arguments)]),_(arguments))}status(){return this._runTask(wc(W(arguments)),_(arguments))}},Object.assign(Vt.prototype,Po(),jo(),go(),Mo(),Ho(),wo(),ic(),hc(),Tc())}}),Xs={};O(Xs,{Scheduler:()=>Ks});var dn,Ks,_c=d({"src/lib/runners/scheduler.ts"(){"use strict";b(),ls(),dn=(()=>{let e=0;return()=>{e++;let{promise:t,done:r}=(0,Ys.createDeferred)();return{promise:t,done:r,id:e}}})(),Ks=class{constructor(e=2){this.concurrency=e,this.logger=or("","scheduler"),this.pending=[],this.running=[],this.logger("Constructed, concurrency=%s",e)}schedule(){if(!this.pending.length||this.running.length>=this.concurrency){this.logger("Schedule attempt ignored, pending=%s running=%s concurrency=%s",this.pending.length,this.running.length,this.concurrency);return}let e=Y(this.running,this.pending.shift());this.logger("Attempting id=%s",e.id),e.done(()=>{this.logger("Completing id=",e.id),ct(this.running,e),this.schedule()})}next(){let{promise:e,id:t}=Y(this.pending,dn());return this.logger("Scheduling id=%s",t),this.schedule(),e}}}}),Js={};O(Js,{applyPatchTask:()=>Ic});function Ic(e,t){return $(["apply",...t,...e])}var Rc=d({"src/lib/tasks/apply-patch.ts"(){"use strict";R()}});function Oc(e,t){return{branch:e,hash:t,success:!0}}function Lc(e){return{branch:e,hash:null,success:!1}}var Qs,Fc=d({"src/lib/responses/BranchDeleteSummary.ts"(){"use strict";Qs=class{constructor(){this.all=[],this.branches={},this.errors=[]}get success(){return!this.errors.length}}}});function Zs(e,t){return t===1&&Xt.test(e)}var fn,Xt,mn,ht,Pc=d({"src/lib/parsers/parse-branch-delete.ts"(){"use strict";Fc(),b(),fn=/(\S+)\s+\(\S+\s([^)]+)\)/,Xt=/^error[^']+'([^']+)'/m,mn=[new y(fn,(e,[t,r])=>{let n=Oc(t,r);e.all.push(n),e.branches[t]=n}),new y(Xt,(e,[t])=>{let r=Lc(t);e.errors.push(r),e.all.push(r),e.branches[t]=r})],ht=(e,t)=>q(new Qs,mn,[e,t])}}),ei,Ac=d({"src/lib/responses/BranchSummary.ts"(){"use strict";ei=class{constructor(){this.all=[],this.branches={},this.current="",this.detached=!1}push(e,t,r,n,s){e==="*"&&(this.detached=t,this.current=r),this.all.push(r),this.branches[r]={current:e==="*",linkedWorkTree:e==="+",name:r,commit:n,label:s}}}}});function pn(e){return e?e.charAt(0):""}function ti(e,t=!1){return q(new ei,t?[ni]:ri,e)}var ri,ni,Dc=d({"src/lib/parsers/parse-branch.ts"(){"use strict";Ac(),b(),ri=[new y(/^([*+]\s)?\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/,(e,[t,r,n,s])=>{e.push(pn(t),!0,r,n,s)}),new y(/^([*+]\s)?(\S+)\s+([a-z0-9]+)\s?(.*)$/s,(e,[t,r,n,s])=>{e.push(pn(t),!1,r,n,s)})],ni=new y(/^(\S+)$/s,(e,[t])=>{e.push("*",!1,t,"","")})}}),si={};O(si,{branchLocalTask:()=>Bc,branchTask:()=>Mc,containsDeleteBranchCommand:()=>ii,deleteBranchTask:()=>Uc,deleteBranchesTask:()=>Nc});function ii(e){let t=["-d","-D","--delete"];return e.some(r=>t.includes(r))}function Mc(e){let t=ii(e),r=e.includes("--show-current"),n=["branch",...e];return n.length===1&&n.push("-a"),n.includes("-v")||n.splice(1,0,"-v"),{format:"utf-8",commands:n,parser(s,i){return t?ht(s,i).all[0]:ti(s,r)}}}function Bc(){return{format:"utf-8",commands:["branch","-v"],parser(e){return ti(e)}}}function Nc(e,t=!1){return{format:"utf-8",commands:["branch","-v",t?"-D":"-d",...e],parser(r,n){return ht(r,n)},onError({exitCode:r,stdOut:n},s,i,a){if(!Zs(String(s),r))return a(s);i(n)}}}function Uc(e,t=!1){let r={format:"utf-8",commands:["branch","-v",t?"-D":"-d",e],parser(n,s){return ht(n,s).branches[e]},onError({exitCode:n,stdErr:s,stdOut:i},a,o,c){if(!Zs(String(a),n))return c(a);throw new De(r.parser(Pe(i),Pe(s)),String(a))}};return r}var $c=d({"src/lib/tasks/branch.ts"(){"use strict";Ce(),Pc(),Dc(),b()}});function jc(e){let t=e.trim().replace(/^["']|["']$/g,"");return t&&(0,ai.normalize)(t)}var oi,Wc=d({"src/lib/responses/CheckIgnore.ts"(){"use strict";oi=e=>e.split(/\n/g).map(jc).filter(Boolean)}}),ci={};O(ci,{checkIgnoreTask:()=>Hc});function Hc(e){return{commands:["check-ignore",...e],format:"utf-8",parser:oi}}var qc=d({"src/lib/tasks/check-ignore.ts"(){"use strict";Wc()}}),ui={};O(ui,{cloneMirrorTask:()=>zc,cloneTask:()=>li});function Gc(e){return/^--upload-pack(=|$)/.test(e)}function li(e,t,r){let n=["clone",...r];return A(e)&&n.push(e),A(t)&&n.push(t),n.find(Gc)?H("git.fetch: potential exploit argument blocked."):$(n)}function zc(e,t,r){return Y(r,"--mirror"),li(e,t,r)}var Vc=d({"src/lib/tasks/clone.ts"(){"use strict";R(),b()}});function Xc(e,t){return q({raw:e,remote:null,branches:[],tags:[],updated:[],deleted:[]},di,[e,t])}var di,Yc=d({"src/lib/parsers/parse-fetch.ts"(){"use strict";b(),di=[new y(/From (.+)$/,(e,[t])=>{e.remote=t}),new y(/\* \[new branch]\s+(\S+)\s*-> (.+)$/,(e,[t,r])=>{e.branches.push({name:t,tracking:r})}),new y(/\* \[new tag]\s+(\S+)\s*-> (.+)$/,(e,[t,r])=>{e.tags.push({name:t,tracking:r})}),new y(/- \[deleted]\s+\S+\s*-> (.+)$/,(e,[t])=>{e.deleted.push({tracking:t})}),new y(/\s*([^.]+)\.\.(\S+)\s+(\S+)\s*-> (.+)$/,(e,[t,r,n,s])=>{e.updated.push({name:n,tracking:s,to:r,from:t})})]}}),fi={};O(fi,{fetchTask:()=>Jc});function Kc(e){return/^--upload-pack(=|$)/.test(e)}function Jc(e,t,r){let n=["fetch",...r];return e&&t&&n.push(e,t),n.find(Kc)?H("git.fetch: potential exploit argument blocked."):{commands:n,format:"utf-8",parser:Xc}}var Qc=d({"src/lib/tasks/fetch.ts"(){"use strict";Yc(),R()}});function Zc(e){return q({moves:[]},mi,e)}var mi,eu=d({"src/lib/parsers/parse-move.ts"(){"use strict";b(),mi=[new y(/^Renaming (.+) to (.+)$/,(e,[t,r])=>{e.moves.push({from:t,to:r})})]}}),pi={};O(pi,{moveTask:()=>tu});function tu(e,t){return{commands:["mv","-v",...te(e),t],format:"utf-8",parser:Zc}}var ru=d({"src/lib/tasks/move.ts"(){"use strict";eu(),b()}}),hi={};O(hi,{pullTask:()=>nu});function nu(e,t,r){let n=["pull",...r];return e&&t&&n.splice(1,0,e,t),{commands:n,format:"utf-8",parser(s,i){return hr(s,i)},onError(s,i,a,o){let c=uc(Pe(s.stdOut),Pe(s.stdErr));if(c)return o(new De(c));o(i)}}}var su=d({"src/lib/tasks/pull.ts"(){"use strict";Ce(),Bs(),b()}});function iu(e){let t={};return gi(e,([r])=>t[r]={name:r}),Object.values(t)}function au(e){let t={};return gi(e,([r,n,s])=>{Object.hasOwn(t,r)||(t[r]={name:r,refs:{fetch:"",push:""}}),s&&n&&(t[r].refs[s.replace(/[^a-z]/g,"")]=n)}),Object.values(t)}function gi(e,t){Jt(e,r=>t(r.split(/\s+/)))}var ou=d({"src/lib/responses/GetRemoteSummary.ts"(){"use strict";b()}}),vi={};O(vi,{addRemoteTask:()=>cu,getRemotesTask:()=>uu,listRemotesTask:()=>lu,remoteTask:()=>du,removeRemoteTask:()=>fu});function cu(e,t,r){return $(["remote","add",...r,e,t])}function uu(e){let t=["remote"];return e&&t.push("-v"),{commands:t,format:"utf-8",parser:e?au:iu}}function lu(e){let t=[...e];return t[0]!=="ls-remote"&&t.unshift("ls-remote"),$(t)}function du(e){let t=[...e];return t[0]!=="remote"&&t.unshift("remote"),$(t)}function fu(e){return $(["remote","remove",e])}var mu=d({"src/lib/tasks/remote.ts"(){"use strict";ou(),R()}}),bi={};O(bi,{stashListTask:()=>pu});function pu(e={},t){let r=_s(e),n=["stash","list",...r.commands,...t],s=Ts(r.splitter,r.fields,ur(n));return pt(n)||{commands:n,format:"utf-8",parser:s}}var hu=d({"src/lib/tasks/stash-list.ts"(){"use strict";Ue(),Ss(),pr(),Is()}}),yi={};O(yi,{addSubModuleTask:()=>gu,initSubModuleTask:()=>vu,subModuleTask:()=>gt,updateSubModuleTask:()=>bu});function gu(e,t){return gt(["add",e,t])}function vu(e){return gt(["init",...e])}function gt(e){let t=[...e];return t[0]!=="submodule"&&t.unshift("submodule"),$(t)}function bu(e){return gt(["update",...e])}var yu=d({"src/lib/tasks/sub-module.ts"(){"use strict";R()}});function wu(e,t){let r=Number.isNaN(e),n=Number.isNaN(t);return r!==n?r?1:-1:r?wi(e,t):0}function wi(e,t){return e===t?0:e>t?1:-1}function ku(e){return e.trim()}function Ke(e){return typeof e=="string"&&parseInt(e.replace(/^\D+/g,""),10)||0}var hn,ki,xu=d({"src/lib/responses/TagList.ts"(){"use strict";hn=class{constructor(e,t){this.all=e,this.latest=t}},ki=function(e,t=!1){let r=e.split(`
`).map(ku).filter(Boolean);t||r.sort(function(s,i){let a=s.split("."),o=i.split(".");if(a.length===1||o.length===1)return wu(Ke(a[0]),Ke(o[0]));for(let c=0,p=Math.max(a.length,o.length);c<p;c++){let f=wi(Ke(a[c]),Ke(o[c]));if(f)return f}return 0});let n=t?r[0]:[...r].reverse().find(s=>s.indexOf(".")>=0);return new hn(r,n)}}}),xi={};O(xi,{addAnnotatedTagTask:()=>Su,addTagTask:()=>Cu,tagListTask:()=>Tu});function Tu(e=[]){let t=e.some(r=>/^--sort=/.test(r));return{format:"utf-8",commands:["tag","-l",...e],parser(r){return ki(r,t)}}}function Cu(e){return{format:"utf-8",commands:["tag",e],parser(){return{name:e}}}}function Su(e,t){return{format:"utf-8",commands:["tag","-a","-m",t,e],parser(){return{name:e}}}}var Eu=d({"src/lib/tasks/tag.ts"(){"use strict";xu()}}),_u=ja({"src/git.js"(e,t){"use strict";var{GitExecutor:r}=(Io(),E(ms)),{SimpleGitApi:n}=(Ec(),E(Vs)),{Scheduler:s}=(_c(),E(Xs)),{configurationErrorTask:i}=(R(),E(jt)),{asArray:a,filterArray:o,filterPrimitives:c,filterString:p,filterStringOrStringArray:f,filterType:l,getTrailingOptions:h,trailingFunctionArgument:m,trailingOptionsArgument:L}=(b(),E(Mn)),{applyPatchTask:w}=(Rc(),E(Js)),{branchTask:T,branchLocalTask:F,deleteBranchesTask:ae,deleteBranchTask:We}=($c(),E(si)),{checkIgnoreTask:Q}=(qc(),E(ci)),{checkIsRepoTask:Re}=($n(),E(Bn)),{cloneTask:ue,cloneMirrorTask:He}=(Vc(),E(ui)),{cleanWithOptionsTask:Oe,isCleanOptionsArray:kt}=(Jn(),E(Yn)),{diffSummaryTask:Mi}=(pr(),E(Es)),{fetchTask:Bi}=(Qc(),E(fi)),{moveTask:Ni}=(ru(),E(pi)),{pullTask:Ui}=(su(),E(hi)),{pushTagsTask:$i}=(js(),E($s)),{addRemoteTask:ji,getRemotesTask:Wi,listRemotesTask:Hi,remoteTask:qi,removeRemoteTask:Gi}=(mu(),E(vi)),{getResetMode:zi,resetTask:Vi}=(us(),E(as)),{stashListTask:Xi}=(hu(),E(bi)),{addSubModuleTask:Yi,initSubModuleTask:Ki,subModuleTask:Ji,updateSubModuleTask:Qi}=(yu(),E(yi)),{addAnnotatedTagTask:Zi,addTagTask:ea,tagListTask:ta}=(Eu(),E(xi)),{straightThroughBufferTask:ra,straightThroughStringTask:Z}=(R(),E(jt));function v(u,g){this._plugins=g,this._executor=new r(u.baseDir,new s(u.maxConcurrentProcesses),g),this._trimmed=u.trimmed}(v.prototype=Object.create(n.prototype)).constructor=v,v.prototype.customBinary=function(u){return this._plugins.reconfigure("binary",u),this},v.prototype.env=function(u,g){return arguments.length===1&&typeof u=="object"?this._executor.env=u:(this._executor.env=this._executor.env||{})[u]=g,this},v.prototype.stashList=function(u){return this._runTask(Xi(L(arguments)||{},o(u)&&u||[]),m(arguments))};function Ir(u,g,k,U){return typeof k!="string"?i(`git.${u}() requires a string 'repoPath'`):g(k,l(U,p),h(arguments))}v.prototype.clone=function(){return this._runTask(Ir("clone",ue,...arguments),m(arguments))},v.prototype.mirror=function(){return this._runTask(Ir("mirror",He,...arguments),m(arguments))},v.prototype.mv=function(u,g){return this._runTask(Ni(u,g),m(arguments))},v.prototype.checkoutLatestTag=function(u){var g=this;return this.pull(function(){g.tags(function(k,U){g.checkout(U.latest,u)})})},v.prototype.pull=function(u,g,k,U){return this._runTask(Ui(l(u,p),l(g,p),h(arguments)),m(arguments))},v.prototype.fetch=function(u,g){return this._runTask(Bi(l(u,p),l(g,p),h(arguments)),m(arguments))},v.prototype.silent=function(u){return console.warn("simple-git deprecation notice: git.silent: logging should be configured using the `debug` library / `DEBUG` environment variable, this will be an error in version 3"),this},v.prototype.tags=function(u,g){return this._runTask(ta(h(arguments)),m(arguments))},v.prototype.rebase=function(){return this._runTask(Z(["rebase",...h(arguments)]),m(arguments))},v.prototype.reset=function(u){return this._runTask(Vi(zi(u),h(arguments)),m(arguments))},v.prototype.revert=function(u){let g=m(arguments);return typeof u!="string"?this._runTask(i("Commit must be a string"),g):this._runTask(Z(["revert",...h(arguments,0,!0),u]),g)},v.prototype.addTag=function(u){let g=typeof u=="string"?ea(u):i("Git.addTag requires a tag name");return this._runTask(g,m(arguments))},v.prototype.addAnnotatedTag=function(u,g){return this._runTask(Zi(u,g),m(arguments))},v.prototype.deleteLocalBranch=function(u,g,k){return this._runTask(We(u,typeof g=="boolean"?g:!1),m(arguments))},v.prototype.deleteLocalBranches=function(u,g,k){return this._runTask(ae(u,typeof g=="boolean"?g:!1),m(arguments))},v.prototype.branch=function(u,g){return this._runTask(T(h(arguments)),m(arguments))},v.prototype.branchLocal=function(u){return this._runTask(F(),m(arguments))},v.prototype.raw=function(u){let g=!Array.isArray(u),k=[].slice.call(g?arguments:u,0);for(let K=0;K<k.length&&g;K++)if(!c(k[K])){k.splice(K,k.length-K);break}k.push(...h(arguments,0,!0));var U=m(arguments);return k.length?this._runTask(Z(k,this._trimmed),U):this._runTask(i("Raw: must supply one or more command to execute"),U)},v.prototype.submoduleAdd=function(u,g,k){return this._runTask(Yi(u,g),m(arguments))},v.prototype.submoduleUpdate=function(u,g){return this._runTask(Qi(h(arguments,!0)),m(arguments))},v.prototype.submoduleInit=function(u,g){return this._runTask(Ki(h(arguments,!0)),m(arguments))},v.prototype.subModule=function(u,g){return this._runTask(Ji(h(arguments)),m(arguments))},v.prototype.listRemote=function(){return this._runTask(Hi(h(arguments)),m(arguments))},v.prototype.addRemote=function(u,g,k){return this._runTask(ji(u,g,h(arguments)),m(arguments))},v.prototype.removeRemote=function(u,g){return this._runTask(Gi(u),m(arguments))},v.prototype.getRemotes=function(u,g){return this._runTask(Wi(u===!0),m(arguments))},v.prototype.remote=function(u,g){return this._runTask(qi(h(arguments)),m(arguments))},v.prototype.tag=function(u,g){let k=h(arguments);return k[0]!=="tag"&&k.unshift("tag"),this._runTask(Z(k),m(arguments))},v.prototype.updateServerInfo=function(u){return this._runTask(Z(["update-server-info"]),m(arguments))},v.prototype.pushTags=function(u,g){let k=$i({remote:l(u,p)},h(arguments));return this._runTask(k,m(arguments))},v.prototype.rm=function(u){return this._runTask(Z(["rm","-f",...a(u)]),m(arguments))},v.prototype.rmKeepLocal=function(u){return this._runTask(Z(["rm","--cached",...a(u)]),m(arguments))},v.prototype.catFile=function(u,g){return this._catFile("utf-8",arguments)},v.prototype.binaryCatFile=function(){return this._catFile("buffer",arguments)},v.prototype._catFile=function(u,g){var k=m(g),U=["cat-file"],K=g[0];if(typeof K=="string")return this._runTask(i("Git.catFile: options must be supplied as an array of strings"),k);Array.isArray(K)&&U.push.apply(U,K);let xt=u==="buffer"?ra(U):Z(U);return this._runTask(xt,k)},v.prototype.diff=function(u,g){let k=p(u)?i("git.diff: supplying options as a single string is no longer supported, switch to an array of strings"):Z(["diff",...h(arguments)]);return this._runTask(k,m(arguments))},v.prototype.diffSummary=function(){return this._runTask(Mi(h(arguments,1)),m(arguments))},v.prototype.applyPatch=function(u){let g=f(u)?w(a(u),h([].slice.call(arguments,1))):i("git.applyPatch requires one or more string patches as the first argument");return this._runTask(g,m(arguments))},v.prototype.revparse=function(){let u=["rev-parse",...h(arguments,!0)];return this._runTask(Z(u,!0),m(arguments))},v.prototype.clean=function(u,g,k){let U=kt(u),K=U&&u.join("")||l(u,p)||"",xt=h([].slice.call(arguments,U?1:0));return this._runTask(Oe(K,xt),m(arguments))},v.prototype.exec=function(u){let g={commands:[],format:"utf-8",parser(){typeof u=="function"&&u()}};return this._runTask(g)},v.prototype.clearQueue=function(){return this},v.prototype.checkIgnore=function(u,g){return this._runTask(Q(a(l(u,f,[]))),m(arguments))},v.prototype.checkIsRepo=function(u,g){return this._runTask(Re(l(u,p)),m(arguments))},t.exports=v}});Ae();ce();var Iu=class extends ne{constructor(e,t){super(void 0,t),this.config=e}};ce();ce();var re=class extends ne{constructor(e,t,r){super(e,r),this.task=e,this.plugin=t,Object.setPrototypeOf(this,new.target.prototype)}};Ce();kn();$n();Jn();es();rs();is();us();function Ru(e){return e?[{type:"spawn.before",action(n,s){e.aborted&&s.kill(new re(void 0,"abort","Abort already signaled"))}},{type:"spawn.after",action(n,s){function i(){s.kill(new re(void 0,"abort","Abort signal received"))}e.addEventListener("abort",i),s.spawned.on("close",()=>e.removeEventListener("abort",i))}}]:void 0}function Ou(e){return typeof e=="string"&&e.trim().toLowerCase()==="-c"}function Lu(e,t){if(Ou(e)&&/^\s*protocol(.[a-z]+)?.allow/.test(t))throw new re(void 0,"unsafe","Configuring protocol.allow is not permitted without enabling allowUnsafeExtProtocol")}function Fu(e,t){if(/^\s*--(upload|receive)-pack/.test(e))throw new re(void 0,"unsafe","Use of --upload-pack or --receive-pack is not permitted without enabling allowUnsafePack");if(t==="clone"&&/^\s*-u\b/.test(e))throw new re(void 0,"unsafe","Use of clone with option -u is not permitted without enabling allowUnsafePack");if(t==="push"&&/^\s*--exec\b/.test(e))throw new re(void 0,"unsafe","Use of push with option --exec is not permitted without enabling allowUnsafePack")}function Pu({allowUnsafeProtocolOverride:e=!1,allowUnsafePack:t=!1}={}){return{type:"spawn.args",action(r,n){return r.forEach((s,i)=>{let a=i<r.length?r[i+1]:"";e||Lu(s,a),t||Fu(s,n.method)}),r}}}b();function Au(e){let t=Fe(e,"-c");return{type:"spawn.args",action(r){return[...t,...r]}}}b();var gn=(0,xe.deferred)().promise;function Du({onClose:e=!0,onExit:t=50}={}){function r(){let s=-1,i={close:(0,xe.deferred)(),closeTimeout:(0,xe.deferred)(),exit:(0,xe.deferred)(),exitTimeout:(0,xe.deferred)()},a=Promise.race([e===!1?gn:i.closeTimeout.promise,t===!1?gn:i.exitTimeout.promise]);return n(e,i.close,i.closeTimeout),n(t,i.exit,i.exitTimeout),{close(o){s=o,i.close.done()},exit(o){s=o,i.exit.done()},get exitCode(){return s},result:a}}function n(s,i,a){s!==!1&&(s===!0?i.promise:i.promise.then(()=>Dt(s))).then(a.done)}return{type:"spawn.after",async action(s,{spawned:i,close:a}){let o=r(),c=!0,p=()=>{c=!1};i.stdout?.on("data",p),i.stderr?.on("data",p),i.on("error",p),i.on("close",f=>o.close(f)),i.on("exit",f=>o.exit(f));try{await o.result,c&&await Dt(50),a(o.exitCode)}catch(f){a(o.exitCode,f)}}}}b();var Mu="Invalid value supplied for custom binary, requires a single string or an array containing either one or two strings",vn="Invalid value supplied for custom binary, restricted characters must be removed or supply the unsafe.allowUnsafeCustomBinary option";function Bu(e){return!e||!/^([a-z]:)?([a-z0-9/.\\_~-]+)$/i.test(e)}function bn(e,t){if(e.length<1||e.length>2)throw new re(void 0,"binary",Mu);if(e.some(Bu))if(t)console.warn(vn);else throw new re(void 0,"binary",vn);let[n,s]=e;return{binary:n,prefix:s}}function Nu(e,t=["git"],r=!1){let n=bn(te(t),r);e.on("binary",s=>{n=bn(te(s),r)}),e.append("spawn.binary",()=>n.binary),e.append("spawn.args",s=>n.prefix?[n.prefix,...s]:s)}ce();function Uu(e){return!!(e.exitCode&&e.stdErr.length)}function $u(e){return Buffer.concat([...e.stdOut,...e.stdErr])}function ju(e=!1,t=Uu,r=$u){return(n,s)=>!e&&n||!t(s)?n:r(s)}function yn(e){return{type:"task.error",action(t,r){let n=e(t.error,{stdErr:r.stdErr,stdOut:r.stdOut,exitCode:r.exitCode});return Buffer.isBuffer(n)?{error:new ne(void 0,n.toString("utf-8"))}:{error:n}}}}b();var Wu=class{constructor(){this.plugins=new Set,this.events=new Ti.EventEmitter}on(e,t){this.events.on(e,t)}reconfigure(e,t){this.events.emit(e,t)}append(e,t){let r=Y(this.plugins,{type:e,action:t});return()=>this.plugins.delete(r)}add(e){let t=[];return te(e).forEach(r=>r&&this.plugins.add(Y(t,r))),()=>{t.forEach(r=>this.plugins.delete(r))}}exec(e,t,r){let n=t,s=Object.freeze(Object.create(r));for(let i of this.plugins)i.type===e&&(n=i.action(n,s));return n}};b();function Hu(e){let t="--progress",r=["checkout","clone","fetch","pull","push"];return[{type:"spawn.args",action(i,a){return r.includes(a.method)?In(i,t):i}},{type:"spawn.after",action(i,a){a.commands.includes(t)&&a.spawned.stderr?.on("data",o=>{let c=/^([\s\S]+?):\s*(\d+)% \((\d+)\/(\d+)\)/.exec(o.toString("utf8"));c&&e({method:a.method,stage:qu(c[1]),progress:C(c[2]),processed:C(c[3]),total:C(c[4])})})}}]}function qu(e){return String(e.toLowerCase().split(" ",1))||"unknown"}b();function Gu(e){let t=On(e,["uid","gid"]);return{type:"spawn.options",action(r){return{...t,...r}}}}function zu({block:e,stdErr:t=!0,stdOut:r=!0}){if(e>0)return{type:"spawn.after",action(n,s){let i;function a(){i&&clearTimeout(i),i=setTimeout(c,e)}function o(){s.spawned.stdout?.off("data",a),s.spawned.stderr?.off("data",a),s.spawned.off("exit",o),s.spawned.off("close",o),i&&clearTimeout(i)}function c(){o(),s.kill(new re(void 0,"timeout","block timeout reached"))}r&&s.spawned.stdout?.on("data",a),t&&s.spawned.stderr?.on("data",a),s.spawned.on("exit",o),s.spawned.on("close",o),a()}}}Ae();function Vu(){return{type:"spawn.args",action(e){let t=[],r;function n(s){(r=r||[]).push(...s)}for(let s=0;s<e.length;s++){let i=e[s];if(tt(i)){n(Wr(i));continue}if(i==="--"){n(e.slice(s+1).flatMap(a=>tt(a)&&Wr(a)||a));break}t.push(i)}return r?[...t,"--",...r.map(String)]:t}}}b();var Xu=_u();function Yu(e,t){let r=new Wu,n=An(e&&(typeof e=="string"?{baseDir:e}:e)||{},t);if(!Qt(n.baseDir))throw new Iu(n,"Cannot use simple-git on a directory that does not exist");return Array.isArray(n.config)&&r.add(Au(n.config)),r.add(Pu(n.unsafe)),r.add(Vu()),r.add(Du(n.completion)),n.abort&&r.add(Ru(n.abort)),n.progress&&r.add(Hu(n.progress)),n.timeout&&r.add(zu(n.timeout)),n.spawnOptions&&r.add(Gu(n.spawnOptions)),r.add(yn(ju(!0))),n.errors&&r.add(yn(n.errors)),Nu(r,n.binary,n.unsafe?.allowUnsafeCustomBinary),new Xu(n,r)}Ce();var Ci=Yu;var yr=class{git=null;async initialize(){let t=Si.workspace.workspaceFolders?.[0];if(!t)return console.log("[MarkdownThreads] gitService.initialize: no workspace folder"),!1;console.log("[MarkdownThreads] gitService.initialize: folder =",t.uri.fsPath),this.git=Ci(t.uri.fsPath);try{let r=await this.git.checkIsRepo();return console.log("[MarkdownThreads] gitService.initialize: isRepo =",r),r||(this.git=null),r}catch(r){return console.log("[MarkdownThreads] gitService.initialize: error",r),this.git=null,!1}}async getUserName(){if(this.git||(console.log("[MarkdownThreads] getUserName: git not initialized, retrying..."),await this.initialize()),this.git){try{let t=await this.git.raw(["config","user.name"]);if(t.trim())return t.trim()}catch{}try{let t=await this.git.raw(["config","user.email"]);if(t.trim())return t.trim()}catch{}}console.log("[MarkdownThreads] getUserName: falling back to execSync");try{let t=(0,br.execSync)("git config --global user.name",{encoding:"utf8"}).trim();if(t)return t}catch{}try{let t=(0,br.execSync)("git config --global user.email",{encoding:"utf8"}).trim();if(t)return t}catch{}return"Unknown"}},se=new yr;var x=M(require("vscode")),he=M(require("path"));var ie=M(require("fs")),_e=M(require("path")),Ri=M(require("vscode"));var Ei=M(require("crypto")),bt=new Uint8Array(256),vt=bt.length;function wr(){return vt>bt.length-16&&(Ei.default.randomFillSync(bt),vt=0),bt.slice(vt,vt+=16)}var D=[];for(let e=0;e<256;++e)D.push((e+256).toString(16).slice(1));function _i(e,t=0){return D[e[t+0]]+D[e[t+1]]+D[e[t+2]]+D[e[t+3]]+"-"+D[e[t+4]]+D[e[t+5]]+"-"+D[e[t+6]]+D[e[t+7]]+"-"+D[e[t+8]]+D[e[t+9]]+"-"+D[e[t+10]]+D[e[t+11]]+D[e[t+12]]+D[e[t+13]]+D[e[t+14]]+D[e[t+15]]}var Ii=M(require("crypto")),kr={randomUUID:Ii.default.randomUUID};function Ku(e,t,r){if(kr.randomUUID&&!t&&!e)return kr.randomUUID();e=e||{};let n=e.random||(e.rng||wr)();if(n[6]=n[6]&15|64,n[8]=n[8]&63|128,t){r=r||0;for(let s=0;s<16;++s)t[r+s]=n[s];return t}return _i(n)}var Ee=Ku;var xr=class{writing=!1;_onDidChange=new Ri.EventEmitter;onDidChange=this._onDidChange.event;getSidecarPath(t){let r=_e.dirname(t),n=_e.basename(t,".md");return _e.join(r,`${n}.comments.json`)}sidecarExists(t){return ie.existsSync(this.getSidecarPath(t))}async readSidecar(t){let r=this.getSidecarPath(t);if(!ie.existsSync(r))return null;try{let n=await ie.promises.readFile(r,"utf-8"),s=JSON.parse(n);return this.validateSidecar(s)?s:null}catch(n){return console.error(`Failed to read sidecar file: ${r}`,n),null}}async writeSidecar(t,r,n="internal"){let s=this.getSidecarPath(t),i=`${s}.tmp`;this.writing=!0;try{let a=JSON.stringify(r,null,2);await ie.promises.writeFile(i,a,"utf-8"),await ie.promises.rename(i,s)}catch(a){throw ie.existsSync(i)&&await ie.promises.unlink(i),a}finally{setTimeout(()=>{this.writing=!1},500)}this._onDidChange.fire({docPath:t,origin:n})}createEmptySidecar(t){return{doc:t,version:"2.0",comments:[]}}addThread(t,r){let n={...r,id:Ee()};return t.comments.push(n),n}addReply(t,r,n){let s=t.comments.find(a=>a.id===r);if(!s)return null;let i={...n,id:Ee()};return s.thread.push(i),i}deleteThread(t,r){let n=t.comments.findIndex(s=>s.id===r);return n===-1?!1:(t.comments.splice(n,1),!0)}deleteComment(t,r,n){let s=t.comments.find(i=>i.id===r);return!s||n<0||n>=s.thread.length?!1:(s.thread.splice(n,1),s.thread.length===0&&this.deleteThread(t,r),!0)}deleteCommentById(t,r,n){let s=t.comments.find(a=>a.id===r);if(!s)return!1;let i=s.thread.findIndex(a=>a.id===n);return i===-1?!1:this.deleteComment(t,r,i)}toggleReaction(t,r,n,s){let i=t.comments.find(c=>c.id===r);if(!i)return!1;let a=i.thread.find(c=>c.id===n);if(!a)return!1;a.reactions||(a.reactions=[]);let o=a.reactions.indexOf(s);return o===-1?(a.reactions.push(s),!0):(a.reactions.splice(o,1),!1)}editComment(t,r,n,s){let i=t.comments.find(o=>o.id===r);if(!i)return null;let a=i.thread.find(o=>o.id===n);return a?(a.body=s,a.edited=new Date().toISOString(),a):null}validateSidecar(t){if(!t||typeof t!="object")return!1;let r=t;return!(typeof r.doc!="string"||r.version!=="2.0"||!Array.isArray(r.comments))}},I=new xr;var Tr=class{extractContext(t,r,n){let s=t.slice(Math.max(0,r-40),r),i=t.slice(n,n+40);return{prefix:s,suffix:i}}createAnchor(t,r,n,s){return{selectedText:t,textContext:this.extractContext(s,r,n),markdownRange:{startOffset:r,endOffset:n}}}anchorComment(t,r){let{selectedText:n,textContext:s,markdownRange:i}=t;if(r.slice(i.startOffset,i.endOffset)===n)return i;let a=Math.max(0,i.startOffset-500),o=Math.min(r.length,i.endOffset+500),c=r.slice(a,o),p=-1,f=1/0,l=0;for(;;){let w=c.indexOf(n,l);if(w===-1)break;let T=a+w,F=Math.abs(T-i.startOffset);F<f&&(f=F,p=w),l=w+1}if(p!==-1){let w=a+p;return{startOffset:w,endOffset:w+n.length}}let h=s.prefix+n+s.suffix,m=r.indexOf(h);if(m!==-1){let w=m+s.prefix.length;return{startOffset:w,endOffset:w+n.length}}if(s.prefix){let w=s.prefix+n,T=r.indexOf(w);if(T!==-1){let F=T+s.prefix.length;return{startOffset:F,endOffset:F+n.length}}}if(s.suffix){let w=n+s.suffix,T=r.indexOf(w);if(T!==-1)return{startOffset:T,endOffset:T+n.length}}let L=r.indexOf(n);return L!==-1?{startOffset:L,endOffset:L+n.length}:null}detectStaleThreads(t,r){let n=[],s=!1;for(let i of r){let a=this.anchorComment(i.anchor,t);a?((a.startOffset!==i.anchor.markdownRange.startOffset||a.endOffset!==i.anchor.markdownRange.endOffset)&&(s=!0),i.anchor.markdownRange=a,i.anchor.textContext=this.extractContext(t,a.startOffset,a.endOffset),i.status==="stale"&&n.push({thread:i,newStatus:"open"})):i.status!=="stale"&&n.push({thread:i,newStatus:"stale"})}return{updates:n,anchorsMoved:s}}},Cr=new Tr;function Oi(e,t,r){if(!e)return null;let n=-1,s=1/0,i=e,a=0;for(;a<=t.length-e.length;){let l=t.indexOf(e,a);if(l===-1)break;let h=Math.abs(l-r);h<s&&(s=h,n=l),a=l+1}if(n!==-1)return{start:n,text:i};let o=e.split(`
`);if(o.length===0||!o[0].trim())return null;let c=o.map(l=>l.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")),p="(?:[ \\t]*(?:[-*+]|\\d+[.)]) |[ \\t]*> )?",f=c.map(l=>p+l).join("\\n");try{let l=new RegExp(f,"g"),h;for(;(h=l.exec(t))!==null;){let m=Math.abs(h.index-r);m<s&&(s=m,n=h.index,i=h[0]),l.lastIndex=h.index+1}}catch{return null}return n!==-1?{start:n,text:i}:null}var $e=M(require("path"));var Li=new Set(["Version","Owner","Project"]),Sr={PRD:["Draft","Approved"],Architecture:["Draft","Approved"],ADR:["Draft","Approved"],Feature:["Draft","Approved","Implemented"],Other:["Draft","Approved","Implemented"]};function Ju(e){let r=e.replace(/\r\n/g,`
`).split(`
`)[0]?.trim()??"";return/^<!--\s*SPECIT\s*-->$/i.test(r)}function Fi(e){if(!Ju(e))return null;let t=e.replace(/\r\n/g,`
`).split(`
`),r={},n=-1,s=-1;for(let i=1;i<t.length;i++){let a=t[i];if(a.trim()!==""&&!/^#{1,6}\s/.test(a)){if(a.startsWith(">")){n===-1&&(n=i),s=i+1;let o=a.match(/^>\s*\*\*(.+?)\*\*:\s*(.+?)(?:<br>)?\s*$/);o&&(r[o[1]]=o[2].trim())}else if(n!==-1)break}}return n===-1?null:{fields:r,blockquoteStartLine:n,blockquoteEndLine:s}}function Er(e,t,r){let n=e.replace(/\r\n/g,`
`),s=new RegExp(`^(>\\s*\\*\\*${Zu(t)}\\*\\*:\\s*).+?((?:<br>)?\\s*)$`,"m");if(!s.test(n))return e;let i=n.replace(s,`$1${r}$2`);if(t!=="Last Updated"){let a=new Date().toISOString().slice(0,10),o=/^(>\s*\*\*Last Updated\*\*:\s*).+?((?:<br>)?\s*)$/m;i=i.replace(o,`$1${a}$2`)}return i}function Pi(e){let t=$e.basename(e).toUpperCase(),r=$e.basename($e.dirname(e)).toLowerCase();return t==="PRD.MD"?"PRD":t==="ARCHITECTURE.MD"?"Architecture":r==="adr"||t.startsWith("ADR-")?"ADR":r==="feature"||t.startsWith("FEAT-")?"Feature":"Other"}var Qu={PRD:"Product Requirements Document",Architecture:"Architecture Document",ADR:"Architecture Decision Record",Feature:"Feature Spec",Other:""};function Ai(e){return Qu[e]??""}function Zu(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}var Ie=class e{static viewType="markdownThreads.preview";static instance;static extensionUri;panel;document;disposables=[];updateTimeout;_isUpdating=!1;styleUri;markdownItUri;docDirUri;static setExtensionUri(t){e.extensionUri=t}static async show(t){let r=x.window.activeTextEditor!==void 0,n=r?x.ViewColumn.Beside:x.ViewColumn.One,s=r;if(e.instance){e.instance.document=t,e.instance.panel.reveal(n,s),await e.instance.update();return}if(!e.extensionUri){x.window.showErrorMessage("PreviewPanel.extensionUri not set");return}let i=[...x.workspace.workspaceFolders?.map(o=>o.uri)??[],x.Uri.joinPath(e.extensionUri,"media")],a=x.window.createWebviewPanel(e.viewType,`Preview: ${he.basename(t.uri.fsPath)}`,{viewColumn:n,preserveFocus:s},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:i});e.instance=new e(a,t),await e.instance.update()}constructor(t,r){this.panel=t,this.document=r,this.styleUri=t.webview.asWebviewUri(x.Uri.joinPath(e.extensionUri,"media","preview-styles.css")),this.markdownItUri=t.webview.asWebviewUri(x.Uri.joinPath(e.extensionUri,"media","markdown-it.min.js")),this.docDirUri=()=>{let n=x.Uri.file(he.dirname(this.document.uri.fsPath));return t.webview.asWebviewUri(n)},this.panel.onDidDispose(()=>this.dispose(),null,this.disposables),this.disposables.push(x.workspace.onDidSaveTextDocument(n=>{n.uri.toString()===this.document.uri.toString()&&this.scheduleUpdate()})),this.disposables.push(I.onDidChange(n=>{n.origin!=="preview"&&n.docPath===this.document.uri.fsPath&&this.scheduleUpdate()})),this.disposables.push(x.window.onDidChangeActiveTextEditor(n=>{n&&n.document.languageId==="markdown"&&n.document.uri.scheme==="file"&&!n.document.uri.path.includes("commentinput-")&&n.document.uri.toString()!==this.document.uri.toString()&&(this.document=n.document,this.scheduleUpdate())})),this.panel.webview.onDidReceiveMessage(n=>this.handleWebViewMessage(n),null,this.disposables)}async ensureDocumentFresh(){this.document=await x.workspace.openTextDocument(this.document.uri)}async replaceDocumentContent(t){let r=this.document,n=new x.Range(r.positionAt(0),r.positionAt(r.getText().length)),s=new x.WorkspaceEdit;s.replace(r.uri,n,t),await x.workspace.applyEdit(s),await r.save(),this.document=r,await this.update()}async handleWebViewMessage(t){switch(t.command){case"refresh":{await this.update();break}case"addComment":{await this.ensureDocumentFresh();let r=t.selectedText,n=(t.body||"").trim(),s=t.contentOffset||0;if(!r||!n)return;let i=await se.getUserName(),a=this.document.getText().replace(/\r\n/g,`
`),o=Oi(r,a,s);if(!o){x.window.showErrorMessage("Could not find selected text in document");return}let c=o.start+o.text.length,p=Cr.createAnchor(o.text,o.start,c,a),f=await I.readSidecar(this.document.uri.fsPath);f||(f=I.createEmptySidecar(he.basename(this.document.uri.fsPath)));let l=new Date().toISOString();I.addThread(f,{anchor:p,status:"open",thread:[{id:Ee(),author:i,body:n,created:l,edited:null}]}),await I.writeSidecar(this.document.uri.fsPath,f,"preview"),await this.update();break}case"replyComment":{let r=t.threadId,n=(t.body||"").trim();if(!n||!r)return;let s=await se.getUserName(),i=await I.readSidecar(this.document.uri.fsPath);if(!i)return;I.addReply(i,r,{author:s,body:n,created:new Date().toISOString(),edited:null}),await I.writeSidecar(this.document.uri.fsPath,i,"preview"),await this.update();break}case"deleteThread":{let r=t.threadId;if(!r)return;let n=await se.getUserName(),s=await I.readSidecar(this.document.uri.fsPath);if(!s)return;let i=s.comments.find(a=>a.id===r);if(!i)return;if(i.thread[0]?.author!==n){x.window.showWarningMessage("You can only delete threads you created.");return}I.deleteThread(s,r),await I.writeSidecar(this.document.uri.fsPath,s,"preview"),await this.update();break}case"deleteComment":{let r=t.threadId,n=t.commentId;if(!r||!n)return;let s=await se.getUserName(),i=await I.readSidecar(this.document.uri.fsPath);if(!i)return;let a=i.comments.find(c=>c.id===r);if(!a)return;let o=a.thread.find(c=>c.id===n);if(!o)return;if(o.author!==s){x.window.showWarningMessage("You can only delete your own comments.");return}I.deleteCommentById(i,r,n),await I.writeSidecar(this.document.uri.fsPath,i,"preview"),await this.update();break}case"editComment":{let r=t.threadId,n=t.commentId,s=(t.body||"").trim();if(!r||!n||!s)return;let i=await se.getUserName(),a=await I.readSidecar(this.document.uri.fsPath);if(!a)return;let o=a.comments.find(p=>p.id===r);if(!o)return;let c=o.thread.find(p=>p.id===n);if(!c||c.author!==i){x.window.showWarningMessage("You can only edit your own comments.");return}I.editComment(a,r,n,s),await I.writeSidecar(this.document.uri.fsPath,a,"preview"),await this.update();break}case"openExternal":{let r=t.url;r&&/^https?:\/\//i.test(r)&&x.commands.executeCommand("simpleBrowser.show",r);break}case"editSpecitField":{await this.ensureDocumentFresh();let r=t.fieldName,n=(t.newValue||"").trim();if(!r||!n)return;let s=this.document.getText().replace(/\r\n/g,`
`),i=Er(s,r,n);if(i===s)return;await this.replaceDocumentContent(i);break}case"changeSpecitStatus":{await this.ensureDocumentFresh();let r=(t.newStatus||"").trim();if(!r)return;let n=this.document.getText().replace(/\r\n/g,`
`),s=Er(n,"Status",r);if(s===n)return;await this.replaceDocumentContent(s);break}}}scheduleUpdate(){this.updateTimeout&&clearTimeout(this.updateTimeout),this.panel.visible&&(this.updateTimeout=setTimeout(()=>this.update(),300))}async update(){if(!this._isUpdating){this._isUpdating=!0;try{await this.ensureDocumentFresh();let t=this.document.getText().replace(/\r\n/g,`
`),r=await I.readSidecar(this.document.uri.fsPath),n=[];if(r){let{updates:a,anchorsMoved:o}=Cr.detectStaleThreads(t,r.comments);for(let{thread:c,newStatus:p}of a)c.status=p;n=r.comments,(a.length>0||o)&&await I.writeSidecar(this.document.uri.fsPath,r,"internal")}n.sort((a,o)=>a.anchor.markdownRange.startOffset-o.anchor.markdownRange.startOffset);let s=n.map(a=>{let o=n.filter(c=>c.anchor.selectedText===a.anchor.selectedText&&c.anchor.markdownRange.startOffset<a.anchor.markdownRange.startOffset).length;return{id:a.id,selectedText:a.anchor.selectedText,occurrenceIndex:o,status:a.status,color:a.color,thread:a.thread,startOffset:a.anchor.markdownRange.startOffset}}),i=await se.getUserName();this.panel.title=`Preview: ${he.basename(this.document.uri.fsPath)}`,this.panel.webview.html=this.buildHtml(t,s,i)}finally{this._isUpdating=!1}}}buildHtml(t,r,n){let s=el(),i=this.panel.webview.cspSource,a=JSON.stringify(r).replace(/</g,"\\u003c"),o=JSON.stringify(n).replace(/</g,"\\u003c"),c=he.basename(this.document.uri.fsPath),p=this.docDirUri().toString(),f="null",l="",h="",m=Fi(t);if(m){let L=Pi(this.document.uri.fsPath),w=Sr[L]??Sr.Other;f=JSON.stringify({fields:m.fields,editableFields:[...Li],statusOptions:w}).replace(/</g,"\\u003c"),m.fields.Project&&(c=m.fields.Project);let T=Ai(L);T&&(h=`
          <p class="doc-subtitle">${je(T)}</p>`);let F=m.fields.Status;if(F){let ae=F.toLowerCase();l=`
        <div class="specit-status-row">${w.map(Q=>{let Re=Q.toLowerCase(),ue=Re===ae;return`<button class="specit-status-btn ${`specit-status-btn-${Re}`} ${ue?"specit-status-btn-active":""}" data-status="${je(Q)}">${je(Q)}</button>`}).join("")}</div>`}}return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src ${i} 'unsafe-inline'; script-src ${i} 'unsafe-inline' https://cdn.jsdelivr.net 'nonce-${s}' 'unsafe-eval'; img-src ${i} https: data:; font-src ${i};">
  <link href="${this.styleUri}" rel="stylesheet">
  <title>${je(c)}</title>
</head>
<body>
  <div id="layout">
    <div id="content-scroll">
      <div class="doc-header">
        <div class="doc-header-row">
          <h1>${je(c)}</h1>
          <button class="refresh-btn" id="refreshBtn" title="Refresh document">&#x21bb; Refresh</button>
        </div>${h}${l}
      </div>
      <div class="find-bar" id="findBar">
        <input type="text" id="findInput" placeholder="Find in document\u2026" autocomplete="off" />
        <span class="find-info" id="findInfo"></span>
        <button id="findPrev" title="Previous match (Shift+Enter)" disabled>&#x25B2;</button>
        <button id="findNext" title="Next match (Enter)" disabled>&#x25BC;</button>
        <button id="findClose" title="Close (Escape)">&#x2715;</button>
      </div>
      <div class="doc-content" id="content"></div>
    </div>
    <div id="resize-handle" title="Drag to resize sidebar"></div>
    <div id="sidebar">
      <div class="sidebar-header">
        <span>Comments <span id="thread-count-badge" class="thread-count-badge"></span></span>
      </div>
      <div id="sidebar-content"></div>
    </div>
  </div>
  <div id="comment-toolbar">
    <button id="toolbar-comment-btn">\u{1F4AC} Comment</button>
  </div>
  <script src="${this.markdownItUri}"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script nonce="${s}">
    const threads = ${a};
    const currentUser = ${o};
    const rawMarkdown = ${JSON.stringify(t)};
    const docDirBase = ${JSON.stringify(p)};
    const specitData = ${f};
${tl}
  </script>
</body>
</html>`}dispose(){e.instance=void 0,this.updateTimeout&&clearTimeout(this.updateTimeout),this.panel.dispose();for(let t of this.disposables)t.dispose()}};function el(){let e="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let r=0;r<32;r++)e+=t.charAt(Math.floor(Math.random()*t.length));return e}function je(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var tl=`
(function () {
  const vscode = acquireVsCodeApi();
  const contentEl = document.getElementById('content');
  const contentScroll = document.getElementById('content-scroll');
  const sidebarContent = document.getElementById('sidebar-content');
  const toolbar = document.getElementById('comment-toolbar');
  const toolbarBtn = document.getElementById('toolbar-comment-btn');

  // \u2500\u2500 client-side markdown rendering \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function renderMarkdown() {
    if (typeof window.markdownit !== 'function') {
      // markdown-it not yet loaded \u2014 retry after window load
      window.addEventListener('load', function() {
        renderMarkdown();
        if (typeof setupSpecitHeader === 'function') { setupSpecitHeader(); }
      }, { once: true });
      return;
    }
    const md = window.markdownit({
      html: true,
      linkify: true,
      typographer: true,
      breaks: false,
    });

    // Mermaid fence renderer
    var diagramCounter = 0;
    const defaultFenceRenderer = md.renderer.rules.fence;
    md.renderer.rules.fence = function(tokens, idx, options, env, self) {
      const token = tokens[idx];
      if (token.info.trim() === 'mermaid') {
        var dId = 'diagram-' + (diagramCounter++);
        return '<div class="mermaid-frame" data-diagram-id="' + dId + '">'
          + '<div class="mermaid-frame-toolbar">'
          + '<span class="diagram-label">&#x1F4CA; Diagram</span>'
          + '<button data-zoom-diagram="' + dId + '" data-zoom-dir="-1" title="Zoom out">&#x2796;</button>'
          + '<span class="zoom-level" id="zoom-label-' + dId + '">100%</span>'
          + '<button data-zoom-diagram="' + dId + '" data-zoom-dir="1" title="Zoom in">&#x2795;</button>'
          + '<button data-reset-diagram="' + dId + '" title="Reset view">Reset</button>'
          + '</div>'
          + '<div class="mermaid-frame-viewport" id="viewport-' + dId + '">'
          + '<div class="mermaid-frame-content" id="content-' + dId + '">'
          + '<div class="mermaid">' + md.utils.escapeHtml(token.content) + '</div>'
          + '</div></div></div>';
      }
      if (defaultFenceRenderer) {
        return defaultFenceRenderer(tokens, idx, options, env, self);
      }
      return '<pre><code>' + md.utils.escapeHtml(token.content) + '</code></pre>';
    };

    // Heading slug renderer
    const defaultHeadingOpen = md.renderer.rules.heading_open;
    md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
      var token = tokens[idx];
      var nextToken = tokens[idx + 1];
      if (nextToken && nextToken.type === 'inline' && nextToken.content) {
        var slug = nextToken.content
          .toLowerCase()
          .replace(/[^a-z0-9\\s-]/g, '')
          .trim()
          .replace(/\\s+/g, '-')
          .replace(/-+/g, '-');
        token.attrSet('id', slug);
        token.attrSet('data-slug', slug);
        token.attrJoin('class', 'section-heading');
      }
      if (defaultHeadingOpen) {
        return defaultHeadingOpen(tokens, idx, options, env, self);
      }
      return self.renderToken(tokens, idx, options);
    };

    const rendered = md.render(rawMarkdown);
    contentEl.innerHTML = rendered;

    // Checkbox post-processing
    document.querySelectorAll('#content li').forEach(function(li) {
      var text = li.innerHTML;
      if (text.startsWith('[ ] ')) {
        li.innerHTML = '<input type="checkbox" disabled> ' + text.slice(4);
      } else if (text.startsWith('[x] ') || text.startsWith('[X] ')) {
        li.innerHTML = '<input type="checkbox" checked disabled> ' + text.slice(4);
      }
    });

    // Fix relative image paths using the document directory base URI
    document.querySelectorAll('#content img[src]').forEach(function(img) {
      var src = img.getAttribute('src');
      if (src && !/^https?:\\/\\//i.test(src) && !/^data:/i.test(src) && !/^vscode-/i.test(src)) {
        img.setAttribute('src', docDirBase + '/' + src);
      }
    });

    // Rewrite external links to data attributes to avoid VS Code interception
    document.querySelectorAll('#content a[href]').forEach(function(a) {
      var href = a.getAttribute('href');
      if (href && /^https?:\\/\\//i.test(href)) {
        a.setAttribute('data-external-url', href);
        a.setAttribute('href', '#');
      }
    });

    // Initialize mermaid
    if (typeof mermaid !== 'undefined') {
      var isDark = document.body.classList.contains('vscode-dark') ||
                   document.body.classList.contains('vscode-high-contrast');
      mermaid.initialize({
        startOnLoad: true,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'strict',
      });
    }
  }
  renderMarkdown();

  // \u2500\u2500 SPECIT: wire up status buttons in static header + blockquote field card \u2500\u2500
  function setupSpecitHeader() {
    if (!specitData) { return; }

    // Wire up status toggle buttons in the static doc-header
    document.querySelectorAll('.specit-status-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.classList.contains('specit-status-btn-active')) { return; }
        var newStatus = btn.getAttribute('data-status');
        if (newStatus) {
          vscode.postMessage({ command: 'changeSpecitStatus', newStatus: newStatus });
        }
      });
    });

    // Replace the first blockquote with an interactive fields card
    var bq = contentEl.querySelector('blockquote');
    if (!bq) { return; }

    var fields = specitData.fields;
    var editableFields = specitData.editableFields;

    var fieldsHtml = '';
    var fieldKeys = Object.keys(fields);
    for (var fi = 0; fi < fieldKeys.length; fi++) {
      var key = fieldKeys[fi];
      var val = fields[key];
      var isEditable = editableFields.indexOf(key) !== -1;
      var editBtn = isEditable
        ? ' <button class="specit-edit-btn" data-field="' + key + '" title="Edit ' + key + '">Edit</button>'
        : '';
      fieldsHtml += '<div class="specit-field" data-field-name="' + key + '">'
        + '<span class="specit-field-label">' + key + ':</span> '
        + '<span class="specit-field-value">' + val + '</span>' + editBtn
        + '</div>';
    }

    var card = document.createElement('div');
    card.className = 'specit-header-card';
    card.innerHTML = fieldsHtml;
    bq.parentNode.replaceChild(card, bq);

    // Wire up inline field editing
    card.querySelectorAll('.specit-edit-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var fieldName = btn.getAttribute('data-field');
        if (!fieldName) { return; }
        var fieldEl = btn.closest('.specit-field');
        if (!fieldEl) { return; }
        var valueEl = fieldEl.querySelector('.specit-field-value');
        if (!valueEl) { return; }
        if (fieldEl.querySelector('.specit-edit-input')) { return; }

        var currentValue = valueEl.textContent || '';
        valueEl.style.display = 'none';
        btn.style.display = 'none';

        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'specit-edit-input';
        input.value = currentValue;
        fieldEl.appendChild(input);
        input.focus();
        input.select();

        function commit() {
          var newValue = input.value.trim();
          if (newValue && newValue !== currentValue) {
            vscode.postMessage({ command: 'editSpecitField', fieldName: fieldName, newValue: newValue });
          } else {
            cancel();
          }
        }
        function cancel() {
          input.remove();
          valueEl.style.display = '';
          btn.style.display = '';
        }

        input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        });
        input.addEventListener('blur', function() {
          setTimeout(function() { if (document.contains(input)) { commit(); } }, 100);
        });
      });
    });
  }
  setupSpecitHeader();

  // \u2500\u2500 refresh button \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  document.getElementById('refreshBtn').addEventListener('click', function() {
    vscode.postMessage({ command: 'refresh' });
  });

  // \u2500\u2500 highlight color palette \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const HIGHLIGHT_COLORS = [
    'rgba(255, 235, 59, 0.35)',
    'rgba(129, 199, 132, 0.35)',
    'rgba(100, 181, 246, 0.35)',
    'rgba(255, 183, 77, 0.35)',
    'rgba(186, 104, 200, 0.35)',
    'rgba(77, 208, 225, 0.35)',
    'rgba(229, 115, 115, 0.35)',
    'rgba(240, 98, 146, 0.35)',
  ];
  function getThreadColor(index) {
    return HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];
  }

  // \u2500\u2500 external link handling \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  contentEl.addEventListener('click', function(e) {
    var anchor = e.target.closest('a');
    if (!anchor) { return; }
    var externalUrl = anchor.getAttribute('data-external-url');
    if (externalUrl) {
      e.preventDefault();
      vscode.postMessage({ command: 'openExternal', url: externalUrl });
    }
  });

  // \u2500\u2500 mermaid diagram zoom & pan \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  var diagramStates = {};

  function getDiagramState(dId) {
    if (!diagramStates[dId]) {
      diagramStates[dId] = { scale: 1, translateX: 0, translateY: 0 };
    }
    return diagramStates[dId];
  }

  function applyTransform(dId) {
    var s = getDiagramState(dId);
    var el = document.getElementById('content-' + dId);
    if (el) {
      var svg = el.querySelector('svg');
      if (svg) {
        if (!s.origWidth) {
          var vb = svg.getAttribute('viewBox');
          if (vb) {
            var parts = vb.split(/[\\s,]+/);
            s.origWidth = parseFloat(parts[2]) || 0;
            s.origHeight = parseFloat(parts[3]) || 0;
          }
          if (!s.origWidth || !s.origHeight) {
            var rect = svg.getBoundingClientRect();
            s.origWidth = s.origWidth || rect.width || 400;
            s.origHeight = s.origHeight || rect.height || 300;
          }
        }
        var newW = s.origWidth * s.scale;
        var newH = s.origHeight * s.scale;
        svg.setAttribute('width', newW + 'px');
        svg.setAttribute('height', newH + 'px');
        svg.style.width = newW + 'px';
        svg.style.height = newH + 'px';
        svg.style.maxWidth = 'none';
      }
      el.style.transform = 'translate(' + s.translateX + 'px, ' + s.translateY + 'px)';
    }
    var label = document.getElementById('zoom-label-' + dId);
    if (label) {
      label.textContent = Math.round(s.scale * 100) + '%';
    }
  }

  function zoomDiagram(dId, direction) {
    var s = getDiagramState(dId);
    var newScale = s.scale + direction * 0.15;
    newScale = Math.max(0.25, Math.min(4, newScale));
    s.scale = Math.round(newScale * 100) / 100;
    applyTransform(dId);
  }

  function resetDiagram(dId) {
    var s = getDiagramState(dId);
    s.scale = 1;
    s.translateX = 0;
    s.translateY = 0;
    applyTransform(dId);
  }

  // Delegated click handler for mermaid toolbar buttons (CSP blocks inline onclick)
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-zoom-diagram], [data-reset-diagram]');
    if (!btn) { return; }
    var zoomId = btn.getAttribute('data-zoom-diagram');
    if (zoomId) {
      var dir = parseInt(btn.getAttribute('data-zoom-dir'), 10) || 1;
      zoomDiagram(zoomId, dir);
      return;
    }
    var resetId = btn.getAttribute('data-reset-diagram');
    if (resetId) {
      resetDiagram(resetId);
    }
  });

  // Attach wheel + drag handlers to all diagram viewports
  (function() {
    function setupViewport(vp) {
      var dId = vp.id.replace('viewport-', '');
      var dragging = false;
      var lastX = 0, lastY = 0;

      vp.addEventListener('mousedown', function(e) {
        if (e.button !== 0) { return; }
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        vp.classList.add('panning');
        e.preventDefault();
      });

      document.addEventListener('mousemove', function(e) {
        if (!dragging) { return; }
        var s = getDiagramState(dId);
        s.translateX += e.clientX - lastX;
        s.translateY += e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        applyTransform(dId);
      });

      document.addEventListener('mouseup', function() {
        if (dragging) {
          dragging = false;
          vp.classList.remove('panning');
        }
      });

      // Double-click to reset
      vp.addEventListener('dblclick', function() {
        resetDiagram(dId);
      });
    }

    // Wait for Mermaid to finish rendering SVGs
    setTimeout(function() {
      document.querySelectorAll('.mermaid-frame-viewport').forEach(setupViewport);
    }, 500);
  })();

  // \u2500\u2500 sidebar resize logic \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  (function initResize() {
    const handle = document.getElementById('resize-handle');
    const sidebar = document.getElementById('sidebar');
    if (!handle || !sidebar) { return; }
    let startX = 0;
    let startWidth = 0;

    function onMouseDown(e) {
      e.preventDefault();
      startX = e.clientX;
      startWidth = sidebar.getBoundingClientRect().width;
      handle.classList.add('active');
      document.body.classList.add('resizing');
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
      const delta = startX - e.clientX;
      const newWidth = Math.min(Math.max(startWidth + delta, 200), window.innerWidth * 0.7);
      sidebar.style.width = newWidth + 'px';
    }

    function onMouseUp() {
      handle.classList.remove('active');
      document.body.classList.remove('resizing');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    handle.addEventListener('mousedown', onMouseDown);
  })();

  // \u2500\u2500 helper: create a comment form \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function createCommentForm(opts) {
    const form = document.createElement('div');
    form.className = 'comment-form';

    const textarea = document.createElement('textarea');
    textarea.placeholder = opts.placeholder || 'Write a comment...';
    form.appendChild(textarea);

    const actions = document.createElement('div');
    actions.className = 'comment-form-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => form.remove());
    actions.appendChild(cancelBtn);

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn-submit';
    submitBtn.textContent = opts.submitLabel || 'Comment';
    submitBtn.addEventListener('click', () => {
      const text = textarea.value.trim();
      if (!text) { textarea.focus(); return; }
      opts.onSubmit(text);
      form.remove();
    });
    actions.appendChild(submitBtn);

    form.appendChild(actions);

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        submitBtn.click();
      }
    });

    return { form, textarea };
  }

  // \u2500\u2500 helper: expand/collapse thread \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function expandThread(block) {
    block.classList.add('focused');
    var divider = block.querySelector('.collapsed-divider');
    if (divider) { divider.style.display = 'none'; }
    block.querySelectorAll('.collapsed-entry').forEach(function(el) {
      el.style.display = '';
      el.classList.remove('collapsed-entry');
    });
  }

  function collapseThread(block) {
    if (!block.dataset.collapsible) { return; }
    block.classList.remove('focused');
    var entries = block.querySelectorAll('.comment-entry');
    if (entries.length <= 2) { return; }
    var divider = block.querySelector('.collapsed-divider');
    if (divider) {
      divider.style.display = '';
      var moreCount = entries.length - 2;
      divider.textContent = moreCount + ' more ' + (moreCount === 1 ? 'reply' : 'replies');
    }
    for (var i = 1; i < entries.length - 1; i++) {
      entries[i].style.display = 'none';
      entries[i].classList.add('collapsed-entry');
    }
  }

  // \u2500\u2500 auto-collapse on outside click \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.comment-thread-block.focused').forEach(function(block) {
      if (!block.contains(e.target)) {
        collapseThread(block);
      }
    });
  });

  // \u2500\u2500 text selection \u2192 floating toolbar \u2500\u2500\u2500\u2500\u2500\u2500
  let pendingSelection = null;

  function getContentTextOffset() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) { return 0; }
    const range = sel.getRangeAt(0);
    const preRange = document.createRange();
    preRange.selectNodeContents(contentEl);
    preRange.setEnd(range.startContainer, range.startOffset);
    return preRange.toString().length;
  }

  contentEl.addEventListener('mouseup', function(e) {
    setTimeout(function() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        toolbar.style.display = 'none';
        pendingSelection = null;
        return;
      }
      // Ensure selection is within #content
      const range = sel.getRangeAt(0);
      if (!contentEl.contains(range.commonAncestorContainer)) {
        toolbar.style.display = 'none';
        return;
      }
      // Don't show toolbar if selection is inside an existing comment-highlight
      if (range.commonAncestorContainer.parentElement &&
          range.commonAncestorContainer.parentElement.closest('.comment-highlight')) {
        toolbar.style.display = 'none';
        return;
      }
      pendingSelection = {
        text: sel.toString(),
        contentOffset: getContentTextOffset(),
      };
      // Position toolbar near the selection
      const rect = range.getBoundingClientRect();
      toolbar.style.display = 'block';
      toolbar.style.left = Math.max(4, rect.left + rect.width / 2 - 50) + 'px';
      toolbar.style.top = Math.max(4, rect.top - 40) + 'px';
    }, 10);
  });

  // Hide toolbar on scroll or click outside
  contentScroll.addEventListener('scroll', function() { toolbar.style.display = 'none'; });
  document.addEventListener('mousedown', function(e) {
    if (!toolbar.contains(e.target) && e.target !== toolbar) {
      toolbar.style.display = 'none';
    }
  });

  // Toolbar "Comment" button \u2192 open form in sidebar
  toolbarBtn.addEventListener('click', function() {
    if (!pendingSelection) { return; }
    const selData = pendingSelection;
    toolbar.style.display = 'none';

    // Create inline form at the top of sidebar
    const existing = sidebarContent.querySelector('.new-comment-form');
    if (existing) { existing.remove(); }

    const wrapper = document.createElement('div');
    wrapper.className = 'new-comment-form';
    wrapper.style.padding = '12px 16px';
    wrapper.style.borderBottom = '1px solid var(--vscode-widget-border, rgba(127,127,127,.12))';

    const excerpt = document.createElement('div');
    excerpt.className = 'thread-excerpt';
    excerpt.style.borderLeftColor = 'var(--vscode-textLink-foreground)';
    var excerptText = selData.text.length > 60 ? selData.text.substring(0, 60) + '\\u2026' : selData.text;
    excerpt.textContent = '\\u201C' + excerptText + '\\u201D';
    wrapper.appendChild(excerpt);

    const { form, textarea } = createCommentForm({
      placeholder: 'Comment on selected text...',
      submitLabel: 'Add Comment',
      onSubmit: function(text) {
        vscode.postMessage({
          command: 'addComment',
          selectedText: selData.text,
          contentOffset: selData.contentOffset,
          body: text,
        });
        wrapper.remove();
      }
    });
    // Augment cancel to also remove wrapper
    var cancelBtn = form.querySelector('.btn-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() { wrapper.remove(); });
    }
    wrapper.appendChild(form);
    sidebarContent.insertBefore(wrapper, sidebarContent.firstChild);
    textarea.focus();
  });

  // \u2500\u2500 highlight rendering \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function applyHighlights() {
    // Remove existing highlights
    contentEl.querySelectorAll('.comment-highlight').forEach(function(mark) {
      var parent = mark.parentNode;
      while (mark.firstChild) { parent.insertBefore(mark.firstChild, mark); }
      parent.removeChild(mark);
      parent.normalize();
    });

    // Apply highlights for each thread
    threads.forEach(function(thread, threadIndex) {
      var color = thread.color || getThreadColor(threadIndex);
      findAndWrapText(thread.selectedText, thread.occurrenceIndex, color, thread.id);
    });
  }

  function findAndWrapText(searchText, occurrenceIndex, color, threadId) {
    if (!contentEl || !searchText) { return; }

    // Build flat text map from DOM text nodes
    var walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        var parent = node.parentNode;
        while (parent && parent !== contentEl) {
          var tag = parent.nodeName.toLowerCase();
          if (tag === 'script' || tag === 'style') { return NodeFilter.FILTER_REJECT; }
          parent = parent.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var fullText = '';
    var nodes = [];
    var current;
    while ((current = walker.nextNode())) {
      nodes.push({ node: current, offset: fullText.length });
      fullText += current.textContent;
    }

    // Find Nth occurrence
    var found = 0;
    var pos = 0;
    var matchStart = -1;
    while (pos <= fullText.length - searchText.length) {
      var idx = fullText.indexOf(searchText, pos);
      if (idx === -1) { break; }
      if (found === occurrenceIndex) {
        matchStart = idx;
        break;
      }
      found++;
      pos = idx + 1;
    }

    if (matchStart === -1) { return; }
    var matchEnd = matchStart + searchText.length;

    // Find affected text nodes and wrap them
    var affected = [];
    for (var i = 0; i < nodes.length; i++) {
      var nd = nodes[i];
      var nodeEnd = nd.offset + nd.node.textContent.length;
      if (nodeEnd <= matchStart || nd.offset >= matchEnd) { continue; }
      affected.push(nd);
    }

    // Process in reverse to avoid offset shifts
    for (var j = affected.length - 1; j >= 0; j--) {
      var nd = affected[j];
      var nodeLen = nd.node.textContent.length;
      var wrapStart = Math.max(0, matchStart - nd.offset);
      var wrapEnd = Math.min(nodeLen, matchEnd - nd.offset);

      var text = nd.node.textContent;
      var before = text.substring(0, wrapStart);
      var middle = text.substring(wrapStart, wrapEnd);
      var after = text.substring(wrapEnd);

      var parent = nd.node.parentNode;
      var mark = document.createElement('mark');
      mark.className = 'comment-highlight';
      mark.dataset.threadId = threadId;
      mark.style.backgroundColor = color;
      mark.textContent = middle;

      if (after) {
        parent.insertBefore(document.createTextNode(after), nd.node.nextSibling);
      }
      parent.insertBefore(mark, nd.node.nextSibling);
      if (before) {
        nd.node.textContent = before;
      } else {
        parent.removeChild(nd.node);
      }
    }
  }

  // Apply highlights on load
  applyHighlights();

  // \u2500\u2500 click highlight \u2192 scroll to sidebar thread \u2500\u2500
  contentEl.addEventListener('click', function(e) {
    var mark = e.target.closest('.comment-highlight');
    if (!mark) { return; }
    var threadId = mark.dataset.threadId;
    var threadBlock = document.querySelector('.comment-thread-block[data-thread-id="' + threadId + '"]');
    if (threadBlock) {
      threadBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      threadBlock.classList.add('focused');
      if (threadBlock.dataset.collapsible === 'true') { expandThread(threadBlock); }
      // Remove active from other highlights
      contentEl.querySelectorAll('.comment-highlight.active').forEach(function(m) { m.classList.remove('active'); });
      contentEl.querySelectorAll('.comment-highlight[data-thread-id="' + threadId + '"]').forEach(function(m) { m.classList.add('active'); });
    }
  });

  // \u2500\u2500 build sidebar thread list \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  var emptyState = document.createElement('div');
  emptyState.className = 'sidebar-empty';
  emptyState.textContent = 'Select text in the document and click Comment to start a discussion.';

  if (threads.length === 0) {
    sidebarContent.appendChild(emptyState);
  }

  threads.forEach(function(thread, threadIndex) {
    var status = thread.status;
    var color = thread.color || getThreadColor(threadIndex);

    var block = document.createElement('div');
    block.className = 'comment-thread-block ' + status;
    block.dataset.threadId = thread.id;

    // Highlighted text excerpt
    var excerpt = document.createElement('div');
    excerpt.className = 'thread-excerpt';
    excerpt.style.borderLeftColor = color;
    var excerptText = thread.selectedText.length > 60 ? thread.selectedText.substring(0, 60) + '\\u2026' : thread.selectedText;
    excerpt.textContent = '\\u201C' + excerptText + '\\u201D';
    excerpt.addEventListener('click', function(e) {
      e.stopPropagation();
      // Scroll to the highlight in the content
      var marks = contentEl.querySelectorAll('.comment-highlight[data-thread-id="' + thread.id + '"]');
      if (marks.length > 0) {
        marks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        contentEl.querySelectorAll('.comment-highlight.active').forEach(function(m) { m.classList.remove('active'); });
        marks.forEach(function(m) { m.classList.add('active'); });
        setTimeout(function() { marks.forEach(function(m) { m.classList.remove('active'); }); }, 2000);
      }
    });
    block.appendChild(excerpt);

    // Status label (only shown for stale threads)
    var statusLabel = document.createElement('div');
    statusLabel.className = 'thread-status-label ' + status;
    if (status === 'stale') {
      var statusText = document.createElement('span');
      statusText.textContent = '\\u26A0 Text Changed';
      statusLabel.appendChild(statusText);
    }

    block.appendChild(statusLabel);

    // Comment entries
    var entryElements = [];
    thread.thread.forEach(function(entry) {
      var entryEl = document.createElement('div');
      entryEl.className = 'comment-entry';

      var header = document.createElement('div');
      header.className = 'comment-header';

      var authorSpan = document.createElement('span');
      authorSpan.className = 'comment-author';
      authorSpan.textContent = entry.author;
      header.appendChild(authorSpan);

      var time = document.createElement('span');
      time.className = 'comment-time';
      try { time.textContent = new Date(entry.created).toLocaleString(); }
      catch (_) { time.textContent = entry.created; }
      header.appendChild(time);

      entryEl.appendChild(header);

      var body = document.createElement('div');
      body.className = 'comment-body';
      body.textContent = entry.body;
      entryEl.appendChild(body);

      // Per-comment action links (only for the comment author)
      if (entry.author === currentUser) {
        var commentActions = document.createElement('div');
        commentActions.className = 'comment-actions';

        var editLink = document.createElement('button');
        editLink.className = 'action-link';
        editLink.textContent = 'Edit';
        editLink.addEventListener('click', function(e) {
          e.stopPropagation();
          var existing = entryEl.querySelector('.comment-form');
          if (existing) { existing.remove(); body.style.display = ''; return; }
          body.style.display = 'none';
          var result = createCommentForm({
            placeholder: 'Edit your comment...',
            submitLabel: 'Save',
            onSubmit: function(text) {
              vscode.postMessage({ command: 'editComment', threadId: thread.id, commentId: entry.id, body: text });
            }
          });
          result.textarea.value = entry.body;
          var formCancelBtn = result.form.querySelector('.btn-cancel');
          if (formCancelBtn) {
            formCancelBtn.addEventListener('click', function() { body.style.display = ''; });
          }
          entryEl.insertBefore(result.form, commentActions);
          result.textarea.focus();
        });
        commentActions.appendChild(editLink);

        var deleteLink = document.createElement('button');
        deleteLink.className = 'action-link';
        deleteLink.textContent = 'Delete';
        deleteLink.addEventListener('click', function(e) {
          e.stopPropagation();
          vscode.postMessage({ command: 'deleteComment', threadId: thread.id, commentId: entry.id });
        });
        commentActions.appendChild(deleteLink);

        entryEl.appendChild(commentActions);
      }

      entryElements.push(entryEl);
    });

    // Collapse/expand logic: show first & last, hide middle
    if (entryElements.length > 2) {
      block.appendChild(entryElements[0]);

      var divider = document.createElement('div');
      divider.className = 'collapsed-divider';
      var moreCount = entryElements.length - 2;
      divider.textContent = moreCount + ' more ' + (moreCount === 1 ? 'reply' : 'replies');
      divider.addEventListener('click', function(e) {
        e.stopPropagation();
        expandThread(block);
      });
      block.appendChild(divider);

      for (var i = 1; i < entryElements.length - 1; i++) {
        entryElements[i].classList.add('collapsed-entry');
        entryElements[i].style.display = 'none';
        block.appendChild(entryElements[i]);
      }

      block.appendChild(entryElements[entryElements.length - 1]);
      block.dataset.collapsible = 'true';
    } else {
      entryElements.forEach(function(el) { block.appendChild(el); });
    }

    // Auto-expand on click
    block.addEventListener('click', function() {
      if (block.dataset.collapsible === 'true' && !block.classList.contains('focused')) {
        expandThread(block);
      }
    });

    // Thread-level actions bar
    var actionsBar = document.createElement('div');
    actionsBar.className = 'thread-actions';

    var replyBtn = document.createElement('button');
    replyBtn.className = 'action-link';
    replyBtn.textContent = '\\u21A9 Reply';
    replyBtn.addEventListener('click', function() {
      var existing = block.querySelector('.comment-form');
      if (existing) { existing.remove(); return; }
      var result = createCommentForm({
        placeholder: 'Write a reply...',
        submitLabel: 'Reply',
        onSubmit: function(text) {
          vscode.postMessage({ command: 'replyComment', threadId: thread.id, body: text });
        }
      });
      block.appendChild(result.form);
      result.textarea.focus();
    });
    actionsBar.appendChild(replyBtn);

    // Delete Thread link \u2014 only for the thread creator
    if (thread.thread.length > 0 && thread.thread[0].author === currentUser) {
      var deleteThreadLink = document.createElement('button');
      deleteThreadLink.className = 'action-link';
      deleteThreadLink.textContent = '\\u2715 Delete Thread';
      deleteThreadLink.addEventListener('click', function() {
        vscode.postMessage({ command: 'deleteThread', threadId: thread.id });
      });
      actionsBar.appendChild(deleteThreadLink);
    }

    block.appendChild(actionsBar);
    sidebarContent.appendChild(block);
  });

  // \u2500\u2500 thread count badge \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  (function updateThreadCount() {
    var badge = document.getElementById('thread-count-badge');
    if (!badge) { return; }
    badge.textContent = String(threads.length);
    if (threads.length === 0) { badge.style.display = 'none'; }
  })();

  // \u2500\u2500 Find / Search feature \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  (function() {
    var findBar = document.getElementById('findBar');
    var findInput = document.getElementById('findInput');
    var findInfo = document.getElementById('findInfo');
    var findPrevBtn = document.getElementById('findPrev');
    var findNextBtn = document.getElementById('findNext');
    var findCloseBtn = document.getElementById('findClose');

    var matches = [];
    var currentMatch = -1;
    var originalContentHTML = '';

    function openFindBar() {
      originalContentHTML = originalContentHTML || contentEl.innerHTML;
      findBar.classList.add('visible');
      findInput.focus();
      findInput.select();
    }

    function closeFindBar() {
      findBar.classList.remove('visible');
      clearHighlights();
      findInput.value = '';
      findInfo.textContent = '';
      findPrevBtn.disabled = true;
      findNextBtn.disabled = true;
    }

    function clearHighlights() {
      if (originalContentHTML) {
        contentEl.innerHTML = originalContentHTML;
      }
      matches = [];
      currentMatch = -1;
    }

    function escapeRegex(str) {
      return str.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&');
    }

    function highlightMatches(query) {
      clearHighlights();
      if (!query) {
        findInfo.textContent = '';
        findPrevBtn.disabled = true;
        findNextBtn.disabled = true;
        return;
      }

      var escaped = escapeRegex(query);
      var regex = new RegExp('(' + escaped + ')', 'gi');

      var walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT, null);
      var textNodes = [];
      while (walker.nextNode()) { textNodes.push(walker.currentNode); }

      var matchIdx = 0;
      textNodes.forEach(function(node) {
        var parent = node.parentNode;
        if (!parent || parent.closest('.find-bar') || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') { return; }

        var text = node.nodeValue;
        if (!regex.test(text)) { return; }
        regex.lastIndex = 0;

        var fragment = document.createDocumentFragment();
        var lastIdx = 0;
        var m;
        while ((m = regex.exec(text)) !== null) {
          if (m.index > lastIdx) {
            fragment.appendChild(document.createTextNode(text.slice(lastIdx, m.index)));
          }
          var mk = document.createElement('mark');
          mk.className = 'search-highlight';
          mk.dataset.matchIndex = String(matchIdx++);
          mk.textContent = m[0];
          fragment.appendChild(mk);
          lastIdx = regex.lastIndex;
        }
        if (lastIdx < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIdx)));
        }
        parent.replaceChild(fragment, node);
      });

      matches = contentEl.querySelectorAll('.search-highlight');
      if (matches.length > 0) {
        currentMatch = 0;
        setActiveMatch(0);
        findPrevBtn.disabled = false;
        findNextBtn.disabled = false;
      } else {
        findInfo.textContent = 'No results';
        findPrevBtn.disabled = true;
        findNextBtn.disabled = true;
      }
    }

    function setActiveMatch(idx) {
      matches.forEach(function(m) { m.classList.remove('active'); });
      if (matches.length === 0) { return; }
      currentMatch = idx;
      var el = matches[currentMatch];
      el.classList.add('active');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      findInfo.textContent = (currentMatch + 1) + ' of ' + matches.length;
    }

    function goNext() {
      if (matches.length === 0) { return; }
      setActiveMatch((currentMatch + 1) % matches.length);
    }

    function goPrev() {
      if (matches.length === 0) { return; }
      setActiveMatch((currentMatch - 1 + matches.length) % matches.length);
    }

    var debounceTimer;
    findInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      if (originalContentHTML) { contentEl.innerHTML = originalContentHTML; }
      debounceTimer = setTimeout(function() {
        originalContentHTML = contentEl.innerHTML;
        highlightMatches(findInput.value);
      }, 200);
    });

    findInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); goNext(); }
      if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); goPrev(); }
      if (e.key === 'Escape') { e.preventDefault(); closeFindBar(); }
    });

    findPrevBtn.addEventListener('click', goPrev);
    findNextBtn.addEventListener('click', goNext);
    findCloseBtn.addEventListener('click', closeFindBar);

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        openFindBar();
      }
      if (e.key === 'Escape' && findBar.classList.contains('visible')) {
        closeFindBar();
      }
    });
  })();

})();
`;var S=M(require("vscode")),N=M(require("path"));var _r=class extends S.TreeItem{constructor(r,n,s){super(r,S.TreeItemCollapsibleState.None);this.label=r;this.uri=n;this.commentCount=s;this.resourceUri=n,this.tooltip=n.fsPath,this.contextValue="markdownFile",this.command={command:"markdownThreads.openPreview",title:"Open Preview",arguments:[n]},s>0&&(this.description=`${s} comment${s>1?"s":""}`),this.iconPath=new S.ThemeIcon("markdown")}label;uri;commentCount},yt=class extends S.TreeItem{constructor(r,n,s){super(r,S.TreeItemCollapsibleState.Expanded);this.label=r;this.folderPath=n;this.children=s;this.contextValue="folder",this.iconPath=S.ThemeIcon.Folder}label;folderPath;children};function Di(e){let t=e.filter(n=>n.length>0);return t.length===0?void 0:t.length===1?`**/${t[0]}/**`:`{${t.map(n=>`**/${n}/**`).join(",")}}`}var wt=class{_onDidChangeTreeData=new S.EventEmitter;onDidChangeTreeData=this._onDidChangeTreeData.event;fileWatcher;sidecarWatcher;configWatcher;selectedFolder;constructor(){this.fileWatcher=S.workspace.createFileSystemWatcher("**/*.md"),this.fileWatcher.onDidCreate(()=>this.refresh()),this.fileWatcher.onDidDelete(()=>this.refresh()),this.fileWatcher.onDidChange(()=>this.refresh()),this.sidecarWatcher=S.workspace.createFileSystemWatcher("**/*.comments.json"),this.sidecarWatcher.onDidCreate(()=>this.refresh()),this.sidecarWatcher.onDidDelete(()=>this.refresh()),this.sidecarWatcher.onDidChange(()=>this.refresh()),this.configWatcher=S.workspace.onDidChangeConfiguration(t=>{t.affectsConfiguration("markdownThreads.excludeFolders")&&this.refresh()})}async selectFolder(){let t=S.workspace.workspaceFolders?.[0]?.uri.fsPath;if(!t)return;let r=S.workspace.getConfiguration("markdownThreads").get("excludeFolders",[]),n=Di(r),s=await S.workspace.findFiles("**/*.md",n),i=new Set;i.add("");for(let p of s){let f=N.relative(t,p.fsPath),l=N.dirname(f);if(l!=="."){let h=l.split(N.sep),m="";for(let L of h)m=m?N.join(m,L):L,i.add(m)}}let a=[{label:"$(home) All Folders",description:"Show all markdown files",detail:""}],o=Array.from(i).filter(p=>p!=="").sort();for(let p of o)a.push({label:`$(folder) ${p}`,description:"",detail:p});let c=await S.window.showQuickPick(a,{placeHolder:"Select a folder to filter markdown files",title:"Filter by Folder"});c&&(this.selectedFolder=c.detail||void 0,this.refresh())}getSelectedFolderName(){return this.selectedFolder||"All Folders"}refresh(){this._onDidChangeTreeData.fire()}getTreeItem(t){return t}async getChildren(t){if(!S.workspace.workspaceFolders)return[];if(t instanceof yt)return t.children;if(t)return[];let r=S.workspace.workspaceFolders[0].uri.fsPath,n=this.selectedFolder?`${this.selectedFolder}/**/*.md`:"**/*.md",s=S.workspace.getConfiguration("markdownThreads").get("excludeFolders",[]),i=Di(s),a=await S.workspace.findFiles(n,i);if(this.selectedFolder){let c=N.join(r,this.selectedFolder);a=a.filter(p=>p.fsPath.startsWith(c))}return a.length===0?[]:await this.buildTree(a)}async buildTree(t){let r=S.workspace.workspaceFolders?.[0]?.uri.fsPath??"",n=new Map;for(let a of t){let o=N.relative(r,a.fsPath),c=N.dirname(o),p=c==="."?"":c;n.has(p)||n.set(p,[]),n.get(p).push(a)}let s=Array.from(n.keys()).sort(),i=[];for(let a of s){let o=n.get(a);o.sort((p,f)=>N.basename(p.fsPath).localeCompare(N.basename(f.fsPath)));let c=[];for(let p of o){let f=await this.getCommentCount(p.fsPath);c.push(new _r(N.basename(p.fsPath),p,f))}a===""?i.push(...c):i.push(new yt(a,N.join(r,a),c))}return i}async getCommentCount(t){return(await I.readSidecar(t))?.comments.length??0}dispose(){this.fileWatcher?.dispose(),this.sidecarWatcher?.dispose(),this.configWatcher?.dispose(),this._onDidChangeTreeData.dispose()}};var ge;async function rl(e){console.log("[MarkdownThreads] Extension activating..."),console.log("[MarkdownThreads] Workspace folders:",X.workspace.workspaceFolders?.map(r=>r.uri.fsPath)),Ie.setExtensionUri(e.extensionUri),ge=new wt;let t=X.window.createTreeView("markdownThreads.files",{treeDataProvider:ge,showCollapseAll:!0});e.subscriptions.push(t),e.subscriptions.push({dispose:()=>ge.dispose()}),ge.onDidChangeTreeData(()=>{t.description=ge.getSelectedFolderName()}),e.subscriptions.push(X.commands.registerCommand("markdownThreads.refreshFiles",()=>ge.refresh()),X.commands.registerCommand("markdownThreads.selectFolder",()=>ge.selectFolder()),X.commands.registerCommand("markdownThreads.openPreview",async r=>{let n;if(r){n=await X.workspace.openTextDocument(r);for(let s of X.window.tabGroups.all)for(let i of s.tabs){let a=i.input?.uri;a&&a.toString()===r.toString()&&await X.window.tabGroups.close(i)}await Ie.show(n);return}else{let s=X.window.activeTextEditor;s&&s.document.languageId==="markdown"&&(n=s.document)}if(!n||n.languageId!=="markdown"){X.window.showWarningMessage("Open a markdown file to preview with comments");return}await Ie.show(n)}));try{await se.initialize()}catch(r){console.error("[MarkdownThreads] Git initialization failed:",r)}}function nl(){}0&&(module.exports={activate,deactivate});
