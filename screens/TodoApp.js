import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput } from 'react-native-paper';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { addTodo, deleteTodo, editTodo } from '../redux/actions';
import Spacer from '../components/Spacer';
import ButtonIcon from '../components/ButtonIcon';
import Constants from 'expo-constants';
import { getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore'; // Import Firestore functions
import firebaseApp from '../firebaseConfig'; 


const db = getFirestore(firebaseApp);

const TodoApp = ({ addTodo, deleteTodo, editTodo }) => {
  const [task, setTask] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const updatedTodoList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodoList(updatedTodoList);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTodo = async () => {
    try {
      await addDoc(collection(db, 'tasks'), {
        task: task,
        status: 'due'
      });
      setTask('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleEditStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', id), {
        status: newStatus
      });
  
      editTodo(id, { status: newStatus });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Text style={styles.paragraph}>Lab 2 - Oleg Baryshev</Text>
      </Card>
      <Spacer />
      <Card style={styles.inputCard}>
        <Card.Content>
          <Title>You can add a new task here:</Title>
          <TextInput
            mode="outlined"
            label="Input the task..."
            value={task}
            onChangeText={setTask}
            error={titleError}
          />
          <Spacer/>
          <Button mode="contained" onPress={handleAddTodo} disabled={task.trim() === ''}>
            Add Task
          </Button>
        </Card.Content>
      </Card>
      <Spacer />
      <FlatList
        data={todoList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <Card style={[styles.taskCard, getStatusStyle(item.status)]}>
              <Card.Title
                title={`Task#${index + 1}`}
                left={(props) => <Icon name="tasks" size={24} color="black" />}
                right={(props) => (
                  <ButtonIcon
                    iconName="close"
                    color="red"
                    onPress={() => handleDeleteTodo(item.id)}
                  />
                )}
              />
              <Card.Content>
                <Paragraph>{item.task}</Paragraph>
                <Paragraph>Status: {item.status}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => handleEditStatus(item.id, 'done')}>Done  /</Button>
                <Button onPress={() => handleEditStatus(item.id, 'late')}>Late</Button>
              </Card.Actions>
            </Card>
          );
        }}
      />
      <Spacer />
    </View>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'due':
      return { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ccc' };
    case 'done':
      return { backgroundColor: '#e6ffe6', borderWidth: 1, borderColor: '#99cc99' };
    case 'late':
      return { backgroundColor: '#ffe6e6', borderWidth: 1, borderColor: '#ff9999' };
    default:
      return { borderWidth: 1, borderColor: '#ddd' };
  }
};

const mapStateToProps = (state) => {
  return {
    todo_list: state.todos.todo_list,
  };
};

const mapDispatchToProps = {
  addTodo,
  deleteTodo,
  editTodo,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  headerCard: {
    marginBottom: 10,
  },
  inputCard: {
    marginBottom: 10,
  },
  taskCard: {
    marginBottom: 5,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
