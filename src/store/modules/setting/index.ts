import axios from "@/axios"
import store from "@/store"
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators"

export interface ISettingState {
    data: any
}

@Module({ dynamic: true, store, name: 'setting' })
export default class Setting extends VuexModule implements ISettingState {
    public data = Array()
    public pinnedQuestion = Array()
    public isLoading = false
    public productId = 2

    @Mutation
    private SET_LOADING_PROGRESS(payload: any) {
        this.isLoading = payload
    }

    @Mutation
    private GET_PINNED_QUERIES_DATA(payload: any) {
        this.data = payload.data
    }

    @Mutation
    private ADD_PINNED_QUERIES_DATA(payload: any) {
        this.data.push(payload.data)
    }

    @Mutation
    private UPDATE_PINNED_QUERY_DATA(payload: any) {
        this.data = this.data.map((item: any, index: any) => {
            if (index === payload.index) {
                item = {...payload.data}
            }
            return {...item}
        })
    }

    @Mutation
    private DELETE_PINNED_QUERY_DATA(payload: any) {
        this.data = this.data.filter((item) =>  item.id !== payload.pinnedQueryId)
    }

    @Mutation
    private GET_PINNED_QUESTION_DATA(payload: any) {
        this.pinnedQuestion = payload.data
    }

    @Mutation
    private SET_PINNED_QUESTION_DATA(payload: any) {
        const hiddenQuestions = this.pinnedQuestion.filter((item: any) =>  !item.pin_type )

        let countOrder:any = 1
        this.pinnedQuestion = payload.map((item: any, index: any) => {
            if (item.pin_type) {
                const question = {...item, order: countOrder, display_order: countOrder}
                countOrder++;
                return question;
            } else {
                return {...item}
            }
        })
        this.pinnedQuestion = [...this.pinnedQuestion, ...hiddenQuestions]
    }

    @Mutation
    private UNPIN_QUESTION_DATA(payload: any) {
        const questionId = payload.questionId
        this.pinnedQuestion = this.pinnedQuestion.filter((item: any) => item.id !== questionId)

        let countOrder:any = 1
        this.pinnedQuestion = this.pinnedQuestion.map((item: any, index: any) => {
            if (item.pin_type) {
                const question = {...item, order: countOrder, display_order: countOrder}
                countOrder++;
                return question;
            } else {
                return {...item}
            }
        })
    }

    @Mutation
    private ADD_PINNED_QUESTION_DATA(payload: any) {
        this.pinnedQuestion.push(payload)
        let countOrder: any = 1
        this.pinnedQuestion = this.pinnedQuestion.map((item: any, index: any) => {
            if (item.pin_type) {
                const question = {...item, order: countOrder, display_order: countOrder}
                countOrder++;
                return question;
            }
            return {...item}
        })
    }

    @Mutation
    private UNPIN_ALL_QUESTION_DATA(payload: any) {
        this.pinnedQuestion = this.pinnedQuestion.filter((item: any) => item.pin_type != payload.pinType )
    }

    @Action
    public async getPinnedQueries(params: any) {
        const { data } = await axios.get('/pinned_query/', { params: { product_id: this.productId}})
        this.GET_PINNED_QUERIES_DATA(data)
    }
    
    @Action
    public addPinnedQuery(params: any) {
        axios.post('pinned_query/',  {...params, product_id: this.productId})
            .then(response => {
                this.ADD_PINNED_QUERIES_DATA(response.data)
            })
            .catch(err => {
            })
    }

    @Action
    public updatePinnedQuery(params: any) {
        axios.put(`pinned_query/${params.pinnedQueryId}`,  params.payload)
            .then(response => {
                this.UPDATE_PINNED_QUERY_DATA({data: response.data.data, index:params.index})
            })
    }

    @Action
    public async deletePinnedQuery(params: any) {
        const { data } = await axios.delete(`pinned_query/${params.pinnedQueryId}`)
        this.DELETE_PINNED_QUERY_DATA(params)
    }

    @Action
    public async getPinnedQuestionByQuery(params: any) {
        const { data } = await axios.get(`pinned_query/${params}/question`, {
            params: {product_id: this.productId}})
        this.GET_PINNED_QUESTION_DATA(data)
    }

    @Action
    public updatePinnedQuestionOrder(params: any) {
        //create array-like question_id
        const arrayQuestionId = params.value.map((item: any, index: any) => {
            return item.id
        })
        axios.put(`pinned_query/${params.queryId}/question`,
            {question_order: arrayQuestionId})

        this.SET_PINNED_QUESTION_DATA(params.value)
    }

    @Action
    public async addPinnedQuestionToQuery(params: any) {
        axios.post(`pinned_query/${params.queryId}/question`,
            {question_id: params.questionId, pin_type: params.pinType})
            .then((response => {
                this.ADD_PINNED_QUESTION_DATA(response.data.data)
            }))
            .catch((error) =>{
                console.log("ERROR")
            })
    }

    @Action
    public async unpinQuestionByQuery(params: any) {
        const { data } = await axios.post(`pinned_query/${params.queryId}/question/delete`,
            {question_id: params.questionId,})

        this.UNPIN_QUESTION_DATA(params)
    }

    @Action
    public async unpinAllQuestionsByQuery(params: any) {
        const { data } = await axios.post(`pinned_query/${params.queryId}/question/unpin`, {pin_type: params.pinType})

        this.UNPIN_ALL_QUESTION_DATA(params)
    }

}
export const SettingModule = getModule(Setting)