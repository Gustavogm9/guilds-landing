import { ReactNode } from 'react';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';
export type WidgetCategory = 'executive' | 'commercial' | 'operational' | 'financial' | 'people' | 'market' | 'security' | 'ai';
export type RefreshInterval = 'realtime' | '1m' | '5m' | '15m' | '30m' | '1h' | 'manual';

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  category: WidgetCategory;
  size: WidgetSize;
  position?: WidgetPosition;
  refreshInterval: RefreshInterval;
  isVisible: boolean;
  isResizable: boolean;
  isDraggable: boolean;
  settings: Record<string, any>;
  requiredPermissions?: string[];
  dataSource?: string;
  filters?: Record<string, any>;
}

export interface WidgetData {
  timestamp: Date;
  data: any;
  isLoading: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface Widget {
  config: WidgetConfig;
  data: WidgetData;
  component: React.ComponentType<WidgetComponentProps>;
}

export interface WidgetComponentProps {
  config: WidgetConfig;
  data: WidgetData;
  onConfigChange: (config: Partial<WidgetConfig>) => void;
  onRefresh: () => void;
  isEditing?: boolean;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: WidgetConfig[];
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Widget-specific data types
export interface RevenueIntelligenceData {
  mrr: number;
  arr: number;
  growth: number;
  churn: number;
  predictions: {
    next30Days: number;
    next90Days: number;
    nextYear: number;
  };
  trends: Array<{
    date: string;
    value: number;
  }>;
}

export interface FunnelWidgetData {
  stages: Array<{
    name: string;
    count: number;
    value: number;
    conversionRate: number;
    avgTimeInStage: number;
  }>;
  totalLeads: number;
  totalValue: number;
  overallConversion: number;
}

export interface CashFlowData {
  currentBalance: number;
  projectedBalance: number;
  inflow: number;
  outflow: number;
  netFlow: number;
  predictions: Array<{
    date: string;
    projected: number;
    conservative: number;
    optimistic: number;
  }>;
  alerts: Array<{
    type: 'warning' | 'danger';
    message: string;
    date: string;
  }>;
}

export interface CapacityData {
  teams: Array<{
    name: string;
    totalCapacity: number;
    usedCapacity: number;
    availableCapacity: number;
    projects: Array<{
      name: string;
      allocation: number;
      priority: 'high' | 'medium' | 'low';
    }>;
  }>;
  overallUtilization: number;
  bottlenecks: Array<{
    team: string;
    issue: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

export interface TeamHealthData {
  overallScore: number;
  metrics: {
    satisfaction: number;
    engagement: number;
    workload: number;
    burnoutRisk: number;
  };
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  alerts: Array<{
    type: 'burnout' | 'satisfaction' | 'engagement';
    member: string;
    message: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

export interface AIInsightsData {
  insights: Array<{
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    confidence: number;
    category: 'revenue' | 'operations' | 'team' | 'market';
    actionable: boolean;
    recommendedActions: string[];
  }>;
  anomalies: Array<{
    metric: string;
    currentValue: number;
    expectedValue: number;
    deviation: number;
    timestamp: Date;
  }>;
}

export interface SecurityWidgetData {
  overallScore: number;
  metrics: {
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    lastScan: Date;
    vulnerabilities: number;
    blockedAttempts: number;
    activeIncidents: number;
  };
  compliance: {
    lgpd: number;
    iso27001: number;
    gdpr: number;
  };
  recentEvents: Array<{
    type: 'blocked_ip' | 'rate_limit' | 'failed_login' | 'vulnerability';
    message: string;
    timestamp: Date;
    severity: 'low' | 'medium' | 'high';
  }>;
}