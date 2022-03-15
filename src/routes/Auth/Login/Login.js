import React, { useState } from 'react';
import axios from '../../../constants/axiosInstance';
import { toast } from 'react-toastify';
import Loader from '../../../components/Loader/Loader';
import { Navigate as Redirect } from 'react-router-dom';
import AddToHomeScreen from '../../../constants/AddToHomeScreen/AddToHomeScreen';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPasword] = useState('');
	const [redirect, setRedirect] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const submitHandler = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const data = {
			email,
			password,
		};

		console.log(data);

		let response;
		try {
			response = await axios.post('/auth/login', data);
		} catch (error) {
			console.log(error.response);
			setIsLoading(false);
			return toast(error.response.data.error || 'An error occured', {
				type: 'error',
				position: 'top-center',
				closeButton: true,
				theme: 'colored',
			});
		}

		setIsLoading(false);

		console.log(response);
		localStorage.setItem('user', JSON.stringify(response.data.data.user));
		localStorage.setItem(
			'walletDetails',
			JSON.stringify(response.data.data.walletDetails)
		);

		setRedirect('/home');
	};

	return (
		<>
			{redirect ? (
				<Redirect to={redirect} />
			) : (
				<>
					{isLoading ? (
						<Loader />
					) : (
						<>
							<div id="appCapsule">
								<div className="section mt-2 text-center">
									<h1>Log in</h1>
									<h4>Fill the form to log in</h4>
								</div>
								<div className="section mb-5 p-2">
									<form onSubmit={submitHandler}>
										<div className="card">
											<div className="card-body pb-1">
												<div className="form-group basic">
													<div className="input-wrapper">
														<label className="label" htmlFor="email1">
															E-mail
														</label>
														<input
															type="email"
															className="form-control"
															id="email1"
															placeholder="Your e-mail"
															value={email}
															onChange={(e) => setEmail(e.target.value)}
														/>
														<i className="clear-input">
															<ion-icon name="close-circle"></ion-icon>
														</i>
													</div>
												</div>

												<div className="form-group basic">
													<div className="input-wrapper">
														<label className="label" htmlFor="password1">
															Password
														</label>
														<input
															type="password"
															className="form-control"
															id="password1"
															autoComplete="off"
															placeholder="Your password"
															value={password}
															onChange={(e) => setPasword(e.target.value)}
														/>
														<i className="clear-input">
															<ion-icon name="close-circle"></ion-icon>
														</i>
													</div>
												</div>
											</div>
										</div>

										<div className="form-links mt-2">
											<div>
												<a href="app-register.html">Register Now</a>
											</div>
											<div>
												<a
													href="app-forgot-password.html"
													className="text-muted"
												>
													Forgot Password?
												</a>
											</div>
										</div>

										<div className="form-button-group  transparent">
											<button
												type="submit"
												className="btn btn-primary btn-block btn-lg"
											>
												Log in
											</button>
										</div>
									</form>
								</div>
							</div>
							<AddToHomeScreen />
						</>
					)}
				</>
			)}
		</>
	);
}

export default Login;
