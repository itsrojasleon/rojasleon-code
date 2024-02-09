import axios from 'axios';
import FormData from 'form-data';
import fs from 'node:fs';

interface UploadFileToS3Input {
  filePath: string;
  url: string;
  fields: Record<string, string>;
}

const uploadFileToS3 = async ({
  filePath,
  url,
  fields
}: UploadFileToS3Input) => {
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

const s3UploadInfo = {
  url: '',
  fields: {}
};

uploadFileToS3({
  filePath: __dirname + '/largefile.csv',
  url: s3UploadInfo.url,
  fields: s3UploadInfo.fields
});
