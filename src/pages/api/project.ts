        import { NextApiRequest, NextApiResponse } from 'next';
        import jwt from 'jsonwebtoken';
        import { headers } from 'next/dist/client/components/headers'
        
        const secretKey = "tu_secreto_de_firma"; 
        const projects: { id: number; projectName: string; imageUrl: string }[] = [];
        
        export default function handler(
          req: NextApiRequest, 
          res: NextApiResponse
          ) {
          if (req.method === 'GET') {
            res.status(200).json({ projects });
          } else if (req.method === 'POST') {
            const token = req.headers.authorization?.split(' ')[1];
        
            if (!token) {
              return res.status(401).json({ message: "No se proporcionó un token de autenticación." });
            }
        
            try {
              // Verificar y decodificar el token
              jwt.verify(token, secretKey);
              const { projectName, imageUrl } = req.body;
              const newProject = { id: projects.length + 1, projectName, imageUrl };
        
              projects.push(newProject);
              res.status(200).json({ message: "Proyecto creado correctamente", project: newProject });
            } catch (error) {
              res.status(403).json({ message: "Token de autenticación inválido." });
            }
          } else {
            res.status(405).end(); // Método no permitido
          }
        }
        