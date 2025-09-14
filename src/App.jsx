// App.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const App = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Mock API service to simulate backend
  const api = {
    // GET all items
    getItems: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const savedItems = localStorage.getItem('crudItems');
          const items = savedItems ? JSON.parse(savedItems) : [
            { id: 1, name: 'Sample Item 1', description: 'This is a sample item description' },
            { id: 2, name: 'Sample Item 2', description: 'Another sample item for demonstration' }
          ];
          resolve(items);
        }, 500);
      });
    },

    // CREATE new item
    createItem: async (itemData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const savedItems = localStorage.getItem('crudItems');
          const items = savedItems ? JSON.parse(savedItems) : [];
          const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
          const newItem = { id: newId, ...itemData };
          const updatedItems = [...items, newItem];
          localStorage.setItem('crudItems', JSON.stringify(updatedItems));
          resolve(newItem);
        }, 300);
      });
    },

    // UPDATE existing item
    updateItem: async (id, itemData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const savedItems = localStorage.getItem('crudItems');
          let items = savedItems ? JSON.parse(savedItems) : [];
          items = items.map(item => item.id === id ? { ...item, ...itemData } : item);
          localStorage.setItem('crudItems', JSON.stringify(items));
          resolve(items.find(item => item.id === id));
        }, 300);
      });
    },

    // DELETE item
    deleteItem: async (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const savedItems = localStorage.getItem('crudItems');
          let items = savedItems ? JSON.parse(savedItems) : [];
          items = items.filter(item => item.id !== id);
          localStorage.setItem('crudItems', JSON.stringify(items));
          resolve({ success: true });
        }, 300);
      });
    }
  };

  // Load items on component mount
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await api.getItems();
      setItems(data);
      setError('');
    } catch (err) {
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      if (editingId) {
        // Update existing item
        await api.updateItem(editingId, formData);
      } else {
        // Create new item
        await api.createItem(formData);
      }
      
      // Reset form and reload items
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      setError('');
      await loadItems();
    } catch (err) {
      setError('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, description: item.description });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.deleteItem(id);
        await loadItems();
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CRUD Operations Demo</h1>
          <p className="text-gray-600">Create, Read, Update, and Delete items with this simple interface</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Action Bar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {showForm ? (editingId ? 'Edit Item' : 'Add New Item') : 'Items List'}
              </h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              )}
            </div>

            {/* Form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter item name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter item description"
                    rows="3"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Save className="w-4 h-4" />
                    {editingId ? 'Update' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Items List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading items...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="text-red-500 mb-4">⚠️ {error}</div>
                <button
                  onClick={loadItems}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Retry
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">📭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500">Get started by adding your first item</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        <div className="text-xs text-gray-500 mt-2">ID: {item.id}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Total items: {items.length} | CRUD Operations: Create, Read, Update, Delete
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;