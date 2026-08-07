"use client";

import Link from "next/link";
import {
  MusicNotes, Headphones, CheckCircle, Spinner,
  XCircle, Archive, ArrowRight, TrendUp,
} from "@phosphor-icons/react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { StatCard, CoverArt, ProgressBar } from "@/components/ui/index";
import { Badge } from "@/components/ui/Badge";
import { StatCardSkeleton, ListRowSkeleton } from "@/components/skeletons";
import { useDashboardStats } from "@/hooks/dashboard/useDashboardStats";
import { usePlaylists } from "@/hooks/playlists/usePlaylists";
import { useDownloadJobs } from "@/hooks/downloads/useDownloadJobs";
import { getPlaylistProgress, formatRelative, formatBytes } from "@/lib/utils";

const WEEK_DATA = [
  { date: "Seg", completed: 12, failed: 1 },
  { date: "Ter", completed: 8,  failed: 0 },
  { date: "Qua", completed: 20, failed: 2 },
  { date: "Qui", completed: 15, failed: 1 },
  { date: "Sex", completed: 25, failed: 0 },
  { date: "Sáb", completed: 10, failed: 3 },
  { date: "Dom", completed: 18, failed: 0 },
];

const STORAGE_DATA = [
  { name: "Músicas",     value: 650,  fill: "#6C63FF" },
  { name: "Exportações", value: 200,  fill: "#43D9AD" },
  { name: "Livre",       value: 4294, fill: "rgba(255,255,255,0.06)" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 5 }}>{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: e.color }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            {e.name === "completed" ? "Concluídos" : "Falhas"}: <strong style={{ color: "#fff" }}>{e.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
};

export function DashboardView() {
  const { data: dashboardData, isLoading: sLoading } = useDashboardStats();

  const stats = dashboardData?.stats;
  const recentPlaylists = dashboardData?.recentPlaylists ?? [];
  const recentDownloads = dashboardData?.recentDownloads ?? [];

  const completedCount = stats?.completedDownloads ?? 0;
  const exportsCount = stats?.totalExports ?? 0;
  const storageUsed = stats?.storageUsedMb ?? Math.round(completedCount * 6.5);
  const storageExports = Math.round(exportsCount * 12);
  const storageCapacity = stats?.storageCapacityMb ?? 5120;
  const storageFree = Math.max(0, storageCapacity - storageUsed - storageExports);

  const storageData = [
    { name: "Músicas",     value: storageUsed,  fill: "#6C63FF" },
    { name: "Exportações", value: storageExports,  fill: "#43D9AD" },
    { name: "Livre",       value: storageFree, fill: "rgba(255,255,255,0.06)" },
  ];

  const weekData = [
    { date: "Seg", completed: Math.round(completedCount * 0.1), failed: Math.round((stats?.failedDownloads ?? 0) * 0.1) },
    { date: "Ter", completed: Math.round(completedCount * 0.15), failed: 0 },
    { date: "Qua", completed: Math.round(completedCount * 0.2), failed: Math.round((stats?.failedDownloads ?? 0) * 0.2) },
    { date: "Qui", completed: Math.round(completedCount * 0.15), failed: 0 },
    { date: "Sex", completed: Math.round(completedCount * 0.25), failed: 0 },
    { date: "Sáb", completed: Math.round(completedCount * 0.05), failed: Math.round((stats?.failedDownloads ?? 0) * 0.5) },
    { date: "Dom", completed: Math.round(completedCount * 0.1), failed: Math.round((stats?.failedDownloads ?? 0) * 0.2) },
  ];

  return (
    <div style={{ padding: 24 }} className="sv-fade-in">

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12, marginBottom: 22 }}>
        {sLoading ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />) : stats ? (
          <>
            <StatCard label="Playlists"   value={stats.totalPlaylists}      icon={<MusicNotes  size={20} weight="duotone" />} color="#6C63FF" />
            <StatCard label="Músicas"     value={stats.totalTracks}         icon={<Headphones  size={20} weight="duotone" />} color="#43D9AD" />
            <StatCard label="Concluídos"  value={stats.completedDownloads}  icon={<CheckCircle size={20} weight="duotone" />} color="#22c55e" />
            <StatCard label="Processando" value={stats.processingDownloads} icon={<Spinner     size={20} weight="duotone" />} color="#3b82f6" />
            <StatCard label="Falhas"      value={stats.failedDownloads}     icon={<XCircle     size={20} weight="duotone" />} color="#ef4444" />
            <StatCard label="Exportações" value={stats.totalExports ?? 0}   icon={<Archive     size={20} weight="duotone" />} color="#a78bfa" />
          </>
        ) : null}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 18 }}>

        <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}>
            <TrendUp size={15} weight="duotone" style={{ color: "#6C63FF" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>Downloads esta semana</span>
          </div>
          <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
            {[{ label: "Concluídos", color: "#6C63FF" }, { label: "Falhas", color: "#ef4444" }].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{l.label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={weekData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6C63FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="completed" stroke="#6C63FF" strokeWidth={2} fill="url(#gc)" dot={false} />
              <Area type="monotone" dataKey="failed"    stroke="#ef4444" strokeWidth={2} fill="url(#gf)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Armazenamento</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
            {formatBytes(storageUsed)} / {formatBytes(storageCapacity)}
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={storageData} cx="50%" cy="50%" innerRadius={44} outerRadius={62} dataKey="value" paddingAngle={2}>
                {storageData.map((entry, i) => <Cell key={i} fill={entry.fill} stroke="transparent" />)}
              </Pie>
              <Tooltip
                formatter={(v: number) => [formatBytes(v), ""]}
                contentStyle={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 6 }}>
            {storageData.filter((d) => d.name !== "Livre").map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.fill, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", flex: 1 }}>{d.name}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{formatBytes(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>Últimas Playlists</span>
            <Link href="/playlists" style={{ display: "flex", alignItems: "center", gap: 4, color: "#6C63FF", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>
              Ver todas <ArrowRight size={11} weight="bold" />
            </Link>
          </div>
          {sLoading
            ? Array.from({ length: 4 }).map((_, i) => <ListRowSkeleton key={i} withProgress />)
            : (recentPlaylists).map((pl) => (
                <Link key={pl.id} href={`/playlists/${pl.id}`} className="sv-row"
                  style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", textDecoration: "none", transition: "background 0.15s" }}>
                  <CoverArt color={pl.color ?? "#6C63FF"} name={pl.name} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.82)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pl.name}</div>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.32)", marginTop: 2 }}>
                      Playlist ativa
                    </div>
                  </div>
                </Link>
              ))
          }
        </div>

        <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>Últimos Downloads</span>
            <Link href="/downloads" style={{ display: "flex", alignItems: "center", gap: 4, color: "#6C63FF", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>
              Ver todos <ArrowRight size={11} weight="bold" />
            </Link>
          </div>
          {sLoading
            ? Array.from({ length: 5 }).map((_, i) => <ListRowSkeleton key={i} />)
            : (recentDownloads).map((job) => (
                <div key={job.id} className="sv-row"
                  style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.78)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {job.trackName ?? "—"}
                    </div>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>
                      {job.playlistName ?? "—"}
                    </div>
                  </div>
                  <Badge status={job.status.toLowerCase() as any} />
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}
