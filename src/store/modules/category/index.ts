/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "@/axios"
import { ICategory } from "@/models/category/inde"
import store from "@/store"
import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators"
import { recursiveCloseMenu, recursiveOpenMenu, recursiveSelectedMenu } from './helper'
export interface ICategoryState {
    categories: Array<ICategory>
}


@Module({ dynamic: true, store, name: 'category' })
class Category extends VuexModule implements ICategoryState {
    public categories = []
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
    UPDTATE_SELECTED_MENU(payload: any) {
        recursiveSelectedMenu(this.categories, payload)
    }
    @Action
    public async getCategory() {
        const { data } = await axios.get("category/")
        // createMultilevel(data.data)
        await this.recursiveGetCategory(data.data)
        this.UPDATE_CATEGORIES(data)
    }
    @Action
    //  recursive get child category
    async recursiveGetCategory(categories: any) {
        if (categories.length > 0) {
            for (let i = 0; i < categories.length; i++) {
                const element = categories[i];
                const child = await this.getChildCategory({ parent_id: element.id })
                element.childs = child.data
                element.isOpen = false
                if (element.childs.length > 0) {
                    await this.recursiveGetCategory(element.childs)
                }
                else element.isSelected = false
            }
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
    selectedCategory(id: any) {
        this.UPDTATE_SELECTED_MENU(id)
    }

}
export const CategoryModule = getModule(Category)



