import type { LocalizedLabel } from '../types'

/**
 * Experience-specific field labels
 */
export const experienceLabels: Record<string, LocalizedLabel> = {
  type: { en: 'Type', bg: 'Тип' },
  gallery: { en: 'Gallery', bg: 'Галерия' },
  relatedExperiences: { en: 'Related Experiences', bg: 'Свързани преживявания' },
  // Visitor information fields
  workingHours: { en: 'Working Hours', bg: 'Работно време' },
  howToGetThere: { en: 'How to Get There', bg: 'Как да стигнете' },
  practicalInfo: { en: 'Practical Information', bg: 'Практическа информация' },
  infoCenter: { en: 'Information Center', bg: 'Информационен център' },
  contactInfo: { en: 'Contact Information', bg: 'Информация за контакт' },
  // Media fields
  videos: { en: 'Videos', bg: 'Видеа' },
  videoTitle: { en: 'Video Title', bg: 'Заглавие на видео' },
  videoUrl: { en: 'Video URL', bg: 'URL на видео' },
  brochures: { en: 'Brochures', bg: 'Брошури' },
  brochureTitle: { en: 'Brochure Title', bg: 'Заглавие на брошура' },
  brochureFile: { en: 'Brochure File', bg: 'Файл на брошура' },
  addImage: { en: 'Add Image', bg: 'Добави изображение' },
}

/**
 * Location field labels
 */
export const locationLabels: Record<string, LocalizedLabel> = {
  location: { en: 'Location', bg: 'Местоположение' },
  address: { en: 'Address', bg: 'Адрес' },
  city: { en: 'City', bg: 'Град' },
  region: { en: 'Region', bg: 'Регион' },
  coordinates: { en: 'Coordinates', bg: 'Координати' },
  latitude: { en: 'Latitude', bg: 'Географска ширина' },
  longitude: { en: 'Longitude', bg: 'Географска дължина' },
  mapPicker: { en: 'Map Picker', bg: 'Избор на карта' },
}

/**
 * MapPicker component labels
 */
export const mapPickerLabels: Record<string, LocalizedLabel> = {
  searchPlaceholder: { en: 'Search for an address...', bg: 'Търсене на адрес...' },
  centerMap: { en: 'Center', bg: 'Центрирай' },
  resetPosition: { en: 'Reset', bg: 'Нулирай' },
  searchError: { en: 'Address search failed', bg: 'Търсенето на адрес не успя' },
  noResults: { en: 'No results found', bg: 'Няма намерени резултати' },
}

/**
 * Contact field labels
 */
export const contactLabels: Record<string, LocalizedLabel> = {
  contact: { en: 'Contact', bg: 'Контакт' },
  phone: { en: 'Phone', bg: 'Телефон' },
  email: { en: 'Email', bg: 'Имейл' },
  website: { en: 'Website', bg: 'Уебсайт' },
}

/**
 * Hotel-specific field labels
 */
export const hotelLabels: Record<string, LocalizedLabel> = {
  starRating: { en: 'Star Rating', bg: 'Звезден рейтинг' },
  rooms: { en: 'Rooms', bg: 'Стаи' },
  amenities: { en: 'Amenities', bg: 'Удобства' },
  checkInTime: { en: 'Check-in Time', bg: 'Час за настаняване' },
  checkOutTime: { en: 'Check-out Time', bg: 'Час за напускане' },
  bookingUrl: { en: 'Booking URL', bg: 'URL за резервация' },
}

/**
 * Hotel field descriptions
 */
export const hotelDescriptions: Record<string, LocalizedLabel> = {
  rooms: { en: 'Total number of rooms available', bg: 'Общ брой налични стаи' },
  checkInTime: { en: 'Standard check-in time (e.g., 15:00)', bg: 'Стандартен час за настаняване (напр. 15:00)' },
  checkOutTime: { en: 'Standard check-out time (e.g., 11:00)', bg: 'Стандартен час за напускане (напр. 11:00)' },
  bookingUrl: { en: 'Direct booking link', bg: 'Линк за директна резервация' },
}

/**
 * Restaurant-specific field labels
 */
