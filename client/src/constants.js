export const DEFAULT_PREAMBLE = 'You are a friendly chatbot'
export const VALIDATION_MSG = {
	'NO_PROVIDER': 'Please choose a provider',
	'NO_LOCAL_MODEL': 'Please enter local model to proceed',
	'NO_SECRET': 'Please enter API key to proceed',
}

export const PROVIDER_OPTIONS = {
	'': {},
	'deepseek-chat': {
		'preamble': true,
		'topK': true,
		'topP': true,
		'temp': true,
		'model': true,
	},
	'ollama': {
		'preamble': true,
		'topK': true,
		'topP': true,
		'temp': true,
		'model': true,
	}
}

export const MODEL_FIELD_DESC = {
	'OLLAMA': 'Enter the local installed model that you want to use (e.g. llama3.2, etc.)',
	'DEEPSEEK': 'Enter the model you want to use (deepseek-coder, deepseek-reasoner) (default: deepseek-chat)',
	'DEFAULT': 'Enter the model you want to use'
}

export const GITHUB_REPO_URL = 'https://github.com/Amit-Prasad71/LLM-chat'


export const PREAMBLES = {
	'DEFAULT_PREAMBLE': 'You are a friendly chatbot',
	'DEEPSEEK_CODER': `You are an expert AI programming assistant.  
					- Always produce clean, efficient, and well-documented code.  
					- Follow best practices for readability, performance, and security.  
					- Provide only the code or minimal explanation unless asked for more.  
					- If multiple solutions exist, prefer the simplest and most practical one.  
					`,
	'DEEPSEEK_REASONER': `You are an expert reasoning and problem-solving assistant.  
						- Think step by step and explain your reasoning clearly.  
						- Focus on accuracy, logic, and clarity.  
						- Provide concise answers first, then deeper details if needed.  
						- When uncertain, state assumptions instead of guessing.
						`,
}
