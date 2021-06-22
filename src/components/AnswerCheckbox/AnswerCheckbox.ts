import { Answer } from "../../Question";
import { renderText } from "../../renderText";
import template from "./AnswerCheckbox.html";
import "./AnswerCheckbox.scss";

export class AnswerCheckbox extends HTMLElement {
    reset() {
        this.input.checked = false;
    }
    private input: HTMLInputElement;
    label: HTMLLabelElement;
    private reveal: HTMLSpanElement;

    constructor() {
        super();
        this.innerHTML = template;
        this.input = this.querySelector("input");
        this.label = this.querySelector("label");
        this.reveal = this.querySelector(".answer-reveal")
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }

    setData(idx: number, a: Answer, reveal: boolean) {
        this.label.setAttribute("for", this.input.id = `answer-${idx}`);
        this.label.innerHTML = renderText(a.text);
        this.input.name = "" + idx;
        this.input.disabled = reveal;
        if (reveal) {
            this.classList.add("reveal");
        }
        else {
            this.classList.remove("reveal");
        }
        ["correct", "wrong"].forEach(c => {
            this.label.classList.remove(c);
            this.reveal.classList.remove(c);
        });
        if (a.correct) {
            this.reveal.title = "this is a correct answer";
            this.reveal.classList.add("correct");
            this.label.classList.add("correct");
        } else {
            this.reveal.title = "this is a wrong answer";
            this.reveal.classList.add("wrong");
            this.label.classList.add("wrong");
        }
    }
}

customElements.define("answer-checkbox", AnswerCheckbox);
