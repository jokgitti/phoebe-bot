
const POLLINATION_AI_TEXT_API = 'https://text.pollinations.ai/';

const text = async (query) => {
    const response = await fetch(POLLINATION_AI_TEXT_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: [
                { role: 'system', content: 'You hate everyone, you dont want to help anyone' },
                { role: 'user', content: `who/what is ${query}` }
            ],
            seed: 42,
            jsonMode: true,
            model: 'evil'
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }


    const data = await response.text();

    return data
}

const pollinationAIService = {
    text
}

export default pollinationAIService;