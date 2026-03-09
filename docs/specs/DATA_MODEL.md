# DATA_MODEL.md

## Category
- id
- name
- slug

## Product
- id
- name
- slug
- categoryId
- price
- wholesalePrice
- description
- stockQuantity
- imageUrl

## Customer
- id
- fullName
- phone
- email
- region
- city
- address

## Order
- id
- orderCode
- customerId
- subtotal
- deliveryFee
- total
- paymentStatus
- orderStatus

## OrderItem
- id
- orderId
- productId
- quantity
- unitPrice