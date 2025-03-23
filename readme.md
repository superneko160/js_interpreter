# sneko-lang（Interpreter）

## Usage

```sh
npm run sneko <file-path>
```

### Example

```sh
npm run sneko sample/source1.sneko
```

## 再帰下降構文解析

- 演算子の優先順位に基づいた関数の階層構造

```
parseStatements
└── parseCommaExpression
    └── parseAssignment
        └── parseAddSubExpression
            └── parseMulDivExpression
               └── parseUnary
                   └── parseFunctionCall
```
