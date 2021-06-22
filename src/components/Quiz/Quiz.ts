import { Answer, Question } from "../../Question";
import { renderText } from "../../renderText";
import { State } from "../../State";
import { ArrayToElementRenderer } from "../../utils/ArrayToElementRenderer";
import { AnswerCheckbox } from "../AnswerCheckbox/AnswerCheckbox";
import template from "./Quiz.html";
import "./Quiz.scss";

export class Quiz extends HTMLElement {
    private loading: HTMLProgressElement;
    private worker: Worker;
    private questionText: HTMLHeadingElement;
    private form: HTMLFormElement;
    private answerRenderer: ArrayToElementRenderer<[number, Answer], AnswerCheckbox, number>;
    private encryptionKeyForm: HTMLDivElement;
    private decryptBtn: HTMLButtonElement;
    access_token: string;
    spreadsheetId: string;
    quizfile: string;
    private keyInput: HTMLInputElement;
    private decryptFailed: HTMLDivElement;
    private nextBtn: HTMLButtonElement;
    private saveBtn: HTMLButtonElement;
    question: Question;
    private doneText: HTMLSpanElement;
    private saveError: HTMLDivElement;
    private saving: HTMLDivElement;
    private questionSurface: HTMLDivElement;
    private percent: HTMLSpanElement;
    private total: HTMLSpanElement;

    constructor() {
        super();
        this.innerHTML = template;
        this.loading = this.querySelector("#loading");
        this.form = this.querySelector("form");
        this.answerRenderer = new ArrayToElementRenderer(this.form,
            (s: [number, Answer]) => s[0], () => new AnswerCheckbox());
        this.encryptionKeyForm = this.querySelector("#need-key");
        this.keyInput = this.querySelector("#key");
        this.decryptBtn = this.querySelector("#decrypt");
        this.decryptFailed = this.querySelector("#decryptFailed");
        this.nextBtn = this.querySelector("#next");
        this.saveBtn = this.querySelector("#save");
        this.doneText = this.querySelector("#done");
        this.saveError = this.querySelector("#saveError");
        this.saving = this.querySelector("#saving");
        this.total = this.querySelector("#total");
        this.percent = this.querySelector("#percent");
        this.questionSurface = this.querySelector(".question");
        this.decryptBtn.addEventListener("click", ev => {
            this.worker.postMessage({
                type: "load",
                access_token: this.access_token,
                spreadsheetId: this.spreadsheetId,
                quizfile: this.quizfile,
                decryptionKey: this.keyInput.value
            });
        });
        this.nextBtn.addEventListener("click", () => {
            this.worker.postMessage({
                type: "next"
            });
        });
        this.saveBtn.addEventListener("click", () => {
            let formData = new FormData(this.form);
            this.worker.postMessage({
                type: "save",
                userAnswers: this.question.answers.map((a, idx) => formData.get("" + idx) == "on")
            });
        });
    }

    connectedCallback() {
        this.questionText = this.querySelector("#question");
    }

    disconnectedCallback() {

    }

    async initialize(access_token: string, spreadsheetId: string, quizfile: string) {
        this.access_token = access_token;
        this.spreadsheetId = spreadsheetId;
        this.quizfile = quizfile;
        this.worker = new Worker(new URL("../../quizworker", import.meta.url));
        this.worker.addEventListener("message", ev => {
            let newState: State = ev.data;
            if (newState.question) {
                this.questionText.innerHTML = renderText(newState.question.text);
                this.answerRenderer.update(newState.question.answers.map((a, idx) => [idx, a]), (c, d) => {
                    c.setData(d[0], d[1], newState.reveal);
                    if (!this.question || this.question.id != newState.question.id) {
                        c.reset();
                    }
                });
                this.total.innerText = `${newState.question.total} ${newState.question.total == 1 ? "time" : "times"}`;
                this.percent.innerText = newState.question.total == 0 ? "" : `was answered ${Math.round(100 * (newState.question.correct / newState.question.total))}% correctly and`;
                this.question = newState.question;
            }
            this.loading.style.display = newState.loading ? "block" : "none";
            this.questionSurface.style.display = newState.question ? "block" : "none";
            this.encryptionKeyForm.style.display = newState.needKey ? "block" : "none";
            this.decryptFailed.style.display = newState.decryptFailed ? "block" : "none";
            this.nextBtn.style.display = newState.question && newState.reveal && !newState.done ? "inline" : "none";
            this.saveBtn.style.display = newState.question && !newState.reveal ? "inline" : "none";
            this.doneText.style.display = newState.reveal && newState.done ? "inline" : "none";
            this.saving.style.visibility = newState.unsaved ? "visible" : "hidden";
            this.saveError.style.display = newState.saveerror ? "block" : "none";
        });
        this.worker.postMessage({
            type: "load",
            access_token: access_token,
            spreadsheetId: spreadsheetId,
            quizfile: quizfile
        });
    }
}

customElements.define("app-quiz", Quiz);
