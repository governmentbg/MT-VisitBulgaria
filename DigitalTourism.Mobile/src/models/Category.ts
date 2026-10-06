export enum CategoryType {
  CULTURAL = 'cultural',
  NATURE = 'nature',
  HISTORICAL = 'historical',
  RELIGIOUS = 'religious',
  ENTERTAINMENT = 'entertainment',
  FOOD = 'food',
  SHOPPING = 'shopping',
  MUSEUM = 'museum',
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string; // MaterialDesignIcons name
  color: string; // Hex color code
}
