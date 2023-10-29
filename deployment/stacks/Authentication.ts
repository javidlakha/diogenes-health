import * as cdk from "aws-cdk-lib"
import { aws_cognito as cognito, aws_lambda as lambda } from "aws-cdk-lib"
import { user_verification } from "../../messages/user_verification"

interface AuthenticationProps extends cdk.StackProps {
  domain_name: string
}

export class Authentication extends cdk.Stack {
  public DemoUserPool
  public UserPool
  public UserPoolClient

  constructor(scope: cdk.App, id: string, props: AuthenticationProps) {
    super(scope, id, props)

    // Main user pool
    this.UserPool = new cognito.UserPool(this, "UserPool", {
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      autoVerify: {
        email: true,
      },
      email: cognito.UserPoolEmail.withSES({
        sesRegion: "eu-west-1",
        fromEmail: `accounts@${props.domain_name}`,
        fromName: "Diogenes Health",
        replyTo: `accounts@${props.domain_name}`,
        sesVerifiedDomain: props.domain_name,
      }),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      selfSignUpEnabled: true,
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        fullname: {
          required: true,
          mutable: true,
        },
      },
      userPoolName: "UserPool",
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
        emailBody: user_verification(props.domain_name),
        emailSubject: "Your verification code",
      },
    })

    new cognito.CfnUserPoolGroup(this, "Administrators", {
      groupName: "Administrators",
      userPoolId: this.UserPool.userPoolId,
    })

    new cognito.CfnUserPoolGroup(this, "ExperimentalAI", {
      groupName: "ExperimentalAI",
      userPoolId: this.UserPool.userPoolId,
    })

    new cognito.CfnUserPoolGroup(this, "TemplateEditors", {
      groupName: "TemplateEditors",
      userPoolId: this.UserPool.userPoolId,
    })

    this.UserPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      accessTokenValidity: cdk.Duration.minutes(5),
      idTokenValidity: cdk.Duration.minutes(5),
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
      },
      refreshTokenValidity: cdk.Duration.days(1),
      userPool: this.UserPool,
      userPoolClientName: "UserPoolClient",
    })

    new cdk.CfnOutput(this, "UserPoolID", {
      value: this.UserPool.userPoolId,
    })

    new cdk.CfnOutput(this, "UserPoolClientID", {
      value: this.UserPoolClient.userPoolClientId,
    })

    // User pool for demo users
    this.DemoUserPool = new cognito.UserPool(this, "DemoUserPool", {
      accountRecovery: cognito.AccountRecovery.NONE,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      standardAttributes: {
        email: {
          required: false,
          mutable: false,
        },
      },
      userPoolName: "DemoUserPool",
    })

    const DemoUserPoolClient = new cognito.UserPoolClient(
      this,
      "DemoUserPoolClient",
      {
        oAuth: {
          flows: {
            implicitCodeGrant: true,
          },
        },
        refreshTokenValidity: cdk.Duration.hours(8),
        userPool: this.DemoUserPool,
        userPoolClientName: "DemoUserPoolClient",
      },
    )

    new cdk.CfnOutput(this, "DemoUserPoolID", {
      value: this.DemoUserPool.userPoolId,
    })

    new cdk.CfnOutput(this, "DemoUserPoolClientID", {
      value: DemoUserPoolClient.userPoolClientId,
    })

    const DemoUserRegistration = new lambda.Function(
      this,
      "DemoUserRegistration",
      {
        code: lambda.Code.fromAsset("lambdas/cognito/register-demo-user"),
        environment: {
          USER_POOL_ID: this.DemoUserPool.userPoolId,
          CLIENT_ID: DemoUserPoolClient.userPoolClientId,
        },
        handler: "handler.handler",
        runtime: lambda.Runtime.PYTHON_3_9,
      },
    )

    this.DemoUserPool.grant(
      DemoUserRegistration,
      "cognito-idp:AdminCreateUser",
      "cognito-idp:AdminSetUserPassword",
    )

    const DemoUserRegistrationURL = DemoUserRegistration.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ["*"],
        allowedMethods: [lambda.HttpMethod.GET],
      },
    })

    new cdk.CfnOutput(this, "DemoUserRegistrationURL", {
      value: DemoUserRegistrationURL.url,
    })
  }
}
