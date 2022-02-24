/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "@/axios"
import { analysis } from "@/@core/libs/analysis"
import { BooleanSearch } from "@/@core/libs/boolean_search"

import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators"
import store from "@/store"
import { IQuestion } from "@/models/question"
import { CategoryModule } from "../category"
export interface IPageState {
    // package data for search
    tagPakage: any,
    // list all of question
    questions: Array<any>,
    // question results after search
    searchResults: Array<any>,
    // search word
    searchWords: Array<string>,
    // text user input
    textSearch: String,
    // selected tags
    tagSearch: Array<any>,
    // frequent asked questions
    faqQuestions: Array<any>,
    // search status (true: searching, false: end search)
    searchProcess: Boolean,
    // list tags
    tags: Array<any>
}

@Module({ dynamic: true, store, name: 'page' })
class Page extends VuexModule implements IPageState {
    // package data for search
    public tagPakage = {
        questions: [],
        questionPinnings: []
    }
    public productId = 2
    // list all of question
    public questions = []
    // question results after search
    public searchResults = []
    // search word
    public searchWords = []
    // text user input
    public textSearch = ''
    // selected tags
    public tagSearch = []
    // frequent asked questions
    public faqQuestions = []
    // search status (true: searching, false: end search)
    public searchProcess = false
    // list tags
    public tags = []

    @Mutation
    UPDATE_QUESTIONS(payload: any) {
        this.questions = payload.map((obj: any) => ({ ...obj, isSelected: false, answers: [] }))
        const obj = new analysis()
        const tagPakage = obj.analysisData(payload)
        this.tagPakage = tagPakage
    }
    @Mutation
    UPDATE_FAQ_QUESTIONS(payload: any) {
        this.faqQuestions = payload.map((obj: any) => ({ ...obj, isSelected: false, answers: [] }))
    }
    @Mutation
    UPDATE_ANSWERS(payload: any) {
        // let question = !state.searchProcess ? state.faqQuestions.find(x => x.id === payload.id) : state.searchResults.find(x => x.id === payload.id)
        const question: any = this.questions.find((x: any) => x.id === payload.id)
        if (question) {
            question.answers = payload.answers
            question.conditions = payload.conditions
        }
    }
    @Mutation
    UPDATE_ISESELECTED(payload: any) {
        if (!this.searchProcess)
            this.faqQuestions.forEach((element: any) => {
                element.isSelected = element.id === payload
            });
        else
            this.searchResults.forEach((element: any) => {
                element.isSelected = element.id === payload
            });
    }
    @Mutation
    UPDATE_SEARCH_PROCESS(payload: any) {
        this.searchProcess = payload
        if (this.searchProcess === true && (!this.textSearch || this.textSearch.length === 0)) {
            const searchResults: any = this.tagPakage.questions.map((obj: any) => ({ ...obj, isSelected: false, answers: [] }))
            this.searchResults = searchResults
        }
    } @Mutation
    UPDATE_TEXT_SEARCH(payload: any) {
        this.textSearch = payload
    }
    @Mutation
    UPDATE_QUESTIONS_FILTER(payload: any) {
        this.textSearch = payload.text
        this.searchWords = payload.words
        this.searchResults = payload.result
    }
    @Mutation
    UPDATE_TAG_FILTER(payload: any) {
        const tag: any = this.tags.find((x: any) => x.text === payload.text)
        if (tag)
            tag.isSelected = payload.isSelected
    }
    @Mutation
    UPDATE_KEYWORD(payload: any) {
        this.tags = payload.map((obj: any) => ({ text: obj.label, weight: obj.weight, isSelected: false }))
    }

    @Mutation
    UPDATE_QUESTION_PINNING(payload: any) {
        this.tagPakage.questionPinnings = payload.data.map((x: any) => ({ keyword: x.keyword, questionIds: x.promoted_results, hiddenIds: x.hidden_results }))
    }

