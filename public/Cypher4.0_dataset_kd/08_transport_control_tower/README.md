# Challenge 08 – The Truck Near Hubli
**Sudha Home Products**  ·  Data snapshot: 2026-11-16 10:00 (live snapshot)

## Files

### `carriers.csv`  (6 rows)

`carrier`, `lanes_served`, `rate`, `truck_types`, `on_time_rate_90d`

### `commitments.csv`  (42 rows)

`customer`, `depot`, `sku`, `qty_cases`, `promised_delivery`, `priority`

### `depot_inventory.csv`  (180 rows)

`depot`, `sku`, `stock_cases`, `avg_daily_demand_cases`

### `lanes.csv`  (35 rows)

`origin`, `destination`, `distance_km`, `transit_hours`

### `plant_stock.csv`  (24 rows)

`plant`, `sku`, `stock_cases`

### `products.csv`  (12 rows)

`sku`, `product`

### `shipment_status.csv`  (436 rows)

`shipment_id`, `timestamp`, `status`, `revised_eta`

### `shipments.csv`  (219 rows)

`shipment_id`, `origin`, `destination`, `carrier`, `sku`, `qty_cases`, `truck_capacity_cases`, `dispatch_time`, `planned_arrival`

## Notes

- `shipment_status.csv` is an event log; the latest row per shipment is its current status.
- Depot demand is in cases per day; depots sell around the clock.
- `lanes.csv` includes a few depot-to-depot lanes for transfers.

At hour 14 an updated version of one of these files will be released. Same columns, same format.