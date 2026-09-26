import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Plus,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Order, CustomTattooRequest } from '../../types';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'custom-requests' | 'profile' | 'addresses'>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'custom-requests' || tab === 'orders' || tab === 'profile' || tab === 'addresses') {
      return tab;
    }
    return 'orders';
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [customRequests, setCustomRequests] = useState<CustomTattooRequest[]>([]);
  const [loadingCustomRequests, setLoadingCustomRequests] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Address edit state
  const [addresses, setAddresses] = useState<any[]>(user?.addresses || []);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('[Account] Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchCustomRequests = async () => {
      try {
        const res = await api.getMyCustomTattoos();
        if (res.success && res.customTattoos) {
          setCustomRequests(res.customTattoos);
        }
      } catch (err) {
        console.error('[Account] Error fetching custom tattoos:', err);
      } finally {
        setLoadingCustomRequests(false);
      }
    };

    fetchOrders();
    fetchCustomRequests();
  }, [isAuthenticated, navigate]);

  const handleConfirmQuote = async (id: string) => {
    setConfirmingId(id);
    try {
      const res = await api.confirmCustomTattoo(id);
      if (res.success) {
        setCustomRequests((prev) =>
          prev.map((req) =>
            req._id === id
              ? { ...req, isCustomerConfirmed: true, status: 'Confirmed' }
              : req
          )
        );
        showToast('Quotation accepted! Studio atelier has scheduled your tattoo session.', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error accepting quote', 'error');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPincode) return;

    const newAddr = {
      fullName: user?.name || 'Customer',
      phone: user?.phone || '+91 99999 99999',
      street: newStreet,
      city: newCity,
      state: newState || 'Maharashtra',
      pincode: newPincode,
      isDefault: addresses.length === 0
    };

    const updated = [...addresses, newAddr];
    try {
      await api.updateProfile({ addresses: updated });
      setAddresses(updated);
      setShowAddAddress(false);
      setNewStreet('');
      setNewCity('');
      setNewPincode('');
      showToast('Address added to your profile', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save address', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Signed out of Twilight Thinks', 'info');
  };

  return (
    <div className="pt-24 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Identity Welcome Header */}
        <div className="p-6 bg-[#0A0A0A] border border-[#1f1f1f] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#151515] border border-[#252525] flex items-center justify-center text-white text-lg font-bold font-mono">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
                  {user?.name}
                </h1>
                {user?.role === 'admin' && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5">
                    SUPER ADMIN
                  </span>
                )}
              </div>
              <div className="text-xs font-mono text-[#888888]">{user?.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#111111] hover:bg-rose-950/20 border border-[#252525] hover:border-rose-900 text-rose-400 text-xs font-mono uppercase transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1f1f1f] mb-8 overflow-x-auto text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-6 border-b-2 font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>MY ORDERS ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('custom-requests')}
            className={`py-3 px-6 border-b-2 font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'custom-requests'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>CUSTOM TATTOOS & QUOTES ({customRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-6 border-b-2 font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'addresses'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>SAVED ADDRESSES</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-6 border-b-2 font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'profile'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>ACCOUNT SETTINGS</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="p-12 text-center text-xs font-mono text-[#666666]">
                LOADING ORDER ARCHIVE...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-16 bg-[#0A0A0A] border border-[#252525] text-center space-y-4">
                <Package className="w-10 h-10 text-[#D4AF37] mx-auto" />
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  NO ORDERS FOUND
                </h3>
                <p className="text-xs text-[#888888]">
                  You have not placed any orders yet. Discover our fresh ink drops!
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-6 py-2.5 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
                >
                  START SHOPPING
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="p-5 sm:p-6 bg-[#0A0A0A] border border-[#252525] hover:border-[#D4AF37]/30 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1a1a1a] gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">
                        ORDER ID
                      </span>
                      <span className="text-sm font-mono font-bold text-white">{order.orderId}</span>
                      <span className="text-xs text-[#666666] ml-2">
                        • {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2.5 py-0.5 uppercase">
                        {order.status}
                      </span>
                      <Link
                        to={`/account/orders/${order.orderId}`}
                        className="px-3.5 py-1.5 bg-[#151515] border border-[#252525] hover:border-[#D4AF37] hover:text-[#D4AF37] text-xs font-mono uppercase text-white flex items-center gap-1 transition-colors"
                      >
                        <span>VIEW DETAILS</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 bg-[#111111] border border-[#252525]"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover bg-black border border-[#252525]"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold uppercase text-white truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] font-mono text-[#666666]">
                            Size: {item.size} • Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs font-mono text-[#A3A3A3]">
                    <span>Payment: {order.paymentMethod}</span>
                    <span className="text-sm font-bold text-[#D4AF37] font-mono">
                      Total: ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: CUSTOM TATTOOS & QUOTES */}
        {activeTab === 'custom-requests' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-mono uppercase font-bold text-white tracking-widest">
                CUSTOM TATTOO INQUIRIES & STUDIO QUOTES
              </h2>
              <Link
                to="/custom"
                className="px-4 py-2 bg-[#8B0000] text-white font-bold uppercase text-xs flex items-center gap-1.5 hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>NEW CUSTOM REQUEST</span>
              </Link>
            </div>

            {loadingCustomRequests ? (
              <div className="p-12 text-center text-xs font-mono text-[#666666]">
                LOADING ATELIER REQUESTS...
              </div>
            ) : customRequests.length === 0 ? (
              <div className="p-16 bg-[#0A0A0A] border border-[#252525] text-center space-y-4">
                <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto" />
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  NO CUSTOM TATTOO REQUESTS
                </h3>
                <p className="text-xs text-[#888888] max-w-md mx-auto">
                  Have a reference image or specific tattoo design idea in mind? Submit your reference to our resident artists and get a personalized studio quote.
                </p>
                <Link
                  to="/custom"
                  className="inline-block px-6 py-2.5 bg-[#8B0000] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
                >
                  CREATE CUSTOM TATTOO
                </Link>
              </div>
            ) : (
              customRequests.map((req) => {
                const canConfirm =
                  (req.status === 'Price Quoted' || req.status === 'Customer Confirmation Pending') &&
                  !req.isCustomerConfirmed &&
                  req.quotedPrice &&
                  req.quotedPrice > 0;

                const getStatusBadge = () => {
                  switch (req.status) {
                    case 'Confirmed':
                      return 'text-emerald-400 bg-emerald-950/40 border-emerald-800';
                    case 'Price Quoted':
                    case 'Customer Confirmation Pending':
                      return 'text-amber-400 bg-amber-950/40 border-amber-800';
                    case 'Reviewing':
                      return 'text-blue-400 bg-blue-950/40 border-blue-800';
                    case 'In Progress':
                      return 'text-purple-400 bg-purple-950/40 border-purple-800';
                    case 'Completed':
                      return 'text-emerald-400 bg-emerald-950/40 border-emerald-800';
                    case 'Rejected':
                    case 'Cancelled':
                      return 'text-rose-400 bg-rose-950/40 border-rose-800';
                    default:
                      return 'text-[#A3A3A3] bg-[#1a1a1a] border-[#333333]';
                  }
                };

                return (
                  <div
                    key={req._id}
                    className="p-5 sm:p-6 bg-[#0A0A0A] border border-[#1f1f1f] hover:border-[#333333] transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1a1a1a] gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-[#666666] uppercase block">
                          REQUEST ID
                        </span>
                        <span className="text-sm font-mono font-bold text-white">{req.requestId}</span>
                        <span className="text-xs text-[#666666] ml-2">
                          • {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-mono font-bold border px-2.5 py-0.5 uppercase ${getStatusBadge()}`}
                        >
                          {req.status === 'Customer Confirmation Pending'
                            ? 'ACTION REQUIRED: QUOTE READY'
                            : req.status}
                        </span>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      <div className="md:col-span-3">
                        <div className="relative aspect-square border border-[#252525] bg-black overflow-hidden group">
                          <img
                            src={req.artworkUrl || 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=400&q=80'}
                            alt="Reference"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {req.artworkUrl && (
                            <a
                              href={req.artworkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono text-white px-2 py-1 border border-white/20 hover:border-white transition-colors"
                            >
                              OPEN IMAGE
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-9 space-y-3 font-mono text-xs">
                        <div>
                          <div className="text-[11px] text-[#666666] uppercase">TATTOO CONCEPT</div>
                          <div className="text-base font-bold text-white uppercase">
                            {req.tattooIdea || req.type || 'Custom Tattoo Stencil'}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 border-y border-[#1a1a1a]">
                          <div>
                            <span className="text-[#666666] block text-[10px]">PLACEMENT</span>
                            <span className="text-white">{req.placement}</span>
                          </div>
                          <div>
                            <span className="text-[#666666] block text-[10px]">SIZE</span>
                            <span className="text-white">{req.size}</span>
                          </div>
                          {req.preferredDate && (
                            <div>
                              <span className="text-[#666666] block text-[10px]">PREFERRED DATE</span>
                              <span className="text-white">{req.preferredDate}</span>
                            </div>
                          )}
                        </div>

                        {req.requiredChanges && (
                          <div className="p-3 bg-[#111111] border border-[#222222] text-[#CCCCCC]">
                            <span className="text-white font-bold block mb-0.5">REQUESTED CHANGES:</span>
                            "{req.requiredChanges}"
                          </div>
                        )}

                        {/* Quoted Price & Confirmation Bar */}
                        <div className="p-4 bg-[#141414] border border-[#292929] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] text-[#888888] uppercase block">
                              STUDIO QUOTED AMOUNT
                            </span>
                            {req.quotedPrice ? (
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold font-mono text-emerald-400">
                                  ₹{req.quotedPrice}
                                </span>
                                {req.isCustomerConfirmed ? (
                                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>CONFIRMED & ACCEPTED BY YOU</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono text-amber-400">
                                    (Pending your acceptance)
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-[#888888] italic">
                                Studio is assessing reference artwork & adjustments...
                              </span>
                            )}
                          </div>

                          {canConfirm && (
                            <button
                              onClick={() => handleConfirmQuote(req._id)}
                              disabled={confirmingId === req._id}
                              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>
                                {confirmingId === req._id
                                  ? 'CONFIRMING...'
                                  : `CONFIRM & ACCEPT QUOTE (₹${req.quotedPrice})`}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-mono uppercase font-bold text-white tracking-widest">
                SAVED DELIVERY ADDRESSES
              </h2>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="px-4 py-2 bg-[#8B0000] text-white font-bold uppercase text-xs flex items-center gap-1.5 hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddAddress ? 'CANCEL' : 'ADD NEW ADDRESS'}</span>
              </button>
            </div>

            {showAddAddress && (
              <form
                onSubmit={handleAddAddress}
                className="p-6 bg-[#0A0A0A] border border-[#252525] space-y-4 max-w-xl"
              >
                <h3 className="text-xs font-mono font-bold uppercase text-[#D4AF37] tracking-wider">
                  NEW ADDRESS FORM
                </h3>
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                    STREET ADDRESS *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="Flat 101, Horizon Apartments"
                    className="w-full bg-[#111111] border border-[#252525] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                      CITY *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full bg-[#111111] border border-[#252525] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                      STATE
                    </label>
                    <input
                      type="text"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full bg-[#111111] border border-[#252525] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#A3A3A3] block mb-1">
                      PINCODE *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      placeholder="400050"
                      className="w-full bg-[#111111] border border-[#252525] px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8B0000] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#A30000] transition-colors shadow-lg shadow-[#8B0000]/20"
                >
                  SAVE ADDRESS
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr, i) => (
                <div
                  key={i}
                  className="p-5 bg-[#0A0A0A] border border-[#1f1f1f] space-y-2 text-xs font-mono"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="text-[9px] bg-[#151515] border border-[#252525] px-2 py-0.5 text-emerald-400">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <div className="text-[#A3A3A3]">{addr.street}</div>
                  <div className="text-[#A3A3A3]">
                    {addr.city}, {addr.state} {addr.pincode}
                  </div>
                  <div className="text-[#666666] pt-1">Phone: {addr.phone}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-xl p-6 bg-[#0A0A0A] border border-[#1f1f1f] space-y-4">
            <h2 className="text-xs font-mono uppercase font-bold text-white tracking-widest pb-3 border-b border-[#1f1f1f]">
              PROFILE DETAILS
            </h2>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-[#111111] border border-[#1f1f1f] flex justify-between">
                <span className="text-[#666666]">NAME</span>
                <span className="text-white font-bold">{user?.name}</span>
              </div>
              <div className="p-3 bg-[#111111] border border-[#1f1f1f] flex justify-between">
                <span className="text-[#666666]">EMAIL</span>
                <span className="text-white font-bold">{user?.email}</span>
              </div>
              <div className="p-3 bg-[#111111] border border-[#1f1f1f] flex justify-between">
                <span className="text-[#666666]">PHONE</span>
                <span className="text-white font-bold">{user?.phone || 'Not provided'}</span>
              </div>
              <div className="p-3 bg-[#111111] border border-[#1f1f1f] flex justify-between">
                <span className="text-[#666666]">MEMBER PRIVILEGE</span>
                <span className="text-emerald-400 uppercase font-bold">
                  {user?.role === 'admin' ? 'Studio Administrator' : 'VIP Tattoo Collector'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
