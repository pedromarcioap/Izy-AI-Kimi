import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { openRouter } from '../../services/openRouter';

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  apiKey: string;
  baseUrl?: string;
}

export const ModelManager: React.FC = () => {
  const [configs, setConfigs] = useState<ModelConfig[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newConfig, setNewConfig] = useState<ModelConfig>({
    id: '',
    name: '',
    provider: '',
    apiKey: '',
    baseUrl: ''
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    await openRouter.loadConfigs();
    setConfigs(openRouter.getConfigs());
  };

  const handleAdd = async () => {
    if (!newConfig.name || !newConfig.apiKey) return;
    
    const config = {
      ...newConfig,
      id: Date.now().toString()
    };
    
    await openRouter.addConfig(config);
    setNewConfig({ id: '', name: '', provider: '', apiKey: '', baseUrl: '' });
    setIsAdding(false);
    await loadConfigs();
  };

  const handleDelete = async (id: string) => {
    await openRouter.removeConfig(id);
    await loadConfigs();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Modelos de IA</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg px-3 py-1 text-white text-sm hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <input
            type="text"
            placeholder="Nome do modelo"
            value={newConfig.name}
            onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
            className="w-full bg-gray-700 rounded px-3 py-2 text-white"
          />
          <select
            value={newConfig.provider}
            onChange={(e) => setNewConfig({ ...newConfig, provider: e.target.value })}
            className="w-full bg-gray-700 rounded px-3 py-2 text-white"
          >
            <option value="">Selecione o provedor</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
            <option value="meta">Meta</option>
          </select>
          <input
            type="password"
            placeholder="API Key"
            value={newConfig.apiKey}
            onChange={(e) => setNewConfig({ ...newConfig, apiKey: e.target.value })}
            className="w-full bg-gray-700 rounded px-3 py-2 text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-green-600 rounded px-3 py-1 text-white"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="bg-red-600 rounded px-3 py-1 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {configs.map(config => (
          <div key={config.id} className="bg-gray-800 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-white font-medium">{config.name}</h4>
                <p className="text-gray-400 text-sm">{config.provider}</p>
              </div>
              <button
                onClick={() => handleDelete(config.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
