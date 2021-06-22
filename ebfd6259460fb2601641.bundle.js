!function(){"use strict";let e,t,a=null,r=null,s=null,n={loading:!0,question:null,needKey:!1,done:!1,decryptFailed:!1,reveal:!1,unsaved:!1,saveerror:!1};async function o(e){n=e(n),self.postMessage(n)}function i(){let t=e.shift();o((a=>({...a,question:t,loading:!1,needKey:!1,done:e.length<1,reveal:!1})))}async function l(e,t,a){let r=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${t}/values/${encodeURIComponent(`${a}!A:B`)}`,{headers:{Authorization:`Bearer ${e}`}});400==r.status&&await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${t}:batchUpdate`,{headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},method:"POST",body:JSON.stringify({requests:[{addSheet:{properties:{title:a}}}]})});let s=await r.json(),n=new Map;if(null!=s.values)for(let e=0;e<s.values.length;e++){let t=parseInt(s.values[e][0]),a=parseInt(s.values[e][1]);isNaN(t)||isNaN(a)||n.set(e+1,{correct:t,total:a})}return n}async function c(e,t){const a=[];for await(const r of async function*(e,t){let a=await fetch(`quizzes/${e}`),r=await a.blob();const s=new Uint8Array([18,182,224,94,67,153,88,240,68,90,143,209,190,39,25,237]);let n=await r.arrayBuffer(),i=new Uint8Array(n,0,12),l=new Uint8Array(n,12),c=new TextEncoder,u=await self.crypto.subtle.importKey("raw",c.encode(t),"PBKDF2",!1,["deriveBits","deriveKey"]),d=await self.crypto.subtle.deriveKey({name:"PBKDF2",salt:s,iterations:1e5,hash:"SHA-256"},u,{name:"AES-GCM",length:256},!0,["encrypt","decrypt"]);try{let e=await self.crypto.subtle.decrypt({name:"AES-GCM",iv:i},d,l),t=new TextDecoder("utf8"),a=null;for(let r of t.decode(e).split("\n"))if(r.startsWith("#"))null!=a&&(yield a),a={text:null,answers:[],id:parseInt(r.substr(1)),correct:0,total:0};else if(null!=a&&null==a.text)a.text=r;else if(/^(F|T)\:/.test(r)){if(null==a)throw"no question";let e=!1;r.startsWith("T")&&(e=!0),a.answers.push({text:r.replace(/^(F|T)\:/,""),correct:e})}null!=a&&(yield a)}catch(e){throw o((e=>({...e,needKey:!0,decryptFailed:!0,loading:!1}))),e}}(e,t))a.push(r);return a}let u=new class{constructor(){}timeout(e){return new Promise((t=>{setTimeout((()=>{t()}),e)}))}aborter(){let e={aborted:!1,promise:null},t=new Promise(((t,a)=>{this.abort=()=>{e.aborted=!1,a()}}));return e.promise=t,e}async trigger(e){this.abort&&this.abort();let t=this.aborter();try{await Promise.race([this.timeout(e),t.promise])}catch{throw new Error("aborted")}}},d=0;self.addEventListener("message",(p=>{"load"==p.data.type?async function(n,u,d,p){o((e=>({...e,needKey:!1,loading:!0,done:!1,question:null,decryptFailed:!1,reveal:!1,unsaved:!1,saveerror:!1})));let h=!!p;if(p||(p=await async function(e,t,a){let r=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${t}/values/${encodeURIComponent("base!A:B")}`,{headers:{Authorization:`Bearer ${e}`}}),s=await r.json();if(!s.values)return null;let n=s.values.find((e=>e[0]==a));return n?n[1]:null}(n,u,d)),!p)return void o((e=>({...e,needKey:!0,loading:!1})));let[f,y]=await Promise.all([l(n,u,d),c(d,p)]);for(let e of y){let t=f.get(e.id);t&&(e.total=t.total,e.correct=t.correct)}h&&await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${u}/values/${encodeURIComponent("base!A1:B1")}:append?valueInputOption=RAW`,{headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"},method:"POST",body:JSON.stringify({majorDimension:"ROWS",values:[[d,p]]})}),e=function(e){let t,a,r=e.length;for(;0!==r;)a=Math.floor(Math.random()*r),r-=1,t=e[r],e[r]=e[a],e[a]=t;return e}(y),t=[],e=e.sort(((e,t)=>e.correct!=t.correct?e.correct-t.correct:e.total-t.total)),i(),a=n,r=u,s=d}(p.data.access_token,p.data.spreadsheetId,p.data.quizfile,p.data.decryptionKey):"save"==p.data.type?async function(e){o((e=>({...e,reveal:!0,unsaved:!0}))),t.push({...n.question,userAnswers:e});try{await u.trigger(Math.max(5e3,3e4-(+new Date-d)))}catch{return}let i=Array.from(t);if(t=[],(await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${r}/values:batchUpdate`,{headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json"},method:"POST",body:JSON.stringify({valueInputOption:"RAW",data:i.map((e=>{let t=!e.answers.map(((t,a)=>e.userAnswers[a]==t.correct)).some((e=>!e));return{range:`${s}!A${e.id}:B${e.id}`,majorDimension:"ROWS",values:[[t?e.correct+1:e.correct,e.total+1]]}}))})})).ok)o((e=>({...e,unsaved:!1,saveerror:!1})));else{for(let e of i)t.push(e);o((e=>({...e,saverror:!0})))}d=+new Date}(p.data.userAnswers):"next"==p.data.type&&i()}))}();
//# sourceMappingURL=ebfd6259460fb2601641.bundle.js.map