
import { Component, Vue } from "vue-property-decorator";
import { SettingModule } from '@/store/modules/setting'
@Component({
    name: 'SettingMixin'
})
export default class extends Vue {
    get pinnedQueriesData(): any { return SettingModule.data }
    get pinnedQuestionByQueryID(): any { return SettingModule.pinnedQuestion }
    get hiddenQuestions(): any { return SettingModule.pinnedQuestion.filter((item: any) => !item.pin_type) }
    get promotedQuestions(): any { return SettingModule.pinnedQuestion.filter((item: any) => item.pin_type) }

    formatDatetime(dt: any) {
        return new Date(dt).toLocaleString()
      }
}