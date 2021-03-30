import { environment } from "../../environment";
import template from "./Login.html";
import "./Login.scss";

function nonce(length: number) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export class Login extends HTMLElement {
    private clientIdInput: HTMLInputElement;
    private redirectUriInput: HTMLInputElement;
    private loginHintInput: HTMLInputElement;
    private loginForm: HTMLFormElement;
    private nonceIput: HTMLInputElement;

    constructor() {
        super();
        this.innerHTML = template;
    }

    connectedCallback() {
        this.clientIdInput = this.querySelector("#client_id");
        this.nonceIput = this.querySelector("#nonce");
        this.clientIdInput.value = environment.oAuthClientId;
        this.redirectUriInput = this.querySelector("#redirect_uri");
        this.redirectUriInput.value = window.location.href.replace(/(\?.+)|(\#.+)/g, "").replace(/(\/$)/g, "");
        this.loginHintInput = this.querySelector("#login_hint");
        this.loginForm = this.querySelector("#login_form");
        this.nonceIput.value = nonce(8);
        if ("FederatedCredential" in window) {
            navigator.credentials.get({
                federated: {
                    providers: [
                        "https://accounts.google.com"
                    ]
                },
                mediation: "silent"
            }).then(c => {
                if (c && c.type == "federated") {
                    this.loginHintInput.value = c.id;
                    this.loginForm.submit();
                }
            });
        }
    }

    disconnectedCallback() {

    }
}

customElements.define("app-login", Login);
