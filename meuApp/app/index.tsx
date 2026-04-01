import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';

type Tarefa = {
  _id: string;
  titulo: string;
  concluida: boolean;
};

export default function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const API = 'https://didactic-space-acorn-x5qx5qw94r6qcp577-3000.app.github.dev/tarefas';

  async function carregar() {
    try {
      setLoading(true);

      const res = await fetch(API);
      const data = await res.json();

      const ordenado = data.sort((a: Tarefa, b: Tarefa) =>
        a.concluida - b.concluida
      );

      setTarefas(ordenado);
    } catch (error) {
      Alert.alert('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  }

  async function adicionarOuEditar() {
    if (!texto) return;

    try {
      setLoading(true);

      if (editandoId) {
        await fetch(`${API}/${editandoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            titulo: texto
          })
        });

        setEditandoId(null);
      } else {
        await fetch(API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            titulo: texto
          })
        });
      }

      setTexto('');
      carregar();
    } catch {
      Alert.alert('Erro ao salvar tarefa');
    } finally {
      setLoading(false);
    }
  }

  async function deletar(id: string) {
    try {
      await fetch(`${API}/${id}`, {
        method: 'DELETE'
      });

      carregar();
    } catch {
      Alert.alert('Erro ao deletar');
    }
  }

  async function concluir(item: Tarefa) {
    try {
      await fetch(`${API}/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          concluida: !item.concluida
        })
      });

      carregar();
    } catch {
      Alert.alert('Erro ao atualizar');
    }
  }

  function editar(item: Tarefa) {
    setTexto(item.titulo);
    setEditandoId(item._id);
  }

  function detalhes(item: Tarefa) {
    Alert.alert(
      'Detalhes da tarefa',
      `Título: ${item.titulo}\nConcluída: ${item.concluida ? 'Sim' : 'Não'}`
    );
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

      <Button
        title={editandoId ? 'Salvar edição' : 'Adicionar'}
        onPress={adicionarOuEditar}
      />

      {loading && <ActivityIndicator size="large" />}

      <FlatList
        data={tarefas}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity onPress={() => detalhes(item)}>
              <Text
                style={{
                  textDecorationLine: item.concluida ? 'line-through' : 'none'
                }}
              >
                {item.titulo}
              </Text>
            </TouchableOpacity>

            <Button title="✔" onPress={() => concluir(item)} />
            <Button title="Editar" onPress={() => editar(item)} />
            <Button title="Deletar" onPress={() => deletar(item._id)} />
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