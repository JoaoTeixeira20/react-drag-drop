require('esbuild').build({
    entryPoints: ['src/development/Preview.tsx'],
    bundle: true,
    minify: true,
    format: 'esm',
    target: ['es6'],
    outdir: 'demoPage',
    splitting: true,
  });