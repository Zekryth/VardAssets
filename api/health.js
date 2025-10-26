// /api/health.js
// Endpoint de prueba para Vercel Serverless Functions

export default function handler(req, res) {
  res.status(200).json({
    message: '🚀 MapShade Backend funcionando correctamente (Vercel Serverless)',
    timestamp: new Date(),
    version: '1.0.0'
  });
}
