import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import Onboarding from './components/Onboarding';
import Mascot from './components/Mascot';
import DailyTasks from './components/DailyTasks';
import LearningPath from './components/LearningPath';
import ProductDiscovery from './components/ProductDiscovery';
import CommunityFeed from './components/CommunityFeed';
import HealthScore from './components/HealthScore';
import HealthCheckIn from './components/HealthCheckIn';
import AvelynAdvice from './components/AvelynAdvice';
import AvelynCamera from './components/AvelynCamera';
import AvelynStickers from './components/AvelynStickers';
import AvelynLogo from './components/AvelynLogo';
import { firebaseAuth, googleProvider, db } from './lib/firebase';
import { 
  doc, onSnapshot, setDoc, updateDoc, collection, getDocs, addDoc, query, where 
} from 'firebase/firestore';
import AdminDashboard from './components/AdminDashboard';
import {
  BirdType,
  FlockInfo,
  DailyTask,
  Badge,
  UserState,
  MascotMood,
  MASCOT_PRESETS,
} from './types';
import {
  DashboardIcon,
  LessonsIcon,
  ProductsIcon,
  CommunityIcon,
  BadgesIcon,
  GoogleIcon,
  LogoutIcon,
} from './components/CustomIcons';
import { AmbientMusicManager } from './utils/AmbientMusicManager';
import PhotoVideoModal from './components/PhotoVideoModal';
import {
  Sparkles,
  Flame,
  Award,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Clock,
  Heart,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Check,
  User as UserIcon,
  Coffee,
  Menu,
  Volume2,
  VolumeX,
  Plus,
  X,
  ShieldCheck,
} from 'lucide-react';

const DEFAULT_TASKS: DailyTask[] = [
  { id: 'task-water', label: 'Refresh Drinking Water 💧', done: false, xpReward: 15, category: 'hydration', icon: 'droplet' },
  { id: 'task-pellets', label: 'Serve Pellet & Veg Chop mix 🥦', done: false, xpReward: 20, category: 'nutrition', icon: 'utensils' },
  { id: 'task-social', label: '15 Mins Active Social Play ❤️', done: false, xpReward: 20, category: 'social', icon: 'heart' },
  { id: 'task-flight', label: 'Supervised Free Flight Time ✈️', done: false, xpReward: 25, category: 'exercise', icon: 'navigation' },
  { id: 'task-cage', label: 'Clean Cage Bottom Tray ✨', done: false, xpReward: 20, category: 'custom', icon: 'trash' },
];

const DEFAULT_BADGES: Badge[] = [
  { id: 'badge-1', name: 'First Flight', description: 'Complete your first daily care task.', iconName: 'first-flight', unlocked: false, progress: 0, target: 1 },
  { id: 'badge-2', name: 'Nutrition Expert', description: 'Unlock and pass the first nutrition check-in.', iconName: 'nutrition-expert', unlocked: false, progress: 0, target: 1 },
  { id: 'badge-3', name: 'Healthy Flock', description: 'Maintain a bird care streak.', iconName: 'healthy-flock', unlocked: false, progress: 0, target: 1 },
  { id: 'badge-4', name: 'Bird Whisperer', description: 'Complete the Target Training module.', iconName: 'bird-whisperer', unlocked: false, progress: 0, target: 1 },
  { id: 'badge-5', name: 'Avian Master', description: 'Accumulate 250 lifetime XP.', iconName: 'avian-master', unlocked: false, progress: 0, target: 250 },
];

const STORAGE_KEY_PREFIX = 'avelyn_user_session_v1';

