import * as api_gateway from "@aws-cdk/aws-apigatewayv2-alpha"
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha"
import * as cdk from "aws-cdk-lib"
import {
  aws_certificatemanager as certificate_manager,
  aws_lambda as lambda,
  aws_route53 as route53,
  aws_route53_targets as targets,
} from "aws-cdk-lib"

interface WebsocketProps extends cdk.StackProps {
  Assistant: lambda.Function
  HostedZone: route53.IHostedZone
  WebSocketCertificate: certificate_manager.DnsValidatedCertificate
  web_socket_subdomain_name: string
}

export class Websocket extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: WebsocketProps) {
    super(scope, id, props)

    const WebSocketApi = new api_gateway.WebSocketApi(this, "WebSocketApi")

    const WebSocketStage = new api_gateway.WebSocketStage(
      this,
      "WebSocketStage",
      {
        webSocketApi: WebSocketApi,
        stageName: "WebSocketStage",
        autoDeploy: true,
      },
    )

    const WebSocketDomain = new api_gateway.DomainName(
      this,
      "WebSocketDomain",
      {
        certificate: props.WebSocketCertificate,
        domainName: props.web_socket_subdomain_name,
      },
    )

    new route53.ARecord(this, "WebSocketARecord", {
      recordName: props.web_socket_subdomain_name,
      target: route53.RecordTarget.fromAlias(
        new targets.ApiGatewayv2DomainProperties(
          WebSocketDomain.regionalDomainName,
          WebSocketDomain.regionalHostedZoneId,
        ),
      ),
      ttl: cdk.Duration.seconds(60),
      zone: props.HostedZone,
    })

    const WebSocketApiMapping = new api_gateway.ApiMapping(
      this,
      "WebSocketApiMapping",
      {
        api: WebSocketApi,
        domainName: WebSocketDomain,
        stage: WebSocketStage,
      },
    )

    new cdk.CfnOutput(this, "WebSocketUrl", {
      value: `wss://${WebSocketDomain.name}`,
    })

    // Assistant
    WebSocketApi.addRoute("assistant", {
      integration: new WebSocketLambdaIntegration(
        "WebSocketAssistantIntegration",
        props.Assistant,
      ),
    })
  }
}
