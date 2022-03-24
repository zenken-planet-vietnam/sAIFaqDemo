import {config,enquete,messages} from "@/const"
import store from "@/store"
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
export interface IConfigState {
    data: any,
    enquete:any,
    messages:any,
    isLoading: boolean
}

@Module({ name: 'config', namespaced: true })
export default class Config extends VuexModule implements IConfigState {
    public data = config
    public enquete=enquete;
    public isLoading = false;
    public messages=messages
    @Mutation
    UPDTATE_LOADING(payload: boolean) {
        this.isLoading = payload
    }

    @Action({ rawError: true })
    updateLoading(value: boolean) {
        this.UPDTATE_LOADING(value)
    }
}

//  export const ConfigModule = getModule(Config) 