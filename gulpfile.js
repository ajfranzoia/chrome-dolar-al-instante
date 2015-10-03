var gulp = require('gulp');
var path = require('path');
var del = require('del');
var browserify = require('browserify');
var argv = require('yargs').argv;
var config = require('./gulp.config.js');
var packageInfo = require('./package.json');
var $ = require('gulp-load-plugins')();


gulp.task('watch', ['build'], function () {
  gulp.watch('src/**/*.js', ['build:js']);
  gulp.watch('src/**/*.less', ['build:styles']);
  gulp.watch('src/**/*.html', ['build:other']);
});

gulp.task('clean', function(cb) {
  del(['build-dev', 'build-dist'], cb());
});

gulp.task('build', ['build:styles', 'build:js', 'build:other', 'build:finish']);
  gulp.task('build:js', ['build:js:popup', 'build:js:background']);

gulp.task('build:styles', function(cb) {
  return gulp.src(config.styles)
    .pipe($.less({
      paths: [ path.join(__dirname, 'bower_components') ]
    }))
    .pipe($.if(isDist(), $.minifyCss()))
    .pipe($.rename('extension.css'))
    .pipe(gulp.dest(buildPath('css')));
});

gulp.task('build:js:popup', function() {
  var filter = $.filter(['src/**/*.js', '!src/js/popup/ga.js'], {restore: true});

  return gulp.src(filterFiles(config.scripts.popup), {base: '.'})
    .pipe(filter)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe(filter.restore)
    .pipe($.concat('popup.js'))
    .pipe($.ngAnnotate())
    .pipe($.if(isDist(), $.uglify()))
    .pipe(gulp.dest(buildPath('js')));
});

gulp.task('build:js:background', function() {
  return gulp.src(config.scripts.background)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe($.concat('background.js'))
    .pipe($.browserify({
      insertGlobals: true,
      debug: isDev()
    }))
    .pipe($.if(argv.dist, $.uglify()))
    .pipe(gulp.dest(buildPath('js')));
});

gulp.task('build:other', function(cb) {
  return gulp.src(config.other, {base: 'src'})
    .pipe(gulp.dest(buildPath()));
});

gulp.task('build:finish', ['build:styles', 'build:js', 'build:other'], function(cb) {
  if (isDist()) {
    return gulp.src('build-dist/*')
      .pipe($.zip('dist-' + packageInfo.version + '.zip'))
      .pipe(gulp.dest('build-dist'));
  } else {
    cb();
  }
});


/**
 * Auxiliary functions
 */

function buildPath(path) {
  return (isDev() ? 'build-dev' : 'build-dist') + (path ? '/' + path : '');
}

function isDist() {
  return argv.dist;
}

function isDev() {
  return !isDist();
}

function filterFiles(input) {
  var output = [];
  input.forEach(function(item) {
    var path;

    if (typeof item === 'string') {
      output.push(item);
      return;
    }

    if (item.env === 'dist' && !isDev()) {
      output.push(item.path);
      return;
    }

    if (item.env === 'dev' && isDev()) {
      output.push(item.path);
      return;
    }
  });

  return output;
}
