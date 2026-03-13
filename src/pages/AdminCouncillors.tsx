import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<CouncillorRow[]>([]);

  const sorted = useMemo(() => applications, [applications]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/admin-list-councillor-applications", {
        method: "GET",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ""}`);
      }

      const data = (await res.json()) as { applications: CouncillorRow[] };
      setApplications(Array.isArray(data.applications) ? data.applications : []);
    } catch (e) {
      setApplications([]);
      const msg = e instanceof Error ? e.message : String(e);
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-2">Councillor Applications</h1>
          <p className="text-muted-foreground mb-6">Admin dashboard</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
            <Button onClick={load} disabled={loading}>
              {loading ? "Loading..." : "Load applications"}
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
                      {loading ? "Loading..." : "No applications loaded"}
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
