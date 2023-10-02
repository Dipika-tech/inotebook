import React, {useState } from "react";
import {useNavigate  } from "react-router-dom";

function Login(props) {
  const host = "http://localhost:5000/api";

  const [credential, setCredential] = useState({email: "", password: ""});
  let navigate = useNavigate ();


  const onChange = (event) =>{
    setCredential({...credential, [event.target.name]: event.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${host}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email: credential.email, password: credential.password}),
    });
    const json = await response.json();
    if(json.success){
      localStorage.setItem('token', json.authToken);
      navigate('/');
    }else{
      props.showAlert(json.error, "danger");
    }
    
  };

  return (
    <div className='mt-2'>
        <h2 className='my-2'>Login to iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="my-3">
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

export default Login;
