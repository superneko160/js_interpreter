import { describe, it, expect, vi, beforeEach } from "vitest";
import { run } from "../src/run.js";

describe("配列テスト", () => {
    let consoleSpy;

    beforeEach(() => {
        // console.logのモック化
        consoleSpy = vi.spyOn(console, "log");
        // グローバル変数のリセット
        global = {};
    });

    describe("配列リテラル", () => {
        it("空配列を作成できる", () => {
            const ast = {
                operator: "[]literal",
                left: null,
                right: null
            };
            expect(run(ast)).toEqual([]);
        });

        it("要素を持つ配列を作成できる", () => {
            const ast = {
                operator: "[]literal",
                left: {
                    operator: ",",
                    left: "1",
                    right: {
                        operator: ",",
                        left: "2",
                        right: "3"
                    }
                },
                right: null
            };
            expect(run(ast)).toEqual([1, 2, 3]);
        });
    });

    describe("配列アクセス", () => {
        it("インデックスで要素にアクセスできる", () => {
            // 配列定義
            const createArray = {
                operator: "=",
                left: "arr",
                right: {
                    operator: "[]literal",
                    left: {
                        operator: ",",
                        left: "10",
                        right: "20"
                    },
                    right: null
                }
            };
            run(createArray);

            // 配列要素へのアクセス
            const accessAst0 = {
                operator: "[]access",
                left: "arr",
                right: "0"
            };
            const accessAst1 = {
                operator: "[]access",
                left: "arr",
                right: "1"
            };
            expect(run(accessAst0)).toBe(10);
            expect(run(accessAst1)).toBe(20);
        });
    });

    describe("push()", () => {
        it("配列に要素を追加できる", () => {
            // 配列を作成
            const createArray = {
                operator: "=",
                left: "arr",
                right: {
                    operator: "[]literal",
                    left: {
                        operator: ",",
                        left: "1",
                        right: "2"
                    },
                    right: null
                }
            };
            run(createArray);

            // 要素を追加
            const pushAst = {
                operator: "()",
                left: "push",
                right: {
                    operator: ",",
                    left: "arr",
                    right: "3"
                }
            };
            expect(run(pushAst)).toBe(3); // 新しい要素を返す

            // 追加された要素を確認
            const accessAst = {
                operator: "[]access",
                left: "arr",
                right: "2"
            };
            expect(run(accessAst)).toBe(3);
        });
    });
});
