import React, { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from '../../constants/axiosInstance';
import { toast } from 'react-toastify';

function QrCodeScanner(props) {
	let html5QrcodeScanner;
	const onScanSuccess = (decodedText, decodedResult) => {
		// handle the scanned code as you like, for example:
		console.log(`Code matched = ${decodedText}`, decodedResult);

		html5QrcodeScanner.stop();

		(async function () {
			props.setIsLoading(true);

			const data = {
				amount: Number.parseInt(props.amount),
				address: decodedText,
			};

			console.log(data);

			let response;
			try {
				response = await (await axios.post('/payment/transfer', data)).data;
			} catch (error) {
				props.setIsLoading(false);
				if (error.response && error.response.data) {
					return toast(error.response.data.error || 'An error occured', {
						type: 'error',
						position: 'top-center',
						theme: 'colored',
					});
				}
			}

			console.log(response);

			if (response && response.status) {
				toast(`Transfer Successful`, {
					type: 'success',
					position: 'top-center',
					theme: 'colored',
				});
				props.resetStates();
				props.updateTransactions(response.data.transaction);
				props.updateWalletBalance(response.data.balance);
				props.closeModal();
				return;
			}

			toast('An error occured', {
				type: 'error',
				position: 'top-center',
				theme: 'colored',
			});
		})();
	};

	const onScanFailure = (error) => {
		// handle scan failure, usually better to ignore and keep scanning.
		// for example:
		console.warn(error);
		if (error.includes('NotFoundException')) {
			console.warn(`Code scan error = ${error}`);
			return;
		}
		// html5QrcodeScanner.stop();
	};

	const handleClose = () => {
		html5QrcodeScanner.stop();
	};

	useEffect(() => {
		html5QrcodeScanner = new Html5Qrcode('reader', /* verbose= */ true);
		const config = { fps: 10, qrbox: { width: 250, height: 250 } };
		html5QrcodeScanner.start(
			{ facingMode: 'environment' },
			config,
			onScanSuccess,
			onScanFailure
		);
	}, []);

	return (
		<>
			<div id="reader" width="600px"></div>
			<button
				type="button"
				className="btn btn-primary btn-block btn-lg"
				onClick={handleClose}
				// data-bs-dismiss="modal"
			>
				Stop
			</button>
		</>
	);
}

export default QrCodeScanner;
