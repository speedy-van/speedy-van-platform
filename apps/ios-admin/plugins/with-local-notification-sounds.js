const { IOSConfig, withEntitlementsPlist, withXcodeProject } = require("expo/config-plugins");
const { basename, resolve } = require("path");
const { copyFileSync } = require("fs");

function withLocalNotificationSounds(config, props = {}) {
  const sounds = Array.isArray(props.sounds) ? props.sounds : [];

  config = withEntitlementsPlist(config, (config) => {
    delete config.modResults["aps-environment"];
    return config;
  });

  return withXcodeProject(config, (config) => {
    const projectName = config.modRequest.projectName;
    if (!projectName) {
      throw new Error("Unable to find iOS project name while adding local notification sounds.");
    }

    const sourceRoot = IOSConfig.Paths.getSourceRoot(config.modRequest.projectRoot);

    for (const soundPath of sounds) {
      const fileName = basename(soundPath);
      const sourcePath = resolve(config.modRequest.projectRoot, soundPath);
      const destinationPath = resolve(sourceRoot, fileName);

      copyFileSync(sourcePath, destinationPath);

      const projectFilePath = `${projectName}/${fileName}`;
      if (!config.modResults.hasFile(projectFilePath)) {
        config.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
          filepath: projectFilePath,
          groupName: projectName,
          isBuildFile: true,
          project: config.modResults,
        });
      }
    }

    return config;
  });
}

module.exports = withLocalNotificationSounds;
