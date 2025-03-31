import { describe, it, expect, vi, beforeEach } from 'vitest';
import { run } from '../src/run.js';

describe('ビルトイン関数テスト', () => {
    let consoleSpy;

    beforeEach(() => {
        // console.logのモック化
        consoleSpy = vi.spyOn(console, 'log')
        // グローバル変数のリセット
        global = {}
    });

    describe('print()', () => {
        it('単一の引数を出力できる', () => {
            const ast = {
                operator: '()',
                left: 'print',
                right: 'Hello'
            }
            run(ast)
            expect(consoleSpy).toHaveBeenCalledWith('Hello')
        })

        it('複数の引数を結合して出力できる', () => {
            const ast = {
                operator: '()',
                left: 'print',
                right: {
                    operator: ',',
                    left: 'Hello',
                    right: 'World'
                }
            }
            run(ast)
            expect(consoleSpy).toHaveBeenCalledWith('HelloWorld')
        })
    })

    describe('abs()', () => {
        it('正の数の絶対値を計算できる', () => {
            const ast = {
                operator: '()',
                left: 'abs',
                right: '32'
            }
            expect(run(ast)).toBe(32)
        })

        it('負の数の絶対値を計算できる', () => {
            const ast = {
                operator: '()',
                left: 'abs',
                right: '-32'
            }
            expect(run(ast)).toBe(32)
        })
    })

    describe('sqrt()', () => {
        it('平方根を計算できる', () => {
            const ast = {
                operator: '()',
                left: 'sqrt',
                right: '16'
            }
            expect(run(ast)).toBe(4)
        })
    })

    describe('pow()', () => {
        it('べき乗を計算できる', () => {
            const ast = {
                operator: '()',
                left: 'pow',
                right: {
                    operator: ',',
                    left: '2',
                    right: '3'
                }
            }
            expect(run(ast)).toBe(8)
        })
    })

    describe('length()', () => {
        it('文字列の長さを計算できる', () => {
            const ast = {
                operator: '()',
                left: 'length',
                right: '"Hello"'
            }
            expect(run(ast)).toBe(5)
        })
    })

    describe('concat()', () => {
        it('2つの文字列を結合できる', () => {
            const ast = {
                operator: '()',
                left: 'concat',
                right: {
                    operator: ',',
                    left: '"Hello"',
                    right: '"World"'
                }
            }
            expect(run(ast)).toBe('HelloWorld')
        })

        it('3つ以上の文字列を結合できる', () => {
            const ast = {
                operator: '()',
                left: 'concat',
                right: {
                    operator: ',',
                    left: {
                        operator: ',',
                        left: '"Hello"',
                        right: '" "'
                    },
                    right: '"World"'
                }
            }
            expect(run(ast)).toBe('Hello World')
        })
    })
})
