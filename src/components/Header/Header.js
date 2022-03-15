import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
	MenuOutline,
	NotificationsOutline,
	ChevronBackOutline,
} from 'react-ionicons';

export default function Header(props) {
	const history = useNavigate();
	return (
		<div className="appHeader bg-primary text-light">
			{props.pageTitle === 'home' ? (
				<>
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
				</>
			) : (
				<>
					<div className="left">
						<a href="#" className="headerButton goBack">
							<ChevronBackOutline onClick={() => history(-1)} />
						</a>
					</div>
					<div className="pageTitle">{props.pageTitle}</div>
					<div className="right">
						<a href="app-notifications.html" className="headerButton">
							<NotificationsOutline cssClasses={'icon'} />
							<span className="badge badge-danger">4</span>
						</a>
					</div>
				</>
			)}
		</div>
	);
}
