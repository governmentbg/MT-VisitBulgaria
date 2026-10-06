import type { Block, Field } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { withExpandedBlocks } from '@/features/expandedBlocks/withExpandedBlocks'
import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { columnsBlockLabels, blockGroupLabels } from '@/i18n/admin'

// All page-level blocks except ColumnsBlock itself (prevents infinite nesting)
import { CallToAction } from '../CallToAction/config'
import { ExperienceListingBlock } from '../../plugins/experience-listing/blocks/ExperienceListing/config'
import { IconCardsBlock } from '../IconCardsBlock/config'
import { StatisticsBannerBlock } from '../StatisticsBannerBlock/config'
import { FullWidthCtaBlock } from '../FullWidthCtaBlock/config'
import { FaqAccordionBlock } from '../FaqAccordionBlock/config'
import { GalleryBlock } from '../GalleryBlock/config'
import { StatsBlock } from '../StatsBlock/config'

const innerBlocks = withExpandedBlocks([
  CallToAction,
  ExperienceListingBlock,
  IconCardsBlock, StatisticsBannerBlock, FullWidthCtaBlock,
  FaqAccordionBlock,
  GalleryBlock,
  StatsBlock,
])

const columnEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    BlocksFeature({ blocks: innerBlocks }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    HorizontalRuleFeature(),
  ],
})

function columnField(
  name: string,
  condition?: (data: any, siblingData: any) => boolean,
): Field {
  const field: Field = {
    name,
    type: 'richText',
    localized: true,
    label: false,
    editor: columnEditor,
  }

  if (condition) {
    field.admin = { condition }
  }

  return field
}

export const ColumnsBlock: Block = {
  slug: 'columns',
  interfaceName: 'ColumnsBlock',
  labels: {
    singular: columnsBlockLabels.singular,
    plural: columnsBlockLabels.plural,
  },
  imageURL: blockImageUrls.columns,
  imageAltText: 'Columns block',
  admin: {
    group: blockGroupLabels.layout,
    components: {
      Block: '@/blocks/ColumnsBlock/admin/InlineColumnsBlock#InlineColumnsBlock',
    },
  },
  fields: [
    {
      name: 'columnCount',
      type: 'select',
      defaultValue: '2',
      label: columnsBlockLabels.columnCount,
      required: true,
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    columnField('column1'),
    columnField('column2'),
    columnField('column3', (_data, siblingData) =>
      ['3', '4'].includes(siblingData?.columnCount),
    ),
    columnField('column4', (_data, siblingData) =>
      siblingData?.columnCount === '4',
    ),
  ],
}
