import * as cdk from "aws-cdk-lib"
import {
  aws_certificatemanager as certificate_manager,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_route53 as route53,
  aws_route53_targets as targets,
  aws_s3 as s3,
  aws_s3_deployment as deployment,
} from "aws-cdk-lib"

interface WebsiteProps extends cdk.StackProps {
  WebsiteBucket: s3.Bucket
  domain_certificate: certificate_manager.DnsValidatedCertificate
  domain_name: string
  hosted_zone: route53.IHostedZone
  website_source: string
}

export class Website extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: WebsiteProps) {
    super(scope, id, props)

    const WebsiteDistribution = new cloudfront.Distribution(
      this,
      "WebsiteDistribution",
      {
        certificate: props.domain_certificate,
        defaultBehavior: {
          origin: new origins.S3Origin(props.WebsiteBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        domainNames: [props.domain_name],
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.seconds(60),
          },
        ],
      },
    )

    new cdk.CfnOutput(this, "WebsiteDistributionDomainName", {
      value: WebsiteDistribution.distributionDomainName,
    })

    const WebsiteDeployment = new deployment.BucketDeployment(
      this,
      "WebsiteDeployment",
      {
        destinationBucket: props.WebsiteBucket,
        distribution: WebsiteDistribution,
        sources: [deployment.Source.asset(props.website_source)],
      },
    )

    const WebsiteDistributionRecord = new route53.ARecord(
      this,
      "WebsiteDistributionRecord",
      {
        deleteExisting: true,
        recordName: props.domain_name,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(WebsiteDistribution),
        ),
        ttl: cdk.Duration.seconds(60),
        zone: props.hosted_zone,
      },
    )
  }
}
