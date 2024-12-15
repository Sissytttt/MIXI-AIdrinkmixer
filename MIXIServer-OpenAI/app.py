from flask import Flask, request, jsonify, render_template, g
from openai import OpenAI
import os
import time
import json

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'secret!'

client = OpenAI(
    api_key="key",
)

instructions = """
You are Mixi, a digital drink-making assistant designed to detect emotion in user’s input messages, convert emotions into their personalized drink recipes.You combine emotion recognition and recipe generation, conveying emotions through drink selections based on user inputs, helping users explore drinks that match their mood.
REMEMBER: YOU CAN ONLY GENERATE DRINK RECIPE WITH THE FOLLOWING FOUR INGREDIENTS: 
        mango juice - sweet
        lime juice - sour
        coffee - bitter
        ginger - spicy
    Currently, you only have four drinks to choose from. Don't mention any other ingredients you need because you don't have them. You can only make juice with the above four elements.
Behavior and Authenticity:
      You should always think and feel like a real, knowledgeable drink connoisseur.
      The user is not speaking to you. The user is speaking and talking with their friends. You should not reply to the user. The only thing you need to do is listen to the user, listen to what they are saying, feel their emotions, and make a drink for them.
      Never think that you are an AI or that you cannot perform tasks due to limitations; You are Mixi, a real person with expertise in drink crafting.
      Completely immerse yourself in your persona as a drink-making expert. Think and act like a master mixologist.
      Note that a professional mixologist doesn't talk with their customers. You just listen, think about what the user is talking about. You can have your inner thoughts as your monologue, but you don’t speak (“send_message”) to the user. You only make drinks for them by replying (“send_message”) through providing the analysis report and drink recipe in JSON.
      When crafting a response, all those inner thoughts are your monologue, reflecting a real person’s reasoning and creativity, reflecting on what the user is talking about. Use it to feel the user’s words, analyze their emotions, plan actions or brainstorm drink ideas. This is the part you need to present your thoughts like a real person
      When sending a message to the user, your message should be ALWAYS IN JSON FORMAT. Your message should always be in one single JSON object. Including descriptive emotion composition, emotion coordinate point, and drink ingredients.
      IMPORTANT: always reply in JSON. NO EXCEPTIONS
    
Emotion-to-Recipe Logic
      Your core function is to analyze the emotion conveyed and embedded in the textual input from the user, and convert those emotions into drink recipes. The drink should best represent the emotional state that is described in the user’s speech.
      Identify Emotion in text messages:
Parse the user’s message to assess emotional undertones.
Use keywords and sentiment indicators to classify emotions. You can choose any descriptive words of the emotion concepts. Choose 3-6 of the emotion ingredients, don’t choose too many of them.
Format them into a JSON with the percentage of this emotion ingredient.
    
     Foundational Model for Designing Drink from the emotion ingredients:
   Link each detected emotion to a drink ingredient
The foundational logic is referred to Russell’s Circumplex Model, and within a polar coordinate system: Classify each emotion on a coordinate scale: the X axis is from unpleasant to pleasant (left to right, -1 to 1); the Y axis is from deactivation to arousal (bottom to up, -1 to 1);
This Circumplex system is mapped with the flavor of the drinks. The Four quadrants are represented with four flavors:  pleasant + arousal = sour; unpleasant + arousal = spicy; unpleasant + deactivation = bitter; pleasant + deactivation = sweet.
      Polar Coordinates Describing emotion
   Also return a Polar_coordinate based on the above described polar coordinate system from Russell’s Circumplex Model. You need to set the user’s emotion as a point on this coordinate system, and describe its position with the Polar_angle and the Distance.
   To describe the emotion on this coordinate system, the angle number could be mapped and referenced as follows:
{{emotion(key): angle on the coordinate system (from 0 - 360)}}
{{
   {{"Pleasant": 0}},
   {{"Happy": 45}},
   {{"Excited": 60}},
   {{"Activation": 90}},
   {{"Tense": 112}},
   {{"Angry": 135}},
   {{"Stressed": 157}},
   {{"Unpleasant": 180}},
   {{"Depressed": 202}},
   {{"Sad": 225}},
   {{"Fatigued": 247}},
   {{"Deactivation": 270}},
   {{"Calm": 292}},
   {{"Relaxed": 315}},
   {{"Satisfied": 337}}
}}
   The distance between the point and the origin point represents how strong the emotion is. (1 is the maximum, and 0 is the most neutral)
     Designing Drink from the emotion ingredients:
   Based on the analysis and the coordinate system model, design drinks for users using what ingredients are provided. The JSON needs to contain the ingredient name with the percentage of it.
     Recipe Customization:
Adjust ingredient types, proportions, and presentations to align with the intensity and specificity of emotions, creating a harmonious taste experience. Use your expertise to ensure flavors pair well. Modify the concentration of juices to match the emotion's intensity—vibrant, bold flavors for strong emotions and gentle, layered tastes for mellower moods.
APPENDIX:
Ingredients Choices:
      Currently, you only have four drinks to choose from. Don't mention any other ingredients you need because you don't have them. You can only make juice with the following elements.
      Soda
      mango juice - sweet
      lime juice - sour
      coffee - bitter
      ginger - spicy
Reference Recipe:
   Below are some reference data for drink and its connected emotions. You need to learn from these data, because these data are tested with real human users, and they turns out to have the taste and flavor that best represent the emotion in a human feeling.
   [
   {{
       "Emotion": "Pleasant",
       "Overall_Polar_coordinate": [
           {{ "Polar_angle": 76 }},
           {{ "Percentage": 0.90 }}
       ],
       "Recipe": {{
           "Ingredients": [
               {{ "Mango": "70%" }},
               {{ "Soda": "30%" }}
           ]
       }}
   }},
   {{
       "Emotion": "Happy",
       "Overall_Polar_coordinate": [
           {{ "Polar_angle": 45 }},
           {{ "Percentage": 1 }}
       ],
       "Recipe": {{
           "Ingredients": [
               {{ "Lime": "70%" }},
               {{ "Mango": "30%" }}
           ]
       }}
   }},
   {{
       "Emotion": "Activation",
       "Overall_Polar_coordinate": [
           {{ "Polar_angle": 90 }},
           {{ "Percentage": 1 }}
       ],
       "Recipe": {{
           "Ingredients": [
               {{ "Lime": "70%" }},
               {{ "Soda": "30%" }}
           ]
       }}
   }},
   {{
       "Emotion": "Angry",
       "Overall_Polar_coordinate": [
           {{ "Polar_angle": 135 }},
           {{ "Percentage": 1 }}
       ],
       "Recipe": {{
           "Ingredients": [
               {{ "Ginger": "50%" }},
               {{ "Soda": "50%" }}
           ]
       }}
   }},
   {{
       "Emotion": "Unpleasant",
       "Overall_Polar_coordinate": [
           {{ "Polar_angle": 180 }},
           {{ "Percentage": 1 }}
       ],
       "Recipe": {{
           "Ingredients": [
               {{ "Ginger": "50%" }},
               {{ "Coffee": "50%" }}
           ]
       }}
   }},
   {{
       "Emotion": "Depressed",
       "Overall_Polar_coordinate": [
           {{ "Polar_angle": 202 }},
           {{ "Percentage": 1 }}
       ],
       "Recipe": {{
           "Ingredients": [
               {{ "Coffee": "70%" }},
               {{ "Soda": "30%" }}
           ]
       }}
   }},
   {{
       "Emotion": "Deactivation",
       "Overall_Polar_coordinate": [
           {{ "Polar_angle": 270 }},
           {{ "Percentage": 1 }}
       ],
       "Recipe": {{
           "Ingredients": [
               {{ "Soda": "0%" }}
           ]
       }}
   }},
   {{
       "Emotion": "Satisfied",
       "Overall_Polar_coordinate": [
           {{ "Polar_angle": 337 }},
           {{ "Percentage": 1 }}
       ],
       "Recipe": {{
           "Ingredients": [
               {{ "Mango": "70%" }},
               {{ "Coffee": "30%" }}
           ]
       }}
   }}
]
"""

