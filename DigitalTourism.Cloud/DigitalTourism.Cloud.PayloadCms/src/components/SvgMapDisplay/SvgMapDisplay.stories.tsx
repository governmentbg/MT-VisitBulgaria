import type { Meta, StoryObj } from '@storybook/react'
import { SvgMapDisplay } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'

// Bulgaria SVG map served from public/ via Storybook staticDirs
const BULGARIA_SVG_URL = '/bg.svg'

const mockRegions = [
  {
    regionId: 'BG22',
    name: 'София',
    description:
      'Софѝя е столицата на България. Той е най-големият град в страната, както и 14-ият по големина в Европейския съюз.',
    linkHref: '/regions/sofia',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/sofia1/800/600', alt: 'Sofia cityscape', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/sofia2/800/600', alt: 'Alexander Nevsky Cathedral', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG16',
    name: 'Пловдив',
    description:
      'Пловдив е вторият по големина град в България и един от най-старите градове в Европа с над 8000 години история.',
    linkHref: '/regions/plovdiv',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/plovdiv1/800/600', alt: 'Plovdiv Old Town', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/plovdiv2/800/600', alt: 'Roman Theatre', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG03',
    name: 'Варна',
    description:
      'Варна е третият по големина град в България и морската столица на страната, известна с красивите си плажове.',
    linkHref: '/regions/varna',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/varna1/800/600', alt: 'Varna Beach', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/varna2/800/600', alt: 'Sea Garden Varna', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG02',
    name: 'Бургас',
    description:
      'Бургас е четвъртият по големина град в България, важен промишлен и транспортен център на черноморското крайбрежие.',
    linkHref: '/regions/burgas',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/burgas1/800/600', alt: 'Burgas Sea Garden', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/burgas2/800/600', alt: 'Burgas Port', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG04',
    name: 'Велико Търново',
    description:
      'Велико Търново е исторически град, бивша столица на Второто българско царство, известен като „Градът на царете".',
    linkHref: '/regions/tarnovo',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/tarnovo1/800/600', alt: 'Tsarevets Fortress', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/tarnovo2/800/600', alt: 'Yantra River', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG24',
    name: 'Стара Загора',
    description: 'Стара Загора е град в централна България, известен с богатото си историческо наследство.',
    linkHref: '/regions/stara-zagora',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/sz1/800/600', alt: 'Stara Zagora', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/sz2/800/600', alt: 'Stara Zagora park', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG18',
    name: 'Русе',
    description: 'Русе е най-големият български град по поречието на Дунав, известен като „Малката Виена".',
    linkHref: '/regions/ruse',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/ruse1/800/600', alt: 'Ruse center', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/ruse2/800/600', alt: 'Danube bridge', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG01',
    name: 'Благоевград',
    description: 'Благоевград е административен център в югозападна България, близо до Рила и Пирин.',
    linkHref: '/regions/blagoevgrad',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/blag1/800/600', alt: 'Blagoevgrad', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/blag2/800/600', alt: 'Pirin mountains', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG15',
    name: 'Плевен',
    description: 'Плевен е град в Северна България, свързан с историческата обсада от 1877 г.',
    linkHref: '/regions/pleven',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/pleven1/800/600', alt: 'Pleven Panorama', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/pleven2/800/600', alt: 'Pleven center', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG08',
    name: 'Добрич',
    description: 'Добрич е град в Североизточна България, център на земеделска област.',
    linkHref: '/regions/dobrich',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/dobr1/800/600', alt: 'Dobrich', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/dobr2/800/600', alt: 'Dobrich region', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG23',
    name: 'Софийска област',
    description: 'Софийска област обгражда столицата и включва планински и равнинни райони.',
    linkHref: '/regions/sofia-province',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/sofp1/800/600', alt: 'Sofia Province', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/sofp2/800/600', alt: 'Vitosha Mountain', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG05',
    name: 'Видин',
    description: 'Видин е град в Северозападна България на брега на река Дунав, с крепостта Баба Вида.',
    linkHref: '/regions/vidin',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/vidin1/800/600', alt: 'Baba Vida Fortress', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/vidin2/800/600', alt: 'Vidin Danube', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG12',
    name: 'Монтана',
    description: 'Монтана е областен град в Северозападна България.',
    linkHref: '/regions/montana',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/mont1/800/600', alt: 'Montana', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/mont2/800/600', alt: 'Montana region', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG06',
    name: 'Враца',
    description: 'Враца е град в Северозападна България, известен с пещерите Леденика и Враца Балкан.',
    linkHref: '/regions/vratsa',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/vr1/800/600', alt: 'Vratsa Balkan', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/vr2/800/600', alt: 'Ledenika cave', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG11',
    name: 'Ловеч',
    description: 'Ловеч е град в Централна Северна България, известен с Покрития мост на Кольо Фичето.',
    linkHref: '/regions/lovech',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/lov1/800/600', alt: 'Covered Bridge Lovech', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/lov2/800/600', alt: 'Lovech fortress', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG07',
    name: 'Габрово',
    description: 'Габрово е град в Централна България, известен като столица на хумора и занаятите.',
    linkHref: '/regions/gabrovo',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/gab1/800/600', alt: 'Gabrovo Etar', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/gab2/800/600', alt: 'Gabrovo region', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG27',
    name: 'Шумен',
    description: 'Шумен е град в Североизточна България с паметника „Създатели на българската държава".',
    linkHref: '/regions/shumen',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/shum1/800/600', alt: 'Shumen monument', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/shum2/800/600', alt: 'Madara horseman', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG17',
    name: 'Разград',
    description: 'Разград е град в Североизточна България с богата история от тракийско и римско време.',
    linkHref: '/regions/razgrad',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/raz1/800/600', alt: 'Razgrad', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/raz2/800/600', alt: 'Abritus fortress', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG25',
    name: 'Търговище',
    description: 'Търговище е град в Североизточна България, важен търговски и културен център.',
    linkHref: '/regions/targovishte',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/targ1/800/600', alt: 'Targovishte', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/targ2/800/600', alt: 'Targovishte park', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG19',
    name: 'Силистра',
    description: 'Силистра е най-североизточният областен град в България, на брега на Дунав.',
    linkHref: '/regions/silistra',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/sil1/800/600', alt: 'Silistra fortress', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/sil2/800/600', alt: 'Silistra Danube', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG14',
    name: 'Перник',
    description: 'Перник е град в Западна България, известен с международния фестивал на маскарадните игри.',
    linkHref: '/regions/pernik',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/per1/800/600', alt: 'Surva festival', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/per2/800/600', alt: 'Pernik', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG10',
    name: 'Кюстендил',
    description: 'Кюстендил е град в Югозападна България, известен с минералните си води и овощните градини.',
    linkHref: '/regions/kyustendil',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/kyu1/800/600', alt: 'Kyustendil baths', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/kyu2/800/600', alt: 'Kyustendil orchards', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG13',
    name: 'Пазарджик',
    description: 'Пазарджик е град в Южна България, известен с Тракийското златно съкровище.',
    linkHref: '/regions/pazardzhik',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/paz1/800/600', alt: 'Pazardzhik', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/paz2/800/600', alt: 'Panagyurishte treasure', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG09',
    name: 'Кърджали',
    description: 'Кърджали е град в Южна България, известен с Кърджалийските скални гъби и язовир Кърджали.',
    linkHref: '/regions/kardzhali',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/kar1/800/600', alt: 'Kardzhali dam', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/kar2/800/600', alt: 'Stone mushrooms', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG21',
    name: 'Смолян',
    description: 'Смолян е най-високо разположеният областен град в България, в сърцето на Родопите.',
    linkHref: '/regions/smolyan',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/smo1/800/600', alt: 'Smolyan lakes', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/smo2/800/600', alt: 'Rhodope mountains', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG26',
    name: 'Хасково',
    description: 'Хасково е град в Южна България с паметника на Света Богородица — най-високата статуя на Дева Мария.',
    linkHref: '/regions/haskovo',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/has1/800/600', alt: 'Virgin Mary monument', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/has2/800/600', alt: 'Haskovo', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG20',
    name: 'Сливен',
    description: 'Сливен е град в Югоизточна България, известен с Сините камъни и Хайдушката пътека.',
    linkHref: '/regions/sliven',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/sliv1/800/600', alt: 'Blue Rocks Sliven', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/sliv2/800/600', alt: 'Sliven view', width: 800, height: 600 },
    ],
  },
  {
    regionId: 'BG28',
    name: 'Ямбол',
    description: 'Ямбол е град в Югоизточна България с Безистена — единственият запазен турски пазар на Балканите.',
    linkHref: '/regions/yambol',
    linkLabel: 'Научи повече',
    gallery: [
      { url: 'https://picsum.photos/seed/yam1/800/600', alt: 'Yambol Bezisten', width: 800, height: 600 },
      { url: 'https://picsum.photos/seed/yam2/800/600', alt: 'Yambol', width: 800, height: 600 },
    ],
  },
]

