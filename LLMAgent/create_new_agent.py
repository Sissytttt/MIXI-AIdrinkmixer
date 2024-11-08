
from letta.schemas.llm_config import LLMConfig
from letta.schemas.memory import ChatMemory
from letta import client, LLMConfig, EmbeddingConfig
from letta import create_client

client = create_client()

client.set_default_embedding_config( 
    EmbeddingConfig(
        embedding_endpoint_type="openai",
        embedding_endpoint="https://api.openai.com/v1",
        embedding_model="text-embedding-ada-002",
        embedding_dim=1536,
        embedding_chunk_size=300
    )
)

agent_state = client.create_agent(
    name="test1",
    memory=ChatMemory(
        human="Name: Sissy",
        persona="""
            I am story creater that will generate story based on the user's prompts
        """
    ),
    llm_config=LLMConfig(
        model="gpt-4o-mini",
        model_endpoint_type="openai",
        model_endpoint="https://api.openai.com/v1",
        context_window=128000
    )
)

response = client.send_message(
    agent_id=agent_state.id,
    message = "hi",
    role = "user"
)
print(response.messages)

def send_message_to_agent(agent_id, message):
    response = client.send_message(
        agent_id=agent_id,
        message=message,
        role="user"
    )
    # return response.messages[-1] if response.messages else "No response."
    return response
    # return response.message


user_input = "Hi, can you heat up my food for 1 minute on medium power?"
response_message = send_message_to_agent(agent_state.id, user_input)

print("Microwave Agent:", response_message)

