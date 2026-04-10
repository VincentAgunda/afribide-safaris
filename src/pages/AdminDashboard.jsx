import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Plus, Edit2, Trash2, LogOut, LayoutDashboard, Inbox } from "lucide-react";

// Pre-existing images to choose from (since images remain constant)
const IMAGE_OPTIONS = [
  { label: "Parachute over Mara", value: "/parachute.jpeg" },
  { label: "Zebra Herd", value: "/zebra.jpeg" },
  { label: "Geese at Lake", value: "/goose.jpeg" }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("packages");
  const [packages, setPackages] = useState([]);
  const [queries, setQueries] = useState([]);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: "", category: "", image: IMAGE_OPTIONS[0].value, description: "",
    itinerary: [{ day: "", title: "", desc: "" }],
    pricing: [{ title: "", details: "" }],
    included: [""], excluded: [""]
  });

  const fetchPackages = async () => {
    const querySnapshot = await getDocs(collection(db, "safaris"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPackages(data);
  };

  const fetchQueries = async () => {
    const querySnapshot = await getDocs(collection(db, "queries"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setQueries(data);
  };

  useEffect(() => {
    fetchPackages();
    fetchQueries();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Dynamic Form Handlers
  const handleArrayChange = (field, index, key, value) => {
    const updated = [...formData[field]];
    if (typeof updated[index] === "object") {
      updated[index][key] = value;
    } else {
      updated[index] = value;
    }
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayItem = (field, template) => {
    setFormData({ ...formData, [field]: [...formData[field], template] });
  };

  const removeArrayItem = (field, index) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateDoc(doc(db, "safaris", currentId), formData);
    } else {
      await addDoc(collection(db, "safaris"), formData);
    }
    setFormData({
      title: "", category: "", image: IMAGE_OPTIONS[0].value, description: "",
      itinerary: [{ day: "", title: "", desc: "" }],
      pricing: [{ title: "", details: "" }], included: [""], excluded: [""]
    });
    setIsEditing(false);
    fetchPackages();
  };

  const handleEdit = (pkg) => {
    setFormData(pkg);
    setCurrentId(pkg.id);
    setIsEditing(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent triggering any parent card click events
    if (window.confirm("Are you sure you want to delete this package?")) {
      await deleteDoc(doc(db, "safaris", id));
      fetchPackages();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-sans antialiased">
      {/* Sidebar */}
      <div className="w-64 bg-[#004700] text-[#F5F5F7] p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-10 text-white tracking-tight">Afribide Admin</h2>
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab("packages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-semibold transition-colors ${activeTab === "packages" ? "bg-[#eab308] text-[#004700]" : "hover:bg-[#003300] hover:text-[#eab308]"}`}
          >
            <LayoutDashboard size={20} /> Manage Packages
          </button>
          <button 
            onClick={() => setActiveTab("queries")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-semibold transition-colors ${activeTab === "queries" ? "bg-[#eab308] text-[#004700]" : "hover:bg-[#003300] hover:text-[#eab308]"}`}
          >
            <Inbox size={20} /> Bookings & Quotes
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 hover:bg-[#003300] hover:text-red-400 rounded-sm transition-colors mt-auto font-semibold">
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto max-h-screen">
        {activeTab === "packages" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Form Section */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-[#1d1d1f] mb-6 border-b pb-2">
                {isEditing ? "Edit Package" : "Add New Package"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                    <input type="text" required className="w-full p-2 border border-gray-300 rounded-sm focus:border-[#004700] focus:ring-0 outline-none" 
                           value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category (e.g. Kenya • 9 Days)</label>
                    <input type="text" required className="w-full p-2 border border-gray-300 rounded-sm focus:border-[#004700] focus:ring-0 outline-none" 
                           value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Assign Image</label>
                  <select className="w-full p-2 border border-gray-300 rounded-sm outline-none" 
                          value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}>
                    {IMAGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea required rows="3" className="w-full p-2 border border-gray-300 rounded-sm outline-none focus:border-[#004700]" 
                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                {/* Itinerary */}
                <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-bold text-gray-800">Itinerary</label>
                    <button type="button" onClick={() => addArrayItem("itinerary", { day: "", title: "", desc: "" })} className="text-xs bg-[#004700] text-white px-2 py-1 rounded-sm">Add Day</button>
                  </div>
                  {formData.itinerary.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-start">
                      <input type="text" placeholder="Day (e.g. Day 1)" className="w-1/4 p-2 text-sm border rounded-sm" value={item.day} onChange={e => handleArrayChange("itinerary", idx, "day", e.target.value)} />
                      <div className="w-3/4 space-y-2">
                        <input type="text" placeholder="Title" className="w-full p-2 text-sm border rounded-sm" value={item.title} onChange={e => handleArrayChange("itinerary", idx, "title", e.target.value)} />
                        <textarea placeholder="Description" rows="2" className="w-full p-2 text-sm border rounded-sm" value={item.desc} onChange={e => handleArrayChange("itinerary", idx, "desc", e.target.value)} />
                      </div>
                      <button type="button" onClick={() => removeArrayItem("itinerary", idx)} className="text-red-500 p-2 hover:bg-red-50 rounded-sm"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-bold text-gray-800">Pricing Packages</label>
                    <button type="button" onClick={() => addArrayItem("pricing", { title: "", details: "" })} className="text-xs bg-[#004700] text-white px-2 py-1 rounded-sm">Add Pricing</button>
                  </div>
                  {formData.pricing.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input type="text" placeholder="Title (e.g. Jan-June)" className="w-1/3 p-2 text-sm border rounded-sm" value={item.title} onChange={e => handleArrayChange("pricing", idx, "title", e.target.value)} />
                      <input type="text" placeholder="Details (e.g. Ksh 3000 Double)" className="w-2/3 p-2 text-sm border rounded-sm" value={item.details} onChange={e => handleArrayChange("pricing", idx, "details", e.target.value)} />
                      <button type="button" onClick={() => removeArrayItem("pricing", idx)} className="text-red-500 p-2 hover:bg-red-50 rounded-sm"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-[#004700] text-white font-bold py-3 rounded-sm hover:bg-[#003300] transition-colors flex justify-center items-center gap-2">
                    {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                    {isEditing ? "Update Package" : "Save Package"}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={() => { setIsEditing(false); setFormData({...formData, title: ""}); }} className="px-6 bg-gray-300 text-gray-800 font-bold rounded-sm hover:bg-gray-400">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Section */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 overflow-y-auto">
              <h3 className="text-xl font-bold text-[#1d1d1f] mb-6 border-b pb-2">Existing Packages</h3>
              <div className="space-y-4">
                {packages.map(pkg => (
                  <div key={pkg.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-sm hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={pkg.image} alt={pkg.title} className="w-16 h-16 object-cover rounded-sm" />
                      <div>
                        <h4 className="font-bold text-[#1d1d1f]">{pkg.title}</h4>
                        <span className="text-xs font-semibold text-[#004700] uppercase">{pkg.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(pkg)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm"><Edit2 size={18} /></button>
                      <button onClick={(e) => handleDelete(pkg.id, e)} className="p-2 text-red-600 hover:bg-red-50 rounded-sm"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
                {packages.length === 0 && <p className="text-gray-500 text-center py-8">No packages found.</p>}
              </div>
            </div>

          </div>
        )}

        {activeTab === "queries" && (
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-[#1d1d1f] mb-6 border-b pb-2">Recent Bookings & Quotes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-800 text-sm">
                    <th className="p-4 font-bold border-b border-gray-200">Name</th>
                    <th className="p-4 font-bold border-b border-gray-200">Email</th>
                    <th className="p-4 font-bold border-b border-gray-200">Interested Package</th>
                    <th className="p-4 font-bold border-b border-gray-200">Date Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {queries.map(q => (
                    <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 text-sm font-medium">{q.name}</td>
                      <td className="p-4 text-sm text-gray-600">{q.email}</td>
                      <td className="p-4 text-sm text-[#004700] font-semibold">{q.packageTitle}</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(q.createdAt?.toDate()).toLocaleDateString() || "N/A"}</td>
                    </tr>
                  ))}
                  {queries.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">No booking requests yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;