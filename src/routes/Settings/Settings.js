import React, { useState } from 'react';
import { CameraOutline } from 'react-ionicons';
import ActionSheets from '../../components/ActionSheets/ActionSheets';
import Header from '../../components/Header/Header';
import axios from '../../constants/axiosInstance';

function Settings(props) {
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [banks, setBanks] = useState([]);

	const fetchBanks = async (e) => {
		e.preventDefault();
		let response;

		try {
			const config = {
				headers: {
					authorization: `Bearer ${token}`,
				},
			};
			response = await axios.get('/account/getbanks', config);
		} catch (error) {
			console.log(error);
		}

		console.log(response);

		setBanks(response.data.data);
	};

	return (
		<>
			<Header pageTitle="settings" />
			<div id="appCapsule">
				<div className="section mt-3 text-center">
					<div className="avatar-section">
						<a href="#">
							<img
								src="/img/avatar/avatar1.jpg"
								alt="avatar"
								className="imaged w100 rounded"
							/>
							<span className="button">
								<CameraOutline />
							</span>
						</a>
					</div>
				</div>

				<div className="listview-title mt-1">Theme</div>
				<ul className="listview image-listview text inset no-line">
					<li>
						<div className="item">
							<div className="in">
								<div>Dark Mode</div>
								<div className="form-check form-switch  ms-2">
									<input
										className="form-check-input dark-mode-switch"
										type="checkbox"
										id="darkmodeSwitch"
									/>
									<label
										className="form-check-label"
										htmlFor="darkmodeSwitch"
									></label>
								</div>
							</div>
						</div>
					</li>
				</ul>

				<div className="listview-title mt-1">Profile Settings</div>
				<ul className="listview image-listview text inset">
					<li data-bs-toggle="modal" data-bs-target="#setAccountActionSheet">
						<a href="" className="item" onClick={fetchBanks}>
							<div className="in">
								<div>Add Account</div>
							</div>
						</a>
					</li>
				</ul>
			</div>
			<ActionSheets
				accountDetails={{}}
				setIsLoading={false}
				qrcode={{}}
				banks={banks}
				virtualAccount={{}}
			/>
		</>
	);
}

export default Settings;
