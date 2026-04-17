import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Sidebar.css'

class Sidebar extends Component {

  render() {
    const { isOpen } = this.props

    if (!isOpen) return null

    return (
      <nav className="sidebar">
        <ul className="sidebar-nav">
          <li>
            <NavLink exact to="/dashboard" className="nav-link" activeClassName="active">
              <span style={{marginRight: 10}}>&#128200;</span>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className="nav-link" activeClassName="active">
              <span style={{marginRight: 10}}>&#128230;</span>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" className="nav-link" activeClassName="active">
              <span style={{marginRight: 10}}>&#128195;</span>
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/users" className="nav-link" activeClassName="active">
              <span style={{marginRight: 10}}>&#128101;</span>
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventory" className="nav-link" activeClassName="active">
              <span style={{marginRight: 10}}>&#128230;</span>
              Inventory
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics" className="nav-link" activeClassName="active">
              <span style={{marginRight: 10}}>&#128202;</span>
              Analytics
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className="nav-link" activeClassName="active">
              <span style={{marginRight: 10}}>&#128196;</span>
              Reports
            </NavLink>
          </li>
          <li>
            <NavLink to="/coupons" className="nav-link" activeClassName="active">
              <span style={{marginRight: 10}}>&#127915;</span>
              Coupons
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className="nav-link" activeClassName="active">
              <span style={{marginRight: 10}}>&#9881;</span>
              Settings
            </NavLink>
          </li>
        </ul>
        <div className="sidebar-footer">
          <p style={{fontSize: 11, color: '#999', textAlign: 'center'}}>v1.2.0</p>
        </div>
      </nav>
    )
  }
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
}

export default Sidebar
