import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://codox.digital',
    integrations: [sitemap({filter: (page) => !page.endsWith('/404/')})],
    server: {port: 4330},
    devToolbar: {enabled: false},
});
