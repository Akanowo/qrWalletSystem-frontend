import React from 'react';
import {
	AddOutline,
	ArrowDownOutline,
	ArrowForwardOutline,
	ArrowUpOutline,
} from 'react-ionicons';
import { toast } from 'react-toastify';

function WalletCard(props) {
	const checkAccountExists = (e) => {
		if (
			props.accountDetails &&
			Object.getPrototypeOf(props.accountDetails) === Object.prototype &&
			Object.keys(props.accountDetails).length === 0
		) {
			// deny showing action sheet
			e.preventDefault();
			return toast('Please set your account details in settings', {
				position: 'top-center',
				type: 'warning',
			});
		}
	};

	return (
		<>
			{/* <!-- Wallet Card --> */}
			<div className="section wallet-card-section pt-1">
				<div className="wallet-card">
					{/* <!-- Balance --> */}
					<div className="balance">
						<div className="left">
							<span className="title">Total Balance</span>
							<h1 className="total">
								{Intl.NumberFormat('en-NG', {
									style: 'currency',
									currency: 'NGN',
								}).format(props.wallet.balance)}
							</h1>
						</div>
						{/* <div className="right">
							<a
								href="#"
								className="button"
								data-bs-toggle="modal"
								data-bs-target="#depositActionSheet"
							>
								<AddOutline color={'#6236ff'} />
							</a>
						</div> */}
					</div>
					{/* <!-- * Balance --> */}
					{/* <!-- Wallet Footer --> */}
					<div className="wallet-footer">
						<div className="item">
							<a
								href="#"
								data-bs-toggle="modal"
								data-bs-target="#depositActionSheet"
							>
								<div className="icon-wrapper bg-danger">
									<ArrowUpOutline color={'#fff'} />
								</div>
								<strong>Topup</strong>
							</a>
						</div>

						<div className="item">
							<a
								href="#"
								data-bs-toggle="modal"
								data-bs-target="#sendActionSheet"
							>
								<div className="icon-wrapper">
									<ArrowForwardOutline color={'#fff'} />
								</div>
								<strong>Send</strong>
							</a>
						</div>

						<div className="item" onClick={checkAccountExists}>
							<a
								href="#"
								data-bs-toggle={
									props.accountDetails &&
									Object.getPrototypeOf(props.accountDetails) ===
										Object.prototype &&
									Object.keys(props.accountDetails).length === 0
										? null
										: 'modal'
								}
								data-bs-target={
									props.accountDetails &&
									Object.getPrototypeOf(props.accountDetails) ===
										Object.prototype &&
									Object.keys(props.accountDetails).length === 0
										? null
										: '#withdrawActionSheet'
								}
							>
								<div className="icon-wrapper bg-danger">
									<ArrowDownOutline color={'#fff'} />
								</div>
								<strong>Withdraw</strong>
							</a>
						</div>
					</div>
					{/* <!-- * Wallet Footer --> */}
				</div>
			</div>
			{/* <!-- Wallet Card --> */}
		</>
	);
}

export default WalletCard;
