/**
 * Wine cellar site type "Single Page Application"
 * @Version 1.0
 * @file Main script of the SPA
 *
 * @author Y. Astitou
 * @author A. Heymans
 * @author M. Kadi
 * @author R. Mimouni
 * @author S. Oldenhove <simonoldenhove@gmail.com>
 *
 */


/******************* Variables ******************/
let wines;
let HTTPMethod;
let sortName;
let lastAction;
let userLikes=[];
let availableTags = [];
let info;
let pictureSelect;
let picturesList;
//Array of users object, TODO put in another js file ?
let loginTab = [
	{
		"username" : "rachida",
		"password" : "epfc",
		"id":"20"
	},

	{
		"username" : "youssef",
		"password" : "epfc",
		"id" :"23"
	},

	{
		"username" : "simon",
		"password" : "epfc",
		"id" : "21"
	},

	{
		"username" : "angeline",
		"password" : "epfc",
		"id" :"8"
	},

	{
		"username" : "myriam",
		"password" : "epfc",
		"id" : "17"
	},

	{
		"username" : "ced",
		"password" : "epfc",
		"id" : "1"
	}

];


const apiUrl = "http://cruth.phpnet.org/epfc/caviste/public/index.php/api";
const pics = "http://cruth.phpnet.org/epfc/caviste/public/pics/";
const uploads = "http://cruth.phpnet.org/epfc/caviste/public/uploads/";

/******************* Functions ******************/

/**
 * Formulaire de connexion et de déconnexion
 */
$(function () {
	var dialog, form,
	name = $("#name"),
	password = $("#password"),
	allFields = $([]).add(name).add(password);
	//TODO adapter quand l'api sera prete
	function connectUser() {
		let user = document.getElementById("userName").value;
		let pass = document.getElementById("password").value;

		if(window.sessionStorage){
			//parcourir le tableau d'objets pour récupérer la valeur de chaque clé
			for(let i=0; i<loginTab.length; i++){
				if(user == loginTab[i].username && pass == loginTab[i].password){
					alert('login success !');
					//On affecter le login et le pwd  à la session
					sessionStorage.setItem("user", user);
					sessionStorage.setItem("pass", pass);
					sessionStorage.setItem("id", loginTab[i].id);
				}
			}
			//Après le for si aucunne connexion => message d'erreur
			if(!sessionStorage.getItem("user")){
				alert("Erreur connexion");
			}
		} else {
			console.log('sessionStorage Not supported');
		}
		dialog.dialog("close");
		onload();
	}

	function disconnectUser() {
		//cacher le bouton login quand l utilisateur est connecté
		document.getElementById("login-icone").style.display = 'block';
		//Afficher le bouton logout, save, delete, new
		document.getElementById("logout-icone").style.display = 'none';
		//TODO cacher les autres éléments par défaut et les afficher ici lorsque l'utilisateur est connecté
		let elements = document.getElementsByClassName('hideConnect');
		for(let i = 0; i < elements.length; i++) {
			elements[i].style.display = 'none';
		}
		sessionStorage.clear();
		onload();
	}

	dialog = $("#dialog-form").dialog({
		autoOpen: false,
		height: 400,
		width: 350,
		modal: true,
		buttons: {
			"connect": connectUser,
			Cancel: function () {
				dialog.dialog("close");
			},
		},
		close: function () {
			form[0].reset();
			allFields.removeClass("ui-state-error");
		},
	});

	form = dialog.find("form").on("submit", function (event) {
		event.preventDefault();
		connectUser();
	});

	$("#login-icone")
	.button()
	.on("click", function () {
		dialog.dialog("open");
	});

	$("#logout-icone")
	.button()
	.on("click", disconnectUser);
});

/**
 * Filter wines via select value
 */
function filter(){
	//Define last action
	lastAction='filter';
	//remove search input
	document.getElementById('inputSearch').value="";
	//filter by country
	const selectCountry = document.getElementById("selectCountry");
	const selectedCountry=selectCountry.options[selectCountry.selectedIndex].value;
	const selectYear = document.getElementById("selectYear");
	const selectedYear=selectYear.options[selectYear.selectedIndex].value;

	//case when the user want to filter by country and year
	if(selectedCountry!='Country'&&selectedYear!='Year'){
		selected = showWines(wines.filter(element => element.country == selectedCountry && element.year == selectedYear));
	}
	//case when the user want to filter only by year
	else if(selectedCountry=='Country'&&selectedYear!='Year'){
		selected = showWines(wines.filter(element => element.year == selectedYear));
	}
	//case when the user want to filter only by country
	else if(selectedCountry!='Country'&&selectedYear=='Year'){
		selected = showWines(wines.filter(element => element.country == selectedCountry));
	}
	else{

		showWines(wines);
	}

}

