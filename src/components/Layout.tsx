import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Navbar } from './Navbar';
import { BottomTabBar } from './BottomTabBar';
import { AssistantFAB } from './AssistantFAB';
import { AmbientBackground } from './AmbientBackground';
import { WelcomeBanner } from './WelcomeBanner';
import { easeOut } from '../lib/motion';

export function Layout() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen">
      <AmbientBackground />
      <Navbar />
      <WelcomeBanner />
      <main className="pb-28 pt-6 md:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomTabBar />
      <AssistantFAB />
    </div>
  );
}
