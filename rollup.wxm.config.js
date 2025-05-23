/** @format */

const path = require('path')
const resolve = require('@rollup/plugin-node-resolve') // 依赖引用插件
const commonjs = require('@rollup/plugin-commonjs') // commonjs模块转换插件
const typescript = require('typescript')
const {terser} = require('rollup-plugin-terser')
const {default: babelPlugin} = require('rollup-plugin-babel')
const ts = require('rollup-plugin-typescript2')
const tslint = require('rollup-plugin-tslint')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')
const babel = require('rollup-plugin-babel')
const getPath = _path => path.resolve(__dirname, _path)

const packageJSON = require('./package.json')
const isDev = process.env.NODE_ENV !== 'production'
console.log('isDev', isDev)
const extensions = ['.js', '.tsx']

// ts
const tsPlugin = tslint({
    tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
    include: ['tsx'],
})

// 基础配置
const commonConf = {
    input: getPath('./src/wxm.tsx'),
    plugins: [
        globals(),
        builtins(),
        commonjs(),
        resolve(extensions),

        tsPlugin,

        ts({
            include: 'src/**/*.tsx',
            exclude: 'node_modules/**',
            typescript: typescript,
            tsconfig: 'tsconfig.json',
        }),
        babel({
            exclude: 'node_modules/**',
        }),
        !isDev && terser(),
    ],
}
// 需要导出的模块类型
const outputMap = [
    {
        file: 'dist/wxm/index.cjs.js', // cjs
        format: 'cjs',
        name: 'uploader',
    },
]

const buildConf = options => Object.assign({}, commonConf, options)

module.exports = outputMap.map(output =>
    buildConf({
        output: {
            name: packageJSON.name,
            ...output,
        },
    }),
)
