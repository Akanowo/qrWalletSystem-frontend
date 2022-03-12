import React from 'react';
import { MenuOutline, NotificationsOutline } from 'react-ionicons';

export default function Header() {
	return (
		<div className="appHeader bg-primary text-light">
			<div className="left">
				<a
					href="#"
					className="headerButton"
					data-bs-toggle="modal"
					data-bs-target="#sidebarPanel"
				>
					<MenuOutline color={'#fff'} />
				</a>
			</div>
			<div className="pageTitle">
				<img src="/img/logo.png" alt="logo" className="logo" />
			</div>
			<div className="right">
				<a href="#" className="headerButton">
					<NotificationsOutline cssClasses={'icon'} color={'#fff'} />
					<span className="badge badge-danger">4</span>
				</a>
				<a href="#" className="headerButton">
					<img
						src="/img/avatar/avatar1.jpg"
						alt="image"
						className="imaged w32"
					/>
					<span className="badge badge-danger">6</span>
				</a>
			</div>
		</div>
	);
}
