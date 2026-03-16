import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

type CouncillorRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  municipality: string;
};

const AdminCouncillors = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<CouncillorRow[]>([]);

  const sorted = useMemo(() => {
    return [...applications].sort((a, b) => {
      const aDate = new Date(a.created_at).getTime();
      const bDate = new Date(b.created_at).getTime();
      return bDate - aDate;
    });
  }, [applications]);

  const load = () => {
    try {
      const stored = localStorage.getItem("shosh_councillor_applications");
      const data = stored ? JSON.parse(stored) : [];
      setApplications(Array.isArray(data) ? data : []);
      toast({
        title: "Loaded",
        description: `${Array.isArray(data) ? data.length : 0} applications loaded from localStorage. (${window.location.origin})`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportToCSV = () => {
    if (applications.length === 0) {
      toast({
        title: "No data",
        description: "No applications to export.",
      });
      return;
    }

    const headers = ["ID", "Created At", "Name", "Email", "Phone", "Municipality"];
    const rows = applications.map((a) => [
      a.id,
      a.created_at,
      a.name,
      a.email,
      a.phone,
      a.municipality,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `shosh-councillor-applications-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exported",
      description: "Applications exported to CSV.",
    });
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all applications from localStorage?")) {
      localStorage.removeItem("shosh_councillor_applications");
      setApplications([]);
      toast({
        title: "Cleared",
        description: "All applications cleared from localStorage.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-2">Councillor Applications</h1>
          <p className="text-muted-foreground mb-6">Admin dashboard (localStorage)</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
            <Button onClick={load} variant="default">
              Load from localStorage
            </Button>
            <Button onClick={exportToCSV} variant="outline" disabled={applications.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={clearAll} variant="destructive" disabled={applications.length === 0}>
              Clear All
            </Button>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Municipality</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No applications loaded. Click "Load from localStorage" to view.
                    </TableCell>
                  </TableRow>
                ) : (
                  sorted.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{new Date(a.created_at).toLocaleString("en-ZA")}</TableCell>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell>{a.email}</TableCell>
                      <TableCell>{a.phone}</TableCell>
                      <TableCell>{a.municipality}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCouncillors;
