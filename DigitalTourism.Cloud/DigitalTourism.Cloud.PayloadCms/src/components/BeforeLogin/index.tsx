'use client'

import React, { useEffect } from 'react'

const BeforeLogin: React.FC = () => {
  useEffect(() => {
    window.location.href = '/api/users/oauth/keycloak/authorize'
  }, [])

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <p style={{ color: '#666', fontSize: '0.875rem' }}>
        Redirecting to login...
      </p>
    </div>
  )
}

export default BeforeLogin
