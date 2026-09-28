import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, AlertTriangle, ArrowLeft, Loader2, Save, Check, X, Edit2, ShieldCheck, XCircle, Download, Languages } from 'lucide-react';

interface BilingualField {
  original: string | null;
  english: string | null;
}

interface ExtractedData {
  is_valid_document?: boolean;
  owner_name: string | BilingualField | null;
  survey_number: string | BilingualField | null;
  area: string | BilingualField | null;
  village: string | BilingualField | null;
  tehsil: string | BilingualField | null;
  district: string | BilingualField | null;
  state: string | BilingualField | null;
}

interface DocumentData {
  id: string;
  file_name: string;
  status: string;
  extracted_data: ExtractedData | null;
  uploaded_at: string;
  validation_flags?: string[];
  validation_status?: string;
}

export default function ExtractedRecordPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ExtractedData | null>(null);
  const [showEnglish, setShowEnglish] = useState(false);

  const fetchDoc = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/documents/${id}`);
      if (!response.ok) throw new Error('Failed to fetch document');
      const data = await response.json();
      setDoc(data);
      setEditData(data.extracted_data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDoc();
  }, [id]);

  const handleApprove = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/verification/${id}/approve`, { method: 'POST' });
      fetchDoc();
    } catch (err) { console.error(err); }
  };

  const handleReject = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/verification/${id}/reject`, { method: 'POST' });
      fetchDoc();
    } catch (err) { console.error(err); }
  };

  const handleSaveEdit = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/verification/${id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extracted_data: editData })
      });
      setIsEditing(false);
      fetchDoc();
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ts-bg">
        <Loader2 className="w-8 h-8 text-ts-peach animate-spin" />
      </div>
    );
  }

  if (!doc || !doc.extracted_data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ts-bg p-4">
        <AlertTriangle className="w-12 h-12 text-[#8a2b2b] mb-4" />
        <h2 className="text-xl font-bold mb-2">Record not found</h2>
        <Button onClick={() => navigate('/upload')}>Back to Upload</Button>
      </div>
    );
  }

  const data = doc.extracted_data;

  // Simple confidence heuristic based on missing fields
  const missingFields = Object.values(data).filter(v => v === null).length;
  const confidenceScore = missingFields === 0 ? 'High' : missingFields <= 2 ? 'Medium' : 'Low';
  const confidenceColor = confidenceScore === 'High' ? 'text-ts-mint bg-ts-mint/10' : confidenceScore === 'Medium' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-ts-sage/30 transition-colors">
            <ArrowLeft className="w-5 h-5 text-ts-text-primary" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-ts-text-primary">Extracted Details</h1>
            <p className="text-ts-text-muted mt-1">Review the AI-extracted data from {doc.file_name}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Download PDF
        </Button>
      </div>

      {data.is_valid_document === false ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-12 text-center flex flex-col items-center max-w-2xl mx-auto mt-12">
          <AlertTriangle className="w-20 h-20 text-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-red-700 mb-4">Invalid Document Detected!</h2>
          <p className="text-lg text-red-600/80 mb-8 max-w-md">
            The uploaded image does not appear to be a valid Indian land record (7/12, Khasra, etc.). The AI has blocked extraction to prevent invalid data.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            <Button onClick={() => navigate('/upload')} className="bg-red-600 hover:bg-red-700 text-white">Upload New Document</Button>
          </div>
        </div>
      ) : (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-ts-border bg-white print:shadow-none print:border-none">
            <CardHeader className="border-b border-ts-border bg-ts-ivory/50">
              <div className="flex justify-between items-center">
                <CardTitle>Structured Data</CardTitle>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowEnglish(!showEnglish)}
                    className="flex items-center gap-2 print:hidden"
                  >
                    <Languages className="w-4 h-4 text-ts-peach" />
                    {showEnglish ? 'Show Original' : 'Translate to English'}
                  </Button>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${confidenceColor}`}>
                    {confidenceScore === 'High' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {confidenceScore} Confidence
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(data).map((key) => {
                  const label = key.replace('_', ' ');
                  
                  // Helper to safely get the correct display value
                  const getDisplayValue = (val: any) => {
                    if (!val) return null;
                    if (typeof val === 'string') return val;
                    return showEnglish ? (val.english || val.original) : val.original;
                  };
                  
                  const valToDisplay = getDisplayValue((data as any)[key]);

                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-medium text-ts-text-muted uppercase tracking-wider">{label}</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={typeof (editData as any)[key] === 'object' ? getDisplayValue((editData as any)[key]) : ((editData as any)[key] || '')} 
                          onChange={(e) => {
                            // If it's a new edit, save it as a simple string for simplicity (overriding bilingual)
                            setEditData({ ...editData!, [key]: e.target.value })
                          }}
                          className="w-full p-2 rounded-md border border-ts-border focus:ring-2 focus:ring-ts-peach focus:outline-none print:hidden"
                        />
                      ) : (
                        <div className={`p-3 rounded-md border ${valToDisplay ? 'bg-ts-bg border-ts-border text-ts-text-primary font-medium' : 'bg-red-50 border-red-100 text-red-400 italic'}`}>
                          {valToDisplay || 'Not detected'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {doc.validation_status === 'approved' ? (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-700 font-bold">
                    <ShieldCheck className="w-5 h-5" />
                    RECORD OFFICIALLY VERIFIED
                  </div>
                  <Button variant="outline" onClick={() => navigate('/documents')} className="print:hidden">Back to Repository</Button>
                </div>
              ) : doc.validation_status === 'rejected' ? (
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-700 font-bold">
                    <XCircle className="w-5 h-5" />
                    RECORD REJECTED
                  </div>
                  <Button variant="outline" onClick={() => navigate('/documents')} className="print:hidden">Back to Repository</Button>
                </div>
              ) : (
                <div className="mt-8 flex justify-end gap-3 print:hidden">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}><X className="w-4 h-4 mr-2" /> Cancel</Button>
                      <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white"><Save className="w-4 h-4 mr-2" /> Save Changes & Approve</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4 mr-2" /> Edit Data</Button>
                      <Button variant="destructive" onClick={handleReject}><X className="w-4 h-4 mr-2" /> Reject</Button>
                      <Button onClick={handleApprove} className="bg-ts-mint hover:bg-[#43a088] text-white"><Check className="w-4 h-4 mr-2" /> Approve Record</Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 print:hidden">
          <Card className="shadow-sm border-ts-border bg-ts-ivory">
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-ts-border pb-2">
                <span className="text-ts-text-muted">Document ID</span>
                <span className="font-mono text-ts-text-primary truncate ml-4" title={doc.id}>{doc.id.substring(0, 8)}...</span>
              </div>
              <div className="flex justify-between border-b border-ts-border pb-2">
                <span className="text-ts-text-muted">Upload Date</span>
                <span className="text-ts-text-primary">{new Date(doc.uploaded_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ts-text-muted">Status</span>
                <span className="text-ts-mint font-medium capitalize">{doc.status}</span>
              </div>
            </CardContent>
          </Card>
          
          
          {doc.validation_flags && doc.validation_flags.length > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Validation Flags</h3>
              </div>
              <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                {doc.validation_flags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
              <p className="text-xs text-red-600 mt-2 font-medium">This record requires manual review in Stage 6.</p>
            </div>
          ) : doc.validation_status === 'approved' ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 font-medium">
                Validation Passed. All critical fields and logic checks are satisfied.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                This data was automatically extracted by Gemini AI.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Original Image Section (Visible in UI and Print) */}
      <div className="mt-8 page-break-before-always">
        <Card className="shadow-sm border-ts-border bg-white print:shadow-none print:border-none">
          <CardHeader className="border-b border-ts-border bg-ts-ivory/50">
            <CardTitle>Original Document Reference</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex justify-center">
            <img 
              src={`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/documents/${id}/image`} 
              alt="Original Land Record" 
              className="max-w-full h-auto max-h-[800px] object-contain border border-ts-border rounded-lg shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </CardContent>
        </Card>
      </div>
      </>
      )}
    </div>
  );
}
