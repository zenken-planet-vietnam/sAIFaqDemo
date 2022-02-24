
import { mapState } from "vuex"
export default {
    computed: {
        ...mapState({
            config: (state: any) => state.config.data,
            enquete:(state:any)=>state.config.enquete
        })
    }
}