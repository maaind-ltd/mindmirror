import React from 'react';
import styled from 'styled-components/native';
import {useStackNavigation} from '../../store/combinedStore';
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
        title="Science and Technology"
        onPress={() =>
          navigator.push(Screens.ExplanationScreen, {
            subScreen: 'ScienceAndTechnology',
          })
        }
      />
      {/* <ItemListEntry
        hasChivron={true}
        color={Colors.Primary}
        title="Data Sensitivity"
      /> */}
    </ArticleList>
  );
};

const ArticleList = styled.View`
  flex-grow: 1;
`;

export default ProfileScreen;
