import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen = ({ route }) => {
  const { characterId } = route.params;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        const response = await axios.get(`https://api.attackontitanapi.com/characters/${characterId}`);
        setCharacter(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do personagem:', error);
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do personagem.');
      } finally {
        setLoading(false);
      }
    };
    fetchCharacterDetails();
  }, [characterId]);

  const addToFavorites = async () => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favorites') || '[]';
      const favorites = JSON.parse(existingFavorites);

      const alreadyFavorited = favorites.some(fav => fav.id === character.id);
      if (alreadyFavorited) {
        Alert.alert('Aviso', 'Personagem já está nos favoritos!');
        return;
      }

      favorites.push(character);
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      Alert.alert('Sucesso', 'Personagem adicionado aos favoritos!');
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      Alert.alert('Erro', 'Não foi possível adicionar aos favoritos.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.loadingContainer}>
        <Paragraph>Nenhum dado do personagem disponível.</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Cover source={{ uri: character.img }} />
        <Card.Content>
          <Title>{character.name}</Title>
          <Paragraph>Idade: {character.age || 'Desconhecida'}</Paragraph>
          <Paragraph>Gênero: {character.gender || 'Desconhecido'}</Paragraph>
          <Paragraph>Espécie: {character.species && character.species.length > 0 ? character.species.join(', ') : 'Desconhecida'}</Paragraph>
          <Paragraph>Ocupação: {character.occupation || 'Desconhecida'}</Paragraph>
          <Paragraph>Status: {character.status || 'Desconhecido'}</Paragraph>
          <Paragraph>Local de nascimento: {character.birthplace || 'Desconhecido'}</Paragraph>
          <Paragraph>Residência: {character.residence || 'Desconhecida'}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={addToFavorites}>
            Adicionar aos Favoritos
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DetailsScreen;
