const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      pug          = require('gulp-pug'),
      browserSync  = require('browser-sync'),
      sourcemaps   = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS     = require('gulp-clean-css'),
      rename       = require('gulp-rename'),
      pugbem       = require('gulp-pugbem'),
      imagemin     = require('gulp-imagemin'),
      clean        = require('gulp-clean'),
      uglify       = require('gulp-uglify'),
      concat       = require('gulp-concat');

gulp.task('browser-sync', function () {
  browserSync.init({
                     server: {
                       baseDir: 'src/',
                       index: 'index.html',
                     },
                     port: 5000,
                   });
  gulp.watch('./src/scss/**/*.scss', gulp.task('sass'));
  gulp.watch('./src/js/**/*.js', gulp.task('js'));
  gulp.watch('./src/views/**/*.pug', gulp.task('html'));
  gulp.watch('./src/*.html', browserSync.reload);
});

gulp.task('sass', function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(autoprefixer())
    .pipe(cleanCSS({level: 2}))
    .pipe(gulp.dest('src/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

gulp.task('html', function () {
  return gulp.src('src/views/*.pug')
    .pipe(pug({
                pretty: true,
                plugins: [pugbem],
              }))
    .pipe(gulp.dest('src'))
    .pipe(browserSync.stream());
});

gulp.task('clean', function () {
  return gulp.src('dist/*')
    .pipe(clean());
});

gulp.task('js', function () {
  return gulp.src('src/scripts/**/*.js')
    .pipe(concat('script.js'))
    .pipe(uglify({toplevel: true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.stream());
});

gulp.task('img', function () {
  return gulp.src('src/img/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/*.*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('dist', function () {
  const htmlDist  = gulp.src('src/*.html')
    .pipe(gulp.dest('dist')),
        cssDist   = gulp.src('src/css/*.css')
          .pipe(gulp.dest('dist/css')),
        jsDist    = gulp.src('src/js/*.js')
          .pipe(gulp.dest('dist/js')),
        fontsDist = gulp.src('src/scss/fonts/*.*')
          .pipe(gulp.dest('dist/css/fonts'));
  return htmlDist, cssDist, jsDist, fontsDist;
});

gulp.task('build', gulp.series('clean', gulp.parallel('img', 'dist')));
gulp.task('dev', gulp.series('clean', gulp.parallel('sass', 'js', 'html'), 'browser-sync'));