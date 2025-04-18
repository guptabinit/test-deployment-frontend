export interface DietaryType {
  vegetarian?: boolean
  vegan?: boolean
  glutenFree?: boolean
}

export interface NutritionalInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Allergen {
  name: string
  icon: string
}

export interface MenuItem {
  title: string
  description: string
  price: number
  nutritionalInfo: NutritionalInfo
  weight?: number
  images?: string[]
  allergens?: Allergen[]
  dietaryInfo: DietaryType
  origin?: string
  relatedItems?: string[]
  isSpecial?: boolean
}

export interface Category {
  name: string
  items: MenuItem[]
}

export interface Menu {
  name: string
  time: string
  categories: Category[]
}

export interface DiningData {
  title: string
  menus: Menu[]
}

