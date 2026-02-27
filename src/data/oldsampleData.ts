import type { OKRData } from '../types/okr';

export const sampleData: OKRData = {
  orgObjectives: [
    {
      id: 'org-obj-1',
      title: 'Improve health outcomes across East Africa',
      keyResults: [
        { id: 'org-kr-1', objectiveId: 'org-obj-1', title: 'Reduce maternal mortality by 20% in 3 countries' },
        { id: 'org-kr-2', objectiveId: 'org-obj-1', title: 'Train 500 community health workers' },
        { id: 'org-kr-3', objectiveId: 'org-obj-1', title: 'Establish 50 new community health posts' },
      ],
    },
    {
      id: 'org-obj-2',
      title: 'Strengthen digital health infrastructure',
      keyResults: [
        { id: 'org-kr-4', objectiveId: 'org-obj-2', title: 'Deploy EMR system in 30 facilities' },
        { id: 'org-kr-5', objectiveId: 'org-obj-2', title: 'Achieve 80% data reporting compliance' },
        { id: 'org-kr-6', objectiveId: 'org-obj-2', title: 'Launch telemedicine in 5 districts' },
      ],
    },
    {
      id: 'org-obj-3',
      title: 'Build organizational sustainability',
      keyResults: [
        { id: 'org-kr-7', objectiveId: 'org-obj-3', title: 'Secure 3 new multi-year funding partnerships' },
        { id: 'org-kr-8', objectiveId: 'org-obj-3', title: 'Achieve 90% staff retention rate' },
        { id: 'org-kr-9', objectiveId: 'org-obj-3', title: 'Publish 5 research papers on program impact' },
      ],
    },
  ],

  teams: [
    {
      id: 'team-ke',
      name: 'Kenya Health',
      type: 'country',
      objectives: [
        {
          id: 'team-ke-obj-1',
          teamId: 'team-ke',
          title: 'Strengthen primary healthcare in Kenya',
          keyResults: [
          ],
        },
      ],
    },
    {
      id: 'team-tz',
      name: 'Tanzania Health',
      type: 'country',
      objectives: [
        {
          id: 'team-tz-obj-1',
          teamId: 'team-tz',
          title: 'Expand community health services in Tanzania',
          keyResults: [
          ],
        },
      ],
    },
    {
      id: 'team-tech',
      name: 'Digital Health',
      type: 'technical',
      objectives: [
        {
          id: 'team-tech-obj-1',
          teamId: 'team-tech',
          title: 'Build and deploy digital health solutions',
          keyResults: [
          ],
        },
      ],
    },
    {
      id: 'team-ops',
      name: 'Operations & Partnerships',
      type: 'thematic',
      objectives: [
        {
          id: 'team-ops-obj-1',
          teamId: 'team-ops',
          title: 'Ensure organizational growth and sustainability',
          keyResults: [
          ],
        },
      ],
    },
  ],

  individuals: [
    // Kenya Health team
    {
      id: 'ind-1',
      name: 'Jane Muthoni',
      teamId: 'team-ke',
      role: 'Program Manager',
      keyResults: [
      ],
    },
    {
      id: 'ind-2',
      name: 'Peter Ochieng',
      teamId: 'team-ke',
      role: 'Training Coordinator',
      keyResults: [
      ],
    },
    // Tanzania Health team
    {
      id: 'ind-3',
      name: 'Amina Saleh',
      teamId: 'team-tz',
      role: 'Country Director',
      keyResults: [
      ],
    },
    {
      id: 'ind-4',
      name: 'David Mwanga',
      teamId: 'team-tz',
      role: 'Field Operations Lead',
      keyResults: [
      ],
    },
    // Digital Health team
    {
      id: 'ind-5',
      name: 'Sarah Kimani',
      teamId: 'team-tech',
      role: 'Software Engineer',
      keyResults: [
      ],
    },
    {
      id: 'ind-6',
      name: 'James Mushi',
      teamId: 'team-tech',
      role: 'Systems Administrator',
      keyResults: [
      ],
    },
    // Operations & Partnerships team
    {
      id: 'ind-7',
      name: 'Grace Wanjiku',
      teamId: 'team-ops',
      role: 'Grants Manager',
      keyResults: [
      ],
    },
    {
      id: 'ind-8',
      name: 'Michael Otieno',
      teamId: 'team-ops',
      role: 'HR & Admin Lead',
      keyResults: [
      ],
    },
  ],
};

