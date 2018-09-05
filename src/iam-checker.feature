Feature: Basic checking

  Scenario: Resources which contain star only resource references don't pass
    Given a CloudFormation template with invalid permission configuration
    And the IAM checking plugin is installed
    When the IAM check is performed
    Then the IAM check will fail

  Scenario: Resources which don't contain star only resource references pass
    Given a CloudFormation template with valid permission configuration
    And the IAM checking plugin is installed
    When the IAM check is performed
    Then the IAM check will pass
