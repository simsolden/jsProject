/**
 *
 * @file Data file containing users info and used in app
 *
 * @author S. Oldenhove <simonoldenhove@gmail.com>
 *
 */

//TODO request users values to see if user and pass are valid else, sessionStorage.clear();


/**
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
    let data = xhr.responseText;
    let logins = JSON.parse(data);
    for(let i=0, i<logins.lenght, i++){
      APIusers[i]={username:logins[i].username, password:logins[i.password], logins[i].id};
    }
  } else {
    alert('Error !');
  }
};
xhr.open("GET", apiUrl + "/users", true);
xhr.send();
*/
let APIusers;

APIusers = [
  {
		"username" : "ced",
		"password" : "epfc",
		"id" : "1"
	},
  {
		"username" : "bob",
		"password" : "epfc",
		"id" : "2"
	},
  {
		"username" : "radad",
		"password" : "epfc",
		"id" : "3"
	},
  {
		"username" : "adam",
		"password" : "epfc",
		"id" : "4"
	},
  {
		"username" : "alain",
		"password" : "epfc",
		"id" : "5"
	},
  {
		"username" : "amin",
		"password" : "epfc",
		"id" : "6"
	},
  {
		"username" : "amine",
		"password" : "epfc",
		"id" : "7"
	},
  {
		"username" : "angeline",
		"password" : "epfc",
		"id" :"8"
	},
  {
    "username" : "badreddine",
    "password" : "epfc",
    "id" :"9"
  },
  {
    "username" : "belkacem",
    "password" : "epfc",
    "id" :"10"
  },
  {
    "username" : "gregory",
    "password" : "epfc",
    "id" :"11"
  },
  {
    "username" : "ismail",
    "password" : "epfc",
    "id" :"12"
  },
  {
    "username" : "appolinaire",
    "password" : "epfc",
    "id" :"13"
  },
  {
    "username" : "kwasi",
    "password" : "epfc",
    "id" :"14"
  },
  {
    "username" : "manuel",
    "password" : "epfc",
    "id" :"15"
  },
  {
    "username" : "maxime",
    "password" : "epfc",
    "id" :"16"
  },
  {
    "username" : "myriam",
    "password" : "epfc",
    "id" : "17"
  },
  {
    "username" : "nathalie",
    "password" : "epfc",
    "id" :"18"
  },
  {
    "username" : "mamadou",
    "password" : "epfc",
    "id" :"19"
  },
  {
    "username" : "rachida",
    "password" : "epfc",
    "id":"20"
  },
  {
    "username" : "simon",
    "password" : "epfc",
    "id" : "21"
  },
  {
    "username" : "thomas",
    "password" : "epfc",
    "id" :"22"
  },
  {
		"username" : "youssef",
		"password" : "epfc",
		"id" :"23"
	},
  {
    "username" : "nathan",
    "password" : "epfc",
    "id" :"24"
  }
];
