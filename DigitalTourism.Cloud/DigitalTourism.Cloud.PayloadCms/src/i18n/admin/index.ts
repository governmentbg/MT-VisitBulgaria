/**
 * Admin panel translation exports
 *
 * This module centralizes all admin panel translations for PayloadCMS.
 * Import from this file to access all translation constants.
 */

// Types
export type { LocalizedLabel, CollectionLabels, LocalizedSelectOption, GlobalLabels } from './types'

// Collection and global labels
export { collectionLabels, globalLabels, adminGroupLabels } from './collections'

// Common field labels and descriptions
export { commonLabels, tabLabels, groupLabels, commonDescriptions } from './fields/common'

// Page-specific labels
export { pageLabels } from './fields/pages'

// User and visitor labels
export {
  userLabels,
  userDescriptions,
  visitorLabels,
  visitorDescriptions,
  visitorAdminDescriptions,
  mediaLabels,
} from './fields/users'

// Global labels
export {
  footerLabels,
  mainMenuLabels,
  mainMenuDescriptions,
  dropdownTypeOptions,
} from './fields/globals'

// Settings labels
export { settingsLabels, settingsDescriptions } from './fields/settings'

// Experience-specific labels
export {
  experienceLabels,
  locationLabels,
  contactLabels,
  mapPickerLabels,
  hotelLabels,
  hotelDescriptions,
  restaurantLabels,
  restaurantDescriptions,
  activityLabels,
  activityDescriptions,
  attractionLabels,
  attractionDescriptions,
  eventLabels,
  eventDescriptions,
  cuisineTypeOptions,
  restaurantDietaryOptions,
  dayOptions,
} from './fields/experiences'

// Geography-specific labels
export { geographyLabels, geographyDescriptions } from './fields/geography'

// Analytics labels
export { analyticsLabels } from './fields/analytics'

// Nomenclature labels
export { nomenclatureLabels, nomenclatureDescriptions } from './fields/nomenclature'

// Media block labels
export {
  mediaBlockLabels,
  mediaBlockDescriptions,
  mediaTypeOptions,
  videoSourceTypeOptions,
  fontSizeOptions,
  fontFamilyOptions,
  fontWeightOptions,
  textColorOptions,
  captionVerticalPositionOptions,
  captionHorizontalAlignmentOptions,
  captionBackgroundOptions,
  captionContainerWidthOptions,
  textShadowOptions,
  captionAnimationOptions,
  mediaBlockLayoutOptions,
  mediaBlockBackgroundOptions,
  textAlignmentOptions,
  imageHeightOptions,
} from './fields/mediaBlock'

// Spacer block labels
export { spacerBlockLabels, spacerBlockDescriptions } from './fields/spacerBlock'

// Stats block labels
export { statsBlockLabels, statsBlockDescriptions } from './fields/statsBlock'

// Columns block labels
export { columnsBlockLabels } from './fields/columnsBlock'

// Block group labels (for block picker categories)
export { blockGroupLabels } from './fields/blockGroups'

// Select options
export {
  experienceTypeOptions,
  starRatingOptions,
  amenitiesOptions,
  difficultyOptions,
  seasonOptions,
  userRoleOptions,
  dietaryOptions,
  visitorLanguageOptions,
} from './options'
