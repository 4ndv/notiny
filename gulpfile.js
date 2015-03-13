var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    myth = require('gulp-myth');

gulp.task('default', function() {
  gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
  gulp.src('src/*.css')
    .pipe(myth())
    .pipe(gulp.dest('dist'));
});
