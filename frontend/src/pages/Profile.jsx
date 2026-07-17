import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Compass, Sprout, Layers, Save, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [size, setSize] = useState(0);
  const [location, setLocation] = useState('');
  const [cropTypes, setCropTypes] = useState('');
  const [soilType, setSoilType] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setSize(user.farmDetails?.size || 0);
      setLocation(user.farmDetails?.location || '');
      setCropTypes(user.farmDetails?.cropTypes?.join(', ') || '');
      setSoilType(user.farmDetails?.soilType || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const cropsArray = cropTypes
      .split(',')
      .map((crop) => crop.trim())
      .filter((crop) => crop.length > 0);

    const profileData = {
      name,
      farmDetails: {
        size: parseFloat(size) || 0,
        location,
        cropTypes: cropsArray,
        soilType,
      },
    };

    try {
      await updateProfile(profileData);
      setSuccess('Profile and Farm details updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-3xl">
          User & Farm Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your account profile and configure farm parameters to refine agriculture intelligence suggestions.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Account Info card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-md backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
            <User className="h-6 w-6 text-primary-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Account Details</h2>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm placeholder-slate-400 outline-none transition-all focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="block w-full rounded-xl border border-slate-200 bg-slate-100/50 py-3 px-4 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Farm Details Info Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-md backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
            <Sprout className="h-6 w-6 text-primary-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Farm Specifications</h2>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Farm Size (Acres)
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Compass className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-primary-500"
                  placeholder="e.g. 15.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Location / Region
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-primary-500"
                  placeholder="e.g. California Valley"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Soil Classification
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Layers className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-primary-500"
                >
                  <option value="" disabled>Select Soil Type</option>
                  <option value="clay">Clay (Rich in nutrients, retains water)</option>
                  <option value="sandy">Sandy (Well-drained, acidic, warm)</option>
                  <option value="silty">Silty (Fertile, retains moisture easily)</option>
                  <option value="loamy">Loamy (Optimal balance, premium quality)</option>
                  <option value="peaty">Peaty (High organic matter, acidic)</option>
                  <option value="chalky">Chalky (Alkaline, stony, free draining)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Current Crops (Comma separated)
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Sprout className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={cropTypes}
                  onChange={(e) => setCropTypes(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-primary-500"
                  placeholder="e.g. Corn, Wheat, Soybean"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3 px-6 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-50 transition-all duration-200 shadow-md shadow-primary-500/10"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
