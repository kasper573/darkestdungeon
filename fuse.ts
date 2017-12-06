import {FuseBox, EnvPlugin, QuantumPlugin, WebIndexPlugin, CopyPlugin, CSSPlugin} from "fuse-box";

const isProduction: boolean = false;
const fuse = FuseBox.init({
  homeDir: "",
  sourceMaps: isProduction ? undefined : {project: true, vendor: true},
  hash: isProduction,
  target: "browser",
  output: "dist/$name.js",
  cache: !isProduction,
  log: !isProduction,
  debug: !isProduction,
  tsConfig: "tsconfig.json",
  useTypescriptCompiler: true,
  experimentalFeatures: true,
  plugins: [
    EnvPlugin({ NODE_ENV: isProduction ? "production" : "development" }),
    WebIndexPlugin({title: "Dankest Dungeon", path: "."}),
    CSSPlugin(),
    CopyPlugin({files: ["*.ogg", "*.png", "*.jpg"]}),
    isProduction ?
      QuantumPlugin({
        treeshake: true,
        uglify: true
      }) : undefined
  ]
});

fuse.bundle("vendor")
  .instructions(`~ src/**.{ts,tsx}`);

const app = fuse.bundle("app")
  .instructions(`!> polyfills/index.js`)
  .instructions(`!> src/main.tsx`);

fuse.dev();
app.hmr();
fuse.run();
