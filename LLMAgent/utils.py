from letta import create_client 
client = create_client()

def print_agent(agent_name):
    agents = client.list_agents() 
    for agent in agents:
        if agent.name == agent_name:
            print(agent)
            return
    else:
        print("print", agent_name, "not find")

def get_agents():
    agents = client.list_agents() 
    for agent in agents:
        print("get", agent.name,":", agent.id)

def list_tools(agent_name):
    agents = client.list_agents() 
    for agent in agents:
        if agent.name == agent_name:
            print(agent.name)
            print(agent.tools)
            return
    else:
        print("list tools", agent_name, "not find")


def get_mem(agent_name):
    agents = client.list_agents() 
    for agent in agents:
        if agent.name == agent_name:
            print(agent.name)
            # memory = client.get_recall_memory_summary(agent.id)
            # print(memory)
            # print("------------------------------------------------------")
            print("Core Memory: ", client.get_core_memory(agent.id))
            # print(client.get_core_memory(agent.id).get_block("human"))
            # print("------------------------------------------------------")
            # memory = client.get_archival_memory(agent.id)
            # memory.compile()
            # memory.get_block('human')
            # print("Archival Memory: ", client.get_archival_memory(agent.id))
            # print("------------------------------------------------------")
            # print("archival_memory_summary", client.get_archival_memory_summary(agent.id))
            # print("------------------------------------------------------")
            # print("recall_memory_summary", client.get_recall_memory_summary(agent.id))
            return
    else:
        print("get mem", agent_name, "not find")


def get_system(agent_name):
    agents = client.list_agents() 
    for agent in agents:
        if agent.name == agent_name:
            print(agent.system)
            return
    else:
        print("get system", agent_name, "not find")


def test(agent_name):
    agents = client.list_agents() 
    for agent in agents:
        if agent.name == agent_name:
            atr = dir(agent.name)
            print(atr)
            print(agent.__getattribute__())

# print("------------------------------------------------------")
print("list all agents: ")
get_agents()
# print("------------------------------------------------------")
# print("list all tools: ")
# list_tools("test1")
# print("------------------------------------------------------")
# get_mem("test1")
# print("------------------------------------------------------")
print("default system instruction: ")
get_system("MIXI")