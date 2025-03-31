import { describe, it, expect, beforeEach } from 'vitest'
import { run } from '../src/run.js'

describe('算術演算子テスト', () => {
    beforeEach(() => {
        // グローバル変数のリセット
        global = {}
    })

    describe('加算演算子 (+)', () => {
        it('整数同士の加算ができる', () => {
            const ast = {
                operator: '+',
                left: '5',
                right: '3'
            }
            expect(run(ast)).toBe(8)
        })

        it('小数を含む加算ができる', () => {
            const ast = {
                operator: '+',
                left: '3.5',
                right: '1.2'
            }
            expect(run(ast)).toBe(4.7)
        })

        // 未実装
        // it('変数を含む加算ができる', () => {
        //     global.x = 10
        //     const ast = {
        //         operator: '+',
        //         left: 'x',
        //         right: '5'
        //     }
        //     expect(run(ast)).toBe(15)
        // })
    })

    describe('減算演算子 (-)', () => {
        it('整数同士の減算ができる', () => {
            const ast = {
                operator: '-',
                left: '5',
                right: '3'
            }
            expect(run(ast)).toBe(2)
        })

        it('小数を含む減算ができる', () => {
            const ast = {
                operator: '-',
                left: '3.5',
                right: '1.2'
            }
            expect(run(ast)).toBe(2.3)
        })

        it('負の数を生成する減算ができる', () => {
            const ast = {
                operator: '-',
                left: '3',
                right: '5'
            }
            expect(run(ast)).toBe(-2)
        })
    })

    describe('乗算演算子 (*)', () => {
        it('整数同士の乗算ができる', () => {
            const ast = {
                operator: '*',
                left: '4',
                right: '3'
            }
            expect(run(ast)).toBe(12)
        })

        it('小数を含む乗算ができる', () => {
            const ast = {
                operator: '*',
                left: '2.5',
                right: '2'
            }
            expect(run(ast)).toBe(5)
        })

        it('負の数との乗算ができる', () => {
            const ast = {
                operator: '*',
                left: '-2',
                right: '3'
            }
            expect(run(ast)).toBe(-6)
        })
    })

    describe('除算演算子 (/)', () => {
        it('整数同士の除算ができる', () => {
            const ast = {
                operator: '/',
                left: '6',
                right: '2'
            }
            expect(run(ast)).toBe(3)
        })

        it('小数を含む除算ができる', () => {
            const ast = {
                operator: '/',
                left: '5',
                right: '2'
            }
            expect(run(ast)).toBe(2.5)
        })

        it('負の数での除算ができる', () => {
            const ast = {
                operator: '/',
                left: '-6',
                right: '2'
            }
            expect(run(ast)).toBe(-3)
        })
    })

    describe('複合的な演算', () => {
        it('複数の演算子を組み合わせた計算ができる', () => {
            const ast = {
                operator: '+',
                left: {
                    operator: '*',
                    left: '2',
                    right: '3'
                },
                right: '4'
            }
            expect(run(ast)).toBe(10) // (2 * 3) + 4 = 10
        })

        // 未実装
        // it('変数を含む複合的な計算ができる', () => {
        //     global.x = 5
        //     const ast = {
        //         operator: '*',
        //         left: 'x',
        //         right: {
        //             operator: '+',
        //             left: '2',
        //             right: '3'
        //         }
        //     }
        //     expect(run(ast)).toBe(25) // 5 * (2 + 3) = 25
        // })
    })
})
