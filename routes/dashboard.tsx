import { Gauge, Library, LogOut, Sparkles, Menu, X, ChevronDown } from 'lucide-react';
import { useMemo, useState, useEffect, useRef } from 'react';
import ImageGeneration from '../components/ImageGeneration';
import ShotLibrary from '../components/ShotLibrary';
import { useAuth } from '../hooks/use-auth';
import { useRazorpayCheckout } from '../hooks/use-razorpay-checkout';

type ViewType = 'dashboard' | 'shot-library';

const navItems: { label: string; icon: typeof Gauge; view: ViewType }[] = [
  { label: 'Dashboard', icon: Gauge, view: 'dashboard' },
  { label: 'Shot Library', icon: Library, view: 'shot-library' },
];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { error: paymentError, clearError } = useRazorpayCheckout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [refreshLibrary, setRefreshLibrary] = useState(0);
  const desktopProfileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileProfileDropdownRef = useRef<HTMLDivElement>(null);

  const initials = useMemo(() => {
    if (!user?.displayName) return 'VS';
    return user.displayName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user?.displayName]);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = desktopProfileDropdownRef.current && 
        !desktopProfileDropdownRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileProfileDropdownRef.current && 
        !mobileProfileDropdownRef.current.contains(event.target as Node);
      
      if (isOutsideDesktop && isOutsideMobile) {
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

  return (
    <div className="studio-grid flex min-h-screen text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[112px] flex-col justify-between border-r border-white/[0.06] bg-black/40 px-5 py-10 backdrop-blur-3xl lg:flex">
        <div className="flex flex-col items-center gap-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-lg font-semibold text-white/90">
            VS
          </div>
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveView(item.view)}
                  className={`group flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-xs font-semibold transition ${
                    isActive
                      ? 'border-accent/30 bg-accent/10 text-accent'
                      : 'border-transparent text-white/50 hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    isActive
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
            <span className="text-white/70">Visionary Studio</span>
            <span className="tracking-[0.4em]">BETA</span>
          </div>
          <button
            onClick={() => signOut()}
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition hover:border-white/30 hover:bg-white/[0.12]"
            title="Sign out"
          >
            <LogOut className="h-4 w-4 text-white/70 transition group-hover:text-white" />
          </button>
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
                  VS
                </div>
                <span className="font-display text-lg text-white">Studio</span>
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
                    className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'border-accent/30 bg-accent/10 text-accent'
                        : 'border-transparent text-white/70 hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                      isActive
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
                    {user?.displayName ?? user?.email ?? 'Creator'}
                  </span>
                  <span>Studio access</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white transition hover:border-white/30 hover:bg-white/[0.12]"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="relative flex-1">
        <header className="sticky top-0 z-20 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8 md:py-6 lg:py-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="min-w-0 flex-1 space-y-1 md:space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 md:text-xs md:tracking-[0.45em]">
                Visionary Studio
              </span>
              <div className="flex items-end gap-2 md:gap-3">
                <h1 className="truncate font-display text-xl text-white sm:text-2xl md:text-3xl lg:text-[44px] leading-none">
                  {activeView === 'dashboard' ? 'Campaign Atelier' : 'Shot Library'}
                </h1>
                <Sparkles className="h-4 w-4 flex-shrink-0 text-accent md:h-5 md:w-5" />
              </div>
              <p className="hidden text-xs text-white/60 sm:block md:text-sm lg:max-w-xl">
                {activeView === 'dashboard'
                  ? 'Curate, direct, and render premium campaign visuals with a studio-native workflow.'
                  : 'Browse and manage your saved campaign shots.'}
              </p>
            </div>

            {/* Desktop User Profile */}
            <div ref={desktopProfileDropdownRef} className="relative hidden sm:block">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur transition hover:border-white/20 hover:bg-black/50 md:px-5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent md:h-10 md:w-10 md:text-sm">
                  {initials}
                </div>
                <div className="hidden flex-col text-xs text-white/60 md:flex">
                  <span className="text-white">
                    {user?.displayName ?? user?.email ?? 'Creator'}
                  </span>
                  <span>Studio access</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {user?.displayName ?? 'Creator'}
                        </p>
                        <p className="truncate text-xs text-white/50">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile User Icon */}
            <div ref={mobileProfileDropdownRef} className="relative sm:hidden">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent transition hover:bg-accent/30"
              >
                {initials}
              </button>

              {/* Mobile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {user?.displayName ?? 'Creator'}
                        </p>
                        <p className="truncate text-xs text-white/50">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl px-3 pb-12 pt-6 sm:px-4 sm:pb-16 sm:pt-12 md:px-8">
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
            <ImageGeneration 
              userId={user?.uid} 
              onImageSaved={() => setRefreshLibrary(prev => prev + 1)}
            />
          </div>
          <div className={activeView === 'shot-library' ? 'block' : 'hidden'}>
            <ShotLibrary 
              userId={user?.uid ?? ''} 
              refreshTrigger={refreshLibrary}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

