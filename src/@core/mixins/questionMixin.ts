import { Component, Vue } from "vue-property-decorator";
import { PageModule } from '@/store/modules/page'
import { CategoryModule } from '@/store/modules/category'
@Component({
    name: 'QuestionMixin'
})
export default class extends Vue {
    get searchWords() { return PageModule.searchWords }
}
