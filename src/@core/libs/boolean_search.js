import {FullTextSearch} from "@core/libs/search";
import tinySegmenter from "@core/libs/tinySegmenter";


class Expression {
    isEmpty(arr) {
        return arr.length === 0
    }

    toPostfix(exp) {
        let postfix = [];
        let stack   = [];
        let top = ""
        let tokens = this.lex(exp);
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
        let bad  = [' or ', ' -', ' '];
        let good = ['|', '~', '&'];

        string = string.replace(bad, good);
        string = string.toLowerCase();

        let tokens = [];
        let token  = "";
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
        let postfix    = expression.toPostfix("|" + query);
        let stack      = [];

        postfix.forEach(token => {
            if (token === '&') {
                let left  = stack.pop();
                let right = stack.pop();
                if (this.isString(left)) {
                    left = this.checkTextIncludeWords(left);
                }
                if (this.isString(right)) {
                    right = this.checkTextIncludeWords(right)
                }
                if (!left) {
                    left = [];
                }

                if (!right) {
                    right = [];
                }
                // do intersection
                let filteredArray = left.filter(value => right.includes(value));
                stack = [...stack, ...filteredArray];
            } else
            if (token === '|') {
                let left  = stack.pop();
                let right = stack.pop();

                if (this.isString(left)) {
                    left = this.checkTextIncludeWords(left);
                }
                if (this.isString(right)) {
                    right = this.checkTextIncludeWords(right)
                }
                if (!left) {
                    left = [];
                }

                if (!right) {
                    right = [];
                }
                //do union
                let commonStack = [...left, ...right];
                //filter common
                commonStack = [...new Set(commonStack)];
                stack = [...stack, ...commonStack];
            } else
            if (token === '~') {
                let left = (stack.pop());
                if (this.isString(left)) {
                    left = this.checkTextIncludeWords(left);
                }
                if (!(left)) {
                    left = [];
                }
                stack = [...stack, ...left];
            } else {
                stack.push(token);
            }
        })
        let questions = this.scriptData.questions.filter(x => stack[0].find(y => y === x.id) !== undefined)
        return {
            questions,
            words: [...words, ...this.levenWords]
        }
    }
    isString (obj) {
        return (Object.prototype.toString.call(obj) === '[object String]');
    }
}