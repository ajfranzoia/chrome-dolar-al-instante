var gulp = require('gulp'),
    path = require('path'),
    del = require('del'),
    argv = require('yargs').argv,
    $ = require('gulp-load-plugins')(),
    gulpsync = require('gulp-sync')(gulp),
    package = require('./package.json'),
    config = require('./config.json'),
    provider = config.providers[getProvider()];

// Watch task
gulp.task('watch', ['build'], function () {
  gulp.watch('src/**/*.js', ['build:js']);
  gulp.watch('src/**/*.less', ['build:styles']);
  gulp.watch('src/**/*.html', ['build:other']);
});

// Clean tmp and build dirs task
gulp.task('clean', function() {
  return del(['tmp', 'build']);
});

// Prepare files before build task
gulp.task('prepareBuild', function() {
  return gulp.src(['src/_base/**/*', 'src/' + getProvider() + '/**/*']).pipe(gulp.dest('tmp'));
});

// Main build task
gulp.task('build', gulpsync.sync(['clean', 'prepareBuild', ['build:js', 'build:styles', 'build:other', 'build:replaceVars'], 'pack']));

// Build js task, for popup and background
gulp.task('build:js', ['build:js:popup', 'build:js:background']);

// Build styles task
gulp.task('build:styles', function() {
  return gulp
    .src(config.sourceFiles.styles, {cwd: 'tmp'})
    .pipe($.less({
      paths: [ path.join(__dirname, 'bower_components') ]
    }))
    .pipe($.if(isDist(), $.minifyCss()))
    .pipe($.rename('extension.css'))
    .pipe(gulp.dest(buildPath('css')));
});

// Build popup js task
gulp.task('build:js:popup', function() {
  var files = config.sourceFiles.scripts.popup;

  return gulp
    .src(files, {cwd: 'tmp'})
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe($.concat('popup.js'))
    .pipe($.ngAnnotate())
    .pipe($.if(isDist(), $.uglify()))
    .pipe(gulp.dest(buildPath('js')));
});

// Build background js task
gulp.task('build:js:background', function() {
  var files = config.sourceFiles.scripts.background;

  return gulp
    .src(files, {cwd: 'tmp'})
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

// Build other files task
gulp.task('build:other', function() {
  return gulp
    .src(config.sourceFiles.other, {cwd: 'tmp'})
    .pipe(gulp.dest(function (file) {
      var dir = path.basename(file.base);
      return buildPath(dir === 'tmp' ? '' : dir);
    }));
});

// Replace variables task
gulp.task('build:replaceVars', ['build:other'], function() {
  return gulp
    .src(buildPath('manifest.json'))
    .pipe($.replace('@@VERSION@@', package.version))
    .pipe($.replace('@@REVIEW_URL@@', provider.reviewUrl))
    .pipe(gulp.dest(buildPath()));
});

// Pack task
gulp.task('pack', function() {
  if (isDist) {
    return gulp
      .src('build/dist/**')
      .pipe($.zip('dist-' + package.version + '.zip'))
      .pipe(gulp.dest('build/dist'));
  }
});


/**
 * Auxiliary functions
 */

function buildPath(path) {
  return [(isDev() ? 'build/dev' : 'build/dist'), getProvider(), path].join('/');
}

function isDist() {
  return argv.dist;
}

function isDev() {
  return !isDist();
}

function getProvider() {
  var provider;

  if (this._provider) {
    return this._provider;
  }

  provider = argv.provider || argv.p;

  if (!provider || ['chrome', 'firefox'].indexOf(provider) === -1) {
    throw new Error('Invalid provider');
  }

  this._provider = provider;

  return provider;
}

