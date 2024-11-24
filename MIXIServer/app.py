from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import sys
import os
# Add the parent directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from init_server import init_letta

# start server
app = Flask(__name__)
CORS(app)

# init letta
init_letta()


@app.route("/send_message_to_agent", methods=['GET'])
def send_message_to_agent():
    print(client)
    print(agent_state.id)
    print(request.args.get('message'))
    try:
        response = client.send_message(
            agent_id=agent_state.id,
            message=request.args.get('message'),
            role="user"
        )
        res = json.loads(json.loads(response.messages[1].function_call.arguments)["message"])["Recipe"]
        print("data: ", response)

        return jsonify({"msg": res})
    except Exception as e:
        print("error: ", e)
        return jsonify({"e": e})
    

@app.route("/delete_an_agent", methods=['GET'])
def delete_an_agent():
    agent_name = request.args.get('agent_name')
    client.delete_agent(client.get_agent_id(agent_name))
    return "Delete"


@app.route('/')
def home():
    return render_template('index.html')
