//check option box editCostume size gender

var serviceHost = 'http://xewadbsrv.000webhostapp.com'
window.fn = {};

window.fn.load = function(page, id) {
	var content = document.getElementById('myNavigator');
	content.pushPage(page)
	.then(function() {
		if (page == 'detailCostume.html') {
			getCostume(id);
		} else if (page == 'detailTransaction.html') {
			getTransaction(id);
		} else if (page == 'landing.html') {
			document.querySelector('ons-tabbar').addEventListener('prechange', function() {
				if (document.querySelector('ons-tabbar').getActiveTabIndex() == 0) {
					getCostume();
					getTransaction();
					getHistory();
					getProfile(loginAs);
				}
			});
		} else if (page == 'editCostume.html') {
			editCostume(id);
		};
	});
};

if (window.openDatabase) {
	var mydb = openDatabase("dbxewa", "0.1", "XEWA local Database", 1024 * 1024);

	mydb.transaction(function (t) {
		t.executeSql("CREATE TABLE IF NOT EXISTS providerloggedin (username VARCHAR(15) UNIQUE, isLoggedIn VARCHAR(5))");
		t.executeSql("SELECT COUNT(*) AS count FROM providerloggedin", [], function (transaction, results) {
			if (results.rows.item(0).count == '0') {
				t.executeSql("INSERT INTO providerloggedin VALUES ('default', 'false')");
			}
		});
	});
} else {
	alert("WebSQL tidak didukung oleh browser ini");
}

var loginAs = "";

function verify() {
	username = $("#username").val();
	password = $("#password").val();

	var url = `${serviceHost}/verify_login_provider.php?username=${username}&password=${password}`;
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'JSON',
		success: function (res) {
			if (res.login_result[0].isSuccess == "true") {
				if (mydb) {
					mydb.transaction(function (t) {
						t.executeSql(`UPDATE providerloggedin set username='${username}', isLoggedIn='true' WHERE username='default'`);
					});
				} else {
					alert("Database tidak ditemukan, browser tidak mendukung WebSQL");
				}

				loginAs = username;

				fn.load('landing.html');
			} else {
				ons.notification.alert("Login gagal");
			}
		},
		error: function (err) {
			console.log(err);
		}
	});
}

function isLoggedIn() {
	if (mydb) {
		mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM providerloggedin LIMIT 1", [], function (transaction, results) {
				if (results.rows.item(0).isLoggedIn == 'true') {
					loginAs = results.rows.item(0).username;
					fn.load('landing.html');
				} else {
					fn.load('login.html');
				}
			});
		});
	} else {
		alert("Database tidak ditemukan, browser tidak mendukung WebSQL");
	}
}

ons.ready(function() {
	isLoggedIn();
});

