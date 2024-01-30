import * as fs from 'fs';
import * as path from 'path';

const generateCSV = (filePath: string, targetSizeInGB: number) => {
  const header =
    'userId,fullName,email,phoneNumber,registrationDate,eventId,eventName,attendanceStatus\n';
  const sampleRow =
    '"U10001","John Doe","johndoe@example.com","123-456-7890","2024-01-20T10:00:00Z","EVT100","Summer Gala","Confirmed"\n';

  const stream = fs.createWriteStream(filePath);
  stream.write(header);

  const estimatedRowSize = Buffer.byteLength(sampleRow);
  const targetSize = targetSizeInGB * 1024;
  const numberOfLines = Math.ceil(targetSize / estimatedRowSize);

  for (let i = 0; i < numberOfLines; i++) {
    const updatedRow = sampleRow
      .replace('U10001', `U${10001 + i}`)
      .replace('EVT100', `EVT${100 + i}`);
    stream.write(updatedRow);
  }

  stream.end();
};

const filePath = path.join(__dirname, 'largefile.csv');

generateCSV(filePath, 1);
