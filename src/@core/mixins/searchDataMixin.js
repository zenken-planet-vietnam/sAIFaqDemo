
import { mapState } from "vuex"
export default {
    computed: {
        ...mapState({
            tags: (state) => state.page.tags,
            questions: (state) => state.page.questions,
            faqQuestions: (state) => state.page.faqQuestions,
            searchProcess: (state) => state.page.searchProcess,
            searchResults: (state) => state.page.searchResults,
            textSearch: (state) => state.page.textSearch,
            searchWords: (state) => state.page.searchWords,
            tagSearch: (state) => state.page.tagSearch
        })
    }
}