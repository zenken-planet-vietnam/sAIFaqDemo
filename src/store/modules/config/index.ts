import config from "@/const"
import store from "@/store"
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
export interface IConfigState {
    data: any,
    isLoading: boolean
}

@Module({ name: 'config', namespaced: true })
export default class Config extends VuexModule implements IConfigState {
    public data = config
    public isLoading = false;

    @Mutation
    UPDTATE_SELECTED_MENU(payload: boolean) {
        this.isLoading = payload
    }

    @Action({ rawError: true })
    updateLoading(value: boolean) {
        this.UPDTATE_SELECTED_MENU(value)
    }
}

//  export const ConfigModule = getModule(Config) 