import gulp from 'gulp';
import sass from 'gulp-sass';
import yargs from "yargs";
import autoprefixer from 'gulp-autoprefixer';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import merge from 'merge-stream';
import gzip from 'gulp-gzip';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import csstree from 'gulp-csstree';
import minify from 'gulp-minify';
import sourcemaps from 'gulp-sourcemaps';
import debug from 'gulp-debug';
import injectPartials from 'gulp-inject-partials';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import del from 'del';
import webpack from "webpack-stream";
import info from './package.json';

const serverSync = browserSync.create();
const PRODUCTION = yargs.argv.prod;
const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/assets/styles/',
    plugin: 'dist/assets/styles/plugin/',
    subPlugin:'dist/assets/styles/plugin/'
  },
  jqueryJs: {
    src: './node_modules/jquery/dist/jquery.min.js',
    dest:'dist/assets/scripts/jquery/'
  },
  scripts: {
    src: 'src/scripts/*.js',
    dest: 'dist/assets/scripts/',
    plugin: 'dist/assets/scripts/plugin/',
    subPlugin: 'dist/assets/scripts/plugin/'
  },
  images:{
    src:'src/images/**/*.{jpg,png,jpeg,svg,gif}',
    dest:'dist/assets/images/'
  },
  html:{
    src:'src/*.html',
    dest:'dist/'
  },
  other: {
    src: [
      "src/assets/**/*",
      "!src/assets/{images,js,scss}",
      "!src/assets/{images,js,scss}/**/*"
    ],
    dest: "dist/assets"
  },
  package:{
    src:['**/*','!.vscode','!node_modules{,/**}', '!packaged{,/**}', '!src{,/**}', '!.babelrc','!.gitignore', '!gulpfile.babel.js', '!package.json', '!package-lock.json' ],
    dest:'packaged'
  }
};

export const serve = (done) => {
  serverSync.init([paths.styles.dest + '/*.css', paths.html.dest + '*.html', paths.scripts.dest + '*.js'],
  {
    /* proxy: "http://localhost:8888",
    port:'3000', */
    server:{
      baseDir:paths.html.dest
    }
  });
  done();
}

export const reload = (done) => {
  serverSync.reload();
  done();
}

export const clean = () => del([ 'dist' ]);

/* ------------- Tum Sayfalar Css ---------------- */
export const styles = () => {
  return gulp.src(paths.styles.src)
        .pipe(autoprefixer())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(csstree.failAfterError())
        .pipe(rename({
          basename: 'main',
          suffix: '.min'
        }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(serverSync.stream());
}

/* ------------- Anasayfa Plugin Css ---------------- */
const PluginCss = [
  './node_modules/bootstrap/dist/css/bootstrap.css', 
  './node_modules/rocket-loader/css/loader.min.css',
  './node_modules/animate.css/animate.css',
  './node_modules/owl.carousel2/dist/assets/owl.carousel.css',
  './node_modules/aos/dist/aos.css',
];

export const pluginCss = () => {
  return gulp.src(PluginCss)
    .pipe(autoprefixer())
        //.pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(csstree.failAfterError())
        .pipe(rename({
          basename: 'plugins',
          suffix: '.min'
        }))
        .pipe(concat('plugins.min.css'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.styles.plugin))
        .pipe(serverSync.stream());
}

/* ------------- Alt Sayfa Plugin Css ---------------- */
const subPluginCss = [
  './node_modules/bootstrap/dist/css/bootstrap.css', 
  './node_modules/rocket-loader/css/loader.min.css',
  './node_modules/animate.css/animate.css',
  './node_modules/owl.carousel2/dist/assets/owl.carousel.css',
  './node_modules/aos/dist/aos.css',
  './node_modules/magnific-popup/dist/magnific-popup.css',
  './node_modules/chart.js/dist/Chart.min.css',
  './src/styles/dropzone.min.css',
];

export const SubPagePluginCss = () => {
  return gulp.src(subPluginCss)
    .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename({
          basename: 'plugins',
          suffix: '.min'
        }))
        .pipe(concat('sub_plugins.min.css'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.styles.subPlugin))
        .pipe(serverSync.stream());
}
/* ------------- JQUERY JS ---------------- */
export const jqueryJS = () => {
  return gulp.src(paths.jqueryJs.src, { sourcemaps: true })
    .pipe(babel())
    /* .pipe(
      webpack({
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader:'babel-loader',
                options: {
                  presets: ["@babel/preset-env"]
                }
              }
            }
          ]
        },
        output: {
          filename:'[name].js'
        },
        externals:{
          jqery:'jQuery'
        },
        devtool:!PRODUCTION ? 'inline-source-map': false
      })
    ) */
    .pipe(uglify())
    //.pipe(concat('main.min.js'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.jqueryJs.dest));
}

/* ------------- ORTAK JS ---------------- */
export const scripts = () => {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    /* .pipe(
      webpack({
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader:'babel-loader',
                options: {
                  presets: ["@babel/preset-env"]
                }
              }
            }
          ]
        },
        output: {
          filename:'[name].js'
        },
        externals:{
          jqery:'jQuery'
        },
        devtool:!PRODUCTION ? 'inline-source-map': false
      })
    ) */
    .pipe(uglify())
    //.pipe(concat('main.min.js'))
    .pipe(minify({
      ext:{
          src:'-debug.js',
          min:'-min.js'
      },
      exclude: ['tasks'],
      ignoreFiles: ['.combo.js', '-min.js']
  }))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.scripts.dest));
}

