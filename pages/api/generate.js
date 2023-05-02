 import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});


const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const boat = req.body.boat || '';
  if (boat.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter word(s) to inspire boat names",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(boat),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(boat) {
  const capitalizedBoat =
    boat[0].toUpperCase() + boat.slice(1).toLowerCase();
  return `Suggest three names for a boat.

Boat name inspiration: Cat
Names: Captain Sharpclaw,  Agent Fluffball,  The Incredible Feline
Boat name inspiration: Dog
Names:  Ruff the Protector,  Wonder Canine,  Sir Barks-a-Lot
Boat name inspiration: ${capitalizedBoat}
Names:`;
}
