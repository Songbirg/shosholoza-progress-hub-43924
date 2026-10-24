import { useEffect, useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  supabase,
  type MembershipApplication,
  type CouncillorApplication,
} from "@/lib/supabase";

// Lucky Draw Entry interface
interface LuckyDrawEntry {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  membership_id: string;
}
import {
  Search, RefreshCw, Users, Clock, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, Eye, Loader2, Download,
  Phone, Mail, MapPin, Calendar, Hash, FileText, Building2, TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "members" | "luckydraw";
type SortDir = "asc" | "desc";
type StatusFilter =
  | "all" | "pending" | "approved" | "rejected";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved:  "bg-green-100 text-green-800 border-green-200",
  rejected:  "bg-red-100 text-red-800 border-red-200",
  new:       "bg-blue-100 text-blue-800 border-blue-200",
  contacted: "bg-purple-100 text-purple-800 border-purple-200",
  declined:  "bg-gray-100 text-gray-700 border-gray-200",
};

const PROVINCES = [
  "All Provinces", "Gauteng", "KwaZulu-Natal", "Western Cape", "Eastern Cape",
  "Mpumalanga", "North West", "Limpopo", "Northern Cape", "Free State",
];

const MUNICIPALITIES = [
  "All Municipalities", "Joburg", "Ekurhuleni", "Tshwane", "Buffalo City",
  "Cape Town", "eThekwini", "Mangaung", "Nelson Mandela Bay",
];

