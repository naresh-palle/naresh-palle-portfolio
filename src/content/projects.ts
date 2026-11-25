import type { DiagramId } from "./diagrams";

export type ProjectCategory = "Test Automation" | "CI/CD" | "DevSecOps" | "Cloud & Kubernetes" | "Quality Strategy";

export type ProjectStatus = {
  label: string;
  tone: "code" | "documented" | "practice" | "plan";
};

/**
 * Evidence level for each capability, shown as a badge:
 * code       — in a public GitHub repository
 * documented — written up on the BinaryBlogs technical blog
 * practice   — professional practice; no public code
 * plan       — part of a blueprint, not yet built publicly
 */
export type Evidence = ProjectStatus["tone"];

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  categories: ProjectCategory[];
  status: ProjectStatus;
  summary: string;
  overview: string;
  problem: string;
  diagram: DiagramId;
  stack: string[];
  scope: { label: string; evidence: Evidence }[];
  challenges: { title: string; body: string }[];
  approach: string[];
  security: string[];
  deployment: string[];
  links: { github?: { label: string; href: string }[]; articles?: { label: string; href: string }[] };
  note?: string;
};

const BLOG = "https://binaryblogs1.wordpress.com";

export const projects: Project[] = [
  {
    slug: "gui-test-automation-framework",
    name: "GUI Test Automation Framework",
    tagline: "Selenium · Playwright · Robot Framework",
    icon: "MousePointerClick",
    categories: ["Test Automation", "Quality Strategy"],
    status: { label: "Reference design", tone: "practice" },
    summary:
      "A layered GUI automation framework design: page objects and keywords, data-driven suites, parallel cross-browser execution and evidence-rich reporting wired into CI.",
    overview:
      "This case study describes how I structure GUI test automation for web applications. It separates what is tested (suites and test data) from how the browser is driven (page objects, keywords and core utilities), so that UI changes are fixed in one place and the same suites run locally, on a grid and in CI.",
    problem:
      "Manual regression of web front ends does not scale with frequent releases, and naive recorded scripts break whenever a locator or flow changes, which erodes trust in automation.",
    diagram: "gui-automation",
    stack: ["Selenium WebDriver", "Playwright", "Robot Framework", "Page Object Model", "Selenium Grid", "Jenkins", "GitLab CI", "Allure / HTML reports", "Jira"],
    scope: [
      { label: "Requirement-driven test planning and web UI test cases", evidence: "documented" },
      { label: "Page objects / reusable keywords per screen", evidence: "practice" },
      { label: "Data-driven suites with environment and browser configuration", evidence: "practice" },
      { label: "Parallel, cross-browser execution on a grid or Playwright workers", evidence: "practice" },
      { label: "Screenshots, logs and reports attached to every failure", evidence: "practice" },
      { label: "Nightly and per-merge-request runs from CI", evidence: "practice" },
      { label: "Public sample framework repository", evidence: "plan" },
    ],
    challenges: [
      { title: "Flaky tests", body: "Replace fixed sleeps with explicit waits on application state, isolate test data per run and quarantine unstable tests instead of ignoring failures." },
      { title: "Locator churn", body: "Prefer stable attributes (test IDs, roles, labels) and keep every locator inside a page object so a UI change is a one-line fix." },
      { title: "Execution time", body: "Split suites into smoke and full regression, run them in parallel, and keep GUI tests for user journeys while pushing logic checks down to API level." },
      { title: "Readable results", body: "Failures must be diagnosable without rerunning: screenshot, browser console, step log and environment details on every failed test." },
    ],
    approach: [
      "Start from the test plan: map user journeys and risk areas to suites (smoke, regression, cross-browser).",
      "Model each screen as a page object (Selenium/Playwright) or keyword library (Robot Framework).",
      "Keep test data and environment settings outside the code so the same suite runs against QA, staging or a local build.",
      "Add core utilities once: waits, retries for known transient errors, screenshot and log capture.",
      "Run in parallel on Selenium Grid or Playwright workers across Chrome, Firefox and Edge.",
      "Publish JUnit XML plus HTML/Allure reports from CI and raise defects with the captured evidence.",
    ],
    security: [
      "Test credentials come from the CI secret store, never from the repository or test data files.",
      "Dedicated test accounts with least-privilege roles per environment.",
      "Masked secrets in logs and reports; screenshots reviewed for sensitive data before sharing outside the team.",
    ],
    deployment: [
      "Framework runs as a CI stage after deployment to QA/staging.",
      "Smoke suite on every merge request; full regression nightly and before release.",
      "Results feed the release quality gate described in the CI/CD delivery plan.",
    ],
    links: {
      articles: [
        { label: "Web application sample test cases", href: `${BLOG}/web-application-sample-test-cases/` },
        { label: "Beginner testing guide", href: `${BLOG}/beginner-testing-guide/` },
      ],
    },
    note: "Built from my QA and test automation practice (Oct 2013 – Dec 2019 and beyond). Employer code is not public, so no repository is linked.",
  },
  {
    slug: "cicd-delivery-plan",
    name: "CI/CD Delivery Plan",
    tagline: "From commit to production with quality gates",
    icon: "GitBranch",
    categories: ["CI/CD", "Quality Strategy"],
    status: { label: "Pipeline blueprint", tone: "plan" },
    summary:
      "An end-to-end delivery pipeline plan: build and unit tests, static analysis, API and GUI suites, versioned artifacts, staged Helm deployments, release approval, health checks and rollback.",
    overview:
      "A blueprint for how code should move from a merge request to production. Each stage has an owner, an exit criterion and a clear failure action, so the pipeline doubles as the team's definition of “ready to release”.",
    problem:
      "Without a shared pipeline, teams deploy by hand, test late and discover environment differences in production. Releases become slow, risky and hard to roll back.",
    diagram: "cicd-plan",
    stack: ["Git (GitHub / GitLab)", "Jenkins", "GitLab CI", "Docker", "Helm", "Kubernetes", "Selenium / Playwright", "Postman / API tests", "JMeter", "Shell"],
    scope: [
      { label: "Branching, merge-request checks and versioned artifacts", evidence: "plan" },
      { label: "Static analysis and coverage thresholds as a gate", evidence: "plan" },
      { label: "API and GUI regression stages after a staging deploy", evidence: "practice" },
      { label: "Performance baseline with JMeter", evidence: "documented" },
      { label: "Helm-based deployments to Kubernetes", evidence: "documented" },
      { label: "Post-deploy smoke and health checks", evidence: "code" },
      { label: "Automated rollback on failed health checks", evidence: "plan" },
    ],
    challenges: [
      { title: "Fast feedback vs full coverage", body: "Run cheap checks on every commit, heavier GUI and performance suites after the staging deploy, and keep the merge-request pipeline short." },
      { title: "Environment drift", body: "Build the image once and promote the same artifact through every environment; only configuration changes between stages." },
      { title: "Safe releases", body: "Use rolling or blue-green deployments, gate production on test results plus an approval, and define rollback before the first release." },
    ],
    approach: [
      "Commit and merge request trigger CI: lint, build, unit tests.",
      "Static analysis and coverage gate block the merge when thresholds fail.",
      "Build one versioned artifact or container image per commit.",
      "Deploy to QA/staging with Helm, then run API, GUI smoke/regression and a JMeter baseline.",
      "Release gate combines test results, open defects and a manual approval.",
      "Production deploy (rolling or blue-green), followed by smoke and health checks.",
      "Failed health checks trigger rollback to the previous Helm release.",
    ],
    security: [
      "Secrets injected from Jenkins/GitLab credentials or Kubernetes secrets, never committed.",
      "Protected branches and required reviews for production pipelines.",
      "Security scanning stages defined in the DevSecOps pipeline case study plug into the same gates.",
    ],
    deployment: [
      "Jenkins or GitLab CI orchestrates the stages; agents run in containers.",
      "Kubernetes namespaces per environment; Helm values per environment.",
      "Planned: the public health-check scripts from the Kubernetes health-check case study run as a post-deploy stage.",
    ],
    links: {
      github: [{ label: "Application health check script", href: "https://github.com/naresh-palle/Application_HealthCheck" }],
      articles: [
        { label: "JMeter for performance & load testing", href: `${BLOG}/jmeter/` },
        { label: "Kubernetes with K3S and Helm", href: `${BLOG}/kubernetes-1-26-with-k3s/` },
      ],
    },
    note: "A blueprint. Stages marked “Planned” are not yet published as a public pipeline.",
  },
  {
    slug: "devsecops-pipeline",
    name: "DevSecOps Pipeline",
    tagline: "Security checks inside the delivery flow",
    icon: "ShieldCheck",
    categories: ["DevSecOps", "CI/CD"],
    status: { label: "Professional practice", tone: "practice" },
    summary:
      "A CI pipeline that treats security as a gate: secret and static scans, container image scanning with Trivy, a curated image registry and dynamic testing with OWASP ZAP on staging.",
    overview:
      "The DevSecOps pipeline extends the delivery plan with security stages. Source, dependencies and container images are scanned before anything reaches a registry, and staging is probed with dynamic tests before promotion.",
    problem:
      "Vulnerabilities found after release are expensive and risky to fix. Security reviews at the end of a project also slow delivery and are easy to skip under pressure.",
    diagram: "devsecops",
    stack: ["GitHub / GitLab", "Jenkins", "GitLab CI", "Docker", "Trivy", "OWASP ZAP", "Amazon ECR", "Harbor", "Helm", "Argo CD", "Kubernetes"],
    scope: [
      { label: "Pipeline stages in Jenkins / GitLab CI", evidence: "practice" },
      { label: "Container image scanning with Trivy, failing on critical findings", evidence: "practice" },
      { label: "Private image registry (ECR / Harbor)", evidence: "practice" },
      { label: "GitOps deployment with Argo CD and Helm", evidence: "practice" },
      { label: "Dynamic testing with OWASP ZAP on staging", evidence: "practice" },
      { label: "Penetration-testing test cases", evidence: "documented" },
      { label: "Public reference pipeline repository", evidence: "plan" },
    ],
    challenges: [
      { title: "Noise vs signal", body: "Fail the build on critical and high findings with a fix available; track the rest as backlog with an agreed expiry instead of blocking every merge." },
      { title: "Base image hygiene", body: "Standardise on a small set of maintained base images so one patch fixes many services." },
      { title: "Shift left without slowing down", body: "Fast scans run on every merge request; slower dynamic scans run against staging after deploy." },
    ],
    approach: [
      "Source push triggers the pipeline in Jenkins or GitLab CI.",
      "Build and unit tests, then static and secret scanning of the source.",
      "Build the container image and scan it with Trivy (OS packages and dependencies).",
      "Quality and security gate: block on critical/high vulnerabilities or failed tests.",
      "Push approved images to ECR or Harbor.",
      "Deploy with Helm / Argo CD to staging, run OWASP ZAP, then promote to production.",
    ],
    security: [
      "Least-privilege CI credentials; registry push rights only from the pipeline.",
      "Images are immutable and tagged by commit; production pulls only scanned tags.",
      "Scan reports archived with each build for audit.",
    ],
    deployment: [
      "Pipeline runs on Jenkins agents or GitLab runners.",
      "Argo CD reconciles Kubernetes with the Git-tracked Helm values.",
      "Targets the AWS EKS platform described in its own case study.",
    ],
    links: {
      articles: [{ label: "Penetration testing guide with sample test cases", href: `${BLOG}/penetration-testing-guide-with-sample-test-cases/` }],
    },
    note: "Based on professional DevOps work (Jan 2020 – Feb 2026). Employer pipelines are not public.",
  },
  {
    slug: "aws-eks-platform",
    name: "AWS EKS Platform",
    tagline: "Kubernetes on AWS with eksctl, Helm and GitOps",
    icon: "Cloud",
    categories: ["Cloud & Kubernetes"],
    status: { label: "Documented build", tone: "documented" },
    summary:
      "A Kubernetes platform on Amazon EKS: eksctl-provisioned cluster and managed node groups, IAM roles, an ALB-backed ingress, Helm-packaged workloads, images from ECR and GitOps delivery with Argo CD.",
    overview:
      "The platform design behind my EKS work. The cluster creation with eksctl and node groups is written up step by step on BinaryBlogs; the ingress, registry and GitOps layers reflect how I run workloads on it in practice.",
    problem:
      "Hand-built Kubernetes clusters are hard to reproduce and upgrade, and teams need a consistent way to expose services, pull images securely and deploy without kubectl access to production.",
    diagram: "eks-platform",
    stack: ["AWS EKS", "eksctl", "Amazon VPC", "Application Load Balancer", "EC2 managed node groups", "AWS IAM", "Amazon ECR", "Kubernetes", "Helm", "Argo CD", "kubectl"],
    scope: [
      { label: "EKS cluster and managed node group created with eksctl", evidence: "documented" },
      { label: "IAM role with EKS permissions for cluster operations", evidence: "documented" },
      { label: "Helm and ingress controller installation", evidence: "documented" },
      { label: "kubectl operations reference", evidence: "documented" },
      { label: "ALB ingress via AWS Load Balancer Controller", evidence: "practice" },
      { label: "Images from Amazon ECR", evidence: "practice" },
      { label: "GitOps with Argo CD", evidence: "practice" },
    ],
    challenges: [
      { title: "Repeatability", body: "Script cluster creation (eksctl flags or config file) so environments are rebuilt the same way, rather than clicked together in the console." },
      { title: "Access boundaries", body: "Separate IAM roles for the cluster, node groups and workloads; humans deploy through Git, not direct cluster-admin access." },
      { title: "Cost and capacity", body: "Right-size node groups and scale them with demand; keep non-production clusters small." },
    ],
    approach: [
      "Create an IAM role with EKS permissions and configure the AWS CLI.",
      "Create the cluster and a managed node group with eksctl (VPC and subnets provisioned with it).",
      "Install Helm and an ingress controller; expose services through an ALB.",
      "Package workloads as Helm charts; pull images from ECR.",
      "Let Argo CD sync the cluster from the Git repository.",
    ],
    security: [
      "Worker nodes in private subnets; only the load balancer is public.",
      "IAM roles scoped per component; workload access through service-account roles.",
      "Images pulled only from the private registry.",
    ],
    deployment: [
      "eksctl provisions the cluster and node groups.",
      "Argo CD + Helm deliver application releases.",
      "Health checks and smoke tests are designed to run after each release.",
    ],
    links: {
      articles: [
        { label: "Create a K8s cluster on AWS EKS using eksctl", href: `${BLOG}/create-a-k8s-cluster-on-aws-eks-using-eksctl/` },
        { label: "Kubernetes 1.26 with K3S (Helm, ingress)", href: `${BLOG}/kubernetes-1-26-with-k3s/` },
        { label: "Kubernetes cluster on CentOS 7", href: `${BLOG}/kubernetes-on-centos/` },
        { label: "kubectl commands cheat sheet", href: `${BLOG}/kubectl-commands-cheat-sheet/` },
      ],
    },
  },
  {
    slug: "quality-engineering-strategy",
    name: "Quality Engineering Strategy",
    tagline: "Test planning to release reporting",
    icon: "ListChecks",
    categories: ["Quality Strategy", "Test Automation"],
    status: { label: "Professional practice", tone: "practice" },
    summary:
      "How I plan and run quality for a release: risk-based test planning, layered automation (API, GUI, performance, security), CI quality gates and reporting that supports a go/no-go decision.",
    overview:
      "Quality engineering is more than test execution. This case study covers the full loop: understanding requirements, planning by risk, choosing the right test level for each check, automating it in CI and reporting results in a way that helps the team decide whether to release.",
    problem:
      "Teams often test what is easy rather than what is risky, run everything through the UI and report pass counts that do not tell stakeholders whether a release is safe.",
    diagram: "quality-engineering",
    stack: ["Test planning", "Risk-based testing", "Postman", "SoapUI", "Selenium WebDriver", "Playwright", "Robot Framework", "JMeter", "OWASP ZAP", "Jenkins", "GitLab CI", "Jira"],
    scope: [
      { label: "Test planning in Agile and Waterfall delivery", evidence: "documented" },
      { label: "API testing with Postman / SoapUI", evidence: "documented" },
      { label: "Performance and load testing with JMeter", evidence: "documented" },
      { label: "Security and penetration test cases", evidence: "documented" },
      { label: "GUI regression automation", evidence: "practice" },
      { label: "Quality gates in CI pipelines", evidence: "practice" },
      { label: "Release reports and defect trends", evidence: "practice" },
    ],
    challenges: [
      { title: "Choosing the right level", body: "Most checks belong at unit and API level; GUI tests cover critical user journeys only, which keeps suites fast and stable." },
      { title: "Meaningful gates", body: "Gates combine pass rate, open critical defects, performance against baseline and security findings, not just a green build." },
      { title: "Traceability", body: "Every test links back to a requirement or risk so coverage gaps are visible during planning, not after release." },
    ],
    approach: [
      "Analyse requirements and user stories; build a risk matrix.",
      "Write the test plan: scope, levels, environments, entry and exit criteria.",
      "Design test cases and data, including negative and security cases.",
      "Automate by layer: API (Postman/SoapUI), GUI (Selenium/Playwright/Robot), performance (JMeter), security (OWASP ZAP).",
      "Run suites in CI with thresholds that act as quality gates.",
      "Report results, defect trends and residual risk for the release decision.",
    ],
    security: [
      "Security test cases are part of the plan, not an afterthought.",
      "Dynamic scans run only against non-production environments with approval.",
      "Test data is synthetic or masked.",
    ],
    deployment: ["Suites are executed by the CI/CD delivery plan stages.", "Reports are published as CI artifacts and summarised for the release meeting."],
    links: {
      articles: [
        { label: "Beginner's guide to API testing", href: `${BLOG}/beginners-guide-to-api-testing/` },
        { label: "JMeter for performance & load testing", href: `${BLOG}/jmeter/` },
        { label: "Penetration testing guide", href: `${BLOG}/penetration-testing-guide-with-sample-test-cases/` },
        { label: "Agile methodology", href: `${BLOG}/agile-methodology/` },
      ],
    },
  },
  {
    slug: "kubernetes-health-checks",
    name: "Kubernetes Smoke & Health-Check Automation",
    tagline: "Shell automation for apps on Minikube",
    icon: "HeartPulse",
    categories: ["Cloud & Kubernetes", "CI/CD"],
    status: { label: "Public scripts", tone: "code" },
    summary:
      "Shell scripts that verify a frontend/backend application deployed on Minikube: an HTTP smoke test on the backend response, an application health check with pod status, and a Linux host monitor.",
    overview:
      "A small, real set of scripts from my public GitHub. The application is deployed to Minikube as frontend and backend NodePort services; the scripts then confirm that the backend returns the expected response, that the frontend answers over HTTP and that its pods are running, and that the host has CPU, memory and disk headroom.",
    problem:
      "After a deployment, someone has to confirm the application actually works. Doing that by hand is slow and inconsistent, and resource problems on the host are noticed only after users complain.",
    diagram: "k8s-health",
    stack: ["Shell (Bash)", "curl", "kubectl", "Minikube", "Kubernetes NodePort services", "cron", "Linux (free, df, ps, top)"],
    scope: [
      { label: "Minikube deployment of frontend and backend services", evidence: "code" },
      { label: "Backend smoke test: HTTP response body assertion", evidence: "code" },
      { label: "Frontend HTTP status check and pod uptime via kubectl", evidence: "code" },
      { label: "Host monitor: memory, disk, top processes, CPU load", evidence: "code" },
      { label: "CPU above 80% writes a timestamped log", evidence: "code" },
      { label: "Run as a post-deploy stage in CI", evidence: "plan" },
      { label: "Alerting to chat or email", evidence: "plan" },
    ],
    challenges: [
      { title: "Clear pass/fail", body: "Assert on the exact expected response and on HTTP status codes so a script result is unambiguous in CI logs." },
      { title: "Cluster and host view", body: "Combine application checks (HTTP, pods) with host metrics so a failure can be traced to the app or the machine." },
    ],
    approach: [
      "Deploy frontend and backend to Minikube and expose them as NodePort services.",
      "apptest.sh calls the backend and compares the body with the expected message.",
      "health_check.sh sends an HTTP HEAD request to the frontend, maps 200/404/other to a result and reads pod uptime with kubectl.",
      "monitor.sh prints memory, disk, top memory processes and CPU load, logging when CPU exceeds 80%; scheduled with cron.",
    ],
    security: ["Scripts are read-only checks; they do not change cluster state.", "Run under a non-root user with kubeconfig scoped to the target namespace."],
    deployment: ["Scheduled with cron on the host.", "Planned: called as the post-deploy verification step of the CI/CD delivery plan."],
    links: {
      github: [
        { label: "Minikube_deploy", href: "https://github.com/naresh-palle/Minikube_deploy" },
        { label: "Application_HealthCheck", href: "https://github.com/naresh-palle/Application_HealthCheck" },
        { label: "System_HealthCheck", href: "https://github.com/naresh-palle/System_HealthCheck" },
      ],
      articles: [{ label: "DevOps Linux commands", href: `${BLOG}/devops-linux-commands/` }],
    },
  },
];

export const projectCategories: ("All" | ProjectCategory)[] = ["All", "Test Automation", "CI/CD", "DevSecOps", "Cloud & Kubernetes", "Quality Strategy"];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
