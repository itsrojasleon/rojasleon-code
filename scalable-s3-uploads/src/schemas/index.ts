import { FromSchema } from 'json-schema-to-ts';

export type Order = FromSchema<typeof orderSchema>;

export const orderSchema = {
  type: 'object',
  properties: {
    orderId: {
      type: 'string'
    },
    customerId: {
      type: 'string'
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          quantity: {
            type: 'number'
          },
          price: {
            type: 'number'
          }
        },
        required: ['productId', 'name', 'quantity', 'price']
      }
    },
    paymentInfo: {
      type: 'object',
      properties: {
        method: {
          type: 'string'
        },
        totalAmount: {
          type: 'number'
        },
        currency: {
          type: 'string'
        }
      },
      required: ['method', 'totalAmount', 'currency']
    },
    orderDate: {
      type: 'string',
      format: 'date-time'
    },
    deliveryDate: {
      type: 'string',
      format: 'date-time'
    },
    status: {
      type: 'string'
    }
  },
  required: [
    'orderId',
    'customerId',
    'items',
    'paymentInfo',
    'orderDate',
    'deliveryDate',
    'status'
  ]
} as const;