const TAB_CONFIG: {
  id: Tab; label: string; icon: React.ElementType;
  activeColor: string; borderColor: string;
}[] = [
  { id: "members",     label: "Members",     icon: Users,      activeColor: "text-cyan-600",  borderColor: "border-cyan-600"  },
  { id: "luckydraw",   label: "Lucky Draw",  icon: TrendingUp, activeColor: "text-blue-600",   borderColor: "border-blue-600"   },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function StatCard({
  icon: Icon, label, value, color,
}: {
  icon: React.ElementType; label: string; value: number; color: string;
}) {
  return (
    <div className="bg-card rounded-lg border p-5 flex items-center gap-4 shadow-sm">
      <div className={`p-3 rounded-full ${color} shrink-0`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-2xl font-bold leading-tight">{value}</p>
      </div>
    </div>
  );
}

function Field({
  label, value, icon: Icon,
}: {
  label: string; value?: string | null; icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="mt-0.5 text-muted-foreground shrink-0">
          <Icon size={15} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium break-words mt-0.5">
          {value ? value : (
            <span className="text-muted-foreground italic">Not provided</span>
          )}
        </p>
      </div>
    </div>
  );
}

function StatusButtons({
  statuses, current, onUpdate, updating,
}: {
  statuses: string[]; current?: string;
  onUpdate: (s: string) => void; updating: boolean;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((s) => (
        <Button
          key={s}
          size="sm"
          variant={current === s ? "default" : "outline"}
          disabled={updating || current === s}
          onClick={() => onUpdate(s)}
          className={
            s === "approved" || s === "contacted"
              ? "hover:bg-green-600 hover:text-white"
              : s === "rejected" || s === "declined"
                ? "hover:bg-red-600 hover:text-white"
                : ""
          }
        >
          {updating ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </Button>
      ))}
    </div>
  );
}

// ─── Candidate Modal ──────────────────────────────────────────────────────────
function CandidateModal({
  app, open, onClose, onStatusChange,
}: {
  app: MembershipApplication | null; open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  if (!app) return null;

  const handleUpdate = async (s: string) => {
    if (!app.id) return;
    setUpdating(true);
    await onStatusChange(app.id, s);
    setUpdating(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Users size={20} className="text-green-600" />
            Candidate — {app.membership_number}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <StatusBadge status={app.status ?? "pending"} />
          </div>
          <StatusButtons
            statuses={["pending", "approved", "rejected"]}
            current={app.status}
            updating={updating}
            onUpdate={handleUpdate}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-xs uppercase tracking-wide text-green-700 border-b pb-1">
              Personal
            </h3>
            <Field label="Full Name" value={app.full_name} icon={Users} />
            <Field label="Surname" value={app.surname} />
            <Field
              label="Date of Birth"
              value={app.date_of_birth ? new Date(app.date_of_birth).toLocaleDateString("en-ZA") : undefined}
              icon={Calendar}
            />
            <Field label="ID Number" value={app.id_number} icon={Hash} />
            <Field label="Phone" value={app.phone_number} icon={Phone} />
            <Field label="Email" value={app.email} icon={Mail} />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-xs uppercase tracking-wide text-green-700 border-b pb-1">
              Address
            </h3>
            <Field label="Residential Address" value={app.residential_address} icon={MapPin} />
            <Field label="Province" value={app.province} />
            <Field label="City" value={app.city} />
            <Field label="Area / Suburb" value={app.area_suburb} />
          </div>
        </div>

        <div className="space-y-3 mt-2">
          <h3 className="font-semibold text-xs uppercase tracking-wide text-green-700 border-b pb-1">
            Meta
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Membership #" value={app.membership_number} icon={Hash} />
            <Field
              label="Submitted"
              value={app.created_at ? new Date(app.created_at).toLocaleString("en-ZA") : undefined}
              icon={Calendar}
            />
            <Field label="Reference ID" value={app.id} icon={Hash} />
          </div>
        </div>

        {app.signature_data_url && (
          <div className="space-y-2 mt-2">
            <h3 className="font-semibold text-xs uppercase tracking-wide text-green-700 border-b pb-1">
              Signature
            </h3>
            <div className="border rounded-lg bg-white p-2">
              <img src={app.signature_data_url} alt="Signature" className="max-h-24 object-contain" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Councillor Modal ─────────────────────────────────────────────────────────
function CouncillorModal({
  app, open, onClose, onStatusChange,
}: {
  app: CouncillorApplication | null; open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  if (!app) return null;

  const fullName = (app as CouncillorApplication & { full_name?: string }).full_name ?? app.name;

  const handleUpdate = async (s: string) => {
    if (!app.id) return;
    setUpdating(true);
    await onStatusChange(app.id, s);
    setUpdating(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Building2 size={20} className="text-yellow-600" />
            Councillor Application
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <StatusBadge status={app.status ?? "pending"} />
          </div>
          <StatusButtons
            statuses={["pending", "approved", "rejected"]}
            current={app.status}
            updating={updating}
            onUpdate={handleUpdate}
          />
        </div>

        <div className="space-y-4 mt-2">
          <h3 className="font-semibold text-xs uppercase tracking-wide text-yellow-700 border-b pb-1">
            Councillor Details
          </h3>
          <Field label="Name" value={fullName} icon={Users} />
          <Field label="Email" value={app.email} icon={Mail} />
          <Field label="Phone" value={app.phone} icon={Phone} />
          <Field label="Municipality" value={app.municipality} icon={MapPin} />
          <Field label="Motivation" value={app.motivation} icon={FileText} />
          <Field
            label="Submitted"
            value={app.created_at ? new Date(app.created_at).toLocaleString("en-ZA") : undefined}
            icon={Calendar}
          />
          <Field label="Reference ID" value={app.id} icon={Hash} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Sponsor Modal ────────────────────────────────────────────────────────────
// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminApplications = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("members");

  // ── Candidates state ──────────────────────────────────────────────────────
  const [candidates, setCandidates] = useState<MembershipApplication[]>([]);
  const [candLoading, setCandLoading] = useState(true);
  const [candError, setCandError] = useState<string | null>(null);
  const [candSearch, setCandSearch] = useState("");
  const [candStatus, setCandStatus] = useState<StatusFilter>("all");
  const [candProvince, setCandProvince] = useState("All Provinces");
  const [candSort, setCandSort] = useState<"created_at" | "full_name" | "province" | "status">("created_at");
  const [candDir, setCandDir] = useState<SortDir>("desc");
  const [candSelected, setCandSelected] = useState<MembershipApplication | null>(null);
  const [candModal, setCandModal] = useState(false);

  // ── Councillors state ─────────────────────────────────────────────────────
  const [councillors, setCouncillors] = useState<CouncillorApplication[]>([]);
  const [councLoading, setCouncLoading] = useState(true);
  const [councError, setCouncError] = useState<string | null>(null);
  const [councSearch, setCouncSearch] = useState("");
  const [councStatus, setCouncStatus] = useState<StatusFilter>("all");
  const [councMuni, setCouncMuni] = useState("All Municipalities");
  const [councSort, setCouncSort] = useState<"created_at" | "name" | "municipality" | "status">("created_at");
  const [councDir, setCouncDir] = useState<SortDir>("desc");
  const [councSelected, setCouncSelected] = useState<CouncillorApplication | null>(null);
  const [councModal, setCouncModal] = useState(false);

  // ── Lucky Draw state ──────────────────────────────────────────────────────
  const [luckyDrawEntries, setLuckyDrawEntries] = useState<LuckyDrawEntry[]>([]);
  const [ldLoading, setLdLoading] = useState(true);
  const [ldError, setLdError] = useState<string | null>(null);
  const [ldSearch, setLdSearch] = useState("");
  const [ldSort, setLdSort] = useState<"created_at" | "full_name" | "email">("created_at");
  const [ldDir, setLdDir] = useState<SortDir>("desc");
  const [ldSelected, setLdSelected] = useState<LuckyDrawEntry | null>(null);
  const [ldModal, setLdModal] = useState(false);

  // ── Fetches ───────────────────────────────────────────────────────────────
  const fetchCandidates = useCallback(async () => {
    setCandLoading(true);
    setCandError(null);
    try {
      // Try the Candidates table first
      let response = await supabase
        .from("Candidates")
        .select("*", { count: 'exact' })
        .order("Submitted", { ascending: candDir === "asc" });
      
      if (response.error || !response.data || response.data.length === 0) {
        response = await supabase
          .from("membership_applications")
          .select("*", { count: 'exact' })
          .order(candSort, { ascending: candDir === "asc" });
      }
      
      if (response.error) throw new Error(response.error.message);
      
      if (response.data && response.data.length > 0) {
        // Map the column names from CSV format to app format
        const mappedData = response.data.map((row: any) => ({
          id: row.id,
          created_at: row.Submitted || row.created_at,
          membership_number: row["Membership #"] || row.membership_number,
          full_name: row["Full Name"] || row.full_name,
          surname: row.Surname || row.surname,
          phone_number: row.Phone || row.phone_number,
          email: row.Email || row.email,
          province: row.Province || row.province,
          city: row.City || row.city,
          status: row.Status || row.status || "pending",
          date_of_birth: row.date_of_birth,
          id_number: row.id_number,
          residential_address: row.residential_address,
          area_suburb: row.area_suburb,
          signature_data_url: row.signature_data_url,
          user_agent: row.user_agent
        }));
        setCandidates(mappedData as MembershipApplication[]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load.";
      setCandError(msg);
      toast({ title: "Error loading candidates", description: msg, variant: "destructive" });
    } finally {
      setCandLoading(false);
    }
  }, [candSort, candDir, toast]);

  const fetchCouncillors = useCallback(async () => {
    setCouncLoading(true);
    setCouncError(null);
    try {
      const { data, error } = await supabase
        .from("councillor_applications")
        .select("*")
        .order(councSort, { ascending: councDir === "asc" });
      if (error) throw new Error(error.message);
      setCouncillors((data as CouncillorApplication[]) ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load.";
      setCouncError(msg);
      toast({ title: "Error loading councillors", description: msg, variant: "destructive" });
    } finally {
      setCouncLoading(false);
    }
  }, [councSort, councDir, toast]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);
  useEffect(() => { fetchCouncillors(); }, [fetchCouncillors]);

  const fetchLuckyDrawEntries = useCallback(async () => {
    setLdLoading(true);
    setLdError(null);
    try {
      const { data, error } = await supabase
        .from("lucky_draw_entries")
        .select("*")
        .order(ldSort, { ascending: ldDir === "asc" });
      if (error) {
        if (error.message.includes("does not exist") || error.code === "42P01") {
          setLdError("The lucky_draw_entries table has not been created yet. Please run the SQL from CREATE_LUCKY_DRAW_TABLE.md file to create the database table.");
        } else {
          throw new Error(error.message);
        }
        return;
      }
      setLuckyDrawEntries((data as LuckyDrawEntry[]) ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load.";
      setLdError(msg);
      toast({ title: "Error loading lucky draw entries", description: msg, variant: "destructive" });
    } finally {
      setLdLoading(false);
    }
  }, [ldSort, ldDir, toast]);

  useEffect(() => { fetchLuckyDrawEntries(); }, [fetchLuckyDrawEntries]);

  // ── Status updates ────────────────────────────────────────────────────────
  const updateCandidateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("membership_applications").update({ status }).eq("id", id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    setCandidates((prev) => prev.map((a) => a.id === id ? { ...a, status: status as MembershipApplication['status'] } : a));
    if (candSelected?.id === id) setCandSelected((prev) => prev ? { ...prev, status: status as MembershipApplication['status'] } : prev);
    toast({ title: "Status updated", description: `Marked as ${status}.` });
  };

  const updateCouncillorStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("councillor_applications").update({ status }).eq("id", id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    setCouncillors((prev) => prev.map((a) => a.id === id ? { ...a, status: status as CouncillorApplication['status'] } : a));
    if (councSelected?.id === id) setCouncSelected((prev) => prev ? { ...prev, status: status as CouncillorApplication['status'] } : prev);
    toast({ title: "Status updated", description: `Marked as ${status}.` });
  };

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filteredCandidates = candidates.filter((a) => {
    const q = candSearch.toLowerCase();
    return (
      (!q || a.full_name.toLowerCase().includes(q) || a.surname.toLowerCase().includes(q) ||
        a.membership_number.toLowerCase().includes(q) || a.id_number.includes(q) ||
        (a.email ?? "").toLowerCase().includes(q) || a.city.toLowerCase().includes(q))
      && (candStatus === "all" || a.status === candStatus)
      && (candProvince === "All Provinces" || a.province === candProvince)
    );
  });

  const filteredCouncillors = councillors.filter((a) => {
    const q = councSearch.toLowerCase();
    const name = (a as CouncillorApplication & { full_name?: string }).full_name ?? a.name ?? "";
    return (
      (!q || name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) ||
        a.phone.includes(q) || a.municipality.toLowerCase().includes(q))
      && (councStatus === "all" || a.status === councStatus)
      && (councMuni === "All Municipalities" || a.municipality.toLowerCase() === councMuni.toLowerCase())
    );
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const candStats = {
    total:    candidates.length,
    pending:  candidates.filter((a) => a.status === "pending").length,
    approved: candidates.filter((a) => a.status === "approved").length,
    rejected: candidates.filter((a) => a.status === "rejected").length,
  };
  const councStats = {
    total:    councillors.length,
    pending:  councillors.filter((a) => a.status === "pending").length,
    approved: councillors.filter((a) => a.status === "approved").length,
    rejected: councillors.filter((a) => a.status === "rejected").length,
  };

  // ── Sort toggles ──────────────────────────────────────────────────────────
  function toggleCandSort(field: "created_at" | "full_name" | "province" | "status") {
    if (candSort === field) setCandDir((d) => d === "asc" ? "desc" : "asc");
    else { setCandSort(field); setCandDir("asc"); }
  }
  function toggleCouncSort(field: "created_at" | "name" | "municipality" | "status") {
    if (councSort === field) setCouncDir((d) => d === "asc" ? "desc" : "asc");
    else { setCouncSort(field); setCouncDir("asc"); }
  }

  // ── CSV export ────────────────────────────────────────────────────────────
  function downloadCSV(filename: string, rows: string[][]) {
    const csv = rows
      .map((r) => r.map((c) => `"${(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
  function exportCandidates() {
    const h = ["Submitted","Membership #","Full Name","Surname","Province","City","Phone","Email","Status"];
    const rows = filteredCandidates.map((a) => [
      a.created_at ? new Date(a.created_at).toLocaleDateString("en-ZA") : "",
      a.membership_number, a.full_name, a.surname, a.province, a.city,
      a.phone_number, a.email ?? "", a.status ?? "pending",
    ]);
    downloadCSV("candidates.csv", [h, ...rows]);
  }
  function exportCouncillors() {
    const h = ["Submitted","Name","Municipality","Phone","Email","Status"];
    const rows = filteredCouncillors.map((a) => [
      a.created_at ? new Date(a.created_at).toLocaleDateString("en-ZA") : "",
      (a as CouncillorApplication & { full_name?: string }).full_name ?? a.name ?? "", a.municipality, a.phone, a.email, a.status ?? "pending",
    ]);
    downloadCSV("councillors.csv", [h, ...rows]);
  }

  // ── Sort icon ─────────────────────────────────────────────────────────────
  function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    if (!active) return <ChevronDown size={13} className="opacity-30" />;
    return dir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage membership applications, councillor applications, and lucky draw entries.
          </p>
        </div>

        {/* Tab bar */}
        <div className="border-b mb-6">
          <div className="flex gap-0">
            {TAB_CONFIG.map(({ id, label, icon: Icon, activeColor, borderColor }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === id
                    ? `${activeColor} ${borderColor}`
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Members Tab ──────────────────────────────────────────────── */}
        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={Users}        label="Total"    value={candStats.total}    color="bg-green-600" />
              <StatCard icon={Clock}        label="Pending"  value={candStats.pending}  color="bg-yellow-500" />
              <StatCard icon={CheckCircle2} label="Approved" value={candStats.approved} color="bg-green-500" />
              <StatCard icon={XCircle}      label="Rejected" value={candStats.rejected} color="bg-red-500" />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search name, ID, membership #…" value={candSearch} onChange={(e) => setCandSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={candStatus} onValueChange={(v) => setCandStatus(v as StatusFilter)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  {["all","pending","approved","rejected"].map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={candProvince} onValueChange={setCandProvince}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Province" /></SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={fetchCandidates} className="gap-2">
                <RefreshCw size={14} />Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportCandidates} className="gap-2">
                <Download size={14} />Export CSV
              </Button>
            </div>

            <div className="rounded-lg border bg-card overflow-hidden">
              {candLoading ? (
                <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
                  <Loader2 size={24} className="animate-spin" /><span>Loading candidates…</span>
                </div>
              ) : candError ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <XCircle size={40} className="text-red-400" />
                  <p className="text-muted-foreground text-center max-w-sm">{candError}</p>
                  <Button variant="outline" onClick={fetchCandidates}>Try Again</Button>
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                  <Users size={40} className="opacity-30" />
                  <p>{candidates.length === 0 ? "No candidates yet." : "No candidates match your filters."}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/60 border-b">
                      <tr>
                        {([
                          { label: "Submitted",   field: "created_at" },
                          { label: "Membership #", field: null },
                          { label: "Full Name",   field: "full_name" },
                          { label: "Province",    field: "province" },
                          { label: "Phone",       field: null },
                          { label: "Email",       field: null },
                          { label: "Status",      field: "status" },
                          { label: "",            field: null },
                        ] as { label: string; field: typeof candSort | null }[]).map(({ label, field }) => (
                          <th
                            key={label || "actions"}
                            className={`px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap ${field ? "cursor-pointer select-none hover:text-foreground" : ""}`}
                            onClick={() => field && toggleCandSort(field)}
                          >
                            <span className="inline-flex items-center gap-1">
                              {label}
                              {field && <SortIcon active={candSort === field} dir={candDir} />}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((app, i) => (
                        <tr key={app.id} className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString("en-ZA") : "—"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-medium text-green-700">{app.membership_number}</td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium">{app.full_name} {app.surname}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{app.province}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{app.phone_number}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                            {app.email || <span className="italic opacity-50">—</span>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={app.status ?? "pending"} /></td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Button size="sm" variant="ghost" className="gap-1.5 h-8" onClick={() => { setCandSelected(app); setCandModal(true); }}>
                              <Eye size={14} />View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!candLoading && !candError && filteredCandidates.length > 0 && (
                <div className="px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
                  Showing {filteredCandidates.length} of {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Councillors Tab ─────────────────────────────────────────────── */}
        {activeTab === "councillors" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={Building2}    label="Total"    value={councStats.total}    color="bg-yellow-600" />
              <StatCard icon={Clock}        label="Pending"  value={councStats.pending}  color="bg-yellow-500" />
              <StatCard icon={CheckCircle2} label="Approved" value={councStats.approved} color="bg-green-500" />
              <StatCard icon={XCircle}      label="Rejected" value={councStats.rejected} color="bg-red-500" />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search name, email, municipality…" value={councSearch} onChange={(e) => setCouncSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={councStatus} onValueChange={(v) => setCouncStatus(v as StatusFilter)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  {["all","pending","approved","rejected"].map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={councMuni} onValueChange={setCouncMuni}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Municipality" /></SelectTrigger>
                <SelectContent>
                  {MUNICIPALITIES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={fetchCouncillors} className="gap-2">
                <RefreshCw size={14} />Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportCouncillors} className="gap-2">
                <Download size={14} />Export CSV
              </Button>
            </div>

            <div className="rounded-lg border bg-card overflow-hidden">
              {councLoading ? (
                <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
                  <Loader2 size={24} className="animate-spin" /><span>Loading councillors…</span>
                </div>
              ) : councError ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <XCircle size={40} className="text-red-400" />
                  <p className="text-muted-foreground text-center max-w-sm">{councError}</p>
                  <Button variant="outline" onClick={fetchCouncillors}>Try Again</Button>
                </div>
              ) : filteredCouncillors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                  <Building2 size={40} className="opacity-30" />
                  <p>{councillors.length === 0 ? "No councillor applications yet." : "No councillors match your filters."}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/60 border-b">
                      <tr>
                        {([
                          { label: "Submitted",    field: "created_at" },
                          { label: "Name",         field: "name" },
                          { label: "Municipality", field: "municipality" },
                          { label: "Phone",        field: null },
                          { label: "Email",        field: null },
                          { label: "Status",       field: "status" },
                          { label: "",             field: null },
                        ] as { label: string; field: typeof councSort | null }[]).map(({ label, field }) => (
                          <th
                            key={label || "actions"}
                            className={`px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap ${field ? "cursor-pointer select-none hover:text-foreground" : ""}`}
                            onClick={() => field && toggleCouncSort(field)}
                          >
                            <span className="inline-flex items-center gap-1">
                              {label}
                              {field && <SortIcon active={councSort === field} dir={councDir} />}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCouncillors.map((app, i) => {
                        const name = (app as CouncillorApplication & { full_name?: string }).full_name ?? app.name ?? "";
                        return (
                          <tr key={app.id} className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                              {app.created_at ? new Date(app.created_at).toLocaleDateString("en-ZA") : "—"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-medium">{name}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{app.municipality}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{app.phone}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{app.email}</td>
                            <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={app.status ?? "pending"} /></td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Button size="sm" variant="ghost" className="gap-1.5 h-8" onClick={() => { setCouncSelected(app); setCouncModal(true); }}>
                                <Eye size={14} />View
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {!councLoading && !councError && filteredCouncillors.length > 0 && (
                <div className="px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
                  Showing {filteredCouncillors.length} of {councillors.length} councillor{councillors.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Lucky Draw Tab ───────────────────────────────────────────────── */}
        {activeTab === "luckydraw" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={TrendingUp}   label="Total Entries" value={luckyDrawEntries.length} color="bg-blue-600" />
              <StatCard icon={Clock}        label="This Month"    value={luckyDrawEntries.filter(e => new Date(e.created_at).getMonth() === new Date().getMonth()).length} color="bg-blue-500" />
              <StatCard icon={CheckCircle2} label="This Week"     value={luckyDrawEntries.filter(e => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(e.created_at) >= weekAgo;
              }).length} color="bg-green-500" />
              <StatCard icon={Users}        label="Today"         value={luckyDrawEntries.filter(e => new Date(e.created_at).toDateString() === new Date().toDateString()).length} color="bg-yellow-500" />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search name, email, phone, membership ID…" value={ldSearch} onChange={(e) => setLdSearch(e.target.value)} className="pl-9" />
              </div>
              <Button variant="outline" size="sm" onClick={fetchLuckyDrawEntries} className="gap-2">
                <RefreshCw size={14} />Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                const headers = ["Date", "Full Name", "Email", "Phone", "Membership ID"];
                const filteredLd = luckyDrawEntries.filter((e) => 
                  !ldSearch || 
                  e.full_name.toLowerCase().includes(ldSearch.toLowerCase()) ||
                  e.email.toLowerCase().includes(ldSearch.toLowerCase()) ||
                  e.phone.includes(ldSearch) ||
                  e.membership_id.toLowerCase().includes(ldSearch.toLowerCase())
                );
                const rows = filteredLd.map((e) => [
                  new Date(e.created_at).toLocaleString(),
                  e.full_name,
                  e.email,
                  e.phone,
                  e.membership_id,
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
              }} className="gap-2">
                <Download size={14} />Export CSV
              </Button>
            </div>

            <div className="rounded-lg border bg-card overflow-hidden">
              {ldLoading ? (
                <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
                  <Loader2 size={24} className="animate-spin" /><span>Loading lucky draw entries…</span>
                </div>
              ) : ldError ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 px-4">
                  <XCircle size={40} className="text-red-400" />
                  <div className="text-center max-w-2xl space-y-3">
                    <p className="text-lg font-semibold text-foreground">Database Table Not Found</p>
                    <p className="text-muted-foreground">{ldError}</p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                      <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">Quick Fix:</p>
                      <ol className="text-sm text-left text-yellow-800 dark:text-yellow-300 space-y-2 list-decimal list-inside">
                        <li>Open: <a href="https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql" target="_blank" rel="noopener noreferrer" className="underline font-mono">Supabase SQL Editor</a></li>
                        <li>Copy SQL from: <span className="font-mono bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">⚠️_RUN_THIS_SQL_NOW.md</span></li>
                        <li>Click "Run" in Supabase</li>
                        <li>Refresh this page</li>
                      </ol>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <Button 
                      variant="default"
                      onClick={() => window.open('https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql', '_blank')}
                      className="gap-2"
                    >
                      Open Supabase SQL Editor
                    </Button>
                    <Button variant="outline" onClick={fetchLuckyDrawEntries}>Try Again</Button>
                  </div>
                </div>
              ) : (() => {
                const filteredLd = luckyDrawEntries.filter((e) => 
                  !ldSearch || 
                  e.full_name.toLowerCase().includes(ldSearch.toLowerCase()) ||
                  e.email.toLowerCase().includes(ldSearch.toLowerCase()) ||
                  e.phone.includes(ldSearch) ||
                  e.membership_id.toLowerCase().includes(ldSearch.toLowerCase())
                );
                return filteredLd.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                    <TrendingUp size={40} className="opacity-30" />
                    <p>{luckyDrawEntries.length === 0 ? "No lucky draw entries yet." : "No entries match your search."}</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/60 border-b">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap cursor-pointer select-none hover:text-foreground" onClick={() => { setLdSort("created_at"); setLdDir(ldDir === "asc" ? "desc" : "asc"); }}>
                              <span className="inline-flex items-center gap-1">Submitted <SortIcon active={ldSort === "created_at"} dir={ldDir} /></span>
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap cursor-pointer select-none hover:text-foreground" onClick={() => { setLdSort("full_name"); setLdDir(ldDir === "asc" ? "desc" : "asc"); }}>
                              <span className="inline-flex items-center gap-1">Full Name <SortIcon active={ldSort === "full_name"} dir={ldDir} /></span>
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap cursor-pointer select-none hover:text-foreground" onClick={() => { setLdSort("email"); setLdDir(ldDir === "asc" ? "desc" : "asc"); }}>
                              <span className="inline-flex items-center gap-1">Email <SortIcon active={ldSort === "email"} dir={ldDir} /></span>
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap">Phone</th>
                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap">Membership ID</th>
                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLd.map((entry, i) => (
                            <tr key={entry.id} className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                                {new Date(entry.created_at).toLocaleDateString("en-ZA")} <br />
                                <span className="text-xs opacity-75">{new Date(entry.created_at).toLocaleTimeString("en-ZA")}</span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium">{entry.full_name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{entry.email}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{entry.phone}</td>
                              <td className="px-4 py-3 whitespace-nowrap font-mono text-sm">{entry.membership_id}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Button size="sm" variant="ghost" className="gap-1.5 h-8" onClick={() => { setLdSelected(entry); setLdModal(true); }}>
                                  <Eye size={14} />View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
                      Showing {filteredLd.length} of {luckyDrawEntries.length} entr{luckyDrawEntries.length !== 1 ? "ies" : "y"}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

      </main>
      <Footer />

      <CandidateModal
        app={candSelected}
        open={candModal}
        onClose={() => { setCandModal(false); setCandSelected(null); }}
        onStatusChange={updateCandidateStatus}
      />
      <CouncillorModal
        app={councSelected}
        open={councModal}
        onClose={() => { setCouncModal(false); setCouncSelected(null); }}
        onStatusChange={updateCouncillorStatus}
      />
      
      {/* Lucky Draw Entry Modal */}
      <Dialog open={ldModal} onOpenChange={(v) => !v && setLdModal(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <TrendingUp size={20} className="text-blue-600" />
              Lucky Draw Entry
            </DialogTitle>
          </DialogHeader>
          {ldSelected && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Full Name" value={ldSelected.full_name} icon={Users} />
                <Field label="Email" value={ldSelected.email} icon={Mail} />
                <Field label="Phone" value={ldSelected.phone} icon={Phone} />
                <Field label="Membership ID" value={ldSelected.membership_id} icon={Hash} />
                <Field label="Submitted" value={new Date(ldSelected.created_at).toLocaleString("en-ZA")} icon={Calendar} />
                <Field label="Entry ID" value={ldSelected.id} icon={Hash} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApplications;
