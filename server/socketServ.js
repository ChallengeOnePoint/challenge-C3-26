var io = require('socket.io').listen(9898);

var postIts = [];

var currentId = 0;

postIts[0] = {
    title: 'default post it',
    locked: false,
    lockId: -1,
    lockName: 'admin',
    rawContent: 'default Content 1',
    history: []
};

postIts[1] = {
    title: 'default post it no 2',
    locked: false,
    lockId: -1,
    lockName: 'admin',
    rawContent: 'default Content 2',
    history: []
};

function newPostIt(title, userId, userName) {
    postIts.push({
	title: title,
	locked:true,
	lockId: userId,
	lockName: userName,
	rawContent: '',
	history:[]
    });
}


io.sockets.on('connection', function(socket) {
    socket.specVar = currentId;
    currentId++;

    console.log(currentId + " est l'id");

    socket.join('all');
    
    socket.on('require_postits', function() {
	socket.emit('list_post_its', postIts);
    });

    socket.on('disconnect', function() {
	for (i in postIts) {
	    if (postIts[i].lockId == currentId) {
		postIts[i].lockId = -1;
		postIts[i].locked = false;
	    }
	}
    });

    socket.on('change_title', function(data) {
	postIts[data.index].title = data.value;
	postIts[data.index].lockName = data.name;
	postIts[data.index].lockId = socket.specVar;


	io.to('all').emit('title_change', {index:data.index, value:data.value, from:data.name}); 
    });
});
