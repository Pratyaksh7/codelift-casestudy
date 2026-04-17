import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Pagination extends Component {

  getPageNumbers() {
    var { currentPage, totalPages } = this.props
    var pages = []

    // show max 7 page buttons
    var maxVisible = 7
    var startPage, endPage

    if (totalPages <= maxVisible) {
      startPage = 1
      endPage = totalPages
    } else {
      var halfVisible = Math.floor(maxVisible / 2)
      if (currentPage <= halfVisible + 1) {
        startPage = 1
        endPage = maxVisible
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisible + 1
        endPage = totalPages
      } else {
        startPage = currentPage - halfVisible
        endPage = currentPage + halfVisible
      }
    }

    for (var i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  render() {
    var { currentPage, totalPages, onPageChange } = this.props

    if (totalPages <= 1) return null

    var pages = this.getPageNumbers()

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={function() { onPageChange(1) }}
          disabled={currentPage === 1}
          style={{
            padding: '6px 10px',
            border: '1px solid #ddd',
            borderRadius: 4,
            background: 'white',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            color: currentPage === 1 ? '#ccc' : '#555',
            fontSize: 12,
          }}
        >
          &laquo;
        </button>
        <button
          onClick={function() { onPageChange(currentPage - 1) }}
          disabled={currentPage === 1}
          style={{
            padding: '6px 10px',
            border: '1px solid #ddd',
            borderRadius: 4,
            background: 'white',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            color: currentPage === 1 ? '#ccc' : '#555',
            fontSize: 12,
          }}
        >
          &lsaquo;
        </button>

        {pages.map(function(page) {
          var isActive = page === currentPage
          return (
            <button
              key={page}
              onClick={function() { onPageChange(page) }}
              style={{
                padding: '6px 12px',
                border: '1px solid ' + (isActive ? '#4a90d9' : '#ddd'),
                borderRadius: 4,
                background: isActive ? '#4a90d9' : 'white',
                color: isActive ? 'white' : '#555',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {page}
            </button>
          )
        })}

        <button
          onClick={function() { onPageChange(currentPage + 1) }}
          disabled={currentPage === totalPages}
          style={{
            padding: '6px 10px',
            border: '1px solid #ddd',
            borderRadius: 4,
            background: 'white',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            color: currentPage === totalPages ? '#ccc' : '#555',
            fontSize: 12,
          }}
        >
          &rsaquo;
        </button>
        <button
          onClick={function() { onPageChange(totalPages) }}
          disabled={currentPage === totalPages}
          style={{
            padding: '6px 10px',
            border: '1px solid #ddd',
            borderRadius: 4,
            background: 'white',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            color: currentPage === totalPages ? '#ccc' : '#555',
            fontSize: 12,
          }}
        >
          &raquo;
        </button>
      </div>
    )
  }
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default Pagination
