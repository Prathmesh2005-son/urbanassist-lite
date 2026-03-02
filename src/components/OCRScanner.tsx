import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Upload, FileText, Loader2, RefreshCw } from 'lucide-react';

export default function OCRScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setLoading(true);
    setProgress(0);
    
    try {
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      const { data: { text } } = await worker.recognize(image);
      setText(text);
      await worker.terminate();
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Scanner</h1>
          <p className="text-slate-500 text-sm">Extract text from emergency documents using local OCR.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="glass-card p-8 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            {image ? (
              <img src={image} alt="Uploaded" className="max-h-full rounded-lg object-contain" />
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Upload size={32} />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">PNG, JPG, or PDF (Image only)</p>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <button
            onClick={processImage}
            disabled={!image || loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing ({progress}%)
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                Extract Text
              </>
            )}
          </button>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Extracted Text</h2>
            <button
              onClick={() => navigator.clipboard.writeText(text)}
              disabled={!text}
              className="text-xs font-bold text-blue-600 hover:underline disabled:text-slate-400"
            >
              Copy All
            </button>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl p-4 font-mono text-sm text-slate-700 whitespace-pre-wrap min-h-[200px] max-h-[400px] overflow-y-auto border border-slate-100">
            {text || (loading ? 'Analyzing document...' : 'Extracted text will appear here.')}
          </div>
        </div>
      </div>
    </div>
  );
}
