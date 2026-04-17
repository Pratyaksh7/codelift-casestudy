import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import './FileUpload.css';

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

export type FileUploadProps = {
  label?: string;
  accept?: string;
  maxSize?: number;
  allowedTypes?: string[];
  showUploadButton?: boolean;
  onChange?: (file: File) => void;
  onRemove?: () => void;
  onUpload?: (file: File) => void;
};

export function FileUpload({
  label,
  accept,
  maxSize = DEFAULT_MAX_SIZE,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  showUploadButton = false,
  onChange,
  onRemove,
  onUpload,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (incoming: File) => {
    if (incoming.size > maxSize) {
      setError('File is too large. Maximum size is ' + maxSize / 1024 / 1024 + 'MB');
      return;
    }
    if (allowedTypes.indexOf(incoming.type) === -1) {
      setError('File type not allowed. Accepted: ' + allowedTypes.join(', '));
      return;
    }

    let nextPreview: string | null = null;
    if (incoming.type.startsWith('image/')) {
      nextPreview = URL.createObjectURL(incoming);
    }

    if (preview) URL.revokeObjectURL(preview);
    setFile(incoming);
    setPreview(nextPreview);
    setError(null);

    // TODO: wire to API
    if (onChange) onChange(incoming);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onRemove) onRemove();
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);

    // TODO: wire to API — simulated progress
    let progress = 0;
    const interval = window.setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 5;
      if (progress >= 100) {
        progress = 100;
        window.clearInterval(interval);
        setUploadProgress(100);
        setUploading(false);
        if (onUpload) onUpload(file);
      } else {
        setUploadProgress(progress);
      }
    }, 300);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="file-upload-container">
      {label ? <label className="file-upload-label">{label}</label> : null}

      {error ? <div className="file-upload-error">{error}</div> : null}

      {!file ? (
        <div
          className={'file-upload-dropzone' + (isDragging ? ' dragging' : '')}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
        >
          <div className="dropzone-icon">&#128193;</div>
          <p className="dropzone-text">
            Drag &amp; drop a file here, or <span className="dropzone-browse">browse</span>
          </p>
          <p className="dropzone-hint">Max file size: {maxSize / 1024 / 1024}MB</p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="file-upload-input"
            accept={accept}
          />
        </div>
      ) : (
        <div className="file-upload-preview">
          {preview ? <img src={preview} alt="Preview" className="file-preview-image" /> : null}
          <div className="file-info">
            <p className="file-name">{file.name}</p>
            <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <div className="file-actions">
            {showUploadButton && !uploading && uploadProgress < 100 ? (
              <button type="button" className="btn btn-sm btn-primary" onClick={handleUpload}>
                Upload
              </button>
            ) : null}
            <button type="button" className="btn btn-sm btn-danger" onClick={handleRemove}>
              Remove
            </button>
          </div>
          {uploading ? (
            <div className="upload-progress-bar">
              <div className="upload-progress-fill" style={{ width: uploadProgress + '%' }} />
              <span className="upload-progress-text">{uploadProgress}%</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
