/**
 * prerender.ts — Custom static pre-rendering script
 *
 * Runs after `vite build` and `vite build:ssr`.
 * Imports the already-compiled SSR bundle from dist/server/
 * and uses it to generate static HTML for each public route.
 *
 * Usage: npm run build:prerender
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p: string) => path.resolve(__dirname, p);

// --- Minimal DOM Mock for SSR (fixes Leaflet and other browser-only libs) ---
if (typeof global !== 'undefined') {
    (global as any).__isServer__ = true; // Flag for providers to detect SSR
    (global as any).window = {
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
        location: {
            href: '',
            origin: '',
            pathname: '/',
            hostname: 'localhost',
            search: '',
            hash: ''
        },
        screen: { deviceXDPI: 96, logicalXDPI: 96 },
    };
    (global as any).self = (global as any).window;
    (global as any).screen = (global as any).window.screen;
    const mockElement = () => ({
        setAttribute: () => { },
        style: {},
        appendChild: () => { },
        getContext: () => null,
    });
    const doc: any = {
        createElement: mockElement,
        getElementsByTagName: () => [],
        createTextNode: () => ({}),
        addEventListener: () => { },
        removeEventListener: () => { },
        documentElement: { style: {} },
    };
    doc.head = mockElement();
    doc.body = mockElement();
    (global as any).document = doc;
    if (!(global as any).navigator) {
        Object.defineProperty(global, 'navigator', {
            value: { userAgent: 'node.js' },
            configurable: true,
            writable: true
        });
    }
    const storageMock = () => ({
        getItem: () => null,
        setItem: () => { },
        removeItem: () => { },
        clear: () => { },
    });
    (global as any).localStorage = storageMock();
    (global as any).sessionStorage = storageMock();
    (global as any).requestAnimationFrame = (callback: any) => setTimeout(callback, 0);
    (global as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
}
// ---------------------------------------------------------------------------

// Public routes to pre-render — must match routes in entry-server.tsx
const ROUTES = [
    '/',
    '/about-tunisia',
    '/travel-information',
    '/blog',
    '/company-information',
    '/start-my-trip',
];

async function prerender() {
    console.log('\n🚀 Starting pre-render...\n');

    // Read the built index.html as our template
    const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');

    // Import from the Vite-compiled SSR bundle (CSS already handled by Vite)
    const { render } = await import('./dist/server/entry-server.js');

    for (const url of ROUTES) {
        console.log(`  📄 Rendering: ${url}`);

        try {
            const { html: appHtml, helmetContext } = render(url);
            console.log(`    📏 Rendered HTML length: ${appHtml.length}`);

            // Extract SEO tags from HelmetProvider context
            const helmet = (helmetContext as any).helmet;
            const headTags = helmet
                ? [
                    helmet.title?.toString() || '',
                    helmet.meta?.toString() || '',
                    helmet.link?.toString() || '',
                    helmet.script?.toString() || '',
                ].filter(Boolean).join('\n    ')
                : '';

            console.log(`    🏷️  Head tags captured: ${headTags ? 'Yes' : 'No'}`);

            // Inject rendered app and SEO tags into the HTML template
            // Use more robust regex for replacements
            let finalHtml = template.replace('<!--app-head-->', headTags);

            if (finalHtml.includes('<div id="root"></div>')) {
                finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
            } else {
                // Handle cases where Vite might have added whitespace/comments inside root
                finalHtml = finalHtml.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${appHtml}</div>`);
            }

            // Determine output path
            const outputDir = url === '/'
                ? toAbsolute('dist')
                : toAbsolute(`dist${url}`);

            fs.mkdirSync(outputDir, { recursive: true });
            fs.writeFileSync(path.join(outputDir, 'index.html'), finalHtml);

            console.log(`  ✅ Written: dist${url === '/' ? '' : url}/index.html`);
        } catch (err) {
            console.error(`  ❌ Failed to render ${url}:`, err);
        }
    }

    console.log('\n✨ Pre-rendering complete!\n');
}

prerender().catch(console.error);
