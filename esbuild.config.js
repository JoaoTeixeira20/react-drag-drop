require('esbuild').build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['es6'],
  outdir: 'dist',
  splitting: true,
  external: ['@react-spring/web', 'react', 'react-dom', 'styled-components'],
});
