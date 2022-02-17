
import { Component, Vue } from "vue-property-decorator";
import { SettingModule } from '@/store/modules/setting'
@Component({
    name: 'SettingMixin'
})
export default class extends Vue {
    get pinnedQueriesData(): any { return SettingModule.data }
    get pinnedQuestionByQueryID(): any { return SettingModule.pinnedQuestion }
}