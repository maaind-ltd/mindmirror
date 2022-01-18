import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export function useStackNavigation() {
	return useNavigation() as StackNavigationProp<any>;
}
