/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "@axios"
export default {
    namespaced: true,
    state: {
        data: null
    },
    getters: {

    },
    mutations: {
        UPDATE_ANALYTIC_DATA(state, payload) {
            state.data = payload.data
        }
    },
    actions: {
        async getOverviewData(context, params) {
            const { data } = await axios.get('analytic/abcxyz/', { params })
            context.commit('UPDATE_ANALYTIC_DATA', data)
        }
    }
}