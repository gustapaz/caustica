import type { Config } from "@stencil/core";
export const config: Config = {
  namespace: "Caustica",
  srcDir: "components",
  tsconfig: "tsconfig.json",
  outputTargets: [
    {
      type: "dist-custom-elements",
      dir: "generated",
      customElementsExportBehavior: "bundle",
      externalRuntime: false,
      generateTypeDeclarations: false,
    },
  ],
  maxConcurrentWorkers: 2,
};
