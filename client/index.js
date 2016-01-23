var socket = io("5.135.178.180:9898");
var postItList = [];
var domPost = [];
var myName = '';

function getAndSaveName() {
    myName = '';
    while (myName == '') {
	myName = prompt('Username');
    }
    localStorage.setItem('username', myName);
    document.getElementById('username').innerHTML = myName;
}

document.addEventListener('DOMContentLoaded', function () {
    if (!localStorage.getItem('username')) {   
	getAndSaveName();
    } else {
	myName = localStorage.getItem('username');
	document.getElementById('username').innerHTML = myName;
    }
    
    document.getElementById('resetname').addEventListener('click', function() {
	getAndSaveName();
    }, false);
    
    socket.emit('require_postits');
});

function buildPostIt(i) {
    domPost[i] = {};
    
    var id = i;
    var newDiv = document.createElement('div');
    newDiv.className = 'postIt';

    var col = parseInt(id % 5);
    var line = parseInt(id / 5);

    domPost[i].posLeft = (20 + col * 220);
    domPost[i].posTop = (100 + line * 220);
    newDiv.style.left = (20 + col * 220) + 'px';
    newDiv.style.top = (100 + line * 220) + 'px';

    document.getElementById('content-wrap').appendChild(newDiv);

    domPost[i].main = newDiv;
    
    return (id);
}

function setTitle(i, title) {
    var newTitle = document.createElement('div');
    newTitle.innerHTML = title;
    newTitle.className = 'title';
    newTitle.index = i;
    
    newTitle.addEventListener('click', function() {
	buildTitleEditor(this.index);
    }, false);
    
    domPost[i].main.appendChild(newTitle);
    domPost[i].title = newTitle;
}

function setContent(i, content) {
    var newContent = document.createElement('div');
    newContent.className = 'content';
    newContent.innerHTML = content;
    newContent.index = i;
    
    newContent.addEventListener('click', function() {
    }, false);
    
    domPost[i].main.appendChild(newContent);
    domPost[i].content = newContent;
}

function setLastModified(i, content) {
    var newLM = document.createElement('div');
    newLM.className = 'LM';
    newLM.innerHTML = 'last modified by ' + content;

    domPost[i].main.appendChild(newLM);
    domPost[i].LM = newLM;
}

function buildTitleEditor(index) {
    var newEditor = document.createElement('input');
    newEditor.type = 'text';
    newEditor.value = postItList[i].title;
    newEditor.style.position = 'absolute';
    newEditor.style.left = '0px';
    newEditor.style.top = '0px';
    newEditor.style.width = '195px';
    newEditor.style.height = '25px';
    newEditor.index = index;
    
    domPost[i].main.appendChild(newEditor);

    socket.emit('lock', {index:index, name: myName});
    
    newEditor.addEventListener('keydown', function(event) {
	if (event.keyCode == 13) {
	    domPost[i].title.innerHTML = this.value;

	    postItList[i].title = this.value;
	    socket.emit('change_title', {index: this.index, value: this.value, name: myName});
	    this.parentNode.removeChild(this);
	}
    });
}

socket.on('title_change', function(data) {
    domPost[data.index].title.innerHTML = data.value;
    domPost[data.index].LM.innerHTML = 'last modified by ' + data.from;
});

socket.on('list_post_its', function(data) {
    postItList = data;

    for (i in data) {
	buildPostIt(i);
	setTitle(i, data[i].title);
	setContent(i, data[i].rawContent);
	setLastModified(i, data[i].lockName);
    }
});


