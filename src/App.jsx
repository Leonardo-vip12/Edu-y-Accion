import { lazy, Suspense } from 'react'
import MetaTags from './components/layout/MetaTags'
import ErrorBoundary from './components/layout/ErrorBoundary'
import Loader from './components/layout/Loader'
import Navbar from './components/layout/Navbar'
import FallingLeaves from './components/animations/FallingLeaves'
import ScrollToTop from './components/layout/ScrollToTop'
import Footer from './components/layout/Footer'

const Hero = lazy(() => import('./components/sections/Hero'))
const About = lazy(() => import('./components/sections/About'))
const Services = lazy(() => import('./components/sections/Services'))
const Programs = lazy(() => import('./components/sections/Programs'))
const Counters = lazy(() => import('./components/sections/Counters'))
const Timeline = lazy(() => import('./components/sections/Timeline'))
const Partners = lazy(() => import('./components/sections/Partners'))
const Gallery = lazy(() => import('./components/sections/Gallery'))
const Testimonials = lazy(() => import('./components/sections/Testimonials'))
const Volunteer = lazy(() => import('./components/sections/Volunteer'))
const Contact = lazy(() => import('./components/sections/Contact'))
const Games = lazy(() => import('./components/games/GamesHub'))

function SectionFallback() {
  return (
    <div className="h-64 flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function LazySection({ component: Component }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SectionFallback />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <>
      <MetaTags />
      <Loader />
      <FallingLeaves />
      <Navbar />
      <main>
        <LazySection component={Hero} />
        <LazySection component={About} />
        <LazySection component={Services} />
        <LazySection component={Programs} />
        <LazySection component={Timeline} />
        <LazySection component={Partners} />
        <LazySection component={Gallery} />
        <LazySection component={Counters} />
        <LazySection component={Testimonials} />
        <LazySection component={Volunteer} />
        <LazySection component={Games} />
        <LazySection component={Contact} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
