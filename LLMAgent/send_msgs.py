# agent name to interact with:
agent_name = "test"

from letta import create_client 
import json

client = create_client() 

# # get an agent by ID
# agent_state = client.get_agent(agent_id="agent-550c7979-26e3-4b6b-beda-b77de3fe9de6")

# get an agent by Name
agent_state = client.get_agent(
    client.get_agent_id(agent_name)
)

# interact with the agent 
response = client.user_message(agent_state.id, message="hello")
function_call_message = response.messages[1]
arguments = function_call_message.function_call.arguments
args_dict = json.loads(arguments)
print(args_dict["message"])