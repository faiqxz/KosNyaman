import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));

/**
 * The router itself is provided by the caller:
 * - BrowserRouter in the browser (src/main.tsx)
 * - StaticRouter at build time (src/entry-server.tsx) for pre-rendering
 */
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: '100dvh' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properti/:id" element={<PropertyDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}
