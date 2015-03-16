var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    myth = require('gulp-myth'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename');

gulp.task('default', function() {
  gulp.src('src/notiny.js')
    .pipe(uglify())
    .pipe(rename('notiny.min.js'))
    .pipe(gulp.dest('dist'));
  gulp.src('src/notiny.js')
    .pipe(gulp.dest('dist'));
  gulp.src('src/notiny.css')
    .pipe(myth())
    .pipe(csso())
    .pipe(rename('notiny.min.css'))
    .pipe(gulp.dest('dist'));
  gulp.src('src/notiny.css')
    .pipe(myth())
    .pipe(gulp.dest('dist'));
});
