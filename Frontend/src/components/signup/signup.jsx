import React, { useState, useEffect } from "react";
// import { fetchedData } from "../../datafetch";
import { useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Import a spinner from react-spinners


import "./signup.css";

const Signup = (props) => {
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false); // Add loading state
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
		setIsLoading(true); // Set loading to true when submission starts
		try {
			const response = await fetch('https://expenditure-calculater.onrender.com/api/users/Signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(props.credentials)
              });

			 if (response.status === 200) {
				// const data = await response.json();
				// props.setFetchedData(data)
				const data = {
					spend: [],
				}
				sessionStorage.setItem('dashboardData', JSON.stringify(data));
				sessionStorage.setItem('credentials', JSON.stringify(props.credentials));
				navigate("/Dashboard");
			  }
			  else{
				setErrorMessage("User already exists.")
			  }
			  
			} catch (error) {
				console.log(error)
				setErrorMessage("An error occurred. Please try again later.");
			}
		setIsLoading(false); // Set loading to false after submission is handled
		}
	


	return (
		<>
				<div className="Signup-container">
					
						<h2 className="signup-title">
							Signup
						</h2>
						{isLoading ? (
							<div className="spinner">
								<ClipLoader color="red" loading={isLoading} size={80} />
							</div>
						) : (
							<form className="signup-form" onSubmit={handleSubmit}>
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
										required
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
										required
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
									<p className="error-message">{errorMessage}</p>
								)}
							</form>
						)}
			</div>
                        <p className="link">Already have an account? <Link className="link" to="/">Login</Link></p>
	</>
	);
}
export default Signup;