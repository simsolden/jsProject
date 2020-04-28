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
	
	/**
	const ulList=document.getElementById('WineList');
	const lis=ulList.querySelectorAll('li');
	for(li of lis){
		let idWine=this.dataset.id;
		li.addEventListener('click', function(){
			showWine(idWine);
		})
	}
	*/
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
	
	/**

	TODO : Inserer les éléments extra au fur et à mesure en parcourant le json de ines.extra
	
	if(wine.extra){
		let extra = JSON.parse(wine.extra);
		
		let extraFields = document.getElementById('extraFields');
		let node, content;

		for (let [key, value] of Object.entries(extra)) {
			
			let extraAttribute = key;
			let extraLabel = key.charAt(0).toUpperCase() + key.slice(1);
			
			content = "<div class='form-group'><label for='"+extraAttribute+"'>"+
				extraLabel+"</label><input id='"+extraAttribute+"' name='"+extraAttribute+"' type='text' class='form-control'></div>";
			
			extraFields.innerHTML=content;
			$( document ).ready(function() {
				document.getElementById("'"+extraAttribute+"'").value=value;
			});
			
		}
	}
	
	*/
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
