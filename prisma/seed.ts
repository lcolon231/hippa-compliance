import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

// ── Framework definitions ─────────────────────────────────────────────────────

const FRAMEWORKS = [
  {
    slug: "hipaa-security",
    name: "HIPAA Security Rule",
    description:
      "45 CFR Part 164 §164.302–318 — Administrative, Physical, and Technical safeguards for electronic protected health information (ePHI). Required for all covered entities and business associates.",
    sortOrder: 1,
  },
  {
    slug: "hipaa-privacy",
    name: "HIPAA Privacy Rule",
    description:
      "45 CFR Part 164 §164.500–534 — Standards for protecting PHI in all forms, patient rights, and permitted uses and disclosures. Required for all covered entities.",
    sortOrder: 2,
  },
  {
    slug: "nist-csf",
    name: "NIST Cybersecurity Framework",
    description:
      "NIST CSF 1.1 — A voluntary framework providing standards, guidelines, and best practices to manage cybersecurity risk across five functions: Identify, Protect, Detect, Respond, Recover.",
    sortOrder: 3,
  },
];

// ── HIPAA Security Rule tasks (1–50) ─────────────────────────────────────────

const SECURITY_TASKS: {
  category: Category;
  citation: string;
  title: string;
  description: string;
  sortOrder: number;
}[] = [
  // ADMINISTRATIVE
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
      "Train all workforce members on security awareness topics such as malware protection, log-in monitoring, and password hygiene. Repeat annually and for all new hires. Evidence: training attendance records and training materials.",
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
  // PHYSICAL
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
  // TECHNICAL
  {
    category: "TECHNICAL",
    citation: "164.312(a)(2)(i)",
    title: "Enforce Unique User IDs",
    description:
      "Assign a unique name and/or number for identifying and tracking each user's identity. Shared logins are prohibited. Evidence: user account list and policy prohibiting shared logins.",
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
      "Implement electronic procedures that terminate a session after a predetermined period of inactivity. Set screen locks to 15 minutes or less. Evidence: system configuration screenshots and policy stating the timeout.",
    sortOrder: 28,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(a)(2)(iv)",
    title: "Encrypt ePHI at Rest",
    description:
      "Implement a mechanism to encrypt and decrypt ePHI stored on all devices and media. Use full-disk encryption (BitLocker, FileVault) with AES-256 or equivalent. Evidence: encryption status reports or screenshots.",
    sortOrder: 29,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(b)",
    title: "Enable Audit Logging on EHR and Systems",
    description:
      "Implement hardware, software, or procedural mechanisms that record and examine activity in systems that contain or use ePHI. Evidence: audit log samples and log retention configuration.",
    sortOrder: 30,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(b)",
    title: "Implement Intrusion Detection or Alerting",
    description:
      "Deploy tooling that detects and alerts on unauthorized access attempts to systems containing ePHI. Evidence: tool configuration and sample alert log.",
    sortOrder: 31,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(c)",
    title: "Implement Data Integrity Controls",
    description:
      "Implement electronic mechanisms to corroborate that ePHI has not been altered or destroyed in an unauthorized manner. Evidence: integrity control configuration documentation.",
    sortOrder: 32,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(d)",
    title: "Verify Identity Before PHI Disclosure",
    description:
      "Implement procedures to verify that a person or entity seeking access to ePHI is the one claimed. Evidence: written authentication/verification policy.",
    sortOrder: 33,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(d)",
    title: "Implement Multi-Factor Authentication",
    description:
      "Require MFA for all accounts with access to systems containing ePHI. Evidence: MFA configuration screenshots and enrollment records.",
    sortOrder: 34,
  },
  {
    category: "TECHNICAL",
    citation: "164.312(e)",
    title: "Encrypt ePHI in Transit",
    description:
      "Implement technical security measures to guard against unauthorized access to ePHI transmitted over networks. Use TLS 1.2+ for all web traffic. Evidence: SSL certificate and secure email configuration.",
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
  // ORGANIZATIONAL
  {
    category: "ORGANIZATIONAL",
    citation: "164.308(b) / 164.314(a)",
    title: "Signed BAA with EHR Vendor",
    description:
      "Ensure a signed Business Associate Agreement is in place with your Electronic Health Record vendor. Evidence: the signed BAA document.",
    sortOrder: 38,
  },
  {
    category: "ORGANIZATIONAL",
    citation: "164.314(a)",
    title: "Signed BAA with IT Provider / MSP",
    description:
      "Ensure a signed Business Associate Agreement is in place with any IT managed service provider with access to ePHI. Evidence: the signed BAA document.",
    sortOrder: 39,
  },
  {
    category: "ORGANIZATIONAL",
    citation: "164.314(a)",
    title: "Signed BAA with Billing Company",
    description:
      "Ensure a signed Business Associate Agreement is in place with your medical billing company or clearinghouse. Evidence: the signed BAA document.",
    sortOrder: 40,
  },
  {
    category: "ORGANIZATIONAL",
    citation: "164.314(a)",
    title: "Signed BAA with Cloud and Email Providers",
    description:
      "Ensure signed BAAs are in place with cloud storage and email providers that handle PHI. Evidence: the signed BAA documents.",
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
      "Maintain a current list of all business associates, the services they perform, PHI they touch, and each BAA's effective and expiration dates. Evidence: business associate inventory spreadsheet.",
    sortOrder: 43,
  },
  {
    category: "ORGANIZATIONAL",
    citation: "164.314(a)(2)",
    title: "Review Business Associate Agreements Annually",
    description:
      "Review all BAAs at least annually to confirm they still meet HIPAA requirements; update or terminate as needed. Evidence: BAA review checklist and updated agreements.",
    sortOrder: 44,
  },
  // POLICIES
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
      "Retain all security policies, procedures, and required documentation for at least six years from date of creation or last in effect. Evidence: document retention policy and archive system.",
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

// ── HIPAA Privacy Rule tasks (51–68) ─────────────────────────────────────────

const PRIVACY_TASKS: (typeof SECURITY_TASKS)[number][] = [
  // PRIVACY_PRACTICES
  {
    category: "PRIVACY_PRACTICES",
    citation: "164.520",
    title: "Develop and Maintain Notice of Privacy Practices",
    description:
      "Create an NPP that accurately describes how you use and disclose PHI, your legal duties, patient rights, and how they can file complaints. Review with legal counsel and update whenever practices materially change. Evidence: current NPP document with date of last review.",
    sortOrder: 51,
  },
  {
    category: "PRIVACY_PRACTICES",
    citation: "164.520(c)",
    title: "Distribute NPP to Patients at First Service",
    description:
      "Provide the NPP to each patient at their first service delivery and make good-faith efforts to obtain written acknowledgment of receipt. Evidence: signed patient acknowledgment forms and distribution log.",
    sortOrder: 52,
  },
  {
    category: "PRIVACY_PRACTICES",
    citation: "164.520(c)(1)",
    title: "Post NPP in Facility and on Website",
    description:
      "Prominently display the NPP in your facility and on your website (if you have one). Evidence: photo of the posted NPP in reception area and a screenshot of the website page.",
    sortOrder: 53,
  },
  {
    category: "PRIVACY_PRACTICES",
    citation: "164.524",
    title: "Honor Patient Right to Access PHI",
    description:
      "Provide patients access to their PHI within 30 days of request (15 days for electronic records). Charge only cost-based fees. Evidence: written access request policy and a log of completed access requests.",
    sortOrder: 54,
  },
  {
    category: "PRIVACY_PRACTICES",
    citation: "164.526",
    title: "Honor Patient Right to Amend PHI",
    description:
      "Accept and respond to patient requests to amend their PHI within 60 days. Document acceptances and denials with reasoning. Evidence: amendment request policy and log of amendment decisions.",
    sortOrder: 55,
  },
  {
    category: "PRIVACY_PRACTICES",
    citation: "164.528",
    title: "Provide Accounting of Disclosures",
    description:
      "Track non-routine disclosures of PHI for the past 6 years and provide an accounting to patients upon request within 60 days. Evidence: disclosure tracking log.",
    sortOrder: 56,
  },
  {
    category: "PRIVACY_PRACTICES",
    citation: "164.522(a)",
    title: "Honor Patient Right to Request Restrictions",
    description:
      "Implement a process for patients to request restrictions on certain uses and disclosures of their PHI. Note: restrictions paid out-of-pocket must be honored. Evidence: restriction request policy and log of decisions.",
    sortOrder: 57,
  },
  {
    category: "PRIVACY_PRACTICES",
    citation: "164.522(b)",
    title: "Honor Confidential Communications Requests",
    description:
      "Accommodate reasonable requests from patients to receive PHI via alternative means or at alternative locations. Evidence: confidential communications policy and request log.",
    sortOrder: 58,
  },
  // PRIVACY_USES
  {
    category: "PRIVACY_USES",
    citation: "164.502(b)",
    title: "Establish Minimum Necessary Standard Policies",
    description:
      "Implement policies limiting uses and disclosures of PHI to the minimum necessary to accomplish the intended purpose. Evidence: minimum necessary policies and workforce training records.",
    sortOrder: 59,
  },
  {
    category: "PRIVACY_USES",
    citation: "164.514(d)",
    title: "Identify and Limit Routine Disclosures",
    description:
      "Document standard protocols for routine disclosures and limit PHI shared to the minimum necessary for each type of disclosure. Evidence: minimum necessary matrix or policy document.",
    sortOrder: 60,
  },
  {
    category: "PRIVACY_USES",
    citation: "164.508",
    title: "Obtain Valid Authorization for Non-Routine Disclosures",
    description:
      "Use a HIPAA-compliant authorization form for uses and disclosures not permitted without patient authorization, including marketing and most research. Evidence: authorization form template and completed authorizations on file.",
    sortOrder: 61,
  },
  {
    category: "PRIVACY_USES",
    citation: "164.508 / 164.512",
    title: "Implement Heightened Protection for Special PHI Categories",
    description:
      "Apply heightened protections for psychotherapy notes, HIV/AIDS information, substance abuse treatment records, and genetic information, which require specific authorization beyond standard HIPAA. Evidence: special category PHI policy.",
    sortOrder: 62,
  },
  {
    category: "PRIVACY_USES",
    citation: "164.502(a)",
    title: "Document Permitted Uses and Disclosures",
    description:
      "Maintain written policies documenting all permitted uses and disclosures, including treatment, payment, healthcare operations, and public health reporting. Evidence: use and disclosure policy document.",
    sortOrder: 63,
  },
  // PRIVACY_WORKFORCE
  {
    category: "PRIVACY_WORKFORCE",
    citation: "164.530(a)",
    title: "Designate HIPAA Privacy Officer",
    description:
      "Designate an individual responsible for developing and implementing your Privacy Rule policies and procedures. May be the same person as the Security Officer. Evidence: written designation letter or job description naming the Privacy Officer.",
    sortOrder: 64,
  },
  {
    category: "PRIVACY_WORKFORCE",
    citation: "164.530(b)",
    title: "Train Workforce on HIPAA Privacy Rule",
    description:
      "Train all workforce members on your privacy policies within a reasonable time of hiring and when policies change materially. Evidence: training attendance records and training materials.",
    sortOrder: 65,
  },
  {
    category: "PRIVACY_WORKFORCE",
    citation: "164.530(d)",
    title: "Implement Privacy Complaint Process",
    description:
      "Establish and document a process for patients and others to file privacy complaints, and track all complaints received and their resolution. Evidence: complaint policy and complaint log.",
    sortOrder: 66,
  },
  {
    category: "PRIVACY_WORKFORCE",
    citation: "164.530(e)",
    title: "Apply Sanctions for Privacy Violations",
    description:
      "Apply appropriate sanctions against workforce members who violate privacy policies. Evidence: privacy sanction policy and records of any sanctions applied.",
    sortOrder: 67,
  },
  {
    category: "PRIVACY_WORKFORCE",
    citation: "164.530(j)",
    title: "Retain Privacy Documentation for 6 Years",
    description:
      "Retain all Privacy Rule policies, procedures, and required documentation for at least 6 years from the date of creation or last effective date. Evidence: document retention policy and archive system.",
    sortOrder: 68,
  },
];

// ── NIST CSF tasks (101–122) ──────────────────────────────────────────────────

const NIST_TASKS: (typeof SECURITY_TASKS)[number][] = [
  // CSF_IDENTIFY
  {
    category: "CSF_IDENTIFY",
    citation: "ID.AM-1",
    title: "Maintain Comprehensive Asset Inventory",
    description:
      "Identify and document all hardware, software, and data assets within the scope of your cybersecurity program. Update the inventory at least quarterly. Evidence: asset inventory spreadsheet with owner and classification.",
    sortOrder: 101,
  },
  {
    category: "CSF_IDENTIFY",
    citation: "ID.AM-3",
    title: "Document Data Flows for Sensitive Information",
    description:
      "Map how sensitive data flows through your organization — creation, transmission, storage, and disposal — so you understand your full attack surface. Evidence: data flow diagrams or data flow documentation.",
    sortOrder: 102,
  },
  {
    category: "CSF_IDENTIFY",
    citation: "ID.GV-1",
    title: "Establish Cybersecurity Governance Structure",
    description:
      "Define and document cybersecurity roles, responsibilities, and accountability throughout the organization. Assign leadership accountability for cybersecurity outcomes. Evidence: cybersecurity governance policy and org chart with accountable roles.",
    sortOrder: 103,
  },
  {
    category: "CSF_IDENTIFY",
    citation: "ID.GV-4",
    title: "Integrate Cybersecurity into Risk Management",
    description:
      "Incorporate cybersecurity risk into your enterprise risk management processes and budget planning. Evidence: enterprise risk management plan that includes cyber risk with dollar estimates.",
    sortOrder: 104,
  },
  {
    category: "CSF_IDENTIFY",
    citation: "ID.RA-1",
    title: "Conduct Cybersecurity Risk Assessments",
    description:
      "Perform periodic risk assessments identifying threats, vulnerabilities, likelihood, and impact to prioritize cybersecurity investments. Evidence: current risk assessment report with threat-vulnerability pairings.",
    sortOrder: 105,
  },
  {
    category: "CSF_IDENTIFY",
    citation: "ID.RA-3",
    title: "Identify and Prioritize Vulnerabilities",
    description:
      "Maintain awareness of vulnerabilities in your systems through scanning and threat intelligence, and prioritize remediation based on risk. Evidence: vulnerability management policy and tracked vulnerability register.",
    sortOrder: 106,
  },
  {
    category: "CSF_IDENTIFY",
    citation: "ID.RA-6",
    title: "Define Organizational Risk Tolerance",
    description:
      "Document your organization's risk tolerance and use it to guide cybersecurity investment decisions and risk acceptance approvals. Evidence: risk tolerance statement approved by leadership.",
    sortOrder: 107,
  },
  // CSF_PROTECT
  {
    category: "CSF_PROTECT",
    citation: "PR.AC-1",
    title: "Implement Identity and Access Management",
    description:
      "Manage identities and credentials for authorized users, services, and hardware. Enforce least-privilege access and review permissions periodically. Evidence: IAM policy and quarterly access review records.",
    sortOrder: 108,
  },
  {
    category: "CSF_PROTECT",
    citation: "PR.AC-3",
    title: "Manage Remote Access",
    description:
      "Manage remote access to assets with controls such as VPN, MFA enforcement, and monitoring of remote sessions. Evidence: remote access policy and VPN or remote access tool configuration.",
    sortOrder: 109,
  },
  {
    category: "CSF_PROTECT",
    citation: "PR.AT-1",
    title: "Train Workforce on Cybersecurity",
    description:
      "Provide regular cybersecurity awareness training to all users, including phishing simulations, and test effectiveness. Evidence: training records and phishing simulation results.",
    sortOrder: 110,
  },
  {
    category: "CSF_PROTECT",
    citation: "PR.DS-1",
    title: "Implement Data Protection Controls",
    description:
      "Protect data at rest and in transit with encryption and other controls appropriate to data sensitivity. Evidence: encryption configuration documentation and data protection policy.",
    sortOrder: 111,
  },
  {
    category: "CSF_PROTECT",
    citation: "PR.DS-3",
    title: "Manage Removable Media Lifecycle",
    description:
      "Manage data storage media throughout its lifecycle — provisioning, use, and secure disposal — to prevent unauthorized disclosure. Evidence: media management policy and disposal records.",
    sortOrder: 112,
  },
  {
    category: "CSF_PROTECT",
    citation: "PR.MA-1",
    title: "Implement Controlled Maintenance Procedures",
    description:
      "Perform maintenance and repair of assets in a controlled, authorized, and logged manner. Ensure that remote maintenance is monitored. Evidence: maintenance policy and maintenance log.",
    sortOrder: 113,
  },
  {
    category: "CSF_PROTECT",
    citation: "PR.PT-1",
    title: "Deploy Protective Technology Controls",
    description:
      "Manage audit/log records, deploy endpoint protection, firewalls, web filtering, and email security to protect against common attack vectors. Evidence: security technology inventory and configuration documentation.",
    sortOrder: 114,
  },
  // CSF_DETECT
  {
    category: "CSF_DETECT",
    citation: "DE.CM-1",
    title: "Monitor Networks and Systems Continuously",
    description:
      "Continuously monitor networks, endpoints, and user activity for anomalous events and potential cybersecurity incidents. Evidence: monitoring tool configuration and sample alert or dashboard report.",
    sortOrder: 115,
  },
  {
    category: "CSF_DETECT",
    citation: "DE.DP-1",
    title: "Maintain and Test Detection Processes",
    description:
      "Establish and regularly test event detection processes. Define and train the roles responsible for detection activities. Evidence: detection process documentation and test results.",
    sortOrder: 116,
  },
  {
    category: "CSF_DETECT",
    citation: "DE.AE-2",
    title: "Analyze Detected Events",
    description:
      "Analyze detected events to understand attack targets, techniques, and scope, and correlate with threat intelligence. Evidence: analysis templates and example event analysis reports.",
    sortOrder: 117,
  },
  // CSF_RESPOND
  {
    category: "CSF_RESPOND",
    citation: "RS.RP-1",
    title: "Establish and Maintain Incident Response Plan",
    description:
      "Create and maintain a documented incident response plan covering roles, responsibilities, communication channels, and escalation procedures. Test it at least annually. Evidence: incident response plan and test after-action report.",
    sortOrder: 118,
  },
  {
    category: "CSF_RESPOND",
    citation: "RS.AN-1",
    title: "Conduct Incident Analysis",
    description:
      "Perform structured analysis of cybersecurity incidents to understand impact, root cause, and attacker techniques. Evidence: completed incident analysis reports.",
    sortOrder: 119,
  },
  {
    category: "CSF_RESPOND",
    citation: "RS.CO-2",
    title: "Communicate During and After Incidents",
    description:
      "Coordinate incident response activities with internal stakeholders (leadership, legal, IT) and external parties (vendors, law enforcement, regulators) as appropriate. Evidence: incident communication plan and stakeholder contact list.",
    sortOrder: 120,
  },
  {
    category: "CSF_RESPOND",
    citation: "RS.IM-1",
    title: "Conduct Post-Incident Reviews",
    description:
      "After each significant incident, review response activities, identify gaps, and update procedures to improve future response. Evidence: post-incident review reports.",
    sortOrder: 121,
  },
  // CSF_RECOVER
  {
    category: "CSF_RECOVER",
    citation: "RC.RP-1",
    title: "Implement and Test Recovery Planning",
    description:
      "Maintain a recovery plan that prioritizes restoration of critical systems and data, and test it annually with tabletop or live exercises. Evidence: recovery plan with RTO/RPO objectives and annual test results.",
    sortOrder: 122,
  },
  {
    category: "CSF_RECOVER",
    citation: "RC.IM-1",
    title: "Improve Recovery Processes",
    description:
      "Incorporate lessons learned from incidents, exercises, and industry best practices into your recovery planning to close gaps. Evidence: improvement tracking log with updates applied after each exercise.",
    sortOrder: 123,
  },
  {
    category: "CSF_RECOVER",
    citation: "RC.CO-1",
    title: "Communicate Recovery Activities",
    description:
      "Coordinate restoration activities with internal teams and external parties, and communicate restoration status to stakeholders. Evidence: stakeholder communication plan and example recovery status update.",
    sortOrder: 124,
  },
];

// ── Seed runner ───────────────────────────────────────────────────────────────

async function main() {
  // 1. Upsert frameworks.
  const frameworkMap: Record<string, string> = {};
  for (const f of FRAMEWORKS) {
    const fw = await prisma.framework.upsert({
      where: { slug: f.slug },
      update: { name: f.name, description: f.description, sortOrder: f.sortOrder },
      create: f,
    });
    frameworkMap[f.slug] = fw.id;
  }

  const securityId = frameworkMap["hipaa-security"];
  const privacyId = frameworkMap["hipaa-privacy"];
  const nistId = frameworkMap["nist-csf"];

  // 2. Upsert task templates (keyed on sortOrder for idempotency).
  const allTasks = [
    ...SECURITY_TASKS.map((t) => ({ ...t, frameworkId: securityId })),
    ...PRIVACY_TASKS.map((t) => ({ ...t, frameworkId: privacyId })),
    ...NIST_TASKS.map((t) => ({ ...t, frameworkId: nistId })),
  ];

  for (const t of allTasks) {
    const existing = await prisma.taskTemplate.findFirst({
      where: { sortOrder: t.sortOrder },
    });
    if (existing) {
      await prisma.taskTemplate.update({ where: { id: existing.id }, data: t });
    } else {
      await prisma.taskTemplate.create({ data: t });
    }
  }

  // 3. Back-fill frameworkId on any existing Security Rule templates that
  //    were seeded before multi-framework support (sortOrder 1–50).
  await prisma.taskTemplate.updateMany({
    where: { frameworkId: null, sortOrder: { lte: 50 } },
    data: { frameworkId: securityId },
  });

  // 4. For each existing org, ensure they have an OrgFramework record for
  //    HIPAA Security Rule (the original framework all orgs were enrolled in).
  const orgsWithTasks = await prisma.organization.findMany({
    where: { tasks: { some: {} } },
    select: { id: true },
  });
  for (const org of orgsWithTasks) {
    await prisma.orgFramework.upsert({
      where: {
        organizationId_frameworkId: {
          organizationId: org.id,
          frameworkId: securityId,
        },
      },
      update: {},
      create: { organizationId: org.id, frameworkId: securityId },
    });
  }

  console.log(
    `Seeded ${allTasks.length} task templates across ${FRAMEWORKS.length} frameworks.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
