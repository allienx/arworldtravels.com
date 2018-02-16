import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import sass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import BrowserSync from "browser-sync";
import watch from "gulp-watch";
import webpack from "webpack";
import webpackConfig from "./webpack.config";

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "hugo", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// PostCSS plugins
const cssPlugins = [
  autoprefixer({ browsers: ["last 2 versions"]}),
  cssnano()
];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Build/production tasks
gulp.task("build", ["favicon", "css", "js"], (cb) => buildSite(cb, [], "production"));
gulp.task("build-preview", ["favicon", "css", "js"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

// Compile SCSS with gulp-sass and PostCSS
gulp.task("css", () => (
  gulp.src("./src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(cssPlugins))
    .pipe(gulp.dest("./dist/assets/css"))
    .pipe(browserSync.stream())
));

// Compile Javascript
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

gulp.task("favicon", () => {
  gulp.src("./src/favicon/*")
    .pipe(gulp.dest("./dist"))
});

// Development server with browsersync
gulp.task("server", ["hugo", "favicon", "css", "js"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  watch("./src/js/**/*.js", () => { gulp.start(["js"]) });
  watch("./src/scss/**/*.scss", () => { gulp.start(["css"]) });
  watch("./hugo/**/*", () => { gulp.start(["hugo"]) });
});

// Run hugo and build the site
function buildSite(cb, options, environment = "development") {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
