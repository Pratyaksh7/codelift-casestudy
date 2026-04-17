import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { debounce } from '../utils/helpers'

class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue || '',
    }

    // create debounced version of onChange
    this.debouncedOnChange = debounce(function(val) {
      if (props.onChange) {
        props.onChange(val)
      }
    }, props.debounceMs || 300)
  }

  handleChange = (e) => {
    var val = e.target.value
    this.setState({ value: val })

    if (this.props.instant) {
      // call immediately without debounce
      if (this.props.onChange) {
        this.props.onChange(val)
      }
    } else {
      this.debouncedOnChange(val)
    }
  }

  handleClear = () => {
    this.setState({ value: '' })
    if (this.props.onChange) {
      this.props.onChange('')
    }
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter' && this.props.onSubmit) {
      this.props.onSubmit(this.state.value)
    }
    if (e.key === 'Escape') {
      this.handleClear()
    }
  }

  render() {
    var { placeholder, width, disabled } = this.props
    var { value } = this.state

    return (
      <div style={{ position: 'relative', width: width || 280 }}>
        <input
          type="text"
          placeholder={placeholder || 'Search...'}
          value={value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '10px 36px 10px 14px',
            border: '1px solid #ddd',
            borderRadius: 4,
            fontSize: 14,
            outline: 'none',
          }}
        />
        {value && (
          <button
            onClick={this.handleClear}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#888',
              fontSize: 16,
              padding: 4,
            }}
          >
            &times;
          </button>
        )}
      </div>
    )
  }
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  debounceMs: PropTypes.number,
  instant: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
}

export default SearchBar
