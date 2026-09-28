import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertTriangle, CheckCircle2, FileText, Loader2, RefreshCw } from 'lucide-react';

interface Document {
  id: string;
  file_name: string;
  uploaded_at: string;
  status: string;
  validation_status?: string;
}

export default function DocumentRepositoryPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/repository`);
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ts-text-primary">Document Repository</h1>
          <p className="text-ts-text-muted mt-1">Supervisor Dashboard: Review and validate digitized land records.</p>
        </div>
        <Button variant="outline" onClick={fetchDocuments} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <Card className="shadow-lg border-ts-border bg-white overflow-hidden">
        <CardHeader className="bg-ts-ivory border-b border-ts-border p-4">
          <CardTitle className="text-lg">All Uploaded Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-ts-peach" />
            </div>
          ) : documents.length === 0 ? (
            <div className="py-20 text-center text-ts-text-muted">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No documents found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-ts-text-muted uppercase bg-ts-bg border-b border-ts-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Document ID</th>
                    <th className="px-6 py-4 font-medium">File Name</th>
                    <th className="px-6 py-4 font-medium">Upload Date</th>
                    <th className="px-6 py-4 font-medium">Processing Status</th>
                    <th className="px-6 py-4 font-medium">AI Validation</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ts-border">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-ts-bg/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-ts-text-muted">
                        {doc.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 font-medium text-ts-text-primary truncate max-w-xs">
                        {doc.file_name}
                      </td>
                      <td className="px-6 py-4 text-ts-text-muted">
                        {new Date(doc.uploaded_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          doc.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                          doc.status === 'processing' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {doc.validation_status === 'approved' ? (
                          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-full w-fit">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">Passed</span>
                          </div>
                        ) : doc.validation_status === 'flagged' ? (
                          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-full w-fit">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">Flagged</span>
                          </div>
                        ) : (
                          <span className="text-ts-text-muted text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => navigate(`/record/${doc.id}`)}
                          disabled={doc.status !== 'completed'}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
