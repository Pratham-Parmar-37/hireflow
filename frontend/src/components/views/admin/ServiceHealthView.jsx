import React, { useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { RefreshCw, ExternalLink } from 'lucide-react';

export default function ServiceHealthView() {
  const {
    serviceHealth,
    isHealthChecking,
    lastHealthCheck,
    refreshHealth
  } = useApp();

  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  const healthyCount = serviceHealth.filter(s => s.status === 'healthy').length;

  const labels = {
    healthy: 'Healthy',
    down: 'Unhealthy',
    unknown: 'Unverified',
    checking: 'Checking…'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="view-header">
        <div>
          <h1 className="view-title">Service Health & Topology</h1>
          <p className="view-desc">
            Distributed microservices status verified through Spring Cloud Gateway routing & Eureka service registry.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={refreshHealth}
          disabled={isHealthChecking}
        >
          <RefreshCw size={14} className={isHealthChecking ? 'animate-spin' : ''} />
          {isHealthChecking ? 'Checking…' : 'Check Health'}
        </button>
      </div>

      {/* Health Overview Card */}
      <div className="panel-card">
        <div className="panel-header">
          <span className="panel-title">Microservices Ecosystem</span>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: healthyCount === serviceHealth.length ? 'var(--success-text)' : 'var(--text-secondary)'
            }}
          >
            {isHealthChecking ? 'Verifying health...' : `${healthyCount} of ${serviceHealth.length} healthy`}
          </span>
        </div>

        <div className="panel-body">
          <p className="view-desc" style={{ marginBottom: '1rem' }}>
            {lastHealthCheck
              ? `Last checked at ${lastHealthCheck}. Latency measurements include API Gateway round-trip routing.`
              : 'Click "Check Health" to verify live health pings across all microservice instances.'}
          </p>

          <div className="service-list">
            {serviceHealth.map(service => {
              const isHealthy = service.status === 'healthy';
              const isDown = service.status === 'down';

              return (
                <div key={service.name} className="service-row">
                  <div className="service-row-left">
                    <span
                      className={`status-dot-indicator ${
                        isHealthy ? '' : isDown ? 'down' : 'unknown'
                      }`}
                    />
                    <div>
                      <div className="service-row-name">{service.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                        Port {service.port} &bull; {service.tech}
                      </div>
                    </div>
                  </div>

                  <div className="service-row-right">
                    <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                      {labels[service.status] || 'Unverified'}
                    </span>
                    <span className="latency-pill">{service.latency || '—'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monitoring & Observability Integration */}
      <div className="panel-card monitoring-links">
        <h2 className="panel-title" style={{ marginBottom: '0.35rem' }}>
          Monitoring History & Metrics
        </h2>
        <p className="view-desc">
          Grafana tracks health history, request rates, latency distributions, and JVM metrics. Prometheus scrapes actuator endpoints independently.
        </p>

        <div style={{ display: 'flex', gap: '0.65rem', margin: '1rem 0' }}>
          <a
            className="btn btn-secondary"
            href={import.meta.env.VITE_GRAFANA_URL || "http://localhost:3000/d/hireflow-services"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            Open Grafana <ExternalLink size={12} />
          </a>
          <a
            className="btn btn-secondary"
            href={import.meta.env.VITE_PROMETHEUS_URL || "http://localhost:9090/targets"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            Open Prometheus <ExternalLink size={12} />
          </a>
        </div>

        <p className="view-desc" style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
          Ports 3000 and 9090 are bound to the Docker host network. For production clusters, configure operator routing.
        </p>
      </div>
    </div>
  );
}
