import React, { useEffect } from 'react';
import { Navigate as Redirect } from 'react-router-dom';

function Logout() {
	useEffect(() => {
		localStorage.clear();
	});

	return <Redirect to="/login" />;
}

export default Logout;
