import si from 'systeminformation';
import { TelemetryPayload } from '../types/telemetry';
import { logger } from '../utils/logger';

export class MonitorService {
  /**
   * Collects comprehensive system metrics
   */
  public async collectStats(): Promise<TelemetryPayload | null> {
    try {
      const [osInfo, cpu, currentLoad, mem, fsSize, networkStats, time] = await Promise.all([
        si.osInfo(),
        si.cpu(),
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.networkStats(),
        si.time(),
      ]);

      // Get primary disk (usually mounted on /)
      const mainDisk = fsSize.length > 0 ? fsSize[0] : { size: 0, used: 0, use: 0, fs: 'N/A' };

      // Aggregate network traffic across all interfaces
      const netRx = networkStats.reduce((acc, iface) => acc + iface.rx_sec, 0);
      const netTx = networkStats.reduce((acc, iface) => acc + iface.tx_sec, 0);

      const payload: TelemetryPayload = {
        os: {
          platform: osInfo.platform,
          distro: osInfo.distro,
          release: osInfo.release,
          hostname: osInfo.hostname,
          arch: osInfo.arch,
        },
        cpu: {
          usagePercent: currentLoad.currentLoad,
          cores: cpu.cores,
          speed: cpu.speed,
          brand: cpu.brand,
        },
        memory: {
          total: mem.total,
          used: mem.used,
          free: mem.free,
          active: mem.active,
          usagePercent: (mem.used / mem.total) * 100,
        },
        disk: {
          total: mainDisk.size,
          used: mainDisk.used,
          usagePercent: mainDisk.use,
          name: mainDisk.fs,
        },
        network: {
          bytesRecvSec: netRx,
          bytesSentSec: netTx,
          interfaceName: 'aggregate',
        },
        uptimeSeconds: time.uptime,
        timestamp: new Date().toISOString(),
      };

      return payload;
    } catch (error) {
      logger.error('Failed to collect system metrics', error);
      return null;
    }
  }
}