/**
 * Sort wines list in normal state or after filter, search, etc...
 */
function sortBy(){
	const selectSort = document.getElementById('selectSort');
	const selectedSort=selectSort.options[selectSort.selectedIndex].value;
	sortName=selectedSort;
	wines = sort(wines);
	//allows the sort even when the wines are filtered or searched
	if(lastAction=='filter'){
		filter();
	}else if(lastAction=='search'){
		search();
	}
}

/**
 * Sort wines list
 * @param {Object[]} wines - The list of wines to sort
 */
function sort(wines){
	//sort by year
	if(sortName=='Year'){
		return wines.sort((a, b) => a.year !== b.year ? a.year < b.year ? -1 : 1 : 0);
	}
	//sort by grapes
	else if(sortName=='Grapes'){
		return wines.sort((a, b) => a.grapes !== b.grapes ? a.grapes < b.grapes ? -1 : 1 : 0);
	}
	//sort by name
	else{
		return wines.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0);
	}
}

/**
 * Get all years from wines list to fill in select values
 */
function getAllYears(){
	document.getElementById('selectYear').innerHTML='<option value="Year" selected>Year</option>';
	const allYears = document.getElementById('selectYear');
	let setYear=new Set();
	let arrayYears;

	//creation of a set to remove duplicates
	for(let i=0;i<wines.length;i++){
		setYear.add(wines[i]['year']);
	}
	//transforming the set into an array to use the sort() function
	arrayYears = Array.from(setYear);
	arrayYears.sort();

	//browse the list to add appropriate option values
	for (let item of arrayYears){
		allYears.options[allYears.options.length] = new Option(item, item);
	}


}

/**
 * Get all countries from wines list to fill in select values
 */
function getAllCountries(){
	document.getElementById('selectCountry').innerHTML='<option value="Country" selected>Country</option>';

	const allCountries = document.getElementById('selectCountry');
	let setCountry=new Set();
	let arrayCountries;

	//creation of a set to remove duplicates
	for(let i=0;i<wines.length;i++){
		setCountry.add(wines[i]['country']);
	}
	//transforming the set into an array to use the sort() function
	arrayCountries = Array.from(setCountry);
	arrayCountries.sort();

	//browse the list to add appropriate option values
	for (let item of arrayCountries){
		allCountries.options[allCountries.options.length] = new Option(item, item);
	}
}

/**
 * Search wines through names
 */
function search(){
	//define last action
	lastAction='search';
	//Create searchResult array
	const inputSearch = document.getElementById("inputSearch").value;
	searchResult=[];
	wines.forEach(function(wine){
		if(wine.name.includes(inputSearch.toUpperCase())){
			searchResult.push(wine);
		}
	});
	//display array
	showWines(searchResult);
	//Removes filter values
	document.getElementById("selectYear").value="Year";
	document.getElementById("selectCountry").value="Country";
}

/**
 * Show buttons to add user pictures
 */
function addPictures(){
	document.getElementById("uploadHide").style.display = "block";
}

/**
 * Upload user's wine pictures
 */
function uploadPictures(){

	let idWine = document.getElementById('idWine').getAttribute('data-id');
	const frmUpload = document.forms["frmUpload"];
	const dataUpload = new FormData(frmUpload);

	//Pour uploader une photo:
	let pictureSelect = document.getElementById('upload');
	let picturesList = pictureSelect.files[0];
	//alert(picturesList.name);
	dataUpload.getAll(picturesList);

	const xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (this.status === 200) {
			alert("Upload réussi !");
			document.getElementById("uploadHide").style.display = "none";
			showWine(idWine);
		} else {
			alert("Vous avez atteint le nombre de photo maximal pour ce vin (max 3 ajouts possibles)");
		}
	}

	xhr.onerror = function () {
		if (this.status === 404) {

			alert("Une erreur est survenue, la photo n'a pu être uploader");
		}
	};

	xhr.open("POST", apiUrl +'/wines/' + idWine + '/'+ 'pictures', true);
	xhr.setRequestHeader("Authorization", "Basic " + btoa(sessionStorage.getItem("user") + ":" + sessionStorage.getItem("pass")));
	xhr.send(dataUpload);

}

/**
 * Delete picture
 */
function deletePicture(){
	//This is the picture id of the image selected via the carousel

	if(confirm('Souhaitez-vous vraiment supprimer cette photo ?')){
		pictureId = $('#carousel li.active').attr("data-id");
		let idWine = document.getElementById('idWine').getAttribute('data-id');

		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			if (this.status === 200) {

				alert("Suppression réussie !");
				showWine(idWine);
			}
		}

		xhr.onerror = function () {
			if (this.status === 404) {

				alert("Une erreur est survenue lors de la suppression de la photo !");
			}
		};

		xhr.open("DELETE", apiUrl +'/wines/' + idWine + '/pictures/'+ pictureId, true);
		xhr.setRequestHeader("Authorization", "Basic " + btoa(sessionStorage.getItem("user") + ":" + sessionStorage.getItem("pass")));
		xhr.send();
	}
}

