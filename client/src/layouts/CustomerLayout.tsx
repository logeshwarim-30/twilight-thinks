import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { CartDrawer } from '../components/common/CartDrawer';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-white selection:text-black">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
};
