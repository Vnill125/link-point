import * as reactPlugin from 'vite-plugin-react'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  jsx: 'react',
  plugins: [reactPlugin],
  define: {
    'import.meta.env.VITE_REVERB_APP_KEY': JSON.stringify(process.env.VITE_REVERB_APP_KEY),
    'import.meta.env.VITE_REVERB_APP_HOST': JSON.stringify(process.env.VITE_REVERB_APP_HOST),
    'import.meta.env.VITE_REVERB_APP_PORT': JSON.stringify(process.env.VITE_REVERB_APP_PORT),
    'import.meta.env.VITE_REVERB_APP_CLUSTER': JSON.stringify(process.env.VITE_REVERB_APP_CLUSTER),
    'import.meta.env.VITE_API_TOKEN': JSON.stringify(process.env.VITE_API_TOKEN),
  },
}

export default config
