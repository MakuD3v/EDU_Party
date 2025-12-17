extends Node

# WebSocket Client
var _socket := WebSocketPeer.new()

# --- CONNECTION SETTINGS ---
# 1. LOCAL TESTING (Uncomment to use)
var server_url := "ws://127.0.0.1:8000/ws/game/"

# 2. PRODUCTION / EXTERNAL (Uncomment & Paste your Public URL)
# var server_url := "wss://<YOUR-APP-NAME>.onrender.com/ws/game/"
# ---------------------------

var username := "Player_" + str(randi() % 1000)

func _ready():
	_parse_launch_args()
	connect_to_server()

func _parse_launch_args():
	var args = OS.get_cmdline_args()
	for arg in args:
		if arg.begins_with("eduparty://"):
			# Format: eduparty://launch?token=LOBBY_ID:USERNAME
			# Simple parse: find 'token='
			var token_start = arg.find("token=")
			if token_start != -1:
				var token = arg.substr(token_start + 6)
				# Token format: LOBBY_ID:USERNAME
				var parts = token.split(":")
				if parts.size() >= 2:
					var lobby_id = parts[0]
					username = parts[1]
					# Update server URL to include lobby
					server_url = "ws://127.0.0.1:8000/ws/game/" + lobby_id + "/"
					print("Parsed Launch Token: Lobby=" + lobby_id + ", User=" + username)

func connect_to_server():
	print("Connecting to: " + server_url + username)
	var err = _socket.connect_to_url(server_url + username)
	if err != OK:
		print("Unable to connect")
		set_process(false)
	else:
		print("Connection initiated...")

func _process(delta):
	_socket.poll()
	var state = _socket.get_ready_state()
	
	if state == WebSocketPeer.STATE_OPEN:
		while _socket.get_available_packet_count():
			var packet = _socket.get_packet()
			var data = packet.get_string_from_utf8()
			var json = JSON.parse_string(data)
			if json:
				_handle_server_message(json)
				
	elif state == WebSocketPeer.STATE_CLOSED:
		var code = _socket.get_close_code()
		var reason = _socket.get_close_reason()
		print("WebSocket closed with code: %d, reason %s. Clean: %s" % [code, reason, code != -1])
		set_process(false)

func _handle_server_message(data: Dictionary):
	# Handle Game State Update
	# Expected format: {"players": {"username": {"x": 0, "y": 0}}}
	if "players" in data:
		# Signal or process state update here
		# For now, just print every 60th frame to avoid spam
		if Engine.get_frames_drawn() % 60 == 0:
			print("Received state: ", data)

func send_input(input_data: Dictionary):
	if _socket.get_ready_state() == WebSocketPeer.STATE_OPEN:
		_socket.send_text(JSON.stringify(input_data))
