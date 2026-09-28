import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function OcrProcessingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    let intervalId: number;

    const checkStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8000/documents/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch document status');
        }
        
        const docData = await response.json();
        
        if (docData.status === 'completed') {
          clearInterval(intervalId);
          navigate(`/record/${id}`);
        } else if (docData.status === 'failed') {
          clearInterval(intervalId);
          setStatus('failed');
          setError(docData.error_message || 'AI Extraction failed due to an unknown error.');
        } else {
          setStatus(docData.status);
        }
      } catch (err: any) {
        console.error("Polling error:", err);
        // Do not clear interval on network errors, it might just be a temporary glitch
      }
    };

    if (id) {
      checkStatus();
      intervalId = window.setInterval(checkStatus, 3000); // Poll every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ts-bg px-6">
      <Card className="w-full max-w-md shadow-lg border-ts-border bg-ts-ivory text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Processing Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'failed' ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#fcdede] flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-[#8a2b2b]" />
              </div>
              <p className="text-ts-text-primary font-medium">Digitization Failed</p>
              <p className="text-sm text-[#8a2b2b]">{error}</p>
              <Button className="mt-4 w-full" onClick={() => navigate('/upload')}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-ts-bg border-t-ts-mint animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-ts-peach animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-ts-text-primary">
                  {status === 'uploaded' ? 'Initializing AI Engine...' : 'Analyzing & Extracting Data...'}
                </p>
                <p className="text-sm text-ts-text-muted mt-2">
                  This usually takes around 10-15 seconds. Please don't close this page.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
