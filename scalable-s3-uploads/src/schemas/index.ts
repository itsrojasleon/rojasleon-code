import { FromSchema } from 'json-schema-to-ts';

export type User = FromSchema<typeof userSchema>;

export const userSchema = {
  type: 'object',
  properties: {
    eventId: {
      type: 'string',
      pattern: 'EVT\\d+'
    },
    eventName: {
      type: 'string'
    },
    eventDate: {
      type: 'string',
      format: 'date'
    },
    location: {
      type: 'string'
    },
    organizerInfo: {
      type: 'object',
      properties: {
        organizerId: {
          type: 'string'
        },
        organizerName: {
          type: 'string'
        },
        contact: {
          type: 'string',
          format: 'email'
        },
        website: {
          type: 'string',
          format: 'uri'
        },
        socialMedia: {
          type: 'object',
          properties: {
            facebook: {
              type: 'string'
            },
            twitter: {
              type: 'string'
            }
          },
          required: ['facebook', 'twitter']
        }
      },
      required: ['organizerId', 'organizerName', 'contact']
    },
    attendeeList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          attendeeId: {
            type: 'string'
          },
          attendeeName: {
            type: 'string'
          },
          status: {
            type: 'string',
            enum: ['Confirmed', 'Pending', 'Interested']
          }
        },
        required: ['attendeeId', 'attendeeName', 'status']
      }
    },
    sessions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string'
          },
          sessionName: {
            type: 'string'
          },
          time: {
            type: 'string',
            format: 'date-time'
          }
        },
        required: ['sessionId', 'sessionName', 'time']
      }
    },
    costs: {
      type: 'object',
      properties: {
        totalAmount: {
          type: 'number'
        },
        currency: {
          type: 'string'
        },
        breakdown: {
          type: 'object',
          properties: {
            venue: { type: 'number' },
            catering: { type: 'number' },
            entertainment: { type: 'number' },
            workshopMaterials: { type: 'number' }
          },
          required: ['venue', 'catering', 'entertainment', 'workshopMaterials']
        }
      },
      required: ['totalAmount', 'currency', 'breakdown']
    },
    additionalNotes: {
      type: 'object'
    },
    sponsorshipDetails: {
      type: 'object'
    },
    transportationInfo: {
      type: 'object'
    },
    accommodationDetails: {
      type: 'object'
    }
  },
  required: [
    'eventId',
    'eventName',
    'eventDate',
    'location',
    'organizerInfo',
    'attendeeList',
    'sessions',
    'costs'
  ]
} as const;
