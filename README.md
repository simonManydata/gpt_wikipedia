# [Wikipedia Pages](https://gpt-wikipedia.vercel.app/)

This project generates "Wikipedia pages" using AI.

This project is heavily inspired by Twitter bio generator by [Nutlope](https://vercel.com/templates/next.js/twitter-bio)

## How it works

This project uses the [OpenAI GPT-3 API](https://openai.com/api/) (specifically, text-davinci-003) and [Vercel Edge functions](https://vercel.com/features/edge-functions) with streaming. It constructs a prompt based on the form and user input, sends it to the GPT-3 API via a Vercel Edge function, then streams the response back to the application.

## Running Locally

After cloning the repo, go to [OpenAI](https://beta.openai.com/account/api-keys) to make an account and put your API key in a file called `.env`.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

Before running the application, you need to install the dependencies:

```bash
npm install
```

Then, run the application:

```bash
npm run dev
```
