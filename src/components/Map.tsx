"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const OklahomaPlotMap = () => {
  const router = useRouter();

  // State Management
  const [pendingPlots, setPendingPlots] = useState<number[]>([]);
  const [ownedPlots, setOwnedPlots] = useState<number[]>([]);
  const [userTier, setUserTier] = useState(0);
  
  // Modal State
  const [showPayment, setShowPayment] = useState(false);
  const [activePlot, setActivePlot] = useState<number | null>(null);

  // Configuration for the grid over the image. 
  // You can adjust columns/rows to match the exact density you want.
  const GRID_COLS = 20; 
  const GRID_ROWS = 20;
  const totalPlots = GRID_COLS * GRID_ROWS;

  // Handle clicking on an empty grid square
  const handlePlotClick = (plotId: number) => {
    // Prevent interacting if already pending or owned
    if (ownedPlots.includes(plotId) || pendingPlots.includes(plotId)) return;
    
    // Mark as pending and trigger splash screen
    setPendingPlots([...pendingPlots, plotId]);
    setActivePlot(plotId);
    setShowPayment(true);
  };

  // Simulate a successful Square payment
  const handlePaymentSuccess = () => {
    if (activePlot === null) return;

    // Remove from pending
    setPendingPlots(pendingPlots.filter((id) => id !== activePlot));
    
    // Assign to user & increase tier
    setOwnedPlots([...ownedPlots, activePlot]);
    setUserTier(userTier + 1);
    
    // Reset modal
    setShowPayment(false);
    setActivePlot(null);

    // Route to the 3d model
    router.push('/game');
  };

  // Cancel the payment, revert the pending plot
  const handleCancel = () => {
    setPendingPlots(pendingPlots.filter((id) => id !== activePlot));
    setShowPayment(false);
    setActivePlot(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-orange-50 select-none">
      
      {/* Header Info - Floating above the map */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg w-[calc(100%-2rem)] max-w-4xl flex justify-between items-center border border-white/20">
        <h1 className="text-2xl font-bold text-gray-800">Oklahoma Land Rush (1889)</h1>
        <div className="text-lg font-semibold text-blue-600 bg-blue-50 px-4 py-1 rounded-full">
          User Tier: {userTier}
        </div>
      </div>

      {/* Map Container with Zoom & Pan */}
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={8}
        centerOnInit={true}
        wheel={{ step: 0.001 }}
      >
        <TransformComponent wrapperClass="!w-full !h-full" contentClass="flex items-center justify-center">
          <div className="relative" style={{ width: '1600px', maxWidth: 'none' }}>
            <img 
              src="/oklahoma-map-1889.jpg" 
              alt="1889 Oklahoma Indian Territory Map" 
              className="w-full h-auto block opacity-90 shadow-2xl border-4 border-gray-800"
              draggable={false}
            />

            {/* Clickable Grid Overlay */}
            <div 
              className="absolute top-0 left-0 w-full h-full border-4 border-transparent"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, 
                gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` 
              }}
            >
              {Array.from({ length: totalPlots }).map((_, idx) => {
                const isPending = pendingPlots.includes(idx);
                const isOwned = ownedPlots.includes(idx);
                
                // Determine styling based on plot state
                let plotStyle = "border border-gray-500/30 hover:bg-blue-400/50 hover:border-blue-500 cursor-pointer transition-all duration-150";
                if (isPending) plotStyle = "bg-yellow-400/70 border-yellow-500 cursor-wait";
                if (isOwned) plotStyle = "bg-green-500/70 border-green-700 cursor-not-allowed";

                return (
                  <div
                    key={idx}
                    onClick={() => handlePlotClick(idx)}
                    className={plotStyle}
                    title={`Plot #${idx}`}
                  />
                );
              })}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Splash Screen Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
            
            {/* Square Logo Placeholder */}
            <div className="w-16 h-16 bg-gray-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">Sq</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Secure Payment</h2>
            <p className="text-gray-600 mb-6">
              You are claiming <strong>Plot #{activePlot}</strong>. <br />
              Complete your payment to take ownership and increase your tier.
            </p>

            {/* Mock Payment Form */}
            <div className="bg-gray-50 p-4 rounded mb-6 border border-gray-200 text-left">
               <div className="mb-2 text-sm text-gray-500">Amount Due</div>
               <div className="text-3xl font-bold text-gray-800">$50.00</div>
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handlePaymentSuccess}
                className="px-6 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Pay & Claim Plot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OklahomaPlotMap;