    @Action
    //   update question lists
    updateQuestion(data: any) {
        this.UPDATE_QUESTIONS(data)
    }
    @Action
    // get detail answer
    async getDetailAnswer(model: any) {
        const { data } = await axios.get(`question/${model.questionId}/answer/${model.answerId}/`)
        return data
    }
    @Action
    // get lists answers from question id
    async getAnswerFromQuestion(id: any) {
        // let question = !context.state.searchProcess ? context.state.faqQuestions.find(x => x.id === id) : context.state.searchResults.find(x => x.id === id)
        const question: any = this.questions.find((x: any) => x.id === id)
        this.UPDATE_ISESELECTED(id)
        if (question && question.answers.length > 0)
            return question
        // const { data } = await axios.get(`question/${id}/answer/`)

        //  Get list of answer and condition
        const { data } = await axios.get(`fnt/product/${this.productId}/answer/`, {
            params: {
                question_id: id
            }
        });
        const { answer: answers, conditionList: conditions } = data.data;
        // if (data) {
        //     const answersData: any = {
        //         id,
        //         answers: []
        //     }
        //     const answers = data.data
        //     for (let index = 0; index < answers.length; index++) {
        //         const element = answers[index];
        //         const answer = await this.getDetailAnswer({
        //             questionId: id,
        //             answerId: element.id
        //         })
        //         answersData.answers.push(answer.data)
        //     }
        this.UPDATE_ANSWERS({ id, answers, conditions })

        return question
    }
    @Action
    // list faq questions
    public async getQuestions(params: any) {
        // eslint-disable-next-line no-debugger
        const { data } = await axios.get('question/', { params })
        this.UPDATE_FAQ_QUESTIONS(data)
        this.UPDATE_QUESTIONS(data)
    }
    @Action
    // change searchprocess value
    updateProcess(value: any) {
        this.UPDATE_SEARCH_PROCESS(value)
    }
    @Action
    // filter candidate question
    filterQuestions(query: any) {
        this.updateProcess(true)
        const text = query.toLowerCase().trim()
        // let search = new FullTextSearch(state.tagPakage)
        const search = new BooleanSearch(this.tagPakage)
        const slectedTags = this.tags.filter((x: any) => x.isSelected)
        const result = search.search(text, slectedTags, CategoryModule.selectedCategory?.isActive ? CategoryModule.selectedCategory.id : undefined)
        const data = {
            result: result.questions.map((obj: any) => ({ ...obj, isSelected: false, answers: [] })),
            words: result.words,
            text
        }
        this.UPDATE_QUESTIONS_FILTER(data)
        return data.result
    }
    @Action
    updateTagFilter(tag: any) {
        this.UPDATE_TAG_FILTER(tag)
        this.filterQuestions(this.textSearch)
    }

    @Action
    getQuestionFromCategory(categories: Array<number>) {
        let questionCategory: Array<IQuestion> = []
        Promise.all(categories.map((x) => axios.get('question/', { params: { product_id: [this.productId], category_id: [x] } })))
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    const questionResults = data[i]?.data?.data;
                    if (questionResults) {
                        for (let j = 0; j < questionResults.length; j++) {
                            const question = questionResults[j];
                            const questionResult = questionCategory.find((x: IQuestion) => x.id === question.id)
                            if (questionResult) {
                                questionResult.categories.push(categories[i])
                            }
                            else {
                                question.categories = [categories[i]]
                                questionCategory.push(question)
                            }
                        }
                    }
                }
                questionCategory = questionCategory.sort((a: any, b: any) => {
                    return a.id - b.id
                })
                this.UPDATE_FAQ_QUESTIONS(questionCategory)
                this.UPDATE_QUESTIONS(questionCategory)
            })
        this.getListKeyword()
        this.getQuestionPinning()
    }

    @Action
    async getListKeyword() {
        const { data } = await axios.get('keyword/')
        this.UPDATE_KEYWORD(data.data)
    }

    @Action
    async getQuestionPinning() {
        const { data } = await axios.get(`product/${this.productId}/pinned_query/question`)
        this.UPDATE_QUESTION_PINNING(data)
    }
}

export const PageModule = getModule(Page)

