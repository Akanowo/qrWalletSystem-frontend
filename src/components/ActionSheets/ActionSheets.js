import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../constants/axiosInstance';
import { toast } from 'react-toastify';
import { InfinitySpin } from 'react-loader-spinner';
import QrCodeScanner from '../QrCodeScanner/QrCodeScanner';

const defaultFields = [
	'card_number',
	'expiry_month',
	'expiry_year',
	'cvv',
	'amount',
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

	return (
		<>
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
								{isLoading ? (
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
													Withdraw
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
		</>
	);
}

export default ActionSheets;
