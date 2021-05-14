import * as cdk from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager'
import * as route53 from '@aws-cdk/aws-route53'
import * as ssm from '@aws-cdk/aws-ssm'

export class Domain3Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const domain = ssm.StringParameter.valueFromLookup(this, this.node.tryGetContext('domainname_ssmparamname'))
    
    const zone = route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: domain
    })
    
    const apnortheast1_certificate = new acm.DnsValidatedCertificate(this, 'Apne1Cert', {
      domainName: '*.' + domain,
      hostedZone: zone,
      region: 'ap-northeast-1',
    })
    
    const useast1_certificate = new acm.DnsValidatedCertificate(this, 'Use1Cert', {
      domainName: '*.' + domain,
      hostedZone: zone,
      region: 'us-east-1',
    })
    
    // output
    
    new ssm.StringParameter(this, 'cognito_idpool_id_ssmparamname', {
      parameterName: this.node.tryGetContext('apnortheast1_acmarn_ssmparamname'),
      stringValue: apnortheast1_certificate.certificateArn,
    })
    
    new ssm.StringParameter(this, 'cognito_userpool_id_ssmparamname', {
      parameterName: this.node.tryGetContext('useast1_acmarn_ssmparamname'),
      stringValue: useast1_certificate.certificateArn,
    })
    
    new ssm.StringParameter(this, 'cognito_userpool_appclientforwebid_ssmparamname', {
      parameterName: this.node.tryGetContext('hostedzoneid_ssmparamname'),
      stringValue: zone.hostedZoneId,
    })
    
    new cdk.CfnOutput(this, 'tokyo_certificatearn_out', {
      value: apnortheast1_certificate.certificateArn,
      exportName: this.node.tryGetContext('apnortheast1_acmarn_exportname')
    })
    
    new cdk.CfnOutput(this, 'notrhvirginia_certificatearn_out', {
      value: useast1_certificate.certificateArn,
      exportName: this.node.tryGetContext('useast1_acmarn_exportname')
    })
    
    new cdk.CfnOutput(this, 'hostedzone_out', {
      value: zone.hostedZoneId,
      exportName: this.node.tryGetContext('hostedzoneid_exportname')
    })

  }
}
