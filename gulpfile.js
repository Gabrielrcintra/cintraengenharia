import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import webp from 'imagemin-webp';

// CAMINHO DAS SUAS IMAGENS
const caminho = 'assets/imagens/serviços/*';

// 🔥 COMPRIMIR IMAGENS
export function imagens() {
    return gulp.src(caminho)
        .pipe(imagemin())
        .pipe(gulp.dest('assets/imagens/otimizadas'));
}

// 🔥 CONVERTER PARA WEBP
export function converterWebp() {
    return gulp.src(caminho)
        .pipe(imagemin([
            webp({ quality: 75 })
        ]))
        .pipe(gulp.dest('assets/imagens/webp'));
}

// 🔥 WATCH (fica monitorando mudanças)
export function watchFiles() {
    gulp.watch(caminho, gulp.series(imagens, converterWebp));
}

// 🔥 TAREFA PADRÃO
export default gulp.series(imagens, converterWebp, watchFiles);