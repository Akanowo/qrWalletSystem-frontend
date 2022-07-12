import React, { useState } from 'react';
import { CloseCircle, CloseCircleOutline, Triangle } from 'react-ionicons';
import axios from '../../../constants/axiosInstance';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Loader from '../../../components/Loader/Loader';

function Signup() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeat_pwd, setRepeatPwd] = useState('');
	const [vendorName, setVendorName] = useState('');
	const [type, setType] = useState('customer');
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		formState: { errors },
		handleSubmit: submit,
	} = useForm();

	const nameRegex = /^[a-zA-Z]*$/;
	const emailRegex =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const vendorNameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

	const handleSubmit = async (e) => {
		// e.preventDefault();

		if (password !== repeat_pwd) {
			return toast("Passwords don't match", {
				type: 'error',
				position: 'top-center',
			});
		}

		setIsLoading(true);

		const data = {
			firstName,
			lastName,
			email: email.trim().toLowerCase(),
			password,
			vendorName: type === 'vendor' ? vendorName : undefined,
			type,
		};

		let response;

		try {
			response = await (await axios.post('/auth/signup', data)).data;
		} catch (error) {
			if (error.response) {
				setIsLoading(false);
				setPassword('');
				setRepeatPwd('');
				toast(error.response.data.error, {
					position: 'top-center',
					type: 'error',
					theme: 'colored',
				});
				return;
			}
			return toast(error.message || 'An error occured', {
				position: 'top-center',
				type: 'error',
			});
		}

		setIsLoading(false);

		if (!response) {
			return toast('An error occured', {
				position: 'top-center',
				type: 'error',
				theme: 'colored',
			});
		}

		if (response.status) {
			setFirstName('');
			setLastName('');
			setEmail('');
			setPassword('');
			setRepeatPwd('');
			setVendorName('');
			return toast(response.message, {
				position: 'top-center',
				type: 'success',
				theme: 'colored',
			});
		}
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div id="appCapsule">
					<div className="section mt-2 text-center">
						<h1>Register now</h1>
						<h4>Create an account</h4>
					</div>
					<div className="section mb-5 p-2">
						<form onSubmit={submit(handleSubmit)}>
							<div className="card">
								<div className="card-body">
									<ul className="nav nav-tabs">
										<li
											className="nav-item"
											onClick={() => setType('customer')}
										>
											<a
												className={`nav-link ${
													type === 'customer' ? 'active' : ''
												}`}
												aria-current="page"
												href="#"
												style={{ color: '#000' }}
											>
												Customer
											</a>
										</li>
										<li className="nav-item" onClick={() => setType('vendor')}>
											<a
												className={`nav-link ${
													type === 'vendor' ? 'active' : ''
												}`}
												aria-current="page"
												href="#"
												style={{ color: '#000' }}
											>
												Vendor
											</a>
										</li>
									</ul>

									{type === 'vendor' ? (
										<div className="form-group basic">
											<div className="input-wrapper">
												<label className="label" htmlFor="vendorName">
													Vendor Name
												</label>
												<input
													type="text"
													className="form-control"
													id="vendorName"
													placeholder="Enter Vendor Name"
													{...register('vendorName', {
														required: true,
														pattern: vendorNameRegex,
													})}
													value={vendorName}
													onChange={(e) => setVendorName(e.target.value)}
												/>
												<i className="clear-input">
													<CloseCircle />
												</i>
												<div className="input-errors">
													{errors.vendorName?.type === 'required' &&
														'Vendor name is required'}
													{errors.vendorName?.type === 'pattern' &&
														'Invalid vendor name'}
												</div>
											</div>
										</div>
									) : null}

									<div className="form-group basic">
										<div className="input-wrapper">
											<label className="label" htmlFor="firstname">
												Firstname
											</label>
											<input
												autoComplete="off"
												type="text"
												className="form-control"
												id="firstname"
												placeholder="Enter Firstname"
												{...register('firstname', {
													required: true,
													pattern: nameRegex,
												})}
												value={firstName}
												onChange={(e) => setFirstName(e.target.value)}
											/>
											<i className="clear-input">
												<CloseCircleOutline color={'#000'} />
											</i>
											<div className="input-errors">
												{errors.firstname?.type === 'required' &&
													'Firstname is required'}
												{errors.firstname?.type === 'pattern' &&
													'Invalid firstname'}
											</div>
										</div>
									</div>

									<div className="form-group basic">
										<div className="input-wrapper">
											<label className="label" htmlFor="lastname">
												Lastname
											</label>
											<input
												autoComplete="off"
												type="text"
												className="form-control"
												id="lastname"
												placeholder="Enter Lastname"
												{...register('lastname', {
													required: true,
													pattern: nameRegex,
												})}
												value={lastName}
												onChange={(e) => setLastName(e.target.value)}
											/>
											<i className="clear-input">
												<CloseCircle />
											</i>
											<div className="input-errors">
												{errors.lastname?.type === 'required' &&
													'Lastname is required'}
												{errors.lastname?.type === 'pattern' &&
													'Invalid lastname'}
											</div>
										</div>
									</div>

									<div className="form-group basic">
										<div className="input-wrapper">
											<label className="label" htmlFor="email">
												E-mail
											</label>
											<input
												autoComplete="off"
												type="email"
												className="form-control"
												id="email"
												placeholder="Your e-mail"
												{...register('email', {
													required: true,
													pattern: emailRegex,
												})}
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
											<i className="clear-input">
												<CloseCircle />
											</i>
											<div className="input-errors">
												{errors.email?.type === 'required' &&
													'Email is required'}
												{errors.email?.type === 'pattern' &&
													'Invalid email address'}
											</div>
										</div>
									</div>

									<div className="form-group basic">
										<div className="input-wrapper">
											<label className="label" htmlFor="password">
												Password
											</label>
											<input
												type="password"
												className="form-control"
												id="password"
												autoComplete="off"
												placeholder="Your password"
												{...register('password', { required: true })}
												value={password}
												onChange={(e) => setPassword(e.target.value)}
											/>
											<i className="clear-input">
												<CloseCircle />
											</i>
											<div className="input-errors">
												{errors.password?.type === 'required' &&
													'Password is required'}
											</div>
										</div>
									</div>

									<div className="form-group basic">
										<div className="input-wrapper">
											<label className="label" htmlFor="repeat_password">
												Password Again
											</label>
											<input
												type="password"
												className="form-control"
												id="repeat_password"
												autoComplete="off"
												placeholder="Type password again"
												{...register('confirm_pwd', { required: true })}
												value={repeat_pwd}
												onChange={(e) => setRepeatPwd(e.target.value)}
											/>
											<i className="clear-input">
												<CloseCircle />
											</i>
											<div className="input-errors">
												{errors.confirm_pwd?.type === 'required' &&
													'Please enter password again'}
											</div>
										</div>
									</div>

									{/* <div className="custom-control custom-checkbox mt-2 mb-1">
								<div className="form-check">
									<input
										type="checkbox"
										className="form-check-input"
										id="customCheckb1"
									/>
									<label className="form-check-label" htmlFor="customCheckb1">
										I agree{' '}
										<a
											href="#"
											data-bs-toggle="modal"
											data-bs-target="#termsModal"
										>
											terms and conditions
										</a>
									</label>
								</div>
							</div> */}
								</div>
							</div>

							<div className="form-button-group transparent">
								<button
									type="submit"
									className="btn btn-primary btn-block btn-lg"
								>
									Register
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}

export default Signup;
