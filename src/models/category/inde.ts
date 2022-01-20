export interface ICategory {
    id: number,
    label: String,
    childs: Array<ICategory>,
    isOpen: Boolean,
    isSelected: Boolean
}