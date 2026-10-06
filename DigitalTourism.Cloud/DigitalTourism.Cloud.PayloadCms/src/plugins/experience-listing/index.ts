import type { Config, Plugin } from 'payload'
import type { ExperienceListingPluginConfig } from './types'
import { createPreviewEndpoint } from './endpoints'

export function experienceListingPlugin(config?: ExperienceListingPluginConfig): Plugin {
  return (incomingConfig: Config): Config => {
    if (config?.enabled === false) {
      return incomingConfig
    }

    return {
      ...incomingConfig,
      endpoints: [...(incomingConfig.endpoints || []), createPreviewEndpoint()],
    }
  }
}
