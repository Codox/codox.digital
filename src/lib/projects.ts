import {getCollection} from 'astro:content';

export const getProjects = async () =>
    (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
