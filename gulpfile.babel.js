import { spawn } from "child_process";
import del from "del";
import gulp from "gulp";
import sass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import merge from "merge-stream";
import rev from "gulp-rev";
import revReplace from "gulp-rev-replace";
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
gulp.task("assets", copyAssets());
gulp.task("assets:prod", copyAssets("prod"));
gulp.task("hash", gulp.series(hashAssets, rewriteAssets));
gulp.task("build", gulp.parallel("js", "scss", "hugo", "assets"));
gulp.task("build:prod", gulp.parallel("js:prod", "scss:prod", "hugo:prod", "assets:prod"));
gulp.task("server", gulp.series("clean", "build", startBrowserSync));
gulp.task("deploy", gulp.series("clean:prod", "build:prod", "hash"));

function bundleJS(mode) {
  let config = Object.assign({}, devConfig);
  config.mode = "development";

  if (mode === "prod") {
    config = Object.assign({}, prodConfig);
    config.mode = "production";
  }

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
  let path = "dev/assets/css";
  let cssPlugins = [
    autoprefixer()
  ];

  if (mode === "prod") {
    path = "dist/assets/css";
    cssPlugins.push(cssnano());
  }

  return function compileCSS() {
    return gulp.src("src/scss/*.scss")
      .pipe(sass({ includePaths: ["node_modules"] }).on("error", sass.logError))
      .pipe(postcss(cssPlugins))
      .pipe(gulp.dest(path))
      .pipe(browserSync.stream());
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
        browserSync.notify("Hugo build failed :(");
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

function hashAssets() {
  return gulp.src(["dist/assets/**/*.js", "dist/assets/**/*.css", "!dist/assets/**/*.map"])
    .pipe(rev())
    .pipe(gulp.dest("dist/assets"))
    .pipe(rev.manifest())
    .pipe(gulp.dest("dist/assets"));
}

function rewriteAssets() {
  const revManifest = gulp.src("dist/assets/rev-manifest.json");

  return gulp.src("dist/**/*.html")
    .pipe(revReplace({ manifest: revManifest }))
    .pipe(gulp.dest("dist"));
}

function startBrowserSync() {
  browserSync.init({
    server: {
      baseDir: "dev"
    }
  });

  gulp.watch("src/js/*.js", bundleJS());
  gulp.watch("src/scss/*.scss", compileCSS());
  gulp.watch("src/hugo/**/*", runHugo());
}
