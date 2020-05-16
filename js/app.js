//Variables

let wines;
let method;
let info;
let picturesFiles;
let sortName='';

const user = "ced";
const pass = "123";
const apiUrl = "http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines";


//Functions
function filter(){
	//filter by country
	let selectCountry = document.getElementById("selectCountry");
	let selectedCountry=selectCountry.options[selectCountry.selectedIndex].value;
	let selectYear = document.getElementById("selectYear");
	let selectedYear=selectYear.options[selectYear.selectedIndex].value;


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

function sortBy(){
	let selectSort = document.getElementById('selectSort');
	let selectedSort=selectSort.options[selectSort.selectedIndex].value;
	sortName=selectedSort;
	//allows the sort even when the wines are filtered
	filter();
}

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

function getAllYears(){
	let allYears = document.getElementById('selectYear');
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
		allYears = document.getElementById('selectYear');
		allYears.options[allYears.options.length] = new Option(item, item);
	}


}

function getAllCountries(){
	let allCountries = document.getElementById('selectCountry');
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
		allCountries = document.getElementById('selectCountry');
		allCountries.options[allCountries.options.length] = new Option(item, item);
	}

}


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

function addPictures(){
	document.getElementById("uploadHide").style.display = "block";
}


function uploadPictures(){

	let idWine = document.getElementById('idWine').value;
	const frmUpload = document.forms["frmUpload"];
	const dataUpload = new FormData(frmUpload);

	for(file of upload.files){
		console.log(file);
		dataUpload.append('picture', 'file');
	}


	picturesFiles = dataUpload.getAll('picture');


	const xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (this.status === 200) {

			alert("Upload réussi !");
		}
	}

	xhr.onerror = function () {
		if (this.status === 404) {

			alert("Une erreur est survenue, la photo n'a pu être uploader");
		}
	};

	xhr.open("POST", apiUrl +'/' + idWine + '/'+ picturesFiles, true);
	xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
	xhr.send(dataUpload);
}


function deleteWine() {
  if (confirm("Voulez-vous vraiment supprimer ce vin ?")) {
    let idWine = document.getElementById('idWine').value;
    let wineSelected = wines.find((element) => element.id == idWine);
    let info;
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
    xhr.open("DELETE", apiUrl +'/' + idWine, true);
    xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
    xhr.send();
  }
}

/**
 * Fonction permettant de créer et modifier un vin
 * @author Simon
 * @author Rachida
 */
function saveWine() {

	const data = new FormData(); //Récupération des données du formulaire

	//Ajout des données du vin
	let idWine = document.getElementById("idWine").value;
	data.append("idWine", idWine);
	let name = document.getElementById("name").value;
	data.append("name", name);
	let grapes = document.getElementById("grapes").value;
	data.append("grapes", grapes);
	let country = document.getElementById("country").value;
	data.append("country", country);
	let region = document.getElementById("region").value;
	data.append("region", region);
	let year = document.getElementById("year").value;
	data.append("year", year);
	let price = document.getElementById("price").value;
	data.append("price", price);
	let capacity = document.getElementById("capacity").value;
	data.append("capacity", capacity);
	let color = document.getElementById("color").value;
	data.append("color", color);

	//Ajout des données extra si existantes
	let extra;
	let promo = document.getElementById("promo").value;
	let bio = document.getElementById("bio").checked;
	if (bio || promo != "") {
		if (bio && promo != "") {
			extra = { bio: true, promo: promo / 100 };
		} else if (bio && promo == "") {
			extra = { bio: true };
		} else {
			extra = { promo: true };
		}
	}
	data.append("extra", extra);

	/** Ouverture et envois de la requète */
	const xhr = new XMLHttpRequest();
	//Fonction de rappel
	xhr.onload = function(){
		if (this.readyState === 4 && this.status === 200) {
			//Requête terminée et prête
			//Affichage selon les méthodes
			if (method == "POST") {
				alert("Le vin a bien été créé.");
			} else {
				alert("Le vin a bien été modifié.");
			}
		} else {
			//gestion des erreurs selon la méthode
			if (method == "POST") {
				alert("une erreur est survenue, le vin na pas été créé.");
			} else {
				alert("une erreur est survenue, le vin na pas été modifié.");
			}
		}
	};
	let requestUrl;
    if (method == "POST") {
      requestUrl=apiUrl;
    } else if(method =='PUT'){
      id = document.getElementById("idWine").value;
      requestUrl =apiUrl + '/' + id;
    }
    //Envoie de la requete au serveur
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
    xhr.send(data);
}

