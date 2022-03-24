/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "@/axios"
import { ICategory } from "@/models/category"
import store from "@/store"
import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators"
import { recursiveCloseMenu, recursiveOpenMenu, recursiveSelectedMenu, getChildCategories } from './helper'
import { PageModule } from "../page"
export interface ICategoryState {
    categories: Array<ICategory>,
    selectedCategory: any
}

export interface ISelectedCategory extends ICategory {
    isActive: Boolean
}

@Module({ dynamic: true, store, name: 'category' })
class Category extends VuexModule implements ICategoryState {
    public categories = []
    public selectedCategory = null as any
    @Mutation
    UPDATE_CATEGORIES(payload: any) {
        this.categories = payload.data
    }
    @Mutation
    UPDTATE_OPEN_GROUP(payload: any) {
        // open menu
        if (payload.value === true) {
            for (let i = 0; i < this.categories.length; i++) {
                const element: any = this.categories[i];
                element.isOpen = recursiveOpenMenu(element, payload)
            }
        }
        // close menu
        else {
            recursiveCloseMenu(this.categories, payload)
        }

    }
    @Mutation
    UPDTATE_SELECTED_MENU(payload: ICategory) {
        this.selectedCategory = {
            id: payload.id,
            texts: payload.texts,
            isActive: true
        }
        PageModule.updateProcess(true);
        PageModule.filterQuestions(PageModule.textSearch && PageModule.textSearch.length > 0 ? PageModule.textSearch : "")
    }

    @Mutation
    UNACTIVE_SELECTED_MENU() {
        this.selectedCategory.isActive = false
        PageModule.updateProcess(true);
        PageModule.filterQuestions(PageModule.textSearch && PageModule.textSearch.length > 0 ? PageModule.textSearch : "")
    }
    @Action
    public async getCategory() {
        const { data }: any = await axios.get("category/")
        for (let i = 0; i < data.data.length; i++) {
            const element = data.data[i];
            element.texts = [element.label]
            await this.recursiveGetCategory({
                category: element,
                rootId: element.id
            })
        }
        this.UPDATE_CATEGORIES(data)
        const childCategories: Array<ICategory> = []
        getChildCategories(data.data, childCategories)
        await PageModule.getQuestionFromCategory(childCategories)
    }

    @Action
    //  recursive get child category
    async recursiveGetCategory(data: any) {
        const child = await this.getChildCategory({ parent_id: data.category.id })
        data.category.childs = child.data
        data.category.isOpen = false
        if (data.category.childs && data.category.childs.length > 0) {
            for (let i = 0; i < data.category.childs.length; i++) {
                const element = data.category.childs[i];
                element.texts = [...data.category.texts, element.label]
                await this.recursiveGetCategory({
                    category: element,
                    rootId: data.rootId
                })
            }
        }
        else {
            data.category.isSelected = false
            data.category.rootId = data.category.id !== data.rootId ? data.rootId : null
        }
    }
    @Action
    // get child category
    async getChildCategory(params: any) {
        const { data } = await axios.get("category/", { params: params })
        return data
    }
    @Action
    // update open navbar group
    updateGroupOpen(value: any) {
        this.UPDTATE_OPEN_GROUP(value)
    }
    @Action
    // update seleted navbar link
    updateSelectedCategory(category: ICategory) {
        this.UPDTATE_SELECTED_MENU(category)
    }

    @Action
    unActiveSelectedMenu() {
        this.UNACTIVE_SELECTED_MENU()
    }
}
export const CategoryModule = getModule(Category)



