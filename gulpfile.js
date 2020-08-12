const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plugins = require('gulp-load-plugins')();

function clean() {
    return gulp.src('dest')
        .pipe(plugins.clean())
    ;
}

// Copy vendor libs to source dir
function vendors() {
    return gulp.src('node_modules/normalize.css/normalize.css')
        .pipe(plugins.sass({outputStyle: 'compressed'}))
        .pipe(plugins.rename('_normalize.scss'))
        .pipe(gulp.dest('src/sass/vendor'))
        .pipe(browserSync.stream())
    ;
}

function html() {
    return gulp.src('src/html/*.html')
        .pipe(plugins.rigger())
        .pipe(gulp.dest('dest'))
        .pipe(browserSync.stream())
    ;
}

function sass() {
    return gulp.src('src/sass/*.scss')
        .pipe(plugins.sass({outputStyle: 'expanded'}).on('error', plugins.sass.logError))
        // .pipe(plugins.sass({outputStyle: 'compressed'}).on('error', plugins.sass.logError))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('dest/assets/css'))
        .pipe(browserSync.stream())
    ;
}

function js() {
    return gulp.src('src/js/*.js', { sourcemaps: true })
        .pipe(plugins.rigger())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('dest/assets/js'))
        .pipe(browserSync.stream())
    ;
}

function assets() {
    return gulp.src('src/assets/**')
        .pipe(gulp.dest('dest/assets'))
    ;
}

function watcher() {
    browserSync.init({
        server: {
            baseDir: 'dest'
        }
    });

    gulp.watch('src/html/**/*.html', html).on('change', browserSync.reload);
    gulp.watch('src/sass/**/*.scss', sass).on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js', js).on('change', browserSync.reload);
}

const build = gulp.series(assets, vendors, gulp.parallel(html, sass, js));
const watch = gulp.series(build, watcher);

exports.clean = clean;
exports.vendors = vendors;
exports.assets = assets;
exports.html = html;
exports.sass = sass;
exports.js = js;
exports.watch = watch;
exports.build = build;
exports.default = build;
