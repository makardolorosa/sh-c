export enum orderStatus {
  pending = 'Pending (Customer started the checkout process but did not complete it.)',
  awaiting_shipment = 'Order has been pulled and packaged and is awaiting collection from a shipping provider.',
  shipped = 'Order has been shipped, and receipt is confirmed; client has paid for their digital product, and their file(s) are available for download.',
}
