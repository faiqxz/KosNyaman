import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: '100dvh' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properti/:id" element={<PropertyDetail />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}
