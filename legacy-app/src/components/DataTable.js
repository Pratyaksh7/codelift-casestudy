import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pagination from './Pagination';
import './DataTable.css';

// Generic data table component with sorting, pagination, and row selection
// This is intentionally complex - a class component doing too much
class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortColumn: props.defaultSortColumn || null,
      sortDirection: props.defaultSortDirection || 'asc',
      currentPage: 1,
      pageSize: props.pageSize || 10,
      selectedRows: [],
      selectAll: false,
    };
  }

  componentDidUpdate(prevProps) {
    // reset page when data changes
    if (prevProps.data.length !== this.props.data.length) {
      this.setState({ currentPage: 1, selectedRows: [], selectAll: false });
    }
  }

  handleSort = (column) => {
    var self = this;
    this.setState(function(prevState) {
      if (prevState.sortColumn === column) {
        return { sortDirection: prevState.sortDirection === 'asc' ? 'desc' : 'asc' };
      }
      return { sortColumn: column, sortDirection: 'asc' };
    }, function() {
      if (self.props.onSort) {
        self.props.onSort(self.state.sortColumn, self.state.sortDirection);
      }
    });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
    if (this.props.onPageChange) {
      this.props.onPageChange(page);
    }
  }

  handlePageSizeChange = (e) => {
    this.setState({
      pageSize: parseInt(e.target.value),
      currentPage: 1,
    });
  }

  handleSelectAll = () => {
    var self = this;
    this.setState(function(prevState) {
      if (prevState.selectAll) {
        return { selectAll: false, selectedRows: [] };
      }
      var pageData = self.getPageData();
      var ids = pageData.map(function(row) { return row[self.props.rowKey || 'id']; });
      return { selectAll: true, selectedRows: ids };
    }, function() {
      if (self.props.onSelectionChange) {
        self.props.onSelectionChange(self.state.selectedRows);
      }
    });
  }

  handleSelectRow = (rowId) => {
    var self = this;
    this.setState(function(prevState) {
      var selected = prevState.selectedRows.slice();
      var idx = selected.indexOf(rowId);
      if (idx !== -1) {
        selected.splice(idx, 1);
      } else {
        selected.push(rowId);
      }
      return {
        selectedRows: selected,
        selectAll: false,
      };
    }, function() {
      if (self.props.onSelectionChange) {
        self.props.onSelectionChange(self.state.selectedRows);
      }
    });
  }

  getSortedData() {
    var { data } = this.props;
    var { sortColumn, sortDirection } = this.state;

    if (!sortColumn) return data;

    var sorted = data.slice().sort(function(a, b) {
      var valA = a[sortColumn];
      var valB = b[sortColumn];

      // handle null/undefined
      if (valA == null) valA = '';
      if (valB == null) valB = '';

      // try numeric comparison
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      // string comparison
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (sortDirection === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });

    return sorted;
  }

  getPageData() {
    var sorted = this.getSortedData();
    var { currentPage, pageSize } = this.state;

    var start = (currentPage - 1) * pageSize;
    var end = start + pageSize;

    return sorted.slice(start, end);
  }

  render() {
    var { columns, data, rowKey, selectable, loading, emptyMessage, showPageSize } = this.props;
    var { sortColumn, sortDirection, currentPage, pageSize, selectedRows, selectAll } = this.state;

    var pageData = this.getPageData();
    var totalPages = Math.ceil(data.length / pageSize);

    return (
      <div className="data-table-container">
        {showPageSize !== false && (
          <div className="data-table-toolbar">
            <div className="data-table-info">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length} entries
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#666', marginRight: 6 }}>Show:</label>
              <select className="page-size-select" value={pageSize} onChange={this.handlePageSizeChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        )}

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {selectable && (
                  <th style={{ width: 40 }}>
                    <input type="checkbox" checked={selectAll} onChange={this.handleSelectAll} />
                  </th>
                )}
                {columns.map(function(col) {
                  var sortable = col.sortable !== false;
                  var isSorted = sortColumn === col.key;

                  return (
                    <th
                      key={col.key}
                      onClick={sortable ? function() { this.handleSort(col.key); }.bind(this) : undefined}
                      style={{
                        cursor: sortable ? 'pointer' : 'default',
                        width: col.width || 'auto',
                      }}
                      className={isSorted ? 'sorted-column' : ''}
                    >
                      {col.label}
                      {sortable && isSorted && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? ' \u25B2' : ' \u25BC'}
                        </span>
                      )}
                    </th>
                  );
                }.bind(this))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} style={{ textAlign: 'center', padding: 40, color: '#888' }}>
                    Loading data...
                  </td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
                    {emptyMessage || 'No data available.'}
                  </td>
                </tr>
              ) : (
                pageData.map(function(row) {
                  var rowId = row[rowKey || 'id'];
                  var isSelected = selectedRows.indexOf(rowId) !== -1;

                  return (
                    <tr key={rowId} className={isSelected ? 'selected-row' : ''}>
                      {selectable && (
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={function() { this.handleSelectRow(rowId); }.bind(this)}
                          />
                        </td>
                      )}
                      {columns.map(function(col) {
                        var cellValue = row[col.key];

                        // custom renderer
                        if (col.render) {
                          return <td key={col.key}>{col.render(cellValue, row)}</td>;
                        }

                        return <td key={col.key}>{cellValue}</td>;
                      })}
                    </tr>
                  );
                }.bind(this))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="data-table-footer">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={this.handlePageChange}
            />
          </div>
        )}
      </div>
    );
  }
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    render: PropTypes.func,
  })).isRequired,
  data: PropTypes.array.isRequired,
  rowKey: PropTypes.string,
  selectable: PropTypes.bool,
  loading: PropTypes.bool,
  pageSize: PropTypes.number,
  defaultSortColumn: PropTypes.string,
  defaultSortDirection: PropTypes.string,
  onSort: PropTypes.func,
  onPageChange: PropTypes.func,
  onSelectionChange: PropTypes.func,
  emptyMessage: PropTypes.string,
  showPageSize: PropTypes.bool,
};

export default DataTable;
