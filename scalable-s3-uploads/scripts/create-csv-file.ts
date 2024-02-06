import * as fs from 'fs';
import * as path from 'path';

const generateCSV = (filePath: string, targetSizeInMB: number) => {
  const header =
    'eventId,eventName,eventDate,location,organizerInfo,attendeeList,sessions,costs,additionalNotes,sponsorshipDetails,transportationInfo,accommodationDetails\n';
  const sampleRow = `EVT1001,"Summer Gala","2024-06-20","Beachside Resort","{""organizerId"":""ORG100"",""organizerName"":""John's Events"",""contact"":""john@example.com""}","[{""attendeeId"":""A1001"",""attendeeName"":""Jane Doe"",""status"":""Confirmed""},{""attendeeId"":""A1002"",""attendeeName"":""Doe John"",""status"":""Pending""}]","[{""sessionId"":""S1001"",""sessionName"":""Welcome Speech"",""time"":""2024-06-20T10:00:00Z""},{""sessionId"":""S1002"",""sessionName"":""Closing Ceremony"",""time"":""2024-06-20T18:00:00Z""}]","{""totalAmount"":5000,""currency"":""USD"",""breakdown"":{""venue"":3000,""catering"":1500,""entertainment"":500}}","{""specialRequests"":""Vegetarian, Gluten-free meals"",""accessibility"":""Wheelchair ramps, Sign language interpreters"",""safetyMeasures"":""First aid kits, Emergency exits clearly marked""}","{""sponsors"":[""BigCo"",""MegaCorp""],""sponsorshipLevels"":{""Gold"":10000,""Silver"":5000,""Bronze"":2500}}","{""shuttleService"":true,""pickupLocations"":[""Airport"",""Downtown Hotel"",""Conference Center""],""schedule"":""Every hour from 08:00 to 20:00""}","{""preferredHotels"":[""Beachside Resort"",""Oceanview Hotel""],""bookingInstructions"":""Use event code for discount"",""amenities"":[""Free WiFi"",""Gym access"",""Complimentary breakfast""]}"\n`;

  const stream = fs.createWriteStream(filePath);
  stream.write(header);

  const estimatedRowSize = Buffer.byteLength(sampleRow);
  const targetSize = targetSizeInMB * 1024 * 1024;
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

generateCSV(filePath, 200);
