const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUserToken = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token
const testCompetitionId = 'YOUR_COMPETITION_ID_HERE'; // Replace with actual competition ID

async function testCompetitionInteractions() {
  try {
    console.log('🧪 Testing Competition Interaction Tracking...\n');

    // 1. Record a competition click
    console.log('1. Recording competition click...');
    const clickResponse = await axios.post(
      `${BASE_URL}/user-interaction/competition`,
      {
        competitionId: testCompetitionId,
        interactionType: 'click',
        metadata: {
          source: 'competition_list',
          timestamp: new Date().toISOString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${testUserToken}`,
        },
      }
    );
    console.log('✅ Click recorded:', clickResponse.data);

    // 2. Record a competition view
    console.log('\n2. Recording competition view...');
    const viewResponse = await axios.post(
      `${BASE_URL}/user-interaction/competition`,
      {
        competitionId: testCompetitionId,
        interactionType: 'view',
        metadata: {
          source: 'competition_detail',
          duration: 120, // seconds
          timestamp: new Date().toISOString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${testUserToken}`,
        },
      }
    );
    console.log('✅ View recorded:', viewResponse.data);

    // 3. Record an application attempt
    console.log('\n3. Recording application attempt...');
    const applyResponse = await axios.post(
      `${BASE_URL}/user-interaction/competition`,
      {
        competitionId: testCompetitionId,
        interactionType: 'apply',
        metadata: {
          source: 'competition_apply_button',
          timestamp: new Date().toISOString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${testUserToken}`,
        },
      }
    );
    console.log('✅ Application recorded:', applyResponse.data);

    // 4. Get user's competition interactions
    console.log('\n4. Getting user competition interactions...');
    const interactionsResponse = await axios.get(
      `${BASE_URL}/user-interaction/competition/my-interactions`,
      {
        headers: {
          Authorization: `Bearer ${testUserToken}`,
        },
      }
    );
    console.log('✅ User interactions:', interactionsResponse.data);

    // 5. Get user's competition stats
    console.log('\n5. Getting user competition stats...');
    const statsResponse = await axios.get(
      `${BASE_URL}/user-interaction/competition/stats`,
      {
        headers: {
          Authorization: `Bearer ${testUserToken}`,
        },
      }
    );
    console.log('✅ User stats:', statsResponse.data);

    // 6. Get overall analytics
    console.log('\n6. Getting overall analytics...');
    const analyticsResponse = await axios.get(
      `${BASE_URL}/user-interaction/competition/analytics`,
      {
        headers: {
          Authorization: `Bearer ${testUserToken}`,
        },
      }
    );
    console.log('✅ Analytics:', analyticsResponse.data);

    // 7. Test viewing a specific competition (this will automatically track the interaction)
    console.log('\n7. Testing competition detail view with auto-tracking...');
    const competitionResponse = await axios.get(
      `${BASE_URL}/competitions/${testCompetitionId}`,
      {
        headers: {
          Authorization: `Bearer ${testUserToken}`,
        },
      }
    );
    console.log('✅ Competition details:', competitionResponse.data);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Run the tests
testCompetitionInteractions(); 