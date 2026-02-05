import  { useEffect, useState } from "react";
import { getAllUsers , deleteUser } from "../utils/user.api";

export default function Users() {

    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        loadUsers() ; 
    }, []);

    const loadUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (error) { 
            setError("Erreur lors du chargement des utilisateurs"); 
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        await deleteUser(id);
        loadUsers();
     };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

   return (
    <div>
        <h2>Utilisateurs</h2>

        <table>
        <thead>
            <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Action</th>
            </tr>
        </thead>

        <tbody>
            {users.map((u) => (
            <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                <button onClick={() => handleDelete(u.id)}>
                    Supprimer
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    );



    
    
}
