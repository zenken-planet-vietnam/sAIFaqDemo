/* eslint-disable no-unused-vars */
import { FullTextSearch } from "@core/libs/search";
import tinySegmenter from "@core/libs/tinySegmenter";


class Expression {
    isEmpty(arr) {
        return arr.length === 0
    }

    toPostfix(exp) {
        let postfix = [];
        let stack = [];
        let top = ""
        let tokens = this.lex(exp);
        debugger
        tokens.forEach(token => {
            if (this.isOperand(token)) {
                postfix.push(token);
            } else {
                if (token === ")") {
                    while ((top = stack.pop()) !== "(" && (!this.isEmpty(top))) {
                        postfix.push(top);
                    }

                } else {
                    while (
                        (stack.length) && !(stack.at(-1) === "(") &&
                        (this.priority(stack.at(-1)) >= this.priority(token))
                    ) {
                        postfix.push(stack.pop());
                    }
                    stack.push(token);
                }
            }
        })
        while (!this.isEmpty(stack)) {
            postfix.push(stack.pop());
        }

        return postfix;
    }

    isOperand(str) {
        return !((str === "|") || (str === "&") || (str === "~") ||
            (str === "(") || (str === ")"));
    }

    isOperator(str) {
        return !this.isOperand(str);
    }

    priority(operator) {
        let priority = 0;

        if (operator === ("&")) {
            priority = 2;
        }

        if (operator === "~") {
            priority = 3;
        }

        if (operator === "|") {
            priority = 1;
        }

        if (operator === "(" || operator === ")") {
            priority = 4;
        }

        return priority;
    }

    lex(string) {
        let bad = [' or ', ' -', ' '];
        let good = ['|', '~', '&'];
        string = string.replace(bad, good);
        string = string.toLowerCase();

        let tokens = [];
        let token = "";
        for (let i = 0; i < string.length; i++) {
            if (this.isOperator(string.charAt(i))) {
                if (token) {
                    tokens.push(token);
                }

                tokens.push(string.charAt(i));
                token = "";
            } else {
                token = token + string.charAt(i);
            }
        }
        if (token) {
            tokens.push(token);
        }
        return tokens;
    }
}


export class BooleanSearch extends FullTextSearch {
    constructor(scriptData) {
        super(scriptData)
        this.scriptData = scriptData
        this.levenWords = []
    }
    search(query = '', tags = []) {
        if (query.length < 1 && tags.length === 0) {
            return {
                questions: this.scriptData.questions,
                words: []
            }
        }
        let words = tinySegmenter.segmentNoneSpace(query)
        tags.forEach(element => {
            words.push(element.text)
        });
        let expression = new Expression;
        let postfix = expression.toPostfix("|" + query);
        // let postfix = ['ticket', '~', 'enough', '|']
        let stack = [], results = []

        let left = [], right = [], union = [], intersect = [], exclude = []
        console.log(postfix);
        postfix.forEach(token => {
            if (token === '&') {
                left = stack.pop();
                right = stack.pop();
                debugger
                if (this.isString(left)) {
                    left = this.checkTextIncludeWords(this.splitText(left));
                } else
                    left = []
                let rightStr = right
                if (this.isString(right)) {
                    right = this.checkTextIncludeWords(this.splitText(right))
                }
                else
                    right = []
                // do intersection
                let filteredArray = left.filter(value => right.includes(value));
                if (rightStr === ' ') {
                    results = results.filter(x => filteredArray.includes(x))
                }
                else
                    results = [...results, ...filteredArray];

            } else
                if (token === '|') {
                    left = stack.pop();
                    right = stack.pop();
                    debugger
                    if (this.isString(left)) {
                        left = this.checkTextIncludeWords(this.splitText(left));
                    }
                    if (this.isString(right)) {
                        right = this.checkTextIncludeWords(this.splitText(right))
                    }
                    if (!left) {
                        left = [];
                    }

                    if (!right) {
                        right = [];
                    }
                    // debugger
                    //do union
                    let commonStack = [...left, ...right];
                    //filter common
                    commonStack = [...new Set(commonStack)];
                    results = [...results, ...commonStack];

                } else
                    if (token === '~') {
                        left = (stack.pop());
                        if (this.isString(left)) {
                            left = this.checkTextIncludeWords(this.splitText(left));
                        }
                        if (!(left)) {
                            left = [];
                        }
                        results = results.filter(value => !right.includes(value));
                    } else {
                        stack.push(token);
                    }
        })
        console.log(results);
        let unionQuestions = [], intersectQuestions = [], excludeQuestions = []
        if (exclude.length > 0)
            excludeQuestions = this.scriptData.questions.filter(x => exclude.find(y => y === x.id) === undefined)
        if (intersect.length > 0)
            intersectQuestions = this.scriptData.questions.filter(x => intersect.find(y => y === x.id) !== undefined)
        if (union.length > 0)
            unionQuestions = this.scriptData.questions.filter(x => union.find(y => y === x.id) !== undefined)


        return {
            // questions: [...new Set([...unionQuestions, ...intersectQuestions, ...excludeQuestions])],
            questions: this.scriptData.questions.filter(x => results.find(y => y === x.id) !== undefined),
            words: [...words, ...this.levenWords]
        }
    }
    isString(obj) {
        return (Object.prototype.toString.call(obj) === '[object String]');
    }
    splitText(text) {
        return text.split(' ').map(x => x.trim())
    }
}