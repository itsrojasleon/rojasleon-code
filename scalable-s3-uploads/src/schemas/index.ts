import { FromSchema } from 'json-schema-to-ts';

export type User = FromSchema<typeof userSchema>;

export const userSchema = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      pattern: 'U\\d+'
    },
    fullName: {
      type: 'string'
    },
    email: {
      type: 'string',
      format: 'email'
    },
    phoneNumber: {
      type: 'string',
      pattern: '\\d{3}-\\d{3}-\\d{4}'
    },
    registrationDate: {
      type: 'string',
      format: 'date-time'
    },
    eventId: {
      type: 'string',
      pattern: 'EVT\\d+'
    },
    eventName: {
      type: 'string'
    },
    attendanceStatus: {
      type: 'string',
      enum: [
        'Confirmed',
        'Interested',
        'Pending',
        'Cancelled',
        'Attended',
        'Not Attended'
      ]
    }
  },
  required: [
    'userId',
    'fullName',
    'email',
    'phoneNumber',
    'registrationDate',
    'eventId',
    'eventName',
    'attendanceStatus'
  ]
} as const;