/**
 * Delete a wine
 */
function deleteWine() {
	if (confirm("Voulez-vous vraiment supprimer ce vin ?")) {
		let info;
		const idWine = document.getElementById('idWine').value;
		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			if (this.status === 200) {
				let id = document.getElementById("idWine").value;
				let wine = wines.find((element) => element.id == id);
				wines.splice(wines.indexOf(wine), 1);
				info = "Le vin a bien été supprimé";
				showWines(wines);
			}
		};

		xhr.onerror = function () {
			if (this.status === 404) {
				//console.log('error');
				info = "Une erreur est survenue, le vin n'a pas pu être supprimé";
			}
		};
		xhr.open("DELETE", apiUrl +'/wines/' + idWine, true);
		xhr.setRequestHeader("Authorization", "Basic " + btoa(sessionStorage.getItem("user") + ":" + sessionStorage.getItem("pass")));
		xhr.send();
	}
}

/**
 * Autocomplete search field via JQueryUI
 */
function autocomplete() {
	$( "#inputSearch" ).autocomplete({
		source: availableTags
	});
}

/**
 * Allows to add or update a wine
 */
function saveWine() {

	const data = new FormData(); //Récupération des données du formulaire

	//Ajout des données du vin
	const idWine = document.getElementById("idWine").value;
	data.append("idWine", idWine);
	const name = document.getElementById("name").value;
	data.append("name", name);
	const grapes = document.getElementById("grapes").value;
	data.append("grapes", grapes);
	const country = document.getElementById("country").value;
	data.append("country", country);
	const region = document.getElementById("region").value;
	data.append("region", region);
	const year = document.getElementById("year").value;
	data.append("year", year);
	const price = document.getElementById("price").value;
	data.append("price", price);
	const capacity = document.getElementById("capacity").value;
	data.append("capacity", capacity);
	const color = document.getElementById("color").value;
	data.append("color", color);

	//Ajout des données extra si existantes
	let extra;
	const promo = document.getElementById("promo").value;
	const bio = document.getElementById("bio").checked;
	if (bio || promo != "") {
		if (bio && promo != "") {
			extra = { bio: true, promo: promo/100 };
		} else if (bio && promo == "") {
			extra = { bio: true };
		} else {
			extra = { promo: true };
		}
	}
	data.append("extra", extra);
	console.log(data);

	/** Ouverture et envois de la requète */
	const xhr = new XMLHttpRequest();
	//Fonction de rappel
	xhr.onload = function(){
		if (this.readyState === 4 && this.status === 200) {
			//Requête terminée et prête
			//Affichage selon les méthodes
			if (HTTPMethod == "POST") {
				alert("Le vin a bien été créé.");
			} else {
				alert("Le vin a bien été modifié.");
			}
		} else {
			//gestion des erreurs selon la méthode
			if (HTTPMethod == "POST") {
				alert("une erreur est survenue, le vin na pas été créé.");
			} else {
				alert("une erreur est survenue, le vin na pas été modifié.");
			}
		}
	};
	let requestUrl;
	if (HTTPMethod == "POST") {
		requestUrl=apiUrl+'/wines';
	} else if(HTTPMethod =='PUT'){
		id = document.getElementById("idWine").value;
		requestUrl =apiUrl + '/wines/' + id;
	}
	//Envoie de la requete au serveur
	xhr.open(HTTPMethod, requestUrl, true);
	xhr.setRequestHeader("Authorization", "Basic " + btoa(sessionStorage.getItem("user") + ":" + sessionStorage.getItem("pass")));
	xhr.send(data);
}

/**
 * Clear wine inputs and select request method
 */
function newWine() {
	$(".error").slideUp();

	HTTPMethod = "POST";

	document.getElementById("promoHide").style.display = "block";
	document.getElementById("bioHide").style.display = "block";

	document.getElementById("name").value = "";
	document.getElementById("grapes").value = "";
	document.getElementById("country").value = "";
	document.getElementById("region").value = "";
	document.getElementById("year").value = "";
	document.getElementById("price").value = "";
	document.getElementById("color").value = "";
	document.getElementById("capacity").value = "";
	document.getElementById("bio").type = "checkbox";
	document.getElementById("promo").value = "";
	document.getElementById("carousel-indicators").innerHTML='';
	document.getElementById("carousel-inner").innerHTML = '<img src="' + pics + 'generic.jpg' + '" alt="generic wine picture">';
	document.getElementById("comments").innerHTML = '';
	document.getElementById("notes").value='';
	document.getElementById("notes").readOnly = false;

	//Hide right pannel
	$("#btnLike, #btnAddPictures, #btnDelPictures, #wineLikesCount, #addComment").hide();
}

