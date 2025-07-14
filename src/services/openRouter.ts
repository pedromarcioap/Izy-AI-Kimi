interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  apiKey: string;
  baseUrl?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class OpenRouterService {
  private configs: ModelConfig[] = [];

  async loadConfigs() {
    const stored = await chrome.storage.sync.get('modelConfigs');
    this.configs = stored.modelConfigs || [];
  }

  async addConfig(config: ModelConfig) {
    this.configs.push(config);
    await this.saveConfigs();
  }

  async removeConfig(id: string) {
    this.configs = this.configs.filter(c => c.id !== id);
    await this.saveConfigs();
  }

  private async saveConfigs() {
    await chrome.storage.sync.set({ modelConfigs: this.configs });
  }

  async chat(messages: ChatMessage[], modelId: string) {
    const config = this.configs.find(c => c.id === modelId);
    if (!config) throw new Error('Model not found');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ai-assistant-extension.com',
        'X-Title': 'AI Assistant Pro'
      },
      body: JSON.stringify({
        model: config.name,
        messages,
        stream: true
      })
    });

    return response;
  }

  getConfigs() {
    return this.configs;
  }
}

export const openRouter = new OpenRouterService();
