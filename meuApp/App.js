import { View, Text } from 'react-native'; 
export default function App() { 
    return ( 
        <View style={styles.container}>
            <Text style={styles.titulo}>Meu App</Text>
            <Text style={styles.subtitulo}>Aprendendo React Native</Text>
        </View> 
    ); 
}

const styles = StyleSheet.create({
    container: { 
        flex:1, justifyContent:'center', alignItems:'center',
        backgroundColor:'#eee' },
        titulo: { fontSize:24, fontWeight:'bold' },
        subtitulo: { fontSize:18, color:'#555' }
    });