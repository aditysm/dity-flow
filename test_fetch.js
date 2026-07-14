const SUPABASE_URL = 'https://msvsqebpidhftdqplclx.supabase.co/rest/v1';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdnNxZWJwaWRoZnRkcXBsY2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MzI5MjIsImV4cCI6MjA5OTQwODkyMn0.YXz9tWpObvZxsS0ys5jJ7w5Uu5pI00j5vbYWk3IS_CE';
const headers = {
  "Content-Type": "application/json",
  "apikey": ANON_KEY,
  "Authorization": `Bearer ${ANON_KEY}`
};

fetch(`${SUPABASE_URL}/transfer_rules?select=*`, { headers })
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
