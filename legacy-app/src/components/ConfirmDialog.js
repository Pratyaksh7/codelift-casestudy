import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import './ConfirmDialog.css';

// Confirmation dialog component
// Uses jQuery for animation, like the modal
class ConfirmDialog extends Component {
  constructor(props) {
    super(props);
    this.dialogRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.isOpen) {
      this.animateIn();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.animateIn();
    }
  }

  animateIn() {
    var $dialog = $(this.dialogRef.current);
    $dialog.find('.confirm-dialog-box').css({
      opacity: 0,
      transform: 'scale(0.8)',
    });

    setTimeout(function() {
      $dialog.find('.confirm-dialog-box').animate({ opacity: 1 }, 200);
      $dialog.find('.confirm-dialog-box').css('transform', 'scale(1)');
    }, 50);
  }

  handleConfirm = () => {
    console.log('[ConfirmDialog] User confirmed');
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }

  handleCancel = () => {
    console.log('[ConfirmDialog] User cancelled');
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  render() {
    var { isOpen, title, message, confirmText, cancelText, type } = this.props;

    if (!isOpen) return null;

    var confirmBtnClass = 'btn ';
    if (type === 'danger') {
      confirmBtnClass += 'btn-danger';
    } else {
      confirmBtnClass += 'btn-primary';
    }

    var iconMap = {
      danger: '\u26A0',
      warning: '\u26A0',
      info: '\u2139',
    };
    var icon = iconMap[type] || '\u2753';

    return (
      <div className="confirm-dialog-overlay" ref={this.dialogRef}>
        <div className="confirm-dialog-box">
          <div className="confirm-dialog-icon" style={{
            backgroundColor: type === 'danger' ? '#fde8e8' : '#ebf5fb',
            color: type === 'danger' ? '#e74c3c' : '#4a90d9',
          }}>
            {icon}
          </div>
          <h3 className="confirm-dialog-title">{title || 'Confirm Action'}</h3>
          <p className="confirm-dialog-message">{message || 'Are you sure you want to proceed?'}</p>
          <div className="confirm-dialog-actions">
            <button
              className="btn"
              style={{ background: '#eee', color: '#555' }}
              onClick={this.handleCancel}
            >
              {cancelText || 'Cancel'}
            </button>
            <button
              className={confirmBtnClass}
              onClick={this.handleConfirm}
            >
              {confirmText || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['danger', 'warning', 'info']),
};

export default ConfirmDialog;
