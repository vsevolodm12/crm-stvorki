import { useState, useRef } from 'react';
import { Paperclip, Send, X } from 'lucide-react';
import { Button } from './Button';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string, attachments?: File[]) => void;
  placeholder?: string;
  className?: string;
}

export const MessageInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Напишите сообщение...',
  className = '',
}: MessageInputProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() || attachments.length > 0) {
      onSubmit(value, attachments);
      onChange('');
      setAttachments([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`border-t border-gray-200 bg-white ${className}`}>
      {attachments.length > 0 && (
        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm"
            >
              <span className="text-gray-700 truncate max-w-[200px]">
                {file.name}
              </span>
              <button
                onClick={() => handleRemoveAttachment(index)}
                className="p-0.5 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 flex items-center justify-center"
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={1}
          className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400 min-h-[44px] max-h-[120px]"
          style={{ lineHeight: '1.5' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button 
          type="submit" 
          size="sm" 
          disabled={!value.trim() && attachments.length === 0}
          className="h-[44px] px-4 flex items-center justify-center flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