function newWine() {

	$("p[name='error']").slideUp();
  //clearErrorMessages();

  method = "POST";

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
  document.getElementById("picture").alt ="";
  document.getElementById("picture").src ="";
}

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
  let year = document.getElementById("year").value;
  let currentYear = new Date().getFullYear();
  if (isNaN(parseFloat(year)) ||
	year.value == "" ||
	parseFloat(year) < 1500 ||
	parseFloat(year) > currentYear
  ) {
	msg = "Please enter a valid year";
	document.getElementById("yearError").innerHTML = msg;
	//$("#yearError").slideDown('slow');
  } else {
	  msg="";
	//$("#yearError").slideUp('slow');
  }

  //Capacity
  let capacity = document.getElementById("capacity").value;
  if (isNaN(parseFloat(capacity)) || capacity.value == "") {
	msg = "Please enter a capacity in litter";
	document.getElementById("capacityError").innerHTML = msg;
  } else {
	document.getElementById("capacityError").innerHTML = "";
  }

  //Price
  let price = document.getElementById("price").value;
  if (isNaN(parseFloat(price)) || price.value == "") {
	msg = "Please enter a valid price";
	document.getElementById("priceError").innerHTML = msg;
  } else {
	document.getElementById("priceError").innerHTML = "";
  }

  //Color
  let color = document.getElementById("color").value.toLowerCase();
  let existingWineColors = ['gray','orange','red','white','rosé','tawny','yellow','burgundy','sangria','ox blood'];
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
  let promo = document.getElementById("promo").value;
  if (promo != "") {
	if (isNaN(parseFloat(promo))) {
	  msg = "Please enter a valid promotion";
	  document.getElementById("promoError").innerHTML = msg;
	} else {
	  document.getElementById("promoError").innerHTML = "";
	}
  }
	$("p[name='error']").slideDown();
  if (msg === "") {
    saveWine();
  }
}



function validateAddPictures(){
	let msgError = "";
	let pictures = document.getElementById("upload");


	if(pictures.files.length == " "){
	  msgError = "Please upload at least one max 200 000 size .jpg file";
	  document.getElementById("uploadError").innerHTML = msgError;

	} else if(pictures.files.length != ""){

	  if(pictures.size > frmUpload.MAX_FILE_SIZE.value){
		msgError = "Please upload at least one max 200 000 size file";
		document.getElementById("uploadError").innerHTML = msgError;

	  } else if(pictures.accept != ".jpg"){      //condition n'est peut-être pas nécessaire car avec la précision dans le formulaire, cela nous limite à la selection des fichiers jpj uniquement.
		msgError = "Please upload at least one .jpg file";
		document.getElementById("uploadError").innerHTML = msgError;

	  } else if(pictures.files.length > 3){
		msgError = "Please upload max 3 pictures";
		document.getElementById("uploadError").innerHTML = msgError;
	  }  else {
		document.getElementById("uploadError").innerHTML = "";
		uploadPictures();
	 }

	}
}



function showWines(wines) {

	//Add Wines to List
    const emptyList = document.getElementById('winesList');
    let listContent = '';

	wines = sort(wines);
	Object.keys(wines).forEach(function(key) {

		listContent += '<li data-id="'+wines[key].id+'" class="list-group-item list-group-item-action">'+wines[key].name+'</li>';

	});

    emptyList.innerHTML = listContent;

	//Add Event Listenners to each wine
    let liList = emptyList.querySelectorAll('li');

    for(li of liList){
        li.addEventListener('click',function() {
            showWine(this.dataset.id, wines);
        });
    }
	//used to add option values

	showWine(1);
}

/**
function clearErrorMessages() {
  // Clear error messages
  var cells = document.getElementsByName("error");
  for (let i = 0; i < cells.length; i++) {
    document.getElementsByName("error")[i].innerHTML = "";
  }
}
*/

