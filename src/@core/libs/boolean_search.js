/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import { FullTextSearch } from "@core/libs/search";
import tinySegmenter from "@core/libs/tinySegmenter";


class Expression {
    isEmpty(arr) {
        return arr.length === 0
    }
    // split string to operation 
    toPostfix(exp) {
        let postfix = [];
        let stack = [];
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
        postfix = postfix.filter(x => x.trim().length > 0)
        let operation = null, childOperation = null
        // if postfix not contain operation (~,|,&) or lenght =1
        // return operation | with left is postfix string
        if (postfix.length === 1 || postfix.find(x => this.isOperation(x)) === undefined) {
            operation = {
                operation: '|',
                left: postfix.join(' '),
            }
        }
        // create binary tree operation
        else
            for (let i = 0; i < postfix.length; i++) {
                const element = postfix[i];
                if (this.isOperator(element)) {
                    operation = {
                        right: childOperation,
                        operation: element,
                    }
                    // if child operation is null , need find value of left and right 
                    if (childOperation === null) {
                        if (element === '~') {
                            if (postfix.length > 1) {
                                operation.left = postfix[i - 1]
                                postfix.splice(i - 1, 2)
                                i -= 2
                            }
                        }
                        else {
                            if (postfix.length > 2) {
                                operation.right = postfix[i - 1]
                                operation.left = postfix[i - 2]
                                postfix.splice(i - 2, 3)
                                i -= 3
                            }
                        }
                    }
                    // if  child operation not null , need find value of left ,right value is child operation
                    else {
                        if (element === '~') {
                            if (postfix.length > 0) {
                                operation.left = childOperation
                                postfix.splice(i, 1)
                                i -= 1
                            }
                        }
                        else {
                            if (postfix.length > 1) {
                                operation.left = postfix[i - 1]
                                postfix.splice(i - 1, 2)
                                i -= 2
                            }
                        }
                    }

                    childOperation = operation
                }
            }
        return operation;
    }
    // check none operation
    isOperand(str) {
        return !((str === "|") || (str === "&") || (str === "~") ||
            (str === "(") || (str === ")"));
    }

    isOperator(str) {
        return !this.isOperand(str);
    }
    isOperation(str) {
        return (str === "|") || (str === "&") || (str === "~")
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
        let postfix = expression.toPostfix(query);
        let results = this.recursiveSearch(postfix)
        return {
            // questions: [...new Set([...unionQuestions, ...intersectQuestions, ...excludeQuestions])],
            questions: this.scriptData.questions.filter(x => results.find(y => y === x.id) !== undefined),
            words: [...words.map(x => x.replace(/[^a-zA-Z0-9]/g, '')).filter(y => y.length > 0), ...this.levenWords]
        }
    }
    // recursive serch from child operation-> parent operation
    recursiveSearch(operationData) {
        let left = [], right = []
        if (operationData.left) {
            // find questions with text if left is string
            // left is result find question with text
            if (this.isString(operationData.left))
                left = this.checkTextIncludeWords(this.splitText(operationData.left));
            //  rescursive search if left is operation
            // left  is result of child operation 
            else left = this.recursiveSearch(operationData.left)
        }
        if (operationData.operation !== '~' && operationData.right) {
            // find questions with text if right is string
            // right is result find question with text
            if (this.isString(operationData.right))
                right = this.checkTextIncludeWords(this.splitText(operationData.right));
            //  rescursive search if right is operation
            // right  is result of child operation 
            else right = this.recursiveSearch(operationData.right)
        }
        // result is left - right if '&' operation
        if (operationData.operation === '&') {
            return left.filter(value => right.includes(value));
        }
        // result is left +right if '|' operation
        else if (operationData.operation === '|') {
            let commonStack = [...left, ...right];
            //filter common
            return [...new Set(commonStack)];
        }
        // result is origin question -left if '~' opearation
        else if (operationData.operation === '~') {
            return this.scriptData.questions.map(x => x.id).filter(value => !left.includes(value));
        }
        return []

    }
    isString(obj) {
        return (Object.prototype.toString.call(obj) === '[object String]');
    }
    splitText(text) {
        return text.split(' ').map(x => x.trim())
    }
}