import typescript from 'rollup-plugin-typescript2'
export default [
    {
        input: './src/lib.ts',
        output: {
            file: './lib/lib.esm.js',
            format: 'esm',
        },
        plugins: [typescript()],
        external: ['express', 'jsdom']
    },
    {
        input: './src/lib.ts',
        output: {
            file: './lib/lib.js',
            format: 'cjs',
        },
        plugins: [typescript()],
        external: ['express', 'jsdom']
    }
]
