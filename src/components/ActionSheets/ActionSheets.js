import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../constants/axiosInstance';
import { toast } from 'react-toastify';
import { InfinitySpin } from 'react-loader-spinner';
import QrCodeScanner from '../QrCodeScanner/QrCodeScanner';
import {
	CardOutline,
	PhonePortraitOutline,
	ArrowForwardOutline,
} from 'react-ionicons';
import { supportedBanks } from '../../utils/supportedBanks';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const defaultFields = [
	'card_number',
	'expiry_month',
	'expiry_year',
	'cvv',
	'amount',
];

const bvnValidationFields = [
	'first_name',
	'last_name',
	'date_of_birth',
	'phone_number',
	'bvn',
];

let $;

function ActionSheets(props) {
	const history = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [fields, setFields] = useState(defaultFields);
	const [mode, setMode] = useState('');
	const [card_number, setCardNumber] = useState('');
	const [expiry_month, setExpiryMonth] = useState('');
	const [expiry_year, setExpiryYear] = useState('');
	const [cvv, setCvv] = useState('');
	const [amount, setAmount] = useState(0);
	const [pin, setPin] = useState('');
	const [otp, setOtp] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [country, setCountry] = useState('');
	const [zipcode, setZipcode] = useState('');
	const [showQrScanner, setShowQrScanner] = useState(false);
	const [account_bank, setAccountBanks] = useState('');
	const [account_number, setAccountNumber] = useState(
		props.accountDetails &&
			Object.getPrototypeOf(props.accountDetails) === Object.prototype &&
			Object.keys(props.accountDetails).length === 0
			? props.accountDetails.account_number
			: ''
	);
	const [account_holder, setAccountHolder] = useState(
		props.accountDetails &&
			Object.getPrototypeOf(props.accountDetails) === Object.prototype &&
			Object.keys(props.accountDetails).length === 0
			? props.accountDetails.account_name
			: ''
	);
	const [hidden, setHidden] = useState(true);
	const [showAccountSummary, setShowAccountSummary] = useState(false);
	const [showUssdBanks, setShowUssdBanks] = useState(false);
	const [transferAccount, setTransferAccount] = useState({});
	const [showUssdDetails, setShowUssdDetails] = useState(false);
	const [ussdDetails, setUssdDetails] = useState({});
	const [first_name, setFirstName] = useState(props.accountDetails.firstName);
	const [last_name, setLastName] = useState(props.accountDetails.lastName);
	const [startDate, setStartDate] = useState(new Date());
	const [phone_number, setPhoneNumber] = useState('');
	const [bvn, setBvn] = useState('');

	useEffect(() => {
		$ = window.$;
	}, []);

	const handleSendNext = (e) => {
		e.preventDefault();
		setShowQrScanner(true);
	};

	const handleWithdrawNext = (e) => {
		e.preventDefault();
		setShowAccountSummary(true);
	};

	const handleVerifyAccount = async () => {
		setIsLoading(true);
		const bank = props.banks.find((bank) => bank.code === account_bank);
		const data = {
			account_bank,
			account_number,
			bank_name: bank.name,
		};

		console.log(data);

		let response;
		try {
			response = await (await axios.post('/account/update', data)).data;
		} catch (error) {
			setIsLoading(false);
			setHidden(true);
			setAccountHolder('');
			console.log(error);
			if (error.response && error.response.data) {
				return toast(error.response.data.error || 'An error occured', {
					type: 'error',
					position: 'top-center',
					theme: 'colored',
				});
			}
			return;
		}

		setIsLoading(false);

		console.log(response);

		if (!response) {
			return toast("Couldn't resolve bank details", {
				position: 'top-center',
				type: 'error',
				theme: 'colored',
			});
		}

		if (!response.status) {
			return toast(response.message || "Couldn't resolve bank details", {
				position: 'top-center',
				type: 'error',
				theme: 'colored',
			});
		}

		toast(response.data.message, { type: 'success', position: 'top-center' });
		setAccountHolder(response.data.account_name);
		setHidden(false);

		history('/home');
	};

	const handleWithdrawal = async () => {
		// TODO: Handle Withdrawal
		toast('Withdrawal placed', {
			theme: 'colored',
			position: 'top-center',
			type: 'success',
		});
		closeModal();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		let endpoint = '';
		let data = {};

		switch (mode) {
			case 'pin':
				endpoint = '/payment/topup/authorize';
				data = {
					pin,
				};
				break;

			case 'avs_noauth':
				endpoint = '/payment/topup/authorize';
				data = {
					address,
					state,
					country,
					city,
					zipcode,
				};
				break;

			case 'otp':
				endpoint = '/payment/topup/validate';
				data = {
					otp,
				};
				break;

			default:
				endpoint = '/payment/topup/charge';
				data = {
					card_number,
					expiry_month,
					expiry_year,
					cvv,
					amount: Number.parseInt(amount),
				};
				break;
		}

		let response;
		try {
			response = await (await axios.post(endpoint, data)).data;
		} catch (error) {
			setIsLoading(false);
			if (error.response && error.response.data) {
				return toast(error.response.data.error || 'An error occured', {
					type: 'error',
					position: 'top-center',
					theme: 'colored',
				});
			}
		}

		setIsLoading(false);
		console.log(response);

		if (!response) {
			return toast('Something Went Wrong, Try Again', {
				type: 'error',
				position: 'top-center',
				theme: 'colored',
			});
		}

		if (response.status) {
			if (response.message === 'payment complete') {
				toast('Successful Payment', {
					type: 'success',
					position: 'top-center',
					theme: 'colored',
				});
				return window.location.reload();
			}

			if (response.message === 'redirect required') {
				return window.open(response.data.url, '_blank');
			}

			setMode(response.data.mode);
			setFields(response.data.fields);
		}
	};

	const returnInput = (type) => {
		switch (type) {
			case 'card_number':
				return (
					<div className="form-group basic">
						<label className="label">Card Number</label>
						<div className="input-group mb-2">
							{/* <span className="input-group-text" id="basic-addona1">
												$
											</span> */}
							<input
								type="text"
								className="form-control"
								placeholder="Enter Card Number"
								value={card_number}
								onChange={(e) => setCardNumber(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'expiry_month':
				return (
					<div className="form-group basic">
						<label className="label">Expiry Month</label>
						<div className="input-group mb-2">
							{/* <span className="input-group-text" id="basic-addona1">
												$
											</span> */}
							<input
								type="text"
								className="form-control"
								placeholder="Expiry Month"
								value={expiry_month}
								onChange={(e) => setExpiryMonth(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'expiry_year':
				return (
					<div className="form-group basic">
						<label className="label">Expiry Year</label>
						<div className="input-group mb-2">
							{/* <span className="input-group-text" id="basic-addona1">
												$
											</span> */}
							<input
								type="text"
								className="form-control"
								placeholder="Expiry Year"
								value={expiry_year}
								onChange={(e) => setExpiryYear(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'cvv':
				return (
					<div className="form-group basic">
						<label className="label">CVV</label>
						<div className="input-group mb-2">
							{/* <span className="input-group-text" id="basic-addona1">
												$
											</span> */}
							<input
								type="text"
								className="form-control"
								placeholder="Enter CVV"
								value={cvv}
								onChange={(e) => setCvv(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'amount':
				return (
					<div className="form-group basic">
						<label className="label">Enter Amount</label>
						<div className="input-group mb-2">
							<span className="input-group-text" id="basic-addona1">
								₦
							</span>
							<input
								type="text"
								className="form-control"
								placeholder="Enter an amount"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'pin':
				return (
					<div className="form-group basic">
						<label className="label">Enter Pin</label>
						<div className="input-group mb-2">
							<input
								type="text"
								className="form-control"
								placeholder="Enter Card Pin"
								value={pin}
								onChange={(e) => setPin(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'otp':
				return (
					<div className="form-group basic">
						<label className="label">Enter Otp</label>
						<div className="input-group mb-2">
							<input
								type="text"
								className="form-control"
								placeholder="Enter Otp"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'address':
				return (
					<div className="form-group basic">
						<label className="label">Enter Address</label>
						<div className="input-group mb-2">
							<input
								type="text"
								className="form-control"
								placeholder="Enter Address"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'city':
				return (
					<div className="form-group basic">
						<label className="label">Enter City</label>
						<div className="input-group mb-2">
							<input
								type="text"
								className="form-control"
								placeholder="Enter City"
								value={city}
								onChange={(e) => setCity(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'country':
				return (
					<div className="form-group basic">
						<label className="label">Enter Country</label>
						<div className="input-group mb-2">
							<input
								type="text"
								className="form-control"
								placeholder="Enter Country"
								value={country}
								onChange={(e) => setCountry(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'state':
				return (
					<div className="form-group basic">
						<label className="label">Enter State</label>
						<div className="input-group mb-2">
							<input
								type="text"
								className="form-control"
								placeholder="Enter State"
								value={state}
								onChange={(e) => setState(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'zipcode':
				return (
					<div className="form-group basic">
						<label className="label">Enter Zipcode</label>
						<div className="input-group mb-2">
							<input
								type="text"
								className="form-control"
								placeholder="Enter Zipcode"
								value={zipcode}
								onChange={(e) => setZipcode(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'first_name':
				return (
					<div className="form-group basic">
						<label className="label" htmlFor="first_name">
							Enter your firstname
						</label>
						<div className="input-group mb-2">
							<input
								id="first_name"
								type="text"
								className="form-control"
								placeholder="Firstname"
								value={first_name}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'last_name':
				return (
					<div className="form-group basic">
						<label className="label" htmlFor="last_name">
							Enter your lastname
						</label>
						<div className="input-group mb-2">
							<input
								id="last_name"
								type="text"
								className="form-control"
								placeholder="Lastname"
								value={last_name}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'date_of_birth':
				return (
					<div className="form-group basic">
						<label className="label" htmlFor="dob">
							Enter your DOB
						</label>
						<div className="input-group mb-2">
							<DatePicker
								id="dob"
								className="form-control"
								selected={startDate}
								onChange={(date) => setStartDate(date)}
							/>
						</div>
					</div>
				);

			case 'phone_number':
				return (
					<div className="form-group basic">
						<label className="label" htmlFor="phone_number">
							Enter your phone number
						</label>
						<div className="input-group mb-2">
							<input
								id="phone_number"
								type="text"
								className="form-control"
								placeholder="Phone Number"
								value={phone_number}
								onChange={(e) => setPhoneNumber(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'bvn':
				return (
					<div className="form-group basic">
						<label className="label" htmlFor="bvn">
							Enter your BVN
						</label>
						<div className="input-group mb-2">
							<input
								id="bvn"
								type="text"
								className="form-control"
								placeholder="BVN"
								value={bvn}
								onChange={(e) => setBvn(e.target.value)}
							/>
						</div>
					</div>
				);

			case 'account':
				return (
					<>
						<div className="form-group basic">
							<label className="label" htmlFor="banks">
								Select Bank
							</label>
							<div className="input-group mb-2">
								<select
									className="form-control custom-select"
									id="banks"
									value={account_bank}
									onChange={(e) => setAccountBanks(e.target.value)}
								>
									{props.banks.map((bank) => (
										<option key={bank.code} value={bank.code}>
											{bank.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="form-group basic">
							<label className="label" htmlFor="account_number">
								Enter Account Number
							</label>
							<div className="input-group mb-2">
								<input
									id="account_number"
									type="text"
									className="form-control"
									placeholder="Account Number"
									value={account_number}
									onChange={(e) => setAccountNumber(e.target.value)}
								/>
							</div>
						</div>

						{hidden ? null : (
							<div className="form-group basic">
								<label className="label">Account Holder</label>
								<div className="input-group mb-2">
									<input
										type="text"
										className="form-control"
										placeholder="Account Number"
										value={account_holder}
										hidden={hidden}
										readOnly
									/>
								</div>
							</div>
						)}
					</>
				);

			default:
				return null;
		}
	};

	const resetStates = () => {
		setIsLoading(false);
		setFields(defaultFields);
		setMode('');
		setCardNumber('');
		setExpiryMonth('');
		setExpiryYear('');
		setCvv('');
		setPin('');
		setOtp('');
		setCity('');
		setState('');
		setCountry('');
		setShowQrScanner(false);
		setAmount(0);
	};

	const closeModal = () => {
		$(`#depositActionSheet`).modal('hide');
		$(`#withdrawActionSheet`).modal('hide');
		$(`#sendActionSheet`).modal('hide');
		$(`#setAccountActionSheet`).modal('hide');
	};

	const fetchTransferDetails = async () => {
		setIsLoading(true);

		let response;

		try {
			response = await axios.post();
		} catch (error) {}
	};

	const handleFetchUSSDcode = async (code) => {
		setIsLoading(true);
		const data = {
			amount,
			account_bank_code: code,
		};

		let response;
		try {
			response = await (await axios.post('/payment/topup/ussd', data)).data;
		} catch (error) {
			setIsLoading(false);
			if (error.response && error.response.data) {
				return toast(error.response.data.error || 'An error occured', {
					type: 'error',
					position: 'top-center',
					theme: 'colored',
				});
			}
		}

		setIsLoading(false);

		if (!response) {
			return toast('An error occured', {
				type: 'error',
				position: 'top-center',
			});
		}

		const details = {
			code: response.data.ussdCode,
			paymentCode: response.data.paymentCode,
		};
		setUssdDetails(details);
		setShowUssdDetails(true);
		setShowUssdBanks(false);
	};

	const handleGenerateVirtualAccount = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		let response;

		try {
			const data = {
				first_name,
				last_name,
				phone_number,
				date_of_birth: startDate,
				bvn,
			};

			response = await (await axios.post('/payment/generate-vacc', data)).data;
		} catch (error) {
			setIsLoading(false);
			if (error.response && error.response.data) {
				return toast(error.response.data.error || 'An error occured', {
					type: 'error',
					position: 'top-center',
					theme: 'colored',
				});
			}
		}

		setIsLoading(false);

		if (!response) {
			return toast('An error occured, try again', {
				type: 'error',
				position: 'top-center',
			});
		}

		console.log(response);

		props.setVirtualAccount(response.data);
	};

	return (
		<>
			{/* <!-- Choice Action Sheet --> */}
			<div
				className="modal fade action-sheet"
				id="choiceActionSheet"
				tabIndex="-1"
				role="dialog"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Choose Method</h5>
						</div>
						<div className="modal-body">
							{isLoading ? (
								<InfinitySpin color="#000" />
							) : (
								<>
									<div className="action-sheet-content">
										<div className="wallet-card removeBoxShadow">
											<div className="wallet-footer removeBorderAndPadding">
												<div className="item">
													<a
														href="#"
														data-bs-toggle="modal"
														data-bs-target="#depositActionSheet"
													>
														<div className="icon-wrapper bg-danger">
															<CardOutline color={'#fff'} />
														</div>
														<strong>Card</strong>
													</a>
												</div>

												<div className="item">
													<a
														href="#"
														data-bs-toggle="modal"
														data-bs-target="#transferActionSheet"
													>
														<div className="icon-wrapper">
															<ArrowForwardOutline color={'#fff'} />
														</div>
														<strong>Transfer</strong>
													</a>
												</div>

												<div className="item">
													<a
														href="#"
														data-bs-toggle="modal"
														data-bs-target="#ussdActionSheet"
													>
														<div className="icon-wrapper">
															<PhonePortraitOutline color={'#fff'} />
														</div>
														<strong>USSD</strong>
													</a>
												</div>
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* <!-- * Choice Action Sheet --> */}

			{/* <!-- Deposit Action Sheet --> */}
			<div
				className="modal fade action-sheet"
				id="depositActionSheet"
				tabIndex="-1"
				role="dialog"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Topup Balance</h5>
						</div>
						<div className="modal-body">
							{isLoading ? (
								<InfinitySpin color="#000" />
							) : (
								<>
									<div className="action-sheet-content">
										<form>
											{fields.map((field) => (
												<div key={field}>{returnInput(field)}</div>
											))}

											<div className="form-group basic">
												<button
													type="submit"
													className="btn btn-primary btn-block btn-lg"
													onClick={handleSubmit}
													// data-bs-dismiss="modal"
												>
													Deposit
												</button>
											</div>
										</form>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* <!-- * Deposit Action Sheet --> */}

			{/* <!-- Withdraw Action Sheet --> */}
			<div
				className="modal fade action-sheet"
				id="withdrawActionSheet"
				tabIndex="-1"
				role="dialog"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Withdraw Money</h5>
						</div>
						<div className="modal-body">
							<div className="action-sheet-content">
								{isLoading ? (
									<InfinitySpin color="#000" />
								) : (
									<>
										{showAccountSummary ? (
											<>
												<div>
													<h2>Withdrawal Summary:</h2>
													<p>Account: {props.accountDetails.account_name}</p>
													<p>
														Account Number:{' '}
														{props.accountDetails.account_number}
													</p>
													<p>Bank: {props.accountDetails.bank_name}</p>
												</div>
												<div className="form-group basic">
													<button
														type="button"
														className="btn btn-primary btn-block btn-lg"
														onClick={handleWithdrawal}
														// data-bs-dismiss="modal"
													>
														Proceed
													</button>
												</div>
											</>
										) : (
											<form>
												{returnInput('amount')}

												<div className="form-group basic">
													<button
														type="button"
														className="btn btn-primary btn-block btn-lg"
														onClick={handleWithdrawNext}
														// data-bs-dismiss="modal"
													>
														Next
													</button>
												</div>
											</form>
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <!-- * Withdraw Action Sheet --> */}

			{/* <!-- Send Action Sheet --> */}
			<div
				className="modal fade action-sheet"
				id="sendActionSheet"
				tabIndex="-1"
				role="dialog"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Send Money</h5>
						</div>
						<div className="modal-body">
							<div className="action-sheet-content">
								{isLoading ? (
									<InfinitySpin color="#000" />
								) : (
									<form>
										{showQrScanner ? (
											<>
												<QrCodeScanner
													amount={amount}
													setIsLoading={setIsLoading}
													updateTransactions={props.updateTransactions}
													updateWalletBalance={props.updateWalletBalance}
													closeModal={closeModal}
													resetStates={resetStates}
												/>
											</>
										) : (
											<>
												{returnInput('amount')}
												<div className="form-group basic">
													<button
														type="button"
														className="btn btn-primary btn-block btn-lg"
														// data-bs-dismiss="modal"
														onClick={handleSendNext}
													>
														Next
													</button>
												</div>
											</>
										)}
									</form>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <!-- * Send Action Sheet --> */}

			{/* <!-- Set Account Action Sheet --> */}
			<div
				className="modal fade action-sheet"
				id="setAccountActionSheet"
				tabIndex="-1"
				role="dialog"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Set Account</h5>
						</div>
						<div className="modal-body">
							<div className="action-sheet-content">
								{props.banks.length === 0 ? (
									<InfinitySpin color="#000" />
								) : (
									<>
										<form>
											{returnInput('account')}

											<div className="form-group basic">
												<button
													type="button"
													className="btn btn-primary btn-block btn-lg"
													onClick={handleVerifyAccount}
													// data-bs-dismiss="modal"
												>
													Update Account
												</button>
											</div>
										</form>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <!-- * Set Action Action Sheet --> */}

			{/* <!-- Show Qrcode Action Sheet --> */}
			<div
				className="modal fade action-sheet"
				id="showQrActionSheet"
				tabIndex="-1"
				role="dialog"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Qrcode</h5>
						</div>
						<div className="modal-body">
							<div className="action-sheet-content center">
								{isLoading ? (
									<InfinitySpin color="#000" />
								) : (
									<>
										<img
											src={props.qrcode ? props.qrcode.url : null}
											className="qrImage"
										/>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <!-- * Show Qrcode Action Sheet --> */}

			{/* <!-- Topup Transfer Action Sheet --> */}
			<div
				className="modal fade action-sheet"
				id="transferActionSheet"
				tabIndex="-1"
				role="dialog"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Transfer</h5>
						</div>
						<div className="modal-body">
							<div className="action-sheet-content">
								{isLoading ? (
									<InfinitySpin color="#000" />
								) : (
									<>
										{props.virtualAccount &&
										Object.getPrototypeOf(props.virtualAccount) ===
											Object.prototype &&
										Object.keys(props.virtualAccount).length === 0 ? (
											<>
												{bvnValidationFields.map((field) => (
													<div key={field}>{returnInput(field)}</div>
												))}
												<div className="form-group basic">
													<button
														type="button"
														className="btn btn-primary btn-block btn-lg"
														onClick={handleGenerateVirtualAccount}
														// data-bs-dismiss="modal"
													>
														Proceed
													</button>
												</div>
											</>
										) : (
											<>
												<div>
													<h2>Transfer Summary:</h2>
													<p>
														Account Number:{' '}
														{props.virtualAccount.account_number}
													</p>
													<p>Bank: {props.virtualAccount.bank_name}</p>
												</div>
												<CopyToClipboard
													text={props.virtualAccount.account_number}
													onCopy={() =>
														toast('Copied to clipboard', {
															type: 'success',
															position: 'top-center',
														})
													}
												>
													<button
														type="button"
														className="btn btn-primary btn-block btn-lg"
													>
														Copy Account Details
													</button>
												</CopyToClipboard>
											</>
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <!-- * Topup Transfer Action Sheet --> */}

			{/* <!-- Topup USSD Action Sheet --> */}
			<div
				className="modal fade action-sheet"
				id="ussdActionSheet"
				tabIndex="-1"
				role="dialog"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">USSD</h5>
						</div>
						<div className="modal-body">
							<div className="action-sheet-content">
								{isLoading ? (
									<InfinitySpin color="#000" />
								) : (
									<form>
										{showUssdBanks ? (
											<>
												<h2>Select Bank</h2>
												<ul className="listview flush transparent no-line image-listview">
													{supportedBanks.map((bank) => (
														<li
															key={bank.code}
															onClick={() => handleFetchUSSDcode(bank.code)}
															className="mb-2"
														>
															{bank.name}
														</li>
													))}
												</ul>
											</>
										) : (
											<>
												{returnInput('amount')}
												<div className="form-group basic">
													<button
														type="button"
														className="btn btn-primary btn-block btn-lg"
														// data-bs-dismiss="modal"
														onClick={() => setShowUssdBanks(true)}
													>
														Next
													</button>
												</div>
											</>
										)}
										{showUssdDetails ? (
											<div>
												<h2>USSD Summary:</h2>
												<p>To complete the transaction, dial the code below</p>
												<p>Code: {ussdDetails.code}</p>
												<CopyToClipboard
													text={ussdDetails.code}
													onCopy={() =>
														toast('Copied to clipboard', {
															type: 'success',
															position: 'top-center',
														})
													}
												>
													<button
														type="button"
														className="btn btn-primary btn-block btn-lg"
													>
														Copy Code
													</button>
												</CopyToClipboard>
											</div>
										) : null}
									</form>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <!-- * Topup Transfer Action Sheet --> */}
		</>
	);
}

export default ActionSheets;
