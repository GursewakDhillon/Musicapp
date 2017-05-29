var currentSong = null;
var currentPlayList = null;
var currentUserList=null;
var currentUserPlaylist=null;

window.MUSIC_DATA = {};
var songsLoaded = false;
var usersLoaded = false;
var playlistsLoaded = false;

var httpRequest;

function makeRequest(url) {
	httpRequest = new XMLHttpRequest();
	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === 200) {
				var response = JSON.parse(httpRequest.responseText);
				if (url == '/api/playlists') {
							window.MUSIC_DATA['playlists'] = response.playlists;
							playlistsLoaded = true;
							console.log('playlist loaded by the api request!');
							attemptRunApplication();
				}
				if (url == '/api/songs') {
							window.MUSIC_DATA['songs'] = response.songs;
							songsLoaded = true;
							console.log('songs loaded is loaded by the api request!');
							
							attemptRunApplication();
				}
				if (url == '/api/users') {
							window.MUSIC_DATA['users'] = response.users;
							usersLoaded = true;
							console.log('users loaded is loaded by the api request!');
							console.log(MUSIC_DATA.users);
							attemptRunApplication();
				}
			} else {
				alert('The request ended with the problem.');
			}
		}
	};
	httpRequest.open('GET', url, false);
	httpRequest.send();
}

function makePOSTRequest(url,value) {
	httpRequest = new XMLHttpRequest();
	httpRequest.open("POST", url, true);

	
	httpRequest.setRequestHeader("Content-type", "application/json");

	httpRequest.onreadystatechange = function() {
			if(httpRequest.readyState == 4 && httpRequest.status == 200) {
					console.log('The playlist is successfully added!');
			}
	}
	console.log('Testing the value. ')
	console.log(value);
	httpRequest.send(value);
	makeAjaxRequests();
}

function makeDELETERequest(url,value) {
	console.log("this is a url " +url);
	httpRequest = new XMLHttpRequest();
	httpRequest.open("DELETE", url, true);

	console.log("this is a url " +url)
	httpRequest.setRequestHeader("Content-type", "application/json");

	httpRequest.onreadystatechange = function() {
			if(httpRequest.readyState == 4 && httpRequest.status == 200) {
					console.log('The playlist is successfully added!');
			}
	}
	console.log('Testing the value. ')
	console.log(value);
	httpRequest.send(value);
	makeAjaxRequests();
	
}
	
var attemptRunApplication = function() {
    if (songsLoaded == true && playlistsLoaded == true && usersLoaded ==true) {
        
			document.addEventListener("DOMContentLoaded", function(event) {
				loadContents();
				console.log("DOM tree fully loaded!");
			});
    }
};

function addPlaylistToDisk() {
	var playlistName = $("#addPlaylistModal #inputPlaylistName").val().trim();
	var ele = {id: MUSIC_DATA.playlists.length, name: playlistName, songs: []};
	//MUSIC_DATA.playlists.push(ele);
	//console.log(JSON.stringify({name: ele.name}));
	
	makePOSTRequest('/api/playlists/',JSON.stringify({name: ele.name}));
	deleteOldDOMs();
	loadContents();
}

function deleteOldDOMs() {
	var oldDOMs = ['createPlaylists','playlistModal','showSongsSortedByArtist','showSongsSortedByTitle','showSearchResults','showPlaylistSongs','userModal'];
	for(var i = 0; i < oldDOMs.length; i++) {
		var remove = document.getElementById(oldDOMs[i]);
		if (document.body.contains(remove)){
			while (remove.hasChildNodes()) {
				remove.removeChild(remove.lastChild);
			}
		}
	}
	console.log('deleted old DOMs is successfully deleted!');
}

function libraryTab() {
	window.history.pushState('obj', 'library', '/library');
}
function playlistsTab() {
	window.history.pushState('obj', 'playlists', '/playlists');
}	
function searchTab() {
	window.history.pushState('obj', 'search', '/search');
}	

function makeAjaxRequests() {
	makeRequest('/api/songs');
	makeRequest('/api/playlists');
	makeRequest('/api/users');
}

window.onload = makeAjaxRequests();


function displayPlaylists(){
	document.getElementById('createPlaylists').style.display = "block";
	for(var i = 0; i < MUSIC_DATA.playlists.length; i++) {
		document.getElementById('playlist'+i).style.display = "none";
	}
}

