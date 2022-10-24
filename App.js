import React,{useState,useEffect,useRef} from 'react';
import { StyleSheet, TextInput, View,SafeAreaView,TouchableOpacity,Text,FlatList,Keyboard } from 'react-native';
import firebase from './src/services/FirebaseConnection';
import { Feather } from '@expo/vector-icons';


import Login from './src/components/Login';
import TaskList from './src/components/TaskList'


export default function App() {

  const [tasks, setTasks]=useState([])
  const inputRef = useRef(null);
  const [user, SetUser] = useState(null);
  const [newTask, setNewTesk]= useState('');
  const [key,SetKey] = useState('')


  useEffect(()=> {

    function getUser(){

      if(!user){
        return;
      }

      firebase.database().ref('Tarefas').child(user).once('value', (snapshot)=> {
        setTasks([]);

        snapshot?.forEach((childItem)=>{
          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }

          setTasks(oldTasks => [...oldTasks, data])
        })      

      })

    }


    getUser();

  }, [user])

  function handleAdd(){
    if(newTask === ''){
      return;
    }

    if( key !== ''){
      firebase.database().ref('Tarefas').child(user).child(key).update({
        nome : newTask
      })
      .then( ()=> {
        
        const tasksIndex = tasks.findIndex( item => item.key === key )
        const taskClone = tasks;
        taskClone[tasksIndex].nome = newTask
        
        setTasks([...taskClone])

      } )
      Keyboard.dismiss();
      setNewTesk('');
      SetKey('');
      return;
    }
    
    let tarefas = firebase.database().ref('Tarefas').child(user);
    let chave = tarefas.push().key;
    tarefas.child(chave).set({
      nome: newTask
    })
    .then(()=>{
      const data ={
        key:chave,
        nome:newTask
      }
      setTasks(oldTasks => [...oldTasks,data]) 
    })
    Keyboard.dismiss()
    setNewTesk('');
  }


  function handleDelete(key){
    firebase.database().ref('Tarefas').child(user).child(key).remove()
    .then( ()=> {
      const findTasks = tasks.filter( item => item.key !== key )
      setTasks(findTasks)
    } )
  }

  function handleEdite(data){
    SetKey(data.key)
    setNewTesk(data.nome)
    inputRef.current.focus();
  }
  function canselEdite(){
    SetKey('');
    setNewTesk('');
    Keyboard.dismiss();
  }

  
  if(!user){
    return <Login changeStatus={(user) => SetUser(user)}/>             
  }

  return (
    <SafeAreaView style={styles.container}>

        { key.length > 0 && (
          <View style={{flexDirection:'row',marginBottom:10}}>
          <TouchableOpacity onPress={canselEdite}>
            <Feather name='x-circle' size={20} color='#FF0000' />
          </TouchableOpacity>
          <Text style={{marginLeft:5,color:'#FF0000'}}>Você esta editando uma tarefa</Text>
        </View>
        )}

      <View style={styles.containerTask}>

        <TextInput
        placeholder='Demandas de hoje!'
        style={styles.input}
        value={newTask}
        onChangeText={(text)=> setNewTesk(text)}
        ref={inputRef}
        />
        <TouchableOpacity style={styles.btnTasks} onPress={handleAdd}>
          <Text style={styles.textBtn}>+</Text>
        </TouchableOpacity>
      </View>

        <FlatList
        data={tasks}
        keyExtractor={ item => item.key}
        renderItem={ ({item})=> (
          <TaskList data={item} deleteItem={handleDelete} editeItem={handleEdite} />
        ) }
        />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:50,
    paddingHorizontal:10,
    backgroundColor: "#F2f6fc"
  },
  containerTask:{
    flexDirection:'row'
  },
  input:{
    flex:1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius:4,
    borderWidth: 1,
    borderColor: '#141414',
    height: 45
  },
  btnTasks:{
    backgroundColor: '#141414',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingHorizontal: 14,
    borderRadius:4 
  },
  textBtn:{
    color: '#fff',
    fontSize: 22
  }

});
