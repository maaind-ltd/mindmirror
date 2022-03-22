import Cat from '../images/avatar_cat.svg';
import Male from '../images/avatar_male.svg';
import Female from '../images/avatar_female.svg';
import FlowFemale from '../images/flow_female.svg';
import MellowFemale from '../images/mellow_female.svg';
import GoGoGoFemale from '../images/gogogo_female.svg';
import FlowMale from '../images/flow_male.svg';
import MellowMale from '../images/mellow_male.svg';
import GoGoGoMale from '../images/gogogo_male.svg';
import FlowCat from '../images/flow_cat.svg';
import MellowCat from '../images/mellow_cat.svg';
import GoGoGoCat from '../images/gogogo_cat.svg';

export const enum AvatarType {
  Female,
  Male,
  Cat,
}

const AvatarImages = {
  Female: Female,
  FlowFemale: FlowFemale,
  MellowFemale: MellowFemale,
  GoGoGoFemale: GoGoGoFemale,

  Male: Male,
  FlowMale: FlowMale,
  MellowMale: MellowMale,
  GoGoGoMale: GoGoGoMale,

  Cat: Cat,
  FlowCat: FlowCat,
  MellowCat: MellowCat,
  GoGoGoCat: GoGoGoCat,
};

export default AvatarImages;
