export const template = {
  AWSTemplateFormatVersion: '2010-09-09',
  Description: 'The AWS CloudFormation template for this Serverless application',
  Resources: {
    ServerlessDeploymentBucket: {
      Type: 'AWS::S3::Bucket'
    },
    HelloLogGroup: {
      Type: 'AWS::Logs::LogGroup',
      Properties: {
        LogGroupName: '/aws/lambda/iam-checker-example-dev-hello'
      }
    },
    IamRoleLambdaExecution: {
      Type: 'AWS::IAM::Role',
      Properties: {
        AssumeRolePolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                Service: ['lambda.amazonaws.com']
              },
              Action: ['sts:AssumeRole']
            }
          ]
        },
        Policies: [
          {
            PolicyName: {
              'Fn::Join': ['-', ['dev', 'iam-checker-example', 'lambda']]
            },
            PolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Action: ['logs:CreateLogStream'],
                  Resource: [
                    {
                      'Fn::Sub':
                        'arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/iam-checker-example-dev-hello:*'
                    }
                  ]
                },
                {
                  Effect: 'Allow',
                  Action: ['logs:PutLogEvents'],
                  Resource: [
                    {
                      'Fn::Sub':
                        'arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/iam-checker-example-dev-hello:*:*'
                    }
                  ]
                },
                {
                  Effect: 'Allow',
                  Resource: '*',
                  Action: '*'
                }
              ]
            }
          }
        ],
        Path: '/',
        RoleName: {
          'Fn::Join': ['-', ['iam-checker-example', 'dev', 'us-east-1', 'lambdaRole']]
        }
      }
    },
    HelloLambdaFunction: {
      Type: 'AWS::Lambda::Function',
      Properties: {
        Code: {
          S3Bucket: {
            Ref: 'ServerlessDeploymentBucket'
          },
          S3Key: 'serverless/iam-checker-example/dev/1536074105360-2018-09-04T15:15:05.360Z/iam-checker-example.zip'
        },
        FunctionName: 'iam-checker-example-dev-hello',
        Handler: 'handler.hello',
        MemorySize: 1024,
        Role: {
          'Fn::GetAtt': ['IamRoleLambdaExecution', 'Arn']
        },
        Runtime: 'nodejs8.10',
        Timeout: 6
      },
      DependsOn: ['HelloLogGroup', 'IamRoleLambdaExecution']
    },
    HelloLambdaVersionIVPQuLV63bRm4wZNq9IhlrCivIIwWhBG7xrC64NcjA: {
      Type: 'AWS::Lambda::Version',
      DeletionPolicy: 'Retain',
      Properties: {
        FunctionName: {
          Ref: 'HelloLambdaFunction'
        },
        CodeSha256: 'jzZoj1eL8ji/aQSuwEnaJtlwHlPiUEcNrJNbPIMPhvM='
      }
    },
    ApiGatewayRestApi: {
      Type: 'AWS::ApiGateway::RestApi',
      Properties: {
        Name: 'dev-iam-checker-example',
        EndpointConfiguration: {
          Types: ['EDGE']
        }
      }
    },
    ApiGatewayResourceHello: {
      Type: 'AWS::ApiGateway::Resource',
      Properties: {
        ParentId: {
          'Fn::GetAtt': ['ApiGatewayRestApi', 'RootResourceId']
        },
        PathPart: 'hello',
        RestApiId: {
          Ref: 'ApiGatewayRestApi'
        }
      }
    },
    ApiGatewayMethodHelloGet: {
      Type: 'AWS::ApiGateway::Method',
      Properties: {
        HttpMethod: 'GET',
        RequestParameters: {},
        ResourceId: {
          Ref: 'ApiGatewayResourceHello'
        },
        RestApiId: {
          Ref: 'ApiGatewayRestApi'
        },
        ApiKeyRequired: false,
        AuthorizationType: 'NONE',
        Integration: {
          IntegrationHttpMethod: 'POST',
          Type: 'AWS_PROXY',
          Uri: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition'
                },
                ':apigateway:',
                {
                  Ref: 'AWS::Region'
                },
                ':lambda:path/2015-03-31/functions/',
                {
                  'Fn::GetAtt': ['HelloLambdaFunction', 'Arn']
                },
                '/invocations'
              ]
            ]
          }
        },
        MethodResponses: []
      }
    },
    ApiGatewayDeployment1536074105381: {
      Type: 'AWS::ApiGateway::Deployment',
      Properties: {
        RestApiId: {
          Ref: 'ApiGatewayRestApi'
        },
        StageName: 'dev'
      },
      DependsOn: ['ApiGatewayMethodHelloGet']
    },
    HelloLambdaPermissionApiGateway: {
      Type: 'AWS::Lambda::Permission',
      Properties: {
        FunctionName: {
          'Fn::GetAtt': ['HelloLambdaFunction', 'Arn']
        },
        Action: 'lambda:InvokeFunction',
        Principal: {
          'Fn::Join': [
            '',
            [
              'apigateway.',
              {
                Ref: 'AWS::URLSuffix'
              }
            ]
          ]
        },
        SourceArn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition'
              },
              ':execute-api:',
              {
                Ref: 'AWS::Region'
              },
              ':',
              {
                Ref: 'AWS::AccountId'
              },
              ':',
              {
                Ref: 'ApiGatewayRestApi'
              },
              '/*/*'
            ]
          ]
        }
      }
    }
  },
  Outputs: {
    ServerlessDeploymentBucketName: {
      Value: {
        Ref: 'ServerlessDeploymentBucket'
      }
    },
    HelloLambdaFunctionQualifiedArn: {
      Description: 'Current Lambda function version',
      Value: {
        Ref: 'HelloLambdaVersionIVPQuLV63bRm4wZNq9IhlrCivIIwWhBG7xrC64NcjA'
      }
    },
    ServiceEndpoint: {
      Description: 'URL of the service endpoint',
      Value: {
        'Fn::Join': [
          '',
          [
            'https://',
            {
              Ref: 'ApiGatewayRestApi'
            },
            '.execute-api.us-east-1.',
            {
              Ref: 'AWS::URLSuffix'
            },
            '/dev'
          ]
        ]
      }
    }
  }
};
