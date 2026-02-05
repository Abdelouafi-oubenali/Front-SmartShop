const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-400">
              © 2024 <span className="font-semibold text-slate-300">SmartShop</span>. Tous droits réservés.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a href="#" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
              Documentation
            </a>
            <a href="#" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
              Support
            </a>
            <a href="#" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
              Confidentialité
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-500">v2.1.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
