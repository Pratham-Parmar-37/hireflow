# Service health and monitoring

The recruitment Overview contains recruitment KPIs and active hiring positions.
Platform > Service Health checks all eight Spring applications on demand and every
30 seconds while visible. It does not fetch business records to infer health.
Eureka Topology remains available for the architecture and registry.

The previous telemetry initialized every service as healthy, used opaque `no-cors`
requests, and marked exceptions healthy too. Its fixed "All 8 Online" label was
not evidence of availability. Operational status belongs in the dedicated view;
historical metrics belong in Grafana.

## Run

```sh
docker compose up -d --build
```

- Application: http://localhost:8088
- Grafana: http://localhost:3000/d/hireflow-services
- Prometheus targets: http://localhost:9090/targets
- Prometheus alert rules: http://localhost:9090/alerts

Grafana's local defaults are `admin` / `hireflow-local-admin`. Set
`GRAFANA_ADMIN_USER` and `GRAFANA_ADMIN_PASSWORD` in your environment before the
first start to override them. Grafana stores credentials in its persistent volume;
changing the variable after initialization does not reset an existing password.
Grafana and Prometheus bind to loopback. Remote operators should use an authenticated
reverse proxy or SSH forwarding and their deployment's monitoring URLs.

Prometheus, Grafana, and MongoDB use separate named volumes. Do not use
`docker compose down -v` when preserving existing data. Monitoring is independent
of application startup; no business service depends on a monitoring container.

## Signals

Every Spring application exposes status-only `GET /health` and Micrometer metrics
at `GET /prometheus`. Only these Actuator endpoints are exposed. MongoDB contributes
to health for the six domain services. Discovery and other standard Actuator health
contributors remain enabled. No business endpoints, entities, database names, or
OpenFeign calls have been changed.

The browser checks gateway health directly and checks the other seven services via
explicit GET-only `/api/platform/health/<service>` gateway routes. Domain routes
use Eureka load balancing; the registry route uses `MONITORING_EUREKA_URL` (default
`http://localhost:8761`, overridden by Compose). Each proxy route has a 2-second
connect timeout and 5-second response timeout; the browser aborts after 7 seconds.
Only HTTP success with JSON `status: UP` is healthy. `DOWN` and `OUT_OF_SERVICE`
are unhealthy; failed, timed-out, malformed, and other responses are unverified.
The displayed response time includes gateway routing. A gateway/discovery failure
can prevent verification of an otherwise healthy service.

Prometheus scrapes each container directly every 15 seconds, using internal ports
(gateway 8080, not host port 8088). The Blackbox exporter checks `/health`, requiring
HTTP 200 and the status-only `{"status":"UP"}` response. `probe_success` measures
application health; `up` measures whether metric collection succeeded. They are
separate panels so a live JVM with a failed database is not shown as healthy.
Missing samples display as no data, not as success.

Grafana is provisioned with health and scrape status, health history and latency,
business HTTP request/5xx rates, JVM heap, and CPU. Business rate panels exclude
health and metrics traffic. Prometheus retains 15 days of metrics. Rules flag
unhealthy services, failed metric scrapes, or unavailable probes after 2 minutes.
Rules appear in Prometheus; external notifications require an Alertmanager setup,
which is not configured here.

These targets describe the existing single-instance-per-service Compose topology.
For replicated or non-Compose deployments, configure service discovery/targets for
each instance. With JVMs running directly on the host, use host-reachable addresses
instead of Docker service names. Existing service ports and the discovery locator
are retained for compatibility; restrict access to those ports and metrics at your
deployment boundary if serving outside a trusted development environment.

## Verification

```sh
node --test tests/service-health.test.cjs
docker compose config --quiet
```

Against an **isolated test deployment**, run:

```sh
python tests/smoke-monitoring.py --gateway http://localhost:18088
```

The smoke test checks all eight health endpoints, creates/reads/updates/deletes
test records through all seven resource APIs, and checks the application-to-job
OpenFeign lookup. Its records are removed in a finally block. Do not point this
write test at production. Also verify a stopped service makes both its metric
scrape and health probe fail, then recover after restarting it.

Configuration references: [Spring Boot 3.2 Actuator](https://docs.spring.io/spring-boot/docs/3.2.x/reference/html/actuator.html),
[Blackbox exporter](https://github.com/prometheus/blackbox_exporter/blob/master/CONFIGURATION.md),
and [Grafana provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/).
