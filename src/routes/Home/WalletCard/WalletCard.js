import React from 'react';
import {
	AddOutline,
	ArrowDownOutline,
	ArrowForwardOutline,
	ArrowUpOutline,
} from 'react-ionicons';

function WalletCard(props) {
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

						<div className="item">
							<a
								href="#"
								data-bs-toggle="modal"
								data-bs-target="#withdrawActionSheet"
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
