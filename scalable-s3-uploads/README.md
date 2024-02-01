# Scalable S3 uploads

This project is a proof of concept for uploading large files to S3 in a scalable way using a simple architecture but yet powerful.

## Requirements

- [Bun](https://bun.sh)

## Installation

```shell
bun install
```

## Running tests

```shell
bun run test
```

## Deploying

```shell
bun run deploy
```

## Running scripts

To create a csv file containing sample data, run the following command:

```shell
bun scripts/create-csv-file.ts
```

To upload the file to S3, first make sure you already have the presigned url and generated the file using previous command, then run:

```shell
bun scripts/upload-csv-file.ts
```

Quickly you'll see a file named `largefile.csv` in the same `scripts` folder.
