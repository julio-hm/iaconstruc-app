import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [
        viteStaticCopy({
          targets: [
            {
              src: 'public/locales',
              dest: '.'
            }
          ]
        })
      ],
      server: {
        host: true
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
