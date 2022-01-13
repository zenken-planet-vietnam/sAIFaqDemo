import config from "@/const"
import store from "@/store"
import { VuexModule, Module, getModule } from "vuex-module-decorators"
export interface IConfigState {
    data: any
}

@Module({ name: 'config', namespaced: true })
export default class Config extends VuexModule implements IConfigState {
    public data = config
}

// export const ConfigModule = getModule(Config) 