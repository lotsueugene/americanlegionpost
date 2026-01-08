module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const hasEnvVar = !!process.env.GOOGLE_SERVICE_ACCOUNT;
  const envVarLength = process.env.GOOGLE_SERVICE_ACCOUNT?.length || 0;

  let parseError = null;
  let parsed = null;

  if (hasEnvVar) {
    try {
      parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    } catch (err) {
      parseError = err.message;
    }
  }

  res.status(200).json({
    hasEnvVar,
    envVarLength,
    parseError,
    hasProjectId: parsed?.project_id ? true : false,
    hasPrivateKey: parsed?.private_key ? true : false,
    keyType: parsed?.type || null
  });
};
