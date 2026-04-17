import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Breadcrumb.css'

// Breadcrumb navigation component
class Breadcrumb extends Component {

  render() {
    var { items, separator } = this.props
    var sep = separator || '/'

    if (!items || items.length === 0) return null

    return (
      <nav className="breadcrumb-nav">
        <ol className="breadcrumb-list">
          {items.map(function(item, index) {
            var isLast = index === items.length - 1

            return (
              <li key={index} className="breadcrumb-item">
                {!isLast && item.path ? (
                  <Link to={item.path} className="breadcrumb-link">
                    {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                    {item.label}
                  </Link>
                ) : (
                  <span className={'breadcrumb-text' + (isLast ? ' breadcrumb-current' : '')}>
                    {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                    {item.label}
                  </span>
                )}
                {!isLast && <span className="breadcrumb-separator">{sep}</span>}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    path: PropTypes.string,
    icon: PropTypes.string,
  })).isRequired,
  separator: PropTypes.string,
}

export default withRouter(Breadcrumb)
