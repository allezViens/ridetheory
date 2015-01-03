var gulp = require('gulp');
var pkg = require('./package.json');
/*
 * Auto load all gulp plugins
 */
var gulpLoadPlugins = require('gulp-load-plugins');
var plug = gulpLoadPlugins();
var gutil = plug.loadUtils(['env','log']);

// Run `gulp --production` to totally minify, otherwise `gulp` 
var production = gutil.env.production,
    type = gutil.env.production ? 'production' : 'development';
gutil.log( 'Building for ' + type);

/*
 * `templatecache` has `bundle-js` as a dependency
 */
gulp.task('default', ['bundle-css','templatecache','bundle-libs','index.html']);


/*
 * run `gulp watch` to update on *.scss, *.js, *.html changes
 */
gulp.task('watch',function(){
  plug.watch(pkg.paths.src.sass, function(){
    gulp.start('bundle-css');
  });

  plug.watch(pkg.paths.src.js, function(){
    gulp.start('bundle-js');
  });

  // if any *.html files change, we need to re-concat all angular files
  plug.watch(pkg.paths.src.htmltemplates, function(){
    gulp.start('templatecache');
  });
})

/*
 * Convert *.scss files and @imports into 'style.css'
 * To include another css file in our project, add @import to style.scss
 */
gulp.task('bundle-css',function(){
  return gulp
    .src(pkg.paths.src.css)
    .pipe(plug.plumber())
    .pipe(plug.sass())
    .pipe(plug.minifyCss({
      processImport: true,
      keepBreaks:true,
      relativeTo: '../'
    }))
    .pipe(gulp.dest(pkg.paths.dest))
})

/*
 * Injects angular dependencies
 * uglifies and concats only with --production flag
 */
gulp.task('bundle-js',['createtemplates'],function(){
  return gulp
    .src(pkg.paths.src.js.concat([pkg.paths.dest + '/templates.js']))
    .pipe(plug.size({showFiles: true}))
    .pipe(plug.ngAnnotate({add: true, single_quotes:true}))
    .pipe(plug.concat(pkg.name + '.min.js'))
    .pipe(plug.if(production, plug.uglify({mangle:true})))
    .pipe(gulp.dest(pkg.paths.dest))
    .pipe(plug.size({showFiles: true}));
})

/*
 * Injects angular dependencies
 * uglifies and concats only with --production flag
 */
gulp.task('bundle-libs',function(){
  // returns object containing all bower dependencies
  var bowerfiles = require('wiredep')({
    directory: pkg.paths.src.bower,
    bowerJson: require('../bower.json')
  });
  return gulp
    .src(bowerfiles.js)
    .pipe(plug.size({showFiles: true}))
    .pipe(plug.concat(pkg.name + '.libs.js'))
    .pipe(plug.if(production,plug.uglify()))
    .pipe(gulp.dest(pkg.paths.dest))
    .pipe(plug.size({showFiles: true}));
})

/*
 * Injects bundled dependencies and js into index.html
 * Because of nested file structure, we need to explicitly
 * declare the directory for our files with gulp.src option 
 * `cwd` resolving the pathway to the `/build
 */
var path = require('path');
gulp.task('index.html',['bundle-libs','bundle-js','bundle-css'],function(){
  var sources = gulp.src([
        pkg.paths.dest + '/style.css',
        pkg.paths.dest + '/*libs.js',
        pkg.paths.dest + '/*min.js'],{cwd: path.resolve(__dirname, '..', 'build')});
  return gulp
    .src(pkg.paths.src.index)
    .pipe(plug.inject(sources),{relative: true,})
    .pipe(gulp.dest(pkg.paths.dest));
})

/*
 * removes `templates.js` folder from `../build`
 * after it has been bundled with the app in `bundle-js`
 */
gulp.task('templatecache',['createtemplates','bundle-js'],function() {
  // remove templates.js file from ../build because it's included in bundle-js
  gulp.src(pkg.paths.dest + '/templates.js', {read: false})
    .pipe(plug.clean({force:true}));
});

gulp.task('createtemplates',function() {
  return gulp
    .src(pkg.paths.src.htmltemplates)
    // .pipe(plug.minifyHtml({empty: true}))
    .pipe(plug.angularTemplatecache('templates.js', {
        module: 'app.core',
        standalone: false,
        root: 'app/'
    }))
    .pipe(gulp.dest(pkg.paths.dest));
});

/*
 * Deletes contents of ../build folder
 */
gulp.task('clean',function(){
  return gulp
    .src(pkg.paths.dest + '/*',{read:false})
    .pipe(plug.clean({force:true}));
})

