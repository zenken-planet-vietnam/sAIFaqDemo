
import { mapState } from "vuex"
export default {
    computed: {
        ...mapState({
            categories: (state) => state.category.categories,
        })
    }
}