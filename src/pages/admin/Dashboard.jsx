import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Sidebar from "../../components/layout/Sidebar";

// ============ ICÔNES SVG ============
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

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ProductsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const OrdersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const PromoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const PaymentsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

// ============ COMPOSANTS DE CARTES ============
const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 p-6 group hover:shadow-xl hover:shadow-cyan-500/10">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {title}
        </p>
        <p className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
          {value}
        </p>
        {trend && (
          <div className="flex items-center space-x-1">
            <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
            <span className="text-xs text-slate-500">vs mois dernier</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  </div>
);

// ============ COMPOSANT DASHBOARD PRINCIPAL ============
export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notifications] = useState(3);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const mockStats = {
    users: { value: "1,247", trend: 'up', trendValue: '+12%' },
    products: { value: "356", trend: 'up', trendValue: '+8%' },
    promoCodes: { value: "42", trend: 'down', trendValue: '-3%' },
    orders: { value: "893", trend: 'up', trendValue: '+24%' },
    payments: { value: "€24,567", trend: 'up', trendValue: '+18%' },
  };

  const recentOrders = [
    { id: '#12345', client: 'Jean Dupont', amount: '€145.00', status: 'En cours', time: '10 min' },
    { id: '#12344', client: 'Marie Martin', amount: '€89.50', status: 'Livré', time: '1h' },
    { id: '#12343', client: 'Pierre Durand', amount: '€234.00', status: 'Préparation', time: '2h' },
    { id: '#12342', client: 'Sophie Bernard', amount: '€67.99', status: 'Livré', time: '3h' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Menu burger mobile */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-slate-800 text-white rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <Sidebar
        activeItem={activeSection}
        onNavigate={setActiveSection}
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <Header notifications={notifications} />

        <main className="flex-1 px-4 md:px-6 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Tableau de bord
            </h2>
            <p className="text-slate-400">
              Bienvenue sur votre dashboard SmartShop. Voici un aperçu de vos activités.
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
            <StatCard
              title="Utilisateurs"
              value={mockStats.users.value}
              icon={<UsersIcon />}
              color="bg-blue-500/20 text-blue-400"
              trend={mockStats.users.trend}
              trendValue={mockStats.users.trendValue}
            />
            <StatCard
              title="Produits"
              value={mockStats.products.value}
              icon={<ProductsIcon />}
              color="bg-purple-500/20 text-purple-400"
              trend={mockStats.products.trend}
              trendValue={mockStats.products.trendValue}
            />
            <StatCard
              title="Codes Promo"
              value={mockStats.promoCodes.value}
              icon={<PromoIcon />}
              color="bg-green-500/20 text-green-400"
              trend={mockStats.promoCodes.trend}
              trendValue={mockStats.promoCodes.trendValue}
            />
            <StatCard
              title="Commandes"
              value={mockStats.orders.value}
              icon={<OrdersIcon />}
              color="bg-orange-500/20 text-orange-400"
              trend={mockStats.orders.trend}
              trendValue={mockStats.orders.trendValue}
            />
            <StatCard
              title="Revenus"
              value={mockStats.payments.value}
              icon={<PaymentsIcon />}
              color="bg-pink-500/20 text-pink-400"
              trend={mockStats.payments.trend}
              trendValue={mockStats.payments.trendValue}
            />
          </div>

          {/* Commandes récentes */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Commandes récentes</h3>
              <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                Voir tout
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">N° Commande</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Client</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Montant</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Statut</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Il y a</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-300">{order.id}</td>
                      <td className="py-3 px-4 text-sm text-slate-300">{order.client}</td>
                      <td className="py-3 px-4 text-sm text-slate-300 font-semibold">{order.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'Livré' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'En cours' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}