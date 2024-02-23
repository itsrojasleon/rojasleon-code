# AWS lambda power tuning - A practical example

Documentation about the tool can be found [here](https://github.com/alexcasalboni/aws-lambda-power-tuning)

## Prerequisites

- [Bun](https://bun.sh)

## Installation

```bash
bun install
```

## Tests

```shell
bun run test
```

## Deployment

Paste your credentials in your terminal so can be in the same session as the deployment.
Make sure you're in the root of the project.

E.g.:

```bash
export AWS_ACCESS_KEY_ID="value_here"
export AWS_SECRET_ACCESS_KEY="value_here"
export AWS_SESSION_TOKEN="value_here"
```

Then, run the following command:

```bash
bun run deploy
```

## Destroy (after usage)

```bash
bun run destroy
```
