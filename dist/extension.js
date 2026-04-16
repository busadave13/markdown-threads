"use strict";var Vi=Object.create;var Ue=Object.defineProperty;var Ki=Object.getOwnPropertyDescriptor;var Ji=Object.getOwnPropertyNames;var Qi=Object.getPrototypeOf,Zi=Object.prototype.hasOwnProperty;var Z=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),ea=(e,t)=>{for(var r in t)Ue(e,r,{get:t[r],enumerable:!0})},_r=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Ji(t))!Zi.call(e,s)&&s!==r&&Ue(e,s,{get:()=>t[s],enumerable:!(n=Ki(t,s))||n.enumerable});return e};var U=(e,t,r)=>(r=e!=null?Vi(Qi(e)):{},_r(t||!e||!e.__esModule?Ue(r,"default",{value:e,enumerable:!0}):r,e)),ta=e=>_r(Ue({},"__esModule",{value:!0}),e);var Er=Z((Vu,Sr)=>{var ge=1e3,ve=ge*60,be=ve*60,oe=be*24,ra=oe*7,na=oe*365.25;Sr.exports=function(e,t){t=t||{};var r=typeof e;if(r==="string"&&e.length>0)return sa(e);if(r==="number"&&isFinite(e))return t.long?aa(e):ia(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))};function sa(e){if(e=String(e),!(e.length>100)){var t=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);if(t){var r=parseFloat(t[1]),n=(t[2]||"ms").toLowerCase();switch(n){case"years":case"year":case"yrs":case"yr":case"y":return r*na;case"weeks":case"week":case"w":return r*ra;case"days":case"day":case"d":return r*oe;case"hours":case"hour":case"hrs":case"hr":case"h":return r*be;case"minutes":case"minute":case"mins":case"min":case"m":return r*ve;case"seconds":case"second":case"secs":case"sec":case"s":return r*ge;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return r;default:return}}}}function ia(e){var t=Math.abs(e);return t>=oe?Math.round(e/oe)+"d":t>=be?Math.round(e/be)+"h":t>=ve?Math.round(e/ve)+"m":t>=ge?Math.round(e/ge)+"s":e+"ms"}function aa(e){var t=Math.abs(e);return t>=oe?je(e,t,oe,"day"):t>=be?je(e,t,be,"hour"):t>=ve?je(e,t,ve,"minute"):t>=ge?je(e,t,ge,"second"):e+" ms"}function je(e,t,r,n){var s=t>=r*1.5;return Math.round(e/r)+" "+n+(s?"s":"")}});var wt=Z((Ku,Ir)=>{function oa(e){r.debug=r,r.default=r,r.coerce=u,r.disable=a,r.enable=s,r.enabled=o,r.humanize=Er(),r.destroy=d,Object.keys(e).forEach(m=>{r[m]=e[m]}),r.names=[],r.skips=[],r.formatters={};function t(m){let h=0;for(let p=0;p<m.length;p++)h=(h<<5)-h+m.charCodeAt(p),h|=0;return r.colors[Math.abs(h)%r.colors.length]}r.selectColor=t;function r(m){let h,p=null,f,F;function w(...C){if(!w.enabled)return;let B=w,he=Number(new Date),gt=he-(h||he);B.diff=gt,B.prev=h,B.curr=he,h=he,C[0]=r.coerce(C[0]),typeof C[0]!="string"&&C.unshift("%O");let pe=0;C[0]=C[0].replace(/%([a-zA-Z%])/g,(Ie,vt)=>{if(Ie==="%%")return"%";pe++;let Ne=r.formatters[vt];if(typeof Ne=="function"){let bt=C[pe];Ie=Ne.call(B,bt),C.splice(pe,1),pe--}return Ie}),r.formatArgs.call(B,C),(B.log||r.log).apply(B,C)}return w.namespace=m,w.useColors=r.useColors(),w.color=r.selectColor(m),w.extend=n,w.destroy=r.destroy,Object.defineProperty(w,"enabled",{enumerable:!0,configurable:!1,get:()=>p!==null?p:(f!==r.namespaces&&(f=r.namespaces,F=r.enabled(m)),F),set:C=>{p=C}}),typeof r.init=="function"&&r.init(w),w}function n(m,h){let p=r(this.namespace+(typeof h>"u"?":":h)+m);return p.log=this.log,p}function s(m){r.save(m),r.namespaces=m,r.names=[],r.skips=[];let h=(typeof m=="string"?m:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let p of h)p[0]==="-"?r.skips.push(p.slice(1)):r.names.push(p)}function i(m,h){let p=0,f=0,F=-1,w=0;for(;p<m.length;)if(f<h.length&&(h[f]===m[p]||h[f]==="*"))h[f]==="*"?(F=f,w=p,f++):(p++,f++);else if(F!==-1)f=F+1,w++,p=w;else return!1;for(;f<h.length&&h[f]==="*";)f++;return f===h.length}function a(){let m=[...r.names,...r.skips.map(h=>"-"+h)].join(",");return r.enable(""),m}function o(m){for(let h of r.skips)if(i(m,h))return!1;for(let h of r.names)if(i(m,h))return!0;return!1}function u(m){return m instanceof Error?m.stack||m.message:m}function d(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return r.enable(r.load()),r}Ir.exports=oa});var Or=Z(($,$e)=>{$.formatArgs=ua;$.save=la;$.load=da;$.useColors=ca;$.storage=fa();$.destroy=(()=>{let e=!1;return()=>{e||(e=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();$.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function ca(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let e;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(e=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(e[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function ua(e){if(e[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+e[0]+(this.useColors?"%c ":" ")+"+"+$e.exports.humanize(this.diff),!this.useColors)return;let t="color: "+this.color;e.splice(1,0,t,"color: inherit");let r=0,n=0;e[0].replace(/%[a-zA-Z%]/g,s=>{s!=="%%"&&(r++,s==="%c"&&(n=r))}),e.splice(n,0,t)}$.log=console.debug||console.log||(()=>{});function la(e){try{e?$.storage.setItem("debug",e):$.storage.removeItem("debug")}catch{}}function da(){let e;try{e=$.storage.getItem("debug")||$.storage.getItem("DEBUG")}catch{}return!e&&typeof process<"u"&&"env"in process&&(e=process.env.DEBUG),e}function fa(){try{return localStorage}catch{}}$e.exports=wt()($);var{formatters:ma}=$e.exports;ma.j=function(e){try{return JSON.stringify(e)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}}});var Fr=Z((Ju,Rr)=>{"use strict";Rr.exports=(e,t)=>{t=t||process.argv;let r=e.startsWith("-")?"":e.length===1?"-":"--",n=t.indexOf(r+e),s=t.indexOf("--");return n!==-1&&(s===-1?!0:n<s)}});var Mr=Z((Qu,Pr)=>{"use strict";var ha=require("os"),J=Fr(),A=process.env,ye;J("no-color")||J("no-colors")||J("color=false")?ye=!1:(J("color")||J("colors")||J("color=true")||J("color=always"))&&(ye=!0);"FORCE_COLOR"in A&&(ye=A.FORCE_COLOR.length===0||parseInt(A.FORCE_COLOR,10)!==0);function pa(e){return e===0?!1:{level:e,hasBasic:!0,has256:e>=2,has16m:e>=3}}function ga(e){if(ye===!1)return 0;if(J("color=16m")||J("color=full")||J("color=truecolor"))return 3;if(J("color=256"))return 2;if(e&&!e.isTTY&&ye!==!0)return 0;let t=ye?1:0;if(process.platform==="win32"){let r=ha.release().split(".");return Number(process.versions.node.split(".")[0])>=8&&Number(r[0])>=10&&Number(r[2])>=10586?Number(r[2])>=14931?3:2:1}if("CI"in A)return["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI"].some(r=>r in A)||A.CI_NAME==="codeship"?1:t;if("TEAMCITY_VERSION"in A)return/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(A.TEAMCITY_VERSION)?1:0;if(A.COLORTERM==="truecolor")return 3;if("TERM_PROGRAM"in A){let r=parseInt((A.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(A.TERM_PROGRAM){case"iTerm.app":return r>=3?3:2;case"Apple_Terminal":return 2}}return/-256(color)?$/i.test(A.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(A.TERM)||"COLORTERM"in A?1:(A.TERM==="dumb",t)}function kt(e){let t=ga(e);return pa(t)}Pr.exports={supportsColor:kt,stdout:kt(process.stdout),stderr:kt(process.stderr)}});var Ar=Z((P,Ge)=>{var va=require("tty"),We=require("util");P.init=Ca;P.log=ka;P.formatArgs=ya;P.save=xa;P.load=Ta;P.useColors=ba;P.destroy=We.deprecate(()=>{},"Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");P.colors=[6,2,3,4,5,1];try{let e=Mr();e&&(e.stderr||e).level>=2&&(P.colors=[20,21,26,27,32,33,38,39,40,41,42,43,44,45,56,57,62,63,68,69,74,75,76,77,78,79,80,81,92,93,98,99,112,113,128,129,134,135,148,149,160,161,162,163,164,165,166,167,168,169,170,171,172,173,178,179,184,185,196,197,198,199,200,201,202,203,204,205,206,207,208,209,214,215,220,221])}catch{}P.inspectOpts=Object.keys(process.env).filter(e=>/^debug_/i.test(e)).reduce((e,t)=>{let r=t.substring(6).toLowerCase().replace(/_([a-z])/g,(s,i)=>i.toUpperCase()),n=process.env[t];return/^(yes|on|true|enabled)$/i.test(n)?n=!0:/^(no|off|false|disabled)$/i.test(n)?n=!1:n==="null"?n=null:n=Number(n),e[r]=n,e},{});function ba(){return"colors"in P.inspectOpts?!!P.inspectOpts.colors:va.isatty(process.stderr.fd)}function ya(e){let{namespace:t,useColors:r}=this;if(r){let n=this.color,s="\x1B[3"+(n<8?n:"8;5;"+n),i=`  ${s};1m${t} \x1B[0m`;e[0]=i+e[0].split(`
`).join(`
`+i),e.push(s+"m+"+Ge.exports.humanize(this.diff)+"\x1B[0m")}else e[0]=wa()+t+" "+e[0]}function wa(){return P.inspectOpts.hideDate?"":new Date().toISOString()+" "}function ka(...e){return process.stderr.write(We.formatWithOptions(P.inspectOpts,...e)+`
`)}function xa(e){e?process.env.DEBUG=e:delete process.env.DEBUG}function Ta(){return process.env.DEBUG}function Ca(e){e.inspectOpts={};let t=Object.keys(P.inspectOpts);for(let r=0;r<t.length;r++)e.inspectOpts[t[r]]=P.inspectOpts[t[r]]}Ge.exports=wt()(P);var{formatters:Lr}=Ge.exports;Lr.o=function(e){return this.inspectOpts.colors=this.useColors,We.inspect(e,this.inspectOpts).split(`
`).map(t=>t.trim()).join(" ")};Lr.O=function(e){return this.inspectOpts.colors=this.useColors,We.inspect(e,this.inspectOpts)}});var Tt=Z((Zu,xt)=>{typeof process>"u"||process.type==="renderer"||process.browser===!0||process.__nwjs?xt.exports=Or():xt.exports=Ar()});var Dr=Z(q=>{"use strict";var _a=q&&q.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(q,"__esModule",{value:!0});var Sa=require("fs"),Ea=_a(Tt()),we=Ea.default("@kwsites/file-exists");function Ia(e,t,r){we("checking %s",e);try{let n=Sa.statSync(e);return n.isFile()&&t?(we("[OK] path represents a file"),!0):n.isDirectory()&&r?(we("[OK] path represents a directory"),!0):(we("[FAIL] path represents something other than a file or directory"),!1)}catch(n){if(n.code==="ENOENT")return we("[FAIL] path is not accessible: %o",n),!1;throw we("[FATAL] %o",n),n}}function Oa(e,t=q.READABLE){return Ia(e,(t&q.FILE)>0,(t&q.FOLDER)>0)}q.exists=Oa;q.FILE=1;q.FOLDER=2;q.READABLE=q.FILE+q.FOLDER});var Br=Z(He=>{"use strict";function Ra(e){for(var t in e)He.hasOwnProperty(t)||(He[t]=e[t])}Object.defineProperty(He,"__esModule",{value:!0});Ra(Dr())});var _t=Z(ce=>{"use strict";Object.defineProperty(ce,"__esModule",{value:!0});ce.createDeferred=ce.deferred=void 0;function Ct(){let e,t,r="pending";return{promise:new Promise((s,i)=>{e=s,t=i}),done(s){r==="pending"&&(r="resolved",e(s))},fail(s){r==="pending"&&(r="rejected",t(s))},get fulfilled(){return r!=="pending"},get status(){return r}}}ce.deferred=Ct;ce.createDeferred=Ct;ce.default=Ct});var Xu={};ea(Xu,{activate:()=>qu,deactivate:()=>zu});module.exports=ta(Xu);var Y=U(require("vscode"));var ki=U(require("vscode")),pr=require("child_process");var bn=require("node:buffer"),rt=U(Br(),1),Ze=U(Tt(),1),cs=require("child_process"),qs=U(_t(),1),ri=require("node:path"),ke=U(_t(),1),yi=require("node:events"),zt=Object.defineProperty,Fa=Object.getOwnPropertyDescriptor,Xt=Object.getOwnPropertyNames,Pa=Object.prototype.hasOwnProperty,l=(e,t)=>function(){return e&&(t=(0,e[Xt(e)[0]])(e=0)),t},Ma=(e,t)=>function(){return t||(0,e[Xt(e)[0]])((t={exports:{}}).exports,t),t.exports},R=(e,t)=>{for(var r in t)zt(e,r,{get:t[r],enumerable:!0})},La=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Xt(t))!Pa.call(e,s)&&s!==r&&zt(e,s,{get:()=>t[s],enumerable:!(n=Fa(t,s))||n.enumerable});return e},S=e=>La(zt({},"__esModule",{value:!0}),e);function Aa(...e){let t=new String(e);return tt.set(t,e),t}function Ke(e){return e instanceof String&&tt.has(e)}function Nr(e){return tt.get(e)||[]}var tt,Pe=l({"src/lib/args/pathspec.ts"(){"use strict";tt=new WeakMap}}),re,ae=l({"src/lib/errors/git-error.ts"(){"use strict";re=class extends Error{constructor(e,t){super(t),this.task=e,Object.setPrototypeOf(this,new.target.prototype)}}}}),Me,Te=l({"src/lib/errors/git-response-error.ts"(){"use strict";ae(),Me=class extends re{constructor(e,t){super(void 0,t||String(e)),this.git=e}}}}),gn,vn=l({"src/lib/errors/task-configuration-error.ts"(){"use strict";ae(),gn=class extends re{constructor(e){super(void 0,e)}}}});function yn(e){return typeof e!="function"?de:e}function wn(e){return typeof e=="function"&&e!==de}function kn(e,t){let r=e.indexOf(t);return r<=0?[e,""]:[e.substr(0,r),e.substr(r+1)]}function xn(e,t=0){return Tn(e)&&e.length>t?e[t]:void 0}function le(e,t=0){if(Tn(e)&&e.length>t)return e[e.length-1-t]}function Tn(e){return at(e)}function Le(e="",t=!0,r=`
`){return e.split(r).reduce((n,s)=>{let i=t?s.trim():s;return i&&n.push(i),n},[])}function Yt(e,t){return Le(e,!0).map(r=>t(r))}function Vt(e){return(0,rt.exists)(e,rt.FOLDER)}function V(e,t){return Array.isArray(e)?e.includes(t)||e.push(t):e.add(t),t}function Cn(e,t){return Array.isArray(e)&&!e.includes(t)&&e.push(t),e}function nt(e,t){if(Array.isArray(e)){let r=e.indexOf(t);r>=0&&e.splice(r,1)}else e.delete(t);return t}function ee(e){return Array.isArray(e)?e:[e]}function _n(e){return e.replace(/[\s-]+(.)/g,(t,r)=>r.toUpperCase())}function Ce(e){return ee(e).map(t=>t instanceof String?t:String(t))}function x(e,t=0){if(e==null)return t;let r=parseInt(e,10);return Number.isNaN(r)?t:r}function Re(e,t){let r=[];for(let n=0,s=e.length;n<s;n++)r.push(t,e[n]);return r}function Fe(e){return(Array.isArray(e)?bn.Buffer.concat(e):e).toString("utf-8")}function Sn(e,t){let r={};return t.forEach(n=>{e[n]!==void 0&&(r[n]=e[n])}),r}function Pt(e=0){return new Promise(t=>setTimeout(t,e))}function Mt(e){if(e!==!1)return e}var xe,de,Ae,st=l({"src/lib/utils/util.ts"(){"use strict";Kt(),xe="\0",de=()=>{},Ae=Object.prototype.toString.call.bind(Object.prototype.toString)}});function X(e,t,r){return t(e)?e:arguments.length>2?r:void 0}function Lt(e,t){let r=Ke(e)?"string":typeof e;return/number|string|boolean/.test(r)&&(!t||!t.includes(r))}function it(e){return!!e&&Ae(e)==="[object Object]"}function En(e){return typeof e=="function"}var De,In,M,Je,at,Kt=l({"src/lib/utils/argument-filters.ts"(){"use strict";Pe(),st(),De=e=>Array.isArray(e),In=e=>typeof e=="number",M=e=>typeof e=="string",Je=e=>M(e)||Array.isArray(e)&&e.every(M),at=e=>e==null||"number|boolean|function".includes(typeof e)?!1:typeof e.length=="number"}}),At,Da=l({"src/lib/utils/exit-codes.ts"(){"use strict";At=(e=>(e[e.SUCCESS=0]="SUCCESS",e[e.ERROR=1]="ERROR",e[e.NOT_FOUND=-2]="NOT_FOUND",e[e.UNCLEAN=128]="UNCLEAN",e))(At||{})}}),Qe,Ba=l({"src/lib/utils/git-output-streams.ts"(){"use strict";Qe=class On{constructor(t,r){this.stdOut=t,this.stdErr=r}asStrings(){return new On(this.stdOut.toString("utf8"),this.stdErr.toString("utf8"))}}}});function Na(){throw new Error("LineParser:useMatches not implemented")}var y,ie,Ua=l({"src/lib/utils/line-parser.ts"(){"use strict";y=class{constructor(e,t){this.matches=[],this.useMatches=Na,this.parse=(r,n)=>(this.resetMatches(),this._regExp.every((s,i)=>this.addMatch(s,i,r(i)))?this.useMatches(n,this.prepareMatches())!==!1:!1),this._regExp=Array.isArray(e)?e:[e],t&&(this.useMatches=t)}resetMatches(){this.matches.length=0}prepareMatches(){return this.matches}addMatch(e,t,r){let n=r&&e.exec(r);return n&&this.pushMatch(t,n),!!n}pushMatch(e,t){this.matches.push(...t.slice(1))}},ie=class extends y{addMatch(e,t,r){return/^remote:\s/.test(String(r))&&super.addMatch(e,t,r)}pushMatch(e,t){(e>0||t.length>1)&&super.pushMatch(e,t)}}}});function Rn(...e){let t=process.cwd(),r=Object.assign({baseDir:t,...Fn},...e.filter(n=>typeof n=="object"&&n));return r.baseDir=r.baseDir||t,r.trimmed=r.trimmed===!0,r}var Fn,ja=l({"src/lib/utils/simple-git-options.ts"(){"use strict";Fn={binary:"git",maxConcurrentProcesses:5,config:[],trimmed:!1}}});function Jt(e,t=[]){return it(e)?Object.keys(e).reduce((r,n)=>{let s=e[n];if(Ke(s))r.push(s);else if(Lt(s,["boolean"]))r.push(n+"="+s);else if(Array.isArray(s))for(let i of s)Lt(i,["string","number"])||r.push(n+"="+i);else r.push(n);return r},t):t}function W(e,t=0,r=!1){let n=[];for(let s=0,i=t<0?e.length:t;s<i;s++)"string|number".includes(typeof e[s])&&n.push(String(e[s]));return Jt(Qt(e),n),r||n.push(...$a(e)),n}function $a(e){let t=typeof le(e)=="function";return Ce(X(le(e,t?1:0),De,[]))}function Qt(e){let t=En(le(e));return X(le(e,t?1:0),it)}function E(e,t=!0){let r=yn(le(e));return t||wn(r)?r:void 0}var Wa=l({"src/lib/utils/task-options.ts"(){"use strict";Kt(),st(),Pe()}});function Dt(e,t){return e(t.stdOut,t.stdErr)}function H(e,t,r,n=!0){return ee(r).forEach(s=>{for(let i=Le(s,n),a=0,o=i.length;a<o;a++){let u=(d=0)=>{if(!(a+d>=o))return i[a+d]};t.some(({parse:d})=>d(u,e))}}),e}var Ga=l({"src/lib/utils/task-parser.ts"(){"use strict";st()}}),Pn={};R(Pn,{ExitCodes:()=>At,GitOutputStreams:()=>Qe,LineParser:()=>y,NOOP:()=>de,NULL:()=>xe,RemoteLineParser:()=>ie,append:()=>V,appendTaskOptions:()=>Jt,asArray:()=>ee,asCamelCase:()=>_n,asFunction:()=>yn,asNumber:()=>x,asStringArray:()=>Ce,bufferToString:()=>Fe,callTaskParser:()=>Dt,createInstanceConfig:()=>Rn,delay:()=>Pt,filterArray:()=>De,filterFunction:()=>En,filterHasLength:()=>at,filterNumber:()=>In,filterPlainObject:()=>it,filterPrimitives:()=>Lt,filterString:()=>M,filterStringOrStringArray:()=>Je,filterType:()=>X,first:()=>xn,folderExists:()=>Vt,forEachLineWithContent:()=>Yt,getTrailingOptions:()=>W,including:()=>Cn,isUserFunction:()=>wn,last:()=>le,objectToString:()=>Ae,orVoid:()=>Mt,parseStringResponse:()=>H,pick:()=>Sn,prefixedArray:()=>Re,remove:()=>nt,splitOn:()=>kn,toLinesWithContent:()=>Le,trailingFunctionArgument:()=>E,trailingOptionsArgument:()=>Qt});var b=l({"src/lib/utils/index.ts"(){"use strict";Kt(),Da(),Ba(),Ua(),ja(),Wa(),Ga(),st()}}),Mn={};R(Mn,{CheckRepoActions:()=>Bt,checkIsBareRepoTask:()=>An,checkIsRepoRootTask:()=>Ln,checkIsRepoTask:()=>Ha});function Ha(e){switch(e){case"bare":return An();case"root":return Ln()}return{commands:["rev-parse","--is-inside-work-tree"],format:"utf-8",onError:ot,parser:Zt}}function Ln(){return{commands:["rev-parse","--git-dir"],format:"utf-8",onError:ot,parser(t){return/^\.(git)?$/.test(t.trim())}}}function An(){return{commands:["rev-parse","--is-bare-repository"],format:"utf-8",onError:ot,parser:Zt}}function qa(e){return/(Not a git repository|Kein Git-Repository)/i.test(String(e))}var Bt,ot,Zt,Dn=l({"src/lib/tasks/check-is-repo.ts"(){"use strict";b(),Bt=(e=>(e.BARE="bare",e.IN_TREE="tree",e.IS_REPO_ROOT="root",e))(Bt||{}),ot=({exitCode:e},t,r,n)=>{if(e===128&&qa(t))return r(Buffer.from("false"));n(t)},Zt=e=>e.trim()==="true"}});function za(e,t){let r=new Bn(e),n=e?Un:Nn;return Le(t).forEach(s=>{let i=s.replace(n,"");r.paths.push(i),(jn.test(i)?r.folders:r.files).push(i)}),r}var Bn,Nn,Un,jn,Xa=l({"src/lib/responses/CleanSummary.ts"(){"use strict";b(),Bn=class{constructor(e){this.dryRun=e,this.paths=[],this.files=[],this.folders=[]}},Nn=/^[a-z]+\s*/i,Un=/^[a-z]+\s+[a-z]+\s*/i,jn=/\/$/}}),Nt={};R(Nt,{EMPTY_COMMANDS:()=>ct,adhocExecTask:()=>$n,configurationErrorTask:()=>G,isBufferTask:()=>Gn,isEmptyTask:()=>Hn,straightThroughBufferTask:()=>Wn,straightThroughStringTask:()=>j});function $n(e){return{commands:ct,format:"empty",parser:e}}function G(e){return{commands:ct,format:"empty",parser(){throw typeof e=="string"?new gn(e):e}}}function j(e,t=!1){return{commands:e,format:"utf-8",parser(r){return t?String(r).trim():r}}}function Wn(e){return{commands:e,format:"buffer",parser(t){return t}}}function Gn(e){return e.format==="buffer"}function Hn(e){return e.format==="empty"||!e.commands.length}var ct,O=l({"src/lib/tasks/task.ts"(){"use strict";vn(),ct=[]}}),qn={};R(qn,{CONFIG_ERROR_INTERACTIVE_MODE:()=>er,CONFIG_ERROR_MODE_REQUIRED:()=>tr,CONFIG_ERROR_UNKNOWN_OPTION:()=>rr,CleanOptions:()=>ze,cleanTask:()=>zn,cleanWithOptionsTask:()=>Ya,isCleanOptionsArray:()=>Va});function Ya(e,t){let{cleanMode:r,options:n,valid:s}=Ka(e);return r?s.options?(n.push(...t),n.some(Za)?G(er):zn(r,n)):G(rr+JSON.stringify(e)):G(tr)}function zn(e,t){return{commands:["clean",`-${e}`,...t],format:"utf-8",parser(n){return za(e==="n",n)}}}function Va(e){return Array.isArray(e)&&e.every(t=>nr.has(t))}function Ka(e){let t,r=[],n={cleanMode:!1,options:!0};return e.replace(/[^a-z]i/g,"").split("").forEach(s=>{Ja(s)?(t=s,n.cleanMode=!0):n.options=n.options&&Qa(r[r.length]=`-${s}`)}),{cleanMode:t,options:r,valid:n}}function Ja(e){return e==="f"||e==="n"}function Qa(e){return/^-[a-z]$/i.test(e)&&nr.has(e.charAt(1))}function Za(e){return/^-[^\-]/.test(e)?e.indexOf("i")>0:e==="--interactive"}var er,tr,rr,ze,nr,Xn=l({"src/lib/tasks/clean.ts"(){"use strict";Xa(),b(),O(),er="Git clean interactive mode is not supported",tr='Git clean mode parameter ("n" or "f") is required',rr="Git clean unknown option found in: ",ze=(e=>(e.DRY_RUN="n",e.FORCE="f",e.IGNORED_INCLUDED="x",e.IGNORED_ONLY="X",e.EXCLUDING="e",e.QUIET="q",e.RECURSIVE="d",e))(ze||{}),nr=new Set(["i",...Ce(Object.values(ze))])}});function eo(e){let t=new Vn;for(let r of Yn(e))t.addValue(r.file,String(r.key),r.value);return t}function to(e,t){let r=null,n=[],s=new Map;for(let i of Yn(e,t))i.key===t&&(n.push(r=i.value),s.has(i.file)||s.set(i.file,[]),s.get(i.file).push(r));return{key:t,paths:Array.from(s.keys()),scopes:s,value:r,values:n}}function ro(e){return e.replace(/^(file):/,"")}function*Yn(e,t=null){let r=e.split("\0");for(let n=0,s=r.length-1;n<s;){let i=ro(r[n++]),a=r[n++],o=t;if(a.includes(`
`)){let u=kn(a,`
`);o=u[0],a=u[1]}yield{file:i,key:o,value:a}}}var Vn,no=l({"src/lib/responses/ConfigList.ts"(){"use strict";b(),Vn=class{constructor(){this.files=[],this.values=Object.create(null)}get all(){return this._all||(this._all=this.files.reduce((e,t)=>Object.assign(e,this.values[t]),{})),this._all}addFile(e){if(!(e in this.values)){let t=le(this.files);this.values[e]=t?Object.create(this.values[t]):{},this.files.push(e)}return this.values[e]}addValue(e,t,r){let n=this.addFile(e);Object.hasOwn(n,t)?Array.isArray(n[t])?n[t].push(r):n[t]=[n[t],r]:n[t]=r,this._all=void 0}}}});function St(e,t){return typeof e=="string"&&Object.hasOwn(Ut,e)?e:t}function so(e,t,r,n){let s=["config",`--${n}`];return r&&s.push("--add"),s.push(e,t),{commands:s,format:"utf-8",parser(i){return i}}}function io(e,t){let r=["config","--null","--show-origin","--get-all",e];return t&&r.splice(1,0,`--${t}`),{commands:r,format:"utf-8",parser(n){return to(n,e)}}}function ao(e){let t=["config","--list","--show-origin","--null"];return e&&t.push(`--${e}`),{commands:t,format:"utf-8",parser(r){return eo(r)}}}function oo(){return{addConfig(e,t,...r){return this._runTask(so(e,t,r[0]===!0,St(r[1],"local")),E(arguments))},getConfig(e,t){return this._runTask(io(e,St(t,void 0)),E(arguments))},listConfig(...e){return this._runTask(ao(St(e[0],void 0)),E(arguments))}}}var Ut,Kn=l({"src/lib/tasks/config.ts"(){"use strict";no(),b(),Ut=(e=>(e.system="system",e.global="global",e.local="local",e.worktree="worktree",e))(Ut||{})}});function co(e){return Jn.has(e)}var Et,Jn,Qn=l({"src/lib/tasks/diff-name-status.ts"(){"use strict";Et=(e=>(e.ADDED="A",e.COPIED="C",e.DELETED="D",e.MODIFIED="M",e.RENAMED="R",e.CHANGED="T",e.UNMERGED="U",e.UNKNOWN="X",e.BROKEN="B",e))(Et||{}),Jn=new Set(Object.values(Et))}});function uo(...e){return new es().param(...e)}function lo(e){let t=new Set,r={};return Yt(e,n=>{let[s,i,a]=n.split(xe);t.add(s),(r[s]=r[s]||[]).push({line:x(i),path:s,preview:a})}),{paths:t,results:r}}function fo(){return{grep(e){let t=E(arguments),r=W(arguments);for(let s of Zn)if(r.includes(s))return this._runTask(G(`git.grep: use of "${s}" is not supported.`),t);typeof e=="string"&&(e=uo().param(e));let n=["grep","--null","-n","--full-name",...r,...e];return this._runTask({commands:n,format:"utf-8",parser(s){return lo(s)}},t)}}}var Zn,Oe,Ur,es,ts=l({"src/lib/tasks/grep.ts"(){"use strict";b(),O(),Zn=["-h"],Oe=Symbol("grepQuery"),es=class{constructor(){this[Ur]=[]}*[(Ur=Oe,Symbol.iterator)](){for(let e of this[Oe])yield e}and(...e){return e.length&&this[Oe].push("--and","(",...Re(e,"-e"),")"),this}param(...e){return this[Oe].push(...Re(e,"-e")),this}}}}),rs={};R(rs,{ResetMode:()=>Xe,getResetMode:()=>ho,resetTask:()=>mo});function mo(e,t){let r=["reset"];return ns(e)&&r.push(`--${e}`),r.push(...t),j(r)}function ho(e){if(ns(e))return e;switch(typeof e){case"string":case"undefined":return"soft"}}function ns(e){return typeof e=="string"&&ss.includes(e)}var Xe,ss,is=l({"src/lib/tasks/reset.ts"(){"use strict";b(),O(),Xe=(e=>(e.MIXED="mixed",e.SOFT="soft",e.HARD="hard",e.MERGE="merge",e.KEEP="keep",e))(Xe||{}),ss=Ce(Object.values(Xe))}});function po(){return(0,Ze.default)("simple-git")}function jr(e,t,r){return!t||!String(t).replace(/\s*/,"")?r?(n,...s)=>{e(n,...s),r(n,...s)}:e:(n,...s)=>{e(`%s ${n}`,t,...s),r&&r(n,...s)}}function go(e,t,{namespace:r}){if(typeof e=="string")return e;let n=t&&t.namespace||"";return n.startsWith(r)?n.substr(r.length+1):n||r}function sr(e,t,r,n=po()){let s=e&&`[${e}]`||"",i=[],a=typeof t=="string"?n.extend(t):t,o=go(X(t,M),a,n);return d(r);function u(m,h){return V(i,sr(e,o.replace(/^[^:]+/,m),h,n))}function d(m){let h=m&&`[${m}]`||"",p=a&&jr(a,h)||de,f=jr(n,`${s} ${h}`,p);return Object.assign(a?p:f,{label:e,sibling:u,info:f,step:d})}}var as=l({"src/lib/git-logger.ts"(){"use strict";b(),Ze.default.formatters.L=e=>String(at(e)?e.length:"-"),Ze.default.formatters.B=e=>Buffer.isBuffer(e)?e.toString("utf8"):Ae(e)}}),os,vo=l({"src/lib/runners/tasks-pending-queue.ts"(){"use strict";ae(),as(),os=class jt{constructor(t="GitExecutor"){this.logLabel=t,this._queue=new Map}withProgress(t){return this._queue.get(t)}createProgress(t){let r=jt.getName(t.commands[0]),n=sr(this.logLabel,r);return{task:t,logger:n,name:r}}push(t){let r=this.createProgress(t);return r.logger("Adding task to the queue, commands = %o",t.commands),this._queue.set(t,r),r}fatal(t){for(let[r,{logger:n}]of Array.from(this._queue.entries()))r===t.task?(n.info("Failed %o",t),n("Fatal exception, any as-yet un-started tasks run through this executor will not be attempted")):n.info("A fatal exception occurred in a previous task, the queue has been purged: %o",t.message),this.complete(r);if(this._queue.size!==0)throw new Error(`Queue size should be zero after fatal: ${this._queue.size}`)}complete(t){this.withProgress(t)&&this._queue.delete(t)}attempt(t){let r=this.withProgress(t);if(!r)throw new re(void 0,"TasksPendingQueue: attempt called for an unknown task");return r.logger("Starting task"),r}static getName(t="empty"){return`task:${t}:${++jt.counter}`}static{this.counter=0}}}});function ue(e,t){return{method:xn(e.commands)||"",commands:t}}function bo(e,t){return r=>{t("[ERROR] child process exception %o",r),e.push(Buffer.from(String(r.stack),"ascii"))}}function $r(e,t,r,n){return s=>{r("%s received %L bytes",t,s),n("%B",s),e.push(s)}}var $t,yo=l({"src/lib/runners/git-executor-chain.ts"(){"use strict";ae(),O(),b(),vo(),$t=class{constructor(e,t,r){this._executor=e,this._scheduler=t,this._plugins=r,this._chain=Promise.resolve(),this._queue=new os}get cwd(){return this._cwd||this._executor.cwd}set cwd(e){this._cwd=e}get env(){return this._executor.env}get outputHandler(){return this._executor.outputHandler}chain(){return this}push(e){return this._queue.push(e),this._chain=this._chain.then(()=>this.attemptTask(e))}async attemptTask(e){let t=await this._scheduler.next(),r=()=>this._queue.complete(e);try{let{logger:n}=this._queue.attempt(e);return await(Hn(e)?this.attemptEmptyTask(e,n):this.attemptRemoteTask(e,n))}catch(n){throw this.onFatalException(e,n)}finally{r(),t()}}onFatalException(e,t){let r=t instanceof re?Object.assign(t,{task:e}):new re(e,t&&String(t));return this._chain=Promise.resolve(),this._queue.fatal(r),r}async attemptRemoteTask(e,t){let r=this._plugins.exec("spawn.binary","",ue(e,e.commands)),n=this._plugins.exec("spawn.args",[...e.commands],ue(e,e.commands)),s=await this.gitResponse(e,r,n,this.outputHandler,t.step("SPAWN")),i=await this.handleTaskData(e,n,s,t.step("HANDLE"));return t("passing response to task's parser as a %s",e.format),Gn(e)?Dt(e.parser,i):Dt(e.parser,i.asStrings())}async attemptEmptyTask(e,t){return t("empty task bypassing child process to call to task's parser"),e.parser(this)}handleTaskData(e,t,r,n){let{exitCode:s,rejection:i,stdOut:a,stdErr:o}=r;return new Promise((u,d)=>{n("Preparing to handle process response exitCode=%d stdOut=",s);let{error:m}=this._plugins.exec("task.error",{error:i},{...ue(e,t),...r});if(m&&e.onError)return n.info("exitCode=%s handling with custom error handler"),e.onError(r,m,h=>{n.info("custom error handler treated as success"),n("custom error returned a %s",Ae(h)),u(new Qe(Array.isArray(h)?Buffer.concat(h):h,Buffer.concat(o)))},d);if(m)return n.info("handling as error: exitCode=%s stdErr=%s rejection=%o",s,o.length,i),d(m);n.info("retrieving task output complete"),u(new Qe(Buffer.concat(a),Buffer.concat(o)))})}async gitResponse(e,t,r,n,s){let i=s.sibling("output"),a=this._plugins.exec("spawn.options",{cwd:this.cwd,env:this.env,windowsHide:!0},ue(e,e.commands));return new Promise(o=>{let u=[],d=[];s.info("%s %o",t,r),s("%O",a);let m=this._beforeSpawn(e,r);if(m)return o({stdOut:u,stdErr:d,exitCode:9901,rejection:m});this._plugins.exec("spawn.before",void 0,{...ue(e,r),kill(p){m=p||m}});let h=(0,cs.spawn)(t,r,a);h.stdout.on("data",$r(u,"stdOut",s,i.step("stdOut"))),h.stderr.on("data",$r(d,"stdErr",s,i.step("stdErr"))),h.on("error",bo(d,s)),n&&(s("Passing child process stdOut/stdErr to custom outputHandler"),n(t,h.stdout,h.stderr,[...r])),this._plugins.exec("spawn.after",void 0,{...ue(e,r),spawned:h,close(p,f){o({stdOut:u,stdErr:d,exitCode:p,rejection:m||f})},kill(p){h.killed||(m=p,h.kill("SIGINT"))}})})}_beforeSpawn(e,t){let r;return this._plugins.exec("spawn.before",void 0,{...ue(e,t),kill(n){r=n||r}}),r}}}}),us={};R(us,{GitExecutor:()=>ls});var ls,wo=l({"src/lib/runners/git-executor.ts"(){"use strict";yo(),ls=class{constructor(e,t,r){this.cwd=e,this._scheduler=t,this._plugins=r,this._chain=new $t(this,this._scheduler,this._plugins)}chain(){return new $t(this,this._scheduler,this._plugins)}push(e){return this._chain.push(e)}}}});function ko(e,t,r=de){let n=i=>{r(null,i)},s=i=>{i?.task===e&&r(i instanceof Me?xo(i):i,void 0)};t.then(n,s)}function xo(e){let t=n=>{console.warn(`simple-git deprecation notice: accessing GitResponseError.${n} should be GitResponseError.git.${n}, this will no longer be available in version 3`),t=de};return Object.create(e,Object.getOwnPropertyNames(e.git).reduce(r,{}));function r(n,s){return s in e||(n[s]={enumerable:!1,configurable:!1,get(){return t(s),e.git[s]}}),n}}var To=l({"src/lib/task-callback.ts"(){"use strict";Te(),b()}});function Wr(e,t){return $n(r=>{if(!Vt(e))throw new Error(`Git.cwd: cannot change to non-directory "${e}"`);return(t||r).cwd=e})}var Co=l({"src/lib/tasks/change-working-directory.ts"(){"use strict";b(),O()}});function It(e){let t=["checkout",...e];return t[1]==="-b"&&t.includes("-B")&&(t[1]=nt(t,"-B")),j(t)}function _o(){return{checkout(){return this._runTask(It(W(arguments,1)),E(arguments))},checkoutBranch(e,t){return this._runTask(It(["-b",e,t,...W(arguments)]),E(arguments))},checkoutLocalBranch(e){return this._runTask(It(["-b",e,...W(arguments)]),E(arguments))}}}var So=l({"src/lib/tasks/checkout.ts"(){"use strict";b(),O()}});function Eo(){return{count:0,garbage:0,inPack:0,packs:0,prunePackable:0,size:0,sizeGarbage:0,sizePack:0}}function Io(){return{countObjects(){return this._runTask({commands:["count-objects","--verbose"],format:"utf-8",parser(e){return H(Eo(),[ds],e)}})}}}var ds,Oo=l({"src/lib/tasks/count-objects.ts"(){"use strict";b(),ds=new y(/([a-z-]+): (\d+)$/,(e,[t,r])=>{let n=_n(t);Object.hasOwn(e,n)&&(e[n]=x(r))})}});function Ro(e){return H({author:null,branch:"",commit:"",root:!1,summary:{changes:0,insertions:0,deletions:0}},fs,e)}var fs,Fo=l({"src/lib/parsers/parse-commit.ts"(){"use strict";b(),fs=[new y(/^\[([^\s]+)( \([^)]+\))? ([^\]]+)/,(e,[t,r,n])=>{e.branch=t,e.commit=n,e.root=!!r}),new y(/\s*Author:\s(.+)/i,(e,[t])=>{let r=t.split("<"),n=r.pop();!n||!n.includes("@")||(e.author={email:n.substr(0,n.length-1),name:r.join("<").trim()})}),new y(/(\d+)[^,]*(?:,\s*(\d+)[^,]*)(?:,\s*(\d+))/g,(e,[t,r,n])=>{e.summary.changes=parseInt(t,10)||0,e.summary.insertions=parseInt(r,10)||0,e.summary.deletions=parseInt(n,10)||0}),new y(/^(\d+)[^,]*(?:,\s*(\d+)[^(]+\(([+-]))?/,(e,[t,r,n])=>{e.summary.changes=parseInt(t,10)||0;let s=parseInt(r,10)||0;n==="-"?e.summary.deletions=s:n==="+"&&(e.summary.insertions=s)})]}});function Po(e,t,r){return{commands:["-c","core.abbrev=40","commit",...Re(e,"-m"),...t,...r],format:"utf-8",parser:Ro}}function Mo(){return{commit(t,...r){let n=E(arguments),s=e(t)||Po(ee(t),ee(X(r[0],Je,[])),[...Ce(X(r[1],De,[])),...W(arguments,0,!0)]);return this._runTask(s,n)}};function e(t){return!Je(t)&&G("git.commit: requires the commit message to be supplied as a string/string[]")}}var Lo=l({"src/lib/tasks/commit.ts"(){"use strict";Fo(),b(),O()}});function Ao(){return{firstCommit(){return this._runTask(j(["rev-list","--max-parents=0","HEAD"],!0),E(arguments))}}}var Do=l({"src/lib/tasks/first-commit.ts"(){"use strict";b(),O()}});function Bo(e,t){let r=["hash-object",e];return t&&r.push("-w"),j(r,!0)}var No=l({"src/lib/tasks/hash-object.ts"(){"use strict";O()}});function Uo(e,t,r){let n=String(r).trim(),s;if(s=ms.exec(n))return new Ye(e,t,!1,s[1]);if(s=hs.exec(n))return new Ye(e,t,!0,s[1]);let i="",a=n.split(" ");for(;a.length;)if(a.shift()==="in"){i=a.join(" ");break}return new Ye(e,t,/^re/i.test(n),i)}var Ye,ms,hs,jo=l({"src/lib/responses/InitSummary.ts"(){"use strict";Ye=class{constructor(e,t,r,n){this.bare=e,this.path=t,this.existing=r,this.gitDir=n}},ms=/^Init.+ repository in (.+)$/,hs=/^Rein.+ in (.+)$/}});function $o(e){return e.includes(ir)}function Wo(e=!1,t,r){let n=["init",...r];return e&&!$o(n)&&n.splice(1,0,ir),{commands:n,format:"utf-8",parser(s){return Uo(n.includes("--bare"),t,s)}}}var ir,Go=l({"src/lib/tasks/init.ts"(){"use strict";jo(),ir="--bare"}});function ar(e){for(let t=0;t<e.length;t++){let r=or.exec(e[t]);if(r)return`--${r[1]}`}return""}function Ho(e){return or.test(e)}var or,Be=l({"src/lib/args/log-format.ts"(){"use strict";or=/^--(stat|numstat|name-only|name-status)(=|$)/}}),ps,qo=l({"src/lib/responses/DiffSummary.ts"(){"use strict";ps=class{constructor(){this.changed=0,this.deletions=0,this.insertions=0,this.files=[]}}}});function gs(e=""){let t=vs[e];return r=>H(new ps,t,r,!1)}var Ot,Gr,Hr,qr,vs,bs=l({"src/lib/parsers/parse-diff-summary.ts"(){"use strict";Be(),qo(),Qn(),b(),Ot=[new y(/^(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/,(e,[t,r,n=""])=>{e.files.push({file:t.trim(),changes:x(r),insertions:n.replace(/[^+]/g,"").length,deletions:n.replace(/[^-]/g,"").length,binary:!1})}),new y(/^(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)/,(e,[t,r,n])=>{e.files.push({file:t.trim(),before:x(r),after:x(n),binary:!0})}),new y(/(\d+) files? changed\s*((?:, \d+ [^,]+){0,2})/,(e,[t,r])=>{let n=/(\d+) i/.exec(r),s=/(\d+) d/.exec(r);e.changed=x(t),e.insertions=x(n?.[1]),e.deletions=x(s?.[1])})],Gr=[new y(/(\d+)\t(\d+)\t(.+)$/,(e,[t,r,n])=>{let s=x(t),i=x(r);e.changed++,e.insertions+=s,e.deletions+=i,e.files.push({file:n,changes:s+i,insertions:s,deletions:i,binary:!1})}),new y(/-\t-\t(.+)$/,(e,[t])=>{e.changed++,e.files.push({file:t,after:0,before:0,binary:!0})})],Hr=[new y(/(.+)$/,(e,[t])=>{e.changed++,e.files.push({file:t,changes:0,insertions:0,deletions:0,binary:!1})})],qr=[new y(/([ACDMRTUXB])([0-9]{0,3})\t(.[^\t]*)(\t(.[^\t]*))?$/,(e,[t,r,n,s,i])=>{e.changed++,e.files.push({file:i??n,changes:0,insertions:0,deletions:0,binary:!1,status:Mt(co(t)&&t),from:Mt(!!i&&n!==i&&n),similarity:x(r)})})],vs={"":Ot,"--stat":Ot,"--numstat":Gr,"--name-status":qr,"--name-only":Hr}}});function zo(e,t){return t.reduce((r,n,s)=>(r[n]=e[s]||"",r),Object.create({diff:null}))}function ys(e=lr,t=ws,r=""){let n=gs(r);return function(s){let i=Le(s.trim(),!1,cr).map(function(a){let o=a.split(ur),u=zo(o[0].split(e),t);return o.length>1&&o[1].trim()&&(u.diff=n(o[1])),u});return{all:i,latest:i.length&&i[0]||null,total:i.length}}}var cr,ur,lr,ws,ks=l({"src/lib/parsers/parse-list-log-summary.ts"(){"use strict";b(),bs(),Be(),cr="\xF2\xF2\xF2\xF2\xF2\xF2 ",ur=" \xF2\xF2",lr=" \xF2 ",ws=["hash","date","message","refs","author_name","author_email"]}}),xs={};R(xs,{diffSummaryTask:()=>Xo,validateLogFormatConfig:()=>ut});function Xo(e){let t=ar(e),r=["diff"];return t===""&&(t="--stat",r.push("--stat=4096")),r.push(...e),ut(r)||{commands:r,format:"utf-8",parser:gs(t)}}function ut(e){let t=e.filter(Ho);if(t.length>1)return G(`Summary flags are mutually exclusive - pick one of ${t.join(",")}`);if(t.length&&e.includes("-z"))return G(`Summary flag ${t} parsing is not compatible with null termination option '-z'`)}var dr=l({"src/lib/tasks/diff.ts"(){"use strict";Be(),bs(),O()}});function Yo(e,t){let r=[],n=[];return Object.keys(e).forEach(s=>{r.push(s),n.push(String(e[s]))}),[r,n.join(t)]}function Vo(e){return Object.keys(e).reduce((t,r)=>(r in Wt||(t[r]=e[r]),t),{})}function Ts(e={},t=[]){let r=X(e.splitter,M,lr),n=it(e.format)?e.format:{hash:"%H",date:e.strictDate===!1?"%ai":"%aI",message:"%s",refs:"%D",body:e.multiLine?"%B":"%b",author_name:e.mailMap!==!1?"%aN":"%an",author_email:e.mailMap!==!1?"%aE":"%ae"},[s,i]=Yo(n,r),a=[],o=[`--pretty=format:${cr}${i}${ur}`,...t],u=e.n||e["max-count"]||e.maxCount;if(u&&o.push(`--max-count=${u}`),e.from||e.to){let d=e.symmetric!==!1?"...":"..";a.push(`${e.from||""}${d}${e.to||""}`)}return M(e.file)&&o.push("--follow",Aa(e.file)),Jt(Vo(e),o),{fields:s,splitter:r,commands:[...o,...a]}}function Ko(e,t,r){let n=ys(e,t,ar(r));return{commands:["log",...r],format:"utf-8",parser:n}}function Jo(){return{log(...r){let n=E(arguments),s=Ts(Qt(arguments),Ce(X(arguments[0],De,[]))),i=t(...r)||ut(s.commands)||e(s);return this._runTask(i,n)}};function e(r){return Ko(r.splitter,r.fields,r.commands)}function t(r,n){return M(r)&&M(n)&&G("git.log(string, string) should be replaced with git.log({ from: string, to: string })")}}var Wt,Cs=l({"src/lib/tasks/log.ts"(){"use strict";Be(),Pe(),ks(),b(),O(),dr(),Wt=(e=>(e[e["--pretty"]=0]="--pretty",e[e["max-count"]=1]="max-count",e[e.maxCount=2]="maxCount",e[e.n=3]="n",e[e.file=4]="file",e[e.format=5]="format",e[e.from=6]="from",e[e.to=7]="to",e[e.splitter=8]="splitter",e[e.symmetric=9]="symmetric",e[e.mailMap=10]="mailMap",e[e.multiLine=11]="multiLine",e[e.strictDate=12]="strictDate",e))(Wt||{})}}),Ve,_s,Qo=l({"src/lib/responses/MergeSummary.ts"(){"use strict";Ve=class{constructor(e,t=null,r){this.reason=e,this.file=t,this.meta=r}toString(){return`${this.file}:${this.reason}`}},_s=class{constructor(){this.conflicts=[],this.merges=[],this.result="success"}get failed(){return this.conflicts.length>0}get reason(){return this.result}toString(){return this.conflicts.length?`CONFLICTS: ${this.conflicts.join(", ")}`:"OK"}}}}),Gt,Ss,Zo=l({"src/lib/responses/PullSummary.ts"(){"use strict";Gt=class{constructor(){this.remoteMessages={all:[]},this.created=[],this.deleted=[],this.files=[],this.deletions={},this.insertions={},this.summary={changes:0,deletions:0,insertions:0}}},Ss=class{constructor(){this.remote="",this.hash={local:"",remote:""},this.branch={local:"",remote:""},this.message=""}toString(){return this.message}}}});function Rt(e){return e.objects=e.objects||{compressing:0,counting:0,enumerating:0,packReused:0,reused:{count:0,delta:0},total:{count:0,delta:0}}}function zr(e){let t=/^\s*(\d+)/.exec(e),r=/delta (\d+)/i.exec(e);return{count:x(t&&t[1]||"0"),delta:x(r&&r[1]||"0")}}var Es,ec=l({"src/lib/parsers/parse-remote-objects.ts"(){"use strict";b(),Es=[new ie(/^remote:\s*(enumerating|counting|compressing) objects: (\d+),/i,(e,[t,r])=>{let n=t.toLowerCase(),s=Rt(e.remoteMessages);Object.assign(s,{[n]:x(r)})}),new ie(/^remote:\s*(enumerating|counting|compressing) objects: \d+% \(\d+\/(\d+)\),/i,(e,[t,r])=>{let n=t.toLowerCase(),s=Rt(e.remoteMessages);Object.assign(s,{[n]:x(r)})}),new ie(/total ([^,]+), reused ([^,]+), pack-reused (\d+)/i,(e,[t,r,n])=>{let s=Rt(e.remoteMessages);s.total=zr(t),s.reused=zr(r),s.packReused=x(n)})]}});function Is(e,t){return H({remoteMessages:new Rs},Os,t)}var Os,Rs,Fs=l({"src/lib/parsers/parse-remote-messages.ts"(){"use strict";b(),ec(),Os=[new ie(/^remote:\s*(.+)$/,(e,[t])=>(e.remoteMessages.all.push(t.trim()),!1)),...Es,new ie([/create a (?:pull|merge) request/i,/\s(https?:\/\/\S+)$/],(e,[t])=>{e.remoteMessages.pullRequestUrl=t}),new ie([/found (\d+) vulnerabilities.+\(([^)]+)\)/i,/\s(https?:\/\/\S+)$/],(e,[t,r,n])=>{e.remoteMessages.vulnerabilities={count:x(t),summary:r,url:n}})],Rs=class{constructor(){this.all=[]}}}});function tc(e,t){let r=H(new Ss,Ps,[e,t]);return r.message&&r}var Xr,Yr,Vr,Kr,Ps,Jr,fr,Ms=l({"src/lib/parsers/parse-pull.ts"(){"use strict";Zo(),b(),Fs(),Xr=/^\s*(.+?)\s+\|\s+\d+\s*(\+*)(-*)/,Yr=/(\d+)\D+((\d+)\D+\(\+\))?(\D+(\d+)\D+\(-\))?/,Vr=/^(create|delete) mode \d+ (.+)/,Kr=[new y(Xr,(e,[t,r,n])=>{e.files.push(t),r&&(e.insertions[t]=r.length),n&&(e.deletions[t]=n.length)}),new y(Yr,(e,[t,,r,,n])=>r!==void 0||n!==void 0?(e.summary.changes=+t||0,e.summary.insertions=+r||0,e.summary.deletions=+n||0,!0):!1),new y(Vr,(e,[t,r])=>{V(e.files,r),V(t==="create"?e.created:e.deleted,r)})],Ps=[new y(/^from\s(.+)$/i,(e,[t])=>{e.remote=t}),new y(/^fatal:\s(.+)$/,(e,[t])=>{e.message=t}),new y(/([a-z0-9]+)\.\.([a-z0-9]+)\s+(\S+)\s+->\s+(\S+)$/,(e,[t,r,n,s])=>{e.branch.local=n,e.hash.local=t,e.branch.remote=s,e.hash.remote=r})],Jr=(e,t)=>H(new Gt,Kr,[e,t]),fr=(e,t)=>Object.assign(new Gt,Jr(e,t),Is(e,t))}}),Qr,Ls,Zr,rc=l({"src/lib/parsers/parse-merge.ts"(){"use strict";Qo(),b(),Ms(),Qr=[new y(/^Auto-merging\s+(.+)$/,(e,[t])=>{e.merges.push(t)}),new y(/^CONFLICT\s+\((.+)\): Merge conflict in (.+)$/,(e,[t,r])=>{e.conflicts.push(new Ve(t,r))}),new y(/^CONFLICT\s+\((.+\/delete)\): (.+) deleted in (.+) and/,(e,[t,r,n])=>{e.conflicts.push(new Ve(t,r,{deleteRef:n}))}),new y(/^CONFLICT\s+\((.+)\):/,(e,[t])=>{e.conflicts.push(new Ve(t,null))}),new y(/^Automatic merge failed;\s+(.+)$/,(e,[t])=>{e.result=t})],Ls=(e,t)=>Object.assign(Zr(e,t),fr(e,t)),Zr=e=>H(new _s,Qr,e)}});function en(e){return e.length?{commands:["merge",...e],format:"utf-8",parser(t,r){let n=Ls(t,r);if(n.failed)throw new Me(n);return n}}:G("Git.merge requires at least one option")}var nc=l({"src/lib/tasks/merge.ts"(){"use strict";Te(),rc(),O()}});function sc(e,t,r){let n=r.includes("deleted"),s=r.includes("tag")||/^refs\/tags/.test(e),i=!r.includes("new");return{deleted:n,tag:s,branch:!s,new:!i,alreadyUpdated:i,local:e,remote:t}}var tn,As,rn,ic=l({"src/lib/parsers/parse-push.ts"(){"use strict";b(),Fs(),tn=[new y(/^Pushing to (.+)$/,(e,[t])=>{e.repo=t}),new y(/^updating local tracking ref '(.+)'/,(e,[t])=>{e.ref={...e.ref||{},local:t}}),new y(/^[=*-]\s+([^:]+):(\S+)\s+\[(.+)]$/,(e,[t,r,n])=>{e.pushed.push(sc(t,r,n))}),new y(/^Branch '([^']+)' set up to track remote branch '([^']+)' from '([^']+)'/,(e,[t,r,n])=>{e.branch={...e.branch||{},local:t,remote:r,remoteName:n}}),new y(/^([^:]+):(\S+)\s+([a-z0-9]+)\.\.([a-z0-9]+)$/,(e,[t,r,n,s])=>{e.update={head:{local:t,remote:r},hash:{from:n,to:s}}})],As=(e,t)=>{let r=rn(e,t),n=Is(e,t);return{...r,...n}},rn=(e,t)=>H({pushed:[]},tn,[e,t])}}),Ds={};R(Ds,{pushTagsTask:()=>ac,pushTask:()=>mr});function ac(e={},t){return V(t,"--tags"),mr(e,t)}function mr(e={},t){let r=["push",...t];return e.branch&&r.splice(1,0,e.branch),e.remote&&r.splice(1,0,e.remote),nt(r,"-v"),V(r,"--verbose"),V(r,"--porcelain"),{commands:r,format:"utf-8",parser:As}}var Bs=l({"src/lib/tasks/push.ts"(){"use strict";ic(),b()}});function oc(){return{showBuffer(){let e=["show",...W(arguments,1)];return e.includes("--binary")||e.splice(1,0,"--binary"),this._runTask(Wn(e),E(arguments))},show(){let e=["show",...W(arguments,1)];return this._runTask(j(e),E(arguments))}}}var cc=l({"src/lib/tasks/show.ts"(){"use strict";b(),O()}}),nn,Ns,uc=l({"src/lib/responses/FileStatusSummary.ts"(){"use strict";nn=/^(.+)\0(.+)$/,Ns=class{constructor(e,t,r){if(this.path=e,this.index=t,this.working_dir=r,t==="R"||r==="R"){let n=nn.exec(e)||[null,e,e];this.from=n[2]||"",this.path=n[1]||""}}}}});function sn(e){let[t,r]=e.split(xe);return{from:r||t,to:t}}function z(e,t,r){return[`${e}${t}`,r]}function Ft(e,...t){return t.map(r=>z(e,r,(n,s)=>n.conflicted.push(s)))}function lc(e,t){let r=t.trim();switch(" "){case r.charAt(2):return n(r.charAt(0),r.charAt(1),r.slice(3));case r.charAt(1):return n(" ",r.charAt(0),r.slice(2));default:return}function n(s,i,a){let o=`${s}${i}`,u=Us.get(o);u&&u(e,a),o!=="##"&&o!=="!!"&&e.files.push(new Ns(a,s,i))}}var an,Us,js,dc=l({"src/lib/responses/StatusSummary.ts"(){"use strict";b(),uc(),an=class{constructor(){this.not_added=[],this.conflicted=[],this.created=[],this.deleted=[],this.ignored=void 0,this.modified=[],this.renamed=[],this.files=[],this.staged=[],this.ahead=0,this.behind=0,this.current=null,this.tracking=null,this.detached=!1,this.isClean=()=>!this.files.length}},Us=new Map([z(" ","A",(e,t)=>e.created.push(t)),z(" ","D",(e,t)=>e.deleted.push(t)),z(" ","M",(e,t)=>e.modified.push(t)),z("A"," ",(e,t)=>{e.created.push(t),e.staged.push(t)}),z("A","M",(e,t)=>{e.created.push(t),e.staged.push(t),e.modified.push(t)}),z("D"," ",(e,t)=>{e.deleted.push(t),e.staged.push(t)}),z("M"," ",(e,t)=>{e.modified.push(t),e.staged.push(t)}),z("M","M",(e,t)=>{e.modified.push(t),e.staged.push(t)}),z("R"," ",(e,t)=>{e.renamed.push(sn(t))}),z("R","M",(e,t)=>{let r=sn(t);e.renamed.push(r),e.modified.push(r.to)}),z("!","!",(e,t)=>{(e.ignored=e.ignored||[]).push(t)}),z("?","?",(e,t)=>e.not_added.push(t)),...Ft("A","A","U"),...Ft("D","D","U"),...Ft("U","A","D","U"),["##",(e,t)=>{let r=/ahead (\d+)/,n=/behind (\d+)/,s=/^(.+?(?=(?:\.{3}|\s|$)))/,i=/\.{3}(\S*)/,a=/\son\s(\S+?)(?=\.{3}|$)/,o=r.exec(t);e.ahead=o&&+o[1]||0,o=n.exec(t),e.behind=o&&+o[1]||0,o=s.exec(t),e.current=X(o?.[1],M,null),o=i.exec(t),e.tracking=X(o?.[1],M,null),o=a.exec(t),o&&(e.current=X(o?.[1],M,e.current)),e.detached=/\(no branch\)/.test(t)}]]),js=function(e){let t=e.split(xe),r=new an;for(let n=0,s=t.length;n<s;){let i=t[n++].trim();i&&(i.charAt(0)==="R"&&(i+=xe+(t[n++]||"")),lc(r,i))}return r}}});function fc(e){return{format:"utf-8",commands:["status","--porcelain","-b","-u","--null",...e.filter(r=>!$s.includes(r))],parser(r){return js(r)}}}var $s,mc=l({"src/lib/tasks/status.ts"(){"use strict";dc(),$s=["--null","-z"]}});function et(e=0,t=0,r=0,n="",s=!0){return Object.defineProperty({major:e,minor:t,patch:r,agent:n,installed:s},"toString",{value(){return`${this.major}.${this.minor}.${this.patch}`},configurable:!1,enumerable:!1})}function hc(){return et(0,0,0,"",!1)}function pc(){return{version(){return this._runTask({commands:["--version"],format:"utf-8",parser:gc,onError(e,t,r,n){if(e.exitCode===-2)return r(Buffer.from(hr));n(t)}})}}}function gc(e){return e===hr?hc():H(et(0,0,0,e),Ws,e)}var hr,Ws,vc=l({"src/lib/tasks/version.ts"(){"use strict";b(),hr="installed=false",Ws=[new y(/version (\d+)\.(\d+)\.(\d+)(?:\s*\((.+)\))?/,(e,[t,r,n,s=""])=>{Object.assign(e,et(x(t),x(r),x(n),s))}),new y(/version (\d+)\.(\d+)\.(\D+)(.+)?$/,(e,[t,r,n,s=""])=>{Object.assign(e,et(x(t),x(r),n,s))})]}}),Gs={};R(Gs,{SimpleGitApi:()=>Ht});var Ht,bc=l({"src/lib/simple-git-api.ts"(){"use strict";To(),Co(),So(),Oo(),Lo(),Kn(),Do(),ts(),No(),Go(),Cs(),nc(),Bs(),cc(),mc(),O(),vc(),b(),Ht=class{constructor(e){this._executor=e}_runTask(e,t){let r=this._executor.chain(),n=r.push(e);return t&&ko(e,n,t),Object.create(this,{then:{value:n.then.bind(n)},catch:{value:n.catch.bind(n)},_executor:{value:r}})}add(e){return this._runTask(j(["add",...ee(e)]),E(arguments))}cwd(e){let t=E(arguments);return typeof e=="string"?this._runTask(Wr(e,this._executor),t):typeof e?.path=="string"?this._runTask(Wr(e.path,e.root&&this._executor||void 0),t):this._runTask(G("Git.cwd: workingDirectory must be supplied as a string"),t)}hashObject(e,t){return this._runTask(Bo(e,t===!0),E(arguments))}init(e){return this._runTask(Wo(e===!0,this._executor.cwd,W(arguments)),E(arguments))}merge(){return this._runTask(en(W(arguments)),E(arguments))}mergeFromTo(e,t){return M(e)&&M(t)?this._runTask(en([e,t,...W(arguments)]),E(arguments,!1)):this._runTask(G("Git.mergeFromTo requires that the 'remote' and 'branch' arguments are supplied as strings"))}outputHandler(e){return this._executor.outputHandler=e,this}push(){let e=mr({remote:X(arguments[0],M),branch:X(arguments[1],M)},W(arguments));return this._runTask(e,E(arguments))}stash(){return this._runTask(j(["stash",...W(arguments)]),E(arguments))}status(){return this._runTask(fc(W(arguments)),E(arguments))}},Object.assign(Ht.prototype,_o(),Mo(),oo(),Io(),Ao(),fo(),Jo(),oc(),pc())}}),Hs={};R(Hs,{Scheduler:()=>zs});var on,zs,yc=l({"src/lib/runners/scheduler.ts"(){"use strict";b(),as(),on=(()=>{let e=0;return()=>{e++;let{promise:t,done:r}=(0,qs.createDeferred)();return{promise:t,done:r,id:e}}})(),zs=class{constructor(e=2){this.concurrency=e,this.logger=sr("","scheduler"),this.pending=[],this.running=[],this.logger("Constructed, concurrency=%s",e)}schedule(){if(!this.pending.length||this.running.length>=this.concurrency){this.logger("Schedule attempt ignored, pending=%s running=%s concurrency=%s",this.pending.length,this.running.length,this.concurrency);return}let e=V(this.running,this.pending.shift());this.logger("Attempting id=%s",e.id),e.done(()=>{this.logger("Completing id=",e.id),nt(this.running,e),this.schedule()})}next(){let{promise:e,id:t}=V(this.pending,on());return this.logger("Scheduling id=%s",t),this.schedule(),e}}}}),Xs={};R(Xs,{applyPatchTask:()=>wc});function wc(e,t){return j(["apply",...t,...e])}var kc=l({"src/lib/tasks/apply-patch.ts"(){"use strict";O()}});function xc(e,t){return{branch:e,hash:t,success:!0}}function Tc(e){return{branch:e,hash:null,success:!1}}var Ys,Cc=l({"src/lib/responses/BranchDeleteSummary.ts"(){"use strict";Ys=class{constructor(){this.all=[],this.branches={},this.errors=[]}get success(){return!this.errors.length}}}});function Vs(e,t){return t===1&&qt.test(e)}var cn,qt,un,lt,_c=l({"src/lib/parsers/parse-branch-delete.ts"(){"use strict";Cc(),b(),cn=/(\S+)\s+\(\S+\s([^)]+)\)/,qt=/^error[^']+'([^']+)'/m,un=[new y(cn,(e,[t,r])=>{let n=xc(t,r);e.all.push(n),e.branches[t]=n}),new y(qt,(e,[t])=>{let r=Tc(t);e.errors.push(r),e.all.push(r),e.branches[t]=r})],lt=(e,t)=>H(new Ys,un,[e,t])}}),Ks,Sc=l({"src/lib/responses/BranchSummary.ts"(){"use strict";Ks=class{constructor(){this.all=[],this.branches={},this.current="",this.detached=!1}push(e,t,r,n,s){e==="*"&&(this.detached=t,this.current=r),this.all.push(r),this.branches[r]={current:e==="*",linkedWorkTree:e==="+",name:r,commit:n,label:s}}}}});function ln(e){return e?e.charAt(0):""}function Js(e,t=!1){return H(new Ks,t?[Zs]:Qs,e)}var Qs,Zs,Ec=l({"src/lib/parsers/parse-branch.ts"(){"use strict";Sc(),b(),Qs=[new y(/^([*+]\s)?\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/,(e,[t,r,n,s])=>{e.push(ln(t),!0,r,n,s)}),new y(/^([*+]\s)?(\S+)\s+([a-z0-9]+)\s?(.*)$/s,(e,[t,r,n,s])=>{e.push(ln(t),!1,r,n,s)})],Zs=new y(/^(\S+)$/s,(e,[t])=>{e.push("*",!1,t,"","")})}}),ei={};R(ei,{branchLocalTask:()=>Oc,branchTask:()=>Ic,containsDeleteBranchCommand:()=>ti,deleteBranchTask:()=>Fc,deleteBranchesTask:()=>Rc});function ti(e){let t=["-d","-D","--delete"];return e.some(r=>t.includes(r))}function Ic(e){let t=ti(e),r=e.includes("--show-current"),n=["branch",...e];return n.length===1&&n.push("-a"),n.includes("-v")||n.splice(1,0,"-v"),{format:"utf-8",commands:n,parser(s,i){return t?lt(s,i).all[0]:Js(s,r)}}}function Oc(){return{format:"utf-8",commands:["branch","-v"],parser(e){return Js(e)}}}function Rc(e,t=!1){return{format:"utf-8",commands:["branch","-v",t?"-D":"-d",...e],parser(r,n){return lt(r,n)},onError({exitCode:r,stdOut:n},s,i,a){if(!Vs(String(s),r))return a(s);i(n)}}}function Fc(e,t=!1){let r={format:"utf-8",commands:["branch","-v",t?"-D":"-d",e],parser(n,s){return lt(n,s).branches[e]},onError({exitCode:n,stdErr:s,stdOut:i},a,o,u){if(!Vs(String(a),n))return u(a);throw new Me(r.parser(Fe(i),Fe(s)),String(a))}};return r}var Pc=l({"src/lib/tasks/branch.ts"(){"use strict";Te(),_c(),Ec(),b()}});function Mc(e){let t=e.trim().replace(/^["']|["']$/g,"");return t&&(0,ri.normalize)(t)}var ni,Lc=l({"src/lib/responses/CheckIgnore.ts"(){"use strict";ni=e=>e.split(/\n/g).map(Mc).filter(Boolean)}}),si={};R(si,{checkIgnoreTask:()=>Ac});function Ac(e){return{commands:["check-ignore",...e],format:"utf-8",parser:ni}}var Dc=l({"src/lib/tasks/check-ignore.ts"(){"use strict";Lc()}}),ii={};R(ii,{cloneMirrorTask:()=>Nc,cloneTask:()=>ai});function Bc(e){return/^--upload-pack(=|$)/.test(e)}function ai(e,t,r){let n=["clone",...r];return M(e)&&n.push(e),M(t)&&n.push(t),n.find(Bc)?G("git.fetch: potential exploit argument blocked."):j(n)}function Nc(e,t,r){return V(r,"--mirror"),ai(e,t,r)}var Uc=l({"src/lib/tasks/clone.ts"(){"use strict";O(),b()}});function jc(e,t){return H({raw:e,remote:null,branches:[],tags:[],updated:[],deleted:[]},oi,[e,t])}var oi,$c=l({"src/lib/parsers/parse-fetch.ts"(){"use strict";b(),oi=[new y(/From (.+)$/,(e,[t])=>{e.remote=t}),new y(/\* \[new branch]\s+(\S+)\s*-> (.+)$/,(e,[t,r])=>{e.branches.push({name:t,tracking:r})}),new y(/\* \[new tag]\s+(\S+)\s*-> (.+)$/,(e,[t,r])=>{e.tags.push({name:t,tracking:r})}),new y(/- \[deleted]\s+\S+\s*-> (.+)$/,(e,[t])=>{e.deleted.push({tracking:t})}),new y(/\s*([^.]+)\.\.(\S+)\s+(\S+)\s*-> (.+)$/,(e,[t,r,n,s])=>{e.updated.push({name:n,tracking:s,to:r,from:t})})]}}),ci={};R(ci,{fetchTask:()=>Gc});function Wc(e){return/^--upload-pack(=|$)/.test(e)}function Gc(e,t,r){let n=["fetch",...r];return e&&t&&n.push(e,t),n.find(Wc)?G("git.fetch: potential exploit argument blocked."):{commands:n,format:"utf-8",parser:jc}}var Hc=l({"src/lib/tasks/fetch.ts"(){"use strict";$c(),O()}});function qc(e){return H({moves:[]},ui,e)}var ui,zc=l({"src/lib/parsers/parse-move.ts"(){"use strict";b(),ui=[new y(/^Renaming (.+) to (.+)$/,(e,[t,r])=>{e.moves.push({from:t,to:r})})]}}),li={};R(li,{moveTask:()=>Xc});function Xc(e,t){return{commands:["mv","-v",...ee(e),t],format:"utf-8",parser:qc}}var Yc=l({"src/lib/tasks/move.ts"(){"use strict";zc(),b()}}),di={};R(di,{pullTask:()=>Vc});function Vc(e,t,r){let n=["pull",...r];return e&&t&&n.splice(1,0,e,t),{commands:n,format:"utf-8",parser(s,i){return fr(s,i)},onError(s,i,a,o){let u=tc(Fe(s.stdOut),Fe(s.stdErr));if(u)return o(new Me(u));o(i)}}}var Kc=l({"src/lib/tasks/pull.ts"(){"use strict";Te(),Ms(),b()}});function Jc(e){let t={};return fi(e,([r])=>t[r]={name:r}),Object.values(t)}function Qc(e){let t={};return fi(e,([r,n,s])=>{Object.hasOwn(t,r)||(t[r]={name:r,refs:{fetch:"",push:""}}),s&&n&&(t[r].refs[s.replace(/[^a-z]/g,"")]=n)}),Object.values(t)}function fi(e,t){Yt(e,r=>t(r.split(/\s+/)))}var Zc=l({"src/lib/responses/GetRemoteSummary.ts"(){"use strict";b()}}),mi={};R(mi,{addRemoteTask:()=>eu,getRemotesTask:()=>tu,listRemotesTask:()=>ru,remoteTask:()=>nu,removeRemoteTask:()=>su});function eu(e,t,r){return j(["remote","add",...r,e,t])}function tu(e){let t=["remote"];return e&&t.push("-v"),{commands:t,format:"utf-8",parser:e?Qc:Jc}}function ru(e){let t=[...e];return t[0]!=="ls-remote"&&t.unshift("ls-remote"),j(t)}function nu(e){let t=[...e];return t[0]!=="remote"&&t.unshift("remote"),j(t)}function su(e){return j(["remote","remove",e])}var iu=l({"src/lib/tasks/remote.ts"(){"use strict";Zc(),O()}}),hi={};R(hi,{stashListTask:()=>au});function au(e={},t){let r=Ts(e),n=["stash","list",...r.commands,...t],s=ys(r.splitter,r.fields,ar(n));return ut(n)||{commands:n,format:"utf-8",parser:s}}var ou=l({"src/lib/tasks/stash-list.ts"(){"use strict";Be(),ks(),dr(),Cs()}}),pi={};R(pi,{addSubModuleTask:()=>cu,initSubModuleTask:()=>uu,subModuleTask:()=>dt,updateSubModuleTask:()=>lu});function cu(e,t){return dt(["add",e,t])}function uu(e){return dt(["init",...e])}function dt(e){let t=[...e];return t[0]!=="submodule"&&t.unshift("submodule"),j(t)}function lu(e){return dt(["update",...e])}var du=l({"src/lib/tasks/sub-module.ts"(){"use strict";O()}});function fu(e,t){let r=Number.isNaN(e),n=Number.isNaN(t);return r!==n?r?1:-1:r?gi(e,t):0}function gi(e,t){return e===t?0:e>t?1:-1}function mu(e){return e.trim()}function qe(e){return typeof e=="string"&&parseInt(e.replace(/^\D+/g,""),10)||0}var dn,vi,hu=l({"src/lib/responses/TagList.ts"(){"use strict";dn=class{constructor(e,t){this.all=e,this.latest=t}},vi=function(e,t=!1){let r=e.split(`
`).map(mu).filter(Boolean);t||r.sort(function(s,i){let a=s.split("."),o=i.split(".");if(a.length===1||o.length===1)return fu(qe(a[0]),qe(o[0]));for(let u=0,d=Math.max(a.length,o.length);u<d;u++){let m=gi(qe(a[u]),qe(o[u]));if(m)return m}return 0});let n=t?r[0]:[...r].reverse().find(s=>s.indexOf(".")>=0);return new dn(r,n)}}}),bi={};R(bi,{addAnnotatedTagTask:()=>vu,addTagTask:()=>gu,tagListTask:()=>pu});function pu(e=[]){let t=e.some(r=>/^--sort=/.test(r));return{format:"utf-8",commands:["tag","-l",...e],parser(r){return vi(r,t)}}}function gu(e){return{format:"utf-8",commands:["tag",e],parser(){return{name:e}}}}function vu(e,t){return{format:"utf-8",commands:["tag","-a","-m",t,e],parser(){return{name:e}}}}var bu=l({"src/lib/tasks/tag.ts"(){"use strict";hu()}}),yu=Ma({"src/git.js"(e,t){"use strict";var{GitExecutor:r}=(wo(),S(us)),{SimpleGitApi:n}=(bc(),S(Gs)),{Scheduler:s}=(yc(),S(Hs)),{configurationErrorTask:i}=(O(),S(Nt)),{asArray:a,filterArray:o,filterPrimitives:u,filterString:d,filterStringOrStringArray:m,filterType:h,getTrailingOptions:p,trailingFunctionArgument:f,trailingOptionsArgument:F}=(b(),S(Pn)),{applyPatchTask:w}=(kc(),S(Xs)),{branchTask:C,branchLocalTask:B,deleteBranchesTask:he,deleteBranchTask:gt}=(Pc(),S(ei)),{checkIgnoreTask:pe}=(Dc(),S(si)),{checkIsRepoTask:Tr}=(Dn(),S(Mn)),{cloneTask:Ie,cloneMirrorTask:vt}=(Uc(),S(ii)),{cleanWithOptionsTask:Ne,isCleanOptionsArray:bt}=(Xn(),S(qn)),{diffSummaryTask:Ii}=(dr(),S(xs)),{fetchTask:Oi}=(Hc(),S(ci)),{moveTask:Ri}=(Yc(),S(li)),{pullTask:Fi}=(Kc(),S(di)),{pushTagsTask:Pi}=(Bs(),S(Ds)),{addRemoteTask:Mi,getRemotesTask:Li,listRemotesTask:Ai,remoteTask:Di,removeRemoteTask:Bi}=(iu(),S(mi)),{getResetMode:Ni,resetTask:Ui}=(is(),S(rs)),{stashListTask:ji}=(ou(),S(hi)),{addSubModuleTask:$i,initSubModuleTask:Wi,subModuleTask:Gi,updateSubModuleTask:Hi}=(du(),S(pi)),{addAnnotatedTagTask:qi,addTagTask:zi,tagListTask:Xi}=(bu(),S(bi)),{straightThroughBufferTask:Yi,straightThroughStringTask:Q}=(O(),S(Nt));function v(c,g){this._plugins=g,this._executor=new r(c.baseDir,new s(c.maxConcurrentProcesses),g),this._trimmed=c.trimmed}(v.prototype=Object.create(n.prototype)).constructor=v,v.prototype.customBinary=function(c){return this._plugins.reconfigure("binary",c),this},v.prototype.env=function(c,g){return arguments.length===1&&typeof c=="object"?this._executor.env=c:(this._executor.env=this._executor.env||{})[c]=g,this},v.prototype.stashList=function(c){return this._runTask(ji(F(arguments)||{},o(c)&&c||[]),f(arguments))};function Cr(c,g,k,N){return typeof k!="string"?i(`git.${c}() requires a string 'repoPath'`):g(k,h(N,d),p(arguments))}v.prototype.clone=function(){return this._runTask(Cr("clone",Ie,...arguments),f(arguments))},v.prototype.mirror=function(){return this._runTask(Cr("mirror",vt,...arguments),f(arguments))},v.prototype.mv=function(c,g){return this._runTask(Ri(c,g),f(arguments))},v.prototype.checkoutLatestTag=function(c){var g=this;return this.pull(function(){g.tags(function(k,N){g.checkout(N.latest,c)})})},v.prototype.pull=function(c,g,k,N){return this._runTask(Fi(h(c,d),h(g,d),p(arguments)),f(arguments))},v.prototype.fetch=function(c,g){return this._runTask(Oi(h(c,d),h(g,d),p(arguments)),f(arguments))},v.prototype.silent=function(c){return console.warn("simple-git deprecation notice: git.silent: logging should be configured using the `debug` library / `DEBUG` environment variable, this will be an error in version 3"),this},v.prototype.tags=function(c,g){return this._runTask(Xi(p(arguments)),f(arguments))},v.prototype.rebase=function(){return this._runTask(Q(["rebase",...p(arguments)]),f(arguments))},v.prototype.reset=function(c){return this._runTask(Ui(Ni(c),p(arguments)),f(arguments))},v.prototype.revert=function(c){let g=f(arguments);return typeof c!="string"?this._runTask(i("Commit must be a string"),g):this._runTask(Q(["revert",...p(arguments,0,!0),c]),g)},v.prototype.addTag=function(c){let g=typeof c=="string"?zi(c):i("Git.addTag requires a tag name");return this._runTask(g,f(arguments))},v.prototype.addAnnotatedTag=function(c,g){return this._runTask(qi(c,g),f(arguments))},v.prototype.deleteLocalBranch=function(c,g,k){return this._runTask(gt(c,typeof g=="boolean"?g:!1),f(arguments))},v.prototype.deleteLocalBranches=function(c,g,k){return this._runTask(he(c,typeof g=="boolean"?g:!1),f(arguments))},v.prototype.branch=function(c,g){return this._runTask(C(p(arguments)),f(arguments))},v.prototype.branchLocal=function(c){return this._runTask(B(),f(arguments))},v.prototype.raw=function(c){let g=!Array.isArray(c),k=[].slice.call(g?arguments:c,0);for(let K=0;K<k.length&&g;K++)if(!u(k[K])){k.splice(K,k.length-K);break}k.push(...p(arguments,0,!0));var N=f(arguments);return k.length?this._runTask(Q(k,this._trimmed),N):this._runTask(i("Raw: must supply one or more command to execute"),N)},v.prototype.submoduleAdd=function(c,g,k){return this._runTask($i(c,g),f(arguments))},v.prototype.submoduleUpdate=function(c,g){return this._runTask(Hi(p(arguments,!0)),f(arguments))},v.prototype.submoduleInit=function(c,g){return this._runTask(Wi(p(arguments,!0)),f(arguments))},v.prototype.subModule=function(c,g){return this._runTask(Gi(p(arguments)),f(arguments))},v.prototype.listRemote=function(){return this._runTask(Ai(p(arguments)),f(arguments))},v.prototype.addRemote=function(c,g,k){return this._runTask(Mi(c,g,p(arguments)),f(arguments))},v.prototype.removeRemote=function(c,g){return this._runTask(Bi(c),f(arguments))},v.prototype.getRemotes=function(c,g){return this._runTask(Li(c===!0),f(arguments))},v.prototype.remote=function(c,g){return this._runTask(Di(p(arguments)),f(arguments))},v.prototype.tag=function(c,g){let k=p(arguments);return k[0]!=="tag"&&k.unshift("tag"),this._runTask(Q(k),f(arguments))},v.prototype.updateServerInfo=function(c){return this._runTask(Q(["update-server-info"]),f(arguments))},v.prototype.pushTags=function(c,g){let k=Pi({remote:h(c,d)},p(arguments));return this._runTask(k,f(arguments))},v.prototype.rm=function(c){return this._runTask(Q(["rm","-f",...a(c)]),f(arguments))},v.prototype.rmKeepLocal=function(c){return this._runTask(Q(["rm","--cached",...a(c)]),f(arguments))},v.prototype.catFile=function(c,g){return this._catFile("utf-8",arguments)},v.prototype.binaryCatFile=function(){return this._catFile("buffer",arguments)},v.prototype._catFile=function(c,g){var k=f(g),N=["cat-file"],K=g[0];if(typeof K=="string")return this._runTask(i("Git.catFile: options must be supplied as an array of strings"),k);Array.isArray(K)&&N.push.apply(N,K);let yt=c==="buffer"?Yi(N):Q(N);return this._runTask(yt,k)},v.prototype.diff=function(c,g){let k=d(c)?i("git.diff: supplying options as a single string is no longer supported, switch to an array of strings"):Q(["diff",...p(arguments)]);return this._runTask(k,f(arguments))},v.prototype.diffSummary=function(){return this._runTask(Ii(p(arguments,1)),f(arguments))},v.prototype.applyPatch=function(c){let g=m(c)?w(a(c),p([].slice.call(arguments,1))):i("git.applyPatch requires one or more string patches as the first argument");return this._runTask(g,f(arguments))},v.prototype.revparse=function(){let c=["rev-parse",...p(arguments,!0)];return this._runTask(Q(c,!0),f(arguments))},v.prototype.clean=function(c,g,k){let N=bt(c),K=N&&c.join("")||h(c,d)||"",yt=p([].slice.call(arguments,N?1:0));return this._runTask(Ne(K,yt),f(arguments))},v.prototype.exec=function(c){let g={commands:[],format:"utf-8",parser(){typeof c=="function"&&c()}};return this._runTask(g)},v.prototype.clearQueue=function(){return this},v.prototype.checkIgnore=function(c,g){return this._runTask(pe(a(h(c,m,[]))),f(arguments))},v.prototype.checkIsRepo=function(c,g){return this._runTask(Tr(h(c,d)),f(arguments))},t.exports=v}});Pe();ae();var wu=class extends re{constructor(e,t){super(void 0,t),this.config=e}};ae();ae();var te=class extends re{constructor(e,t,r){super(e,r),this.task=e,this.plugin=t,Object.setPrototypeOf(this,new.target.prototype)}};Te();vn();Dn();Xn();Kn();Qn();ts();is();function ku(e){return e?[{type:"spawn.before",action(n,s){e.aborted&&s.kill(new te(void 0,"abort","Abort already signaled"))}},{type:"spawn.after",action(n,s){function i(){s.kill(new te(void 0,"abort","Abort signal received"))}e.addEventListener("abort",i),s.spawned.on("close",()=>e.removeEventListener("abort",i))}}]:void 0}function xu(e){return typeof e=="string"&&e.trim().toLowerCase()==="-c"}function Tu(e,t){if(xu(e)&&/^\s*protocol(.[a-z]+)?.allow/.test(t))throw new te(void 0,"unsafe","Configuring protocol.allow is not permitted without enabling allowUnsafeExtProtocol")}function Cu(e,t){if(/^\s*--(upload|receive)-pack/.test(e))throw new te(void 0,"unsafe","Use of --upload-pack or --receive-pack is not permitted without enabling allowUnsafePack");if(t==="clone"&&/^\s*-u\b/.test(e))throw new te(void 0,"unsafe","Use of clone with option -u is not permitted without enabling allowUnsafePack");if(t==="push"&&/^\s*--exec\b/.test(e))throw new te(void 0,"unsafe","Use of push with option --exec is not permitted without enabling allowUnsafePack")}function _u({allowUnsafeProtocolOverride:e=!1,allowUnsafePack:t=!1}={}){return{type:"spawn.args",action(r,n){return r.forEach((s,i)=>{let a=i<r.length?r[i+1]:"";e||Tu(s,a),t||Cu(s,n.method)}),r}}}b();function Su(e){let t=Re(e,"-c");return{type:"spawn.args",action(r){return[...t,...r]}}}b();var fn=(0,ke.deferred)().promise;function Eu({onClose:e=!0,onExit:t=50}={}){function r(){let s=-1,i={close:(0,ke.deferred)(),closeTimeout:(0,ke.deferred)(),exit:(0,ke.deferred)(),exitTimeout:(0,ke.deferred)()},a=Promise.race([e===!1?fn:i.closeTimeout.promise,t===!1?fn:i.exitTimeout.promise]);return n(e,i.close,i.closeTimeout),n(t,i.exit,i.exitTimeout),{close(o){s=o,i.close.done()},exit(o){s=o,i.exit.done()},get exitCode(){return s},result:a}}function n(s,i,a){s!==!1&&(s===!0?i.promise:i.promise.then(()=>Pt(s))).then(a.done)}return{type:"spawn.after",async action(s,{spawned:i,close:a}){let o=r(),u=!0,d=()=>{u=!1};i.stdout?.on("data",d),i.stderr?.on("data",d),i.on("error",d),i.on("close",m=>o.close(m)),i.on("exit",m=>o.exit(m));try{await o.result,u&&await Pt(50),a(o.exitCode)}catch(m){a(o.exitCode,m)}}}}b();var Iu="Invalid value supplied for custom binary, requires a single string or an array containing either one or two strings",mn="Invalid value supplied for custom binary, restricted characters must be removed or supply the unsafe.allowUnsafeCustomBinary option";function Ou(e){return!e||!/^([a-z]:)?([a-z0-9/.\\_~-]+)$/i.test(e)}function hn(e,t){if(e.length<1||e.length>2)throw new te(void 0,"binary",Iu);if(e.some(Ou))if(t)console.warn(mn);else throw new te(void 0,"binary",mn);let[n,s]=e;return{binary:n,prefix:s}}function Ru(e,t=["git"],r=!1){let n=hn(ee(t),r);e.on("binary",s=>{n=hn(ee(s),r)}),e.append("spawn.binary",()=>n.binary),e.append("spawn.args",s=>n.prefix?[n.prefix,...s]:s)}ae();function Fu(e){return!!(e.exitCode&&e.stdErr.length)}function Pu(e){return Buffer.concat([...e.stdOut,...e.stdErr])}function Mu(e=!1,t=Fu,r=Pu){return(n,s)=>!e&&n||!t(s)?n:r(s)}function pn(e){return{type:"task.error",action(t,r){let n=e(t.error,{stdErr:r.stdErr,stdOut:r.stdOut,exitCode:r.exitCode});return Buffer.isBuffer(n)?{error:new re(void 0,n.toString("utf-8"))}:{error:n}}}}b();var Lu=class{constructor(){this.plugins=new Set,this.events=new yi.EventEmitter}on(e,t){this.events.on(e,t)}reconfigure(e,t){this.events.emit(e,t)}append(e,t){let r=V(this.plugins,{type:e,action:t});return()=>this.plugins.delete(r)}add(e){let t=[];return ee(e).forEach(r=>r&&this.plugins.add(V(t,r))),()=>{t.forEach(r=>this.plugins.delete(r))}}exec(e,t,r){let n=t,s=Object.freeze(Object.create(r));for(let i of this.plugins)i.type===e&&(n=i.action(n,s));return n}};b();function Au(e){let t="--progress",r=["checkout","clone","fetch","pull","push"];return[{type:"spawn.args",action(i,a){return r.includes(a.method)?Cn(i,t):i}},{type:"spawn.after",action(i,a){a.commands.includes(t)&&a.spawned.stderr?.on("data",o=>{let u=/^([\s\S]+?):\s*(\d+)% \((\d+)\/(\d+)\)/.exec(o.toString("utf8"));u&&e({method:a.method,stage:Du(u[1]),progress:x(u[2]),processed:x(u[3]),total:x(u[4])})})}}]}function Du(e){return String(e.toLowerCase().split(" ",1))||"unknown"}b();function Bu(e){let t=Sn(e,["uid","gid"]);return{type:"spawn.options",action(r){return{...t,...r}}}}function Nu({block:e,stdErr:t=!0,stdOut:r=!0}){if(e>0)return{type:"spawn.after",action(n,s){let i;function a(){i&&clearTimeout(i),i=setTimeout(u,e)}function o(){s.spawned.stdout?.off("data",a),s.spawned.stderr?.off("data",a),s.spawned.off("exit",o),s.spawned.off("close",o),i&&clearTimeout(i)}function u(){o(),s.kill(new te(void 0,"timeout","block timeout reached"))}r&&s.spawned.stdout?.on("data",a),t&&s.spawned.stderr?.on("data",a),s.spawned.on("exit",o),s.spawned.on("close",o),a()}}}Pe();function Uu(){return{type:"spawn.args",action(e){let t=[],r;function n(s){(r=r||[]).push(...s)}for(let s=0;s<e.length;s++){let i=e[s];if(Ke(i)){n(Nr(i));continue}if(i==="--"){n(e.slice(s+1).flatMap(a=>Ke(a)&&Nr(a)||a));break}t.push(i)}return r?[...t,"--",...r.map(String)]:t}}}b();var ju=yu();function $u(e,t){let r=new Lu,n=Rn(e&&(typeof e=="string"?{baseDir:e}:e)||{},t);if(!Vt(n.baseDir))throw new wu(n,"Cannot use simple-git on a directory that does not exist");return Array.isArray(n.config)&&r.add(Su(n.config)),r.add(_u(n.unsafe)),r.add(Uu()),r.add(Eu(n.completion)),n.abort&&r.add(ku(n.abort)),n.progress&&r.add(Au(n.progress)),n.timeout&&r.add(Nu(n.timeout)),n.spawnOptions&&r.add(Bu(n.spawnOptions)),r.add(pn(Mu(!0))),n.errors&&r.add(pn(n.errors)),Ru(r,n.binary,n.unsafe?.allowUnsafeCustomBinary),new ju(n,r)}Te();var wi=$u;var gr=class{git=null;async initialize(){let t=ki.workspace.workspaceFolders?.[0];if(!t)return console.log("[MarkdownThreads] gitService.initialize: no workspace folder"),!1;console.log("[MarkdownThreads] gitService.initialize: folder =",t.uri.fsPath),this.git=wi(t.uri.fsPath);try{let r=await this.git.checkIsRepo();return console.log("[MarkdownThreads] gitService.initialize: isRepo =",r),r||(this.git=null),r}catch(r){return console.log("[MarkdownThreads] gitService.initialize: error",r),this.git=null,!1}}async getUserName(){if(this.git||(console.log("[MarkdownThreads] getUserName: git not initialized, retrying..."),await this.initialize()),this.git){try{let t=await this.git.raw(["config","user.name"]);if(t.trim())return t.trim()}catch{}try{let t=await this.git.raw(["config","user.email"]);if(t.trim())return t.trim()}catch{}}console.log("[MarkdownThreads] getUserName: falling back to execSync");try{let t=(0,pr.execSync)("git config --global user.name",{encoding:"utf8"}).trim();if(t)return t}catch{}try{let t=(0,pr.execSync)("git config --global user.email",{encoding:"utf8"}).trim();if(t)return t}catch{}return"Unknown"}},ne=new gr;var _=U(require("vscode")),fe=U(require("path"));var se=U(require("fs")),Se=U(require("path")),_i=U(require("vscode"));var xi=U(require("crypto")),mt=new Uint8Array(256),ft=mt.length;function vr(){return ft>mt.length-16&&(xi.default.randomFillSync(mt),ft=0),mt.slice(ft,ft+=16)}var L=[];for(let e=0;e<256;++e)L.push((e+256).toString(16).slice(1));function Ti(e,t=0){return L[e[t+0]]+L[e[t+1]]+L[e[t+2]]+L[e[t+3]]+"-"+L[e[t+4]]+L[e[t+5]]+"-"+L[e[t+6]]+L[e[t+7]]+"-"+L[e[t+8]]+L[e[t+9]]+"-"+L[e[t+10]]+L[e[t+11]]+L[e[t+12]]+L[e[t+13]]+L[e[t+14]]+L[e[t+15]]}var Ci=U(require("crypto")),br={randomUUID:Ci.default.randomUUID};function Wu(e,t,r){if(br.randomUUID&&!t&&!e)return br.randomUUID();e=e||{};let n=e.random||(e.rng||vr)();if(n[6]=n[6]&15|64,n[8]=n[8]&63|128,t){r=r||0;for(let s=0;s<16;++s)t[r+s]=n[s];return t}return Ti(n)}var _e=Wu;var yr=class{writing=!1;_onDidChange=new _i.EventEmitter;onDidChange=this._onDidChange.event;getSidecarPath(t){let r=Se.dirname(t),n=Se.basename(t,".md");return Se.join(r,`${n}.comments.json`)}sidecarExists(t){return se.existsSync(this.getSidecarPath(t))}async readSidecar(t){let r=this.getSidecarPath(t);if(!se.existsSync(r))return null;try{let n=await se.promises.readFile(r,"utf-8"),s=JSON.parse(n);return this.validateSidecar(s)?s:null}catch(n){return console.error(`Failed to read sidecar file: ${r}`,n),null}}async writeSidecar(t,r,n="internal"){let s=this.getSidecarPath(t),i=`${s}.tmp`;this.writing=!0;try{let a=JSON.stringify(r,null,2);await se.promises.writeFile(i,a,"utf-8"),await se.promises.rename(i,s)}catch(a){throw se.existsSync(i)&&await se.promises.unlink(i),a}finally{setTimeout(()=>{this.writing=!1},500)}this._onDidChange.fire({docPath:t,origin:n})}createEmptySidecar(t){return{doc:t,version:"2.0",comments:[]}}addThread(t,r){let n={...r,id:_e()};return t.comments.push(n),n}addReply(t,r,n){let s=t.comments.find(a=>a.id===r);if(!s)return null;let i={...n,id:_e()};return s.thread.push(i),i}deleteThread(t,r){let n=t.comments.findIndex(s=>s.id===r);return n===-1?!1:(t.comments.splice(n,1),!0)}deleteComment(t,r,n){let s=t.comments.find(i=>i.id===r);return!s||n<0||n>=s.thread.length?!1:(s.thread.splice(n,1),s.thread.length===0&&this.deleteThread(t,r),!0)}deleteCommentById(t,r,n){let s=t.comments.find(a=>a.id===r);if(!s)return!1;let i=s.thread.findIndex(a=>a.id===n);return i===-1?!1:this.deleteComment(t,r,i)}toggleReaction(t,r,n,s){let i=t.comments.find(u=>u.id===r);if(!i)return!1;let a=i.thread.find(u=>u.id===n);if(!a)return!1;a.reactions||(a.reactions=[]);let o=a.reactions.indexOf(s);return o===-1?(a.reactions.push(s),!0):(a.reactions.splice(o,1),!1)}editComment(t,r,n,s){let i=t.comments.find(o=>o.id===r);if(!i)return null;let a=i.thread.find(o=>o.id===n);return a?(a.body=s,a.edited=new Date().toISOString(),a):null}validateSidecar(t){if(!t||typeof t!="object")return!1;let r=t;return!(typeof r.doc!="string"||r.version!=="2.0"||!Array.isArray(r.comments))}},I=new yr;var wr=class{extractContext(t,r,n){let s=t.slice(Math.max(0,r-40),r),i=t.slice(n,n+40);return{prefix:s,suffix:i}}createAnchor(t,r,n,s){return{selectedText:t,textContext:this.extractContext(s,r,n),markdownRange:{startOffset:r,endOffset:n}}}anchorComment(t,r){let{selectedText:n,textContext:s,markdownRange:i}=t;if(r.slice(i.startOffset,i.endOffset)===n)return i;let a=Math.max(0,i.startOffset-500),o=Math.min(r.length,i.endOffset+500),u=r.slice(a,o),d=-1,m=1/0,h=0;for(;;){let w=u.indexOf(n,h);if(w===-1)break;let C=a+w,B=Math.abs(C-i.startOffset);B<m&&(m=B,d=w),h=w+1}if(d!==-1){let w=a+d;return{startOffset:w,endOffset:w+n.length}}let p=s.prefix+n+s.suffix,f=r.indexOf(p);if(f!==-1){let w=f+s.prefix.length;return{startOffset:w,endOffset:w+n.length}}if(s.prefix){let w=s.prefix+n,C=r.indexOf(w);if(C!==-1){let B=C+s.prefix.length;return{startOffset:B,endOffset:B+n.length}}}if(s.suffix){let w=n+s.suffix,C=r.indexOf(w);if(C!==-1)return{startOffset:C,endOffset:C+n.length}}let F=r.indexOf(n);return F!==-1?{startOffset:F,endOffset:F+n.length}:null}detectStaleThreads(t,r){let n=[],s=!1;for(let i of r){let a=this.anchorComment(i.anchor,t);a?((a.startOffset!==i.anchor.markdownRange.startOffset||a.endOffset!==i.anchor.markdownRange.endOffset)&&(s=!0),i.anchor.markdownRange=a,i.anchor.textContext=this.extractContext(t,a.startOffset,a.endOffset),i.status==="stale"&&n.push({thread:i,newStatus:"open"})):i.status!=="stale"&&n.push({thread:i,newStatus:"stale"})}return{updates:n,anchorsMoved:s}}},kr=new wr;var Ee=class e{static viewType="markdownThreads.preview";static instance;static extensionUri;panel;document;disposables=[];updateTimeout;_isUpdating=!1;styleUri;markdownItUri;docDirUri;static setExtensionUri(t){e.extensionUri=t}static async show(t){let r=_.window.activeTextEditor!==void 0,n=r?_.ViewColumn.Beside:_.ViewColumn.One,s=r;if(e.instance){e.instance.document=t,e.instance.panel.reveal(n,s),await e.instance.update();return}if(!e.extensionUri){_.window.showErrorMessage("PreviewPanel.extensionUri not set");return}let i=[..._.workspace.workspaceFolders?.map(o=>o.uri)??[],_.Uri.joinPath(e.extensionUri,"media")],a=_.window.createWebviewPanel(e.viewType,`Preview: ${fe.basename(t.uri.fsPath)}`,{viewColumn:n,preserveFocus:s},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:i});e.instance=new e(a,t),await e.instance.update()}constructor(t,r){this.panel=t,this.document=r,this.styleUri=t.webview.asWebviewUri(_.Uri.joinPath(e.extensionUri,"media","preview-styles.css")),this.markdownItUri=t.webview.asWebviewUri(_.Uri.joinPath(e.extensionUri,"media","markdown-it.min.js")),this.docDirUri=()=>{let n=_.Uri.file(fe.dirname(this.document.uri.fsPath));return t.webview.asWebviewUri(n)},this.panel.onDidDispose(()=>this.dispose(),null,this.disposables),this.disposables.push(_.workspace.onDidSaveTextDocument(n=>{n.uri.toString()===this.document.uri.toString()&&this.scheduleUpdate()})),this.disposables.push(I.onDidChange(n=>{n.origin!=="preview"&&n.docPath===this.document.uri.fsPath&&this.scheduleUpdate()})),this.disposables.push(_.window.onDidChangeActiveTextEditor(n=>{n&&n.document.languageId==="markdown"&&n.document.uri.scheme==="file"&&!n.document.uri.path.includes("commentinput-")&&n.document.uri.toString()!==this.document.uri.toString()&&(this.document=n.document,this.scheduleUpdate())})),this.panel.webview.onDidReceiveMessage(n=>this.handleWebViewMessage(n),null,this.disposables)}async ensureDocumentFresh(){this.document=await _.workspace.openTextDocument(this.document.uri)}async handleWebViewMessage(t){switch(t.command){case"refresh":{await this.update();break}case"addComment":{await this.ensureDocumentFresh();let r=t.selectedText,n=(t.body||"").trim(),s=t.contentOffset||0;if(!r||!n)return;let i=await ne.getUserName(),a=this.document.getText().replace(/\r\n/g,`
`),o=-1,u=1/0,d=0;for(;d<=a.length-r.length;){let F=a.indexOf(r,d);if(F===-1)break;let w=Math.abs(F-s);w<u&&(u=w,o=F),d=F+1}if(o===-1){_.window.showErrorMessage("Could not find selected text in document");return}let m=o+r.length,h=kr.createAnchor(r,o,m,a),p=await I.readSidecar(this.document.uri.fsPath);p||(p=I.createEmptySidecar(fe.basename(this.document.uri.fsPath)));let f=new Date().toISOString();I.addThread(p,{anchor:h,status:"open",thread:[{id:_e(),author:i,body:n,created:f,edited:null}]}),await I.writeSidecar(this.document.uri.fsPath,p,"preview"),await this.update();break}case"replyComment":{let r=t.threadId,n=(t.body||"").trim();if(!n||!r)return;let s=await ne.getUserName(),i=await I.readSidecar(this.document.uri.fsPath);if(!i)return;I.addReply(i,r,{author:s,body:n,created:new Date().toISOString(),edited:null}),await I.writeSidecar(this.document.uri.fsPath,i,"preview"),await this.update();break}case"deleteThread":{let r=t.threadId;if(!r)return;let n=await ne.getUserName(),s=await I.readSidecar(this.document.uri.fsPath);if(!s)return;let i=s.comments.find(a=>a.id===r);if(!i)return;if(i.thread[0]?.author!==n){_.window.showWarningMessage("You can only delete threads you created.");return}I.deleteThread(s,r),await I.writeSidecar(this.document.uri.fsPath,s,"preview"),await this.update();break}case"deleteComment":{let r=t.threadId,n=t.commentId;if(!r||!n)return;let s=await ne.getUserName(),i=await I.readSidecar(this.document.uri.fsPath);if(!i)return;let a=i.comments.find(u=>u.id===r);if(!a)return;let o=a.thread.find(u=>u.id===n);if(!o)return;if(o.author!==s){_.window.showWarningMessage("You can only delete your own comments.");return}I.deleteCommentById(i,r,n),await I.writeSidecar(this.document.uri.fsPath,i,"preview"),await this.update();break}case"editComment":{let r=t.threadId,n=t.commentId,s=(t.body||"").trim();if(!r||!n||!s)return;let i=await ne.getUserName(),a=await I.readSidecar(this.document.uri.fsPath);if(!a)return;let o=a.comments.find(d=>d.id===r);if(!o)return;let u=o.thread.find(d=>d.id===n);if(!u||u.author!==i){_.window.showWarningMessage("You can only edit your own comments.");return}I.editComment(a,r,n,s),await I.writeSidecar(this.document.uri.fsPath,a,"preview"),await this.update();break}case"openExternal":{let r=t.url;r&&/^https?:\/\//i.test(r)&&_.commands.executeCommand("simpleBrowser.show",r);break}}}scheduleUpdate(){this.updateTimeout&&clearTimeout(this.updateTimeout),this.panel.visible&&(this.updateTimeout=setTimeout(()=>this.update(),300))}async update(){if(!this._isUpdating){this._isUpdating=!0;try{await this.ensureDocumentFresh();let t=this.document.getText().replace(/\r\n/g,`
`),r=await I.readSidecar(this.document.uri.fsPath),n=[];if(r){let{updates:a,anchorsMoved:o}=kr.detectStaleThreads(t,r.comments);for(let{thread:u,newStatus:d}of a)u.status=d;n=r.comments,(a.length>0||o)&&await I.writeSidecar(this.document.uri.fsPath,r,"internal")}n.sort((a,o)=>a.anchor.markdownRange.startOffset-o.anchor.markdownRange.startOffset);let s=n.map(a=>{let o=n.filter(u=>u.anchor.selectedText===a.anchor.selectedText&&u.anchor.markdownRange.startOffset<a.anchor.markdownRange.startOffset).length;return{id:a.id,selectedText:a.anchor.selectedText,occurrenceIndex:o,status:a.status,color:a.color,thread:a.thread,startOffset:a.anchor.markdownRange.startOffset}}),i=await ne.getUserName();this.panel.title=`Preview: ${fe.basename(this.document.uri.fsPath)}`,this.panel.webview.html=this.buildHtml(t,s,i)}finally{this._isUpdating=!1}}}buildHtml(t,r,n){let s=Gu(),i=this.panel.webview.cspSource,a=JSON.stringify(r).replace(/</g,"\\u003c"),o=JSON.stringify(n).replace(/</g,"\\u003c"),u=fe.basename(this.document.uri.fsPath),d=this.docDirUri().toString();return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src ${i} 'unsafe-inline'; script-src ${i} 'unsafe-inline' https://cdn.jsdelivr.net 'nonce-${s}' 'unsafe-eval'; img-src ${i} https: data:; font-src ${i};">
  <link href="${this.styleUri}" rel="stylesheet">
  <title>${Si(u)}</title>
</head>
<body>
  <div id="layout">
    <div id="content-scroll">
      <div class="doc-header">
        <div class="doc-header-row">
          <h1>${Si(u)}</h1>
          <button class="refresh-btn" id="refreshBtn" title="Refresh document">&#x21bb; Refresh</button>
        </div>
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
    const docDirBase = ${JSON.stringify(d)};
${Hu}
  </script>
</body>
</html>`}dispose(){e.instance=void 0,this.updateTimeout&&clearTimeout(this.updateTimeout),this.panel.dispose();for(let t of this.disposables)t.dispose()}};function Gu(){let e="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let r=0;r<32;r++)e+=t.charAt(Math.floor(Math.random()*t.length));return e}function Si(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var Hu=`
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
      window.addEventListener('load', renderMarkdown, { once: true });
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
          + '<button onclick="zoomDiagram(\\'' + dId + '\\', -1)" title="Zoom out">&#x2796;</button>'
          + '<span class="zoom-level" id="zoom-label-' + dId + '">100%</span>'
          + '<button onclick="zoomDiagram(\\'' + dId + '\\', 1)" title="Zoom in">&#x2795;</button>'
          + '<button onclick="resetDiagram(\\'' + dId + '\\')" title="Reset view">Reset</button>'
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

  // Expose to global scope for onclick attributes in toolbar buttons
  window.zoomDiagram = zoomDiagram;
  window.resetDiagram = resetDiagram;

  // Attach wheel + drag handlers to all diagram viewports
  (function() {
    function setupViewport(vp) {
      var dId = vp.id.replace('viewport-', '');
      var dragging = false;
      var lastX = 0, lastY = 0;

      vp.addEventListener('wheel', function(e) {
        e.preventDefault();
        var s = getDiagramState(dId);
        var rect = vp.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        var oldScale = s.scale;
        var delta = e.deltaY < 0 ? 0.15 : -0.15;
        var newScale = Math.max(0.25, Math.min(4, oldScale + delta));
        newScale = Math.round(newScale * 100) / 100;

        // Zoom towards the cursor position
        var ratio = newScale / oldScale;
        s.translateX = mouseX - ratio * (mouseX - s.translateX);
        s.translateY = mouseY - ratio * (mouseY - s.translateY);
        s.scale = newScale;
        applyTransform(dId);
      }, { passive: false });

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
`;var T=U(require("vscode")),D=U(require("path"));var xr=class extends T.TreeItem{constructor(r,n,s){super(r,T.TreeItemCollapsibleState.None);this.label=r;this.uri=n;this.commentCount=s;this.resourceUri=n,this.tooltip=n.fsPath,this.contextValue="markdownFile",this.command={command:"markdownThreads.openPreview",title:"Open Preview",arguments:[n]},s>0&&(this.description=`${s} comment${s>1?"s":""}`),this.iconPath=new T.ThemeIcon("markdown")}label;uri;commentCount},ht=class extends T.TreeItem{constructor(r,n,s){super(r,T.TreeItemCollapsibleState.Expanded);this.label=r;this.folderPath=n;this.children=s;this.contextValue="folder",this.iconPath=T.ThemeIcon.Folder}label;folderPath;children};function Ei(e){let t=e.filter(n=>n.length>0);return t.length===0?void 0:t.length===1?`**/${t[0]}/**`:`{${t.map(n=>`**/${n}/**`).join(",")}}`}var pt=class{_onDidChangeTreeData=new T.EventEmitter;onDidChangeTreeData=this._onDidChangeTreeData.event;fileWatcher;sidecarWatcher;configWatcher;selectedFolder;constructor(){this.fileWatcher=T.workspace.createFileSystemWatcher("**/*.md"),this.fileWatcher.onDidCreate(()=>this.refresh()),this.fileWatcher.onDidDelete(()=>this.refresh()),this.fileWatcher.onDidChange(()=>this.refresh()),this.sidecarWatcher=T.workspace.createFileSystemWatcher("**/*.comments.json"),this.sidecarWatcher.onDidCreate(()=>this.refresh()),this.sidecarWatcher.onDidDelete(()=>this.refresh()),this.sidecarWatcher.onDidChange(()=>this.refresh()),this.configWatcher=T.workspace.onDidChangeConfiguration(t=>{t.affectsConfiguration("markdownThreads.excludeFolders")&&this.refresh()})}async selectFolder(){let t=T.workspace.workspaceFolders?.[0]?.uri.fsPath;if(!t)return;let r=T.workspace.getConfiguration("markdownThreads").get("excludeFolders",[]),n=Ei(r),s=await T.workspace.findFiles("**/*.md",n),i=new Set;i.add("");for(let d of s){let m=D.relative(t,d.fsPath),h=D.dirname(m);if(h!=="."){let p=h.split(D.sep),f="";for(let F of p)f=f?D.join(f,F):F,i.add(f)}}let a=[{label:"$(home) All Folders",description:"Show all markdown files",detail:""}],o=Array.from(i).filter(d=>d!=="").sort();for(let d of o)a.push({label:`$(folder) ${d}`,description:"",detail:d});let u=await T.window.showQuickPick(a,{placeHolder:"Select a folder to filter markdown files",title:"Filter by Folder"});u&&(this.selectedFolder=u.detail||void 0,this.refresh())}getSelectedFolderName(){return this.selectedFolder||"All Folders"}refresh(){this._onDidChangeTreeData.fire()}getTreeItem(t){return t}async getChildren(t){if(!T.workspace.workspaceFolders)return[];if(t instanceof ht)return t.children;if(t)return[];let r=T.workspace.workspaceFolders[0].uri.fsPath,n=this.selectedFolder?`${this.selectedFolder}/**/*.md`:"**/*.md",s=T.workspace.getConfiguration("markdownThreads").get("excludeFolders",[]),i=Ei(s),a=await T.workspace.findFiles(n,i);if(this.selectedFolder){let u=D.join(r,this.selectedFolder);a=a.filter(d=>d.fsPath.startsWith(u))}return a.length===0?[]:await this.buildTree(a)}async buildTree(t){let r=T.workspace.workspaceFolders?.[0]?.uri.fsPath??"",n=new Map;for(let a of t){let o=D.relative(r,a.fsPath),u=D.dirname(o),d=u==="."?"":u;n.has(d)||n.set(d,[]),n.get(d).push(a)}let s=Array.from(n.keys()).sort(),i=[];for(let a of s){let o=n.get(a);o.sort((d,m)=>D.basename(d.fsPath).localeCompare(D.basename(m.fsPath)));let u=[];for(let d of o){let m=await this.getCommentCount(d.fsPath);u.push(new xr(D.basename(d.fsPath),d,m))}a===""?i.push(...u):i.push(new ht(a,D.join(r,a),u))}return i}async getCommentCount(t){return(await I.readSidecar(t))?.comments.length??0}dispose(){this.fileWatcher?.dispose(),this.sidecarWatcher?.dispose(),this.configWatcher?.dispose(),this._onDidChangeTreeData.dispose()}};var me;async function qu(e){console.log("[MarkdownThreads] Extension activating..."),console.log("[MarkdownThreads] Workspace folders:",Y.workspace.workspaceFolders?.map(r=>r.uri.fsPath)),Ee.setExtensionUri(e.extensionUri),me=new pt;let t=Y.window.createTreeView("markdownThreads.files",{treeDataProvider:me,showCollapseAll:!0});e.subscriptions.push(t),e.subscriptions.push({dispose:()=>me.dispose()}),me.onDidChangeTreeData(()=>{t.description=me.getSelectedFolderName()}),e.subscriptions.push(Y.commands.registerCommand("markdownThreads.refreshFiles",()=>me.refresh()),Y.commands.registerCommand("markdownThreads.selectFolder",()=>me.selectFolder()),Y.commands.registerCommand("markdownThreads.openPreview",async r=>{let n;if(r){n=await Y.workspace.openTextDocument(r);for(let s of Y.window.tabGroups.all)for(let i of s.tabs){let a=i.input?.uri;a&&a.toString()===r.toString()&&await Y.window.tabGroups.close(i)}await Ee.show(n);return}else{let s=Y.window.activeTextEditor;s&&s.document.languageId==="markdown"&&(n=s.document)}if(!n||n.languageId!=="markdown"){Y.window.showWarningMessage("Open a markdown file to preview with comments");return}await Ee.show(n)}));try{await ne.initialize()}catch(r){console.error("[MarkdownThreads] Git initialization failed:",r)}}function zu(){}0&&(module.exports={activate,deactivate});
