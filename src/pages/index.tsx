import { ChangeEvent, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { setAuthToken, getAuthToken } from "./api/localStorageUtil";

export default function Home() {
  const [sessionToken, setSessionToken] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsLoggedIn(true);
      setSessionToken(token);
    }
  }, []);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prevLoginForm) => ({
      ...prevLoginForm,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (loginForm.email.length <= 0 || loginForm.password.length <= 0) {
      return alert("El usuario y la contraseña no pueden estar vacíos.");
    }

    try {
      const { data } = await axios.post(process.env.NEXT_PUBLIC_API + "/auth/login", loginForm);
      setLoginForm({ 
        email: "",
        password: "" 
      });
      const token = data.token;
      setAuthToken(token);
      setIsLoggedIn(true);  
      setSessionToken(token);
    } catch (error) {
      alert(error);
    }
  };

  const [createProjectForm, setCreateProjectForm] = useState<{ name: string; img: string }>({
    name: "",
    img: "",
  });

  const handleProjectFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateProjectForm((prevCreateProjectForm) => ({
      ...prevCreateProjectForm,
      [name]: value,
    }));
  };

  const createProject = async () => {
    try {
      const { data } = await axios.post(process.env.NEXT_PUBLIC_API + "/projects", createProjectForm, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      fetchProjects();
      setCreateProjectForm({ name: "", img: "" });
      console.log(data);
      alert("Proyecto generado");
    } catch (error) {
      console.log(error);
    }
  };

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(process.env.NEXT_PUBLIC_API + '/projects');
      console.log(data);
      setProjects(data);

    } catch (error) {
      console.error(error);
    }
  };

  if (isLoggedIn)
    return (
      <>
      <div className={`${styles['container']} d-grid h-20 border text-align-center align-items-center justify-content-center mt-2`}>
        <div className="text-center">
            <h2 className={`${styles['font']} form-icon pt-1`}>Create Your Project</h2>
            </div>
            
            <div className="d-grid justify-content-center align-items-center text-align-center mt-2">
              
            <div className="mb-2 w-100">
            <form>
                <label className={`${styles['font2']} form-label`}>Project Name</label>
                <input
                  className="form-control"
                  type="text"
                  onChange={(e) => handleProjectFormChange(e)}
                  name="name"
                  value={createProjectForm.name}
                  placeholder="MyFirstProject"
                />
                
                <label className={`${styles['font2']} form-label pt-2`}>Url</label>
                <input
                  className="form-control pt-0"
                  type="text"
                  onChange={(e) => handleProjectFormChange(e)}
                  name="img"
                  value={createProjectForm.img}
                  placeholder="image.svg"
                />
            </form>
              </div>
            
                <button onClick={createProject} type="button" className={`${styles['font2']} btn bg-primary mt-4 w-80 mb-3`}>Create</button>
            </div>
            </div>
    
            <div className={`${styles['container']} border d-grid text-align-center align-items-center justify-content-center mt-3`}>

            <div>
            <h1 className={`${styles['font']} form-icon pt-1`}>Lista de Proyectos</h1>
            </div>

            <div>
            <ul >
              {projects?.map((project:any) => (
                <li className={`${styles['font2']}`} key={project.id}>{project.name}{project.img}</li>
              ))}
            </ul>
            </div>
            </div>
    


      </>
    );

  return (
    <>
    <div className={`${styles['container']} h-25 border d-grid align-items-center justify-content-center mt-5`}>
      <div className="text-center">
        <h2 className={`${styles['font']} form-icon pt-4`}>Login</h2>
      </div>

      <div className="row justify-content-center my-3">

        <div className="col-lg-6 w-100">
        <form>
          <label className={`${styles['font2']} form-label pt-2`}>email</label>
          <input
            className="form-control"
            type="text"
            name="email"
            placeholder="example@123.com"
            onChange={(e) => handleFormChange(e)}
            value={loginForm.email}

          />

          <label className={`${styles['font2']} form-label pt-2`}>Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="1s3f5wm9"
            value={loginForm.password}
            onChange={(e) => handleFormChange(e)}
          />
          </form>
          </div>
          <button className={`${styles['font2']} btn bg-primary mt-5 w-50 mb-3`} onClick={handleSubmit}>Login</button>

      </div>

          </div>
        
        
    </>
  );
} 