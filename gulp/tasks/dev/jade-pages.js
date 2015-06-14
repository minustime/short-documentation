var gulp         = require("gulp"),
    config       = require("../../config.js").jade.pages,
    jade         = require("gulp-jade"),           // translate jade into HTML;
    rename       = require("gulp-rename"),         // allows us to rename files;
    plumber      = require("gulp-plumber"),        // error trapping so an error doesn't kill Gulp;
    handleErrors = require("../../handle-errors"); // function to fire on error;

// run jade-json first to make sure the global variable has been created;
gulp.task("jade-pages", ["jade-json"], function () {
    // pass in the sass files that we want to compile;
    return gulp.src(config.compile)
        // add plumber for error catching;
        .pipe(plumber({
            "errorHandler": handleErrors
        }))
        // compile the jade;
        // cf. http://jade-lang.com/api/
        .pipe(jade({
            "pretty": "    ", // use 4 spaces for an indent;
            "compileDebug": true,
            "locals": {
                "content": global.json
            }
        }))
        // rename the file;
        .pipe(rename(function (path) {
            // create a new filename based off the folder structure;
            // folderName/page.jade --> page-folderName.html;
            // folderName/page-red.jade --> page-folderName-red.html;
            if (path.basename === "page") {
                path.basename = path.basename + "-" + path.dirname;
            } else {
                path.basename = "page-" + path.dirname + "-" + path.basename.replace("page-", "");
            }
            path.dirname = "";
            path.extname = ".html";
        }))
        // finally put the compiled jade into an HTML file;
        // in the build folder;
        .pipe(gulp.dest(config.dest.build))
        // and the docs folder;
        .pipe(gulp.dest(config.dest.docs));
});
