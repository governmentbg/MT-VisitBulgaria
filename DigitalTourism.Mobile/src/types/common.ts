/** Reusable {id, name, icon?} shape for tagged items (amenities, dietary options, cuisine types, etc.) */
export interface TagItem {
  id: string;
  name: string;
  icon?: string;
}

/** Working hours entry shared by Restaurant, Hotel, Activity, Event */
export interface WorkingHoursEntry {
  days: string[];
  openTime: string;
  closeTime: string;
}
