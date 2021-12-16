/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "@axios"
import { analysis } from "@core/libs/analysis"
import { FullTextSearch } from "@core/libs/search"
export default {
    namespaced: true,
    state: {
        // package data for search
        tagPakage: null,
        // list all of question
        questions: [],
        // question results after search
        searchResults: [],
        // search word
        searchWords: [],
        // text user input
        textSearch: '',
        // selected tags
        tagSearch: [],
        // frequent asked questions
        faqQuestions: [],
        // search status (true: searching, false: end search)
        searchProcess: false,
        // list tags
        tags: [
            {
                text: "ticket",
                isSelected: false
            },
            {
                text: "pay",
                isSelected: false
            }
        ]
    },
    getters: {

    },
    // update property in state
    mutations: {
        UPDATE_QUESTIONS(state, payload) {
            state.questions = payload.data.map(obj => ({ ...obj, isSelected: false, answers: [] }))
            let obj = new analysis()
            state.tagPakage = obj.analysisData(payload.data)
        },
        UPDATE_FAQ_QUESTIONS(state, payload) {
            state.faqQuestions = payload.data.map(obj => ({ ...obj, isSelected: false, answers: [] }))
        },
        UPDATE_ANSWERS(state, payload) {
            let question = !state.searchProcess ? state.faqQuestions.find(x => x.id === payload.id) : state.searchResults.find(x => x.id === payload.id)
            if (question) {
                question.answers = payload.answers
            }
        },
        UPDATE_ISESELECTED(state, payload) {
            if (!state.searchProcess)
                state.faqQuestions.forEach(element => {
                    element.isSelected = element.id === payload
                });
            else
                state.searchResults.forEach(element => {
                    element.isSelected = element.id === payload
                });
        },
        UPDATE_SEARCH_PROCESS(state, payload) {
            state.searchProcess = payload
            if (state.searchProcess === true && (!state.textSearch || state.textSearch.length === 0)) {
                state.searchResults = state.tagPakage.questions.map(obj => ({ ...obj, isSelected: false, answers: [] }))
            }
        },
        UPDATE_TEXT_SEARCH(state, payload) {
            state.textSearch = payload
        },
        UPDATE_QUESTIONS_FILTER(state, payload) {
            state.textSearch = payload
            let search = new FullTextSearch(state.tagPakage)
            let slectedTags = state.tags.filter(x => x.isSelected)
            let result = search.search(payload, slectedTags)
            state.searchResults = result.questions.map(obj => ({ ...obj, isSelected: false, answers: [] }))
            state.searchWords = result.words
        },
        UPDATE_TAG_FILTER(state, payload) {
            let tag = state.tags.find(x => x.text === payload.text)
            if (tag)
                tag.isSelected = payload.isSelected
        }
    },
    actions: {
        // update question lists
        updateQuestion(context, data) {
            context.commit("UPDATE_QUESTIONS", data)
        },
        // get detail answer
        async getDetailAnswer(context, model) {
            const { data } = await axios.get(`question/${model.questionId}/answer/${model.answerId}/`)
            return data
        },
        // get lists answers from question id
        async getAnswerFromQuestion(context, id) {
            let question = !context.state.searchProcess ? context.state.faqQuestions.find(x => x.id === id) : context.state.searchResults.find(x => x.id === id)
            context.commit("UPDATE_ISESELECTED", id)
            if (question && question.answers.length > 0)
                return
            const { data } = await axios.get(`question/${id}/answer/`)
            if (data) {
                const answersData = {
                    id,
                    answers: []
                }
                const answers = data.data
                for (let index = 0; index < answers.length; index++) {
                    const element = answers[index];
                    const answer = await context.dispatch("getDetailAnswer", {
                        questionId: id,
                        answerId: element.id
                    })
                    answersData.answers.push(answer.data)
                }
                context.commit("UPDATE_ANSWERS", answersData)
            }
        },

        // list faq questions
        async getQuestionsFaq(context) {
            const { data } = await axios.get('question/faq/')
            context.commit("UPDATE_FAQ_QUESTIONS", data)
            context.commit("UPDATE_QUESTIONS", data)
        },
        // change searchprocess value
        updateProcess(context, value) {
            context.commit("UPDATE_SEARCH_PROCESS", value)
        },
        // filter candidate question
        filterQuestions(context, query) {
            context.commit("UPDATE_QUESTIONS_FILTER", query.toLowerCase().trim())
        },
        updateTagFilter(context, tag) {
            context.commit("UPDATE_TAG_FILTER", tag)
            context.commit("UPDATE_QUESTIONS_FILTER", context.state.textSearch)
        }
    }
}