'use strict';

var gulp = require('gulp');

var API_SPEC = 'src/api.raml';
var API_DEST = 'public';
var API_HTML = 'index.html';

var paths = {
  scripts: ['src/js/**/*.coffee', '!src/external/**/*.coffee'],
  images: 'src/img/**/*',
  raml: 'src/*.raml'
  };

function raml2html(options) {
  var path = require('path');
  var gutil = require('gulp-util');
  var through = require('through2');
  var raml2html = require('raml2html');

  var simplifyMark = function(mark) {
    if (mark) mark.buffer = mark.buffer.split('\n', mark.line + 1)[mark.line].trim();
  }

  if (!options) options = {};
  switch (options.type) {
    case 'json':
      options.config = {template: function(obj) { return JSON.stringify(obj, null, 2); }};
      break;
    case 'yaml':
      var yaml = require('js-yaml');
      options.config = {template: function(obj) { return yaml.safeDump(obj, {skipInvalid: true}); }};
      break;
    default:
      options.type = 'html';
      if (!options.config) options.config = raml2html.getDefaultConfig(
          options.https, options.template, options.resourceTemplate, options.itemTemplate);
  }
  if (!options.extension) options.extension = '.' + options.type;

  var stream = through.obj(function(file, enc, done) {
    var fail = function(message) {
      done(new gutil.PluginError('raml2html', message));
    };
    if (file.isBuffer()) {
      var cwd = process.cwd();
      process.chdir(path.resolve(path.dirname(file.path)));
      raml2html.render(file.contents, options.config,
        function(output) {
          process.chdir(cwd);
          stream.push(new gutil.File({
            base: file.base,
            cwd: file.cwd,
            path: gutil.replaceExtension(file.path, options.extension),
            contents: new Buffer(output)
          }));
          done();
        },
        function(error) {
          process.chdir(cwd);
          simplifyMark(error.context_mark);
          simplifyMark(error.problem_mark);
          process.nextTick(function() {
            fail(JSON.stringify(error, null, 2));
          });
        });
    }
    else if (file.isStream()) fail('Streams are not supported: ' + file.inspect());
    else if (file.isNull()) fail('Input file is null: ' + file.inspect());
  });

  return stream;
}

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('apidoc', function() {
  var rename = require('gulp-rename');

  return gulp.src(API_SPEC)
    .pipe(raml2html())
    .on('error', handleError)
    .pipe(rename(API_HTML))
    .pipe(gulp.dest(API_DEST));
});

gulp.task('apijson', function() {
  return gulp.src(API_SPEC)
    .pipe(raml2html({type: 'json'}))
    .on('error', handleError)
    .pipe(gulp.dest(API_DEST));
});

gulp.task('apiyaml', function() {
  return gulp.src(API_SPEC)
    .pipe(raml2html({type: 'yaml'}))
    .on('error', handleError)
    .pipe(gulp.dest(API_DEST));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.raml, ['apidoc']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'apidoc']);
