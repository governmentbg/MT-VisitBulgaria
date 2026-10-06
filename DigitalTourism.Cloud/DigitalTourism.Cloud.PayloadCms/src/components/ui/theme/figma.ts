const FIGMA_FILE_KEY = 'g8DrR0wGe0MhoiTHOWWjNS'
const FIGMA_FILE_NAME = 'VisitBG'

/**
 * Creates a Storybook `design` parameter for @storybook/addon-designs
 * that embeds the Figma node in the Design tab.
 */
export const figmaDesign = (nodeId: string) => ({
  design: {
    type: 'figma' as const,
    url: `https://www.figma.com/design/${FIGMA_FILE_KEY}/${FIGMA_FILE_NAME}?node-id=${nodeId.replace(':', '-')}`,
  },
})