const meta = {
  title: 'Blocks/SvgMapDisplay',
  component: SvgMapDisplay,
  parameters: {
    layout: 'fullscreen',
    ...figmaDesign('1340-5333'),
  },
} satisfies Meta<typeof SvgMapDisplay>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  args: {
    heading: 'Опознай България',
    subtitle: 'Всяко кътче крие своите тайни. Избери област и научи повече за нея.',
    svgUrl: BULGARIA_SVG_URL,
    backgroundImageUrl: BULGARIA_SVG_URL,
    regions: mockRegions,
    defaultRegionIndex: 0,
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    ...figmaDesign('1340-5333'),
  },
}

export const Tablet: Story = {
  args: {
    heading: 'Опознай България',
    subtitle: 'Всяко кътче крие своите тайни. Избери област и научи повече за нея.',
    svgUrl: BULGARIA_SVG_URL,
    backgroundImageUrl: BULGARIA_SVG_URL,
    regions: mockRegions,
    defaultRegionIndex: 0,
  },
  parameters: {
    viewport: { defaultViewport: 'sm' },
    ...figmaDesign('1340-5973'),
  },
}

export const Mobile: Story = {
  args: {
    heading: 'Опознай България',
    subtitle: 'Всяко кътче крие своите тайни. Избери област и научи повече за нея.',
    svgUrl: BULGARIA_SVG_URL,
    backgroundImageUrl: BULGARIA_SVG_URL,
    regions: mockRegions,
    defaultRegionIndex: 0,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    ...figmaDesign('1353-398'),
  },
}

export const ActiveRegion: Story = {
  args: {
    heading: 'Опознай България',
    subtitle: 'Всяко кътче крие своите тайни. Избери област и научи повече за нея.',
    svgUrl: BULGARIA_SVG_URL,
    backgroundImageUrl: BULGARIA_SVG_URL,
    regions: mockRegions,
    defaultRegionIndex: 2,
  },
}

export const NoSubtitle: Story = {
  args: {
    heading: 'Опознай България',
    svgUrl: BULGARIA_SVG_URL,
    backgroundImageUrl: BULGARIA_SVG_URL,
    regions: mockRegions,
    defaultRegionIndex: 0,
  },
}