/**
 * Validate form data to add a wine
 */
function validateForm() {
	let msg = "";
	//Name
	if (document.getElementById("name").value == "") {
		msg = "Please enter a wine name";
		document.getElementById("nameError").innerHTML = msg;
	} else {
		document.getElementById("nameError").innerHTML = "";
	}

	//Grapes
	if (document.getElementById("grapes").value == "") {
		msg = "Please enter grapes type";
		document.getElementById("grapesError").innerHTML = msg;
	} else {
		document.getElementById("grapesError").innerHTML = "";
	}

	//Region
	if (document.getElementById("region").value == "") {
		msg = "Please enter a region";
		document.getElementById("regionError").innerHTML = msg;
	} else {
		document.getElementById("regionError").innerHTML = "";
	}

	//Country
	if (document.getElementById("country").value == "") {
		msg = "Please enter a country";
		document.getElementById("countryError").innerHTML = msg;
	} else {
		document.getElementById("countryError").innerHTML = "";
	}

	//Year
	const year = document.getElementById("year").value;
	let currentYear = new Date().getFullYear();
	if (isNaN(parseFloat(year)) ||
	year.value == "" ||
	parseFloat(year) < 1500 ||
	parseFloat(year) > currentYear){
		msg = "Please enter a valid year";
		document.getElementById("yearError").innerHTML = msg;
	} else {
		msg="";

	}

	//Capacity
	const capacity = document.getElementById("capacity").value;
	if (isNaN(parseFloat(capacity)) || capacity.value == "") {
		msg = "Please enter a capacity in litter";
		document.getElementById("capacityError").innerHTML = msg;
	} else {
		document.getElementById("capacityError").innerHTML = "";
	}

	//Price
	const price = document.getElementById("price").value;
	if (isNaN(parseFloat(price)) || price.value == "") {
		msg = "Please enter a valid price";
		document.getElementById("priceError").innerHTML = msg;
	} else{
		document.getElementById("priceError").innerHTML = "";
	}

	//Color
	const color = document.getElementById("color").value.toLowerCase();
	const existingWineColors = ['gray','orange','red','white','rosé','tawny','yellow','burgundy','sangria','ox blood'];
	if(!existingWineColors.includes(color)){
		msg = "Please enter a valid color. Here is a list:";
		existingWineColors.forEach(function(wineColor){
			msg+= " '"+wineColor+"' - ";
		});
		document.getElementById("colorError").innerHTML = msg;
	} else {
		document.getElementById("colorError").innerHTML = "";
	}

	//Promo
	const promo = document.getElementById("promo").value;
	if (promo != "") {
		if (isNaN(parseFloat(promo))) {
			msg = "Please enter a valid promotion";
			document.getElementById("promoError").innerHTML = msg;
		} else {
			document.getElementById("promoError").innerHTML = "";
		}
	}
	$(".error").slideDown();
	if (msg === "") {
		saveWine();
	}
}

/**
 * Validate picture's formats and number
 */
function validateAddPictures(){
	let msgError = "";
	let pictures = document.getElementById("upload");


	if(pictures.files.length == ""){
		msgError = "Please upload a max 200 000 size .jpg or .jpeg file";
		document.getElementById("uploadError").innerHTML = msgError;

	} else if(pictures.files.length != ""){

		if(pictures.size > frmUpload.MAX_FILE_SIZE.value){
			msgError = "Please upload a max 200 000 size file";
			document.getElementById("uploadError").innerHTML = msgError;

		} else if(pictures.accept != ".jpeg, .jpg"){      //condition n'est peut-être pas nécessaire car avec la précision dans le formulaire, cela nous limite à la selection des fichiers jpj uniquement.
			msgError = "Please upload at least one .jpeg file";
			document.getElementById("uploadError").innerHTML = msgError;

		} else {
			document.getElementById("uploadError").innerHTML = "";

			uploadPictures();
		}

	}
}

/**
 * Request and show likes
 * @param {number} id - The id of the wine for which we want the number of likes
 */
function getLikes(id){
	//Show user blue liked button if already liked
	const likeButton=document.getElementById('btnLike');
	if(userLikes.includes(id)){
		likeButton.className = 'likeButtonLiked';
	}else{
		likeButton.className = 'likeButton';
	}
	//Request and show wines like
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let data = xhr.responseText;
			let likes = JSON.parse(data);
			document.getElementById("wineLikesCount").innerHTML=likes.total +" user(s) like this wine.";
		}
	};
	xhr.open("GET",apiUrl+'/wines/'+id+'/likes-count',true);
	xhr.send();
}


