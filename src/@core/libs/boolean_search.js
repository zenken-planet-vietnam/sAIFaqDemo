/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import { FullTextSearch } from "@core/libs/search";
import tinySegmenter from "@core/libs/tinySegmenter";
import { Expression } from './expression'


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
        let postfix = expression.createBinaryTree(query);
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
        return this.isString(node) ? this.checkTextIncludeWords(tinySegmenter.removeStopWord(node)) : this.recursiveSearch(node)
    }
    isString(obj) {
        return (Object.prototype.toString.call(obj) === '[object String]');
    }
    splitText(text) {
        return text.split(' ').map(x => x.trim())
    }
}