import React from 'react';
import SlideBare from '../Components/SlideBare';
import ThemeToggle from '../Components/ThemeToggle';
import '../Style/RequestButtonsGuide.css';
import {
  Info,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  FileText,
  CircleCheckBig,
  CircleX,
  CircleDashed,
  PackageCheck,
  PackageOpen,
  RotateCcw,
  CheckCheck,
  AlertTriangle,
  UserCheck,
  Wrench,
  ScanLine,
  ClipboardCheck,
  Boxes,
  ArrowRight,
} from 'lucide-react';

const workflowSections = [
  {
    id: 1,
    title: '1. Pending',
    subtitle: 'Request just submitted - System automatically validates based on stock',
    color: 'yellow',
    icon: <CircleDashed size={18} />,
    final: false,
    actionGroups: [
      {
        badge: 'Automatic Approval',
        badgeColor: 'green',
        icon: <CircleCheckBig size={14} />,
        title: 'System automatically approves if stock is available',
        nextStatus: 'Approved',
        whenClick: [
          'System checks stock availability in real-time',
          'If ALL materials are in stock → Auto-Approved',
          'Request status changes to "Approved"',
          'QR code generated automatically',
          'Validation code created',
          'Student receives approval notification',
          'All happens in seconds without manual intervention',
        ],
        useCase: 'Immediately when stock is sufficient for all requested materials',
        example:
          'A student requests 2 Audio boards and 3 sensors. The system checks stock and finds all materials available. It automatically approves the request, generates a QR code, and sends an approval notification to the student.',
      },
      {
        badge: 'Automatic Rejection',
        badgeColor: 'red',
        icon: <CircleX size={14} />,
        title: 'System automatically rejects if stock is insufficient',
        nextStatus: 'Rejected',
        whenClick: [
          'System checks stock availability',
          'If ANY material is out of stock → Auto-Rejected',
          'Request status changes to "Rejected"',
          'System generates rejection reason automatically',
          'Student receives rejection notification with reason',
          'Workflow ends - student must submit new request',
        ],
        useCase: 'Immediately when stock is insufficient for requested materials',
        example:
          'A student requests 2 Audio boards and 3 sensors. The system checks stock and finds that 1 Arduino board is out of stock. It automatically rejects the request, generates a rejection reason, and sends a rejection notification to the student.',
      },
    ],
  },
  {
    id: 2,
    title: '2. Approved',
    subtitle: 'Request auto-approved by system, technician needs to prepare materials',
    color: 'blue',
    icon: <CheckCircle2 size={18} />,
    actionGroups: [
      {
        badge: 'Mark Ready',
        badgeColor: 'cyan',
        icon: <PackageCheck size={14} />,
        title: 'Confirm materials are prepared and ready for student pickup',
        nextStatus: 'Ready',
        whenClick: [
          'Request status changes to "Ready"',
          'Technician records condition of EACH material',
          'Choose: Excellent, Good, Fair, Damaged, or Needs Repair',
          'Student is notified materials are ready',
          'Materials are physically set aside for pickup',
          'Optional notes about material condition',
        ],
        useCase: 'After physically gathering and checking all materials',
        example:
          'You collected 2 Audio boards and 3 sensors from storage. You click "Mark Ready" and set each material condition (Excellent / Good / etc).',
      },
    ],
  },
  {
    id: 3,
    title: '3. Ready',
    subtitle: 'Materials prepared, waiting for student to collect',
    color: 'cyan',
    icon: <PackageOpen size={18} />,
    actionGroups: [
      {
        badge: 'Confirm Pickup',
        badgeColor: 'purple',
        icon: <ScanLine size={14} />,
        title: 'Student has collected the materials',
        nextStatus: 'Collected',
        whenClick: [
          'Request status changes to "Collected"',
          'Technician verifies condition of materials again',
          'Records which materials were given to student',
          'QR code is scanned at exit checkpoint',
          'Technician name recorded as "Issued By"',
          'Collection timestamp saved',
        ],
        useCase: 'When student arrives and takes materials',
        example:
          'Student arrives at the lab. You scan the QR code, verify identity, hand over the materials, and click "Confirm Pickup".',
      },
      {
        badge: 'Reject',
        badgeColor: 'red',
        icon: <CircleX size={14} />,
        title: 'Cancel if student never comes',
        nextStatus: 'Rejected',
        whenClick: ['Request cancelled', 'Materials returned to inventory'],
        useCase: "If student doesn't show up or request expired",
        example:
          'Prepared materials stayed reserved too long and student never arrived. You cancel the request and return items to stock.',
      },
    ],
  },
  {
    id: 4,
    title: '4. Collected',
    subtitle: 'Student has taken materials, transition period',
    color: 'purple',
    icon: <ClipboardCheck size={18} />,
    actionGroups: [
      {
        badge: 'In Use',
        badgeColor: 'indigo',
        icon: <Boxes size={14} />,
        title: 'Confirm materials are actively being used by student',
        nextStatus: 'In Use',
        whenClick: [
          'Request status changes to "In Use"',
          'Materials officially tracked as borrowed',
          'Expected return date is active',
          'System tracks if materials become overdue',
        ],
        useCase: 'After student confirms they started using materials',
        example:
          'Student has the materials and started the work session, so you move the request to In Use.',
      },
      {
        badge: 'Confirm Return',
        badgeColor: 'orange',
        icon: <RotateCcw size={14} />,
        title: 'Student returns materials immediately',
        nextStatus: 'Returned',
        whenClick: [
          'Request status changes to "Returned"',
          'Technician checks condition of EACH material',
          'Compare return condition vs. issued condition',
          'Document any damage or issues',
          'Return timestamp recorded',
          'Technician name recorded as "Received By"',
        ],
        useCase: 'If student returns materials right away (same day)',
        example:
          'Student returns materials shortly after pickup. You inspect each item, record conditions, and add notes if needed.',
      },
    ],
  },
  {
    id: 5,
    title: '5. In Use',
    subtitle: 'Materials currently with student, being used for project',
    color: 'indigo',
    icon: <Boxes size={18} />,
    actionGroups: [
      {
        badge: 'Confirm Return',
        badgeColor: 'orange',
        icon: <RotateCcw size={14} />,
        title: 'Student brings back the materials',
        nextStatus: 'Returned',
        whenClick: [
          'Request status changes to "Returned"',
          'Technician inspects EACH material carefully',
          'Records condition: Excellent, Good, Fair, Damaged, Needs Repair',
          'Compares with condition when issued',
          'Notes any damage: "Screen cracked", "Missing cable", etc.',
          'QR code scanned at return checkpoint',
          'Return date/time recorded',
        ],
        useCase: 'When student returns materials to the lab',
        example:
          'Student returns materials after use. You inspect each one carefully, record condition, and add notes about scratches or missing accessories.',
      },
    ],
  },
  {
    id: 6,
    title: '6. Returned',
    subtitle: 'Materials physically returned, need to be processed',
    color: 'orange',
    icon: <RotateCcw size={18} />,
    actionGroups: [
      {
        badge: 'Complete',
        badgeColor: 'green',
        icon: <CheckCheck size={14} />,
        title: 'Finalize request and return materials to inventory',
        nextStatus: 'Completed',
        whenClick: [
          'Request status changes to "Completed"',
          'Materials added back to inventory',
          'Material quantities updated in stock',
          'If damaged, material status set to "Needs Repair"',
          'Request closed and archived',
          'Complete timeline available for auditing',
          'Student can now make new requests',
        ],
        useCase: 'After inspecting materials and updating inventory',
        example:
          'Materials inspected and back in storage. Inventory updated. You click "Complete" to close the request.',
      },
      {
        badge: 'In Use',
        badgeColor: 'indigo',
        icon: <Boxes size={14} />,
        title: 'Student needs to re-borrow materials',
        nextStatus: 'In Use',
        whenClick: [
          'Request status goes back to "In Use"',
          'Materials given back to student',
          'New expected return date set',
        ],
        useCase: 'If student forgot something or needs extension',
        example:
          'Student returned the materials but still needs them for one more session, so you reopen the request to In Use.',
      },
    ],
  },
  {
    id: 7,
    title: '7. Completed',
    subtitle: 'Request finished, materials back in inventory - NO MORE ACTIONS',
    color: 'green',
    icon: <CheckCheck size={18} />,
    final: true,
    finalText: 'Final Status - No actions available. Request workflow is complete.',
    actionGroups: [],
  },
  {
    id: 8,
    title: '8. Rejected',
    subtitle: 'Request denied or canceled - NO MORE ACTIONS',
    color: 'red',
    icon: <CircleX size={18} />,
    final: true,
    finalText: 'Final Status - No actions available. Request workflow is complete.',
    actionGroups: [],
  },
];