function getSongById(num) {
	var res = MUSIC_DATA.songs.filter(function(val, index, array) {
    return val.id === num;
	});
	return res;
}
function getCurrentSong(str) {
	currentSong = MUSIC_DATA.songs.filter(function(val, index, array) {
    return val.title === str;
	});
}
function getUserToPlaylist(str) {
	console.log("this is get user to playlisT " + str );
	currentUserPlaylist = MUSIC_DATA.playlists.filter(function(val, index, array) {
    return val.name === str;
	});
	
	
}
function getUserPlayList(str) {
	getUserPlaylist = MUSIC_DATA.playlists.filter(function(val, index, array) {
    return val.title === str;
	});
}

function getCurrentPlaylist(str) {
	currentPlayList = MUSIC_DATA.playlists.filter(function(val, index, array) {
    return val.name === str;
	});
	addSongToPlaylist();
	$('#addModal').modal('hide');
}

function getCurrentUserlist(str) {
	currentUserList = MUSIC_DATA.users.filter(function(val, index, array) {
		console.log("this is inside the current userlist function "+ val.username); 
    return val.username === str;
	});
	
	addUserToPlaylist(currentUserPlaylist,currentUserList);
	$('#addModalUser').modal('hide');
}

function addSongToPlaylist() {
	
	console.log('Add song to the play list');
	console.log(currentPlayList[0].id);
	console.log(currentSong[0].id);
	makePOSTRequest('/api/playlists/'+currentPlayList[0].id+'',JSON.stringify({song: currentSong[0].id}));
	deleteOldDOMs();
	loadContents();
}

function addUserToPlaylist(c_userPlaylist,c_userlist) {
	
	console.log('Add User to the play list');
	console.log("\n\n");
	console.log(c_userPlaylist[0].id);
	console.log(c_userlist[0].id);
	
	
	makePOSTRequest('/api/playlists/'+c_userPlaylist[0].id+'/users',JSON.stringify({user: c_userlist[0].id}));
	deleteOldDOMs();
	loadContents();
}

function deleteSongToPlaylist(songFromPlaylist,song) {
	console.log("This is playlist name "+songFromPlaylist);
	console.log("this is a song! "+song);
	
	//console.log(MUSIC_DATA.playlists.length);
	var playlistId;
	// iterate over each element in the array
	var songId;
	for (var i = 0; i < MUSIC_DATA.playlists.length; i++){
	  // look for the entry with a matching `code` value
	  if (MUSIC_DATA.playlists[i].name == songFromPlaylist){
		  playlistId=MUSIC_DATA.playlists[i].id;
		  console.log("this is playlist id "+playlistId);
	  }
	}
	/*console.log("This is size of the playlist length! "+MUSIC_DATA.playlists[playlistId]);
	//console.log(MUSIC_DATA.playlists[playlistId].songs[1]);
	for (var j = 0; j < MUSIC_DATA.playlists[playlistId].songs.length; j++){
	  // look for the entry with a matching `code` value
	  if (MUSIC_DATA.playlists[playlistId].songs[j] == song){
		  songId=MUSIC_DATA.playlists[playlistId].songs[j];
		  console.log("this is sone id "+ songId);
		  
	  }
	}*/
	
	makeDELETERequest('/api/playlists/'+playlistId+'',JSON.stringify({song: song}));
	deleteOldDOMs();
	loadContents();
	console.log("The song is successfully deleted!");
	console.log("Please click on the playlist button to refresh and see the changes!");
	
	
}


function makePlaylists(array) {
    var list = document.createElement('ul');
		list.setAttribute("class", "list-group");
    for(var i = 0; i < array.length; i++) {
			var item = document.createElement('li');
			item.setAttribute("class", "list-group-item list-group-item-action");
			item.setAttribute('onclick','displayPlaylistSongs('+i+')');
			var img = document.createElement('img');
			img.setAttribute("src", "imgs/grey.jpg");
			img.setAttribute("class", "img-thumbnail");
			img.setAttribute("width", "50");
			var chevronButton = document.createElement('a');
			chevronButton.setAttribute('class',"btn btn-default");
			var chevronButtonIcon = document.createElement('i');
			chevronButtonIcon.setAttribute('class','fa fa-chevron-right');
			chevronButtonIcon.setAttribute('title','Chevron');
			chevronButton.appendChild(chevronButtonIcon);
			item.appendChild(img);
			item.appendChild(document.createTextNode(array[i].name));
			item.appendChild(chevronButton);
			list.appendChild(item);
    }
    return list;
}

