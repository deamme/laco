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
    plugins: [
      EnvPlugin({ NODE_ENV: isProduction ? 'production' : 'development' }),
      WebIndexPlugin({
        title: 'React Typescript FuseBox Example',
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
  fuse.run()
})

Sparky.task('prod', ['clean', 'env', 'config'], _ => {
  fuse.dev({ reload: true }) // remove after demo
  fuse.run()
})
