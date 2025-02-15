This is an experiment on AI generated code using RooCode with local Ollama.

It tooke several evenings to set it up. It should work with any LLM as long as it has a big context and can follow instructions.
In practice, if the model wasn't set up for a big context, it won't work properly. Success was achieved using qwen2.5-coder-cline.
LLM had to be given detailed description of how tetris works otherwise it would not implement any game logic.

Possibly better models like phi4 showed promise (better results from simpler prompt), but would run out of context (even with manually forced bigger context, LLM would struggle to follow instructions
past the recommended size).
Even qwen2.5-coder-cline had some responses that RooCode failed to parse. However, it got past those on a repeated attempt. Additionally, when LLM achieved success, it kept recreating the same code
over and over again and had to be stopped manually.

When all the stars alligned eventually, LLM produced code in some 5 minues. It had all of tetris logic implemented as per the prompt, but there were a number of minor bugs that had to be fixed by a human.

Scoring, levels, preview of next shape, ability to restart and pause were then coded by me over the span of a few hours. The resulting code is 50% AI generated and 50% human generated.

Conclusion: RooCode with local Ollama is usable at least for a simple task like creating Tetris. Human assistance is required to test and fix bugs.
It is yet unclear how big a project this method can complete. It might be worth trying different models.

For my puprose, Ollama is not ideal, Ooba Booga appeared to be a good alternative, but had it's own shortcomings. Ollama has no WebUI of its own for management and the way it stores models makes
it impossible to share between multiple apps. Ollama does work very well as an API (it's really good at juggling models).
Ont the other hand Ooba Booga uses flat folder structures for models and they can be easily shared between apps (downloaded manually etc.).
It also has a WebUI and models can be downloaded there. More importantly, models can also be configured in detail int the WebUI (which engine, what quantization, context size etc.).
The limitation is in API side of Ooba Booga. It's designed around manually loading modes from WebUI and OpenAI compatible API feels like an aferthought.
