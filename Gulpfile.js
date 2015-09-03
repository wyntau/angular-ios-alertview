var gulp = require('gulp')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')
  , minifyCSS = require('gulp-minify-css')

gulp.task('js', function(){
  return gulp.src('src/angular-ios-alertview.js')
    .pipe(gulp.dest('.'))
    .pipe(uglify({
      mangle: {
        except: ['angular']
      }
    }))
    .pipe(rename('angular-ios-alertview.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('css', function(){
  return gulp.src('src/angular-ios-alertview.css')
    .pipe(gulp.dest('.'))
    .pipe(minifyCSS({
      advanced: false
    }))
    .pipe(rename('angular-ios-alertview.min.css'))
    .pipe(gulp.dest('.'));
});

gulp.task('dev', ['js', 'css'], function(){
  gulp.watch('src/**/*', ['js', 'css']);
});

gulp.task('default', ['js', 'css']);
