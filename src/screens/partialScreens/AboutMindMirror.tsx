import React, {useEffect, useState} from 'react';
import {StatusBar, Text, Pressable} from 'react-native';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {useStackNavigation} from '../../reducers/combinedReducer';
import ItemListEntry from '../../components/ItemListEntry';
import Colors from '../../constants/colors';
import Screens from '../../constants/screens';

const ProfileScreen: () => JSX.Element = () => {
  const navigator = useStackNavigation();

  return (
    <ArticleList>
      <ItemListEntry
        hasChivron={true}
        color={Colors.Primary}
        title="How to use MindMirror"
        onPress={() =>
          navigator.push(Screens.ExplanationScreen, {subScreen: 'HowToUse'})
        }
      />
      <ItemListEntry
        hasChivron={true}
        color={Colors.Primary}
        title="Science and Technlogy"
      />
      <ItemListEntry
        hasChivron={true}
        color={Colors.Primary}
        title="Data Sensitivity"
      />
    </ArticleList>
  );
};

const ArticleList = styled.View`
  flex-grow: 1;
`;

export default ProfileScreen;
