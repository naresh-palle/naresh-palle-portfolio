export type SkillGroup = {
  id: string;
  title: string;
  /** Short label used on the hero chips. */
  short: string;
  icon: "ShieldCheck" | "Cloud" | "Terminal" | "Lock" | "BrainCircuit" | "Activity";
  blurb: string;
  accent: "cyan" | "blue" | "purple";
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "quality",
    title: "Quality Engineering",
    short: "Quality",
    icon: "ShieldCheck",
    blurb: "Test strategy, automation frameworks and quality gates that keep releases predictable.",
    accent: "cyan",
    skills: [
      "Functional Testing",
      "Regression Testing",
      "API Testing",
      "Selenium WebDriver",
      "Playwright",
      "Robot Framework",
      "Performance Testing",
      "Security Testing",
      "OWASP ZAP",
      "Test Automation",
      "Quality Gates",
    ],
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    short: "DevOps",
    icon: "Cloud",
    blurb: "Cloud platforms, container orchestration and delivery pipelines from commit to production.",
    accent: "blue",
    skills: [
      "AWS",
      "AWS EKS",
      "EC2",
      "VPC",
      "Route 53",
      "Kubernetes",
      "OpenShift",
      "Docker",
      "Helm",
      "Git",
      "Jenkins",
      "GitLab",
      "Argo CD",
      "GitHub Actions",
    ],
  },
  {
    id: "iac",
    title: "Infrastructure Automation",
    short: "Infrastructure",
    icon: "Terminal",
    blurb: "Repeatable, version-controlled infrastructure and configuration.",
    accent: "purple",
    skills: ["Terraform", "Ansible", "Shell Scripting", "Linux", "Infrastructure as Code", "GitOps"],
  },
  {
    id: "devsecops",
    title: "DevSecOps",
    short: "DevSecOps",
    icon: "Lock",
    blurb: "Security built into the pipeline: image scanning, registries and automated checks.",
    accent: "cyan",
    skills: [
      "Trivy",
      "Container Security",
      "Image Vulnerability Scanning",
      "Harbor",
      "AWS ECR",
      "Security Automation",
    ],
  },
  {
    id: "ai",
    title: "AI & Intelligent Automation",
    short: "AI Automation",
    icon: "BrainCircuit",
    blurb: "LLM applications, agents and workflow automation designed for real operational use.",
    accent: "purple",
    skills: [
      "Generative AI",
      "LLM Applications",
      "AI Agents",
      "Agentic Workflows",
      "RAG",
      "Prompt Engineering",
      "n8n",
      "MCP Concepts",
      "API Integrations",
      "Human-in-the-loop Automation",
      "Python",
      "FastAPI",
    ],
  },
  {
    id: "observability",
    title: "Observability & Data",
    short: "Observability",
    icon: "Activity",
    blurb: "Metrics, logs and data stores used to investigate incidents and find root causes.",
    accent: "blue",
    skills: [
      "Prometheus",
      "Grafana",
      "Kibana",
      "OpenSearch",
      "MySQL",
      "MariaDB",
      "PostgreSQL",
      "Redis",
      "Root Cause Analysis",
    ],
  },
];
