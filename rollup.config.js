import path from 'path'
import resolve from '@rollup/plugin-node-resolve' // 依赖引用插件
import commonjs from '@rollup/plugin-commonjs' // commonjs模块转换插件
import tslint from "rollup-plugin-tslint";
import ts from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import typescript from "typescript"
import babel from 'rollup-plugin-babel';
const getPath = _path => path.resolve(__dirname, _path)
import packageJSON from './package.json'
const isDev = process.env.NODE_ENV !== 'production';
console.log("isDev", isDev)
const extensions = [
    '.js',
    '.tsx'
]


// ts
const tsPlugin = tslint({
    tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
    include: ['tsx'],
})




// 基础配置
const commonConf = {
    input: getPath('./src/index.tsx'),
    plugins: [
        commonjs(),
        resolve(extensions),

        tsPlugin,

        ts({
            include: "src/**/*.tsx",
            exclude: "node_modules/**",
            typescript: typescript,
            tsconfig: "tsconfig.json",
        }),
        babel({
            exclude: 'node_modules/**',
        }),
        !isDev && terser()
    ]
}
// 需要导出的模块类型
const outputMap = [
    {
        file: packageJSON.main, // 通用模块
        format: 'umd',
        name:'Uploader'
    },
    {
        file: packageJSON.module, // es6模块
        format: 'es',
        name:'Uploader'
    }
]


const buildConf = options => Object.assign({}, commonConf, options)


export default outputMap.map(output => buildConf({ output: { name: packageJSON.name, ...output } }))