export default function App() {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [session, setSession] = useState<UserState | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'lessons' | 'discover' | 'community' | 'badges' | 'admin'>('home');
  const [referralInput, setReferralInput] = useState('');
  const [referralStatus, setReferralStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [simulatedMissedDays, setSimulatedMissedDays] = useState(false);
  const [flockName, setFlockName] = useState('Kiwi');
  const [editingFlockName, setEditingFlockName] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Phone OTP Auth States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showMascotModal, setShowMascotModal] = useState(false);

  // Mobile, Splash & Audio States
  const [showSplash, setShowSplash] = useState(true);
  const [showVolumeToast, setShowVolumeToast] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  // Sound effects helper for clicking tabs
  const playTabClickSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Ignore
    }
  };

  const sessionStorageKey = authUser ? `${STORAGE_KEY_PREFIX}:${authUser.uid}` : null;

  // Splash screen and volume toast scheduling
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Shortly after splash fades, show volume reminder toast
      setTimeout(() => {
        setShowVolumeToast(true);
      }, 800);
    }, 2800);
    return () => {
      clearTimeout(timer);
      AmbientMusicManager.stop();
    };
  }, []);

  // Load user state after auth is ready
  useEffect(() => {
    if (!authReady) return;
    if (!authUser) {
      setSession(null);
      return;
    }

    const userRef = doc(db, 'users', authUser.uid);
    const unsub = onSnapshot(userRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserState;
        let needsUpdate = false;
        const updated = { ...data };

        const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER || '+917980176991';
        if (!updated.role) {
          updated.role = authUser.phoneNumber === adminPhoneNumber ? 'admin' : 'user';
          needsUpdate = true;
        }
        if (!updated.clientId) {
          const randomId = Math.floor(100000 + Math.random() * 900000);
          updated.clientId = `AVL-${randomId}`;
          needsUpdate = true;
        }
        if (!updated.referralCode) {
          const randomCode = Math.floor(100000 + Math.random() * 900000);
          updated.referralCode = `REF-${randomCode}`;
          needsUpdate = true;
        }
        if (updated.referralUsed === undefined) {
          updated.referralUsed = false;
          updated.referralCount = 0;
          updated.totalReferralSavings = 0;
          updated.totalReferralRewards = 0;
          needsUpdate = true;
        }
        if (updated.emergencyKitSetup === undefined) {
          updated.emergencyKitSetup = false;
          needsUpdate = true;
        }
        if (updated.profileCompletePercent === undefined) {
          updated.profileCompletePercent = 0;
          needsUpdate = true;
        }
        if (!updated.phoneNumber) {
          updated.phoneNumber = authUser.phoneNumber || '';
          needsUpdate = true;
        }

        if (needsUpdate) {
          try {
            await setDoc(userRef, updated);
          } catch (err) {
            console.error("Error auto-fixing user record on snapshot:", err);
          }
        }
        setSession(updated);
      } else {
        await initializeEmptySession();
      }
    });

    return () => unsub();
  }, [authReady, authUser]);

  useEffect(() => {
    // Force sign out on mount so the login page is the 1st site of interaction
    signOut(firebaseAuth).catch(() => {});
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const initializeEmptySession = async () => {
    if (!authUser) return;
    const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER || '+917980176991';
    const isStaticAdmin = authUser.phoneNumber === adminPhoneNumber;
    const randomId = Math.floor(100000 + Math.random() * 900000);
    const randomCode = Math.floor(100000 + Math.random() * 900000);

    const empty: UserState = {
      onboardingCompleted: false,
      flock: {
        birdTypes: [],
        count: 1,
        ageGroup: 'young',
        experienceLevel: 'beginner',
        focusArea: [],
      },
      xp: 0,
      level: 1,
      seeds: 10,
      streak: 1,
      badges: DEFAULT_BADGES,
      tasks: DEFAULT_TASKS,
      completedLessons: [],
      lastCheckedDate: new Date().toISOString().split('T')[0],
      healthObservations: {
        droppings: 'normal',
        energy: 'active',
        appetite: 'good',
        vocal: 'normal',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      role: isStaticAdmin ? 'admin' : 'user',
      clientId: `AVL-${randomId}`,
      referralCode: `REF-${randomCode}`,
      referralUsed: false,
      referralCount: 0,
      totalReferralSavings: 0,
      totalReferralRewards: 0,
      emergencyKitSetup: false,
      profileCompletePercent: 0,
      phoneNumber: authUser.phoneNumber || '',
    };
    
    setSession(empty);
    try {
      await setDoc(doc(db, 'users', authUser.uid), empty);
    } catch (err) {
      console.error("Error setting empty session:", err);
    }
  };

  // Save session state to Firestore (and localstorage fallback)
  const saveSession = async (updated: UserState) => {
    if (!authUser) return;
    setSession(updated);
    try {
      await setDoc(doc(db, 'users', authUser.uid), updated);
    } catch (err) {
      console.error("Error writing to Firestore, falling back to local storage:", err);
      if (sessionStorageKey) {
        localStorage.setItem(sessionStorageKey, JSON.stringify(updated));
      }
    }
  };

  const handleApplyReferralCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!session || !authUser) return { success: false, message: 'Not logged in.' };
    setReferralStatus(null);
    const cleanedCode = code.trim().toUpperCase();
    
    if (cleanedCode === session.referralCode) {
      const msg = { type: 'error' as const, message: 'You cannot use your own referral code!' };
      setReferralStatus(msg);
      return { success: false, message: msg.message };
    }
    
    if (session.referralUsed) {
      const msg = { type: 'error' as const, message: 'You have already applied a referral code!' };
      setReferralStatus(msg);
      return { success: false, message: msg.message };
    }
    
    try {
      // Look up referrer in firestore
      const usersSnap = await getDocs(query(collection(db, 'users'), where('referralCode', '==', cleanedCode)));
      if (usersSnap.empty) {
        const msg = { type: 'error' as const, message: 'Invalid referral code!' };
        setReferralStatus(msg);
        return { success: false, message: msg.message };
      }
      
      const referrerDoc = usersSnap.docs[0];
      const referrerUid = referrerDoc.id;
      const referrerData = referrerDoc.data() as UserState;
      
      // Update referrer: +1 referral count, award 10 seeds
      const updatedReferrer = {
        ...referrerData,
        referralCount: (referrerData.referralCount || 0) + 1,
        totalReferralRewards: (referrerData.totalReferralRewards || 0) + 10,
        seeds: (referrerData.seeds || 0) + 10
      };
      await setDoc(doc(db, 'users', referrerUid), updatedReferrer);
      
      // Update referee (current user): set referralUsed to true, award 5 seeds
      const updatedReferee = {
        ...session,
        referralUsed: true,
        totalReferralSavings: (session.totalReferralSavings || 0) + 5,
        seeds: (session.seeds || 0) + 5
      };
      await setDoc(doc(db, 'users', authUser.uid), updatedReferee);
      
      // Log referral conversion in 'referrals' collection
      const refId = `ref-${Date.now()}`;
      await setDoc(doc(db, 'referrals', refId), {
        id: refId,
        referrerUid,
        referrerPhone: referrerData.phoneNumber || referrerUid,
        referredUid: authUser.uid,
        referredPhone: authUser.phoneNumber || authUser.uid,
        createdAt: new Date().toISOString()
      });

      // Write simulated notification to 'mail' collection
      const mailId = `mail-${Date.now()}`;
      await setDoc(doc(db, 'mail', mailId), {
        to: referrerData.phoneNumber || referrerUid,
        createdAt: new Date().toISOString(),
        message: {
          subject: 'Referral Reward Earned! 🎁',
          html: `<h3>Your referral code was used!</h3><p>User with phone <b>${authUser.phoneNumber || 'unknown'}</b> signed up. You earned 10 Seeds credit!</p>`
        }
      });

      const successMsg = { type: 'success' as const, message: 'Referral code applied successfully! 5 Seeds added to your wallet.' };
      setReferralStatus(successMsg);
      return { success: true, message: successMsg.message };
    } catch (err: any) {
      console.error(err);
      const errMsg = { type: 'error' as const, message: 'Failed to apply referral code: ' + err.message };
      setReferralStatus(errMsg);
      return { success: false, message: errMsg.message };
    }
  };

  // Handle clinical health observations updates
  const handleUpdateObservations = (observations: {
    droppings: 'normal' | 'abnormal';
    energy: 'active' | 'lethargic';
    appetite: 'good' | 'poor';
    vocal: 'normal' | 'silent';
  }) => {
    if (!session) return;
    const updated: UserState = {
      ...session,
      healthObservations: {
        ...observations,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
    };
    saveSession(updated);
  };

  const handleChangeMascot = (mascotId: string) => {
    if (!session) return;
    const updated: UserState = {
      ...session,
      activeMascot: mascotId,
    };
    saveSession(updated);
  };

  const getRecaptchaVerifier = () => {
    if ((window as any).recaptchaVerifier) {
      return (window as any).recaptchaVerifier;
    }
    const container = document.getElementById('recaptcha-container');
    if (!container) {
      console.error('Recaptcha container not found in DOM');
      return null;
    }
    try {
      const verifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // Solved
        },
        'expired-callback': () => {
          setOtpError('reCAPTCHA expired. Please try sending OTP again.');
        }
      });
      (window as any).recaptchaVerifier = verifier;
      return verifier;
    } catch (err) {
      console.error('Error initializing RecaptchaVerifier:', err);
      return null;
    }
  };

  const clearRecaptcha = () => {
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch (e) {}
      (window as any).recaptchaVerifier = null;
    }
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length < 7) {
      setOtpError('Please enter a valid phone number.');
      return;
    }
    const fullPhoneNumber = `${countryCode}${cleanNumber}`;
    setOtpLoading(true);
    setOtpError(null);

    const verifier = getRecaptchaVerifier();
    if (!verifier) {
      setOtpError('Could not initialize safety verification. Please refresh.');
      setOtpLoading(false);
      return;
    }

    try {
      const confirmation = await signInWithPhoneNumber(firebaseAuth, fullPhoneNumber, verifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setResendCooldown(30);
      setOtpError(null);
    } catch (err: any) {
      console.error(err);
      clearRecaptcha();
      if (err.code === 'auth/invalid-phone-number') {
        setOtpError('The phone number entered is invalid.');
      } else if (err.code === 'auth/too-many-requests') {
        setOtpError('Too many attempts. Please try again later.');
      } else {
        setOtpError(err.message || 'Failed to send verification code. Please check details.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter a 6-digit OTP.');
      return;
    }
    setOtpLoading(true);
    setOtpError(null);

    try {
      if (!confirmationResult) {
        throw new Error('No verification session found. Please request a new OTP.');
      }
      await confirmationResult.confirm(otpCode);
      setOtpError(null);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-verification-code') {
        setOtpError('The OTP entered is incorrect. Please try again.');
      } else if (err.code === 'auth/code-expired') {
        setOtpError('The verification code has expired. Please request a new one.');
      } else {
        setOtpError(err.message || 'OTP verification failed. Please try again.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleEditPhoneNumber = () => {
    setOtpSent(false);
    setConfirmationResult(null);
    setOtpCode('');
    setOtpError(null);
    clearRecaptcha();
  };

  const handleLogout = async () => {
    AmbientMusicManager.stop();
    setMusicPlaying(false);
    clearRecaptcha();
    setOtpSent(false);
    setConfirmationResult(null);
    setOtpCode('');
    setOtpError(null);
    await signOut(firebaseAuth);
  };

  const handleToggleMusic = () => {
    const active = AmbientMusicManager.toggle();
    setMusicPlaying(active);
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (showSplash) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient background glows */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="z-10 flex flex-col items-center space-y-6 text-center">
          {/* Logo container */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.05, 1], opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-emerald-500/10"
            />
            {/* The bird logo vector or icon representation */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-2xl relative overflow-hidden p-3 border border-emerald-300/30">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-md"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Tail feathers */}
                <path d="M 32 60 L 12 68 L 18 52 Z" fill="white" fillOpacity={0.8} />
                {/* Bird body */}
                <path d="M 30 60 C 30 42 44 32 58 32 C 72 32 80 44 80 58 C 80 72 68 80 50 80 C 32 80 30 72 30 60 Z" fill="white" />
                {/* Head cap / crest detail */}
                <path d="M 50 32 C 58 20 70 24 74 34 Z" fill="#E6F4EA" />
                {/* Eye */}
                <circle cx="66" cy="46" r="3.5" fill="#0F2942" />
                {/* Cheek blush */}
                <circle cx="74" cy="54" r="4" fill="#FFD54F" fillOpacity={0.7} />
                {/* Beak */}
                <path d="M 78 44 L 92 48 L 77 53 Z" fill="#FF8A65" />
                {/* Wing */}
                <path d="M 40 56 C 40 44 54 44 58 56 C 58 68 46 72 40 56 Z" fill="#A7F3D0" />
              </svg>
            </div>
          </motion.div>

          {/* App title */}
          <div className="space-y-1">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-display font-black tracking-tight text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400"
            >
              AVELYN
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-[10px] uppercase font-bold tracking-[0.25em] text-emerald-100"
            >
              Flock Companion Ecosystem
            </motion.p>
          </div>

          {/* Elegant customized progress bar */}
          <div className="w-48 bg-slate-800/80 h-1.5 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full rounded-full"
            />
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.2 }}
            className="text-[10px] font-medium text-emerald-100/50 animate-pulse"
          >
            Securing care metrics...
          </motion.span>
        </div>
      </div>
    );
  }

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#F8FFFC] flex items-center justify-center">
        <div className="rounded-2xl border border-emerald-100 bg-white px-6 py-4 text-sm font-semibold text-emerald-700 shadow-sm">
          Preparing Avelyn secure sign-in...
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 font-sans text-[#1C1C1A]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="w-full max-w-md bg-[#FFFDF8] border-2 border-[#8FA89B] rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden"
        >
          {/* Invisible ReCAPTCHA Container */}
          <div id="recaptcha-container"></div>

          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-3">
              <AvelynLogo />
              <Mascot mood="happy" size={100} showBubble={false} />
            </div>

            {!otpSent ? (
              // Step 1: Phone number entry
              <div className="space-y-4">
                <div className="space-y-1 text-center">
                  <h2 className="text-xl font-display font-black text-slate-800 tracking-tight">
                    Welcome to Avelyn
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Companion bird wellness with structured care schedules, diagnostic check-ins, and analytics. Sign in securely via Phone OTP.
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  {otpError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-rose-700 leading-snug">{otpError}</span>
                    </motion.div>
                  )}

                  <div className="flex gap-2">
                    <div className="w-1/3 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Country
                      </label>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#8FA89B]/45 bg-[#FAF8F5] text-slate-700 text-xs font-bold focus:outline-none focus:border-[#8FA89B] transition-all cursor-pointer"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇨🇦 +1 (CA)</option>
                        <option value="+1">🇺🇸 +1 (US)</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+61">🇦🇺 +61</option>
                      </select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="79801 76991"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#8FA89B]/45 bg-[#FAF8F5] text-slate-800 text-xs font-medium focus:outline-none focus:border-[#8FA89B] focus:ring-4 focus:ring-[#8FA89B]/10 focus:bg-[#FFFDF8] transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading || !phoneNumber.trim()}
                    className="w-full py-3 rounded-xl bg-[#8FA89B] hover:bg-[#8FA89B]/90 text-white font-bold text-xs shadow-md shadow-[#8FA89B]/10 hover:shadow-[#8FA89B]/20 active:scale-98 transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                  >
                    {otpLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Send Verification Code'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              // Step 2: OTP Entry
              <div className="space-y-4">
                <div className="space-y-1 text-center">
                  <h2 className="text-xl font-display font-black text-slate-800 tracking-tight">
                    Verify Code
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    We sent a 6-digit verification code to <span className="font-mono font-bold text-slate-700">{countryCode} {phoneNumber}</span>.
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  {otpError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-rose-700 leading-snug">{otpError}</span>
                    </motion.div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                      6-Digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full px-3.5 py-3 rounded-xl border border-[#8FA89B]/45 bg-[#FAF8F5] text-slate-800 text-lg font-bold tracking-[0.75em] text-center focus:outline-none focus:border-[#8FA89B] focus:ring-4 focus:ring-[#8FA89B]/10 focus:bg-[#FFFDF8] transition-all font-mono"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading || otpCode.length !== 6}
                    className="w-full py-3 rounded-xl bg-[#E0A926] hover:bg-[#E0A926]/90 text-white font-bold text-xs shadow-md shadow-[#E0A926]/10 hover:shadow-[#E0A926]/20 active:scale-98 transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                  >
                    {otpLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Verify & Sign In'
                    )}
                  </button>

                  <div className="flex flex-col items-center gap-2.5 pt-2">
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || otpLoading}
                      onClick={handleSendOTP}
                      className="text-xs text-[#8FA89B] hover:text-[#8FA89B]/80 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                    <button
                      type="button"
                      onClick={handleEditPhoneNumber}
                      className="text-[10px] text-slate-450 hover:underline cursor-pointer"
                    >
                      Change phone number
                    </button>
                  </div>
                </form>
              </div>
            )}

            <p className="text-[10px] text-slate-400 text-center leading-relaxed max-w-xs mx-auto">
              By signing in, you secure access to your bird's logs and progress synced with Firebase.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center font-sans text-slate-500 text-sm">
        Spinning up Avelyn ecosystem... 🦜
      </div>
    );
  }

  // Handle Onboarding Completion
  const handleOnboardingComplete = (data: {
    birdType: BirdType[];
    birdCount: number;
    experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    goals: string[];
    referralCodeEntered?: string;
  }) => {
    if (!session) return;
    const now = new Date().toISOString();
    const legacyExperience: 'beginner' | 'experienced' =
      data.experienceLevel.toLowerCase() === 'beginner' ? 'beginner' : 'experienced';

    const updated: UserState = {
      ...session,
      onboardingCompleted: true,
      birdType: data.birdType,
      birdCount: data.birdCount,
      experienceLevel: data.experienceLevel,
      goals: data.goals,
      createdAt: session.createdAt || now,
      lastLogin: now,
      flock: {
        birdTypes: data.birdType,
        count: data.birdCount,
        ageGroup: 'young',
        experienceLevel: legacyExperience,
        focusArea: data.goals,
      },
      xp: 25, // starting XP bonus
      seeds: session.seeds + 15, // additional seeds for completing onboarding
      streak: 3, // starting streak bonus
      profileCompletePercent: 100,
      emergencyKitSetup: false,
    };
    saveSession(updated);
  };

  // Logic to process XP gains & Badge unlocks
  const awardXPAndSeeds = (xpGain: number, seedsGain: number, updatedSession = session) => {
    let nextXp = updatedSession.xp + xpGain;
    let nextLvl = updatedSession.level;

    // Level up thresholds: 100 XP per level
    const xpNeededForNextLevel = nextLvl * 100;
    let didLevelUp = false;
    if (nextXp >= xpNeededForNextLevel) {
      nextLvl += 1;
      nextXp = nextXp - xpNeededForNextLevel;
      didLevelUp = true;
    }

    // Process Badge milestones
    const nextBadges = updatedSession.badges.map((badge) => {
      let nextProgress = badge.progress;
      if (badge.id === 'badge-1') {
        const completedCount = updatedSession.tasks.filter((t) => t.done).length;
        if (completedCount > 0) nextProgress = 1;
      }
      if (badge.id === 'badge-2' && updatedSession.completedLessons.length > 0) {
        nextProgress = 1;
      }
      if (badge.id === 'badge-3' && updatedSession.streak > 0) {
        nextProgress = 1;
      }
      if (badge.id === 'badge-4' && updatedSession.completedLessons.includes('train-1')) {
        nextProgress = 1;
      }
      if (badge.id === 'badge-5') {
        nextProgress = Math.min(250, (updatedSession.xp + xpGain));
      }

      const unlocked = nextProgress >= badge.target;
      return { ...badge, progress: nextProgress, unlocked };
    });

    const finalSession: UserState = {
      ...updatedSession,
      xp: nextXp,
      level: nextLvl,
      seeds: updatedSession.seeds + seedsGain,
      badges: nextBadges,
    };

    saveSession(finalSession);

    if (didLevelUp) {
      setShowLevelUp(true);
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = 'sine';
          osc2.type = 'triangle';
          osc1.frequency.setValueAtTime(520, ctx.currentTime);
          osc1.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
          osc2.frequency.setValueAtTime(260, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start();
          osc2.start();
          osc1.stop(ctx.currentTime + 0.4);
          osc2.stop(ctx.currentTime + 0.4);
        }
      } catch (e) {}
    }
  };

  // Toggle checklist tasks
  const handleToggleTask = (id: string) => {
    const nextTasks = session.tasks.map((t) => {
      if (t.id === id) {
        return { ...t, done: !t.done };
      }
      return t;
    });

    const targetT = session.tasks.find((t) => t.id === id);
    const completedCountChange = !targetT?.done ? 1 : -1;

    // If completed, award XP
    let xpAward = 0;
    let seedsAward = 0;
    if (completedCountChange > 0 && targetT) {
      xpAward = targetT.xpReward;
      seedsAward = 5;
    }

    const updated: UserState = {
      ...session,
      tasks: nextTasks,
    };

    awardXPAndSeeds(xpAward, seedsAward, updated);
  };

  // Create custom habits
  const handleAddTask = (
    label: string,
    category: 'hydration' | 'nutrition' | 'social' | 'exercise' | 'custom'
  ) => {
    const newTask: DailyTask = {
      id: `custom-${Date.now()}`,
      label,
      done: false,
      xpReward: 15,
      category,
      icon: 'sparkles',
    };

    const updated: UserState = {
      ...session,
      tasks: [...session.tasks, newTask],
    };
    saveSession(updated);
  };

  // Delete custom habits
  const handleDeleteTask = (id: string) => {
    const updated: UserState = {
      ...session,
      tasks: session.tasks.filter((t) => t.id !== id),
    };
    saveSession(updated);
  };

  // Complete a care lesson
  const handleCompleteLesson = (lessonId: string, xpReward: number, seedsReward: number) => {
    if (session.completedLessons.includes(lessonId)) return;
    const updated: UserState = {
      ...session,
      completedLessons: [...session.completedLessons, lessonId],
    };
    awardXPAndSeeds(xpReward, seedsReward, updated);
  };

  // Post in Community Forum
  const handleCommunityPostCreated = (xpReward: number) => {
    awardXPAndSeeds(xpReward, 10);
  };

  // Clear data and restart
  const handleRestart = () => {
    if (!sessionStorageKey) return;
    if (confirm("Reset application? This will wipe your bird care streak, XP, and flock configuration!")) {
      localStorage.removeItem(sessionStorageKey);
      initializeEmptySession();
      setActiveTab('home');
      setSimulatedMissedDays(false);
    }
  };

  const handleToggleEmergencyKit = () => {
    if (!session) return;
    const updated: UserState = {
      ...session,
      emergencyKitSetup: !session.emergencyKitSetup,
    };
    saveSession(updated);
  };

  // Render onboarding initially if incomplete
  if (!session.onboardingCompleted) {
    return (
      <Onboarding
        clientId={session.clientId}
        referralCode={session.referralCode}
        onApplyReferral={handleApplyReferralCode}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // Calculate stats
  const completedTasks = session.tasks.filter((t) => t.done).length;
  const totalTasks = session.tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Redesigned Bird Health Score (BHS) Engine
  const logs = {
    waterChanged: session.tasks.find(t => t.id === 'task-water')?.done || false,
    foodProvided: session.tasks.find(t => t.id === 'task-pellets')?.done || false,
    exerciseCompleted: session.tasks.find(t => t.id === 'task-flight')?.done || false,
    cageCleaned: session.tasks.find(t => t.id === 'task-cage')?.done || false,
    observationDone: !!session.healthObservations && session.healthObservations.lastUpdated === new Date().toISOString().split('T')[0]
  };

  const dailyCareSubtotal = 
    (logs.waterChanged ? 14 : 0) +
    (logs.cageCleaned ? 14 : 0) +
    (logs.foodProvided ? 14 : 0) +
    (logs.exerciseCompleted ? 14 : 0) +
    (logs.observationDone ? 14 : 0);

  const profileCompletePercent = session.profileCompletePercent || 0;
  const emergencyKitSetup = session.emergencyKitSetup || false;
  const completedLessonsCount = session.completedLessons?.length || 0;
  const streakVal = simulatedMissedDays ? 0 : (session.streak || 0);

  const preparednessSubtotal = 
    Math.min(7.5, completedLessonsCount * 2.5) +
    Math.min(7.5, streakVal * 1.5) +
    Math.min(7.5, (profileCompletePercent * 0.075)) +
    (emergencyKitSetup ? 7.5 : 0);

  // If no care activities checked today, raw score is 0
  let rawHealthScore = dailyCareSubtotal === 0 ? 0 : Math.round(dailyCareSubtotal + preparednessSubtotal);

  // Apply weighted symptom deductions from user-inputted health observations
  let activeDeductions = 0;
  if (session.healthObservations) {
    if (session.healthObservations.droppings === 'abnormal') activeDeductions += 15;
    if (session.healthObservations.energy === 'lethargic') activeDeductions += 15;
    if (session.healthObservations.appetite === 'poor') activeDeductions += 10;
    if (session.healthObservations.vocal === 'silent') activeDeductions += 5;
  }

  let computedHealthScore = Math.max(15, rawHealthScore - activeDeductions);
  if (simulatedMissedDays) {
    computedHealthScore = Math.max(15, Math.round(computedHealthScore * 0.5));
  }

  const hasAbnormalObservations = session.healthObservations && (
    session.healthObservations.droppings === 'abnormal' ||
    session.healthObservations.energy === 'lethargic' ||
    session.healthObservations.appetite === 'poor'
  );

  // Mascot mood configuration
  const getSimulatedMood = (): MascotMood => {
    if (simulatedMissedDays) return 'concerned';
    if (hasAbnormalObservations) return 'concerned';
    if (showLevelUp) return 'celebrating';
    if (completionPercentage === 100) return 'excited';
    if (completedTasks > 0) return 'happy';
    return 'proud';
  };

  const getMascotSpeech = () => {
    if (simulatedMissedDays) {
      return `Oh no! We haven't checked on ${flockName} today... Your birds might be waiting. Let's continue their care journey! ❤️`;
    }
    if (hasAbnormalObservations) {
      return `Oh! I see some abnormal physical signs in today's check-in for ${flockName}. Please watch them close, check our "Emergency Care" guide, or contact a vet! 🩺🦜`;
    }
    if (showLevelUp) {
      return `Incredible! High-five bird parents! Level ${session.level} unlocked successfully! 🎉`;
    }
    if (completionPercentage === 100) {
      return "Whoa! Exceptional bird-care metrics today! You are an absolute master bird parent! 🏆🦜";
    }
    if (completedTasks > 0) {
      return `Chirp chirp! Excellent care logs today. Let's complete Kiwi's remaining exercises! ✨`;
    }
    return `Hi, I am Avelyn! Ready to give ${flockName} the best day of their life? Feed & water them to update progress! 🥦💧`;
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between font-sans text-slate-800">
      {/* Premium Header / Score HUD */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-100 p-2 md:p-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 w-full">
          {/* Mobile Left: Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 md:hidden transition-colors cursor-pointer"
            title="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <AvelynLogo compact />

          {/* Desktop HUD - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            {/* Music/Volume Toggle */}
            <button
              onClick={handleToggleMusic}
              className={`p-2 rounded-xl transition-colors border cursor-pointer flex items-center justify-center ${
                musicPlaying
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600'
              }`}
              title={musicPlaying ? "Mute ambient music" : "Play ambient music"}
            >
              {musicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Streak Counter */}
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl p-2 shadow-2xs">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-400 animate-pulse" />
              <div>
                <span className="text-xs font-bold text-orange-700 block leading-none">
                  {simulatedMissedDays ? '0 Days' : `${session.streak} Days`}
                </span>
                <span className="text-[9px] font-semibold text-orange-400 uppercase">Streak</span>
              </div>
            </div>

            {/* Total XP Progress */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-2">
              <div className="text-right">
                <span className="text-xs font-bold block text-slate-700 leading-none">
                  Lvl {session.level}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">Avian Rank</span>
              </div>
              <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(session.xp / (session.level * 100)) * 100}%` }}
                />
              </div>
              <span className="text-xs text-emerald-600 font-bold block leading-none font-display">
                {session.xp} XP
              </span>
            </div>

            {/* Seed Currency Points */}
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl p-2">
              <div className="bg-amber-400 text-[#FFFDF8] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono">
                S
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700 block leading-none">
                  {session.seeds + (completedTasks * 5)} Seeds
                </span>
                <span className="text-[9px] font-semibold text-amber-400 uppercase">Store Rewards</span>
              </div>
            </div>

            {/* Account actions */}
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 cursor-pointer"
              title="Sign out"
              id="reboot-app-button"
            >
              <LogoutIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Right: Music Toggle */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={handleToggleMusic}
              className={`p-2 rounded-xl transition-colors border cursor-pointer flex items-center justify-center ${
                musicPlaying
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  : 'bg-slate-50 border-slate-100 text-slate-400'
              }`}
              title={musicPlaying ? "Mute ambient music" : "Play ambient music"}
            >
              {musicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Area - 8px spacing offset with pb-20 to prevent bottom nav overlap on mobile */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 space-y-2 pb-20 md:pb-2">
        {/* Onboarding Summary Bar - 8px spacing */}
        <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl p-2 flex gap-2 items-center justify-between flex-wrap text-xs text-slate-600">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-emerald-700 uppercase bg-emerald-100 rounded-md px-2 py-0.5">
              Registered Flock:
            </span>
            <span>
              {session.flock.count} {session.flock.count === 1 ? 'Friend' : 'Friends'} ({session.flock.birdTypes.join(', ')})
            </span>
            <span className="text-slate-300">|</span>
            <span>Parent rank: <b>{session.flock.experienceLevel}</b></span>
            <span className="text-slate-300">|</span>

            {/* Flock Name Inline Editor */}
            <div className="flex items-center gap-2">
              <span>Flock Representative:</span>
              {editingFlockName ? (
                <div className="flex items-center gap-2 select-none">
                  <input
                    type="text"
                    value={flockName}
                    onChange={(e) => setFlockName(e.target.value)}
                    className="border border-slate-300 bg-white px-2 py-1 rounded text-xs outline-none focus:border-emerald-500 font-bold"
                  />
                  <button
                    onClick={() => setEditingFlockName(false)}
                    className="p-1 bg-emerald-500 rounded text-white font-bold text-[10px]"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <span className="font-bold text-slate-800 underline cursor-pointer" onClick={() => setEditingFlockName(true)}>
                  {flockName} ✏️
                </span>
              )}
            </div>
          </div>

          <div className="text-slate-400 font-mono text-[10px] hidden lg:block uppercase font-bold">
            Avian Core Online 🟢
          </div>
        </div>

        {/* Level Up Overlay card */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 border-3 border-emerald-400 p-2 rounded-2xl shadow-md text-white flex items-center justify-between flex-wrap gap-2"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold font-mono tracking-widest text-emerald-100 uppercase">
                  ⭐ Milestone Achievement Unlock ⭐
                </span>
                <h3 className="font-display font-bold text-xl">
                  Avelyn Wellness Rank Promoted!
                </h3>
                <p className="text-xs text-emerald-55 leading-relaxed">
                  Congratulations! You've unlocked level <b>{session.level}</b>. Avelyn is extremely proud of your bird health dedication.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLevelUp(false)}
                  className="bg-[#FFFDF8] hover:bg-slate-50 text-emerald-700 py-1.5 px-4 rounded-xl text-xs font-bold leading-none cursor-pointer"
                  id="level-up-close-btn"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Tab Navigation - hidden on mobile, replaced by bottom bar */}
        <nav className="hidden md:flex border-b border-slate-200 gap-2 overflow-x-auto pr-2">
          {[
            { id: 'home', label: 'Care Dashboard', icon: <DashboardIcon size={16} />, clickId: 'nav-home' },
            { id: 'lessons', label: 'Learning Path', icon: <LessonsIcon size={16} />, clickId: 'nav-lessons' },
            { id: 'discover', label: 'Curated Products', icon: <ProductsIcon size={16} />, clickId: 'nav-discover' },
            { id: 'community', label: 'Flock Community', icon: <CommunityIcon size={16} />, clickId: 'nav-community' },
            { id: 'badges', label: 'Badges & Stickers', icon: <BadgesIcon size={16} />, clickId: 'nav-badges' },
            ...(session.role === 'admin' ? [{ id: 'admin', label: 'Admin Control', icon: <ShieldCheck className="w-4 h-4 text-rose-500" />, clickId: 'nav-admin' }] : []),
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playTabClickSound();
                  setActiveTab(tab.id as any);
                }}
                className={`py-2 px-3 text-sm font-display font-bold border-b-2 text-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                id={tab.clickId}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Route views based on standard Switch */}
        <div className="min-h-[480px]">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home-grid"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-2"
              >
                {/* Left 2 Column: Main checks */}
                <div className="lg:col-span-2 space-y-2">
                  {/* Hero Welcomer Screen */}
                  <div className="bg-gradient-to-br from-white via-white to-slate-50/30 border-2 border-slate-100/80 rounded-3xl p-6 md:p-10 flex flex-row items-center justify-between gap-6 md:gap-10 shadow-sm relative overflow-visible">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-5 flex-1 min-w-0 order-1">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                          Companion Mascot Hub
                        </span>
                        <h2 className="font-display font-black text-2xl md:text-3xl text-slate-800 tracking-tight leading-tight">
                          "Every chirp tells a story."
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-sans max-w-md">
                          Premium nutrition, interactive companion attachment, and veterinary guidance tailored perfectly to your flock. Tap the mascot to hear its breed-specific song!
                        </p>
                      </div>

                      {/* Mascot Selector Container */}
                      <div className="border-t border-slate-100 pt-5 mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                            Interactive Companion:
                          </span>
                        </div>
                        
                        <button
                          onClick={() => {
                            playTabClickSound();
                            setShowMascotModal(true);
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer group"
                          type="button"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={MASCOT_PRESETS.find(p => p.id === (session.activeMascot || 'budgie_wave'))?.src || MASCOT_PRESETS[0].src}
                              alt="Active Mascot"
                              className="w-10 h-10 object-contain rounded-xl bg-white p-1 shadow-2xs group-hover:scale-105 transition-transform"
                            />
                            <div className="text-left">
                              <h4 className="font-bold text-xs text-slate-800">
                                {MASCOT_PRESETS.find(p => p.id === (session.activeMascot || 'budgie_wave'))?.name?.split(' (')[0] || 'Budgie'}
                              </h4>
                              <p className="text-[10px] text-slate-400">
                                Active Flock Companion
                              </p>
                            </div>
                          </div>
                          
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors">
                            Change Companion
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="shrink-0 order-2 flex flex-col items-center justify-center pl-2">
                      <Mascot 
                        mood={getSimulatedMood()} 
                        message={getMascotSpeech()} 
                        activeMascot={session.activeMascot} 
                        size={120} 
                      />
                    </div>
                  </div>

                  {/* Onboarding simulated levers (Hidden on mobile to save space, fully accessible in sidebar) */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 space-y-2 hidden md:block">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-orange-500" /> Emotional Retention Simulator
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Simulate missed care days. Avelyn becomes concerned, updating speech & health score.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          playTabClickSound();
                          setSimulatedMissedDays(!simulatedMissedDays);
                        }}
                        className={`py-1 px-2.5 rounded-lg text-[11px] font-bold shadow-xs cursor-pointer ${
                          simulatedMissedDays
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                        id="simulate-loneliness-btn"
                      >
                        {simulatedMissedDays ? '⚡ Resume Caring' : '⚠️ Simulate Missed Days'}
                      </button>
                    </div>
                  </div>

                  {/* Avelyn advice */}
                  <AvelynAdvice score={computedHealthScore} session={session} />

                  {/* Health score breakdown */}
                  <HealthScore
                    score={computedHealthScore}
                    completedTasksCount={completedTasks}
                    totalTasksCount={totalTasks}
                    completedLessonsCount={session.completedLessons.length}
                    streak={simulatedMissedDays ? 0 : session.streak}
                    healthObservations={session.healthObservations}
                    profileCompletePercent={session.profileCompletePercent || 0}
                    emergencyKitSetup={session.emergencyKitSetup || false}
                    onToggleEmergencyKit={handleToggleEmergencyKit}
                    dailyCareLogs={logs}
                  />

                  {/* Health observations input */}
                  <HealthCheckIn
                    observations={session.healthObservations}
                    onUpdate={handleUpdateObservations}
                    flockName={flockName}
                  />

                  {/* Daily Care tasks list */}
                  <DailyTasks
                    tasks={session.tasks}
                    onToggleTask={handleToggleTask}
                    onAddTask={handleAddTask}
                    onDeleteTask={handleDeleteTask}
                    seedsAwarded={completedTasks * 5}
                  />
                </div>

                {/* Right 1 Column */}
                <div className="space-y-2">
                  <AvelynCamera flockRepresentativeName={flockName} />

                  {/* Streak widget */}
                  <div className="bg-white border-2 border-slate-100 rounded-2xl p-2 shadow-xs space-y-2 text-center">
                    <Flame className="w-8 h-8 text-orange-500 fill-orange-400 mx-auto" />
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-800">
                        {simulatedMissedDays ? 'Streak Interrupted!' : `${session.streak} Day Care Streak!`}
                      </h3>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                        {simulatedMissedDays
                          ? 'Birds miss consistent schedules. Log a water or nutrition checkmark now to resume streak!'
                          : 'You earn bonus seed points for completing care checks every single day.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 text-xs">
                      {[1, 7, 30, 100].map((d) => {
                        const unlocked = !simulatedMissedDays && session.streak >= d;
                        return (
                          <div
                            key={d}
                            className={`p-2 rounded-xl flex flex-col items-center border ${
                              unlocked
                                ? 'bg-orange-50 border-orange-200 text-orange-700 font-bold'
                                : 'bg-slate-50 border-slate-100 text-slate-300'
                            }`}
                          >
                            <span className="text-md">🔥</span>
                            <span className="text-[10px] mt-1">{d} Days</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Referral Code Entry Card */}
                  <div className="bg-white border-2 border-slate-100 rounded-2xl p-3 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                        🎁
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-xs text-slate-800">
                          Have a Referral Code?
                        </h3>
                        <p className="text-[10px] text-slate-400 font-sans">
                          Apply referral code to unlock rewards.
                        </p>
                      </div>
                    </div>

                    {!session.referralUsed ? (
                      <div className="space-y-2">
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={referralInput}
                            onChange={(e) => setReferralInput(e.target.value)}
                            placeholder="REF-XXXXXX"
                            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 font-mono uppercase bg-slate-50/50"
                          />
                          <button
                            onClick={() => handleApplyReferralCode(referralInput)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                        {referralStatus && (
                          <p className={`text-[10px] font-semibold font-sans ${
                            referralStatus.type === 'success' ? 'text-emerald-650' : 'text-rose-650'
                          }`}>
                            {referralStatus.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-center font-sans">
                        <span className="text-[10px] font-bold text-emerald-700 block">
                          ✓ Referral Code Applied
                        </span>
                        <span className="text-[9px] text-emerald-500 mt-0.5 block leading-snug">
                          You received a 5% discount (5 Seeds equivalent) reward!
                        </span>
                      </div>
                    )}

                    {/* Show user's own referral code */}
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100/60 flex items-center justify-between text-xs font-sans">
                      <span className="text-slate-550 text-[10px] font-semibold">Your Referral Code:</span>
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50/30 px-2 py-0.5 rounded-md border border-indigo-100/10">
                        {session.referralCode}
                      </span>
                    </div>
                  </div>

                  {/* Food recommendation snippet */}
                  <div className="bg-gradient-to-tr from-[#FFFDF8] to-emerald-50/20 border-2 border-emerald-100 rounded-2xl p-2 shadow-xs space-y-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-md px-2 py-0.5 uppercase tracking-wide">
                      Mascot Recommendation
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-sm text-slate-800 leading-snug">
                        Ready to transition from seeds to healthy pellets?
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Harrison's Organic Lifetime Fine Pellets is scientifically formulated by veterinarians to secure companion bird longevity.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('discover')}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group cursor-pointer"
                    >
                      Compare approved foods{' '}
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Quick lesson box */}
                  <div className="bg-slate-50 rounded-2xl p-2 border-2 border-slate-100 text-center space-y-2">
                    <Coffee className="w-6 h-6 text-sky-500 mx-auto" />
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-xs text-slate-700">
                        Unlocked Lesson: Base Diet
                      </h4>
                      <p className="text-[11px] text-slate-500 px-3">
                        Read standard bird toxicities to secure safety!
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('lessons')}
                      className="bg-white hover:bg-slate-100 border text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs cursor-pointer w-full"
                    >
                      Enter Learning Path
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'lessons' && (
              <motion.div
                key="lessons-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <LearningPath
                  completedLessonIds={session.completedLessons}
                  onCompleteLesson={handleCompleteLesson}
                  xp={session.xp}
                />
              </motion.div>
            )}

            {activeTab === 'discover' && (
              <motion.div
                key="discover-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <ProductDiscovery userBirdTypes={session.flock.birdTypes} />
              </motion.div>
            )}

            {activeTab === 'community' && (
              <motion.div
                key="community-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <CommunityFeed
                  currentBirdName={flockName}
                  onPostCreated={handleCommunityPostCreated}
                />
              </motion.div>
            )}

            {activeTab === 'badges' && (
              <motion.div
                key="badges-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-2"
              >
                <div className="bg-white border-2 border-slate-100 rounded-2xl p-2 shadow-xs space-y-2">
                  <div className="space-y-1 text-center max-w-sm mx-auto mb-2">
                    <h2 className="font-display font-bold text-sm text-slate-800">
                      Avelyn Badge Collection
                    </h2>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Achievements represent premium care metrics and streak statuses. Earn XP to unlock higher ranks!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {session.badges.map((badge) => {
                      return (
                        <div
                          key={badge.id}
                          className={`p-2 rounded-2xl border-2 flex flex-col items-center text-center justify-between ${
                            badge.unlocked
                              ? 'border-amber-200 bg-amber-50/10'
                              : 'border-slate-100 bg-[#FFFDF8]'
                          }`}
                        >
                          <div className="space-y-2 flex flex-col items-center">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner ${
                                badge.unlocked
                                  ? 'bg-amber-400 text-white border-2 border-amber-300'
                                  : 'bg-slate-200 border-2 border-slate-300 text-slate-400'
                              }`}
                            >
                              {badge.iconName === 'first-flight' && '✈️'}
                              {badge.iconName === 'nutrition-expert' && '🥬'}
                              {badge.iconName === 'healthy-flock' && '🔥'}
                              {badge.iconName === 'bird-whisperer' && '🎓'}
                              {badge.iconName === 'avian-master' && '👑'}
                            </div>

                            <div className="space-y-1">
                              <h4 className="font-display font-bold text-xs text-slate-800">
                                {badge.name}
                              </h4>
                              <p className="text-[11px] text-slate-550 leading-snug">
                                {badge.description}
                              </p>
                            </div>
                          </div>

                          <div className="w-full mt-2 pt-2 border-t border-slate-50 space-y-1">
                            <div className="flex justify-between items-center text-xs text-slate-400">
                              <span>Status:</span>
                              <span className="font-bold text-slate-650">
                                {badge.unlocked ? 'Unlocked' : `${badge.progress}/${badge.target}`}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  badge.unlocked ? 'bg-amber-400' : 'bg-emerald-400'
                                }`}
                                style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <AvelynStickers />
              </motion.div>
            )}

            {activeTab === 'admin' && session.role === 'admin' && (
              <motion.div
                key="admin-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <AdminDashboard currentUserEmail={authUser.email || authUser.uid} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Elegant minimalist Footer - 8px aligned padding */}
      <footer className="bg-white border-t-2 border-slate-100 p-2 text-center text-xs text-slate-400 pb-24 md:pb-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Avelyn Companion System. All Rights Reserved. Crafted for premium companion bird parents.</p>
          <div className="flex gap-2">
            <button className="hover:text-emerald-500 transition-colors cursor-pointer">
              Privacy Standard
            </button>
            <span>•</span>
            <button className="hover:text-emerald-500 transition-colors cursor-pointer">
              Clinical Advisory Board
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-lg px-2 py-2.5 flex items-center justify-around md:hidden">
        {/* Home */}
        <button
          onClick={() => {
            playTabClickSound();
            setActiveTab('home');
          }}
          className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer transition-transform active:scale-95 ${
            activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <DashboardIcon size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        {/* Lessons */}
        <button
          onClick={() => {
            playTabClickSound();
            setActiveTab('lessons');
          }}
          className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer transition-transform active:scale-95 ${
            activeTab === 'lessons' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <LessonsIcon size={20} />
          <span className="text-[10px] font-bold">Lessons</span>
        </button>

        {/* Floating Plus button */}
        <div className="flex-1 flex justify-center -mt-6 relative z-50">
          <button
            onClick={() => {
              playTabClickSound();
              setUploadModalOpen(true);
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/35 border-2 border-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Share Flock Moment"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Community */}
        <button
          onClick={() => {
            playTabClickSound();
            setActiveTab('community');
          }}
          className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer transition-transform active:scale-95 ${
            activeTab === 'community' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <CommunityIcon size={20} />
          <span className="text-[10px] font-bold">Community</span>
        </button>

        {/* Badges */}
        <button
          onClick={() => {
            playTabClickSound();
            setActiveTab('badges');
          }}
          className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer transition-transform active:scale-95 ${
            activeTab === 'badges' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BadgesIcon size={20} />
          <span className="text-[10px] font-bold">Badges</span>
        </button>
      </div>

      {/* Hamburger Drawer for Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900 z-50 md:hidden"
            />

            {/* Side Drawer menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white z-50 md:hidden flex flex-col shadow-2xl border-r border-slate-100 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <AvelynLogo compact />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-4 flex-1 space-y-6">
                {/* User Info / Profile Section */}
                <div className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold font-display shadow-sm">
                    {authUser?.email ? authUser.email[0].toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 truncate">
                      {authUser?.email || 'Bird Parent'}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Companion caretaker
                    </p>
                  </div>
                </div>

                {/* Gamification status HUD (Streaks, Rank, Level, Seeds) */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Wellness Statistics
                  </h5>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {/* Streak */}
                    <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-2.5 flex flex-col">
                      <Flame className="w-5 h-5 text-orange-500 fill-orange-400 mb-1" />
                      <span className="text-xs font-bold text-orange-700 leading-none">
                        {simulatedMissedDays ? '0 Days' : `${session.streak} Days`}
                      </span>
                      <span className="text-[9px] font-semibold text-orange-400 uppercase mt-0.5">Streak</span>
                    </div>

                    {/* Seeds */}
                    <div className="bg-yellow-50/60 border border-yellow-100 rounded-xl p-2.5 flex flex-col">
                      <div className="bg-amber-400 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono mb-1">
                        S
                      </div>
                      <span className="text-xs font-bold text-amber-700 leading-none">
                        {session.seeds + (completedTasks * 5)} Seeds
                      </span>
                      <span className="text-[9px] font-semibold text-amber-400 uppercase mt-0.5">Seeds</span>
                    </div>
                  </div>

                  {/* Level & XP */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Lvl {session.level} Rank</span>
                      <span className="text-emerald-600 font-bold font-display">{session.xp} XP</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(session.xp / (session.level * 100)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary navigation */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Secondary Pages
                  </h5>

                  {/* Curated Products Link */}
                  <button
                    onClick={() => {
                      playTabClickSound();
                      setActiveTab('discover');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeTab === 'discover'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <ProductsIcon size={16} />
                    <span>Curated Products Store</span>
                  </button>

                  {/* Admin Control Center Link */}
                  {session.role === 'admin' && (
                    <button
                      onClick={() => {
                        playTabClickSound();
                        setActiveTab('admin');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                        activeTab === 'admin'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-rose-500" />
                      <span>Admin Control Center</span>
                    </button>
                  )}

                  {/* Change Companion mascot trigger inside sidebar drawer */}
                  <button
                    onClick={() => {
                      playTabClickSound();
                      setMobileMenuOpen(false);
                      setShowMascotModal(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl text-left text-xs font-bold text-slate-600 hover:bg-slate-50 border border-transparent transition-all flex items-center gap-2.5 cursor-pointer"
                  >
                    <img
                      src={MASCOT_PRESETS.find(p => p.id === (session.activeMascot || 'budgie_wave'))?.src || MASCOT_PRESETS[0].src}
                      alt="Active Mascot"
                      className="w-4 h-4 object-contain"
                    />
                    <span>Change Mascot Companion</span>
                  </button>
                </div>

                {/* Levers & Simulator options */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Simulation Levers
                  </h5>

                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 space-y-2.5">
                    {/* Missed days toggle lever */}
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-700 block">Missed Days</span>
                        <span className="text-[10px] text-slate-400 block leading-snug">Simulate empty care logs</span>
                      </div>
                      <button
                        onClick={() => {
                          playTabClickSound();
                          setSimulatedMissedDays(!simulatedMissedDays);
                        }}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                          simulatedMissedDays ? 'bg-orange-500' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                            simulatedMissedDays ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Ambient music toggle */}
                    <div className="flex items-center justify-between border-t border-slate-100/60 pt-2.5">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-700 block">Ambient Music</span>
                        <span className="text-[10px] text-slate-400 block leading-snug">Synthesize loop audio</span>
                      </div>
                      <button
                        onClick={() => {
                          playTabClickSound();
                          handleToggleMusic();
                        }}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                          musicPlaying ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                            musicPlaying ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 space-y-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleRestart();
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs transition-colors cursor-pointer"
                >
                  Reset Care Progress
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogoutIcon className="w-3.5 h-3.5" />
                  <span>Sign Out Account</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Volume reminder toast */}
      <AnimatePresence>
        {showVolumeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 left-4 md:left-auto md:max-w-sm z-40 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white p-4 rounded-2xl shadow-xl flex items-start gap-3"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Volume2 className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-bold text-xs text-emerald-300">Total Experience Mode</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                  Turn up your volume to get the total experience of Avelyn! Listen to procedurally generated relaxing background pads and dynamic bird chirps.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleToggleMusic();
                    setShowVolumeToast(false);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Enable Ambient Music
                </button>
                <button
                  onClick={() => setShowVolumeToast(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowVolumeToast(false)}
              className="text-slate-400 hover:text-white transition-colors p-0.5 rounded cursor-pointer self-start"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Selector Modal Overlay */}
      <AnimatePresence>
        {showMascotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setShowMascotModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full p-6 shadow-2xl relative space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-display font-black text-lg text-slate-800">
                    Choose Your Mascot
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select a wellness companion for your flock.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMascotModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {MASCOT_PRESETS.map((p) => {
                  const isSelected = (session.activeMascot || 'budgie_wave') === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        playTabClickSound();
                        handleChangeMascot(p.id);
                        setShowMascotModal(false);
                      }}
                      className={`p-3 rounded-2xl border-2 text-left flex items-start gap-3 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/35 ring-4 ring-emerald-50'
                          : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                      type="button"
                    >
                      <img
                        src={p.src}
                        alt={p.name}
                        className="w-12 h-12 object-contain rounded-xl bg-slate-55 p-1 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          {p.name.split(' (')[0]}
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          )}
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-snug">
                          {p.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo/Video upload modal */}
      <PhotoVideoModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={(xpReward) => {
          awardXPAndSeeds(xpReward, 5);
        }}
        currentBirdName={flockName}
      />
    </div>
  );
}

