import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchWithAuth } from "@/lib/api";
import { X, ChevronDown, Minus, Plus, Bell, Save } from "lucide-react";

export default function ManageItem() {
  const { id } = useParams();
  const isEditing = !!id;
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        try {
          const data = await fetchWithAuth(`/inventory/${id}`);
          setItem(data);
          setQuantity(data.quantity || 0);
        } catch (error) {
          console.error("Failed to load item:", error);
          navigate("/inventory");
        } finally {
          setLoading(false);
        }
      };
      
      loadItem();
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("item-name") as string;
    const category = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string);
    const qty = parseInt(formData.get("quantity") as string, 10);
    const minQuantity = item?.minQuantity || 10;
    
    let status = "In Stock";
    if (qty === 0) status = "Out of Stock";
    else if (qty < minQuantity) status = "Low Stock";

    try {
      if (isEditing) {
        await fetchWithAuth(`/inventory/${id}`, {
          method: "PUT",
          body: JSON.stringify({ name, category, quantity: qty, price, status }),
        });
      } else {
        const prefix = category.substring(0, 3).toUpperCase();
        const sku = `${prefix}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
        await fetchWithAuth("/inventory", {
          method: "POST",
          body: JSON.stringify({ name, sku, category, quantity: qty, price, status, minQuantity }),
        });
      }
      navigate("/inventory");
    } catch (error) {
      console.error("Failed to save item:", error);
      alert("Failed to save item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-primary font-h2 text-2xl">Loading Item...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center pb-12">
      <div className="w-full max-w-xl">
          {/* Form Header Area */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-on-background">
                {isEditing ? "Edit Item" : "Add New Item"}
              </h1>
              <p className="font-body-md text-on-surface-variant mt-2">
                {isEditing ? "Update the details of the product." : "Enter the details of the new product for the inventory."}
              </p>
            </div>
            <Link to="/inventory" className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-variant hover:bg-outline/20 transition-colors">
              <X className="text-on-surface-variant" size={24} />
            </Link>
          </div>

          {/* Form Card */}
          <section className="bg-surface rounded-xl p-6 md:p-8 ambient-shadow border border-surface-variant">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-on-surface-variant uppercase" htmlFor="item-name">Item Name</label>
                <input required defaultValue={item?.name || ""} name="item-name" className="w-full h-12 px-4 bg-surface-variant/30 border-2 border-transparent focus:border-primary focus:bg-white rounded-lg transition-all outline-none font-medium" id="item-name" placeholder="e.g. Wireless Ergonomic Mouse" type="text" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-on-surface-variant uppercase" htmlFor="category">Category</label>
                  <div className="relative">
                    <select required defaultValue={item?.category || ""} name="category" className="w-full h-12 px-4 bg-surface-variant/30 border-2 border-transparent focus:border-primary focus:bg-white rounded-lg transition-all outline-none appearance-none font-medium" id="category">
                      <option disabled value="">Select category</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Office Furniture</option>
                      <option value="stationery">Stationery</option>
                      <option value="hardware">Hardware</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" size={20} />
                  </div>
                </div>

                {/* Price Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-on-surface-variant uppercase" htmlFor="price">Unit Price ($)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">$</span>
                    <input required defaultValue={item?.price || ""} name="price" className="w-full h-12 pl-10 pr-4 bg-surface-variant/30 border-2 border-transparent focus:border-primary focus:bg-white rounded-lg transition-all outline-none font-medium" id="price" placeholder="0.00" step="0.01" type="number" />
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-on-surface-variant uppercase" htmlFor="quantity">Quantity</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-variant hover:bg-outline/20 text-on-surface transition-colors" type="button">
                    <Minus size={20} />
                  </button>
                  <input required name="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} className="flex-1 h-12 text-center bg-surface-variant/30 border-2 border-transparent focus:border-primary focus:bg-white rounded-lg transition-all outline-none text-lg font-bold" id="quantity" type="number" />
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-variant hover:bg-outline/20 text-on-surface transition-colors" type="button">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Stock Alerts Toggle Section */}
              <div className="p-4 bg-surface-variant/30 rounded-xl flex items-center justify-between border border-surface-variant">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Bell className="text-secondary" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-on-background">Low Stock Alerts</h3>
                    <p className="text-xs text-on-surface-variant">Notify when inventory falls below 10 units</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" value="" />
                  <div className="w-11 h-6 bg-outline/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button disabled={saving} className="w-full h-14 bg-primary text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 ambient-shadow hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70" type="submit">
                  <Save size={20} />
                  {saving ? "Saving..." : (isEditing ? "Update Item" : "Save Item")}
                </button>
                <Link to="/inventory" className="w-full h-14 bg-transparent text-on-surface-variant font-semibold rounded-xl flex items-center justify-center hover:bg-surface-variant transition-all" type="button">
                  Cancel
                </Link>
              </div>
            </form>
          </section>
        </div>
    </div>
  );
}
