/**
 * Simple performance monitoring for API endpoints
 */

export class PerformanceMonitor {
  private startTime: number;
  private checkpoints: Map<string, number> = new Map();

  constructor(private operation: string) {
    this.startTime = performance.now();
    console.log(`🚀 Starting: ${operation}`);
  }

  checkpoint(name: string): void {
    const now = performance.now();
    const elapsed = now - this.startTime;
    this.checkpoints.set(name, elapsed);
    console.log(`⏱️  ${this.operation} - ${name}: ${elapsed.toFixed(2)}ms`);
  }

  finish(success: boolean = true): void {
    const totalTime = performance.now() - this.startTime;
    const status = success ? '✅' : '❌';
    console.log(`${status} ${this.operation} completed in ${totalTime.toFixed(2)}ms`);
    
    // Log checkpoint summary
    if (this.checkpoints.size > 0) {
      console.log(`📊 ${this.operation} breakdown:`);
      for (const [name, time] of this.checkpoints) {
        console.log(`   - ${name}: ${time.toFixed(2)}ms`);
      }
    }
  }
}

export function withPerformanceMonitoring<T>(
  operation: string,
  fn: (monitor: PerformanceMonitor) => Promise<T>
): Promise<T> {
  const monitor = new PerformanceMonitor(operation);
  
  return fn(monitor)
    .then(result => {
      monitor.finish(true);
      return result;
    })
    .catch(error => {
      monitor.finish(false);
      throw error;
    });
}