/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "@axios"
const overviewData = {
    pageview: Number,
    pagehit: Number,
    query: {
        total_queries: 1234,
        total_queries_no_results: 100,
        top_queries: [
            { id: 1, query: "ticket", count_query: 10 },
            { id: 2, query: "pay", count_query: 20 },
        ],
        recent_queries: [
            { id: 1, query: "ticket", count_result: 10 },
            { id: 2, query: "pay", count_result: 20 },
            { id: 1, query: "ticket", count_result: 10 },
            { id: 2, query: "pay", count_result: 20 },
        ],
        queries_per_day: [15, 20, 5, 7, 9, 2, 6],
        queries_no_result_per_day: [4, 5, 6, 7, 9, 3, 10],
    },
    click: {
        question_click: {
            total_click: 50,
            top_clicks: [
                {
                    id: 1,
                    clicked_id: 1,
                    clicked_text: "What is the ticket?",
                    count_click: 10,
                },
                {
                    id: 2,
                    clicked_id: 2,
                    clicked_text: "How would you like to pay?",
                    count_click: 5,
                },
                {
                    id: 2,
                    clicked_id: 2,
                    clicked_text: "How would you like to pay?",
                    count_click: 5,
                },
                {
                    id: 2,
                    clicked_id: 2,
                    clicked_text: "How would you like to pay?",
                    count_click: 5,
                },
                {
                    id: 1,
                    clicked_id: 1,
                    clicked_text: "What is the ticket?",
                    count_click: 10,
                },
                {
                    id: 2,
                    clicked_id: 2,
                    clicked_text: "How would you like to pay?",
                    count_click: 5,
                },
                {
                    id: 2,
                    clicked_id: 2,
                    clicked_text: "How would you like to pay?",
                    count_click: 5,
                },
                {
                    id: 2,
                    clicked_id: 2,
                    clicked_text: "How would you like to pay?",
                    count_click: 5,
                },
                {
                    id: 1,
                    clicked_id: 1,
                    clicked_text: "What is the ticket?",
                    count_click: 10,
                },
                {
                    id: 2,
                    clicked_id: 2,
                    clicked_text: "How would you like to pay?",
                    count_click: 5,
                },
                {
                    id: 2,
                    clicked_id: 2,
                    clicked_text: "How would you like to pay?",
                    count_click: 5,
                },
                {
                    id: 2,
                    clicked_id: 2,
                    clicked_text: "How would you like to pay?",
                    count_click: 5,
                },
            ],
            click_per_day: [5, 9, 12, 15, 7, 8, 5],
        },
        answer_click: {
            total_click: Number,
            // top_clicks: [
            //   { id, clicked_id, clicked_text, count_click },
            //   { id, clicked_id, clicked_text, count_click },
            // ],
            // click_per_day: [Number, Number],
        },
    },
}
export default {
    namespaced: true,
    state: {
        data: null
    },
    getters: {

    },
    mutations: {
        UPDATE_ANALYTIC_DATA(state, payload) {
            state.data = payload
        }
    },
    actions: {
        async getOverviewData(context) {
            context.commit('UPDATE_ANALYTIC_DATA', overviewData)
        }
    }
}