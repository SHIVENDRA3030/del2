'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search } from 'lucide-react'
import styles from './page.module.css'

export default function AdminUsersPage() {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)
    const [message, setMessage] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const supabase = createClient()

    useEffect(() => {
        fetchRoles()
        fetchUsers()
    }, [])

    useEffect(() => {
        // Filter users based on search query
        if (searchQuery.trim() === '') {
            setFilteredUsers(users)
        } else {
            const query = searchQuery.toLowerCase()
            setFilteredUsers(
                users.filter(user =>
                    user.email?.toLowerCase().includes(query) ||
                    user.full_name?.toLowerCase().includes(query)
                )
            )
        }
    }, [searchQuery, users])

    async function fetchRoles() {
        const { data } = await supabase
            .from('roles')
            .select('*')
            .order('name')
        setRoles(data || [])
    }

    async function fetchUsers() {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*, roles(name)')
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
            setFilteredUsers(data || [])
        } catch (err) {
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    const updateRole = async (userId, newRoleId) => {
        setUpdating(userId)
        setMessage(null)

        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ role_id: newRoleId })
                .eq('id', userId)

            if (error) throw error

            const roleName = roles.find(r => r.id === newRoleId)?.name || 'unknown'
            setMessage({ type: 'success', text: `Role updated to ${roleName}` })
            fetchUsers()
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setUpdating(null)
        }
    }

    if (loading) return <div className={styles.loading}>Loading users...</div>

    return (
        <div>
            <h1 className={styles.title}>Manage Users</h1>

            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.searchContainer}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
                {searchQuery && (
                    <span className={styles.resultCount}>
                        {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className={styles.empty}>
                                    {searchQuery ? 'No users match your search' : 'No users found'}
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className={styles.userName}>{user.full_name || 'N/A'}</div>
                                    </td>
                                    <td className={styles.emailCell}>{user.email || 'N/A'}</td>
                                    <td>
                                        <span className={`${styles.role} ${styles['role_' + user.roles?.name]}`}>
                                            {user.roles?.name || 'user'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={user.role_id || ''}
                                            onChange={(e) => updateRole(user.id, e.target.value)}
                                            disabled={updating === user.id}
                                            className={styles.roleSelect}
                                        >
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        {updating === user.id && <span className={styles.updating}>...</span>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className={styles.rolesInfo}>
                <h3>Role Permissions</h3>
                <ul>
                    <li><strong>Admin:</strong> Full access to admin dashboard, can manage users & shipments</li>
                    <li><strong>Employee:</strong> Access to shipment management, can update shipment status</li>
                    <li><strong>User:</strong> Standard user, can book and track their own shipments</li>
                </ul>
            </div>
        </div>
    )
}
