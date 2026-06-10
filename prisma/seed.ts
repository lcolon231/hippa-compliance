import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

type TemplateSeed = {
  category: Category;
  citation: string;
  title: string;
  description: string;
  sortOrder: number;
};

const templates: TemplateSeed[] = [
  // ── ADMINISTRATIVE (164.308) ──────────────────────────────────────────
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(1)(ii)(A)",
    title: "Conduct Annual Security Risk Assessment",
    description:
      "Conduct a comprehensive assessment of potential risks and vulnerabilities to the confidentiality, integrity, and availability of all ePHI your office creates, receives, maintains, or transmits. Document findings and review annually. Evidence: completed risk assessment report signed by your Security Officer.",
    sortOrder: 1,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(1)(ii)(B)",
    title: "Implement Risk Management Plan",
    description:
      "Develop and implement security measures sufficient to reduce identified risks to a reasonable and appropriate level. Document all risk management decisions and remediation progress. Evidence: risk management plan with remediation timelines and owners.",
    sortOrder: 2,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(1)(ii)(C)",
    title: "Apply Sanction Policy for Violations",
    description:
      "Maintain a written sanctions policy for workforce members who fail to comply with your security policies, and apply it consistently. Evidence: written sanction policy and records of any sanctions applied.",
    sortOrder: 3,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(1)(ii)(D)",
    title: "Review System Activity Logs",
    description:
      "Implement procedures to regularly review records of information system activity, such as audit logs, access reports, and security incident tracking reports. Evidence: log review schedule and completed review records.",
    sortOrder: 4,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(2)",
    title: "Designate HIPAA Security Officer",
    description:
      "Identify a single individual who is responsible for developing and implementing the security policies and procedures required by the Security Rule. Evidence: written designation letter or job description naming the Security Officer.",
    sortOrder: 5,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(3)",
    title: "Document Workforce Authorization Procedures",
    description:
      "Implement procedures for authorizing and supervising workforce members who work with ePHI or in locations where it may be accessed. Evidence: written authorization procedures and current access control lists.",
    sortOrder: 6,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(3)(ii)(B)",
    title: "Document Workforce Clearance Procedures",
    description:
      "Implement procedures to determine that each workforce member's access to ePHI is appropriate for their role. Evidence: background check records and periodic access review documentation.",
    sortOrder: 7,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(3)(ii)(C)",
    title: "Implement Access Termination Procedures",
    description:
      "Establish procedures to terminate access to ePHI when a workforce member leaves or changes roles. Access should be revoked the same day employment ends. Evidence: offboarding checklist and access termination log.",
    sortOrder: 8,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(5)",
    title: "Provide Annual Security Awareness Training",
    description:
      "Train all workforce members — including management — on security awareness topics such as malware protection, log-in monitoring, and password hygiene. Repeat annually and for all new hires. Evidence: training attendance records and training materials.",
    sortOrder: 9,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(5)(ii)(D)",
    title: "Implement Password Management Policy",
    description:
      "Establish and enforce procedures for creating, changing, and safeguarding passwords. Require strong, unique passwords and encourage use of a password manager. Evidence: written password policy and password manager adoption records.",
    sortOrder: 10,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(6)",
    title: "Document Security Incident Response Procedures",
    description:
      "Implement policies and procedures to identify, respond to, mitigate, and document security incidents and their outcomes. Evidence: incident response plan and a maintained incident log.",
    sortOrder: 11,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(7)(ii)(A)",
    title: "Maintain Data Backup Plan",
    description:
      "Establish procedures to create and maintain retrievable, exact copies of ePHI. Test restorations regularly to confirm backups actually work. Evidence: backup schedule and test restoration records.",
    sortOrder: 12,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(7)(ii)(B)",
    title: "Maintain Disaster Recovery Plan",
    description:
      "Establish procedures to restore any loss of data and continue critical business processes after an emergency such as fire, flood, or ransomware. Evidence: written disaster recovery plan with recovery time and recovery point objectives.",
    sortOrder: 13,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(7)(ii)(D)",
    title: "Test Contingency Plans Annually",
    description:
      "Implement procedures for periodic testing and revision of contingency plans, including backup, disaster recovery, and emergency mode operation plans. Evidence: test schedule and documented test results.",
    sortOrder: 14,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.308(a)(1)",
    title: "Implement Mobile Device Management Policy",
    description:
      "Establish policies for any mobile device that accesses ePHI, covering encryption, screen locks, remote wipe capability, and enrollment in mobile device management. Evidence: written MDM policy and device enrollment records.",
    sortOrder: 15,
  },
  {
    category: "ADMINISTRATIVE",
    citation: "164.400–414",
    title: "Establish Breach Notification Procedures",
    description:
      "Implement policies for identifying, evaluating, and reporting breaches of unsecured PHI to HHS and affected individuals within required timeframes (60 days for individuals). Evidence: written breach notification policy and a breach risk assessment template.",
    sortOrder: 16,
  },

  // ── PHYSICAL (164.310) ────────────────────────────────────────────────
  {
    category: "PHYSICAL",
    citation: "164.310(a)(1)",
    title: "Implement Facility Access Controls",
    description:
      "Limit physical access to facilities and systems containing ePHI to authorized individuals only, using locks, alarm systems, and visitor logs. Evidence: visitor log and key or key-card access records.",
    sortOrder: 17,
  },
  {
    category: "PHYSICAL",
    citation: "164.310(a)(2)(ii)",
    title: "Control and Monitor Visitor Access",
    description:
      "Implement procedures to control and validate a person's access to facilities based on their role or function, including visitor escorts and sign-in. Evidence: visitor log and written escort policy.",
    sortOrder: 18,
  },
  {
    category: "PHYSICAL",
    citation: "164.310(a)(2)(iii)",
    title: "Secure Facility Against Unauthorized Intrusion",
    description:
      "Maintain physical security measures to protect the facility against unauthorized intrusion, including alarm systems and after-hours monitoring. Evidence: alarm system contract and monitoring records.",
    sortOrder: 19,
  },
  {
    category: "PHYSICAL",
    citation: "164.310(b)",
    title: "Position Workstations Away from Public View",
    description:
      "Position workstations so screens displaying ePHI are not visible to patients, visitors, or unauthorized staff. Use privacy filters where repositioning is impractical. Evidence: office layout documentation and privacy filter receipts.",
    sortOrder: 20,
  },
  {
    category: "PHYSICAL",
    citation: "164.310(b)",
    title: "Document Workstation Use Policy",
    description:
      "Create a policy describing the proper functions to be performed at workstations that access ePHI and the manner in which they are to be performed. Evidence: workstation use policy signed by all staff.",
    sortOrder: 21,
  },
  {
    category: "PHYSICAL",
    citation: "164.310(c)",
    title: "Implement Workstation Security Controls",
    description:
      "Implement physical safeguards for all workstations that access ePHI, such as cable locks, locked offices, and automatic screen locks. Evidence: inventory of workstations with security measures listed.",
    sortOrder: 22,
  },
  {
    category: "PHYSICAL",
    citation: "164.310(d)(2)(i)",
    title: "Implement Device and Media Disposal Procedures",
    description:
      "Establish procedures for the final disposal of ePHI and the hardware or electronic media on which it is stored, such as shredding drives or using a certified destruction vendor. Evidence: written disposal policy and certificates of destruction.",
    sortOrder: 23,
  },
  {
    category: "PHYSICAL",
    citation: "164.310(d)(2)(ii)",
    title: "Implement Media Re-use Sanitization",
    description:
      "Establish procedures for removal of ePHI from electronic media before the media are made available for re-use. Evidence: sanitization procedures and sanitization logs.",
    sortOrder: 24,
  },
  {
    category: "PHYSICAL",
    citation: "164.310(d)(2)(iii)",
    title: "Maintain Hardware Inventory",
    description:
      "Maintain a record of the movements of hardware and electronic media containing ePHI and the person responsible for each item. Evidence: hardware inventory spreadsheet and movement log.",
    sortOrder: 25,
  },

  // ── TECHNICAL (164.312) ───────────────────────────────────────────────
  {
    category: "TECHNICAL",
    citation: "164.312(a)(2)(i)",
    title: "Enforce Unique User IDs",
    description:
      "Assign a unique name and/or number for identifying and tracking each user's identity. Shared logins are prohibited — every staff member needs their own account in the EHR and on workstations. Evidence: user account list and policy prohibiting shared logins.",
    sortOrder: 26,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(a)(2)(ii)",
    title: "Implement Emergency Access Procedure",
    description:
      "Establish procedures for obtaining necessary ePHI during an emergency when normal access procedures are unavailable. Evidence: written emergency access procedure and designated break-glass accounts.",
    sortOrder: 27,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(a)(2)(iii)",
    title: "Enable Automatic Logoff on All Systems",
    description:
      "Implement electronic procedures that terminate a session after a predetermined period of inactivity. Set screen locks to 15 minutes or less on every workstation and EHR session. Evidence: system configuration screenshots and the policy stating the timeout.",
    sortOrder: 28,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(a)(2)(iv)",
    title: "Encrypt ePHI at Rest",
    description:
      "Implement a mechanism to encrypt and decrypt ePHI stored on all devices and media — laptops, desktops, servers, and USB drives. Use full-disk encryption (BitLocker, FileVault) with AES-256 or equivalent. Evidence: encryption status reports or screenshots showing encryption enabled.",
    sortOrder: 29,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(b)",
    title: "Enable Audit Logging on EHR and Systems",
    description:
      "Implement hardware, software, or procedural mechanisms that record and examine activity in systems that contain or use ePHI. Confirm audit logging is enabled in your EHR. Evidence: audit log samples and log retention configuration.",
    sortOrder: 30,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(b)",
    title: "Implement Intrusion Detection or Alerting",
    description:
      "Deploy tooling that detects and alerts on unauthorized access attempts to systems containing ePHI, such as endpoint protection with alerting or a managed detection service. Evidence: tool configuration and a sample alert log.",
    sortOrder: 31,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(c)",
    title: "Implement Data Integrity Controls",
    description:
      "Implement electronic mechanisms to corroborate that ePHI has not been altered or destroyed in an unauthorized manner, such as checksums, versioned backups, or integrity monitoring. Evidence: integrity control configuration documentation.",
    sortOrder: 32,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(d)",
    title: "Verify Identity Before PHI Disclosure",
    description:
      "Implement procedures to verify that a person or entity seeking access to ePHI is the one claimed — for phone requests, portal access, and system logins alike. Evidence: written authentication/verification policy.",
    sortOrder: 33,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(d)",
    title: "Implement Multi-Factor Authentication",
    description:
      "Require MFA for all accounts with access to systems containing ePHI, including the EHR, email, and remote access. Evidence: MFA configuration screenshots and enrollment records.",
    sortOrder: 34,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(e)",
    title: "Encrypt ePHI in Transit",
    description:
      "Implement technical security measures to guard against unauthorized access to ePHI transmitted over networks. Use TLS 1.2+ for all web traffic and secure/encrypted email for any PHI sent outside the office. Evidence: SSL certificate and secure email configuration.",
    sortOrder: 35,
  },
  {
    category: "TECHNICAL",
    citation: "164.308(a)(1)(ii)(A)",
    title: "Conduct Regular Vulnerability Scanning",
    description:
      "Perform periodic vulnerability scans on systems that store or access ePHI, and remediate critical findings within 30 days. Evidence: vulnerability scan reports and remediation records.",
    sortOrder: 36,
  },
  {
    category: "TECHNICAL",
    citation: "164.308(a)(5)(ii)(B)",
    title: "Maintain Patch Management Procedures",
    description:
      "Establish procedures for promptly applying security patches to operating systems, applications, and network equipment. Evidence: patch management policy and patch compliance reports.",
    sortOrder: 37,
  },

  // ── ORGANIZATIONAL (164.314) ──────────────────────────────────────────
  {
    category: "ORGANIZATIONAL",
    citation: "164.308(b) / 164.314(a)",
    title: "Signed BAA with EHR Vendor",
    description:
      "Ensure a signed Business Associate Agreement is in place with your Electronic Health Record vendor before any ePHI is shared. Evidence: the signed BAA document.",
    sortOrder: 38,
  },
  {
    category: "ORGANIZATIONAL",
    citation: "164.314(a)",
    title: "Signed BAA with IT Provider / MSP",
    description:
      "Ensure a signed Business Associate Agreement is in place with any IT managed service provider or consultant who can access systems containing ePHI. Evidence: the signed BAA document.",
    sortOrder: 39,
  },
  {
    category: "ORGANIZATIONAL",
    citation: "164.314(a)",
    title: "Signed BAA with Billing Company",
    description:
      "Ensure a signed Business Associate Agreement is in place with your medical billing company or claims clearinghouse. Evidence: the signed BAA document.",
    sortOrder: 40,
  },
  {
    category: "ORGANIZATIONAL",
    citation: "164.314(a)",
    title: "Signed BAA with Cloud and Email Providers",
    description:
      "Ensure signed BAAs are in place with cloud storage and email providers that handle PHI, such as Google Workspace or Microsoft 365. Free consumer tiers typically do not offer BAAs. Evidence: the signed BAA documents.",
    sortOrder: 41,
  },
  {
    category: "ORGANIZATIONAL",
    citation: "164.314(a)",
    title: "Signed BAA with Telehealth Platform",
    description:
      "Ensure a signed BAA is in place with any telehealth or video conferencing platform used for patient care. Evidence: the signed BAA document.",
    sortOrder: 42,
  },
  {
    category: "ORGANIZATIONAL",
    citation: "164.314(a)",
    title: "Maintain Business Associate Inventory",
    description:
      "Maintain a current list of all business associates, the services they perform, the PHI they touch, and each BAA's effective and expiration dates. Evidence: business associate inventory spreadsheet.",
    sortOrder: 43,
  },
  {
    category: "ORGANIZATIONAL",
    citation: "164.314(a)(2)",
    title: "Review Business Associate Agreements Annually",
    description:
      "Review all BAAs at least annually to confirm they still meet HIPAA requirements and reflect current vendor relationships; update or terminate as needed. Evidence: BAA review checklist and updated agreements.",
    sortOrder: 44,
  },

  // ── POLICIES & DOCUMENTATION (164.316) ────────────────────────────────
  {
    category: "POLICIES",
    citation: "164.316(a)",
    title: "Maintain Written Security Policies and Procedures",
    description:
      "Implement reasonable and appropriate written policies and procedures to comply with each Security Rule standard, and keep them current. Evidence: policy binder or document management system containing current policies.",
    sortOrder: 45,
  },
  {
    category: "POLICIES",
    citation: "164.316(b)(1)",
    title: "Document Rationale for Addressable Specifications",
    description:
      "For each 'addressable' implementation specification, document whether it was implemented, an equivalent alternative was used, or it was deemed not reasonable — and why. Evidence: addressable implementation decisions document.",
    sortOrder: 46,
  },
  {
    category: "POLICIES",
    citation: "164.316(b)(2)(i)",
    title: "Retain Documentation for 6 Years",
    description:
      "Retain all security policies, procedures, and required documentation for at least six years from the date of creation or the date it was last in effect, whichever is later. Evidence: document retention policy and archive system.",
    sortOrder: 47,
  },
  {
    category: "POLICIES",
    citation: "164.316(b)(2)(iii)",
    title: "Review and Update Policies Annually",
    description:
      "Review documentation periodically and update it in response to environmental or operational changes affecting the security of ePHI. Evidence: policy review log with dates and changes made.",
    sortOrder: 48,
  },
  {
    category: "POLICIES",
    citation: "164.520",
    title: "Maintain Notice of Privacy Practices",
    description:
      "Develop and provide patients with a Notice of Privacy Practices describing how PHI may be used and disclosed and their rights. Post it in the office and on your website. Evidence: current NPP document and signed acknowledgment forms.",
    sortOrder: 49,
  },
  {
    category: "POLICIES",
    citation: "164.308(a)(1)",
    title: "Document Complete Annual Risk Analysis",
    description:
      "Document the full risk analysis process for the current year: scope, data collection methods, threats and vulnerabilities identified, likelihood and impact ratings, and conclusions. Evidence: the current year's signed risk analysis report.",
    sortOrder: 50,
  },
];

async function main() {
  console.log(`Seeding ${templates.length} task templates...`);

  for (const t of templates) {
    // Upsert keyed on sortOrder so re-running the seed is idempotent
    const existing = await prisma.taskTemplate.findFirst({
      where: { sortOrder: t.sortOrder },
    });

    if (existing) {
      await prisma.taskTemplate.update({
        where: { id: existing.id },
        data: t,
      });
    } else {
      await prisma.taskTemplate.create({ data: t });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
