import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AIDrawer } from './components/AIDrawer';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Cases } from './pages/Cases';
import { CaseView } from './pages/CaseView';
import { Saved } from './pages/Saved';
import { Help } from './pages/Help';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:caseCode" element={<CaseView />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/help" element={<Help />} />
          </Routes>
          <AIDrawer />
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
