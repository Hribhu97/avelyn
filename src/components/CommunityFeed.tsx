import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityPost } from '../types';
import { MessageSquare, Heart, Send, Sparkles, Image, ShieldAlert, BadgePlus } from 'lucide-react';

interface CommunityFeedProps {
  currentBirdName?: string;
  onPostCreated: (xpReward: number) => void;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: "Elena Vasquez",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    content: "Kiwi had her first organic sweet potato chop today! She was deeply skeptical of the orange mash initially, but Avelyn's nutrition tip guided me to mix in some millet sprigs. Now she can't get enough! 🥦🍠✨",
    imagePlaceholderType: 'lovebird',
    birdMention: "Lovebird",
    likes: 24,
    likedByUser: false,
    commentsCount: 3,
    timestamp: "2 hours ago"
  },
  {
    id: 'post-2',
    author: "Dave Peterson",
    authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
    content: "Absolutely phenomenal results with target stick training from Lesson 4! Pip actually understood the clicker within 4 tries today! He stepped up onto my finger safely without any grabby-blanket towel anxiety. Highly recommend for any beginner owner! 🦜🎖️",
    imagePlaceholderType: 'budgie',
    birdMention: "Budgie",
    likes: 42,
    likedByUser: false,
    commentsCount: 6,
    timestamp: "5 hours ago"
  },
  {
    id: 'post-3',
    author: "Chloe & Mango",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    content: "Cage location warning! Please double-check your kitchens: do not place cages close to stoves. My buddy Dr. Roberts warns that PTFE (Teflon) fumes can drift during roasting periods. Safely shifted Mango to the spacious living room bay window of sunshine today!",
    imagePlaceholderType: 'vet',
    birdMention: "Cockatiel",
    likes: 85,
    likedByUser: false,
    commentsCount: 12,
    timestamp: "Yesterday"
  }
];

export default function CommunityFeed({ currentBirdName = "Kiwi", onPostCreated }: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedBirdTag, setSelectedBirdTag] = useState<string>('Budgie');
  const [placeholderImage, setPlaceholderImage] = useState<'lovebird' | 'budgie' | 'cockatiel' | 'seeds'>('seeds');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: 'You (Proud Bird Parent)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      content: newPostContent.trim(),
      imagePlaceholderType: placeholderImage,
      birdMention: selectedBirdTag,
      likes: 1,
      likedByUser: true,
      commentsCount: 0,
      timestamp: 'Just now',
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    onPostCreated(25); // Award 25 XP
  };

  const handleLike = (id: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === id) {
          const isLiked = !p.likedByUser;
          return {
            ...p,
            likedByUser: isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const getPlaceholderIcon = (type: string) => {
    switch (type) {
      case 'lovebird':
        return '❤️ 🦜';
      case 'budgie':
        return '💚 🦜';
      case 'cockatiel':
        return '👑 🦜';
      case 'vet':
        return '🩺 🛡️';
      case 'seeds':
      default:
        return '🌻 🌾';
    }
  };

  return (
    <div className="bg-[#FFFDF8] border-2 border-slate-100 rounded-xl p-2 shadow-xs space-y-2">
      <div className="space-y-1">
        <h2 className="font-display font-bold text-sm text-slate-800">
          Avian Community Feed
        </h2>
        <p className="text-[11px] text-slate-500">
          Share photo updates, success stories, and vet check milestones with bird hobbyists.
        </p>
      </div>

      {/* Editor Post Form */}
      <form onSubmit={handleCreatePost} className="bg-white border border-emerald-100 rounded-xl p-2 space-y-2 shadow-xs">
        <div className="flex gap-2 items-start">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
            alt="My Avatar"
            className="w-8 h-8 rounded-full border border-slate-200"
          />
          <div className="flex-1 space-y-2">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={`Share what ${currentBirdName || 'your flock'} achieved today... e.g. target training success!`}
              rows={2}
              className="w-full bg-[#FFFDF8] border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:border-emerald-400 outline-none resize-none leading-relaxed"
            />

            {/* Editor Utilities */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                {/* Bird tag selector */}
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Tags:</span>
                  <select
                    value={selectedBirdTag}
                    onChange={(e) => setSelectedBirdTag(e.target.value)}
                    className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5 outline-none border-none cursor-pointer"
                  >
                    <option value="Budgie">#Budgie</option>
                    <option value="Lovebird">#Lovebird</option>
                    <option value="Cockatiel">#Cockatiel</option>
                    <option value="Ringneck">#Ringneck</option>
                    <option value="Other">#Other</option>
                  </select>
                </div>

                {/* Simulated Picture attach */}
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Art:</span>
                  <div className="flex gap-0.5">
                    {(['lovebird', 'budgie', 'cockatiel', 'seeds'] as const).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setPlaceholderImage(t)}
                        className={`text-[10px] p-0.5 rounded border cursor-pointer transition-all ${
                          placeholderImage === t ? 'bg-emerald-100 border-emerald-400 scale-105' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {getPlaceholderIcon(t).split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit btn */}
              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className={`py-1 px-3 font-bold text-[11px] rounded transition-all flex items-center gap-1 ${
                  newPostContent.trim()
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
                id="submit-community-post-btn"
              >
                Let's Chirp <Send className="w-3 h-3" />
              </button>
            </div>
            {newPostContent.trim() && (
              <p className="text-[9px] text-amber-500 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Post earns +25 XP inside Avelyn!
              </p>
            )}
          </div>
        </div>
      </form>

      {/* Posts Timeline */}
      <div className="space-y-2">
        {posts.map((p) => {
          return (
            <div key={p.id} className="bg-white border border-slate-100 rounded-xl p-2 shadow-xs space-y-2">
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={p.authorAvatar}
                    alt={p.author}
                    className="w-8 h-8 rounded-full border border-slate-100 object-cover"
                  />
                  <div>
                    <h4 className="font-display font-semibold text-slate-800 text-xs">
                      {p.author}
                    </h4>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {p.timestamp}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 rounded-md px-1.5 py-0.5 uppercase">
                  #{p.birdMention}
                </span>
              </div>

              {/* Core Content */}
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {p.content}
              </p>

              {/* Photo Attachment Representation */}
              <div className="bg-slate-50 border border-slate-100 rounded-lg h-16 flex items-center justify-center p-2 relative overflow-hidden">
                <span className="text-2xl filter drop-shadow-sm select-none">
                  {getPlaceholderIcon(p.imagePlaceholderType)}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider absolute bottom-1 right-2 font-mono">
                  Avian Photo Capture
                </span>
              </div>

              {/* Interactions bar */}
              <div className="flex items-center gap-4 pt-1 text-[11px] border-t border-slate-50">
                <button
                  onClick={() => handleLike(p.id)}
                  className={`flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                    p.likedByUser ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  id={`like-post-${p.id}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${p.likedByUser ? 'fill-current' : ''}`} />
                  <span>{p.likes} Hearts</span>
                </button>

                <div className="flex items-center gap-1 font-semibold text-slate-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{p.commentsCount} Threads</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
