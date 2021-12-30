/* eslint-disable no-unused-vars */

export class Expression {
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
        postfix = postfix.map(x => x.trim()).filter(x => x.length > 0)
        return postfix
    }

    createBinaryTree(input) {
        let postfix = this.toPostfix(input)
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
                        operation: element,
                    }
                    let amountCharactorRemove = 0
                    if (element === '~' && i > 0) {
                        operation.left = postfix[i - 1]
                        amountCharactorRemove = 2
                    }

                    if ((element === '|' || element === '&' && i > 1)) {
                        operation.left = postfix[i - 2]
                        operation.right = postfix[i - 1]
                        amountCharactorRemove = 3
                    }

                    postfix.splice(i - amountCharactorRemove + 1, amountCharactorRemove)
                    i -= amountCharactorRemove
                    postfix.splice(i + 1, 0, operation)
                    i += 1
                }
            }
        }
        console.log(operation);
        return operation
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