function getCostume(id) {
	if (typeof id === "undefined") {
		var url = `${serviceHost}/get_costume.php`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				var costume = res.product;
				for (var i = 0; i < costume.length; i++) {
					if (costume[i].gender == "F") {
						printGender = "<ons-icon icon='md-female'></ons-icon> Perempuan";
					} else {
						printGender = "<ons-icon icon='md-male-alt'></ons-icon> Laki-laki";
					}
					print += `
							<ons-card>
								<div class="title">
									${costume[i].name}
								</div>
								<ons-row>
									<ons-col width='150px'>
										<div class='cover' style='background-image: url("${costume[i].image_link}");'></div>
									</ons-col>
									<ons-col style='padding-left: 5px;' class='resultSection'>
										<div class='stock'>Stok: ${costume[i].available} dari ${costume[i].stock}</div>
										<div class='gender'>
											${printGender}
										</div>
										<div class='size'>Size: ${costume[i].size}</div>
										<div class='price'>Rp${costume[i].price}</div>
										<div class='rating'>
											<ons-icon icon='md-star-outline'></ons-icon>
											<ons-icon icon='md-star-outline'></ons-icon>
											<ons-icon icon='md-star-outline'></ons-icon>
											<ons-icon icon='md-star-outline'></ons-icon>
											<ons-icon icon='md-star-outline'></ons-icon>
										</div>
										<div><a href='#' onclick='fn.load("detailCostume.html", ${costume[i].id});'>Selengkapnya &rarr;</a></div>
									</ons-col>
								</ons-row>
							</ons-card>
					`;
				}
				document.getElementById('costumeHolder').innerHTML = print;
			},
			error: function (err) {
				console.log(err);
			}
		});

		document.getElementById("costumeLoader").style.display = "none";
	} else {
		var url = `${serviceHost}/get_costume.php?id=${id}`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				var costume = res.product;
				
				if (costume[0].gender == "F") {
					printGender = "<ons-icon icon='md-female'></ons-icon> Perempuan";
				} else {
					printGender = "<ons-icon icon='md-male-alt'></ons-icon> Laki-laki";
				}

				print += `
						<ons-card>
							<div class="title">
								${costume[0].name}
							</div>
							<ons-row>
								<ons-col width='150px'>
									<div class='cover' style='background-image: url("${costume[0].image_link}");'></div>
								</ons-col>
								<ons-col style='padding-left: 5px;' class='resultSection'>
									<div class='stock'>Stok: ${costume[0].available} dari ${costume[0].stock}</div>
									<div class='gender'>
										${printGender}
									</div>
									<div class='size'>Size: ${costume[0].size}</div>
									<div class='price'>Rp${costume[0].price}</div>
									<div class='rating'>
										<ons-icon icon='md-star-outline'></ons-icon>
										<ons-icon icon='md-star-outline'></ons-icon>
										<ons-icon icon='md-star-outline'></ons-icon>
										<ons-icon icon='md-star-outline'></ons-icon>
										<ons-icon icon='md-star-outline'></ons-icon>
									</div>
								</ons-col>
							</ons-row>
							<ons-row>
								<ons-col>
									<div class='description'>${costume[0].description}</div>
								</ons-col>
							</ons-row>
						</ons-card>

						<ons-speed-dial position="bottom right" direction="up">
							<ons-fab>
								<ons-icon icon="md-more"></ons-icon>
							</ons-fab>
							<ons-speed-dial-item onclick="deleteCostume(${costume[0].id})">
								<ons-icon icon="md-delete"></ons-icon>
							</ons-speed-dial-item>
							<ons-speed-dial-item onclick='fn.load("editCostume.html", ${costume[0].id});'>
								<ons-icon icon="md-edit"></ons-icon>
							</ons-speed-dial-item>
						</ons-speed-dial>
				`;
				document.getElementById("detailCostumeHolder").innerHTML = print;
				document.getElementById("detailCostumeLoader").style.display = "none";
			},

			error: function (err) {
				console.log(err);
			}
		});
	}
}


