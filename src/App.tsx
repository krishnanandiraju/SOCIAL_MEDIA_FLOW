import React, { useState, useCallback } from 'react';
import { Upload, Share2, Hash, QrCode, User, Settings, Image, Video, FileText, Calendar, Cloud, Facebook, Twitter, Instagram, Linkedin, Plus, X, Copy, Download, Trash2 } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  name: string;
  url: string;
  size: string;
  uploaded: string;
}

interface SocialPost {
  platform: string;
  content: string;
  media: MediaItem[];
  hashtags: string[];
  scheduled?: string;
}

interface Contact {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
}

interface CloudConfig {
  provider: string;
  apiKey: string;
  bucket: string;
  region: string;
  enabled: boolean;
}

function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [contact, setContact] = useState<Contact>({
    name: 'John Doe',
    title: 'Digital Marketing Specialist',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    website: 'www.johndoe.com',
    linkedin: 'linkedin.com/in/johndoe'
  });
  const [cloudConfigs, setCloudConfigs] = useState<CloudConfig[]>([
    { provider: 'AWS S3', apiKey: '', bucket: '', region: 'us-east-1', enabled: false },
    { provider: 'Google Cloud', apiKey: '', bucket: '', region: 'us-central1', enabled: false },
    { provider: 'Azure Blob', apiKey: '', bucket: '', region: 'eastus', enabled: false }
  ]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    files.forEach((file) => {
      const newItem: MediaItem = {
        id: Date.now().toString() + Math.random(),
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        name: file.name,
        url: URL.createObjectURL(file),
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        uploaded: new Date().toLocaleDateString()
      };
      setMediaItems(prev => [...prev, newItem]);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const generateHashtags = (content: string) => {
    const keywords = content.toLowerCase().match(/\b\w+\b/g) || [];
    const commonHashtags = ['#marketing', '#socialmedia', '#content', '#digital', '#brand', '#engagement', '#viral', '#trending', '#business', '#creative'];
    const contentHashtags = keywords
      .filter(word => word.length > 4)
      .slice(0, 5)
      .map(word => `#${word}`);
    setSuggestedHashtags([...contentHashtags, ...commonHashtags.slice(0, 8 - contentHashtags.length)]);
  };

  const generateQRCode = (mediaItem: MediaItem) => {
    // Simulate QR code generation
    const qrData = `https://example.com/media/${mediaItem.id}`;
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`);
  };

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' }
  ];

  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: Upload },
    { id: 'post', label: 'Create Post', icon: Share2 },
    { id: 'hashtags', label: 'Hashtags', icon: Hash },
    { id: 'qr', label: 'QR Codes', icon: QrCode },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'admin', label: 'Admin', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SocialFlow Pro
          </h1>
          <p className="text-gray-300">Complete Social Media Management Platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
          {activeTab === 'workspace' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Content Workspace</h2>
              
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-blue-400/50 rounded-xl p-12 text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
              >
                <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-xl text-white font-medium mb-2">Drag & Drop Your Content</p>
                <p className="text-gray-300">Images, videos, and documents supported</p>
              </div>

              {/* Media Library */}
              {mediaItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Media Library</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mediaItems.map((item) => {
                      const IconComponent = item.type === 'image' ? Image : item.type === 'video' ? Video : FileText;
                      return (
                        <div key={item.id} className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 group">
                          <div className="flex items-start justify-between mb-3">
                            <IconComponent className="w-8 h-8 text-blue-400" />
                            <button
                              onClick={() => setSelectedMedia(prev => 
                                prev.find(m => m.id === item.id) 
                                  ? prev.filter(m => m.id !== item.id)
                                  : [...prev, item]
                              )}
                              className={`p-1 rounded-lg transition-colors ${
                                selectedMedia.find(m => m.id === item.id)
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white/20 text-gray-300 hover:bg-white/30'
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <h4 className="text-white font-medium truncate mb-2">{item.name}</h4>
                          <div className="flex justify-between text-sm text-gray-300">
                            <span>{item.size}</span>
                            <span>{item.uploaded}</span>
                          </div>
                          {item.type === 'video' && (
                            <button
                              onClick={() => generateQRCode(item)}
                              className="mt-2 w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm hover:shadow-lg transition-all duration-300"
                            >
                              Generate QR Code
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'post' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Create Social Media Post</h2>
              
              {/* Platform Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Select Platforms</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {platforms.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => setSelectedPlatforms(prev => 
                          prev.includes(platform.id) 
                            ? prev.filter(p => p !== platform.id)
                            : [...prev, platform.id]
                        )}
                        className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                          selectedPlatforms.includes(platform.id)
                            ? `${platform.color} text-white shadow-lg`
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                        <span className="font-medium">{platform.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Input */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Post Content</h3>
                <textarea
                  value={postContent}
                  onChange={(e) => {
                    setPostContent(e.target.value);
                    generateHashtags(e.target.value);
                  }}
                  placeholder="What's on your mind? Share your thoughts..."
                  className="w-full h-32 p-4 bg-white/10 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:border-blue-400 focus:outline-none resize-none"
                />
              </div>

              {/* Selected Media */}
              {selectedMedia.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Attached Media</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMedia.map((item) => (
                      <span key={item.id} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {item.name}
                        <button
                          onClick={() => setSelectedMedia(prev => prev.filter(m => m.id !== item.id))}
                          className="hover:bg-blue-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Post Button */}
              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                <div className="flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Post to Selected Platforms
                </div>
              </button>
            </div>
          )}

          {activeTab === 'hashtags' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Hashtag Suggestions</h2>
              
              {suggestedHashtags.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Suggested for Your Content</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestedHashtags.map((hashtag, index) => (
                      <button
                        key={index}
                        onClick={() => navigator.clipboard.writeText(hashtag)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300"
                      >
                        {hashtag}
                        <Copy className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(suggestedHashtags.join(' '))}
                    className="mt-4 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                  >
                    Copy All Hashtags
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Hash className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Create content in the Post tab to generate hashtag suggestions</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">QR Code Generator</h2>
              
              {qrCodeUrl ? (
                <div className="text-center space-y-6">
                  <div className="inline-block p-4 bg-white rounded-xl">
                    <img src={qrCodeUrl} alt="Generated QR Code" className="w-48 h-48" />
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.download = 'qr-code.png';
                        link.href = qrCodeUrl;
                        link.click();
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                      Download QR Code
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Upload a video in the Workspace to generate its QR code</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Personal Profile</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                  {Object.entries(contact).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setContact(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Contact Card Preview</h3>
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-xl text-white">
                    <h4 className="text-xl font-bold mb-2">{contact.name}</h4>
                    <p className="text-blue-100 mb-4">{contact.title}</p>
                    <div className="space-y-2 text-sm">
                      <p>📧 {contact.email}</p>
                      <p>📱 {contact.phone}</p>
                      <p>🌐 {contact.website}</p>
                      <p>💼 {contact.linkedin}</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                    Generate Shareable Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Cloud Storage Configuration</h2>
              
              <div className="space-y-6">
                {cloudConfigs.map((config, index) => (
                  <div key={config.provider} className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Cloud className="w-6 h-6 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">{config.provider}</h3>
                      </div>
                      <button
                        onClick={() => {
                          const newConfigs = [...cloudConfigs];
                          newConfigs[index].enabled = !newConfigs[index].enabled;
                          setCloudConfigs(newConfigs);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          config.enabled
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {config.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">API Key</label>
                        <input
                          type="password"
                          value={config.apiKey}
                          onChange={(e) => {
                            const newConfigs = [...cloudConfigs];
                            newConfigs[index].apiKey = e.target.value;
                            setCloudConfigs(newConfigs);
                          }}
                          className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:border-blue-400 focus:outline-none"
                          placeholder="Enter API key"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Bucket Name</label>
                        <input
                          type="text"
                          value={config.bucket}
                          onChange={(e) => {
                            const newConfigs = [...cloudConfigs];
                            newConfigs[index].bucket = e.target.value;
                            setCloudConfigs(newConfigs);
                          }}
                          className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:border-blue-400 focus:outline-none"
                          placeholder="Enter bucket name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Region</label>
                        <input
                          type="text"
                          value={config.region}
                          onChange={(e) => {
                            const newConfigs = [...cloudConfigs];
                            newConfigs[index].region = e.target.value;
                            setCloudConfigs(newConfigs);
                          }}
                          className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-end">
                        <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                          Test Connection
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;