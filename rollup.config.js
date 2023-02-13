import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import rollupTypescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json'; // 读取 package.json 配置
const env = process.env.NODE_ENV; // 当前运行环境，可通过 cross-env 命令行设置
const name = pkg.name; // umd 模式的编译结果文件输出的全局变量名称
const config = {
  input: path.resolve(__dirname, 'src/index.ts'),
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
    {
      name,
      file: pkg.umd,
      format: 'umd',
    },
  ],
  plugins: [
    // 解析第三方依赖
    resolve(),
    // 识别 commonjs 模式第三方依赖
    commonjs(),
    // rollup 编译 typescript
    rollupTypescript({
      clean: true,
      useTsconfigDeclarationDir: true,
    }),
  ],
};
// 若打包正式环境，压缩代码
if (env === 'production') {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  );
}

export default config;