function showWine(id) {
	//clear error messages
	$("p[name='error']").slideUp('slow');

	//define method for wine update as PUT
	method = "PUT";

	let wine = wines.find((element) => element.id == id);
	//Show common wine properties
	let docElement = document.getElementById("idWine");
	docElement.value = wine.id;
	docElement = document.getElementById("name");
	docElement.value = wine.name;
	docElement = document.getElementById("grapes");
	docElement.value = wine.grapes;
	docElement = document.getElementById("country");
	docElement.value = wine.country;
	docElement = document.getElementById("region");
	docElement.value = wine.region;
	docElement = document.getElementById("year");
	docElement.value = wine.year;
	docElement = document.getElementById("picture");
	docElement.alt = wine.name;
	docElement.src ="http://cruth.phpnet.org/epfc/caviste/public/pics/" + wine.picture;
	docElement = document.getElementById("notes");
	docElement.value = wine.description;
	docElement = document.getElementById("price");
	docElement.value = wine.price;
	docElement = document.getElementById("capacity");

	if (wine.capicity === "0") {
		docElement.value = "Not given";
	} else {
		docElement.value = wine.capacity / 100 + "L";
	}
	docElement = document.getElementById("color");
	if (wine.color == "") {
		docElement.value = "Not given";
	} else {
		docElement.value = wine.color;
	}

	//Show extra properties of the wine

	let extraFields = document.getElementById("extraFields");
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
    //extraFields.innerHTML = '';
	}

  /**
		//Go through each extra properties dynamically
		for (let [key, value] of Object.entries(extra)) {

			let extraAttribute = key;
			let extraValue = value;
			let extraLabel = key.charAt(0).toUpperCase() + key.slice(1);

			//Add a div, label and element for each one
			let div = document.createElement("div");
			div.className ="form-group";
			extraFields.appendChild(div);

			let label = document.createElement("LABEL");
			label.htmlFor = extraAttribute;
			label.innerHTML = extraLabel;

			let elem = document.createElement("input");
			elem.type = "text";
			elem.name = extraAttribute;
			elem.className = "form-control";
			elem.id = extraAttribute;
			if(extraAttribute="promo"){
				elem.value = extraValue*100 + "%";
			}else{
				elem.value = extraValue;
			}

			div.appendChild(label);
			div.appendChild(elem);
		}
		*/
}

//Main

window.onload = function() {
	console.log(1);
	//Data gathering from the API
	const xhttp = new XMLHttpRequest();
	let	winesArray=[];
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState==4 && xhttp.status==200) {
            let data = xhttp.responseText;
			wines = JSON.parse(data);
			for (let prop in wines) {
				winesArray.push(wines[prop]);
			}
			winesArray.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0);
            wines = winesArray;
            showWines(wines);

			//call the functions allowing the filter/sort dynamically
			getAllYears();
			getAllCountries();
        }
    };

    xhttp.open('GET',apiUrl,true);
    xhttp.send();
	console.log(2);



	//Buttons and inputs
	let btnSearch = document.getElementById('btnSearch');
	let btnNew = document.getElementById('btnNew');
	let btnSave = document.getElementById('btnSave');
	let btnDelete = document.getElementById('btnDelete');
	let btnFilter = document.getElementById('btnFilter');
	let btnSortBy=document.getElementById('btnSortBy');
	let btnAddPictures = document.getElementById('btnAddPictures');
	let btnUpload = document.getElementById('btnUpload');
	let input = document.getElementById("inputSearch");

	//Events creation
	btnSearch.addEventListener('click', search);
	btnNew.addEventListener('click', newWine);
	btnSave.addEventListener('click',validateForm);
	btnDelete.addEventListener('click', deleteWine);
	btnFilter.addEventListener('click', filter);
	btnSortBy.addEventListener('click', sortBy);
	btnAddPictures.addEventListener('click', addPictures);
	btnUpload.addEventListener('click', validateAddPictures);

	input.addEventListener("keydown", function(event) {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
			event.preventDefault();
			search();
		}
	});

};
