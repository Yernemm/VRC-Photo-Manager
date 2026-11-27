// Only needed for manual `npm run publish`; CI uploads releases itself.
let token = { token: process.env.GITHUB_TOKEN || "" };
try {
  token = require("./githubtoken.json");
} catch {
}

module.exports = {
    packagerConfig: {
      icon: 'src/images/icon'
    },
    makers: [
      {
        name: "@electron-forge/maker-squirrel",
        config: {
          name: "vrcpm",
          setupIcon: 'src/images/icon.ico'
        }
      },
      {
        name: "@electron-forge/maker-zip",
        platforms: [
          "darwin"
        ]
      },
      {
        name: "@reforged/maker-appimage",
        platforms: [
          "linux"
        ],
        config: {
          options: {
            bin: "VRChat Photo Manager",
            desktopFile: "linux/vrcpm.desktop",
            icon: "src/images/icon.png"
          }
        }
      },
      {
        name: "@electron-forge/maker-deb",
        config: {}
      },
      {
        name: "@electron-forge/maker-rpm",
        config: {}
      }
    ],
    plugins: [
      {
        name: "@electron-forge/plugin-webpack",
        config: {
          // The dev server needs inline styles (style-loader, xterm) and eval (source maps).
          devContentSecurityPolicy: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:",
          mainConfig: "./webpack.main.config.js",
          renderer: {
            config: "./webpack.renderer.config.js",
            nodeIntegration: true,
            entryPoints: [
              {
                name: "main_window",
                html: "./src/index.html",
                js: "./src/render.jsx"
              }
            ]
          }
        }
      }
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
              repository: {
                owner: 'Yernemm',
                name: 'VRC-Photo-Manager',
              },
              authToken: token.token,
              // update-electron-app (Windows) ignores pre-releases.
              prerelease: false
            }
          }
    ]
}
