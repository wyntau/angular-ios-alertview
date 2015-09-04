var pkg = require('./package.json')

  , gulp = require('gulp')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')
  , minifyCSS = require('gulp-minify-css')
  , header = require('gulp-header')
  , autoprefixer = require('gulp-autoprefixer')

  , bannerData = {
    pkg: pkg,
    date: new Date()
  }
  , bannerTemplate = [
    '/*!',
    ' * <%= pkg.name %> <%= pkg.version %>',
    ' * <%= pkg.description %>',
    ' * License: <%= pkg.license %>',
    ' * Author: <%= pkg.author %>',
    ' * build: <%= date %>',
    ' **/\n'
  ].join('\n')

gulp.task('js', function(){
  return gulp.src('src/angular-ios-alertview.js')
    .pipe(header(bannerTemplate, bannerData))
    .pipe(gulp.dest('.'))
    .pipe(uglify({
      mangle: {
        except: ['angular']
      },
      preserveComments: 'license'
    }))
    .pipe(rename('angular-ios-alertview.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('css', function(){
  return gulp.src('src/angular-ios-alertview.css')
    .pipe(autoprefixer({
      browsers: ['> 1%']
    }))
    .pipe(header(bannerTemplate, bannerData))
    .pipe(gulp.dest('.'))
    .pipe(minifyCSS({
      advanced: false,
      keepSpecialComments: 1
    }))
    .pipe(rename('angular-ios-alertview.min.css'))
    .pipe(gulp.dest('.'));
});

gulp.task('dev', ['js', 'css'], function(){
  gulp.watch('src/**/*', ['js', 'css']);
});

gulp.task('default', ['js', 'css']);
