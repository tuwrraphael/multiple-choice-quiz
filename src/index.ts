import "./styles.scss";
import "./components/Login/Login";
import { Login } from "./components/Login/Login";

let updatingServiceWorker: ServiceWorker = null;

function displayUpdateReady() {
    let updateready: HTMLDivElement = document.querySelector("#updateready");
    updateready.style.display = "";
}

let updateBtn: HTMLButtonElement = document.querySelector("#update-btn");
updateBtn.addEventListener("click", () => {
    updatingServiceWorker.postMessage({ action: "skipWaiting" });
});
if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            let reg = await navigator.serviceWorker.register("./sw.js");
            if (!navigator.serviceWorker.controller) {
                // the app started the first time with latest version
                return;
            }
            let trackInstalling = (w: ServiceWorker) => {
                w.addEventListener("statechange", () => {
                    if (w.state == "installed") {
                        updatingServiceWorker = w;
                        displayUpdateReady();
                    }
                });
            };
            if (reg.waiting) {
                updatingServiceWorker = reg.waiting;
                displayUpdateReady();
                return;
            }
            if (reg.installing) {
                trackInstalling(reg.installing);
                return;
            }
            reg.addEventListener("updatefound", () => trackInstalling(reg.installing));
        }
        catch (registrationError) {
            console.log("SW registration failed.", registrationError);
        }
    });
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}

async function run() {
    var access_token: string = null;
    var exp = parseInt(sessionStorage.getItem("exp"));
    if (!isNaN(exp) && exp > +new Date()) {
        access_token = sessionStorage.getItem("token");
    }
    var url = window.location;
    var searchp = new URLSearchParams(url.hash.replace(/^#/, ""))
    var token_from_url = searchp.get("access_token");
    if (token_from_url) {
        var expires = parseInt(searchp.get("expires_in"));
        sessionStorage.setItem("token", token_from_url);
        exp = +(new Date) + expires * 1000;
        sessionStorage.setItem("exp", "" + exp);
        history.replaceState(null, null, ' ');
        access_token = token_from_url;
        console.log(access_token);
        if ("FederatedCredential" in window) {
            let res = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token_from_url}`);
            if (!res.ok) {
                throw new Error(`access token validation resulted in ${res.status}`);
            }
            let body = (await res.json());
            var cred = await navigator.credentials.create({
                federated: {
                    id: body.sub,
                    provider: "https://accounts.google.com"
                }
            });
            await navigator.credentials.store(cred);
        }
    }
    if (access_token) {
        document.querySelector("#logout").addEventListener("click", async () => {
            await navigator.credentials.preventSilentAccess();
            sessionStorage.clear();
            window.location.reload();
        });
        setTimeout(function () {
            window.location.reload();
        }, exp - (+ new Date()));
        let initializing: HTMLDivElement = document.querySelector("#initializing");
        initializing.style.display = "flex";
        const baseConfig = {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        };
        let filesRes = await fetch("https://www.googleapis.com/drive/v3/files", { ...baseConfig });
        let fileSearchRes: {
            files: {
                id: string,
                name: string,
                mimeType: string
            }[]
        } = await filesRes.json();
        let spreadsheetId: string = null;
        let file = fileSearchRes.files.find(f => f.mimeType == "application/vnd.google-apps.spreadsheet" && f.name == "MultipleChoiceQuiz");
        if (!file) {
            let createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
                ...baseConfig,
                headers: {
                    ...baseConfig.headers,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    properties: {
                        title: "MultipleChoiceQuiz"
                    },
                    sheets: [
                        {
                            properties: {
                                title: "base"
                            }
                        }
                    ]
                })
            });
            let createSheetRes: { spreadsheetId: string } = await createRes.json();
            spreadsheetId = createSheetRes.spreadsheetId;
        } else {
            spreadsheetId = file.id;
        }
        let quizzes: HTMLDivElement = document.querySelector("#quizzes");
        initializing.style.display = "none";
        quizzes.style.display = "flex";
        for (let el of document.querySelectorAll(".openquiz")) {
            el.addEventListener("click", async (e: MouseEvent) => {
                e.preventDefault();
                const { Quiz } = await import("./components/Quiz/Quiz");
                let q = new Quiz();
                document.body.appendChild(q);
                quizzes.style.display = "none";
                let numberOfQuestionsInput: HTMLInputElement = document.querySelector("#number-of-questions");
                let repeatInput: HTMLInputElement = document.querySelector("#repeat-questions");
                await q.initialize(access_token, spreadsheetId, el.getAttribute("data-file"),
                    { numberOfQuestions: parseInt(numberOfQuestionsInput.value || "50"), repeat: parseInt(repeatInput.value || "1") - 1 });
            });
        }
    } else {
        let login = new Login();
        document.body.appendChild(login);
    }
}
run().catch(err => console.error(err));