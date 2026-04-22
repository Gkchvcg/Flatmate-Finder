import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:5001/api' });

async function run() {
  try {
    // We need a token to test these...
    // Let's create a user
    const reg = await api.post('/auth/register', { name: "Test User", email: "test_profile_api@example.com", password: "password123" });
    const token = reg.data.token;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log("Token acquired", token.slice(0, 10));
    
    const [profileRes, sentRes, receivedRes, myPropsRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/interests/me'),
        api.get('/interests/received'),
        api.get('/properties/my')
    ]);
    console.log("Profile", Object.keys(profileRes.data));
    console.log("My Properties", myPropsRes.data);
    console.log("ALL APIs worked.");
  } catch(e) {
    console.error("Error", e.response?.data || e.message);
  }
}
run();
