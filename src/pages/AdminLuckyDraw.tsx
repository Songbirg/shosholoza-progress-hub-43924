import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Gift, Download, Trash2, Mail, Phone, User, Hash, Calendar, RefreshCw } from "lucide-react";
import Navigation from "@/components/Navigation";
import AdminAuth from "@/components/AdminAuth";

interface LuckyDrawEntry {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  membership_id: string;
}

const AdminLuckyDraw = () => {
  const [entries, setEntries] = useState<LuckyDrawEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchEntries();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchEntries();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchEntries = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      const { data, error } = await supabase
        .from("lucky_draw_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching entries:", error);
        throw error;
      }
      
      setEntries(data || []);
      console.log(`Fetched ${data?.length || 0} entries`);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const { error } = await supabase
        .from("lucky_draw_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry");
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Full Name", "Email", "Phone", "Membership ID"];
    const rows = filteredEntries.map((entry) => [
      new Date(entry.created_at).toLocaleString(),
      entry.full_name,
      entry.email,
      entry.phone,
      entry.membership_id,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lucky-draw-entries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.full_name.toLowerCase().includes(filter.toLowerCase()) ||
      entry.email.toLowerCase().includes(filter.toLowerCase()) ||
      entry.phone.includes(filter) ||
      entry.membership_id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <Navigation />
        
        <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  Lucky Draw 2026 Entries
                </h1>
                <p className="text-yellow-100 mt-1">
                  Total Entries: {entries.length} | Filtered: {filteredEntries.length}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => fetchEntries(true)}
                disabled={refreshing}
                className="bg-white/10 text-white hover:bg-white/20 font-bold border border-yellow-400/30"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                onClick={exportToCSV}
                className="bg-white text-yellow-700 hover:bg-yellow-50 font-bold"
                disabled={filteredEntries.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-6 backdrop-blur-sm border border-slate-700">
          <input
            type="text"
            placeholder="Search by name, email, phone, or membership ID..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        {/* Entries Table */}
        <div className="bg-slate-800/50 rounded-xl overflow-hidden backdrop-blur-sm border border-slate-700 shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4" />
              Loading entries...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No entries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">
                      <Hash className="w-4 h-4 inline mr-2" />
                      Membership ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(entry.created_at).toLocaleDateString()} <br />
                        <span className="text-xs text-gray-500">
                          {new Date(entry.created_at).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {entry.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {entry.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {entry.phone}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-yellow-400">
                        {entry.membership_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
            <div className="text-4xl font-black mb-2">{entries.length}</div>
            <div className="text-yellow-100">Total Entries</div>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-white">
            <div className="text-4xl font-black mb-2">
              {new Date() < new Date("2026-11-04") ? "Active" : "Closed"}
            </div>
            <div className="text-red-100">Promotion Status</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
            <div className="text-4xl font-black mb-2">Nov 12</div>
            <div className="text-green-100">Draw Date</div>
          </div>
        </div>
        </div>
      </div>
    </AdminAuth>
  );
};

export default AdminLuckyDraw;
