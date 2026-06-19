import { prisma } from "@/lib/prisma";

export default async function AdminLogsPage() {
  const logs = await prisma.adminLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Admin Logs</h1>
      <p className="text-muted text-sm mb-8">Recent admin actions</p>

      <div className="glass rounded-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-xs text-muted uppercase tracking-wider">
              <th className="text-left px-4 py-3">Action</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Entity</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Details</th>
              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.action.includes("CREATE") ? "bg-green-400/10 text-green-400" :
                    log.action.includes("DELETE") ? "bg-red-400/10 text-red-400" :
                    "bg-blue-400/10 text-blue-400"
                  }`}>
                    {log.action.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell">{log.entity}</td>
                <td className="px-4 py-3 text-xs text-muted hidden lg:table-cell truncate max-w-xs">
                  {log.details ? JSON.stringify(log.details) : "-"}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="text-center py-12 text-muted">No logs yet</div>
        )}
      </div>
    </div>
  );
}
