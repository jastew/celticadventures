var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
//var postcss      = require('gulp-postcss');
var autoprefixer = require('gulp-autoprefixer');
var pixrem       = require('gulp-pixrem');
var cp           = require('child_process');
var watch        = require('gulp-watch');

// Jekyll Build
gulp.task('jekyll-build', function (done) {
  browserSync.notify('Jekyll Build');
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

// Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

// Static Server + watching scss/html files
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {

    browserSync.init({
        server: "_site/"
    });

});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  console.log('Sassing');
    return gulp.src("_scss/main.scss")
        .pipe(sass())
        .pipe(autoprefixer({
          browsers: ['last 2 versions']
        }))
        .pipe(pixrem('100%'))
        .pipe(gulp.dest("_site/css"))
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest('css'));
});

// Watch for changes
gulp.task('watch', function () {

    watch("_scss/**/*.scss", function () {
      gulp.start('sass');
    });
    watch(['*.html', '_layouts/*.html', '_posts/*'], function () {
      gulp.start('jekyll-rebuild');
    });

});

gulp.task('default', ['browser-sync', 'watch']);
