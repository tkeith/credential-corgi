function patchWasmModuleImport(config, isServer) {
  config.experiments = Object.assign(config.experiments || {}, {
    asyncWebAssembly: true,
  });

  config.optimization.moduleIds = "named";

  config.module.rules.push({
    test: /\.wasm$/,
    type: "webassembly/async",
  });

  // TODO: improve this function -> track https://github.com/vercel/next.js/issues/25852
  if (isServer) {
    config.output.webassemblyModuleFilename =
      "./../static/wasm/[modulehash].wasm";
  } else {
    config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.experiments = { ...config.experiments, topLevelAwait: true };
    patchWasmModuleImport(config, options.isServer);

    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*?)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-site",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
