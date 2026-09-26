import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Check, X, Sparkles, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { CustomTattooRequest } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCustomTattoosPage: React.FC = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<CustomTattooRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Detail Modal
  const [selectedRequest, setSelectedRequest] = useState<CustomTattooRequest | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [quotedPrice, setQuotedPrice] = useState<number | string>(0);
  const [internalNotes, setInternalNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchCustomTattoos = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getCustomTattoos();
      if (res.success) {
        setRequests(res.customTattoos);
      }
    } catch (err) {
      console.error('[AdminCustomTattoos] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomTattoos();
  }, []);

  const openModal = (req: CustomTattooRequest) => {
    setSelectedRequest(req);
    setNewStatus(req.status);
    setQuotedPrice(req.quotedPrice || req.price || 0);
    setInternalNotes(req.internalNotes || '');
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;
    setUpdating(true);
    try {
      const res = await api.admin.updateCustomTattoo(selectedRequest.requestId, {
        status: newStatus,
        internalNotes,
        quotedPrice: Number(quotedPrice)
      });
      if (res.success && res.customTattoo) {
        showToast(`Request ${selectedRequest.requestId} updated to ${newStatus}`, 'success');
        setSelectedRequest(res.customTattoo);
        setRequests((prev) =>
          prev.map((r) =>
            r.requestId === selectedRequest.requestId ? res.customTattoo : r
          )
        );
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating custom request', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const statuses = [
    'Pending',
    'Reviewing',
    'Price Quoted',
    'Customer Confirmation Pending',
    'Confirmed',
    'In Progress',
    'Designing',
    'Awaiting Approval',
    'Approved',
    'Production',
    'Completed',
    'Rejected',
    'Cancelled'
  ];

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'All' && r.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            BESPOKE ATELIER PIPELINE
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest font-mono text-white">
            CUSTOM TATTOO REQUESTS<span className="text-[#D4AF37]">.</span>
          </h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#1f1f1f]">
        <span className="text-xs font-mono text-[#666666]">
          Total Requests: <span className="text-[#D4AF37] font-bold">{filteredRequests.length}</span>
        </span>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#666666]">FILTER STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111111] border border-[#252525] text-white px-3 py-1.5 focus:border-[#D4AF37] focus:outline-none transition-colors"
          >
            <option value="All">All Pipeline Stages</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0A0A0A] border border-[#1f1f1f] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-[#666666] border-b border-[#1f1f1f] bg-[#0E0E0E]">
              <th className="p-4 font-normal">REQUEST ID</th>
              <th className="p-4 font-normal">CUSTOMER</th>
              <th className="p-4 font-normal">TYPE</th>
              <th className="p-4 font-normal">PREVIEW / ART</th>
              <th className="p-4 font-normal">PLACEMENT</th>
              <th className="p-4 font-normal">SIZE</th>
              <th className="p-4 font-normal">PRICE</th>
              <th className="p-4 font-normal">STATUS</th>
              <th className="p-4 font-normal text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {filteredRequests.map((req) => (
              <tr key={req._id} className="hover:bg-[#111111]/60 transition-colors">
                <td className="p-4 font-bold text-white">{req.requestId}</td>
                <td className="p-4 text-[#A3A3A3]">
                  <div>{req.customer?.name}</div>
                  <div className="text-[10px] text-[#666666]">{req.customer?.email}</div>
                </td>
                <td className="p-4 text-white font-bold">{req.type}</td>
                <td className="p-4">
                  {req.artworkUrl ? (
                    <img
                      src={req.artworkUrl}
                      alt="Artwork"
                      className="w-10 h-10 object-cover bg-black border border-[#252525]"
                    />
                  ) : (
                    <span className="text-[#666666] italic">Text Only</span>
                  )}
                </td>
                <td className="p-4 text-[#A3A3A3]">{req.placement}</td>
                <td className="p-4 text-[#A3A3A3]">{req.size}</td>
                <td className="p-4 text-[#D4AF37] font-bold">₹{req.price}</td>
                <td className="p-4">
                  <span className="text-[10px] px-2 py-0.5 border border-[#D4AF37]/30 bg-[#151515] text-[#D4AF37]">
                    {req.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => openModal(req)}
                    className="px-3 py-1.5 bg-[#151515] border border-[#252525] hover:border-[#D4AF37] hover:text-[#D4AF37] text-white transition-colors"
                  >
                    INSPECT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inspect & Update Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#0A0A0A] border border-[#D4AF37]/30 p-6 sm:p-8 space-y-6 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-[#252525]">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">
                  BESPOKE STUDIO DOSSIER
                </span>
                <h2 className="text-base font-mono font-bold uppercase text-white">
                  {selectedRequest.requestId} — {selectedRequest.type}
                </h2>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-[#666666] hover:text-[#D4AF37]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Artwork & Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-[#A3A3A3] block">
                  UPLOADED ASSET / REFERENCE
                </span>
                {selectedRequest.artworkUrl ? (
                  <div className="aspect-square bg-black border border-[#252525] p-2 flex items-center justify-center">
                    <img
                      src={selectedRequest.artworkUrl}
                      alt="Artwork"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-[#111111] border border-[#252525] flex items-center justify-center text-xs text-[#666666] font-mono">
                    NO ARTWORK FILE ATTACHED
                  </div>
                )}
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#111111] border border-[#1f1f1f]">
                  <span className="text-[#666666] block">CUSTOMER</span>
                  <div className="text-white font-bold">{selectedRequest.customer?.name}</div>
                  <div className="text-[#A3A3A3]">{selectedRequest.customer?.email}</div>
                  <div className="text-[#666666]">{selectedRequest.customer?.phone}</div>
                </div>

                {(selectedRequest.tattooIdea || selectedRequest.customText) && (
                  <div className="p-3 bg-[#111111] border border-[#1f1f1f]">
                    <span className="text-[#666666] block">TATTOO IDEA / CONCEPT</span>
                    <div className="text-white font-bold text-sm">
                      {selectedRequest.tattooIdea || selectedRequest.customText}
                    </div>
                    {selectedRequest.style && (
                      <div className="text-[10px] text-[#D4AF37]/80 mt-0.5">Style: {selectedRequest.style}</div>
                    )}
                  </div>
                )}

                {(selectedRequest.requiredChanges || selectedRequest.description) && (
                  <div className="p-3 bg-[#111111] border border-[#1f1f1f]">
                    <span className="text-[#666666] block">DESIRED CHANGES FROM REFERENCE</span>
                    <div className="text-white leading-relaxed text-xs mt-1">
                      {selectedRequest.requiredChanges || selectedRequest.description}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-[#111111] border border-[#1f1f1f] flex justify-between">
                  <div>
                    <span className="text-[#666666] block">PLACEMENT</span>
                    <span className="text-white font-bold">{selectedRequest.placement}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">SIZE</span>
                    <span className="text-white font-bold">{selectedRequest.size}</span>
                  </div>
                  {selectedRequest.budget && (
                    <div>
                      <span className="text-[#666666] block">BUDGET</span>
                      <span className="text-[#D4AF37] font-bold">{selectedRequest.budget}</span>
                    </div>
                  )}
                </div>

                {selectedRequest.preferredDate && (
                  <div className="p-3 bg-[#111111] border border-[#1f1f1f]">
                    <span className="text-[#666666] block">PREFERRED APPOINTMENT DATE</span>
                    <div className="text-white font-bold">{selectedRequest.preferredDate}</div>
                  </div>
                )}

                {selectedRequest.notes && (
                  <div className="p-3 bg-[#111111] border border-[#1f1f1f]">
                    <span className="text-[#666666] block">CLIENT NOTES</span>
                    <div className="text-[#A3A3A3] italic">{selectedRequest.notes}</div>
                  </div>
                )}

                {selectedRequest.isCustomerConfirmed && (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-800 text-emerald-400 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>CUSTOMER CONFIRMED & ACCEPTED QUOTE</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Quoted Price & Internal Notes Updates */}
            <div className="p-4 bg-[#111111] border border-[#252525] space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A3A3A3] uppercase block mb-1">STUDIO WORKFLOW STATUS</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#252525] text-white px-3 py-2 focus:border-[#D4AF37] focus:outline-none transition-colors"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#A3A3A3] uppercase block mb-1">
                    STUDIO QUOTED AMOUNT (₹)
                  </label>
                  <input
                    type="number"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    placeholder="Enter quoted price in ₹"
                    className="w-full bg-[#0A0A0A] border border-[#252525] text-white px-3 py-2 focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                  <span className="text-[10px] text-[#D4AF37]/80 mt-0.5 block">
                    Setting amount updates customer dashboard quote
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[#A3A3A3] uppercase block mb-1">INTERNAL ARTIST NOTES</label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Notes for lead printer, stencil adjustments, client proof feedback..."
                  className="w-full bg-[#0A0A0A] border border-[#252525] text-white p-2.5 focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-[#252525] text-[#A3A3A3] hover:text-white uppercase transition-colors"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="px-6 py-2 bg-[#8B0000] text-white font-bold uppercase hover:bg-[#A30000] transition-colors shadow-sm"
                >
                  {updating ? 'SAVING...' : 'UPDATE DOSSIER'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
