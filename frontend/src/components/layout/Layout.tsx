import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function Layout() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-ts-bg print:bg-white print:h-auto print:block">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full overflow-hidden print:overflow-visible print:block">
        <div className="print:hidden">
          <Topbar />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 print:p-0 print:overflow-visible print:block">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