function getTransaction(id) {
	if (typeof id === "undefined") {
		var url = `${serviceHost}/get_transaction.php`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				var transaction = res.transaction;

				for (var i = 0; i < transaction.length; i++) {
					var trackNo = "";
					var returnTrackNo = "";
					
					if (transaction[i].status == 'Sedang Dikirim') {
						trackNo = `<div class='trackNo'>No resi : <b>${transaction[i].track_no}</b></div>`;
					} else if (transaction[i].status == 'Telah Diterima') {
						trackNo = `<div class='trackNo'>No resi : <b>${transaction[i].track_no}</b></div>`;
					} else if (transaction[i].status == 'Sedang Dikembalikan') {
						trackNo = `<div class='trackNo'>No resi : <b>${transaction[i].track_no}</b></div>`;
						returnTrackNo = `<div class='returnTrackNo'>No resi pengembalian : <b>${transaction[i].returned_track_no}</b></div>`;
					}

					print += `
							<ons-card>
								<div class="title">
									${transaction[i].trans_id}
								</div>
								<ons-row>
									<ons-col style='padding-left: 5px;' class='resultSection'>
										<div class='fromUsername'>${transaction[i].from_customer}</div>
										<div class='date'>${transaction[i].date_created}</div>
										<div class='status'>Status : <span class="notification notification--material">${transaction[i].status}</span></div>
										${trackNo}
										${returnTrackNo}
										<div><a href='#'onclick='fn.load("detailTransaction.html"); getTransaction(${transaction[i].trans_id});'>Selengkapnya &rarr;</a></div>
									</ons-col>
								</ons-row>
							</ons-card>
					`;
				}
				document.getElementById('transactionHolder').innerHTML = print;
			},
			error: function (err) {
				console.log(err);
			}
		});

		document.getElementById("transactionLoader").style.display = "none";
	} else {
		var url = `${serviceHost}/get_transaction.php?id=${id}`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				var printButton = "";
				var trackNo = ""
				var returnTrackNo = ""
				var transaction = res.transaction;

				if (transaction[0].status == 'Menunggu Pembayaran') {
					printButton = `<ons-button id="updateTransactionPaid" modifier="large" onclick="editTransactionStatus(${transaction[0].trans_id}, '${transaction[0].status}');"><ons-icon icon='md-balance-wallet'></ons-icon> Verifikasi Pembayaran</ons-button>`;
				} else if (transaction[0].status == 'Telah Dibayar') {
					printButton = `<ons-button id="updateTransactionPacked" modifier="large" onclick="editTransactionStatus(${transaction[0].trans_id}, '${transaction[0].status}');"><ons-icon icon='md-dropbox'></ons-icon> Akan Dikemas</ons-button>`;
				} else if (transaction[0].status == 'Sedang Dikemas') {
					printButton = `<ons-button id="updateTransactionSent" modifier="large" onclick="editTransactionStatus(${transaction[0].trans_id}, '${transaction[0].status}');"><ons-icon icon='md-truck'></ons-icon> Akan Dikirim</ons-button>`;
				} else if (transaction[0].status == 'Sedang Dikirim') {
					trackNo = `<div class='trackNo'>No resi : <b>${transaction[0].track_no}</b></div>`;
				} else if (transaction[0].status == 'Telah Diterima') {
					trackNo = `<div class='trackNo'>No resi : <b>${transaction[0].track_no}</b></div>`;
				} else if (transaction[0].status == 'Sedang Dikembalikan') {
					trackNo = `<div class='trackNo'>No resi : <b>${transaction[0].track_no}</b></div>`;
					returnTrackNo = `<div class='returnTrackNo'>No resi pengembalian : <b>${transaction[0].returned_track_no}</b></div>`;
					printButton = `<ons-button id="updateTransactionReturned" modifier="large" onclick="editTransactionStatus(${transaction[0].trans_id}, '${transaction[0].status}');"><ons-icon icon='md-check-circle'></ons-icon> Verifikasi Pengembalian</ons-button>`;
				}

				print += `
						<ons-card>
							<div class="title">
									${transaction[0].trans_id}
								</div>
								<ons-row>
									<ons-col style='padding-left: 5px;' class='resultSection'>
										<div class='fromUsername'>${transaction[0].from_customer}</div>
										<div class='date'>${transaction[0].date_created}</div>
										<div class='status'>Status : <span class="notification notification--material">${transaction[0].status}</span></div>
										${trackNo}
										${returnTrackNo}
										<div class='total'>Total bayar : ${transaction[0].total_price}</div>
									</ons-col>
								</ons-row>
								<ons-row>
									<ons-col>
										${printButton}
									</ons-col>
								</ons-row>
						</ons-card>
				`;
				document.getElementById("detailTransactionHolder").innerHTML = print;
				document.getElementById("detailTransactionLoader").style.display = "none";
			},

			error: function (err) {
				console.log(err);
			}
		});
	}
}


function getHistory(id) {
	if (typeof id === "undefined") {
		var url = `${serviceHost}/get_history.php`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				var history = res.transaction;
				for (var i = 0; i < history.length; i++) {
					print += `
							<tr>
								<td class="text-left">${history[i].trans_id}</td>
								<td class="text-left">${history[i].from_customer}</td>
								<td class="text-left">${history[i].date_created}</td>
								<td class="text-left">${history[i].total_price}</td>
							</tr>
					`;
				}
				document.getElementById('historyHolder').innerHTML = print;
			},
			error: function (err) {
				console.log(err);
			}
		});

		document.getElementById("historyLoader").style.display = "none";
	} else {
		alert("IDNYA " + id);
	}
}

