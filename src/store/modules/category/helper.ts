import { ICategory } from "@/models/category";

// recursive open menu
export function recursiveOpenMenu(data: ICategory, value: any) {
    if (data.id === value.id) return true;
    if (!data.childs || data.childs.length < 1) return false
    if (data.childs.length > 0) {
        for (let i = 0; i < data.childs.length; i++) {
            const element = data.childs[i];
            element.isOpen = recursiveOpenMenu(element, value)
            if (element.isOpen === true)
                return true
        }
    }
    return false
}

// recursive close menu
export function recursiveCloseMenu(data: Array<ICategory>, value: any) {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.id === value.id) {
            element.isOpen = false
            return
        }
        if (!element.childs || element.childs.length < 1) continue
        recursiveCloseMenu(element.childs, value)
    }
}

// recursive selected menu
export function recursiveSelectedMenu(data: Array<ICategory>, value: any) {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.childs.length > 0)
            recursiveSelectedMenu(element.childs, value)
        else {
            element.isSelected = value === element.id
        }
    }
}

// get all child category
export function getChildCategories(categories: Array<ICategory>, childCategory: Array<number>) {
    categories.forEach(element => {
        if (!element.childs || element.childs.length === 0) {
            childCategory.push(element.id)
        }
        else
            getChildCategories(element.childs, childCategory)
    });
}
