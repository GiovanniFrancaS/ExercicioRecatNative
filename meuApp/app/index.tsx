import { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [texto, setTexto] = useState('');

  const API = 'https://didactic-space-acorn-x5qx5qw94r6qcp577-3000.app.github.dev/tarefas';

  // LISTAR
  async function carregar() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTarefas(data);
    } catch (error) {
      console.log('Erro ao carregar:', error);
    }
  }

  // ADICIONAR
  async function adicionar() {
    if (!texto) return;

    try {
      await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: texto
        })
      });

      setTexto('');
      carregar();
    } catch (error) {
      console.log('Erro ao adicionar:', error);
    }
  }

  // DELETAR
  async function deletar(id) {
    try {
      await fetch(`${API}/${id}`, {
        method: 'DELETE'
      });

      carregar();
    } catch (error) {
      console.log('Erro ao deletar:', error);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder="Digite tarefa"
        style={styles.input}
      />

      <Button title="Adicionar" onPress={adicionar} />

      <FlatList
        data={tarefas}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.titulo}</Text>
            <Button
              title="Deletar"
              onPress={() => deletar(item._id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 20
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10
  },
  item: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd'
  }
});