const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer')

gulp.task('sass', function () {
  return gulp.src('./sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/*.sass', ['sass']);//'./sass/*.sass'有變動就執行gulp task 'sass'
});

gulp.task('prefix', () =>
    gulp.src('./css/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist'))
);
gulp.task('prefix:watch', function () {
  gulp.watch('./css/*.css', ['prefix']);
});
gulp.task('all:watch' ,['prefix:watch', 'sass:watch'])