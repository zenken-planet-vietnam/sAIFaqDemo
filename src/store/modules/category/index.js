/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "@axios"
const recursiveUpdate = (data, item) => {
    if (!data.childs || data.childs.length < 1) return
    if (data.id === item.id) data.isOpen = item.value
    else data.isOpen = false
    if (data.childs.length > 0) {
        data.childs.forEach(element => {
            recursiveUpdate(element, item)
        });
    }
}
export default {
    namespaced: true,
    state: {
        categories: []
    },
    getters: {

    },
    // update property in state
    mutations: {
        UPDATE_CATEGORIES(state, payload) {
            state.categories = payload
        },
        UPDTATE_OPEN_GROUP(state, payload) {
            for (let i = 0; i < state.categories.length; i++) {
                const element = state.categories[i]; recursiveUpdate(element, payload)
            }
        }
    },
    actions: {
        async getCategory(context, params) {
            const { data } = await context.dispatch('getChildCategory')
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                const child = await context.dispatch('getChildCategory', { parent_id: element.id })
                element.childs = child.data
                element.isOpen = false
            }
            context.commit("UPDATE_CATEGORIES", data)
        },
        async getChildCategory(context, params) {
            const { data } = await axios.get("category/", { params: params })
            return data
        },
        async updateGroupOpen(context, value) {
            context.commit("UPDTATE_OPEN_GROUP", value)
        }
    }
}