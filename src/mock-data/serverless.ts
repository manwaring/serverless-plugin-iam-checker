export function getServerless(compiledCloudFormationTemplate: any) {
  return {
    service: {
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
