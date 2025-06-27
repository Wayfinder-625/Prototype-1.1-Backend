const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
};

const questionnaireData = {
  interests: ['technology', 'innovation', 'entrepreneurship'],
  keySkills: ['programming', 'design', 'marketing'],
  experienceLevel: 'beginner',
  preferredDomain: 'technology',
  timeCommitment: 'part-time',
  teamPreference: 'individual',
  location: 'India',
  goals: ['learn', 'network', 'win']
};

async function testEndpoints() {
  try {
    console.log('🚀 Starting API tests...\n');

    // 1. Register a user
    console.log('1. Registering user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ User registered:', registerResponse.data.user_id);
    const userId = registerResponse.data.user_id;

    // 2. Login to get JWT token
    console.log('\n2. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    const token = loginResponse.data.access_token;
    console.log('✅ Login successful');

    // Set up axios with auth header
    const authAxios = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // 3. Create questionnaire response
    console.log('\n3. Creating questionnaire response...');
    const questionnaireResponse = await authAxios.post('/questionnaire', questionnaireData);
    console.log('✅ Questionnaire created:', questionnaireResponse.data.id);

    // 4. Get questionnaire response
    console.log('\n4. Getting questionnaire response...');
    const getResponse = await authAxios.get('/questionnaire/my-response');
    console.log('✅ Questionnaire retrieved:', getResponse.data.id);

    // 5. Test recommendation endpoint
    console.log('\n5. Testing recommendation endpoint...');
    const recommendationResponse = await authAxios.post('/recommendations', {
      userId: userId,
      questionnaireData: questionnaireData
    });
    console.log('✅ Recommendations generated:', recommendationResponse.data.recommendations?.length || 0, 'recommendations');

    // 6. Get stored recommendations
    console.log('\n6. Getting stored recommendations...');
    const storedRecommendations = await authAxios.get('/recommendations/user');
    console.log('✅ Stored recommendations:', storedRecommendations.data.length, 'recommendations');

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 404 && error.response?.data?.message === 'Questionnaire response not found') {
      console.log('\n💡 The user needs to create a questionnaire response first.');
    }
  }
}

testEndpoints(); 