import { binding, when, then, given } from 'cucumber-tsflow';
import { expect } from 'chai';
import { getServerless, invalidHelloWorldTemplate, validHelloWorldTemplate } from './mock-data';
import IamChecker = require('./iam-checker');

@binding()
class iamCheckerTest {
  serverless: any;
  template: any;
  iamChecker: IamChecker;
  error: Error;

  @given(/a CloudFormation template with invalid permission configuration/)
  public givenInvalidTemplate() {
    this.template = invalidHelloWorldTemplate;
  }

  @given(/a CloudFormation template with valid permission configuration/)
  public givenValidTemplate() {
    this.template = validHelloWorldTemplate;
  }

  @given(/the IAM checking plugin is installed/)
  public givenIamInstalled() {
    this.serverless = getServerless(this.template);
    this.iamChecker = new IamChecker(this.serverless);
  }

  @when(/the IAM check is performed/)
  public whenIamChecked() {
    try {
      this.iamChecker.checkIam();
    } catch (err) {
      this.error = err;
    }
  }

  @then(/the IAM check will fail/)
  public thenIamCheckFails() {
    expect(this.error).to.not.equal(undefined);
  }

  @then(/the IAM check will pass/)
  public thenIamCheckPasses() {
    expect(this.error).to.equal(undefined);
  }
}

export = iamCheckerTest;
