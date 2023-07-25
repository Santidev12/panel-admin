import { ChangeEvent, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { setAuthToken, getAuthToken } from "./api/localStorageUtil";
import Swal from 'sweetalert2';

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

  const [createProjectForm, setCreateProjectForm] = useState<{ _id: string; name: string; img: string; description: string }>({
    _id: "",
    name: "",
    img: "",
    description: "",
  });

  const handleProjectFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateProjectForm((prevCreateProjectForm) => ({
      ...prevCreateProjectForm,
      [name]: value,
    }));
  };

  const createProject = async () => {
    
    try{

      let edit = false;
      if(createProjectForm._id){
        edit = true;
      }

      if(!edit){
        const { data } = await axios.post(process.env.NEXT_PUBLIC_API + "/projects", createProjectForm, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          }
        })
        setCreateProjectForm({ _id: "", name: "", img: "", description: ""});
      } else {
         
        const { data } = await axios.put(process.env.NEXT_PUBLIC_API + "/projects/" + createProjectForm._id, createProjectForm, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
      }
      fetchProjects();
    }catch(error){
      console.log(error);
    }
  };


  const deleteProject = async (_id: string) => {
    try {


      if(!_id){
        alert("ID incorrecto");
        return null;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async(result) => {
        if (result.isConfirmed) {

          const { data } = await axios.delete(process.env.NEXT_PUBLIC_API + "/projects/" + _id, {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          });
          fetchProjects();
          
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })

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

  const newProject = () => {
    setCreateProjectForm({ _id: "", name: "", img: "", description: ""});
    showModal();
  }

  const showModal = () => {
    const { Modal } = require("bootstrap");
    const myModal = new Modal("#exampleModal");
    
    myModal.show();
    };

    const editModal = (_id: string, name:string, img: string, description:string ) => {
      // edit modal
      console.log(_id, name, img, description);
      setCreateProjectForm({ _id, name, img, description,});
      showModal();
      }


  if (isLoggedIn)
    return (
      <>    
       
      <div
        className="modal fade"
        id="exampleModal"
        
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title d-flex justify-content-center align-items-center" id="exampleModalLabel">
                Crear Proyecto
              </h5>
              <button
                onClick={newProject}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body"><label className={`${styles['font2']} form-label`}>Project Name</label>
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
                <textarea name="description"
                onChange={(e) => handleProjectFormChange(e)} 
                className="form-control"
                value={createProjectForm.description}>        
                  </textarea>
            
              
            
                <button onClick={createProject} type="button" className={`${styles['font2']} btn bg-primary mt-4 w-80 mb-3`}>Create</button>
            </div>
            <div className="modal-footer">
            <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
            >
            Cerrar
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick={createProject}
            >
            Guardar
            </button>
            </div>
            </div>
          </div>
        </div>
      
    
            <div className={`${styles['container']} border d-grid text-align-center align-items-center justify-content-center px-10`}>

            <div className="mb-2">
            <h1 className={`${styles['font']} form-icon pt-1`}>Lista de Proyectos</h1>
            </div>

            <div className="list-group">
            <div className="w-100" >

              {projects?.map((project:any) => (

                  
                <div key={project.id} className="d-flex row">
                  <div className="col-2">
                      <img src={project.img} className="mr-3 col-1 badge" style={{ width: '50px', height: 'auto' }} />
                  </div>
                  <div className="col-7">
                    <h3 className="font-weight-bold">{project.name}</h3>
                    <p>{project.description}</p>
                  </div>
                  <div className="col-3 styleitem">
                    <i onClick={() => editModal(project._id, project.name, project.img, project.description)} className="fa-solid fa-pen-to-square cursor-pointer pl-1 col-1"></i>
                    <i  onClick={() => deleteProject(project._id)} className="fa-solid fa-trash col-1 cursor-pointer pl-1"></i>

                  </div>
                </div>
              
              ))}

            </div>
            </div>
            
                  <button
              type="button"
              className="btn btn-primary mt-3"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Crear Proyecto
              </button>
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