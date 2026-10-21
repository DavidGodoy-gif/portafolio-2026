import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  studioHost: 'davidgodoy',
  api: {
    projectId: 'lia9s4dq',
    dataset: 'production'
  },
  deployment: {
    appId: 'z6yqizjc9azf9rstxzkl3rah',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
