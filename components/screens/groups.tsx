import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft } from 'lucide-react';
import type { User } from './auth-page';
import { Header } from '../header';
import { DatePickerWithRange } from "@/components/ui/date-picker";

interface GroupsScreenProps {
  user: User;
  onGroupSelected: (group: { id: string; name: string; code: string }) => void;
  onBack: () => void;
  onSignOut: () => void;
  onGoToActivities?: (group: { id: string; name: string; code: string }) => void;
  onGoToTripOverview?: (group: { id: string; name: string; code: string }) => void;
}

interface GroupWithUsers {
  id: string;
  name: string;
  code: string;
  state: 'preferences' | 'activities' | 'final';
  startDate: string;
  endDate: string;
  recommendations?: {
    destination: string;
    activities: string[];
    explanation: string;
  };
  users: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
}

export function GroupsScreen({ user, onGroupSelected, onBack, onGoToActivities, onGoToTripOverview, onSignOut }: GroupsScreenProps) {
  const [mode, setMode] = useState<'list' | 'create' | 'join'>('list');
  const [groupName, setGroupName] = useState('');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupWithUsers[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const handleDateChange = (start: string | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    // Fetch groups the user is in
    const fetchGroups = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_groups')
        .select(`
          group_id,
          groups (
            name,
            code,
            state,
            recommendations,
            trip_start_date,
            trip_end_date
          )
        `)
        .eq('user_id', user.id);
      
      if (!error && data) {
        // For each group, fetch all its users
        const groupsWithUsers = await Promise.all(
          data.map(async (g: any) => {
            const { data: usersData, error: usersError } = await supabase
              .from('user_groups')
              .select(`
                users (
                  id,
                  first_name,
                  last_name
                )
              `)
              .eq('group_id', g.group_id);
            
            return {
              id: g.group_id,
              name: g.groups.name,
              code: g.groups.code,
              state: g.groups.state || 'preferences',
              recommendations: g.groups.recommendations,
              startDate: g.groups.trip_start_date,
              endDate: g.groups.trip_end_date,
              users: usersData?.map((u: any) => ({
                id: u.users.id,
                firstName: u.users.first_name,
                lastName: u.users.last_name
              })) || []
            };
          })
        );
        
        setGroups(groupsWithUsers);
      }
      setIsLoading(false);
    };
    fetchGroups();
  }, [user.id]);

  const handleCreateGroup = async () => {
    if (!groupName) {
      setError('Group name is required');
      return;
    }
    if (!endDate || !startDate) {
      setError('Start and end dates are required');
      return;
    }
    setIsLoading(true);
    setError(null);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const groupId = uuidv4();
    console.log('dates', startDate, endDate);
    const { error: groupError } = await supabase.from('groups').insert([
      { id: groupId, name: groupName, code, state: 'preferences', trip_start_date: startDate, trip_end_date: endDate }
    ]);
    if (groupError) {
      setError('Failed to create group');
      setIsLoading(false);
      return;
    }
    // Add user to group
    await supabase.from('user_groups').insert([
      { user_id: user.id, group_id: groupId }
    ]);
    setCreatedCode(code);
    setGroups([...groups, { id: groupId, name: groupName, code, state: 'preferences', users: [], trip_start_date: startDate, trip_end_date: endDate }]);
    setIsLoading(false);
    setMode('list');
    onGroupSelected({ id: groupId, name: groupName, code });
  };

  const handleJoinGroup = async () => {
    if (!joinCode) {
      setError('Group code is required');
      return;
    }
    setIsLoading(true);
    setError(null);
    // Find group by code
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, name, code, state, trip_start_date, trip_end_date')
      .eq('code', joinCode)
      .single();
    if (groupError || !group) {
      setError('Group not found');
      setIsLoading(false);
      return;
    }
    // Add user to group
    const { error: joinError } = await supabase.from('user_groups').insert([
      { user_id: user.id, group_id: group.id }
    ]);
    if (joinError) {
      setError('Failed to join group');
      setIsLoading(false);
      return;
    }
    setGroups([...groups, { id: group.id, name: group.name, code: group.code, startDate: group.trip_start_date, endDate: group.trip_end_date , state: group.state || 'preferences', users: [] }]);
    setIsLoading(false);
    setMode('list');
    onGroupSelected(group);
  };

  // Handler for going back to the main list
  const handleBackToList = () => setMode('list');

  const handleGroupClick = (group: GroupWithUsers) => {
    if (group.state === 'activities') {
      onGoToActivities?.(group);
    } else if (group.state === 'final') {
      onGoToTripOverview?.(group);
    } else {
      onGroupSelected(group);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-100 via-white to-white py-4">
      <Header
        user={user}
        onBack={mode === 'create' || mode === 'join' ? handleBackToList : undefined}
        onSignOut={onSignOut}
      />
      <h2 className="text-lg font-bold mb-2 px-4">Groups</h2>
      {mode === 'list' && (
        <>
          <div className="mb-6 px-4">
            <button onClick={() => setMode('create')} className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold mb-2">Create Group</button>
            <button onClick={() => setMode('join')} className="w-full bg-gray-200 text-gray-800 py-3 rounded-full font-semibold">Join Group</button>
          </div>
          <h3 className="text-lg font-semibold mb-2 px-4">Your Groups</h3>
          {isLoading ? <div>Loading...</div> : (
            <ul className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4">
              {groups.map((g) => (
                <li key={g.id} className="bg-white rounded-xl p-4 shadow">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="font-semibold">{g.name}</span>
                      <span className="text-xs text-gray-400 ml-2">Code: {g.code}</span>
                    </div>
                    <button
                      className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors"
                      onClick={() => handleGroupClick(g)}
                    >
                      {g.state === 'preferences' ? 'Go to Home' : g.state === 'activities' ? 'Go to Activities' : 'Go to Travel'}
                    </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                {/* Flight dates */}
                <div className="mt-2 flex flex-col items-end">
                  <p className="text-sm text-gray-700">From: {g?.startDate ? g.startDate.split("T")[0] : "."}</p>
                  <p className="text-sm text-gray-700">To: {g?.endDate ? g.endDate.split("T")[0] : "."}</p>
                </div>
    
              {/* Mostrar miembros */}
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Members:</h4>
                <div className="flex flex-wrap gap-2">
                  {g.users.map((u) => (
                    <div key={u.id} className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                      <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-medium text-blue-600 mr-2">
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <span className="text-sm">{u.firstName} {u.lastName}</span>
                    </div>
                  ))}
                </div>
              </div>
    </div>
  </li>
))}

              {groups.length === 0 && <li className="text-gray-500">You are not in any groups yet.</li>}
            </ul>
          )}
        </>
      )}
      {mode === 'create' && (
        <div className="flex flex-col space-y-4 px-4">
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            className="p-3 rounded-xl border border-gray-300"
          />

          <DatePickerWithRange
            className="w-full"
            onDateChange={handleDateChange} // Pass date change handler
          />


          <button onClick={handleCreateGroup} className="bg-blue-600 text-white py-3 rounded-full font-semibold" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </button>
          {createdCode && <div className="text-green-600">Group created! Share this code: <b>{createdCode}</b></div>}
          {error && <div className="text-red-500">{error}</div>}
        </div>
      )}
      {mode === 'join' && (
        <div className="flex flex-col space-y-4 px-4">
          <input
            type="text"
            placeholder="Enter group code"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            className="p-3 rounded-xl border border-gray-300"
          />
          <button onClick={handleJoinGroup} className="bg-blue-600 text-white py-3 rounded-full font-semibold" disabled={isLoading}>
            {isLoading ? 'Joining...' : 'Join'}
          </button>
          {error && <div className="text-red-500">{error}</div>}
        </div>
      )}
    </div>
  );
} 