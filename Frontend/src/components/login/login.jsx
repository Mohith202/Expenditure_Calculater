import React, { useState, useEffect } from "react";
// import { fetchedData } from "../../datafetch";
import { useNavigate, Link } from "react-router-dom";


const LogIn = (props) => {
	
	const [errorMessage, setErrorMessage] = useState("");
	// const [loggedIn, setIsLoggedIn] = useState(false);
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
			}
		} catch (error) {
			if (error.response && error.response.status === 401) {
				setErrorMessage("Credentials input incorrect, please try again");
			} else {
				setErrorMessage("An error occurred. Please try again later.");
			}
		}
	};


	return (
		<div className="Login-container" style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: "white", width: "40vw", margin: "auto", height: "40vh" }} >
			<h2 className="Login-title" style={{ marginBottom: "5vh", fontSize: "6vmin", }}>
				Login
			</h2>
			<form className="Login-form" onSubmit={handleSubmit}>
				<div className="input-div" style={{ marginBottom: "2vmin" }} >
					<label htmlFor="email" className="input-label" style={{ fontSize: "2vmin", fontWeight: "400", padding: "10px" }} >
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
						style={{ fontSize: "2vmin", fontWeight: "400", border: "none", borderBottom: "1px solid white", outline: "none", padding: "10px" }}
					/>
				</div>
				<div className="password-div" style={{ marginBottom: "2vmin" }}>
					<label htmlFor="password" className="password-label" style={{ fontSize: "2vmin", fontWeight: "400", padding: "10px" }} >
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
						style={{ fontSize: "2vmin", fontWeight: "400", border: "none", borderBottom: "1px solid white", outline: "none", padding: "10px" }}
					/>
				</div>
				<div className="button-div" style={{ margin: "auto", width: "1vw" }}>

					<button
						type="submit"
						className="Login-button"
						style={{ border: "none", background: "transparent", fontSize: "2vmin", fontWeight: "400", padding: "10px", border: "1px solid white", borderRadius: "20px", cursor: "pointer" }}
					>
						Login
					</button>
				</div>
				{errorMessage && (
					<p className="error-message">{errorMessage}</p>
				)}
			</form>
			<p className="link">Don't have an account? <Link to="/signup">Signup</Link></p>
		</div>

	);
};

export default LogIn;