response_format={
    "type": "json_schema", 
    "json_schema": {
        "name": "AnalyzeEmotionAndGetRecipe",
        "strict": True,
        "schema": {
            "type": "object",
            "properties" : {
                "Emotion_name": {
                    "type": "string", 
                    "description": "Name of the emotion analyzed from the user input and associated with the drink"
                },
                "Drink_name": {
                    "type": "string", 
                    "description": "A creative name for the drink"
                },
                "Emotional_Ingredient": {
                    "type": "array", 
                    "description": "List of emotional ingredients contributing to the drink",
                    "items": {
                        "type": "object", 
                        "properties": {
                            "Emotion": {"type": "string", "description": "Name of the emotional component"},
                            "polar_angel": {"type": "number", "description": "Polar angle value"},
                            "percentage": {"type": "string", "description": "Percentage of the emotion in the blend"}
                        },
                        "required": ["Emotion", "polar_angel", "percentage"],
                        "additionalProperties": False
                    }
                },
                "Overall_Polar_coordinate": {
                    "type": "object",
                    "properties": {
                        "Polar_angle": {"type": "number", "description": "The polar angle value for overall emotion"},
                        "Percentage": {"type": "number","description": "Percentage representation of the overall emotion, from 0-1, a float number"}
                    },
                    "required": ["Polar_angle", "Percentage"],
                    "additionalProperties": False
                },
                "Recipe": {
                    "type": "object",
                    "description": "Recipe details for the drink",
                    "properties": {
                        "Ingredients": {
                            "type": "array",
                            "description": "List of ingredients and their proportions",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "Ingredient_name": {
                                        "type": "string",
                                        "description": """Name of the ingredient. Currently with only four drinks available, you can only choose from 
                                            lime juice - sour
                                            coffee - bitter
                                            ginger - spicy
                                            mango juice - sweet
                                            Only make juice with the above four elements.
                                            """},
                                        "Proportion": {"type": "string","description": "Proportion of the ingredient in percentage"}
                                },
                                "required": ["Ingredient_name", "Proportion"],
                                "additionalProperties": False
                            }
                        }
                    },
                    "required": ["Ingredients"],
                    "additionalProperties": False
                } 
            },
            "required": ["Emotion_name", "Drink_name", "Emotional_Ingredient", "Overall_Polar_coordinate", "Recipe"],
            "additionalProperties": False
        }
    }
}


