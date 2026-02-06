import { useEffect, useState } from "react";
import { getAllOrders, deleteOrder, createOrder, updateOrder } from "../../utils/order.api";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Sidebar from "../../components/layout/Sidebar";

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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    promoCodeId: "",
    tax: 0,
    orderDate: "",
    status: "CONFIRMED",
    items: [{ productId: "", produitQuantite: 1 }],
    payments: [{ paymentNumber: 1, amount: 0, paymentType: "CASH", paymentDate: "", depositDate: "", status: "DEPOSITED", reference: "", bank: "" }]
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (error) {
      setError("Erreur lors du chargement des commandes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await deleteOrder(id);
        setOrders(orders.filter(o => o.id !== id));
        setError("");
      } catch (error) {
        console.error("Erreur complète:", error);
        setError(`Erreur lors de la suppression: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      clientId: "",
      promoCodeId: "",
      tax: 0,
      orderDate: "",
      status: "CONFIRMED",
      items: [{ productId: "", produitQuantite: 1 }],
      payments: [{ paymentNumber: 1, amount: 0, paymentType: "CASH", paymentDate: "", depositDate: "", status: "DEPOSITED", reference: "", bank: "" }]
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (order) => {
    setIsEditMode(true);
    setFormData({
      clientId: order.clientId,
      promoCodeId: order.promoCodeId || "",
      tax: order.tax,
      orderDate: order.orderDate,
      status: order.status,
      items: order.items || [{ productId: "", produitQuantite: 1 }],
      payments: order.payments || [{ paymentNumber: 1, amount: 0, paymentType: "CASH", paymentDate: "", depositDate: "", status: "DEPOSITED", reference: "", bank: "" }]
    });
    setEditingId(order.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      clientId: "",
      promoCodeId: "",
      tax: 0,
      orderDate: "",
      status: "CONFIRMED",
      items: [{ productId: "", produitQuantite: 1 }],
      payments: [{ paymentNumber: 1, amount: 0, paymentType: "CASH", paymentDate: "", depositDate: "", status: "DEPOSITED", reference: "", bank: "" }]
    });
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tax' ? parseFloat(value) : value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: field === 'produitQuantite' ? parseInt(value) : value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: "", produitQuantite: 1 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handlePaymentChange = (index, field, value) => {
    const newPayments = [...formData.payments];
    newPayments[index] = { ...newPayments[index], [field]: field === 'amount' || field === 'paymentNumber' ? parseFloat(value) : value };
    setFormData(prev => ({ ...prev, payments: newPayments }));
  };

  const addPayment = () => {
    setFormData(prev => ({
      ...prev,
      payments: [...prev.payments, { paymentNumber: prev.payments.length + 1, amount: 0, paymentType: "CASH", paymentDate: "", depositDate: "", status: "DEPOSITED", reference: "", bank: "" }]
    }));
  };

  const removePayment = (index) => {
    setFormData(prev => ({
      ...prev,
      payments: prev.payments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateOrder(editingId, formData);
        setOrders(orders.map(o => o.id === editingId ? { ...o, ...formData } : o));
        setError("");
      } else {
        const res = await createOrder(formData);
        setOrders([...orders, res.data]);
        setError("");
      }
      closeModal();
    } catch (error) {
      setError(`Erreur: ${error.response?.data?.message || error.message}`);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-500/20 text-blue-400";
      case "SHIPPED":
        return "bg-purple-500/20 text-purple-400";
      case "DELIVERED":
        return "bg-green-500/20 text-green-400";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

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
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <Header notifications={0} />

        <main className="flex-1 px-4 md:px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Commandes</h2>
                <p className="text-slate-400 mt-2">Gérez vos commandes clients</p>
              </div>
              <button 
                onClick={openAddModal}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                <AddIcon />
                <span>Nouvelle commande</span>
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-4 text-gray-400 font-medium">Chargement des commandes...</p>
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

          {!loading && !error && orders.length === 0 && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-slate-400 text-lg">Aucune commande trouvée</p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-900">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">ID</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">Client</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">Date</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">Statut</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">Taxe</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-4 px-6 text-sm text-slate-400">{order.id}</td>
                        <td className="py-4 px-6 text-sm font-medium text-white">Client {order.clientId}</td>
                        <td className="py-4 px-6 text-sm text-slate-300">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-green-400">{order.tax} DZD</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => openEditModal(order)}
                              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-all">
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              {isEditMode ? "Modifier la commande" : "Créer une commande"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Infos principales */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Client ID</label>
                  <input
                    type="number"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleFormChange}
                    placeholder="1"
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Promo Code ID</label>
                  <input
                    type="number"
                    name="promoCodeId"
                    value={formData.promoCodeId}
                    onChange={handleFormChange}
                    placeholder="Optionnel"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Taxe</label>
                  <input
                    type="number"
                    name="tax"
                    value={formData.tax}
                    onChange={handleFormChange}
                    placeholder="0"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date de commande</label>
                  <input
                    type="datetime-local"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="CONFIRMED">Confirmée</option>
                  <option value="SHIPPED">Expédiée</option>
                  <option value="DELIVERED">Livrée</option>
                  <option value="CANCELLED">Annulée</option>
                </select>
              </div>

              {/* Articles */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-white">Articles</h4>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 text-sm font-medium"
                  >
                    + Ajouter article
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="number"
                        placeholder="ID Produit"
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        required
                        className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="number"
                        placeholder="Quantité"
                        value={item.produitQuantite}
                        onChange={(e) => handleItemChange(index, 'produitQuantite', e.target.value)}
                        min="1"
                        required
                        className="w-24 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="px-3 py-2 text-red-400 hover:bg-slate-700 rounded transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paiements */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-white">Paiements</h4>
                  <button
                    type="button"
                    onClick={addPayment}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 text-sm font-medium"
                  >
                    + Ajouter paiement
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.payments.map((payment, index) => (
                    <div key={index} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="number"
                          placeholder="N° Paiement"
                          value={payment.paymentNumber}
                          onChange={(e) => handlePaymentChange(index, 'paymentNumber', e.target.value)}
                          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                        />
                        <input
                          type="number"
                          placeholder="Montant"
                          value={payment.amount}
                          onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                          step="0.01"
                          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <select
                          value={payment.paymentType}
                          onChange={(e) => handlePaymentChange(index, 'paymentType', e.target.value)}
                          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="CASH">CASH</option>
                          <option value="CHECK">CHECK</option>
                          <option value="CARD">CARD</option>
                          <option value="TRANSFER">TRANSFER</option>
                        </select>
                        <select
                          value={payment.status}
                          onChange={(e) => handlePaymentChange(index, 'status', e.target.value)}
                          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="DEPOSITED">DEPOSITED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="datetime-local"
                          value={payment.paymentDate}
                          onChange={(e) => handlePaymentChange(index, 'paymentDate', e.target.value)}
                          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                        />
                        <input
                          type="datetime-local"
                          value={payment.depositDate}
                          onChange={(e) => handlePaymentChange(index, 'depositDate', e.target.value)}
                          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Référence"
                          value={payment.reference}
                          onChange={(e) => handlePaymentChange(index, 'reference', e.target.value)}
                          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                        />
                        <input
                          type="text"
                          placeholder="Banque"
                          value={payment.bank}
                          onChange={(e) => handlePaymentChange(index, 'bank', e.target.value)}
                          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          type="button"
                          onClick={() => removePayment(index)}
                          className="col-span-2 px-3 py-2 text-red-400 hover:bg-slate-700 rounded transition"
                        >
                          Supprimer paiement
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium"
                >
                  {isEditMode ? "Mettre à jour" : "Créer"}
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