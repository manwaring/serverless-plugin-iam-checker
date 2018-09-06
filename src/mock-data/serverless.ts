import { Config } from '../lib';

export function getServerless(compiledCloudFormationTemplate: any, config?: Config) {
  return {
    service: {
      custom: {
        iamChecker: config
      },
      provider: {
        compiledCloudFormationTemplate
      }
    },
    cli: {
      log: console.log
    },
    classes: {
      Error: Error
    }
  };
}
