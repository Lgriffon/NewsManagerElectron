import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import ArticleList from './pages/ArticleList'
import ArticleDetails from './pages/ArticleDetails'

// --- Type Definitions ---
declare global {
	interface Window {
		api: {
			notify: (data: { title: string; iconPath: string; silent: boolean }) => void;
		};
	}
}

const isElectron = () => typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron')

if (isElectron()) {
	window.api.notify({
		title: `EIT Newspaper`,
		iconPath: '../../logo.png',
		silent: true,
	})
}

const containerStyles: React.CSSProperties = {
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
	padding: '20px',
	boxSizing: 'border-box'
}

const headingStyles: React.CSSProperties = {
	margin: '0 0 25px 0',
	textAlign: 'center',
	fontSize: '2rem',
	fontWeight: 700,
	fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
	color: '#2c3e50',
	textShadow: '0px 1px 2px rgba(0,0,0,0.1)'
}

const mainFrameStyles: React.CSSProperties = {
	width: '100%',
	maxWidth: '900px',
	background: 'white',
	minHeight: '85vh',
	borderRadius: '16px',
	overflow: 'hidden',
	boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
	display: 'flex',
	flexDirection: 'column'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<div style={containerStyles}>

			<h1 style={headingStyles}>EIT Newspaper</h1>

			<div style={mainFrameStyles}>
				<HashRouter>
					<Routes>
						<Route path="/" element={<ArticleList />} />
						<Route path="/:id" element={<ArticleDetails />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</HashRouter>
			</div>

		</div>
	</React.StrictMode>,
)