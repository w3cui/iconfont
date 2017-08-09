var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var clean = require("gulp-clean");
var taskListing = require("gulp-task-listing");
var template = require("gulp-template");
var rename = require('gulp-rename');

var del = require("del");

var fs = require("fs");
var util = require("./en-cn.js");

// 发布项目
var filt = ["andaren", "dome2", "dome3"],
    task = {
        // 发布打包
        iconfont: function(name) {
            return gulp.src('./src/' + name + '/icons/*.svg')
                .pipe(rename(function(path) {
                    path.basename = util.getPym(path.basename, true);
                }))
                .pipe(iconfontCss({
                    fontName: fontName,
                    path: './src/templates/iconfont.css',
                    targetPath: '../css/iconfont.css',
                    fontPath: '../fonts/'
                }))
                .pipe(iconfont({
                    fontName: fontName,
                    formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
                    normalize: true,
                    options: {
                        fixedWidth: false,
                        normalize: false,
                        fontHeight: 512,
                        descent: -32,
                        normalize:true
                      }
                }))
                .on('glyphs', function(glyphs, options) {
                    // CSS templating, e.g.           
                    //console.log(glyphs, options);
                })
                .pipe(gulp.dest('./build/' + name + '/fonts/'));
        },
        example: function(name) {

            //console.log(this.icons(name));
            return gulp.src('./src/example/index.html')
                .pipe(template({
                    icons: this.icons(name)
                }))
                .pipe(gulp.dest("./build/" + name + "/example"));
        },
        clean: function(name) {
            var icons = this.icons(name);
            return gulp.src("./build/" + name, {
                read: false
            }).pipe(clean());
        },
        icons: function(name) {
            var icons = fs.readdirSync("./src/" + name + "/icons/");
            icons = icons.map(function(icon) {
                return util.getPym(icon.replace(/\.\w+$/, ''), true);
            });
            return icons;
        }
    };



var fontName = 'iconfont';
gulp.task("del", function() {
        return del(['./build/*']);
})
gulp.task('default', ["del"], function() {
    for (var key in task) {
        if (key != "icons") {
            for (var key2 in filt) {
                task[key](filt[key2]);
            }
        }
    }
});


