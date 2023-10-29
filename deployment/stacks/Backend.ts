import * as cdk from "aws-cdk-lib"
import {
  aws_cognito as cognito,
  aws_dynamodb as dynamodb,
  aws_events as events,
  aws_events_targets as event_targets,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_s3 as s3,
} from "aws-cdk-lib"

interface BackendProps extends cdk.StackProps {
  FormsBucket: s3.Bucket
  GeneratedDocumentsBucket: s3.Bucket
  TranscriptionsBucket: s3.Bucket
  UserPool: cognito.UserPool
  UserPoolClient: cognito.UserPoolClient
  domain_name: string
  openai_api_key: string
  web_socket_subdomain_name: string
}

export class Backend extends cdk.Stack {
  public Assistant
  public DiogenesHealth
  public Document
  public FormHistoryTable
  public FormsAccessTable
  public FormsAuditTable
  public FormsTable
  public TemplatesAccessTable
  public TemplatesTable
  public Transcribe

  constructor(scope: cdk.App, id: string, props: BackendProps) {
    super(scope, id, props)

    // CDK does not consider the base images of a Lambda function when determining
    // if a new deployment is required. To force a new deployment, add the required
    // image hashes to the build arguments
    const base_hash = process.env.BASE_HASH!

    /*
     * DynamoDB Tables
     * ---------------
     */

    // Forms
    this.FormsTable = new dynamodb.Table(this, "FormsTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "form_identifier",
        type: dynamodb.AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })
    this.FormsTable.addGlobalSecondaryIndex({
      indexName: "patient_identifier",
      partitionKey: {
        name: "patient_identifier",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: "last_modified", type: dynamodb.AttributeType.STRING },
    })
    new cdk.CfnOutput(this, "FormsTableName", {
      value: this.FormsTable.tableName,
    })

    this.FormsAuditTable = new dynamodb.Table(this, "FormsAuditTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "form_identifier",
        type: dynamodb.AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      sortKey: {
        name: "timestamp",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })
    this.FormsAuditTable.addGlobalSecondaryIndex({
      indexName: "read",
      partitionKey: {
        name: "form_identifier",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: "timestamp.read", type: dynamodb.AttributeType.STRING },
    })
    this.FormsAuditTable.addGlobalSecondaryIndex({
      indexName: "write",
      partitionKey: {
        name: "form_identifier",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: "timestamp.write", type: dynamodb.AttributeType.STRING },
    })
    new cdk.CfnOutput(this, "FormsAuditTableName", {
      value: this.FormsAuditTable.tableName,
    })

    this.FormsAccessTable = new dynamodb.Table(this, "FormsAccessTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "form",
        type: dynamodb.AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      sortKey: {
        name: "entity",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })
    this.FormsAccessTable.addGlobalSecondaryIndex({
      indexName: "entity.form_not_deleted",
      partitionKey: {
        name: "entity.form_not_deleted",
        type: dynamodb.AttributeType.STRING,
      },
    })
    new cdk.CfnOutput(this, "FormsAccessTableName", {
      value: this.FormsAccessTable.tableName,
    })

