import { spawn } from "child_process";
import HugoBin from "hugo-bin";
import gulp from "gulp";
import sass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import webpack from "webpack";
import BrowserSync from "browser-sync";
import devConfig from "./webpack.dev.js";
import prodConfig from "./webpack.prod.js";

const browserSync = BrowserSync.create();

gulp.task("favicon", copyFavicon());
gulp.task("favicon:prod", copyFavicon("prod"));
gulp.task("js", bundleJS());
gulp.task("js:prod", bundleJS("prod"));
gulp.task("scss", compileCSS());
gulp.task("scss:prod", compileCSS("prod"));
gulp.task("hugo", runHugo());
gulp.task("hugo:prod", runHugo("prod"));

const devBuild = gulp.parallel("hugo", "js", "scss", "favicon");
const prodBuild = gulp.parallel("hugo:prod", "js:prod", "scss:prod", "favicon:prod");

gulp.task("server", gulp.series(devBuild, startBrowserSync));
gulp.task("deploy", prodBuild);

function copyFavicon(mode) {
  const path = mode === "prod" ? "dist" : "dev";

  return function() {
    return gulp.src("./src/favicon/*")
    .pipe(gulp.dest(path));
  }
}

function bundleJS(mode) {
  let config = Object.assign({}, devConfig);
  config.mode = "development";

  if (mode === "prod") {
    config = Object.assign({}, prodConfig);
    config.mode = "production";
  }

  return function(done) {
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

  return function() {
    return gulp.src("./src/scss/*.scss")
      .pipe(sass({ includePaths: ["node_modules"] }).on("error", sass.logError))
      .pipe(postcss(cssPlugins))
      .pipe(gulp.dest(path))
      .pipe(browserSync.stream());
  }
}

function runHugo(mode) {
  let path = "../dev";
  let args = null;

  if (mode === "prod") {
    path = "../dist";
  }

  args = ["-v", "-d", path, "-s", "hugo"];

  return function(done) {
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

function startBrowserSync() {
  browserSync.init({
    server: {
      baseDir: "dev"
    }
  });

  gulp.watch("src/js/*.js", bundleJS());
  gulp.watch("src/scss/*.scss", compileCSS());
  gulp.watch("hugo/**/*", runHugo());
}
