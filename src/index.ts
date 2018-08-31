class IamChecker {
  constructor(serverless, options) {
    serverless.cli.log("Hello!");
    serverless.cli.log(`${this.options}`);
    this.serverless = serverless;
    this.options = options;

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
  options: any;
  commands: any;
  hooks: any;

  beforeWelcome() {
    this.serverless.cli.log("Hello from Serverless!");
  }
}

export = IamChecker;
