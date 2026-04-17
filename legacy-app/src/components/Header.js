import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../redux/actions/authActions';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false,
    }
  }

  componentDidMount() {
    // close dropdown when clicking outside
    // TODO: this is hacky, should use refs instead
    var self = this;
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.user-menu')) {
        self.setState({ dropdownOpen: false });
      }
    });
  }

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  handleLogout = () => {
    console.log('logging out user...');
    this.props.logout();
  }

  render() {
    const { toggleSidebar, user } = this.props
    const { dropdownOpen } = this.state

    return (
      <header className="app-header">
        <div className="header-left">
          <button className="hamburger-btn" onClick={toggleSidebar}>
            &#9776;
          </button>
          <h1 className="logo-text">EcomDash</h1>
        </div>
        <div className="header-right">
          <div className="user-menu">
            <button className="user-btn" onClick={this.toggleDropdown}>
              <span className="user-avatar" style={{backgroundColor: '#4a90d9', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold'}}>
                {user ? user.name.charAt(0).toUpperCase() : 'A'}
              </span>
              <span className="user-name">{user ? user.name : 'Admin'}</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item">Profile</a>
                <a href="#" className="dropdown-item">Settings</a>
                <hr />
                <a href="#" className="dropdown-item" onClick={this.handleLogout}>Logout</a>
              </div>
            )}
          </div>
        </div>
      </header>
    )
  }
}

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object,
}

const mapStateToProps = state => ({
  user: state.auth.user,
})

export default connect(mapStateToProps, { logout })(Header);