    this.FormHistoryTable = new dynamodb.Table(this, "FormHistoryTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "form_identifier",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "last_modified",
        type: dynamodb.AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })
    new cdk.CfnOutput(this, "FormHistoryTableName", {
      value: this.FormHistoryTable.tableName,
    })

    // Templates
    this.TemplatesTable = new dynamodb.Table(this, "TemplatesTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "template_identifier",
        type: dynamodb.AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })
    new cdk.CfnOutput(this, "TemplatesTableName", {
      value: this.TemplatesTable.tableName,
    })

    this.TemplatesAccessTable = new dynamodb.Table(
      this,
      "TemplatesAccessTable",
      {
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: "template",
          type: dynamodb.AttributeType.STRING,
        },
        pointInTimeRecovery: true,
        sortKey: {
          name: "entity",
          type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
    )
    this.TemplatesAccessTable.addGlobalSecondaryIndex({
      indexName: "entity.template_not_deleted",
      partitionKey: {
        name: "entity.template_not_deleted",
        type: dynamodb.AttributeType.STRING,
      },
    })
    new cdk.CfnOutput(this, "TemplatesAccessTableName", {
      value: this.TemplatesAccessTable.tableName,
    })

    /*
     * Lambdas
     * -------
     */

    // Assistant
    this.Assistant = new lambda.DockerImageFunction(this, "Assistant", {
      code: lambda.DockerImageCode.fromImageAsset("lambdas/assistant", {
        buildArgs: { base_hash },
        cmd: ["handler.handler"],
      }),
      environment: {
        FORMS_ACCESS_TABLE: this.FormsAccessTable.tableName,
        FORMS_TABLE: this.FormsTable.tableName,
        OPENAI_API_KEY: props.openai_api_key,
        USER_POOL_ID: props.UserPool.userPoolId,
        USER_POOL_CLIENT_ID: props.UserPoolClient.userPoolClientId,
        WEB_SOCKET_URL: `https://${props.web_socket_subdomain_name}`,
      },
      memorySize: 1769,
      timeout: cdk.Duration.seconds(900),
    })
    for (const table of [this.FormsAccessTable, this.FormsTable]) {
      table.grantReadData(this.Assistant)
    }
    this.Assistant.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["execute-api:ManageConnections"],
        resources: ["*"],
      }),
    )

    // Document
    this.Document = new lambda.DockerImageFunction(this, "Document", {
      code: lambda.DockerImageCode.fromImageAsset("lambdas/document", {
        buildArgs: { base_hash },
        cmd: ["handler.handler"],
      }),
      description: "Documents",
      environment: {
        FORMS_BUCKET: props.FormsBucket.bucketName,
        FORMS_ACCESS_TABLE: this.FormsAccessTable.tableName,
        FORMS_AUDIT_TABLE: this.FormsAuditTable.tableName,
        FORMS_TABLE: this.FormsTable.tableName,
        MESSAGE_SOURCE: `Diogenes Health <patient-notes@${props.domain_name}>`,
        OUTPUT_BUCKET: props.GeneratedDocumentsBucket.bucketName,
        WEBSITE_URL: `http://${props.domain_name}/`,
        USER_POOL: `https://cognito-idp.eu-west-1.amazonaws.com/${props.UserPool.userPoolId}`,
      },
      memorySize: 1769,
      timeout: cdk.Duration.seconds(60),
    })
    props.GeneratedDocumentsBucket.grantReadWrite(this.Document)
    props.FormsBucket.grantRead(this.Document)
    for (const table of [this.FormsAccessTable, this.FormsTable]) {
      table.grantReadData(this.Document)
    }
    this.FormsAuditTable.grantFullAccess(this.Document)
    this.Document.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ses:SendEmail",
          "ses:SendRawEmail",
          "ses:SendTemplatedEmail",
        ],
        resources: ["*"],
      }),
    )
    const DocumentWarmer = new events.Rule(this, "DocumentWarmer", {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
      targets: [
        new event_targets.LambdaFunction(this.Document, {
          event: events.RuleTargetInput.fromObject({ function_warmer: true }),
          retryAttempts: 0,
        }),
      ],
    })
    event_targets.addLambdaPermission(DocumentWarmer, this.Document)

    // DiogenesHealth
    this.DiogenesHealth = new lambda.DockerImageFunction(
      this,
      "DiogenesHealth",
      {
        code: lambda.DockerImageCode.fromImageAsset("lambdas/diogenes-health", {
          buildArgs: { base_hash },
          cmd: ["handler.handler"],
        }),
        description: "Diogenes Health",
        environment: {
          FORMS_BUCKET: props.FormsBucket.bucketName,
          FORM_HISTORY_TABLE: this.FormHistoryTable.tableName,
          FORMS_ACCESS_TABLE: this.FormsAccessTable.tableName,
          FORMS_AUDIT_TABLE: this.FormsAuditTable.tableName,
          FORMS_TABLE: this.FormsTable.tableName,
          TEMPLATES_ACCESS_TABLE: this.TemplatesAccessTable.tableName,
          TEMPLATES_TABLE: this.TemplatesTable.tableName,
          USER_POOL: props.UserPool.userPoolId,
        },
        memorySize: 1769,
        timeout: cdk.Duration.seconds(60),
      },
    )
    props.FormsBucket.grantReadWrite(this.DiogenesHealth)
    for (const table of [
      this.FormHistoryTable,
      this.FormsAccessTable,
      this.FormsAuditTable,
      this.FormsTable,
      this.TemplatesAccessTable,
      this.TemplatesTable,
    ]) {
      table.grantFullAccess(this.DiogenesHealth)
    }
    props.UserPool.grant(this.DiogenesHealth, "cognito-idp:ListUsers")
    const DiogenesHealthWarmer = new events.Rule(this, "DiogenesHealthWarmer", {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
      targets: [
        new event_targets.LambdaFunction(this.DiogenesHealth, {
          event: events.RuleTargetInput.fromObject({ function_warmer: true }),
          retryAttempts: 0,
        }),
      ],
    })
    event_targets.addLambdaPermission(DiogenesHealthWarmer, this.DiogenesHealth)

    // Transcribe
    this.Transcribe = new lambda.DockerImageFunction(this, "Transcribe", {
      code: lambda.DockerImageCode.fromImageAsset("lambdas/transcribe", {
        buildArgs: { base_hash },
        cmd: ["handler.handler"],
      }),
      description: "Machine Learning",
      environment: {
        FORMS_BUCKET: props.FormsBucket.bucketName,
        FORMS_ACCESS_TABLE: this.FormsAccessTable.tableName,
        FORMS_TABLE: this.FormsTable.tableName,
        OPENAI_API_KEY: props.openai_api_key,
        TRANSCRIPTIONS_BUCKET: props.TranscriptionsBucket.bucketName,
      },
      memorySize: 1769,
      timeout: cdk.Duration.seconds(900),
    })
    props.FormsBucket.grantRead(this.Transcribe)
    props.TranscriptionsBucket.grantReadWrite(this.Transcribe)
    for (const table of [this.FormsAccessTable, this.FormsTable]) {
      table.grantReadData(this.Transcribe)
    }
  }
}
