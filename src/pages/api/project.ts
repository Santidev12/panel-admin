  // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
  // import type { NextApiRequest, NextApiResponse } from 'next'
  // import { headers } from 'next/dist/client/components/headers'

  // const projects = [];

  // export default function handler(
  //   req: NextApiRequest,
  //   res: NextApiResponse
  // ) {
  //     if(req.method === "GET") {
  //         // parte 1 de la tarea aqui
  //         res.status(200).json({ projects });

  //     }

  //     if(req.method === "POST") {
  //         console.log(req.body, "Body")
  //         console.log(req.headers, "header")

  //         if(req.headers.token !== "fsdfsgfsgsgsdfsgfsdgsg") 
  //             return res.status(400).json({message: "unauthorized"})

  //         const {projectName, imageUrl} = req.body;
  //         projects.push({id: projects.length +1, projectName, projectUrl: imageUrl})
  //         res.status(200).json({ message: 'proyecto genereado', projects })
  //     }
      
  // }


{/* 
        <p>TAREA</p>
        <p>
          1. en el api de los proyectos src/pages/api/project en este archivo
          hacer que para una peticion get nos devuelva la lista de proyectos
        </p>
        <p>
          2. mostrar la lista de proyectos en la aplicacion. hacer una funcion
          que llame a la lista de proyectos cuando entramos en la aplicacion
          pistas: useEffect, axios, useState
        </p> */}

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
        