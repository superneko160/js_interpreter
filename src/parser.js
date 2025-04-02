/**
 * パーサー（構文解析）モジュール
 * @module parser
 */
const { expect, accept, show, error } = require("./utils.js");

/**
 * 構文解析の初期化と実行
 * @param {Array} tokens - 字句解析から取得したトークンのリスト
 * @returns {Object|undefined} 抽象構文木（AST）、またはトークンが空の場合はundefined
 */
function parser(tokens) {
    const ast = parseStatements(tokens);
    if (tokens.length > 0) {
        show("AST=", ast);
        show("処理後tokens=", tokens);
        error("未処理のトークンが残っているため終了");
    }
    return ast;
}

/**
 * セミコロンで区切られた文のリストの構文解析
 * @param {Array} tokens - トークンのリスト
 * @returns {Object} 文リストのASTノード
 */
function parseStatements(tokens) {
    let statement = parseCommaExpression(tokens);

    let operator = "";
    while ((operator = accept(tokens, ";"))) {
        const right = parseCommaExpression(tokens);
        statement = { left: statement, operator, right };
    }
    return statement;
}

/**
 * カンマで区切られた式のリストの構文解析
 * @param {Array} tokens - トークンのリスト
 * @returns {Object} カンマ式のASTノード
 */
function parseCommaExpression(tokens) {
    let expression = parseAssignment(tokens);

    let operator = "";
    while ((operator = accept(tokens, ","))) {
        const right = parseAssignment(tokens);
        expression = { left: expression, operator, right };
    }
    return expression;
}

/**
 * 代入式の構文解析
 * @param {Array} tokens - トークン
 * @returns {Object} 代入式のASTノード
 */
function parseAssignment(tokens) {
    let expression = parseAddSubExpression(tokens);

    let operator = "";
    while ((operator = accept(tokens, "="))) {
        const right = parseCommaExpression(tokens);
        expression = { left: expression, operator, right };
    }
    return expression;
}

/**
 * 加減算式の構文解析
 * @param {Array} tokens - トークンのリスト
 * @returns {Object} 加減算のASTノード
 */
function parseAddSubExpression(tokens) {
    let term = parseMulDivExpression(tokens);

    let operator = "";
    while ((operator = accept(tokens, "+", "-"))) {
        const right = parseMulDivExpression(tokens);
        term = { left: term, operator, right };
    }
    return term;
}

/**
 * 乗除算式の構文解析
 * @param {Array} tokens - トークンのリスト
 * @returns {Object} 乗除算のASTノード
 */
function parseMulDivExpression(tokens) {
    let factor = parseUnary(tokens);

    let operator = "";
    while ((operator = accept(tokens, "*", "/"))) {
        const right = parseUnary(tokens);
        factor = { left: factor, operator, right };
    }
    return factor;
}

/**
 * 単項演算子（+/-）の構文解析
 * @param {Array} tokens - トークンのリスト
 * @returns {Object} 単項演算のASTノード
 */
function parseUnary(tokens) {
    let operator = "";
    while ((operator = accept(tokens, "+", "-"))) {
        const right = parseCommaExpression(tokens);
        if (operator === "+") {
            return right;
        }
        return {
            left: { left: "0", operator: "-", right: "1" },
            operator: "*",
            right,
        };
    }
    return parseFunctionCall(tokens);
}

/**
 * 関数呼び出しの構文解析
 * @param {Array} tokens - トークンのリスト
 * @returns {Object} 関数呼び出しのASTノード
 */
function parseFunctionCall(tokens) {
    let functionNode = parseArrayAccess(tokens);

    let parentheses = "";
    while ((parentheses = accept(tokens, "("))) {
        const args = parseCommaExpression(tokens);
        parentheses += expect(tokens, ")");
        functionNode = { left: functionNode, operator: parentheses, right: args };
    }
    return functionNode;
}

/**
 * 配列アクセスの構文解析
 * @param {Array} tokens - トークンのリスト
 * @returns {Object} 配列アクセスのASTノード
 */
function parseArrayAccess(tokens) {
    let arrayNode = parseArrayLiteral(tokens);

    let brackets = "";
    while ((brackets = accept(tokens, "["))) {
        const index = parseCommaExpression(tokens);
        brackets += expect(tokens, "]");
        arrayNode = { left: arrayNode, operator: "[]access", right: index };
    }
    return arrayNode;
}

/**
 * 配列リテラルの構文解析
 * @param {Array} tokens - トークンのリスト
 * @returns {Object} 配列リテラルのASTノード
 */
function parseArrayLiteral(tokens) {
    if (accept(tokens, "[")) {
        let elements = null;
        
        // 空配列の場合
        if (accept(tokens, "]")) {
            return { operator: "[]literal", left: null, right: null };
        }
        
        // 要素のある配列
        elements = parseCommaExpression(tokens);
        expect(tokens, "]");
        return { operator: "[]literal", left: elements, right: null };
    }
    
    return parseValue(tokens);
}

/**
 * トークンの値を取得
 * @param {Array} tokens - トークンのリスト
 * @returns {*} トークンの値、またはトークンが空の場合はundefined
 */
function parseValue(tokens) {
    if (tokens.length === 0) return;
    return tokens.shift();
}

module.exports = { parser };
