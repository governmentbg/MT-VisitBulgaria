import type { LocalizedSelectOption } from './types'

/**
 * Experience type options
 */
export const experienceTypeOptions: LocalizedSelectOption[] = [
  { label: { en: 'Hotel', bg: 'Хотел' }, value: 'hotel' },
  { label: { en: 'Restaurant', bg: 'Ресторант' }, value: 'restaurant' },
  { label: { en: 'Activity', bg: 'Дейност' }, value: 'activity' },
  { label: { en: 'Attraction', bg: 'Атракция' }, value: 'attraction' },
  { label: { en: 'Event', bg: 'Събитие' }, value: 'event' },
]

/**
 * Star rating options (for hotels)
 */
export const starRatingOptions: LocalizedSelectOption[] = [
  { label: { en: '1 Star', bg: '1 Звезда' }, value: '1' },
  { label: { en: '2 Stars', bg: '2 Звезди' }, value: '2' },
  { label: { en: '3 Stars', bg: '3 Звезди' }, value: '3' },
  { label: { en: '4 Stars', bg: '4 Звезди' }, value: '4' },
  { label: { en: '5 Stars', bg: '5 Звезди' }, value: '5' },
]

/**
 * Amenities options (for hotels)
 */
export const amenitiesOptions: LocalizedSelectOption[] = [
  { label: { en: 'Free Wi-Fi', bg: 'Безплатен Wi-Fi' }, value: 'wifi' },
  { label: { en: 'Parking', bg: 'Паркинг' }, value: 'parking' },
  { label: { en: 'Pool', bg: 'Басейн' }, value: 'pool' },
  { label: { en: 'Gym', bg: 'Фитнес' }, value: 'gym' },
  { label: { en: 'Spa', bg: 'СПА' }, value: 'spa' },
  { label: { en: 'Restaurant', bg: 'Ресторант' }, value: 'restaurant' },
  { label: { en: 'Bar', bg: 'Бар' }, value: 'bar' },
  { label: { en: 'Room Service', bg: 'Рум сервиз' }, value: 'roomService' },
  { label: { en: 'Conference Rooms', bg: 'Конферентни зали' }, value: 'conferenceRooms' },
  { label: { en: 'Pet Friendly', bg: 'Домашни любимци' }, value: 'petFriendly' },
  { label: { en: 'Air Conditioning', bg: 'Климатик' }, value: 'airConditioning' },
  { label: { en: 'Laundry Service', bg: 'Пране' }, value: 'laundryService' },
  { label: { en: 'Airport Shuttle', bg: 'Трансфер от летище' }, value: 'airportShuttle' },
  { label: { en: '24/7 Reception', bg: 'Денонощна рецепция' }, value: 'reception24h' },
]

/**
 * Difficulty level options (for activities)
 */
export const difficultyOptions: LocalizedSelectOption[] = [
  { label: { en: 'Easy', bg: 'Лесно' }, value: 'easy' },
  { label: { en: 'Moderate', bg: 'Умерено' }, value: 'moderate' },
  { label: { en: 'Challenging', bg: 'Предизвикателно' }, value: 'challenging' },
  { label: { en: 'Difficult', bg: 'Трудно' }, value: 'difficult' },
  { label: { en: 'Expert', bg: 'Експертно' }, value: 'expert' },
]

/**
 * Season options (for activities)
 */
export const seasonOptions: LocalizedSelectOption[] = [
  { label: { en: 'Spring', bg: 'Пролет' }, value: 'spring' },
  { label: { en: 'Summer', bg: 'Лято' }, value: 'summer' },
  { label: { en: 'Fall', bg: 'Есен' }, value: 'fall' },
  { label: { en: 'Winter', bg: 'Зима' }, value: 'winter' },
  { label: { en: 'Year-round', bg: 'Целогодишно' }, value: 'yearRound' },
]

/**
 * User role options
 */
export const userRoleOptions: LocalizedSelectOption[] = [
  { label: { en: 'Administrator', bg: 'Администратор' }, value: 'admin' },
  { label: { en: 'Business Owner', bg: 'Бизнес собственик' }, value: 'business-owner' },
  { label: { en: 'Municipal Moderator', bg: 'Общински модератор' }, value: 'municipal-moderator' },
  { label: { en: 'Tourism Curator', bg: 'Туристически куратор' }, value: 'tourism-curator' },
]

/**
 * Dietary options (for restaurants)
 */
export const dietaryOptions: LocalizedSelectOption[] = [
  { label: { en: 'Vegetarian', bg: 'Вегетарианско' }, value: 'vegetarian' },
  { label: { en: 'Vegan', bg: 'Веган' }, value: 'vegan' },
  { label: { en: 'Gluten-Free', bg: 'Без глутен' }, value: 'glutenFree' },
  { label: { en: 'Halal', bg: 'Халал' }, value: 'halal' },
  { label: { en: 'Kosher', bg: 'Кошер' }, value: 'kosher' },
]

/**
 * Visitor language options
 */
export const visitorLanguageOptions: LocalizedSelectOption[] = [
  { label: { en: 'English', bg: 'Английски' }, value: 'en' },
  { label: { en: 'Bulgarian', bg: 'Български' }, value: 'bg' },
  { label: { en: 'German', bg: 'Немски' }, value: 'de' },
  { label: { en: 'French', bg: 'Френски' }, value: 'fr' },
  { label: { en: 'Russian', bg: 'Руски' }, value: 'ru' },
]
