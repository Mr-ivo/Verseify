import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BibleProvider } from './context/BibleContext';
import { HomePage } from './pages/HomePage';
import { ReaderPage } from './pages/ReaderPage';
import { SearchPage } from './pages/SearchPage';
import { Navbar } from './components/Navbar';
import './App.css';

function App() {
  return (
    <BibleProvider>
      <Router>
        <div className="flex flex-col min-h-screen w-screen overflow-x-hidden m-0 p-0 font-sans">
          <Navbar />
          <main className="flex-1 flex w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/reader" element={<ReaderPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
          <footer className="bg-emerald-800 text-white py-4 text-center w-full">
            <p className="text-sm">&copy; {new Date().getFullYear()} Scripture Reading App. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </BibleProvider>
  );
}

export default App;
