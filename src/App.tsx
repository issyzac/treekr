import { OKRProvider, useOKR } from './context/OKRContext';
import AppLayout from './components/Layout/AppLayout';
import NetworkGraph from './components/Visualizations/NetworkGraph';
import HierarchyTree from './components/Visualizations/HierarchyTree';
import ContributionMatrix from './components/Visualizations/ContributionMatrix';
import SankeyFlow from './components/Visualizations/SankeyFlow';
import DetailPanel from './components/Details/DetailPanel';
import DataInputModal from './components/DataInput/DataInputModal';
import OKREditorModal from './components/DataInput/OKREditorModal';

function AppInner() {
  const { state } = useOKR();

  const renderVisualization = () => {
    switch (state.viewMode) {
      case 'network':
        return <NetworkGraph />;
      case 'hierarchy':
        return <HierarchyTree />;
      case 'matrix':
        return <ContributionMatrix />;
      case 'sankey':
        return <SankeyFlow />;
      default:
        return <NetworkGraph />;
    }
  };

  return (
    <>
      <AppLayout detailPanel={state.filters.selectedNodeId ? <DetailPanel /> : undefined}>
        {renderVisualization()}
      </AppLayout>
      <DataInputModal />
      <OKREditorModal />
    </>
  );
}

function App() {
  return (
    <OKRProvider>
      <AppInner />
    </OKRProvider>
  );
}

export default App;
