!function(){"use strict";let e={code:"code-65d76ed3f4fffda92952fbb3cfdc5c5898013bd8",asset:"asset-v1",webfont:"webfont",quizzes:"quizzes"};self.addEventListener("install",(function(t){let s=[{'revision':null,'url':'/multiple-choice-quiz/1794364fff5440588068.bundle.js'},{'revision':null,'url':'/multiple-choice-quiz/493.5923aa9c9b937a593eb5.css'},{'revision':null,'url':'/multiple-choice-quiz/90355df9b0369b6f6f7c.bundle.js'},{'revision':null,'url':'/multiple-choice-quiz/ebfd6259460fb2601641.bundle.js'},{'revision':'9553f19719f79ea63afc927f9ff26238','url':'/multiple-choice-quiz/favicons/android-chrome-192x192.png'},{'revision':'d74b92f2f61e3c1a1073ef163ba15401','url':'/multiple-choice-quiz/favicons/android-chrome-512x512.png'},{'revision':'23b3b7bcd64e8657c65d1a694ac8669b','url':'/multiple-choice-quiz/favicons/apple-touch-icon.png'},{'revision':'a493ba0aa0b8ec8068d786d7248bb92c','url':'/multiple-choice-quiz/favicons/browserconfig.xml'},{'revision':'831b8f4c38087b53386213f65fd7ab50','url':'/multiple-choice-quiz/favicons/favicon-16x16.png'},{'revision':'08e430c4775a1ac3a9a23ae26f987fd1','url':'/multiple-choice-quiz/favicons/favicon-32x32.png'},{'revision':'5f5df2ac0eab2b95aa76701ee66fbe72','url':'/multiple-choice-quiz/favicons/favicon.ico'},{'revision':'1a6130dbed2dc19bc0fd3c687376660f','url':'/multiple-choice-quiz/favicons/mstile-144x144.png'},{'revision':'9e8c77022c14dd1c543260c9fcb88fbb','url':'/multiple-choice-quiz/favicons/mstile-150x150.png'},{'revision':'c84d74c640b8f5ae163833e65b7c0ae7','url':'/multiple-choice-quiz/favicons/mstile-310x150.png'},{'revision':'506fa0e81db632b650ce2f48f49d0dc5','url':'/multiple-choice-quiz/favicons/mstile-310x310.png'},{'revision':'c6db4c2c144868030343fcf72b9beaf9','url':'/multiple-choice-quiz/favicons/mstile-70x70.png'},{'revision':'b9aa277fcfc34c31db6c7a7ea3469b8c','url':'/multiple-choice-quiz/favicons/site.webmanifest'},{'revision':null,'url':'/multiple-choice-quiz/index.0b763780f9cf04d87f3c.css'},{'revision':'40d7eefa6fe37882e5a703d4ae25e83a','url':'/multiple-choice-quiz/licenses.txt'},{'revision':'4e6d52b4958fee182cb4f09e590e7160','url':'/multiple-choice-quiz/quizzes/manuel-quiz-1.encrypted.bin'},{'revision':'0f229313b70d2517b00cfaebda410b15','url':'/multiple-choice-quiz/quizzes/testquiz.encrypted.bin'},{'revision':'979bcf5cc2dadb8f7eb6d749b0af0686','url':'/multiple-choice-quiz/quizzes/testquiz.txt'},{'revision':'86d5a53519896af65b68182e7aa66a85','url':'/multiple-choice-quiz/site.webmanifest'}].reduce(((e,t)=>(t.url.indexOf("favicons/")>-1?e.asset.push(t.url):t.url.indexOf("quizzes/")>-1||e.code.push(t.url),e)),{asset:[],code:[]}),a=[{name:e.code,assets:[...s.code,"index.html"]},{name:e.asset,assets:s.asset},{name:e.webfont,assets:["https://fonts.googleapis.com/icon?family=Material+Icons","https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"]}];t.waitUntil((async()=>{let e=a.map((async e=>{let t=await caches.open(e.name);await t.addAll(e.assets)}));await Promise.all(e)})())})),self.addEventListener("activate",(t=>{t.waitUntil((async()=>{let t=await caches.keys(),s=Object.values(e),a=t.filter((e=>s.indexOf(e)<0)).map((async e=>{await caches.delete(e)}));await Promise.all(a)})())})),self.addEventListener("fetch",(function(t){if("navigate"!==t.request.mode)t.respondWith(caches.match(t.request).then((function(s){return s||(["https://fonts.gstatic.com","https://fonts.googleapis.com"].some((e=>t.request.url.startsWith(e)))?t.waitUntil((async()=>{(await caches.open(e.webfont)).add(t.request)})()):t.request.url.indexOf("/quizzes/")>-1&&t.waitUntil((async()=>{(await caches.open(e.quizzes)).add(t.request)})()),fetch(t.request))})));else{if("GET"!==t.request.method)return;t.respondWith(caches.match("index.html",{cacheName:e.code}).then((e=>e||fetch(t.request))))}}))}();
//# sourceMappingURL=sw.js.map