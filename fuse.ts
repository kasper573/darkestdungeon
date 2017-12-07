import {FuseBox, EnvPlugin, QuantumPlugin, WebIndexPlugin, CopyPlugin, CSSPlugin} from "fuse-box";

const isProduction: boolean = false;
const fuse = FuseBox.init({
  homeDir: "src",
  sourceMaps: false, //isProduction ? undefined : {project: true, vendor: false},
  hash: isProduction,
  target: "browser",
  output: "dist/$name.js",
  alias: {
    "src": "~/"
  },
  warnings: true,
  cache: true, //!isProduction,
  log: !isProduction,
  debug: !isProduction,
  tsConfig: "tsconfig.json",
  useTypescriptCompiler: true,
  plugins: [
    EnvPlugin({ NODE_ENV: isProduction ? "production" : "development" }),
    WebIndexPlugin({title: "Dankest Dungeon", path: "."}),
    CSSPlugin(),
    CopyPlugin({files: ["*.png", "*.jpg", "*.ogg"], dest: "assets", useDefault: false}),
    isProduction ?
      QuantumPlugin({
        treeshake: true,
        uglify: true
      }) : undefined
  ]
});

fuse.dev();

fuse.bundle("vendor")
  .instructions(`~ main.tsx`);

const app = fuse.bundle("app")
  .watch()
  .hmr()
  .instructions(`! polyfills/index.js + !> [main.tsx]`);

fuse.run();
