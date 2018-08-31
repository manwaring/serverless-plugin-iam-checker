class IamChecker {
  constructor(serverless) {
    serverless.cli.log("Hello!");
    this.serverless = serverless;

    // this.commands = {
    //   checkIam: {
    //     usage: "Checks your Iam policies for * permissions or resources",
    //     lifecycleEvents: ["hello", "world"],
    //     options: {
    //       message: {
    //         usage:
    //           "Specify the message you want to deploy " +
    //           "(e.g. \"--message 'My Message'\" or \"-m 'My Message'\")",
    //         required: true,
    //         shortcut: "m"
    //       }
    //     }
    //   }
    // };

    this.hooks = {
      "after:deploy:createDeploymentArtifacts": this.beforeWelcome.bind(this)
    };
  }

  serverless: any;
  hooks: any;

  beforeWelcome() {
    this.serverless.cli.log(
      this.serverless.service.provider.compiledCloudFormationTemplate
    );
    this.serverless.cli.log("Hello from Serverless!");
  }
}

export = IamChecker;
