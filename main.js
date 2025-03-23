const fs = require("fs");
const interpreter = require("./src/interpreter.js");
const path = require("path");

// コマンドライン引数からファイルパスを取得
const filePath = process.argv[2];
if (!filePath) {
    console.error("usage: npm run sneko <file path>");
    process.exit(1);
}

// 拡張子のチェック
const ext = path.extname(filePath);
if (ext !== ".sneko") {
    console.error(`usage: The extension must be .sneko (${ext} is invalid)`);
    process.exit(1);
}

// ファイルの存在チェック
if (!fs.existsSync(filePath)) {
    console.error(`Error: File "${filePath}" does not exist`);
    process.exit(1);
}

// 対象ファイルの読み込み
try {
    const source = fs.readFileSync(filePath, "utf-8");
    // インタプリタの実行
    interpreter(source);
} catch (error) {
    console.error(`Error: Failed to read file "${filePath}"`);
    console.error(error.message);
    process.exit(1);
}
