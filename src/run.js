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
    // 配列リテラル
    "[]literal": (ast, run) => {
        if (!ast.left) return []; // 空配列
        const result = run(ast.left);
        return Array.isArray(result) ? result.flat() : [result];
    },
    // 配列アクセス
    "[]access": (ast, run) => {
        const array = run(ast.left);
        const index = run(ast.right);
        
        if (!Array.isArray(array)) {
            error(`${array} は配列ではありません`);
        }
        
        if (index < 0 || index >= array.length) {
            error(`インデックス ${index} は配列の範囲外です（配列長: ${array.length}）`);
        }
        
        return array[index];
    }
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
    length: (args, run) => {
        const value = run(args);
        if (Array.isArray(value)) {
            return value.length;
        }
        return String(value).length;
    },
    concat: (args, run) => [run(args)].flat().join(""),
    // 配列操作関数
    push: (args, run) => {
        // カンマで区切られた引数を処理
        let evaledArgs = null;
        
        // カンマ演算子を処理
        if (args.operator === ',') {
            const arrayArg = run(args.left);
            const valueArg = run(args.right);
            
            if (!Array.isArray(arrayArg)) {
                error(`${arrayArg} は配列ではありません`);
            }
            
            arrayArg.push(valueArg);
            return arrayArg.length;
        } else {
            // 単一引数の場合
            error("push関数は少なくとも2つの引数が必要です: 配列と追加する要素");
        }
    },
    pop: (args, run) => {
        const array = run(args);
        if (!Array.isArray(array)) {
            error(`${array} は配列ではありません`);
        }
        if (array.length === 0) {
            error("空の配列から要素を取り出せません");
        }
        return array.pop();
    }
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
