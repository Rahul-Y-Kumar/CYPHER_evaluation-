# Challenge 11 – Three Small Warnings
**Malnad Industrial Pumps**  ·  Data snapshot: morning of 2026-11-16; 12 months of history

## Files

### `compliance_docs.csv`  (450 rows)

`supplier`, `doc_type`, `number`, `expiry_or_status`

### `contracts.csv`  (495 rows)

`supplier`, `item`, `contract_price`, `valid_from`, `valid_to`

### `inspections.csv`  (3,862 rows)

`supplier`, `item`, `lot`, `date`, `qty_inspected`, `qty_rejected`, `defect_type`

### `item_demand.csv`  (302 rows)

`item`, `monthly_use`, `stock`

### `items.csv`  (302 rows)

`item`, `description`, `category`, `criticality`, `approved_suppliers`

### `purchase_orders.csv`  (3,862 rows)

`po`, `supplier`, `item`, `qty`, `price_paid`, `order_date`, `promised_date`, `received_date`

### `suppliers.csv`  (150 rows)

`supplier`, `category`, `location`, `approval_status`

## Notes

- `items.csv` `approved_suppliers` is semicolon-separated.
- Stock cover in months = `stock` ÷ `monthly_use`.
- `compliance_docs.csv` shows an expiry date, or a status for registrations without expiry.

At hour 14 an updated version of one of these files will be released. Same columns, same format.