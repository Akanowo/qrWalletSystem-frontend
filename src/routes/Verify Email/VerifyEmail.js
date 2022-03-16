import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../constants/axiosInstance';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';

function VerifyEmail() {
	const history = useNavigate();

	const [isLoading, setIsLoading] = useState(false);

	const query = useQuery();
	const token = query.get('token');

	useEffect(() => {
		setIsLoading(true);
		(async function () {
			const data = {
				token,
			};

			let response;

			try {
				response = await (await axios.post('/auth/verify-email', data)).data;
			} catch (error) {
				if (error.response) {
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

			toast(response.message, { type: 'success', position: 'top-center' });
			return;
		})();
	}, []);

	const handleBtnClick = (e) => {
		e.preventDefault();
		history('/login');
	};

	return (
		<div className="center">
			{isLoading ? (
				<Loader />
			) : (
				<div id="appCapsule">
					<div className="section mt-2 text-center">
						<img src="/img/photo/success.png" style={{ width: '60%' }} />
					</div>

					<div className="section mt-2 text-center">
						<h1>Email Verified Succesfully</h1>

						<button
							type="button"
							className="btn btn-primary btn-block btn-lg"
							onClick={handleBtnClick}
						>
							Proceed to login
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

export default VerifyEmail;
