import React from 'react';
import {
	PieChartOutline,
	AppsOutline,
	CardOutline,
	SettingsOutline,
	DocumentTextOutline,
} from 'react-ionicons';

function BottomMenu() {
	return (
		<>
			<div className="appBottomMenu">
				<a href="#" className="item active">
					<div className="col">
						<PieChartOutline />
						<strong>Overview</strong>
					</div>
				</a>
				<a href="#" className="item">
					<div className="col">
						<DocumentTextOutline />
						<strong>Pages</strong>
					</div>
				</a>
				<a href="#" className="item">
					<div className="col">
						<AppsOutline />
						<strong>Components</strong>
					</div>
				</a>
				<a href="#" className="item">
					<div className="col">
						<CardOutline />
						<strong>My Cards</strong>
					</div>
				</a>
				<a href="#" className="item">
					<div className="col">
						<SettingsOutline />
						<strong>Settings</strong>
					</div>
				</a>
			</div>
		</>
	);
}

export default BottomMenu;
