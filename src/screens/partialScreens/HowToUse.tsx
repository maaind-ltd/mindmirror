import React, {useEffect, useState} from 'react';
import {StatusBar, Text, Pressable} from 'react-native';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {useStackNavigation} from '../../reducers/combinedReducer';
import ItemListEntry from '../../components/ItemListEntry';
import Colors from '../../constants/colors';
import {useCombinedStore} from '../../store/combinedStore';
import Avatar from '../../components/Avatar';
import MoodButtonList from '../../components/MoodButtonList';
import ColorExplanation from './ColorExplanation';
import AvatarExplanation from './AvatarExplanation';

const HowToUse: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const navigator = useStackNavigation();

  const {currentMood, targetMood} = useCombinedStore(store => store.mood);

  return (
    <ArticleContent>
      <ColorExplanation />
      <AvatarExplanation />
    </ArticleContent>
  );
};

const ArticleContent = styled.View`
  flex-grow: 1;
`;

export default HowToUse;
