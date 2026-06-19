const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const filePath = path.join(config.modRequest.platformProjectRoot, 'gradle/wrapper/gradle-wrapper.properties');
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        const newGradleVersion = '8.13';
        content = content.replace(
          /distributionUrl=.*/,
          `distributionUrl=https\\://services.gradle.org/distributions/gradle-${newGradleVersion}-bin.zip`
        );
        
        fs.writeFileSync(filePath, content);
      }
      return config;
    },
  ]);
};
