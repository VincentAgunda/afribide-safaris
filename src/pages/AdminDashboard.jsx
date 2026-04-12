// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  LayoutDashboard,
  Inbox,
  Loader2,
  Menu,
  X,
  Clock,
} from "lucide-react";

// Pre‑existing images
const IMAGE_OPTIONS = [
  { label: "Parachute over Mara", value: "/parachute.jpeg" },
  { label: "Zebra Herd", value: "/zebra.jpeg" },
  { label: "Geese at Lake", value: "/goose.jpeg" },
  { label: "Helicopter", value: "/helicopter.jpeg" },
  { label: "Chimpanzee", value: "/chimpanzee.jpeg" },
  { label: "Firewood", value: "/firewood.jpeg" },
  { label: "Goose on water", value: "/goose2.jpeg" },
  { label: "Zebra outside", value: "/zebra-outside.jpeg" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("packages");
  const [packages, setPackages] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    image: IMAGE_OPTIONS[0].value,
    description: "",
    itinerary: [{ day: "", title: "", desc: "" }],
    pricing: [{ title: "", details: "" }],
    included: [""],
    excluded: [""],
  });

  // Real‑time listener for packages
  useEffect(() => {
    const q = collection(db, "safaris");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPackages(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching packages:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real‑time listener for queries
  useEffect(() => {
    const q = collection(db, "queries");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQueries(data);
      },
      (error) => console.error("Error fetching queries:", error)
    );
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Dynamic array handlers
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
    try {
      if (isEditing) {
        await updateDoc(doc(db, "safaris", currentId), formData);
      } else {
        await addDoc(collection(db, "safaris"), formData);
      }
      setFormData({
        title: "",
        category: "",
        duration: "",
        image: IMAGE_OPTIONS[0].value,
        description: "",
        itinerary: [{ day: "", title: "", desc: "" }],
        pricing: [{ title: "", details: "" }],
        included: [""],
        excluded: [""],
      });
      setIsEditing(false);
      setCurrentId(null);
    } catch (error) {
      console.error("Error saving package:", error);
      alert("Failed to save package. Check console for details.");
    }
  };

  const handleEdit = (pkg) => {
    setFormData({
      ...pkg,
      duration: pkg.duration || "",
      itinerary: pkg.itinerary?.length ? pkg.itinerary : [{ day: "", title: "", desc: "" }],
      pricing: pkg.pricing?.length ? pkg.pricing : [{ title: "", details: "" }],
      included: pkg.included?.length ? pkg.included : [""],
      excluded: pkg.excluded?.length ? pkg.excluded : [""],
    });
    setCurrentId(pkg.id);
    setIsEditing(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    setDeleteLoading(id);
    try {
      await deleteDoc(doc(db, "safaris", id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete. Check console for details.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: "",
      category: "",
      duration: "",
      image: IMAGE_OPTIONS[0].value,
      description: "",
      itinerary: [{ day: "", title: "", desc: "" }],
      pricing: [{ title: "", details: "" }],
      included: [""],
      excluded: [""],
    });
  };

  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  // Sidebar content (reused in both desktop and mobile)
  const SidebarContent = () => (
    <>
      <h2 className="text-2xl font-bold mb-10 text-white tracking-tight">
        Afribide Admin
      </h2>
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => {
            setActiveTab("packages");
            setMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === "packages"
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-800 hover:text-white"
          }`}
        >
          <LayoutDashboard size={20} /> Manage Packages
        </button>
        <button
          onClick={() => {
            setActiveTab("queries");
            setMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === "queries"
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-800 hover:text-white"
          }`}
        >
          <Inbox size={20} /> Bookings & Quotes
        </button>
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 hover:text-red-300 rounded-lg transition-colors mt-auto font-semibold"
      >
        <LogOut size={20} /> Logout
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased pt-20 md:pt-24">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-blue-600 text-white p-6 flex-col fixed top-20 md:top-24 bottom-0 left-0 overflow-y-auto z-40">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-20 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-30 flex items-center justify-between">
        <h2 className="text-lg font-bold text-blue-600">Afribide Admin</h2>
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg bg-blue-50 text-blue-600"
        >
          {mobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-20 left-0 bottom-0 w-64 bg-blue-600 text-white p-6 flex-col z-50 transform transition-transform duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {activeTab === "packages" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                {isEditing ? "Edit Package" : "Add New Package"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Duration
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="e.g. 9 Days / 8 Nights"
                        className="w-full pl-9 pr-2 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Assign Image
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  >
                    {IMAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Itinerary */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-semibold text-gray-800">Itinerary</label>
                    <button
                      type="button"
                      onClick={() => addArrayItem("itinerary", { day: "", title: "", desc: "" })}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                    >
                      Add Day
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.itinerary.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2 items-start">
                        <input
                          type="text"
                          placeholder="Day"
                          className="w-full sm:w-1/4 p-2 text-sm border rounded-lg"
                          value={item.day}
                          onChange={(e) => handleArrayChange("itinerary", idx, "day", e.target.value)}
                        />
                        <div className="w-full sm:w-3/4 space-y-2">
                          <input
                            type="text"
                            placeholder="Title"
                            className="w-full p-2 text-sm border rounded-lg"
                            value={item.title}
                            onChange={(e) => handleArrayChange("itinerary", idx, "title", e.target.value)}
                          />
                          <textarea
                            placeholder="Description"
                            rows="2"
                            className="w-full p-2 text-sm border rounded-lg"
                            value={item.desc}
                            onChange={(e) => handleArrayChange("itinerary", idx, "desc", e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeArrayItem("itinerary", idx)}
                          className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-semibold text-gray-800">Pricing</label>
                    <button
                      type="button"
                      onClick={() => addArrayItem("pricing", { title: "", details: "" })}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                    >
                      Add Pricing
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.pricing.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Title"
                          className="w-full sm:w-1/3 p-2 text-sm border rounded-lg"
                          value={item.title}
                          onChange={(e) => handleArrayChange("pricing", idx, "title", e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Details"
                          className="w-full sm:w-2/3 p-2 text-sm border rounded-lg"
                          value={item.details}
                          onChange={(e) => handleArrayChange("pricing", idx, "details", e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("pricing", idx)}
                          className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Example: "2 PAX" / "$4135 (Single) / $3500 (Double)"
                  </p>
                </div>

                {/* Included / Excluded */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <label className="font-semibold text-gray-800">Included</label>
                      <button
                        type="button"
                        onClick={() => addArrayItem("included", "")}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                      >
                        Add Item
                      </button>
                    </div>
                    {formData.included.map((item, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          className="w-full p-2 text-sm border rounded-lg"
                          value={item}
                          onChange={(e) => handleArrayChange("included", idx, null, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("included", idx)}
                          className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <label className="font-semibold text-gray-800">Excluded</label>
                      <button
                        type="button"
                        onClick={() => addArrayItem("excluded", "")}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                      >
                        Add Item
                      </button>
                    </div>
                    {formData.excluded.map((item, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          className="w-full p-2 text-sm border rounded-lg"
                          value={item}
                          onChange={(e) => handleArrayChange("excluded", idx, null, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("excluded", idx)}
                          className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                  >
                    {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                    {isEditing ? "Update Package" : "Save Package"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Section */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 overflow-y-auto max-h-[calc(100vh-12rem)]">
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                Existing Packages
              </h3>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                </div>
              ) : (
                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{pkg.title}</h4>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium text-blue-600 uppercase">
                              {pkg.category}
                            </span>
                            {pkg.duration && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-500">{pkg.duration}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 sm:mt-0">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(pkg.id, e)}
                          disabled={deleteLoading === pkg.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          {deleteLoading === pkg.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                  {packages.length === 0 && !loading && (
                    <p className="text-gray-500 text-center py-8">
                      No packages found. Create one!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "queries" && (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Recent Bookings & Quotes
            </h3>
            <div className="min-w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm">
                    <th className="p-3 font-semibold border-b">Name</th>
                    <th className="p-3 font-semibold border-b">Email</th>
                    <th className="p-3 font-semibold border-b">Package</th>
                    <th className="p-3 font-semibold border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {queries.map((q) => (
                    <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-sm font-medium">{q.name}</td>
                      <td className="p-3 text-sm text-gray-600">{q.email}</td>
                      <td className="p-3 text-sm text-blue-600 font-medium">
                        {q.packageTitle}
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {q.createdAt?.toDate
                          ? new Date(q.createdAt.toDate()).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                  {queries.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        No booking requests yet.
                      </td>
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