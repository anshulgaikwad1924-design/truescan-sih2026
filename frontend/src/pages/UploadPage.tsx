import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../lib/firebase';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { Upload, FileText, AlertCircle, X, Image as ImageIcon, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { appUser } = useAuth();
  const navigate = useNavigate();

  const startCamera = async () => {
    setShowCamera(true);
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error(err);
      setCameraError('Unable to access camera. Please check browser permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `scanned_record_${Date.now()}.jpg`, { type: 'image/jpeg' });
          validateAndSetFile(file);
          stopCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setStatus('error');
      setErrorMessage('Please upload a PDF or image file (JPG, PNG).');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setStatus('error');
      setErrorMessage('File size must be less than 10MB.');
      return;
    }

    setFile(selectedFile);
    setStatus('idle');
    setErrorMessage('');
  };

  const clearFile = () => {
    setFile(null);
    setStatus('idle');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file || !appUser) return;

    setStatus('uploading');
    
    try {
      // 1. Upload directly to FastAPI backend using FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploaded_by', appUser.uid);

      // We simulate upload progress for better UX since standard fetch doesn't support upload progress easily
      // A more robust solution would use XMLHttpRequest, but this is sufficient for small files.
      setUploadProgress(30);
      
      const uploadResponse = await fetch('http://localhost:8000/documents/upload', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress(100);
      
      if (!uploadResponse.ok) {
        const errData = await uploadResponse.json();
        throw new Error(errData.detail || 'Failed to upload file to local server');
      }
      
      const docData = await uploadResponse.json();
      const docId = docData.id;

      // 2. Trigger Extraction Pipeline (Stage 5)
      setStatus('processing');
      const extractResponse = await fetch(`http://localhost:8000/extraction/${docId}`, {
        method: 'POST',
      });
      
      if (!extractResponse.ok) throw new Error('Failed to trigger extraction');
      
      // 3. Navigate to processing page
      navigate(`/processing/${docId}`);
      
    } catch (error: any) {
      console.error("Backend error:", error);
      setStatus('error');
      setErrorMessage(error.message || 'Server error occurred.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ts-text-primary">Digitize Record</h1>
        <p className="text-ts-text-muted mt-2">Upload a scanned land record (7/12, Khasra, etc.) for AI extraction.</p>
      </div>

      <Card className="shadow-lg border-ts-border bg-ts-ivory">
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>Supported formats: PDF, JPG, PNG (Max 10MB)</CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                isDragging
                  ? 'border-ts-mint bg-ts-mint/5 scale-[1.02]'
                  : 'border-ts-border hover:border-ts-mint/50 hover:bg-ts-bg/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 rounded-full bg-ts-mint/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-ts-mint" />
              </div>
              <h3 className="text-lg font-medium text-ts-text-primary mb-2">
                Drag and drop your document here
              </h3>
              <p className="text-ts-text-muted mb-6">or select an option below</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
              />
              <div className="flex justify-center gap-4">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  Browse Files
                </Button>
                <Button onClick={startCamera} className="bg-ts-peach hover:bg-orange-500 text-white flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Scan with Camera
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-ts-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-ts-sage/30 flex items-center justify-center">
                    {file.type.includes('pdf') ? (
                      <FileText className="w-6 h-6 text-ts-mint" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-ts-peach" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-ts-text-primary line-clamp-1" title={file.name}>
                      {file.name}
                    </h4>
                    <p className="text-sm text-ts-text-muted">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                    </p>
                  </div>
                </div>
                {status === 'idle' && (
                  <button
                    onClick={clearFile}
                    className="p-2 rounded-full hover:bg-ts-bg text-ts-text-muted hover:text-ts-text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {status === 'error' && (
                <div className="mb-6 p-4 rounded-lg bg-[#fcdede] flex items-start gap-3 border border-[#e8c3c3]">
                  <AlertCircle className="w-5 h-5 text-[#8a2b2b] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-[#8a2b2b]">Upload Failed</h5>
                    <p className="text-sm text-[#8a2b2b]/80">{errorMessage}</p>
                  </div>
                </div>
              )}

              {status !== 'idle' && status !== 'error' && (
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-ts-text-primary">
                      {status === 'uploading' ? 'Uploading...' : 'Processing...'}
                    </span>
                    <span className="text-ts-text-muted">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="h-2 w-full bg-ts-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ts-mint transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                {status === 'idle' || status === 'error' ? (
                  <>
                    <Button variant="outline" onClick={clearFile}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpload} className="shadow-md">
                      Start Digitization
                    </Button>
                  </>
                ) : (
                  <Button disabled className="w-full">
                    {status === 'uploading' ? 'Uploading to secure storage...' : 'Initializing AI Engine...'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-4 md:p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-ts-text-primary flex items-center gap-2">
                <Camera className="w-5 h-5 text-ts-mint" /> Document Scanner
              </h3>
              <button onClick={stopCamera} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-ts-text-muted" />
              </button>
            </div>
            
            {cameraError ? (
              <div className="w-full p-6 bg-red-50 text-red-600 rounded-lg text-center mb-4 border border-red-200">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">{cameraError}</p>
              </div>
            ) : (
              <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden mb-6 border-2 border-ts-border">
                {/* Guidelines for scanning */}
                <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                    <span className="bg-black/50 text-white px-3 py-1 rounded text-sm font-medium backdrop-blur-sm">Align document here</span>
                  </div>
                </div>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
            
            <div className="flex gap-4 w-full">
              <Button variant="outline" className="flex-1" onClick={stopCamera}>Cancel</Button>
              <Button 
                onClick={captureImage} 
                disabled={!!cameraError}
                className="flex-1 bg-ts-mint hover:bg-[#43a088] text-white flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" /> Capture Record
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
