import { useState, useEffect } from 'react';
import { AppState, CravingLog, ToolLog, User } from './types';
import { getInitialState, saveState } from './store';
import RegistrationScreen from './components/RegistrationScreen';
import ConsentScreen from './components/ConsentScreen';
import DashboardScreen from './components/DashboardScreen';
import LogCravingScreen from './components/LogCravingScreen';
import ToolsScreen from './components/ToolsScreen';
import ChartsScreen from './components/ChartsScreen';
import ReportScreen from './components/ReportScreen';
import { differenceInCalendarDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export type ScreenType = 'registration' | 'consent' | 'dashboard' | 'logCraving' | 'tools' | 'charts' | 'report';

export default function App() {
  const [appState, setAppState] = useState<AppState>(getInitialState());
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(
    appState.user 
      ? (appState.consentAccepted ? 'dashboard' : 'consent') 
      : 'registration'
  );

  useEffect(() => {
    // Check for streak reset on load
    if (appState.lastActivityDate) {
      const lastActivity = new Date(appState.lastActivityDate);
      const diff = differenceInCalendarDays(new Date(), lastActivity);
      if (diff > 1 && appState.streak > 0) {
        updateState({ streak: 0 });
      }
    }
  }, []);

  const updateState = (updates: Partial<AppState>) => {
    setAppState(prev => {
      const newState = { ...prev, ...updates };
      saveState(newState);
      return newState;
    });
  };

  const handleWithdrawConsent = () => {
    localStorage.removeItem('cuefinder_state');
    const emptyState = getInitialState();
    setAppState(emptyState);
    setCurrentScreen('registration');
  };

  const handleActivity = () => {
    const today = new Date().toISOString();
    const lastActivity = appState.lastActivityDate ? new Date(appState.lastActivityDate) : null;
    let newStreak = appState.streak;

    if (!lastActivity) {
      newStreak = 1;
    } else {
      const diff = differenceInCalendarDays(new Date(today), lastActivity);
      if (diff === 1) {
        newStreak += 1;
      } else if (diff > 1) {
        newStreak = 1;
      }
    }

    updateState({ lastActivityDate: today, streak: newStreak });
  };

  const handleSaveCraving = (description: string, triggers: string[]) => {
    const newLog: CravingLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      text: description,
      triggers
    };
    updateState({ cravingLogs: [...appState.cravingLogs, newLog] });
    handleActivity();
    setCurrentScreen('dashboard');
  };

  const handleCompleteTool = (toolId: string) => {
    const toolNames: Record<string, string> = {
      respiracion: 'Respiración 4-7-8',
      urge_surfing: 'Urge Surfing',
      tecnica_54321: 'Técnica 5-4-3-2-1',
      postergacion: 'Postergación Consciente',
      razones: 'Lista de Razones',
      reestructuracion: 'Reestructuración Cognitiva',
      afirmaciones: 'Afirmaciones Breves',
      caminata: 'Caminata Consciente',
      visualizacion: 'Visualización',
      sustitucion: 'Sustitución Oral'
    };

    const hour = new Date().getHours();
    let timeOfDay = 'Noche';
    if (hour >= 5 && hour < 12) timeOfDay = 'Mañana';
    else if (hour >= 12 && hour < 19) timeOfDay = 'Tarde';

    const newLog: ToolLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      toolId,
      toolName: toolNames[toolId] || toolId,
      timeOfDay
    };
    updateState({ toolLogs: [...appState.toolLogs, newLog] });
    handleActivity();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'registration':
        return <RegistrationScreen onRegister={(user) => {
          updateState({ user: { ...user, registeredAt: new Date().toISOString() } });
          setCurrentScreen('consent');
        }} />;
      case 'consent':
        return <ConsentScreen 
          onAccept={() => {
            updateState({ consentAccepted: true });
            setCurrentScreen('dashboard');
          }}
          onReject={() => {
            updateState({ user: null, consentAccepted: false });
            setCurrentScreen('registration');
          }}
        />;
      case 'dashboard':
        return <DashboardScreen 
          appState={appState} 
          onNavigate={setCurrentScreen} 
          onWithdrawConsent={handleWithdrawConsent}
        />;
      case 'logCraving':
        return <LogCravingScreen 
          onSave={handleSaveCraving}
          onBack={() => setCurrentScreen('dashboard')}
        />;
      case 'tools':
        return <ToolsScreen 
          appState={appState}
          onComplete={handleCompleteTool}
          onBack={() => setCurrentScreen('dashboard')}
        />;
      case 'charts':
        return <ChartsScreen 
          appState={appState}
          onBack={() => setCurrentScreen('dashboard')}
        />;
      case 'report':
        return <ReportScreen 
          appState={appState}
          onUpdateState={updateState}
          onBack={() => setCurrentScreen('dashboard')}
        />;
      default:
        return <DashboardScreen 
          appState={appState} 
          onNavigate={setCurrentScreen} 
          onWithdrawConsent={handleWithdrawConsent}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl overflow-hidden relative flex flex-col">
        {renderScreen()}
      </div>
    </div>
  );
}
