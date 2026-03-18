import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import optipng from 'imagemin-optipng';
import webp from 'gulp-webp';

const caminho = 'assets/imagens/servicos/**/*.{jpg,jpeg,png}';

// 🔥 COMPRESSÃO
export function imagens() {
    return gulp.src(caminho)
        .pipe(imagemin([
            mozjpeg({ quality: 75 }),
            optipng({ optimizationLevel: 5 })
        ]))
        .pipe(gulp.dest('assets/imagens/otimizadas'));
}

// 🔥 WEBP
export function converterWebp() {
    return gulp.src(caminho)
        .pipe(webp({ quality: 75 }))
        .pipe(gulp.dest('assets/imagens/webp'));
}

// 👀 WATCH
export function watchFiles() {
    gulp.watch(caminho, gulp.series(imagens, converterWebp));
}

export default gulp.series(imagens, converterWebp, watchFiles);