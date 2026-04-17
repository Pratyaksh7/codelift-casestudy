import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Status badge component for displaying status labels with colors
class StatusBadge extends Component {

  getColor() {
    var { status, colorMap } = this.props

    // use custom color map if provided
    if (colorMap && colorMap[status]) {
      return colorMap[status]
    }

    // default color mapping
    switch(status) {
      case 'active': return '#27ae60';
      case 'inactive': return '#95a5a6';
      case 'pending': return '#f39c12';
      case 'completed': return '#27ae60';
      case 'processing': return '#f39c12';
      case 'shipped': return '#3498db';
      case 'cancelled': return '#e74c3c';
      case 'expired': return '#e74c3c';
      case 'scheduled': return '#9b59b6';
      case 'in_stock': return '#27ae60';
      case 'low_stock': return '#f39c12';
      case 'out_of_stock': return '#e74c3c';
      case 'discontinued': return '#95a5a6';
      case 'admin': return '#e74c3c';
      case 'manager': return '#3498db';
      case 'editor': return '#f39c12';
      case 'viewer': return '#95a5a6';
      default: return '#95a5a6';
    }
  }

  formatLabel() {
    var { status, label } = this.props
    if (label) return label

    // convert snake_case to Title Case
    if (!status) return ''
    return status.replace(/_/g, ' ').replace(/\b\w/g, function(l) {
      return l.toUpperCase()
    })
  }

  render() {
    var { size, variant } = this.props
    var color = this.getColor()
    var labelText = this.formatLabel()

    var baseStyle = {
      display: 'inline-block',
      padding: size === 'small' ? '2px 8px' : '4px 12px',
      borderRadius: 12,
      fontSize: size === 'small' ? 11 : 12,
      fontWeight: 500,
      textTransform: 'capitalize',
      lineHeight: 1.5,
    }

    if (variant === 'outline') {
      baseStyle.border = '1px solid ' + color
      baseStyle.color = color
      baseStyle.backgroundColor = 'transparent'
    } else {
      baseStyle.backgroundColor = color
      baseStyle.color = 'white'
    }

    return (
      <span style={baseStyle}>
        {labelText}
      </span>
    )
  }
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  label: PropTypes.string,
  size: PropTypes.oneOf(['small', 'normal']),
  variant: PropTypes.oneOf(['filled', 'outline']),
  colorMap: PropTypes.object,
}

export default StatusBadge
