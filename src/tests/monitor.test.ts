import { MonitorService } from '../services/monitor';

const runTest = async () => {
  console.log('🧪 Starting MonitorService Integrity Test...');
  const service = new MonitorService();

  try {
    const start = Date.now();
    const stats = await service.collectStats();
    const duration = Date.now() - start;

    if (!stats) {
      console.error('❌ Test Failed: collectStats returned null');
      process.exit(1);
    }

    console.log('\n--- Response ---');
    console.log({ stats })

    // Assertions
    const checks = [
      { name: 'OS Platform Detected', valid: !!stats.os.platform && stats.os.platform.length > 0 },
      { name: 'CPU Cores Detected', valid: stats.cpu.cores > 0 },
      { name: 'Memory Total > 0', valid: stats.memory.total > 0 },
      { name: 'Disk Stats Present', valid: typeof stats.disk.total === 'number' },
      { name: 'Network Stats Present', valid: typeof stats.network.bytesRecvSec === 'number' },
      { name: 'Timestamp is Valid', valid: !isNaN(Date.parse(stats.timestamp)) },
    ];

    console.log('\n--- Results ---');
    let allPassed = true;

    checks.forEach(check => {
      if (check.valid) {
        console.log(`✅ ${check.name}`);
      } else {
        console.error(`❌ ${check.name} (Value: ${JSON.stringify(stats)})`);
        allPassed = false;
      }
    });

    console.log(`\n⏱️  Collection took ${duration}ms`);

    if (allPassed) {
      console.log('🎉 PASSED: MonitorService is functioning correctly.');
      process.exit(0);
    } else {
      console.error('⚠️  FAILED: Some metrics were missing or invalid.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error);
    process.exit(1);
  }
};

runTest();