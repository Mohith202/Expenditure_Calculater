import React, { useState, useEffect } from "react";
// import { fetchedData } from "../../datafetch";
import { useNavigate,Link } from "react-router-dom";


const Signup = (props) => {
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	
	const handleChangeusername = (e) => {
		const username = e.target.value;
		props.setCredentials({ ...props.credentials, username });
	};
	const handleChangepassword = (e) => {
		const password = e.target.value;
		props.setCredentials({ ...props.credentials, password });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
        console.log(JSON.stringify(props.credentials))
		try {
			const response = await fetch('https://expenditure-calculater.onrender.com/api/users/Signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(props.credentials)
              });

              console.log(response)
              if (response.status==200) {
				navigate("/Dashboard");
			}
		} catch (error) {
			
				setErrorMessage("An error occurred. Please try again later.");
			}
		}
	


	return (
		<div className="Signup-container">
					
						<h2 className="signup-title">
							Signup
						</h2>
						<form className="singup-form" onSubmit={handleSubmit}>
							<div className="input-div">
								<label htmlFor="email" className="input-label">
									Username 
								</label>
								<input
									className="username-input"
									type="text"
									name="email"
									id="email"
									placeholder="Username "
									value={props.credentials.username}
									onChange={handleChangeusername }
								/>
							</div>
							<div className="password-div">
								<label htmlFor="password" className="password-label">
									Password
								</label>
								<input
									className="password-input"
									type="password"
									name="password"
									id="password"
									placeholder="Password"
									value={props.credentials.password}
									onChange={handleChangepassword}
								/>
							</div>
							<div className="button-div ">
								
								<button
									type="submit"
									className="Signup-button"
								>
									Signup
								</button>
							</div>
							{errorMessage && (
								<p className="error-essage">{errorMessage}</p>
							)}
						</form>
                        <p className="link">Already have an account? <Link to="/">Login</Link></p>
				
			</div>
	);
}
export default Signup;
