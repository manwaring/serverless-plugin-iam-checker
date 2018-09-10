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

1. [Package overview](#plugin-overview)
1. [Installation](#installation)
1. [Setup and configuration](#setup-and-configuration)

## Plugin overview

This [Serverless Framework](https://github.com/serverless/serverless) plugin checks all IAM resources that are created in a given serverless project and validates their permission configurations for overly-permissive actions and/or resource references.

## Installation

Install and save to `package.json`

`npm i --save-dev serverless-plugin-iam-checker`

Add to plugins list in `serverless.yml` plugins section

```yml
plugins:
  - serverless-plugin-iam-checker
```

## Setup and configuration

The available configuration options are:

- Check star only:
- Allowed patterns:
- Allowed references:

Default configuration:
By default the only check the plugin makes is ensuring that there are no star-only actions or resources defined (e.g. `Resources: '\*' or Actions: '\*').

Optional `serverless.yml` configuration to override defaults:

```yml
custom:
  iamChecker:
    checkStarOnly: false
    allowedPatterns:
      - 'arn:'
    allowedReferences:
      - 'Ref'
      - 'Fn::Join'
      - 'Fn::Sub'
```

Option environment variable configuration to override defaults:

- `IAM_CHECKER_CHECK_STAR_ONLY`=false
- `IAM_CHECKER_ALLOWED_PATTERNS`=['arn:']
- `IAM_CHECK_ALLOWED_REFERENCES`=['Ref', 'Fn::Join', 'Fn::Sub']

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
