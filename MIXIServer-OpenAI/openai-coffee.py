import openai
import json

# Initialize OpenAI client
openai.api_key = "KEY"

# Function to handle coffee recipe details
def get_lever_coffee_recipe(args):
    print("Coffee Name:", args.get("name"))
    print("Coffee Type:", args.get("type"))
    print("Grind Size:", args.get("size"))
    print("Temperature:", args.get("temperature"))
    print("Pressure:", args.get("pressure"))
    print("Amount of Coffee:", args.get("a_coffee"))
    print("Amount of Water:", args.get("a_water"))
    print("Brewing Time:", args.get("b_time"))
    print("Pre-infusion:", args.get("p_infusion"))
    print("Extraction Style:", args.get("style"))
    print("Water Quality:", args.get("quality"))
    print("Milk:", args.get("milk"))
    print("Tasting Notes:", args.get("taste_note"))
    print("Serving Size:", args.get("serving_size"))
    print("Coffee recipe:", args.get("steps"))

# Function definitions
definitions = [
    {
        "name": "getLeverCoffeeRecipe",
        "description": "Give me the recipe of coffee using lever coffee machine",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Coffee Name"},
                "type": {"type": "string", "description": "Coffee Type"},
                "size": {"type": "string", "description": "Grind Size"},
                "temperature": {"type": "string", "description": "Temperature"},
                "pressure": {"type": "string", "description": "Pressure"},
                "a_coffee": {"type": "string", "description": "Amount of Coffee"},
                "a_water": {"type": "string", "description": "Amount of Water"},
                "b_time": {"type": "string", "description": "Brewing Time"},
                "p_infusion": {"type": "string", "description": "Pre-infusion"},
                "style": {"type": "string", "description": "Extraction Style"},
                "quality": {"type": "string", "description": "Water Quality"},
                "milk": {"type": "string", "description": "Milk"},
                "taste_note": {"type": "string", "description": "Tasting Notes"},
                "serving_size": {"type": "string", "description": "Serving Size"},
                "steps": {
                    "type": "array",
                    "items": {"type": "string", "description": "Coffee recipe"}
                },
            },
            "required": [
                "name", "type", "size", "temperature", "pressure", "a_coffee",
                "a_water", "b_time", "p_infusion", "style", "quality", "milk",
                "taste_note", "serving_size", "steps"
            ],
        },
    },
]

# Chat completion call
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "For a given coffee name, return recipe of the coffee then call get_lever_coffee_recipe()."},
        {"role": "user", "content": "civet coffee"},
    ],
    functions=definitions,
    function_call="auto"  # Explicitly request the model to call functions if necessary
)

# Extract function arguments and call the function
if response["choices"][0]["message"].get("function_call"):
    func_args = json.loads(response["choices"][0]["message"]["function_call"]["arguments"])
    get_lever_coffee_recipe(func_args)
