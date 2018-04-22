const path = require('path')
const express = require('express')
const {
  FuseBox,
  Sparky,
  EnvPlugin,
  CSSPlugin,
  WebIndexPlugin,
  QuantumPlugin,
} = require('fuse-box')
const transformInferno = require('ts-transform-inferno').default
let fuse, app
let isProduction = false

Sparky.task('config', _ => {
  fuse = new FuseBox({
    homeDir: 'src',
    hash: isProduction,
    output: 'dist/$name.js',
    cache: !isProduction,
    sourceMaps: !isProduction,
    target: 'browser',
    transformers: {
      before: [transformInferno()],
    },
    plugins: [
      EnvPlugin({ NODE_ENV: isProduction ? 'production' : 'development' }),
      WebIndexPlugin({
        title: 'Inferno Typescript FuseBox Example',
        template: 'src/index.html',
      }),
      isProduction &&
        QuantumPlugin({
          bakeApiIntoBundle: 'app',
          treeshake: true,
          uglify: true,
        }),
    ],
  })
  app = fuse.bundle('app').instructions('>index.tsx')
})

Sparky.task('clean', _ => Sparky.src('dist/').clean('dist/'))
Sparky.task('env', _ => (isProduction = true))
Sparky.task('dev', ['clean', 'config'], async () => {
  fuse.dev()
  app.hmr().watch()
  await fuse.run()
})

Sparky.task('prod', ['clean', 'env', 'config'], _ => {
  fuse.dev({ reload: true }) // remove after demo
  return fuse.run()
})