/**
 * Show selectable wines list
 * @param {Object[]} wines - The list of wines to show
 */
function showWines(wines) {
	//Add Wines to List
	const emptyList = document.getElementById('winesList');
	let listContent = '';
	Object.keys(wines).forEach(function(key) {
		listContent += '<li data-id="'+wines[key].id+'" class="list-group-item list-group-item-action">'+wines[key].name+'</li>';
	});
	emptyList.innerHTML = listContent;

	//Add Event Listenners to each wine
	const liList = emptyList.querySelectorAll('li');
	for(li of liList){
		li.addEventListener('click',function() {
			showWine(this.dataset.id, wines);
		});
	}
	if(wines.length>0){
		$('#addUpdateWine').slideDown();
		showWine(wines[0].id);
	}else{
		$('#addUpdateWine').slideUp();
	}
}

/**
 * Show the comment section 'modify and cancel' buttons + comment in textarea
 * @param {boolean} hide - Hide or show value
 * @param {string} [comment] - Original comment to show
 */
function hideOrShowCommentAndButtons(hide, comment){
	if(hide){
		document.getElementById('btnComment').style.display='block';
		document.getElementById('btnUpdateComment').style.display='none';
		document.getElementById('btnCancelComment').style.display='none';
		document.getElementById('comment').value='';
	}else{
		document.getElementById('btnComment').style.display='none';
		document.getElementById('btnUpdateComment').style.display='inline-block';
		document.getElementById('btnCancelComment').style.display='inline-block';
		document.getElementById('comment').value= comment!=undefined ? comment : '';
	}
}

/**
 * Show single wine info
 * @param {number} id - Id of the wine
 */
function showWine(id) {
	//Show comment section and other buttons if user is connected and after fields were clear by newWine()
	if(sessionStorage.getItem('user')){
		$("#addComment").show();
	}
	$("#btnLike, #btnAddPictures, #btnDelPictures, #wineLikesCount").show();
	document.getElementById("bio").setAttribute('type','text');
	document.getElementById("notes").readOnly = true;
	//clear error messages
	$(".success, .error").slideUp('slow');
	hideOrShowCommentAndButtons(true);

	//define HTTPMethod for wine update as PUT
	HTTPMethod = "PUT";

	const wine = wines.find((element) => element.id == id);

	//Show common wine properties
	document.getElementById("idWine").innerHTML ="Id: " + wine.id;;
	document.getElementById("idWine").setAttribute('data-id',  wine.id);
	document.getElementById("name").value = wine.name;
	document.getElementById("grapes").value = wine.grapes;
	document.getElementById("country").value = wine.country;
	document.getElementById("region").value = wine.region;
	document.getElementById("year").value = wine.year;
	document.getElementById("notes").value = wine.description;
	document.getElementById("price").value = wine.price;

	//Show capacity IF given
	if (wine.capicity === "0") {
		document.getElementById("capacity").value = "Not given";
	} else {
		document.getElementById("capacity").value = wine.capacity / 100 + "L";
	}
	//Show color IF given
	if (wine.color == "") {
		document.getElementById("color").value = "Not given";
	} else {
		document.getElementById("color").value = wine.color;
	}

	//Show extra properties of the wine
	if (wine.extra) {
		let extra = JSON.parse(wine.extra);
		if (extra.bio) {
			document.getElementById("bioHide").style.display = "block";
			document.getElementById("bio").value = "Oui";
		}
		if (extra.promo) {
			document.getElementById("promoHide").style.display = "block";
			document.getElementById("promo").value = extra.promo * 100 + "%";
		}
	} else if (wine.extra === null) {
		document.getElementById("bioHide").style.display = "none";
		document.getElementById("promoHide").style.display = "none";
	}

	//Get and show wine Likes
	getLikes(id);

	//Get and show pictures
	getPictures(wine);

	//Get and show comments
	getComments(wine);
}

/**
 * Request and show comments
 * @param {Object} wine - A Wine object
 */
