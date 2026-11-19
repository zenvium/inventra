import { HelmetProvider } from '@dr.pogodin/react-helmet';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { oidcConfig } from './oidc-config.ts';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
	<React.StrictMode>
		<HelmetProvider>
			<BrowserRouter>
				<AuthProvider {...oidcConfig}>
					<App />
				</AuthProvider>
			</BrowserRouter>
		</HelmetProvider>
	</React.StrictMode>,
);
