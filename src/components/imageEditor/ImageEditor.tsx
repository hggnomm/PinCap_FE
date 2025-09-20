import React, { useState } from 'react';
import { PinturaEditor } from '@pqina/react-pintura';
import { getEditorDefaults } from '@pqina/pintura';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import clsx from 'clsx';

import '@pqina/pintura/pintura.css';

interface ImageEditorProps {
  isVisible: boolean;
  imageSrc: string;
  onClose: () => void;
  onImageEdited: (editedImageBlob: Blob) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  isVisible,
  imageSrc,
  onClose,
  onImageEdited,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = (result: any) => {
    setIsProcessing(true);
    
    // Convert the result to blob and pass it back to parent
    if (result.dest) {
      onImageEdited(result.dest);
      onClose();
    }
    
    setIsProcessing(false);
  };

  if (!isVisible) return null;

  return (
    <div className={clsx(
      'fixed inset-0 z-50 flex items-center justify-center',
      'bg-black/80 bg-opacity-50 '
    )}>
      {/* Editor Container */}
      <div className={clsx(
        'relative w-full h-full max-w-screen-xl max-h-screen',
        'bg-white rounded-lg shadow-2xl',
        'm-4'
      )}>
        {/* Header with Close Button */}
        <div className={clsx(
          'absolute top-0 left-0 right-0 z-10',
          'flex justify-between items-center',
          'p-4 bg-white border-b border-gray-200 rounded-t-lg'
        )}>
          <h3 className="text-lg font-semibold text-gray-800">
            Edit Image
          </h3>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            className={clsx(
              'flex items-center justify-center',
              'w-8 h-8 rounded-full',
              'hover:bg-gray-100 transition-colors'
            )}
          />
        </div>

        {/* Editor Content */}
        <div className={clsx(
          'w-full h-full pt-16',
          'rounded-b-lg overflow-hidden'
        )}>
          <PinturaEditor
            {...getEditorDefaults()}
            src={imageSrc}
            onProcess={handleProcess}
            
          />
        </div>

        {/* Loading Overlay */}
        {isProcessing && (
          <div className={clsx(
            'absolute inset-0 z-20',
            'flex items-center justify-center',
            'bg-white bg-opacity-80 rounded-lg'
          )}>
            <div className="text-center">
              <div className={clsx(
                'w-8 h-8 border-4 border-rose-600 border-t-transparent',
                'rounded-full animate-spin mx-auto mb-2'
              )}></div>
              <p className="text-gray-600">Processing image...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
