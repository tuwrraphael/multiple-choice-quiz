!function(){"use strict";let e={code:"code-8486fb894077144901ef9d391b9822ba4373cb0a",asset:"asset-v1",webfont:"webfont",quizzes:"quizzes"};self.addEventListener("install",(function(s){let t=[{'revision':null,'url':'/multiple-choice-quiz/115.b4f1bcf441d2ca36ab61.css'},{'revision':null,'url':'/multiple-choice-quiz/14ab7084d4f3b9c59936.bundle.js'},{'revision':null,'url':'/multiple-choice-quiz/5bf694546e6305cb5f9c.bundle.js'},{'revision':null,'url':'/multiple-choice-quiz/8ff516fb1ce9d702076f.bundle.js'},{'revision':'9553f19719f79ea63afc927f9ff26238','url':'/multiple-choice-quiz/favicons/android-chrome-192x192.png'},{'revision':'d74b92f2f61e3c1a1073ef163ba15401','url':'/multiple-choice-quiz/favicons/android-chrome-512x512.png'},{'revision':'23b3b7bcd64e8657c65d1a694ac8669b','url':'/multiple-choice-quiz/favicons/apple-touch-icon.png'},{'revision':'a493ba0aa0b8ec8068d786d7248bb92c','url':'/multiple-choice-quiz/favicons/browserconfig.xml'},{'revision':'831b8f4c38087b53386213f65fd7ab50','url':'/multiple-choice-quiz/favicons/favicon-16x16.png'},{'revision':'08e430c4775a1ac3a9a23ae26f987fd1','url':'/multiple-choice-quiz/favicons/favicon-32x32.png'},{'revision':'5f5df2ac0eab2b95aa76701ee66fbe72','url':'/multiple-choice-quiz/favicons/favicon.ico'},{'revision':'1a6130dbed2dc19bc0fd3c687376660f','url':'/multiple-choice-quiz/favicons/mstile-144x144.png'},{'revision':'9e8c77022c14dd1c543260c9fcb88fbb','url':'/multiple-choice-quiz/favicons/mstile-150x150.png'},{'revision':'c84d74c640b8f5ae163833e65b7c0ae7','url':'/multiple-choice-quiz/favicons/mstile-310x150.png'},{'revision':'506fa0e81db632b650ce2f48f49d0dc5','url':'/multiple-choice-quiz/favicons/mstile-310x310.png'},{'revision':'c6db4c2c144868030343fcf72b9beaf9','url':'/multiple-choice-quiz/favicons/mstile-70x70.png'},{'revision':'b9aa277fcfc34c31db6c7a7ea3469b8c','url':'/multiple-choice-quiz/favicons/site.webmanifest'},{'revision':null,'url':'/multiple-choice-quiz/index.a6d6f29327771b57b6a0.css'},{'revision':'40d7eefa6fe37882e5a703d4ae25e83a','url':'/multiple-choice-quiz/licenses.txt'},{'revision':'4e6d52b4958fee182cb4f09e590e7160','url':'/multiple-choice-quiz/quizzes/manuel-quiz-1.encrypted.bin'},{'revision':'843a027c44e0e759003b8aa33147ab82','url':'/multiple-choice-quiz/quizzes/testquiz.encrypted.bin'},{'revision':'057a42ec69b99be4ee6b9dc004709fe6','url':'/multiple-choice-quiz/quizzes/testquiz.txt'},{'revision':'86d5a53519896af65b68182e7aa66a85','url':'/multiple-choice-quiz/site.webmanifest'}].reduce(((e,s)=>(s.url.indexOf("favicons/")>-1?e.asset.push(s.url):s.url.indexOf("quizzes/")>-1?e.quizzes.push(s.url):e.code.push(s.url),e)),{asset:[],code:[],quizzes:[]}),a=[{name:e.code,assets:[...t.code,"index.html"]},{name:e.asset,assets:t.asset},{name:e.webfont,assets:["https://fonts.googleapis.com/icon?family=Material+Icons","https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"]},{name:e.quizzes,assets:t.quizzes}];s.waitUntil((async()=>{let e=a.map((async e=>{let s=await caches.open(e.name);await s.addAll(e.assets)}));await Promise.all(e)})())})),self.addEventListener("activate",(s=>{s.waitUntil((async()=>{let s=await caches.keys(),t=Object.values(e),a=s.filter((e=>t.indexOf(e)<0)).map((async e=>{await caches.delete(e)}));await Promise.all(a)})())})),self.addEventListener("fetch",(function(s){if("navigate"!==s.request.mode)s.respondWith(caches.match(s.request).then((function(t){return t||(["https://fonts.gstatic.com","https://fonts.googleapis.com"].some((e=>s.request.url.startsWith(e)))?s.waitUntil((async()=>{(await caches.open(e.webfont)).add(s.request)})()):s.request.url.indexOf("/quizzes/")>-1&&s.waitUntil((async()=>{(await caches.open(e.quizzes)).add(s.request)})()),fetch(s.request))})));else{if("GET"!==s.request.method)return;s.respondWith(caches.match("index.html",{cacheName:e.code}).then((e=>e||fetch(s.request))))}})),self.addEventListener("message",(e=>{"skipWaiting"===e.data.action&&self.skipWaiting()}))}();
//# sourceMappingURL=sw.js.map