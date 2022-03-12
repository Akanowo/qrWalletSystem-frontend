import React from 'react';
import { Link } from 'react-router-dom';
import { AddOutline, RemoveOutline } from 'react-ionicons';

function Transactions(props) {
	console.log(props);
	return (
		<>
			<div className="section mt-4">
				<div className="section-heading">
					<h2 className="title">Transactions</h2>
					<a href="app-transactions.html" className="link">
						View All
					</a>
				</div>
				<div className="transactions">
					{props.transactions
						? props.transactions.map((transaction) => (
								<Link
									key={transaction._id}
									to={`/transactions/${transaction._id}`}
									className="item"
								>
									<div className="detail">
										{/* <img
											src="/img/avatar/avatar4.jpg"
											alt="img"
											className="image-block imaged w48"
										/> */}
										{transaction.operation === 'credit' ? (
											<>
												<div className="right">
													<span
														href="#"
														className="button"
														data-bs-toggle="modal"
														data-bs-target="#depositActionSheet"
													>
														<AddOutline color={'#6236ff'} />
													</span>
												</div>
											</>
										) : (
											<>
												<div className="right">
													<span
														href="#"
														className="button"
														data-bs-toggle="modal"
														data-bs-target="#depositActionSheet"
													>
														<RemoveOutline color={'#6236ff'} />
													</span>
												</div>
											</>
										)}
										<div>
											<strong>{transaction.type.toUpperCase()}</strong>
											<p>{transaction.operation}</p>
										</div>
									</div>
									<div className="right">
										<div
											className={`price
                          ${
														transaction.operation === 'debit'
															? 'text-danger'
															: ''
													}`}
										>
											{transaction.operation === 'debit'
												? '-'
												: '+' +
												  Intl.NumberFormat('en-NG', {
														style: 'currency',
														currency: 'NGN',
												  }).format(transaction.amount - transaction.app_fee)}
										</div>
									</div>
								</Link>
						  ))
						: null}
				</div>
			</div>
		</>
	);
}

export default Transactions;
