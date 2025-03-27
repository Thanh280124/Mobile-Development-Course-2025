import { View, Text, Button,StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc} from 'firebase/firestore'
import { FIRESTORE_DB } from '../../firebaseConfig'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
export interface Todo{
    title: string,
    done: boolean,
    id:string
}
const List = ({navigation}:any) => {
    const [todos,setTodos] =useState<any[]>([]); 
    const [todo,setTodo] =useState('')
    
    useEffect(() =>{
    const todoRef = collection(FIRESTORE_DB,'todos');
    const subscriber = onSnapshot(todoRef,{
        next:(snapshot) =>{
            const todos: Todo[] = []
            snapshot.docs.forEach(doc =>{
                todos.push({
                    id:doc.id,
                    ...doc.data()
                } as Todo)
            })
            setTodos(todos)
        } 
    })
    return () => subscriber()
    },[])
    
    const addTodo = async () =>{
        const doc = await addDoc(collection(FIRESTORE_DB,'todos'),{title:todo,done:false})
        setTodo('')
    }

    const renderTodo =({item} : any) =>{
      const ref = doc(FIRESTORE_DB,`todos/${item.id}`)
      
      const toggleDone = async () => {
          updateDoc(ref, {done: !item.done})
      };
      const deleteItem = async () => {
          deleteDoc(ref)
      };


        return(
            <View style={styles.todoContainer}>
              <TouchableOpacity onPress={toggleDone} style={styles.todo}>
                {item.done && <AntDesign name="checkcircleo" size={24} color="green" />}
                {!item.done && <Entypo name="circle" size={28} color="black" />}
                <Text style ={styles.todoText}>{item.title}</Text>
              </TouchableOpacity>
              <Feather name="trash-2" size={24} color="red" onPress={deleteItem}/>
            </View>
        )
    }
  return (
    <View style ={styles.container}>
      <View style ={styles.form}>
        <TextInput style={styles.input} placeholder='Add new todo'
        onChangeText ={(text:string) => setTodo(text)}
        value={todo}/>
        <Button onPress={addTodo} title='Add Todo' 
        disabled= {todo === ''}/>
      </View>
      {todos.length > 0 && (
        <View>
        <FlatList data={todos}
        renderItem={renderTodo}
        keyExtractor={(todo: Todo) => todo.id}/>
      </View>
      )}
      
    </View>
  )
}

export default List

const styles = StyleSheet.create({
  container: {
    marginHorizontal:20,
  },
  form:{
    flexDirection:'row',
    marginVertical:20,
    alignItems:'center',
  },
  input:{
flex:1,
height:40,
borderWidth:1,
borderRadius:4,
padding:10,
backgroundColor:'#fff',
marginRight: 10 
  },
  todoContainer:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 4,
  },
  todoText:{
    flex: 1,
    paddingHorizontal: 4,
  },
  todo:{
    flex:1,
 flexDirection: 'row',
 alignItems:'center'
  }
});