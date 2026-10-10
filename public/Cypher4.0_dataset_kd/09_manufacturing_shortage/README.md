# Challenge 09 – One Missing Part
**Precision Axle Components**  ·  Data snapshot: morning of Monday 2026-11-16

## Files

### `bom.csv`  (65 rows)

`product`, `component`, `qty_per_unit`

### `components.csv`  (53 rows)

`component`, `description`, `stock_on_hand`, `unit_cost`

### `customer_orders.csv`  (11 rows)

`order`, `customer`, `product`, `qty`, `due_date`, `priority`, `late_penalty`

### `products.csv`  (5 rows)

`product`, `description`, `selling_price`, `margin`

### `purchase_orders.csv`  (25 rows)

`po`, `supplier`, `component`, `qty`, `expected_date`, `status`

### `schedule.csv`  (11 rows)

`run_id`, `date`, `product`, `qty`, `line`

### `substitutes.csv`  (3 rows)

`component`, `approved_substitute`, `notes`, `extra_cost_pct`

### `suppliers.csv`  (53 rows)

`supplier`, `component`, `price`, `lead_time_days`, `moq`, `expedite_cost_pct`

## Notes

- BOM is single-level: `qty_per_unit` components per finished unit.
- `extra_cost_pct` and `expedite_cost_pct` are fractions (0.08 = +8%).
- One production line; schedule covers the next 2 weeks.

At hour 14 an updated version of one of these files will be released. Same columns, same format.