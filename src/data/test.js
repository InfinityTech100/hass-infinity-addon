const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3OTQ4N2I1MGMxY2I0MmZhYWM4YTRlNmE0ZjA2NGQ5ZCIsImlhdCI6MTcyMDAwMzk4OSwiZXhwIjoyMDM1MzYzOTg5fQ.HFPWcuRjC1WlY29mR5OhE18mZ_MeQZWywY9jx30FLsU';
const apiUrl = 'http://localhost:8123/api/states';

async function fetchAllStates() {
  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data);
  } else {
    console.error('Error fetching data:', response.status, response.statusText);
  }
}

fetchAllStates();
