export interface OsStats {
  platform: string;
  distro: string;
  hostname: string;
  release: string;
  arch: string;
}

export interface CpuStats {
  usagePercent: number;
  cores: number;
  speed: number;
  brand: string;
}

export interface MemoryStats {
  total: number;
  used: number;
  free: number;
  active: number;
  usagePercent: number;
}

export interface DiskStats {
  total: number;
  used: number;
  usagePercent: number;
  name: string;
}

export interface NetworkStats {
  bytesRecvSec: number;
  bytesSentSec: number;
  interfaceName: string;
}

export interface TelemetryPayload {
  os: OsStats;
  cpu: CpuStats;
  memory: MemoryStats;
  disk: DiskStats;
  network: NetworkStats;
  uptimeSeconds: number;
  timestamp: string;
}