function StatusCard({ section }) {
  return (
    <section className={`rqg-status-card ${section.color}`}>
      <div className="rqg-status-header">
        <div className="rqg-status-title-wrap">
          <div className={`rqg-status-icon ${section.color}`}>{section.icon}</div>
          <div>
            <h3>
              {section.title} <ArrowRight size={14} className="rqg-inline-arrow" />
            </h3>
            <p>{section.subtitle}</p>
          </div>
        </div>
      </div>

      {section.final ? (
        <div className="rqg-final-box">
          <div className="rqg-final-icon">
            <CheckCircle2 size={22} />
          </div>
          <p>{section.finalText}</p>
        </div>
      ) : (
        <>
          <p className="rqg-actions-count">Available Actions ({section.actionGroups.length}):</p>

          <div className="rqg-action-list">
            {section.actionGroups.map((action, index) => (
              <div key={index} className="rqg-action-card">
                <div className="rqg-action-top">
                  <div className="rqg-action-top-left">
                    <span className={`rqg-badge ${action.badgeColor}`}>
                      {action.icon}
                      {action.badge}
                    </span>

                    <div className="rqg-action-heading">
                      <h4>{action.title}</h4>
                      <span className="rqg-next-status">
                        ➜ Next Status: <strong>{action.nextStatus}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rqg-action-grid">
                  <div className="rqg-info-box">
                    <h5>🟢 What Happens When You Click:</h5>
                    <ul>
                      {action.whenClick.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rqg-side-column">
                    <div className="rqg-info-box warning">
                      <h5>🟠 When To Use This Button:</h5>
                      <p>{action.useCase}</p>
                    </div>

                    <div className="rqg-info-box example">
                      <h5>📘 Example:</h5>
                      <p>{action.example}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default function RequestButtonsGuide() {
  return (
    <div className="rqg-layout">
      <SlideBare activeLabel="Requests" />

      <main className="rqg-main">
        <div className="rqg-shell">
          <div className="rqg-topbar">
            <div>
              <h1 className="rqg-title">Request Buttons - Complete Guide</h1>
              <p className="rqg-subtitle">
                Understanding what each action button does in the request workflow
              </p>
            </div>

            <ThemeToggle />
          </div>

          <section className="rqg-hero-box">
            <div className="rqg-hero-title">
              <Info size={16} />
              <span>How it Works</span>
            </div>
            <p>
              Each request follows a workflow with different statuses. Depending on the current
              status,
              <strong> Admin</strong> and <strong> Storekeeper users</strong> see action buttons to
              move the request to the next stage.
            </p>
            <p>
              <strong>Students cannot see these buttons</strong> - they can only view their request
              status and timeline.
            </p>
          </section>

          {workflowSections.map((section) => (
            <StatusCard key={section.id} section={section} />
          ))}

          <section className="rqg-extra-card">
            <div className="rqg-extra-header">
              <FileText size={18} />
              <h3>Action Modal Details</h3>
            </div>

            <p className="rqg-extra-text">
              When you click any action button, a <strong>modal window</strong> opens with a form to
              fill out:
            </p>

            <div className="rqg-extra-grid">
              <div className="rqg-mini-card blue-soft">
                <ul>
                  <li>
                    <strong>For Ready, Collected, Returned, Completed:</strong>
                  </li>
                  <li>Material Condition Table: Each material has a dropdown menu</li>
                  <li>Condition options: Excellent, Good, Fair, Damaged, Needs Repair</li>
                  <li>Previous condition shown</li>
                  <li>Lot details</li>
                  <li>Notes field: Optional text to add details</li>
                </ul>
              </div>

              <div className="rqg-mini-card red-soft">
                <ul>
                  <li>
                    <strong>For Reject:</strong>
                  </li>
                  <li>Notes REQUIRED</li>
                  <li>Examples: "Stock insufficient", "Material damaged", "Duplicate request"</li>
                  <li>Cannot submit until notes are provided</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rqg-extra-card">
            <div className="rqg-extra-header">
              <ShieldCheck size={18} />
              <h3>Who Can See These Buttons?</h3>
            </div>

            <div className="rqg-role-grid">
              <div className="rqg-role-card admin">
                <h4>👨‍💼 Admin</h4>
                <p>
                  Can see and use <strong>ALL action buttons</strong> for all requests
                </p>
              </div>

              <div className="rqg-role-card keeper">
                <h4>🏪 Storekeeper</h4>
                <p>
                  Can see and use <strong>ALL action buttons</strong> for all requests
                </p>
              </div>

              <div className="rqg-role-card student">
                <h4>🎓 Student</h4>
                <p>
                  <strong>Cannot see any action buttons</strong> - only can see status and timeline
                </p>
              </div>
            </div>
          </section>

          <section className="rqg-extra-card">
            <div className="rqg-extra-header">
              <Clock3 size={18} />
              <h3>Quick Reference - Complete Workflow</h3>
            </div>

            <div className="rqg-code-box">
              <p>
                <strong>Standard Flow:</strong>
              </p>
              <p>
                <span className="rqg-flow yellow">Pending</span> ➜
                <span className="rqg-flow blue"> Auto-Approved</span> ➜
                <span className="rqg-flow blue"> Approved</span> ➜
                <span className="rqg-flow cyan"> Ready</span> ➜
                <span className="rqg-flow purple"> Collected</span> ➜
                <span className="rqg-flow indigo"> In Use</span> ➜
                <span className="rqg-flow orange"> Returned</span> ➜
                <span className="rqg-flow green"> Completed</span>
              </p>

              <p>
                <strong>Rejection Flow:</strong>
              </p>
              <p>
                <span className="rqg-flow yellow">Pending</span> ➜
                <span className="rqg-flow red"> Auto-Rejected</span> [Stock insufficient]
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
