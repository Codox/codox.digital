import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';

const projects = defineCollection({
    loader: glob({pattern: '*.md', base: './src/content/projects'}),
    schema: z.object({
        name: z.string(),
        tagline: z.string(),
        status: z.string(),
        url: z.url().optional(),
        order: z.number().int(),
    }),
});

export const collections = {projects};
