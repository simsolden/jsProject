//Variables

let wines;
let method;

//Functions
function filterByCountry(){
	console.log('filter test...');
	let selectElement = document.getElementById("selectCountry")
	let selected=selectElement.options[selectElement.selectedIndex].value;
	console.log(selected);

	showWines(wines.filter(element=>element.country==selected));
	showWine(wines.filter(element=>element.country==selected)[0].id);

}
function filterByYear(){

//TODO filterByYear
}


function deleteWine(){
	//TODO
};

function saveWine(){
	console.log('saving wine...');
	if (method=="POST"){
		//TODO Create wine

	}else if(method=="PUT"){
		//TODO Update wine
	}
};

function newWine(){

	clearErrorMessages();

	method = 'POST';

	document.getElementById("promoHide").style.display='block';
	document.getElementById("bioHide").style.display='block';

	document.getElementById("name").value='';
	document.getElementById("grapes").value='';
	document.getElementById("country").value='';
	document.getElementById("region").value='';
	document.getElementById("year").value='';
	document.getElementById("price").value='';
	document.getElementById("color").value='';
	document.getElementById("capacity").value='';
	document.getElementById("bio").type="checkbox";
	document.getElementById("promo").value='';

};

function validateForm(){

	let msg="";

	if(document.getElementById("name").value==""){
		msg ="Please enter a wine name";
		document.getElementById("nameError").innerHTML=msg;
	}else{
		document.getElementById("nameError").innerHTML="";
	}

	if(document.getElementById("grapes").value==""){
		msg ="Please enter grapes type";
		document.getElementById("grapesError").innerHTML=msg;
	}else{
		document.getElementById("grapesError").innerHTML="";
	}

	if(document.getElementById("region").value==""){
		msg ="Please enter a region";
		document.getElementById("regionError").innerHTML=msg;
	}else{
		document.getElementById("regionError").innerHTML="";
	}

	if(document.getElementById("country").value==""){
		msg ="Please enter a country";
		document.getElementById("countryError").innerHTML=msg;
	}else{
		document.getElementById("countryError").innerHTML="";
	}

	let year = document.getElementById("year").value;
	let currentYear = new Date().getFullYear();
	if(isNaN(parseFloat(year)) || year.value=="" || (parseFloat(year)<1500 || parseFloat(year)>currentYear)){
		msg ="Please enter a valid year";
		document.getElementById("yearError").innerHTML=msg;
	}else{
		document.getElementById("yearError").innerHTML="";
	}

	let capacity=document.getElementById("capacity").value;
	if(isNaN(parseFloat(capacity)) || capacity.value==""){
		msg ="Please enter a capacity in litter";
		document.getElementById("capacityError").innerHTML=msg;
	}else{
		document.getElementById("capacityError").innerHTML="";
	}

	let price = document.getElementById("price").value;
	if(isNaN(parseFloat(price)) || price.value ==""){
		msg ="Please enter a valid price";
		document.getElementById("priceError").innerHTML=msg;
	}else{
		document.getElementById("priceError").innerHTML="";
	}


	let promo = document.getElementById("promo").value;

	if(promo!=""){
		if(isNaN(parseFloat(promo))){
			msg ="Please enter a valid promotion";
			document.getElementById("promoError").innerHTML=msg;
		}else{
			document.getElementById("promoError").innerHTML="";
		}
	}

	if(msg===""){
		saveWine();
	}
}

function showWines(wines) {

	//Add Wines to List
    const emptyList = document.getElementById('winesList');
    let listContent = '';

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
	showWine(1);
}

function clearErrorMessages(){
	// Clear error messages
	var cells = document.getElementsByName("error");
	for (let i = 0; i < cells.length; i++) {
		 document.getElementsByName("error")[i].innerHTML="";
    }
}

function showWine(id) {

	clearErrorMessages();

	method='PUT';
	let wine = wines.find(element=>element.id==id);

	//Common wine properties
	let docElement = document.getElementById('idWine');
    docElement.value = wine.id;
    docElement = document.getElementById('name');
    docElement.value = wine.name;
    docElement = document.getElementById('grapes');
    docElement.value = wine.grapes;
    docElement = document.getElementById('country');
    docElement.value = wine.country;
    docElement = document.getElementById('region');
    docElement.value = wine.region;
    docElement = document.getElementById('year');
    docElement.value = wine.year;
	docElement = document.getElementById('picture');
	docElement.alt = wine.name;
    docElement.src = "http://cruth.phpnet.org/epfc/caviste/public/pics/" + wine.picture;
    docElement = document.getElementById('notes');
    docElement.value = wine.description;
	docElement = document.getElementById('price');
    docElement.value = wine.price;
	docElement = document.getElementById('capacity');

	/** TODO  problème on ne rentre pas dans la boucle*/
	if(wine.capicity==="0"){
		docElement.value = "none";
	}else{
		docElement.value = wine.capacity/100+"L";
	}
	docElement = document.getElementById('color');
	if(wine.color==""){
		docElement.value = "none";
	}else{
		docElement.value = wine.color;
	}

	//Extra properties of the wine

	let extraFields = document.getElementById('extraFields');
	if(wine.extra){
		let extra = JSON.parse(wine.extra);
		if(extra.bio){
			document.getElementById('bioHide').style.display='block';
			document.getElementById('bio').value="Oui";
		}
		if(extra.promo){
			document.getElementById('promoHide').style.display='block';
			document.getElementById('promo').value=extra.promo * 100 +"%";
		}
	}else if(wine.extra===null){
		document.getElementById('bioHide').style.display='none';
		document.getElementById('promoHide').style.display='none';
		//extraFields.innerHTML = '';
	}

		/**
		//Go through each extra properties
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
			winesArray.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0)
            wines = winesArray;
            showWines(wines);
        }
    };

    xhttp.open('GET','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines',true);
    xhttp.send();

	//Events creation on buttons
    let btnSearch = document.getElementById('btnSearch');
    let btnNew = document.getElementById('btnNew');
    let btnSave = document.getElementById('btnSave');
    let btnDelete = document.getElementById('btnDelete');
	let btnFilterByCountry = document.getElementById('btnFilterByCountry');

	btnSearch.addEventListener('click', search);
	btnNew.addEventListener('click', newWine);
	btnSave.addEventListener('click',validateForm);
	btnDelete.addEventListener('click', deleteWine);
	btnFilterByCountry.addEventListener('click', filterByCountry);

};
