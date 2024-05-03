import { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeleteIcon from './components/delete-icon';

const saveTodoItems = async (items) => {
  await AsyncStorage.setItem("stored-todo-items", JSON.stringify(items))
}

export default function App() {
  const [todoItems, setTodoItems] = useState([])
  const [todoTitle, setTodoTitle] = useState("")

  const getTodoItems = async () => {
    const stored = await AsyncStorage.getItem("stored-todo-items")
    if (stored) {
      setTodoItems(JSON.parse(stored))
      return
    }

    setTodoItems([])
  }

  useEffect(() => {
    getTodoItems()
  }, [])

  const addNewTask = () => {
    if (todoTitle.trim() === "") {
      Alert.alert("Task title is required!", "Please enter task title, and try again..")
      return
    }

    setTodoItems(prev => [
      ...prev,
      {
        id: Date.now(),
        title: todoTitle.trim(),
      }
    ])

    setTodoTitle("")
  }

  const deleteItem = (id) => {
    setTodoItems(prev => prev.filter(item => item.id !== id))
  }

  useEffect(() => {
    saveTodoItems(todoItems)
  }, [todoItems])

  return (
    <>
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView>
          <TextInput
            style={styles.addInput}
            placeholder="Enter your task here"
            value={todoTitle}
            onChangeText={setTodoTitle}
          />
          <Pressable
            style={styles.addButton}
            onPress={addNewTask}
          >
            <Text style={styles.addButtonText}>Add New Task</Text>
          </Pressable>
          <View style={styles.tasksContainer}>
            {todoItems.length === 0 ? (
              <View style={styles.taskWrapper}>
                <Text style={{ flex: 1 }}>No tasks here, try to add some!</Text>
              </View>
            ) : null}
            {todoItems.map(item => (
              <View key={item.id} style={styles.taskWrapper}>
                <Text style={{ flex: 1 }}>{item.title}</Text>
                <Pressable
                  onPress={() => deleteItem(item.id)}
                >
                  <DeleteIcon
                    width="24px"
                    height="24px"
                    stroke="#000009"
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar barStyle="light" backgroundColor='#000009' />
    </>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#eff2fb",
    paddingTop: 48,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
  },
  addInput: {
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    fontSize: 16,
    backgroundColor: "#fbfbfb",
    borderColor: "#28282828",
    borderWidth: 1,
    borderStyle: "solid",
    marginBottom: 12,
  },
  addButton: {
    padding: 12,
    backgroundColor: "#000009",
    fontSize: 16,
  },
  addButtonText: {
    color: "#DEFFF2",
    textAlign: "center",
  },
  tasksContainer: {
    flexDirection: "column-reverse",
    marginTop: 24,
    gap: 12,
  },
  taskWrapper: {
    padding: 12,
    color: "#000009",
    borderColor: "#28282828",
    borderWidth: 1,
    borderStyle: "solid",
    fontSize: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
});