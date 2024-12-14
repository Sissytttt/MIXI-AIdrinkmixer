"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var openai_1 = require("openai");
var client = new openai_1.default({
    apiKey: process.env.OPENAI_KEY,
});
function getLeverCoffeeRecipe(args) {
    console.log("Coffee Name: ", args.name);
    console.log("Coffee Type: ", args.type);
    console.log("Grind Size: ", args.size);
    console.log("Temperature: ", args.temperature);
    console.log("Pressure: ", args.pressure);
    console.log("Amount of Coffee: ", args.a_coffee);
    console.log("Amount of Water: ", args.a_water);
    console.log("Brewing Time: ", args.b_time);
    console.log("Pre-infusion: ", args.p_infusion);
    console.log("Extraction Style: ", args.style);
    console.log("Water Quality: ", args.quality);
    console.log("Milk: ", args.milk);
    console.log("Tasting Notes: ", args.taste_note);
    console.log("Serving Size: ", args.serving_size);
    console.log("Coffee recipe: ", args.steps);
}
var definitions = [
    {
        name: "getLeverCoffeeRecipe",
        description: "Give me the recipe of coffee using lever coffee machine",
        parameters: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Coffee Name"
                },
                type: {
                    type: "string",
                    description: "Coffee Type"
                },
                size: {
                    type: "string",
                    description: "Grind Size"
                },
                temperature: {
                    type: "string",
                    description: "Temperature"
                },
                pressure: {
                    type: "string",
                    description: "Pressure"
                },
                a_coffee: {
                    type: "string",
                    description: "Amount of Coffee"
                },
                a_water: {
                    type: "string",
                    description: "Amount of Water"
                },
                b_time: {
                    type: "string",
                    description: "Brewing Time"
                },
                p_infusion: {
                    type: "string",
                    description: "Pre-infusion"
                },
                style: {
                    type: "string",
                    description: "Extraction Style"
                },
                quality: {
                    type: "string",
                    description: "Water Quality"
                },
                milk: {
                    type: "string",
                    description: "Milk"
                },
                taste_note: {
                    type: "string",
                    description: "Tasting Notes"
                },
                serving_size: {
                    type: "string",
                    description: "Serving Size"
                },
                steps: {
                    type: "array",
                    items: {
                        type: "string",
                        description: "Coffee recipe"
                    }
                }
            },
            required: ["name", "type", "size", "temperature", "pressure", "a_coffee", "a_water", "b_time", "p_infusion", "style", "quality", "milk", "taste_note", "serving_size", "steps"],
        },
    },
];
client.chat.completions
    .create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "For a given coffee name, return recipe of the coffee then call getLeverCoffeeRecipe().",
            },
            {
                role: "user",
                content: "civet coffee",
            },
        ],
        function_call: "auto", // "auto" is default but we'll make it explicit
        functions: definitions,
    })
    .then(function (data) {
        var funcArgs = JSON.parse(data.choices[0].message.function_call.arguments);
        return getLeverCoffeeRecipe(funcArgs);
    });
