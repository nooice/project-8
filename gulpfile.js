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

gulp.task("concatJS", (cb) => {
    pump([
        gulp.src([
            'js/circle/autogrow.js',
            'js/circle/circle.js'
            ]),
        maps.init(),
        concat('global.js'),
        maps.write('./'),
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

gulp.task("styles", (cb) => {
    pump([
        gulp.src("sass/global.scss"),
        maps.init(),
        sass(),
        maps.write("./"),
        gulp.dest('dist/styles'),
        gulp.dest('css')
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

// gulp.task('webserver', () => {
//     // gulp
// })

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