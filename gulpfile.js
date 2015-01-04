var gulp = require('gulp'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream,
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence'),
    es = require('event-stream'),
    karma = require('karma').server;

var paths = {
  bower : "./client/bower_components/",
  index : "./client/index.html",
  client : "./client/",
  sass: "./client/conent/sass/style.scss",
  app: "./client/app/app.module.js",
  angular: ["./client/app/app.module.js","./client/app/**/*module*.js","./client/app/**/*.js",]
}

var ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');
gulp.task('ng-annotate',function(){
  return gulp
    .src(paths.angular)
    .pipe(ngAnnotate({add: true, single_quotes:true}))
    .pipe(uglify({mangle:true}))
    .pipe(gulp.dest('./build'))
})

// Compile all .scss files ----> styles.css
gulp.task('sass', function () {
    return gulp
      .src(paths.sass)
      .pipe(sass())
      .pipe(gulp.dest(paths.client));
});

// Inject all bower dependencies listed in bower.json ---> index.html
gulp.task('bower', function () {  
  gulp.src(paths.index)
    .pipe(wiredep({
      directory: paths.bower,
      bowerJson: require('./bower.json'),
    }))
    .pipe(gulp.dest(paths.client));
});

// gulp.task('core', function () {
//     var app = gulp.src(paths.app, {read:false});
//     var options = { read:false, name: 'core', ignorePath: '/client' };  
    
//     return gulp.src( paths.index )
//       .pipe( inject( es.merge( app ), options))
//       .pipe( gulp.dest( paths.client ) )
// })


gulp.task('watch', function() {
  gulp.watch('./client/conent/sass/*.scss', ['sass']);
});

gulp.task('karma', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
  }, done);
});

gulp.task('default', ['core', 'sass','bower','watch']);

