import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import './Modal.css';

// Reusable modal component with jQuery animations
// TODO: should use React portals instead of just rendering in place
class Modal extends Component {
  constructor(props) {
    super(props);
    this.modalRef = React.createRef();
    this.overlayRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.isOpen) {
      this.animateIn();
    }
    // close on escape key
    var self = this;
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && self.props.isOpen) {
        self.handleClose();
      }
    });
    // NOTE: memory leak - never removes this event listener
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.animateIn();
    }
  }

  animateIn() {
    // use jquery for animations
    var $overlay = $(this.overlayRef.current);
    var $modal = $(this.modalRef.current);

    $overlay.css('opacity', 0).animate({ opacity: 1 }, 200);
    $modal.css({
      opacity: 0,
      transform: 'scale(0.9) translateY(-20px)',
    }).animate({ opacity: 1 }, 300);

    // manually set transform since jquery animate doesn't handle it well
    setTimeout(function() {
      $modal.css('transform', 'scale(1) translateY(0)');
    }, 50);
  }

  handleClose = () => {
    var self = this;
    var $overlay = $(this.overlayRef.current);
    var $modal = $(this.modalRef.current);

    $modal.animate({ opacity: 0 }, 150);
    $overlay.animate({ opacity: 0 }, 200, function() {
      if (self.props.onClose) {
        self.props.onClose();
      }
    });
  }

  handleOverlayClick = (e) => {
    if (e.target === this.overlayRef.current) {
      this.handleClose();
    }
  }

  render() {
    var { isOpen, title, children, size, showFooter, onConfirm, confirmText, cancelText } = this.props;

    if (!isOpen) return null;

    var modalSizeClass = 'modal-dialog';
    if (size === 'large') modalSizeClass += ' modal-dialog-lg';
    if (size === 'small') modalSizeClass += ' modal-dialog-sm';

    return (
      <div className="modal-overlay-reusable" ref={this.overlayRef} onClick={this.handleOverlayClick}>
        <div className={modalSizeClass} ref={this.modalRef}>
          <div className="modal-dialog-header">
            <h3 className="modal-dialog-title">{title || 'Modal'}</h3>
            <button className="modal-dialog-close" onClick={this.handleClose}>&times;</button>
          </div>
          <div className="modal-dialog-body">
            {children}
          </div>
          {showFooter !== false && (
            <div className="modal-dialog-footer">
              <button
                className="btn"
                style={{ background: '#eee', color: '#555' }}
                onClick={this.handleClose}
              >
                {cancelText || 'Cancel'}
              </button>
              {onConfirm && (
                <button className="btn btn-primary" onClick={onConfirm}>
                  {confirmText || 'Confirm'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showFooter: PropTypes.bool,
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default Modal;
