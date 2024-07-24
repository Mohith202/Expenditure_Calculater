import React, { useState, useEffect } from "react";
// import { fetchedData } from "../../datafetch";
import { useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import "./login.css"


const LogIn = (props) => {

	const [errorMessage, setErrorMessage] = useState("");
	const [spinnersate, setSpinnersate] = useState(false);
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
		setSpinnersate(true);
		console.log(props.credentials)
		try {
			console.log("try", JSON.stringify(props.credentials))
			const response = await fetch('https://expenditure-calculater.onrender.com/api/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(props.credentials)
			});
			console.log(response)
			console.log(response.status === 200)
			if (response.status === 200) {
				const data = await response.json();
				// props.setFetchedData(data)

				sessionStorage.setItem('dashboardData', JSON.stringify(data));
				sessionStorage.setItem('credentials', JSON.stringify(props.credentials));
				navigate("/Dashboard");
				//   fetchedData = data;
				//   toast.success('Data fetched successfully!');
				// setIsLoggedIn(true);
			} else {
				setErrorMessage("Credentials input incorrect, please try again");
			}
			setSpinnersate(false);
		} catch (error) {
			setSpinnersate(false);
			setErrorMessage("Credentials input incorrect, please try again");
		}

	}



	return (
		<>
			<div className="Login-container" >
				<h2 className="Login-title">
					Login
				</h2>
				{spinnersate ? (
				<ClipLoader color="red" loading={spinnersate} size={80} />
				):
				(
				<form className="Login-form" onSubmit={handleSubmit}>
					<div className="input-div" >
						<label htmlFor="email" className="input-label" >
							Username
						</label>
						<input
							className="username-input"
							type="text"
							name="email"
							id="email"
							placeholder="Username"
							value={props.credentials.username}
							onChange={handleChangeusername}
							required
						/>
					</div>
					<div className="password-div" >
						<label htmlFor="password" className="password-label"  >
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
					<div className="button-div" >

						<button
							type="submit"
							className="Login-button"

						>
							Login
						</button>
						{spinnersate && (
							<div className="spinner-div" >
								<div className="spinner" >
								</div>
							</div>
						)}
					</div>
					{errorMessage && (
						<p className="error-message">{errorMessage}</p>
					)}
				</form>
				)}
			</div>
			<p className="link">Don't have an account? <Link className="link" to="/signup">Signup</Link></p>
			<p className="link">Trail userName:MOHITH password:123456 </p>
		</>
	);
};

export default LogIn;