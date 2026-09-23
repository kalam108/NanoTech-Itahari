import React, { useState } from 'react';
import { useRBAC } from '../../../context/RBACContext';
import { useApp } from '../../../context/AppContext';
import { Search, Plus, Edit2, Trash2, Check, X, ShieldAlert, Cpu, Upload, Image as ImageIcon, Sliders } from 'lucide-react';

export const AdminProductsView: React.FC = () => {
  const { hasPermission } = useRBAC();
  const { products, updateProduct, deleteProduct, addProduct, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('ASUS');
  const [newCategory, setNewCategory] = useState('Graphics Cards');
  const [newPrice, setNewPrice] = useState(45000);
  const [newStock, setNewStock] = useState(10);
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80');
  const [imageUploadType, setImageUploadType] = useState<'url' | 'file'>('url');

  // Edit Product Form State
  const [editTitle, setEditTitle] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editImage, setEditImage] = useState('');

  const canEdit = hasPermission('products.edit');
  const canDelete = hasPermission('products.delete');
  const canCreate = hasPermission('products.create');

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('error', 'File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        if (isEditing) {
          setEditImage(base64Data);
        } else {
          setNewImage(base64Data);
        }
        addToast('success', 'Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast('error', 'Please provide a product title');
      return;
    }

    addProduct({
      title: newTitle.trim(),
      brand: newBrand,
      category: newCategory,
      price: Number(newPrice),
      stock: Number(newStock),
      condition: 'New',
      status: 'published',
      images: [newImage || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
      description: 'Brand new high performance computer hardware with official Nepal warranty.',
    });

    addToast('success', `Product "${newTitle}" created successfully!`);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewPrice(45000);
    setNewStock(10);
    setNewImage('https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80');
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setEditTitle(prod.title);
    setEditBrand(prod.brand || 'ASUS');
    setEditCategory(prod.category || 'Graphics Cards');
    setEditPrice(prod.price || 0);
    setEditStock(prod.stock || 10);
    setEditImage(prod.images?.[0] || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      title: editTitle.trim(),
      brand: editBrand,
      category: editCategory,
      price: Number(editPrice),
      stock: Number(editStock),
      images: [editImage],
    });

    addToast('success', `Product "${editTitle}" updated successfully!`);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products & Hardware Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Add, edit, delete catalog hardware, manage stock, and upload product photos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={!canCreate}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              canCreate
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Hardware
          </button>
        </div>
      </div>

      {!canEdit && (
        <div className="bg-amber-950/50 border border-amber-800 text-amber-300 p-3 rounded-xl text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Notice: Your admin account has View-Only access to products. Modifications require 'products.edit' permission from Kalam (Superadmin).</span>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="p-4">Component / Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price (NPR)</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No hardware products found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 flex items-center gap-3 max-w-xs">
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=80&q=80'}
                        alt={prod.title}
                        className="w-11 h-11 object-cover rounded-lg bg-slate-950 p-0.5 border border-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden">
                        <span className="text-[10px] text-purple-400 font-bold uppercase">{prod.brand}</span>
                        <div className="font-semibold text-white truncate">{prod.title}</div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-300">
                      <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {prod.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-white">NPR {prod.price.toLocaleString()}</span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          (prod.stock || 10) < 5
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        }`}
                      >
                        {prod.stock || 10} in stock
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Active
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          disabled={!canEdit}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            canEdit
                              ? 'bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border-purple-800/50'
                              : 'text-slate-600 border-transparent cursor-not-allowed'
                          }`}
                          title="Edit Product & Image"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete product "${prod.title}"?`)) {
                              deleteProduct(prod.id);
                              addToast('success', `Product "${prod.title}" deleted.`);
                            }
                          }}
                          disabled={!canDelete}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            canDelete
                              ? 'bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border-rose-800/50'
                              : 'text-slate-600 border-transparent cursor-not-allowed'
                          }`}
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Hardware Modal with Image Upload */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                Add New Hardware Product
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASUS ROG Strix GeForce RTX 5080 16GB GDDR7"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Graphics Cards">Graphics Cards</option>
                    <option value="Processors">Processors</option>
                    <option value="Motherboards">Motherboards</option>
                    <option value="RAM">RAM</option>
                    <option value="Storage">Storage</option>
                    <option value="Power Supplies">Power Supplies</option>
                    <option value="Cooling">Cooling</option>
                    <option value="Cabinets">Cabinets</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Monitors">Monitors</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Price (NPR)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Image Upload / URL Section */}
              <div className="border border-slate-800 bg-slate-950/60 p-3 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                    Product Image
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageUploadType('url')}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        imageUploadType === 'url' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadType('file')}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        imageUploadType === 'file' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {imageUploadType === 'file' ? (
                  <div>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-4 cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition">
                      <Upload className="w-6 h-6 text-purple-400 mb-1" />
                      <span className="text-slate-300 font-semibold">Click to select photo</span>
                      <span className="text-[10px] text-slate-500">PNG, JPG, WEBP up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, false)}
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-[11px] focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                {/* Preview Thumbnail */}
                {newImage && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={newImage}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-700 bg-slate-900 shrink-0"
                    />
                    <div className="text-[10px] text-slate-400 truncate">
                      Photo Preview ready for storefront display
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-400" />
                Edit Hardware Component
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Graphics Cards">Graphics Cards</option>
                    <option value="Processors">Processors</option>
                    <option value="Motherboards">Motherboards</option>
                    <option value="RAM">RAM</option>
                    <option value="Storage">Storage</option>
                    <option value="Power Supplies">Power Supplies</option>
                    <option value="Cooling">Cooling</option>
                    <option value="Cabinets">Cabinets</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Monitors">Monitors</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Price (NPR)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Edit Image Section */}
              <div className="border border-slate-800 bg-slate-950/60 p-3 rounded-xl space-y-2.5">
                <label className="text-slate-300 font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                    Upload / Change Image
                  </span>
                  <label className="text-[10px] text-purple-400 hover:text-purple-300 cursor-pointer flex items-center gap-1 font-semibold">
                    <Upload className="w-3 h-3" />
                    Browse file
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, true)}
                    />
                  </label>
                </label>

                <input
                  type="url"
                  placeholder="Or enter image URL..."
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-[11px] focus:outline-none focus:border-purple-500"
                />

                {editImage && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={editImage}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-700 bg-slate-900 shrink-0"
                    />
                    <div className="text-[10px] text-slate-400 truncate">
                      Current component photo
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
