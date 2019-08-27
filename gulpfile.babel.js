"use strict";

import gulp from 'gulp';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import del from 'del';
import replace  from 'gulp-replace-path';
import cheerio  from 'gulp-cheerio';
import htmlmin from 'gulp-htmlmin';
import foreach from 'gulp-foreach';
import download from "gulp-download-stream";
import merge  from 'merge-stream';
import browserSync from 'browser-sync';
import useref from 'gulp-useref';
import minifyInline from 'gulp-minify-inline';
import removeHtmlComments from 'gulp-remove-html-comments';
import babel from 'gulp-babel';

// Использовать для локализаций
// import _ from 'lodash';
import config from './config.json';

/*
 * Подготовка лендинга
 */
const preparation = () => {
  const inner = gulp.src(['./package.json', './package-lock.json'])
    .pipe(replace('standard', config.landingName))
    .pipe(gulp.dest("./"));
  const outer = gulp.src('modules/gdpr/localGDPR.js')
    .pipe(replace('landing_standard', 'landing_' + config.landingName))
    .pipe(gulp.dest("modules/gdpr/"));

  return merge(inner, outer);
};

/**
 * Удаление папки "htdocs"
 */
const clean = () => del(config.outputPath + '/**');

/**
 * Модуль GDPR + аналитика
 */
const gdprModule = () => {
  const js = gulp
    .src(['node_modules/gdpr/dist/gdpr.js', 'modules/gdpr/localGDPR.js'])
    .pipe(babel())
    .pipe(gulp.dest("src/js/"));
  const css = gulp
    .src(['node_modules/gdpr/dist/gdpr.css', 'modules/gdpr/localGDPR.css'])
    .pipe(gulp.dest("src/css/"));

  return merge(js, css);
};

/**
 * Модуль селектора паков
 */
const selectorModule = () => {
  return gulp.src('modules/selector.js')
    .pipe(babel())
    .pipe(gulp.dest("src/js/"))
};

/**
 * Модуль JSON для селектора паков
 */
const selectorDataModule = () => {
  return gulp.src('data/retailers.json')
    .pipe(gulp.dest("src/data/"))
};

/**
 * Модуль цен
 */
const pricesModule = () => {
  return gulp.src('modules/prices.js')
    .pipe(babel())
    .pipe(gulp.dest("src/js/"));
};

/**
 * Модуль локализаций
 */
const localizationModule = () => {
  return gulp.src('modules/localizations/*.js')
    .pipe(babel())
    .pipe(gulp.dest("src/js/"))
};

/**
 * Модуль xsolla-login widget
 */
const xsollaLoginModule = () => {
  return gulp.src('modules/xsolla-login.js')
    .pipe(babel())
    .pipe(gulp.dest("src/js/"));
};

/**
 * Модуль таймера
 */
const timerModule = () => {
  return gulp.src('modules/date-timer.js')
    .pipe(babel())
    .pipe(gulp.dest("src/js/"));
};

/**
 * Скачивание сторонних скриптов в локальную папку "js"
 */
const downloadExternalScripts = () => {
  return download(config.downloadedScripts)
    .pipe(gulp.dest("src/js/"));
};

/**
 * Перемещение всех файлов в папку "htdocs"
 */
const replaceFiles = () => {
  return gulp.src("src/**")
    .pipe(gulp.dest(config.outputPath));
};

/**
 * Удаление из index.html блока с Paystation, перемещение index.html в папку "htdocs"
 * (только для интегрированного виджета xsolla-login)
 */
const replaceHTML = () => {
  return gulp.src("src/index.html")
    .pipe(useref())
    .pipe(gulp.dest(config.outputPath));
};

/**
 * Замена путей ресурсных файлов (css, js) на CDN
 * (только для боевой сборки)
 */
