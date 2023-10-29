import * as cdk from "aws-cdk-lib"
import { Authentication } from "./stacks/Authentication"
import { API } from "./stacks/API"
import { Backend } from "./stacks/Backend"
import { Buckets } from "./stacks/Buckets"
import { Domains } from "./stacks/Domains"
import { Website } from "./stacks/Website"
import { Websocket } from "./stacks/Websocket"

const ACCOUNT = {
  account: process.env.AWS_ACCOUNT!,
  region: process.env.AWS_REGION!,
}

const DOMAIN_NAMES = {
  root: process.env.ROOT_DOMAIN!,
  api: process.env.API_SUBDOMAIN!,
  ws: process.env.WEB_SOCKET_SUBDOMAIN!,
  authentication: process.env.AUTHENTICATION_SUBDOMAIN!,
}

const HOSTED_ZONE = {
  identifier: process.env.HOSTED_ZONE_IDENTIFIER!,
  name: process.env.HOSTED_ZONE_NAME!,
}

const WEBSITE_SOURCE = "./client/build"

const app = new cdk.App()

const domains = new Domains(app, "Domains", {
  env: ACCOUNT,
  domain_name: DOMAIN_NAMES.root,
  hosted_zone_identifier: HOSTED_ZONE.identifier,
  hosted_zone_name: HOSTED_ZONE.name,
  web_socket_subdomain_name: DOMAIN_NAMES.ws,
})

const buckets = new Buckets(app, "Buckets", {
  env: ACCOUNT,
})

const authentication = new Authentication(app, "Authentication", {
  env: ACCOUNT,
  domain_name: DOMAIN_NAMES.root,
})

const backend = new Backend(app, "Backend", {
  env: ACCOUNT,
  FormsBucket: buckets.FormsBucket,
  GeneratedDocumentsBucket: buckets.GeneratedDocumentsBucket,
  TranscriptionsBucket: buckets.TranscriptionsBucket,
  UserPool: authentication.UserPool,
  UserPoolClient: authentication.UserPoolClient,
  domain_name: DOMAIN_NAMES.root,
  openai_api_key: process.env.OPENAI_API_KEY!,
  web_socket_subdomain_name: DOMAIN_NAMES.ws,
})

const api = new API(app, "API", {
  env: ACCOUNT,
  APICertificate: domains.APICertificate,
  DemoUserPool: authentication.DemoUserPool,
  Document: backend.Document,
  DiogenesHealth: backend.DiogenesHealth,
  Transcribe: backend.Transcribe,
  UserPool: authentication.UserPool,
  api_subdomain_name: DOMAIN_NAMES.api,
  domain_name: DOMAIN_NAMES.root,
  hosted_zone: domains.HostedZone,
})

const websocket = new Websocket(app, "Websocket", {
  env: ACCOUNT,
  Assistant: backend.Assistant,
  HostedZone: domains.HostedZone,
  WebSocketCertificate: domains.WebSocketCertificate,
  web_socket_subdomain_name: DOMAIN_NAMES.ws,
})

const website = new Website(app, "Website", {
  env: ACCOUNT,
  WebsiteBucket: buckets.WebsiteBucket,
  domain_certificate: domains.RootDomainCertificate,
  domain_name: DOMAIN_NAMES.root,
  hosted_zone: domains.HostedZone,
  website_source: WEBSITE_SOURCE,
})