function makePlaylistsModal(array) {
    var list = document.createElement('ul');
    for(var i = 0; i < array.length; i++) {
			var item = document.createElement('li');
			var alink = document.createElement('a');
			alink.setAttribute("href", "#");
			alink.setAttribute("data-dismiss", "modal");
			alink.setAttribute('onclick',"getCurrentPlaylist("+"\""+array[i].name+"\""+")");
			alink.appendChild(document.createTextNode(array[i].name));
			item.appendChild(alink);
			list.appendChild(item);
    }
    return list;
}

function makeuserModal(array) {
    var list = document.createElement('ul');
    for(var i = 0; i < array.length; i++) {
			console.log("this is the username "+ array[i].username);
			var item = document.createElement('li');
			var alink = document.createElement('a');
			alink.setAttribute("href", "#");
			alink.setAttribute("data-dismiss", "modal");
			alink.setAttribute('onclick',"getCurrentUserlist("+"\""+array[i].username+"\""+")");
			alink.appendChild(document.createTextNode(array[i].username));
			item.appendChild(alink);
			list.appendChild(item);
    }
    return list;
}


function createSongLi (array, i, sorted) {
	if (sorted == true) {
		var song = array[i];
	}
	else {
		var song = getSongById(i)[0];
	}
	var item = document.createElement('li');
	item.setAttribute("class", "list-group-item");
	var row = document.createElement('div');
	row.setAttribute("class", "row");
	var col2 = document.createElement('div');
	col2.setAttribute("class", "col-2");
	var col8 = document.createElement('div');
	col8.setAttribute("class", "col-6");
	var col1a = document.createElement('div');
	col1a.setAttribute("class", "col-1");
	var col1b = document.createElement('div');
	col1b.setAttribute("class", "col-1");
	var col1c = document.createElement('div');
	col1c.setAttribute("class", "col-1");	
	var img = document.createElement('img');
	img.setAttribute("src", "imgs/grey.jpg");
	img.setAttribute("class", "img-thumbnail");
	img.setAttribute("width", "100%");
	var playButton = document.createElement('a');
	playButton.setAttribute('type',"button");
	playButton.setAttribute('class',"btn btn-default");
	var playButtonIcon = document.createElement('i');
	playButtonIcon.setAttribute('class','fa fa-play');
	playButtonIcon.setAttribute('title','Play');
	playButton.appendChild(playButtonIcon);
	var addButton = document.createElement('a');
	addButton.setAttribute('type',"button");
	addButton.setAttribute('class',"btn btn-default");
	addButton.setAttribute('data-toggle',"modal");
	addButton.setAttribute('data-target',"#addModal");
	addButton.setAttribute('onclick',"getCurrentSong('"+song.title+"')");
	var addButtonIcon = document.createElement('i');
	addButtonIcon.setAttribute('class','fa fa-plus-circle');
	addButtonIcon.setAttribute('title','Add');
	addButton.appendChild(addButtonIcon);
	
	var deleteButton = document.createElement('a');
	deleteButton.setAttribute('type',"button");
	deleteButton.setAttribute('class',"btn btn-default");
	//deleteButton.setAttribute('class','playlistName');
	//deleteButton.setAttribute('data-target',"#addModal");
	//deleteButton.setAttribute('onclick',"deleteSongToPlaylist()");
	var deleteButtonIcon = document.createElement('i');
	deleteButtonIcon.setAttribute('class','fa fa-times');
	deleteButtonIcon.setAttribute('title','delete');
	deleteButton.appendChild(deleteButtonIcon);
	
	var title = document.createElement('div');
	title.setAttribute('class','titleText');
	var artist = document.createElement('div');
	artist.setAttribute('class','artistText');
	var titleString = truncate(song.title, 24);
	var artistString = truncate(song.artist, 40);
	title.appendChild(document.createTextNode(titleString));
	artist.appendChild(document.createTextNode(artistString));
	
	col2.appendChild(img);
	col8.appendChild(title);
	col8.appendChild(document.createElement('br'));
	col8.appendChild(artist);
	col1a.appendChild(playButton);
	col1b.appendChild(addButton);
	col1c.appendChild(deleteButton);
	row.appendChild(col2);
	row.appendChild(col8);
	row.appendChild(col1a);
	row.appendChild(col1b);
	row.appendChild(col1c);
	item.appendChild(row);
	
	return item;
}
function createSongList (array, i, sorted,name) {
	if (sorted == true) {
		
		var song = array[i];
	}
	else {
		var song = getSongById(i)[0];
	}
	console.log(name);
	var item = document.createElement('li');
	item.setAttribute("class", "list-group-item");
	var row = document.createElement('div');
	row.setAttribute("class", "row");
	var col2 = document.createElement('div');
	col2.setAttribute("class", "col-2");
	var col8 = document.createElement('div');
	col8.setAttribute("class", "col-6");
	var col1a = document.createElement('div');
	col1a.setAttribute("class", "col-1");
	var col1b = document.createElement('div');
	col1b.setAttribute("class", "col-1");
	var col1c = document.createElement('div');
	col1c.setAttribute("class", "col-1");	
	var img = document.createElement('img');
	img.setAttribute("src", "imgs/grey.jpg");
	img.setAttribute("class", "img-thumbnail");
	img.setAttribute("width", "100%");
	var playButton = document.createElement('a');
	playButton.setAttribute('type',"button");
	playButton.setAttribute('class',"btn btn-default");
	var playButtonIcon = document.createElement('i');
	playButtonIcon.setAttribute('class','fa fa-play');
	playButtonIcon.setAttribute('title','Play');
	playButton.appendChild(playButtonIcon);
	var addButton = document.createElement('a');
	addButton.setAttribute('type',"button");
	addButton.setAttribute('class',"btn btn-default");
	addButton.setAttribute('data-toggle',"modal");
	addButton.setAttribute('data-target',"#addModal");
	addButton.setAttribute('onclick',"getCurrentSong('"+song.title+"')");
	var addButtonIcon = document.createElement('i');
	addButtonIcon.setAttribute('class','fa fa-plus-circle');
	addButtonIcon.setAttribute('title','Add');
	addButton.appendChild(addButtonIcon);
	
	var deleteButton = document.createElement('a');
	deleteButton.setAttribute('type',"button");
	deleteButton.setAttribute('class',"btn btn-default");
	deleteButton.setAttribute('onclick','deleteSongToPlaylist("'+name+'","'+song.id+'")');
	
	var deleteButtonIcon = document.createElement('i');
	deleteButtonIcon.setAttribute('class','fa fa-times');
	deleteButtonIcon.setAttribute('title','delete');
	deleteButton.appendChild(deleteButtonIcon);
	
	var title = document.createElement('div');
	title.setAttribute('class','titleText');
	var artist = document.createElement('div');
	artist.setAttribute('class','artistText');
	var titleString = truncate(song.title, 24);
	var artistString = truncate(song.artist, 40);
	title.appendChild(document.createTextNode(titleString));
	artist.appendChild(document.createTextNode(artistString));
	
	
	col2.appendChild(img);
	col8.appendChild(title);
	col8.appendChild(document.createElement('br'));
	col8.appendChild(artist);
	col1a.appendChild(playButton);
	col1b.appendChild(addButton);
	col1c.appendChild(deleteButton);
	row.appendChild(col2);
	row.appendChild(col8);
	row.appendChild(col1a);
	row.appendChild(col1b);
	row.appendChild(col1c);
	item.appendChild(row);
	
	return item;
}

