import * as cdk from "aws-cdk-lib"
import { aws_apigateway as api_gateway, aws_s3 as s3 } from "aws-cdk-lib"

interface BucketsProps extends cdk.StackProps {}

export class Buckets extends cdk.Stack {
  public FormsBucket
  public GeneratedDocumentsBucket
  public TranscriptionsBucket
  public WebsiteBucket

  constructor(scope: cdk.App, id: string, props: BucketsProps) {
    super(scope, id, props)

    this.FormsBucket = new s3.Bucket(this, "FormsBucket", {
      accessControl: s3.BucketAccessControl.PRIVATE,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedHeaders: api_gateway.Cors.DEFAULT_HEADERS,
          allowedOrigins: api_gateway.Cors.ALL_ORIGINS,
          allowedMethods: [s3.HttpMethods.GET],
        },
      ],
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      versioned: true,
    })

    this.GeneratedDocumentsBucket = new s3.Bucket(
      this,
      "GeneratedDocumentsBucket",
      {
        accessControl: s3.BucketAccessControl.PRIVATE,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        cors: [
          {
            allowedHeaders: api_gateway.Cors.DEFAULT_HEADERS,
            allowedOrigins: api_gateway.Cors.ALL_ORIGINS,
            allowedMethods: [s3.HttpMethods.GET],
          },
        ],
        encryption: s3.BucketEncryption.S3_MANAGED,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        versioned: true,
      },
    )

    this.TranscriptionsBucket = new s3.Bucket(this, "TranscriptionsBucket", {
      accessControl: s3.BucketAccessControl.PRIVATE,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedHeaders: api_gateway.Cors.DEFAULT_HEADERS,
          allowedOrigins: api_gateway.Cors.ALL_ORIGINS,
          allowedMethods: [s3.HttpMethods.POST],
        },
      ],
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      versioned: true,
    })

    this.WebsiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      autoDeleteObjects: true,
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteErrorDocument: "index.html",
      websiteIndexDocument: "index.html",
    })
  }
}
