import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft } from 'lucide-react';
import type { User } from './auth-page';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface GroupsScreenProps {
  user: User;
  onGroupSelected: (group: { id: string; name: string; code: string }) => void;
  onBack: () => void;
}

interface GroupWithUsers {
  id: string;
  name: string;
  code: string;
  users: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
}

interface UserGroupRecord {
  group_id: string;
  user_id: string;
}

interface GroupRecord {
  id: string;
  name: string;
  code: string;
}

export function GroupsScreen({ user, onGroupSelected, onBack }: GroupsScreenProps) {
  const [mode, setMode] = useState<'list' | 'create' | 'join'>('list');
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupWithUsers[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const fetchGroupUsers = async (groupId: string) => {
    const { data: usersData } = await supabase
      .from('user_groups')
      .select(`
        users (
          id,
          first_name,
          last_name
        )
      `)
      .eq('group_id', groupId);

    return usersData?.map((u: any) => ({
      id: u.users.id,
      firstName: u.users.first_name,
      lastName: u.users.last_name
    })) || [];
  };

  const fetchGroups = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('user_groups')
      .select(`
        group_id,
        groups (
          name,
          code
        )
      `)
      .eq('user_id', user.id);
    
    if (!error && data) {
      const groupsWithUsers = await Promise.all(
        data.map(async (g: any) => ({
          id: g.group_id,
          name: g.groups.name,
          code: g.groups.code,
          users: await fetchGroupUsers(g.group_id)
        }))
      );
      
      setGroups(groupsWithUsers);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGroups();

    // Subscribe to changes in user_groups table
    const userGroupsSubscription = supabase
      .channel('user_groups_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_groups'
        },
        async (payload) => {
          const newRecord = payload.new as UserGroupRecord | null;
          const oldRecord = payload.old as UserGroupRecord | null;
          const groupId = newRecord?.group_id || oldRecord?.group_id;
          
          if (groupId) {
            const affectedGroup = groups.find(g => g.id === groupId);
            if (affectedGroup) {
              // Update the users for the affected group
              const updatedUsers = await fetchGroupUsers(affectedGroup.id);
              setGroups(currentGroups => 
                currentGroups.map(g => 
                  g.id === affectedGroup.id 
                    ? { ...g, users: updatedUsers }
                    : g
                )
              );
            }
          }
        }
      )
      .subscribe();

    // Subscribe to changes in groups table
    const groupsSubscription = supabase
      .channel('groups_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'groups'
        },
        async (payload) => {
          const newRecord = payload.new as GroupRecord | null;
          const oldRecord = payload.old as GroupRecord | null;
          const groupId = newRecord?.id || oldRecord?.id;
          
          if (groupId) {
            const affectedGroup = groups.find(g => g.id === groupId);
            if (affectedGroup) {
              // Refresh all groups to ensure we have the latest data
              await fetchGroups();
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      userGroupsSubscription.unsubscribe();
      groupsSubscription.unsubscribe();
    };
  }, [user.id]);

  const handleCreateGroup = async () => {
    if (!groupName) {
      setError('Group name is required');
      return;
    }
    setIsLoading(true);
    setError(null);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const groupId = uuidv4();
    const { error: groupError } = await supabase.from('groups').insert([
      { id: groupId, name: groupName, code }
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
    setGroups([...groups, { id: groupId, name: groupName, code, users: [] }]);
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
      .select('id, name, code')
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
    setGroups([...groups, { id: group.id, name: group.name, code: group.code, users: [] }]);
    setIsLoading(false);
    setMode('list');
    onGroupSelected(group);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-100 via-white to-white p-4">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h2 className="ml-4 text-xl font-bold">Groups</h2>
      </div>
      {mode === 'list' && (
        <>
          <div className="mb-6">
            <button onClick={() => setMode('create')} className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold mb-2">Create Group</button>
            <button onClick={() => setMode('join')} className="w-full bg-gray-200 text-gray-800 py-3 rounded-full font-semibold">Join Group</button>
          </div>
          <h3 className="text-lg font-semibold mb-2">Your Groups</h3>
          {isLoading ? <div>Loading...</div> : (
            <ul className="space-y-4">
              {groups.map((g) => (
                <li key={g.id} className="bg-white rounded-xl p-4 shadow">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="font-semibold">{g.name}</span>
                      <span className="text-xs text-gray-400 ml-2">Code: {g.code}</span>
                    </div>
                    <button
                      className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors"
                      onClick={() => onGroupSelected(g)}
                    >
                      Go to Home
                    </button>
                  </div>
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
                </li>
              ))}
              {groups.length === 0 && <li className="text-gray-500">You are not in any groups yet.</li>}
            </ul>
          )}
        </>
      )}
      {mode === 'create' && (
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            className="p-3 rounded-xl border border-gray-300"
          />
          <button onClick={handleCreateGroup} className="bg-blue-600 text-white py-3 rounded-full font-semibold" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </button>
          {createdCode && <div className="text-green-600">Group created! Share this code: <b>{createdCode}</b></div>}
          {error && <div className="text-red-500">{error}</div>}
          <button onClick={() => setMode('list')} className="text-blue-600 underline">Back to groups</button>
        </div>
      )}
      {mode === 'join' && (
        <div className="flex flex-col space-y-4">
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
          <button onClick={() => setMode('list')} className="text-blue-600 underline">Back to groups</button>
        </div>
      )}
    </div>
  );
} 