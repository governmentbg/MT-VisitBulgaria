export interface BackofficeConfig {
  issuer: string
  serviceClientId: string
  serviceClientSecret: string
}

export interface KeycloakUserRepresentation {
  id: string
  username: string
  email: string
  emailVerified: boolean
  firstName?: string
  lastName?: string
  enabled: boolean
  attributes?: Record<string, string[]>
}

export interface KeycloakRoleRepresentation {
  id: string
  name: string
  description?: string
  composite?: boolean
  clientRole?: boolean
  containerId?: string
}
