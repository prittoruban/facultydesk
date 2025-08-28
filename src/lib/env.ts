/**
 * Environment configuration validation
 */

interface RequiredEnvVars {
  JWT_SECRET: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  GOOGLE_SHEETS_CREDENTIALS: string;
}

function validateEnvironment(): RequiredEnvVars {
  const requiredVars = [
    'JWT_SECRET',
    'ADMIN_EMAIL', 
    'ADMIN_PASSWORD',
    'GOOGLE_SHEETS_CREDENTIALS'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env.local file or environment configuration.');
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate Google Sheets credentials format
  try {
    JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS!);
  } catch {
    console.error('❌ Invalid GOOGLE_SHEETS_CREDENTIALS format. Must be valid JSON.');
    throw new Error('Invalid Google Sheets credentials format');
  }

  return {
    JWT_SECRET: process.env.JWT_SECRET!,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
    GOOGLE_SHEETS_CREDENTIALS: process.env.GOOGLE_SHEETS_CREDENTIALS!,
  };
}

// Validate environment on module load
const env = validateEnvironment();

export default env;
