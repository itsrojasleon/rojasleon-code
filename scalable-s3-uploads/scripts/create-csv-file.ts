import * as fs from 'fs';
import * as path from 'path';

const generateCSV = (filePath: string, targetSizeInMB: number) => {
  const header =
    'eventId,eventName,eventDate,location,organizerInfo,attendeeList,sessions,costs,additionalNotes,sponsorshipDetails,transportationInfo,accommodationDetails\n';
  const sampleRow = `EVT1001,"Summer Gala","2024-06-20","Beachside Resort","{""organizerId"":""ORG100"",""organizerName"":""John's Events"",""contact"":""john@example.com"",""website"":""http://johnsevents.com"",""socialMedia"":{""facebook"":""JohnsEventsFB"",""twitter"":""@JohnsEvents""}}","[{""attendeeId"":""A1001"",""attendeeName"":""Jane Doe"",""status"":""Confirmed""},{""attendeeId"":""A1002"",""attendeeName"":""Doe John"",""status"":""Pending""},{""attendeeId"":""A1003"",""attendeeName"":""Alex Smith"",""status"":""Confirmed""},{""attendeeId"":""A1004"",""attendeeName"":""Sam Lee"",""status"":""Interested""}]","[{""sessionId"":""S1001"",""sessionName"":""Welcome Speech"",""time"":""2024-06-20T10:00:00Z""},{""sessionId"":""S1002"",""sessionName"":""Closing Ceremony"",""time"":""2024-06-20T18:00:00Z""},{""sessionId"":""S1003"",""sessionName"":""Networking Lunch"",""time"":""2024-06-20T12:00:00Z""},{""sessionId"":""S1004"",""sessionName"":""Panel Discussion: Future of Industry"",""time"":""2024-06-20T14:00:00Z""}]","{""totalAmount"":6500,""currency"":""USD"",""breakdown"":{""venue"":3000,""catering"":2000,""entertainment"":1000,""workshopMaterials"":500}}","{""specialRequests"":""Vegetarian, Gluten-free meals, Nut-free options"",""accessibility"":""Wheelchair ramps, Sign language interpreters, Braille materials"",""safetyMeasures"":""First aid kits, Emergency exits clearly marked, On-site medical staff""}","{""sponsors"":[""BigCo"",""MegaCorp"",""EcoFriendlyInc""],""sponsorshipLevels"":{""Platinum"":15000,""Gold"":10000,""Silver"":5000,""Bronze"":2500,""Community"":1000}}","{""shuttleService"":true,""pickupLocations"":[""Airport"",""Downtown Hotel"",""Conference Center"",""Railway Station""],""schedule"":""Every 30 minutes from 07:00 to 22:00""}","{""preferredHotels"":[""Beachside Resort"",""Oceanview Hotel"",""City Center Lodge""],""bookingInstructions"":""Use event code EVT2024 for discount"",""amenities"":[""Free WiFi"",""Gym access"",""Complimentary breakfast"",""Spa discounts""]}"\n`;

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

generateCSV(filePath, 150);
