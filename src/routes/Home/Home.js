import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from '../../constants/axiosInstance';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import Sidebar from '../../components/Sidebar/Sidebar';
import BottomMenu from '../../components/BottomMenu/BottomMenu';
import WalletCard from './WalletCard/WalletCard';
import Transactions from '../../components/Transactions/Transaction';
import Header from '../../components/Header/Header';
import ActionSheets from '../../components/ActionSheets/ActionSheets';

function Home(props) {
	console.log(props);

	const [userDetails, setUserDetails] = useState({});
	const [walletDetails, setWalletDetails] = useState({});
	const [transactions, setTransactions] = useState([]);
	const [qrCodeDetails, setQrCodeDetails] = useState({});
	const [redirect, setRedirect] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		(async function getProfile() {
			let profile;
			setIsLoading(true);
			try {
				profile = await (await axios.get('/auth/profile')).data;
			} catch (error) {
				setIsLoading(false);
				if (error.response) {
					switch (error.response.status) {
						case 401:
							toast(error.response.data.error, {
								type: 'error',
								position: 'top-center',
							});
							return setRedirect('/login');

						default:
							toast(error.response.data.error || 'An error occured', {
								type: 'error',
								position: 'top-center',
								theme: 'colored',
							});
							return setRedirect('/login');
					}
				}
			}

			setIsLoading(false);

			console.log(profile);
			setUserDetails(profile.data.user);
			setWalletDetails(profile.data.wallet);
			setTransactions(profile.data.transactions);
			setQrCodeDetails(profile.data.qrcode);
		})();

		// fetch profile details
	}, []);

	return (
		<>
			{redirect ? (
				<Navigate to={redirect} />
			) : (
				<>
					{isLoading ? (
						<Loader />
					) : (
						<>
							<Header />
							<div id="appCapsule">
								<WalletCard wallet={walletDetails} />

								<ActionSheets setIsLoading={setIsLoading} />

								<Transactions transactions={transactions} />
							</div>
							{/* <BottomMenu /> */}
							<Sidebar user={userDetails} wallet={walletDetails} />
						</>
					)}
				</>
			)}
		</>
	);
}

export default Home;
