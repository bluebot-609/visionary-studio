'use client';

import { Gauge, Library, Power, Menu, X, ChevronDown, Coins, ShoppingCart } from 'lucide-react';
import { useMemo, useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardMain } from '../../components/dashboard/DashboardMain';
import ShotLibrary from '../../components/ShotLibrary';
import { CreditPurchaseModal } from '../../components/dashboard/CreditPurchaseModal';
import { useAuth } from '../../hooks/use-auth';
import { useRazorpayCheckout } from '../../hooks/use-razorpay-checkout';
import { useCredits } from '../../hooks/use-credits';

type ViewType = 'dashboard' | 'shot-library';

const navItems: { label: string; icon: typeof Gauge; view: ViewType }[] = [
  { label: 'Dashboard', icon: Gauge, view: 'dashboard' },
  { label: 'Shot Library', icon: Library, view: 'shot-library' },
];

function DashboardPageInner() {
  const { user, signOut, loading } = useAuth();
  const { balance, loading: creditsLoading } = useCredits();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error: paymentError, clearError } = useRazorpayCheckout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [refreshLibrary, setRefreshLibrary] = useState(0);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [trialBanner, setTrialBanner] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const initials = useMemo(() => {
    if (!user) return 'VS';
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';
    if (!name) return 'VS';
    return name
      .split(' ')
      .map((part: string) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  // Redirect to landing page if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const trialStatus = searchParams.get('trial');
    const trialMessage = searchParams.get('message');

    if (trialStatus && trialMessage) {
      const type: 'success' | 'warning' | 'error' =
        trialStatus === 'activated' ? 'success' : trialStatus === 'limit_reached' ? 'warning' : 'error';

      setTrialBanner({ type, message: trialMessage });

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('trial');
        url.searchParams.delete('message');
        const remainingSearch = url.searchParams.toString();
        const nextPath = remainingSearch ? `${url.pathname}?${remainingSearch}` : url.pathname;
        router.replace(nextPath, { scroll: false });
      }
    }
  }, [searchParams, router]);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.refresh();
      await new Promise(resolve => setTimeout(resolve, 100));
      router.replace('/');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error signing out:', error);
      }
      router.refresh();
      router.replace('/');
    }
  };

  // Show loading state while auth is being verified
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent/30 border-t-accent" />
          <p className="text-sm text-white/60">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard content if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="studio-grid flex min-h-screen text-white overflow-x-hidden">
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden w-[112px] flex-col justify-between border-r border-white/[0.06] bg-black/40 px-5 py-10 backdrop-blur-3xl lg:flex fixed left-0 top-0 h-screen z-30">
        <div className="flex flex-col items-center gap-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-lg font-semibold text-white/90">
            AS
          </div>
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveView(item.view)}
                  className={`group flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-xs font-semibold transition ${isActive
                    ? 'border-accent/30 bg-accent/10 text-accent'
                    : 'border-transparent text-white/50 hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
                    }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${isActive
                    ? 'bg-accent/20 text-accent'
                    : 'bg-white/[0.03] group-hover:bg-accent/20 group-hover:text-accent'
                    }`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center text-center text-xs text-white/50">
            <span className="text-white/70">AdShotAI</span>
            <span className="tracking-[0.4em]">BETA</span>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-white/[0.06] bg-black/95 backdrop-blur-3xl transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col justify-between p-6">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] text-sm font-semibold text-white/90">
                  AS
                </div>
                <span className="font-display text-lg text-white">AdShotAI</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveView(item.view);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${isActive
                      ? 'border-accent/30 bg-accent/10 text-accent'
                      : 'border-transparent text-white/70 hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
                      }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${isActive
                      ? 'bg-accent/20 text-accent'
                      : 'bg-white/[0.03] group-hover:bg-accent/20 group-hover:text-accent'
                      }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                  {initials}
                </div>
                <div className="flex flex-col text-xs text-white/60">
                  <span className="text-sm text-white">
                    {user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? 'Creator'}
                  </span>
                  <span>Studio access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Floating Profile Pill - Fixed top-right (Dashboard only) */}
      <div className={`fixed top-4 right-4 z-40 flex items-center gap-2 ${activeView !== 'dashboard' ? 'hidden' : ''}`}>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-full p-2.5 bg-black/60 border border-white/10 text-white/70 hover:bg-black/80 hover:text-white backdrop-blur-xl lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Profile Pill with Dropdown */}
        <div ref={profileDropdownRef} className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-xl transition hover:border-white/20 hover:bg-black/80"
          >
            {/* Credits */}
            <div className="flex items-center gap-1.5 text-sm">
              <Coins className="h-4 w-4 text-accent" />
              <span className="font-semibold text-white">
                {creditsLoading ? '—' : balance}
              </span>
            </div>
            
            {/* Divider */}
            <div className="h-5 w-px bg-white/20" />
            
            {/* Avatar */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
              {initials}
            </div>
            
            <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Info */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-white">
                      {user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? 'Creator'}
                    </p>
                    <p className="truncate text-xs text-white/50">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Credits Section */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/60 uppercase tracking-wider">Credits</span>
                  <span className="text-lg font-bold text-white">{creditsLoading ? '—' : balance}</span>
                </div>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setIsCreditModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent text-slate-950 px-4 py-2.5 text-sm font-semibold hover:bg-accent-hover transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Buy Credits
                </button>
              </div>

              {/* Logout */}
              <div className="p-2">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Power className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="relative flex-1 min-w-0 overflow-x-hidden lg:ml-[112px]">
        {/* Shot Library Header (only visible on shot-library view) */}
        {activeView === 'shot-library' && (
          <div className="sticky top-0 z-20 bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 py-4 sm:px-6 md:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white">Shot Library</h1>
              </div>
              <div className="flex items-center gap-2">
                {/* Credits */}
                <div className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Coins className="h-4 w-4 text-accent" />
                  <span className="font-semibold text-white">{creditsLoading ? '—' : balance}</span>
                </div>
                {/* Profile */}
                <div ref={profileDropdownRef} className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur transition hover:border-white/20 hover:bg-black/60"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
                      {initials}
                    </div>
                    <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {/* Dropdown - reuse same dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium text-white">
                              {user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? 'Creator'}
                            </p>
                            <p className="truncate text-xs text-white/50">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-white/60 uppercase tracking-wider">Credits</span>
                          <span className="text-lg font-bold text-white">{creditsLoading ? '—' : balance}</span>
                        </div>
                        <button
                          onClick={() => { setIsProfileDropdownOpen(false); setIsCreditModalOpen(true); }}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent text-slate-950 px-4 py-2.5 text-sm font-semibold hover:bg-accent-hover transition-colors"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Buy Credits
                        </button>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => { setIsProfileDropdownOpen(false); handleSignOut(); }}
                          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <Power className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`mx-auto w-full max-w-full px-3 pb-12 sm:px-4 sm:pb-16 md:px-6 lg:px-8 overflow-x-hidden ${activeView === 'dashboard' ? 'pt-4 sm:pt-6' : 'pt-6'}`}>
          {trialBanner && (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-xs backdrop-blur sm:mb-8 sm:rounded-3xl sm:px-5 sm:py-4 sm:text-sm ${trialBanner.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                : trialBanner.type === 'warning'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-100'
                  : 'border-red-500/40 bg-red-500/10 text-red-100'
                }`}
            >
              {trialBanner.message}
              <button
                onClick={() => setTrialBanner(null)}
                className="ml-2 text-[10px] font-semibold uppercase tracking-wide underline transition hover:text-white sm:ml-3 sm:text-xs"
              >
                dismiss
              </button>
            </div>
          )}
          {paymentError && (
            <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200 backdrop-blur sm:mb-8 sm:rounded-3xl sm:px-5 sm:py-4 sm:text-sm md:text-sm">
              {paymentError}
              <button
                onClick={() => clearError()}
                className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-red-100 underline sm:ml-3 sm:text-xs"
              >
                dismiss
              </button>
            </div>
          )}

          <div className={activeView === 'dashboard' ? 'block' : 'hidden'}>
            <DashboardMain
              userId={user?.id}
              onImageSaved={() => setRefreshLibrary(prev => prev + 1)}
            />
          </div>
          <div className={activeView === 'shot-library' ? 'block' : 'hidden'}>
            <ShotLibrary
              userId={user?.id ?? ''}
              refreshTrigger={refreshLibrary}
            />
          </div>
        </div>
      </main>

      {/* Credit Purchase Modal */}
      <CreditPurchaseModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent/30 border-t-accent" />
            <p className="text-sm text-white/60">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardPageInner />
    </Suspense>
  );
}
