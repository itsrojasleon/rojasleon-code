import axios from 'axios';
import FormData from 'form-data';
import fs from 'node:fs';

const uploadFileToS3 = async (
  filePath: string,
  url: string,
  fields: Record<string, string>
) => {
  try {
    const fileStream = fs.createReadStream(filePath);

    const formData = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('file', fileStream);

    const response = await axios.post(url, formData, {
      headers: formData.getHeaders()
    });

    console.log('File uploaded successfully:', response.status);
  } catch (err: any) {
    console.error('Error uploading file:', err.message);
  }
};

const filePath = __dirname + '/largefile.csv';

console.log('Uploading file to S3...', filePath);
const s3UploadInfo = {
  url: 'https://scalable-s3-uploads-bucket43879c71-tgrdijbslvmh.s3.us-east-1.amazonaws.com/',
  fields: {
    bucket: 'scalable-s3-uploads-bucket43879c71-tgrdijbslvmh',
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential':
      'ASIATBJJETHDV53D3E63/20240205/us-east-1/s3/aws4_request',
    'X-Amz-Date': '20240205T233048Z',
    'X-Amz-Security-Token':
      'IQoJb3JpZ2luX2VjEOj//////////wEaCXVzLWVhc3QtMSJIMEYCIQDQHln6QyHUcLUNUErES1IkFdBdLWUcwyrffKOlK/RWcAIhAPQip3jPGgDcr21+mKRCMEk7TuP6NQm1gFKxTXQZ5uBRKtwDCLH//////////wEQAhoMMjA4OTI5MDY5NTExIgxfpDSyc1sB4S2MDAQqsAO41YKDuutCG/Wy8ywCYaJtAvkgWXxA1w/zB1hZ5FLOJUDWxOlwoCcqkX10fZqz8x3XwM4HS+8tJUGvzUgYzDJEKV8MkvnR4g40126T93Lr2mfehh8LnjKpH5ktnbw3DG22a4EJwuA3t8j5YeRaKgCLq8tuudDFE4KEFE2IvlTuiahGde5EmNu44DcRv1uWkzcrKOpCl6EbS9pcDZbFqWWE5SND/BJp+ohpgdKlcpmxGJaHCsH9/i8/qIpnXR71w72XPInU/yB/cbdvRuoi1SmwtlmymKHuUgvKDHCnGnLbPPXE1LCCvDEeB2e0zrRyxep8hEDJhp26v2VrdCXnMAA2EcSJ3LkIvSeINxUqEtVRzNpM9br4zltkCIiu95D+csrWeqT9JS/nEDEvjsBMi4VaMkMUebP9ue5S7SgBFOTJtbmbqikLDtKSFPU9hS91gw8sbSCSPyU6isSMg2YD8fM+5P3MrMWOLqebLOAuvErpkyX/n4sruan1vh3oPQPpXhFp5wNmlpyGQ3FmpndtTcFslQYHm15KD3JwweI95IQgOTkZwBYAeBJ0kMEY81wc090wqN+FrgY6nQEyN0VWhZUFMo8CYuei9VGnMAI+r1u2w4pxFrQQuVCFakmDbLY5Y7Hy+YbpmCEkvkxgsW456mfs/J7c0pfA2cRQyv4cqep2Ct5DVVAlU6O9e0Hy5sM3+9oAUIZov0jpOrRsJeLF1LqluHrGBoNmTx8YvPZLI/LMdhqrsTvGms/UjHWdg8EUtsinSFTAC7odum3Q9vQkJMn8D8f2Nl3C',
    key: 'uploads/ls9kf7jj63sdyk58p2a.csv',
    Policy:
      'eyJleHBpcmF0aW9uIjoiMjAyNC0wMi0wNlQwMDozMDo0OFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJzY2FsYWJsZS1zMy11cGxvYWRzLWJ1Y2tldDQzODc5YzcxLXRncmRpamJzbHZtaCJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFTSUFUQkpKRVRIRFY1M0QzRTYzLzIwMjQwMjA1L3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IlgtQW16LURhdGUiOiIyMDI0MDIwNVQyMzMwNDhaIn0seyJYLUFtei1TZWN1cml0eS1Ub2tlbiI6IklRb0piM0pwWjJsdVgyVmpFT2ovLy8vLy8vLy8vd0VhQ1hWekxXVmhjM1F0TVNKSU1FWUNJUURRSGxuNlF5SFVjTFVOVUVyRVMxSWtGZEJkTFdVY3d5cmZmS09sSy9SV2NBSWhBUFFpcDNqUEdnRGNyMjErbUtSQ01FazdUdVA2TlFtMWdGS3hUWFFaNXVCUkt0d0RDTEgvLy8vLy8vLy8vd0VRQWhvTU1qQTRPVEk1TURZNU5URXhJZ3hmcERTeWMxc0I0UzJNREFRcXNBTzQxWUtEdXV0Q0cvV3k4eXdDWWFKdEF2a2dXWHhBMXcvekIxaFo1RkxPSlVEV3hPbHdvQ2Nxa1gxMGZacXo4eDNYd000SFMrOHRKVUd2elVnWXpESkVLVjhNa3ZuUjRnNDAxMjZUOTNMcjJtZmVoaDhMbmpLcEg1a3RuYnczREcyMmE0RUp3dUEzdDhqNVllUmFLZ0NMcTh0dXVkREZFNEtFRkUySXZsVHVpYWhHZGU1RW1OdTQ0RGNSdjF1V2t6Y3JLT3BDbDZFYlM5cGNEWmJGcVdXRTVTTkQvQkpwK29ocGdkS2xjcG14R0phSENzSDkvaTgvcUlwblhSNzF3NzJYUEluVS95Qi9jYmR2UnVvaTFTbXd0bG15bUtIdVVndktESENuR25MYlBQWEUxTENDdkRFZUIyZTB6clJ5eGVwOGhFREpocDI2djJWcmRDWG5NQUEyRWNTSjNMa0l2U2VJTnhVcUV0VlJ6TnBNOWJyNHpsdGtDSWl1OTVEK2NzcldlcVQ5SlMvbkVERXZqc0JNaTRWYU1rTVVlYlA5dWU1UzdTZ0JGT1RKdGJtYnFpa0xEdEtTRlBVOWhTOTFndzhzYlNDU1B5VTZpc1NNZzJZRDhmTSs1UDNNck1XT0xxZWJMT0F1dkVycGt5WC9uNHNydWFuMXZoM29QUVBwWGhGcDV3Tm1scHlHUTNGbXBuZHRUY0ZzbFFZSG0xNUtEM0p3d2VJOTVJUWdPVGtad0JZQWVCSjBrTUVZODF3YzA5MHdxTitGcmdZNm5RRXlOMFZXaFpVRk1vOENZdWVpOVZHbk1BSStyMXUydzRweEZyUVF1VkNGYWttRGJMWTVZN0h5K1licG1DRWt2a3hnc1c0NTZtZnMvSjdjMHBmQTJjUlF5djRjcWVwMkN0NURWVkFsVTZPOWUwSHk1c00zKzlvQVVJWm92MGpwT3JSc0plTEYxTHFsdUhyR0JvTm1UeDhZdlBaTEkvTE1kaHFyc1R2R21zL1VqSFdkZzhFVXRzaW5TRlRBQzdvZHVtM1E5dlFrSk1uOEQ4ZjJObDNDIn0seyJrZXkiOiJ1cGxvYWRzL2xzOWtmN2pqNjNzZHlrNThwMmEuY3N2In1dfQ==',
    'X-Amz-Signature':
      '8b7493d0ce90f768239cea7ad84e57542063ca30c34b4d149c6ea031651a1eb3'
  }
};

uploadFileToS3(filePath, s3UploadInfo.url, s3UploadInfo.fields);
