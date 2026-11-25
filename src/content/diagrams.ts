import type { Evidence } from "./projects";

export type DiagramNode = {
  id: string;
  label: string;
  sub?: string;
  /** Grid position; one unit is a column (x) or row (y) of the canvas. */
  x: number;
  y: number;
  evidence: Evidence | "context";
  detail: string;
};

export type DiagramZone = { id: string; label: string; x: number; y: number; w: number; h: number };

export type DiagramEdge = { from: string; to: string; label?: string; dashed?: boolean };

export type Diagram = {
  title: string;
  description: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  zones?: DiagramZone[];
};

export const diagrams = {
  "eks-platform": {
    title: "AWS EKS platform",
    description: "Traffic enters through an Application Load Balancer, reaches Helm-released services on managed node groups, and Argo CD keeps the cluster in sync with Git.",
    zones: [
      { id: "aws", label: "AWS account", x: 0.85, y: -0.55, w: 4.35, h: 5.05 },
      { id: "vpc", label: "Amazon VPC · public & private subnets", x: 1, y: 0.35, w: 3.05, h: 3.95 },
      { id: "eks", label: "EKS cluster", x: 1.95, y: 0.6, w: 2, h: 3.55 },
    ],
    nodes: [
      { id: "users", label: "Users", sub: "HTTPS", x: 0, y: 1, evidence: "context", detail: "Browser and API clients reaching the platform over HTTPS." },
      { id: "git", label: "Git repository", sub: "Helm charts · values", x: 0, y: 2.6, evidence: "practice", detail: "Single source of truth for application charts and per-environment values that Argo CD watches." },
      { id: "ecr", label: "Amazon ECR", sub: "Private images", x: 0, y: 3.9, evidence: "practice", detail: "Private container registry; node groups pull only scanned, immutable tags." },
      { id: "eksctl", label: "eksctl", sub: "Cluster + node group", x: 0, y: -0.2, evidence: "documented", detail: "Creates the EKS cluster, its VPC/subnets and a managed node group from the CLI — documented step by step on BinaryBlogs." },
      { id: "iam", label: "AWS IAM", sub: "Cluster · node · workload roles", x: 4.25, y: -0.2, evidence: "documented", detail: "An IAM role with EKS permissions for cluster operations, plus separate roles for node groups and service accounts." },
      { id: "alb", label: "Application Load Balancer", sub: "Public subnet", x: 1.05, y: 1, evidence: "practice", detail: "Provisioned by the AWS Load Balancer Controller from Kubernetes Ingress resources; the only public entry point." },
      { id: "ingress", label: "Ingress controller", sub: "Routing rules", x: 2, y: 1, evidence: "documented", detail: "Ingress controller installation is covered in the K3S + Helm article; on EKS it backs onto the ALB." },
      { id: "apps", label: "Services & pods", sub: "Helm releases", x: 3, y: 1, evidence: "documented", detail: "Applications packaged as Helm charts and released per environment." },
      { id: "cp", label: "EKS control plane", sub: "Managed by AWS", x: 2, y: 2.35, evidence: "documented", detail: "AWS-managed Kubernetes API server and etcd." },
      { id: "nodes", label: "Managed node group", sub: "EC2 workers · private subnets", x: 3, y: 2.35, evidence: "documented", detail: "EC2 worker nodes created with eksctl (--nodegroup-name, --nodes) and scaled by node count." },
      { id: "argocd", label: "Argo CD", sub: "GitOps sync", x: 2, y: 3.55, evidence: "practice", detail: "Reconciles the cluster with the Git repository so releases happen through pull requests, not kubectl." },
    ],
    edges: [
      { from: "users", to: "alb", label: "HTTPS" },
      { from: "alb", to: "ingress" },
      { from: "ingress", to: "apps" },
      { from: "cp", to: "nodes", label: "schedules" },
      { from: "apps", to: "nodes", label: "runs on", dashed: true },
      { from: "git", to: "argocd", label: "watch" },
      { from: "argocd", to: "cp", label: "helm sync" },
      { from: "ecr", to: "nodes", label: "image pull" },
      { from: "eksctl", to: "cp", label: "provisions" },
      { from: "iam", to: "nodes", dashed: true },
    ],
  },
  devsecops: {
    title: "DevSecOps pipeline",
    description: "Every change is built, tested and scanned before an image can reach the registry; staging is probed with OWASP ZAP before promotion.",
    zones: [
      { id: "ci", label: "CI · Jenkins / GitLab CI", x: -0.15, y: -0.4, w: 4.13, h: 2.45 },
      { id: "cd", label: "CD · GitOps", x: 0.85, y: 2.05, w: 4.13, h: 1.15 },
    ],
    nodes: [
      { id: "git", label: "GitHub / GitLab", sub: "Push · merge request", x: 0, y: 0, evidence: "practice", detail: "A push or merge request triggers the pipeline." },
      { id: "build", label: "Build & unit tests", sub: "Compile · test", x: 1, y: 0, evidence: "practice", detail: "Fast feedback: compilation and unit tests on every change." },
      { id: "sast", label: "Static & secret scan", sub: "Source and dependencies", x: 2, y: 0, evidence: "practice", detail: "Scans source and dependency manifests for vulnerable packages and committed secrets." },
      { id: "image", label: "Docker image build", sub: "Tagged by commit", x: 1, y: 1.2, evidence: "practice", detail: "Builds an immutable image per commit from a maintained base image." },
      { id: "trivy", label: "Trivy image scan", sub: "OS + library CVEs", x: 2, y: 1.2, evidence: "practice", detail: "Scans the image; critical and high findings with a fix available fail the build." },
      { id: "gate", label: "Quality & security gate", sub: "Block or pass", x: 3, y: 0.6, evidence: "practice", detail: "Combines test results and scan results into a single pass/fail decision." },
      { id: "registry", label: "Image registry", sub: "Amazon ECR / Harbor", x: 4.25, y: 0.6, evidence: "practice", detail: "Only images that passed the gate are pushed; production pulls only these tags." },
      { id: "deploy", label: "Helm / Argo CD", sub: "Deploy", x: 4, y: 2.4, evidence: "practice", detail: "Argo CD applies Helm releases to the target namespace." },
      { id: "k8s", label: "Kubernetes", sub: "Staging → production", x: 3, y: 2.4, evidence: "documented", detail: "Kubernetes clusters (EKS, K3S, kubeadm) are documented on BinaryBlogs." },
      { id: "zap", label: "OWASP ZAP", sub: "DAST on staging", x: 2, y: 2.4, evidence: "practice", detail: "Dynamic scan against staging before promotion; findings flow back to the gate." },
      { id: "report", label: "Reports & audit", sub: "Archived per build", x: 1, y: 2.4, evidence: "practice", detail: "Scan and test reports stored with the build for traceability." },
    ],
    edges: [
      { from: "git", to: "build" },
      { from: "build", to: "sast" },
      { from: "build", to: "image" },
      { from: "image", to: "trivy" },
      { from: "sast", to: "gate" },
      { from: "trivy", to: "gate", label: "fail on critical" },
      { from: "gate", to: "registry", label: "push" },
      { from: "registry", to: "deploy" },
      { from: "deploy", to: "k8s" },
      { from: "k8s", to: "zap", label: "staging" },
      { from: "zap", to: "report", dashed: true },
      { from: "gate", to: "report", dashed: true },
    ],
  },
  "gui-automation": {
    title: "GUI test automation framework",
    description: "Suites describe what to test, page objects and keywords describe how to drive the UI, and the same framework runs locally, on a grid and in CI.",
    zones: [{ id: "fw", label: "Automation framework", x: 1.85, y: -0.4, w: 2.13, h: 2.45 }],
    nodes: [
      { id: "req", label: "Requirements", sub: "User stories · risks", x: 0, y: 0.6, evidence: "context", detail: "User journeys and risk areas that the suites must cover." },
      { id: "plan", label: "Test plan", sub: "Scope · levels · criteria", x: 1, y: 0, evidence: "documented", detail: "Scope, environments, entry/exit criteria — test planning is covered in my testing articles." },
      { id: "cases", label: "Test cases & data", sub: "Positive · negative", x: 1, y: 1.2, evidence: "documented", detail: "Reusable web UI test cases, published as a checklist on BinaryBlogs." },
      { id: "suites", label: "Test suites", sub: "Selenium · Playwright · Robot", x: 2, y: 0, evidence: "practice", detail: "Smoke, regression and cross-browser suites, written against page objects or keywords." },
      { id: "pages", label: "Page objects / keywords", sub: "One place per screen", x: 3, y: 0, evidence: "practice", detail: "Locators and interactions for each screen; UI changes are fixed here once." },
      { id: "config", label: "Data & config", sub: "Env · users · browsers", x: 2, y: 1.2, evidence: "practice", detail: "Environment URLs, test accounts and browser matrix kept outside the code." },
      { id: "core", label: "Core utilities", sub: "Waits · retries · evidence", x: 3, y: 1.2, evidence: "practice", detail: "Explicit waits, retry of known transient errors, screenshot and log capture." },
      { id: "ci", label: "CI trigger", sub: "MR · nightly · release", x: 4.25, y: -1.1, evidence: "practice", detail: "Jenkins or GitLab CI starts the suites after a deploy to QA/staging." },
      { id: "grid", label: "Parallel execution", sub: "Selenium Grid · Playwright workers", x: 4.25, y: 0, evidence: "practice", detail: "Runs tests in parallel across Chrome, Firefox and Edge." },
      { id: "report", label: "Reports", sub: "JUnit XML · HTML / Allure", x: 4.25, y: 1.2, evidence: "practice", detail: "Results with screenshots and logs published as CI artifacts." },
      { id: "defects", label: "Defect triage", sub: "Jira", x: 4.25, y: 2.4, evidence: "practice", detail: "Failures raised as defects with the captured evidence attached." },
    ],
    edges: [
      { from: "req", to: "plan" },
      { from: "req", to: "cases" },
      { from: "plan", to: "suites" },
      { from: "cases", to: "config" },
      { from: "suites", to: "pages" },
      { from: "config", to: "core", dashed: true },
      { from: "pages", to: "core", dashed: true },
      { from: "ci", to: "grid", label: "runs" },
      { from: "pages", to: "grid" },
      { from: "grid", to: "report" },
      { from: "report", to: "defects", label: "failures" },
    ],
  },
  "cicd-plan": {
    title: "CI/CD delivery plan",
    description: "One artifact is built per commit and promoted through staging to production, with automated gates at every step and a rollback path defined up front.",
    zones: [
      { id: "ci", label: "Continuous integration", x: -0.15, y: -0.4, w: 4.13, h: 1.25 },
      { id: "cd", label: "Continuous delivery", x: -0.15, y: 1.1, w: 4.13, h: 2.6 },
    ],
    nodes: [
      { id: "commit", label: "Commit / MR", sub: "Protected branches", x: 0, y: 0, evidence: "plan", detail: "Merge requests require review and a green pipeline." },
      { id: "build", label: "Build & unit tests", sub: "Lint · compile · test", x: 1, y: 0, evidence: "plan", detail: "Fast stage on every commit." },
      { id: "static", label: "Static analysis", sub: "Coverage threshold", x: 2, y: 0, evidence: "plan", detail: "Blocks the merge if quality or coverage thresholds fail." },
      { id: "artifact", label: "Versioned artifact", sub: "Image tagged by commit", x: 3, y: 0, evidence: "plan", detail: "Built once, promoted unchanged through every environment." },
      { id: "staging", label: "Deploy to staging", sub: "Helm", x: 3, y: 1.6, evidence: "documented", detail: "Helm release to the staging namespace; Helm usage is covered on BinaryBlogs." },
      { id: "api", label: "API & GUI regression", sub: "Postman · Selenium / Playwright", x: 2, y: 1.6, evidence: "practice", detail: "Automated API and GUI suites from the GUI automation framework." },
      { id: "perf", label: "Performance baseline", sub: "JMeter", x: 2, y: 2.8, evidence: "documented", detail: "Load test compared with the previous baseline; JMeter is documented on BinaryBlogs." },
      { id: "gate", label: "Release gate", sub: "Results + approval", x: 1, y: 1.6, evidence: "plan", detail: "Test results, open critical defects and a manual approval decide promotion." },
      { id: "prod", label: "Production deploy", sub: "Rolling / blue-green", x: 0, y: 1.6, evidence: "plan", detail: "Low-risk rollout strategy with the same artifact." },
      { id: "health", label: "Smoke & health checks", sub: "curl · kubectl", x: 0, y: 2.8, evidence: "code", detail: "Post-deploy checks based on my public Application_HealthCheck and Minikube_deploy scripts." },
      { id: "rollback", label: "Rollback", sub: "helm rollback", x: 1, y: 2.8, evidence: "plan", detail: "A failed health check returns to the previous Helm release." },
    ],
    edges: [
      { from: "commit", to: "build" },
      { from: "build", to: "static" },
      { from: "static", to: "artifact", label: "gate" },
      { from: "artifact", to: "staging", label: "promote" },
      { from: "staging", to: "api" },
      { from: "staging", to: "perf" },
      { from: "api", to: "gate" },
      { from: "perf", to: "gate" },
      { from: "gate", to: "prod", label: "approve" },
      { from: "prod", to: "health" },
      { from: "health", to: "rollback", label: "on failure", dashed: true },
    ],
  },
  "quality-engineering": {
    title: "Quality engineering lifecycle",
    description: "Quality starts with risk-based planning, uses the cheapest test level that gives confidence, and ends with a report that supports a release decision.",
    zones: [{ id: "layers", label: "Automated test layers", x: 1.6, y: -0.4, w: 1.13, h: 4.8 }],
    nodes: [
      { id: "req", label: "Requirements", sub: "Stories · acceptance criteria", x: 0, y: 0.6, evidence: "context", detail: "Input to planning." },
      { id: "plan", label: "Test planning", sub: "Risk matrix · scope · criteria", x: 0, y: 1.8, evidence: "documented", detail: "Agile and Waterfall planning approaches are documented on BinaryBlogs." },
      { id: "design", label: "Test design", sub: "Cases · data · negative paths", x: 0, y: 3, evidence: "documented", detail: "Web application and penetration-testing test cases are published on BinaryBlogs." },
      { id: "api", label: "API tests", sub: "Postman · SoapUI", x: 1.75, y: 0, evidence: "documented", detail: "Contract and functional checks at the service level." },
      { id: "gui", label: "GUI tests", sub: "Selenium · Playwright · Robot", x: 1.75, y: 1.2, evidence: "practice", detail: "Critical user journeys only." },
      { id: "perf", label: "Performance", sub: "JMeter", x: 1.75, y: 2.4, evidence: "documented", detail: "Load and stress tests against a baseline." },
      { id: "sec", label: "Security", sub: "OWASP ZAP · pen-test cases", x: 1.75, y: 3.6, evidence: "practice", detail: "Dynamic scanning on staging and manual security cases." },
      { id: "gate", label: "CI quality gates", sub: "Jenkins · GitLab CI", x: 3.25, y: 1.8, evidence: "practice", detail: "Thresholds on pass rate, performance and security findings." },
      { id: "report", label: "Reporting", sub: "Results · defects · residual risk", x: 4.25, y: 1.8, evidence: "practice", detail: "Release report summarising coverage, defect trends and open risks." },
      { id: "decision", label: "Go / no-go", sub: "Release decision", x: 4.25, y: 3, evidence: "context", detail: "Stakeholders decide with evidence, not just a pass count." },
    ],
    edges: [
      { from: "req", to: "plan" },
      { from: "plan", to: "design" },
      { from: "design", to: "api" },
      { from: "design", to: "gui" },
      { from: "design", to: "perf" },
      { from: "design", to: "sec" },
      { from: "api", to: "gate" },
      { from: "gui", to: "gate" },
      { from: "perf", to: "gate" },
      { from: "sec", to: "gate" },
      { from: "gate", to: "report" },
      { from: "report", to: "decision" },
    ],
  },
  "k8s-health": {
    title: "Smoke & health-check automation",
    description: "Shell scripts from my public GitHub verify the Minikube deployment and the host it runs on.",
    zones: [{ id: "mk", label: "Minikube cluster", x: 2.85, y: -0.4, w: 1.3, h: 2.8 }],
    nodes: [
      { id: "cron", label: "cron", sub: "Scheduled runs", x: 0, y: 1, evidence: "code", detail: "monitor.sh is designed to be scheduled from cron." },
      { id: "apptest", label: "apptest.sh", sub: "Backend smoke test", x: 1.5, y: 0, evidence: "code", detail: "curl to the backend NodePort; passes only if the body equals the expected message." },
      { id: "health", label: "health_check.sh", sub: "Frontend HTTP + pods", x: 1.5, y: 1.3, evidence: "code", detail: "curl -I to the frontend NodePort, maps 200/404/other, then reads frontend pod uptime with kubectl." },
      { id: "backend", label: "Backend service", sub: "NodePort", x: 3, y: 0, evidence: "code", detail: "Deployed from the Minikube_deploy instructions with kubectl apply." },
      { id: "frontend", label: "Frontend service", sub: "NodePort · pods", x: 3, y: 1.3, evidence: "code", detail: "Frontend deployment exposed as a NodePort service." },
      { id: "monitor", label: "monitor.sh", sub: "Host metrics", x: 1.5, y: 2.8, evidence: "code", detail: "free -h, df -h, top memory processes and CPU load from top." },
      { id: "log", label: "CPU log", sub: "> 80% → /tmp/cpu-log-*", x: 3, y: 2.8, evidence: "code", detail: "Writes a timestamped log when CPU usage crosses 80%." },
      { id: "ci", label: "CI post-deploy stage", sub: "Planned", x: 4.6, y: 0.65, evidence: "plan", detail: "Planned: call the smoke and health checks automatically after each deployment." },
    ],
    edges: [
      { from: "cron", to: "monitor" },
      { from: "cron", to: "health", dashed: true },
      { from: "apptest", to: "backend", label: "curl" },
      { from: "health", to: "frontend", label: "curl -I · kubectl" },
      { from: "monitor", to: "log", label: "threshold" },
      { from: "backend", to: "ci", dashed: true },
      { from: "frontend", to: "ci", dashed: true },
    ],
  },
} satisfies Record<string, Diagram>;

export type DiagramId = keyof typeof diagrams;

export const showcaseDiagrams: DiagramId[] = ["eks-platform", "devsecops", "gui-automation", "cicd-plan", "quality-engineering"];