const changePaths = () => {
  return gulp.src([
    config.outputPath + '/*.html'
  ])
    .pipe(foreach(function (stream, file) {
      return stream
        .pipe(replace('videos/', config.cdnPath + 'videos/'))
        .pipe(replace('"css/', '"' + config.cdnPath + 'css/'))
        .pipe(replace('"js/', '"' + config.cdnPath + 'js/'))
        .pipe(replace(/integrity=[\"'](.*?)[^>]*"/g, ''))
        .pipe(gulp.dest(config.outputPath));
    }))
};

/**
 * Замена путей сторонних скриптов
 * (только для dev-сборки)
 */
const devChangePaths = () => {
  return gulp.src([
    config.outputPath + '/*.html'
  ])
    .pipe(foreach(function (stream, file) {
      return stream
        .pipe(replace(/integrity=[\"'](.*?)[^>]*"/g, ''))
        .pipe(gulp.dest(config.outputPath));
    }))
};

/**
 * Замена путей изображенй на CDN
 * (только для боевой сборки)
 */
const cdnForImages = () => {
  return gulp.src(config.outputPath + '/*.html')
    .pipe(foreach(function (stream, file) {
      return stream
        .pipe(cheerio({
          run: function ($, file) {
            $('img').each(function () {
              $(this).attr('src', config.cdnPath + $(this).attr('src'));
              if ($(this).attr('srcset') !== undefined) {
                const srcset = $(this).attr('srcset').replace(/\images/g, config.cdnPath + 'images');
                $(this).attr('srcset', srcset);
              }
            });

            $('link').each(function () {
              if ($(this).attr('href').indexOf('images/') > -1) {
                $(this).attr('href', config.cdnPath + $(this).attr('href'));
              }
            });
          }
        }))
        .pipe(gulp.dest(config.outputPath));
    }));
};

/**
 * Минификация файлов
 * (только для боевой сборки)
 */
const minification = () => {
  const css = gulp
    .src([config.outputPath + '/css/*.css'])
    .pipe(cleanCSS())
    .pipe(replace('../', config.cdnPath + '/'))
    .pipe(gulp.dest(config.outputPath + '/css'));
  const js = gulp
    .src(config.outputPath + '/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(config.outputPath + '/js'));
  const html = gulp.src(config.outputPath + '/*.html').pipe(
    foreach(function (stream, file) {
      return stream
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(removeHtmlComments())
        .pipe(minifyInline())
        .pipe(gulp.dest(config.outputPath));
    })
  );

  return merge(js, css, html);
};

/**
 * Перенос index.html по папка локализаций
 */
const localsPaths = (cb) => {
  _.each(config.locals, function (lang) {
    console.log('Folder ' + lang + ' was added');
    gulp.src(config.outputPath + '/*.html')
      .pipe(gulp.dest(config.outputPath + '/' + lang));
  });
  cb()
};

const browserSynchronization = () => {
  browserSync.init({
    server: {
      baseDir: config.outputPath
    }
  });
};

/**
 * LiveReload
 */
const livereload = gulp.series(gulp.parallel(gdprModule, xsollaLoginModule, timerModule, localizationModule, selectorModule, pricesModule), replaceFiles);

const watch = () => {
  gulp.watch('./src/index.html', gulp.series(replaceHTML, devChangePaths, (done) => {
    browserSync.reload();
    done();
  }));

  gulp.watch('./modules/**/*.**', gulp.series(livereload, devChangePaths, (done) => {
    browserSync.reload();
    done();
  }));
};

const dev = gulp.series(
  clean,
  gdprModule,
  // xsollaLoginModule,
  // timerModule,
  // localizationModule,
  // selectorModule,
  // selectorDataModule,
  // pricesModule,
  // downloadExternalScripts,
  replaceFiles,
  replaceHTML,
  devChangePaths,
  // localsPaths,
  browserSynchronization
);

const build = gulp.series(
  clean,
  gdprModule,
  // xsollaLoginModule,
  // localizationModule,
  // timerModule,
  // selectorModule,
  // selectorDataModule,
  // pricesModule,
  // downloadExternalScripts,
  replaceFiles,
  replaceHTML,
  changePaths,
  cdnForImages,
  // localsPaths,
  minification
);

gulp.task('dev', gulp.parallel(dev, watch));
gulp.task('build', build);
gulp.task('preparation', preparation);
