import React from 'react';
import { Link } from 'react-router-dom';
import {
	AddOutline,
	ArrowDownOutline,
	ArrowForwardOutline,
	PieChartOutline,
	SettingsOutline,
	LogOutOutline,
	CloseOutline,
} from 'react-ionicons';

function Sidebar(props) {
	console.log(props);
	return (
		<>
			<div
				className="modal fade panelbox panelbox-left"
				id="sidebarPanel"
				tabIndex="-1"
				role="dialog"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-body p-0">
							{/* <!-- profile box --> */}
							<div className="profileBox pt-2 pb-2">
								<div className="image-wrapper">
									<img
										src="/img/avatar/avatar1.jpg"
										alt="image"
										className="imaged  w36"
									/>
								</div>
								<div className="in">
									<strong>
										{props.user.firstName + ' ' + props.user.lastName}
									</strong>
									{/* <div className="text-muted">4029209</div> */}
								</div>
								<a
									href="#"
									className="btn btn-link btn-icon sidebar-close"
									data-bs-dismiss="modal"
								>
									<CloseOutline color={'#fff'} />
								</a>
							</div>
							{/* <!-- * profile box --> */}
							{/* <!-- balance --> */}
							<div className="sidebar-balance">
								<div className="listview-title">Balance</div>
								<div className="in">
									<h1 className="amount">
										{Intl.NumberFormat('en-NG', {
											style: 'currency',
											currency: 'NGN',
										}).format(props.wallet.balance)}
									</h1>
								</div>
							</div>
							{/* <!-- * balance --> */}

							{/* <!-- action group --> */}
							{/* <div className="action-group">
								<a href="#" className="action-button">
									<div className="in">
										<div className="iconbox">
											{<AddOutline color={'#fff'} />}
										</div>
										Topup
									</div>
								</a>
								<a href="#" className="action-button">
									<div className="in">
										<div className="iconbox">
											<ArrowForwardOutline color={'#fff'} />
										</div>
										Transfer
									</div>
								</a>
								<a href="#" className="action-button">
									<div className="in">
										<div className="iconbox">
											<ArrowDownOutline color={'#fff'} />
										</div>
										Withdraw
									</div>
								</a>
							</div> */}
							{/* <!-- * action group --> */}

							{/* <!-- menu --> */}
							<div className="listview-title mt-1">Menu</div>
							<ul className="listview flush transparent no-line image-listview">
								<li>
									<Link to="/home" className="item">
										<div className="icon-box bg-primary">
											<PieChartOutline color={'#fff'} />
										</div>
										<div className="in">
											Wallet
											<span className="badge badge-primary">10</span>
										</div>
									</Link>
								</li>
							</ul>
							{/* <!-- * menu --> */}

							{/* <!-- others --> */}
							<div className="listview-title mt-1">Others</div>
							<ul className="listview flush transparent no-line image-listview">
								<li>
									<Link to="/settings" className="item">
										<div className="icon-box bg-primary">
											<SettingsOutline color={'#fff'} />
										</div>
										<div className="in">Settings</div>
									</Link>
								</li>
								<li>
									<Link to="/logout" className="item">
										<div className="icon-box bg-primary">
											<LogOutOutline color={'#fff'} />
										</div>
										<div className="in">Log out</div>
									</Link>
								</li>
							</ul>
							{/* <!-- * others --> */}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Sidebar;
