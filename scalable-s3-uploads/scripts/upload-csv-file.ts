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
      'ASIATBJJETHDQPE5ZP5I/20240204/us-east-1/s3/aws4_request',
    'X-Amz-Date': '20240204T060417Z',
    'X-Amz-Security-Token':
      'IQoJb3JpZ2luX2VjEL///////////wEaCXVzLWVhc3QtMSJIMEYCIQCfMQZXqjefJ2F46MqkAUSlOyVm/w6H+1nDPw8lGPg+vAIhAOJCdd8RJUtRPvmiTgbKMpNR9JSOaemx6aJBatvbCUeZKtwDCIf//////////wEQAhoMMjA4OTI5MDY5NTExIgxbsHsdD9iXWalfH+cqsAOxgUL/CYD8XXJsOWhbbe1YRPkRfp4FUCZghTpyfLZydGTCEc8/s8eyNmn0t84lQ6c8CR2FQE8uhLwm9eh+FHqF5Ex7GKHMfHMRrVP/KztWIte9vHWbexNInaa0t6EFe92qPoxhb4rObtt2DAE59Bde8K0+DnYBGYUiUvcn79hCu3HbhumMKUHYCTp9p6nf0dIW2QHFn69jIoy/T185dobiJ8aHeQrU4wMmdRYYrdrNzmNXA8AdgLIQlzrSx1KTOcsruEfc2qrhKTBcFZ0iJ5yhNzi1nnXtOPHVhWbm/DXYPn8tF88/N56N1uL8YG/dqli8VD4PgC2Cl67pzT1fqLYgluC17BLKMl0IE8Y1d+43Ura5UafvowEoy8Xj97dF+83jLibXFcC/CKc4WgbEo+RLMmA+cDI1gb7ziEWtX6u0a4o8R9zPXLW19hFMVCTS6+kCeJ4nkIP+3eK5OK86Ldk4T+s20Uq3ozIw7awgVWtCx2r9ijAuwOZNJG0COQOCmeHKHKCsO1ByVfZt3x/ipoZtfj5TOJwk2va8dfF+e0CvZ+xjdVDz51fsNQlGAUkE2sow4NH8rQY6nQEiWm7j6iFXSMYSSxBmsqzqsoHIjsqL2A5+fj/WWbsx76KreYnBnNKF34YRn1AYwCMDhBBky3BBJ6Im7Efg2sMFkUuWotvWUk31zqDiSWQw40ezvFEBNStm8FAMLBmLdT5vofJkIlHmdczxfBIy2V0pY/SmXmAVO/NAA38kycEGzaWdXDKrw8lJ/sYqlZlAXIC0o6H4KGevSnZa6IAz',
    key: 'uploads/ls73lioqz026qsn0v4n.csv',
    Policy:
      'eyJleHBpcmF0aW9uIjoiMjAyNC0wMi0wNFQwNzowNDoxN1oiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJzY2FsYWJsZS1zMy11cGxvYWRzLWJ1Y2tldDQzODc5YzcxLXRncmRpamJzbHZtaCJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFTSUFUQkpKRVRIRFFQRTVaUDVJLzIwMjQwMjA0L3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IlgtQW16LURhdGUiOiIyMDI0MDIwNFQwNjA0MTdaIn0seyJYLUFtei1TZWN1cml0eS1Ub2tlbiI6IklRb0piM0pwWjJsdVgyVmpFTC8vLy8vLy8vLy8vd0VhQ1hWekxXVmhjM1F0TVNKSU1FWUNJUUNmTVFaWHFqZWZKMkY0Nk1xa0FVU2xPeVZtL3c2SCsxbkRQdzhsR1BnK3ZBSWhBT0pDZGQ4UkpVdFJQdm1pVGdiS01wTlI5SlNPYWVteDZhSkJhdHZiQ1VlWkt0d0RDSWYvLy8vLy8vLy8vd0VRQWhvTU1qQTRPVEk1TURZNU5URXhJZ3hic0hzZEQ5aVhXYWxmSCtjcXNBT3hnVUwvQ1lEOFhYSnNPV2hiYmUxWVJQa1JmcDRGVUNaZ2hUcHlmTFp5ZEdUQ0VjOC9zOGV5Tm1uMHQ4NGxRNmM4Q1IyRlFFOHVoTHdtOWVoK0ZIcUY1RXg3R0tITWZITVJyVlAvS3p0V0l0ZTl2SFdiZXhOSW5hYTB0NkVGZTkycVBveGhiNHJPYnR0MkRBRTU5QmRlOEswK0RuWUJHWVVpVXZjbjc5aEN1M0hiaHVtTUtVSFlDVHA5cDZuZjBkSVcyUUhGbjY5aklveS9UMTg1ZG9iaUo4YUhlUXJVNHdNbWRSWVlyZHJOem1OWEE4QWRnTElRbHpyU3gxS1RPY3NydUVmYzJxcmhLVEJjRlowaUo1eWhOemkxbm5YdE9QSFZoV2JtL0RYWVBuOHRGODgvTjU2TjF1TDhZRy9kcWxpOFZENFBnQzJDbDY3cHpUMWZxTFlnbHVDMTdCTEtNbDBJRThZMWQrNDNVcmE1VWFmdm93RW95OFhqOTdkRis4M2pMaWJYRmNDL0NLYzRXZ2JFbytSTE1tQStjREkxZ2I3emlFV3RYNnUwYTRvOFI5elBYTFcxOWhGTVZDVFM2K2tDZUo0bmtJUCszZUs1T0s4NkxkazRUK3MyMFVxM296SXc3YXdnVld0Q3gycjlpakF1d09aTkpHMENPUU9DbWVIS0hLQ3NPMUJ5VmZadDN4L2lwb1p0Zmo1VE9Kd2sydmE4ZGZGK2UwQ3ZaK3hqZFZEejUxZnNOUWxHQVVrRTJzb3c0Tkg4clFZNm5RRWlXbTdqNmlGWFNNWVNTeEJtc3F6cXNvSElqc3FMMkE1K2ZqL1dXYnN4NzZLcmVZbkJuTktGMzRZUm4xQVl3Q01EaEJCa3kzQkJKNkltN0VmZzJzTUZrVXVXb3R2V1VrMzF6cURpU1dRdzQwZXp2RkVCTlN0bThGQU1MQm1MZFQ1dm9mSmtJbEhtZGN6eGZCSXkyVjBwWS9TbVhtQVZPL05BQTM4a3ljRUd6YVdkWERLcnc4bEovc1lxbFpsQVhJQzBvNkg0S0dldlNuWmE2SUF6In0seyJrZXkiOiJ1cGxvYWRzL2xzNzNsaW9xejAyNnFzbjB2NG4uY3N2In1dfQ==',
    'X-Amz-Signature':
      '3d905fcd416011827965114433b01eb6f89de6cddec7851b8982c1b7d2bcfed7'
  }
};

uploadFileToS3(filePath, s3UploadInfo.url, s3UploadInfo.fields);
