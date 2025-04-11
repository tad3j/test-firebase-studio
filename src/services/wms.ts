/**
 * Represents an order from the WMS.
 */
export interface WmsOrder {
  /**
   * The order ID.
   */
  orderId: string;
  /**
   * The order date.
   */
  orderDate: string;
  /**
   * The order items.
   */
  orderItems: WmsOrderItem[];
  /**
   * The shipping address.
   */
  shippingAddress: string;
}

/**
 * Represents an item in an order from the WMS.
 */
export interface WmsOrderItem {
  /**
   * The item ID.
   */
  itemId: string;
  /**
   * The item quantity.
   */
  itemQuantity: number;
}

/**
 * Represents inventory data from the WMS.
 */
export interface WmsInventory {
  /**
   * The item ID.
   */
  itemId: string;
  /**
   * The item quantity.
   */
  itemQuantity: number;
}

/**
 * Asynchronously retrieves orders from the WMS.
 *
 * @returns A promise that resolves to an array of WmsOrder objects.
 */
export async function getWmsOrders(): Promise<WmsOrder[]> {
  // TODO: Implement this by calling the WMS API.

  return [
    {
      orderId: '123',
      orderDate: '2024-01-01',
      orderItems: [
        {
          itemId: 'A123',
          itemQuantity: 2,
        },
        {
          itemId: 'B456',
          itemQuantity: 1,
        },
      ],
      shippingAddress: '123 Main St',
    },
  ];
}

/**
 * Asynchronously retrieves inventory data from the WMS.
 *
 * @returns A promise that resolves to an array of WmsInventory objects.
 */
export async function getWmsInventory(): Promise<WmsInventory[]> {
  // TODO: Implement this by calling the WMS API.

  return [
    {
      itemId: 'A123',
      itemQuantity: 100,
    },
    {
      itemId: 'B456',
      itemQuantity: 50,
    },
  ];
}