function addCostume() {
	newCostumeName = $("#newCostumeName").val();
	newCostumeStock = $("#newCostumeStock").val();
	newCostumeImageLink = $("#newCostumeImageLink").val();
	newCostumeDescription = $("#newCostumeDescription").val();
	newCostumeGender = $("input[name=newCostumeGender]:checked").val();
	newCostumeSize = $("input[name=newCostumeSize]:checked").val();
	newCostumePrice = $("#newCostumePrice").val();

	if (newCostumeName !== '' && newCostumeStock !== '' && newCostumeImageLink !== '' && newCostumeDescription !== '' && newCostumePrice!== '') {
		var url = `${serviceHost}/add_costume.php?name=${newCostumeName}&stock=${newCostumeStock}&available=${newCostumeStock}&image_link=${newCostumeImageLink}&description=${newCostumeDescription}&gender=${newCostumeGender}&size=${newCostumeSize}&price=${newCostumePrice}`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				if (res.query_result[0].isSuccess == "true") {
					ons.notification.toast('Data tersimpan!', { timeout: 2000 });
					setTimeout(function(){
						document.getElementById('myNavigator').popPage();
						getCostume();
					}, 2000);
				} else {
					ons.notification.alert("Data gagal tersimpan!");
				}
			},
			error: function (err) {
				console.log(err);
			}
		});
	} else {
		ons.notification.alert("Lengkapi semua input!");
	}
}

function deleteCostume(id) {
	var url = `${serviceHost}/delete_costume.php?id=${id}`;
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'JSON',
		success: function (res) {
			var print = "";
			if (res.delete_result[0].isSuccess == "true") {
				ons.notification.toast('Data berhasil terhapus!', { timeout: 2000 });
				setTimeout(function(){
					document.getElementById('myNavigator').popPage();
					getCostume();
				}, 2000);
			} else {
				ons.notification.alert("Data gagal terhapus!");
			}
		},
		error: function (err) {
			console.log(err);
		}
	});
}

