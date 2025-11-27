import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Capacitor } from '@capacitor/core'

const isNative = () => Capacitor.isNativePlatform() // iOS/Android only
const platform = () => Capacitor.getPlatform() // 'ios' | 'android' | 'web'

const isElectron = () => typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron')

if (isElectron()) {
	window.api.notify({
		title: `EIT Newspaper`,
		// iconPath: pathToPngOrIcoAtRuntime,
		silent: true,
	})
}

const containerStyles: React.CSSProperties = {
	minHeight: '100vh',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	background: '#616161ff',
}

const headingStyles: React.CSSProperties = {
	margin: 0,
	textAlign: 'center',
	fontSize: '1.75rem',
	fontWeight: 600,
	fontFamily: 'Arial, Helvetica, sans-serif',
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<div style={containerStyles}>
				<h1 style={headingStyles}>
					EIT Newspaper running on {isNative() ? `(${platform()})` : isElectron() ? '(Electron)' : '(Web)'}
				</h1>
			</div>
		</BrowserRouter>
	</React.StrictMode>,
)
