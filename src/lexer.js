/**
 * レキサー（字句解析）モジュール
 * @module lexer
 */

/**
 * ソースコードを字句解析してトークンの配列に変換する
 * @param {string} sourceCode - 解析対象の元となるソースコード
 * @returns {string[]} 抽出されたトークンのリスト
 */
function lexer(sourceCode) {
    // "文字列" または print または 改行で分割
    let tokens = sourceCode.split(/\/\/.*$|(\d+\.\d+|\d+|".*?"|\w+)|\s|(.)/m);
    // splitの仕様上、undefinedや空文字列などが残るので、不要なものを除去
    return tokens.filter((token) => token);
}

module.exports = { lexer };
