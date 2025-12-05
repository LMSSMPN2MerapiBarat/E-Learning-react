import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'E-Learning SMPN 2 Merapi Barat';
const pages = import.meta.glob('./Pages/**/*.tsx');

const capitalizeSegments = (name: string) =>
    name
        .split('/')
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join('/');

const resolveInertiaPage = (name: string) => {
    const candidates = [name, capitalizeSegments(name)];

    for (const candidate of candidates) {
        const path = `./Pages/${candidate}.tsx`;
        if (pages[path]) {
            return resolvePageComponent(path, pages);
        }
    }

    return resolvePageComponent(`./Pages/${name}.tsx`, pages);
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: resolveInertiaPage,
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
