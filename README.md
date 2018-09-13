<p align="center">
  <img height="150" src="https://avatars0.githubusercontent.com/u/36457275?s=400&u=16d355f384ed7f8e0655b7ed1d70ff2e411690d8&v=4e">
  <img height="150" src="https://user-images.githubusercontent.com/2955468/44874521-6cb2c980-ac69-11e8-936b-b02a3519c4ec.png">
</p>

[![Build status][build-badge]][build-badge-url]
[![Test coverage][coverage-badge]][coverage-badge-url]
[![Known Vulnerabilities][vulnerability-badge]][vulnerability-badge-url]
[![Dependency Status][dependency-badge]][dependency-badge-url]
[![devDependency Status][dev-dependency-badge]][dev-dependency-badge-url]
[![NPM version][latest-version-badge]][latest-version-badge-url]
[![License][license-badge]][license-badge-url]
[![Code style][formatter-badge]][formatter-badge-url]

# Serverless plugin IAM checker

1. [Plugin overview](#plugin-overview)
1. [Installation and setup](#installation)
1. [Detailed validation logging](#detailed-validation-logging)
1. [Rule configuration](#setup-and-configuration)

## Plugin overview

This [Serverless Framework](https://github.com/serverless/serverless) plugin checks all IAM resources that are created in a given serverless project and validates their permission configurations for overly-permissive actions and/or resource references. If IAM resources are invalid per the configuration the `sls` command will fail after the `package` step.

## Installation and setup

Install and save to `package.json`:

`npm i --save-dev serverless-plugin-iam-checker`

Add to plugins list in `serverless.yml` plugins section:

```yml
plugins:
  - serverless-plugin-iam-checker
```

## Rule configuration

Rules are configured separately for actions and resources because of the frequently dynamic nature of resource references, whereas actions are rarely if ever dynamic. If any of the individual actions or resources rules aren't found in environment variables or the `serverless.yml` custom config section then this plugin will use the default rule configuration specified in the tables below.

If rule values are found in both environment variables and `serverless.yml` the plugin will use the environment variable values - this is done to help ensure security compliance in build/test/deploy pipelines where developers generally don't have access to underlying environoment variables (as opposed to `serverless.yml`, which they typically have unlimited access to modify).

## Detailed validation logging

For detailed logs about which rules have caused resources to fail validation rerun your commands with `SLS_DEBUG=*`. Output will appear similar to this:

```
Checking IAM permissions...
  IamRoleLambdaExecution has the following validation errors:
    Wildcard-only actions are not allowed
    Wildcards in actions are not allowed
    Actions must match the following patterns: [":"]
    Wildcard-only resources are not allowed
    Resources must match the following patterns: ["arn:"]
```

### Actions

| Property            | Description                                              | Defaults | Example                                                                 |
| ------------------- | -------------------------------------------------------- | -------- | ----------------------------------------------------------------------- |
| Allow wildcards     | Flag to indicate if actions can include wildcards        | `false`  | config: `false` passes: `dynamodb:PutItem` fails: `dynamodb:*`          |
| Allow wildcard only | Flag to indicate if actions can be only wildcards        | `false`  | config: `true` passes: `dynamodb:PutItem` fails: `*`                    |
| Allowed patterns    | List of strings used to further restrict allowed actions | `[]`     | config: `['dynamodb:']` passes: `dynamodb:PutItem` fails `s3:PutObject` |

### Resources

| Property            | Description                                                                                                               | Defaults                         | Example                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| Allow wildcards     | Flag to indicate if actions can include wildcards                                                                         | `true`                           | config: `false` passes: `arn:whatever` fails: `arn:*`                                         |
| Allow wildcard only | Flag to indicate if actions can be only wildcards                                                                         | `false`                          | config: `true` passes: `arn:*` fails: `*`                                                     |
| Allowed patterns    | List of strings used to further restrict allowed resource names                                                           | `[arn:]`                         | config: `['arn:']` passes: `arn:whatever` fails `whatever`                                    |
| Allowed references  | List of strings used to further restrict allowed resource keys (for compound objects, e.g. ones using dynamic references) | `['Ref', 'Fn::Join', 'Fn::Sub']` | config: `['Fn::Sub']` passes: `{ 'Fn::Sub': 'whatever' }` fails: `{ 'Ref': 'WhateverTable' }` |

### Setting configurations via serverless.yml

```yml
custom:
  iamChecker:
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

### Setting configurations via environment variables

Actions

- `IAM_CHECKER_ACTIONS_ALLOW_WILDCARDS`=false
- `IAM_CHECKER_ACTIONS_ALLOW_WILDCARDONLY`=false
- `IAM_CHECKER_ACTIONS_ALLOWED_PATTERNS`=['dynamodb:']

  Resources

- `IAM_CHECKER_RESOURCES_ALLOW_WILDCARDS`=true
- `IAM_CHECKER_RESOURCES_ALLOW_WILDCARDONLY`=false
- `IAM_CHECKER_RESOURCES_ALLOWED_PATTERNS`=['arn:']
- `IAM_CHECKER_RESOURCES_ALLOWED_REFERENCES`=['Ref', 'Fn::Join', 'Fn::Sub']

[build-badge]: https://circleci.com/gh/manwaring/serverless-plugin-iam-checker.svg?style=shield&circle-token=1a965ecc2e543ea066f490fed6e2cca837d74f0d
[build-badge-url]: https://circleci.com/gh/manwaring/serverless-plugin-iam-checker
[coverage-badge]: https://codecov.io/gh/manwaring/serverless-plugin-iam-checker/branch/master/graph/badge.svg
[coverage-badge-url]: https://codecov.io/gh/manwaring/serverless-plugin-iam-checker
[dependency-badge]: https://david-dm.org/manwaring/serverless-plugin-iam-checker.svg
[dependency-badge-url]: https://david-dm.org/manwaring/serverless-plugin-iam-checker
[dev-dependency-badge]: https://david-dm.org/manwaring/serverless-plugin-iam-checker/dev-status.svg
[dev-dependency-badge-url]: https://david-dm.org/manwaring/serverless-plugin-iam-checker?type=dev
[formatter-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[formatter-badge-url]: #badge
[license-badge]: https://img.shields.io/npm/l/serverless-plugin-iam-checker.svg
[license-badge-url]: https://www.npmjs.com/package/serverless-plugin-iam-checker
[vulnerability-badge]: https://snyk.io/test/github/manwaring/serverless-plugin-iam-checker/badge.svg?targetFile=package.json
[vulnerability-badge-url]: https://snyk.io/test/github/manwaring/serverless-plugin-iam-checker?targetFile=package.json
[latest-version-badge]: https://img.shields.io/npm/v/serverless-plugin-iam-checker/latest.svg
[latest-version-badge-url]: https://npmjs.com/package/serverless-plugin-iam-checker