function getComments(wine){
	//Hide modify or cancel button and empty comment box
	hideOrShowCommentAndButtons(true);
	//Create begining of comment section
	document.getElementById("comments").innerHTML ='<div class="card-header">Comments</div>';

	//Gather wine comments from API
	const xhr = new XMLHttpRequest();
	xhr.onload = function (){
		if(xhr.status===200) {
			let data = xhr.responseText;
			let JSONcomments = JSON.parse(data);
			let div='';
			//Loop through wine comments
			for (let prop in JSONcomments) {
				//If the comment is of the user, show comment + delete and modify buttons with commentId in data-id
				if(parseInt(JSONcomments[prop].user_id) === parseInt(sessionStorage.getItem('id'))){
					let btnDel= '<button name="btnDeleteComment" data-id="'+JSONcomments[prop].id+'" type="button" class="btn btn-link btn-sm mr-2">Delete</button>';
					let btnModify= '<button name="btnModifyComment" data-id="'+JSONcomments[prop].id+'" type="button" class="btn btn-link  btn-sm">Modify</button>';
					div = '<div class="card mb-2"><div class="card-body"><p id="'+JSONcomments[prop].id+'">' + JSONcomments[prop].content + '</p>'+btnDel +btnModify+'</div></div>';
					document.getElementById("comments").innerHTML += div;
					//Else just show the comment without buttons
				}else{
					div = '<div class="card mb-2"><div class="card-body"><p>' + JSONcomments[prop].content + '</p></div></div>';
					document.getElementById("comments").innerHTML += div;
				}
			}
			//Add event listenners to delete and modify buttons
			btnDel = document.getElementsByName('btnDeleteComment');
			btnModify = document.getElementsByName('btnModifyComment');
			//Since there are as many delete and modify buttons, only loop once
			for (let i=0; i<btnDel.length; i++){
				btnModify[i].addEventListener('click', function() {
					//Give commentId thourgh data-id attribute
					modifyComment(wine, btnModify[i].getAttribute('data-id'));
				});
				btnDel[i].addEventListener('click', function() {
					deleteComment(wine, btnDel[i].getAttribute('data-id'));
				});
			}
		}else{
			alert('Ajax error with get comments : ' +xhr.responseText);
		}
	};
	xhr.open("GET", apiUrl + '/wines/' + wine.id + '/comments', true);
	xhr.send();
}

/**
 * Comment a wine
 */
function comment(){

	//retrieve wine and comment
	const id= document.getElementById('idWine').getAttribute('data-id');
	const wine = wines.find((element) => element.id == id);
	const comment= document.getElementById('comment').value;

	//check if comment exists and is long enough
	if(comment.length<255 && comment.length>0 ){
		const xhr = new XMLHttpRequest();

		//Commentaire JSONifié à envoyer
		let toSend={content:comment};
		toSend=JSON.stringify(toSend);

		console.log(apiUrl+'/wines/'+id+'/comments', sessionStorage.getItem("user") + ":" + sessionStorage.getItem("pass"), toSend)

		xhr.onload = function(){
			//Si ajout du commentaire, affiché message succès et vider le textarea
			if(xhr.status===200){
				msg="Commentaire ajouté";
				document.getElementById('commentMsg').innerHTML = msg;
				$("#commentMsg").slideDown();
				getComments(wine);
				//Sinon afficher l'erreur ajax
			}else{
				alert("requête post comment Ajax: " + xhr.responseText);
			}
		};
		//HTTP request
		xhr.open('POST', apiUrl+'/wines/'+id+'/comments', true);
		xhr.setRequestHeader("Authorization", "Basic " + btoa(sessionStorage.getItem("user") + ":" + sessionStorage.getItem("pass")));
		xhr.send(toSend);

	}else{
		//Si trop long affiché message erreur
		msg = "Please enter a comment under 255 characters";
		document.getElementById("commentError").innerHTML = msg;
		$("#commentError").slideDown();
	}
}

/**
 * Delete comment
 * @param {Object} wine - A Wine object
 * @param {number} commentId - Id of the comment
 */
function deleteComment(wine, commentId){

	if(confirm("Voulez-vous supprimer ?")){
		const xhr = new XMLHttpRequest();
		xhr.onload = function (){
			if(xhr.status === 200){
				//Show success message and show new comments list
				let msg = ("Comment deleted");
				document.getElementById("commentMsg").innerHTML=msg;
				$('#commentMsg').slideDown();
				getComments(wine);
			}else{
				alert("Delete Comment ajax error : " +xhr.responseText);
			}
		};
		//Http request with Authorization
		xhr.open('DELETE', apiUrl+ '/wines/' + wine.id +'/comments/' + commentId, true);
		xhr.setRequestHeader('Authorization', 'Basic ' +btoa(sessionStorage.getItem("user") + ":" + sessionStorage.getItem("pass")));
		xhr.send();
	}
}

/**
 * Modify comment
 * @param {Object} wine - A Wine object
 * @param {number} commentId - Id of the comment
 */