function makeSongs(array,str) {
	// Create the list element:
	//console.log(array);
	//console.log(array);
	var list = document.createElement('ul');
	list.setAttribute("class", "list-group");
	if (str != "sortedSongList"){	
		list.setAttribute("id", str);
	}
	for(var i = 0; i < array.length; i++) {
		
		var item = createSongLi (array,i,true);
		
		list.appendChild(item);
	}
	
	return list;
}

function showPlaylistSongs(array,num) {
	var name=array.playlists[num].name;
	//console.log(array.playlists[num].name);
	var songs = array.playlists[num].songs;
	//console.log(songs);
	var div = document.createElement('div');
	div.setAttribute('id','playlist'+num);
	div.setAttribute('class','hiddenPlaylists');
	var list = document.createElement('ul');
	list.setAttribute("class", "list-group");
	for(var i = 0; i < songs.length; i++) {
		var item = createSongList(array.songs,songs[i],false,name);
		list.appendChild(item);
	}
	
	var row = document.createElement('div');
	row.setAttribute("class", "row");
	var col2 = document.createElement('div');
	col2.setAttribute("class", "col-2");
	var col8= document.createElement('div');
	col8.setAttribute("class", "col-8");
	var addButton = document.createElement('a');
	addButton.setAttribute('type',"button");
	//addButton.setAttribute('aTitle',"button");
	addButton.innerHTML = '+ User';
	addButton.setAttribute('class',"btn");
	addButton.setAttribute('data-toggle',"modal");
	addButton.setAttribute('data-target',"#addModalUser");
	addButton.setAttribute('onclick','getUserToPlaylist("'+array.playlists[num].name+'")');
	var playlistName = document.createElement('div');
	playlistName.setAttribute('class','playlistName');
	playlistName.appendChild(document.createTextNode(array.playlists[num].name));
	col8.appendChild(playlistName);
	col2.appendChild(addButton);
	row.appendChild(col8);
	row.appendChild(col2);
	div.appendChild(row);
	div.appendChild(list);
	return div;
}

