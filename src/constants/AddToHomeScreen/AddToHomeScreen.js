import React from 'react';
import { Close, ShareOutline, EllipsisVertical } from 'react-ionicons';

function AddToHomeScreen() {
	return (
		<>
			{/* <!-- iOS Add to Home Action Sheet --> */}
			<div
				class="modal inset fade action-sheet ios-add-to-home"
				id="ios-add-to-home-screen"
				tabIndex="-1"
				role="dialog"
			>
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title">Add to Home Screen</h5>
							<a href="#" class="close-button" data-bs-dismiss="modal">
								<Close />
							</a>
						</div>
						<div class="modal-body">
							<div class="action-sheet-content text-center">
								<div class="mb-1">
									<img
										src="assets/img/icon/192x192.png"
										alt="image"
										class="imaged w64 mb-2"
									/>
								</div>
								<div>
									Install <strong>Finapp</strong> on your iPhone's home screen.
								</div>
								<div>
									Tap <ShareOutline /> and Add to homescreen.
								</div>
								<div class="mt-2">
									<button
										class="btn btn-primary btn-block"
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
				class="modal inset fade action-sheet android-add-to-home"
				id="android-add-to-home-screen"
				tabIndex="-1"
				role="dialog"
			>
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title">Add to Home Screen</h5>
							<a href="#" class="close-button" data-bs-dismiss="modal">
								<Close />
							</a>
						</div>
						<div class="modal-body">
							<div class="action-sheet-content text-center">
								<div class="mb-1">
									<img
										src="/img/icon/192x192.png"
										alt="image"
										class="imaged w64 mb-2"
									/>
								</div>
								<div>
									Install <strong>Finapp</strong> on your Android's home screen.
								</div>
								<div>
									Tap <EllipsisVertical /> and Add to homescreen.
								</div>
								<div class="mt-2">
									<button
										class="btn btn-primary btn-block"
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
