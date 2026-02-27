import { type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
  children: ReactNode;
  detailPanel?: ReactNode;
}

export default function AppLayout({ children, detailPanel }: Props) {
  return (
    <div className="app-layout">
      <Header />
      <div className="main-area">
        <Sidebar />
        <div className="viz-canvas">{children}</div>
        {detailPanel}
      </div>
    </div>
  );
}
