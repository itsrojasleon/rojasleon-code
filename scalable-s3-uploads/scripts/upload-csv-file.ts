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
      'ASIATBJJETHDVFVB46WV/20240201/us-east-1/s3/aws4_request',
    'X-Amz-Date': '20240201T032546Z',
    'X-Amz-Security-Token':
      'IQoJb3JpZ2luX2VjEHQaCXVzLWVhc3QtMSJHMEUCIQDjB8/DvmFTJNt9OizVuKOOfU6iIgyx70utUUeBNzgrgQIgdwVsGFa4Sxvx02wIiP93BTk2gZn3otgQz8DK++bIyd4q0wMIPRACGgwyMDg5MjkwNjk1MTEiDLMrv9jYMzGCObsugCqwA/ct2WenglNo7Qv3z9cZ6me3U+1/CLjOwPblxHSAYtS9xm8UR5rSw+jcrLUMrcEMDbjqZbqvH4dzMjHDKWTt+Y77A950f4CacHy8TM7/nefO+GhXlKbw54uoKlk5JnW9G4ooa5GfFpQr8QsTrXvDWoSJ74KWY8h6TtN5TOrJBWy1HpT4tLQQ/GhjuoEbBmojDjcnKQtXC+4F4UECRZGeTfLeMSXBr0PPfeW0gwLpxPzlUU2KSBOK+JlLs5KSGQ7nJ4mZqCXqVjehjB4tT/HXZmdjzOeCleKg5VyNglL5WFVXRPVbDfCqBYtNyY09ST5zTB/cLLyd2kztqX0lfiiAThOCWcmNJgUG4iVoANHlggqCQjUio3d3UF46TEuWjaQVN1JybRffmb9r3iQxDzo7Gx//xLrBrBjd3Kom/3hbITwETdEhE/VY+dPtLgt+6BrEsX1h01Nxjrp8H9ReCUWGdT6aBWfwTSgOYcXxDlLNZhCx8fjg3h0Nm0GiErFVBMsD2cXiro+RtAfafwpvmFBci49DE/FEM6h/aitNvr/76fD60YA9TzOvqd1j9N8GyLXzfDC5nuytBjqeAUlVipBvtf8cI5yZfXPg1Nil0LoNa6mPGpUy5LxHXVqyK20/pIjXZTA5rtGFP6lVcT4c66e5R6CEPw9TupnvX2DQXY4KG7vZPti8amwdnDzvegFAVTLYLbTPfL9g8CtZ3b6MlE832Mft70RYTS8YGuR2zO451xGEEVdRzChbp6nRgcbf9IHBfbpvAzzi+F7JiSBgJm1jZIdXyNuCXs56',
    key: '/uploads/hxneal4611e.csv',
    Policy:
      'eyJleHBpcmF0aW9uIjoiMjAyNC0wMi0wMVQwNDoyNTo0NloiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJzY2FsYWJsZS1zMy11cGxvYWRzLWJ1Y2tldDQzODc5YzcxLXRncmRpamJzbHZtaCJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFTSUFUQkpKRVRIRFZGVkI0NldWLzIwMjQwMjAxL3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IlgtQW16LURhdGUiOiIyMDI0MDIwMVQwMzI1NDZaIn0seyJYLUFtei1TZWN1cml0eS1Ub2tlbiI6IklRb0piM0pwWjJsdVgyVmpFSFFhQ1hWekxXVmhjM1F0TVNKSE1FVUNJUURqQjgvRHZtRlRKTnQ5T2l6VnVLT09mVTZpSWd5eDcwdXRVVWVCTnpncmdRSWdkd1ZzR0ZhNFN4dngwMndJaVA5M0JUazJnWm4zb3RnUXo4REsrK2JJeWQ0cTB3TUlQUkFDR2d3eU1EZzVNamt3TmprMU1URWlETE1ydjlqWU16R0NPYnN1Z0Nxd0EvY3QyV2VuZ2xObzdRdjN6OWNaNm1lM1UrMS9DTGpPd1BibHhIU0FZdFM5eG04VVI1clN3K2pjckxVTXJjRU1EYmpxWmJxdkg0ZHpNakhES1dUdCtZNzdBOTUwZjRDYWNIeThUTTcvbmVmTytHaFhsS2J3NTR1b0tsazVKblc5RzRvb2E1R2ZGcFFyOFFzVHJYdkRXb1NKNzRLV1k4aDZUdE41VE9ySkJXeTFIcFQ0dExRUS9HaGp1b0ViQm1vakRqY25LUXRYQys0RjRVRUNSWkdlVGZMZU1TWEJyMFBQZmVXMGd3THB4UHpsVVUyS1NCT0srSmxMczVLU0dRN25KNG1acUNYcVZqZWhqQjR0VC9IWFptZGp6T2VDbGVLZzVWeU5nbEw1V0ZWWFJQVmJEZkNxQll0TnlZMDlTVDV6VEIvY0xMeWQya3p0cVgwbGZpaUFUaE9DV2NtTkpnVUc0aVZvQU5IbGdncUNRalVpbzNkM1VGNDZURXVXamFRVk4xSnliUmZmbWI5cjNpUXhEem83R3gvL3hMckJyQmpkM0tvbS8zaGJJVHdFVGRFaEUvVlkrZFB0TGd0KzZCckVzWDFoMDFOeGpycDhIOVJlQ1VXR2RUNmFCV2Z3VFNnT1ljWHhEbExOWmhDeDhmamczaDBObTBHaUVyRlZCTXNEMmNYaXJvK1J0QWZhZndwdm1GQmNpNDlERS9GRU02aC9haXROdnIvNzZmRDYwWUE5VHpPdnFkMWo5TjhHeUxYemZEQzVudXl0QmpxZUFVbFZpcEJ2dGY4Y0k1eVpmWFBnMU5pbDBMb05hNm1QR3BVeTVMeEhYVnF5SzIwL3BJalhaVEE1cnRHRlA2bFZjVDRjNjZlNVI2Q0VQdzlUdXBudlgyRFFYWTRLRzd2WlB0aThhbXdkbkR6dmVnRkFWVExZTGJUUGZMOWc4Q3RaM2I2TWxFODMyTWZ0NzBSWVRTOFlHdVIyek80NTF4R0VFVmRSekNoYnA2blJnY2JmOUlIQmZicHZBenppK0Y3SmlTQmdKbTFqWklkWHlOdUNYczU2In0seyJrZXkiOiIvdXBsb2Fkcy9oeG5lYWw0NjExZS5jc3YifV19',
    'X-Amz-Signature':
      '546bf20a6463d491b4dbc6c78855b77912802127d39484bbc8faf0ca31121447'
  }
};

uploadFileToS3(filePath, s3UploadInfo.url, s3UploadInfo.fields);
