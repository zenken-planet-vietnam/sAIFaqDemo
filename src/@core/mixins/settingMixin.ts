
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
    set promotedQuestions(value: any) {
        this.updateQuestionOrder(value)
    }
    
    updateQuestionOrder(value: any) {
        SettingModule.updatePinnedQuestionOrder({
            queryId: this.$route.params.pinnedQueryId, value:value
        })
    }
    formatDatetime(dt: any) {
        return new Date(dt).toLocaleString()
    }
    async pinQuestion(item: any) {
        this.$store.state.config.isLoading = true;
        await SettingModule.addPinnedQuestionToQuery({
              queryId: this.$route.params.pinnedQueryId,
              questionId: item.id,
              pinType: item.pinType,
        })
        this.$store.state.config.isLoading = false;
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
    get countPromotedQuestion() {
        return this.pinnedQuestionByQueryID
            .filter((item: any) => item.pin_type).length
        }

    get countHiddenQuestion() {
        return this.pinnedQuestionByQueryID
            .filter((item: any) => !item.pin_type).length
        }

    async deleteAll(pinType: any) {
        this.$store.state.config.isLoading = true;
        await SettingModule.unpinAllQuestionsByQuery({
          queryId: this.$route.params.pinnedQueryId,
          pinType: pinType
        })
        this.$store.state.config.isLoading = false;
    }

    async cloneQuestions(targetLabel: any, pinType: any, replace: any) {
        this.$store.state.config.isLoading = true;
        await SettingModule.cloneQuestions({
            queryId: this.$route.params.pinnedQueryId,
            targetLabel: targetLabel,
            pinType: pinType,
            replace: replace
        })
        this.$store.state.config.isLoading = false;
    }

    async manualCloneQuestions(targetLabel: any,
                               replace: any,
                               promotedList: any,
                               hiddenList: any) {
        this.$store.state.config.isLoading = true;
        await SettingModule.manualCloneQuestions({
            queryId: this.$route.params.pinnedQueryId,
            targetLabel: targetLabel,
            replace: replace,
            promotedList: promotedList,
            hiddenList: hiddenList,
        })
        this.$store.state.config.isLoading = false;
    }

    async submitQuickstart(data: any) {
        this.$store.state.config.isLoading = true;
        await SettingModule.submitQuickstart(data)
        this.$store.state.config.isLoading = false;
    }
}