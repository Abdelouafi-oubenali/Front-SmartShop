import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Sidebar from "../../components/layout/Sidebar";
import { completePayment } from "../../utils/order.api";

const normalizeDateTime = (value) => {
	if (!value) return value;
	if (value.length === 16) return `${value}:00`;
	return value;
};

export default function CompletePayment() {
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [orderId, setOrderId] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		paymentNumber: 1,
		amount: 0,
		paymentType: "CASH",
		paymentDate: "",
		depositDate: "",
		status: "DEPOSITED",
		reference: "",
		bank: ""
	});

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: name === "paymentNumber" ? parseInt(value || 0, 10)
				: name === "amount" ? parseFloat(value || 0)
				: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!orderId) {
			setError("Veuillez saisir l'ID de la commande");
			return;
		}

		const payload = {
			paymentNumber: Number(formData.paymentNumber),
			amount: Number(formData.amount),
			paymentType: formData.paymentType,
			paymentDate: normalizeDateTime(formData.paymentDate),
			depositDate: normalizeDateTime(formData.depositDate),
			status: formData.status,
			reference: formData.reference,
			bank: formData.bank
		};

		setSubmitting(true);
		try {
			await completePayment(orderId, payload);
			setSuccess("Paiement complété avec succès.");
		} catch (err) {
			setError(`Erreur: ${err.response?.data?.message || err.message}`);
		} finally {
			setSubmitting(false);
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
						<h2 className="text-3xl font-bold text-white">Compléter un paiement</h2>
						<p className="text-slate-400 mt-2">Envoyer un paiement pour une commande</p>
					</div>

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

					{success && (
						<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
							<div className="flex items-center">
								<svg className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
								<p className="text-green-800 dark:text-green-400 font-medium">{success}</p>
							</div>
						</div>
					)}

					<div className="bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-3xl">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-slate-300 mb-2">ID Commande</label>
								<input
									type="number"
									value={orderId}
									onChange={(e) => setOrderId(e.target.value)}
									placeholder="4"
									min="1"
									required
									className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">Numéro de paiement</label>
									<input
										type="number"
										name="paymentNumber"
										value={formData.paymentNumber}
										onChange={handleFormChange}
										min="1"
										required
										className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">Montant</label>
									<input
										type="number"
										name="amount"
										value={formData.amount}
										onChange={handleFormChange}
										min="0"
										step="0.01"
										required
										className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">Type de paiement</label>
									<select
										name="paymentType"
										value={formData.paymentType}
										onChange={handleFormChange}
										className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
									>
										<option value="CASH">CASH</option>
										<option value="CARD">CARD</option>
										<option value="CHECK">CHECK</option>
										<option value="TRANSFER">TRANSFER</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">Statut</label>
									<select
										name="status"
										value={formData.status}
										onChange={handleFormChange}
										className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
									>
										<option value="DEPOSITED">DEPOSITED</option>
										<option value="PENDING">PENDING</option>
										<option value="FAILED">FAILED</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">Date paiement</label>
									<input
										type="datetime-local"
										name="paymentDate"
										value={formData.paymentDate}
										onChange={handleFormChange}
										required
										className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">Date dépôt</label>
									<input
										type="datetime-local"
										name="depositDate"
										value={formData.depositDate}
										onChange={handleFormChange}
										required
										className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">Référence</label>
									<input
										type="text"
										name="reference"
										value={formData.reference}
										onChange={handleFormChange}
										placeholder="REF123456"
										required
										className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">Banque</label>
									<input
										type="text"
										name="bank"
										value={formData.bank}
										onChange={handleFormChange}
										placeholder="BNP"
										required
										className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
									/>
								</div>
							</div>

							<div className="flex space-x-3 pt-4">
								<button
									type="submit"
									disabled={submitting}
									className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium disabled:opacity-60"
								>
									{submitting ? "Envoi..." : "Compléter le paiement"}
								</button>
							</div>
						</form>
					</div>
				</main>

				<Footer />
			</div>
		</div>
	);
}