import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import $ from 'jquery'
import { fetchProducts, deleteProduct } from '../redux/actions/productActions'
import './Products.css'

class Products extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      editingProduct: null,
      formData: {
        name: '',
        price: '',
        category: '',
        stock: '',
        description: '',
      },
      searchTerm: '',
    }
  }

  componentDidMount() {
    this.props.fetchProducts()
  }

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value })
  }

  openAddModal = () => {
    this.setState({
      showModal: true,
      editingProduct: null,
      formData: { name: '', price: '', category: '', stock: '', description: '' },
    })
  }

  openEditModal = (product) => {
    console.log('editing product', product.id)
    this.setState({
      showModal: true,
      editingProduct: product,
      formData: {
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        description: product.description || '',
      },
    })
  }

  closeModal = () => {
    this.setState({ showModal: false, editingProduct: null })
  }

  handleFormChange = (e) => {
    var formData = Object.assign({}, this.state.formData);
    formData[e.target.name] = e.target.value;
    this.setState({ formData: formData });
  }

  handleSubmit = (e) => {
    e.preventDefault()
    var self = this
    var { formData, editingProduct } = this.state

    var payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      description: formData.description,
    }

    if (editingProduct) {
      // update existing product
      // TODO: move to redux action
      axios.put('http://localhost:3001/api/products/' + editingProduct.id, payload)
        .then(function(res) {
          console.log('product updated', res.data)
          self.closeModal()
          self.props.fetchProducts()
        })
        .catch(function(err) {
          console.log('update failed, refreshing anyway')
          self.closeModal()
          self.props.fetchProducts()
        })
    } else {
      // create new product
      axios.post('http://localhost:3001/api/products', payload)
        .then(function(res) {
          console.log('product created', res.data)
          self.closeModal()
          self.props.fetchProducts()
        })
        .catch(function(err) {
          console.log('create failed, refreshing anyway')
          self.closeModal()
          self.props.fetchProducts()
        })
    }
  }

  handleDelete = (productId) => {
    // TODO: replace with a proper confirm dialog component
    if (window.confirm('Are you sure you want to delete this product?')) {
      this.props.deleteProduct(productId)
    }
  }

  // use jquery to highlight the search matches - yes its bad
  highlightSearch() {
    var term = this.state.searchTerm
    if (term.length > 0) {
      // remove previous highlights
      $('.product-name-cell').each(function() {
        var text = $(this).text()
        $(this).html(text) // reset
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchTerm !== this.state.searchTerm) {
      this.highlightSearch()
    }
  }

  render() {
    const { products, loading } = this.props
    const { showModal, editingProduct, formData, searchTerm } = this.state

    var filteredProducts = products.filter(function(p) {
      return p.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
             p.category.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    })

    return (
      <div className="products-page">
        <div className="page-header">
          <h2>Products</h2>
          <p className="page-subtitle">Manage your product inventory</p>
        </div>

        <div className="products-toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={this.handleSearch}
          />
          <button className="btn btn-primary" onClick={this.openAddModal}>
            + Add Product
          </button>
        </div>

        {loading ? (
          <p style={{color: '#888', padding: 20}}>Loading products...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', color: '#aaa', padding: 40}}>
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(function(product) {
                  return (
                    <tr key={product.id}>
                      <td className="product-name-cell" style={{fontWeight: 500}}>{product.name}</td>
                      <td>
                        <span style={{
                          backgroundColor: '#f0f0f0',
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontSize: 13
                        }}>
                          {product.category}
                        </span>
                      </td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <span style={{color: product.stock < 10 ? '#e74c3c' : '#333', fontWeight: product.stock < 10 ? 600 : 400}}>
                          {product.stock}
                        </span>
                        {product.stock < 10 && <span style={{color: '#e74c3c', fontSize: 11, marginLeft: 6}}>Low</span>}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          style={{marginRight: 6}}
                          onClick={() => this.openEditModal(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => this.handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                }.bind(this))
              )}
            </tbody>
          </table>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={this.closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button className="modal-close" onClick={this.closeModal}>&times;</button>
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={this.handleFormChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      className="form-input"
                      step="0.01"
                      value={formData.price}
                      onChange={this.handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      className="form-input"
                      value={formData.stock}
                      onChange={this.handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" className="form-input" value={formData.category} onChange={this.handleFormChange} required>
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Sports">Sports</option>
                    <option value="Books">Books</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="form-input"
                    rows="3"
                    value={formData.description}
                    onChange={this.handleFormChange}
                  ></textarea>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20}}>
                  <button type="button" className="btn" style={{background: '#eee', color: '#555'}} onClick={this.closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }
}

Products.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  fetchProducts: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  products: state.products.items,
  loading: state.products.loading,
})

export default connect(mapStateToProps, { fetchProducts, deleteProduct })(Products)
