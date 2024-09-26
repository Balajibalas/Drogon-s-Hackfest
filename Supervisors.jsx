import React,{useState,useEffect,useCallback} from 'react';
import { supabase } from './CreateClient';
import './App.css'

function Supervisors(){
  const [users,setUsers] = useState([]);
  const [user,setUser] = useState({
    supervisor_name:'',
    phone_number:'' ,email:''
  })

  const [user2, setUser2] = useState({
    id: '',
    supervisor_name: '',
    phone_number: '',
    email: ''
  })

  console.log(user)

  useEffect(() => {
    fetchUsers();
  }, [])

  async function fetchUsers() {
    const {data} = await supabase.from('All_supervisor').select('*').order('id', { ascending: true })
    setUsers(data);
    //console.log(data);
  }

  function handleChange(event){
    setUser(prevFormData=>{
      return{
        ...prevFormData,
        [event.target.name]:event.target.value 
      }
    })
  }
  function handleChange2(event){
    setUser2(prevFormData=>{
      return{
        ...prevFormData,
        [event.target.name]:event.target.value 
      }
    })
  }

  async function createUser(event) {
    event.preventDefault();
    try {
      await supabase.from('All_supervisor').insert({ supervisor_name: user.supervisor_name, phone_number: user.phone_number, email: user.email });
      fetchUsers();
    } catch (error) {
      console.error(error);
      // Handle the error properly, e.g., display an error message to the user
    }
  }

  async function deleteUser(userId) {
    await supabase.from('All_supervisor').delete().eq('id', userId)

    fetchUsers()
  }
  function shiftAllotment(){
    let shift = ["Shift A","Shift B","Shift C"];
    let i =0;
    users.map((user)=>{


      async function allocate(){
      await supabase.from('All_workers')
      .update({sf:shift[i%3]}).eq('id',user.id)
      }
      allocate()
      i++;
    })
    fetchUsers()
  }
  function displayUser(userId) {
    users.map((user) => {
      if (user.id === userId) {
        setUser2({ id: user.id, supervisor_name: user.supervisor_name, phone_number: user.phone_number, email: user.email });
      }
    });
  }

  const updateUser = useCallback(async (userId) => {
    const { data, error } = await supabase.from('All_supervisor')
      .update({ supervisor_name: user2.supervisor_name, phone_number: user2.phone_number, email: user2.email })
      .eq('id', userId);

    fetchUsers();

    if (data) {
      console.log(data);
    }
    if (error) {
      console.log(error);
    }
  }, [user2, supabase, fetchUsers]);

  return (
    <div>
      <header>
      <h2>Supervisors Management</h2>
      </header>
      <h5>Add New Supervisor</h5>
      <form onSubmit={createUser}>
        
        <input
        type='text'
        placeholder='supervisor name'
        name='supervisor_name'
        onChange={handleChange}
        />
        <input
        type='number'
        placeholder='Phone Number'
        name='phone_number'
        onChange={handleChange}
        />
        <input
        type='email'
        placeholder='Email'
        name='email'
        onChange={handleChange}
        />
        <button type='submit' className="btn btn-success add">Create</button>

      </form>
      <h5>Update an existing supervisor</h5>
      <form onSubmit={(e) => {
        e.preventDefault();
        updateUser(user2.id);
      }}>

        <input
        type='text'
        defaultValue={user2.supervisor_name}
        name='supervisor_name'
        onChange={handleChange2}
        />
        <input
        type='text'
        defaultValue={user2.phone_number}
        name='phone_number'
        onChange={handleChange2}
        />
        <input
        type='text'
        defaultValue={user2.email}
        name='email'
        onChange={handleChange2}
        />
        <button type="submit" className="btn btn-primary">Save</button>

      </form>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Supervisor_Name</th>
            <th>Phone No</th>
            <th>Email Id</th>
            
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {
            users.map((user)=>

          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.supervisor_name}</td>
            <td>{user.phone_number}</td>
            <td>{user.email}</td>
              <td>
              <button type="button" className="btn btn-primary mv" onClick={() => {
                setUser2({ id: '', supervisor_name: '', phone_number: '', email: '' }); // Reset user2 state
                displayUser(user.id);
              }}>Edit</button>
              <button type ="button" className="btn btn-danger mv" onClick={()=>{deleteUser(user.id)}}>Delete</button>
              </td>
              
          </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Supervisors