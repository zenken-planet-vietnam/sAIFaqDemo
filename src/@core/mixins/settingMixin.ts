
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
    async promoteQuestion(item: any) {
        this.$store.state.config.isLoading = true;
        await SettingModule.addPinnedQuestionToQuery({
              queryId: this.$route.params.pinnedQueryId,
              questionId: item.id,
              pinType: 1,
        })
        this.$store.state.config.isLoading = false;
    }

    async hideQuestion(item: any) {
        this.$store.state.config.isLoading = true;
        await SettingModule.addPinnedQuestionToQuery({
              queryId: this.$route.params.pinnedQueryId,
              questionId: item.id,
              pinType: 0,
        })
        this.$store.state.config.isLoading = false;
    }

    async unpinQuestion(item: any) {
        this.$store.state.config.isLoading = true;
        await SettingModule.unpinQuestionByQuery({questionId: item.id,
          queryId:this.$route.params.pinnedQueryId})
        this.$store.state.config.isLoading = false;
    }
}