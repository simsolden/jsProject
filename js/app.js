//Variables

let wines;

//Functions

function search(){
	
};

function newWine(){
	
};

function saveWine(){
	
};

function deleteWine(){
	
};

function showWines(wines) {

	//Add Wines to List
    const emptyList = document.getElementById('winesList');
    let listContent = '';
    wines.forEach(function(wine) {
        listContent += '<li data-id="'+wine.id+'" class="list-group-item list-group-item-action">'+wine.name+'</li>';
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

function showWine(id) {
    //console.log(wines);
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

	//Extra properties of the wine
	
	let extraFields = document.getElementById('extraFields');
	if(wine.extra && extraFields.innerHTML===""){
		
		let extra = JSON.parse(wine.extra);

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
	}else if(wine.extra===null){
		extraFields.innerHTML = '';
	}
	
	
}

//Main

window.onload = function() {
	
	//Data gathering from the API
	const xhttp = new XMLHttpRequest();       
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState==4 && xhttp.status==200) {
			
            let data = xhttp.responseText;        
            wines = JSON.parse(data);  
			wines.sort(function(a,b){return a.id - b.id});		
            //Afficher la liste des vins dans UL liste
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
	
	btnSearch.addEventListener('click', () => search());
	btnNew.addEventListener('click', () => newWine());
	btnSave.addEventListener('click', () => saveWine());
	btnDelete.addEventListener('click', () => deleteWine());
	
	
};
