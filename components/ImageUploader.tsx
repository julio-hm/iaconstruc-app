
import React, { useState, useCallback, useContext } from 'react';
import { AppContext } from '../context/AppContext';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect }) => {
  const { t } = useContext(AppContext);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onFileSelect(null);
      setPreview(null);
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const removeImage = () => {
      handleFileChange(null);
  }

  const dropzoneClasses = `
    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
    ${isDragging ? 'border-pink-400 bg-pink-900/20' : 'border-white/20 hover:border-pink-400/50 hover:bg-white/10'}
  `;

  return (
    <div>
        {!preview ? (
             <div
                className={dropzoneClasses}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
            >
                <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={onFileInputChange}
                />
                <p className="text-gray-300">{t('image_analysis_upload_cta')}</p>
            </div>
        ) : (
            <div className="relative">
                <img src={preview} alt="Image preview" className="w-full h-auto max-h-64 object-contain rounded-lg"/>
                <button 
                    onClick={removeImage} 
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
                    aria-label="Remove image"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        )}
    </div>
  );
};

export default ImageUploader;