#!/usr/bin/env node
// Compiles contracts/TrenchToken.sol with solc via Standard-JSON and writes the
// resulting ABI/bytecode/verification input to lib/abis/trench-token.json.
// See scripts/lib/solc-compile.mjs for the shared compile/write logic.

import { fileURLToPath } from "node:url";
import path from "node:path";
import { compileContract } from "./lib/solc-compile.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

compileContract({
  repoRoot,
  contractPath: path.join(repoRoot, "contracts", "TrenchToken.sol"),
  contractSourceKey: "contracts/TrenchToken.sol",
  contractName: "TrenchToken",
  outputPath: path.join(repoRoot, "lib", "abis", "trench-token.json"),
});
