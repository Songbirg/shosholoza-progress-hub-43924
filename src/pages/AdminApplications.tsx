import { useEffect, useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase, type MembershipApplication } from "@/lib/supabase";
import {
  Search,
  RefreshCw,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Loader2,
  Download,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  FileText,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusFilter = "all" | "pending" | "approved" | "rejected";
type SortField = "created_at" | "full_name" | "province" | "status";
type SortDir = "asc" | "desc";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

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
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-card rounded-lg border p-5 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function ApplicationDetailModal({
  app,
  open,
  onClose,
  onStatusChange,
}: {
  app: MembershipApplication | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);

  if (!app) return null;

  const handleStatus = async (status: string) => {
    if (!app.id) return;
    setUpdating(true);
    await onStatusChange(app.id, status);
    setUpdating(false);
  };

  const Field = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value?: string | null;
    icon?: React.ElementType;
  }) => (
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
          {value || (
            <span className="text-muted-foreground italic">Not provided</span>
          )}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg">
            <FileText size={20} className="text-green-600" />
            Application — {app.membership_number}
          </DialogTitle>
        </DialogHeader>

        {/* Status bar */}
        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <StatusBadge status={app.status ?? "pending"} />
          </div>
          <div className="flex gap-2">
            {["pending", "approved", "rejected"].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={app.status === s ? "default" : "outline"}
                disabled={updating || app.status === s}
                onClick={() => handleStatus(s)}
                className={
                  s === "approved"
                    ? "hover:bg-green-600 hover:text-white"
                    : s === "rejected"
                      ? "hover:bg-red-600 hover:text-white"
                      : ""
                }
              >
                {updating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  s.charAt(0).toUpperCase() + s.slice(1)
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
          {/* Personal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-green-700 border-b pb-1">
              Personal Information
            </h3>
            <Field label="Full Name" value={app.full_name} icon={Users} />
            <Field label="Surname" value={app.surname} />
            <Field
              label="Date of Birth"
              value={
                app.date_of_birth
                  ? new Date(app.date_of_birth).toLocaleDateString("en-ZA")
                  : undefined
              }
              icon={Calendar}
            />
            <Field label="ID Number" value={app.id_number} icon={Hash} />
            <Field label="Phone Number" value={app.phone_number} icon={Phone} />
            <Field label="Email Address" value={app.email} icon={Mail} />
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-green-700 border-b pb-1">
              Address Information
            </h3>
            <Field
              label="Residential Address"
              value={app.residential_address}
              icon={MapPin}
            />
            <Field label="Province" value={app.province} />
            <Field label="City" value={app.city} />
            <Field label="Area / Suburb" value={app.area_suburb} />
          </div>
        </div>

        {/* Membership & meta */}
        <div className="space-y-4 mt-2">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-green-700 border-b pb-1">
            Application Meta
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Membership Number"
              value={app.membership_number}
              icon={Hash}
            />
            <Field
              label="Submitted"
              value={
                app.created_at
                  ? new Date(app.created_at).toLocaleString("en-ZA")
                  : undefined
              }
              icon={Calendar}
            />
          </div>
        </div>

        {/* Signature */}
        {app.signature_data_url && (
          <div className="space-y-2 mt-2">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-green-700 border-b pb-1">
              Signature
            </h3>
            <div className="border rounded-lg overflow-hidden bg-white p-2">
              <img
                src={app.signature_data_url}
                alt="Applicant signature"
                className="max-h-24 object-contain"
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PROVINCES = [
  "All Provinces",
  "Gauteng",
  "KwaZulu-Natal",
  "Western Cape",
  "Eastern Cape",
  "Mpumalanga",
  "North West",
  "Limpopo",
  "Northern Cape",
  "Free State",
];

const AdminApplications = () => {
  const { toast } = useToast();

  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [provinceFilter, setProvinceFilter] = useState("All Provinces");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [selectedApp, setSelectedApp] = useState<MembershipApplication | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("membership_applications")
        .select("*")
        .order(sortField, { ascending: sortDir === "asc" });

      if (fetchError) throw new Error(fetchError.message);
      setApplications((data as MembershipApplication[]) ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load data.";
      setError(msg);
      toast({
        title: "Error loading applications",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sortField, sortDir, toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ── Status update ────────────────────────────────────────────────────────

  const handleStatusChange = async (id: string, status: string) => {
    const { error: updateError } = await supabase
      .from("membership_applications")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      toast({
        title: "Update failed",
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }

    // Optimistically update local state
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: status as MembershipApplication["status"] }
          : a,
      ),
    );
    if (selectedApp?.id === id) {
      setSelectedApp((prev) =>
        prev
          ? { ...prev, status: status as MembershipApplication["status"] }
          : prev,
      );
    }

    toast({
      title: "Status updated",
      description: `Application marked as ${status}.`,
    });
  };

  // ── Filtering & sorting ──────────────────────────────────────────────────

  const filtered = applications.filter((app) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      app.full_name.toLowerCase().includes(q) ||
      app.surname.toLowerCase().includes(q) ||
      app.membership_number.toLowerCase().includes(q) ||
      app.id_number.includes(q) ||
      (app.email ?? "").toLowerCase().includes(q) ||
      app.city.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    const matchesProvince =
      provinceFilter === "All Provinces" || app.province === provinceFilter;

    return matchesSearch && matchesStatus && matchesProvince;
  });

  // ── Stats ────────────────────────────────────────────────────────────────

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  // ── Sort toggle ──────────────────────────────────────────────────────────

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronDown size={14} className="opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp size={14} />
    ) : (
      <ChevronDown size={14} />
    );
  };

  // ── CSV Export ────────────────────────────────────────────────────────────

  const exportCSV = () => {
    const headers = [
      "Membership Number",
      "Full Name",
      "Surname",
      "Date of Birth",
      "ID Number",
      "Phone Number",
      "Email",
      "Residential Address",
      "Province",
      "City",
      "Area/Suburb",
      "Status",
      "Submitted At",
    ];

    const rows = filtered.map((a) => [
      a.membership_number,
      a.full_name,
      a.surname,
      a.date_of_birth,
      a.id_number,
      a.phone_number,
      a.email ?? "",
      a.residential_address,
      a.province,
      a.city,
      a.area_suburb,
      a.status ?? "",
      a.created_at ? new Date(a.created_at).toLocaleString("en-ZA") : "",
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shosh-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Member Applications</h1>
              <p className="text-muted-foreground mt-1">
                Manage and review all membership applications
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchApplications}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCSV}
                disabled={filtered.length === 0}
                className="gap-2"
              >
                <Download size={15} />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Total Applications"
              value={stats.total}
              color="bg-blue-500"
            />
            <StatCard
              icon={Clock}
              label="Pending Review"
              value={stats.pending}
              color="bg-yellow-500"
            />
            <StatCard
              icon={CheckCircle2}
              label="Approved"
              value={stats.approved}
              color="bg-green-600"
            />
            <StatCard
              icon={XCircle}
              label="Rejected"
              value={stats.rejected}
              color="bg-red-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search by name, membership number, ID, email, city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={provinceFilter} onValueChange={setProvinceFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Province" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border bg-card overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
                <Loader2 size={24} className="animate-spin" />
                <span>Loading applications…</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <XCircle size={40} className="text-red-400" />
                <p className="text-muted-foreground text-center max-w-sm">
                  {error}
                </p>
                <Button variant="outline" onClick={fetchApplications}>
                  Try Again
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                <Users size={40} className="opacity-30" />
                <p>
                  {applications.length === 0
                    ? "No applications yet."
                    : "No applications match your filters."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 border-b">
                    <tr>
                      {(
                        [
                          { label: "Submitted", field: "created_at" },
                          { label: "Membership #", field: null },
                          { label: "Full Name", field: "full_name" },
                          { label: "Province", field: "province" },
                          { label: "Phone", field: null },
                          { label: "Email", field: null },
                          { label: "Status", field: "status" },
                          { label: "", field: null },
                        ] as { label: string; field: SortField | null }[]
                      ).map(({ label, field }) => (
                        <th
                          key={label}
                          className={`px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap ${
                            field
                              ? "cursor-pointer select-none hover:text-foreground"
                              : ""
                          }`}
                          onClick={() => field && toggleSort(field)}
                        >
                          <span className="inline-flex items-center gap-1">
                            {label}
                            {field && <SortIcon field={field} />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((app, i) => (
                      <tr
                        key={app.id}
                        className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${
                          i % 2 === 0 ? "" : "bg-muted/10"
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                          {app.created_at
                            ? new Date(app.created_at).toLocaleDateString(
                                "en-ZA",
                              )
                            : "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-medium text-green-700">
                          {app.membership_number}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">
                          {app.full_name} {app.surname}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {app.province}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                          {app.phone_number}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                          {app.email || (
                            <span className="italic opacity-50">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={app.status ?? "pending"} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1.5 h-8"
                            onClick={() => {
                              setSelectedApp(app);
                              setModalOpen(true);
                            }}
                          >
                            <Eye size={14} />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer row */}
            {!loading && !error && filtered.length > 0 && (
              <div className="px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
                Showing {filtered.length} of {applications.length} application
                {applications.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Detail modal */}
      <ApplicationDetailModal
        app={selectedApp}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedApp(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default AdminApplications;
