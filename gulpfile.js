const gulp = require('gulp');
const sass = require('gulp-sass');
 
gulp.task('sass', function () {
  return gulp.src('./sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/*.sass', ['sass']);//'./sass/*.sass'有變動就執行gulp task 'sass'
});