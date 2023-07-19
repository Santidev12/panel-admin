import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const secretKey = "tu_secreto_de_firma"; // Reemplaza con una clave secreta más segura

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Verificar las credenciales del usuario (esto es solo un ejemplo, en una aplicación real debes hacerlo de manera segura)
    if (email === "user1" && password === "1234") {
      // Generar un token de autenticación con JWT y firma
      const token = jwt.sign({ email }, secretKey);

      res.status(200).json({ message: "El inicio de sesión ha sido correcto", token });
    } else {
      res.status(401).json({ message: "Credenciales incorrectas" });
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
}