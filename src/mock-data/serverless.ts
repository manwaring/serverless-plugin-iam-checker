export function getServerless(compiledCloudFormationTemplate: any) {
  return {
    service: {
      custom: {
        iamChecker: {
          test: 'test'
        }
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
