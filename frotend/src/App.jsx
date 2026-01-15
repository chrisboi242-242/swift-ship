import { useEffect, useState } from 'react';
import { Truck, Package, MapPin, CheckCircle2, Clock, PlusCircle } from 'lucide-react';

function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [formData, setFormData] = useState({ customer_name: '', destination_address: '' });

  useEffect(() => {
    fetch('http://localhost:5000/api/deliveries')
      .then(res => res.json())
      .then(data => setDeliveries(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tracking = 'SS-' + Math.floor(1000 + Math.random() * 9000);
    const newShipment = { ...formData, tracking_number: tracking, status: 'Pending' };

    const response = await fetch('http://localhost:5000/api/deliveries', {
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      {/* 1. Header with Stats */}
      <nav className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div className="flex items-center gap-2 font-black text-3xl text-blue-600 tracking-tighter">
          <Truck size={32} strokeWidth={3} /> SwiftShip
        </div>
        <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-blue-200">
          {deliveries.length} Shipments Total
        </div>
      </nav>

      <div className="max-w-6xl mx-auto">
        {/* 2. Enhanced Form Section */}
        <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-12">
          <div className="flex items-center gap-2 mb-6">
             <PlusCircle className="text-blue-500" size={20} />
             <h2 className="font-bold text-xl text-slate-800">New Shipment</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input 
              className="border-0 bg-slate-100 p-4 rounded-2xl flex-1 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Customer Name"
              value={formData.customer_name}
              onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
              required
            />
            <input 
              className="border-0 bg-slate-100 p-4 rounded-2xl flex-1 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Destination Address"
              value={formData.destination_address}
              onChange={(e) => setFormData({...formData, destination_address: e.target.value})}
              required
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all transform active:scale-95">
              Create Label
            </button>
          </form>
        </section>

        {/* 3. The Grid with Dynamic Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deliveries.length > 0 ? (
            deliveries.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-md border border-slate-50 hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Package size={24} />
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                    {item.tracking_number}
                  </span>
                </div>
                
                <h3 className="font-bold text-xl mb-1 text-slate-800">{item.customer_name}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                  <MapPin size={14} />
                  <p>{item.destination_address}</p>
                </div>

                {/* Dynamic Badge styling */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold ${
                  item.status === 'Delivered' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-amber-50 text-amber-600'
                }`}>
                  {item.status === 'Delivered' ? <CheckCircle2 size={16}/> : <Clock size={16}/>}
                  {item.status}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
               <Package className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="text-slate-400 font-medium text-lg">Your cargo hold is empty.</p>
               <p className="text-slate-300 text-sm">Add a shipment above to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;