import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Play, RotateCcw, Trophy, Volume2, VolumeX } from 'lucide-react';

const PROMO_TIERS = [
    { threshold: 10000, credits: 100, code: 'SKYIA-100-NEON' },
    { threshold: 20000, credits: 250, code: 'SKYIA-250-NEON' },
    { threshold: 50000, credits: 500, code: 'SKYIA-500-NEON' },
];

export function UI() {
    // Basic state
    const status = useGameStore(state => state.status);
    const score = useGameStore(state => state.score);
    const level = useGameStore(state => state.level);
    const ammo = useGameStore(state => state.ammo);
    const maxAmmo = useGameStore(state => state.maxAmmo);
    const chargeProgress = useGameStore(state => state.chargeProgress);
    const maxCharge = useGameStore(state => state.maxCharge);
    const isCharged = useGameStore(state => state.isCharged);
    const isMuted = useGameStore(state => state.isMuted);
    const playerName = useGameStore(state => state.playerName);
    const highScores = useGameStore(state => state.highScores);
    const generatedPromoCode = useGameStore(state => state.generatedPromoCode);
    const generatedPromoCredits = useGameStore(state => state.generatedPromoCredits);

    // Actions
    const setStatus = useGameStore(state => state.setStatus);
    const resetGame = useGameStore(state => state.resetGame);
    const setPlayerName = useGameStore(state => state.setPlayerName);
    const toggleMuted = useGameStore(state => state.toggleMuted);

    const [showLevelUp, setShowLevelUp] = useState(false);

    useEffect(() => {
        if (level > 1) {
            setShowLevelUp(true);
            const timer = setTimeout(() => setShowLevelUp(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [level]);

    // Calculate current promo tier progress for the in-game bar
    const getPromoProgress = (currentScore: number) => {
        const flooredScore = Math.floor(currentScore);
        // Find the next tier the player hasn't reached yet
        for (const tier of PROMO_TIERS) {
            if (flooredScore < tier.threshold) {
                // Find previous tier threshold (or 0)
                const prevThreshold = PROMO_TIERS[PROMO_TIERS.indexOf(tier) - 1]?.threshold ?? 0;
                const progress = (flooredScore - prevThreshold) / (tier.threshold - prevThreshold);
                return { nextTier: tier, progress: Math.min(progress, 1), isMaxed: false };
            }
        }
        // All tiers reached
        return { nextTier: PROMO_TIERS[PROMO_TIERS.length - 1], progress: 1, isMaxed: true };
    };

    const promoProgress = getPromoProgress(score);
    const promo = status === 'gameover' && generatedPromoCode ? { credits: generatedPromoCredits, code: generatedPromoCode } : null;

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
            {/* Header / Score */}
            <div className={`flex justify-between items-start w-full ${status === 'menu' ? 'hidden md:flex' : ''}`}>
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
                        NEON RUSH
                    </h1>
                    {status !== 'menu' && (
                        <button
                            onClick={toggleMuted}
                            className="pointer-events-auto bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded-full text-neon-cyan transition-colors"
                            title={isMuted ? "Activer le son" : "Couper le son"}
                        >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                    )}
                </div>

                {status === 'playing' && (
                    <div className="flex gap-8 pointer-events-auto items-end">
                        <div className="text-right">
                            <p className="text-4xl font-mono font-bold text-neon-pink drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]">
                                {level}
                            </p>
                            <p className="text-white text-sm uppercase tracking-widest font-bold">Level</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-mono font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                                {Math.floor(score).toString().padStart(6, '0')}
                            </p>
                            <p className="text-neon-cyan text-sm uppercase tracking-widest font-bold">Score</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Skyia.net Promo Progress Bar */}
            {status === 'playing' && (
                <div className="absolute top-20 right-6 flex flex-col items-end gap-1 pointer-events-none w-72">
                    <div className="flex items-center justify-between w-full mb-1">
                        <a href="https://skyia.net" target="_blank" rel="noreferrer" className="pointer-events-auto">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neon-purple drop-shadow-[0_0_6px_rgba(181,0,255,0.8)]">
                                SKYIA.NET
                            </span>
                        </a>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
                            {promoProgress.isMaxed ? (
                                <span className="text-neon-cyan animate-pulse font-bold">✦ MAX DÉBLOQUÉ ✦</span>
                            ) : (
                                <>Code Promo → <span className="text-neon-cyan font-bold">{promoProgress.nextTier.credits} crédits</span></>
                            )}
                        </span>
                    </div>
                    <div className="w-full h-4 bg-black/70 rounded-full overflow-hidden border border-neon-purple/40 shadow-[0_0_15px_rgba(181,0,255,0.3)] relative">
                        <div
                            className="h-full transition-all duration-500 ease-out rounded-full"
                            style={{
                                width: `${promoProgress.progress * 100}%`,
                                background: promoProgress.isMaxed
                                    ? 'linear-gradient(90deg, #00f3ff, #b500ff, #ff00ff)'
                                    : 'linear-gradient(90deg, #b500ff, #00f3ff)',
                                boxShadow: promoProgress.isMaxed
                                    ? '0 0 20px rgba(0,243,255,0.8)'
                                    : '0 0 12px rgba(181,0,255,0.6)',
                            }}
                        />
                        {/* Progress text overlay */}
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-white/90 drop-shadow-[0_0_4px_rgba(0,0,0,1)]">
                            {promoProgress.isMaxed ? '50 000+' : `${Math.floor(score).toLocaleString()} / ${promoProgress.nextTier.threshold.toLocaleString()}`}
                        </span>
                    </div>
                    {/* Tier indicators */}
                    <div className="flex justify-between w-full mt-0.5">
                        {PROMO_TIERS.map((tier) => (
                            <span
                                key={tier.threshold}
                                className={`text-[8px] font-mono ${Math.floor(score) >= tier.threshold ? 'text-neon-cyan' : 'text-gray-600'}`}
                            >
                                {tier.threshold >= 1000 ? `${tier.threshold / 1000}K` : tier.threshold}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            {/* Ammo Bar */}
            {status === 'playing' && (
                <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none transition-all duration-300 ${isCharged ? 'scale-110' : 'scale-100'}`}>
                    <p className={`text-xs uppercase tracking-widest font-bold ${isCharged ? 'text-yellow-400 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]' : 'text-neon-cyan drop-shadow-[0_0_4px_rgba(0,243,255,0.8)]'}`}>
                        {isCharged ? 'INVINCIBLE' : 'Charge Invincibilité'}
                    </p>
                    <div className={`w-64 h-3 bg-black/60 rounded-full overflow-hidden border ${isCharged ? 'border-yellow-400 shadow-[0_0_20px_rgba(255,255,0,0.6)]' : 'border-white/20 shadow-[0_0_10px_rgba(0,243,255,0.3)]'}`}>
                        <div
                            className={`h-full transition-all duration-300 ${isCharged ? 'bg-yellow-400' : 'bg-gradient-to-r from-neon-cyan to-neon-pink'}`}
                            style={{ width: `${isCharged ? (ammo / maxAmmo) * 100 : (chargeProgress / maxCharge) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Level Up Indicator */}
            {showLevelUp && status === 'playing' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h2 className="text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple drop-shadow-[0_0_40px_rgba(255,0,255,1)] animate-pulse uppercase">
                        Level {level}
                    </h2>
                </div>
            )}

            {/* Leaderboard (Left Side Desktop, Top Mobile) */}
            {status === 'menu' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm md:max-w-none md:top-1/2 md:-translate-y-1/2 md:left-6 md:-translate-x-0 md:w-64 max-h-[30vh] md:max-h-[80vh] overflow-y-auto bg-[#050510]/95 md:bg-[#050510] border border-neon-cyan/50 rounded-xl p-4 pointer-events-auto shadow-[0_0_20px_rgba(0,243,255,0.3)] z-50 flex flex-col backdrop-blur-md md:backdrop-blur-none transition-all">
                    <h3 className="text-neon-cyan font-bold italic mb-2 md:mb-4 uppercase flex items-center justify-center md:justify-start gap-2 sticky top-0 py-2 z-10 text-sm md:text-base bg-[#050510]/95 md:bg-[#050510]">
                        <Trophy size={18} />
                        <span className="md:hidden">Top 3 Players</span>
                        <span className="hidden md:inline">Top 50 Players</span>
                    </h3>
                    <div className="flex flex-col gap-2">
                        {highScores.length === 0 && <p className="text-gray-500 text-sm text-center md:text-left">No scores recorded yet.</p>}
                        {highScores.map((s, i) => (
                            <div key={i} className={`flex justify-between items-center text-sm border-b border-white/5 pb-2 ${i >= 3 ? 'hidden md:flex' : ''}`}>
                                <span className="text-gray-300 truncate font-medium max-w-[100px]">{i + 1}. {s.name}</span>
                                <div className="text-right flex items-end gap-2 text-xs">
                                    <span className="text-gray-500">L{s.level}</span>
                                    <span className="text-neon-pink font-mono font-bold text-sm">{s.score}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Menu */}
            {status === 'menu' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
                    <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(255,0,255,0.2)] max-w-md w-full">
                        <h2 className="text-5xl font-black italic mb-1 text-transparent bg-clip-text bg-gradient-to-br from-neon-purple to-neon-pink drop-shadow-[0_0_15px_rgba(255,0,255,0.6)]">
                            NEON RUSH
                        </h2>

                        <a href="https://skyia.net" target="_blank" rel="noreferrer" className="inline-flex flex-col items-center justify-center mb-6 w-full group cursor-pointer">
                            <span className="text-xs uppercase tracking-[0.3em] text-neon-cyan/80 group-hover:text-neon-cyan group-hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] transition-all mb-2">
                                A Skyia.net Experience
                            </span>
                            <span className="text-[10px] text-gray-500 max-w-[250px] leading-tight group-hover:text-gray-400 transition-colors">
                                Simulation Terminal • Subject: AI Extinction Protocol • Objective: Survive to decrypt access codes.
                            </span>
                        </a>

                        <p className="text-gray-300 mb-6 max-w-xs mx-auto text-sm">
                            Swipe left/right or use Arrow Keys to dodge. Accumulate charges to become Invincible and smash obstacles!
                        </p>

                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value.substring(0, 15))}
                                className="w-full bg-black/50 border border-neon-cyan/50 text-white rounded-lg px-4 py-3 outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.5)] text-center font-mono uppercase tracking-widest placeholder:text-neon-cyan/30"
                            />
                        </div>

                        <button
                            onClick={(e) => {
                                (e.currentTarget as HTMLButtonElement).blur();
                                resetGame();
                            }}
                            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-neon-purple font-pj rounded-xl outline-none hover:bg-neon-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-pink"
                        >
                            <div className="absolute inset-0 w-full h-full rounded-xl opacity-50 bg-gradient-to-r from-neon-cyan to-neon-pink blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300"></div>
                            <span className="relative flex items-center gap-2 text-xl tracking-wider uppercase">
                                <Play fill="currentColor" size={24} />
                                Start Game
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* Game Over Screen */}
            {status === 'gameover' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md pointer-events-auto overflow-y-auto py-10">
                    <div className={`text-center p-8 rounded-2xl border shadow-[0_0_50px_rgba(255,0,0,0.3)] max-w-sm w-full relative overflow-hidden ${promo ? 'bg-[#0a192f]/90 border-neon-cyan/50 shadow-[0_0_60px_rgba(0,243,255,0.4)]' : 'bg-red-900/20 border-red-500/30 shadow-[0_0_50px_rgba(255,0,0,0.3)]'}`}>
                        {promo && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-white to-neon-cyan animate-pulse"></div>
                        )}

                        <h2 className={`text-5xl font-black italic mb-2 uppercase ${promo ? 'text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white drop-shadow-[0_0_15px_rgba(0,243,255,0.8)] text-4xl mt-2' : 'text-red-500 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]'}`}>
                            {promo ? 'Data Récupérée' : 'System Failure'}
                        </h2>

                        <div className="my-4">
                            <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Final Score</p>
                            <p className="text-5xl font-mono font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                {Math.floor(score).toString().padStart(6, '0')}
                            </p>
                        </div>

                        {/* Promo Tier Progress Table */}
                        <div className="bg-black/40 border border-white/10 rounded-xl p-3 mb-4">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Codes Promo Skyia.net</p>
                            <div className="flex flex-col gap-2">
                                {PROMO_TIERS.map((tier) => {
                                    const flooredScore = Math.floor(score);
                                    const isUnlocked = flooredScore >= tier.threshold;
                                    const remaining = tier.threshold - flooredScore;
                                    const prevThreshold = PROMO_TIERS[PROMO_TIERS.indexOf(tier) - 1]?.threshold ?? 0;
                                    const progress = Math.min(Math.max((flooredScore - prevThreshold) / (tier.threshold - prevThreshold), 0), 1);

                                    return (
                                        <div key={tier.threshold} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${isUnlocked ? 'bg-neon-cyan/10 border border-neon-cyan/30' : 'bg-white/5 border border-white/5'}`}>
                                            <div className="flex-1 text-left">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`text-xs font-bold uppercase ${isUnlocked ? 'text-neon-cyan' : 'text-gray-400'}`}>
                                                        {isUnlocked ? '✓ ' : ''}{tier.credits} crédits
                                                    </span>
                                                    <span className={`text-[10px] font-mono ${isUnlocked ? 'text-neon-cyan' : 'text-gray-600'}`}>
                                                        {tier.threshold.toLocaleString()} pts
                                                    </span>
                                                </div>
                                                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${isUnlocked ? 'bg-neon-cyan' : 'bg-gradient-to-r from-neon-purple to-neon-cyan'}`}
                                                        style={{ width: `${(isUnlocked ? 1 : progress) * 100}%` }}
                                                    />
                                                </div>
                                                {!isUnlocked && (
                                                    <p className="text-[10px] text-gray-500 mt-1 font-mono">
                                                        Il manque <span className="text-neon-pink font-bold">{remaining.toLocaleString()}</span> pts
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Unlocked Reward */}
                        {promo && (
                            <div className="bg-black/50 border border-neon-cyan/30 rounded-xl p-4 mb-4 relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon-cyan text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Récompense Débloquée
                                </div>
                                <p className="text-sm text-gray-300 mb-2 mt-1">
                                    Vous avez débloqué <span className="text-neon-cyan font-bold">{promo.credits} crédits</span> !
                                </p>
                                <div className="bg-[#050510] border border-white/20 p-2 rounded-lg font-mono text-neon-pink font-bold text-lg tracking-widest select-all relative group cursor-pointer" onClick={() => navigator.clipboard.writeText(promo.code)}>
                                    {promo.code}
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-white text-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Copier</span>
                                </div>
                            </div>
                        )}

                        {/* Big Skyia.net Link */}
                        <a
                            href="https://skyia.net"
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full mb-4 p-4 rounded-xl bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-cyan/40 hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all duration-300 group"
                        >
                            <span className="block text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] group-hover:drop-shadow-[0_0_20px_rgba(0,243,255,1)] transition-all">
                                SKYIA.NET
                            </span>
                            <span className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 group-hover:text-neon-cyan transition-colors mt-1">
                                Simulation IA • Utilisez vos crédits
                            </span>
                        </a>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={(e) => {
                                    (e.currentTarget as HTMLButtonElement).blur();
                                    resetGame();
                                }}
                                className={`group relative inline-flex w-full items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 font-pj rounded-xl outline-none hover:bg-white hover:text-black focus:outline-none ${promo ? 'bg-neon-cyan' : 'bg-red-600'}`}
                            >
                                <div className={`absolute inset-0 w-full h-full rounded-xl opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 ${promo ? 'bg-neon-cyan' : 'bg-red-500'}`}></div>
                                <span className="relative flex items-center gap-2 text-xl uppercase tracking-wider">
                                    <RotateCcw size={24} />
                                    Restart
                                </span>
                            </button>

                            <button
                                onClick={() => setStatus('menu')}
                                className="group relative inline-flex w-full items-center justify-center px-8 py-3 font-bold text-gray-400 transition-all duration-200 bg-transparent border border-white/10 rounded-xl outline-none hover:text-white hover:bg-white/5 focus:outline-none"
                            >
                                <span className="relative flex items-center gap-2 uppercase tracking-wider text-sm">
                                    Menu Principal
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
