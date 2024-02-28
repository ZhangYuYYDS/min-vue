import pk from './package.json';
import typescript from '@rollup/plugin-typescript';
// import sourceMaps from 'rollup-plugin-sourcemaps';
import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import replace from '@rollup/plugin-replace';

export default {
    input: './src/index.ts',
    plugins: [
        // replace({
        //     'process.env.NODE_ENV': JSON.stringify('development'),
        //     'process.env.VUE_ENV': JSON.stringify('browser'),
        //     'process.env.LANGUAGE': JSON.stringify(process.env.LANGUAGE),
        // }),
        resolve(),
        // commonjs(),
        typescript(),
        // sourceMaps(),
    ],
    output: [
        {
            format: 'cjs',
            file: pk.main,
        },
        {
            name: 'vue',
            file: pk.module,
        },
    ],
    // onwarn: (msg, warn) => {
    //     // 忽略 Circular 的错误
    //     if (!/Circular/.test(msg)) {
    //         warn(msg);
    //     }
    // },
};
