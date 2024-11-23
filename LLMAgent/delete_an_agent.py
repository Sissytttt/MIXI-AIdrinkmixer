agent_name = "MIXItest" # agent to delete
# agent_name = "test"

from letta import create_client 
client = create_client()

# delete an agent by ID 
# client.delete_agent(agent_state.id)

# delete an agent by name 
client.delete_agent(client.get_agent_id(agent_name))


