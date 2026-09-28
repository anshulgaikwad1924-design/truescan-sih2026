import axios from 'axios'

// Points at the FastAPI backend. Stage 3+ will attach the Firebase ID token
// to each request here once Firebase Auth exists.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
})
