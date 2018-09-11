Feature: Basic checking

  Scenario: Resources with wildcard-only resource references don't pass default configuration
    Given a CloudFormation template with invalid permission configuration
    And the IAM checking plugin is installed with default config
    When the IAM check is performed
    Then the IAM check will fail

  Scenario: Resources without wildcard-only resource references pass default configuration
    Given a CloudFormation template with valid permission configuration
    And the IAM checking plugin is installed with default config
    When the IAM check is performed
    Then the IAM check will pass

  Scenario: Resources without wildcard-only resource references pass basic configuration
    Given a CloudFormation template with valid permission configuration
    And the IAM checking plugin is installed with basic config
    When the IAM check is performed
    Then the IAM check will pass

  Scenario: Resources without wildcard-only resource references don't pass impossible configuration
    Given a CloudFormation template with valid permission configuration
    And the IAM checking plugin is installed with impossible config
    When the IAM check is performed
    Then the IAM check will fail
