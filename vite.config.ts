import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carica le variabili d'ambiente per la modalità corrente (es. 'production')
  // dal file .env o dall'ambiente del processo di build (come Vercel).
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // 'define' sostituisce le occorrenze di queste chiavi nel codice con i valori forniti.
    // Questo è il modo corretto per esporre in modo sicuro le variabili d'ambiente
    // al codice del client durante il processo di build di Vite.
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})