function editCostume(id) {
	var url = `${serviceHost}/get_costume.php?id=${id}`;
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'JSON',
		success: function (res) {
			var print = "";
			var costume = res.product;

			print += `
					<ons-card>
						<input type="hidden" id="editCostumeId" value="${costume[0].id}"></input>
						<ons-row style="margin-bottom: 10px;">
							<ons-col style='padding-left: 5px;' class='resultSection'>
								Nama Kostum
							</ons-col>
							<ons-col style='padding-left: 5px;' class='resultSection'>
								<ons-input id="editCostumeName" modifier="underbar" value="${costume[0].name}" float></ons-input>
							</ons-col>
						</ons-row>
						<ons-row style="margin-bottom: 10px;">
							<ons-col style='padding-left: 5px;' class='resultSection'>
								Stok
							</ons-col>
							<ons-col style='padding-left: 5px;' class='resultSection'>
								<ons-input id="editCostumeStock" modifier="underbar" float type="number" min="1"  value="${costume[0].stock}"></ons-input>
							</ons-col>
						</ons-row>
						<ons-row style="margin-bottom: 10px;">
							<ons-col style='padding-left: 5px;' class='resultSection'>
								Link Gambar
							</ons-col>
							<ons-col style='padding-left: 5px;' class='resultSection'>
								<ons-input id="editCostumeImageLink" modifier="underbar" value="${costume[0].image_link}" float></ons-input>
							</ons-col>
						</ons-row>
						<ons-row style="margin-bottom: 10px;">
							<ons-col style='padding-left: 5px;' class='resultSection'>
								Deskripsi
							</ons-col>
							<ons-col style='padding-left: 5px;' class='resultSection'>
								<ons-input id="editCostumeDescription" modifier="underbar" value="${costume[0].description}" float></ons-input>
							</ons-col>
						</ons-row>
						<ons-row style="margin-bottom: 10px;">
							<ons-col style='padding-left: 5px;' class='resultSection'>
								Gender
							</ons-col>
							<ons-col style='padding-left: 5px;' class='resultSection'>
								<ons-list>
									<ons-list-item tappable>
										<label class="left">
											<ons-radio name="editCostumeGender" input-id="genderF" value="F"></ons-radio>
										</label>
										<label for="genderF" class="center">
											Female
										</label>
									</ons-list-item>
									<ons-list-item tappable>
										<label class="left">
											<ons-radio name="editCostumeGender" input-id="genderM" value="M"></ons-radio>
										</label>
										<label for="genderM" class="center">
											Male
										</label>
									</ons-list-item>
									<ons-list-item tappable>
										<label class="left">
											<ons-radio name="editCostumeGender" input-id="genderU" value="U"></ons-radio>
										</label>
										<label for="genderU" class="center">
											Unisex
										</label>
									</ons-list-item>
								</ons-list>
							</ons-col>
						</ons-row>
						<ons-row style="margin-bottom: 10px;">
							<ons-col style='padding-left: 5px;' class='resultSection'>
								Size
							</ons-col>
							<ons-col style='padding-left: 5px;' class='resultSection'>
								<ons-list>
									<ons-list-item tappable>
										<label class="left">
											<ons-radio name="editCostumeSize" input-id="sizeS" value="S"></ons-radio>
										</label>
										<label for="sizeS" class="center">
											S (Small)
										</label>
									</ons-list-item>
									<ons-list-item tappable>
										<label class="left">
											<ons-radio name="editCostumeSize" input-id="sizeM" value="M"></ons-radio>
										</label>
										<label for="sizeM" class="center">
											M (Medium)
										</label>
									</ons-list-item>
									<ons-list-item tappable>
										<label class="left">
											<ons-radio name="editCostumeSize" input-id="sizeL" value="L"></ons-radio>
										</label>
										<label for="sizeL" class="center">
											L (Large)
										</label>
									</ons-list-item>
									<ons-list-item tappable>
										<label class="left">
											<ons-radio name="editCostumeSize" input-id="sizeXL" value="XL"></ons-radio>
										</label>
										<label for="sizeXL" class="center">
											XL (Extra Large)
										</label>
									</ons-list-item>
								</ons-list>
							</ons-col>
						</ons-row>
						<ons-row style="margin-bottom: 10px;">
							<ons-col style='padding-left: 5px;' class='resultSection'>
								Harga Sewa
							</ons-col>
							<ons-col style='padding-left: 5px;' class='resultSection'>
								<ons-input id="editCostumePrice" modifier="underbar" float type="number" value="${costume[0].price}"></ons-input>
							</ons-col>
						</ons-row>
						<ons-row style="margin-bottom: 10px;">
							<ons-col style='padding-left: 5px;' class='resultSection'>
							</ons-col>
							<ons-col style='padding-left: 5px;' class='resultSection'>
								<ons-button id="updateCostumeButton" modifier="large" onclick="updateCostume();">Update</ons-button>
							</ons-col>
						</ons-row>
					</ons-card>
			`;
			document.getElementById('editCostumeHolder').innerHTML = print;
		},

		error: function (err) {
			console.log(err);
		}
	});

}


function updateCostume() {
	editCostumeId = $("#editCostumeId").val();
	editCostumeName = $("#editCostumeName").val();
	editCostumeStock = $("#editCostumeStock").val();
	editCostumeImageLink = $("#editCostumeImageLink").val();
	editCostumeDescription = $("#editCostumeDescription").val();
	editCostumeGender = $("input[name=editCostumeGender]:checked").val();
	editCostumeSize = $("input[name=editCostumeSize]:checked").val();
	editCostumePrice = $("#editCostumePrice").val();



	if (editCostumeName !== '' && editCostumeStock !== '' && editCostumeImageLink !== '' && editCostumeDescription !== '' && editCostumePrice!== '') {
		var url = `${serviceHost}/update_costume.php?id=${editCostumeId}&name=${editCostumeName}&stock=${editCostumeStock}&available=${editCostumeStock}&image_link=${editCostumeImageLink}&description=${editCostumeDescription}&gender=${editCostumeGender}&size=${editCostumeSize}&price=${editCostumePrice}`;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function (res) {
				var print = "";
				if (res.query_result[0].isSuccess == "true") {
					ons.notification.toast('Data berhasil diperbarui!', { timeout: 2000 });
					setTimeout(function(){
						document.getElementById('myNavigator').popPage();
						getCostume(editCostumeId);
					}, 2000);
				} else {
					ons.notification.alert("Data gagal diperbarui!");
				}
			},
			error: function (err) {
				console.log(err);
			}
		});
	} else {
		ons.notification.alert("Lengkapi semua input!");
	}
}

