
import { Component, Vue } from "vue-property-decorator";
import { CategoryModule } from '@/store/modules/category'
@Component({
    name: 'CategoryMixin'
})
export default class extends Vue {
    get categories() { return CategoryModule.categories }
    get selectedCategory() { return CategoryModule.selectedCategory }
}