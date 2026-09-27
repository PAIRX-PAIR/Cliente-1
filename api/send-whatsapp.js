const twilio = require('twilio');

// Credenciales desde variables de entorno de Vercel — jamás hardcodeadas ni en el repo.
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { medicamento, telefono } = req.body || {};

  if (!medicamento || !telefono) {
    return res.status(400).json({ error: 'Faltan datos: medicamento y telefono son obligatorios' });
  }

  // Validación mínima del formato E.164 (+573001234567)
  if (!/^\+\d{8,15}$/.test(telefono)) {
    return res.status(400).json({ error: 'Formato de teléfono inválido. Usa +573001234567' });
  }

  try {
    await client.messages.create({
      from: 'whatsapp:+17372508034', // número sandbox de tu cuenta Twilio
      to: `whatsapp:${telefono}`,
      body: `MediAdhi: confirmaste la toma de ${medicamento}. Registro guardado.`
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error enviando WhatsApp:', err.message);
    return res.status(502).json({ error: 'No se pudo enviar la notificación. Verifica que el número esté unido al sandbox de Twilio.' });
  }
};
