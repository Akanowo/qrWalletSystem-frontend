import { Component } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes as Switch,
	Navigate as Redirect,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './routes/Home/Home';
import Login from './routes/Auth/Login/Login';
import Signup from './routes/Auth/Signup/Signup';
import Logout from './routes/Logout/Logout';
import Settings from './routes/Settings/Settings';
import VerifyEmail from './routes/Verify Email/VerifyEmail';
import TransactionDetails from './components/Transactions/TransactionDetails';

function App() {
	return (
		<Router>
			<ToastContainer hideProgressBar autoClose={4000} />
			<Switch>
				<Route exact path="/" element={<Redirect to="/home" />} />
				<Route path="/home" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="/verify-email" element={<VerifyEmail />} />
				<Route path="/transactions/:id" element={<TransactionDetails />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/*" element={<Redirect to="/home" />} />
			</Switch>
		</Router>
	);
}
export default App;
