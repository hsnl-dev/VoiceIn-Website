/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/
'use strict';
const path = require('path');
const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const gulpLoadPlugins = require('gulp-load-plugins');
const pkg = require('./package.json');
const nodemon = require('gulp-nodemon');
const browserify = require('browserify');
const vss = require('vinyl-source-stream');
const rename = require('gulp-rename');
const es = require('event-stream');
const $ = gulpLoadPlugins();
const babel = require('babelify');
const reload = browserSync.reload;

// Lint JavaScript
// gulp.task('lint', () =>
//   gulp.src('public/javascripts/**/*.js')
//     .pipe($.eslint())
//     .pipe($.eslint.format())
//     .pipe($.if(!browserSync.active, $.eslint.failOnError()))
// );

// Optimize images
gulp.task('images', () =>
  gulp.src(['public/images/**/*'])
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
    }))
    .pipe(gulp.dest('./dist/public/images'))
    .pipe($.size({ title: 'images' }))
);

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10',
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'public/stylesheets/**/*.css',
  ])
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))

    // Concatenate and minify styles
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({ title: 'styles' }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/public/stylesheets'));
});

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enables ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
// gulp.task('scripts', () => {
//   gulp.src([
//
//         // Note: Since we are not using useref in the scripts build pipeline,
//         //       you need to explicitly list your scripts here in the right order
//         //       to be correctly concatenated
//         'public/javascripts/main.js',
//
//         // Other scripts
//       ])
//       .pipe($.sourcemaps.init())
//       .pipe($.babel())
//       .pipe($.concat('main.min.js'))
//       .pipe($.uglify({ preserveComments: 'some' }))
//
//       // Output files
//       .pipe($.size({ title: 'scripts' }))
//       .pipe($.sourcemaps.write('.'))
//       .pipe(gulp.dest('./dist/public/javascripts'));
// });

// gulp.task('bundle:qrcode', () => {
//   return browserify('public/javascripts/qrcode/entry.js')
//     .bundle()
//     .pipe(vss('bundle.js'))
//     .pipe(gulp.dest('public/dist/javascripts/qrcode'));
// });

gulp.task('browserify', () => {
  let files = [
    './public/javascripts/qrcode/entry.js',
    './public/javascripts/icon/entry.js'
  ];

  let tasks = files.map((entry) => {
    return browserify({ entries: [entry] })
            .transform(babel.configure({
              presets: ['es2015'],
            }))
            .bundle()
            .pipe(vss(entry))

            // rename them to have "bundle as postfix"
            .pipe(rename({
              extname: '.bundle.js',
            }))
            .pipe(gulp.dest('./dist'));
  });

  // create a merged stream
  return es.merge.apply(null, tasks);
});

// Clean output directory
gulp.task('clean', () => del(['public/dist/*'], { dot: true }));

// Watch files for changes & reload
gulp.task('serve', [], () => {
  browserSync({
    proxy: 'http://localhost:3000',
    notify: false,

    // Customize the Browsersync console logging prefix
    logPrefix: 'VoiceIn',

    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],

    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    port: 5000,
  });

  gulp.watch(['views/*.ejs'], reload);
  gulp.watch(['public/stylesheets/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['public/javascripts/**'], ['browserify', reload]);
  gulp.watch(['public/images/*'], reload);
});

gulp.task('nodemon', cb => {
  let started = false;

  return nodemon({
    script: './bin/www',
  }).on('start', () => {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
  runSequence(
    'styles',
    ['browserify', 'images'],
    cb
  )
);
