import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n';
import { useAuth } from '../../contexts/AuthContext'

const Avatar = ({ name }) => {
  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('') || 'U'
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-gray-700 dark:text-white text-sm font-semibold">
      {initials}
    </div>
  )
}


const LANGS = [
  { code: 'es', label: 'ES', name: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'ro', label: 'RO', name: 'Română', flag: '🇷🇴' },
  { code: 'it', label: 'IT', name: 'Italiano', flag: '🇮🇹' },
];

const AccountPanel = () => {

  const { user, logout } = useAuth();
  const { i18n, t } = useTranslation();
  const [langMenu, setLangMenu] = useState(false);
  const langBtnRef = useRef();
  if (!user) return null;

  // Idioma actual
  const currentLang = i18n.language || 'es';
  const current = LANGS.find(l => l.code === currentLang) || LANGS[0];

  // Cierra el menú si se hace click fuera
  React.useEffect(() => {
    if (!langMenu) return;
    function handle(e) {
      if (langBtnRef.current && !langBtnRef.current.contains(e.target)) setLangMenu(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [langMenu]);

  // Cambia idioma global y guarda en localStorage
  const handleLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setLangMenu(false);
  };

  return (
    <div className="bg-white/90 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-200 backdrop-blur transition-colors relative">
      <div className="flex justify-between items-start mb-2">
        <div />
        {/* Botón idioma */}
        <div ref={langBtnRef}>
          <button
            type="button"
            aria-label="Seleccionar idioma"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold shadow-sm border border-gray-200 dark:border-gray-700 focus:outline-none"
            onClick={() => setLangMenu(v => !v)}
            style={{marginLeft:'auto'}}>
            <span role="img" aria-label="Idioma" style={{fontSize:'1.1em'}}>🌐</span>
            <span>{current.label}</span>
          </button>
          {langMenu && (
            <div className="absolute right-3 mt-2 w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 animate-fadeIn" style={{minWidth:80}}>
              {LANGS.map(l => (
                <button
                  key={l.code}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-800 ${l.code===currentLang?'font-bold text-blue-600 dark:text-blue-400':''}`}
                  onClick={() => handleLang(l.code)}
                  tabIndex={0}
                >
                  <span>{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* ...existing code... */}
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <Avatar name={user?.nombre} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate text-gray-900 dark:text-gray-100" title={user?.nombre}>{user?.nombre}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={user?.email}>{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-600 dark:text-gray-300 text-xs capitalize">{t('admin')}</span>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={logout}
          aria-label={t('logout')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
        >
          {t('logout')}
        </button>
      </div>
    </div>
  );
}

export default AccountPanel
