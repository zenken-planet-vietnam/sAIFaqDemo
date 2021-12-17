/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "@axios"
// recursive open menu
const recursiveOpenMenu = (data, value) => {
    if (data.id === value.id) return true;
    if (!data.childs || data.childs.length < 1) return false
    if (data.childs.length > 0) {
        for (let i = 0; i < data.childs.length; i++) {
            const element = data.childs[i];
            element.isOpen = recursiveOpenMenu(element, value)
            if (element.isOpen === true)
                return true
        }
    }
    return false
}
// recursive close menu
const recursiveCloseMenu = (data, value) => {
    if (data.id === value.id) {
        data.isOpen = false
        return
    }
    if (!data.childs || data.childs.length < 1) return
    for (let i = 0; i < data.childs.length; i++) {
        const element = data.childs[i];
        if (element.isOpen === true) {
            recursiveCloseMenu(element, value)
        }
    }
}
// no using
// const createMultilevel = (data) => {
//     let root = data.filter(x => x.parent_id === null)
//     let childs = data.filter(x => x.parent_id !== null)
//     debugger
//     root.forEach(element => {
//         recursiveGetMultiLevelMenu(element, childs)
//     });
//     debugger
//     return root
// }
// const recursiveGetMultiLevelMenu = (item, data) => {
//     item.childs = []
//     item.isOpen = false
//     for (let i = 0; i < data.length; i++) {
//         const element = data[i];
//         if (element.parent_id === item.id) {
//             item.childs.push(element)
//             data.splice(i, 1)
//             i--
//         }
//     }
//     if (item.childs.length > 0) {
//         item.childs.forEach(element => {
//             recursiveGetMultiLevelMenu(element, childs)
//         });
//     }
// }

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
            state.categories = payload.data
        },
        UPDTATE_OPEN_GROUP(state, payload) {
            // open menu
            if (payload.value === true) {
                for (let i = 0; i < state.categories.length; i++) {
                    const element = state.categories[i];
                    element.isOpen = recursiveOpenMenu(element, payload)
                }
            }
            // close menu
            else {
                for (let i = 0; i < state.categories.length; i++) {
                    const element = state.categories[i];
                    if (element.isOpen === true)
                        recursiveCloseMenu(element, payload)
                }
            }

        }
    },
    actions: {
        async getCategory(context, params) {
            const { data } = await axios.get("category/")
            // createMultilevel(data.data)
            await context.dispatch('recursivrGetCategory', data.data)
            context.commit("UPDATE_CATEGORIES", data)
        },
        async recursivrGetCategory(context, data) {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const child = await context.dispatch('getChildCategory', { parent_id: element.id })
                    element.childs = child.data
                    element.isOpen = false
                    if (element.childs.length > 0)
                        context.dispatch('recursivrGetCategory', element.childs)
                }
            }
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