import type { LocalizedLabel } from '../types'

/**
 * Field labels for geography collections (admin UI only - en/bg)
 */
export const geographyLabels: Record<string, LocalizedLabel> = {
  name: { en: 'Name', bg: 'Име' },
  code: { en: 'Code', bg: 'Код' },
  ekatteCode: { en: 'NUTS/EKATTE Code', bg: 'NUTS/ЕКАТТЕ код' },
  region: { en: 'Region', bg: 'Регион' },
  municipality: { en: 'Municipality', bg: 'Община' },
  population: { en: 'Population', bg: 'Население' },
  isCapital: { en: 'Is Capital', bg: 'Е столица' },
  coordinates: { en: 'Coordinates', bg: 'Координати' },
  latitude: { en: 'Latitude', bg: 'Географска ширина' },
  longitude: { en: 'Longitude', bg: 'Географска дължина' },
}

/**
 * Description labels for geography fields (admin UI only - en/bg)
 */
export const geographyDescriptions: Record<string, LocalizedLabel> = {
  code: {
    en: 'NUTS3/Municipality code (e.g., VAR, VAR01)',
    bg: 'NUTS3/Общински код (напр. VAR, VAR01)',
  },
  ekatteCode: {
    en: 'EKATTE code for municipalities and cities',
    bg: 'ЕКАТТЕ код за общини и градове',
  },
  regionName: {
    en: 'Region name',
    bg: 'Име на регион',
  },
  municipalityName: {
    en: 'Municipality name',
    bg: 'Име на община',
  },
  cityName: {
    en: 'City name',
    bg: 'Име на град',
  },
  parentRegion: {
    en: 'Parent region for this municipality',
    bg: 'Родителски регион за тази община',
  },
  parentMunicipality: {
    en: 'Parent municipality for this city',
    bg: 'Родителска община за този град',
  },
  cityPopulation: {
    en: 'Population of the city (optional, for sorting)',
    bg: 'Население на града (незадължително, за сортиране)',
  },
  isCapital: {
    en: 'Is this the capital of its municipality?',
    bg: 'Това столица ли е на общината?',
  },
  coordinates: {
    en: 'Geographic coordinates (latitude, longitude)',
    bg: 'Географски координати (ширина, дължина)',
  },
  latitudeRange: {
    en: 'Latitude (-90 to 90)',
    bg: 'Географска ширина (-90 до 90)',
  },
  longitudeRange: {
    en: 'Longitude (-180 to 180)',
    bg: 'Географска дължина (-180 до 180)',
  },
  heroImage: {
    en: 'Hero image for the region',
    bg: 'Основна снимка за региона',
  },
  heroImageMunicipality: {
    en: 'Hero image for the municipality',
    bg: 'Основна снимка за общината',
  },
  heroImageCity: {
    en: 'Hero image for the city',
    bg: 'Основна снимка за града',
  },
  richDescription: {
    en: 'Rich content description of the region',
    bg: 'Богато описание на региона',
  },
  richDescriptionMunicipality: {
    en: 'Rich content description of the municipality',
    bg: 'Богато описание на общината',
  },
  richDescriptionCity: {
    en: 'Rich content description of the city',
    bg: 'Богато описание на града',
  },
}
