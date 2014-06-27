var data          = require('./package.json');
var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    clean         = require('gulp-clean'),
    imagemin      = require('gulp-imagemin'),
    jshint        = require('gulp-jshint'),
    livereload    = require('gulp-livereload'),
    minifyCss     = require('gulp-minify-css'),
    minifyHtml    = require('gulp-minify-html'),
    rename        = require('gulp-rename'),
    rev           = require('gulp-rev'),
    sass          = require('gulp-ruby-sass'),
    svgmin        = require('gulp-svgmin'),
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
 * Tasks
 */
gulp.task('clean', function(){
  gulp.src(path.deploy.base + '/*', {read: false})
    .pipe(clean());
});

gulp.task('move', ['styles'], function(){
  return gulp.src([
      path.src.styles + '/oldie.css',
      path.src.scripts + '/lib/html5.js',
      path.src.base + '/**/*.php',
      path.src.base + '/**/*.txt',
      path.src.base + '/.htaccess',
    ], {base: path.src.base})
    .pipe(gulp.dest(path.deploy.base))
});

gulp.task('styles', function() {
  return gulp.src(path.src.sass + '/*.sass')
    .pipe(sass({ style: 'expanded', compass: true }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(path.src.styles))
    .pipe(livereload({auto: false}));
});

gulp.task('usemin', ['styles'], function() {
  return gulp.src(path.src.base + '/*.html')
    .pipe(usemin({
      css: [minifyCss(), 'concat'],
      html: [minifyHtml({empty:true, comments:true})],
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest(path.deploy.base))
});

gulp.task('assets', function() {
  return gulp.src([path.src.assets + '/**/*.jpg', path.src.assets + '/**/*.png', path.src.assets + '/**/*.svg'])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(path.deploy.assets))
});

gulp.task('build', ['clean', 'usemin', 'move', 'assets']);

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(path.src.sass + '/**/*.sass', ['styles']);
  gulp.watch([path.src.base + '/**/*.html', path.src.base +'/**/*.php']).on('change', livereload.changed);
  gulp.watch([path.src.scripts + '/**/*.js']).on('change', livereload.changed);
  gulp.watch([path.src.assets + '/**/*']).on('change', livereload.changed);
});