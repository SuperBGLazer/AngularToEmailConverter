import typescript from 'rollup-plugin-typescript2'
const external = []
export default [
    {
        input: './src/lib.ts',
        output: {
            file: './lib/lib.esm.js',
            format: 'esm',
        },
        plugins: [typescript()],
        external
    },
    {
        input: './src/lib.ts',
        output: {
            file: './lib/lib.js',
            format: 'cjs',
        },
        plugins: [typescript()],
        external
    }
]
