import React,{useState} from 'react';
import { StyleSheet, Text,SafeAreaView,TextInput,TouchableOpacity } from 'react-native';

import firebase from '../../services/FirebaseConnection';

export default function Login({changeStatus}) {
    
    const[type,setType] = useState('login');
    const[email,SetEmail] = useState('');
    const[password,SetPassword] = useState('');

    function handleLogin(){
     
        if(type === 'login'){
            // Fazer login
            const user =  firebase.auth().signInWithEmailAndPassword(email,password)
            .then( (user) => {
              changeStatus(user.user.uid)
            })
            .catch((err)=>{
                alert(err)
                return;
            })
        }else{
            // cadastro usuario
            const user = firebase.auth().createUserWithEmailAndPassword(email,password)
            .then((user)=> {
              changeStatus(user.user.uid)
            })
            .catch((err)=>{
                alert('Ops.. Algo Deu Errado')
                return;
            })
        }
    }


  return (
    <SafeAreaView style={styles.container}>
    
    <TextInput
    placeholder='Seu email'
    style={styles.input}
    value={email}
    onChangeText={ (text)=> SetEmail(text)}
    />

    <TextInput
    placeholder='*************'
    style={styles.input}
    value={password}
    onChangeText={ (text)=> SetPassword(text)}
    secureTextEntry={true}
    />

    <TouchableOpacity
    style={[styles.handleLogin,{backgroundColor: type === 'login' ? '#3ea6f2': "#141414" }]}
    onPress={handleLogin}
    >
        <Text style={{fontWeight:'bold',color:'#FFF',fontSize:17}}>{ type === 'login' ? 'Acessar' : 'Cadastrar'}</Text>
    </TouchableOpacity>

    <TouchableOpacity
    onPress={ ()=> setType(type => type === 'login' ? 'cadastrar': 'login') }
    >
        <Text style={{textAlign: 'center'}}>
          {type === 'login' ? 'Criar uma conta' : 'Ja possuo uma conta'}
        </Text>
    </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:10,
    backgroundColor: "#F2f6fc",
    justifyContent: 'center'
  },
  input:{
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius:4,
    height:45,
    padding:10,
    borderWidth:1,
    borderColor:'#141414'         

  },
  handleLogin:{
    alignItems: 'center',
    justifyContent:'center',
    height:45,
    marginBottom:10
  }
});
