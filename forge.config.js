let token = { token: "" };
try {
  // Token only needed for github publishing
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
            // Forge names the binary after productName on Linux.
            bin: "VRChat Photo Manager",
            categories: ["Graphics", "Utility"],
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
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
              repository: {
                owner: 'Yernemm',
                name: 'VRC-Photo-Manager',
              },
              authToken: token.token,
              prerelease: true
            }
          }
    ]
}
