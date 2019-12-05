var fs = require("fs");
var os = require("os");
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var url_path = "."

// Config

var configJSON = fs.readFileSync(url_path + "\\config\\config.json");
var config = JSON.parse(configJSON);

// Parameters //

var port = config.port;
var logFilename = url_path + "\\logs\\" + config.log;
var logger = fs.createWriteStream(logFilename, {
	flags: 'a' // 'a' means appending (old data will be preserved)
})

////////////////

server.botLevel1 = ["bordel", "attend", "j'en ai marre",  "c'est long", "incapable"];
server.botLevel2 = ["connard", "salop", "bouffon", "moins que rien", "encule", "pedophile", "pd", "couille", "idiot", "abruti"];
server.botLevel3 = ["merci"];
// Si trop vulgaire envoyer un message de bot !

server.TaskList = [];
server.UserNameList = [];
server.messList = [];
server.userWritingList = [];

// pour faciliter les manipulations avec chatmess
function ChatMess() {
	this.emetteur = "";
	this.message = "";
	this.priorite = 0;
	this.connect = -1;
}

console.log("Je suis à l'écoute du port: " + port + " !");

app.get('/');

// Ajout d'un élément à la TaskList
function create(array, newtask) {
	if (newtask != '') {
		array.push(newtask);
	}
};

// Ajout d'un élément à la TaskList avec un index
function created(array, newtask, index) {
	if (newtask != '') {
		array[index] = newtask;
	}
};

// Suppression d'un élément à la TaskList
function deleted(array, index) {
	if (index != null) {
		array.splice(index, 1);
	}
}

function deleteIdTask(array, idTaskList) {
	idTaskList.forEach( (idTask) => {
		array.splice(findInd(array, idTask), 1);
	})

	updateTaskList(array);
}

function updateTaskList (array) {
	for(i=0; i < array.length; i++) {
		array[i].id = i;
	}
}

function findInd (array, idTask) {
	for (i=0; i < array.length; i++) {
		if (array[i].id == idTask) {
			return i;
		}
	}
}

// Check (censure) message chat
function censure(array, data, level) {
	array.forEach( (str) => {
		if (data.message.includes(str)) {
			data.priorite = level;
		}
	})
}

