import { Component, Vue } from "vue-property-decorator";
import { PageModule } from '@/store/modules/page'
@Component({
    name: 'PageMixin'
})
export default class extends Vue {
    get tags() { return PageModule.tags }
    get questions() { return PageModule.questions }
    get faqQuestions() { return PageModule.faqQuestions }
    get searchProcess() { return PageModule.searchProcess }
    get searchResults() { return PageModule.searchResults }
    get textSearch() { return PageModule.textSearch }
    get searchWords() { return PageModule.searchWords }
    get tagSearch() { return PageModule.tagSearch }
    get config() { return this.$store.state.config.data }
}
