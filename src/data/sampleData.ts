import type { OKRData } from '../types/okr';

export const sampleData: OKRData = {
  // ─────────────────────────────────────────────
  // ORGANIZATIONAL OBJECTIVES
  // Source: Org OKRs 2026.pdf
  // ─────────────────────────────────────────────
  orgObjectives: [
    {
      id: 'org-obj-1',
      title: 'Enable Continuum-of-Care (CoC) to drive health impact',
      keyResults: [
        {
          id: 'org-kr-1',
          objectiveId: 'org-obj-1',
          title:
            'Scalable digital systems that document and support patient journeys for new health services between community and facility care settings are operational in Tanzania and Zanzibar by 2026, and plans approved for Malawi to achieve this in 2027',
        },
        {
          id: 'org-kr-2',
          objectiveId: 'org-obj-1',
          title:
            'A refreshed Theory of Change is successfully used in donors\' meeting and external messaging by Q3 — measured by 2 donors\' feedback on clarity',
        },
        {
          id: 'org-kr-3',
          objectiveId: 'org-obj-1',
          title:
            'The organizational impact measurement framework is operational by the end of April 2026',
        },
      ],
    },
    {
      id: 'org-obj-2',
      title: 'Strengthen financial resilience and expand our pipeline to meet 2027 growth goals',
      keyResults: [
        {
          id: 'org-kr-4',
          objectiveId: 'org-obj-2',
          title:
            'Secure $5.0M in total in new funding — 40% is unrestricted & $1.8M secured for use to fully cover 2026 budget (~$3.4M total, counting Rippleworks)',
        },
        {
          id: 'org-kr-5',
          objectiveId: 'org-obj-2',
          title:
            'Build a "high-likely" and "likely" probability pipeline (≥50% probability) of $7M',
        },
        {
          id: 'org-kr-6',
          objectiveId: 'org-obj-2',
          title:
            'Maintain a minimum cash reserve of 3 months of current operating expenses at all times',
        },
      ],
    },
    {
      id: 'org-obj-3',
      title: 'Operate D-tree with lean and agile systems to respond effectively to external volatility',
      keyResults: [
        {
          id: 'org-kr-7',
          objectiveId: 'org-obj-3',
          title:
            'Essential steering tools and processes (Organizational OKRs, Milestones, KPI dashboards, Performance Management, unrestricted funds allocations, and synchronized meetings) are in place and working, making the organization more effective and efficient',
        },
        {
          id: 'org-kr-8',
          objectiveId: 'org-obj-3',
          title:
            'Staff fatigue is reduced as monitored by a survey in Dec 2025, Jun/Jul 2026, and Dec 2026',
        },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // TEAMS
  // Sources: (Country)Team Tanzania OKRs.pdf
  //          (Country) Team Zanzibar OKRs.pdf
  //          Team Program Unit OKRs 2026.pdf
  // ─────────────────────────────────────────────
  teams: [
    // ── TANZANIA (Country Team) ──────────────────
    {
      id: 'team-tz',
      name: 'Tanzania',
      type: 'country',
      objectives: [
        {
          id: 'team-tz-obj-1',
          teamId: 'team-tz',
          title: 'Deepen impact by implementing new health areas',
          linkedOrgKRIds: ['org-kr-1'],
          keyResults: [
            {
              id: 'team-tz-kr-1',
              objectiveId: 'team-tz-obj-1',
              teamId: 'team-tz',
              title:
                'The national digital community health system (Afya Jamii) platform is expanded to support community-based diabetes and hypertension services by Q4 2026',
            },
            {
              id: 'team-tz-kr-2',
              objectiveId: 'team-tz-obj-1',
              teamId: 'team-tz',
              title:
                'Health workers (CHWs and ADDO dispensers) utilize the newly developed NCD digital tools to serve at least 2,700 people with NCD care by October 2026',
            },
          ],
        },
        {
          id: 'team-tz-obj-2',
          teamId: 'team-tz',
          title: 'Enable Continuum-of-Care (CoC) to drive health impact',
          linkedOrgKRIds: ['org-kr-1'],
          keyResults: [
            {
              id: 'team-tz-kr-3',
              objectiveId: 'team-tz-obj-2',
              teamId: 'team-tz',
              title:
                'The national digital community health system (Afya Jamii) and primary health facility system (GOTHOMIS) are technically integrated and operational — can document and support patient journeys for NCD/RMNCH use cases between the systems — by Q4 2026',
            },
            {
              id: 'team-tz-kr-4',
              objectiveId: 'team-tz-obj-2',
              teamId: 'team-tz',
              title:
                '80% of individuals referred from the community (CHWs and ADDOs) to the health facility for follow-up of RMNCH and NCD-related services access the relevant health services by October 2026',
            },
            {
              id: 'team-tz-kr-5',
              objectiveId: 'team-tz-obj-2',
              teamId: 'team-tz',
              title:
                'Design for a collaborative care model for diabetes and hypertension and learnings to inform integration are completed by end of Q2, and implementation is initiated in select health facilities and CHWs by end of Q4',
            },
          ],
        },
        {
          id: 'team-tz-obj-3',
          teamId: 'team-tz',
          title: 'Secure funding for D-tree\'s long-term impact',
          linkedOrgKRIds: ['org-kr-4'],
          keyResults: [
            {
              id: 'team-tz-kr-6',
              objectiveId: 'team-tz-obj-3',
              teamId: 'team-tz',
              title:
                '$1.5 million is raised by Q3 2026 ($1M by Q2) to improve coordinated care and quality of care in Tanzanian community and facility settings',
            },
          ],
        },
      ],
    },

    // ── ZANZIBAR (Country Team) ──────────────────
    {
      id: 'team-znz',
      name: 'Zanzibar',
      type: 'country',
      objectives: [
        {
          id: 'team-znz-obj-1',
          teamId: 'team-znz',
          title:
            'Demonstrate a high-quality, evidence-driven Continuum of Care model underpinned by a stable Jamii ni Afya system, positioning Zanzibar as an investable example of digitally enabled primary health care integration',
          linkedOrgKRIds: ['org-kr-1', 'org-kr-3'],
          keyResults: [
            {
              id: 'team-znz-kr-1',
              objectiveId: 'team-znz-obj-1',
              teamId: 'team-znz',
              title:
                'By Q4 2026, the pneumonia Continuum of Care workflow is operational in one district hospital and associated PHC facilities, used by ~60 CHWs, with ≥75% referral completion or documented case follow-up and bi-directional digital data flow functioning between community and facility levels',
            },
            {
              id: 'team-znz-kr-2',
              objectiveId: 'team-znz-obj-1',
              teamId: 'team-znz',
              title:
                'By Q4 2026, Jamii ni Afya demonstrates stable routine use across Zanzibar, with graduated CHWs maintaining ≥90% monthly data syncing, ensuring reliable visibility of community-level service delivery',
            },
            {
              id: 'team-znz-kr-3',
              objectiveId: 'team-znz-obj-1',
              teamId: 'team-znz',
              title:
                'By Q2 2026, a Continuum of Care baseline assessment is completed informing the pediatric pneumonia care journey, generating the foundational evidence required to initiate a robust evaluation in 2027',
            },
          ],
        },
        {
          id: 'team-znz-obj-2',
          teamId: 'team-znz',
          title:
            'Strategically leverage innovation to position Zanzibar as a launchpad for D-tree, demonstrating high-learning initiatives and actionable concepts',
          linkedOrgKRIds: ['org-kr-1', 'org-kr-5'],
          keyResults: [
            {
              id: 'team-znz-kr-4',
              objectiveId: 'team-znz-obj-2',
              teamId: 'team-znz',
              title:
                'By Q4 2026, at least one high-learning innovation initiative is actively implemented in Zanzibar, with documented processes, evidence, and actionable insights demonstrating feasibility and potential applicability in other geographies',
            },
            {
              id: 'team-znz-kr-5',
              objectiveId: 'team-znz-obj-2',
              teamId: 'team-znz',
              title:
                'By Q2 2026, at least two Zanzibar innovation concepts leveraging Jamii ni Afya or addressing gaps in the digital health ecosystem are actively included and advanced in the organizational business development pipeline through Q4 2026',
            },
          ],
        },
        {
          id: 'team-znz-obj-3',
          teamId: 'team-znz',
          title:
            'Zanzibar demonstrates agility, technical excellence, and trusted execution in delivering strategic priorities, generating evidence, and deploying unrestricted funding effectively',
          linkedOrgKRIds: ['org-kr-7', 'org-kr-3'],
          keyResults: [
            {
              id: 'team-znz-kr-6',
              objectiveId: 'team-znz-obj-3',
              teamId: 'team-znz',
              title:
                'By end of Q4 2026, Zanzibar staff demonstrate effective and pro-active collaboration with regional support roles, implementing actionable recommendations from the mid-year review to strengthen strategic execution, operational effectiveness, and responsiveness',
            },
            {
              id: 'team-znz-kr-7',
              objectiveId: 'team-znz-obj-3',
              teamId: 'team-znz',
              title:
                'By end of 2026, Zanzibar has implemented its approved internal concept note for unrestricted funding across CoC, innovation, and evidence priorities, with an internal assessment rating the implementation as positive based on timeliness, strategic alignment, and learning captured',
            },
            {
              id: 'team-znz-kr-8',
              objectiveId: 'team-znz-obj-3',
              teamId: 'team-znz',
              title:
                'Throughout 2026, Zanzibar consistently contributes timely, high-quality data to the organizational quarterly impact measurement framework and convenes regular reflection and analysis meetings to inform strategic decision-making',
            },
          ],
        },
      ],
    },

    // ── PROGRAM UNIT (Thematic / Global Team) ───
    {
      id: 'team-pu',
      name: 'Program Unit',
      type: 'thematic',
      objectives: [
        {
          id: 'team-pu-obj-1',
          teamId: 'team-pu',
          title: 'Expand from community into facility and direct-to-client care',
          linkedOrgKRIds: ['org-kr-1', 'org-kr-3', 'org-kr-5'],
          keyResults: [
            {
              id: 'team-pu-kr-1',
              objectiveId: 'team-pu-obj-1',
              teamId: 'team-pu',
              title:
                'Scalable digital systems that document and support patient journeys for new health services between community and facility care settings are operational in Tanzania and Zanzibar by 2026, and plans approved for Malawi to achieve this in 2027',
            },
            {
              id: 'team-pu-kr-2',
              objectiveId: 'team-pu-obj-1',
              teamId: 'team-pu',
              title:
                'A robust evaluation of a Continuum of Care program is underway by end of 2026',
            },
            {
              id: 'team-pu-kr-3',
              objectiveId: 'team-pu-obj-1',
              teamId: 'team-pu',
              title:
                'At least 10 strong concepts/proposals submitted to funders with requests for funding that would expand CoC work by end of 2026, with concept leadership, guidance, or significant contributions by Program Unit member(s)',
            },
          ],
        },
        {
          id: 'team-pu-obj-2',
          teamId: 'team-pu',
          title: 'Deepen our impact and generate evidence',
          linkedOrgKRIds: ['org-kr-1', 'org-kr-7', 'org-kr-3'],
          keyResults: [
            {
              id: 'team-pu-kr-4',
              objectiveId: 'team-pu-obj-2',
              teamId: 'team-pu',
              title:
                'D-tree is on track to integrate at least one new health area (e.g. NCD, mental health) into national digital health platforms — to strengthen service delivery — in Tanzania, Zanzibar, and/or Malawi by Q4',
            },
            {
              id: 'team-pu-kr-5',
              objectiveId: 'team-pu-obj-2',
              teamId: 'team-pu',
              title:
                'All CoC country initiatives (Tanzania, Zanzibar, Malawi) show evidence by Q4 of government integration and engagement that supports future ownership pathway (e.g. aligned with national plans, government participation in design/implementation, early discussions about sustainability)',
            },
            {
              id: 'team-pu-kr-6',
              objectiveId: 'team-pu-obj-2',
              teamId: 'team-pu',
              title:
                'Quarterly reporting system for global impact indicators is implemented and data is reliably available for external communications and triggering actions for continuous quality improvement by April 2026, with automated dashboards functional and useful by Q2',
            },
            {
              id: 'team-pu-kr-7',
              objectiveId: 'team-pu-obj-2',
              teamId: 'team-pu',
              title:
                'We are on track to meet 2026 Global Program Indicators annual targets, as assessed after Q3',
            },
          ],
        },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // INDIVIDUALS
  // Source: Zanzibar Individual OKRs.pdf
  // All individuals belong to team-znz (Zanzibar)
  // Period: H1 2026 (most KRs target Q2 2026)
  // ─────────────────────────────────────────────
  individuals: [
    // ── Hannah McCarrick Mikidadi ────────────────
    {
      id: 'ind-hannah',
      name: 'Hannah McCarrick Mikidadi',
      teamId: 'team-znz',
      role: 'Country Director',
      keyResults: [
        {
          id: 'ind-hannah-kr-1',
          individualId: 'ind-hannah',
          title:
            'By end of Q2 2026, at least 2 BD opportunities for Zanzibar have ≥50% probability for a total expected value of $500,000',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-5',
        },
        {
          id: 'ind-hannah-kr-2',
          individualId: 'ind-hannah',
          title:
            'By end of Q2 2026, a government-endorsed collaborative care model and evaluation design are completed, in line with the Zanzibar Investment Case, clearly articulating pathways to improved outcomes and informing a future scale and financing strategy',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-3',
        },
        {
          id: 'ind-hannah-kr-3',
          individualId: 'ind-hannah',
          title:
            'By end of Q2 2026, the GenAI supervisor tool is actively used by a minimum of 20 CHW supervisors, with documented evidence of demonstrable results',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-4',
        },
      ],
    },

    // ── Jimmy Mbazi ──────────────────────────────
    {
      id: 'ind-jimmy',
      name: 'Jimmy Mbazi',
      teamId: 'team-znz',
      role: 'Program Manager',
      keyResults: [
        {
          id: 'ind-jimmy-kr-1',
          individualId: 'ind-jimmy',
          title:
            'Deliver a successfully coordinated CoC pilot by effectively managing the workplan, stakeholder and team alignment, and implementation processes — ensuring timely issue resolution, consistent monthly documentation of progress and adaptations, and a clear D-tree–aligned evaluation plan to measure pilot success',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-1',
        },
        {
          id: 'ind-jimmy-kr-2',
          individualId: 'ind-jimmy',
          title:
            'Botnar and Hilton grants are meeting program milestones and performance targets by end of Q2',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-7',
        },
        {
          id: 'ind-jimmy-kr-3',
          individualId: 'ind-jimmy',
          title:
            'Support business development, strategic planning, and organizational transition efforts in Zanzibar by contributing to priority initiatives as defined in collaboration with the Country Director through regular check-ins',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-6',
        },
      ],
    },

    // ── Halima Khamis ────────────────────────────
    {
      id: 'ind-halima',
      name: 'Halima Khamis',
      teamId: 'team-znz',
      role: 'CHW Program Coordinator',
      keyResults: [
        {
          id: 'ind-halima-kr-1',
          individualId: 'ind-halima',
          title:
            'By end of Q2 2026, ensure at least 90% of graduated CHWs are actively working with functioning devices and syncing data for at least 4 months during Q1 and Q2, verified through routine reporting and field validation',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-2',
        },
        {
          id: 'ind-halima-kr-2',
          individualId: 'ind-halima',
          title:
            'By end of Q2 2026, ensure all CHWs receive their stipends for at minimum March through June 2026, with payments disbursed within two weeks of the last working day of each month, confirmed through MoH payment records',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-2',
        },
        {
          id: 'ind-halima-kr-3',
          individualId: 'ind-halima',
          title:
            'By end of Q2 2026, demonstrate effective coordination of CoC pilot activities by facilitating regular joint planning and alignment sessions, identifying and resolving at least 80% of coordination or implementation issues raised, and ensuring D-tree-supported activities are operationally feasible within MoH CHW Unit workflows',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-1',
        },
      ],
    },

    // ── Stephen Mhuli ────────────────────────────
    {
      id: 'ind-stephen-m',
      name: 'Stephen Mhuli',
      teamId: 'team-znz',
      role: 'ICT Advisor',
      keyResults: [
        {
          id: 'ind-stephen-m-kr-1',
          individualId: 'ind-stephen-m',
          title:
            'By end of Q2, MOH ICT staff demonstrate the ability to independently navigate and explain core Jamii ni Afya backend components and at least one system integration, with reduced reliance on D-tree technical support',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-6',
        },
        {
          id: 'ind-stephen-m-kr-2',
          individualId: 'ind-stephen-m',
          title:
            'Support the integration of Jamii ni Afya and ZanEMR by assisting with implementation, end-to-end testing, pilot training, and post-pilot feedback incorporation for the pneumonia protocol, with verified data flow by Q2',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-1',
        },
        {
          id: 'ind-stephen-m-kr-3',
          individualId: 'ind-stephen-m',
          title:
            'Support Jamii ni Afya and DHIS2 Integration by completing data mapping and pushing of 100 data elements (out of ~400) to DHIS2 and verifying end-to-end data flow by end of Q2',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-8',
        },
      ],
    },

    // ── Imran Esmail ─────────────────────────────
    {
      id: 'ind-imran',
      name: 'Imran Esmail',
      teamId: 'team-znz',
      role: 'Software Developer',
      keyResults: [
        {
          id: 'ind-imran-kr-1',
          individualId: 'ind-imran',
          title:
            'Lead the Jamii ni Afya and DHIS2 Integration by completing data mapping and pushing of 100 data elements (out of ~400) to DHIS2 and verifying end-to-end data flow by end of Q2',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-8',
        },
        {
          id: 'ind-imran-kr-2',
          individualId: 'ind-imran',
          title:
            'By end of Q2 2026, successfully deploy the Kadi ya Matibabu Household Registration features in Jamii ni Afya, with completed and signed-off User Acceptance Testing (UAT) from both program and government stakeholders',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-2',
        },
        {
          id: 'ind-imran-kr-3',
          individualId: 'ind-imran',
          title:
            'By end of Q2 2026, resolve at least 98% of critical Jamii ni Afya bug entries within agreed response times, ensuring stable and uninterrupted data flows between Jamii ni Afya, DHIS2, and ZanEMR',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-2',
        },
      ],
    },

    // ── Mohamed Al-Mafazy ────────────────────────
    {
      id: 'ind-mohamed',
      name: 'Mohamed Al-Mafazy',
      teamId: 'team-znz',
      role: 'Government Relations & ICT Coordinator',
      keyResults: [
        {
          id: 'ind-mohamed-kr-1',
          individualId: 'ind-mohamed',
          title:
            'Consistent in-person participation of relevant ICT Unit representatives in weekly Jamii ni Afya coordination meetings is sustained through proactive facilitation, demonstrated by regular attendance, active participation, and documented follow-up on agreed actions',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-6',
        },
        {
          id: 'ind-mohamed-kr-2',
          individualId: 'ind-mohamed',
          title:
            'Secure formal assignment of at least two Ministry ICT software engineers to support Jamii ni Afya implementation and development activities on a full-time basis by end of Q1, with defined roles and active contribution',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-6',
        },
        {
          id: 'ind-mohamed-kr-3',
          individualId: 'ind-mohamed',
          title:
            'By end of Q2 2026, ensure at least 90% of graduated CHWs are actively working with functioning devices and syncing data for at least 4 months during Q1 and Q2, verified through routine reporting and field validation',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-2',
        },
        {
          id: 'ind-mohamed-kr-4',
          individualId: 'ind-mohamed',
          title:
            'By end of Q2, the Ministry signs an agreement with a third party to manage Jamii ni Afya devices, ensuring standardized and sustainable device management',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-7',
        },
      ],
    },

    // ── Aisha Mohammed ───────────────────────────
    {
      id: 'ind-aisha',
      name: 'Aisha Mohammed',
      teamId: 'team-znz',
      role: 'M&E Officer',
      keyResults: [
        {
          id: 'ind-aisha-kr-1',
          individualId: 'ind-aisha',
          title:
            'By end of Q2 2026, ensure all program and organizational indicators for D-tree Zanzibar portfolios (including the Continuum of Care initiative) are integrated into country MEL systems and tracked quarterly to enable real-time monitoring of performance against targets',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-8',
        },
        {
          id: 'ind-aisha-kr-2',
          individualId: 'ind-aisha',
          title:
            'By end of Q2 2026, facilitate learning across both D-tree teams and government stakeholders, including holding at least two cross-team learning sessions and presenting in Technical Working Groups — use JnA data to document and identify programmatic insights, and implement at least two process improvements based on data findings',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-8',
        },
        {
          id: 'ind-aisha-kr-3',
          individualId: 'ind-aisha',
          title:
            'By end of Q2 2026, identify and practice additional skills building related to M&E, as identified from discussions with the program unit and based on organizational, Zanzibar, and Aisha\'s work priorities',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-6',
        },
      ],
    },

    // ── Abbas Wandella ───────────────────────────
    {
      id: 'ind-abbas',
      name: 'Abbas Wandella',
      teamId: 'team-znz',
      role: 'Digital Health & Program Officer',
      keyResults: [
        {
          id: 'ind-abbas-kr-1',
          individualId: 'ind-abbas',
          title:
            'Lead stakeholder coordination to enable interoperability between JnA, ZanEMR, and Kadi ya Matibabu by delivering documented integration specifications, facilitating at least 4 coordination meetings, and completing successful end-to-end bidirectional referral data exchange testing by Q2',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-1',
        },
        {
          id: 'ind-abbas-kr-2',
          individualId: 'ind-abbas',
          title:
            'Produce and submit a draft Continuum of Care intervention design document, including revised protocols, workflows, and digital tool requirements, for review and approval from program and technical leads by end of Q2',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-3',
        },
        {
          id: 'ind-abbas-kr-3',
          individualId: 'ind-abbas',
          title:
            'Ensure the Continuum of Care intervention design is aligned with RGoZ priorities and ready for evaluation and scale by facilitating at least 4 stakeholder engagement meetings with RGoZ, securing documented stakeholder validation, and delivering a complete evaluation-ready intervention package by Q2',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-3',
        },
        {
          id: 'ind-abbas-kr-4',
          individualId: 'ind-abbas',
          title:
            'Ensure implementation of the Gen AI solution across the two pilot districts, documentation of learnings, and use of the AI tool by 20 CHW Supervisors in their monthly meetings with CHWs by end of Q2',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-4',
        },
      ],
    },

    // ── Lucy Haule ───────────────────────────────
    {
      id: 'ind-lucy',
      name: 'Lucy Haule',
      teamId: 'team-znz',
      role: 'Program Officer',
      keyResults: [
        {
          id: 'ind-lucy-kr-1',
          individualId: 'ind-lucy',
          title:
            'By end of Q2 2026, structured feedback from the JnA system and JnA users (CHWs and supervisors) is systematically collected, synthesized quarterly, and translated into at least three documented program or system improvement actions',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-2',
        },
        {
          id: 'ind-lucy-kr-2',
          individualId: 'ind-lucy',
          title:
            'By end of Q2 2026, >2 key program implementation risks have been proactively tracked, documented, and mitigation actions have been implemented',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-6',
        },
        {
          id: 'ind-lucy-kr-3',
          individualId: 'ind-lucy',
          title:
            'By end of Q2 2026, CHW performance tracking tools are updated and actively used for monthly performance review, contributing to at least 90% of CHWs meeting defined performance standards',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-2',
        },
      ],
    },

    // ── Stephen Africa ───────────────────────────
    {
      id: 'ind-stephen-a',
      name: 'Stephen Africa',
      teamId: 'team-znz',
      role: 'Partnership & ECD Advisor',
      keyResults: [
        {
          id: 'ind-stephen-a-kr-1',
          individualId: 'ind-stephen-a',
          title:
            'By end of Q2, serve as the primary D-tree–PDB liaison, delivering onboarding and orientation support that results in demonstrated improvements in PDB\'s understanding of the Jamii ni Afya program and ECD workflows, and enabling clearer alignment of data use across JnA and ZM-ECCDP initiatives',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-4',
        },
        {
          id: 'ind-stephen-a-kr-2',
          individualId: 'ind-stephen-a',
          title:
            'Initiate, facilitate or support at least three pro-active actions (technical inputs, stakeholder alignment, document review, or consultation processes) that demonstrably advance progress toward the finalisation of the ZM-ECCDP Plan by end of Q2 2026',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-4',
        },
        {
          id: 'ind-stephen-a-kr-3',
          individualId: 'ind-stephen-a',
          title:
            'By end of Q1, facilitate at least one structured cross-learning exchange between Zanzibar and mainland stakeholders, and ensure key insights and actionable outcomes are synthesized and submitted as a contribution to Hilton\'s annual reporting',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-6',
        },
      ],
    },

    // ── Radhia Iddi ──────────────────────────────
    {
      id: 'ind-radhia',
      name: 'Radhia Iddi',
      teamId: 'team-znz',
      role: 'Finance Officer',
      keyResults: [
        {
          id: 'ind-radhia-kr-1',
          individualId: 'ind-radhia',
          title:
            'By end of Q2 2026, maintain 100% on-time processing of approved payments, supported by a maintained payment tracker that identifies recurring issues and informs monthly reviews and quarterly collaborative meetings with program teams, resulting in documented actions that reduce repeated payment delays',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-7',
        },
        {
          id: 'ind-radhia-kr-2',
          individualId: 'ind-radhia',
          title:
            'By end of Q2 2026, achieve 100% compliance with procurement requirements by ensuring all goods and services have complete documentation, appropriate approvals, and audit-ready records prior to payment processing',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-7',
        },
        {
          id: 'ind-radhia-kr-3',
          individualId: 'ind-radhia',
          title:
            'By end of Q2 2026, independently manage core QuickBooks functions, including posting routine transactions, applying correct account coding, and reconciling entries with at least 95% accuracy, supporting timely and reliable financial records',
          period: 'H1',
          year: 2026,
          linkedTeamKRId: 'team-znz-kr-7',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// PLAIN-TEXT REPRESENTATION (for parsing / display use cases)
// ─────────────────────────────────────────────────────────────
export const sampleInputText = `=== ORGANIZATION: D-tree International | Year: 2026 ===

Objective 1: Enable Continuum-of-Care (CoC) to drive health impact
  KR 1: Scalable digital systems for patient journeys operational in Tanzania and Zanzibar by 2026, plans approved for Malawi by 2027
  KR 2: Refreshed Theory of Change used in donors' meeting and external messaging by Q3 — measured by 2 donors' feedback on clarity
  KR 3: Organizational impact measurement framework operational by end of April 2026

Objective 2: Strengthen financial resilience and expand our pipeline to meet 2027 growth goals
  KR 4: Secure $5.0M in total new funding — 40% unrestricted, $1.8M to fully cover 2026 budget
  KR 5: Build a "high-likely" and "likely" probability pipeline (≥50%) of $7M
  KR 6: Maintain a minimum cash reserve of 3 months of operating expenses at all times

Objective 3: Operate D-tree with lean and agile systems to respond effectively to external volatility
  KR 7: Essential steering tools and processes (OKRs, dashboards, performance management, fund allocations, synced meetings) are in place and working
  KR 8: Staff fatigue reduced as monitored by surveys in Dec 2025, Jun/Jul 2026, and Dec 2026


=== TEAM: Tanzania | Type: country ===

Objective 1: Deepen impact by implementing new health areas
  KR 1: Afya Jamii platform expanded to support community-based diabetes and hypertension services by Q4 2026 -> [Org KR 1: CoC scalable digital systems]
  KR 2: Health workers (CHWs and ADDO dispensers) utilize NCD digital tools to serve ≥2,700 people by October 2026 -> [Org KR 1: CoC scalable digital systems]

Objective 2: Enable Continuum-of-Care (CoC) to drive health impact
  KR 3: Afya Jamii and GOTHOMIS technically integrated and operational for NCD/RMNCH use cases by Q4 2026 -> [Org KR 1: CoC scalable digital systems]
  KR 4: 80% of individuals referred from community to facility for RMNCH and NCD follow-up access relevant services by October 2026 -> [Org KR 1: CoC scalable digital systems]
  KR 5: Collaborative care model for diabetes and hypertension designed by Q2, implementation initiated in select sites by Q4 -> [Org KR 1: CoC scalable digital systems]

Objective 3: Secure funding for D-tree's long-term impact
  KR 6: $1.5M raised by Q3 2026 ($1M by Q2) to improve coordinated care in Tanzanian community and facility settings -> [Org KR 4: Secure $5.0M in new funding]


=== TEAM: Zanzibar | Type: country ===

Objective 1: Demonstrate a high-quality, evidence-driven Continuum of Care model underpinned by a stable Jamii ni Afya system
  KR 1: Pneumonia CoC workflow operational in one district hospital and associated PHC facilities, ~60 CHWs, ≥75% referral completion, bi-directional digital data flow by Q4 -> [Org KR 1: CoC scalable digital systems]
  KR 2: Jamii ni Afya stable routine use across Zanzibar with graduated CHWs maintaining ≥90% monthly data syncing by Q4 -> [Org KR 1: CoC scalable digital systems]
  KR 3: CoC baseline assessment completed by Q2, informing pediatric pneumonia care journey and initiating evaluation in 2027 -> [Org KR 3: Impact measurement framework]

Objective 2: Strategically leverage innovation to position Zanzibar as a launchpad for D-tree
  KR 4: At least one high-learning innovation initiative actively implemented in Zanzibar with documented processes and insights by Q4 -> [Org KR 1: CoC scalable digital systems]
  KR 5: At least two Zanzibar innovation concepts in the organizational BD pipeline by Q2 through Q4 -> [Org KR 5: Build $7M pipeline]

Objective 3: Zanzibar demonstrates agility, technical excellence, and trusted execution
  KR 6: Zanzibar staff demonstrate effective proactive collaboration with regional support roles by Q4, implementing recommendations from mid-year review -> [Org KR 7: Lean and agile steering tools]
  KR 7: Zanzibar implements approved internal concept note for unrestricted funding across CoC, innovation, and evidence priorities by end of 2026 -> [Org KR 7: Lean and agile steering tools]
  KR 8: Zanzibar consistently contributes timely, high-quality data to the org quarterly impact framework and convenes reflection meetings throughout 2026 -> [Org KR 3: Impact measurement framework]


=== TEAM: Program Unit | Type: thematic ===

Objective 1: Expand from community into facility and direct-to-client care
  KR 1: Scalable digital systems for patient journeys operational in Tanzania and Zanzibar by 2026, plans approved for Malawi -> [Org KR 1: CoC scalable digital systems]
  KR 2: Robust evaluation of a CoC program underway by end of 2026 -> [Org KR 3: Impact measurement framework]
  KR 3: At least 10 strong concepts/proposals submitted to funders for CoC work by end of 2026, with Program Unit leadership or significant contribution -> [Org KR 5: Build $7M pipeline]

Objective 2: Deepen our impact and generate evidence
  KR 4: D-tree integrates at least one new health area (e.g. NCD, mental health) into national digital health platforms in TZ, ZNZ, and/or Malawi by Q4 -> [Org KR 1: CoC scalable digital systems]
  KR 5: All CoC country initiatives show evidence of government integration supporting future ownership pathways by Q4 -> [Org KR 7: Lean and agile steering tools]
  KR 6: Quarterly reporting system for global impact indicators implemented and data available for external communications by April 2026, automated dashboards by Q2 -> [Org KR 3: Impact measurement framework]
  KR 7: On track to meet 2026 Global Program Indicators annual targets, assessed after Q3 -> [Org KR 3: Impact measurement framework]


=== INDIVIDUAL: Hannah McCarrick Mikidadi | Team: Zanzibar | Role: Country Director | Period: H1 2026 ===
  KR 1: By Q2 2026, at least 2 BD opportunities for Zanzibar have ≥50% probability for total expected value of $500K -> [Team KR 5: ZNZ innovation concepts in BD pipeline]
  KR 2: By Q2 2026, government-endorsed collaborative care model and evaluation design completed, informing future scale and financing strategy -> [Team KR 3: CoC baseline assessment completed]
  KR 3: By Q2 2026, GenAI supervisor tool used by ≥20 CHW supervisors with documented results -> [Team KR 4: High-learning innovation initiative implemented]

=== INDIVIDUAL: Jimmy Mbazi | Team: Zanzibar | Role: Program Manager | Period: H1 2026 ===
  KR 1: Deliver successfully coordinated CoC pilot — workplan managed, issues resolved, evaluation plan in place -> [Team KR 1: Pneumonia CoC workflow operational]
  KR 2: Botnar and Hilton grants meeting program milestones and targets by Q2 -> [Team KR 7: Internal concept note for unrestricted funding implemented]
  KR 3: Support BD, strategic planning, and organizational transition per Country Director check-ins -> [Team KR 6: Effective proactive collaboration with regional roles]

=== INDIVIDUAL: Halima Khamis | Team: Zanzibar | Role: CHW Program Coordinator | Period: H1 2026 ===
  KR 1: By Q2 2026, ≥90% of graduated CHWs working with functioning devices and syncing data for ≥4 months -> [Team KR 2: Jamii ni Afya stable routine use]
  KR 2: By Q2 2026, all CHWs receive stipends for March–June 2026 disbursed within 2 weeks of each month's last working day -> [Team KR 2: Jamii ni Afya stable routine use]
  KR 3: By Q2 2026, effective CoC pilot coordination with MoH, resolving ≥80% of issues raised -> [Team KR 1: Pneumonia CoC workflow operational]

=== INDIVIDUAL: Stephen Mhuli | Team: Zanzibar | Role: ICT Advisor | Period: H1 2026 ===
  KR 1: By Q2, MOH ICT staff independently navigate JnA backend and explain at least one integration, reducing D-tree support reliance -> [Team KR 6: Effective proactive collaboration with regional roles]
  KR 2: Support JnA and ZanEMR integration — implementation, testing, training, feedback for pneumonia protocol with verified data flow by Q2 -> [Team KR 1: Pneumonia CoC workflow operational]
  KR 3: Support JnA and DHIS2 integration — data mapping and 100 elements pushed to DHIS2 with end-to-end data flow verified by Q2 -> [Team KR 8: Timely, high-quality data to org impact framework]

=== INDIVIDUAL: Imran Esmail | Team: Zanzibar | Role: Software Developer | Period: H1 2026 ===
  KR 1: Lead JnA and DHIS2 Integration — 100 data elements mapped and pushed, end-to-end flow verified by Q2 -> [Team KR 8: Timely, high-quality data to org impact framework]
  KR 2: By Q2 2026, deploy Kadi ya Matibabu Household Registration in JnA with completed UAT sign-off from program and government stakeholders -> [Team KR 2: Jamii ni Afya stable routine use]
  KR 3: By Q2 2026, resolve ≥98% of critical JnA bug entries within agreed response times, maintaining stable data flows between JnA, DHIS2, and ZanEMR -> [Team KR 2: Jamii ni Afya stable routine use]

=== INDIVIDUAL: Mohamed Al-Mafazy | Team: Zanzibar | Role: Government Relations & ICT Coordinator | Period: H1 2026 ===
  KR 1: Sustained in-person ICT Unit participation in weekly JnA coordination meetings, with documented follow-up on agreed actions -> [Team KR 6: Effective proactive collaboration with regional roles]
  KR 2: Secure formal assignment of ≥2 Ministry ICT software engineers for JnA on full-time basis by Q1, with defined roles -> [Team KR 6: Effective proactive collaboration with regional roles]
  KR 3: By Q2 2026, ≥90% of graduated CHWs working with functioning devices and syncing data for ≥4 months -> [Team KR 2: Jamii ni Afya stable routine use]
  KR 4: By Q2, Ministry signs third-party agreement for JnA device management ensuring standardized, sustainable management -> [Team KR 7: Internal concept note for unrestricted funding implemented]

=== INDIVIDUAL: Aisha Mohammed | Team: Zanzibar | Role: M&E Officer | Period: H1 2026 ===
  KR 1: By Q2 2026, all ZNZ program and org indicators (including CoC) integrated into country MEL systems and tracked quarterly -> [Team KR 8: Timely, high-quality data to org impact framework]
  KR 2: By Q2 2026, facilitate ≥2 cross-team learning sessions and present in Technical Working Groups, implement ≥2 process improvements from data findings -> [Team KR 8: Timely, high-quality data to org impact framework]
  KR 3: By Q2 2026, identify and practice additional M&E skills based on org, Zanzibar, and personal work priorities -> [Team KR 6: Effective proactive collaboration with regional roles]

=== INDIVIDUAL: Abbas Wandella | Team: Zanzibar | Role: Digital Health & Program Officer | Period: H1 2026 ===
  KR 1: Lead interoperability stakeholder coordination (JnA, ZanEMR, Kadi ya Matibabu) — documented specs, ≥4 coordination meetings, end-to-end bidirectional referral testing by Q2 -> [Team KR 1: Pneumonia CoC workflow operational]
  KR 2: Produce and submit draft CoC intervention design document (protocols, workflows, digital tool requirements) for review and approval by Q2 -> [Team KR 3: CoC baseline assessment completed]
  KR 3: Ensure CoC intervention design aligned with RGoZ priorities — ≥4 RGoZ stakeholder meetings, documented validation, evaluation-ready package by Q2 -> [Team KR 3: CoC baseline assessment completed]
  KR 4: Ensure Gen AI solution implemented across two pilot districts, learnings documented, used by 20 CHW Supervisors by Q2 -> [Team KR 4: High-learning innovation initiative implemented]

=== INDIVIDUAL: Lucy Haule | Team: Zanzibar | Role: Program Officer | Period: H1 2026 ===
  KR 1: By Q2 2026, JnA system and user feedback systematically collected, synthesized quarterly, translated into ≥3 improvement actions -> [Team KR 2: Jamii ni Afya stable routine use]
  KR 2: By Q2 2026, >2 key program implementation risks proactively tracked, documented, and mitigated -> [Team KR 6: Effective proactive collaboration with regional roles]
  KR 3: By Q2 2026, CHW performance tracking tools updated and used for monthly performance review, contributing to ≥90% of CHWs meeting standards -> [Team KR 2: Jamii ni Afya stable routine use]

=== INDIVIDUAL: Stephen Africa | Team: Zanzibar | Role: Partnership & ECD Advisor | Period: H1 2026 ===
  KR 1: By Q2, serve as primary D-tree–PDB liaison, demonstrating improvements in PDB's understanding of JnA and ECD workflows -> [Team KR 4: High-learning innovation initiative implemented]
  KR 2: Initiate ≥3 pro-active actions advancing ZM-ECCDP Plan finalization by Q2 2026 -> [Team KR 4: High-learning innovation initiative implemented]
  KR 3: By Q1, facilitate structured cross-learning exchange between Zanzibar and mainland stakeholders, synthesize insights for Hilton annual reporting -> [Team KR 6: Effective proactive collaboration with regional roles]

=== INDIVIDUAL: Radhia Iddi | Team: Zanzibar | Role: Finance Officer | Period: H1 2026 ===
  KR 1: By Q2 2026, 100% on-time processing of approved payments with payment tracker maintained and recurring issues documented and resolved -> [Team KR 7: Internal concept note for unrestricted funding implemented]
  KR 2: By Q2 2026, 100% procurement compliance — all goods and services have complete documentation, approvals, and audit-ready records before payment -> [Team KR 7: Internal concept note for unrestricted funding implemented]
  KR 3: By Q2 2026, independently manage core QuickBooks functions with ≥95% accuracy, supporting timely and reliable financial records -> [Team KR 7: Internal concept note for unrestricted funding implemented]
`;
