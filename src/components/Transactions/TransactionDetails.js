import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../constants/axiosInstance';
import Loader from '../../components/Loader/Loader';
import { ArrowForwardOutline } from 'react-ionicons';
import moment from 'moment';
import Header from '../Header/Header';

function TransactionDetails() {
	const { id } = useParams();
	const history = useNavigate();

	const [token] = useState(localStorage.getItem('token'));
	const [isLoading, setIsLoading] = useState(false);
	const [transaction, setTransaction] = useState({});

	useEffect(() => {
		setIsLoading(true);
		(async function () {
			let response;

			try {
				const config = {
					headers: {
						authorization: `Bearer ${token}`,
					},
				};
				response = await (await axios.get(`/transactions/${id}`, config)).data;
			} catch (error) {
				setIsLoading(false);
				if (error.response) {
					toast(error.response.data.error || 'An error occured', {
						type: 'error',
						position: 'top-center',
					});
					return history('/');
				}
				toast('An error occured', { type: 'error', position: 'top-center' });
				return;
			}

			setIsLoading(false);

			console.log(response);
			setTransaction(response.data);
		})();
	}, []);

	const returnFields = (type) => {
		switch (type) {
			case 'topup':
				return (
					<>
						<li>
							<strong>Amount</strong>
							<span>{transaction.amount - transaction.app_fee}</span>
						</li>

						<li>
							<strong>Paymet Type</strong>
							<span>{transaction.payment_type}</span>
						</li>

						{transaction.payment_type === 'card' ? (
							<>
								<li>
									<strong>Card Type</strong>
									<span>{transaction.card.type}</span>
								</li>
								<li>
									<strong>Card Number</strong>
									<span>******{transaction.card.last_4digits}</span>
								</li>
							</>
						) : null}
					</>
				);

			case 'transfer':
				return (
					<>
						<li>
							<strong>Amount</strong>
							<span>{transaction.amount - transaction.app_fee}</span>
						</li>
						<li>
							<strong>Currency</strong>
							<span>{transaction.currency}</span>
						</li>
						{transaction.to ? (
							<li>
								<strong>To</strong>
								<span>{transaction.to.vendorName}</span>
							</li>
						) : null}

						{transaction.from ? (
							<li>
								<strong>From</strong>
								<span>
									{transaction.from.firstName} {transaction.from.lastName}
								</span>
							</li>
						) : null}

						<li>
							<strong>Time</strong>
							<span>{moment(transaction.created_at).fromNow()}</span>
						</li>
					</>
				);

			default:
				return <></>;
		}
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<Header pageTitle="Transaction Details" />
					<div id="appCapsule" className="full-height">
						<div className="section mt-2 mb-2">
							<div className="listed-detail mt-3">
								<div className="icon-wrapper">
									<div className="iconbox">
										<ArrowForwardOutline />
									</div>
								</div>
								<h3 className="text-center mt-2 capitalize">
									{transaction.type}
									<br />
									Ref: [#{transaction.id}]
								</h3>
							</div>

							<ul className="listview flush transparent simple-listview no-space mt-3">
								<li>
									<strong>Alert</strong>
									<span
										className={
											transaction.operation === 'credit'
												? 'text-success'
												: 'text-danger'
										}
									>
										{transaction.operation}
									</span>
								</li>

								<li>
									<strong>Status</strong>
									<span className="text-success">{transaction.status}</span>
								</li>
								{/* <li>
									<strong>Transaction ID</strong>
									<span>{transaction.id}</span>
								</li> */}
								{returnFields(transaction.type)}
							</ul>
						</div>
					</div>
				</>
			)}
		</>
	);
}

export default TransactionDetails;