function modifyComment(wine, commentId){

	//Show comment and modify and cancel buttons
	const comment=document.getElementById(commentId).innerHTML;
	hideOrShowCommentAndButtons(false, comment);
	//Create listener on update
	document.getElementById('btnUpdateComment').addEventListener('click', function(){
		const newComment=document.getElementById("comment").value;
		if(newComment.length<255 && newComment.length>0 ){
			//Create http request and comment in JSON to send
			const xhr = new XMLHttpRequest();
			let toSend={"content":newComment};
			toSend=JSON.stringify(toSend);

			xhr.onload = function(){
				if(xhr.status===200){
					//Show success message and show new wines list + hide modify and cancel buttons
					let msg="Comment modified";
					document.getElementById("commentMsg").innerHTML=msg;
					$('#commentMsg').slideDown();
					hideOrShowCommentAndButtons(true);
					getComments(wine);
				}else{
					alert('Ajax error on PUT comment:' +xhr.responseText);
				}
			};

			xhr.open('PUT', apiUrl + '/wines/' + wine.id + '/comments/' + commentId);
			xhr.setRequestHeader('Authorization', 'Basic '+ btoa(sessionStorage.getItem("user") + ":" + sessionStorage.getItem("pass")));
			xhr.send(toSend);
		}else{
			//Message empty or too long, error message
			document.getElementById('comment').value='';
			msg = "Please enter a comment under 255 characters";
			document.getElementById("commentError").innerHTML = msg;
			$("#commentError").slideDown();
		}
	});

	document.getElementById('btnCancelComment').addEventListener('click', function(){
		showWine(wine.id);
	});

}

/**
 * Like or dislike a wine
 */
function like(){
	//prevents page from reloading
	event.preventDefault();

	const xhr = new XMLHttpRequest();
	const id=document.getElementById('idWine').getAttribute('data-id');

	//Choose if like or unlike wine
	let like=false;
	if(!userLikes.includes(id)){
		like=true;
	}
	let toSend={like:like};
	toSend = JSON.stringify(toSend);

	//Request handler
	xhr.onload = function () {
		//Success : Add wine to likedWines and show wine.
		if (this.status === 200) {
			if(like){
				userLikes.push(id);
			}else{
				let index = userLikes.indexOf(id);
				userLikes.splice(index, 1);
			}
			getLikes(id);
		} else{
			alert(xhr.responseText);
		}
	};
	xhr.open("PUT",apiUrl+'/wines/'+id+'/like',true);
	xhr.setRequestHeader("Authorization", "Basic " + btoa(sessionStorage.getItem("user") + ":" + sessionStorage.getItem("pass")));
	xhr.send(toSend);
}

/**
 * Request and show pictures
 * @param {Object} wine - A Wine object
 */
function getPictures(wine){
	document.getElementById("carousel-inner").innerHTML='';
	const xhr = new XMLHttpRequest();

	//Add the image of the API
	let div = '<div class="carousel-item active"><img  src="' + pics + wine.picture + '" alt="' + wine.name + ' picture"></div>';
	document.getElementById("carousel-inner").innerHTML = div;

	xhr.onload = function () {
		if(xhr.status===200) {

			let data = xhr.responseText;
			let JSONpictures = JSON.parse(data);

			//create list for carousel indicators
			const carouselIndicators = document.getElementById("carousel-indicators");
			let count=1;
			let li = '<li data-target="#carousel" data-slide-to="0" class="active"></li>';;
			for (let prop in JSONpictures) {
				li += '<li data-target="#carousel" data-id="'+JSONpictures[prop].id+'" data-slide-to="'+count+'"></li>';
				count++;;
			}
			carouselIndicators.innerHTML =li;

			//Add user images to carousel
			for (let prop in JSONpictures) {
				div +='<div class="carousel-item"><img  src="'+ uploads +JSONpictures[prop].url+'" alt"' +wine.name+ ' picture"></div>';
			}
			document.getElementById("carousel-inner").innerHTML = div;
			$('.carousel').carousel('pause');
		}
	};

	xhr.open("GET",apiUrl+'/wines/'+wine.id+'/pictures',true);
	xhr.setRequestHeader("Authorization", "Basic " + btoa(sessionStorage.getItem("user") + ":" + sessionStorage.getItem("pass")));
	xhr.send();
}

/**
 * Get wines from the API and then display them
 */
function getWines(){
	//Data gathering from the API
	const xhr = new XMLHttpRequest();
	let	winesArray=[];
	xhr.onreadystatechange = function() {
		if(xhr.readyState==4 && xhr.status==200) {
			let data = xhr.responseText;
			wines = JSON.parse(data);
			for (let prop in wines) {
				//fill the array with our wines
				winesArray.push(wines[prop]);
				//Create tags for autocompletion on search
				availableTags.push(wines[prop].name.toLowerCase());
			}
			winesArray.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0);
			wines = winesArray;
			showWines(wines);
			//call the functions allowing the filter/sort dynamically
			getAllYears();
			getAllCountries();

		}
	};
	xhr.open('GET',apiUrl+'/wines',true);
	xhr.send();
}

/**
 * Fill array with the likes of the user once
 */
function getUserLikes(){
	//Data gathering from the API to have an array of the users likes
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState==4 && xhr.status==200) {
			let data = xhr.responseText;
			let wines = JSON.parse(data);
			for (let prop in wines) {
				userLikes.push(wines[prop].id);
			}
		}
	};
	xhr.open('GET',apiUrl+'/users/'+sessionStorage.getItem('id')+'/likes/wines',true);
	xhr.send();
}


