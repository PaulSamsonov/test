"use strict";

var gulp = require("gulp"),
  watch = require("gulp-watch"),
  prefixer = require("gulp-autoprefixer"),
  uglify = require("gulp-uglify"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  concat = require("gulp-concat"),
  rigger = require("gulp-rigger"),
  cssmin = require("gulp-cssnano"),
  rimraf = require("rimraf"),
  browserSync = require("browser-sync"),
  reload = browserSync.reload;

var path = {
  build: {
    html: "public/",
    js: "public/js/",
    css: "public/css/",
    img: "public/images/",
    fonts: "public/fonts/",
    data: "public/data"
  },
  src: {
    html: ["src/*.html", "src/favicon.*"],
    js: "src/js/*.*",
    style: "src/style/main.scss",
    img: "src/img/**/*.*",
    fonts: "src/fonts/**/*.*",
    data: "src/data/**/*.*",
    libFonts: [
      "node_modules/bootstrap/dist/fonts/*.*",
      "node_modules/font-awesome/fonts/*.*"
    ],
    libCss: [
      "node_modules/font-awesome/css/font-awesome.min.css",
      "node_modules/swiper/dist/css/swiper.min.css",
      "node_modules/bootstrap/dist/css/bootstrap.min.css",
      "node_modules/aos/dist/aos.css"
    ],
    libJs: [
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/swiper/dist/js/swiper.min.js",
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      "node_modules/lottie-web/build/player/lottie.min.js",
      "node_modules/bodymovin/build/player/bodymovin.min.js",
      "node_modules/aos/dist/aos.js"
    ]
  },
  watch: {
    html: "src/**/*.html",
    js: "src/js/**/*.js",
    style: "src/style/**/*.scss",
    img: "./src/img/**/*.*",
    fonts: "src/font/**/*.*",
    data: "src/data/**/*.*"
  },
  clean: "./public"
};

var config = {
  server: {
    baseDir: "./public"
  },
  host: "localhost",
  port: 3000,
  logPrefix: "landing",
  reloadDelay: 1500
};

function errorAlert(err) {
  console.log(err.toString());
  this.emit("end");
}

gulp.task("html", function() {
  gulp
    .src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({ stream: true }));
});

gulp.task("js", function() {
  gulp
    .src(path.src.js)
    .pipe(rigger().on("error", errorAlert))
    .pipe(sourcemaps.init().on("error", errorAlert))
    .pipe(uglify().on("error", errorAlert))
    .pipe(sourcemaps.write(".").on("error", errorAlert))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({ stream: true }));
});

gulp.task("style", function() {
  gulp
    .src(path.src.style)
    .pipe(sourcemaps.init().on("error", errorAlert))
    .pipe(sass({ compress: false }).on("error", errorAlert))
    .pipe(
      prefixer({
        browsers: ["last 2 version", "Safari 7"]
      }).on("error", errorAlert)
    )
    .pipe(cssmin().on("error", errorAlert))
    .pipe(sourcemaps.write(".").on("error", errorAlert))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({ stream: true }));
});

gulp.task("image", function() {
  gulp.src(path.src.img).pipe(gulp.dest(path.build.img));
});

gulp.task("images", function() {
  gulp
    .src(path.src.img)
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({ stream: true }));
});

gulp.task("fonts", function() {
  gulp
    .src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(reload({ stream: true }));
});

gulp.task("data", function() {
  gulp
    .src(path.src.data)
    .pipe(gulp.dest(path.build.data))
    .pipe(reload({ stream: true }));
});

gulp.task("css:lib", function() {
  gulp
    .src(path.src.libCss)
    .pipe(concat("libs.css").on("error", errorAlert))
    .pipe(gulp.dest(path.build.css));
});

gulp.task("js:lib", function() {
  gulp
    .src(path.src.libJs)
    .pipe(concat("libs.js").on("error", errorAlert))
    .pipe(gulp.dest(path.build.js));
});

gulp.task("fonts:lib", function() {
  gulp.src(path.src.libFonts).pipe(gulp.dest(path.build.fonts));
});

gulp.task("lib", ["css:lib", "js:lib", "fonts:lib"]);

gulp.task("build", ["html", "js", "style", "fonts", "data", "lib", "image"]);

gulp.task("watch", function() {
  watch([path.watch.html], function() {
    gulp.start("html");
  });
  watch([path.watch.style], function() {
    gulp.start("style");
  });
  watch([path.watch.js], function() {
    gulp.start("js");
  });
  watch([path.watch.img], function() {
    gulp.start("images");
  });
  watch([path.watch.fonts], function() {
    gulp.start("fonts");
  });
  watch([path.watch.data], function() {
    gulp.start("data");
  });
});

gulp.task("webserver", function() {
  browserSync(config);
});

gulp.task("clean", function(cb) {
  rimraf(path.clean, cb);
});

gulp.task("default", ["build", "watch", "webserver", "image"]);
