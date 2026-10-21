export type HealthComponentStatus = 'up' | 'down' | 'disabled';
export type SystemHealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthComponentResult {
  key:
    | 'application'
    | 'database'
    | 'redis'
    | 'memory'
    | 'eventLoop'
    | 'grafana'
    | 'otelCollector'
    | 'tempo'
    | 'loki'
    | 'prometheus';
  status: HealthComponentStatus;
  required: boolean;
  weight: number;
  latencyMs: number;
  details?: Record<string, string | number | boolean>;
}

export interface SystemHealthScore {
  status: SystemHealthStatus;
  score: number;
  checkedAt: string;
  uptimeSeconds: number;
  components: HealthComponentResult[];
}
