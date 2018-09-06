Feature: Basic checking

  Scenario: Resources which contain star only resource references don't pass default configuration
    Given a CloudFormation template with invalid permission configuration
    And the IAM checking plugin is installed with default config
    When the IAM check is performed
    Then the IAM check will fail

  Scenario: Resources which don't contain star only resource references pass default configuration
    Given a CloudFormation template with valid permission configuration
    And the IAM checking plugin is installed with default config
    When the IAM check is performed
    Then the IAM check will pass

  Scenario: Resources which don't contain star only resource references pass basic configuration
    Given a CloudFormation template with valid permission configuration
    And the IAM checking plugin is installed with basic config
    When the IAM check is performed
    Then the IAM check will pass

  Scenario: Resources which don't contain star only resource references don't pass impossible configuration
    Given a CloudFormation template with valid permission configuration
    And the IAM checking plugin is installed with impossible config
    When the IAM check is performed
    Then the IAM check will fail
