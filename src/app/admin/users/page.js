'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

const ROLES = {
    admin: '07c9fe4c-7b70-4c4a-9d1f-7de4878c9103',
    user: 'a15de6fc-8654-4b57-9124-58553473fdf4',
    employee: null // Will be set dynamically
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)
    const [message, setMessage] = useState(null)
    const supabase = createClient()

    useEffect(() => {
        fetchRoles()
        fetchUsers()
    }, [])

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

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Current Role</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="3" className={styles.empty}>No users found</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className={styles.userName}>{user.full_name || 'N/A'}</div>
                                    </td>
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
