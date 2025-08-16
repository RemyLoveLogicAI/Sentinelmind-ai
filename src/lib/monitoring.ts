/**
 * Production Monitoring and Analytics
 * Track performance, errors, and usage patterns
 */

export interface MetricEvent {
  type: 'performance' | 'error' | 'usage' | 'security';
  name: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: number;
}

export class Monitoring {
  private queue: MetricEvent[] = [];
  private flushInterval: number = 5000; // 5 seconds
  private maxQueueSize: number = 100;
  
  constructor(
    private analyticsEndpoint?: string,
    private apiKey?: string
  ) {
    // Auto-flush queue periodically
    if (this.analyticsEndpoint) {
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  // Track performance metrics
  trackPerformance(name: string, duration: number, metadata?: Record<string, any>) {
    this.track({
      type: 'performance',
      name,
      value: duration,
      metadata,
      timestamp: Date.now()
    });
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    this.track({
      type: 'error',
      name: error.name,
      metadata: {
        message: error.message,
        stack: error.stack,
        ...context
      },
      timestamp: Date.now()
    });
  }

  // Track usage events
  trackUsage(event: string, metadata?: Record<string, any>) {
    this.track({
      type: 'usage',
      name: event,
      metadata,
      timestamp: Date.now()
    });
  }

  // Track security events
  trackSecurity(event: string, threatLevel: string, metadata?: Record<string, any>) {
    this.track({
      type: 'security',
      name: event,
      metadata: {
        threatLevel,
        ...metadata
      },
      timestamp: Date.now()
    });
  }

  // Add event to queue
  private track(event: MetricEvent) {
    this.queue.push(event);
    
    // Flush if queue is full
    if (this.queue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  // Send metrics to analytics service
  private async flush() {
    if (this.queue.length === 0 || !this.analyticsEndpoint) {
      return;
    }

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch(this.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ events })
      });
    } catch (error) {
      console.error('Failed to send metrics:', error);
      // Re-queue events on failure (with limit)
      if (this.queue.length < this.maxQueueSize) {
        this.queue.unshift(...events.slice(0, this.maxQueueSize - this.queue.length));
      }
    }
  }

  // Performance timing helper
  async measurePerformance<T>(
    name: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      this.trackPerformance(name, duration);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.trackPerformance(name, duration, { error: true });
      this.trackError(error as Error, { operation: name });
      
      throw error;
    }
  }
}

// Security monitoring specific to hypnosis detection
export class HypnosisSecurityMonitor {
  private monitoring: Monitoring;
  private suspiciousPatterns: Map<string, number> = new Map();
  private alertThreshold: number = 5;

  constructor(monitoring: Monitoring) {
    this.monitoring = monitoring;
  }

  // Monitor for hypnotic attack patterns
  detectAttackPattern(
    pattern: string,
    source: string,
    confidence: number
  ) {
    const key = `${source}:${pattern}`;
    const count = (this.suspiciousPatterns.get(key) || 0) + 1;
    this.suspiciousPatterns.set(key, count);

    this.monitoring.trackSecurity('hypnotic_pattern_detected', 
      this.calculateThreatLevel(confidence, count),
      {
        pattern,
        source,
        confidence,
        occurrences: count
      }
    );

    // Trigger alert if threshold exceeded
    if (count >= this.alertThreshold) {
      this.triggerSecurityAlert(pattern, source, count);
    }
  }

  // Emergency protocol activation tracking
  trackEmergencyActivation(trigger: string, context: any) {
    this.monitoring.trackSecurity('emergency_protocol_activated', 'critical', {
      trigger,
      context,
      timestamp: new Date().toISOString()
    });
  }

  // Calculate threat level based on confidence and frequency
  private calculateThreatLevel(confidence: number, occurrences: number): string {
    const score = confidence * Math.log(occurrences + 1);
    
    if (score > 80) return 'critical';
    if (score > 60) return 'high';
    if (score > 40) return 'medium';
    if (score > 20) return 'low';
    return 'none';
  }

  // Trigger security alert
  private triggerSecurityAlert(pattern: string, source: string, count: number) {
    this.monitoring.trackSecurity('security_alert_triggered', 'critical', {
      pattern,
      source,
      occurrences: count,
      action: 'automatic_defense_activated'
    });

    // Reset counter after alert
    this.suspiciousPatterns.delete(`${source}:${pattern}`);
  }

  // Clear old patterns periodically
  clearOldPatterns() {
    // In production, you'd want to clear patterns older than X minutes
    this.suspiciousPatterns.clear();
  }
}

// Usage tracking for AI agents
export class AgentUsageTracker {
  private monitoring: Monitoring;

  constructor(monitoring: Monitoring) {
    this.monitoring = monitoring;
  }

  trackAgentInteraction(
    agentType: string,
    technique: string,
    effectiveness: number,
    sessionId: string
  ) {
    this.monitoring.trackUsage('agent_interaction', {
      agentType,
      technique,
      effectiveness,
      sessionId
    });
  }

  trackScriptGeneration(
    type: string,
    goal: string,
    intensity: string,
    userId?: string
  ) {
    this.monitoring.trackUsage('script_generated', {
      type,
      goal,
      intensity,
      userId
    });
  }

  trackPracticeSession(
    mode: string,
    difficulty: string,
    duration: number,
    success: boolean
  ) {
    this.monitoring.trackUsage('practice_session', {
      mode,
      difficulty,
      duration,
      success
    });
  }
}

// Export singleton instances
export const monitoring = new Monitoring(
  process.env.ANALYTICS_ENDPOINT,
  process.env.ANALYTICS_API_KEY
);

export const securityMonitor = new HypnosisSecurityMonitor(monitoring);
export const usageTracker = new AgentUsageTracker(monitoring);