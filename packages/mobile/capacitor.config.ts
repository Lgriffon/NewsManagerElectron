import type { CapacitorConfig } from '@capacitor/cli'

const mode = process.env.NODE_ENV ?? ''
const isDev = mode === 'development' || mode === 'dev' || process.env.CAP_DEV === '1' || process.argv.includes('--dev')

const envUrl = process.env.DEV_SERVER_URL // e.g. http://10.0.2.2:5173
const devUrl = envUrl ? (envUrl.endsWith('/') ? envUrl : envUrl + '/') : 'http://localhost:5173/'

console.log('Capacitor config - isDev:', isDev)
console.log('Capacitor config - devUrl:', devUrl)

const config: CapacitorConfig = {
	appId: 'com.example.app',
	appName: 'EIT News Manager',
	server: {
		androidScheme: 'http',
		allowNavigation: [
			'sanger.dia.fi.upm.es',
			'*.sanger.dia.fi.upm.es'
		],
		cleartext: true
	},
	...(isDev
		? {
				server: {
					url: devUrl,
					cleartext: true,
				},
		  }
		: {
				webDir: '../web/dist',
		  }),
}

export default config
