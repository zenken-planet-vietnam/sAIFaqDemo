/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "@/axios"
import { analysis } from "@/@core/libs/analysis"
import { FullTextSearch } from "@/@core/libs/search"
import { BooleanSearch } from "@/@core/libs/boolean_search"

import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators"
import store from "@/store"
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
        questions: []
    }
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
    public tags = [
        {
            text: "ticket",
            isSelected: false
        },
        {
            text: "pay",
            isSelected: false
        }
    ]

    @Mutation
    UPDATE_QUESTIONS(payload: any) {
        this.questions = payload.data.map((obj: any) => ({ ...obj, isSelected: false, answers: [] }))
        const obj = new analysis()
        this.tagPakage = obj.analysisData(payload.data)
    }
    @Mutation
    UPDATE_FAQ_QUESTIONS(payload: any) {
        this.faqQuestions = payload.data.map((obj: any) => ({ ...obj, isSelected: false, answers: [] }))
    }
    @Mutation
    UPDATE_ANSWERS(payload: any) {
        // let question = !state.searchProcess ? state.faqQuestions.find(x => x.id === payload.id) : state.searchResults.find(x => x.id === payload.id)
        const question: any = this.questions.find((x: any) => x.id === payload.id)
        if (question) {
            question.answers = payload.answers
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
        const tag = this.tags.find(x => x.text === payload.text)
        if (tag)
            tag.isSelected = payload.isSelected
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
        const { data } = await axios.get(`question/${id}/answer/`)
        if (data) {
            const answersData: any = {
                id,
                answers: []
            }
            const answers = data.data
            for (let index = 0; index < answers.length; index++) {
                const element = answers[index];
                const answer = await this.getDetailAnswer({
                    questionId: id,
                    answerId: element.id
                })
                answersData.answers.push(answer.data)
            }
            this.UPDATE_ANSWERS(answersData)
        }
        return question
    }
    @Action
    // list faq questions
    public async getQuestionsFaq() {
        // eslint-disable-next-line no-debugger
        const { data } = await axios.get('question/faq/')
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
        const text = query.toLowerCase().trim()
        // let search = new FullTextSearch(state.tagPakage)
        const search = new BooleanSearch(this.tagPakage)
        const slectedTags = this.tags.filter(x => x.isSelected)
        const result = search.search(text, slectedTags)
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
}

export const PageModule = getModule(Page)