/* ------------- ANASAYFA PLUGIN JS ---------------- */
const PluginJS = [
  './node_modules/bootstrap/dist/js/bootstrap.js',
  /* './node_modules/rocket-loader/js/loader.min.js', */
  './node_modules/aos/dist/aos.js',
  './node_modules/owl.carousel2/dist/owl.carousel.min.js',
  './node_modules/jquery.animate-number/jquery.animateNumber.min.js',
  './src/scripts/plugins/rater.js',
  
]
export const pluginJS = () => {
  return gulp.src(PluginJS, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('plugins.min.js'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.scripts.plugin));
}

/* ------------- ALT SAYFA PLUGIN JS ---------------- */
const subPluginJS = [
  './node_modules/bootstrap/dist/js/bootstrap.js',
  /* './node_modules/rocket-tools/js/tools.min.js', */
  /* './node_modules/aos/dist/aos.js', */
  './node_modules/owl.carousel2/dist/owl.carousel.min.js',
  './src/scripts/plugins/rater.js',
  './node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
  './node_modules/chart.js/dist/Chart.min.js',
  './src/scripts/plugins/dropzone.min.js'
];

export const SubPagePluginJs = () => {
  return gulp.src(subPluginJS, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('sub_plugins.min.js'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.scripts.subPlugin));
}

/* ------------- IMAGE MINIFY ---------------- */
export const images = () => {
  return gulp.src(paths.images.src)
  .pipe(newer(paths.images.dest))
  .pipe(imagemin())
  .pipe(sourcemaps.init())
  .pipe(gulp.dest(paths.images.dest))
}

/* ------------- HTML ---------------- */
export const index = () => {
  return gulp.src(paths.html.src)
  .pipe(debug())
        .pipe(injectPartials())
  .pipe(gulp.dest(paths.html.dest))
}

/* ------------- TERMINALDE IZLEME ---------------- */
export const watch = () => {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.scripts.plugin, pluginJS);
  gulp.watch(paths.scripts.subPlugin, SubPagePluginJs);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.styles.plugin, pluginCss);
  gulp.watch(paths.styles.subPlugin, SubPagePluginCss);
  gulp.watch(paths.html.src, index);
}

/* ------------- ZIP OLARAK SIKISTIRMA ---------------- */
export const compress = () => {
  return gulp.src(paths.package.src)
  .pipe(replace('bProject', info.name))
  .pipe(zip(`${info.name}.zip`))
  .pipe(gulp.dest(paths.package.dest));
}

/* ------------- DEFAULT ---------------- */
export const dev = gulp.series(
  clean,
  gulp.parallel(styles, pluginCss, SubPagePluginCss, jqueryJS, scripts, pluginJS, SubPagePluginJs, images, index),
  serve, watch
);


export const build = gulp.series(clean, gulp.parallel(styles, pluginCss, SubPagePluginCss, jqueryJS, scripts, pluginJS, SubPagePluginJs, images, index));
export const bundle = gulp.series(build, compress);

export default dev;