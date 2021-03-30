import { Question } from "./Question";

export interface State {
    loading: boolean;
    question: Question;
    needKey: boolean;
    done: boolean;
    decryptFailed: boolean;
    unsaved: boolean;
    reveal: boolean;
    saveerror: boolean;
}