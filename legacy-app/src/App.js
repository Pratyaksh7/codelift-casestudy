import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Inventory from './pages/Inventory';
import Coupons from './pages/Coupons';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true,
    };
  }

  toggleSidebar = () => {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen
    }));
  }

  render() {
    const { isAuthenticated } = this.props;
    const { sidebarOpen } = this.state;

    if (!isAuthenticated) {
      return (
        <Switch>
          <Route path="/login" component={Login} />
          <Redirect to="/login" />
        </Switch>
      );
    }

    return (
      <div className="app-container">
        <Header toggleSidebar={this.toggleSidebar} />
        <div className="main-wrapper">
          <Sidebar isOpen={sidebarOpen} />
          <div className={sidebarOpen ? "content-area" : "content-area content-area-full"}>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/products" component={Products} />
              <Route path="/orders" component={Orders} />
              <Route exact path="/users" component={Users} />
              <Route path="/users/:id" component={UserDetail} />
              <Route path="/reports" component={Reports} />
              <Route path="/settings" component={Settings} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/inventory" component={Inventory} />
              <Route path="/coupons" component={Coupons} />
              <Redirect to="/" />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);
