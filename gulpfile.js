var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    myth = require('gulp-myth'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename'),
    coffee = require('gulp-coffee'),
    coffeelint = require('gulp-coffeelint');

gulp.task('scripts', function() {
  gulp.src('src/notiny.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(uglify())
    .pipe(rename('notiny.min.js'))
    .pipe(gulp.dest('dist'));
  gulp.src('src/notiny.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(rename('notiny.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
  gulp.src('src/notiny.css')
    .pipe(myth())
    .pipe(csso())
    .pipe(rename('notiny.min.css'))
    .pipe(gulp.dest('dist'));
  gulp.src('src/notiny.css')
    .pipe(myth())
    .pipe(gulp.dest('dist'));
})

gulp.task('lint', function() {
  gulp.src('src/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
})

gulp.task('watch', function() {
  gulp.start('default');
  gulp.watch('src/notiny.coffee', ['scripts', 'lint']);
  gulp.watch('src/notiny.css', ['styles']);
});

gulp.task('default', ['scripts', 'styles', 'lint']);