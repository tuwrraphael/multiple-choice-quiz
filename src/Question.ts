export interface Answer {
    text: string;
    correct: boolean;
}

export interface Question {
    text: string;
    id: number;
    answers: Answer[];
    correct: number;
    total: number;
    repeat : number;
}
