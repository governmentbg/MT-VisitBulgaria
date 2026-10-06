/**
 * Typesense client wrapper with lazy initialization
 */

import Typesense from 'typesense'
import type { Client } from 'typesense'
import type { TypesenseConnection, TypesenseFieldType } from './types'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('typesense:client')

let clientInstance: Client | null = null
let clientConfig: TypesenseConnection | null = null

/**
 * Initialize the Typesense client with the given configuration
 * This is called once during plugin initialization
 */
export function initializeClient(connection: TypesenseConnection): void {
  clientConfig = connection
  // Reset any existing instance when reinitializing
  clientInstance = null
  logger.debug('Client configuration stored, will initialize lazily')
}

/**
 * Get the Typesense client instance (lazy initialization)
 * Creates the client on first call
 */
export function getClient(): Client {
  if (!clientConfig) {
    throw new Error(
      'Typesense client not configured. Call initializeClient() first or ensure the plugin is properly initialized.',
    )
  }

  if (!clientInstance) {
    // Build nodes config, only including path if defined
    const nodes = clientConfig.nodes.map((node, index) => {
      // Validate and clean host (remove any accidental protocol prefix)
      let host = node.host
      if (host.startsWith('http://')) {
        logger.warn(`Node ${index}: Removing 'http://' prefix from host`)
        host = host.replace('http://', '')
      } else if (host.startsWith('https://')) {
        logger.warn(`Node ${index}: Removing 'https://' prefix from host`)
        host = host.replace('https://', '')
      }

      // Ensure port is a number
      const port = typeof node.port === 'string' ? parseInt(node.port, 10) : node.port

      const nodeConfig: { host: string; port: number; protocol: string; path?: string } = {
        host,
        port,
        protocol: node.protocol,
      }
      if (node.path) {
        nodeConfig.path = node.path
      }

      // Log the constructed URL for debugging
      logger.debug(`Node ${index} URL: ${nodeConfig.protocol}://${nodeConfig.host}:${nodeConfig.port}${nodeConfig.path || ''}`)

      return nodeConfig
    })

    logger.debug('Initializing Typesense client', {
      nodes,
      apiKey: clientConfig.apiKey,
      connectionTimeoutSeconds: clientConfig.connectionTimeoutSeconds ?? 5,
      numRetries: clientConfig.numRetries ?? 3,
    })

    clientInstance = new Typesense.Client({
      nodes,
      apiKey: clientConfig.apiKey,
      connectionTimeoutSeconds: clientConfig.connectionTimeoutSeconds ?? 5,
      numRetries: clientConfig.numRetries ?? 3,
    })
    logger.info('Typesense client initialized')
  }

  return clientInstance
}

/**
 * Check if the client is initialized and ready
 */
export function isClientReady(): boolean {
  return clientConfig !== null
}

/**
 * Reset the client (useful for testing)
 */
export function resetClient(): void {
  clientInstance = null
  clientConfig = null
  logger.debug('Client reset')
}

/**
 * Test the connection to Typesense
 */
export async function testConnection(): Promise<{
  ok: boolean
  version?: string
  error?: string
}> {
  try {
    const client = getClient()
    const health = await client.health.retrieve()

    return {
      ok: health.ok,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error('Connection test failed', { error: errorMessage })

    return {
      ok: false,
      error: errorMessage,
    }
  }
}

/**
 * Ensure a collection exists, creating it if necessary
 */
export async function ensureCollectionExists(
  name: string,
  schema: {
    name: string
    fields: Array<{
      name: string
      type: TypesenseFieldType
      facet?: boolean
      optional?: boolean
      sort?: boolean
      infix?: boolean
      locale?: string
      range_index?: boolean
    }>
    default_sorting_field?: string
    enable_nested_fields?: boolean
    token_separators?: string[]
    symbols_to_index?: string[]
  },
): Promise<void> {
  const client = getClient()

  try {
    // Check if collection exists
    await client.collections(name).retrieve()
    logger.debug(`Collection '${name}' already exists`)
  } catch (error) {
    // Collection doesn't exist, create it
    if (error instanceof Error && error.message.includes('Not Found')) {
      logger.info(`Creating collection '${name}'`)
      await client.collections().create(schema)
      logger.info(`Collection '${name}' created successfully`)
    } else {
      throw error
    }
  }
}

/**
 * Drop a collection if it exists
 */
export async function dropCollection(name: string): Promise<boolean> {
  const client = getClient()

  try {
    await client.collections(name).delete()
    logger.info(`Collection '${name}' deleted`)
    return true
  } catch (error) {
    if (error instanceof Error && error.message.includes('Not Found')) {
      logger.debug(`Collection '${name}' does not exist, nothing to delete`)
      return false
    }
    throw error
  }
}

/**
 * Get collection info
 */
export async function getCollectionInfo(name: string): Promise<{
  name: string
  numDocuments: number
  fields: Array<{ name: string; type: string }>
} | null> {
  const client = getClient()

  try {
    const collection = await client.collections(name).retrieve()
    return {
      name: collection.name,
      numDocuments: collection.num_documents,
      fields: collection.fields?.map((f) => ({ name: f.name, type: f.type })) ?? [],
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Not Found')) {
      return null
    }
    throw error
  }
}