function loadContents() {
	
	document.getElementById('createPlaylists').appendChild(makePlaylists(MUSIC_DATA.playlists));
	
	document.getElementById('playlistModal').appendChild(makePlaylistsModal(MUSIC_DATA.playlists));
	document.getElementById('userModal').appendChild(makeuserModal(MUSIC_DATA.users));
	
	document.getElementById('showSongsSortedByArtist').appendChild(makeSongs(MUSIC_DATA.songs.sort(compareArtist),"sortedSongList"));
	document.getElementById('showSongsSortedByTitle').appendChild(makeSongs(MUSIC_DATA.songs.sort(compareTitle),"sortedSongList"));
	
	document.getElementById('showSearchResults').appendChild(makePlaylists(MUSIC_DATA.playlists));
	document.getElementById('showSearchResults').appendChild(makeSongs(MUSIC_DATA.songs,"searchList"));
	
	for(var i = 0; i < MUSIC_DATA.playlists.length; i++) {
		document.getElementById('showPlaylistSongs').appendChild(showPlaylistSongs(MUSIC_DATA,i));
	}
	console.log('Application content is loaded');
}


function search() {
  
  var input, filter, list, li, res, list2, li2;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  list = document.getElementById("searchList");
  li = list.getElementsByTagName("li");
	list2 = document.getElementById("showSearchResults").children[1];
	li2 = list2.getElementsByTagName("li");
  
  for (var x = 0; x < li2.length; x++) {
		res = li2[x];
    if (res) {
      if (res.innerHTML.toUpperCase().indexOf(filter) > -1) {
        res.style.display = "block";
      } else {
        res.style.display = "none";
      }
    }
		if (!filter) {
			for (var y = 0; y < li2.length; y++) {
				li2[y].style.display = "none";
			}
		}
	}
  for (var i = 0; i < li.length; i++) {
		res = li[i];
    if (res) {
      if (res.innerHTML.toUpperCase().indexOf(filter) > -1) {
        res.style.display = "block";
      } else {
        res.style.display = "none";
      }
    }
		if (!filter) {
			for (var j = 0; j < li.length; j++) {
				li[i].style.display = "none";
			}
		}
	}
}

function truncate(str, num) {
	var length = num;
	var string = str;
	if (str.length > num){
		string = string.substring(0,num)+"...";
	}
	return string;
}

function compareTitle(a, b) {
  var aTitle = a.title.toLowerCase(),
      bTitle = b.title.toLowerCase();
      
  aTitle = removeArticles(aTitle);
  bTitle = removeArticles(bTitle);
  
  if (aTitle > bTitle) return 1;
  if (aTitle < bTitle) return -1; 
  return 0;
};

function compareArtist(a, b) {
  var aTitle = a.artist.toLowerCase(),
      bTitle = b.artist.toLowerCase();
      
  aTitle = removeArticles(aTitle);
  bTitle = removeArticles(bTitle);
  
  if (aTitle > bTitle) return 1;
  if (aTitle < bTitle) return -1; 
  return 0;
};

function removeArticles(str) {
  words = str.split(" ");
  if(words.length <= 1) return str;
  if(words[0] == 'the')
    return words.splice(1).join(" ");
  return str;
}

function displaySortByArtist() {
	document.getElementById('showSongsSortedByTitle').style.display = "none";
	document.getElementById('showSongsSortedByArtist').style.display = "block";
	console.log('Sorted by artist!');
}

function displaySortByTitle() {
	document.getElementById('showSongsSortedByTitle').style.display = "block";
	document.getElementById('showSongsSortedByArtist').style.display = "none";
	console.log('Sorted by title!');
	}

function displayPlaylistSongs(num){
	document.getElementById('createPlaylists').style.display = "none";
	for(var i = 0; i < MUSIC_DATA.playlists.length; i++) {
		if (i == num) {
			document.getElementById('playlist'+i).style.display = "block";
		}
		else {
			document.getElementById('playlist'+i).style.display = "none";
		}
	}
}