function editTransactionStatus(id, status) {
	if (status == 'Menunggu Pembayaran') {
		ons.notification.confirm({
			message: 'Apakah anda yakin akan memverifikasi pembayaran transaksi ini?',
			buttonLabels: ['Batal', 'Ya'],
			cancelable: true,
			callback: function (index) {
				if (index == 1) {
					updateTransactionStatus(id, 'Telah Dibayar');
				}
			}
		});
	} else if (status == 'Telah Dibayar') {
		ons.notification.alert({
			message: `Barang akan dikemas!`,
			callback: function () {
				updateTransactionStatus(id, 'Sedang Dikemas');
			}
		});
	} else if (status == 'Sedang Dikemas') {
		ons.notification.prompt({
			message: `Masukkan nomor resi produk:`,
			cancelable: true,
			callback: function (input) {
				if (input !== null) {
					updateTransactionStatus(id, 'Sedang Dikirim', input);
				}
			}
		});
	} else if (status == 'Sedang Dikembalikan') {
		ons.notification.confirm({
			message: 'Apakah anda yakin akan memverifikasi pengembalian barang ini?',
			buttonLabels: ['Batal', 'Ya'],
			cancelable: true,
			callback: function (index) {
				if (index == 1) {
					updateTransactionStatus(id, 'Telah Dikembalikan');
				}
			}
		});
	}
}

function updateTransactionStatus(id, status, track_no) {
	var url = `${serviceHost}/update_transaction_status.php?id=${id}&status=${status}&track_no=${track_no}`;
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'JSON',
		success: function (res) {
			var print = "";
			if (res.query_result[0].isSuccess == "true") {
				ons.notification.toast('Status transaksi berhasil diperbarui!', { timeout: 2000 });
				setTimeout(function(){
					getTransaction(id);
				}, 2000);
			} else {
				ons.notification.alert("Data gagal diperbarui!");
			}
		},
		error: function (err) {
			console.log(err);
		}
	});
}

function getProfile(username) {
	var url = `${serviceHost}/get_profile.php?username=${username}&type=provider`;
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'JSON',
		success: function (res) {
			var print = "";
			var profile = res.profile;

			print += `
					<ons-card>
						<div class="title">
								${profile[0].username}
							</div>
							<ons-row>
								<ons-col style='padding-left: 5px;' class='resultSection'>
									<div>Username :</div>
									<div>Email :</div>
									<div>Phone :</div>
									<div>Address :</div>
								</ons-col>
								<ons-col style='padding-left: 5px;' class='resultSection'>
									<div class='profileUsername'>${profile[0].username}</div>
									<div class='profileEmail'>${profile[0].email}</div>
									<div class='profilePhone'>${profile[0].phone}</div>
								</ons-col>
							</ons-row>
							<ons-row>
								<ons-col>
									<ons-button modifier="large" onclick="logout()">Sign Out</ons-button>
								</ons-col>
							</ons-row>
					</ons-card>
			`;
			document.getElementById("profileHolder").innerHTML = print;
			document.getElementById("profileLoader").style.display = "none";
		},

		error: function (err) {
			console.log(err);
		}
	});
}

function logout() {
	mydb.transaction(function (t) {
		t.executeSql(`DELETE FROM providerloggedin WHERE username='${loginAs}'`);
	});

	document.getElementById('myNavigator').resetToPage('login.html');
}