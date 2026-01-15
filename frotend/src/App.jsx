import { useEffect, useState } from 'react';
import { Truck, Package, MapPin, CheckCircle2, Clock, PlusCircle, Trash2 } from 'lucide-react';

function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [formData, setFormData] = useState({ customer_name: '', destination_address: '' });
  
  // Use Environment Variable for Vercel, fallback to localhost for development
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 1. LOAD DATA
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/deliveries`)
      .then(res => res.json())
      .then(data => setDeliveries(data))
      .catch(err => console.error("Fetch error:", err));
  }, [API_BASE_URL]);

  // 2. CREATE DATA (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tracking = 'SS-' + Math.floor(1000 + Math.random() * 9000);
    const newShipment = { ...formData, tracking_number: tracking, status: 'Pending' };

    const response = await fetch(`${API_BASE_URL}/api/deliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newShipment)
    });

    if (response.ok) {
      const saved = await response.json();
      setDeliveries([saved, ...deliveries]);
      setFormData({ customer_name: '', destination_address: '' });
    }
  };

  // 3. UPDATE STATUS (PATCH)
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Delivered' : 'Pending';
    const response = await fetch(`${API_BASE_URL}/api/deliveries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    if (response.ok) {
      setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
    }
  };

  // 4. DELETE DATA (DELETE)
  const deleteDelivery = async (id) => {
    if (!window.confirm("Delete this shipment?")) return;
    
    const response = await fetch(`${API_BASE_URL}/api/deliveries/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setDeliveries(deliveries.filter(d => d.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <nav className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div className="flex items-center gap-2 font-black text-3xl text-blue-600 tracking-tighter italic">
          <Truck size={32} strokeWidth={3} /> SWIFTSHIP
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-sm font-bold shadow-sm">
          <span className="text-blue-600">{deliveries.length}</span> Active Shipments
        </div>
      </nav>

      <div className="max-w-6xl mx-auto">
        {/* CREATE FORM */}
        <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-white mb-12">
          <div className="flex items-center gap-2 mb-6">
             <PlusCircle className="text-blue-500" size={20} />
             <h2 className="font-bold text-xl text-slate-800">Register New Cargo</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col md:row gap-4">
            <input 
              className="bg-slate-50 p-4 rounded-2xl flex-1 focus:ring-2 focus:ring-blue-500 transition-all outline-none border border-slate-100"
              placeholder="Customer Name"
              value={formData.customer_name}
              onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
              required
            />
            <input 
              className="bg-slate-50 p-4 rounded-2xl flex-1 focus:ring-2 focus:ring-blue-500 transition-all outline-none border border-slate-100"
              placeholder="Delivery Address"
              value={formData.destination_address}
              onChange={(e) => setFormData({...formData, destination_address: e.target.value})}
              required
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200">
              Dispatch
            </button>
          </form>
        </section>

        {/* SHIPMENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveries.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className={`p-3 rounded-2xl ${item.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Package size={22} />
                  </div>
                  <button onClick={() => deleteDelivery(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <h3 className="font-bold text-lg mb-1">{item.customer_name}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 italic">
                  <MapPin size={14} /> {item.destination_address}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => toggleStatus(item.id, item.status)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    item.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {item.status === 'Delivered' ? <CheckCircle2 size={14}/> : <Clock size={14}/>}
                  {item.status}
                </button>
                <span className="text-[10px] font-mono text-slate-300">{item.tracking_number}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;