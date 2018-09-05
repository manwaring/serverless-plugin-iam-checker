Feature: Basic checking

  Background:
    Given a CloudFormation template with invalid permission configuration
    And the IAM checking plugin is installed

  Scenario: Resources which contain star only resource references don't pass
    When the IAM check is performed
    Then the IAM check will fail
