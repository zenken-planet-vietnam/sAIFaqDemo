/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import { FullTextSearch } from "@/@core/libs/search";
import tinySegmenter from "@/@core/libs/tinySegmenter";
import { IQuestion } from "@/models/question";
import { Expression } from './expression'


export class BooleanSearch extends FullTextSearch {
    constructor(scriptData: any) {
        super(scriptData)
        this.scriptData = scriptData
        this.levenWords = []
    }
    search(query: any = '', tags: any = [], categoryId: any) {
        if (query.length < 1 && tags.length === 0) {
            return {
                questions: categoryId && categoryId !== null ? this.scriptData.questions.filter((x: any) => x.categories.find((y: any) => y === categoryId) !== undefined) : this.scriptData.questions,
                words: []
            }
        }
        // const text=tags.map((elem:any)=>{return elem.text}).join(" & ")+query.length>0 ?' $ '+query:''
        const text = tags.length > 0 ? tags.map((elem: any) => { return elem.text; }).join(" & ") + (query.length > 0 ? ' & ' + query : '') : query
        let pinningResult = []
        if (!categoryId)
            pinningResult = this.getQuestionPinings(text)
        const words = tinySegmenter.segmentNoneSpace(query)
        tags.forEach((element: any) => {
            words.push(element.text)
        });

        let questionFilter = undefined
        if (categoryId)
            questionFilter = this.scriptData.questions.filter((x: any) => x.categories.find((y: any) => y === categoryId)).map((item: IQuestion) => item.id)
        //ticket &pay & abc
        const expression = new Expression;
        const postfix = expression.createBinaryTree(text);
        const results = this.recursiveSearch(postfix, questionFilter)
        const questions: any = []
        results.forEach((element: any) => {
            questions.push(this.scriptData.questions.find((x: any) => x.id === element))
        });
        return {
            // questions: [...new Set([...unionQuestions, ...intersectQuestions, ...excludeQuestions])],
            questions: [...new Set([...pinningResult, ...questions])],
            words: [...words.map(x => x.replace(/[^a-zA-Z0-9]/g, '')).filter(y => y.length > 0), ...this.levenWords]
        }
    }
    getQuestionPinings(query: string) {
        const result = this.scriptData.questionPinnings.find((x: any) => x.keyword.toLowerCase() === query.trim().toLocaleLowerCase())
        if (result) {
         return result.questionIds.map((item:any)=>{
                const question= this.scriptData.questions.find((x:any)=>x.id===item)
                if(question) question.isPinned=true
                return question
                })
        }
        return []
    }
    // recursive serch from child operation-> parent operation
    recursiveSearch(node: any, searchFilter: any) {
        let left: any = [], right: any = []
        if (node.left) {
            left = this.getNodeResult(node.left, searchFilter)
        }
        if (node.operation !== '~' && node.right) {
            right = this.getNodeResult(node.right, searchFilter)
        }
        // result is left ∩ right if '&' operation
        if (node.operation === '&') {
            return left.filter((value: any) => right.includes(value));
        }
        // result is left +right if '|' operation
        else if (node.operation === '|') {
            const commonStack = [...left, ...right];
            //filter common
            return [...new Set(commonStack)];
        }
        // result is origin question -left if '~' opearation
        else if (node.operation === '~') {
            return this.scriptData.questions.map((x: any) => x.id).filter((value: any) => !left.includes(value));
        }
        return []
    }
    // get node result 
    // if node is string=> return result by find text
    // if node is opreration =>return  recursive search
    getNodeResult(node: any, searchFilter: any) {
        return this.isString(node) ? this.checkTextIncludeWords(tinySegmenter.removeStopWord(node), searchFilter) : this.recursiveSearch(node, searchFilter)
    }
    isString(obj: any) {
        return (Object.prototype.toString.call(obj) === '[object String]');
    }
    splitText(text: any) {
        return text.split(' ').map((x: any) => x.trim())
    }
}