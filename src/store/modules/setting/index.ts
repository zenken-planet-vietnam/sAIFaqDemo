import axios from "@/axios"
import store from "@/store"
import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators"
export interface ISettingState {
    data: any
}

@Module({ dynamic: true, store, name: 'setting' })
export default class Setting extends VuexModule implements ISettingState {
    public data = null
    public pinnedQuestion = []

    @Mutation
    private UPDATE_SETTING_DATA(payload: any) {
        this.data = payload.data
    }

    @Mutation
    private UPDATE_PINNED_QUESTION_DATA(payload: any) {
        this.pinnedQuestion = payload.data
    }

    @Mutation
    private SET_PINNED_QUESTION_DATA(payload: any) {
        const newList = payload.map((item:any, index:any) => {
            // item.display_order = index + 1
            return { ...item, order: index + 1,display_order:index+1 };
          })
        console.log(newList)
        this.pinnedQuestion = newList
    }

    @Action
    public async getPinnedQueries(params: any) {
        const { data } = await axios.get('product/2/pinned_query/', { params })
        this.UPDATE_SETTING_DATA(data)
    }

    @Action
    public async getPinnedQuestionByQuery(queryItem: any, params: any) {
        const { data } = await axios.get(`product/2/pinned_query/${queryItem.id}`, { params })
        this.UPDATE_PINNED_QUESTION_DATA(data)
    }

    @Action
    public setPinnedQuestionList(payload: any) {
        //create array-like question_id
        const arrayQuestionId = payload.value.map((item: any, index: any) => {
            return item.question_id
        })
        axios.put(`product/2/pinned_query/${payload.queryItem.id}/order`,
            {question_order: arrayQuestionId})

        this.SET_PINNED_QUESTION_DATA(payload.value)
    }
}
export const SettingModule = getModule(Setting)