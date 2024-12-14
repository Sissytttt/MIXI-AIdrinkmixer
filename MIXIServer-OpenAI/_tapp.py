from flask import Flask, request
from flask_socketio import SocketIO, send
import os
import json

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return """
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js" integrity="sha512-q/dWJ3kcmjBLU4Qc47E4A9kTB4m3wuTY7vkFJDTZKjTs8jhyGQnaUrxa0Ytd0ssMZhbNua9hE+E7Qv1j+DyZwA==" crossorigin="anonymous"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script type="text/javascript">
    $(document).ready(function() {

        var socket = io.connect('http://127.0.0.1:5000');

        socket.on('connect', function() {
            socket.send('User has connected!');
        });

        socket.on('message', function(msg) {
            $("#messages").append('<li>'+msg+'</li>');
            console.log('Received message');
        });

        $('#sendbutton').on('click', function() {
            console.log("test");
            socket.send($('#msg').val());
            $('#msg').val('');
        });

    });
    </script>
    <ul id="messages"></ul>
    <input type="text" id="msg">
    <button id="sendbutton">Sendddd</button>
    </body>
    """

@socketio.on('message')
def handle_message(msg):
    print(f"Message: {msg}")
    send(msg)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001)