/******************* Main ******************/
/**
 * Main function which gathers wine from the api and handles events and connection
 */
window.onload = function() {

	//Main functions
	getWines();
	autocomplete();

	//Buttons and inputs
	const btnSearch = document.getElementById('btnSearch');
	const btnFilter = document.getElementById('btnFilter');
	const btnSortBy=document.getElementById('btnSortBy');
	const input = document.getElementById("inputSearch");


	//Events creation
	btnSearch.addEventListener('click', search);
	btnFilter.addEventListener('click', filter);
	btnSortBy.addEventListener('click', sortBy);
	input.addEventListener("keydown", function(event) {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
			event.preventDefault();
			search();
		}
	});
	btnDelPictures.addEventListener('click', deletePicture);

	//If user connected
	if (sessionStorage.getItem("user")){

		//TODO request users values to see if user and pass are valid else, sessionStorage.clear();
		/**
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				let data = xhr.responseText;
				let login = JSON.parse(data);
				alert('vous êtes connecté');
			} else {
				alert('Error !');
			}
		};
		xhr.open("GET", apiUrl + "/users", true);
		xhr.send();
		*/

		//Get connected user likes
		getUserLikes();
		//Gather button elements and add events related to connected user
		const btnNew = document.getElementById('btnNew');
		const btnSave = document.getElementById('btnSave');
		const btnDelete = document.getElementById('btnDelete');
		const btnLike=document.getElementById('btnLike');
		const btnAddPictures = document.getElementById('btnAddPictures');
		const btnUpload = document.getElementById('btnUpload');
		const addComment = document.getElementById("addComment");

		btnNew.addEventListener('click', newWine);
		btnSave.addEventListener('click',validateForm);
		btnDelete.addEventListener('click', deleteWine);
		btnLike.addEventListener('click', like);
		btnAddPictures.addEventListener('click', addPictures);
		btnUpload.addEventListener('click', validateAddPictures);
		btnComment.addEventListener('click', comment);

		//Hide login button and show log-out
		document.getElementById("login-icone").style.display = 'none';
		document.getElementById("logout-icone").style.display = 'block';

		//Show elements that were hidden
		let elements = document.getElementsByClassName('hideConnect');
		for(let i = 0; i < elements.length; i++) {
			elements[i].style.display = 'block';
		}
		document.getElementById("carousel-indicators").style.display = 'flex';
	}

	var ctx = document.getElementById("graphvin").getContext("2d");
	window.myPie = new Chart(ctx, config);
};

// Graphique reprenant l'origine des vins

window.chartColors = {
	red: 'rgb(50, 0, 32)',
	orange: 'rgb(128, 0, 32)',
	yellow: 'rgb(195, 0, 32)',
	green: 'rgb(250, 50, 50)',
	blue: 'rgb(149, 149, 149)'
};

Chart.defaults.global.tooltips.custom = function(tooltip) {
  // Tooltip Element
  var tooltipEl = document.getElementById('chartjs-tooltip');

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    var total = 0;

    // get the value of the datapoint
    var value = this._data.datasets[tooltip.dataPoints[0].datasetIndex].data[tooltip.dataPoints[0].index].toLocaleString();

    // calculate value of all datapoints
  this._data.datasets[tooltip.dataPoints[0].datasetIndex].data.forEach(function(e) {
      total += e;
    });

    // calculate percentage and set tooltip value
    tooltipEl.innerHTML = '<h1>' + (value / total * 100) + '%</h1>';
  }

  // calculate position of tooltip
  var centerX = (this._chartInstance.chartArea.left + this._chartInstance.chartArea.right) / 2;
  var centerY = ((this._chartInstance.chartArea.top + this._chartInstance.chartArea.bottom) / 2);

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = centerX + 'px';
  tooltipEl.style.top = centerY + 'px';
  tooltipEl.style.fontFamily = tooltip._fontFamily;
  tooltipEl.style.fontSize = tooltip.fontSize;
  tooltipEl.style.fontStyle = tooltip._fontStyle;
  tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
};

var config = {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [5, 3, 1, 1, 1],
      backgroundColor: [
        window.chartColors.red,
        window.chartColors.orange,
        window.chartColors.yellow,
        window.chartColors.green,
        window.chartColors.blue,
      ],
    }],
    labels: [
      "USA", //RED
      "France", //Orange
      "Argentine", //Yellow
      "Espagne", //Green
      "Italy", //Blue
    ]
  },
  options: {
    responsive: true,
    legend: {
      display: true,
      position: "bottom",
      labels: {
        padding: 20
      },
    },
    tooltips: {
      enabled: false,
    }
  }
};
