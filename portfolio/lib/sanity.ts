import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'lia9s4dq',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