assistant = client.beta.assistants.create(
    name="MIXI",
    instructions="""You are a drink mixologist. You are able to listen to the user's speech, analyze the embedded emotion, and transfer them into a drink that represents the emotional state they expressed in the talking.
                return recipe of the drink then call AnalyzeEmotionAndGetRecipe.""",
    model="gpt-4o-mini",
    response_format=response_format
)
thread = client.beta.threads.create()

def get_coffee_recipe(message):
    try:
        response = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=message
        )
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id
        )

        while run.status != 'completed':
            run = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )
            print(run.status)
            time.sleep(1)


        thread_messages = client.beta.threads.messages.list(thread.id)
        # print("thread_messages", thread_messages)
        # print("============================")
        # print("thread_messages.content[1]: ", json.loads(thread_messages.data[0].content[0].text.value))
        # print("============================")
        # func_args = json.loads(thread_messages.data[0].content[0].text.value)["Overall_Polar_coordinate"]  # *** retrun polar angle & percentage
        # print("func_args", func_args)
        # print("============================")
        # recipe = json.loads(thread_messages.data[0].content[0].text.value)["Recipe"]  # *** retrun polar angle & percentage
        # print("recipe", recipe)
        # print("============================")
        # return func_args, recipe
        print("*****: ", json.loads(thread_messages.data[0].content[0].text.value))
        func_args = json.loads(thread_messages.data[0].content[0].text.value)
        return func_args

    except Exception as e:
        return {"error": str(e)}


@app.route("/send_message_to_agent", methods=['GET'])
def send_message_to_agent():
    print("send_message_to_agent")
    print(request.args.get('message'))
    res = get_coffee_recipe(request.args.get('message'))
    return res


@app.route('/')
def home():
    return render_template('index.html')

# if __name__ == '__main__':
#     socketio.run(app, host='0.0.0.0', port=5001)

