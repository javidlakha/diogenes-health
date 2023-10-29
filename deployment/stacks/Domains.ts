import * as cdk from "aws-cdk-lib"
import {
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_route53_patterns as patterns,
  aws_ses as ses,
} from "aws-cdk-lib"

interface DomainsProps extends cdk.StackProps {
  domain_name: string
  hosted_zone_identifier: string
  hosted_zone_name: string
  web_socket_subdomain_name: string
}

export class Domains extends cdk.Stack {
  public APICertificate
  public EmailIdentity
  public RootDomainCertificate
  public HostedZone
  public WebSocketCertificate

  constructor(scope: cdk.App, id: string, props: DomainsProps) {
    super(scope, id, props)

    this.HostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: props.hosted_zone_identifier,
        zoneName: props.hosted_zone_name,
      },
    )

    new patterns.HttpsRedirect(this, "Redirect", {
      recordNames: [`www.${props.domain_name}`],
      targetDomain: props.domain_name,
      zone: this.HostedZone,
    })

    this.RootDomainCertificate = new acm.DnsValidatedCertificate(
      this,
      "RootDomainCertificate",
      {
        domainName: props.domain_name,
        hostedZone: this.HostedZone,
        region: "us-east-1",
      },
    )

    this.APICertificate = new acm.DnsValidatedCertificate(
      this,
      "APICertificate",
      {
        domainName: `api.${props.domain_name}`,
        hostedZone: this.HostedZone,
        region: "us-east-1",
      },
    )

    this.WebSocketCertificate = new acm.DnsValidatedCertificate(
      this,
      "WebSocketCertificate",
      {
        domainName: props.web_socket_subdomain_name,
        hostedZone: this.HostedZone,
        region: "eu-west-1",
      },
    )

    this.EmailIdentity = new ses.EmailIdentity(this, "EmailIdentity", {
      identity: ses.Identity.publicHostedZone(this.HostedZone),
      mailFromDomain: `mail.${props.domain_name}`,
    })
  }
}