export const sampleInputText = `=== ORGANIZATION ===
Objective: Improve health outcomes across East Africa
  KR: Reduce maternal mortality by 20% in 3 countries
  KR: Train 500 community health workers
  KR: Establish 50 new community health posts

Objective: Strengthen digital health infrastructure
  KR: Deploy EMR system in 30 facilities
  KR: Achieve 80% data reporting compliance
  KR: Launch telemedicine in 5 districts

Objective: Build organizational sustainability
  KR: Secure 3 new multi-year funding partnerships
  KR: Achieve 90% staff retention rate
  KR: Publish 5 research papers on program impact

=== TEAM: Kenya Health | Type: country ===
Objective: Strengthen primary healthcare in Kenya
  KR: Open 10 new health centers in underserved counties -> [Org KR: Establish 50 new community health posts]
  KR: Train 200 CHWs in rural areas -> [Org KR: Train 500 community health workers]
  KR: Reduce maternal mortality by 25% in target counties -> [Org KR: Reduce maternal mortality by 20% in 3 countries]

=== TEAM: Tanzania Health | Type: country ===
Objective: Expand community health services in Tanzania
  KR: Deploy 150 CHWs in 5 regions -> [Org KR: Train 500 community health workers]
  KR: Establish 20 community health posts -> [Org KR: Establish 50 new community health posts]
  KR: Reduce maternal mortality by 15% in pilot districts -> [Org KR: Reduce maternal mortality by 20% in 3 countries]

=== TEAM: Digital Health | Type: technical ===
Objective: Build and deploy digital health solutions
  KR: Deploy EMR in 15 Kenya facilities -> [Org KR: Deploy EMR system in 30 facilities]
  KR: Deploy EMR in 15 Tanzania facilities -> [Org KR: Deploy EMR system in 30 facilities]
  KR: Achieve 80% data compliance across all sites -> [Org KR: Achieve 80% data reporting compliance]
  KR: Launch telemedicine pilot in 5 districts -> [Org KR: Launch telemedicine in 5 districts]

=== TEAM: Operations & Partnerships | Type: thematic ===
Objective: Ensure organizational growth and sustainability
  KR: Secure 3 new multi-year grants -> [Org KR: Secure 3 new multi-year funding partnerships]
  KR: Maintain 90%+ staff retention -> [Org KR: Achieve 90% staff retention rate]
  KR: Publish 5 impact research papers -> [Org KR: Publish 5 research papers on program impact]

=== INDIVIDUAL: Jane Muthoni | Team: Kenya Health | Period: H1 2025 ===
  KR: Establish partnerships with 3 county health departments -> [Team KR: Open 10 new health centers in underserved counties]
  KR: Complete site assessments for 10 health center locations -> [Team KR: Open 10 new health centers in underserved counties]
  KR: Develop maternal health intervention protocol -> [Team KR: Reduce maternal mortality by 25% in target counties]

=== INDIVIDUAL: Peter Ochieng | Team: Kenya Health | Period: H1 2025 ===
  KR: Develop CHW training curriculum for Kenya context -> [Team KR: Train 200 CHWs in rural areas]
  KR: Train first cohort of 100 CHWs -> [Team KR: Train 200 CHWs in rural areas]

=== INDIVIDUAL: Peter Ochieng | Team: Kenya Health | Period: H2 2025 ===
  KR: Establish CHW supervision framework -> [Team KR: Train 200 CHWs in rural areas]

=== INDIVIDUAL: Amina Saleh | Team: Tanzania Health | Period: H1 2025 ===
  KR: Recruit and onboard 75 CHWs in 3 regions -> [Team KR: Deploy 150 CHWs in 5 regions]
  KR: Secure government approval for 10 health posts -> [Team KR: Establish 20 community health posts]
  KR: Launch maternal health program in 3 pilot districts -> [Team KR: Reduce maternal mortality by 15% in pilot districts]

=== INDIVIDUAL: David Mwanga | Team: Tanzania Health | Period: H1 2025 ===
  KR: Establish supply chain for CHW medical kits -> [Team KR: Deploy 150 CHWs in 5 regions]

=== INDIVIDUAL: David Mwanga | Team: Tanzania Health | Period: H2 2025 ===
  KR: Recruit and onboard 75 CHWs in 2 remaining regions -> [Team KR: Deploy 150 CHWs in 5 regions]
  KR: Build 10 community health posts -> [Team KR: Establish 20 community health posts]

=== INDIVIDUAL: Sarah Kimani | Team: Digital Health | Period: H1 2025 ===
  KR: Customize EMR modules for Kenya facility requirements -> [Team KR: Deploy EMR in 15 Kenya facilities]
  KR: Build telemedicine video consultation feature -> [Team KR: Launch telemedicine pilot in 5 districts]

=== INDIVIDUAL: Sarah Kimani | Team: Digital Health | Period: H2 2025 ===
  KR: Implement data sync for offline-first EMR -> [Team KR: Achieve 80% data compliance across all sites]

=== INDIVIDUAL: James Mushi | Team: Digital Health | Period: H1 2025 ===
  KR: Deploy and configure EMR in 15 Tanzania facilities -> [Team KR: Deploy EMR in 15 Tanzania facilities]
  KR: Set up data reporting dashboards for all sites -> [Team KR: Achieve 80% data compliance across all sites]

=== INDIVIDUAL: James Mushi | Team: Digital Health | Period: H2 2025 ===
  KR: Train facility IT staff on EMR maintenance -> [Team KR: Deploy EMR in 15 Tanzania facilities]

=== INDIVIDUAL: Grace Wanjiku | Team: Operations & Partnerships | Period: H1 2025 ===
  KR: Submit 5 grant proposals to major donors -> [Team KR: Secure 3 new multi-year grants]
  KR: Develop impact measurement framework -> [Team KR: Publish 5 impact research papers]

=== INDIVIDUAL: Grace Wanjiku | Team: Operations & Partnerships | Period: H2 2025 ===
  KR: Secure 2 new multi-year partnerships -> [Team KR: Secure 3 new multi-year grants]

=== INDIVIDUAL: Michael Otieno | Team: Operations & Partnerships | Period: H1 2025 ===
  KR: Implement staff wellness program -> [Team KR: Maintain 90%+ staff retention]
  KR: Conduct quarterly staff satisfaction surveys -> [Team KR: Maintain 90%+ staff retention]

=== INDIVIDUAL: Michael Otieno | Team: Operations & Partnerships | Period: H2 2025 ===
  KR: Coordinate 3 research paper submissions -> [Team KR: Publish 5 impact research papers]
`;
