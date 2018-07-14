import { spawn } from "child_process";
import del from "del";
import gulp from "gulp";
import sourcemaps from "gulp-sourcemaps";
import sass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import gulpif from "gulp-if";
import rev from "gulp-rev";
import revFormat from "gulp-rev-format";
import revRewrite from "gulp-rev-rewrite";
import merge from "merge-stream";
import webpack from "webpack";
import BrowserSync from "browser-sync";
import HugoBin from "hugo-bin";
import devConfig from "./webpack.dev.js";
import prodConfig from "./webpack.prod.js";

const browserSync = BrowserSync.create();

gulp.task("clean", () => del("dev"));
gulp.task("clean:prod", () => del("dist"));
gulp.task("js", bundleJS());
gulp.task("js:prod", bundleJS("prod"));
gulp.task("scss", compileCSS());
gulp.task("scss:prod", compileCSS("prod"));
gulp.task("hugo", runHugo());
gulp.task("hugo:prod", runHugo("prod"));
gulp.task("copy", copyAssets());
gulp.task("copy:prod", copyAssets("prod"));

gulp.task("compile", gulp.parallel("js", "scss", "hugo", "copy"));
gulp.task("compile:prod", gulp.parallel("js:prod", "scss:prod", "hugo:prod", "copy:prod"));
gulp.task("build", gulp.series("clean", "compile"));
gulp.task("build:prod", gulp.series("clean:prod", "compile:prod", rewriteCSSPaths, rewriteJSPaths));
gulp.task("server", gulp.series("build", startServer));
gulp.task("deploy", gulp.series("build:prod"));

function bundleJS(mode) {
  const config = Object.assign({}, mode === "prod" ? prodConfig : devConfig);

  return function bundleJS(done) {
    webpack(config, (err, stats) => {
      if (err) {
        console.error(err.stack || err);

        if (err.details) {
          console.error(err.details);
        }

        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      console.log(stats.toString({
        colors: true,
        progress: true
      }));

      browserSync.reload();
      done();
    });
  }
}

function compileCSS(mode) {
  const isProduction = mode === "prod";
  const plugins = [
    autoprefixer()
  ];
  let path = "dev/assets/css";

  if (isProduction) {
    path = "dist/assets/css";
    plugins.push(cssnano());
  }

  return function compileCSS() {
    return gulp.src("src/scss/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass({ includePaths: ["node_modules"] }).on("error", sass.logError))
      .pipe(postcss(plugins))
      .pipe(gulpif(isProduction, rev()))
      .pipe(gulpif(isProduction, revFormat({ prefix: "." })))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest(path))
      .pipe(browserSync.stream())
      .pipe(gulpif(isProduction, rev.manifest()))
      .pipe(gulpif(isProduction, gulp.dest(path)));
  }
}

function runHugo(mode) {
  let path = "../../dev";
  let args = null;

  if (mode === "prod") {
    path = "../../dist";
  }

  args = ["-v", "-d", path, "-s", "src/hugo"];

  return function runHugo(done) {
    spawn(HugoBin, args, { stdio: "inherit" }).on("close", code => {
      if (code === 0) {
        browserSync.reload();
        done();
      } else {
        browserSync.notify("Hugo build failed.");
        done("Hugo build failed.");
      }
    }).on("error", err => {
      console.log(err);
    });
  }
}

function copyAssets(mode) {
  const path = mode === "prod" ? "dist" : "dev";

  return function copyAssets() {
    const favicon = gulp.src("src/favicon/*")
      .pipe(gulp.dest(path));

    const fonts = gulp.src("src/fonts/*")
      .pipe(gulp.dest(path + "/assets/fonts"));

    const img = gulp.src("src/img/**/*")
      .pipe(gulp.dest(path + "/assets/img"));

    return merge(favicon, fonts, img);
  }
}

function rewriteCSSPaths() {
  const revManifest = gulp.src("dist/assets/css/rev-manifest.json");
  const cssPrefixFn = prefixPath("/assets/css");

  return gulp.src("dist/**/*.html")
    .pipe(revRewrite({
      manifest: revManifest,
      modifyUnreved: cssPrefixFn,
      modifyReved: cssPrefixFn
    }))
    .pipe(gulp.dest("dist"));
}

function rewriteJSPaths() {
  const webpackManifest = gulp.src("dist/assets/js/webpack-manifest.json");
  const jsPrefixFn = prefixPath("/assets/js");

  return gulp.src("dist/**/*.html")
    .pipe(revRewrite({
      manifest: webpackManifest,
      modifyUnreved: jsPrefixFn,
      modifyReved: jsPrefixFn
    }))
    .pipe(gulp.dest("dist"));
}

function prefixPath(path) {
  return filename => path + "/" + filename;
}

function startServer(done) {
  browserSync.init({
    server: {
      baseDir: "dev"
    }
  });

  gulp.watch("src/js/*.js", bundleJS());
  gulp.watch("src/scss/*.scss", compileCSS());
  gulp.watch("src/hugo/**/*", runHugo());

  done();
}
