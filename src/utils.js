/**
 * インタプリタのユーティリティ関数モジュール
 * ファイル操作、トークン処理、エラー処理などの汎用機能を提供
 * @module utils
 */
const util = require("util");

/**
 * デバッグ用オブジェクト表示関数
 * オブジェクトを整形して表示する
 * @param {string} message - 表示メッセージ
 * @param {*} object - 表示対象のオブジェクト
 */
function show(message, object) {
    // util.inspect でオブジェクトを文字列化
    const formattedObject = util.inspect(object, {
        showHidden: false,
        depth: null,
        maxArrayLength: null,
        colors: true,
    });
    console.log(message + formattedObject);
}

/**
 * エラーメッセージを表示して処理を終了する
 * @param  {...any} messages - 表示するエラーメッセージ（複数可）
 */
function error(...messages) {
    console.log(messages.join(""));
    process.exit(1); // エラー終了コードを追加
}

/**
 * トークン配列の先頭要素が指定された値のいずれかに一致する場合、
 * その要素を取り出して返す
 * @param {Array} tokenList - トークンの配列
 * @param  {...any} candidates - 照合する候補値（複数可）
 * @returns {*|undefined} 一致した場合はその要素、一致しない場合はundefined
 */
function accept(tokenList, ...candidates) {
    if (tokenList.length === 0) return;
    if (candidates.includes(tokenList[0])) return tokenList.shift();
    return;
}

/**
 * トークン配列の先頭要素が指定された値のいずれかに一致することを確認し、
 * 一致する場合はその要素を取り出して返す。一致しない場合はエラーを発生させる
 * @param {Array} tokenList - トークンの配列
 * @param  {...any} candidates - 照合する候補値（複数可）
 * @returns {*} 一致した要素
 */
function expect(tokenList, ...candidates) {
    const token = accept(tokenList, ...candidates);
    if (token) return token;
    error(
        "token error: tokenList[0]=",
        tokenList[0],
        "が候補値 [",
        candidates.join(", "),
        "] に含まれていません",
    );
}

module.exports = { show, error, accept, expect };
