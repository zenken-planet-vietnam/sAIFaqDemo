
import { mapState } from "vuex"
export default {
    computed: {
        ...mapState({
            overviewData: (state) => state.analytic.data,
        })
    }
}