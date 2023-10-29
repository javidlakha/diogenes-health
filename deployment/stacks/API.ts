import * as appsync from "@aws-cdk/aws-appsync-alpha"
import * as cdk from "aws-cdk-lib"
import {
  aws_certificatemanager as certificate_manager,
  aws_cognito as cognito,
  aws_lambda as lambda,
  aws_route53 as route53,
} from "aws-cdk-lib"

interface APIProps extends cdk.StackProps {
  APICertificate: certificate_manager.DnsValidatedCertificate
  DemoUserPool: cognito.UserPool
  Document: lambda.Function
  DiogenesHealth: lambda.Function
  Transcribe: lambda.Function
  UserPool: cognito.UserPool
  api_subdomain_name: string
  domain_name: string
  hosted_zone: route53.IHostedZone
}

export class API extends cdk.Stack {
  public API

  constructor(scope: cdk.App, id: string, props: APIProps) {
    super(scope, id, props)

    /*
     * GraphQL API
     * -----------
     */
    this.API = new appsync.GraphqlApi(this, "API", {
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: props.UserPool,
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              name: "Diogenes Health GraphQL public access",
              description:
                "Provides access to the public parts of the Diogenes Health GraphQL API",
              expires: cdk.Expiration.after(cdk.Duration.days(365)),
            },
          },
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: props.DemoUserPool,
            },
          },
        ],
      },
      domainName: {
        domainName: props.api_subdomain_name,
        certificate: props.APICertificate,
      },
      logConfig: { fieldLogLevel: appsync.FieldLogLevel.ERROR },
      name: "API",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
    })

    new route53.CnameRecord(this, "APICname", {
      deleteExisting: true,
      domainName: this.API.appSyncDomainName,
      recordName: props.api_subdomain_name,
      ttl: cdk.Duration.seconds(60),
      zone: props.hosted_zone,
    })

    new cdk.CfnOutput(this, "ApiUrl", {
      value: `https://${props.api_subdomain_name}/graphql`,
    })

    new cdk.CfnOutput(this, "ApiKey", {
      value: this.API.apiKey || "",
    })

    /**
     * Assistant
     * ---------
     */

    this.API.addLambdaDataSource(
      "AssistantDataSource",
      props.Transcribe,
    ).createResolver({
      typeName: "Query",
      fieldName: "assistant",
    })

    /*
     * Audit
     * -----
     */

    this.API.addLambdaDataSource(
      "AuditDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Query",
      fieldName: "audit",
    })

    /*
     * Documents
     * ---------
     */

    // Export document
    this.API.addLambdaDataSource(
      "ExportDocumentDataSource",
      props.Document,
    ).createResolver({
      typeName: "Query",
      fieldName: "export",
    })

    // Export document
    this.API.addLambdaDataSource(
      "SendDocumentDataSource",
      props.Document,
    ).createResolver({
      typeName: "Query",
      fieldName: "send",
    })

    /*
     * Forms
     * -----
     */

    // Create form
    this.API.addLambdaDataSource(
      "CreateFormDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Mutation",
      fieldName: "create_form",
    })

    // Get form
    this.API.addLambdaDataSource(
      "GetFormDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Query",
      fieldName: "form",
    })

    // List forms
    this.API.addLambdaDataSource(
      "ListFormsDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Query",
      fieldName: "forms",
    })

    // Update form
    this.API.addLambdaDataSource(
      "UpdateFormDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Mutation",
      fieldName: "update_form",
    })

    // Delete form
    this.API.addLambdaDataSource(
      "DeleteFormDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Mutation",
      fieldName: "delete_form",
    })

    // Get patient record
    this.API.addLambdaDataSource(
      "PatientRecordDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Query",
      fieldName: "patient_record",
    })

    /*
     * Templates
     * ---------
     */

    // Create template
    this.API.addLambdaDataSource(
      "CreateTemplateDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Mutation",
      fieldName: "create_template",
    })

    // Get template
    this.API.addLambdaDataSource(
      "GetTemplateDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Query",
      fieldName: "template",
    })

    // List templates
    this.API.addLambdaDataSource(
      "ListTemplatesDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Query",
      fieldName: "templates",
    })

    // Update template
    this.API.addLambdaDataSource(
      "UpdateTemplateDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Mutation",
      fieldName: "update_template",
    })

    // Delete template
    this.API.addLambdaDataSource(
      "DeleteTemplateDataSource",
      props.DiogenesHealth,
    ).createResolver({
      typeName: "Mutation",
      fieldName: "delete_template",
    })

    /*
     * Transcription
     * ---------
     */

    // Transcribe uploaded recording
    this.API.addLambdaDataSource(
      "TranscribeDataSource",
      props.Transcribe,
    ).createResolver({
      typeName: "Query",
      fieldName: "transcribe",
    })

    // Upload recording
    this.API.addLambdaDataSource(
      "UploadRecordingDataSource",
      props.Transcribe,
    ).createResolver({
      typeName: "Mutation",
      fieldName: "upload_recording",
    })
  }
}
