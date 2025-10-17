import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Download, Eye } from "lucide-react";

const PAGE_SIZE = 20;

const ACTIVITY_TYPES = [
  "login", "logout", "create", "update", "delete", "export", "import", "view"
];

const USER_TYPES = [
  "admin", "super-admin", "approver", "viewer"
];

function formatDate(date: string) {
  return new Date(date).toLocaleString("id-ID");
}

export default function ActivityLogManagement({ userRole }: { userRole: string }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    user_type: "",
    activity_type: "",
    start_date: "",
    end_date: "",
    success: "",
  });
  const [sort, setSort] = useState({ field: "timestamp", order: "desc" });
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any | null>(null);

  // Fetch logs
  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      const params = new URLSearchParams({
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
        page: String(page),
        pageSize: String(PAGE_SIZE),
        sort: sort.field,
        order: sort.order,
      });
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/activity-log?${params.toString()}`, {
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      setLogs(data.data || []);
      setTotal(data.total || 0);
      setLoading(false);
    }
    fetchLogs();
  }, [filters, page, sort]);

  // Export handlers
  const handleExport = async (type: "csv" | "xlsx") => {
    const params = new URLSearchParams({
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
    });
    const token = localStorage.getItem("auth_token");
    
    // For exports, we need to fetch with auth and trigger download
    try {
      const res = await fetch(`/api/activity-log/export/${type}?${params.toString()}`, {
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error(`Export failed: ${res.statusText}`);
      }
      
      // Get the blob and create download link
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `activity_logs.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export logs. Please try again.');
    }
  };

  // Pagination
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Sorting
  const handleSort = (field: string) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "desc" ? "asc" : "desc",
    }));
  };

  // Filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setPage(1);
  };

  // Date range filter
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setPage(1);
  };

  // Success filter
  const handleSuccessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      success: e.target.value,
    }));
    setPage(1);
  };

  // Access control
  if (userRole !== "admin" && userRole !== "super-admin") {
    return (
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">Access Denied</h2>
        <p>Only admins can access the activity log dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">User Type</label>
          <select
            name="user_type"
            value={filters.user_type}
            onChange={handleFilterChange}
            className="w-40 border rounded px-2 py-1"
          >
            <option value="">All</option>
            {USER_TYPES.map((ut) => (
              <option key={ut} value={ut}>{ut}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Activity Type</label>
          <select
            name="activity_type"
            value={filters.activity_type}
            onChange={handleFilterChange}
            className="w-40 border rounded px-2 py-1"
          >
            <option value="">All</option>
            {ACTIVITY_TYPES.map((at) => (
              <option key={at} value={at}>{at}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Date From</label>
          <Input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleDateChange}
            className="w-40"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Date To</label>
          <Input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleDateChange}
            className="w-40"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Success</label>
          <select
            name="success"
            value={filters.success}
            onChange={handleSuccessChange}
            className="w-32 border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="true">Success</option>
            <option value="false">Failed</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport("xlsx")}>
            <Download className="w-4 h-4 mr-2" /> Export Excel
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto bg-card rounded shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer">Timestamp</TableHead>
              <TableHead onClick={() => handleSort("user_type")} className="cursor-pointer">User Type</TableHead>
              <TableHead onClick={() => handleSort("activity_type")} className="cursor-pointer">Activity Type</TableHead>
              <TableHead>Success</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No logs found.</TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.user_type}</Badge>
                  </TableCell>
                  <TableCell>{log.activity_type}</TableCell>
                  <TableCell>
                    {log.success === true ? (
                      <Badge variant="success">Success</Badge>
                    ) : log.success === false ? (
                      <Badge variant="destructive">Failed</Badge>
                    ) : (
                      <Badge variant="outline">-</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDetail(log)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </TableCell>
                  <TableCell>
                    {log.details && typeof log.details === "object" && (
                      <span className="truncate max-w-xs block">{JSON.stringify(log.details).slice(0, 40)}...</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-disabled={page === 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                isActive={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activity Log Detail</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-2">
              <div>
                <strong>ID:</strong> {detail.id}
              </div>
              <div>
                <strong>Timestamp:</strong> {formatDate(detail.timestamp)}
              </div>
              <div>
                <strong>User Type:</strong> {detail.user_type}
              </div>
              <div>
                <strong>Activity Type:</strong> {detail.activity_type}
              </div>
              <div>
                <strong>Success:</strong>{" "}
                {detail.success === true
                  ? "Success"
                  : detail.success === false
                  ? "Failed"
                  : "-"}
              </div>
              <div>
                <strong>Details (JSON):</strong>
                <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(detail.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}