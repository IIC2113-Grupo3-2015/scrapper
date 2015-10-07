var gulp = require('gulp');
var coffee = require('gulp-coffee');

gulp.task('default', function() {
  gulp.src('./*.coffee')
    .pipe(coffee( { bare: true } ))
    .pipe(gulp.dest('./build/'));

  gulp.src('./settings.json')
    .pipe(gulp.dest('./build/'));

  gulp.src('./src/*.coffee')
    .pipe(coffee( { bare: true } ))
    .pipe(gulp.dest('./build/src/'));
});

var watcher = gulp.watch(['app.coffee', './settings.json', './src/*.coffee'], ['default']);

watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});