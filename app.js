(function(window){
	var doc = window.document,
			$ = function(selector){
				var result = doc.querySelectorAll(selector);
				return (result.length > 1) ? result : result[0];
			};

	Node.prototype.on = Node.prototype.addEventListener;
	NodeList.prototype.on = function(type, func, async) {
		[].forEach.call(this, function(node, index) {
			node.on(type, func, async);
		});
	};

	var form = $('#message-form');
	var messageField = $('#message');
	var messageList = $('#messages');
	var socketStatus = $('#status');
	var closeBtn = $('#close');

	// create a new websocket
	var socket = new WebSocket('ws://echo.websocket.org');

	// show a connected message when the web socket is opened
	socket.onopen = function(e) {
		socketStatus.innerHTML = 'Connected to: ' + e.currentTarget.URL;
		socketStatus.classList.add('open');
	};

	// handle any error tha might happen
	socket.onerror = function(error) {
		console.log('WebSocket error: ' + error);
	};

	// send a message when the form is submitted
	form.onsubmit = function(e) {
		e.preventDefault();

		// retrieve the message from the textarea
		var message = messageField.value;

		// send the data through the websocket
		socket.send(message);

		// add the message to the message list
		messageList.innerHTML += '<li class="sent"><span>Sent: </span>' + message + '</li>';

		// clear out the message field
		messageField.value = "";

		return false;
	}

	// handle messages sent by the server
	socket.onmessage = function(e) {
		var message = e.data;
		messageList.innerHTML += '<li class="received"><span>Sent: </span>' + message + '</li>';
	};

	// show a disconnected message when websocket is closed
	socket.onclose = function(e) {
		console.log('Socked closed');
		socketStatus.innerHTML = 'Disconnected from WebSocket';
		socketStatus.classList.remove('open');
		socketStatus.classList.add('closed');
	};

	// close the connection when close button is clicked
	closeBtn.on('click', function(e) {
		e.preventDefault();

		console.log('close clicked');
		// close the socket
		socket.close();

		return false;
	}, false);

}(this));