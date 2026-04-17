var initialState = {
  items: [],
  loading: false,
  updating: false,
  error: null,
}

export default function inventoryReducer(state, action) {
  if (typeof state === 'undefined') {
    state = initialState
  }

  switch (action.type) {
    case 'FETCH_INVENTORY_REQUEST':
      return Object.assign({}, state, {
        loading: true,
        error: null
      })

    case 'FETCH_INVENTORY_SUCCESS':
      return Object.assign({}, state, {
        items: action.payload,
        loading: false,
      })

    case 'FETCH_INVENTORY_FAILURE':
      return Object.assign({}, state, {
        loading: false,
        error: action.payload,
      })

    case 'UPDATE_INVENTORY_REQUEST':
      return Object.assign({}, state, {
        updating: true,
      })

    case 'UPDATE_INVENTORY_SUCCESS':
      return Object.assign({}, state, {
        updating: false,
        items: state.items.map(function(item) {
          if (item.id === action.payload.id) {
            return Object.assign({}, item, action.payload.data)
          }
          return item
        }),
      })

    case 'BULK_UPDATE_INVENTORY_SUCCESS':
      return Object.assign({}, state, {
        updating: false,
      })

    case 'RESTOCK_ITEM_SUCCESS':
      return Object.assign({}, state, {
        items: state.items.map(function(item) {
          if (item.id === action.payload.id) {
            var newQty = item.quantity + action.payload.quantity
            return Object.assign({}, item, {
              quantity: newQty,
              status: newQty > item.reorderLevel ? 'in_stock' : 'low_stock',
              lastRestocked: new Date().toISOString(),
            })
          }
          return item
        }),
      })

    default:
      return state
  }
}
