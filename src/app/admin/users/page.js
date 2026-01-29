'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

const ADMIN_ROLE_ID = '07c9fe4c-7b70-4c4a-9d1f-7de4878c9103'
const USER_ROLE_ID = 'a15de6fc-8654-4b57-9124-58553473fdf4'

export default function AdminUsersPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)
    const [message, setMessage] = useState(null)
    const supabase = createClient()

    useEffect(() => {
        fetchUsers()
    }, [])

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

    const toggleAdminRole = async (user) => {
        const isCurrentlyAdmin = user.role_id === ADMIN_ROLE_ID
        const newRoleId = isCurrentlyAdmin ? USER_ROLE_ID : ADMIN_ROLE_ID

        setUpdating(user.id)
        setMessage(null)

        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ role_id: newRoleId })
                .eq('id', user.id)

            if (error) throw error

            setMessage({
                type: 'success',
                text: `User ${isCurrentlyAdmin ? 'demoted to User' : 'promoted to Admin'}`
            })
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
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="4" className={styles.empty}>No users found</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className={styles.userName}>{user.full_name || 'N/A'}</div>
                                    </td>
                                    <td>
                                        <span className={`${styles.role} ${user.role_id === ADMIN_ROLE_ID ? styles.admin : styles.user}`}>
                                            {user.roles?.name || 'user'}
                                        </span>
                                    </td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className={`${styles.actionBtn} ${user.role_id === ADMIN_ROLE_ID ? styles.demote : styles.promote}`}
                                            onClick={() => toggleAdminRole(user)}
                                            disabled={updating === user.id}
                                        >
                                            {updating === user.id
                                                ? 'Updating...'
                                                : user.role_id === ADMIN_ROLE_ID
                                                    ? 'Remove Admin'
                                                    : 'Make Admin'
                                            }
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
