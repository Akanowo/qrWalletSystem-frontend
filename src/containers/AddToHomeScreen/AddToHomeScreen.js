import React from 'react';
import { Close, ShareOutline, EllipsisVertical } from 'react-ionicons';

function AddToHomeScreen() {
	return (
		<>
			{/* <!-- iOS Add to Home Action Sheet --> */}
			<div
				className="modal inset fade action-sheet ios-add-to-home"
				id="ios-add-to-home-screen"
				tabIndex="-1"
				role="dialog"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Add to Home Screen</h5>
							<a href="#" className="close-button" data-bs-dismiss="modal">
								<Close />
							</a>
						</div>
						<div className="modal-body">
							<div className="action-sheet-content text-center">
								<div className="mb-1">
									<img
										src="assets/img/icon/192x192.png"
										alt="image"
										className="imaged w64 mb-2"
									/>
								</div>
								<div>
									Install <strong>Finapp</strong> on your iPhone's home screen.
								</div>
								<div>
									Tap <ShareOutline /> and Add to homescreen.
								</div>
								<div className="mt-2">
									<button
										className="btn btn-primary btn-block"
										data-bs-dismiss="modal"
									>
										CLOSE
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <!-- * iOS Add to Home Action Sheet --> */}

			{/* <!-- Android Add to Home Action Sheet --> */}
			<div
				className="modal inset fade action-sheet android-add-to-home"
				id="android-add-to-home-screen"
				tabIndex="-1"
				role="dialog"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Add to Home Screen</h5>
							<a href="#" className="close-button" data-bs-dismiss="modal">
								<Close />
							</a>
						</div>
						<div className="modal-body">
							<div className="action-sheet-content text-center">
								<div className="mb-1">
									<img
										src="/img/icon/192x192.png"
										alt="image"
										className="imaged w64 mb-2"
									/>
								</div>
								<div>
									Install <strong>Finapp</strong> on your Android's home screen.
								</div>
								<div>
									Tap <EllipsisVertical /> and Add to homescreen.
								</div>
								<div className="mt-2">
									<button
										className="btn btn-primary btn-block"
										data-bs-dismiss="modal"
									>
										CLOSE
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <!-- * Android Add to Home Action Sheet --> */}
		</>
	);
}

export default AddToHomeScreen;
