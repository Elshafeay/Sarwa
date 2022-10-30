export const checkingEnvVariables = () => {
  if(!process.env.DB_HOST){
    throw new Error('DB_HOST must be defined!');
  }
  if(!process.env.DB_USERNAME){
    throw new Error('DB_USERNAME must be defined!');
  }
  if(!process.env.DB_NAME && !process.env.DB_TEST_NAME){
    // either of them should be defined
    throw new Error('DB_NAME must be defined!');
  }
  if(!process.env.BROKERAGE_URL){
    // either of them should be defined
    throw new Error('BROKERAGE_URL must be defined!');
  }
};