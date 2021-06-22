import { Question } from "./Question";
import { State } from "./State";
import { Debouncer } from "./utils/Debouncer";

interface AnsweredQuestion { id: number, correct: number, total: number }

let currentQuiz: Question[];
let answeredQuestions: AnsweredQuestion[];
let currentAccessToken: string = null;
let currentSheetId: string = null;
let currentQuizId: string = null;
let repeat = 0;
let state: State = {
    loading: true,
    question: null,
    needKey: false,
    done: false,
    decryptFailed: false,
    reveal: false,
    unsaved: false,
    saveerror: false
};

function shuffle<T>(array: T[]): T[] {
    let currentIndex: number = array.length;
    let temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

async function stateChange(c: (s: State) => State) {
    state = c(state);
    self.postMessage(state);
}

function nextQuestion() {
    let question = currentQuiz.shift();
    stateChange(s => {
        return {
            ...s, question: question,
            loading: false,
            needKey: false,
            done: currentQuiz.length < 1,
            reveal: false
        };
    });
}

async function initialize(access_token: string, spreadsheetId: string, quizfile: string, quizSettings: { numberOfQuestions: number, repeat: number }, decryptionKey?: string) {
    stateChange(s => {
        return {
            ...s,
            needKey: false,
            loading: true,
            done: false,
            question: null,
            decryptFailed: false,
            reveal: false,
            unsaved: false,
            saveerror: false
        };
    });
    let saveKey: boolean = !!decryptionKey;
    if (!decryptionKey) {
        decryptionKey = await getDecryptionKey(access_token, spreadsheetId, quizfile);
    }
    if (!decryptionKey) {
        stateChange(s => { return { ...s, needKey: true, loading: false }; });
        return;
    }
    let [progress, quiz] = await Promise.all([getQuizProgress(access_token, spreadsheetId, quizfile), getQuiz(quizfile, decryptionKey)]);
    for (let q of quiz) {
        let p = progress.get(q.id);
        if (p) {
            q.total = p.total;
            q.correct = p.correct;
        }
    }
    if (saveKey) {
        let res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent("base!A1:B1")}:append?valueInputOption=RAW`, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ majorDimension: "ROWS", values: [[quizfile, decryptionKey]] })
        });
    }
    currentQuiz = shuffle(quiz);
    answeredQuestions = [];
    currentQuiz = currentQuiz.sort((a, b) => {
        if (a.correct != b.correct) {
            return a.correct - b.correct;
        }
        return a.total - b.total;
    });
    if (quizSettings.numberOfQuestions < 1 || quizSettings.numberOfQuestions > currentQuiz.length) {
        quizSettings.numberOfQuestions = currentQuiz.length;
    }
    if (quizSettings.repeat < 0) {
        quizSettings.repeat == 0;
    }
    currentQuiz = currentQuiz.slice(0, quizSettings.numberOfQuestions);
    repeat = quizSettings.repeat;
    nextQuestion();
    currentAccessToken = access_token;
    currentSheetId = spreadsheetId;
    currentQuizId = quizfile;
}

async function getDecryptionKey(access_token: string, spreadsheetId: string, quizfile: string) {
    let res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent("base!A:B")}`, {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    });
    let data: { values: [string, string][] } = await res.json();
    if (!data.values) {
        return null;
    }
    let key = data.values.find(d => d[0] == quizfile);
    if (key) {
        return key[1];
    }
    return null;
}

async function getQuizProgress(access_token: string, spreadsheetId: string, quizfile: string) {
    let res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${quizfile}!A:B`)}`, {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    });
    if (res.status == 400) {
        let res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "requests": [{
                    "addSheet": {
                        "properties": {
                            "title": quizfile
                        }
                    }
                }]
            })
        });
    }
    let data: { values: [string, string][] } = await res.json();
    let map = new Map<number, { correct: number, total: number }>();
    if (null != data.values) {
        for (let i = 0; i < data.values.length; i++) {
            let correct = parseInt(data.values[i][0]);
            let total = parseInt(data.values[i][1]);
            if (!isNaN(correct) && !isNaN(total)) {
                map.set(i + 1, { correct: correct, total: total });
            }
        }
    }
    return map;

}

