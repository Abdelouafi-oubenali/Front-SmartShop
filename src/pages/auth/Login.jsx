import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authAxiosInstance from "../../utils/authAxios";

const LoginIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
  </svg>
);

const EyeIcon = ({ show }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {show ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z M19.35 10.35L9.65 20.05" />
    )}
  </svg>
);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAxiosInstance.post("/auth/login", {
        username,
        password,
      });

      // Avec HttpSession, la session est maintenue via les cookies
      // Stocker les infos utilisateur pour les futures requêtes
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      console.log("Connexion réussie", response.data);

      // Rediriger vers le dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Nom d'utilisateur ou mot de passe incorrect");
      console.error("Erreur de connexion:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30 mb-4">
            <span className="text-white font-black text-2xl">S</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SmartShop</h1>
          <p className="text-slate-400">Tableau de bord administrateur</p>
        </div>

        {/* Formulaire */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-2xl shadow-cyan-500/10">
          <h2 className="text-2xl font-bold text-white mb-6">Connexion</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom d'utilisateur */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="louafi"
                required
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            {/* Se souvenir de moi */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 bg-slate-700 border border-slate-600 rounded cursor-pointer accent-cyan-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                Se souvenir de moi
              </label>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LoginIcon />
              <span>{loading ? "Connexion en cours..." : "Se connecter"}</span>
            </button>
          </form>

          {/* Lien oubli de mot de passe */}
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        {/* Infos de test */}
        <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400 text-center mb-3 font-semibold uppercase">Identifiants de test</p>
          <div className="space-y-2 text-xs text-slate-500">
            <p>Nom d'utilisateur: <span className="text-slate-300">louafi</span></p>
            <p>Mot de passe: <span className="text-slate-300">123456</span></p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>© 2024 SmartShop. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
