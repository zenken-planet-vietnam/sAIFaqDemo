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
        // for empty string query, we don't need to return all questions
        // if (query.length < 1 && tags.length === 0) {
        //     return {
        //         questions: categoryId && categoryId !== null ? this.scriptData.questions.filter((x: any) => x.categories.find((y: any) => y === categoryId) !== undefined) : this.scriptData.questions,
        //         words: [],
        //         fullQuestions: this.scriptData.questions
        //     }
        // }
        // const text=tags.map((elem:any)=>{return elem.text}).join(" & ")+query.length>0 ?' $ '+query:''
        const text = tags.length > 0 ? tags.map((elem: any) => { return elem.text; }).join(" & ") + (query.length > 0 ? ' & ' + query : '') : query
        let pinningResult: any = []
        let hiddenResult: any = []
        let result: any = null
        if (!categoryId) {
            result = this.getQuestionPinings(text)
            pinningResult = result.promotedQuestions
            hiddenResult = result.hiddenQuestions
        }

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
        let results: any = []
        //if not empty query, performing recursive-search
        if (text)
            results = this.recursiveSearch(postfix, questionFilter)
        //else => using initial question list to apply pinning result for query empty
        else
            results = this.scriptData.questions.map((item:any) => item.id)
        const questions: any = pinningResult?.length ? pinningResult : []
        const hiddenList: any = hiddenResult?.length ? hiddenResult : []
        const fullQuestionList: any = []
        //for displaying in Setting page
        results.forEach((element: any) => {
            if (!questions.find((x: any) => { return x.id === element })) {
                const findItem = this.scriptData.questions.find((x: any) => x.id === element)
                if (!hiddenList.find((y: any) => { return y.id === element}))
                    questions.push(findItem)
            }
            if (!fullQuestionList.find((x:any) => { return x.id === element})){
                const findItem = this.scriptData.questions.find((x: any) => x.id === element)
                fullQuestionList.push(findItem)
            }
        });

        return {
            // questions: [...new Set([...unionQuestions, ...intersectQuestions, ...excludeQuestions])],
            questions,
            fullQuestions: fullQuestionList,
            words: [...words.map(x => x.replace(/[^a-zA-Z0-9]/g, '')).filter(y => y.length > 0), ...this.levenWords]
        }
    }
    getQuestionPinings(query: string) {
        const result = this.scriptData?.questionPinnings?.find(
            (x: any) => x.keyword.toLowerCase() === query.trim().toLocaleLowerCase())
        if (result) {
            const promotedQuestions = result.questionIds.map((item: any) => {
                let question = { ...this.scriptData.questions.find((x: any) => x.id === item) }
                if (question) {
                    question = { ...question, isPinned: true, pinType: 1 }
                }
                return question
            })

            const hiddenQuestions = result.hiddenIds.map((item: any) => {
                let question = { ...this.scriptData.questions.find((x: any) => x.id === item) }
                if (question) {
                    question = { ...question, isPinned: false, pinType: 0 }
                }
                return question
            })

            return {promotedQuestions, hiddenQuestions}
        }
        return {promotedQuestions: [], hiddenQuestions: []}
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