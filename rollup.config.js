import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  input: "./index.js",
  output: [
    {
      file: './dist/drag-drag-es.min.js',
      format: 'es'
    },
    {
      file: './dist/drag-drag.min.js',
      format: 'iife',
      name: 'Drag'
    }
  ],
  plugins:[
    commonjs(),
    babel({
        exclude: 'node_modules/**'
    }),
    terser({ compress: { drop_console: true } })
  ]
}

