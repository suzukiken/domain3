# CDK Project to create SSL certs for microservices 

## Resources to be created

* SSL Certificate
  * wildcard certificate for a domain
  * Regions
    * ap-northeast-1
    * us-east-1
* CFNOutput
  * ACM arn
  * HostedZone Id
* SSM Parameters
  * ACM arn
  * HostedZone Id

[diagram by cfn-dia](https://diagram.figmentresearch.com/domain)

## Purpose

To place ACM arn at SSM param store which will be used other CDK projects.

Examples of the resources which the other CDK projects creates:

  * CloudFront for S3 Origin
  * Cognito Userpool Domain
  * ApiGateway Custom Domain

### How to use the resources which this CDK project creates

Example Typescript code. This  if `acmarn_ssm_param` is defined in cdk.json.

#### Example 1.

cdk.json
```json
"acmarn_ssm_param": "/domain/examplecom/wildcard/useast1/acmarn"
```

CDK stack 
```Typescript
const acmarn_ssm_param = this.node.tryGetContext('acmarn_ssm_param')
const acmarn = ssm.StringParameter.valueFromLookup(this, acmarn_ssm_param)
const cert = acm.Certificate.fromCertificateArn(this, 'Certificate', acmarn)
```

Downside of this way is that you might get error message when you run cdk deploy.
`Error: ARNs must start with "arn:" and have at least 6 components: dummy-value-for-/xxx/xxxxx/xxxx`
This means for some reason you can't get data from ssm for cert. I don't know why.

The workaround for this problem is prepare cdk.context.json at the root of the cdk project.
To generate cdk.context.json, remove other codes except the line above.

cdk.context.json will be something like this.

```cdk.context.json
{
  "ssm:account=00000000:parameterName=xxxxxxxxx:region=ap-northeast-1": "arn:aws:acm:us-east-1:xxxxxx:certificate/xxxxx"
}
```

#### Example 2.

cdk.json
```json
"acmarn_export_param": "examplecom-wildcard-useast1-acmarn"
```

CDK stack 
```Typescript
const acmarn_export_param = this.node.tryGetContext('acmarn_export_param')
const acmarn = cdk.Fn.importValue(this, acmarn_export_param)
const cert = acm.Certificate.fromCertificateArn(this, 'Certificate', acmarn)
```

Downside of this way is this makes Cross Stack Reference.
You can't destroy the stack which have referenced parameter.
This means you need to destroy your stack when destroy referenced stack.

#### Example 3

cdk.json
```json
"acmarn": "arn:aws:acm:ap-northeast-1:xxxxxxx:certificate/xxxxx-xxxx-xxxxx"
```

CDK stack 
```Typescript
const acmarn = this.node.tryGetContext('acmarn')
const cert = acm.Certificate.fromCertificateArn(this, 'Certificate', acmarn)
```

## Commands

* `npm install`
* `cdk deploy`
* `aws ssm get-parameters-by-path --path xxxx --recursive`
* `npm run diagram`
* `npm run save-context`

## Parameters

These parameters are defined in cdk.json 

* domain name
* SSM Parameter name
* Output name

