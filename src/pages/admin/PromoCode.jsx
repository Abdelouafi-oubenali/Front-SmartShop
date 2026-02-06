import { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Sidebar from "../../components/layout/Sidebar";
import {
	createPromoCode,
	deletePromoCode,
	getAllPromoCodes,
	updatePromoCode
} from "../../utils/promoCode.api";

const EditIcon = () => (
	<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
	</svg>
);

const DeleteIcon = () => (
	<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
	</svg>
);

const AddIcon = () => (
	<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
	</svg>
);

const defaultFormData = {
	code: "",
	active: true,
	discountPercentage: 0,
	expirationDate: ""
};

const formatDate = (value) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString("fr-FR");
};

export default function PromoCode() {
	const [promoCodes, setPromoCodes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [formData, setFormData] = useState(defaultFormData);
	const [editingId, setEditingId] = useState(null);

	useEffect(() => {
		loadPromoCodes();
	}, []);

	const loadPromoCodes = async () => {
		try {
			const res = await getAllPromoCodes();
			setPromoCodes(res.data || []);
		} catch (err) {
			setError("Erreur lors du chargement des codes promo");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const list = useMemo(() => promoCodes || [], [promoCodes]);

	const handleDelete = async (id) => {
		if (window.confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) {
			try {
				await deletePromoCode(id);
				setPromoCodes(list.filter(p => (p.id ?? p.code) !== id));
				setError("");
			} catch (err) {
				setError(`Erreur lors de la suppression: ${err.response?.data?.message || err.message}`);
			}
		}
	};

	const openAddModal = () => {
		setIsEditMode(false);
		setFormData(defaultFormData);
		setEditingId(null);
		setIsModalOpen(true);
	};

	const openEditModal = (promo) => {
		setIsEditMode(true);
		setFormData({
			code: promo.code || "",
			active: promo.active ?? true,
			discountPercentage: promo.discountPercentage ?? 0,
			expirationDate: promo.expirationDate ? String(promo.expirationDate).slice(0, 10) : ""
		});
		setEditingId(promo.id ?? promo.code);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setFormData(defaultFormData);
		setEditingId(null);
	};

	const handleFormChange = (e) => {
		const { name, value, type, checked } = e.target;
		if (name === "active") {
			setFormData(prev => ({ ...prev, active: checked }));
			return;
		}

		setFormData(prev => ({
			...prev,
			[name]: name === "discountPercentage" ? parseFloat(value || 0) : value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEditMode) {
				await updatePromoCode(editingId, formData);
				setPromoCodes(list.map(p => (p.id ?? p.code) === editingId ? { ...p, ...formData } : p));
			} else {
				const res = await createPromoCode(formData);
				setPromoCodes([...list, res.data]);
			}
			setError("");
			closeModal();
		} catch (err) {
			setError(`Erreur: ${err.response?.data?.message || err.message}`);
		}
	};

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
			<button
				onClick={() => setIsMobileSidebarOpen(true)}
				className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-slate-800 text-white rounded-lg"
			>
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>

			<Sidebar
				isMobileOpen={isMobileSidebarOpen}
				onClose={() => setIsMobileSidebarOpen(false)}
			/>

			<div className="flex-1 flex flex-col">
				<Header notifications={0} />

				<main className="flex-1 px-4 md:px-6 py-8">
					<div className="mb-8">
						<div className="flex items-center justify-between flex-wrap gap-4 mb-6">
							<div>
								<h2 className="text-3xl font-bold text-white">Codes Promo</h2>
								<p className="text-slate-400 mt-2">Gérez vos codes promo</p>
							</div>
							<button
								onClick={openAddModal}
								className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
								<AddIcon />
								<span>Ajouter code</span>
							</button>
						</div>
					</div>

					{loading && (
						<div className="flex items-center justify-center py-12">
							<div className="text-center">
								<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
								<p className="mt-4 text-gray-400 font-medium">Chargement des codes promo...</p>
							</div>
						</div>
					)}

					{error && (
						<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
							<div className="flex items-center">
								<svg className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<p className="text-red-800 dark:text-red-400 font-medium">{error}</p>
							</div>
						</div>
					)}

					{!loading && !error && list.length === 0 && (
						<div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
							<svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8-4m0 0l8 4m-8 4v10l-8-4m0 0v-10m8 4v10l8-4m0 0v-10" />
							</svg>
							<p className="text-slate-400 text-lg">Aucun code promo trouvé</p>
						</div>
					)}

					{!loading && !error && list.length > 0 && (
						<div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-slate-700 bg-slate-900">
											<th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">ID</th>
											<th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">Code</th>
											<th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">Remise</th>
											<th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">Expiration</th>
											<th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">Statut</th>
											<th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
										</tr>
									</thead>
									<tbody>
										{list.map((promo) => {
											const promoId = promo.id ?? promo.code;
											return (
												<tr key={promoId} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
													<td className="py-4 px-6 text-sm text-slate-400">{promoId}</td>
													<td className="py-4 px-6 text-sm font-medium text-white">{promo.code}</td>
													<td className="py-4 px-6 text-sm font-medium text-green-400">{promo.discountPercentage}%</td>
													<td className="py-4 px-6 text-sm text-slate-300">{formatDate(promo.expirationDate)}</td>
													<td className="py-4 px-6 text-sm">
														<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
															promo.active
																? "bg-green-500/20 text-green-400"
																: "bg-red-500/20 text-red-400"
														}`}>
															{promo.active ? "Actif" : "Inactif"}
														</span>
													</td>
													<td className="py-4 px-6">
														<div className="flex items-center space-x-2">
															<button
																onClick={() => openEditModal(promo)}
																className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-all">
																<EditIcon />
															</button>
															<button
																onClick={() => handleDelete(promoId)}
																className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all"
															>
																<DeleteIcon />
															</button>
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</main>

				<Footer />
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-slate-800 rounded-xl border border-slate-700 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
						<h3 className="text-2xl font-bold text-white mb-6">
							{isEditMode ? "Modifier le code promo" : "Ajouter un code promo"}
						</h3>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-slate-300 mb-2">Code</label>
								<input
									type="text"
									name="code"
									value={formData.code}
									onChange={handleFormChange}
									placeholder="R1-201"
									required
									className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-300 mb-2">Remise (%)</label>
								<input
									type="number"
									name="discountPercentage"
									value={formData.discountPercentage}
									onChange={handleFormChange}
									placeholder="0.00"
									step="0.01"
									min="0"
									required
									className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-300 mb-2">Date d'expiration</label>
								<input
									type="date"
									name="expirationDate"
									value={formData.expirationDate}
									onChange={handleFormChange}
									required
									className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
								/>
							</div>

							<div className="flex items-center space-x-3">
								<input
									type="checkbox"
									name="active"
									checked={formData.active}
									onChange={handleFormChange}
									className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
								/>
								<label className="text-sm font-medium text-slate-300">Actif</label>
							</div>

							<div className="flex space-x-3 pt-4">
								<button
									type="submit"
									className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium"
								>
									{isEditMode ? "Mettre à jour" : "Ajouter"}
								</button>
								<button
									type="button"
									onClick={closeModal}
									className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-all font-medium"
								>
									Annuler
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}