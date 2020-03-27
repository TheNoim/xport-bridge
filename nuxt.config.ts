import { Configuration } from '@nuxt/types';

const config: Configuration = {
    srcDir: 'client/',
    buildDir: 'nuxt-dist',
    dev: process.env.NODE_ENV !== 'production',
    generate: {
        dir: 'nuxt-static',
    },
    modules: ['bootstrap-vue/nuxt', '@nuxtjs/axios',],
    mode: 'spa',
    modern: 'client'
};

export default config;