export const restaurantLabels: Record<string, LocalizedLabel> = {
  cuisineType: { en: 'Cuisine Type', bg: 'Вид кухня' },
  dietaryOptions: { en: 'Dietary Options', bg: 'Диетични опции' },
  restaurantHours: { en: 'Opening Hours', bg: 'Работно време' },
  menuUrl: { en: 'Menu URL', bg: 'URL на менюто' },
  reservationUrl: { en: 'Reservation URL', bg: 'URL за резервация' },
  days: { en: 'Days', bg: 'Дни' },
  openTime: { en: 'Open Time', bg: 'Час на отваряне' },
  closeTime: { en: 'Close Time', bg: 'Час на затваряне' },
}

/**
 * Restaurant field descriptions
 */
export const restaurantDescriptions: Record<string, LocalizedLabel> = {
  restaurantHours: { en: 'Restaurant operating hours by day', bg: 'Работно време на ресторанта по дни' },
  menuUrl: { en: 'Link to online menu', bg: 'Линк към онлайн меню' },
  reservationUrl: { en: 'Link to reservation system', bg: 'Линк към система за резервации' },
}

/**
 * Activity-specific field labels
 */
export const activityLabels: Record<string, LocalizedLabel> = {
  duration: { en: 'Duration', bg: 'Продължителност' },
  difficultyLevel: { en: 'Difficulty Level', bg: 'Ниво на трудност' },
  seasonality: { en: 'Seasonality', bg: 'Сезонност' },
  minimumAge: { en: 'Minimum Age', bg: 'Минимална възраст' },
  groupSize: { en: 'Group Size', bg: 'Размер на групата' },
  min: { en: 'Minimum', bg: 'Минимум' },
  max: { en: 'Maximum', bg: 'Максимум' },
  equipmentProvided: { en: 'Equipment Provided', bg: 'Осигурено оборудване' },
  whatToBring: { en: 'What to Bring', bg: 'Какво да носите' },
  includes: { en: 'Includes', bg: 'Включва' },
  item: { en: 'Item', bg: 'Артикул' },
}

/**
 * Activity field descriptions
 */
export const activityDescriptions: Record<string, LocalizedLabel> = {
  duration: { en: 'Typical duration of the activity', bg: 'Типична продължителност на дейността' },
  seasonality: { en: 'Best seasons for this activity', bg: 'Най-добри сезони за тази дейност' },
  minimumAge: { en: 'Minimum age requirement (years)', bg: 'Минимална възраст (години)' },
  groupSizeMin: { en: 'Minimum group size', bg: 'Минимален размер на групата' },
  groupSizeMax: { en: 'Maximum group size', bg: 'Максимален размер на групата' },
  equipmentProvided: { en: 'Is equipment provided for participants?', bg: 'Осигурено ли е оборудване за участниците?' },
  whatToBring: { en: 'List of items participants should bring', bg: 'Списък с неща, които участниците трябва да носят' },
  includes: { en: "What's included in the activity", bg: 'Какво е включено в дейността' },
}

/**
 * Attraction-specific field labels
 */
export const attractionLabels: Record<string, LocalizedLabel> = {
  visitDuration: { en: 'Visit Duration', bg: 'Продължителност на посещение' },
  attractionHours: { en: 'Opening Hours', bg: 'Работно време' },
}

/**
 * Attraction field descriptions
 */
export const attractionDescriptions: Record<string, LocalizedLabel> = {
  visitDuration: { en: 'Average visit duration in minutes', bg: 'Средна продължителност на посещението в минути' },
  attractionHours: { en: 'Opening hours description', bg: 'Описание на работното време' },
}

/**
 * Event-specific field labels
 */
export const eventLabels: Record<string, LocalizedLabel> = {
  period: { en: 'Period', bg: 'Период' },
  startDate: { en: 'Start Date', bg: 'Начална дата' },
  endDate: { en: 'End Date', bg: 'Крайна дата' },
  allDay: { en: 'All Day Event', bg: 'Целодневно събитие' },
  organizer: { en: 'Organizer', bg: 'Организатор' },
  registrationUrl: { en: 'Registration URL', bg: 'URL за регистрация' },
  subtitle: { en: 'Subtitle', bg: 'Подзаглавие' },
  duration: { en: 'Duration', bg: 'Продължителност' },
  ticketPriceLabel: { en: 'Ticket Price Label', bg: 'Етикет за цена на билет' },
  organizerDescription: { en: 'Organizer Description', bg: 'Описание на организатора' },
  organizerHighlights: { en: 'Organizer Highlights', bg: 'Акценти на организатора' },
}

