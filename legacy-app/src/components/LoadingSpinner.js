import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LoadingSpinner.css';

class LoadingSpinner extends Component {
  render() {
    var { size, message, fullPage, color } = this.props;

    var spinnerSize = size || 40;
    var spinnerColor = color || '#4a90d9';

    if (fullPage) {
      return (
        <div className="spinner-fullpage">
          <div
            className="spinner-circle"
            style={{
              width: spinnerSize,
              height: spinnerSize,
              borderTopColor: spinnerColor,
            }}
          ></div>
          {message && <p className="spinner-message">{message}</p>}
        </div>
      );
    }

    return (
      <div className="spinner-inline">
        <div
          className="spinner-circle"
          style={{
            width: spinnerSize,
            height: spinnerSize,
            borderTopColor: spinnerColor,
          }}
        ></div>
        {message && <p className="spinner-message">{message}</p>}
      </div>
    );
  }
}

LoadingSpinner.propTypes = {
  size: PropTypes.number,
  message: PropTypes.string,
  fullPage: PropTypes.bool,
  color: PropTypes.string,
};

export default LoadingSpinner;
