import React from 'react';
import Sidebar from './Sidebar';
import TopAppBar from './TopAppBar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:ml-[240px]">
        <TopAppBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
