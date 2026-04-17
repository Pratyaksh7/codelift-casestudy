import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';
import { fetchInventory, updateInventoryItem, restockItem, bulkUpdateInventory } from '../redux/actions/inventoryActions';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';
import Breadcrumb from '../components/Breadcrumb';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/dateUtils';
import './Inventory.css';

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      statusFilter: 'all',
      warehouseFilter: 'all',
      selectedItems: [],
      selectAll: false,
      showRestockModal: false,
      restockItemId: null,
      restockQuantity: '',
      showBulkConfirm: false,
      bulkAction: null,
      sortBy: 'productName',
      sortDir: 'asc',
    };
  }

  componentDidMount() {
    console.log('[Inventory] Loading inventory data');
    this.props.fetchInventory();
  }

  handleSearch = (value) => {
    this.setState({ searchTerm: value });
  }

  handleStatusFilter = (e) => {
    this.setState({ statusFilter: e.target.value });
  }

  handleWarehouseFilter = (e) => {
    this.setState({ warehouseFilter: e.target.value });
  }

  handleSort = (column) => {
    this.setState(function(prev) {
      if (prev.sortBy === column) {
        return { sortDir: prev.sortDir === 'asc' ? 'desc' : 'asc' };
      }
      return { sortBy: column, sortDir: 'asc' };
    });
  }

  handleSelectAll = () => {
    var self = this;
    this.setState(function(prev) {
      if (prev.selectAll) {
        return { selectAll: false, selectedItems: [] };
      }
      var filtered = self.getFilteredInventory();
      return { selectAll: true, selectedItems: filtered.map(function(i) { return i.id; }) };
    });
  }

  handleSelectItem = (itemId) => {
    this.setState(function(prev) {
      var selected = prev.selectedItems.slice();
      var idx = selected.indexOf(itemId);
      if (idx !== -1) {
        selected.splice(idx, 1);
      } else {
        selected.push(itemId);
      }
      return { selectedItems: selected, selectAll: false };
    });
  }

  openRestockModal = (itemId) => {
    this.setState({ showRestockModal: true, restockItemId: itemId, restockQuantity: '' });
  }

  closeRestockModal = () => {
    this.setState({ showRestockModal: false, restockItemId: null, restockQuantity: '' });
  }

  handleRestock = () => {
    var qty = parseInt(this.state.restockQuantity);
    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    console.log('[Inventory] Restocking item', this.state.restockItemId, 'with', qty, 'units');
    this.props.restockItem(this.state.restockItemId, qty);
    this.closeRestockModal();
  }

  handleBulkAction = (action) => {
    if (this.state.selectedItems.length === 0) {
      alert('Please select at least one item');
      return;
    }
    this.setState({ showBulkConfirm: true, bulkAction: action });
  }

  handleBulkConfirm = () => {
    var { selectedItems, bulkAction } = this.state;
    var items = this.props.inventory.filter(function(i) {
      return selectedItems.indexOf(i.id) !== -1;
    });

    console.log('[Inventory] Bulk action:', bulkAction, 'on', items.length, 'items');

    if (bulkAction === 'markLowStock') {
      var updated = items.map(function(i) { return Object.assign({}, i, { status: 'low_stock' }); });
      this.props.bulkUpdateInventory(updated);
    } else if (bulkAction === 'markInStock') {
      var updated2 = items.map(function(i) { return Object.assign({}, i, { status: 'in_stock' }); });
      this.props.bulkUpdateInventory(updated2);
    }

    this.setState({ showBulkConfirm: false, bulkAction: null, selectedItems: [], selectAll: false });
  }

  getFilteredInventory() {
    var { searchTerm, statusFilter, warehouseFilter, sortBy, sortDir } = this.state;
    var items = this.props.inventory;

    if (searchTerm) {
      var term = searchTerm.toLowerCase();
      items = items.filter(function(i) {
        return i.productName.toLowerCase().indexOf(term) !== -1 ||
               i.sku.toLowerCase().indexOf(term) !== -1;
      });
    }

    if (statusFilter !== 'all') {
      items = items.filter(function(i) { return i.status === statusFilter; });
    }

    if (warehouseFilter !== 'all') {
      items = items.filter(function(i) { return i.warehouse === warehouseFilter; });
    }

    // sort
    items = items.slice().sort(function(a, b) {
      var valA = a[sortBy];
      var valB = b[sortBy];
      if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = (valB || '').toLowerCase(); }
      if (sortDir === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    return items;
  }

  getLowStockCount() {
    return this.props.inventory.filter(function(i) {
      return i.status === 'low_stock' || i.status === 'out_of_stock';
    }).length;
  }

  render() {
    var { loading } = this.props;
    var { selectedItems, selectAll, showRestockModal, restockQuantity, showBulkConfirm, statusFilter, warehouseFilter, sortBy, sortDir } = this.state;
    var filteredInventory = this.getFilteredInventory();
    var lowStockCount = this.getLowStockCount();

    var breadcrumbItems = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Inventory' },
    ];

    return (
      <div className="inventory-page">
        <Breadcrumb items={breadcrumbItems} />

        <div className="page-header">
          <h2>Inventory Management</h2>
          <p className="page-subtitle">Track and manage your product stock levels</p>
        </div>

        {lowStockCount > 0 && (
          <div className="inventory-alert">
            <span style={{ marginRight: 8 }}>&#9888;</span>
            <strong>{lowStockCount} product{lowStockCount > 1 ? 's' : ''}</strong> {lowStockCount > 1 ? 'have' : 'has'} low or zero stock levels.
          </div>
        )}

        <div className="inventory-toolbar">
          <div className="inventory-toolbar-left">
            <SearchBar placeholder="Search by name or SKU..." onChange={this.handleSearch} instant={true} />
            <select className="filter-select" value={statusFilter} onChange={this.handleStatusFilter}>
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <select className="filter-select" value={warehouseFilter} onChange={this.handleWarehouseFilter}>
              <option value="all">All Warehouses</option>
              <option value="Main">Main</option>
              <option value="Secondary">Secondary</option>
            </select>
          </div>
          <div className="inventory-toolbar-right">
            {selectedItems.length > 0 && (
              <div className="bulk-actions">
                <span style={{ fontSize: 13, color: '#555', marginRight: 8 }}>{selectedItems.length} selected</span>
                <button className="btn btn-sm btn-primary" onClick={function() { this.handleBulkAction('markInStock'); }.bind(this)}>Mark In Stock</button>
                <button className="btn btn-sm" style={{ background: '#f39c12', color: 'white', marginLeft: 4 }} onClick={function() { this.handleBulkAction('markLowStock'); }.bind(this)}>Mark Low Stock</button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading inventory..." />
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" checked={selectAll} onChange={this.handleSelectAll} />
                </th>
                <th style={{ cursor: 'pointer' }} onClick={function() { this.handleSort('productName'); }.bind(this)}>
                  Product {sortBy === 'productName' ? (sortDir === 'asc' ? '\u25B2' : '\u25BC') : ''}
                </th>
                <th>SKU</th>
                <th style={{ cursor: 'pointer' }} onClick={function() { this.handleSort('quantity'); }.bind(this)}>
                  Qty {sortBy === 'quantity' ? (sortDir === 'asc' ? '\u25B2' : '\u25BC') : ''}
                </th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Warehouse</th>
                <th>Last Restocked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', color: '#aaa', padding: 40 }}>No inventory items found.</td>
                </tr>
              ) : (
                filteredInventory.map(function(item) {
                  var isSelected = selectedItems.indexOf(item.id) !== -1;
                  return (
                    <tr key={item.id} style={{ backgroundColor: isSelected ? '#ebf5fb' : 'transparent' }}>
                      <td><input type="checkbox" checked={isSelected} onChange={function() { this.handleSelectItem(item.id); }.bind(this)} /></td>
                      <td style={{ fontWeight: 500 }}>{item.productName}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 13, color: '#666' }}>{item.sku}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: item.quantity <= item.reorderLevel ? '#e74c3c' : '#333' }}>
                          {item.quantity}
                        </span>
                      </td>
                      <td style={{ color: '#888' }}>{item.reorderLevel}</td>
                      <td><StatusBadge status={item.status} /></td>
                      <td>{item.warehouse}</td>
                      <td style={{ fontSize: 13, color: '#888' }}>{formatDate(item.lastRestocked)}</td>
                      <td>
                        <button className="btn btn-sm btn-success" onClick={function() { this.openRestockModal(item.id); }.bind(this)}>
                          Restock
                        </button>
                      </td>
                    </tr>
                  );
                }.bind(this))
              )}
            </tbody>
          </table>
        )}

        {/* Restock Modal */}
        <Modal
          isOpen={showRestockModal}
          onClose={this.closeRestockModal}
          title="Restock Item"
          onConfirm={this.handleRestock}
          confirmText="Restock"
        >
          <div className="form-group">
            <label>Quantity to Add</label>
            <input
              type="number"
              className="form-input"
              min="1"
              value={restockQuantity}
              onChange={function(e) { this.setState({ restockQuantity: e.target.value }); }.bind(this)}
              placeholder="Enter quantity"
            />
          </div>
        </Modal>

        {/* Bulk Action Confirm */}
        <ConfirmDialog
          isOpen={showBulkConfirm}
          onConfirm={this.handleBulkConfirm}
          onCancel={function() { this.setState({ showBulkConfirm: false }); }.bind(this)}
          title="Bulk Action"
          message={'Are you sure you want to update ' + selectedItems.length + ' items?'}
          type="warning"
        />
      </div>
    );
  }
}

Inventory.propTypes = {
  inventory: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  fetchInventory: PropTypes.func.isRequired,
  updateInventoryItem: PropTypes.func.isRequired,
  restockItem: PropTypes.func.isRequired,
  bulkUpdateInventory: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  inventory: state.inventory.items,
  loading: state.inventory.loading,
});

export default connect(mapStateToProps, { fetchInventory, updateInventoryItem, restockItem, bulkUpdateInventory })(Inventory);
