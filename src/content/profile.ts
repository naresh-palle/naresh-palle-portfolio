export const profile = {
  name: "Naresh Palle",
  roles: ["Senior QA Engineer", "DevOps Engineer", "AI Solutions Architect"],
  tagline: ["Engineering Quality.", "Automating Infrastructure.", "Architecting Intelligent AI Solutions."],
  summary:
    "12+ years of IT experience across Quality Engineering, Cybersecurity, Telecom OSS/BSS, DevOps, Cloud Infrastructure and AI-enabled Automation.",
  location: "Hyderabad, India",
  email: "nareshepg@gmail.com",
  resume: "/assets/Naresh_Palle_AI_Automation_Architect_Resume.pdf",
  photos: {
    hero: { name: "hero-portrait", sizes: [480, 768], alt: "Portrait of Naresh Palle in a red sweater with arms crossed", width: 864, height: 1152 },
    workspace: { name: "about-workspace", sizes: [480, 768], alt: "Naresh Palle in a technology workspace surrounded by holographic dashboards", width: 864, height: 1152 },
    contact: { name: "contact-profile", sizes: [640, 1024], alt: "Portrait of Naresh Palle in a red sweater with arms crossed", width: 864, height: 1152 },
  },
  links: {
    linkedin: "https://linkedin.com/in/nareshpalle",
    blog: "https://binaryblogs1.wordpress.com/",
  },
  education: {
    degree: "Bachelor of Science (B.Sc.) in Computer Science",
    institution: "Osmania University",
    location: "Hyderabad, India",
  },
} as const;

export const heroPanels = [
  { label: "Quality Engineering", detail: "Selenium · Playwright · Robot", icon: "ShieldCheck" },
  { label: "DevOps & Automation", detail: "Jenkins · GitLab · Argo CD", icon: "Workflow" },
  { label: "Cloud & Kubernetes", detail: "AWS EKS · OpenShift · Helm", icon: "Cloud" },
  { label: "AI Architecture & LLMs", detail: "RAG · Agents · n8n", icon: "BrainCircuit" },
  { label: "DevSecOps", detail: "Trivy · Harbor · ECR", icon: "Lock" },
] as const;

export const navItems = [
  { id: "about", label: "About" },
  { id: "expertise", label: "Expertise" },
  { id: "projects", label: "Case Studies" },
  { id: "journey", label: "Journey" },
  { id: "blog", label: "Blog" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export const aboutPillars = [
  {
    title: "Quality engineering foundation",
    body: "Functional, regression, API, performance and security testing, automation frameworks and release quality gates.",
    icon: "ShieldCheck",
  },
  {
    title: "Cybersecurity & Telecom OSS/BSS",
    body: "Engineering and validation work in cybersecurity and telecom OSS/BSS environments, including production troubleshooting.",
    icon: "Radar",
  },
  {
    title: "DevOps & cloud engineering",
    body: "AWS, Kubernetes and OpenShift platforms, CI/CD, infrastructure as code, GitOps and observability.",
    icon: "Cloud",
  },
  {
    title: "AI application development",
    body: "LLM-powered applications, RAG-based knowledge experiences and AI agents built with Python, FastAPI and modern web stacks.",
    icon: "BrainCircuit",
  },
  {
    title: "Intelligent workflow automation",
    body: "Agentic workflows, n8n orchestration, API integrations and human-in-the-loop automation grounded in operational reliability.",
    icon: "Workflow",
  },
] as const;

export const aboutStats = [
  { value: "12+", label: "Years in IT" },
  { value: "3", label: "Engineering chapters" },
  { value: "6", label: "Technology domains" },
] as const;