async function* loadAndDecryptQuiz(quizfile: string, decryptionKey: string) {
    let res = await fetch(`quizzes/${quizfile}`);
    let blob = await res.blob();
    const salt = new Uint8Array([18, 182, 224, 94, 67, 153, 88, 240, 68, 90, 143, 209, 190, 39, 25, 237]);
    let arrayBuffer = await blob.arrayBuffer();
    let iv = new Uint8Array(arrayBuffer, 0, 12);
    let cryptext = new Uint8Array(arrayBuffer, 12);
    let encoder = new TextEncoder();
    let keyMaterial = await self.crypto.subtle.importKey(
        "raw",
        encoder.encode(decryptionKey),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
    );
    let key = await self.crypto.subtle.deriveKey(
        {
            "name": "PBKDF2",
            salt: salt,
            "iterations": 100000,
            "hash": "SHA-256"
        },
        keyMaterial,
        { "name": "AES-GCM", "length": 256 },
        true,
        ["encrypt", "decrypt"]
    );
    try {
        let decrypted = await self.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            cryptext
        );
        let decoder = new TextDecoder("utf8");
        let question: Question = null;
        for (let line of decoder.decode(decrypted).split("\n")) {
            if (line.startsWith("#")) {
                if (null != question) {
                    yield question;
                }
                question = {
                    text: null,
                    answers: [],
                    id: parseInt(line.substr(1)),
                    correct: 0,
                    total: 0,
                    repeat: 0
                };
            }
            else if (question != null && question.text == null) {
                question.text = line;
            }
            else if (/^(F|T)\:/.test(line)) {
                if (question == null) {
                    throw "no question";
                }
                let correct = false;
                if (line.startsWith("T")) {
                    correct = true;
                }
                question.answers.push({
                    text: line.replace(/^(F|T)\:/, ""),
                    correct: correct
                });
            }
        }
        if (null != question) {
            yield question;
        }
    }
    catch (err) {
        stateChange(s => { return { ...s, needKey: true, decryptFailed: true, loading: false }; });
        throw err;
    }
}

async function getQuiz(quizfile: string, decryptionKey: string) {
    const quiz: Question[] = [];
    for await (const i of loadAndDecryptQuiz(quizfile, decryptionKey)) {
        quiz.push(i);
    }
    return quiz;
}

let debouncer = new Debouncer();
let lastSync = 0;

async function save(userAnswers: boolean[]) {
    let iscorrect = !state.question.answers.map((a, idx) => userAnswers[idx] == a.correct).some(v => !v);
    state.question.correct = iscorrect ? state.question.correct + 1 : state.question.correct;
    state.question.total += 1;
    if (state.question.repeat < repeat) {
        state.question.repeat += 1;
        currentQuiz.push(state.question);
    }
    stateChange(s => { return { ...s, reveal: true, unsaved: true, done: currentQuiz.length < 1 }; });
    answeredQuestions.push({ id: state.question.id, correct: state.question.correct, total: state.question.total });
    try {
        await debouncer.trigger(Math.max(5000, 30000 - (+new Date() - lastSync)));
    }
    catch {
        return;
    }
    let proc = Array.from(answeredQuestions);
    answeredQuestions = [];
    let updates: AnsweredQuestion[] = [];
    for (let q of proc) {
        if (!proc.find(q2 => q.id == q2.id && q2.total > q.total)) {
            updates.push(q);
        }
    }
    let res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${currentSheetId}/values:batchUpdate`, {
        headers: {
            "Authorization": `Bearer ${currentAccessToken}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            valueInputOption: "RAW",
            data: updates.map(q => {
                return {
                    range: `${currentQuizId}!A${q.id}:B${q.id}`,
                    "majorDimension": "ROWS",
                    "values": [
                        [q.correct, q.total]
                    ]
                };
            })
        })
    });
    if (res.ok) {
        stateChange(s => { return { ...s, unsaved: false, saveerror: false }; });
    } else {
        for (let q of updates) {
            answeredQuestions.push(q);
        }
        stateChange(s => { return { ...s, saverror: true }; });
    }
    lastSync = +new Date();
}

self.addEventListener("message", ev => {
    if (ev.data.type == "load") {
        initialize(ev.data.access_token, ev.data.spreadsheetId, ev.data.quizfile, ev.data.quizSettings, ev.data.decryptionKey);
    } else if (ev.data.type == "save") {
        save(ev.data.userAnswers);
    } else if (ev.data.type == "next") {
        nextQuestion();
    }
})