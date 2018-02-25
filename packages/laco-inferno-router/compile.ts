import * as ts from "typescript";
import { sync as globSync } from "glob";
import transform from "ts-transform-inferno";
import { resolve, basename } from "path";
import { readFileSync, writeFileSync } from "fs";

const config = {
  experimentalDecorators: true,
  jsx: ts.JsxEmit.Preserve,
  module: ts.ModuleKind.UMD,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  noEmitOnError: false,
  noUnusedLocals: true,
  noUnusedParameters: true,
  stripInternal: true,
  target: ts.ScriptTarget.ES5
};

function compile(path: string) {
  const files = globSync(path);
  const compilerHost = ts.createCompilerHost(config);
  const program = ts.createProgram(files, config, compilerHost);

  program.emit(undefined, compare, undefined, undefined, {
    before: [transform()]
  });
}

function compare(filePath: string, output: string) {
  const fileBasename = basename(filePath);
  const distFilePath = resolve(__dirname, "dist/" + fileBasename);
  writeFileSync(distFilePath, output, "utf8");
}

compile(resolve(__dirname, "src/index.tsx"));
