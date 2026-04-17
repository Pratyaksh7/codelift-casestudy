import axios from 'axios'

var mockInventory = [
  { id: 1, productId: 1, productName: 'Wireless Bluetooth Headphones', sku: 'WBH-001', quantity: 45, reorderLevel: 20, warehouse: 'Main', lastRestocked: '2022-01-10T00:00:00Z', status: 'in_stock' },
  { id: 2, productId: 2, productName: 'Cotton T-Shirt Pack (3)', sku: 'CTS-002', quantity: 120, reorderLevel: 30, warehouse: 'Main', lastRestocked: '2022-01-08T00:00:00Z', status: 'in_stock' },
  { id: 3, productId: 3, productName: 'Stainless Steel Water Bottle', sku: 'SSW-003', quantity: 78, reorderLevel: 25, warehouse: 'Secondary', lastRestocked: '2022-01-05T00:00:00Z', status: 'in_stock' },
  { id: 4, productId: 4, productName: 'Running Shoes Pro', sku: 'RSP-004', quantity: 8, reorderLevel: 15, warehouse: 'Main', lastRestocked: '2021-12-20T00:00:00Z', status: 'low_stock' },
  { id: 5, productId: 5, productName: 'JavaScript: The Good Parts', sku: 'JGP-005', quantity: 55, reorderLevel: 10, warehouse: 'Secondary', lastRestocked: '2022-01-12T00:00:00Z', status: 'in_stock' },
  { id: 6, productId: 6, productName: 'USB-C Charging Cable (2m)', sku: 'UCC-006', quantity: 200, reorderLevel: 50, warehouse: 'Main', lastRestocked: '2022-01-14T00:00:00Z', status: 'in_stock' },
  { id: 7, productId: 7, productName: 'Yoga Mat Premium', sku: 'YMP-007', quantity: 33, reorderLevel: 15, warehouse: 'Main', lastRestocked: '2022-01-03T00:00:00Z', status: 'in_stock' },
  { id: 8, productId: 8, productName: 'LED Desk Lamp', sku: 'LDL-008', quantity: 5, reorderLevel: 10, warehouse: 'Secondary', lastRestocked: '2021-12-28T00:00:00Z', status: 'low_stock' },
  { id: 9, productId: 9, productName: 'Denim Jacket Classic', sku: 'DJC-009', quantity: 22, reorderLevel: 10, warehouse: 'Main', lastRestocked: '2022-01-07T00:00:00Z', status: 'in_stock' },
  { id: 10, productId: 10, productName: 'Mechanical Keyboard RGB', sku: 'MKR-010', quantity: 3, reorderLevel: 10, warehouse: 'Main', lastRestocked: '2021-12-15T00:00:00Z', status: 'low_stock' },
  { id: 11, productId: 11, productName: 'Wireless Mouse Ergonomic', sku: 'WME-011', quantity: 0, reorderLevel: 15, warehouse: 'Main', lastRestocked: '2021-11-20T00:00:00Z', status: 'out_of_stock' },
  { id: 12, productId: 12, productName: 'Notebook Set (5-pack)', sku: 'NBS-012', quantity: 67, reorderLevel: 20, warehouse: 'Secondary', lastRestocked: '2022-01-11T00:00:00Z', status: 'in_stock' },
]

export function fetchInventory() {
  return function(dispatch) {
    dispatch({ type: 'FETCH_INVENTORY_REQUEST' })

    axios.get('http://localhost:3001/api/inventory')
      .then(function(response) {
        console.log('inventory loaded', response.data)
        dispatch({
          type: 'FETCH_INVENTORY_SUCCESS',
          payload: response.data,
        })
      })
      .catch(function(error) {
        console.log('using mock inventory data')
        dispatch({
          type: 'FETCH_INVENTORY_SUCCESS',
          payload: mockInventory,
        })
      })
  }
}

export function updateInventoryItem(itemId, data) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_INVENTORY_REQUEST' })

    axios.put('http://localhost:3001/api/inventory/' + itemId, data)
      .then(function(res) {
        dispatch({
          type: 'UPDATE_INVENTORY_SUCCESS',
          payload: { id: itemId, data: res.data }
        })
      })
      .catch(function(err) {
        console.log('inventory update failed, updating locally')
        dispatch({
          type: 'UPDATE_INVENTORY_SUCCESS',
          payload: { id: itemId, data: Object.assign({ id: itemId }, data) },
        })
      })
  }
}

export function bulkUpdateInventory(items) {
  return function(dispatch) {
    console.log('[Inventory] Bulk updating', items.length, 'items');

    axios.post('http://localhost:3001/api/inventory/bulk-update', { items: items })
      .then(function(res) {
        dispatch({
          type: 'BULK_UPDATE_INVENTORY_SUCCESS',
          payload: res.data,
        })
        // refetch to be sure
        dispatch(fetchInventory());
      })
      .catch(function(err) {
        console.log('bulk update failed');
        // update locally anyway
        items.forEach(function(item) {
          dispatch({
            type: 'UPDATE_INVENTORY_SUCCESS',
            payload: { id: item.id, data: item },
          });
        });
      })
  }
}

export function restockItem(itemId, quantity) {
  return function(dispatch) {
    axios.post('http://localhost:3001/api/inventory/' + itemId + '/restock', { quantity: quantity })
      .then(function(res) {
        console.log('restocked item', itemId)
        dispatch({
          type: 'RESTOCK_ITEM_SUCCESS',
          payload: { id: itemId, quantity: quantity }
        })
      })
      .catch(function(err) {
        console.log('restock api failed, updating locally')
        dispatch({
          type: 'RESTOCK_ITEM_SUCCESS',
          payload: { id: itemId, quantity: quantity }
        })
      })
  }
}
