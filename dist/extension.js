"use strict";var sa=Object.create;var ze=Object.defineProperty;var ia=Object.getOwnPropertyDescriptor;var aa=Object.getOwnPropertyNames;var oa=Object.getPrototypeOf,ca=Object.prototype.hasOwnProperty;var te=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),ua=(e,t)=>{for(var r in t)ze(e,r,{get:t[r],enumerable:!0})},Rr=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of aa(t))!ca.call(e,s)&&s!==r&&ze(e,s,{get:()=>t[s],enumerable:!(n=ia(t,s))||n.enumerable});return e};var M=(e,t,r)=>(r=e!=null?sa(oa(e)):{},Rr(t||!e||!e.__esModule?ze(r,"default",{value:e,enumerable:!0}):r,e)),la=e=>Rr(ze({},"__esModule",{value:!0}),e);var Fr=te((ol,Or)=>{var ye=1e3,we=ye*60,ke=we*60,fe=ke*24,da=fe*7,fa=fe*365.25;Or.exports=function(e,t){t=t||{};var r=typeof e;if(r==="string"&&e.length>0)return ma(e);if(r==="number"&&isFinite(e))return t.long?ha(e):pa(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))};function ma(e){if(e=String(e),!(e.length>100)){var t=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);if(t){var r=parseFloat(t[1]),n=(t[2]||"ms").toLowerCase();switch(n){case"years":case"year":case"yrs":case"yr":case"y":return r*fa;case"weeks":case"week":case"w":return r*da;case"days":case"day":case"d":return r*fe;case"hours":case"hour":case"hrs":case"hr":case"h":return r*ke;case"minutes":case"minute":case"mins":case"min":case"m":return r*we;case"seconds":case"second":case"secs":case"sec":case"s":return r*ye;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return r;default:return}}}}function pa(e){var t=Math.abs(e);return t>=fe?Math.round(e/fe)+"d":t>=ke?Math.round(e/ke)+"h":t>=we?Math.round(e/we)+"m":t>=ye?Math.round(e/ye)+"s":e+"ms"}function ha(e){var t=Math.abs(e);return t>=fe?Ge(e,t,fe,"day"):t>=ke?Ge(e,t,ke,"hour"):t>=we?Ge(e,t,we,"minute"):t>=ye?Ge(e,t,ye,"second"):e+" ms"}function Ge(e,t,r,n){var s=t>=r*1.5;return Math.round(e/r)+" "+n+(s?"s":"")}});var Tt=te((cl,Lr)=>{function ga(e){r.debug=r,r.default=r,r.coerce=c,r.disable=a,r.enable=s,r.enabled=o,r.humanize=Fr(),r.destroy=m,Object.keys(e).forEach(f=>{r[f]=e[f]}),r.names=[],r.skips=[],r.formatters={};function t(f){let l=0;for(let h=0;h<f.length;h++)l=(l<<5)-l+f.charCodeAt(h),l|=0;return r.colors[Math.abs(l)%r.colors.length]}r.selectColor=t;function r(f){let l,h=null,p,R;function k(...T){if(!k.enabled)return;let L=k,ne=Number(new Date),Fe=ne-(l||ne);L.diff=Fe,L.prev=l,L.curr=ne,l=ne,T[0]=r.coerce(T[0]),typeof T[0]!="string"&&T.unshift("%O");let de=0;T[0]=T[0].replace(/%([a-zA-Z%])/g,(ce,Le)=>{if(ce==="%%")return"%";de++;let Pe=r.formatters[Le];if(typeof Pe=="function"){let qe=T[de];ce=Pe.call(L,qe),T.splice(de,1),de--}return ce}),r.formatArgs.call(L,T),(L.log||r.log).apply(L,T)}return k.namespace=f,k.useColors=r.useColors(),k.color=r.selectColor(f),k.extend=n,k.destroy=r.destroy,Object.defineProperty(k,"enabled",{enumerable:!0,configurable:!1,get:()=>h!==null?h:(p!==r.namespaces&&(p=r.namespaces,R=r.enabled(f)),R),set:T=>{h=T}}),typeof r.init=="function"&&r.init(k),k}function n(f,l){let h=r(this.namespace+(typeof l>"u"?":":l)+f);return h.log=this.log,h}function s(f){r.save(f),r.namespaces=f,r.names=[],r.skips=[];let l=(typeof f=="string"?f:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let h of l)h[0]==="-"?r.skips.push(h.slice(1)):r.names.push(h)}function i(f,l){let h=0,p=0,R=-1,k=0;for(;h<f.length;)if(p<l.length&&(l[p]===f[h]||l[p]==="*"))l[p]==="*"?(R=p,k=h,p++):(h++,p++);else if(R!==-1)p=R+1,k++,h=k;else return!1;for(;p<l.length&&l[p]==="*";)p++;return p===l.length}function a(){let f=[...r.names,...r.skips.map(l=>"-"+l)].join(",");return r.enable(""),f}function o(f){for(let l of r.skips)if(i(f,l))return!1;for(let l of r.names)if(i(f,l))return!0;return!1}function c(f){return f instanceof Error?f.stack||f.message:f}function m(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return r.enable(r.load()),r}Lr.exports=ga});var Pr=te((j,Ve)=>{j.formatArgs=ba;j.save=ya;j.load=wa;j.useColors=va;j.storage=ka();j.destroy=(()=>{let e=!1;return()=>{e||(e=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();j.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function va(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let e;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(e=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(e[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function ba(e){if(e[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+e[0]+(this.useColors?"%c ":" ")+"+"+Ve.exports.humanize(this.diff),!this.useColors)return;let t="color: "+this.color;e.splice(1,0,t,"color: inherit");let r=0,n=0;e[0].replace(/%[a-zA-Z%]/g,s=>{s!=="%%"&&(r++,s==="%c"&&(n=r))}),e.splice(n,0,t)}j.log=console.debug||console.log||(()=>{});function ya(e){try{e?j.storage.setItem("debug",e):j.storage.removeItem("debug")}catch{}}function wa(){let e;try{e=j.storage.getItem("debug")||j.storage.getItem("DEBUG")}catch{}return!e&&typeof process<"u"&&"env"in process&&(e=process.env.DEBUG),e}function ka(){try{return localStorage}catch{}}Ve.exports=Tt()(j);var{formatters:xa}=Ve.exports;xa.j=function(e){try{return JSON.stringify(e)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}}});var Ar=te((ul,Dr)=>{"use strict";Dr.exports=(e,t)=>{t=t||process.argv;let r=e.startsWith("-")?"":e.length===1?"-":"--",n=t.indexOf(r+e),s=t.indexOf("--");return n!==-1&&(s===-1?!0:n<s)}});var Br=te((ll,Mr)=>{"use strict";var Ta=require("os"),Q=Ar(),B=process.env,xe;Q("no-color")||Q("no-colors")||Q("color=false")?xe=!1:(Q("color")||Q("colors")||Q("color=true")||Q("color=always"))&&(xe=!0);"FORCE_COLOR"in B&&(xe=B.FORCE_COLOR.length===0||parseInt(B.FORCE_COLOR,10)!==0);function Ca(e){return e===0?!1:{level:e,hasBasic:!0,has256:e>=2,has16m:e>=3}}function Sa(e){if(xe===!1)return 0;if(Q("color=16m")||Q("color=full")||Q("color=truecolor"))return 3;if(Q("color=256"))return 2;if(e&&!e.isTTY&&xe!==!0)return 0;let t=xe?1:0;if(process.platform==="win32"){let r=Ta.release().split(".");return Number(process.versions.node.split(".")[0])>=8&&Number(r[0])>=10&&Number(r[2])>=10586?Number(r[2])>=14931?3:2:1}if("CI"in B)return["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI"].some(r=>r in B)||B.CI_NAME==="codeship"?1:t;if("TEAMCITY_VERSION"in B)return/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(B.TEAMCITY_VERSION)?1:0;if(B.COLORTERM==="truecolor")return 3;if("TERM_PROGRAM"in B){let r=parseInt((B.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(B.TERM_PROGRAM){case"iTerm.app":return r>=3?3:2;case"Apple_Terminal":return 2}}return/-256(color)?$/i.test(B.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(B.TERM)||"COLORTERM"in B?1:(B.TERM==="dumb",t)}function Ct(e){let t=Sa(e);return Ca(t)}Mr.exports={supportsColor:Ct,stdout:Ct(process.stdout),stderr:Ct(process.stderr)}});var Ur=te((P,Ye)=>{var Ea=require("tty"),Xe=require("util");P.init=Pa;P.log=Oa;P.formatArgs=Ia;P.save=Fa;P.load=La;P.useColors=_a;P.destroy=Xe.deprecate(()=>{},"Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");P.colors=[6,2,3,4,5,1];try{let e=Br();e&&(e.stderr||e).level>=2&&(P.colors=[20,21,26,27,32,33,38,39,40,41,42,43,44,45,56,57,62,63,68,69,74,75,76,77,78,79,80,81,92,93,98,99,112,113,128,129,134,135,148,149,160,161,162,163,164,165,166,167,168,169,170,171,172,173,178,179,184,185,196,197,198,199,200,201,202,203,204,205,206,207,208,209,214,215,220,221])}catch{}P.inspectOpts=Object.keys(process.env).filter(e=>/^debug_/i.test(e)).reduce((e,t)=>{let r=t.substring(6).toLowerCase().replace(/_([a-z])/g,(s,i)=>i.toUpperCase()),n=process.env[t];return/^(yes|on|true|enabled)$/i.test(n)?n=!0:/^(no|off|false|disabled)$/i.test(n)?n=!1:n==="null"?n=null:n=Number(n),e[r]=n,e},{});function _a(){return"colors"in P.inspectOpts?!!P.inspectOpts.colors:Ea.isatty(process.stderr.fd)}function Ia(e){let{namespace:t,useColors:r}=this;if(r){let n=this.color,s="\x1B[3"+(n<8?n:"8;5;"+n),i=`  ${s};1m${t} \x1B[0m`;e[0]=i+e[0].split(`
`).join(`
`+i),e.push(s+"m+"+Ye.exports.humanize(this.diff)+"\x1B[0m")}else e[0]=Ra()+t+" "+e[0]}function Ra(){return P.inspectOpts.hideDate?"":new Date().toISOString()+" "}function Oa(...e){return process.stderr.write(Xe.formatWithOptions(P.inspectOpts,...e)+`
`)}function Fa(e){e?process.env.DEBUG=e:delete process.env.DEBUG}function La(){return process.env.DEBUG}function Pa(e){e.inspectOpts={};let t=Object.keys(P.inspectOpts);for(let r=0;r<t.length;r++)e.inspectOpts[t[r]]=P.inspectOpts[t[r]]}Ye.exports=Tt()(P);var{formatters:Nr}=Ye.exports;Nr.o=function(e){return this.inspectOpts.colors=this.useColors,Xe.inspect(e,this.inspectOpts).split(`
`).map(t=>t.trim()).join(" ")};Nr.O=function(e){return this.inspectOpts.colors=this.useColors,Xe.inspect(e,this.inspectOpts)}});var Et=te((dl,St)=>{typeof process>"u"||process.type==="renderer"||process.browser===!0||process.__nwjs?St.exports=Pr():St.exports=Ur()});var $r=te(G=>{"use strict";var Da=G&&G.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(G,"__esModule",{value:!0});var Aa=require("fs"),Ma=Da(Et()),Te=Ma.default("@kwsites/file-exists");function Ba(e,t,r){Te("checking %s",e);try{let n=Aa.statSync(e);return n.isFile()&&t?(Te("[OK] path represents a file"),!0):n.isDirectory()&&r?(Te("[OK] path represents a directory"),!0):(Te("[FAIL] path represents something other than a file or directory"),!1)}catch(n){if(n.code==="ENOENT")return Te("[FAIL] path is not accessible: %o",n),!1;throw Te("[FATAL] %o",n),n}}function Na(e,t=G.READABLE){return Ba(e,(t&G.FILE)>0,(t&G.FOLDER)>0)}G.exists=Na;G.FILE=1;G.FOLDER=2;G.READABLE=G.FILE+G.FOLDER});var jr=te(Ke=>{"use strict";function Ua(e){for(var t in e)Ke.hasOwnProperty(t)||(Ke[t]=e[t])}Object.defineProperty(Ke,"__esModule",{value:!0});Ua($r())});var It=te(me=>{"use strict";Object.defineProperty(me,"__esModule",{value:!0});me.createDeferred=me.deferred=void 0;function _t(){let e,t,r="pending";return{promise:new Promise((s,i)=>{e=s,t=i}),done(s){r==="pending"&&(r="resolved",e(s))},fail(s){r==="pending"&&(r="rejected",t(s))},get fulfilled(){return r!=="pending"},get status(){return r}}}me.deferred=_t;me.createDeferred=_t;me.default=_t});var il={};ua(il,{activate:()=>nl,deactivate:()=>sl});module.exports=la(il);var Y=M(require("vscode"));var Si=M(require("vscode")),br=require("child_process");var xn=require("node:buffer"),ct=M(jr(),1),it=M(Et(),1),fs=require("child_process"),Ys=M(It(),1),ai=require("node:path"),Ce=M(It(),1),Ti=require("node:events"),Yt=Object.defineProperty,$a=Object.getOwnPropertyDescriptor,Kt=Object.getOwnPropertyNames,ja=Object.prototype.hasOwnProperty,d=(e,t)=>function(){return e&&(t=(0,e[Kt(e)[0]])(e=0)),t},Wa=(e,t)=>function(){return t||(0,e[Kt(e)[0]])((t={exports:{}}).exports,t),t.exports},F=(e,t)=>{for(var r in t)Yt(e,r,{get:t[r],enumerable:!0})},Ha=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Kt(t))!ja.call(e,s)&&s!==r&&Yt(e,s,{get:()=>t[s],enumerable:!(n=$a(t,s))||n.enumerable});return e},E=e=>Ha(Yt({},"__esModule",{value:!0}),e);function qa(...e){let t=new String(e);return ot.set(t,e),t}function rt(e){return e instanceof String&&ot.has(e)}function Wr(e){return ot.get(e)||[]}var ot,Be=d({"src/lib/args/pathspec.ts"(){"use strict";ot=new WeakMap}}),ie,le=d({"src/lib/errors/git-error.ts"(){"use strict";ie=class extends Error{constructor(e,t){super(t),this.task=e,Object.setPrototypeOf(this,new.target.prototype)}}}}),Ne,Ee=d({"src/lib/errors/git-response-error.ts"(){"use strict";le(),Ne=class extends ie{constructor(e,t){super(void 0,t||String(e)),this.git=e}}}}),wn,kn=d({"src/lib/errors/task-configuration-error.ts"(){"use strict";le(),wn=class extends ie{constructor(e){super(void 0,e)}}}});function Tn(e){return typeof e!="function"?ge:e}function Cn(e){return typeof e=="function"&&e!==ge}function Sn(e,t){let r=e.indexOf(t);return r<=0?[e,""]:[e.substr(0,r),e.substr(r+1)]}function En(e,t=0){return _n(e)&&e.length>t?e[t]:void 0}function he(e,t=0){if(_n(e)&&e.length>t)return e[e.length-1-t]}function _n(e){return ft(e)}function Ue(e="",t=!0,r=`
`){return e.split(r).reduce((n,s)=>{let i=t?s.trim():s;return i&&n.push(i),n},[])}function Jt(e,t){return Ue(e,!0).map(r=>t(r))}function Qt(e){return(0,ct.exists)(e,ct.FOLDER)}function K(e,t){return Array.isArray(e)?e.includes(t)||e.push(t):e.add(t),t}function In(e,t){return Array.isArray(e)&&!e.includes(t)&&e.push(t),e}function ut(e,t){if(Array.isArray(e)){let r=e.indexOf(t);r>=0&&e.splice(r,1)}else e.delete(t);return t}function re(e){return Array.isArray(e)?e:[e]}function Rn(e){return e.replace(/[\s-]+(.)/g,(t,r)=>r.toUpperCase())}function _e(e){return re(e).map(t=>t instanceof String?t:String(t))}function C(e,t=0){if(e==null)return t;let r=parseInt(e,10);return Number.isNaN(r)?t:r}function Ae(e,t){let r=[];for(let n=0,s=e.length;n<s;n++)r.push(t,e[n]);return r}function Me(e){return(Array.isArray(e)?xn.Buffer.concat(e):e).toString("utf-8")}function On(e,t){let r={};return t.forEach(n=>{e[n]!==void 0&&(r[n]=e[n])}),r}function At(e=0){return new Promise(t=>setTimeout(t,e))}function Mt(e){if(e!==!1)return e}var Se,ge,$e,lt=d({"src/lib/utils/util.ts"(){"use strict";Zt(),Se="\0",ge=()=>{},$e=Object.prototype.toString.call.bind(Object.prototype.toString)}});function X(e,t,r){return t(e)?e:arguments.length>2?r:void 0}function Bt(e,t){let r=rt(e)?"string":typeof e;return/number|string|boolean/.test(r)&&(!t||!t.includes(r))}function dt(e){return!!e&&$e(e)==="[object Object]"}function Fn(e){return typeof e=="function"}var je,Ln,D,nt,ft,Zt=d({"src/lib/utils/argument-filters.ts"(){"use strict";Be(),lt(),je=e=>Array.isArray(e),Ln=e=>typeof e=="number",D=e=>typeof e=="string",nt=e=>D(e)||Array.isArray(e)&&e.every(D),ft=e=>e==null||"number|boolean|function".includes(typeof e)?!1:typeof e.length=="number"}}),Nt,za=d({"src/lib/utils/exit-codes.ts"(){"use strict";Nt=(e=>(e[e.SUCCESS=0]="SUCCESS",e[e.ERROR=1]="ERROR",e[e.NOT_FOUND=-2]="NOT_FOUND",e[e.UNCLEAN=128]="UNCLEAN",e))(Nt||{})}}),st,Ga=d({"src/lib/utils/git-output-streams.ts"(){"use strict";st=class Pn{constructor(t,r){this.stdOut=t,this.stdErr=r}asStrings(){return new Pn(this.stdOut.toString("utf8"),this.stdErr.toString("utf8"))}}}});function Va(){throw new Error("LineParser:useMatches not implemented")}var y,ue,Xa=d({"src/lib/utils/line-parser.ts"(){"use strict";y=class{constructor(e,t){this.matches=[],this.useMatches=Va,this.parse=(r,n)=>(this.resetMatches(),this._regExp.every((s,i)=>this.addMatch(s,i,r(i)))?this.useMatches(n,this.prepareMatches())!==!1:!1),this._regExp=Array.isArray(e)?e:[e],t&&(this.useMatches=t)}resetMatches(){this.matches.length=0}prepareMatches(){return this.matches}addMatch(e,t,r){let n=r&&e.exec(r);return n&&this.pushMatch(t,n),!!n}pushMatch(e,t){this.matches.push(...t.slice(1))}},ue=class extends y{addMatch(e,t,r){return/^remote:\s/.test(String(r))&&super.addMatch(e,t,r)}pushMatch(e,t){(e>0||t.length>1)&&super.pushMatch(e,t)}}}});function Dn(...e){let t=process.cwd(),r=Object.assign({baseDir:t,...An},...e.filter(n=>typeof n=="object"&&n));return r.baseDir=r.baseDir||t,r.trimmed=r.trimmed===!0,r}var An,Ya=d({"src/lib/utils/simple-git-options.ts"(){"use strict";An={binary:"git",maxConcurrentProcesses:5,config:[],trimmed:!1}}});function er(e,t=[]){return dt(e)?Object.keys(e).reduce((r,n)=>{let s=e[n];if(rt(s))r.push(s);else if(Bt(s,["boolean"]))r.push(n+"="+s);else if(Array.isArray(s))for(let i of s)Bt(i,["string","number"])||r.push(n+"="+i);else r.push(n);return r},t):t}function W(e,t=0,r=!1){let n=[];for(let s=0,i=t<0?e.length:t;s<i;s++)"string|number".includes(typeof e[s])&&n.push(String(e[s]));return er(tr(e),n),r||n.push(...Ka(e)),n}function Ka(e){let t=typeof he(e)=="function";return _e(X(he(e,t?1:0),je,[]))}function tr(e){let t=Fn(he(e));return X(he(e,t?1:0),dt)}function _(e,t=!0){let r=Tn(he(e));return t||Cn(r)?r:void 0}var Ja=d({"src/lib/utils/task-options.ts"(){"use strict";Zt(),lt(),Be()}});function Ut(e,t){return e(t.stdOut,t.stdErr)}function q(e,t,r,n=!0){return re(r).forEach(s=>{for(let i=Ue(s,n),a=0,o=i.length;a<o;a++){let c=(m=0)=>{if(!(a+m>=o))return i[a+m]};t.some(({parse:m})=>m(c,e))}}),e}var Qa=d({"src/lib/utils/task-parser.ts"(){"use strict";lt()}}),Mn={};F(Mn,{ExitCodes:()=>Nt,GitOutputStreams:()=>st,LineParser:()=>y,NOOP:()=>ge,NULL:()=>Se,RemoteLineParser:()=>ue,append:()=>K,appendTaskOptions:()=>er,asArray:()=>re,asCamelCase:()=>Rn,asFunction:()=>Tn,asNumber:()=>C,asStringArray:()=>_e,bufferToString:()=>Me,callTaskParser:()=>Ut,createInstanceConfig:()=>Dn,delay:()=>At,filterArray:()=>je,filterFunction:()=>Fn,filterHasLength:()=>ft,filterNumber:()=>Ln,filterPlainObject:()=>dt,filterPrimitives:()=>Bt,filterString:()=>D,filterStringOrStringArray:()=>nt,filterType:()=>X,first:()=>En,folderExists:()=>Qt,forEachLineWithContent:()=>Jt,getTrailingOptions:()=>W,including:()=>In,isUserFunction:()=>Cn,last:()=>he,objectToString:()=>$e,orVoid:()=>Mt,parseStringResponse:()=>q,pick:()=>On,prefixedArray:()=>Ae,remove:()=>ut,splitOn:()=>Sn,toLinesWithContent:()=>Ue,trailingFunctionArgument:()=>_,trailingOptionsArgument:()=>tr});var b=d({"src/lib/utils/index.ts"(){"use strict";Zt(),za(),Ga(),Xa(),Ya(),Ja(),Qa(),lt()}}),Bn={};F(Bn,{CheckRepoActions:()=>$t,checkIsBareRepoTask:()=>Un,checkIsRepoRootTask:()=>Nn,checkIsRepoTask:()=>Za});function Za(e){switch(e){case"bare":return Un();case"root":return Nn()}return{commands:["rev-parse","--is-inside-work-tree"],format:"utf-8",onError:mt,parser:rr}}function Nn(){return{commands:["rev-parse","--git-dir"],format:"utf-8",onError:mt,parser(t){return/^\.(git)?$/.test(t.trim())}}}function Un(){return{commands:["rev-parse","--is-bare-repository"],format:"utf-8",onError:mt,parser:rr}}function eo(e){return/(Not a git repository|Kein Git-Repository)/i.test(String(e))}var $t,mt,rr,$n=d({"src/lib/tasks/check-is-repo.ts"(){"use strict";b(),$t=(e=>(e.BARE="bare",e.IN_TREE="tree",e.IS_REPO_ROOT="root",e))($t||{}),mt=({exitCode:e},t,r,n)=>{if(e===128&&eo(t))return r(Buffer.from("false"));n(t)},rr=e=>e.trim()==="true"}});function to(e,t){let r=new jn(e),n=e?Hn:Wn;return Ue(t).forEach(s=>{let i=s.replace(n,"");r.paths.push(i),(qn.test(i)?r.folders:r.files).push(i)}),r}var jn,Wn,Hn,qn,ro=d({"src/lib/responses/CleanSummary.ts"(){"use strict";b(),jn=class{constructor(e){this.dryRun=e,this.paths=[],this.files=[],this.folders=[]}},Wn=/^[a-z]+\s*/i,Hn=/^[a-z]+\s+[a-z]+\s*/i,qn=/\/$/}}),jt={};F(jt,{EMPTY_COMMANDS:()=>pt,adhocExecTask:()=>zn,configurationErrorTask:()=>H,isBufferTask:()=>Vn,isEmptyTask:()=>Xn,straightThroughBufferTask:()=>Gn,straightThroughStringTask:()=>$});function zn(e){return{commands:pt,format:"empty",parser:e}}function H(e){return{commands:pt,format:"empty",parser(){throw typeof e=="string"?new wn(e):e}}}function $(e,t=!1){return{commands:e,format:"utf-8",parser(r){return t?String(r).trim():r}}}function Gn(e){return{commands:e,format:"buffer",parser(t){return t}}}function Vn(e){return e.format==="buffer"}function Xn(e){return e.format==="empty"||!e.commands.length}var pt,O=d({"src/lib/tasks/task.ts"(){"use strict";kn(),pt=[]}}),Yn={};F(Yn,{CONFIG_ERROR_INTERACTIVE_MODE:()=>nr,CONFIG_ERROR_MODE_REQUIRED:()=>sr,CONFIG_ERROR_UNKNOWN_OPTION:()=>ir,CleanOptions:()=>Qe,cleanTask:()=>Kn,cleanWithOptionsTask:()=>no,isCleanOptionsArray:()=>so});function no(e,t){let{cleanMode:r,options:n,valid:s}=io(e);return r?s.options?(n.push(...t),n.some(co)?H(nr):Kn(r,n)):H(ir+JSON.stringify(e)):H(sr)}function Kn(e,t){return{commands:["clean",`-${e}`,...t],format:"utf-8",parser(n){return to(e==="n",n)}}}function so(e){return Array.isArray(e)&&e.every(t=>ar.has(t))}function io(e){let t,r=[],n={cleanMode:!1,options:!0};return e.replace(/[^a-z]i/g,"").split("").forEach(s=>{ao(s)?(t=s,n.cleanMode=!0):n.options=n.options&&oo(r[r.length]=`-${s}`)}),{cleanMode:t,options:r,valid:n}}function ao(e){return e==="f"||e==="n"}function oo(e){return/^-[a-z]$/i.test(e)&&ar.has(e.charAt(1))}function co(e){return/^-[^\-]/.test(e)?e.indexOf("i")>0:e==="--interactive"}var nr,sr,ir,Qe,ar,Jn=d({"src/lib/tasks/clean.ts"(){"use strict";ro(),b(),O(),nr="Git clean interactive mode is not supported",sr='Git clean mode parameter ("n" or "f") is required',ir="Git clean unknown option found in: ",Qe=(e=>(e.DRY_RUN="n",e.FORCE="f",e.IGNORED_INCLUDED="x",e.IGNORED_ONLY="X",e.EXCLUDING="e",e.QUIET="q",e.RECURSIVE="d",e))(Qe||{}),ar=new Set(["i",..._e(Object.values(Qe))])}});function uo(e){let t=new Zn;for(let r of Qn(e))t.addValue(r.file,String(r.key),r.value);return t}function lo(e,t){let r=null,n=[],s=new Map;for(let i of Qn(e,t))i.key===t&&(n.push(r=i.value),s.has(i.file)||s.set(i.file,[]),s.get(i.file).push(r));return{key:t,paths:Array.from(s.keys()),scopes:s,value:r,values:n}}function fo(e){return e.replace(/^(file):/,"")}function*Qn(e,t=null){let r=e.split("\0");for(let n=0,s=r.length-1;n<s;){let i=fo(r[n++]),a=r[n++],o=t;if(a.includes(`
`)){let c=Sn(a,`
`);o=c[0],a=c[1]}yield{file:i,key:o,value:a}}}var Zn,mo=d({"src/lib/responses/ConfigList.ts"(){"use strict";b(),Zn=class{constructor(){this.files=[],this.values=Object.create(null)}get all(){return this._all||(this._all=this.files.reduce((e,t)=>Object.assign(e,this.values[t]),{})),this._all}addFile(e){if(!(e in this.values)){let t=he(this.files);this.values[e]=t?Object.create(this.values[t]):{},this.files.push(e)}return this.values[e]}addValue(e,t,r){let n=this.addFile(e);Object.hasOwn(n,t)?Array.isArray(n[t])?n[t].push(r):n[t]=[n[t],r]:n[t]=r,this._all=void 0}}}});function Rt(e,t){return typeof e=="string"&&Object.hasOwn(Wt,e)?e:t}function po(e,t,r,n){let s=["config",`--${n}`];return r&&s.push("--add"),s.push(e,t),{commands:s,format:"utf-8",parser(i){return i}}}function ho(e,t){let r=["config","--null","--show-origin","--get-all",e];return t&&r.splice(1,0,`--${t}`),{commands:r,format:"utf-8",parser(n){return lo(n,e)}}}function go(e){let t=["config","--list","--show-origin","--null"];return e&&t.push(`--${e}`),{commands:t,format:"utf-8",parser(r){return uo(r)}}}function vo(){return{addConfig(e,t,...r){return this._runTask(po(e,t,r[0]===!0,Rt(r[1],"local")),_(arguments))},getConfig(e,t){return this._runTask(ho(e,Rt(t,void 0)),_(arguments))},listConfig(...e){return this._runTask(go(Rt(e[0],void 0)),_(arguments))}}}var Wt,es=d({"src/lib/tasks/config.ts"(){"use strict";mo(),b(),Wt=(e=>(e.system="system",e.global="global",e.local="local",e.worktree="worktree",e))(Wt||{})}});function bo(e){return ts.has(e)}var Ot,ts,rs=d({"src/lib/tasks/diff-name-status.ts"(){"use strict";Ot=(e=>(e.ADDED="A",e.COPIED="C",e.DELETED="D",e.MODIFIED="M",e.RENAMED="R",e.CHANGED="T",e.UNMERGED="U",e.UNKNOWN="X",e.BROKEN="B",e))(Ot||{}),ts=new Set(Object.values(Ot))}});function yo(...e){return new ss().param(...e)}function wo(e){let t=new Set,r={};return Jt(e,n=>{let[s,i,a]=n.split(Se);t.add(s),(r[s]=r[s]||[]).push({line:C(i),path:s,preview:a})}),{paths:t,results:r}}function ko(){return{grep(e){let t=_(arguments),r=W(arguments);for(let s of ns)if(r.includes(s))return this._runTask(H(`git.grep: use of "${s}" is not supported.`),t);typeof e=="string"&&(e=yo().param(e));let n=["grep","--null","-n","--full-name",...r,...e];return this._runTask({commands:n,format:"utf-8",parser(s){return wo(s)}},t)}}}var ns,De,Hr,ss,is=d({"src/lib/tasks/grep.ts"(){"use strict";b(),O(),ns=["-h"],De=Symbol("grepQuery"),ss=class{constructor(){this[Hr]=[]}*[(Hr=De,Symbol.iterator)](){for(let e of this[De])yield e}and(...e){return e.length&&this[De].push("--and","(",...Ae(e,"-e"),")"),this}param(...e){return this[De].push(...Ae(e,"-e")),this}}}}),as={};F(as,{ResetMode:()=>Ze,getResetMode:()=>To,resetTask:()=>xo});function xo(e,t){let r=["reset"];return os(e)&&r.push(`--${e}`),r.push(...t),$(r)}function To(e){if(os(e))return e;switch(typeof e){case"string":case"undefined":return"soft"}}function os(e){return typeof e=="string"&&cs.includes(e)}var Ze,cs,us=d({"src/lib/tasks/reset.ts"(){"use strict";b(),O(),Ze=(e=>(e.MIXED="mixed",e.SOFT="soft",e.HARD="hard",e.MERGE="merge",e.KEEP="keep",e))(Ze||{}),cs=_e(Object.values(Ze))}});function Co(){return(0,it.default)("simple-git")}function qr(e,t,r){return!t||!String(t).replace(/\s*/,"")?r?(n,...s)=>{e(n,...s),r(n,...s)}:e:(n,...s)=>{e(`%s ${n}`,t,...s),r&&r(n,...s)}}function So(e,t,{namespace:r}){if(typeof e=="string")return e;let n=t&&t.namespace||"";return n.startsWith(r)?n.substr(r.length+1):n||r}function or(e,t,r,n=Co()){let s=e&&`[${e}]`||"",i=[],a=typeof t=="string"?n.extend(t):t,o=So(X(t,D),a,n);return m(r);function c(f,l){return K(i,or(e,o.replace(/^[^:]+/,f),l,n))}function m(f){let l=f&&`[${f}]`||"",h=a&&qr(a,l)||ge,p=qr(n,`${s} ${l}`,h);return Object.assign(a?h:p,{label:e,sibling:c,info:p,step:m})}}var ls=d({"src/lib/git-logger.ts"(){"use strict";b(),it.default.formatters.L=e=>String(ft(e)?e.length:"-"),it.default.formatters.B=e=>Buffer.isBuffer(e)?e.toString("utf8"):$e(e)}}),ds,Eo=d({"src/lib/runners/tasks-pending-queue.ts"(){"use strict";le(),ls(),ds=class Ht{constructor(t="GitExecutor"){this.logLabel=t,this._queue=new Map}withProgress(t){return this._queue.get(t)}createProgress(t){let r=Ht.getName(t.commands[0]),n=or(this.logLabel,r);return{task:t,logger:n,name:r}}push(t){let r=this.createProgress(t);return r.logger("Adding task to the queue, commands = %o",t.commands),this._queue.set(t,r),r}fatal(t){for(let[r,{logger:n}]of Array.from(this._queue.entries()))r===t.task?(n.info("Failed %o",t),n("Fatal exception, any as-yet un-started tasks run through this executor will not be attempted")):n.info("A fatal exception occurred in a previous task, the queue has been purged: %o",t.message),this.complete(r);if(this._queue.size!==0)throw new Error(`Queue size should be zero after fatal: ${this._queue.size}`)}complete(t){this.withProgress(t)&&this._queue.delete(t)}attempt(t){let r=this.withProgress(t);if(!r)throw new ie(void 0,"TasksPendingQueue: attempt called for an unknown task");return r.logger("Starting task"),r}static getName(t="empty"){return`task:${t}:${++Ht.counter}`}static{this.counter=0}}}});function pe(e,t){return{method:En(e.commands)||"",commands:t}}function _o(e,t){return r=>{t("[ERROR] child process exception %o",r),e.push(Buffer.from(String(r.stack),"ascii"))}}function zr(e,t,r,n){return s=>{r("%s received %L bytes",t,s),n("%B",s),e.push(s)}}var qt,Io=d({"src/lib/runners/git-executor-chain.ts"(){"use strict";le(),O(),b(),Eo(),qt=class{constructor(e,t,r){this._executor=e,this._scheduler=t,this._plugins=r,this._chain=Promise.resolve(),this._queue=new ds}get cwd(){return this._cwd||this._executor.cwd}set cwd(e){this._cwd=e}get env(){return this._executor.env}get outputHandler(){return this._executor.outputHandler}chain(){return this}push(e){return this._queue.push(e),this._chain=this._chain.then(()=>this.attemptTask(e))}async attemptTask(e){let t=await this._scheduler.next(),r=()=>this._queue.complete(e);try{let{logger:n}=this._queue.attempt(e);return await(Xn(e)?this.attemptEmptyTask(e,n):this.attemptRemoteTask(e,n))}catch(n){throw this.onFatalException(e,n)}finally{r(),t()}}onFatalException(e,t){let r=t instanceof ie?Object.assign(t,{task:e}):new ie(e,t&&String(t));return this._chain=Promise.resolve(),this._queue.fatal(r),r}async attemptRemoteTask(e,t){let r=this._plugins.exec("spawn.binary","",pe(e,e.commands)),n=this._plugins.exec("spawn.args",[...e.commands],pe(e,e.commands)),s=await this.gitResponse(e,r,n,this.outputHandler,t.step("SPAWN")),i=await this.handleTaskData(e,n,s,t.step("HANDLE"));return t("passing response to task's parser as a %s",e.format),Vn(e)?Ut(e.parser,i):Ut(e.parser,i.asStrings())}async attemptEmptyTask(e,t){return t("empty task bypassing child process to call to task's parser"),e.parser(this)}handleTaskData(e,t,r,n){let{exitCode:s,rejection:i,stdOut:a,stdErr:o}=r;return new Promise((c,m)=>{n("Preparing to handle process response exitCode=%d stdOut=",s);let{error:f}=this._plugins.exec("task.error",{error:i},{...pe(e,t),...r});if(f&&e.onError)return n.info("exitCode=%s handling with custom error handler"),e.onError(r,f,l=>{n.info("custom error handler treated as success"),n("custom error returned a %s",$e(l)),c(new st(Array.isArray(l)?Buffer.concat(l):l,Buffer.concat(o)))},m);if(f)return n.info("handling as error: exitCode=%s stdErr=%s rejection=%o",s,o.length,i),m(f);n.info("retrieving task output complete"),c(new st(Buffer.concat(a),Buffer.concat(o)))})}async gitResponse(e,t,r,n,s){let i=s.sibling("output"),a=this._plugins.exec("spawn.options",{cwd:this.cwd,env:this.env,windowsHide:!0},pe(e,e.commands));return new Promise(o=>{let c=[],m=[];s.info("%s %o",t,r),s("%O",a);let f=this._beforeSpawn(e,r);if(f)return o({stdOut:c,stdErr:m,exitCode:9901,rejection:f});this._plugins.exec("spawn.before",void 0,{...pe(e,r),kill(h){f=h||f}});let l=(0,fs.spawn)(t,r,a);l.stdout.on("data",zr(c,"stdOut",s,i.step("stdOut"))),l.stderr.on("data",zr(m,"stdErr",s,i.step("stdErr"))),l.on("error",_o(m,s)),n&&(s("Passing child process stdOut/stdErr to custom outputHandler"),n(t,l.stdout,l.stderr,[...r])),this._plugins.exec("spawn.after",void 0,{...pe(e,r),spawned:l,close(h,p){o({stdOut:c,stdErr:m,exitCode:h,rejection:f||p})},kill(h){l.killed||(f=h,l.kill("SIGINT"))}})})}_beforeSpawn(e,t){let r;return this._plugins.exec("spawn.before",void 0,{...pe(e,t),kill(n){r=n||r}}),r}}}}),ms={};F(ms,{GitExecutor:()=>ps});var ps,Ro=d({"src/lib/runners/git-executor.ts"(){"use strict";Io(),ps=class{constructor(e,t,r){this.cwd=e,this._scheduler=t,this._plugins=r,this._chain=new qt(this,this._scheduler,this._plugins)}chain(){return new qt(this,this._scheduler,this._plugins)}push(e){return this._chain.push(e)}}}});function Oo(e,t,r=ge){let n=i=>{r(null,i)},s=i=>{i?.task===e&&r(i instanceof Ne?Fo(i):i,void 0)};t.then(n,s)}function Fo(e){let t=n=>{console.warn(`simple-git deprecation notice: accessing GitResponseError.${n} should be GitResponseError.git.${n}, this will no longer be available in version 3`),t=ge};return Object.create(e,Object.getOwnPropertyNames(e.git).reduce(r,{}));function r(n,s){return s in e||(n[s]={enumerable:!1,configurable:!1,get(){return t(s),e.git[s]}}),n}}var Lo=d({"src/lib/task-callback.ts"(){"use strict";Ee(),b()}});function Gr(e,t){return zn(r=>{if(!Qt(e))throw new Error(`Git.cwd: cannot change to non-directory "${e}"`);return(t||r).cwd=e})}var Po=d({"src/lib/tasks/change-working-directory.ts"(){"use strict";b(),O()}});function Ft(e){let t=["checkout",...e];return t[1]==="-b"&&t.includes("-B")&&(t[1]=ut(t,"-B")),$(t)}function Do(){return{checkout(){return this._runTask(Ft(W(arguments,1)),_(arguments))},checkoutBranch(e,t){return this._runTask(Ft(["-b",e,t,...W(arguments)]),_(arguments))},checkoutLocalBranch(e){return this._runTask(Ft(["-b",e,...W(arguments)]),_(arguments))}}}var Ao=d({"src/lib/tasks/checkout.ts"(){"use strict";b(),O()}});function Mo(){return{count:0,garbage:0,inPack:0,packs:0,prunePackable:0,size:0,sizeGarbage:0,sizePack:0}}function Bo(){return{countObjects(){return this._runTask({commands:["count-objects","--verbose"],format:"utf-8",parser(e){return q(Mo(),[hs],e)}})}}}var hs,No=d({"src/lib/tasks/count-objects.ts"(){"use strict";b(),hs=new y(/([a-z-]+): (\d+)$/,(e,[t,r])=>{let n=Rn(t);Object.hasOwn(e,n)&&(e[n]=C(r))})}});function Uo(e){return q({author:null,branch:"",commit:"",root:!1,summary:{changes:0,insertions:0,deletions:0}},gs,e)}var gs,$o=d({"src/lib/parsers/parse-commit.ts"(){"use strict";b(),gs=[new y(/^\[([^\s]+)( \([^)]+\))? ([^\]]+)/,(e,[t,r,n])=>{e.branch=t,e.commit=n,e.root=!!r}),new y(/\s*Author:\s(.+)/i,(e,[t])=>{let r=t.split("<"),n=r.pop();!n||!n.includes("@")||(e.author={email:n.substr(0,n.length-1),name:r.join("<").trim()})}),new y(/(\d+)[^,]*(?:,\s*(\d+)[^,]*)(?:,\s*(\d+))/g,(e,[t,r,n])=>{e.summary.changes=parseInt(t,10)||0,e.summary.insertions=parseInt(r,10)||0,e.summary.deletions=parseInt(n,10)||0}),new y(/^(\d+)[^,]*(?:,\s*(\d+)[^(]+\(([+-]))?/,(e,[t,r,n])=>{e.summary.changes=parseInt(t,10)||0;let s=parseInt(r,10)||0;n==="-"?e.summary.deletions=s:n==="+"&&(e.summary.insertions=s)})]}});function jo(e,t,r){return{commands:["-c","core.abbrev=40","commit",...Ae(e,"-m"),...t,...r],format:"utf-8",parser:Uo}}function Wo(){return{commit(t,...r){let n=_(arguments),s=e(t)||jo(re(t),re(X(r[0],nt,[])),[..._e(X(r[1],je,[])),...W(arguments,0,!0)]);return this._runTask(s,n)}};function e(t){return!nt(t)&&H("git.commit: requires the commit message to be supplied as a string/string[]")}}var Ho=d({"src/lib/tasks/commit.ts"(){"use strict";$o(),b(),O()}});function qo(){return{firstCommit(){return this._runTask($(["rev-list","--max-parents=0","HEAD"],!0),_(arguments))}}}var zo=d({"src/lib/tasks/first-commit.ts"(){"use strict";b(),O()}});function Go(e,t){let r=["hash-object",e];return t&&r.push("-w"),$(r,!0)}var Vo=d({"src/lib/tasks/hash-object.ts"(){"use strict";O()}});function Xo(e,t,r){let n=String(r).trim(),s;if(s=vs.exec(n))return new et(e,t,!1,s[1]);if(s=bs.exec(n))return new et(e,t,!0,s[1]);let i="",a=n.split(" ");for(;a.length;)if(a.shift()==="in"){i=a.join(" ");break}return new et(e,t,/^re/i.test(n),i)}var et,vs,bs,Yo=d({"src/lib/responses/InitSummary.ts"(){"use strict";et=class{constructor(e,t,r,n){this.bare=e,this.path=t,this.existing=r,this.gitDir=n}},vs=/^Init.+ repository in (.+)$/,bs=/^Rein.+ in (.+)$/}});function Ko(e){return e.includes(cr)}function Jo(e=!1,t,r){let n=["init",...r];return e&&!Ko(n)&&n.splice(1,0,cr),{commands:n,format:"utf-8",parser(s){return Xo(n.includes("--bare"),t,s)}}}var cr,Qo=d({"src/lib/tasks/init.ts"(){"use strict";Yo(),cr="--bare"}});function ur(e){for(let t=0;t<e.length;t++){let r=lr.exec(e[t]);if(r)return`--${r[1]}`}return""}function Zo(e){return lr.test(e)}var lr,We=d({"src/lib/args/log-format.ts"(){"use strict";lr=/^--(stat|numstat|name-only|name-status)(=|$)/}}),ys,ec=d({"src/lib/responses/DiffSummary.ts"(){"use strict";ys=class{constructor(){this.changed=0,this.deletions=0,this.insertions=0,this.files=[]}}}});function ws(e=""){let t=ks[e];return r=>q(new ys,t,r,!1)}var Lt,Vr,Xr,Yr,ks,xs=d({"src/lib/parsers/parse-diff-summary.ts"(){"use strict";We(),ec(),rs(),b(),Lt=[new y(/^(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/,(e,[t,r,n=""])=>{e.files.push({file:t.trim(),changes:C(r),insertions:n.replace(/[^+]/g,"").length,deletions:n.replace(/[^-]/g,"").length,binary:!1})}),new y(/^(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)/,(e,[t,r,n])=>{e.files.push({file:t.trim(),before:C(r),after:C(n),binary:!0})}),new y(/(\d+) files? changed\s*((?:, \d+ [^,]+){0,2})/,(e,[t,r])=>{let n=/(\d+) i/.exec(r),s=/(\d+) d/.exec(r);e.changed=C(t),e.insertions=C(n?.[1]),e.deletions=C(s?.[1])})],Vr=[new y(/(\d+)\t(\d+)\t(.+)$/,(e,[t,r,n])=>{let s=C(t),i=C(r);e.changed++,e.insertions+=s,e.deletions+=i,e.files.push({file:n,changes:s+i,insertions:s,deletions:i,binary:!1})}),new y(/-\t-\t(.+)$/,(e,[t])=>{e.changed++,e.files.push({file:t,after:0,before:0,binary:!0})})],Xr=[new y(/(.+)$/,(e,[t])=>{e.changed++,e.files.push({file:t,changes:0,insertions:0,deletions:0,binary:!1})})],Yr=[new y(/([ACDMRTUXB])([0-9]{0,3})\t(.[^\t]*)(\t(.[^\t]*))?$/,(e,[t,r,n,s,i])=>{e.changed++,e.files.push({file:i??n,changes:0,insertions:0,deletions:0,binary:!1,status:Mt(bo(t)&&t),from:Mt(!!i&&n!==i&&n),similarity:C(r)})})],ks={"":Lt,"--stat":Lt,"--numstat":Vr,"--name-status":Yr,"--name-only":Xr}}});function tc(e,t){return t.reduce((r,n,s)=>(r[n]=e[s]||"",r),Object.create({diff:null}))}function Ts(e=mr,t=Cs,r=""){let n=ws(r);return function(s){let i=Ue(s.trim(),!1,dr).map(function(a){let o=a.split(fr),c=tc(o[0].split(e),t);return o.length>1&&o[1].trim()&&(c.diff=n(o[1])),c});return{all:i,latest:i.length&&i[0]||null,total:i.length}}}var dr,fr,mr,Cs,Ss=d({"src/lib/parsers/parse-list-log-summary.ts"(){"use strict";b(),xs(),We(),dr="\xF2\xF2\xF2\xF2\xF2\xF2 ",fr=" \xF2\xF2",mr=" \xF2 ",Cs=["hash","date","message","refs","author_name","author_email"]}}),Es={};F(Es,{diffSummaryTask:()=>rc,validateLogFormatConfig:()=>ht});function rc(e){let t=ur(e),r=["diff"];return t===""&&(t="--stat",r.push("--stat=4096")),r.push(...e),ht(r)||{commands:r,format:"utf-8",parser:ws(t)}}function ht(e){let t=e.filter(Zo);if(t.length>1)return H(`Summary flags are mutually exclusive - pick one of ${t.join(",")}`);if(t.length&&e.includes("-z"))return H(`Summary flag ${t} parsing is not compatible with null termination option '-z'`)}var pr=d({"src/lib/tasks/diff.ts"(){"use strict";We(),xs(),O()}});function nc(e,t){let r=[],n=[];return Object.keys(e).forEach(s=>{r.push(s),n.push(String(e[s]))}),[r,n.join(t)]}function sc(e){return Object.keys(e).reduce((t,r)=>(r in zt||(t[r]=e[r]),t),{})}function _s(e={},t=[]){let r=X(e.splitter,D,mr),n=dt(e.format)?e.format:{hash:"%H",date:e.strictDate===!1?"%ai":"%aI",message:"%s",refs:"%D",body:e.multiLine?"%B":"%b",author_name:e.mailMap!==!1?"%aN":"%an",author_email:e.mailMap!==!1?"%aE":"%ae"},[s,i]=nc(n,r),a=[],o=[`--pretty=format:${dr}${i}${fr}`,...t],c=e.n||e["max-count"]||e.maxCount;if(c&&o.push(`--max-count=${c}`),e.from||e.to){let m=e.symmetric!==!1?"...":"..";a.push(`${e.from||""}${m}${e.to||""}`)}return D(e.file)&&o.push("--follow",qa(e.file)),er(sc(e),o),{fields:s,splitter:r,commands:[...o,...a]}}function ic(e,t,r){let n=Ts(e,t,ur(r));return{commands:["log",...r],format:"utf-8",parser:n}}function ac(){return{log(...r){let n=_(arguments),s=_s(tr(arguments),_e(X(arguments[0],je,[]))),i=t(...r)||ht(s.commands)||e(s);return this._runTask(i,n)}};function e(r){return ic(r.splitter,r.fields,r.commands)}function t(r,n){return D(r)&&D(n)&&H("git.log(string, string) should be replaced with git.log({ from: string, to: string })")}}var zt,Is=d({"src/lib/tasks/log.ts"(){"use strict";We(),Be(),Ss(),b(),O(),pr(),zt=(e=>(e[e["--pretty"]=0]="--pretty",e[e["max-count"]=1]="max-count",e[e.maxCount=2]="maxCount",e[e.n=3]="n",e[e.file=4]="file",e[e.format=5]="format",e[e.from=6]="from",e[e.to=7]="to",e[e.splitter=8]="splitter",e[e.symmetric=9]="symmetric",e[e.mailMap=10]="mailMap",e[e.multiLine=11]="multiLine",e[e.strictDate=12]="strictDate",e))(zt||{})}}),tt,Rs,oc=d({"src/lib/responses/MergeSummary.ts"(){"use strict";tt=class{constructor(e,t=null,r){this.reason=e,this.file=t,this.meta=r}toString(){return`${this.file}:${this.reason}`}},Rs=class{constructor(){this.conflicts=[],this.merges=[],this.result="success"}get failed(){return this.conflicts.length>0}get reason(){return this.result}toString(){return this.conflicts.length?`CONFLICTS: ${this.conflicts.join(", ")}`:"OK"}}}}),Gt,Os,cc=d({"src/lib/responses/PullSummary.ts"(){"use strict";Gt=class{constructor(){this.remoteMessages={all:[]},this.created=[],this.deleted=[],this.files=[],this.deletions={},this.insertions={},this.summary={changes:0,deletions:0,insertions:0}}},Os=class{constructor(){this.remote="",this.hash={local:"",remote:""},this.branch={local:"",remote:""},this.message=""}toString(){return this.message}}}});function Pt(e){return e.objects=e.objects||{compressing:0,counting:0,enumerating:0,packReused:0,reused:{count:0,delta:0},total:{count:0,delta:0}}}function Kr(e){let t=/^\s*(\d+)/.exec(e),r=/delta (\d+)/i.exec(e);return{count:C(t&&t[1]||"0"),delta:C(r&&r[1]||"0")}}var Fs,uc=d({"src/lib/parsers/parse-remote-objects.ts"(){"use strict";b(),Fs=[new ue(/^remote:\s*(enumerating|counting|compressing) objects: (\d+),/i,(e,[t,r])=>{let n=t.toLowerCase(),s=Pt(e.remoteMessages);Object.assign(s,{[n]:C(r)})}),new ue(/^remote:\s*(enumerating|counting|compressing) objects: \d+% \(\d+\/(\d+)\),/i,(e,[t,r])=>{let n=t.toLowerCase(),s=Pt(e.remoteMessages);Object.assign(s,{[n]:C(r)})}),new ue(/total ([^,]+), reused ([^,]+), pack-reused (\d+)/i,(e,[t,r,n])=>{let s=Pt(e.remoteMessages);s.total=Kr(t),s.reused=Kr(r),s.packReused=C(n)})]}});function Ls(e,t){return q({remoteMessages:new Ds},Ps,t)}var Ps,Ds,As=d({"src/lib/parsers/parse-remote-messages.ts"(){"use strict";b(),uc(),Ps=[new ue(/^remote:\s*(.+)$/,(e,[t])=>(e.remoteMessages.all.push(t.trim()),!1)),...Fs,new ue([/create a (?:pull|merge) request/i,/\s(https?:\/\/\S+)$/],(e,[t])=>{e.remoteMessages.pullRequestUrl=t}),new ue([/found (\d+) vulnerabilities.+\(([^)]+)\)/i,/\s(https?:\/\/\S+)$/],(e,[t,r,n])=>{e.remoteMessages.vulnerabilities={count:C(t),summary:r,url:n}})],Ds=class{constructor(){this.all=[]}}}});function lc(e,t){let r=q(new Os,Ms,[e,t]);return r.message&&r}var Jr,Qr,Zr,en,Ms,tn,hr,Bs=d({"src/lib/parsers/parse-pull.ts"(){"use strict";cc(),b(),As(),Jr=/^\s*(.+?)\s+\|\s+\d+\s*(\+*)(-*)/,Qr=/(\d+)\D+((\d+)\D+\(\+\))?(\D+(\d+)\D+\(-\))?/,Zr=/^(create|delete) mode \d+ (.+)/,en=[new y(Jr,(e,[t,r,n])=>{e.files.push(t),r&&(e.insertions[t]=r.length),n&&(e.deletions[t]=n.length)}),new y(Qr,(e,[t,,r,,n])=>r!==void 0||n!==void 0?(e.summary.changes=+t||0,e.summary.insertions=+r||0,e.summary.deletions=+n||0,!0):!1),new y(Zr,(e,[t,r])=>{K(e.files,r),K(t==="create"?e.created:e.deleted,r)})],Ms=[new y(/^from\s(.+)$/i,(e,[t])=>{e.remote=t}),new y(/^fatal:\s(.+)$/,(e,[t])=>{e.message=t}),new y(/([a-z0-9]+)\.\.([a-z0-9]+)\s+(\S+)\s+->\s+(\S+)$/,(e,[t,r,n,s])=>{e.branch.local=n,e.hash.local=t,e.branch.remote=s,e.hash.remote=r})],tn=(e,t)=>q(new Gt,en,[e,t]),hr=(e,t)=>Object.assign(new Gt,tn(e,t),Ls(e,t))}}),rn,Ns,nn,dc=d({"src/lib/parsers/parse-merge.ts"(){"use strict";oc(),b(),Bs(),rn=[new y(/^Auto-merging\s+(.+)$/,(e,[t])=>{e.merges.push(t)}),new y(/^CONFLICT\s+\((.+)\): Merge conflict in (.+)$/,(e,[t,r])=>{e.conflicts.push(new tt(t,r))}),new y(/^CONFLICT\s+\((.+\/delete)\): (.+) deleted in (.+) and/,(e,[t,r,n])=>{e.conflicts.push(new tt(t,r,{deleteRef:n}))}),new y(/^CONFLICT\s+\((.+)\):/,(e,[t])=>{e.conflicts.push(new tt(t,null))}),new y(/^Automatic merge failed;\s+(.+)$/,(e,[t])=>{e.result=t})],Ns=(e,t)=>Object.assign(nn(e,t),hr(e,t)),nn=e=>q(new Rs,rn,e)}});function sn(e){return e.length?{commands:["merge",...e],format:"utf-8",parser(t,r){let n=Ns(t,r);if(n.failed)throw new Ne(n);return n}}:H("Git.merge requires at least one option")}var fc=d({"src/lib/tasks/merge.ts"(){"use strict";Ee(),dc(),O()}});function mc(e,t,r){let n=r.includes("deleted"),s=r.includes("tag")||/^refs\/tags/.test(e),i=!r.includes("new");return{deleted:n,tag:s,branch:!s,new:!i,alreadyUpdated:i,local:e,remote:t}}var an,Us,on,pc=d({"src/lib/parsers/parse-push.ts"(){"use strict";b(),As(),an=[new y(/^Pushing to (.+)$/,(e,[t])=>{e.repo=t}),new y(/^updating local tracking ref '(.+)'/,(e,[t])=>{e.ref={...e.ref||{},local:t}}),new y(/^[=*-]\s+([^:]+):(\S+)\s+\[(.+)]$/,(e,[t,r,n])=>{e.pushed.push(mc(t,r,n))}),new y(/^Branch '([^']+)' set up to track remote branch '([^']+)' from '([^']+)'/,(e,[t,r,n])=>{e.branch={...e.branch||{},local:t,remote:r,remoteName:n}}),new y(/^([^:]+):(\S+)\s+([a-z0-9]+)\.\.([a-z0-9]+)$/,(e,[t,r,n,s])=>{e.update={head:{local:t,remote:r},hash:{from:n,to:s}}})],Us=(e,t)=>{let r=on(e,t),n=Ls(e,t);return{...r,...n}},on=(e,t)=>q({pushed:[]},an,[e,t])}}),$s={};F($s,{pushTagsTask:()=>hc,pushTask:()=>gr});function hc(e={},t){return K(t,"--tags"),gr(e,t)}function gr(e={},t){let r=["push",...t];return e.branch&&r.splice(1,0,e.branch),e.remote&&r.splice(1,0,e.remote),ut(r,"-v"),K(r,"--verbose"),K(r,"--porcelain"),{commands:r,format:"utf-8",parser:Us}}var js=d({"src/lib/tasks/push.ts"(){"use strict";pc(),b()}});function gc(){return{showBuffer(){let e=["show",...W(arguments,1)];return e.includes("--binary")||e.splice(1,0,"--binary"),this._runTask(Gn(e),_(arguments))},show(){let e=["show",...W(arguments,1)];return this._runTask($(e),_(arguments))}}}var vc=d({"src/lib/tasks/show.ts"(){"use strict";b(),O()}}),cn,Ws,bc=d({"src/lib/responses/FileStatusSummary.ts"(){"use strict";cn=/^(.+)\0(.+)$/,Ws=class{constructor(e,t,r){if(this.path=e,this.index=t,this.working_dir=r,t==="R"||r==="R"){let n=cn.exec(e)||[null,e,e];this.from=n[2]||"",this.path=n[1]||""}}}}});function un(e){let[t,r]=e.split(Se);return{from:r||t,to:t}}function V(e,t,r){return[`${e}${t}`,r]}function Dt(e,...t){return t.map(r=>V(e,r,(n,s)=>n.conflicted.push(s)))}function yc(e,t){let r=t.trim();switch(" "){case r.charAt(2):return n(r.charAt(0),r.charAt(1),r.slice(3));case r.charAt(1):return n(" ",r.charAt(0),r.slice(2));default:return}function n(s,i,a){let o=`${s}${i}`,c=Hs.get(o);c&&c(e,a),o!=="##"&&o!=="!!"&&e.files.push(new Ws(a,s,i))}}var ln,Hs,qs,wc=d({"src/lib/responses/StatusSummary.ts"(){"use strict";b(),bc(),ln=class{constructor(){this.not_added=[],this.conflicted=[],this.created=[],this.deleted=[],this.ignored=void 0,this.modified=[],this.renamed=[],this.files=[],this.staged=[],this.ahead=0,this.behind=0,this.current=null,this.tracking=null,this.detached=!1,this.isClean=()=>!this.files.length}},Hs=new Map([V(" ","A",(e,t)=>e.created.push(t)),V(" ","D",(e,t)=>e.deleted.push(t)),V(" ","M",(e,t)=>e.modified.push(t)),V("A"," ",(e,t)=>{e.created.push(t),e.staged.push(t)}),V("A","M",(e,t)=>{e.created.push(t),e.staged.push(t),e.modified.push(t)}),V("D"," ",(e,t)=>{e.deleted.push(t),e.staged.push(t)}),V("M"," ",(e,t)=>{e.modified.push(t),e.staged.push(t)}),V("M","M",(e,t)=>{e.modified.push(t),e.staged.push(t)}),V("R"," ",(e,t)=>{e.renamed.push(un(t))}),V("R","M",(e,t)=>{let r=un(t);e.renamed.push(r),e.modified.push(r.to)}),V("!","!",(e,t)=>{(e.ignored=e.ignored||[]).push(t)}),V("?","?",(e,t)=>e.not_added.push(t)),...Dt("A","A","U"),...Dt("D","D","U"),...Dt("U","A","D","U"),["##",(e,t)=>{let r=/ahead (\d+)/,n=/behind (\d+)/,s=/^(.+?(?=(?:\.{3}|\s|$)))/,i=/\.{3}(\S*)/,a=/\son\s(\S+?)(?=\.{3}|$)/,o=r.exec(t);e.ahead=o&&+o[1]||0,o=n.exec(t),e.behind=o&&+o[1]||0,o=s.exec(t),e.current=X(o?.[1],D,null),o=i.exec(t),e.tracking=X(o?.[1],D,null),o=a.exec(t),o&&(e.current=X(o?.[1],D,e.current)),e.detached=/\(no branch\)/.test(t)}]]),qs=function(e){let t=e.split(Se),r=new ln;for(let n=0,s=t.length;n<s;){let i=t[n++].trim();i&&(i.charAt(0)==="R"&&(i+=Se+(t[n++]||"")),yc(r,i))}return r}}});function kc(e){return{format:"utf-8",commands:["status","--porcelain","-b","-u","--null",...e.filter(r=>!zs.includes(r))],parser(r){return qs(r)}}}var zs,xc=d({"src/lib/tasks/status.ts"(){"use strict";wc(),zs=["--null","-z"]}});function at(e=0,t=0,r=0,n="",s=!0){return Object.defineProperty({major:e,minor:t,patch:r,agent:n,installed:s},"toString",{value(){return`${this.major}.${this.minor}.${this.patch}`},configurable:!1,enumerable:!1})}function Tc(){return at(0,0,0,"",!1)}function Cc(){return{version(){return this._runTask({commands:["--version"],format:"utf-8",parser:Sc,onError(e,t,r,n){if(e.exitCode===-2)return r(Buffer.from(vr));n(t)}})}}}function Sc(e){return e===vr?Tc():q(at(0,0,0,e),Gs,e)}var vr,Gs,Ec=d({"src/lib/tasks/version.ts"(){"use strict";b(),vr="installed=false",Gs=[new y(/version (\d+)\.(\d+)\.(\d+)(?:\s*\((.+)\))?/,(e,[t,r,n,s=""])=>{Object.assign(e,at(C(t),C(r),C(n),s))}),new y(/version (\d+)\.(\d+)\.(\D+)(.+)?$/,(e,[t,r,n,s=""])=>{Object.assign(e,at(C(t),C(r),n,s))})]}}),Vs={};F(Vs,{SimpleGitApi:()=>Vt});var Vt,_c=d({"src/lib/simple-git-api.ts"(){"use strict";Lo(),Po(),Ao(),No(),Ho(),es(),zo(),is(),Vo(),Qo(),Is(),fc(),js(),vc(),xc(),O(),Ec(),b(),Vt=class{constructor(e){this._executor=e}_runTask(e,t){let r=this._executor.chain(),n=r.push(e);return t&&Oo(e,n,t),Object.create(this,{then:{value:n.then.bind(n)},catch:{value:n.catch.bind(n)},_executor:{value:r}})}add(e){return this._runTask($(["add",...re(e)]),_(arguments))}cwd(e){let t=_(arguments);return typeof e=="string"?this._runTask(Gr(e,this._executor),t):typeof e?.path=="string"?this._runTask(Gr(e.path,e.root&&this._executor||void 0),t):this._runTask(H("Git.cwd: workingDirectory must be supplied as a string"),t)}hashObject(e,t){return this._runTask(Go(e,t===!0),_(arguments))}init(e){return this._runTask(Jo(e===!0,this._executor.cwd,W(arguments)),_(arguments))}merge(){return this._runTask(sn(W(arguments)),_(arguments))}mergeFromTo(e,t){return D(e)&&D(t)?this._runTask(sn([e,t,...W(arguments)]),_(arguments,!1)):this._runTask(H("Git.mergeFromTo requires that the 'remote' and 'branch' arguments are supplied as strings"))}outputHandler(e){return this._executor.outputHandler=e,this}push(){let e=gr({remote:X(arguments[0],D),branch:X(arguments[1],D)},W(arguments));return this._runTask(e,_(arguments))}stash(){return this._runTask($(["stash",...W(arguments)]),_(arguments))}status(){return this._runTask(kc(W(arguments)),_(arguments))}},Object.assign(Vt.prototype,Do(),Wo(),vo(),Bo(),qo(),ko(),ac(),gc(),Cc())}}),Xs={};F(Xs,{Scheduler:()=>Ks});var dn,Ks,Ic=d({"src/lib/runners/scheduler.ts"(){"use strict";b(),ls(),dn=(()=>{let e=0;return()=>{e++;let{promise:t,done:r}=(0,Ys.createDeferred)();return{promise:t,done:r,id:e}}})(),Ks=class{constructor(e=2){this.concurrency=e,this.logger=or("","scheduler"),this.pending=[],this.running=[],this.logger("Constructed, concurrency=%s",e)}schedule(){if(!this.pending.length||this.running.length>=this.concurrency){this.logger("Schedule attempt ignored, pending=%s running=%s concurrency=%s",this.pending.length,this.running.length,this.concurrency);return}let e=K(this.running,this.pending.shift());this.logger("Attempting id=%s",e.id),e.done(()=>{this.logger("Completing id=",e.id),ut(this.running,e),this.schedule()})}next(){let{promise:e,id:t}=K(this.pending,dn());return this.logger("Scheduling id=%s",t),this.schedule(),e}}}}),Js={};F(Js,{applyPatchTask:()=>Rc});function Rc(e,t){return $(["apply",...t,...e])}var Oc=d({"src/lib/tasks/apply-patch.ts"(){"use strict";O()}});function Fc(e,t){return{branch:e,hash:t,success:!0}}function Lc(e){return{branch:e,hash:null,success:!1}}var Qs,Pc=d({"src/lib/responses/BranchDeleteSummary.ts"(){"use strict";Qs=class{constructor(){this.all=[],this.branches={},this.errors=[]}get success(){return!this.errors.length}}}});function Zs(e,t){return t===1&&Xt.test(e)}var fn,Xt,mn,gt,Dc=d({"src/lib/parsers/parse-branch-delete.ts"(){"use strict";Pc(),b(),fn=/(\S+)\s+\(\S+\s([^)]+)\)/,Xt=/^error[^']+'([^']+)'/m,mn=[new y(fn,(e,[t,r])=>{let n=Fc(t,r);e.all.push(n),e.branches[t]=n}),new y(Xt,(e,[t])=>{let r=Lc(t);e.errors.push(r),e.all.push(r),e.branches[t]=r})],gt=(e,t)=>q(new Qs,mn,[e,t])}}),ei,Ac=d({"src/lib/responses/BranchSummary.ts"(){"use strict";ei=class{constructor(){this.all=[],this.branches={},this.current="",this.detached=!1}push(e,t,r,n,s){e==="*"&&(this.detached=t,this.current=r),this.all.push(r),this.branches[r]={current:e==="*",linkedWorkTree:e==="+",name:r,commit:n,label:s}}}}});function pn(e){return e?e.charAt(0):""}function ti(e,t=!1){return q(new ei,t?[ni]:ri,e)}var ri,ni,Mc=d({"src/lib/parsers/parse-branch.ts"(){"use strict";Ac(),b(),ri=[new y(/^([*+]\s)?\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/,(e,[t,r,n,s])=>{e.push(pn(t),!0,r,n,s)}),new y(/^([*+]\s)?(\S+)\s+([a-z0-9]+)\s?(.*)$/s,(e,[t,r,n,s])=>{e.push(pn(t),!1,r,n,s)})],ni=new y(/^(\S+)$/s,(e,[t])=>{e.push("*",!1,t,"","")})}}),si={};F(si,{branchLocalTask:()=>Nc,branchTask:()=>Bc,containsDeleteBranchCommand:()=>ii,deleteBranchTask:()=>$c,deleteBranchesTask:()=>Uc});function ii(e){let t=["-d","-D","--delete"];return e.some(r=>t.includes(r))}function Bc(e){let t=ii(e),r=e.includes("--show-current"),n=["branch",...e];return n.length===1&&n.push("-a"),n.includes("-v")||n.splice(1,0,"-v"),{format:"utf-8",commands:n,parser(s,i){return t?gt(s,i).all[0]:ti(s,r)}}}function Nc(){return{format:"utf-8",commands:["branch","-v"],parser(e){return ti(e)}}}function Uc(e,t=!1){return{format:"utf-8",commands:["branch","-v",t?"-D":"-d",...e],parser(r,n){return gt(r,n)},onError({exitCode:r,stdOut:n},s,i,a){if(!Zs(String(s),r))return a(s);i(n)}}}function $c(e,t=!1){let r={format:"utf-8",commands:["branch","-v",t?"-D":"-d",e],parser(n,s){return gt(n,s).branches[e]},onError({exitCode:n,stdErr:s,stdOut:i},a,o,c){if(!Zs(String(a),n))return c(a);throw new Ne(r.parser(Me(i),Me(s)),String(a))}};return r}var jc=d({"src/lib/tasks/branch.ts"(){"use strict";Ee(),Dc(),Mc(),b()}});function Wc(e){let t=e.trim().replace(/^["']|["']$/g,"");return t&&(0,ai.normalize)(t)}var oi,Hc=d({"src/lib/responses/CheckIgnore.ts"(){"use strict";oi=e=>e.split(/\n/g).map(Wc).filter(Boolean)}}),ci={};F(ci,{checkIgnoreTask:()=>qc});function qc(e){return{commands:["check-ignore",...e],format:"utf-8",parser:oi}}var zc=d({"src/lib/tasks/check-ignore.ts"(){"use strict";Hc()}}),ui={};F(ui,{cloneMirrorTask:()=>Vc,cloneTask:()=>li});function Gc(e){return/^--upload-pack(=|$)/.test(e)}function li(e,t,r){let n=["clone",...r];return D(e)&&n.push(e),D(t)&&n.push(t),n.find(Gc)?H("git.fetch: potential exploit argument blocked."):$(n)}function Vc(e,t,r){return K(r,"--mirror"),li(e,t,r)}var Xc=d({"src/lib/tasks/clone.ts"(){"use strict";O(),b()}});function Yc(e,t){return q({raw:e,remote:null,branches:[],tags:[],updated:[],deleted:[]},di,[e,t])}var di,Kc=d({"src/lib/parsers/parse-fetch.ts"(){"use strict";b(),di=[new y(/From (.+)$/,(e,[t])=>{e.remote=t}),new y(/\* \[new branch]\s+(\S+)\s*-> (.+)$/,(e,[t,r])=>{e.branches.push({name:t,tracking:r})}),new y(/\* \[new tag]\s+(\S+)\s*-> (.+)$/,(e,[t,r])=>{e.tags.push({name:t,tracking:r})}),new y(/- \[deleted]\s+\S+\s*-> (.+)$/,(e,[t])=>{e.deleted.push({tracking:t})}),new y(/\s*([^.]+)\.\.(\S+)\s+(\S+)\s*-> (.+)$/,(e,[t,r,n,s])=>{e.updated.push({name:n,tracking:s,to:r,from:t})})]}}),fi={};F(fi,{fetchTask:()=>Qc});function Jc(e){return/^--upload-pack(=|$)/.test(e)}function Qc(e,t,r){let n=["fetch",...r];return e&&t&&n.push(e,t),n.find(Jc)?H("git.fetch: potential exploit argument blocked."):{commands:n,format:"utf-8",parser:Yc}}var Zc=d({"src/lib/tasks/fetch.ts"(){"use strict";Kc(),O()}});function eu(e){return q({moves:[]},mi,e)}var mi,tu=d({"src/lib/parsers/parse-move.ts"(){"use strict";b(),mi=[new y(/^Renaming (.+) to (.+)$/,(e,[t,r])=>{e.moves.push({from:t,to:r})})]}}),pi={};F(pi,{moveTask:()=>ru});function ru(e,t){return{commands:["mv","-v",...re(e),t],format:"utf-8",parser:eu}}var nu=d({"src/lib/tasks/move.ts"(){"use strict";tu(),b()}}),hi={};F(hi,{pullTask:()=>su});function su(e,t,r){let n=["pull",...r];return e&&t&&n.splice(1,0,e,t),{commands:n,format:"utf-8",parser(s,i){return hr(s,i)},onError(s,i,a,o){let c=lc(Me(s.stdOut),Me(s.stdErr));if(c)return o(new Ne(c));o(i)}}}var iu=d({"src/lib/tasks/pull.ts"(){"use strict";Ee(),Bs(),b()}});function au(e){let t={};return gi(e,([r])=>t[r]={name:r}),Object.values(t)}function ou(e){let t={};return gi(e,([r,n,s])=>{Object.hasOwn(t,r)||(t[r]={name:r,refs:{fetch:"",push:""}}),s&&n&&(t[r].refs[s.replace(/[^a-z]/g,"")]=n)}),Object.values(t)}function gi(e,t){Jt(e,r=>t(r.split(/\s+/)))}var cu=d({"src/lib/responses/GetRemoteSummary.ts"(){"use strict";b()}}),vi={};F(vi,{addRemoteTask:()=>uu,getRemotesTask:()=>lu,listRemotesTask:()=>du,remoteTask:()=>fu,removeRemoteTask:()=>mu});function uu(e,t,r){return $(["remote","add",...r,e,t])}function lu(e){let t=["remote"];return e&&t.push("-v"),{commands:t,format:"utf-8",parser:e?ou:au}}function du(e){let t=[...e];return t[0]!=="ls-remote"&&t.unshift("ls-remote"),$(t)}function fu(e){let t=[...e];return t[0]!=="remote"&&t.unshift("remote"),$(t)}function mu(e){return $(["remote","remove",e])}var pu=d({"src/lib/tasks/remote.ts"(){"use strict";cu(),O()}}),bi={};F(bi,{stashListTask:()=>hu});function hu(e={},t){let r=_s(e),n=["stash","list",...r.commands,...t],s=Ts(r.splitter,r.fields,ur(n));return ht(n)||{commands:n,format:"utf-8",parser:s}}var gu=d({"src/lib/tasks/stash-list.ts"(){"use strict";We(),Ss(),pr(),Is()}}),yi={};F(yi,{addSubModuleTask:()=>vu,initSubModuleTask:()=>bu,subModuleTask:()=>vt,updateSubModuleTask:()=>yu});function vu(e,t){return vt(["add",e,t])}function bu(e){return vt(["init",...e])}function vt(e){let t=[...e];return t[0]!=="submodule"&&t.unshift("submodule"),$(t)}function yu(e){return vt(["update",...e])}var wu=d({"src/lib/tasks/sub-module.ts"(){"use strict";O()}});function ku(e,t){let r=Number.isNaN(e),n=Number.isNaN(t);return r!==n?r?1:-1:r?wi(e,t):0}function wi(e,t){return e===t?0:e>t?1:-1}function xu(e){return e.trim()}function Je(e){return typeof e=="string"&&parseInt(e.replace(/^\D+/g,""),10)||0}var hn,ki,Tu=d({"src/lib/responses/TagList.ts"(){"use strict";hn=class{constructor(e,t){this.all=e,this.latest=t}},ki=function(e,t=!1){let r=e.split(`
`).map(xu).filter(Boolean);t||r.sort(function(s,i){let a=s.split("."),o=i.split(".");if(a.length===1||o.length===1)return ku(Je(a[0]),Je(o[0]));for(let c=0,m=Math.max(a.length,o.length);c<m;c++){let f=wi(Je(a[c]),Je(o[c]));if(f)return f}return 0});let n=t?r[0]:[...r].reverse().find(s=>s.indexOf(".")>=0);return new hn(r,n)}}}),xi={};F(xi,{addAnnotatedTagTask:()=>Eu,addTagTask:()=>Su,tagListTask:()=>Cu});function Cu(e=[]){let t=e.some(r=>/^--sort=/.test(r));return{format:"utf-8",commands:["tag","-l",...e],parser(r){return ki(r,t)}}}function Su(e){return{format:"utf-8",commands:["tag",e],parser(){return{name:e}}}}function Eu(e,t){return{format:"utf-8",commands:["tag","-a","-m",t,e],parser(){return{name:e}}}}var _u=d({"src/lib/tasks/tag.ts"(){"use strict";Tu()}}),Iu=Wa({"src/git.js"(e,t){"use strict";var{GitExecutor:r}=(Ro(),E(ms)),{SimpleGitApi:n}=(_c(),E(Vs)),{Scheduler:s}=(Ic(),E(Xs)),{configurationErrorTask:i}=(O(),E(jt)),{asArray:a,filterArray:o,filterPrimitives:c,filterString:m,filterStringOrStringArray:f,filterType:l,getTrailingOptions:h,trailingFunctionArgument:p,trailingOptionsArgument:R}=(b(),E(Mn)),{applyPatchTask:k}=(Oc(),E(Js)),{branchTask:T,branchLocalTask:L,deleteBranchesTask:ne,deleteBranchTask:Fe}=(jc(),E(si)),{checkIgnoreTask:de}=(zc(),E(ci)),{checkIsRepoTask:be}=($n(),E(Bn)),{cloneTask:ce,cloneMirrorTask:Le}=(Xc(),E(ui)),{cleanWithOptionsTask:Pe,isCleanOptionsArray:qe}=(Jn(),E(Yn)),{diffSummaryTask:Bi}=(pr(),E(Es)),{fetchTask:Ni}=(Zc(),E(fi)),{moveTask:Ui}=(nu(),E(pi)),{pullTask:$i}=(iu(),E(hi)),{pushTagsTask:ji}=(js(),E($s)),{addRemoteTask:Wi,getRemotesTask:Hi,listRemotesTask:qi,remoteTask:zi,removeRemoteTask:Gi}=(pu(),E(vi)),{getResetMode:Vi,resetTask:Xi}=(us(),E(as)),{stashListTask:Yi}=(gu(),E(bi)),{addSubModuleTask:Ki,initSubModuleTask:Ji,subModuleTask:Qi,updateSubModuleTask:Zi}=(wu(),E(yi)),{addAnnotatedTagTask:ea,addTagTask:ta,tagListTask:ra}=(_u(),E(xi)),{straightThroughBufferTask:na,straightThroughStringTask:ee}=(O(),E(jt));function v(u,g){this._plugins=g,this._executor=new r(u.baseDir,new s(u.maxConcurrentProcesses),g),this._trimmed=u.trimmed}(v.prototype=Object.create(n.prototype)).constructor=v,v.prototype.customBinary=function(u){return this._plugins.reconfigure("binary",u),this},v.prototype.env=function(u,g){return arguments.length===1&&typeof u=="object"?this._executor.env=u:(this._executor.env=this._executor.env||{})[u]=g,this},v.prototype.stashList=function(u){return this._runTask(Yi(R(arguments)||{},o(u)&&u||[]),p(arguments))};function Ir(u,g,x,U){return typeof x!="string"?i(`git.${u}() requires a string 'repoPath'`):g(x,l(U,m),h(arguments))}v.prototype.clone=function(){return this._runTask(Ir("clone",ce,...arguments),p(arguments))},v.prototype.mirror=function(){return this._runTask(Ir("mirror",Le,...arguments),p(arguments))},v.prototype.mv=function(u,g){return this._runTask(Ui(u,g),p(arguments))},v.prototype.checkoutLatestTag=function(u){var g=this;return this.pull(function(){g.tags(function(x,U){g.checkout(U.latest,u)})})},v.prototype.pull=function(u,g,x,U){return this._runTask($i(l(u,m),l(g,m),h(arguments)),p(arguments))},v.prototype.fetch=function(u,g){return this._runTask(Ni(l(u,m),l(g,m),h(arguments)),p(arguments))},v.prototype.silent=function(u){return console.warn("simple-git deprecation notice: git.silent: logging should be configured using the `debug` library / `DEBUG` environment variable, this will be an error in version 3"),this},v.prototype.tags=function(u,g){return this._runTask(ra(h(arguments)),p(arguments))},v.prototype.rebase=function(){return this._runTask(ee(["rebase",...h(arguments)]),p(arguments))},v.prototype.reset=function(u){return this._runTask(Xi(Vi(u),h(arguments)),p(arguments))},v.prototype.revert=function(u){let g=p(arguments);return typeof u!="string"?this._runTask(i("Commit must be a string"),g):this._runTask(ee(["revert",...h(arguments,0,!0),u]),g)},v.prototype.addTag=function(u){let g=typeof u=="string"?ta(u):i("Git.addTag requires a tag name");return this._runTask(g,p(arguments))},v.prototype.addAnnotatedTag=function(u,g){return this._runTask(ea(u,g),p(arguments))},v.prototype.deleteLocalBranch=function(u,g,x){return this._runTask(Fe(u,typeof g=="boolean"?g:!1),p(arguments))},v.prototype.deleteLocalBranches=function(u,g,x){return this._runTask(ne(u,typeof g=="boolean"?g:!1),p(arguments))},v.prototype.branch=function(u,g){return this._runTask(T(h(arguments)),p(arguments))},v.prototype.branchLocal=function(u){return this._runTask(L(),p(arguments))},v.prototype.raw=function(u){let g=!Array.isArray(u),x=[].slice.call(g?arguments:u,0);for(let J=0;J<x.length&&g;J++)if(!c(x[J])){x.splice(J,x.length-J);break}x.push(...h(arguments,0,!0));var U=p(arguments);return x.length?this._runTask(ee(x,this._trimmed),U):this._runTask(i("Raw: must supply one or more command to execute"),U)},v.prototype.submoduleAdd=function(u,g,x){return this._runTask(Ki(u,g),p(arguments))},v.prototype.submoduleUpdate=function(u,g){return this._runTask(Zi(h(arguments,!0)),p(arguments))},v.prototype.submoduleInit=function(u,g){return this._runTask(Ji(h(arguments,!0)),p(arguments))},v.prototype.subModule=function(u,g){return this._runTask(Qi(h(arguments)),p(arguments))},v.prototype.listRemote=function(){return this._runTask(qi(h(arguments)),p(arguments))},v.prototype.addRemote=function(u,g,x){return this._runTask(Wi(u,g,h(arguments)),p(arguments))},v.prototype.removeRemote=function(u,g){return this._runTask(Gi(u),p(arguments))},v.prototype.getRemotes=function(u,g){return this._runTask(Hi(u===!0),p(arguments))},v.prototype.remote=function(u,g){return this._runTask(zi(h(arguments)),p(arguments))},v.prototype.tag=function(u,g){let x=h(arguments);return x[0]!=="tag"&&x.unshift("tag"),this._runTask(ee(x),p(arguments))},v.prototype.updateServerInfo=function(u){return this._runTask(ee(["update-server-info"]),p(arguments))},v.prototype.pushTags=function(u,g){let x=ji({remote:l(u,m)},h(arguments));return this._runTask(x,p(arguments))},v.prototype.rm=function(u){return this._runTask(ee(["rm","-f",...a(u)]),p(arguments))},v.prototype.rmKeepLocal=function(u){return this._runTask(ee(["rm","--cached",...a(u)]),p(arguments))},v.prototype.catFile=function(u,g){return this._catFile("utf-8",arguments)},v.prototype.binaryCatFile=function(){return this._catFile("buffer",arguments)},v.prototype._catFile=function(u,g){var x=p(g),U=["cat-file"],J=g[0];if(typeof J=="string")return this._runTask(i("Git.catFile: options must be supplied as an array of strings"),x);Array.isArray(J)&&U.push.apply(U,J);let xt=u==="buffer"?na(U):ee(U);return this._runTask(xt,x)},v.prototype.diff=function(u,g){let x=m(u)?i("git.diff: supplying options as a single string is no longer supported, switch to an array of strings"):ee(["diff",...h(arguments)]);return this._runTask(x,p(arguments))},v.prototype.diffSummary=function(){return this._runTask(Bi(h(arguments,1)),p(arguments))},v.prototype.applyPatch=function(u){let g=f(u)?k(a(u),h([].slice.call(arguments,1))):i("git.applyPatch requires one or more string patches as the first argument");return this._runTask(g,p(arguments))},v.prototype.revparse=function(){let u=["rev-parse",...h(arguments,!0)];return this._runTask(ee(u,!0),p(arguments))},v.prototype.clean=function(u,g,x){let U=qe(u),J=U&&u.join("")||l(u,m)||"",xt=h([].slice.call(arguments,U?1:0));return this._runTask(Pe(J,xt),p(arguments))},v.prototype.exec=function(u){let g={commands:[],format:"utf-8",parser(){typeof u=="function"&&u()}};return this._runTask(g)},v.prototype.clearQueue=function(){return this},v.prototype.checkIgnore=function(u,g){return this._runTask(de(a(l(u,f,[]))),p(arguments))},v.prototype.checkIsRepo=function(u,g){return this._runTask(be(l(u,m)),p(arguments))},t.exports=v}});Be();le();var Ru=class extends ie{constructor(e,t){super(void 0,t),this.config=e}};le();le();var se=class extends ie{constructor(e,t,r){super(e,r),this.task=e,this.plugin=t,Object.setPrototypeOf(this,new.target.prototype)}};Ee();kn();$n();Jn();es();rs();is();us();function Ou(e){return e?[{type:"spawn.before",action(n,s){e.aborted&&s.kill(new se(void 0,"abort","Abort already signaled"))}},{type:"spawn.after",action(n,s){function i(){s.kill(new se(void 0,"abort","Abort signal received"))}e.addEventListener("abort",i),s.spawned.on("close",()=>e.removeEventListener("abort",i))}}]:void 0}function Fu(e){return typeof e=="string"&&e.trim().toLowerCase()==="-c"}function Lu(e,t){if(Fu(e)&&/^\s*protocol(.[a-z]+)?.allow/.test(t))throw new se(void 0,"unsafe","Configuring protocol.allow is not permitted without enabling allowUnsafeExtProtocol")}function Pu(e,t){if(/^\s*--(upload|receive)-pack/.test(e))throw new se(void 0,"unsafe","Use of --upload-pack or --receive-pack is not permitted without enabling allowUnsafePack");if(t==="clone"&&/^\s*-u\b/.test(e))throw new se(void 0,"unsafe","Use of clone with option -u is not permitted without enabling allowUnsafePack");if(t==="push"&&/^\s*--exec\b/.test(e))throw new se(void 0,"unsafe","Use of push with option --exec is not permitted without enabling allowUnsafePack")}function Du({allowUnsafeProtocolOverride:e=!1,allowUnsafePack:t=!1}={}){return{type:"spawn.args",action(r,n){return r.forEach((s,i)=>{let a=i<r.length?r[i+1]:"";e||Lu(s,a),t||Pu(s,n.method)}),r}}}b();function Au(e){let t=Ae(e,"-c");return{type:"spawn.args",action(r){return[...t,...r]}}}b();var gn=(0,Ce.deferred)().promise;function Mu({onClose:e=!0,onExit:t=50}={}){function r(){let s=-1,i={close:(0,Ce.deferred)(),closeTimeout:(0,Ce.deferred)(),exit:(0,Ce.deferred)(),exitTimeout:(0,Ce.deferred)()},a=Promise.race([e===!1?gn:i.closeTimeout.promise,t===!1?gn:i.exitTimeout.promise]);return n(e,i.close,i.closeTimeout),n(t,i.exit,i.exitTimeout),{close(o){s=o,i.close.done()},exit(o){s=o,i.exit.done()},get exitCode(){return s},result:a}}function n(s,i,a){s!==!1&&(s===!0?i.promise:i.promise.then(()=>At(s))).then(a.done)}return{type:"spawn.after",async action(s,{spawned:i,close:a}){let o=r(),c=!0,m=()=>{c=!1};i.stdout?.on("data",m),i.stderr?.on("data",m),i.on("error",m),i.on("close",f=>o.close(f)),i.on("exit",f=>o.exit(f));try{await o.result,c&&await At(50),a(o.exitCode)}catch(f){a(o.exitCode,f)}}}}b();var Bu="Invalid value supplied for custom binary, requires a single string or an array containing either one or two strings",vn="Invalid value supplied for custom binary, restricted characters must be removed or supply the unsafe.allowUnsafeCustomBinary option";function Nu(e){return!e||!/^([a-z]:)?([a-z0-9/.\\_~-]+)$/i.test(e)}function bn(e,t){if(e.length<1||e.length>2)throw new se(void 0,"binary",Bu);if(e.some(Nu))if(t)console.warn(vn);else throw new se(void 0,"binary",vn);let[n,s]=e;return{binary:n,prefix:s}}function Uu(e,t=["git"],r=!1){let n=bn(re(t),r);e.on("binary",s=>{n=bn(re(s),r)}),e.append("spawn.binary",()=>n.binary),e.append("spawn.args",s=>n.prefix?[n.prefix,...s]:s)}le();function $u(e){return!!(e.exitCode&&e.stdErr.length)}function ju(e){return Buffer.concat([...e.stdOut,...e.stdErr])}function Wu(e=!1,t=$u,r=ju){return(n,s)=>!e&&n||!t(s)?n:r(s)}function yn(e){return{type:"task.error",action(t,r){let n=e(t.error,{stdErr:r.stdErr,stdOut:r.stdOut,exitCode:r.exitCode});return Buffer.isBuffer(n)?{error:new ie(void 0,n.toString("utf-8"))}:{error:n}}}}b();var Hu=class{constructor(){this.plugins=new Set,this.events=new Ti.EventEmitter}on(e,t){this.events.on(e,t)}reconfigure(e,t){this.events.emit(e,t)}append(e,t){let r=K(this.plugins,{type:e,action:t});return()=>this.plugins.delete(r)}add(e){let t=[];return re(e).forEach(r=>r&&this.plugins.add(K(t,r))),()=>{t.forEach(r=>this.plugins.delete(r))}}exec(e,t,r){let n=t,s=Object.freeze(Object.create(r));for(let i of this.plugins)i.type===e&&(n=i.action(n,s));return n}};b();function qu(e){let t="--progress",r=["checkout","clone","fetch","pull","push"];return[{type:"spawn.args",action(i,a){return r.includes(a.method)?In(i,t):i}},{type:"spawn.after",action(i,a){a.commands.includes(t)&&a.spawned.stderr?.on("data",o=>{let c=/^([\s\S]+?):\s*(\d+)% \((\d+)\/(\d+)\)/.exec(o.toString("utf8"));c&&e({method:a.method,stage:zu(c[1]),progress:C(c[2]),processed:C(c[3]),total:C(c[4])})})}}]}function zu(e){return String(e.toLowerCase().split(" ",1))||"unknown"}b();function Gu(e){let t=On(e,["uid","gid"]);return{type:"spawn.options",action(r){return{...t,...r}}}}function Vu({block:e,stdErr:t=!0,stdOut:r=!0}){if(e>0)return{type:"spawn.after",action(n,s){let i;function a(){i&&clearTimeout(i),i=setTimeout(c,e)}function o(){s.spawned.stdout?.off("data",a),s.spawned.stderr?.off("data",a),s.spawned.off("exit",o),s.spawned.off("close",o),i&&clearTimeout(i)}function c(){o(),s.kill(new se(void 0,"timeout","block timeout reached"))}r&&s.spawned.stdout?.on("data",a),t&&s.spawned.stderr?.on("data",a),s.spawned.on("exit",o),s.spawned.on("close",o),a()}}}Be();function Xu(){return{type:"spawn.args",action(e){let t=[],r;function n(s){(r=r||[]).push(...s)}for(let s=0;s<e.length;s++){let i=e[s];if(rt(i)){n(Wr(i));continue}if(i==="--"){n(e.slice(s+1).flatMap(a=>rt(a)&&Wr(a)||a));break}t.push(i)}return r?[...t,"--",...r.map(String)]:t}}}b();var Yu=Iu();function Ku(e,t){let r=new Hu,n=Dn(e&&(typeof e=="string"?{baseDir:e}:e)||{},t);if(!Qt(n.baseDir))throw new Ru(n,"Cannot use simple-git on a directory that does not exist");return Array.isArray(n.config)&&r.add(Au(n.config)),r.add(Du(n.unsafe)),r.add(Xu()),r.add(Mu(n.completion)),n.abort&&r.add(Ou(n.abort)),n.progress&&r.add(qu(n.progress)),n.timeout&&r.add(Vu(n.timeout)),n.spawnOptions&&r.add(Gu(n.spawnOptions)),r.add(yn(Wu(!0))),n.errors&&r.add(yn(n.errors)),Uu(r,n.binary,n.unsafe?.allowUnsafeCustomBinary),new Yu(n,r)}Ee();var Ci=Ku;var yr=class{git=null;async initialize(){let t=Si.workspace.workspaceFolders?.[0];if(!t)return console.log("[MarkdownThreads] gitService.initialize: no workspace folder"),!1;console.log("[MarkdownThreads] gitService.initialize: folder =",t.uri.fsPath),this.git=Ci(t.uri.fsPath);try{let r=await this.git.checkIsRepo();return console.log("[MarkdownThreads] gitService.initialize: isRepo =",r),r||(this.git=null),r}catch(r){return console.log("[MarkdownThreads] gitService.initialize: error",r),this.git=null,!1}}async getUserName(){if(this.git||(console.log("[MarkdownThreads] getUserName: git not initialized, retrying..."),await this.initialize()),this.git){try{let t=await this.git.raw(["config","user.name"]);if(t.trim())return t.trim()}catch{}try{let t=await this.git.raw(["config","user.email"]);if(t.trim())return t.trim()}catch{}}console.log("[MarkdownThreads] getUserName: falling back to execSync");try{let t=(0,br.execSync)("git config --global user.name",{encoding:"utf8"}).trim();if(t)return t}catch{}try{let t=(0,br.execSync)("git config --global user.email",{encoding:"utf8"}).trim();if(t)return t}catch{}return"Unknown"}},ae=new yr;var w=M(require("vscode")),oe=M(require("path"));var Z=M(require("fs")),Re=M(require("path")),Ri=M(require("vscode"));var Ei=M(require("crypto")),yt=new Uint8Array(256),bt=yt.length;function wr(){return bt>yt.length-16&&(Ei.default.randomFillSync(yt),bt=0),yt.slice(bt,bt+=16)}var A=[];for(let e=0;e<256;++e)A.push((e+256).toString(16).slice(1));function _i(e,t=0){return A[e[t+0]]+A[e[t+1]]+A[e[t+2]]+A[e[t+3]]+"-"+A[e[t+4]]+A[e[t+5]]+"-"+A[e[t+6]]+A[e[t+7]]+"-"+A[e[t+8]]+A[e[t+9]]+"-"+A[e[t+10]]+A[e[t+11]]+A[e[t+12]]+A[e[t+13]]+A[e[t+14]]+A[e[t+15]]}var Ii=M(require("crypto")),kr={randomUUID:Ii.default.randomUUID};function Ju(e,t,r){if(kr.randomUUID&&!t&&!e)return kr.randomUUID();e=e||{};let n=e.random||(e.rng||wr)();if(n[6]=n[6]&15|64,n[8]=n[8]&63|128,t){r=r||0;for(let s=0;s<16;++s)t[r+s]=n[s];return t}return _i(n)}var Ie=Ju;var xr=class{writing=!1;_onDidChange=new Ri.EventEmitter;onDidChange=this._onDidChange.event;getSidecarPath(t){let r=Re.dirname(t),n=Re.basename(t,".md");return Re.join(r,`${n}.comments.json`)}sidecarExists(t){return Z.existsSync(this.getSidecarPath(t))}async readSidecar(t){let r=this.getSidecarPath(t);if(!Z.existsSync(r))return null;try{let n=await Z.promises.readFile(r,"utf-8"),s=JSON.parse(n);return this.validateSidecar(s)?s:null}catch(n){return console.error(`Failed to read sidecar file: ${r}`,n),null}}async writeSidecar(t,r,n="internal"){if(r.comments.length===0){await this.deleteSidecar(t),this._onDidChange.fire({docPath:t,origin:n});return}let s=this.getSidecarPath(t),i=`${s}.tmp`;this.writing=!0;try{let a=JSON.stringify(r,null,2);await Z.promises.writeFile(i,a,"utf-8"),await Z.promises.rename(i,s)}catch(a){throw Z.existsSync(i)&&await Z.promises.unlink(i),a}finally{setTimeout(()=>{this.writing=!1},500)}this._onDidChange.fire({docPath:t,origin:n})}async deleteSidecar(t){let r=this.getSidecarPath(t);Z.existsSync(r)&&await Z.promises.unlink(r)}createEmptySidecar(t){return{doc:t,version:"2.0",comments:[]}}addThread(t,r){let n={...r,id:Ie()};return t.comments.push(n),n}addReply(t,r,n){let s=t.comments.find(a=>a.id===r);if(!s)return null;let i={...n,id:Ie()};return s.thread.push(i),i}deleteThread(t,r){let n=t.comments.findIndex(s=>s.id===r);return n===-1?!1:(t.comments.splice(n,1),!0)}deleteComment(t,r,n){let s=t.comments.find(i=>i.id===r);return!s||n<0||n>=s.thread.length?!1:(s.thread.splice(n,1),s.thread.length===0&&this.deleteThread(t,r),!0)}deleteCommentById(t,r,n){let s=t.comments.find(a=>a.id===r);if(!s)return!1;let i=s.thread.findIndex(a=>a.id===n);return i===-1?!1:this.deleteComment(t,r,i)}toggleReaction(t,r,n,s){let i=t.comments.find(c=>c.id===r);if(!i)return!1;let a=i.thread.find(c=>c.id===n);if(!a)return!1;a.reactions||(a.reactions=[]);let o=a.reactions.indexOf(s);return o===-1?(a.reactions.push(s),!0):(a.reactions.splice(o,1),!1)}editComment(t,r,n,s){let i=t.comments.find(o=>o.id===r);if(!i)return null;let a=i.thread.find(o=>o.id===n);return a?(a.body=s,a.edited=new Date().toISOString(),a):null}validateSidecar(t){if(!t||typeof t!="object")return!1;let r=t;return!(typeof r.doc!="string"||r.version!=="2.0"||!Array.isArray(r.comments))}},I=new xr;var Tr=class{extractContext(t,r,n){let s=t.slice(Math.max(0,r-40),r),i=t.slice(n,n+40);return{prefix:s,suffix:i}}createAnchor(t,r,n,s){return{selectedText:t,textContext:this.extractContext(s,r,n),markdownRange:{startOffset:r,endOffset:n}}}anchorComment(t,r){let{selectedText:n,textContext:s,markdownRange:i}=t;if(r.slice(i.startOffset,i.endOffset)===n)return i;let a=Math.max(0,i.startOffset-500),o=Math.min(r.length,i.endOffset+500),c=r.slice(a,o),m=-1,f=1/0,l=0;for(;;){let k=c.indexOf(n,l);if(k===-1)break;let T=a+k,L=Math.abs(T-i.startOffset);L<f&&(f=L,m=k),l=k+1}if(m!==-1){let k=a+m;return{startOffset:k,endOffset:k+n.length}}let h=s.prefix+n+s.suffix,p=r.indexOf(h);if(p!==-1){let k=p+s.prefix.length;return{startOffset:k,endOffset:k+n.length}}if(s.prefix){let k=s.prefix+n,T=r.indexOf(k);if(T!==-1){let L=T+s.prefix.length;return{startOffset:L,endOffset:L+n.length}}}if(s.suffix){let k=n+s.suffix,T=r.indexOf(k);if(T!==-1)return{startOffset:T,endOffset:T+n.length}}let R=r.indexOf(n);return R!==-1?{startOffset:R,endOffset:R+n.length}:null}detectStaleThreads(t,r){let n=[],s=!1;for(let i of r){let a=this.anchorComment(i.anchor,t);a?((a.startOffset!==i.anchor.markdownRange.startOffset||a.endOffset!==i.anchor.markdownRange.endOffset)&&(s=!0),i.anchor.markdownRange=a,i.anchor.textContext=this.extractContext(t,a.startOffset,a.endOffset),i.status==="stale"&&n.push({thread:i,newStatus:"open"})):i.status!=="stale"&&n.push({thread:i,newStatus:"stale"})}return{updates:n,anchorsMoved:s}}},Cr=new Tr;function Oi(e,t,r){if(!e)return null;let n=-1,s=1/0,i=e,a=0;for(;a<=t.length-e.length;){let l=t.indexOf(e,a);if(l===-1)break;let h=Math.abs(l-r);h<s&&(s=h,n=l),a=l+1}if(n!==-1)return{start:n,text:i};let o=e.split(`
`);if(o.length===0||!o[0].trim())return null;let c=o.map(l=>l.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")),m="(?:[ \\t]*(?:[-*+]|\\d+[.)]) |[ \\t]*> )?",f=c.map(l=>m+l).join("\\n");try{let l=new RegExp(f,"g"),h;for(;(h=l.exec(t))!==null;){let p=Math.abs(h.index-r);p<s&&(s=p,n=h.index,i=h[0]),l.lastIndex=h.index+1}}catch{return null}return n!==-1?{start:n,text:i}:null}var z=M(require("path"));var Fi=new Set(["Version","Owner","Project"]),Sr={PRD:["Draft","Approved"],Architecture:["Draft","Approved"],ADR:["Draft","Approved"],Feature:["Draft","Approved","Implemented"],Other:["Draft","Approved","Implemented"]};function Qu(e){let r=e.replace(/\r\n/g,`
`).split(`
`)[0]?.trim()??"";return/^<!--\s*SPECIT\s*-->$/i.test(r)}function Li(e){if(!Qu(e))return null;let t=e.replace(/\r\n/g,`
`).split(`
`),r={},n=-1,s=-1;for(let i=1;i<t.length;i++){let a=t[i];if(a.trim()!==""&&!/^#{1,6}\s/.test(a)){if(a.startsWith(">")){n===-1&&(n=i),s=i+1;let o=a.match(/^>\s*\*\*(.+?)\*\*:\s*(.+?)(?:<br>)?\s*$/);o&&(r[o[1]]=o[2].trim())}else if(n!==-1)break}}return n===-1?null:{fields:r,blockquoteStartLine:n,blockquoteEndLine:s}}function Er(e,t,r){let n=e.replace(/\r\n/g,`
`),s=new RegExp(`^(>\\s*\\*\\*${el(t)}\\*\\*:\\s*).+?((?:<br>)?\\s*)$`,"m");if(!s.test(n))return e;let i=n.replace(s,`$1${r}$2`);if(t!=="Last Updated"){let a=new Date().toISOString().slice(0,10),o=/^(>\s*\*\*Last Updated\*\*:\s*).+?((?:<br>)?\s*)$/m;i=i.replace(o,`$1${a}$2`)}return i}function Pi(e){let t=z.basename(e).toUpperCase(),r=z.basename(z.dirname(e)).toLowerCase();return t==="PRD.MD"?"PRD":t==="ARCHITECTURE.MD"?"Architecture":r==="adr"||t.startsWith("ADR-")?"ADR":r==="feature"||t.startsWith("FEAT-")?"Feature":"Other"}var Zu={PRD:"Product Requirements Document",Architecture:"Architecture Document",ADR:"Architecture Decision Record",Feature:"Feature Spec",Other:""};function Di(e){return Zu[e]??""}function el(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Ai(e,t,r){if(!t)return null;let n;try{n=decodeURIComponent(t)}catch{return null}if(/^(?:https?|data|mailto):/i.test(n)||/^vscode-/i.test(n)||n.startsWith("#"))return null;let s=null,i=n.indexOf("#"),a=n;if(i!==-1&&(s=n.slice(i+1)||null,a=n.slice(0,i)),!/\.md$/i.test(a))return null;let o=z.resolve(z.dirname(e),a),c=z.normalize(r)+z.sep,m=z.normalize(o);return!m.startsWith(c)&&m!==z.normalize(r)?null:{filePath:o,fragment:s}}var Oe=class e{static viewType="markdownThreads.preview";static instance;static extensionUri;panel;document;disposables=[];updateTimeout;_isUpdating=!1;_suppressFollowEditor=!1;_suppressFollowTimeout;_navHistory=[];styleUri;markdownItUri;docDirUri;static setExtensionUri(t){e.extensionUri=t}static async show(t){let r=w.window.activeTextEditor!==void 0,n=r?w.ViewColumn.Beside:w.ViewColumn.One,s=r;if(e.instance){e.instance.document=t,e.instance.panel.reveal(n,s),await e.instance.update();return}if(!e.extensionUri){w.window.showErrorMessage("PreviewPanel.extensionUri not set");return}let i=[...w.workspace.workspaceFolders?.map(o=>o.uri)??[],w.Uri.joinPath(e.extensionUri,"media")],a=w.window.createWebviewPanel(e.viewType,`Preview: ${oe.basename(t.uri.fsPath)}`,{viewColumn:n,preserveFocus:s},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:i});e.instance=new e(a,t),await e.instance.update()}constructor(t,r){this.panel=t,this.document=r,this.styleUri=t.webview.asWebviewUri(w.Uri.joinPath(e.extensionUri,"media","preview-styles.css")),this.markdownItUri=t.webview.asWebviewUri(w.Uri.joinPath(e.extensionUri,"media","markdown-it.min.js")),this.docDirUri=()=>{let n=w.Uri.file(oe.dirname(this.document.uri.fsPath));return t.webview.asWebviewUri(n)},this.panel.onDidDispose(()=>this.dispose(),null,this.disposables),this.disposables.push(w.workspace.onDidSaveTextDocument(n=>{n.uri.toString()===this.document.uri.toString()&&this.scheduleUpdate()})),this.disposables.push(I.onDidChange(n=>{n.origin!=="preview"&&n.docPath===this.document.uri.fsPath&&this.scheduleUpdate()})),this.disposables.push(w.window.onDidChangeActiveTextEditor(n=>{this._suppressFollowEditor||n&&n.document.languageId==="markdown"&&n.document.uri.scheme==="file"&&!n.document.uri.path.includes("commentinput-")&&n.document.uri.toString()!==this.document.uri.toString()&&(this.document=n.document,this.scheduleUpdate())})),this.panel.webview.onDidReceiveMessage(n=>this.handleWebViewMessage(n),null,this.disposables)}async ensureDocumentFresh(){this.document=await w.workspace.openTextDocument(this.document.uri)}async replaceDocumentContent(t){let r=this.document,n=new w.Range(r.positionAt(0),r.positionAt(r.getText().length)),s=new w.WorkspaceEdit;s.replace(r.uri,n,t),await w.workspace.applyEdit(s),await r.save(),this.document=r,await this.update()}async handleWebViewMessage(t){switch(t.command){case"refresh":{await this.update();break}case"addComment":{await this.ensureDocumentFresh();let r=t.selectedText,n=(t.body||"").trim(),s=t.contentOffset||0;if(!r||!n)return;let i=await ae.getUserName(),a=this.document.getText().replace(/\r\n/g,`
`),o=Oi(r,a,s);if(!o){w.window.showErrorMessage("Could not find selected text in document");return}let c=o.start+o.text.length,m=Cr.createAnchor(o.text,o.start,c,a),f=await I.readSidecar(this.document.uri.fsPath);f||(f=I.createEmptySidecar(oe.basename(this.document.uri.fsPath)));let l=new Date().toISOString();I.addThread(f,{anchor:m,status:"open",thread:[{id:Ie(),author:i,body:n,created:l,edited:null}]}),await I.writeSidecar(this.document.uri.fsPath,f,"preview"),await this.update();break}case"replyComment":{let r=t.threadId,n=(t.body||"").trim();if(!n||!r)return;let s=await ae.getUserName(),i=await I.readSidecar(this.document.uri.fsPath);if(!i)return;I.addReply(i,r,{author:s,body:n,created:new Date().toISOString(),edited:null}),await I.writeSidecar(this.document.uri.fsPath,i,"preview"),await this.update();break}case"deleteThread":{let r=t.threadId;if(!r)return;let n=await ae.getUserName(),s=await I.readSidecar(this.document.uri.fsPath);if(!s)return;let i=s.comments.find(a=>a.id===r);if(!i)return;if(i.thread[0]?.author!==n){w.window.showWarningMessage("You can only delete threads you created.");return}I.deleteThread(s,r),await I.writeSidecar(this.document.uri.fsPath,s,"preview"),await this.update();break}case"deleteComment":{let r=t.threadId,n=t.commentId;if(!r||!n)return;let s=await ae.getUserName(),i=await I.readSidecar(this.document.uri.fsPath);if(!i)return;let a=i.comments.find(c=>c.id===r);if(!a)return;let o=a.thread.find(c=>c.id===n);if(!o)return;if(o.author!==s){w.window.showWarningMessage("You can only delete your own comments.");return}I.deleteCommentById(i,r,n),await I.writeSidecar(this.document.uri.fsPath,i,"preview"),await this.update();break}case"editComment":{let r=t.threadId,n=t.commentId,s=(t.body||"").trim();if(!r||!n||!s)return;let i=await ae.getUserName(),a=await I.readSidecar(this.document.uri.fsPath);if(!a)return;let o=a.comments.find(m=>m.id===r);if(!o)return;let c=o.thread.find(m=>m.id===n);if(!c||c.author!==i){w.window.showWarningMessage("You can only edit your own comments.");return}I.editComment(a,r,n,s),await I.writeSidecar(this.document.uri.fsPath,a,"preview"),await this.update();break}case"openExternal":{let r=t.url;r&&/^https?:\/\//i.test(r)&&w.commands.executeCommand("simpleBrowser.show",r);break}case"openInternalDoc":{let r=t.relativePath;if(!r)return;let n=w.workspace.getWorkspaceFolder(this.document.uri);if(!n){w.window.showWarningMessage("Cannot navigate: document is not in a workspace.");return}let s=Ai(this.document.uri.fsPath,r,n.uri.fsPath);if(!s){w.window.showWarningMessage("Cannot open link: target is not a valid markdown file within the workspace.");return}try{let i=w.Uri.file(s.filePath),a=await w.workspace.openTextDocument(i);this._navHistory.push(this.document.uri),this._suppressFollowEditor=!0,this._suppressFollowTimeout&&clearTimeout(this._suppressFollowTimeout),this._suppressFollowTimeout=setTimeout(()=>{this._suppressFollowEditor=!1},2e3),this.document=a,this.panel.title=`Preview: ${oe.basename(a.uri.fsPath)}`,await this.update(),s.fragment&&this.panel.webview.postMessage({command:"scrollToFragment",fragment:s.fragment})}catch{w.window.showWarningMessage("Cannot open document: file not found.")}break}case"navigateBack":{if(this._navHistory.length===0)return;let r=this._navHistory.pop();try{let n=await w.workspace.openTextDocument(r);this._suppressFollowEditor=!0,this._suppressFollowTimeout&&clearTimeout(this._suppressFollowTimeout),this._suppressFollowTimeout=setTimeout(()=>{this._suppressFollowEditor=!1},2e3),this.document=n,this.panel.title=`Preview: ${oe.basename(n.uri.fsPath)}`,await this.update()}catch{w.window.showWarningMessage("Cannot navigate back: previous document is no longer available.")}break}case"editSpecitField":{if(!w.workspace.getConfiguration("markdownThreads").get("enableSpecitRendering",!1))return;await this.ensureDocumentFresh();let n=t.fieldName,s=(t.newValue||"").trim();if(!n||!s)return;let i=this.document.getText().replace(/\r\n/g,`
`),a=Er(i,n,s);if(a===i)return;await this.replaceDocumentContent(a);break}case"changeSpecitStatus":{if(!w.workspace.getConfiguration("markdownThreads").get("enableSpecitRendering",!1))return;await this.ensureDocumentFresh();let n=(t.newStatus||"").trim();if(!n)return;let s=this.document.getText().replace(/\r\n/g,`
`),i=Er(s,"Status",n);if(i===s)return;await this.replaceDocumentContent(i);break}}}scheduleUpdate(){this.updateTimeout&&clearTimeout(this.updateTimeout),this.panel.visible&&(this.updateTimeout=setTimeout(()=>this.update(),300))}async update(){if(!this._isUpdating){this._isUpdating=!0;try{await this.ensureDocumentFresh();let t=this.document.getText().replace(/\r\n/g,`
`),r=await I.readSidecar(this.document.uri.fsPath),n=[];if(r){let{updates:a,anchorsMoved:o}=Cr.detectStaleThreads(t,r.comments);for(let{thread:c,newStatus:m}of a)c.status=m;n=r.comments,(a.length>0||o)&&await I.writeSidecar(this.document.uri.fsPath,r,"internal")}n.sort((a,o)=>a.anchor.markdownRange.startOffset-o.anchor.markdownRange.startOffset);let s=n.map(a=>{let o=n.filter(c=>c.anchor.selectedText===a.anchor.selectedText&&c.anchor.markdownRange.startOffset<a.anchor.markdownRange.startOffset).length;return{id:a.id,selectedText:a.anchor.selectedText,occurrenceIndex:o,status:a.status,color:a.color,thread:a.thread,startOffset:a.anchor.markdownRange.startOffset}}),i=await ae.getUserName();this.panel.title=`Preview: ${oe.basename(this.document.uri.fsPath)}`,this.panel.webview.html=this.buildHtml(t,s,i)}finally{this._isUpdating=!1}}}buildHtml(t,r,n){let s=tl(),i=this.panel.webview.cspSource,a=JSON.stringify(r).replace(/</g,"\\u003c"),o=JSON.stringify(n).replace(/</g,"\\u003c"),c=oe.basename(this.document.uri.fsPath),m=this.docDirUri().toString(),f="null",l="",h="",R=w.workspace.getConfiguration("markdownThreads").get("enableSpecitRendering",!1)?Li(t):null;if(R){let k=Pi(this.document.uri.fsPath),T=Sr[k]??Sr.Other;f=JSON.stringify({fields:R.fields,editableFields:[...Fi],statusOptions:T}).replace(/</g,"\\u003c"),R.fields.Project&&(c=R.fields.Project);let L=Di(k);L&&(h=`
          <p class="doc-subtitle">${He(L)}</p>`);let ne=R.fields.Status;if(ne){let Fe=ne.toLowerCase();l=`
        <div class="specit-status-row">${T.map(be=>{let ce=be.toLowerCase(),Le=ce===Fe;return`<button class="specit-status-btn ${`specit-status-btn-${ce}`} ${Le?"specit-status-btn-active":""}" data-status="${He(be)}">${He(be)}</button>`}).join("")}</div>`}}return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src ${i} 'unsafe-inline'; script-src ${i} 'unsafe-inline' https://cdn.jsdelivr.net 'nonce-${s}' 'unsafe-eval'; img-src ${i} https: data:; font-src ${i};">
  <link href="${this.styleUri}" rel="stylesheet">
  <title>${He(c)}</title>
</head>
<body>
  <div id="layout">
    <div id="content-scroll">
      <div class="doc-header">
        <div class="doc-header-row">
          <h1>${He(c)}</h1>
          <div class="doc-header-actions">
            <button class="back-btn" id="backBtn" title="Go back to previous document" style="display:${this._navHistory.length>0?"inline-flex":"none"}">&#x2190; Back</button>
            <button class="refresh-btn" id="refreshBtn" title="Refresh document">&#x21bb; Refresh</button>
          </div>
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
    const docDirBase = ${JSON.stringify(m)};
    const specitData = ${f};
${rl}
  </script>
</body>
</html>`}dispose(){e.instance=void 0,this.updateTimeout&&clearTimeout(this.updateTimeout),this.panel.dispose();for(let t of this.disposables)t.dispose()}};function tl(){let e="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let r=0;r<32;r++)e+=t.charAt(Math.floor(Math.random()*t.length));return e}function He(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var rl=`
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

    // Mark relative .md links as internal document links for in-preview navigation
    document.querySelectorAll('#content a[href]').forEach(function(a) {
      var href = a.getAttribute('href');
      if (!href || href === '#') { return; }
      // Skip already-handled external links, anchors, and special protocols
      if (a.hasAttribute('data-external-url')) { return; }
      if (/^(?:https?|data|vscode-|mailto):/i.test(href)) { return; }
      if (href.charAt(0) === '#') { return; }
      // Check if the link targets a .md file (with optional #fragment)
      var filePart = href.split('#')[0];
      if (filePart && /\\.md$/i.test(filePart)) {
        a.setAttribute('data-internal-doc', href);
        a.setAttribute('href', '#');
        a.classList.add('internal-doc-link');
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

  // \u2500\u2500 handle messages from extension host (e.g., scrollToFragment) \u2500\u2500
  window.addEventListener('message', function(event) {
    var msg = event.data;
    if (msg && msg.command === 'scrollToFragment' && msg.fragment) {
      var target = document.getElementById(msg.fragment);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

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

  // \u2500\u2500 back button \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  var backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      vscode.postMessage({ command: 'navigateBack' });
    });
  }

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

  // \u2500\u2500 link handling (external + internal docs) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  contentEl.addEventListener('click', function(e) {
    var anchor = e.target.closest('a');
    if (!anchor) { return; }
    // Internal document link \u2014 navigate preview to linked .md file
    var internalDoc = anchor.getAttribute('data-internal-doc');
    if (internalDoc) {
      e.preventDefault();
      vscode.postMessage({ command: 'openInternalDoc', relativePath: internalDoc });
      return;
    }
    // External URL \u2014 open in simple browser
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
`;var S=M(require("vscode")),N=M(require("path"));var _r=class extends S.TreeItem{constructor(r,n,s){super(r,S.TreeItemCollapsibleState.None);this.label=r;this.uri=n;this.commentCount=s;this.resourceUri=n,this.tooltip=n.fsPath,this.contextValue="markdownFile",this.command={command:"markdownThreads.openPreview",title:"Open Preview",arguments:[n]},s>0&&(this.description=`${s} comment${s>1?"s":""}`),this.iconPath=new S.ThemeIcon("markdown")}label;uri;commentCount},wt=class extends S.TreeItem{constructor(r,n,s){super(r,S.TreeItemCollapsibleState.Expanded);this.label=r;this.folderPath=n;this.children=s;this.contextValue="folder",this.iconPath=S.ThemeIcon.Folder}label;folderPath;children};function Mi(e){let t=e.filter(n=>n.length>0);return t.length===0?void 0:t.length===1?`**/${t[0]}/**`:`{${t.map(n=>`**/${n}/**`).join(",")}}`}var kt=class{_onDidChangeTreeData=new S.EventEmitter;onDidChangeTreeData=this._onDidChangeTreeData.event;fileWatcher;sidecarWatcher;configWatcher;selectedFolder;constructor(){this.fileWatcher=S.workspace.createFileSystemWatcher("**/*.md"),this.fileWatcher.onDidCreate(()=>this.refresh()),this.fileWatcher.onDidDelete(()=>this.refresh()),this.fileWatcher.onDidChange(()=>this.refresh()),this.sidecarWatcher=S.workspace.createFileSystemWatcher("**/*.comments.json"),this.sidecarWatcher.onDidCreate(()=>this.refresh()),this.sidecarWatcher.onDidDelete(()=>this.refresh()),this.sidecarWatcher.onDidChange(()=>this.refresh()),this.configWatcher=S.workspace.onDidChangeConfiguration(t=>{t.affectsConfiguration("markdownThreads.excludeFolders")&&this.refresh()})}async selectFolder(){let t=S.workspace.workspaceFolders?.[0]?.uri.fsPath;if(!t)return;let r=S.workspace.getConfiguration("markdownThreads").get("excludeFolders",[]),n=Mi(r),s=await S.workspace.findFiles("**/*.md",n),i=new Set;i.add("");for(let m of s){let f=N.relative(t,m.fsPath),l=N.dirname(f);if(l!=="."){let h=l.split(N.sep),p="";for(let R of h)p=p?N.join(p,R):R,i.add(p)}}let a=[{label:"$(home) All Folders",description:"Show all markdown files",detail:""}],o=Array.from(i).filter(m=>m!=="").sort();for(let m of o)a.push({label:`$(folder) ${m}`,description:"",detail:m});let c=await S.window.showQuickPick(a,{placeHolder:"Select a folder to filter markdown files",title:"Filter by Folder"});c&&(this.selectedFolder=c.detail||void 0,this.refresh())}getSelectedFolderName(){return this.selectedFolder||"All Folders"}refresh(){this._onDidChangeTreeData.fire()}getTreeItem(t){return t}async getChildren(t){if(!S.workspace.workspaceFolders)return[];if(t instanceof wt)return t.children;if(t)return[];let r=S.workspace.workspaceFolders[0].uri.fsPath,n=this.selectedFolder?`${this.selectedFolder}/**/*.md`:"**/*.md",s=S.workspace.getConfiguration("markdownThreads").get("excludeFolders",[]),i=Mi(s),a=await S.workspace.findFiles(n,i);if(this.selectedFolder){let c=N.join(r,this.selectedFolder);a=a.filter(m=>m.fsPath.startsWith(c))}return a.length===0?[]:await this.buildTree(a)}async buildTree(t){let r=S.workspace.workspaceFolders?.[0]?.uri.fsPath??"",n=new Map;for(let a of t){let o=N.relative(r,a.fsPath),c=N.dirname(o),m=c==="."?"":c;n.has(m)||n.set(m,[]),n.get(m).push(a)}let s=Array.from(n.keys()).sort(),i=[];for(let a of s){let o=n.get(a);o.sort((m,f)=>N.basename(m.fsPath).localeCompare(N.basename(f.fsPath)));let c=[];for(let m of o){let f=await this.getCommentCount(m.fsPath);c.push(new _r(N.basename(m.fsPath),m,f))}a===""?i.push(...c):i.push(new wt(a,N.join(r,a),c))}return i}async getCommentCount(t){return(await I.readSidecar(t))?.comments.length??0}dispose(){this.fileWatcher?.dispose(),this.sidecarWatcher?.dispose(),this.configWatcher?.dispose(),this._onDidChangeTreeData.dispose()}};var ve;async function nl(e){console.log("[MarkdownThreads] Extension activating..."),console.log("[MarkdownThreads] Workspace folders:",Y.workspace.workspaceFolders?.map(r=>r.uri.fsPath)),Oe.setExtensionUri(e.extensionUri),ve=new kt;let t=Y.window.createTreeView("markdownThreads.files",{treeDataProvider:ve,showCollapseAll:!0});e.subscriptions.push(t),e.subscriptions.push({dispose:()=>ve.dispose()}),ve.onDidChangeTreeData(()=>{t.description=ve.getSelectedFolderName()}),e.subscriptions.push(Y.commands.registerCommand("markdownThreads.refreshFiles",()=>ve.refresh()),Y.commands.registerCommand("markdownThreads.selectFolder",()=>ve.selectFolder()),Y.commands.registerCommand("markdownThreads.openPreview",async r=>{let n;if(r){n=await Y.workspace.openTextDocument(r);for(let s of Y.window.tabGroups.all)for(let i of s.tabs){let a=i.input?.uri;a&&a.toString()===r.toString()&&await Y.window.tabGroups.close(i)}await Oe.show(n);return}else{let s=Y.window.activeTextEditor;s&&s.document.languageId==="markdown"&&(n=s.document)}if(!n||n.languageId!=="markdown"){Y.window.showWarningMessage("Open a markdown file to preview with comments");return}await Oe.show(n)}));try{await ae.initialize()}catch(r){console.error("[MarkdownThreads] Git initialization failed:",r)}}function sl(){}0&&(module.exports={activate,deactivate});
