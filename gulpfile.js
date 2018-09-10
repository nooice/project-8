"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var maps = require('gulp-sourcemaps');
var image = require('gulp-image');
var del = require('del');
var pump = require('pump');
var webserver = require('gulp-webserver');
var csso = require('gulp-csso');

gulp.task("concatJS", (cb) => {
    pump([
        gulp.src([
            'js/circle/autogrow.js',
            'js/circle/circle.js'
            ]),
        maps.init(),
        concat('global.js'),
        maps.write('../dist/scripts'),
        gulp.dest('js')
    ],
    cb
    );
});

gulp.task("scripts", ["concatJS"], (cb) => {
    pump([
        gulp.src("js/global.js"),
        uglify(),
        rename("all.min.js"),
        gulp.dest("dist/scripts")
    ],
    cb
    );
});

gulp.task("concatCSS", (cb) => {
    pump([
        gulp.src("sass/global.scss"),
        maps.init(),
        sass(),
        maps.write("./"),
        gulp.dest('css')
    ],
    cb
    );
});

gulp.task("moveCSS", ["concatCSS"], (cb) => {
    pump([
        gulp.src("css/global.css.map"),
        gulp.dest('dist/styles')
    ],
    cb
    );
});

gulp.task("styles", ["moveCSS"], (cb) => {
    pump([
        gulp.src("css/global.css"),
        csso(),
        rename("all.min.css"),
        gulp.dest('dist/styles')
    ],
    cb
    );
});

gulp.task("images", (cb) => {
    pump([
        gulp.src("images/*"),
        image(),
        gulp.dest("dist/content")
    ],
    cb
    );
})

gulp.task('clean', () => {
    del('dist');
});

gulp.task('distribute', ["styles", "images"], (cb) => {
    gulp.start('scripts');
    pump([
        gulp.src("icons/*"),
        gulp.dest("dist/icons")
    ],
    cb
    );
});

gulp.task('build', ["clean"], () => {
    gulp.start('distribute');
});

gulp.task("default", ["build"], (cb) => {
    pump([
        gulp.src('./'),
        webserver({
            fallback: 'index.html'
        })
    ],
    cb
    );
});