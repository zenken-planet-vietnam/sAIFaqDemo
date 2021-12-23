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
        console.log(postfix);
        // if postfix not contain operation (~,|,&) or lenght =1
        // return operation | with left is postfix string
        if (postfix.length === 1 || postfix.find(x => this.isOperation(x)) === undefined) {
            operation = {
                operation: '|',
                left: postfix.join(' '),
            }
        }
        // create binary tree operation
        // node:{
        //     left: text or node,
        //     right, text or node,
        //     operatiop: |,&,~
        // }
        else {
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
        console.log(postfix);
        let results = this.recursiveSearch(postfix)
        let questions = []
        results.forEach(element => {
            questions.push(this.scriptData.questions.find(x => x.id === element))
        });
        return {
            // questions: [...new Set([...unionQuestions, ...intersectQuestions, ...excludeQuestions])],
            questions,
            words: [...words.map(x => x.replace(/[^a-zA-Z0-9]/g, '')).filter(y => y.length > 0), ...this.levenWords]
        }
    }
    // recursive serch from child operation-> parent operation
    recursiveSearch(node) {
        let left = [], right = []
        if (node.left) {
            left = this.getNodeResult(node.left)
        }
        if (node.operation !== '~' && node.right) {
            right = this.getNodeResult(node.right)
        }
        // result is left ∩ right if '&' operation
        if (node.operation === '&') {
            return left.filter(value => right.includes(value));
        }
        // result is left +right if '|' operation
        else if (node.operation === '|') {
            let commonStack = [...left, ...right];
            //filter common
            return [...new Set(commonStack)];
        }
        // result is origin question -left if '~' opearation
        else if (node.operation === '~') {
            return this.scriptData.questions.map(x => x.id).filter(value => !left.includes(value));
        }
        return []
    }
    // get node result 
    // if node is string=> return result by find text
    // if node is opreration =>return  recursive search
    getNodeResult(node) {
        return this.isString(node) ? this.checkTextIncludeWords(this.splitText(node)) : this.recursiveSearch(node)
    }
    isString(obj) {
        return (Object.prototype.toString.call(obj) === '[object String]');
    }
    splitText(text) {
        return text.split(' ').map(x => x.trim())
    }
}