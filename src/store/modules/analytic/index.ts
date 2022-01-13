/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "@/axios"
import store from "@/store"
import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators"
export interface IAnalyticState {
    data: any
}

@Module({ dynamic: true, store, name: 'analytic' })
export default class Analytic extends VuexModule implements IAnalyticState {
    public data = null
    @Mutation
    private UPDATE_ANALYTIC_DATA(payload: any) {
        this.data = payload.data
    }
    @Action
    public async getOverviewData(params: any) {
        const { data } = await axios.get('analytic/abcxyz/', { params })
        this.UPDATE_ANALYTIC_DATA(data)
    }

}
export const AnalyticModule = getModule(Analytic)