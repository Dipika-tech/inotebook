import React, {useState } from "react";
import {useNavigate  } from "react-router-dom";


function Signup(props) {
    const host = "http://localhost:5000/api";

    const [credential, setCredential] = useState({name: "", email: "", password: "", cpassword:""});
    let navigate = useNavigate ();
  
  
    const onChange = (event) =>{
      setCredential({...credential, [event.target.name]: event.target.value})
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await fetch(`${host}/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name: credential.name, email: credential.email, password: credential.password}),
      });
      const json = await response.json();
      if(json.success){
        localStorage.setItem('token', json.authToken);
        props.showAlert("Account Created Successfully", "success")
        navigate('/');
      }else{
        props.showAlert(json.error, "danger")
      }
      
    };
  


  return (
    <div className='mt-2'>
        <h2 className='my-2'>Sign Up to iNotebook</h2>
      <form onSubmit={handleSubmit}>
      <div className="my-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            aria-describedby="emailHelp"
            onChange={onChange}
            value={credential.name}
            minLength={3}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            onChange={onChange}
            value={credential.email}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
            value={credential.password}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={onChange}
            value={credential.cpassword}
            minLength={3}
            required
          />
        </div>


        <button
          type="submit"
          className="btn btn-primary"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Signup;
