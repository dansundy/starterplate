var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    clean         = require('gulp-clean'),
    // concat       = require('gulp-concat'),
    // imagemin     = require('gulp-imagemin'),
    jshint        = require('gulp-jshint'),
    livereload    = require('gulp-livereload'),
    rename        = require('gulp-rename'),
    // replace      = require('gulp-replace'),
    rev           = require('gulp-rev'),
    sass          = require('gulp-ruby-sass'),
    // svgmin       = require('gulp-svgmin'),
    uglify        = require('gulp-uglify'),
    usemin        = require('gulp-usemin'),
    watch         = require('gulp-watch');

var path = {
  src: {
    base: './src',
    sass: './src/sass',
    styles: './src/css',
    scripts: './src/js',
    assets: './src/assets'
  },
  deploy: {
    base: './deploy',
    styles: './deploy/css',
    scripts: './deploy/js',
    assets: './deploy/assets'
  }
}

/** 
 * Functions 
 */
var styles = function(env) {
  var source = path.src.sass + '/*.sass';
  var output = env === 'src' ? 'expanded' : 'compressed';
  return gulp.src(source)
    .pipe(sass({ style: output, compass: true }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(path[env].styles))
    .pipe(livereload({auto: false}));
}

/**
 * Tasks
 */
gulp.task('styles', function() {
  styles('src');
});

gulp.task('clean', function(){
  return gulp.src([path.deploy.base + '/*'], {read: false})
    .pipe(clean());
});

gulp.task('build', ['clean'], function(){
  styles('deploy');
  // scripts('deploy');
  // assets('img');
  // assets('svg');
  // move();
});

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(path.src.sass + '/**/*.sass', ['styles']);
  gulp.watch([path.src.base + '/**/*.html', path.src.base +'/**/*.php']).on('change', livereload.changed);
  // gulp.watch(path.src.scripts + '/*.js', ['scripts']);
});