/**
 * Event field descriptions
 */
export const eventDescriptions: Record<string, LocalizedLabel> = {
  startDate: { en: 'Event start date and time', bg: 'Начална дата и час на събитието' },
  endDate: { en: 'Event end date and time', bg: 'Крайна дата и час на събитието' },
  allDay: { en: 'Check if the event runs all day (no specific start/end times)', bg: 'Отбележете, ако събитието е целодневно (без конкретни часове)' },
  organizer: { en: 'Event organizer name', bg: 'Име на организатора на събитието' },
  registrationUrl: { en: 'Event registration or ticket purchase link', bg: 'Линк за регистрация или закупуване на билети' },
  subtitle: { en: 'Short subtitle shown in the hero section', bg: 'Кратко подзаглавие в секцията на героя' },
  duration: { en: 'Display text for event duration (e.g. "4 hours")', bg: 'Текст за продължителност на събитието (напр. "4 часа")' },
  ticketPriceLabel: { en: 'Display text for ticket price (e.g. "Starting from 30€" or "Free")', bg: 'Текст за цена на билет (напр. "Стартират от 30€" или "Безплатно")' },
  organizerDescription: { en: 'Detailed description of the event organizer', bg: 'Подробно описание на организатора на събитието' },
  organizerHighlights: { en: 'Gallery images showcasing the organizer', bg: 'Галерия с изображения, представящи организатора' },
}

/**
 * Cuisine type options (for restaurants)
 */
export const cuisineTypeOptions = [
  { label: { en: 'Italian', bg: 'Италианска' }, value: 'italian' },
  { label: { en: 'French', bg: 'Френска' }, value: 'french' },
  { label: { en: 'Chinese', bg: 'Китайска' }, value: 'chinese' },
  { label: { en: 'Japanese', bg: 'Японска' }, value: 'japanese' },
  { label: { en: 'Mexican', bg: 'Мексиканска' }, value: 'mexican' },
  { label: { en: 'Indian', bg: 'Индийска' }, value: 'indian' },
  { label: { en: 'Thai', bg: 'Тайландска' }, value: 'thai' },
  { label: { en: 'Mediterranean', bg: 'Средиземноморска' }, value: 'mediterranean' },
  { label: { en: 'American', bg: 'Американска' }, value: 'american' },
  { label: { en: 'Seafood', bg: 'Морски дарове' }, value: 'seafood' },
  { label: { en: 'Steakhouse', bg: 'Стейкхаус' }, value: 'steakhouse' },
  { label: { en: 'Vegetarian', bg: 'Вегетарианска' }, value: 'vegetarian' },
  { label: { en: 'Vegan', bg: 'Веган' }, value: 'vegan' },
  { label: { en: 'Fusion', bg: 'Фюжън' }, value: 'fusion' },
  { label: { en: 'Local', bg: 'Местна' }, value: 'local' },
]

/**
 * Dietary options (extended for restaurants)
 */
export const restaurantDietaryOptions = [
  { label: { en: 'Vegetarian', bg: 'Вегетарианско' }, value: 'vegetarian' },
  { label: { en: 'Vegan', bg: 'Веган' }, value: 'vegan' },
  { label: { en: 'Gluten-Free', bg: 'Без глутен' }, value: 'glutenFree' },
  { label: { en: 'Halal', bg: 'Халал' }, value: 'halal' },
  { label: { en: 'Kosher', bg: 'Кошер' }, value: 'kosher' },
  { label: { en: 'Dairy-Free', bg: 'Без млечни продукти' }, value: 'dairyFree' },
  { label: { en: 'Nut-Free', bg: 'Без ядки' }, value: 'nutFree' },
]

/**
 * Day options (for restaurant hours)
 */
export const dayOptions = [
  { label: { en: 'Monday', bg: 'Понеделник' }, value: 'monday' },
  { label: { en: 'Tuesday', bg: 'Вторник' }, value: 'tuesday' },
  { label: { en: 'Wednesday', bg: 'Сряда' }, value: 'wednesday' },
  { label: { en: 'Thursday', bg: 'Четвъртък' }, value: 'thursday' },
  { label: { en: 'Friday', bg: 'Петък' }, value: 'friday' },
  { label: { en: 'Saturday', bg: 'Събота' }, value: 'saturday' },
  { label: { en: 'Sunday', bg: 'Неделя' }, value: 'sunday' },
]
