/**
 * Login.jsx
 *
 * Página de inicio de sesión para la aplicación VardAssets.
 * Incluye animación de introducción, formulario de login, soporte para recordar sesión y validación de usuario.
 * Utiliza AuthContext para autenticación y react-i18next para internacionalización.
 */

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import '../i18n';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [langMenu, setLangMenu] = useState(false);
  const loginBoxRef = useRef(null);
  const langBtnRef = useRef(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const LANGS = [
    { code: 'en', label: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'ro', label: 'RO', name: 'Română', flag: '🇷🇴' },
  ];

  const currentLang = i18n.language || 'en';
  const current = LANGS.find(l => l.code === currentLang) || LANGS[0];

  const handleLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setLangMenu(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ Usuario ya autenticado, redirigiendo...');
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Close language menu when clicking outside
  useEffect(() => {
    if (!langMenu) return;
    const handleClickOutside = (e) => {
      if (langBtnRef.current && !langBtnRef.current.contains(e.target)) {
        setLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langMenu]);

  // Animación splash de entrada
  useEffect(() => {
    if (!showIntro) return;
    const timer1 = setTimeout(() => {
      // Fade out intro
      const intro = document.getElementById('introScreen');
      if (intro) intro.style.opacity = '0';
    }, 3500);
    const timer2 = setTimeout(() => {
      setShowIntro(false);
      setShowLogin(true);
      setTimeout(() => {
        if (loginBoxRef.current) loginBoxRef.current.classList.add('active');
      }, 100);
    }, 4000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [showIntro]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Usar email en lugar de username
    const result = await login(username, password);
    
    if (result.success) {
      console.log('✅ Navegando a dashboard...');
      setTimeout(() => navigate("/dashboard"), 500);
    } else {
      console.error('❌ Login fallido:', result.error);
      // Aquí podrías mostrar un toast o mensaje de error
      alert(result.error || 'Credenciales inválidas');
    }
    
    setLoading(false);
  };

  // Fuentes externas (Orbitron, Exo 2)
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Animación de partículas (simple, opcional)
  useEffect(() => {
    const container = document.getElementById("particles");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      const duration = Math.random() * 20 + 10;
      particle.style.animation = `float ${duration}s infinite linear`;
      container.appendChild(particle);
    }
  }, [showLogin]);

  return (
    <div
      className="min-h-screen w-full bg-[#0a0a16] relative font-['Exo 2'],sans-serif overflow-hidden"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
      }}
    >
      {/* Splash animación de entrada */}
      {showIntro && (
        <div className="intro-screen" id="introScreen" style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'#0a0a16',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000,flexDirection:'column',transition:'opacity 0.5s ease'}}>
          <div className="logo-container" style={{display:'flex',alignItems:'center',position:'relative'}}>
            <h1 className="vard-text" style={{fontFamily:'Orbitron,sans-serif',fontSize:'5rem',fontWeight:900,color:'#ff0033',textShadow:'0 0 20px #ff0033, 0 0 40px #ff0033',letterSpacing:'5px',opacity:0,transform:'translateY(50px)',animation:'vard-entrance 1.5s forwards 0.5s'}}>VARD</h1>
            <h1 className="assets-text" style={{fontFamily:'Orbitron,sans-serif',fontSize:'5rem',fontWeight:900,color:'#fff',textShadow:'0 0 20px #fff, 0 0 40px #fff',letterSpacing:'5px',opacity:0,transform:'translateY(50px)',animation:'assets-entrance 1.5s forwards 1s'}}>ASSETS</h1>
          </div>
          <div className="loading-bar" style={{width:300,height:4,background:'rgba(255,255,255,0.1)',marginTop:40,borderRadius:2,overflow:'hidden',opacity:0,animation:'fade-in 0.5s forwards 1.5s'}}>
            <div className="loading-progress" style={{width:'0%',height:'100%',background:'linear-gradient(90deg,#ff0033,#fff)',borderRadius:2,animation:'loading 2s forwards 1.5s'}}></div>
          </div>
          <div className="glow-effect" style={{top:'30%',left:'30%'}} />
          <div className="glow-effect" style={{top:'60%',right:'30%',animationDelay:'1s'}} />
        </div>
      )}

      {/* Partículas de fondo */}
      <div className="particles" id="particles" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />

      {/* Language Selector - Top Right */}
      {showLogin && (
        <div ref={langBtnRef} style={{ position: 'fixed', top: 20, right: 20, zIndex: 50 }}>
          <button
            type="button"
            aria-label="Select language"
            className="lang-selector-btn"
            onClick={() => setLangMenu(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,0,51,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <span role="img" aria-label="Language" style={{ fontSize: 18 }}>🌐</span>
            <span>{current.label}</span>
          </button>
          {langMenu && (
            <div
              className="lang-menu"
              style={{
                position: 'absolute',
                right: 0,
                marginTop: 8,
                minWidth: 140,
                background: 'rgba(10,10,22,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              {LANGS.map(l => (
                <button
                  key={l.code}
                  className="lang-option"
                  onClick={() => handleLang(l.code)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: l.code === currentLang ? '#ff0033' : '#fff',
                    fontSize: 13,
                    fontWeight: l.code === currentLang ? 700 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Glow effects */}
      <div className="glow-effect" style={{ top: '30%', left: '30%' }} />
      <div className="glow-effect" style={{ top: '60%', right: '30%', animationDelay: '1s' }} />

      {/* Login box */}
      <div
        ref={loginBoxRef}
        className={`login-box${showLogin ? ' active' : ''}`}
        style={{
          zIndex: 10,
          opacity: showLogin ? 1 : 0,
          transform: showLogin ? 'scale(1)' : 'scale(0.96)',
          pointerEvents: showLogin ? 'auto' : 'none',
          transition: 'all 0.5s cubic-bezier(.4,1.2,.4,1)',
          margin: 0,
          position: 'relative',
          width: '100%',
          maxWidth: 450,
          minWidth: 0,
        }}
      >
        <div className="login-header">
          <h2 className="login-title">{t('auth.title')}</h2>
          <p className="login-subtitle">{t('auth.subtitle')}</p>
        </div>
        <form id="loginForm" onSubmit={handleSubmit} autoComplete="on">
          <div className="input-group">
            <label className="input-label" htmlFor="username">{t('auth.user')}</label>
            <input
              id="username"
              type="text"
              className="input-field"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="input-group" style={{ position: 'relative' }}>
            <label className="input-label" htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="input-field"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a0a0c0', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              {showPassword ? '🔒' : '👁️'}
            </button>
          </div>
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                className="remember-checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              {t('auth.remember')}
            </label>
            <a href="#" className="forgot-password" tabIndex={0} onClick={e => e.preventDefault()}>{t('auth.forgot')}</a>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? t('auth.verifying') : t('auth.button')}
            <div className="button-glow"></div>
          </button>
          <div className="register-link">
            {t('auth.register').split(/(\<a\>.*?\<\/a\>)/g).map((part, i) =>
              part.startsWith('<a>') ? <a key={i} href="#" tabIndex={0} onClick={e => e.preventDefault()}>{part.replace(/<\/?a>/g, '')}</a> : part
            )}
          </div>
        </form>
      </div>

      {/* Estilos en línea para la animación y el diseño */}
      <style>{`
        @media (max-width: 600px) {
          .login-box {
            padding: 1.2rem !important;
            width: 98vw !important;
            max-width: 98vw !important;
            min-width: 0 !important;
            border-radius: 10px !important;
          }
          .login-title {
            font-size: 1.2rem !important;
          }
          .input-field {
            font-size: 0.95rem !important;
            padding: 0.8rem !important;
          }
          .login-button {
            font-size: 1rem !important;
            padding: 0.8rem !important;
          }
        }
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');
        .login-box {
          background: rgba(10, 15, 35, 0.8);
          padding: 3rem;
          border-radius: 15px;
          width: 450px;
          max-width: 90%;
          box-shadow: 0 0 40px rgba(255, 0, 51, 0.3);
          border: 1px solid rgba(255, 0, 51, 0.2);
          backdrop-filter: blur(10px);
          transform: scale(0.9);
          opacity: 0;
          transition: all 0.5s ease;
        }
        .login-box.active {
          transform: scale(1);
          opacity: 1;
        }
        .intro-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #0a0a16;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          flex-direction: column;
          transition: opacity 0.5s ease;
        }
        .logo-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        .vard-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 5rem;
          font-weight: 900;
          color: #ff0033;
          text-shadow: 0 0 20px #ff0033, 0 0 40px #ff0033;
          letter-spacing: 5px;
          opacity: 0;
          transform: translateY(50px);
          animation: vard-entrance 1.5s forwards 0.5s;
        }
        .assets-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 5rem;
          font-weight: 900;
          color: #ffffff;
          text-shadow: 0 0 20px #ffffff, 0 0 40px #ffffff;
          letter-spacing: 5px;
          opacity: 0;
          transform: translateY(50px);
          animation: assets-entrance 1.5s forwards 1s;
        }
        .loading-bar {
          width: 300px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          margin-top: 40px;
          border-radius: 2px;
          overflow: hidden;
          opacity: 0;
          animation: fade-in 0.5s forwards 1.5s;
        }
        .loading-progress {
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #ff0033, #ffffff);
          border-radius: 2px;
          animation: loading 2s forwards 1.5s;
        }
        @keyframes vard-entrance {
          0% {
            opacity: 0;
            transform: translateY(50px);
            text-shadow: 0 0 0 #ff0033;
          }
          70% {
            opacity: 1;
            transform: translateY(-10px);
            text-shadow: 0 0 30px #ff0033;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            text-shadow: 0 0 20px #ff0033, 0 0 40px #ff0033;
          }
        }
        @keyframes assets-entrance {
          0% {
            opacity: 0;
            transform: translateY(50px);
            text-shadow: 0 0 0 #ffffff;
          }
          70% {
            opacity: 1;
            transform: translateY(-10px);
            text-shadow: 0 0 30px #ffffff;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            text-shadow: 0 0 20px #ffffff, 0 0 40px #ffffff;
          }
        }
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(90deg, #ff0033, #ffffff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .login-subtitle {
          color: #a0a0c0;
          font-size: 1rem;
        }
        .input-group {
          margin-bottom: 1.5rem;
          position: relative;
        }
        .input-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .input-field {
          width: 100%;
          padding: 1rem;
          background: rgba(20, 25, 45, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s;
        }
        .input-field:focus {
          outline: none;
          border-color: #ff0033;
          box-shadow: 0 0 15px rgba(255, 0, 51, 0.3);
        }
        .input-field::placeholder {
          color: #606080;
        }
        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #a0a0c0;
          cursor: pointer;
          font-size: 1.2rem;
        }
        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }
        .remember-me {
          display: flex;
          align-items: center;
        }
        .remember-checkbox {
          margin-right: 8px;
          accent-color: #ff0033;
        }
        .forgot-password {
          color: #ff0033;
          text-decoration: none;
          transition: all 0.3s;
        }
        .forgot-password:hover {
          text-shadow: 0 0 10px #ff0033;
        }
        .login-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(90deg, #ff0033, #ff3366);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(255, 0, 51, 0.4);
        }
        .login-button:active {
          transform: translateY(0);
        }
        .button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }
        .login-button:hover .button-glow {
          left: 100%;
        }
        .register-link {
          text-align: center;
          margin-top: 1.5rem;
          color: #a0a0c0;
          font-size: 0.9rem;
        }
        .register-link a {
          color: #ff0033;
          text-decoration: none;
          font-weight: 600;
        }
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #ff0033;
          border-radius: 50%;
          box-shadow: 0 0 10px #ff0033;
        }
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.1;
          }
          25% {
            transform: translate(10px, -10px) rotate(90deg);
            opacity: 0.5;
          }
          50% {
            transform: translate(-10px, 10px) rotate(180deg);
            opacity: 0.8;
          }
          75% {
            transform: translate(10px, 10px) rotate(270deg);
            opacity: 0.5;
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
            opacity: 0.1;
          }
        }
        .glow-effect {
          position: absolute;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255, 0, 51, 0.4), transparent 70%);
          border-radius: 50%;
          filter: blur(30px);
          opacity: 0;
          animation: glow-pulse 4s infinite;
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default Login;