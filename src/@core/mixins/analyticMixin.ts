
import { Component, Vue } from "vue-property-decorator";
import { AnalyticModule } from '@/store/modules/analytic'
@Component({
    name: 'AnalyticMixin'
})
export default class extends Vue {
    get overviewData(): any { return AnalyticModule.data }
}