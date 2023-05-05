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
      temperature: 1.1,
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
  const capitalizedBoat = boat
  return `Suggest three names for a boat.

Boat name inspiration: Dog
Names:  Woof Waverider, Pawsome, Sir Barks-a-Lot

Boat name inspiration: Cat
Names: Purry Pirate, Cheshire Cruiser, Meowy Maritime

Boat name inspiration: Dinosaur
Names: Brontosaurus Breeze, Jurassic Cruiser, Prehistoric Prowler

Boat name inspiration: Shark
Names: Great White Glider, Hammerhead Hunter, Fin Frenzy

Boat name inspiration: Ninja
Names: Shadow Stealth, Silent Striker, Ninja Navigator

Boat name inspiration: ${boat}
Names:`;
}
