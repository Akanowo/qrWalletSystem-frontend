import React, { useEffect } from 'react';
import { Navigate as Redirect } from 'react-router-dom';
import axios from '../../constants/axiosInstance';

function Logout() {
	useEffect(() => {
		axios
			.delete('/auth/logout')
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.log(err);
			});
	});

	return <Redirect to="/login" />;
}

export default Logout;
