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
import useref from 'gulp-useref';
import minifyInline from 'gulp-minify-inline';
import removeHtmlComments from 'gulp-remove-html-comments';
import babel from 'gulp-babel';

// Использовать для локализаций
// import _ from 'lodash';
import config from './config.json';

/**
 * Удаление папки "htdocs"
 */
const clean = () => del(config.outputPath + '/**');

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

const build = gulp.series(
  clean,
  replaceFiles,
  replaceHTML,
  // changePaths,
  // cdnForImages,
  minification
);

gulp.task('build', build);
