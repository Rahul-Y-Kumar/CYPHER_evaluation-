import { db, COMPETITION_TYPE_IDS } from '../src/backend/db';
import { CompetitionService } from '../src/services/competitionService';
import { ProblemStatementService } from '../src/services/problemStatementService';
import { SubmissionService } from '../src/services/submissionService';
import { LeaderboardService } from '../src/services/leaderboardService';
import { AuditService } from '../src/services/auditService';
import type { UserContext } from '../src/backend/types';

// Setup Test Users
const adminUser: UserContext = {
  userId: '00000000-0000-0000-0000-000000000099',
  email: 'admin@cypher.org',
  role: 'admin',
  fullName: 'Super Admin',
};

const participantUser: UserContext = {
  userId: '00000000-0000-0000-0000-000000000088',
  email: 'participant@university.edu',
  role: 'participant',
  fullName: 'Alex Student',
};

const judgeUser: UserContext = {
  userId: '00000000-0000-0000-0000-000000000077',
  email: 'judge@techfirm.com',
  role: 'judge',
  fullName: 'Lead Judge',
};

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName} - ${details || 'Assertion failed'}`);
    failedTests++;
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('⚡ CYPHER 4.0 PARTICIPANT SUBMISSION & BACKEND TEST SUITE');
  console.log('======================================================\n');

  // Reset database to clean state
  db.resetToSeedData();
  SubmissionService.setDeadline(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // active deadline

  // TEST 1: Hackathon submission
  console.log('--- TEST 1: Hackathon submission ---');
  let hackSubmission: any;
  try {
    const hackPS = ProblemStatementService.getByCompetition('HACKATHON', true)[0];
    hackSubmission = SubmissionService.createSubmission({
      competition_type_id: COMPETITION_TYPE_IDS.HACKATHON,
      problem_statement_id: hackPS.id,
      team_name: 'Squad Hackers',
      team_lead_name: 'Alice Hacker',
      team_lead_email: 'alice@hackers.io',
      members_count: 4,
      project_title: 'Kernel eBPF Shield',
      tagline: 'High-speed packet defense',
      description: 'Built with Rust and eBPF probes for kernel anomaly interception.',
      github_url: 'https://github.com/alice/shield',
      deploy_url: 'https://shield.cypher.dev',
      userContext: participantUser,
    });
    assert(
      hackSubmission &&
      hackSubmission.competition_type_id === COMPETITION_TYPE_IDS.HACKATHON &&
      hackSubmission.problem_statement_id === hackPS.id &&
      hackSubmission.status === 'SUBMITTED',
      'Test 1: Hackathon submission'
    );
  } catch (e: any) {
    assert(false, 'Test 1: Hackathon submission', e.message);
  }

  // TEST 2: Ideathon submission
  console.log('\n--- TEST 2: Ideathon submission ---');
  let ideaSubmission: any;
  try {
    const ideaPS = ProblemStatementService.getByCompetition('IDEATHON', true)[0];
    ideaSubmission = SubmissionService.createSubmission({
      competition_type_id: COMPETITION_TYPE_IDS.IDEATHON,
      problem_statement_id: ideaPS.id,
      team_name: 'Ideation Lab',
      team_lead_name: 'Bob Visionary',
      team_lead_email: 'bob@vision.io',
      members_count: 3,
      project_title: 'Global Carbon Ledger Architecture',
      tagline: 'Decentralized carbon tracking system',
      description: 'System design for cross-border carbon credit verification.',
      github_url: 'https://github.com/bob/carbon-ledger',
      deploy_url: 'https://carbon.cypher.dev',
      userContext: participantUser,
    });
    assert(
      ideaSubmission &&
      ideaSubmission.competition_type_id === COMPETITION_TYPE_IDS.IDEATHON &&
      ideaSubmission.problem_statement_id === ideaPS.id &&
      ideaSubmission.status === 'SUBMITTED',
      'Test 2: Ideathon submission'
    );
  } catch (e: any) {
    assert(false, 'Test 2: Ideathon submission', e.message);
  }

  // TEST 3: Invalid PS (non-existent ID)
  console.log('\n--- TEST 3: Invalid PS rejected ---');
  try {
    let failed = false;
    try {
      SubmissionService.createSubmission({
        competition_type_id: COMPETITION_TYPE_IDS.HACKATHON,
        problem_statement_id: '00000000-0000-0000-0000-999999999999', // Non-existent
        team_name: 'Ghost Squad',
        team_lead_name: 'Ghost Lead',
        team_lead_email: 'ghost@cypher.org',
        project_title: 'Ghost Project',
        description: 'Should fail',
        github_url: 'https://github.com/ghost/repo',
      });
    } catch (err: any) {
      failed = true;
    }
    assert(failed, 'Test 3: invalid PS');
  } catch (e: any) {
    assert(false, 'Test 3: invalid PS', e.message);
  }

  // TEST 4: PS from wrong competition
  console.log('\n--- TEST 4: PS from wrong competition rejected ---');
  try {
    const hackPS = ProblemStatementService.getByCompetition('HACKATHON', true)[0];
    let failed = false;
    try {
      SubmissionService.createSubmission({
        competition_type_id: COMPETITION_TYPE_IDS.IDEATHON, // Mismatch with Hackathon PS!
        problem_statement_id: hackPS.id,
        team_name: 'Mismatch Squad',
        team_lead_name: 'Mismatch Lead',
        team_lead_email: 'mismatch@cypher.org',
        project_title: 'Mismatch Project',
        description: 'Should fail due to relation check',
        github_url: 'https://github.com/mismatch/repo',
      });
    } catch (err: any) {
      failed = true;
    }
    assert(failed, 'Test 4: PS from wrong competition');
  } catch (e: any) {
    assert(false, 'Test 4: PS from wrong competition', e.message);
  }

  // TEST 5: Inactive PS rejected
  console.log('\n--- TEST 5: Inactive PS rejected ---');
  try {
    const ps = ProblemStatementService.create(adminUser, {
      competition_type_id: COMPETITION_TYPE_IDS.HACKATHON,
      code: 'HACK-TEMP',
      title: 'Temporary PS',
      description: 'Will be deactivated',
      is_active: false,
    });

    let failed = false;
    try {
      SubmissionService.createSubmission({
        competition_type_id: COMPETITION_TYPE_IDS.HACKATHON,
        problem_statement_id: ps.id,
        team_name: 'Inactive PS Squad',
        team_lead_name: 'Lead',
        team_lead_email: 'inactiveps@cypher.org',
        project_title: 'Inactive PS Project',
        description: 'Should fail',
        github_url: 'https://github.com/test/repo',
      });
    } catch (err: any) {
      failed = true;
    }
    assert(failed, 'Test 5: inactive PS');
  } catch (e: any) {
    assert(false, 'Test 5: inactive PS', e.message);
  }

  // TEST 6: Inactive competition rejected
  console.log('\n--- TEST 6: Inactive competition rejected ---');
  try {
    const tempComp = CompetitionService.createCompetition(adminUser, {
      code: 'ARCHIVED_TRACK',
      name: 'Archived Track',
      is_active: false,
    });
    const tempPS = ProblemStatementService.create(adminUser, {
      competition_type_id: tempComp.id,
      code: 'ARCH-01',
      title: 'Archived PS',
      description: 'Archived description',
      is_active: true,
    });

    let failed = false;
    try {
      SubmissionService.createSubmission({
        competition_type_id: tempComp.id,
        problem_statement_id: tempPS.id,
        team_name: 'Archived Squad',
        team_lead_name: 'Lead',
        team_lead_email: 'archived@cypher.org',
        project_title: 'Archived Project',
        description: 'Should fail because competition is inactive',
        github_url: 'https://github.com/test/repo',
      });
    } catch (err: any) {
      failed = true;
    }
    assert(failed, 'Test 6: inactive competition');
  } catch (e: any) {
    assert(false, 'Test 6: inactive competition', e.message);
  }

  // TEST 7: Deadline passed
  console.log('\n--- TEST 7: Deadline passed rejected ---');
  try {
    // Set deadline in the past
    SubmissionService.setDeadline(new Date(Date.now() - 10000));
    const hackPS = ProblemStatementService.getByCompetition('HACKATHON', true)[0];

    let failed = false;
    try {
      SubmissionService.createSubmission({
        competition_type_id: COMPETITION_TYPE_IDS.HACKATHON,
        problem_statement_id: hackPS.id,
        team_name: 'Late Squad',
        team_lead_name: 'Late Lead',
        team_lead_email: 'late@cypher.org',
        project_title: 'Late Project',
        description: 'Should fail because deadline passed',
        github_url: 'https://github.com/late/repo',
      });
    } catch (err: any) {
      failed = true;
    }
    // Restore deadline
    SubmissionService.setDeadline(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    assert(failed, 'Test 7: deadline passed');
  } catch (e: any) {
    SubmissionService.setDeadline(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    assert(false, 'Test 7: deadline passed', e.message);
  }

  // TEST 8: Duplicate submission blocked
  console.log('\n--- TEST 8: Duplicate submission blocked ---');
  try {
    const hackPS = ProblemStatementService.getByCompetition('HACKATHON', true)[0];
    let duplicateBlocked = false;
    try {
      // Re-submitting with alice@hackers.io who already submitted in Test 1
      SubmissionService.createSubmission({
        competition_type_id: COMPETITION_TYPE_IDS.HACKATHON,
        problem_statement_id: hackPS.id,
        team_name: 'Duplicate Squad',
        team_lead_name: 'Alice Hacker',
        team_lead_email: 'alice@hackers.io', // Already submitted
        project_title: 'Duplicate Kernel Shield',
        description: 'Should be blocked',
        github_url: 'https://github.com/alice/shield2',
      });
    } catch (err: any) {
      duplicateBlocked = true;
    }
    assert(duplicateBlocked, 'Test 8: duplicate submission');
  } catch (e: any) {
    assert(false, 'Test 8: duplicate submission', e.message);
  }

  // TEST 9: Editing draft & Immutability enforcement (Participant blocked from changing track, Admin can reassign)
  console.log('\n--- TEST 9: Editing draft & Immutability enforcement ---');
  try {
    // 9a. Save a draft
    const hackPS = ProblemStatementService.getByCompetition('HACKATHON', true)[0];
    const draft = SubmissionService.saveDraft({
      competition_type_id: COMPETITION_TYPE_IDS.HACKATHON,
      problem_statement_id: hackPS.id,
      team_name: 'Draft Team',
      project_title: 'Draft Project Title',
      description: 'Initial draft notes',
    });
    assert(draft.status === 'DRAFT', 'Test 9a: draft created');

    // 9b. Participant attempts to change competition_type_id on a submitted project (hackSubmission from Test 1)
    let participantReassignBlocked = false;
    try {
      SubmissionService.updateSubmission(
        hackSubmission.id,
        { competition_type_id: COMPETITION_TYPE_IDS.IDEATHON },
        participantUser
      );
    } catch (err: any) {
      participantReassignBlocked = true;
    }
    assert(participantReassignBlocked, 'Test 9b: participant cannot change competition type on submitted project');

    // 9c. Admin reassigns competition track and PS with audit logging
    const newHackPS = ProblemStatementService.getByCompetition('HACKATHON', true)[1];
    const adminUpdated = SubmissionService.updateSubmission(
      hackSubmission.id,
      { problem_statement_id: newHackPS.id },
      adminUser
    );
    assert(
      adminUpdated.problem_statement_id === newHackPS.id,
      'Test 9c: authorized admin can reassign PS'
    );
  } catch (e: any) {
    assert(false, 'Test 9: editing draft and immutability', e.message);
  }

  // TEST 10: Final submission confirmation details
  console.log('\n--- TEST 10: Final submission confirmation details ---');
  try {
    const hackPS = ProblemStatementService.getByCompetition('HACKATHON', true)[0];
    const finalSub = SubmissionService.createSubmission({
      competition_type_id: COMPETITION_TYPE_IDS.HACKATHON,
      problem_statement_id: hackPS.id,
      team_name: 'Finalist Crew',
      team_lead_name: 'Carol White',
      team_lead_email: 'carol@finalist.org',
      members_count: 4,
      project_title: 'OmniChain Zero-Knowledge Proof Aggregator',
      tagline: 'Sub-second recursive SNARK verification',
      description: 'Complete pipeline for multi-chain recursive zero-knowledge compression.',
      github_url: 'https://github.com/finalist/omnichain-zk',
      deploy_url: 'https://zk-omnichain.dev',
      demo_video_url: 'https://youtu.be/omnichain-demo',
      file_name: 'OMNICHAIN_ZK_SPEC.pdf',
      file_size: '18.4 MB',
    });

    const comp = CompetitionService.getById(finalSub.competition_type_id);
    const ps = ProblemStatementService.getById(finalSub.problem_statement_id);

    assert(
      finalSub.submission_code.startsWith('CYP-') &&
      finalSub.team_name === 'Finalist Crew' &&
      finalSub.project_title === 'OmniChain Zero-Knowledge Proof Aggregator' &&
      comp !== undefined && comp.code === 'HACKATHON' &&
      ps !== undefined && ps.code === hackPS.code &&
      finalSub.status === 'SUBMITTED',
      'Test 10: final submission'
    );
  } catch (e: any) {
    assert(false, 'Test 10: final submission', e.message);
  }

  console.log('\n======================================================');
  console.log(`🏁 TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests();
