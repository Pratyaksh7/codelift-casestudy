import axios from 'axios'

// mock product data
var mockProducts = [
  { id: 1, name: 'Wireless Bluetooth Headphones', price: 79.99, category: 'Electronics', stock: 45, description: 'Premium wireless headphones with noise cancellation' },
  { id: 2, name: 'Cotton T-Shirt Pack (3)', price: 29.99, category: 'Clothing', stock: 120, description: 'Comfortable cotton t-shirts, pack of 3' },
  { id: 3, name: 'Stainless Steel Water Bottle', price: 24.99, category: 'Home & Garden', stock: 78, description: '32oz insulated water bottle' },
  { id: 4, name: 'Running Shoes Pro', price: 129.99, category: 'Sports', stock: 8, description: 'Lightweight running shoes with arch support' },
  { id: 5, name: 'JavaScript: The Good Parts', price: 34.99, category: 'Books', stock: 55, description: 'Classic programming book by Douglas Crockford' },
  { id: 6, name: 'USB-C Charging Cable (2m)', price: 12.99, category: 'Electronics', stock: 200, description: 'Braided USB-C cable, fast charging compatible' },
  { id: 7, name: 'Yoga Mat Premium', price: 45.00, category: 'Sports', stock: 33, description: 'Non-slip exercise mat, 6mm thick' },
  { id: 8, name: 'LED Desk Lamp', price: 39.99, category: 'Home & Garden', stock: 5, description: 'Adjustable LED lamp with 3 brightness levels' },
  { id: 9, name: 'Denim Jacket Classic', price: 89.99, category: 'Clothing', stock: 22, description: 'Classic fit denim jacket, medium wash' },
  { id: 10, name: 'Mechanical Keyboard RGB', price: 149.99, category: 'Electronics', stock: 3, description: 'Mechanical gaming keyboard with Cherry MX switches' },
]

export function fetchProducts() {
  return function(dispatch) {
    dispatch({ type: 'FETCH_PRODUCTS_REQUEST' })

    axios.get('http://localhost:3001/api/products')
      .then(function(response) {
        dispatch({
          type: 'FETCH_PRODUCTS_SUCCESS',
          payload: response.data,
        })
      })
      .catch(function(error) {
        console.log('using mock product data')
        // fallback to mock data
        dispatch({
          type: 'FETCH_PRODUCTS_SUCCESS',
          payload: mockProducts,
        })
      })
  }
}

export function deleteProduct(productId) {
  return function(dispatch) {
    // try to delete from api first
    axios.delete('http://localhost:3001/api/products/' + productId)
      .then(function(response) {
        console.log('deleted product', productId)
        dispatch({
          type: 'DELETE_PRODUCT',
          payload: productId,
        })
      })
      .catch(function(error) {
        // just remove from local state
        console.log('api delete failed, removing locally')
        dispatch({
          type: 'DELETE_PRODUCT',
          payload: productId,
        })
      })
  }
}
