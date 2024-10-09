import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import RewardsPage from './pages/RewardsPage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { User, Reward, PurchasableReward } from './types';
import { databaseService } from './services/DatabaseService';

const LEVELS = ['Bronce', 'Plata', 'Oro', 'Platino', 'Diamante', 'Maestro', 'Gran Maestro', 'Leyenda', 'Mítico', 'Divino'];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [purchasableRewards, setPurchasableRewards] = useState<PurchasableReward[]>([]);

  useEffect(() => {
    const initApp = async () => {
      await databaseService.initDB();
      const storedUser = await databaseService.getUser('DefaultUser');
      if (storedUser) {
        setUser(storedUser);
      } else {
        const newUser: User = {
          name: 'DefaultUser',
          level: 1,
          points: 0,
          pointsPerHour: 10,
        };
        await databaseService.saveUser(newUser);
        setUser(newUser);
      }

      const storedRewards = await databaseService.getRewards();
      if (storedRewards.length > 0) {
        setRewards(storedRewards);
      } else {
        const initialRewards: Reward[] = [
          { id: 1, name: 'Recompensa Diaria', icon: 'gift', timeRemaining: 86400 },
          { id: 2, name: 'Bonus Semanal', icon: 'star', timeRemaining: 604800 },
          { id: 3, name: 'Evento Especial', icon: 'zap', timeRemaining: 172800 },
        ];
        await databaseService.saveRewards(initialRewards);
        setRewards(initialRewards);
      }

      const storedPurchasableRewards = await databaseService.getPurchasableRewards();
      if (storedPurchasableRewards.length > 0) {
        setPurchasableRewards(storedPurchasableRewards);
      } else {
        const initialPurchasableRewards: PurchasableReward[] = [
          { id: 1, name: 'Mejora Básica', description: 'Aumenta ligeramente tus puntos por hora', cost: 100, pointsPerHourIncrease: 1 },
          { id: 2, name: 'Mejora Avanzada', description: 'Aumenta moderadamente tus puntos por hora', cost: 500, pointsPerHourIncrease: 5 },
          { id: 3, name: 'Mejora Premium', description: 'Aumenta significativamente tus puntos por hora', cost: 2000, pointsPerHourIncrease: 20 },
          { id: 4, name: 'Premium', description: 'Aumenta significativamente tus puntos por hora', cost: 100, pointsPerHourIncrease: 20000 },
        ];
        await databaseService.savePurchasableRewards(initialPurchasableRewards);
        setPurchasableRewards(initialPurchasableRewards);
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    if (!user) return;

    const timer = setInterval(async () => {
      const updatedUser = {
        ...user,
        points: user.points + user.pointsPerHour / 3600,
      };
      setUser(updatedUser);
      await databaseService.saveUser(updatedUser);

      const updatedRewards = rewards.map(reward => ({
        ...reward,
        timeRemaining: Math.max(0, reward.timeRemaining - 1),
      }));
      setRewards(updatedRewards);
      await databaseService.saveRewards(updatedRewards);
    }, 1000);

    return () => clearInterval(timer);
  }, [user, rewards]);

  useEffect(() => {
    if (!user) return;

    const pointsForNextLevel = (user.level + 1) * 1000;
    if (user.points >= pointsForNextLevel) {
      const updatedUser = {
        ...user,
        level: user.level + 1,
        pointsPerHour: user.pointsPerHour * 1.1,
      };
      setUser(updatedUser);
      databaseService.saveUser(updatedUser);
    }
  }, [user?.points]);

  const handleClick = async () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      points: user.points + 1,
    };
    setUser(updatedUser);
    await databaseService.saveUser(updatedUser);
  };

  const handlePurchaseReward = async (rewardId: number) => {
    if (!user) return;
    const reward = purchasableRewards.find(r => r.id === rewardId);
    if (!reward || user.points < reward.cost) return;

    const updatedUser = {
      ...user,
      points: user.points - reward.cost,
      pointsPerHour: user.pointsPerHour + reward.pointsPerHourIncrease,
    };
    setUser(updatedUser);
    await databaseService.saveUser(updatedUser);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header user={user} />
        <main className="flex-grow p-4 pb-20">
          <Routes>
            <Route path="/" element={<Home user={user} rewards={rewards} handleClick={handleClick} />} />
            <Route path="/rewards" element={<RewardsPage rewards={rewards} purchasableRewards={purchasableRewards} user={user} onPurchaseReward={handlePurchaseReward} />} />
            <Route path="/stats" element={<StatsPage user={user} />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <Navigation />
      </div>
    </Router>
  );
};

export default App;