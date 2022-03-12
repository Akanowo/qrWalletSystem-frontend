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

function App() {
	return (
		<Router>
			<ToastContainer hideProgressBar autoClose={4000} />
			<Switch>
				<Route exact path="/" element={<Redirect to="/home" />} />
				<Route path="/home" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/*" element={<Redirect to="/home" />} />
			</Switch>
		</Router>
	);
}
export default App;