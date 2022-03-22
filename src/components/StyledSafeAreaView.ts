import styled from 'styled-components/native';
import Colors from '../constants/colors';

const StyledSafeAreaView = styled.SafeAreaView`
  background-color: ${Colors.Background};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export default StyledSafeAreaView;