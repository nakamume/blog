---
title: Terraform Provider Dynamic Configuration
slug: 2024/terraform-provider-dynamic-configuration
tags:
- '2024-08'
- '2024'
- 'terraform'
- 'provider'
- 'honeycomb'
---
I had a requirement where I wanted to work with Honeycombio's terraform provider. Unlike Datadog, Honeycomb has the concept of environments. It maps perfectly with our infra<!-- truncate --> environments, i.e we can send prd telemetry to prd honeycomb environment and dev to dev.

Honeycomb provider uses API keys for configuration and each environment has its own keys. That meant that whenever we wanted to run our terraform code, we needed to set some env vars to specify the correct environment's api key. This gets particularly messy on our CI server, as we have a single instance to handle all our environments. When we ran a CI pipeline, there definetely is a way to specify which env it should target and we can very easily use that information in our terraform code. But terraform doesn't provide a native way to read any env vars. It reads `TF_VARS_xx` and target providers can read whetever env vars they expect to configure themselves. In case of Honeycomb, it's `HONEYCOMB_API_KEY`. But we can't mutate this nev var on CI server every time we run a job/pipeline, as there might be multiple jobs, simultaneoulys taregting both the dev and prd environments.

## Solution
We decided to store the API keys in AWS Secrets Manager. Our dev aws account stores the key for dev honeycomb env and prd for prd. We already have tooling in place to pass in the env specific AWS role when running the pipeline, so the terraform aws provider would be configured properly. 

:::note
We could, of couse, modify the tooling to support this Honeycomb case in a similar way. But that didn't sound like a good idea. As it sets the precedent of doing this for all the providers we use or will use.
:::

So, the solution is simple. We use aws provider to fetch the target account's API key and use those to configure the honey-comb provider. Here's the code snippet

```json title="provider.tf"
terraform {
  required_providers {
    honeycombio = {
      source  = "honeycombio/honeycombio"
      version = "~> 0.26.0"
    }
    aws = {
        source = "hashicorp/aws"
    }
  }
}

data "aws_secretsmanager_secret" "honeycomb" {
  name = "<name of aws secret holding honeycomb api key>"
}

data "aws_secretsmanager_secret_version" "honeycomb" {
  secret_id = data.aws_secretsmanager_secret.honeycomb.id
}

locals {
  honeycomb_configuration_key = try(jsondecode(data.aws_secretsmanager_secret_version.honeycomb.secret_string)["configuration_key"], null)
}

provider "honeycombio" {
  api_key = local.honeycomb_configuration_key
}
```

The same idea can be extended to other similar providers or to specify different configuration depending on the environemt, e.g: dev key with limited access and prd key with full access.