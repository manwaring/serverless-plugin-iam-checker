<p align="center">
  <img height="150" src="https://avatars0.githubusercontent.com/u/36457275?s=400&u=16d355f384ed7f8e0655b7ed1d70ff2e411690d8&v=4e">
  <img height="150" src="https://user-images.githubusercontent.com/2955468/44874521-6cb2c980-ac69-11e8-936b-b02a3519c4ec.png">
</p>

[![version]][version-url] [![downloads]][downloads-url] [![coverage]][coverage-url] [![size][size]][size-url] [![license]][license-url]

[![build]][build-url] [![dependabot]][dependabot-url] [![dependency]][dependency-url] [![dev-dependency]][dev-dependency-url]

# Serverless plugin IAM checker

1. [Overview](#overview)
1. [Installation and setup](#installation-and-setup)
1. [Rule configuration](#rule-configuration)
   1. [Default rule configuration](#default-rule-configuration)
   1. [Action rules](#action-rules)
   1. [Resource rules](#resource-rules)
   1. [Setting rules via serverless.yml](#setting-rules-via-serverless.yml)
   1. [Setting rules via environment variables](#setting-rules-via-environment-variables)
1. [Detailed validation logging](#detailed-validation-logging)
1. [Examples](#examples)

_Feedback appreciated! If you have an idea for how this plugin can be improved [please open an issue](https://github.com/manwaring/serverless-plugin-iam-checker/issues/new)._

# Overview

This [Serverless Framework](https://github.com/serverless/serverless) plugin checks all generated IAM resources in a serverless project and validates their permission configurations for overly-permissive actions and/or resource references. If IAM resources are invalid per the configured rules then the `sls` command will fail after the `package` step, preventing the generated CloudFormation Stack from being deployed to AWS.

# Installation and setup

Install and save the package to `package.json` as a dev dependency:

`npm i --save-dev serverless-plugin-iam-checker`

Add the package to the `serverless.yml` plugins section:

```yml
plugins:
  - serverless-plugin-iam-checker
```

By default the plugin uses a [restrictive set of rules for action and resource configuration](#default-rule-configuration). These rules can be modified using either [serverless.yml custom configuration](#setting-rules-via-serverless.yml) or [environment variables](#setting-rules-via-environment-variables).

# Rule configuration

Rules are configured separately for actions and resources due to resources generally having a greater need for dynamic references, while actions can almost always be constrained explicitly. If any of the action or resource rules aren't found in environment variables or the `serverless.yml` custom config section then this plugin will use the default configurations specified in the tables below.

If rule values are found in both environment variables and `serverless.yml` the plugin will use the environment variable values - this is done to help ensure security compliance in build/test/deploy pipelines where developers generally don't have access to underlying environoment variables (as opposed to `serverless.yml`, which they typically have unlimited access to modify).

## Default rule configuration

```yml
actions:
  allowWildcards: false
  allowWildcardOnly: false
  allowedPatterns: []

resources:
  allowWildcards: true
  allowWildcardOnly: false
  allowedPatterns: []
  allowedReferences: []
```

## Action rules

| Property            | Description                                                                          | Example                                                                          |
| ------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Allow wildcards     | Type: boolean<br/>Effect: can actions include wildcards (\*)<br/>Default: `false`    | Config: `false`<br/>Passes: `dynamodb:PutItem`<br/>Fails: `dynamodb:*`           |
| Allow wildcard only | Type: boolean<br/>Effect: can actions be only wildcards (\*)<br/>Default: `false`    | Config: `true`<br/>Passes: `dynamodb:*`<br/>Fails: `*`                           |
| Allowed patterns    | Type: string array<br/>Effect: actions must match a listed pattern<br/>Default: `[]` | Config: `['dynamodb:']`<br/>Passes: `dynamodb:PutItem`<br/>Fails: `s3:PutObject` |

## Resource rules

| Property            | Description                                                                                      | Example                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Allow wildcards     | Type: boolean<br/>Effect: can resources include wildcards (\*)<br/>Default: `true`               | Config: `false`<br/>Passes: `arn:whatever`<br/>Fails: `arn:*`                                |
| Allow wildcard only | Type: boolean<br/>Effect: can resources be only wildcards (\*)<br/>Default: `false`              | Config: `true`<br/>Passes: `arn:*`<br/>Fails: `*`                                            |
| Allowed patterns    | Type: string array<br/>Effect: resources must match a listed pattern<br/>Default: `[]`           | Config: `['arn:']`<br/>Passes: `arn:whatever`<br/>Fails: `whatever`                          |
| Allowed references  | Type: string array<br/>Effect: resource references must match a listed pattern<br/>Default: `[]` | Config: `['Ref']`<br/>Passes: `{ 'Ref': 'whatever' }`<br/>Fails: `{ 'Fn::Sub': 'whatever' }` |

## Setting rules via serverless.yml

```yml
custom:
  iamChecker: # This key is used by the plugin to pull in the optional rule configuration
    actions:
      allowWildcards: false
      allowWildcardOnly: false
      allowedPatterns:
        - 'dynamodb:'
    resources:
      allowWildcards: true
      allowWildcardOnly: false
      allowedPatterns:
        - 'arn:'
      allowedReferences:
        - 'Ref'
        - 'Fn::Join'
        - 'Fn::Sub'
```

## Setting rules via environment variables

```bash
# Actions
IAM_CHECKER_ACTIONS_ALLOW_WILDCARDS=false
IAM_CHECKER_ACTIONS_ALLOW_WILDCARDONLY=false
IAM_CHECKER_ACTIONS_ALLOWED_PATTERNS=['dynamodb:']

# Resources
IAM_CHECKER_RESOURCES_ALLOW_WILDCARDS=true
IAM_CHECKER_RESOURCES_ALLOW_WILDCARDONLY=false
IAM_CHECKER_RESOURCES_ALLOWED_PATTERNS=['arn:']
IAM_CHECKER_RESOURCES_ALLOWED_REFERENCES=['Ref', 'Fn::Join', 'Fn::Sub']
```

# Detailed validation logging

For detailed logs about which rules have caused resources to fail validation rerun your commands with `SLS_DEBUG=*`. Output similar to this will be logged:

```
Serverless: Packaging service...
Serverless: Checking IAM permissions...
  IamRoleLambdaExecution has the following validation errors:
    Wildcard-only actions are not allowed
    Wildcards in actions are not allowed
    Actions must match the following patterns: [":"]
    Wildcard-only resources are not allowed
    Resources must match the following patterns: ["arn:"]
```

# Examples

There is [one working example](examples) of how this package can be used in a simple 'hello world' serverless application:

1. [Plugin with default configuration](examples/default)

<!-- Badge icons -->

[version]: https://flat.badgen.net/npm/v/serverless-plugin-iam-checker?icon=npm&label=npm@latest
[downloads]: https://flat.badgen.net/npm/dt/serverless-plugin-iam-checker?icon=npm
[coverage]: https://flat.badgen.net/codecov/c/github/manwaring/serverless-plugin-iam-checker/?icon=codecov
[size]: https://flat.badgen.net/packagephobia/install/serverless-plugin-iam-checker
[license]: https://flat.badgen.net/npm/license/serverless-plugin-iam-checker/
[language]: https://flat.badgen.net/badge/typescript/typescript/?icon&label
[style]: https://flat.badgen.net/badge/code%20style/prettier?color=purple&icon=terminal&label
[build]: https://flat.badgen.net/circleci/github/manwaring/serverless-plugin-iam-checker/master?icon=circleci
[dependabot]: https://flat.badgen.net/dependabot/manwaring/serverless-plugin-iam-checker/?icon=dependabot&label=dependabot
[dependency]: https://flat.badgen.net/david/dep/manwaring/serverless-plugin-iam-checker
[dev-dependency]: https://flat.badgen.net/david/dev/manwaring/serverless-plugin-iam-checker/?label=dev+dependencies

<!-- Badge URLs -->

[version-url]: https://npmjs.com/package/serverless-plugin-iam-checker
[downloads-url]: https://www.npmjs.com/package/serverless-plugin-iam-checker
[coverage-url]: https://codecov.io/gh/manwaring/serverless-plugin-iam-checker
[size-url]: https://packagephobia.now.sh/result?p=serverless-plugin-iam-checker
[license-url]: https://www.npmjs.com/package/serverless-plugin-iam-checker
[build-url]: https://circleci.com/gh/manwaring/serverless-plugin-iam-checker
[dependabot-url]: https://flat.badgen.net/dependabot/manwaring/serverless-plugin-iam-checker
[dependency-url]: https://david-dm.org/manwaring/serverless-plugin-iam-checker
[dev-dependency-url]: https://david-dm.org/manwaring/serverless-plugin-iam-checker?type=dev
