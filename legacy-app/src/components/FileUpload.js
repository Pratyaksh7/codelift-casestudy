import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../utils/constants';
import './FileUpload.css';

// File upload component with drag & drop using jQuery
class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      file: null,
      preview: null,
      error: null,
      uploadProgress: 0,
      uploading: false,
    };
    this.dropZoneRef = React.createRef();
    this.fileInputRef = React.createRef();
  }

  componentDidMount() {
    // use jquery to set up drag and drop event handlers
    var self = this;
    var $dropZone = $(this.dropZoneRef.current);

    $dropZone.on('dragenter', function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.setState({ isDragging: true });
    });

    $dropZone.on('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
    });

    $dropZone.on('dragleave', function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.setState({ isDragging: false });
    });

    $dropZone.on('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.setState({ isDragging: false });

      var files = e.originalEvent.dataTransfer.files;
      if (files.length > 0) {
        self.handleFile(files[0]);
      }
    });
  }

  componentWillUnmount() {
    // cleanup jquery event handlers
    var $dropZone = $(this.dropZoneRef.current);
    $dropZone.off('dragenter dragover dragleave drop');

    // revoke object URL to prevent memory leak
    if (this.state.preview) {
      URL.revokeObjectURL(this.state.preview);
    }
  }

  handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      this.handleFile(e.target.files[0]);
    }
  }

  handleFile(file) {
    var maxSize = this.props.maxSize || MAX_FILE_SIZE;
    var allowedTypes = this.props.allowedTypes || ALLOWED_FILE_TYPES;

    // validate file size
    if (file.size > maxSize) {
      this.setState({ error: 'File is too large. Maximum size is ' + (maxSize / 1024 / 1024) + 'MB' });
      return;
    }

    // validate file type
    if (allowedTypes.indexOf(file.type) === -1) {
      this.setState({ error: 'File type not allowed. Accepted: ' + allowedTypes.join(', ') });
      return;
    }

    console.log('[FileUpload] File selected:', file.name, file.size, file.type);

    // create preview for images
    var preview = null;
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }

    this.setState({
      file: file,
      preview: preview,
      error: null,
    });

    if (this.props.onChange) {
      this.props.onChange(file);
    }
  }

  handleRemove = () => {
    if (this.state.preview) {
      URL.revokeObjectURL(this.state.preview);
    }
    this.setState({
      file: null,
      preview: null,
      error: null,
      uploadProgress: 0,
    });
    // reset file input
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
    }
    if (this.props.onRemove) {
      this.props.onRemove();
    }
  }

  handleUpload = () => {
    var self = this;
    var { file } = this.state;

    if (!file) return;

    this.setState({ uploading: true, uploadProgress: 0 });

    // simulate upload progress
    // TODO: actually upload the file
    var progress = 0;
    var interval = setInterval(function() {
      progress += Math.floor(Math.random() * 20) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        self.setState({ uploadProgress: 100, uploading: false });

        if (self.props.onUpload) {
          self.props.onUpload(file);
        }
      } else {
        self.setState({ uploadProgress: progress });
      }
    }, 300);
  }

  render() {
    var { isDragging, file, preview, error, uploadProgress, uploading } = this.state;
    var { label, showUploadButton } = this.props;

    return (
      <div className="file-upload-container">
        {label && <label className="file-upload-label">{label}</label>}

        {error && (
          <div className="file-upload-error">{error}</div>
        )}

        {!file ? (
          <div
            ref={this.dropZoneRef}
            className={'file-upload-dropzone' + (isDragging ? ' dragging' : '')}
            onClick={function() { this.fileInputRef.current.click(); }.bind(this)}
          >
            <div className="dropzone-icon">&#128193;</div>
            <p className="dropzone-text">
              Drag & drop a file here, or <span style={{color: '#4a90d9', textDecoration: 'underline'}}>browse</span>
            </p>
            <p className="dropzone-hint">
              Max file size: {(this.props.maxSize || MAX_FILE_SIZE) / 1024 / 1024}MB
            </p>
            <input
              ref={this.fileInputRef}
              type="file"
              onChange={this.handleFileSelect}
              style={{ display: 'none' }}
              accept={this.props.accept}
            />
          </div>
        ) : (
          <div className="file-upload-preview">
            {preview && (
              <img src={preview} alt="Preview" className="file-preview-image" />
            )}
            <div className="file-info">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <div className="file-actions">
              {showUploadButton && !uploading && uploadProgress < 100 && (
                <button className="btn btn-sm btn-primary" onClick={this.handleUpload}>Upload</button>
              )}
              <button className="btn btn-sm btn-danger" onClick={this.handleRemove}>Remove</button>
            </div>
            {uploading && (
              <div className="upload-progress-bar">
                <div className="upload-progress-fill" style={{ width: uploadProgress + '%' }}></div>
                <span className="upload-progress-text">{uploadProgress}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

FileUpload.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  onUpload: PropTypes.func,
  maxSize: PropTypes.number,
  allowedTypes: PropTypes.array,
  accept: PropTypes.string,
  showUploadButton: PropTypes.bool,
}

export default FileUpload;
