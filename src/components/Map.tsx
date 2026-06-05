"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { getMapState, claimPlot } from '@/app/game/actions';
import { createClient } from '@/utils/supabase/client';

export default function OklahomaPlotMap() {
  const router = useRouter();
  const supabase = createClient();

  // State Management
  const [pendingPlots, setPendingPlots] = useState<number[]>([]);
  const [plotDetails, setPlotDetails] = useState<Record<number, { initials: string, color: string, isMine: boolean }>>({});
  const [userTier, setUserTier] = useState(0);
  const [myProfile, setMyProfile] = useState<{ full_name: string, color: string } | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showPayment, setShowPayment] = useState(false);
  const [activePlot, setActivePlot] = useState<number | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Configuration for 1200 plots
  const GRID_COLS = 40; 
  const GRID_ROWS = 30;
  const totalPlots = GRID_COLS * GRID_ROWS;

  // Helper to extract initials
  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    async function loadData() {
      const { plots, currentUserId, userTier: tier, canClaim: _canClaim, myProfile: profile } = await getMapState();
      
      const newPlotDetails: Record<number, { initials: string, color: string, isMine: boolean }> = {};
      if (plots) {
        plots.forEach((p: any) => {
          if (p.owner_id && p.profiles) {
            newPlotDetails[p.id] = {
              initials: getInitials(p.profiles.full_name),
              color: p.profiles.color || '#3B82F6',
              isMine: p.owner_id === currentUserId
            };
          }
        });
      }
      
      setPlotDetails(newPlotDetails);
      setMyProfile(profile);
      setUserTier(tier);
      setCanClaim(_canClaim);
      setLoading(false);
    }
    loadData();
  }, []);

  const handlePlotClick = (plotId: number) => {
    if (plotDetails[plotId] || pendingPlots.includes(plotId)) return;
    
    if (!canClaim) {
      alert("You have already claimed a plot for this visit. Please check in again to claim another.");
      return;
    }

    setPendingPlots([...pendingPlots, plotId]);
    setActivePlot(plotId);
    setShowPayment(true);
    setErrorMsg('');
  };

  const handlePaymentSuccess = async () => {
    if (activePlot === null) return;
    setClaiming(true);
    setErrorMsg('');

    const res = await claimPlot(activePlot);
    
    if (res?.error) {
      setErrorMsg(res.error);
      setClaiming(false);
      setPendingPlots(pendingPlots.filter((id) => id !== activePlot));
      return;
    }

    // Success! Update local state just in case, before routing
    setPendingPlots(pendingPlots.filter((id) => id !== activePlot));
    
    if (myProfile) {
      setPlotDetails(prev => ({
        ...prev,
        [activePlot]: {
          initials: getInitials(myProfile.full_name),
          color: myProfile.color || '#3B82F6',
          isMine: true
        }
      }));
    }
    
    setUserTier((res as any).newTier);
    setCanClaim(false);
    
    setShowPayment(false);
    setActivePlot(null);
    setClaiming(false);

    // Route to the 3d model
    router.push('/game');
  };

  const handleCancel = () => {
    setPendingPlots(pendingPlots.filter((id) => id !== activePlot));
    setShowPayment(false);
    setActivePlot(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-orange-50 select-none">
      
      {/* Header Info */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg w-[calc(100%-2rem)] max-w-4xl flex justify-between items-center border border-white/20">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Oklahoma Land Rush (1889)</h1>
        <div className="flex gap-4 items-center">
          <div className="text-sm sm:text-lg font-semibold text-blue-700 bg-blue-100 px-4 py-1.5 rounded-full shadow-inner">
            Tier: {userTier}
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium bg-gray-800 hover:bg-gray-900 text-white px-4 py-1.5 rounded-full transition-colors shadow-md active:scale-95"
          >
            Done (Log Out)
          </button>
        </div>
      </div>

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
                const details = plotDetails[idx];
                const isOwnedByMe = details?.isMine;
                const isOwnedByOther = details && !details.isMine;
                
                let plotStyle = "border border-gray-500/20 hover:bg-blue-400/40 hover:border-blue-400 cursor-pointer transition-all duration-150 flex items-center justify-center overflow-hidden";
                let overlayStyle = {};
                
                if (isPending) {
                  plotStyle = "bg-yellow-400/70 border-yellow-500 cursor-wait shadow-inner flex items-center justify-center overflow-hidden";
                } else if (isOwnedByMe || isOwnedByOther) {
                  plotStyle = "cursor-not-allowed flex items-center justify-center overflow-hidden font-bold text-[0.45rem] shadow-sm";
                  // Custom styling based on their profile color
                  overlayStyle = {
                    backgroundColor: `${details.color}80`, // 80 is 50% opacity hex
                    borderColor: details.color,
                    borderWidth: isOwnedByMe ? '2px' : '1px',
                    color: '#ffffff',
                    textShadow: '0px 0px 2px rgba(0,0,0,0.8)'
                  };
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handlePlotClick(idx)}
                    className={plotStyle}
                    style={overlayStyle}
                    title={`Plot #${idx}`}
                  >
                    {details && !isPending && details.initials}
                  </div>
                );
              })}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Splash Screen Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20 transform animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 bg-gray-900 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">Sq</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Secure Payment</h2>
            <p className="text-gray-600 mb-6">
              You are claiming <strong>Plot #{activePlot}</strong>. <br />
              Complete your payment to take ownership and increase your tier.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {errorMsg}
              </div>
            )}

            <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-100 text-left shadow-inner">
               <div className="mb-1 text-sm font-medium text-gray-500 uppercase tracking-wider">Amount Due</div>
               <div className="text-4xl font-extrabold text-gray-800">$50.00</div>
            </div>

            <div className="flex gap-3 justify-center">
              <button 
                onClick={handleCancel}
                disabled={claiming}
                className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handlePaymentSuccess}
                disabled={claiming}
                className="flex-[2] py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {claiming ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  'Pay & Claim Plot'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}