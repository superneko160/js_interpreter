/**
 * インタプリタ実行モジュール
 * 抽象構文木(AST)を解釈し実行する
 * @module interpreter
 */
const { error } = require("./utils.js");

// グローバル変数置き場
let global = {};

// 演算子の実装をマップとして定義
const operators = {
    ";": (ast, run) => {
        run(ast.left);
        return run(ast.right);
    },
    ",": (ast, run) => {
        return [run(ast.left), run(ast.right)].flat();
    },
    "=": (ast, run) => {
        return (global[run(ast.left)] = run(ast.right));
    },
    "+": (ast, run) => run(ast.left) + run(ast.right),
    "-": (ast, run) => run(ast.left) - run(ast.right),
    "*": (ast, run) => run(ast.left) * run(ast.right),
    "/": (ast, run) => run(ast.left) / run(ast.right),
    "()": (ast, run) => {
        const functionName = run(ast.left);
        return executeFunctionCall(functionName, ast.right, run);
    },
};

// 関数の実装をマップとして定義
const functions = {
    // 表示
    print: (args, run) => {
        const evaluatedArgs = [run(args)].flat().join("");
        console.log(evaluatedArgs);
    },
    // 数値演算
    abs: (args, run) => Math.abs(run(args)),
    sqrt: (args, run) => Math.sqrt(run(args)),
    pow: (args, run) => {
        const [base, exp] = [run(args)].flat();
        return Math.pow(base, exp);
    },
    // 文字列操作
    length: (args, run) => String(run(args)).length,
    concat: (args, run) => [run(args)].flat().join(""),
};

/**
 * 関数呼び出しの実行
 * @param {string} functionName - 関数名
 * @param {Object} args - 引数
 * @param {Function} run - 実行関数
 */
function executeFunctionCall(functionName, args, run) {
    const func = functions[functionName];
    if (!func) {
        error("Undefined function: ", functionName);
    }
    return func(args, run);
}

/**
 * ASTの階層を辿りながら実行
 * @param {Object|string|null} ast - 抽象構文木またはその一部
 * @returns {string|undefined} 文字列の場合はその値、それ以外はundefined
 */
function run(ast) {
    if (!ast) return;

    // リテラルまたは識別子の処理
    if (!ast.operator) {
        if (ast[0] === '"') return ast.substr(1, ast.length - 2);
        if (/\d/.test(ast[0])) return 1 * ast;
        if (global.hasOwnProperty(ast)) return global[ast];
        return ast;
    }

    // 演算子の処理
    const operator = operators[ast.operator];
    if (!operator) {
        error("Undefined operator: ", ast.operator);
    }
    return operator(ast, run);
}

module.exports = { run };
