const { show } = require("./utils.js");
const { lexer } = require("./lexer.js");
const { parser } = require("./parser.js");
const { run } = require("./run.js");

/**
 * インタプリタの実行
 * @param {string} source - インタプリタの実行対象のソースコード
 */
function interpreter(source) {
    // 字句解析
    const tokens = lexer(source);
    show("tokens=", tokens);

    // 構文解析
    const ast = parser(tokens);
    show("AST=", ast);

    // 実行
    run(ast);
}

module.exports = interpreter;
