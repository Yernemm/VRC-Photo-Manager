const token = require("./githubtoken.json");

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