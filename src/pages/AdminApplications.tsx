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
  type InvestorInquiry,
} from "@/lib/supabase";
import {
  Search, RefreshCw, Users, Clock, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, Eye, Loader2, Download,
  Phone, Mail, MapPin, Calendar, Hash, FileText, Building2, TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "candidates" | "councillors" | "investors";
type SortDir = "asc" | "desc";
type StatusFilter =
  | "all" | "pending" | "approved" | "rejected"
  | "new" | "contacted" | "declined";

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

const INVESTMENT_RANGES = [
  "All Ranges", "Under R50,000", "R50,000-R100,000",
  "R100,000-R500,000", "R500,000-R1,000,000", "R1,000,000+",
];

const TAB_CONFIG: {
  id: Tab; label: string; icon: React.ElementType;
  activeColor: string; borderColor: string;
}[] = [
  { id: "candidates",  label: "Candidates",  icon: Users,      activeColor: "text-green-600",  borderColor: "border-green-600"  },
  { id: "councillors", label: "Councillors", icon: Building2,  activeColor: "text-yellow-600", borderColor: "border-yellow-500" },
  { id: "investors",   label: "Investors",   icon: TrendingUp, activeColor: "text-blue-600",   borderColor: "border-blue-600"   },
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

// ─── Investor Modal ───────────────────────────────────────────────────────────
function InvestorModal({
  app, open, onClose, onStatusChange,
}: {
  app: InvestorInquiry | null; open: boolean;
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <TrendingUp size={20} className="text-blue-600" />
            Investor Inquiry
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <StatusBadge status={app.status ?? "new"} />
          </div>
          <StatusButtons
            statuses={["new", "contacted", "declined"]}
            current={app.status}
            updating={updating}
            onUpdate={handleUpdate}
          />
        </div>

        <div className="space-y-4 mt-2">
          <h3 className="font-semibold text-xs uppercase tracking-wide text-blue-700 border-b pb-1">
            Investor Details
          </h3>
          <Field label="Full Name" value={app.full_name} icon={Users} />
          <Field label="Email" value={app.email} icon={Mail} />
          <Field label="Phone" value={app.phone} icon={Phone} />
          <Field label="Company / Organisation" value={app.company} icon={Building2} />
          <Field label="Investment Range" value={app.investment_range} icon={TrendingUp} />
          <Field label="Area of Interest" value={app.area_of_interest} icon={FileText} />
          <Field label="Message" value={app.message} icon={FileText} />
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

// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminApplications = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("candidates");

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

  // ── Investors state ───────────────────────────────────────────────────────
  const [investors, setInvestors] = useState<InvestorInquiry[]>([]);
  const [invLoading, setInvLoading] = useState(true);
  const [invError, setInvError] = useState<string | null>(null);
  const [invSearch, setInvSearch] = useState("");
  const [invStatus, setInvStatus] = useState<StatusFilter>("all");
  const [invRange, setInvRange] = useState("All Ranges");
  const [invSort, setInvSort] = useState<"created_at" | "full_name" | "investment_range" | "status">("created_at");
  const [invDir, setInvDir] = useState<SortDir>("desc");
  const [invSelected, setInvSelected] = useState<InvestorInquiry | null>(null);
  const [invModal, setInvModal] = useState(false);

  // ── Fetches ───────────────────────────────────────────────────────────────
  const fetchCandidates = useCallback(async () => {
    setCandLoading(true);
    setCandError(null);
    try {
      const { data, error } = await supabase
        .from("membership_applications")
        .select("*")
        .order(candSort, { ascending: candDir === "asc" });
      if (error) throw new Error(error.message);
      setCandidates((data as MembershipApplication[]) ?? []);
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

  const fetchInvestors = useCallback(async () => {
    setInvLoading(true);
    setInvError(null);
    try {
      const { data, error } = await supabase
        .from("investor_inquiries")
        .select("*")
        .order(invSort, { ascending: invDir === "asc" });
      if (error) {
        if (error.message.includes("does not exist") || error.code === "42P01") {
          setInvError("The investor inquiries table has not been created yet. Please run the database migration.");
        } else {
          throw new Error(error.message);
        }
        return;
      }
      setInvestors((data as InvestorInquiry[]) ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load.";
      setInvError(msg);
      toast({ title: "Error loading investors", description: msg, variant: "destructive" });
    } finally {
      setInvLoading(false);
    }
  }, [invSort, invDir, toast]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);
  useEffect(() => { fetchCouncillors(); }, [fetchCouncillors]);
  useEffect(() => { fetchInvestors(); }, [fetchInvestors]);

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

  const updateInvestorStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("investor_inquiries").update({ status }).eq("id", id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    setInvestors((prev) => prev.map((a) => a.id === id ? { ...a, status: status as InvestorInquiry['status'] } : a));
    if (invSelected?.id === id) setInvSelected((prev) => prev ? { ...prev, status: status as InvestorInquiry['status'] } : prev);
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

  const filteredInvestors = investors.filter((a) => {
    const q = invSearch.toLowerCase();
    return (
      (!q || a.full_name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) ||
        a.phone.includes(q) || (a.company ?? "").toLowerCase().includes(q))
      && (invStatus === "all" || a.status === invStatus)
      && (invRange === "All Ranges" || a.investment_range === invRange)
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
  const invStats = {
    total:     investors.length,
    new_count: investors.filter((a) => a.status === "new").length,
    contacted: investors.filter((a) => a.status === "contacted").length,
    declined:  investors.filter((a) => a.status === "declined").length,
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
  function toggleInvSort(field: "created_at" | "full_name" | "investment_range" | "status") {
    if (invSort === field) setInvDir((d) => d === "asc" ? "desc" : "asc");
    else { setInvSort(field); setInvDir("asc"); }
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
  function exportInvestors() {
    const h = ["Submitted","Full Name","Company","Investment Range","Phone","Email","Status"];
    const rows = filteredInvestors.map((a) => [
      a.created_at ? new Date(a.created_at).toLocaleDateString("en-ZA") : "",
      a.full_name, a.company ?? "", a.investment_range ?? "", a.phone, a.email, a.status ?? "new",
    ]);
    downloadCSV("investors.csv", [h, ...rows]);
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
            Manage membership applications, councillor applications, and investor inquiries.
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

        {/* ── Candidates Tab ──────────────────────────────────────────────── */}
        {activeTab === "candidates" && (
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

        {/* ── Investors Tab ────────────────────────────────────────────────── */}
        {activeTab === "investors" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={TrendingUp}   label="Total"     value={invStats.total}     color="bg-blue-600" />
              <StatCard icon={Clock}        label="New"       value={invStats.new_count}  color="bg-blue-500" />
              <StatCard icon={CheckCircle2} label="Contacted" value={invStats.contacted}  color="bg-green-500" />
              <StatCard icon={XCircle}      label="Declined"  value={invStats.declined}   color="bg-red-500" />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search name, email, company…" value={invSearch} onChange={(e) => setInvSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={invStatus} onValueChange={(v) => setInvStatus(v as StatusFilter)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  {["all","new","contacted","declined"].map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={invRange} onValueChange={setInvRange}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Investment Range" /></SelectTrigger>
                <SelectContent>
                  {INVESTMENT_RANGES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={fetchInvestors} className="gap-2">
                <RefreshCw size={14} />Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportInvestors} className="gap-2">
                <Download size={14} />Export CSV
              </Button>
            </div>

            <div className="rounded-lg border bg-card overflow-hidden">
              {invLoading ? (
                <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
                  <Loader2 size={24} className="animate-spin" /><span>Loading investors…</span>
                </div>
              ) : invError ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <XCircle size={40} className="text-red-400" />
                  <p className="text-muted-foreground text-center max-w-sm">{invError}</p>
                  <Button variant="outline" onClick={fetchInvestors}>Try Again</Button>
                </div>
              ) : filteredInvestors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                  <TrendingUp size={40} className="opacity-30" />
                  <p>{investors.length === 0 ? "No investor inquiries yet." : "No investors match your filters."}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/60 border-b">
                      <tr>
                        {([
                          { label: "Submitted",        field: "created_at" },
                          { label: "Full Name",        field: "full_name" },
                          { label: "Company",          field: null },
                          { label: "Investment Range", field: "investment_range" },
                          { label: "Phone",            field: null },
                          { label: "Email",            field: null },
                          { label: "Status",           field: "status" },
                          { label: "",                 field: null },
                        ] as { label: string; field: typeof invSort | null }[]).map(({ label, field }) => (
                          <th
                            key={label || "actions"}
                            className={`px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap ${field ? "cursor-pointer select-none hover:text-foreground" : ""}`}
                            onClick={() => field && toggleInvSort(field)}
                          >
                            <span className="inline-flex items-center gap-1">
                              {label}
                              {field && <SortIcon active={invSort === field} dir={invDir} />}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvestors.map((app, i) => (
                        <tr key={app.id} className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString("en-ZA") : "—"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium">{app.full_name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                            {app.company || <span className="italic opacity-50">—</span>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">{app.investment_range}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{app.phone}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{app.email}</td>
                          <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={app.status ?? "new"} /></td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Button size="sm" variant="ghost" className="gap-1.5 h-8" onClick={() => { setInvSelected(app); setInvModal(true); }}>
                              <Eye size={14} />View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!invLoading && !invError && filteredInvestors.length > 0 && (
                <div className="px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
                  Showing {filteredInvestors.length} of {investors.length} investor{investors.length !== 1 ? "s" : ""}
                </div>
              )}
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
      <InvestorModal
        app={invSelected}
        open={invModal}
        onClose={() => { setInvModal(false); setInvSelected(null); }}
        onStatusChange={updateInvestorStatus}
      />
    </div>
  );
};

export default AdminApplications;
