import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import './Toast.css';

// Toast notification component using jQuery for animations
// TODO: this should be managed globally, not per-instance
class Toast extends Component {
  constructor(props) {
    super(props);
    this.toastRef = React.createRef();
    this.autoHideTimer = null;
  }

  componentDidMount() {
    this.showToast();
    this.startAutoHide();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message) {
      this.showToast();
      this.startAutoHide();
    }
  }

  // NOTE: intentional memory leak - autoHideTimer not cleared in some cases
  componentWillUnmount() {
    // TODO: should clear timer here but sometimes we forget
    // clearTimeout(this.autoHideTimer);
  }

  showToast() {
    var $toast = $(this.toastRef.current);
    $toast.hide().fadeIn(300);
  }

  startAutoHide() {
    var self = this;
    var duration = this.props.duration || 3000;

    if (this.props.autoHide !== false) {
      this.autoHideTimer = setTimeout(function() {
        self.hideToast();
      }, duration);
    }
  }

  hideToast = () => {
    var self = this;
    var $toast = $(this.toastRef.current);

    $toast.fadeOut(300, function() {
      if (self.props.onClose) {
        self.props.onClose();
      }
    });
  }

  getIcon() {
    switch(this.props.type) {
      case 'success': return '\u2713';
      case 'error': return '\u2717';
      case 'warning': return '\u26A0';
      case 'info': return '\u2139';
      default: return '\u2139';
    }
  }

  render() {
    var { message, type, position } = this.props;

    if (!message) return null;

    var positionClass = 'toast-notification toast-' + (type || 'info');
    if (position === 'top-left') positionClass += ' toast-top-left';
    else if (position === 'bottom-right') positionClass += ' toast-bottom-right';
    else if (position === 'bottom-left') positionClass += ' toast-bottom-left';
    else positionClass += ' toast-top-right'; // default

    return (
      <div className={positionClass} ref={this.toastRef}>
        <span className="toast-icon">{this.getIcon()}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={this.hideToast}>&times;</button>
      </div>
    );
  }
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left']),
  duration: PropTypes.number,
  autoHide: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Toast;
