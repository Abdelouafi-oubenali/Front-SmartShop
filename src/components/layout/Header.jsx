const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Header = ({ notifications = 0 }) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-white font-black text-lg md:text-xl">S</span>
            </div>
            <div>
              <h1 className="text-base md:text-xl font-bold text-white tracking-tight">SmartShop</h1>
              <p className="text-xs text-slate-400 hidden md:block">Admin Dashboard</p>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
              <BellIcon />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-2 md:space-x-3 pl-2 md:pl-4 border-l border-slate-700">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-xs text-slate-400">admin@smartshop.com</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                <span className="text-white font-bold text-xs md:text-sm">AU</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
