import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, Save } from 'lucide-react';

import { autokeyCipher as cipher } from './utils/cipher';

const VigenereCipher: React.FC = () => {
  const [key, setKey] = useState('');
  const [encodeText, setEncodeText] = useState('');
  const [encodeResult, setEncodeResult] = useState('');
  const [decodeText, setDecodeText] = useState('');
  const [decodeResult, setDecodeResult] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleEncodeProcess = () => {
    if (!encodeText || !key) {
      setEncodeResult('');
      return;
    }
    
    const processed = cipher(encodeText, key, true);
    setEncodeResult(processed);
  };

  const handleDecodeProcess = () => {
    if (!decodeText || !key) {
      setDecodeResult('');
      return;
    }
    
    const processed = cipher(decodeText, key, false);
    setDecodeResult(processed);
  };

  const handleSave = async () => {
    if (!key || !encodeText || !encodeResult) {
      return;
    }

    setSaving(true);
    setSaveMessage('');

    try {
      //const response = await fetch('http://localhost:5000/api/spyviews',
      const response = await fetch('https://vigenere-backend.onrender.com/api/spyviews',
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: key,
          plaintext: encodeText,
          ciphertext: encodeResult
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error('Failed to save');
      }

      const data = await response.json();
      setSaveMessage('✅ SpyView saved successfully!');
      console.log('Saved SpyView:', data);
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('❌ Failed to save SpyView');
      console.error('Error:', error);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    const textToCopy = mode === 'encode' ? encodeResult : decodeResult;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearKey = () => {
    setKey('');
  };

  const handleClearText = () => {
    if (mode === 'encode') {
      setEncodeText('');
    } else {
      setDecodeText('');
    }
  };

  const switchMode = (newMode: 'encode' | 'decode') => {
    // if (mode === 'encode' && newMode === 'decode' && encodeResult && !saving) {
    //   handleSave();
    // }

    setMode(newMode);
  };

  React.useEffect(() => {
    if (mode === 'encode') {
      handleEncodeProcess();
    } else {
      handleDecodeProcess();
    }
  }, [key, encodeText, decodeText, mode]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (mode === 'encode' && encodeResult && !saving) {
        handleSave();
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [mode, encodeResult, saving]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mt-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Vigenère Autokey Cipher
            </h1>
            <p className="text-gray-600">
              A classic polyalphabetic substitution cipher
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              <button
                onClick={() => switchMode('encode')}
                className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  mode === 'encode'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Lock size={18} />
                Encode
              </button>
              <button
                onClick={() => switchMode('decode')}
                className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  mode === 'decode'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Unlock size={18} />
                Decode
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Key Primer (Letters only)
              </label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your key (e.g., SECRET)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only letters will be used. Non-alphabetic characters will be ignored.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {mode === 'encode' ? 'Plain Text' : 'Cipher Text'}
              </label>
              <textarea
                value={mode === 'encode' ? encodeText : decodeText}
                onChange={(e) => mode === 'encode' ? setEncodeText(e.target.value) : setDecodeText(e.target.value)}
                placeholder={`Enter text to ${mode}...`}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors resize-none text-lg"
              />
            </div>

            {(mode === 'encode' ? encodeResult : decodeResult) && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {mode === 'encode' ? 'Cipher Text' : 'Plain Text'}
                  </label>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="w-full px-4 py-3 bg-indigo-50 border-2 border-indigo-200 rounded-lg text-lg whitespace-pre-wrap break-words min-h-[150px]">
                  {mode === 'encode' ? encodeResult : decodeResult}
                </div>
              </div>
            )}

            {/* SAVE BUTTON {mode === 'encode' && encodeResult && (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save SpyView'}
                </button>
                
                {saveMessage && (
                  <div className={`text-sm font-medium ${
                    saveMessage.includes('✅') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {saveMessage}
                  </div>
                )}
              </div>
            )} */}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">How it works:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• The secret key is used to encrypt the plaintext</li>
              <li>• To decrypt the resulting ciphertext, the same key is necessary</li>
              <li>• Each letter in the key determines how many 'positions' to shift</li>
              <li>• Non-alphabetic characters (spaces, punctuation) remain unchanged</li>
            </ul>
            <h3 className="font-semibold text-gray-700 mb-2 mt-10 text-center">Application created by Rohan Iyer</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VigenereCipher;