io.sockets.on('connection', function (socket, pseudo) {

	// Dès réception du pseudo, on le stocke puis le diffuse aux autres
	socket.on('nouveau_client', function (pseudo) {

		socket.pseudo = pseudo;
		server.UserNameList.push(socket.pseudo);

		socket.emit('pseudo', socket.pseudo);

		socket.emit('TaskList', server.TaskList);
		socket.emit('messList', server.messList);
		socket.emit('userWritingList', server.userWritingList);

		socket.broadcast.emit('NbUser', server.UserNameList.length);
		socket.emit('NbUser', server.UserNameList.length);

		socket.broadcast.emit('UserNameList', server.UserNameList);
		socket.emit('UserNameList', server.UserNameList);
	});

	socket.on('connectChat', function () {

		var cm = new ChatMess();
		cm.emetteur = socket.pseudo;
		cm.message = "";
		cm.connect = 1;
		create(server.messList, cm);

		socket.broadcast.emit('messList', server.messList);
		socket.emit('messList', server.messList);

	});

	// Dès réception d'une tache, on récupère et on l'envoie a tout le monde la liste changée
	socket.on('createTask', function (task) {

		task.id = server.TaskList.length;
		create(server.TaskList, task);

		socket.emit('TaskList', server.TaskList);
		socket.broadcast.emit('TaskList', server.TaskList);
	});

	socket.on('updateTaskModified', function(data) {

		created(server.TaskList, data, data.id);

		socket.emit('TaskList', server.TaskList);
		socket.broadcast.emit('TaskList', server.TaskList);
	});

	socket.on('createTaskModified', function (data) {

		created(server.TaskList, data, data.id);

		socket.emit('TaskList', server.TaskList);
		socket.broadcast.emit('TaskList', server.TaskList);
	});

	socket.on('deleteTask', function (data) {

		deleteIdTask(server.TaskList, data);

		socket.emit('TaskList', server.TaskList);
		socket.broadcast.emit('TaskList', server.TaskList);
	});

	// Lors de la déconnexion
	socket.on('disconnect', function () {

		// retire de la liste des pseudos en ligne
		server.UserNameList.splice(server.UserNameList.indexOf(socket.pseudo), 1);

		socket.emit('UserNameList', server.UserNameList);
		socket.broadcast.emit('UserNameList', server.UserNameList);

		// Users who are writing
		deleted(server.userWritingList, server.userWritingList.indexOf(socket.pseudo));
		socket.emit('userWritingList', server.userWritingList);
		socket.broadcast.emit('userWritingList', server.userWritingList);

		// Users number
		socket.emit('NbUser', server.UserNameList.length);
		socket.broadcast.emit('NbUser', server.UserNameList.length);

		// User message deconnecté (CHAT)
		var cm = new ChatMess();
		cm.emetteur = socket.pseudo;
		cm.message = "";
		cm.connect = 0;
		socket.broadcast.emit('messList', server.messList);
		socket.emit('messList', server.messList);
		create(server.messList, cm);

		socket.broadcast.emit('messList', server.messList);
		socket.emit('messList', server.messList);


		// LOG SERVICE END
		if (server.UserNameList.length == 0) {
			logger.end();
		}
	});

	// gestion chat messagerie instantanée

	// message
	socket.on('createMessList', function (data) {

		censure(server.botLevel1, data, 1);
		censure(server.botLevel2, data, 2);
		censure(server.botLevel3, data, 3);
		create(server.messList, data);

		socket.broadcast.emit('NewMessList', data);
		socket.emit('NewMessList', data);

		var index = server.userWritingList.indexOf(data.emetteur);
		deleted(server.userWritingList, index);
		
		if (data.priorite == 2) {
			cm = new ChatMess();
			cm.emetteur = "BOT";
			cm.message = "";
			cm.priorite = 3;
			cm.connect = 2;
			create(server.messList, cm);

			socket.broadcast.emit('NewMessList', cm);
			socket.emit('NewMessList', cm);
		}

		socket.broadcast.emit('userWritingList', server.userWritingList);
		socket.emit('userWritingList', server.userWritingList);
		
	})

	// User online or disconnected
	socket.on('createUserChat', function (data) {

		create(server.messList, data);

		socket.broadcast.emit('messList', server.messList);
		socket.emit('messList', server.messList);
	})

	socket.on('deleteUserChat', function (data) {

		deleted(server.messList, data);

		socket.broadcast.emit('messList', server.messList);
		socket.emit('messList', server.messList);
	})

	// user who are writing
	socket.on('createUserWriting', function (data) {

		create(server.userWritingList, data);

		socket.broadcast.emit('userWritingList', server.userWritingList);
		socket.emit('userWritingList', server.userWritingList);
	})

	socket.on('deleteUserWriting', function (data) {

		var index = server.userWritingList.indexOf(data);
		if (index >= 0) {
			deleted(server.userWritingList, index);

			socket.broadcast.emit('userWritingList', server.userWritingList);
			socket.emit('userWritingList', server.userWritingList);
		}
	})

	// LOG SERVICE
	socket.on('log', function (data) {	
		
		if (fs.existsSync(logFilename)) {

			var size = fs.statSync(logFilename).size / 1000000;

			if (size >=0.02) {

				logger.end();

				while (size >= 0.90) { 

					var BufferReader = fs.readFileSync(logFilename, 'utf8');
					var content = BufferReader.toString();
					var wantedLines = content.substring(content.indexOf(os.EOL) + 1);

					fs.writeFileSync(logFilename, wantedLines);

					size = fs.statSync(logFilename).size / 1000000;
				}

			}

				logger = fs.createWriteStream(logFilename, {
					flags: 'a'
				});
				
		}

		var logstr = "";
		if (socket.pseudo == null) {
			logstr = "[" + data[0] + "] || " + data[1] + " || UNKNOWN || " + data[2] + os.EOL;
		} else {
			logstr = "[" + data[0] + "] || " + data[1] + " || " + socket.pseudo + " || " + data[2] + os.EOL;
		}	

		logger.write(logstr);

	})

});

server.listen(port);
