import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, AlertTriangle, CheckCircle2, Clock, Loader2, ArrowRight } from 'lucide-react';

interface DashboardStats {
  total: number;
  processing: number;
  needs_verification: number;
  verified: number;
}

interface Activity {
  id: string;
  file_name: string;
  uploaded_at: string;
  status: string;
  validation_status?: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:8000/dashboard/stats');
        const data = await response.json();
        setStats(data.stats);
        setActivity(data.recent_activity || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-ts-peach" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Documents', value: stats.total, icon: FileText, trend: 'All digitized records' },
    { title: 'Awaiting OCR', value: stats.processing, icon: Clock, trend: 'Processing queue' },
    { title: 'Needs Verification', value: stats.needs_verification, icon: AlertTriangle, trend: 'Flagged for review' },
    { title: 'Verified Records', value: stats.verified, icon: CheckCircle2, trend: 'Successfully processed' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ts-text-primary">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-ts-text-muted">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${index === 2 && stat.value > 0 ? 'text-red-500' : 'text-ts-peach'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ts-text-primary">{stat.value}</div>
                <p className="text-xs text-ts-text-muted mt-1">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <div className="text-center py-10 text-ts-text-muted">No recent activity.</div>
            ) : (
              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-ts-bg/50 transition-colors border border-transparent hover:border-ts-border">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${item.status === 'completed' ? 'bg-ts-mint/20 text-ts-mint' : 'bg-yellow-100 text-yellow-600'}`}>
                        {item.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ts-text-primary truncate max-w-[200px] md:max-w-xs">{item.file_name}</p>
                        <p className="text-xs text-ts-text-muted">{new Date(item.uploaded_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/record/${item.id}`)}>
                      View <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button onClick={() => navigate('/upload')} className="w-full flex items-center justify-between p-4 rounded-xl border border-ts-border bg-ts-ivory hover:bg-ts-sage transition-all shadow-sm">
              <span className="text-sm font-medium">Upload New Document</span>
              <span className="text-ts-peach">→</span>
            </button>
            <button onClick={() => navigate('/documents')} className="w-full flex items-center justify-between p-4 rounded-xl border border-ts-border bg-ts-ivory hover:bg-ts-sage transition-all shadow-sm">
              <span className="text-sm font-medium">Repository ({stats.total})</span>
              <span className="text-ts-peach">→</span>
            </button>
            <button onClick={() => navigate('/documents')} className="w-full flex items-center justify-between p-4 rounded-xl border border-ts-border bg-red-50 hover:bg-red-100 transition-all shadow-sm group">
              <span className="text-sm font-medium text-red-700">Review Flags ({stats.needs_verification})</span>
              <span className="text-red-500 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
